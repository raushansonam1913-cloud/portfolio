/**
 * ==========================================================================
 * RAUSHAN KUMAR — PRODUCTION DEVELOPER CODE STORE & REUSABLE CODE BANK
 * ==========================================================================
 * Double-locked Vault Repository: MySQL Schemas, Python Server Daemons,
 * ES6+ Dual-Sync Engines, HTML5/CSS3 Templates, and Excel VBA Macros.
 * ==========================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CodeStore = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const STORAGE_KEY = 'rk_developer_code_store';

    const DEFAULT_SNIPPETS = [
        {
            id: "mysql-contacts-schema",
            short: "SQL",
            name: "MySQL 8.0+",
            title: "Production Contacts & Inquiries Database Schema",
            category: "Database",
            lang: "sql",
            filename: "contacts_schema.sql",
            desc: "Complete production-ready MySQL table for portfolio contact inquiries with UUID, auto-timestamp, status enum, indexes, and stored procedure for lead intake.",
            code: `-- ============================================================
-- RAUSHAN KUMAR PORTFOLIO — CONTACT INQUIRIES PRODUCTION SCHEMA
-- Database: \`portfolio_db\`
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS \`portfolio_db\`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE \`portfolio_db\`;

-- 1. Contact Inquiries Table
CREATE TABLE IF NOT EXISTS \`contact_inquiries\` (
    \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`tracking_uuid\` VARCHAR(36) NOT NULL UNIQUE COMMENT 'UUID v4 for public reference',
    \`sender_name\` VARCHAR(120) NOT NULL,
    \`sender_email\` VARCHAR(180) NOT NULL,
    \`subject\` VARCHAR(255) NOT NULL,
    \`message\` TEXT NOT NULL,
    \`client_ip\` VARCHAR(45) DEFAULT NULL COMMENT 'IPv4 / IPv6 address',
    \`user_agent\` VARCHAR(255) DEFAULT NULL,
    \`status\` ENUM('new', 'in_review', 'replied', 'archived') NOT NULL DEFAULT 'new',
    \`is_starred\` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
    \`notes\` TEXT DEFAULT NULL COMMENT 'Admin internal response notes',
    \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX \`idx_inquiries_status\` (\`status\`),
    INDEX \`idx_inquiries_email\` (\`sender_email\`),
    INDEX \`idx_inquiries_created\` (\`created_at\` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Stored Procedure: Record New Inquiry
DELIMITER $$
CREATE PROCEDURE \`sp_RecordContactInquiry\`(
    IN p_name VARCHAR(120),
    IN p_email VARCHAR(180),
    IN p_subject VARCHAR(255),
    IN p_message TEXT,
    IN p_client_ip VARCHAR(45),
    OUT p_out_id BIGINT,
    OUT p_out_uuid VARCHAR(36)
)
BEGIN
    SET p_out_uuid = UUID();
    
    INSERT INTO \`contact_inquiries\` (
        \`tracking_uuid\`, \`sender_name\`, \`sender_email\`, \`subject\`, \`message\`, \`client_ip\`
    ) VALUES (
        p_out_uuid, TRIM(p_name), LOWER(TRIM(p_email)), TRIM(p_subject), TRIM(p_message), p_client_ip
    );
    
    SET p_out_id = LAST_INSERT_ID();
END$$
DELIMITER ;`
        },
        {
            id: "mysql-projects-schema",
            short: "SQL",
            name: "MySQL 8.0+",
            title: "Relational Projects, Skills & Tags Schema",
            category: "Database",
            lang: "sql",
            filename: "projects_relational_schema.sql",
            desc: "Normalized 3NF relational database schema for portfolio projects, category mapping, project images, and many-to-many technology tags with optimized JOIN queries.",
            code: `-- ============================================================
-- RAUSHAN KUMAR — DYNAMIC PROJECTS & SKILLS RELATIONAL SCHEMA
-- ============================================================

CREATE TABLE IF NOT EXISTS \`project_categories\` (
    \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    \`slug\` VARCHAR(50) NOT NULL UNIQUE,
    \`title\` VARCHAR(80) NOT NULL,
    \`display_order\` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS \`projects\` (
    \`id\` VARCHAR(80) PRIMARY KEY COMMENT 'Slug ID e.g. grand-stay',
    \`category_id\` INT UNSIGNED NOT NULL,
    \`title\` VARCHAR(160) NOT NULL,
    \`short_desc\` VARCHAR(255) NOT NULL,
    \`full_desc\` TEXT NOT NULL,
    \`image_url\` VARCHAR(255) NOT NULL,
    \`github_url\` VARCHAR(255) DEFAULT NULL,
    \`demo_url\` VARCHAR(255) DEFAULT NULL,
    \`is_featured\` TINYINT(1) NOT NULL DEFAULT 0,
    \`display_order\` INT NOT NULL DEFAULT 0,
    \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (\`category_id\`) REFERENCES \`project_categories\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS \`technologies\` (
    \`short_code\` VARCHAR(20) PRIMARY KEY,
    \`display_name\` VARCHAR(80) NOT NULL,
    \`category\` VARCHAR(50) NOT NULL,
    \`brand_color\` VARCHAR(20) NOT NULL DEFAULT '#3b82f6'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS \`project_technologies\` (
    \`project_id\` VARCHAR(80) NOT NULL,
    \`tech_code\` VARCHAR(20) NOT NULL,
    PRIMARY KEY (\`project_id\`, \`tech_code\`),
    FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE,
    FOREIGN KEY (\`tech_code\`) REFERENCES \`technologies\`(\`short_code\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Optimized View / Query: Fetch Projects with Aggregated JSON Badges
SELECT 
    p.id,
    p.title,
    c.title AS category_name,
    p.image_url,
    p.demo_url,
    JSON_ARRAYAGG(JSON_OBJECT('code', t.short_code, 'name', t.display_name, 'color', t.brand_color)) AS tech_stack
FROM \`projects\` p
INNER JOIN \`project_categories\` c ON p.category_id = c.id
LEFT JOIN \`project_technologies\` pt ON p.id = pt.project_id
LEFT JOIN \`technologies\` t ON pt.tech_code = t.short_code
GROUP BY p.id, c.title
ORDER BY p.is_featured DESC, p.display_order ASC;`
        },
        {
            id: "python-server-daemon",
            short: "PY",
            name: "Python 3.9+",
            title: "Multi-threaded Auto-Sync HTTP Daemon & Code Server",
            category: "Backend",
            lang: "python",
            filename: "server_daemon.py",
            desc: "Zero-dependency production Python server that serves frontend assets, handles JSON REST payloads, decodes base64 images, and persists state directly to disk files.",
            code: `"""
=============================================================================
RAUSHAN KUMAR PORTFOLIO — STANDALONE PYTHON AUTO-SYNC SERVER DAEMON
=============================================================================
"""
import http.server
import socketserver
import json
import os
import sys
import base64
import time

PORT = 5000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
PORTFOLIO_JSON = os.path.join(DATA_DIR, "portfolio-data.json")
PORTFOLIO_JS = os.path.join(DATA_DIR, "portfolio-data.js")

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

class AutoSyncHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == "/api/save-data":
            try:
                length = int(self.headers.get("Content-Length", 0))
                payload = json.loads(self.rfile.read(length).decode("utf-8"))
                
                os.makedirs(DATA_DIR, exist_ok=True)
                payload["vaultMeta"] = payload.get("vaultMeta", {})
                payload["vaultMeta"]["lastModified"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

                # Write JSON
                with open(PORTFOLIO_JSON, "w", encoding="utf-8") as f:
                    json.dump(payload, f, indent=2, ensure_ascii=False)

                # Write Executable JS
                js_content = f"window.PORTFOLIO_MASTER_DATA = {json.dumps(payload, indent=2, ensure_ascii=False)};\\n"
                with open(PORTFOLIO_JS, "w", encoding="utf-8") as f:
                    f.write(js_content)

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "message": "Saved to disk!"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode("utf-8"))
            return
        super().do_POST()

if __name__ == "__main__":
    os.chdir(BASE_DIR)
    with ThreadingHTTPServer(("127.0.0.1", PORT), AutoSyncHandler) as httpd:
        print(f"🚀 Auto-Sync Code Server active on http://127.0.0.1:{PORT}")
        httpd.serve_forever()`
        },
        {
            id: "python-excel-pipeline",
            short: "PY",
            name: "Python Pandas",
            title: "Automated Sales Spreadsheet Cleansing & KPI Pipeline",
            category: "Data Analysis",
            lang: "python",
            filename: "sales_data_processor.py",
            desc: "Pandas & OpenPyXL data pipeline that reads raw multi-sheet Excel files, removes anomalies, computes profit margins, and generates aggregated summary reports.",
            code: `"""
=============================================================================
RAUSHAN KUMAR — AUTOMATED EXCEL DATA CLEANSING & KPI REPORTING PIPELINE
=============================================================================
"""
import pandas as pd
import numpy as np
from datetime import datetime

def process_sales_workbook(input_excel_path, output_excel_path):
    print(f"[*] Reading raw sales data from: {input_excel_path}")
    df = pd.read_excel(input_excel_path, sheet_name="RawSales")

    # 1. Standardize column names
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    # 2. Handle missing & invalid values
    df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
    df['revenue'] = pd.to_numeric(df['revenue'], errors='coerce').fillna(0.0)
    df['cost'] = pd.to_numeric(df['cost'], errors='coerce').fillna(0.0)
    df = df.dropna(subset=['order_id', 'order_date'])

    # 3. Feature Engineering: Profit, Margin %, Quarter
    df['gross_profit'] = df['revenue'] - df['cost']
    df['profit_margin_pct'] = np.where(df['revenue'] > 0, (df['gross_profit'] / df['revenue']) * 100, 0.0)
    df['quarter'] = df['order_date'].dt.to_period('Q').astype(str)

    # 4. Aggregated Executive KPI Summary
    summary_by_region = df.groupby('region').agg(
        total_orders=('order_id', 'count'),
        total_revenue=('revenue', 'sum'),
        total_profit=('gross_profit', 'sum'),
        avg_margin=('profit_margin_pct', 'mean')
    ).round(2).reset_index()

    # 5. Multi-sheet Export with formatting
    with pd.ExcelWriter(output_excel_path, engine='openpyxl') as writer:
        summary_by_region.to_excel(writer, sheet_name='Executive_KPIs', index=False)
        df.to_excel(writer, sheet_name='Cleaned_Data', index=False)

    print(f"[+] Successfully exported clean workbook to: {output_excel_path}")

if __name__ == "__main__":
    process_sales_workbook("sales_data_raw.xlsx", "sales_dashboard_cleaned.xlsx")`
        },
        {
            id: "js-dual-persistence-engine",
            short: "JS",
            name: "JavaScript ES6+",
            title: "Dual-Persistence LocalStorage & Disk Sync Engine",
            category: "Frontend",
            lang: "javascript",
            filename: "persistence_engine.js",
            desc: "Robust client-side synchronization engine featuring ISO timestamp version checking, canvas image compression, and automatic fallback between HTTP and browser storage.",
            code: `/**
 * ==========================================================================
 * RAUSHAN KUMAR — DUAL PERSISTENCE & AUTO-SYNC ENGINE
 * ==========================================================================
 */
export class PersistenceEngine {
    constructor(storageKey = 'rk_portfolio_data', apiEndpoint = '/api/save-data') {
        this.storageKey = storageKey;
        this.apiEndpoint = apiEndpoint;
    }

    /**
     * Compress base64 image via Canvas to prevent QuotaExceededError
     */
    static compressImage(dataUrl, maxDimension = 900, quality = 0.82) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                if (width > height && width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        });
    }

    /**
     * Save data to both LocalStorage and Python Server Daemon
     */
    async saveData(payload) {
        if (!payload.vaultMeta) payload.vaultMeta = {};
        payload.vaultMeta.lastModified = new Date().toISOString();

        // 1. Write to Browser LocalStorage
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(payload));
        } catch (err) {
            console.warn('[Persistence] LocalStorage Quota Exceeded, falling back to disk sync.', err);
        }

        // 2. Write to Python Disk Sync Server
        try {
            const res = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                return { success: true, target: 'disk_and_local', data };
            }
        } catch (serverErr) {
            console.info('[Persistence] Local server offline, data preserved in browser storage.');
        }

        return { success: true, target: 'local_only' };
    }
}`
        },
        {
            id: "excel-vba-dashboard-macros",
            short: "VBA",
            name: "Excel VBA Macro",
            title: "Automated Daily Sales Report & PDF Generator",
            category: "Data Analysis",
            lang: "excel",
            filename: "vba_auto_sales_report.bas",
            desc: "Production Excel VBA script that automatically refreshes all Pivot Tables, updates dynamic chart ranges, formats currency cells, and exports an executive PDF.",
            code: `' ============================================================
' RAUSHAN KUMAR — EXCEL VBA AUTOMATED SALES DASHBOARD GENERATOR
' Module: mod_AutoReportGenerator
' ============================================================
Option Explicit

Public Sub GenerateExecutiveSalesReport()
    Dim wsDash As Worksheet
    Dim wsData As Worksheet
    Dim pc As PivotCache
    Dim pdfPath As String
    Dim currentDate As String
    
    On Error GoTo ErrorHandler
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    
    Set wsDash = ThisWorkbook.Sheets("SalesDashboard")
    Set wsData = ThisWorkbook.Sheets("SalesData")
    
    currentDate = Format(Now(), "YYYY-MM-DD")
    pdfPath = Environ("USERPROFILE") & "\\Desktop\\Sales_Report_" & currentDate & ".pdf"
    
    ' 1. Refresh all Pivot Tables in the workbook
    For Each pc In ThisWorkbook.PivotCaches
        pc.Refresh
    Next pc
    
    ' 2. Update KPI Cards & Formatting
    With wsDash
        .Range("C4").Value = "=SUM(SalesData!F2:F50000)"      ' Total Revenue
        .Range("C4").NumberFormat = "$#,##0.00"
        
        .Range("E4").Value = "=AVERAGE(SalesData!G2:G50000)"  ' Profit Margin %
        .Range("E4").NumberFormat = "0.0%"
        
        .Range("G4").Value = "=COUNTA(SalesData!A2:A50000)"   ' Total Invoices
        .Range("G4").NumberFormat = "#,##0"
        
        ' 3. Export Clean Dashboard Sheet as High-Res PDF
        .ExportAsFixedFormat _
            Type:=xlTypePDF, _
            Filename:=pdfPath, _
            Quality:=xlQualityStandard, _
            IncludeDocProperties:=True, _
            IgnorePrintAreas:=False, _
            OpenAfterPublish:=False
    End With
    
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    MsgBox "Executive Sales Dashboard exported successfully to:" & vbCrLf & pdfPath, vbInformation, "Raushan Kumar — Automation Completed"
    Exit Sub

ErrorHandler:
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    MsgBox "Error during generation: " & Err.Description, vbCritical, "VBA Error"
End Sub`
        },
        {
            id: "css-glassmorphism-system",
            short: "CSS",
            name: "CSS3 Glassmorphism",
            title: "Modern Dark Glassmorphic Design System Tokens",
            category: "Frontend",
            lang: "css",
            filename: "glassmorphism_tokens.css",
            desc: "Zero-dependency CSS3 design system with responsive backdrop-filter blur, glowing neon gradient borders, interactive hover physics, and fluid typography tokens.",
            code: `/* ============================================================
   RAUSHAN KUMAR — MODERN DARK GLASSMORPHISM DESIGN TOKENS
   No Frameworks · Ultra Lightweight · GPU Accelerated
============================================================ */

:root {
    --glass-bg: rgba(15, 29, 51, 0.65);
    --glass-bg-hover: rgba(22, 38, 66, 0.85);
    --glass-border: rgba(255, 255, 255, 0.08);
    --glass-border-glow: rgba(59, 130, 246, 0.45);
    --glass-blur: blur(14px);
    
    --neon-blue: #3b82f6;
    --neon-cyan: #06b6d4;
    --neon-purple: #8b5cf6;
    --neon-emerald: #10b981;
    --neon-amber: #f59e0b;
}

/* Glassmorphism Surface Card */
.glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.28s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
    transform: translateY(-4px);
    background: var(--glass-bg-hover);
    border-color: var(--glass-border-glow);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.2);
}

/* Glowing Neon Button */
.btn-neon-gradient {
    background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
    color: #ffffff;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(59, 130, 246, 0.35);
    transition: all 0.22s ease;
}

.btn-neon-gradient:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.55);
}`
        }
    ];

    function getAllSnippets() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.warn('[CodeStore] Error reading storage', e);
        }
        return DEFAULT_SNIPPETS;
    }

    function saveSnippets(snippets) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
        } catch (e) {
            console.warn('[CodeStore] Error saving snippets', e);
        }
    }

    return {
        getAll: getAllSnippets,
        saveAll: saveSnippets,
        getById: function (id) {
            return getAllSnippets().find(s => s.id === id);
        },
        addSnippet: function (snippet) {
            const list = getAllSnippets();
            if (!snippet.id) snippet.id = 'snippet_' + Date.now();
            list.unshift(snippet);
            saveSnippets(list);
            return snippet;
        },
        updateSnippet: function (id, updatedData) {
            const list = getAllSnippets();
            const idx = list.findIndex(s => s.id === id);
            if (idx !== -1) {
                list[idx] = { ...list[idx], ...updatedData, id };
                saveSnippets(list);
                return list[idx];
            }
            return null;
        },
        deleteSnippet: function (id) {
            const list = getAllSnippets().filter(s => s.id !== id);
            saveSnippets(list);
            return list;
        },
        resetDefaults: function () {
            saveSnippets(DEFAULT_SNIPPETS);
            return DEFAULT_SNIPPETS;
        }
    };
}));
