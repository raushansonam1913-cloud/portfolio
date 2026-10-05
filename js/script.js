/**
 * ==========================================================================
 * RAUSHAN KUMAR — PROFESSIONAL PORTFOLIO JAVASCRIPT
 * Vanilla ES6+ • Zero External Frameworks • Strict Link Validation • Accessible
 * ==========================================================================
 */

"use strict";

/* --- 0. APP VERSION & AUTO-HEALING ENGINE --- */
const APP_VERSION = "2.1.0";
const ADMIN_DATA_KEY = "rk_portfolio_data";

const defaultSiteConfig = {
    name: "Raushan Kumar",
    headline: "BCA Student | Data Analysis | MS Excel",
    heroIntro: "Building practical skills in Data Analysis, Excel, Databases, and modern web technologies. Dedicated to creating structured, reliable digital solutions.",
    statusBadge: "Open to Internship & Projects",
    opportunitySubtitle: "Open to internship, freelance, and entry-level opportunities in Data Analysis, Excel, and Technology.",
    experienceInternshipTitle: "BCA Student & Technology Learner",
    thankYouText: "Thank you from the bottom of my heart for taking the time to visit and explore my portfolio. Whether it’s an internship opportunity, hands-on project collaboration, or a coding discussion, I’m always excited to connect, learn, and build something meaningful and impactful together!",
    resume: "resume/Raushan-Kumar-Resume.pdf",
    photos: [
        "images/profile-1.jpg?v=1791124666",
        "images/profile-2.jpg?v=1791124666",
        "images/profile-3.jpg?v=1791124666"
    ],
    social: {
        github: "https://github.com/rkumar76677144-commits/interncircle-titanic-eda",
        linkedin: "https://www.linkedin.com/in/raushan-kumar-439204384/",
        email: "rkumar99427600@gmail.com",
        instagram: "https://www.instagram.com/cute_boy_dangi/",
        gfg: "https://www.geeksforgeeks.org/profile/rkumar765zil?tab=overview",
        youtube: "https://www.youtube.com/channel/UCktxUNjQiJYzSMJPj889x7g",
        custom: []
    }
};

const defaultEducationData = [
    {
        id: "bca",
        title: "Bachelor of Computer Applications (BCA)",
        institute: "Roorkee Institute of Technology, Roorkee",
        badge: "Current Academic Progression",
        badgeType: "current",
        desc: "Enrolled in undergraduate computer science curriculum focusing on computer programming, database management systems, data structures, computer networks, and practical software engineering.",
        tags: ["Computer Applications", "RIT Roorkee", "Degree Program"]
    },
    {
        id: "class-12",
        title: "Class 12 (Intermediate)",
        institute: "Bihar",
        badge: "Higher Secondary",
        badgeType: "completed",
        desc: "Completed senior secondary school education in Bihar with core foundational academics.",
        tags: ["Class 12", "Bihar"]
    },
    {
        id: "class-10",
        title: "Class 10 (Matriculation)",
        institute: "Bihar",
        badge: "Secondary School",
        badgeType: "completed",
        desc: "Successfully completed secondary school education in Bihar, establishing key quantitative and logical problem-solving foundations.",
        tags: ["Class 10", "Bihar"]
    }
];

/**
 * AUTO-HEALING & STORAGE INTEGRITY ENGINE
 * Safely inspects localStorage, repairs missing or corrupted keys,
 * and recovers gracefully if a bug or malformed JSON is detected.
 */
function sanitizeAndRepairStorage() {
    try {
        const raw = localStorage.getItem(ADMIN_DATA_KEY);
        if (!raw) return true;

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (jsonErr) {
            console.warn("🛡️ Auto-Recovery: Corrupted JSON detected. Auto-recovering clean state...", jsonErr);
            localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify({ siteConfig: defaultSiteConfig }));
            showAutoHealToast("Corrupted storage auto-repaired safely");
            return false;
        }

        if (!parsed || typeof parsed !== "object") {
            parsed = { siteConfig: defaultSiteConfig };
            localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(parsed));
            return false;
        }

        let repaired = false;
        if (!parsed.siteConfig || typeof parsed.siteConfig !== "object") {
            parsed.siteConfig = Object.assign({}, defaultSiteConfig);
            repaired = true;
        } else {
            // Ensure photos exist
            if (!Array.isArray(parsed.siteConfig.photos) || parsed.siteConfig.photos.length === 0) {
                parsed.siteConfig.photos = [...defaultSiteConfig.photos];
                repaired = true;
            }
            // Ensure social exists
            if (!parsed.siteConfig.social || typeof parsed.siteConfig.social !== "object") {
                parsed.siteConfig.social = Object.assign({}, defaultSiteConfig.social);
                repaired = true;
            }
            // Ensure education exists
            if (!Array.isArray(parsed.education)) {
                parsed.education = JSON.parse(JSON.stringify(defaultEducationData));
                repaired = true;
            }
        }

        if (repaired) {
            localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(parsed));
            console.log("🛡️ Auto-Recovery: Missing schema keys auto-repaired.");
        }
        return true;
    } catch (e) {
        console.warn("🛡️ Auto-Recovery error boundary caught:", e);
        return false;
    }
}

// Run initial sanity check
sanitizeAndRepairStorage();

function loadAdminData() {
    try {
        const raw = localStorage.getItem(ADMIN_DATA_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        sanitizeAndRepairStorage();
        return null;
    }
}

let _adminData = loadAdminData();

/* --- 1. CENTRALIZED SITE CONFIGURATION & SAFE LINKS --- */
let siteConfig = (_adminData && _adminData.siteConfig)
    ? Object.assign({}, defaultSiteConfig, _adminData.siteConfig)
    : Object.assign({}, defaultSiteConfig);

/* --- 2. PROFILE IMAGE ROTATOR CONFIGURATION --- */
// Auto-slide every 5 seconds (5000ms)
const PROFILE_CHANGE_TIME = 5 * 1000;

/* --- 3. PROJECT DATA (AUTHENTIC & UNEXAGGERATED) --- */
const defaultProjectsData = [
    {
        id: "grand-stay",
        title: "Grand Stay Hotel Website",
        categories: ["web"],
        badge: "Web Concept",
        image: "images/projects/grand-stay.jpg",
        description: "Responsive hotel booking website concept with user and admin functionality, room information, booking interface and responsive design.",
        technologies: ["HTML", "CSS", "JavaScript"],
        features: [
            "Interactive room showcase with pricing details and room amenity badges",
            "Responsive booking reservation form with real-time input validation",
            "Multi-page administrative overview concept for room availability",
            "Optimized semantic markup ensuring cross-device layout consistency"
        ],
        challenges: "Designing an intuitive multi-step room reservation flow without external form libraries while keeping all layouts responsive across mobile viewports.",
        learnings: "Strengthened core DOM manipulation skills, CSS Grid layouts, and accessible form control patterns.",
        github: null,
        liveDemo: null
    },
    {
        id: "sales-dashboard",
        title: "Excel Sales Dashboard",
        categories: ["excel", "data"],
        badge: "Data Analysis",
        image: "images/projects/sales-dashboard.jpg",
        description: "Sales analysis dashboard featuring data cleaning, calculations, charts and business insights.",
        technologies: ["MS Excel", "Data Analysis"],
        features: [
            "Data cleansing and normalization of raw multi-region transaction logs",
            "Advanced Excel formula calculations (VLOOKUP, XLOOKUP, INDEX/MATCH, SUMIFS)",
            "Dynamic Pivot Tables and category-level breakdown charts",
            "Key Performance Indicator (KPI) metric tiles for regional revenue growth"
        ],
        challenges: "Resolving inconsistent transaction dates and duplicate entries during data preparation to ensure chart formulas computed without #VALUE errors.",
        learnings: "Deepened proficiency in spreadsheet modeling, quantitative reporting, and designing clean visual executive summaries.",
        github: null,
        liveDemo: null
    },
    {
        id: "school-erp",
        title: "School ERP System",
        categories: ["web", "java"],
        badge: "Academic ERP",
        image: "images/projects/school-erp.jpg",
        description: "School ERP concept covering administration, students, teachers, attendance, fees, library and academic management.",
        technologies: ["HTML", "CSS", "JavaScript", "Database Concepts"],
        features: [
            "Modular architecture covering student profiles, staff registers, and fee portals",
            "Attendance logging module with daily aggregate counters and status tags",
            "Normalized relational schema design for students, courses, and examination marks",
            "Interactive dashboard interface with clear administrative navigation"
        ],
        challenges: "Structuring complex many-to-many relationships (e.g. students to enrolled subjects and fee balances) in database schemas.",
        learnings: "Gained comprehensive understanding of entity-relationship design, schema normalization, and modular dashboard interfaces.",
        github: null,
        liveDemo: null
    },
    {
        id: "data-visualization",
        title: "Data Visualization Project",
        categories: ["data"],
        badge: "Python & EDA",
        image: "images/projects/data-visualization.jpg",
        description: "Python-based data cleaning and visualization project using practical datasets.",
        technologies: ["Python", "Pandas", "Matplotlib"],
        features: [
            "Exploratory Data Analysis (EDA) on structured numerical and categorical data",
            "Automated missing-value handling and outlier detection scripts",
            "Visualizations including correlation heatmaps, scatter distributions, and trend lines",
            "Exportable visual reporting summaries for analytical review"
        ],
        challenges: "Selecting the most informative chart representations to highlight non-linear relationships without visual clutter.",
        learnings: "Mastered practical data inspection with Pandas DataFrames and Matplotlib plot customizations.",
        github: null,
        liveDemo: null
    }
];

let projectsData = defaultProjectsData;
let certificatesData = [];
let educationData = defaultEducationData;

/* --- 4. CERTIFICATES DATA --- */
const defaultCertificatesData = [
    {
        id: "ibm-data-science",
        title: "IBM Data Science & Python",
        organization: "IBM Developer Skills Network",
        category: "ibm",
        date: "2026",
        image: "certificates/ibm-data-science.jpg",
        verificationUrl: null
    },
    {
        id: "microsoft-excel",
        title: "Microsoft Excel for Data Analysis",
        organization: "Microsoft Learn",
        category: "microsoft",
        date: "2026",
        image: "certificates/microsoft-excel.jpg",
        verificationUrl: null
    },
    {
        id: "infosys-python",
        title: "Python Fundamentals & Foundations",
        organization: "Infosys Springboard",
        category: "infosys",
        date: "2025",
        image: "certificates/infosys-python.jpg",
        verificationUrl: null
    },
    {
        id: "sql-database",
        title: "SQL & Relational Databases",
        organization: "Database Certification Institute",
        category: "sql",
        date: "2026",
        image: "certificates/sql-database.jpg",
        verificationUrl: null
    },
    {
        id: "web-development",
        title: "Modern Web Development (HTML/CSS/JS)",
        organization: "Web Technology Academy",
        category: "other",
        date: "2025",
        image: "certificates/web-development.jpg",
        verificationUrl: null
    }
];

function getActivePortfolioData() {
    const master = (typeof window !== "undefined" && window.PORTFOLIO_MASTER_DATA) ? window.PORTFOLIO_MASTER_DATA : null;
    const stored = loadAdminData();

    let masterIsNewer = false;
    if (master && master.vaultMeta && master.vaultMeta.lastModified && stored && stored.vaultMeta && stored.vaultMeta.lastModified) {
        masterIsNewer = new Date(master.vaultMeta.lastModified) > new Date(stored.vaultMeta.lastModified);
    } else if (master && !stored) {
        masterIsNewer = true;
    }

    const primary = masterIsNewer ? master : (stored || master || {});
    const secondary = masterIsNewer ? (stored || {}) : (master || {});

    const mergedSiteConfig = Object.assign(
        {},
        defaultSiteConfig,
        secondary.siteConfig || {},
        primary.siteConfig || {}
    );

    const mergedProjects = (primary.projects && Array.isArray(primary.projects) && primary.projects.length > 0)
        ? primary.projects
        : ((secondary.projects && Array.isArray(secondary.projects) && secondary.projects.length > 0)
            ? secondary.projects
            : defaultProjectsData);

    const mergedCertificates = (primary.certificates && Array.isArray(primary.certificates) && primary.certificates.length > 0)
        ? primary.certificates
        : ((secondary.certificates && Array.isArray(secondary.certificates) && secondary.certificates.length > 0)
            ? secondary.certificates
            : defaultCertificatesData);

    const mergedEducation = (primary.education && Array.isArray(primary.education) && primary.education.length > 0)
        ? primary.education
        : ((secondary.education && Array.isArray(secondary.education) && secondary.education.length > 0)
            ? secondary.education
            : defaultEducationData);

    const mergedSkills = (primary.skills && Array.isArray(primary.skills) && primary.skills.length > 0)
        ? primary.skills
        : ((secondary.skills && Array.isArray(secondary.skills) && secondary.skills.length > 0)
            ? secondary.skills
            : ((master && Array.isArray(master.skills) && master.skills.length > 0) ? master.skills : null));

    return {
        siteConfig: mergedSiteConfig,
        projects: mergedProjects,
        certificates: mergedCertificates,
        education: mergedEducation,
        skills: mergedSkills,
        raw: primary
    };
}

const _initialPortfolioData = getActivePortfolioData();
siteConfig = _initialPortfolioData.siteConfig;
projectsData = _initialPortfolioData.projects;
certificatesData = _initialPortfolioData.certificates;
educationData = _initialPortfolioData.education;

/* --- 5. STRICT URL & PATH VALIDATION FUNCTIONS --- */

/**
 * Validates external HTTP/HTTPS URLs.
 * Rejects javascript:, data:, #, fragments, or malformed strings.
 */
function isValidExternalUrl(url) {
    if (typeof url !== "string") {
        return false;
    }
    const value = url.trim();
    if (!value) {
        return false;
    }
    try {
        const parsed = new URL(value);
        return (
            (parsed.protocol === "https:" || parsed.protocol === "http:") &&
            Boolean(parsed.hostname)
        );
    } catch {
        return false;
    }
}

/**
 * Validates internal anchor links (e.g. #about, #projects).
 */
function isValidInternalLink(url) {
    if (typeof url !== "string") {
        return false;
    }
    const value = url.trim();
    return /^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(value);
}

/**
 * Validates local relative paths.
 * Blocks parent directory traversal, absolute paths, and URI schemes.
 */
function isValidLocalPath(path) {
    if (typeof path !== "string") {
        return false;
    }
    const value = path.trim();
    if (!value) {
        return false;
    }
    // Reject fragments
    if (value.startsWith("#")) {
        return false;
    }
    // Reject schemes such as javascript:, data:, blob:, mailto:, http:, https:
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
        return false;
    }
    // Reject protocol-relative URLs
    if (value.startsWith("//")) {
        return false;
    }
    // Reject absolute Unix/Windows paths
    if (value.startsWith("/") || /^[a-zA-Z]:[\\/]/.test(value)) {
        return false;
    }
    // Reject parent-directory traversal
    const segments = value.split(/[\\/]+/);
    if (segments.includes("..")) {
        return false;
    }
    // Consistent forward slashes
    if (value.includes("\\")) {
        return false;
    }
    return true;
}

/**
 * Restricts local files to designated portfolio directories.
 */
const allowedLocalPrefixes = [
    "resume/",
    "images/",
    "certificates/"
];

function isAllowedPortfolioPath(path) {
    if (!isValidLocalPath(path)) {
        return false;
    }
    return allowedLocalPrefixes.some(prefix => path.startsWith(prefix));
}

/**
 * Unified link type detection.
 */
function getLinkType(url) {
    if (typeof url !== "string") {
        return "invalid";
    }
    const value = url.trim();
    if (!value) {
        return "invalid";
    }
    if (isValidInternalLink(value)) {
        return "internal";
    }
    if (isValidExternalUrl(value)) {
        return "external";
    }
    if (isAllowedPortfolioPath(value)) {
        return "local";
    }
    return "invalid";
}

/**
 * Safely creates an anchor element for valid destinations only.
 * Returns null if the URL is missing or invalid.
 */
function createOptionalLink({
    url,
    label,
    icon = "",
    className = "",
    target = null,
    ariaLabel = "",
    download = false
}) {
    if (!url || typeof url !== "string") {
        return null;
    }
    const value = url.trim();
    if (!value) {
        return null;
    }

    const type = getLinkType(value);
    if (type === "invalid") {
        return null;
    }

    const link = document.createElement("a");
    link.href = value;
    if (className) {
        link.className = className;
    }

    if (icon) {
        const iconSpan = document.createElement("span");
        iconSpan.innerHTML = icon;
        iconSpan.setAttribute("aria-hidden", "true");
        link.appendChild(iconSpan);
    }

    const textSpan = document.createElement("span");
    textSpan.textContent = label;
    link.appendChild(textSpan);

    if (target === "_blank" || type === "external") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }

    if (ariaLabel) {
        link.setAttribute("aria-label", ariaLabel);
    }

    if (download) {
        link.setAttribute("download", "");
    }

    return link;
}

/**
 * Safely creates an email mailto link.
 */
function createEmailLink(email, label = "Email") {
    if (
        typeof email !== "string" ||
        !email.trim() ||
        !email.includes("@")
    ) {
        return null;
    }

    const trimmed = email.trim();
    const link = document.createElement("a");
    link.href = `mailto:${trimmed}`;
    link.textContent = label;
    link.className = "social-btn";
    link.setAttribute("aria-label", `Send email to ${trimmed}`);
    return link;
}

/**
 * Renders the resume download button.
 */
function renderResumeLink(url, container) {
    if (!container) return;
    container.innerHTML = "";
    if (!url) return;

    const trimmed = String(url).trim();
    if (!trimmed) return;

    const isLocal = isAllowedPortfolioPath(trimmed);
    const isExternal = isValidExternalUrl(trimmed);

    if (!isLocal && !isExternal) {
        return;
    }

    const link = createOptionalLink({
        url: trimmed,
        label: isExternal ? "View / Download Resume" : "Download Resume",
        className: "btn btn-primary",
        target: isExternal ? "_blank" : "_self",
        ariaLabel: "Download or view Raushan Kumar's resume",
        download: isLocal
    });

    if (link) {
        // Add PDF icon
        const iconWrapper = document.createElement("span");
        iconWrapper.innerHTML = `
            <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
        `;
        iconWrapper.setAttribute("aria-hidden", "true");
        link.insertBefore(iconWrapper, link.firstChild);
        container.appendChild(link);
    }
}

/* --- 6. THEME TOGGLE (DARK / LIGHT MODE) --- */
function initTheme() {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    htmlElement.setAttribute("data-theme", savedTheme);
    updateThemeToggleAccessibility(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = htmlElement.getAttribute("data-theme") || "dark";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            htmlElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("portfolio-theme", newTheme);
            updateThemeToggleAccessibility(newTheme);
        });
    }
}

function updateThemeToggleAccessibility(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    if (theme === "dark") {
        btn.setAttribute("aria-label", "Switch to light theme");
        btn.setAttribute("title", "Switch to light theme");
    } else {
        btn.setAttribute("aria-label", "Switch to dark theme");
        btn.setAttribute("title", "Switch to dark theme");
    }
}

/* --- 7. NAVBAR & MOBILE MENU --- */
function initNavbar() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navLinks = document.getElementById("primary-navigation");
    const navLinkItems = document.querySelectorAll(".nav-link");

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener("click", () => {
            const isExpanded = hamburgerBtn.getAttribute("aria-expanded") === "true";
            hamburgerBtn.setAttribute("aria-expanded", String(!isExpanded));
            navLinks.classList.toggle("open");
        });

        // Close mobile nav when clicking a link
        navLinkItems.forEach(link => {
            link.addEventListener("click", () => {
                hamburgerBtn.setAttribute("aria-expanded", "false");
                navLinks.classList.remove("open");
            });
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (
                navLinks.classList.contains("open") &&
                !navLinks.contains(e.target) &&
                !hamburgerBtn.contains(e.target)
            ) {
                hamburgerBtn.setAttribute("aria-expanded", "false");
                navLinks.classList.remove("open");
            }
        });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll("section[id]");
    function highlightActiveNav() {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinkItems.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", highlightActiveNav, { passive: true });
}

/* --- 8. PROFILE IMAGE SYSTEM & SCROLL SLIDER --- */
function initProfileRotator() {
    const viewport = document.getElementById("profileScrollViewport");
    const dots = document.querySelectorAll(".profile-dots .dot");
    const prevBtn = document.getElementById("profilePrevBtn");
    const nextBtn = document.getElementById("profileNextBtn");
    const profileCard = document.getElementById("profileCard");

    const slides = Array.from(document.querySelectorAll(".profile-slide"));
    let currentIndex = 0;
    let rotationTimer = null;

    function scrollToSlide(index, smooth = true) {
        const total = slides.length || 3;
        if (index < 0) {
            currentIndex = total - 1;
        } else if (index >= total) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        if (viewport) {
            const slideWidth = viewport.clientWidth || viewport.offsetWidth || 350;
            viewport.scrollTo({
                left: currentIndex * slideWidth,
                behavior: smooth ? "smooth" : "auto"
            });
        }

        updateSlideUI(currentIndex);
    }

    function updateSlideUI(index) {
        dots.forEach((dot, i) => {
            if (!dot) return;
            if (i === index) {
                dot.classList.add("active");
                dot.setAttribute("aria-selected", "true");
            } else {
                dot.classList.remove("active");
                dot.setAttribute("aria-selected", "false");
            }
        });

        slides.forEach((slide, i) => {
            if (!slide) return;
            if (i === index) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });
    }

    // Scroll listener for manual touch / swipe / mouse wheel
    if (viewport) {
        let scrollTimeout = null;
        viewport.addEventListener("scroll", () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const slideWidth = viewport.clientWidth || 1;
                const newIndex = Math.round(viewport.scrollLeft / slideWidth);
                if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
                    currentIndex = newIndex;
                    updateSlideUI(currentIndex);
                }
            }, 50);
        }, { passive: true });

        // Mouse drag scrolling support
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        viewport.addEventListener("mousedown", (e) => {
            isDown = true;
            stopTimer();
            startX = e.pageX - viewport.offsetLeft;
            scrollLeft = viewport.scrollLeft;
        });

        viewport.addEventListener("mouseleave", () => {
            isDown = false;
            startTimer();
        });

        viewport.addEventListener("mouseup", () => {
            isDown = false;
            startTimer();
        });

        viewport.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - viewport.offsetLeft;
            const walk = (x - startX) * 1.4;
            viewport.scrollLeft = scrollLeft - walk;
        });
    }

    function startTimer() {
        stopTimer();
        rotationTimer = setInterval(() => {
            scrollToSlide(currentIndex + 1, true);
        }, 4500);
    }

    function stopTimer() {
        if (rotationTimer) {
            clearInterval(rotationTimer);
            rotationTimer = null;
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            scrollToSlide(currentIndex - 1, true);
            startTimer();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            scrollToSlide(currentIndex + 1, true);
            startTimer();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            const targetIndex = parseInt(e.currentTarget.getAttribute("data-index"), 10);
            if (!isNaN(targetIndex)) {
                scrollToSlide(targetIndex, true);
                startTimer();
            }
        });
    });

    // Pause rotator on card hover / touch for accessibility
    if (profileCard) {
        profileCard.addEventListener("mouseenter", stopTimer);
        profileCard.addEventListener("mouseleave", startTimer);
        profileCard.addEventListener("focusin", stopTimer);
        profileCard.addEventListener("focusout", startTimer);
        profileCard.addEventListener("touchstart", stopTimer, { passive: true });
        profileCard.addEventListener("touchend", startTimer, { passive: true });
    }

    // Set initial slide UI & start timer
    updateSlideUI(0);
    startTimer();
}

/* --- 9. PROJECTS SECTION & FILTERING --- */
function initProjects() {
    const projectsGrid = document.getElementById("projectsGrid");
    const filterContainer = document.getElementById("projectFilterControls") || document.querySelector("#projects .filter-controls");

    if (!projectsGrid) return;

    function renderProjects(filter = "all") {
        projectsGrid.innerHTML = "";

        const filtered = projectsData.filter(proj => {
            if (filter === "all") return true;
            return (proj.categories || []).some(cat => cat.trim().toLowerCase() === filter.toLowerCase());
        });

        filtered.forEach(project => {
            const card = document.createElement("article");
            card.className = "project-card";
            card.setAttribute("aria-labelledby", `proj-title-${project.id}`);

            // Thumbnail
            const thumb = document.createElement("div");
            thumb.className = "project-thumbnail";

            const img = document.createElement("img");
            img.src = project.image;
            img.alt = `Preview screenshot of ${project.title}`;
            img.className = "project-img";
            img.loading = "lazy";
            thumb.appendChild(img);

            if (project.badge) {
                const badge = document.createElement("span");
                badge.className = "project-badge-tag";
                badge.textContent = project.badge;
                thumb.appendChild(badge);
            }

            card.appendChild(thumb);

            // Content
            const content = document.createElement("div");
            content.className = "project-content";

            const title = document.createElement("h3");
            title.className = "project-title";
            title.id = `proj-title-${project.id}`;
            title.textContent = project.title;
            content.appendChild(title);

            const desc = document.createElement("p");
            desc.className = "project-desc";
            desc.textContent = project.description;
            content.appendChild(desc);

            // Tags (using TechHelper DRY shortcode engine)
            const tagsWrap = document.createElement("div");
            tagsWrap.className = "project-tags";
            if (window.TechHelper && typeof window.TechHelper.renderList === "function") {
                tagsWrap.innerHTML = window.TechHelper.renderList(project.technologies || []);
            } else {
                (project.technologies || []).forEach(tech => {
                    const tag = document.createElement("span");
                    tag.className = "tech-tag";
                    tag.textContent = tech;
                    tagsWrap.appendChild(tag);
                });
            }
            content.appendChild(tagsWrap);

            // Actions wrapper
            const actions = document.createElement("div");
            actions.className = "project-actions";

            // Details Button (Always Available)
            const detailsBtn = document.createElement("button");
            detailsBtn.type = "button";
            detailsBtn.className = "btn btn-secondary btn-sm";
            detailsBtn.textContent = "Details";
            detailsBtn.setAttribute("aria-label", `View detailed breakdown for ${project.title}`);
            detailsBtn.addEventListener("click", () => openProjectModal(project));
            actions.appendChild(detailsBtn);

            // Safe Live Demo Link (Only if valid URL)
            if (project.liveDemo && isValidExternalUrl(project.liveDemo)) {
                const demoLink = createOptionalLink({
                    url: project.liveDemo,
                    label: "Live Demo",
                    className: "btn btn-primary btn-sm",
                    target: "_blank",
                    ariaLabel: `View live demonstration of ${project.title} (opens in new tab)`
                });
                if (demoLink) actions.appendChild(demoLink);
            }

            // Safe GitHub Link (Only if valid URL)
            if (project.github && isValidExternalUrl(project.github)) {
                const ghLink = createOptionalLink({
                    url: project.github,
                    label: "GitHub",
                    className: "btn btn-outline btn-sm",
                    target: "_blank",
                    ariaLabel: `View GitHub repository for ${project.title} (opens in new tab)`
                });
                if (ghLink) actions.appendChild(ghLink);
            }

            content.appendChild(actions);
            card.appendChild(content);
            projectsGrid.appendChild(card);
        });
    }

    // Build dynamic filter buttons based on custom typed categories
    function buildProjectFilterButtons() {
        if (!filterContainer) return;
        const catMap = new Map();
        projectsData.forEach(p => {
            (p.categories || []).forEach(cat => {
                const clean = (cat || "").trim();
                if (clean) {
                    const key = clean.toLowerCase();
                    if (!catMap.has(key)) {
                        catMap.set(key, clean);
                    }
                }
            });
        });

        filterContainer.innerHTML = "";
        const allBtn = document.createElement("button");
        allBtn.type = "button";
        allBtn.className = "filter-btn active";
        allBtn.setAttribute("role", "tab");
        allBtn.setAttribute("aria-selected", "true");
        allBtn.setAttribute("data-filter", "all");
        allBtn.textContent = "All";
        filterContainer.appendChild(allBtn);

        catMap.forEach((displayLabel, key) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "filter-btn";
            btn.setAttribute("role", "tab");
            btn.setAttribute("aria-selected", "false");
            btn.setAttribute("data-filter", key);
            btn.textContent = displayLabel;
            filterContainer.appendChild(btn);
        });

        filterContainer.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", e => {
                filterContainer.querySelectorAll(".filter-btn").forEach(b => {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                });
                const clicked = e.currentTarget;
                clicked.classList.add("active");
                clicked.setAttribute("aria-selected", "true");
                const filterVal = clicked.getAttribute("data-filter") || "all";
                renderProjects(filterVal);
            });
        });
    }

    let currentProjectFilter = "all";
    window.rkRenderProjects = () => {
        buildProjectFilterButtons();
        renderProjects(currentProjectFilter);
    };

    buildProjectFilterButtons();
    renderProjects("all");
}

/* --- 10. PROJECT DETAILS MODAL --- */
let lastFocusedElement = null;

function initProjectModal() {
    const modalBackdrop = document.getElementById("projectModal");
    const closeBtn = document.getElementById("closeProjectModalBtn");

    if (!modalBackdrop) return;

    function closeModal() {
        modalBackdrop.classList.remove("open");
        modalBackdrop.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalBackdrop.classList.contains("open")) {
            closeModal();
        }
    });
}

function openProjectModal(project) {
    const modalBackdrop = document.getElementById("projectModal");
    if (!modalBackdrop) return;

    lastFocusedElement = document.activeElement;

    const modalCategory = document.getElementById("modalProjectCategory");
    const modalImg = document.getElementById("modalProjectImg");
    const modalTitle = document.getElementById("modalProjectTitle");
    const modalDesc = document.getElementById("modalProjectDesc");
    const modalFeatures = document.getElementById("modalProjectFeatures");
    const modalTech = document.getElementById("modalProjectTech");
    const modalChallenges = document.getElementById("modalProjectChallenges");
    const modalLearnings = document.getElementById("modalProjectLearnings");
    const modalLinks = document.getElementById("modalProjectLinks");

    if (modalCategory) modalCategory.textContent = project.badge || "Project";
    if (modalImg) {
        modalImg.src = project.image;
        modalImg.alt = project.title;
    }
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalDesc) modalDesc.textContent = project.description;

    // Features
    if (modalFeatures) {
        modalFeatures.innerHTML = "";
        project.features.forEach(feat => {
            const li = document.createElement("li");
            li.textContent = feat;
            modalFeatures.appendChild(li);
        });
    }

    // Tech tags (using TechHelper DRY shortcode engine)
    if (modalTech) {
        if (window.TechHelper && typeof window.TechHelper.renderList === "function") {
            modalTech.innerHTML = window.TechHelper.renderList(project.technologies || []);
        } else {
            modalTech.innerHTML = "";
            (project.technologies || []).forEach(tech => {
                const tag = document.createElement("span");
                tag.className = "tech-tag";
                tag.textContent = tech;
                modalTech.appendChild(tag);
            });
        }
    }

    if (modalChallenges) modalChallenges.textContent = project.challenges;
    if (modalLearnings) modalLearnings.textContent = project.learnings;

    // Optional safe links in modal footer
    if (modalLinks) {
        modalLinks.innerHTML = "";

        if (project.liveDemo && isValidExternalUrl(project.liveDemo)) {
            const demoLink = createOptionalLink({
                url: project.liveDemo,
                label: "Open Live Demo",
                className: "btn btn-primary btn-sm",
                target: "_blank",
                ariaLabel: `Open live demo for ${project.title}`
            });
            if (demoLink) modalLinks.appendChild(demoLink);
        }

        if (project.github && isValidExternalUrl(project.github)) {
            const ghLink = createOptionalLink({
                url: project.github,
                label: "View GitHub Code",
                className: "btn btn-secondary btn-sm",
                target: "_blank",
                ariaLabel: `View source code for ${project.title}`
            });
            if (ghLink) modalLinks.appendChild(ghLink);
        }
    }

    modalBackdrop.classList.add("open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = document.getElementById("closeProjectModalBtn");
    if (closeBtn) closeBtn.focus();
}

/* --- 11. CERTIFICATES GALLERY & IMAGE VIEWER --- */
function initCertificates() {
    const grid = document.getElementById("certificatesGrid");
    const filterContainer = document.getElementById("certFilterControls") || document.querySelector("#certificates .filter-controls") || document.querySelector(".cert-filter-controls");

    if (!grid) return;

    function renderCertificates(filter = "all") {
        grid.innerHTML = "";

        const filtered = certificatesData.filter(cert => {
            if (filter === "all") return true;
            return (cert.category || "").trim().toLowerCase() === filter.toLowerCase();
        });

        filtered.forEach(cert => {
            const card = document.createElement("article");
            card.className = "cert-card";
            card.setAttribute("aria-labelledby", `cert-title-${cert.id}`);

            // Thumbnail
            const thumb = document.createElement("div");
            thumb.className = "cert-thumbnail";
            thumb.setAttribute("tabindex", "0");
            thumb.setAttribute("role", "button");
            thumb.setAttribute("aria-label", `View full certificate for ${cert.title}`);
            thumb.addEventListener("click", () => openCertModal(cert));
            thumb.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openCertModal(cert);
                }
            });

            const img = document.createElement("img");
            img.src = cert.image;
            img.alt = `Certificate thumbnail for ${cert.title}`;
            img.className = "cert-img";
            img.loading = "lazy";
            thumb.appendChild(img);

            card.appendChild(thumb);

            // Content
            const content = document.createElement("div");
            content.className = "cert-content";

            const org = document.createElement("span");
            org.className = "cert-org-badge";
            org.textContent = cert.organization;
            content.appendChild(org);

            const title = document.createElement("h3");
            title.className = "cert-title";
            title.id = `cert-title-${cert.id}`;
            title.textContent = cert.title;
            content.appendChild(title);

            const date = document.createElement("span");
            date.className = "cert-date";
            date.textContent = `Completed: ${cert.date}`;
            content.appendChild(date);

            // Actions
            const actions = document.createElement("div");
            actions.className = "cert-actions";

            const viewBtn = document.createElement("button");
            viewBtn.type = "button";
            viewBtn.className = "btn btn-secondary btn-sm";
            viewBtn.textContent = "View Certificate";
            viewBtn.setAttribute("aria-label", `View full preview of ${cert.title}`);
            viewBtn.addEventListener("click", () => openCertModal(cert));
            actions.appendChild(viewBtn);

            // Verify button ONLY rendered if real verification URL exists (Rule 46 & 51)
            if (cert.verificationUrl && isValidExternalUrl(cert.verificationUrl)) {
                const verifyLink = createOptionalLink({
                    url: cert.verificationUrl,
                    label: "Verify Certificate",
                    className: "btn btn-outline btn-sm",
                    target: "_blank",
                    ariaLabel: `Verify credential for ${cert.title} on issuing organization portal`
                });
                if (verifyLink) actions.appendChild(verifyLink);
            }

            content.appendChild(actions);
            card.appendChild(content);
            grid.appendChild(card);
        });
    }

    // Build dynamic filter buttons based on custom typed categories
    function buildCertFilterButtons() {
        if (!filterContainer) return;
        const catMap = new Map();
        certificatesData.forEach(cert => {
            const clean = (cert.category || "").trim();
            if (clean) {
                const key = clean.toLowerCase();
                if (!catMap.has(key)) {
                    const display = clean.length <= 4 ? clean.toUpperCase() : (clean.charAt(0).toUpperCase() + clean.slice(1));
                    catMap.set(key, display);
                }
            }
        });

        filterContainer.innerHTML = "";
        const allBtn = document.createElement("button");
        allBtn.type = "button";
        allBtn.className = "cert-filter-btn active";
        allBtn.setAttribute("role", "tab");
        allBtn.setAttribute("aria-selected", "true");
        allBtn.setAttribute("data-cert-filter", "all");
        allBtn.textContent = "All";
        filterContainer.appendChild(allBtn);

        catMap.forEach((displayLabel, key) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "cert-filter-btn";
            btn.setAttribute("role", "tab");
            btn.setAttribute("aria-selected", "false");
            btn.setAttribute("data-cert-filter", key);
            btn.textContent = displayLabel;
            filterContainer.appendChild(btn);
        });

        filterContainer.querySelectorAll(".cert-filter-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                filterContainer.querySelectorAll(".cert-filter-btn").forEach(b => {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                });
                const clicked = e.currentTarget;
                clicked.classList.add("active");
                clicked.setAttribute("aria-selected", "true");

                const filter = clicked.getAttribute("data-cert-filter") || "all";
                renderCertificates(filter);
            });
        });
    }

    let currentCertFilter = "all";
    window.rkRenderCertificates = () => {
        buildCertFilterButtons();
        renderCertificates(currentCertFilter);
    };

    buildCertFilterButtons();
    renderCertificates("all");
}

/* --- 14. EDUCATION TIMELINE ENGINE --- */
function renderEducationTimeline() {
    const container = document.getElementById("educationTimeline");
    if (!container) return;

    if (!Array.isArray(educationData) || educationData.length === 0) {
        return;
    }

    container.innerHTML = "";

    educationData.forEach(edu => {
        const item = document.createElement("div");
        item.className = "timeline-item";

        const marker = document.createElement("div");
        marker.className = "timeline-marker";
        marker.setAttribute("aria-hidden", "true");
        item.appendChild(marker);

        const card = document.createElement("div");
        card.className = "timeline-card";

        const header = document.createElement("div");
        header.className = "timeline-header";

        if (edu.badge) {
            const badge = document.createElement("span");
            const badgeType = (edu.badgeType || "completed").toLowerCase();
            badge.className = `timeline-badge ${badgeType === "current" ? "current" : "completed"}`;
            badge.textContent = edu.badge;
            header.appendChild(badge);
        }

        const title = document.createElement("h3");
        title.className = "timeline-title";
        title.textContent = edu.title || "Education Milestone";
        header.appendChild(title);

        if (edu.institute) {
            const institute = document.createElement("p");
            institute.className = "timeline-institute";
            institute.textContent = edu.institute;
            header.appendChild(institute);
        }
        card.appendChild(header);

        if (edu.desc) {
            const desc = document.createElement("p");
            desc.className = "timeline-desc";
            desc.textContent = edu.desc;
            card.appendChild(desc);
        }

        const tagsList = Array.isArray(edu.tags)
            ? edu.tags
            : (typeof edu.tags === "string" ? edu.tags.split(",").map(t => t.trim()).filter(Boolean) : []);

        if (tagsList.length > 0) {
            const tagsWrap = document.createElement("div");
            tagsWrap.className = "timeline-tags";
            tagsList.forEach(tag => {
                const tagEl = document.createElement("span");
                tagEl.className = "pill-tag";
                tagEl.textContent = tag;
                tagsWrap.appendChild(tagEl);
            });
            card.appendChild(tagsWrap);
        }

        item.appendChild(card);
        container.appendChild(item);
    });
}

window.rkRenderEducation = () => {
    renderEducationTimeline();
};

/* Certificate Modal Image Viewer */
function initCertModal() {
    const modal = document.getElementById("certModal");
    const closeBtn = document.getElementById("closeCertModalBtn");

    if (!modal) return;

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });
}

function openCertModal(cert) {
    const modal = document.getElementById("certModal");
    if (!modal) return;

    lastFocusedElement = document.activeElement;

    const modalTitle = document.getElementById("modalCertTitle");
    const modalOrg = document.getElementById("modalCertOrg");
    const modalImg = document.getElementById("modalCertImg");
    const modalDate = document.getElementById("modalCertDate");
    const verifyWrapper = document.getElementById("modalCertVerifyWrapper");

    if (modalTitle) modalTitle.textContent = cert.title;
    if (modalOrg) modalOrg.textContent = cert.organization;
    if (modalImg) {
        modalImg.src = cert.image;
        modalImg.alt = `Verified Certificate for ${cert.title} - ${cert.organization}`;
    }
    if (modalDate) modalDate.textContent = `Issuance Date: ${cert.date}`;

    if (verifyWrapper) {
        verifyWrapper.innerHTML = "";
        if (cert.verificationUrl && isValidExternalUrl(cert.verificationUrl)) {
            const verifyLink = createOptionalLink({
                url: cert.verificationUrl,
                label: "Verify Online",
                className: "btn btn-primary btn-sm",
                target: "_blank",
                ariaLabel: `Verify ${cert.title} online`
            });
            if (verifyLink) verifyWrapper.appendChild(verifyLink);
        }
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = document.getElementById("closeCertModalBtn");
    if (closeBtn) closeBtn.focus();
}

/* --- 12. ANIMATED STATISTICS (ABOUT SECTION) --- */
function initAnimatedStats() {
    const statCards = document.querySelectorAll(".stat-number[data-target]");
    if (!statCards.length) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statCards.forEach(stat => {
                    const target = parseInt(stat.getAttribute("data-target"), 10);
                    if (isNaN(target)) return;

                    const duration = 1200;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        const currentVal = Math.floor(easeProgress * target);

                        const formatted = currentVal < 10 ? `0${currentVal}+` : `${currentVal}+`;
                        stat.textContent = formatted;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            const finalFormatted = target < 10 ? `0${target}+` : `${target}+`;
                            stat.textContent = finalFormatted;
                        }
                    }

                    requestAnimationFrame(updateCount);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsGrid = document.querySelector(".about-stats-grid");
    if (statsGrid) {
        observer.observe(statsGrid);
    }
}

/* --- 12.5 DYNAMIC SKILLS & TECH COMPACT RENDERER --- */
function renderDynamicSkills(filterCategory = "all") {
    const container = document.getElementById("skillsGridContainer");
    if (!container) return;

    const active = getActivePortfolioData();
    const skillsList = active.skills;
    if (!skillsList || !Array.isArray(skillsList) || skillsList.length === 0) return;

    container.innerHTML = "";

    // Flat list of all skills with parent category
    const allSkills = [];
    skillsList.forEach(group => {
        const cat = group.category || "General";
        (group.items || []).forEach(item => {
            allSkills.push({
                category: cat,
                name: item.name,
                skill: item.skill || item.type || "",
                tech: item.tech || null
            });
        });
    });

    const filtered = (filterCategory === "all")
        ? allSkills
        : allSkills.filter(s => s.category.toLowerCase().includes(filterCategory.toLowerCase()) || filterCategory.toLowerCase().includes(s.category.toLowerCase()));

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "skill-compact-card";

        let iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
        let iconColor = "var(--accent)";
        let iconBg = "rgba(59, 130, 246, 0.12)";

        const lower = (item.name + " " + item.category).toLowerCase();
        if (lower.includes("excel")) {
            iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>`;
            iconColor = "#10b981";
            iconBg = "rgba(16, 185, 129, 0.14)";
        } else if (lower.includes("python")) {
            iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>`;
            iconColor = "#38bdf8";
            iconBg = "rgba(56, 189, 248, 0.14)";
        } else if (lower.includes("sql") || lower.includes("database") || lower.includes("mysql") || lower.includes("postgres")) {
            iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`;
            iconColor = "#06b6d4";
            iconBg = "rgba(6, 182, 212, 0.14)";
        } else if (lower.includes("java") && !lower.includes("javascript")) {
            iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line></svg>`;
            iconColor = "#f59e0b";
            iconBg = "rgba(245, 158, 11, 0.14)";
        } else if (lower.includes("power bi") || lower.includes("analytics") || lower.includes("visualization") || lower.includes("clean")) {
            iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`;
            iconColor = "#a855f7";
            iconBg = "rgba(168, 85, 247, 0.14)";
        } else if (lower.includes("git") || lower.includes("code") || lower.includes("office") || lower.includes("tools")) {
            iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
            iconColor = "#3b82f6";
            iconBg = "rgba(59, 130, 246, 0.14)";
        }

        card.innerHTML = `
            <div class="skill-compact-icon" style="color: ${iconColor}; background: ${iconBg};">
                ${iconSvg}
            </div>
            <div class="skill-compact-info">
                <div class="skill-compact-top">
                    <span class="skill-compact-name">${escapeHtml(item.name)}</span>
                    <span class="skill-compact-category">${escapeHtml(item.category)}</span>
                </div>
                <div class="skill-compact-desc">${escapeHtml(item.skill || item.category)}</div>
            </div>
        `;

        container.appendChild(card);
    });
}

function initSkillsTabs() {
    const tabs = document.querySelectorAll("#skillsFilterPills .skill-tab");
    if (!tabs || tabs.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            tabs.forEach(t => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
            });
            const clicked = e.currentTarget;
            clicked.classList.add("active");
            clicked.setAttribute("aria-selected", "true");
            const cat = clicked.getAttribute("data-skill-cat") || "all";
            renderDynamicSkills(cat);
        });
    });
}

window.rkRenderSkills = renderDynamicSkills;

/* --- 13. CONTACT FORM & STATUS SAFETY --- */
function initContactForm() {
    const form = document.getElementById("contactForm");
    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const subjectInput = document.getElementById("contactSubject");
    const messageInput = document.getElementById("contactMessage");
    const statusNotice = document.getElementById("formStatusNotice");
    const statusText = document.getElementById("formStatusText");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let isValid = true;

        // Reset errors
        document.querySelectorAll(".form-group").forEach(fg => fg.classList.remove("has-error"));

        if (!nameInput.value.trim()) {
            nameInput.closest(".form-group").classList.add("has-error");
            isValid = false;
        }

        const emailVal = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
            emailInput.closest(".form-group").classList.add("has-error");
            isValid = false;
        }

        if (!subjectInput.value.trim()) {
            subjectInput.closest(".form-group").classList.add("has-error");
            isValid = false;
        }

        if (!messageInput.value.trim()) {
            messageInput.closest(".form-group").classList.add("has-error");
            isValid = false;
        }

        if (!isValid) return;

        const nameVal = nameInput.value.trim();
        const emailValStr = emailInput.value.trim();
        const subjectVal = subjectInput.value.trim();
        const messageVal = messageInput.value.trim();

        // Format message for WhatsApp
        const waMsg = encodeURIComponent(
            `*New Message from Portfolio*\n\n` +
            `👤 *Name:* ${nameVal}\n` +
            `📧 *Email:* ${emailValStr}\n` +
            `📌 *Subject:* ${subjectVal}\n\n` +
            `💬 *Message:*\n${messageVal}`
        );

        const phone = "919942760034";
        const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${waMsg}`;

        if (statusNotice && statusText) {
            statusNotice.style.background = "rgba(37, 211, 102, 0.15)";
            statusNotice.style.borderColor = "rgba(37, 211, 102, 0.4)";
            statusNotice.style.color = "#25d366";
            statusText.innerHTML = `Opening WhatsApp to connect directly with <strong>Raushan Kumar</strong>...`;
        }

        try {
            window.open(waUrl, "_blank");
        } catch {
            window.location.href = waUrl;
        }

        form.reset();
    });

    // Populate direct email link if provided in siteConfig
    const emailPlaceholder = document.getElementById("emailLinkPlaceholder");
    if (emailPlaceholder) {
        if (siteConfig.social.email && typeof siteConfig.social.email === "string") {
            emailPlaceholder.innerHTML = "";
            const emailLink = createEmailLink(siteConfig.social.email, siteConfig.social.email);
            if (emailLink) emailPlaceholder.appendChild(emailLink);
        } else {
            emailPlaceholder.textContent = "Available upon request / Open for contact";
        }
    }

    // Populate verified social links if provided
    const contactSocialLinks = document.getElementById("contactSocialLinks");
    const footerSocialContainer = document.getElementById("footerSocialContainer");

    const activeSocials = [];
    if (siteConfig.social.github && isValidExternalUrl(siteConfig.social.github)) {
        activeSocials.push({ label: "GitHub", url: siteConfig.social.github });
    }
    if (siteConfig.social.linkedin && isValidExternalUrl(siteConfig.social.linkedin)) {
        activeSocials.push({ label: "LinkedIn", url: siteConfig.social.linkedin });
    }

    if (contactSocialLinks) {
        contactSocialLinks.innerHTML = "";
        if (activeSocials.length > 0) {
            activeSocials.forEach(item => {
                const link = createOptionalLink({
                    url: item.url,
                    label: item.label,
                    className: "social-btn",
                    target: "_blank",
                    ariaLabel: `Visit Raushan Kumar's ${item.label} profile`
                });
                if (link) contactSocialLinks.appendChild(link);
            });
        } else {
            contactSocialLinks.textContent = "Profile links configurable in script.js";
            contactSocialLinks.style.fontSize = "0.85rem";
            contactSocialLinks.style.color = "var(--text-muted)";
        }
    }

    if (footerSocialContainer) {
        footerSocialContainer.innerHTML = "";
        if (activeSocials.length > 0) {
            activeSocials.forEach(item => {
                const link = createOptionalLink({
                    url: item.url,
                    label: item.label,
                    className: "footer-link",
                    target: "_blank"
                });
                if (link) footerSocialContainer.appendChild(link);
            });
        } else {
            const info = document.createElement("span");
            info.textContent = "Profiles available on direct request";
            info.style.fontSize = "0.85rem";
            info.style.color = "var(--text-muted)";
            footerSocialContainer.appendChild(info);
        }
    }
}

/* --- 14. BACK TO TOP BUTTON --- */
function initBackToTop() {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 380) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    }, { passive: true });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* --- 15. SCROLL REVEAL (INTERSECTION OBSERVER) --- */
function initScrollReveal() {
    // Check if user requested reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const sections = document.querySelectorAll(".section, .hero-section");
    sections.forEach(sec => sec.classList.add("reveal"));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(sec => observer.observe(sec));
}

/* --- 16. APPLY ADMIN SITE CONFIGURATION DYNAMICALLY --- */
function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function applyAdminSiteConfig() {
    if (!siteConfig) return;

    // 1. Full Name across portfolio
    if (siteConfig.name) {
        document.title = `${siteConfig.name} | Professional Portfolio`;

        const heroTitle = document.getElementById("hero-title");
        if (heroTitle) heroTitle.textContent = siteConfig.name.toUpperCase();

        const brandName = document.querySelector(".brand-name");
        if (brandName) brandName.textContent = siteConfig.name;

        const footerBrand = document.querySelector(".footer-brand-title");
        if (footerBrand) footerBrand.textContent = siteConfig.name;

        // Initials in brand badge
        const initials = siteConfig.name.split(" ").map(w => w[0]).join("").toUpperCase().substring(0, 2);
        if (initials) {
            document.querySelectorAll(".brand-badge").forEach(b => b.textContent = initials);
        }
    }

    // 2. Headline / Hero Subtitle
    if (siteConfig.headline) {
        const heroSub = document.querySelector(".hero-subtitle");
        if (heroSub) {
            const parts = siteConfig.headline.split("|").map(s => s.trim());
            if (parts.length > 1) {
                heroSub.innerHTML = parts.map((part, idx) => {
                    return idx < parts.length - 1
                        ? `${escapeHtml(part)} <span class="divider-dot" aria-hidden="true">•</span> `
                        : escapeHtml(part);
                }).join("");
            } else {
                heroSub.textContent = siteConfig.headline;
            }
        }
    }

    // 3. Hero Intro
    if (siteConfig.heroIntro) {
        const heroIntro = document.querySelector(".hero-intro");
        if (heroIntro) heroIntro.textContent = siteConfig.heroIntro;
    }

    // 4. About Section Greeting / Title
    const bioTitle = document.querySelector(".about-bio-card .bio-title");
    if (bioTitle) {
        if (siteConfig.aboutGreeting) {
            bioTitle.textContent = siteConfig.aboutGreeting;
        } else if (siteConfig.name) {
            bioTitle.textContent = `Hello, I am ${siteConfig.name}.`;
        }
    }

    // 5. About Section Subtitle
    if (siteConfig.aboutSubtitle) {
        const aboutHeading = document.getElementById("about-heading");
        if (aboutHeading) aboutHeading.textContent = siteConfig.aboutSubtitle;
    }

    // 6. About Section Bio Paragraphs
    const bioParagraphs = document.querySelectorAll(".about-bio-card .bio-text");
    if (bioParagraphs.length >= 3) {
        if (siteConfig.bio1) bioParagraphs[0].textContent = siteConfig.bio1;
        if (siteConfig.bio2) bioParagraphs[1].textContent = siteConfig.bio2;
        if (siteConfig.bio3) bioParagraphs[2].textContent = siteConfig.bio3;
    }

    // 7. About Highlight Tags
    if (siteConfig.aboutTags) {
        const tagsContainer = document.querySelector(".about-tags");
        if (tagsContainer) {
            const tagList = siteConfig.aboutTags.split(",").map(t => t.trim()).filter(Boolean);
            if (tagList.length > 0) {
                tagsContainer.innerHTML = tagList.map(tag => `<span class="pill-tag">${escapeHtml(tag)}</span>`).join("");
            }
        }
    }

    // 8. Animated Stats in About Section
    const statCards = document.querySelectorAll(".about-stats-grid .stat-number");
    if (statCards.length >= 3) {
        if (siteConfig.statProjects !== undefined && siteConfig.statProjects !== null) {
            statCards[0].setAttribute("data-target", siteConfig.statProjects);
            const val = siteConfig.statProjects;
            statCards[0].textContent = val < 10 ? `0${val}+` : `${val}+`;
        }
        if (siteConfig.statTech !== undefined && siteConfig.statTech !== null) {
            statCards[1].setAttribute("data-target", siteConfig.statTech);
            const val = siteConfig.statTech;
            statCards[1].textContent = val < 10 ? `0${val}+` : `${val}+`;
        }
        if (siteConfig.statCerts !== undefined && siteConfig.statCerts !== null) {
            statCards[2].setAttribute("data-target", siteConfig.statCerts);
            const val = siteConfig.statCerts;
            statCards[2].textContent = val < 10 ? `0${val}+` : `${val}+`;
        }
    }

    // 9. Profile Photos (Custom uploads from Admin Panel)
    const photos = (siteConfig.photos && Array.isArray(siteConfig.photos))
        ? siteConfig.photos
        : (_adminData && Array.isArray(_adminData.photos) ? _adminData.photos : null);

    if (photos && photos.length > 0) {
        const img0 = document.getElementById("profileImg0");
        const img1 = document.getElementById("profileImg1");
        const img2 = document.getElementById("profileImg2");

        const formatPhotoSrc = (src) => {
            if (!src) return src;
            if (src.startsWith("data:") || src.includes("?")) return src;
            return `${src}?v=2`;
        };

        if (img0 && photos[0]) img0.src = formatPhotoSrc(photos[0]);
        if (img1 && photos[1]) img1.src = formatPhotoSrc(photos[1]);
        if (img2 && photos[2]) img2.src = formatPhotoSrc(photos[2]);
    }

    // 10. Status Badge & Subtitles (Configurable via Admin Panel)
    const statusBadgeElem = document.getElementById("profileStatusBadgeText");
    if (statusBadgeElem && siteConfig.statusBadge) {
        statusBadgeElem.textContent = siteConfig.statusBadge;
    }

    const oppSubElem = document.getElementById("contactSectionSubtitle");
    if (oppSubElem && siteConfig.opportunitySubtitle) {
        oppSubElem.textContent = siteConfig.opportunitySubtitle;
    }

    const expRoleElem = document.getElementById("experienceInternshipRole");
    if (expRoleElem && siteConfig.experienceInternshipTitle) {
        expRoleElem.textContent = siteConfig.experienceInternshipTitle;
    }

    // 11. Footer Thank You Message (Configurable via Admin Panel)
    const thankYouElem = document.getElementById("thankYouTextDisplay");
    if (thankYouElem && siteConfig.thankYouText) {
        thankYouElem.textContent = siteConfig.thankYouText;
    }

    // 12. Profile Compact Social Mini Chips (YouTube, Instagram, GFG, Git & Auto-detected Links)
    renderProfileSocialChips();
}

/* Helper to normalize social URLs */
function formatSocialUrl(platform, input) {
    if (!input || typeof input !== "string") return null;
    let clean = input.trim();
    if (!clean) return null;
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
        return clean;
    }
    clean = clean.replace(/^[@/]+/, "");
    if (platform === "instagram") {
        return `https://www.instagram.com/${clean}`;
    }
    if (platform === "gfg") {
        return `https://www.geeksforgeeks.org/user/${clean}/`;
    }
    if (platform === "git" || platform === "github") {
        return `https://github.com/${clean}`;
    }
    if (platform === "youtube") {
        return `https://youtube.com/@${clean}`;
    }
    return `https://${clean}`;
}

/* Detect platform, icon, colors and labels automatically from URL */
function detectSocialPlatform(url) {
    if (!url || typeof url !== "string") {
        return {
            platform: "custom",
            name: "Link",
            color: "#38bdf8",
            cls: "chip-custom",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
        };
    }
    const lower = url.toLowerCase().trim();
    if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
        return {
            platform: "youtube",
            name: "YouTube",
            color: "#ff0000",
            cls: "chip-youtube",
            svg: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
        };
    }
    if (lower.includes("instagram.com")) {
        return {
            platform: "instagram",
            name: "Instagram",
            color: "#e1306c",
            cls: "chip-instagram",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
        };
    }
    if (lower.includes("geeksforgeeks.org")) {
        return {
            platform: "gfg",
            name: "GFG",
            color: "#2f8d46",
            cls: "chip-gfg",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm6 8h-4v-2h2v-2h-2v-2h4v6z"/></svg>`
        };
    }
    if (lower.includes("github.com") || lower.includes("git.")) {
        return {
            platform: "git",
            name: "Git",
            color: "#f05032",
            cls: "chip-git",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`
        };
    }
    if (lower.includes("linkedin.com")) {
        return {
            platform: "linkedin",
            name: "LinkedIn",
            color: "#0a66c2",
            cls: "chip-linkedin",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`
        };
    }
    if (lower.includes("twitter.com") || lower.includes("x.com")) {
        return {
            platform: "x",
            name: "X",
            color: "#f8fafc",
            cls: "chip-x",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
        };
    }
    if (lower.includes("leetcode.com")) {
        return {
            platform: "leetcode",
            name: "LeetCode",
            color: "#ffa116",
            cls: "chip-leetcode",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.816 3.75 5.58 5.58 0 0 0 1.258-.027 5.75 5.75 0 0 0 1.838-.609l6.574-4.225a1.385 1.385 0 0 0 .445-1.916 1.386 1.386 0 0 0-1.912-.439l-6.545 4.204a3.02 3.02 0 0 1-1.01.332 3.12 3.12 0 0 1-2.482-1.923 3.02 3.02 0 0 1-.18-.543 3.137 3.137 0 0 1-.036-1.307 2.97 2.97 0 0 1 .684-1.189l3.854-4.126 5.406-5.788a1.386 1.386 0 0 0-1.026-2.316zm3.328 14.733l-5.358 5.736a1.386 1.386 0 0 0 1.018 2.331 1.374 1.374 0 0 0 .96-.438l5.36-5.736a1.386 1.386 0 0 0-1.98-1.933v.04z"/></svg>`
        };
    }
    try {
        const u = new URL(lower.startsWith("http") ? lower : `https://${lower}`);
        const domain = u.hostname.replace(/^www\./, "");
        return {
            platform: "custom",
            name: domain.split(".")[0],
            color: "#38bdf8",
            cls: "chip-custom",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`
        };
    } catch {
        return {
            platform: "custom",
            name: "Profile",
            color: "#38bdf8",
            cls: "chip-custom",
            svg: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
        };
    }
}

/* Render Small Compact Mini Chips under Profile Photo */
function renderProfileSocialChips() {
    const list = document.getElementById("profileSocialButtonsList");
    if (!list) return;
    list.innerHTML = "";

    const s = (siteConfig && siteConfig.social) ? siteConfig.social : {};
    const chips = [];

    if (s.instagram) {
        chips.push({
            url: formatSocialUrl("instagram", s.instagram),
            ...detectSocialPlatform("https://instagram.com")
        });
    }
    if (s.gfg) {
        chips.push({
            url: formatSocialUrl("gfg", s.gfg),
            ...detectSocialPlatform("https://geeksforgeeks.org")
        });
    }
    if (s.github) {
        chips.push({
            url: formatSocialUrl("git", s.github),
            ...detectSocialPlatform("https://github.com")
        });
    }
    if (s.youtube) {
        chips.push({
            url: formatSocialUrl("youtube", s.youtube),
            ...detectSocialPlatform("https://youtube.com")
        });
    }
    if (s.linkedin) {
        chips.push({
            url: formatSocialUrl("linkedin", s.linkedin),
            ...detectSocialPlatform("https://linkedin.com")
        });
    }
    if (Array.isArray(s.custom)) {
        s.custom.forEach(item => {
            if (item && item.url) {
                const detected = detectSocialPlatform(item.url);
                chips.push({
                    url: item.url,
                    ...detected,
                    name: item.label || detected.name
                });
            }
        });
    }

    chips.forEach(chip => {
        const a = document.createElement("a");
        a.href = chip.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = `profile-social-chip ${chip.cls}`;
        a.title = `Connect on ${chip.name} (${chip.url})`;
        a.setAttribute("aria-label", `Connect with Raushan Kumar on ${chip.name}`);

        a.innerHTML = `
            <span class="chip-icon-box" style="color:${chip.color};">
                ${chip.svg}
            </span>
            <span class="chip-label">${escapeHtml(chip.name)}</span>
        `;
        list.appendChild(a);
    });
}

/* ============================================================
   17. LIVE-SYNC & AUTO-HEALING ENGINE (SELF-RECOVERY & AUTO-UPDATE)
============================================================ */

/**
 * Toast notifications for Live-Sync and Auto-Healing
 */
function showLiveSyncToast(title, desc) {
    const toast = document.getElementById("systemSyncToast");
    if (!toast) return;

    const icon = document.getElementById("systemSyncIcon");
    const titleEl = document.getElementById("systemSyncTitle");
    const descEl = document.getElementById("systemSyncDesc");

    if (icon) icon.textContent = "✨";
    if (titleEl) titleEl.textContent = title || "Live Update Synced";
    if (descEl) descEl.textContent = desc || "Website updated instantly across tabs";

    toast.className = "system-sync-toast live-update";
    toast.style.display = "flex";
    requestAnimationFrame(() => {
        toast.classList.add("visible");
    });

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => { toast.style.display = "none"; }, 400);
    }, 3800);
}

function showAutoHealToast(desc) {
    const toast = document.getElementById("systemSyncToast");
    if (!toast) return;

    const icon = document.getElementById("systemSyncIcon");
    const titleEl = document.getElementById("systemSyncTitle");
    const descEl = document.getElementById("systemSyncDesc");

    if (icon) icon.textContent = "🛡️";
    if (titleEl) titleEl.textContent = "Auto-Recovery Active";
    if (descEl) descEl.textContent = desc || "System self-repaired and restored stability";

    toast.className = "system-sync-toast auto-heal";
    toast.style.display = "flex";
    requestAnimationFrame(() => {
        toast.classList.add("visible");
    });

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => { toast.style.display = "none"; }, 400);
    }, 4500);
}

/**
 * Handles incoming real-time update pulses from Admin Panel
 */
let _lastSyncTimestamp = 0;
function handleLiveUpdateSignal(sourceInfo) {
    const now = Date.now();
    if (now - _lastSyncTimestamp < 350) return; // Prevent excessive rapid re-renders
    _lastSyncTimestamp = now;

    try {
        const active = getActivePortfolioData();
        _adminData = active.raw;
        siteConfig = active.siteConfig;
        projectsData = active.projects;
        certificatesData = active.certificates;
        educationData = active.education;

        // Re-apply site configurations
        applyAdminSiteConfig();

        // Re-render project cards if available
        if (typeof window.rkRenderProjects === "function") {
            window.rkRenderProjects();
        }

        // Re-render certificate cards if available
        if (typeof window.rkRenderCertificates === "function") {
            window.rkRenderCertificates();
        }

        // Re-render education timeline if available
        if (typeof window.rkRenderEducation === "function") {
            window.rkRenderEducation();
        }

        // Re-render dynamic skills if available
        if (typeof window.rkRenderSkills === "function") {
            window.rkRenderSkills();
        }

        // Re-render resume link if container exists
        const resumeContainer = document.getElementById("heroResumeContainer");
        if (resumeContainer && siteConfig.resume) {
            renderResumeLink(siteConfig.resume, resumeContainer);
        }

        showLiveSyncToast("✨ Live Update Synced", "All changes updated instantly without refresh");
        console.log("⚡ [LiveSync] Successfully synchronized UI with latest data:", sourceInfo);
    } catch (err) {
        console.warn("🛡️ [LiveSync] Error during sync reload, triggering auto-heal:", err);
        sanitizeAndRepairStorage();
    }
}

/**
 * Live Sync Engine Initialization
 */
function initLiveSyncEngine() {
    // 1. BroadcastChannel listener (Zero-latency same-origin tab sync)
    if (typeof BroadcastChannel !== "undefined") {
        try {
            const bc = new BroadcastChannel("rk_portfolio_sync");
            bc.onmessage = (e) => {
                handleLiveUpdateSignal(e.data || { type: "broadcast" });
            };
        } catch (bcErr) {
            console.warn("BroadcastChannel not available:", bcErr);
        }
    }

    // 2. Storage event listener (Cross-tab sync)
    window.addEventListener("storage", (e) => {
        if (e.key === ADMIN_DATA_KEY || e.key === "rk_system_pulse") {
            handleLiveUpdateSignal({ type: "storage_event", key: e.key });
        }
    });

    // 3. Tab visibility / focus synchronization
    let lastSeenPulse = localStorage.getItem("rk_system_pulse");
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            const currentPulse = localStorage.getItem("rk_system_pulse");
            if (currentPulse && currentPulse !== lastSeenPulse) {
                lastSeenPulse = currentPulse;
                handleLiveUpdateSignal({ type: "focus_sync" });
            }
        }
    });

    // 4. Automatic Image Error Fallback Auto-Healing
    document.addEventListener("error", (e) => {
        const target = e.target;
        if (target && target.tagName === "IMG") {
            if (target.classList.contains("profile-img") || target.id.startsWith("profileImg")) {
                if (!target._fallbackApplied) {
                    target._fallbackApplied = true;
                    console.warn("🛡️ Auto-Recovery: Profile image failed, falling back to default:", target.src);
                    target.src = "images/profile-1.jpg?v=2";
                }
            } else if (target.classList.contains("project-img")) {
                if (!target._fallbackApplied) {
                    target._fallbackApplied = true;
                    console.warn("🛡️ Auto-Recovery: Project image failed, falling back:", target.src);
                    target.src = "images/projects/grand-stay.jpg";
                }
            } else if (target.classList.contains("cert-modal-img")) {
                if (!target._fallbackApplied) {
                    target._fallbackApplied = true;
                    target.src = "certificates/ibm-data-science.jpg";
                }
            }
        }
    }, true);
}

/**
 * Global Error Boundary & Crash Protection
 */
function handleGlobalCrash(type, detail) {
    console.error(`🛡️ [Auto-Recovery Engine] Intercepted ${type}:`, detail);

    const detailStr = String(detail || "");
    if (
        detailStr.includes("JSON") ||
        detailStr.includes("Cannot read properties") ||
        detailStr.includes("null") ||
        detailStr.includes("undefined")
    ) {
        const fixed = sanitizeAndRepairStorage();
        if (fixed) {
            const count = parseInt(sessionStorage.getItem("rk_crash_recoveries") || "0", 10);
            if (count < 2) {
                sessionStorage.setItem("rk_crash_recoveries", String(count + 1));
                setTimeout(() => {
                    sessionStorage.removeItem("rk_crash_recoveries");
                }, 15000);
                showAutoHealToast("Bug auto-healed: restored stable data state");
            }
        }
    }
}

window.addEventListener("error", (event) => {
    handleGlobalCrash("runtime_error", event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
    handleGlobalCrash("unhandled_rejection", event.reason);
});

/**
 * Safe initializer wrapper so one failing module never crashes the site
 */
function safeInit(name, fn) {
    try {
        fn();
    } catch (err) {
        console.error(`🛡️ Auto-Recovery caught error during [${name}] initialization:`, err);
        showAutoHealToast(`Self-healed ${name} module after minor issue.`);
    }
}

/* --- 18. INITIALIZATION ON DOM CONTENT LOADED --- */
document.addEventListener("DOMContentLoaded", () => {
    safeInit("siteConfig", applyAdminSiteConfig);
    safeInit("theme", initTheme);
    safeInit("navbar", initNavbar);
    safeInit("profileRotator", initProfileRotator);
    safeInit("projects", initProjects);
    safeInit("projectModal", initProjectModal);
    safeInit("education", renderEducationTimeline);
    safeInit("certificates", initCertificates);
    safeInit("certModal", initCertModal);
    safeInit("animatedStats", initAnimatedStats);
    safeInit("contactForm", initContactForm);
    safeInit("dynamicSkills", renderDynamicSkills);
    safeInit("skillsTabs", initSkillsTabs);
    safeInit("backToTop", initBackToTop);
    safeInit("scrollReveal", initScrollReveal);
    safeInit("liveSyncEngine", initLiveSyncEngine);

    // Render resume button safely
    const resumeContainer = document.getElementById("heroResumeContainer");
    if (resumeContainer && siteConfig.resume) {
        renderResumeLink(siteConfig.resume, resumeContainer);
    }

    // Keyboard shortcut for quick Admin Panel access (Ctrl + Shift + A)
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
            e.preventDefault();
            window.location.href = "admin.html";
        }
    });
});
