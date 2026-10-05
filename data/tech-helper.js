/**
 * ==========================================================================
 * RAUSHAN KUMAR — TECH HELPER & SHORT-CODE REGISTRY ENGINE (DRY ARCHITECTURE)
 * ==========================================================================
 * Purpose: Centralized technology registry so developers can write shortcodes
 * (e.g. "HTML", "CSS", "JS", "PY", "SQL") and get instant badges, icons, tooltips,
 * and categories without writing repeated HTML or CSS code.
 *
 * Usage Examples for Developers:
 *   1. TechHelper.resolve("JS")
 *      => { short: "JS", name: "JavaScript", fullName: "JavaScript (ES6+)", color: "#f7df1e", ... }
 *
 *   2. TechHelper.renderBadge("PY")
 *      => Returns accessible HTML string with SVG icon, color pill, and tooltip!
 *
 *   3. TechHelper.renderList(["HTML", "CSS", "JS", "PY"])
 *      => Returns wrapped row of badges in 1 line of code!
 * ==========================================================================
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.TechHelper = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const STORAGE_KEY = 'rk_tech_dictionary';

    // Built-in SVG icons mapping
    const ICONS = {
        zap: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
        code: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
        brush: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`,
        terminal: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`,
        database: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
        table: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>`,
        layers: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`,
        cpu: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
        server: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
        atom: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="2"></circle><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)"></ellipse><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(90 12 12)"></ellipse><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(150 12 12)"></ellipse></svg>`,
        globe: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
        monitor: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
        box: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
        default: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
    };

    // Default built-in Technology Dictionary
    const DEFAULT_REGISTRY = {
        "HTML": {
            short: "HTML",
            name: "HTML5",
            fullName: "HyperText Markup Language 5",
            category: "Frontend",
            badge: "Markup",
            icon: "code",
            color: "#e34f26",
            bg: "rgba(227, 79, 38, 0.12)",
            desc: "Semantic HTML5 markup & accessible web structures"
        },
        "CSS": {
            short: "CSS",
            name: "CSS3",
            fullName: "Cascading Style Sheets 3",
            category: "Frontend",
            badge: "Styling",
            icon: "brush",
            color: "#1572b6",
            bg: "rgba(21, 114, 182, 0.12)",
            desc: "Responsive design, Flexbox, CSS Grid & animations"
        },
        "JS": {
            short: "JS",
            name: "JavaScript",
            fullName: "JavaScript (ES6+ Modern)",
            category: "Programming",
            badge: "Core Logic",
            icon: "zap",
            color: "#f7df1e",
            bg: "rgba(247, 223, 30, 0.12)",
            desc: "Dynamic DOM scripting, modern asynchronous JavaScript"
        },
        "TS": {
            short: "TS",
            name: "TypeScript",
            fullName: "TypeScript Typed JavaScript",
            category: "Programming",
            badge: "Typed JS",
            icon: "code",
            color: "#3178c6",
            bg: "rgba(49, 120, 198, 0.12)",
            desc: "Type-safe robust JavaScript application development"
        },
        "PY": {
            short: "PY",
            name: "Python",
            fullName: "Python Programming",
            category: "Programming",
            badge: "Data & AI",
            icon: "terminal",
            color: "#3776ab",
            bg: "rgba(55, 118, 171, 0.12)",
            desc: "General scripting, data analysis, automation & backend"
        },
        "JAVA": {
            short: "JAVA",
            name: "Java",
            fullName: "Java Core & OOP",
            category: "Programming",
            badge: "OOP Logic",
            icon: "cpu",
            color: "#f89820",
            bg: "rgba(248, 152, 32, 0.12)",
            desc: "Object-oriented programming, classes, JVM architecture"
        },
        "SQL": {
            short: "SQL",
            name: "SQL",
            fullName: "Structured Query Language",
            category: "Database",
            badge: "Relational DB",
            icon: "database",
            color: "#00758f",
            bg: "rgba(0, 117, 143, 0.12)",
            desc: "Relational schema design, complex joins, subqueries, ACID"
        },
        "EXCEL": {
            short: "EXCEL",
            name: "MS Excel",
            fullName: "Microsoft Excel Analytics",
            category: "Data Analysis",
            badge: "Spreadsheets",
            icon: "table",
            color: "#107c41",
            bg: "rgba(16, 124, 65, 0.12)",
            desc: "Advanced formula modeling (XLOOKUP, SUMIFS), Pivot Tables"
        },
        "PANDAS": {
            short: "PANDAS",
            name: "Pandas",
            fullName: "Python Pandas DataFrames",
            category: "Data Analysis",
            badge: "DataFrames",
            icon: "layers",
            color: "#150458",
            bg: "rgba(21, 4, 88, 0.15)",
            desc: "Data cleaning, aggregation, exploratory data analysis"
        },
        "MATPLOTLIB": {
            short: "MATPLOTLIB",
            name: "Matplotlib",
            fullName: "Matplotlib Data Visualization",
            category: "Data Analysis",
            badge: "Visuals",
            icon: "layers",
            color: "#11557c",
            bg: "rgba(17, 85, 124, 0.12)",
            desc: "Data distribution charts, correlation heatmaps, trends"
        },
        "DATA": {
            short: "DATA",
            name: "Data Analysis",
            fullName: "Exploratory Data Analysis (EDA)",
            category: "Data Analysis",
            badge: "Analytics",
            icon: "table",
            color: "#06b6d4",
            bg: "rgba(6, 182, 212, 0.12)",
            desc: "Dataset inspection, hypothesis verification, KPI metrics"
        },
        "REACT": {
            short: "REACT",
            name: "React.js",
            fullName: "React Component UI",
            category: "Frontend",
            badge: "UI Library",
            icon: "atom",
            color: "#61dafb",
            bg: "rgba(97, 218, 251, 0.12)",
            desc: "Declarative component-driven interfaces, modern hooks"
        },
        "NODE": {
            short: "NODE",
            name: "Node.js",
            fullName: "Node.js JavaScript Runtime",
            category: "Backend",
            badge: "Server",
            icon: "server",
            color: "#339933",
            bg: "rgba(51, 153, 51, 0.12)",
            desc: "Server-side asynchronous JavaScript runtime"
        },
        "GIT": {
            short: "GIT",
            name: "Git & GitHub",
            fullName: "Git Version Control",
            category: "Tools",
            badge: "VCS",
            icon: "terminal",
            color: "#f05032",
            bg: "rgba(240, 80, 50, 0.12)",
            desc: "Commit tracking, branch collaboration, GitHub repos"
        },
        "MYSQL": {
            short: "MYSQL",
            name: "MySQL",
            fullName: "MySQL Database",
            category: "Database",
            badge: "RDBMS",
            icon: "database",
            color: "#4479a1",
            bg: "rgba(68, 121, 161, 0.12)",
            desc: "Relational database management, SQL stored procedures"
        },
        "API": {
            short: "API",
            name: "REST API",
            fullName: "RESTful Web Services",
            category: "Backend",
            badge: "APIs",
            icon: "globe",
            color: "#0ea5e9",
            bg: "rgba(14, 165, 233, 0.12)",
            desc: "HTTP requests, endpoints, JSON data exchange"
        },
        "DOCKER": {
            short: "DOCKER",
            name: "Docker",
            fullName: "Docker Containerization",
            category: "DevOps",
            badge: "Containers",
            icon: "box",
            color: "#2496ed",
            bg: "rgba(36, 150, 237, 0.12)",
            desc: "Isolated containers, reproducible app environments"
        }
    };

    // Load active dictionary from localStorage or default
    function getActiveRegistry() {
        try {
            if (typeof localStorage !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && typeof parsed === 'object') {
                        return Object.assign({}, DEFAULT_REGISTRY, parsed);
                    }
                }
            }
        } catch (e) {
            console.warn('[TechHelper] Error loading stored registry:', e);
        }
        return Object.assign({}, DEFAULT_REGISTRY);
    }

    let activeRegistry = getActiveRegistry();

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Resolves shortcode (e.g. "JS") or full name ("JavaScript") to standardized tech object
     */
    function resolve(input) {
        if (!input || typeof input !== 'string') {
            return {
                short: 'TECH',
                name: 'Technology',
                fullName: 'Technical Skill',
                category: 'General',
                badge: 'Tech',
                icon: 'default',
                color: '#38bdf8',
                bg: 'rgba(56, 189, 248, 0.12)',
                desc: 'Technical competency'
            };
        }

        const clean = input.trim();
        const upper = clean.toUpperCase();

        // 1. Direct match on shortcode key
        if (activeRegistry[upper]) {
            return activeRegistry[upper];
        }

        // 2. Search by name or fullName match
        const lower = clean.toLowerCase();
        for (const key in activeRegistry) {
            const item = activeRegistry[key];
            if (
                item.name.toLowerCase() === lower ||
                (item.fullName && item.fullName.toLowerCase() === lower) ||
                (item.short && item.short.toLowerCase() === lower)
            ) {
                return item;
            }
        }

        // 3. Fallback dynamically generated tech definition for custom typed entries
        return {
            short: clean.length <= 6 ? clean.toUpperCase() : clean.substring(0, 4).toUpperCase(),
            name: clean,
            fullName: clean,
            category: 'Skill',
            badge: 'Tech',
            icon: 'default',
            color: '#38bdf8',
            bg: 'rgba(56, 189, 248, 0.12)',
            desc: `Competency in ${clean}`
        };
    }

    /**
     * Returns HTML string for a single styled technology badge
     */
    function renderBadge(input, options = {}) {
        const tech = resolve(input);
        const iconSvg = ICONS[tech.icon] || ICONS.default;
        const showIcon = options.showIcon !== false;
        const showBadge = options.showBadge !== false && tech.badge;

        return `
            <span class="tech-tag dry-tech-badge" 
                  data-short="${escapeHtml(tech.short)}" 
                  title="${escapeHtml(tech.fullName || tech.name)}: ${escapeHtml(tech.desc || '')}"
                  style="border-color:${tech.color}40; background:${tech.bg}; color:${tech.color};">
                ${showIcon ? `<span class="tech-icon-box" style="display:inline-flex; align-items:center; margin-right:4px;">${iconSvg}</span>` : ''}
                <strong class="tech-tag-name" style="font-weight:600;">${escapeHtml(tech.name)}</strong>
                ${showBadge ? `<span class="tech-tag-badge" style="font-size:0.65rem; opacity:0.85; margin-left:4px; padding:1px 4px; border-radius:4px; background:rgba(255,255,255,0.08); text-transform:uppercase;">${escapeHtml(tech.badge)}</span>` : ''}
            </span>
        `.trim();
    }

    /**
     * Renders an array or comma-separated string of technologies in 1 single call
     */
    function renderList(list, options = {}) {
        if (!list) return '';
        let arr = [];
        if (Array.isArray(list)) {
            arr = list;
        } else if (typeof list === 'string') {
            arr = list.split(',').map(s => s.trim()).filter(Boolean);
        }

        if (arr.length === 0) return '';
        return arr.map(item => renderBadge(item, options)).join(' ');
    }

    /**
     * Registers or updates a technology short-form
     */
    function register(shortCode, data) {
        if (!shortCode || typeof shortCode !== 'string') return false;
        const code = shortCode.trim().toUpperCase();
        activeRegistry[code] = Object.assign({
            short: code,
            name: code,
            fullName: code,
            category: 'Custom',
            badge: 'Tech',
            icon: 'default',
            color: '#38bdf8',
            bg: 'rgba(56, 189, 248, 0.12)',
            desc: ''
        }, data);

        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(activeRegistry));
            }
        } catch (e) {
            console.warn('[TechHelper] Error saving to storage:', e);
        }
        return true;
    }

    /**
     * Deletes a technology short-form
     */
    function remove(shortCode) {
        if (!shortCode) return false;
        const code = shortCode.trim().toUpperCase();
        if (activeRegistry[code]) {
            delete activeRegistry[code];
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeRegistry));
                }
            } catch (e) {
                console.warn('[TechHelper] Error saving to storage:', e);
            }
            return true;
        }
        return false;
    }

    /**
     * Returns full active dictionary
     */
    function getAll() {
        return Object.assign({}, activeRegistry);
    }

    /**
     * Reloads active dictionary from storage
     */
    function reload() {
        activeRegistry = getActiveRegistry();
        return activeRegistry;
    }

    /**
     * Resets registry to default technologies
     */
    function resetToDefault() {
        activeRegistry = Object.assign({}, DEFAULT_REGISTRY);
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(activeRegistry));
            }
        } catch (e) {
            console.warn('[TechHelper] Error resetting storage:', e);
        }
        return activeRegistry;
    }

    return {
        resolve: resolve,
        renderBadge: renderBadge,
        renderList: renderList,
        register: register,
        remove: remove,
        getAll: getAll,
        reload: reload,
        resetToDefault: resetToDefault,
        ICONS: ICONS
    };
}));
