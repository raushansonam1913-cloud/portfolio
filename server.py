"""
=============================================================================
RAUSHAN KUMAR PORTFOLIO — LOCAL AUTO-SYNC BACKEND SERVER & CODE VAULT ENGINE
=============================================================================
Zero-dependency Python server that serves the portfolio and automatically
writes all changes from the Admin Panel directly to the code files on disk:
  - data/portfolio-data.json
  - data/portfolio-data.js (Executable Code)
  - data/technologies.json
  - images/profile-*.jpg (Decodes and updates uploaded photos directly to disk)

Usage:
  python server.py
  (Runs on http://127.0.0.1:5000)
=============================================================================
"""

import http.server
import socketserver
import json
import os
import sys
import base64
import re
import time

# Ensure Windows terminal doesn't crash on utf-8 characters
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

PORT = 5000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
PORTFOLIO_JSON = os.path.join(DATA_DIR, "portfolio-data.json")
PORTFOLIO_JS = os.path.join(DATA_DIR, "portfolio-data.js")
TECH_JSON = os.path.join(DATA_DIR, "technologies.json")
CODE_STORE_JSON = os.path.join(DATA_DIR, "code-store.json")
IMAGES_DIR = os.path.join(BASE_DIR, "images")
PROJECTS_IMG_DIR = os.path.join(IMAGES_DIR, "projects")
CERTS_IMG_DIR = os.path.join(BASE_DIR, "certificates")

def save_base64_file(data_url, target_path):
    """Decodes data:...;base64,... and writes binary image/PDF to disk."""
    try:
        match = re.match(r"^data:(?:image/[a-zA-Z0-9\+\-]+|application/pdf);base64,(.+)$", data_url)
        if not match:
            return False
        b64_data = match.group(1)
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        file_bytes = base64.b64decode(b64_data)
        with open(target_path, "wb") as f:
            f.write(file_bytes)
        return True
    except Exception as e:
        print(f"[File Save Error] {e}", file=sys.stderr)
        return False

# Backward-compatibility alias
save_base64_image = save_base64_file

def process_photos_and_assets(payload):
    """Processes base64 photos and assets, writes them to disk and updates paths in payload."""
    ts = int(time.time())
    updated_photos_count = 0

    # 1. Profile Photos
    site_config = payload.get("siteConfig", {})
    photos = site_config.get("photos", [])
    if isinstance(photos, list):
        os.makedirs(IMAGES_DIR, exist_ok=True)
        for idx, photo_val in enumerate(photos):
            if isinstance(photo_val, str) and photo_val.startswith("data:image/"):
                filename = f"profile-{idx+1}.jpg"
                filepath = os.path.join(IMAGES_DIR, filename)
                if save_base64_file(photo_val, filepath):
                    photos[idx] = f"images/{filename}?v={ts}"
                    updated_photos_count += 1
                    print(f"[Auto-Sync] Saved uploaded Photo {idx+1} to {filepath}")

    # 1b. Admin Login Avatar
    admin_avatar = site_config.get("adminAvatar", "")
    if isinstance(admin_avatar, str) and admin_avatar.startswith("data:image/"):
        filename = "admin-avatar.jpg"
        filepath = os.path.join(IMAGES_DIR, filename)
        if save_base64_file(admin_avatar, filepath):
            site_config["adminAvatar"] = f"images/{filename}?v={ts}"
            updated_photos_count += 1
            print(f"[Auto-Sync] Saved uploaded Admin Avatar to {filepath}")

    # 2. Project Images
    projects = payload.get("projects", [])
    if isinstance(projects, list):
        os.makedirs(PROJECTS_IMG_DIR, exist_ok=True)
        for proj in projects:
            img_val = proj.get("image", "")
            if isinstance(img_val, str) and (img_val.startswith("data:image/") or img_val.startswith("data:application/pdf")):
                p_id = re.sub(r'[^a-zA-Z0-9_-]', '_', proj.get("id", f"proj_{ts}"))
                ext = ".pdf" if img_val.startswith("data:application/pdf") else ".jpg"
                filename = f"{p_id}{ext}"
                filepath = os.path.join(PROJECTS_IMG_DIR, filename)
                if save_base64_file(img_val, filepath):
                    proj["image"] = f"images/projects/{filename}?v={ts}"
                    print(f"[Auto-Sync] Saved uploaded Project Image to {filepath}")

    # 3. Certificate Files (Images & PDFs)
    certs = payload.get("certificates", [])
    if isinstance(certs, list):
        os.makedirs(CERTS_IMG_DIR, exist_ok=True)
        for cert in certs:
            img_val = cert.get("image", "")
            if isinstance(img_val, str) and (img_val.startswith("data:image/") or img_val.startswith("data:application/pdf")):
                c_id = re.sub(r'[^a-zA-Z0-9_-]', '_', cert.get("id", f"cert_{ts}"))
                ext = ".pdf" if img_val.startswith("data:application/pdf") else ".jpg"
                filename = f"{c_id}{ext}"
                filepath = os.path.join(CERTS_IMG_DIR, filename)
                if save_base64_file(img_val, filepath):
                    cert["image"] = f"certificates/{filename}?v={ts}"
                    print(f"[Auto-Sync] Saved uploaded Certificate to {filepath}")

    return updated_photos_count

class AutoSyncHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Full CORS support so browsers on file:/// or http:// can seamlessly auto-save
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/status":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            resp = {
                "status": "online",
                "autoSaveActive": True,
                "server": "Python Auto-Sync Engine",
                "port": PORT,
                "timestamp": time.time()
            }
            self.wfile.write(json.dumps(resp).encode("utf-8"))
            return

        if self.path == "/api/get-data":
            if os.path.exists(PORTFOLIO_JSON):
                with open(PORTFOLIO_JSON, "r", encoding="utf-8") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(content.encode("utf-8"))
                return

        super().do_GET()

    def do_POST(self):
        if self.path == "/api/save-data":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_length).decode("utf-8")
                payload = json.loads(body)

                os.makedirs(DATA_DIR, exist_ok=True)

                # Process photos & images (writes real image files to disk)
                photos_saved = process_photos_and_assets(payload)

                # Ensure timestamp is recorded
                if "vaultMeta" not in payload or not isinstance(payload["vaultMeta"], dict):
                    payload["vaultMeta"] = {}
                payload["vaultMeta"]["lastModified"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

                # 1. Update data/portfolio-data.json
                with open(PORTFOLIO_JSON, "w", encoding="utf-8") as f:
                    json.dump(payload, f, indent=2, ensure_ascii=False)

                # 2. Update data/portfolio-data.js (Executable Code File)
                js_content = f"""/**
 * ==========================================================================
 * RAUSHAN KUMAR — PORTFOLIO MASTER DATA & CODE CONFIGURATION (AUTO-SYNCED)
 * ==========================================================================
 * Automatically updated by Admin Panel on {payload['vaultMeta']['lastModified']}
 * ==========================================================================
 */

window.PORTFOLIO_MASTER_DATA = {json.dumps(payload, indent=2, ensure_ascii=False)};
"""
                with open(PORTFOLIO_JS, "w", encoding="utf-8") as f:
                    f.write(js_content)

                # 3. If technologies dictionary is present, update data/technologies.json
                if "technologies" in payload and isinstance(payload["technologies"], dict):
                    with open(TECH_JSON, "w", encoding="utf-8") as f:
                        json.dump(payload["technologies"], f, indent=2, ensure_ascii=False)

                # 4. If codeStore is present, update data/code-store.json
                if "codeStore" in payload and isinstance(payload["codeStore"], list):
                    with open(CODE_STORE_JSON, "w", encoding="utf-8") as f:
                        json.dump(payload["codeStore"], f, indent=2, ensure_ascii=False)
                    print(f"[Auto-Sync] CODE STORE UPDATED: {CODE_STORE_JSON} ({len(payload['codeStore'])} snippets)")

                # Log info
                auth_info = payload.get("auth", {})
                pw_hint = auth_info.get("adminPassword", "")
                pin_hint = auth_info.get("vaultPin", "")
                print(f"[Auto-Sync] CODE UPDATED ON DISK: {PORTFOLIO_JS}")
                print(f"   Password in code: '{pw_hint}' | Vault PIN: '{pin_hint}'")
                if photos_saved > 0:
                    print(f"   Photos updated: {photos_saved} image(s) written to disk")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                res = {
                    "success": True,
                    "photos": payload.get("siteConfig", {}).get("photos", []),
                    "data": payload,
                    "message": "All code files (portfolio-data.js & portfolio-data.json) updated automatically on disk!"
                }
                self.wfile.write(json.dumps(res).encode("utf-8"))

            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                err_res = {"success": False, "error": str(e)}
                self.wfile.write(json.dumps(err_res).encode("utf-8"))
                print(f"[Auto-Sync] Error saving data: {e}", file=sys.stderr)
            return

        self.send_response(404)
        self.end_headers()

def run():
    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), AutoSyncHandler) as httpd:
        print("============================================================")
        print("RAUSHAN KUMAR PORTFOLIO SERVER RUNNING")
        print(f"Local Website:     http://127.0.0.1:{PORT}/index.html")
        print(f"Admin Panel:       http://127.0.0.1:{PORT}/admin.html")
        print("Auto-Update Mode:  ACTIVE (Writes changes directly to code)")
        print("Password & Photos: Synced directly to data/portfolio-data.js")
        print("============================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")

if __name__ == "__main__":
    run()
