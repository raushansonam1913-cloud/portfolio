# 📁 Backend Data & Technology Vault Documentation

> **Centralized Architecture for Developers (DRY: Don't Repeat Yourself)**
> Saara portfolio data aur technology stack short-forms ek hi centralized folder me structured hain taaki kisi bhi developer ko code dobara na likhna pade.

---

## 🔒 1. Double-Lock Security Architecture
1. **First Lock (Admin Panel Authentication):**
   - Admin Login Password protects entry into `admin.html`.
2. **Second Lock (Backend & Data Vault Secondary PIN):**
   - Inside `admin.html`, accessing the **"Backend Data Vault"** requires a secondary Developer PIN (Default: `dev2026`).
   - Prevents unauthorized edits to raw JSON database schemas, security configurations, or technology definitions.
   - Configurable auto-lock after inactivity or one-click manual lock.

---

## ⚡ 2. Technology Short-Code Dictionary (`data/technologies.json`)
Developer ko lambe names ya repeated styling likhne ki zaroorat nahi hai. Simply use registered shortcodes:

| Shortcode | Full Name | Category | Icon / Accent |
| :--- | :--- | :--- | :--- |
| `HTML` | HyperText Markup Language 5 | Frontend | 🟠 `#e34f26` |
| `CSS` | Cascading Style Sheets 3 | Frontend | 🔵 `#1572b6` |
| `JS` | JavaScript (ES6+ Modern) | Programming | 🟡 `#f7df1e` |
| `TS` | TypeScript | Programming | 🔵 `#3178c6` |
| `PY` | Python Programming | Programming | 🔵 `#3776ab` |
| `JAVA` | Java Core & OOP | Programming | 🟠 `#f89820` |
| `SQL` | Structured Query Language | Database | 🟢 `#00758f` |
| `EXCEL` | Microsoft Excel & Analytics | Data Analysis | 🟢 `#107c41` |
| `PANDAS` | Python Pandas DataFrames | Data Analysis | 🟣 `#150458` |
| `MATPLOTLIB` | Matplotlib Data Visualization | Data Analysis | 🔵 `#11557c` |
| `REACT` | React Component UI | Frontend | 🔵 `#61dafb` |
| `NODE` | Node.js JavaScript Runtime | Backend | 🟢 `#339933` |
| `GIT` | Git & GitHub Version Control | Tools | 🔴 `#f05032` |
| `API` | RESTful Web Services | Backend | 🔵 `#0ea5e9` |

---

## 🛠️ 3. Developer Usage (`data/tech-helper.js`)

### A. Automatic Rendering in 1 Line of Code
```javascript
// Render single badge
const badgeHtml = TechHelper.renderBadge("JS");

// Render a list of technologies for projects or cards
const tagsHtml = TechHelper.renderList(["HTML", "CSS", "JS", "PY", "SQL"]);
document.getElementById("projectTechWrap").innerHTML = tagsHtml;
```

### B. Project Definition in `portfolio-data.json`
Developers simply write shortcodes in the project definition:
```json
{
  "id": "grand-stay",
  "title": "Grand Stay Hotel Website",
  "technologies": ["HTML", "CSS", "JS"]
}
```
The website engine automatically expands them into full branded badges with tooltips, category metadata, and SVGs!

---

## 🚀 4. Live Sync Engine
Any edits made inside the Admin Panel's Data Vault immediately broadcast via `BroadcastChannel` and `StorageEvent` to update the live public site in zero milliseconds without page reloads.
