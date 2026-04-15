/* ==========================================================================
   AGRANI PORTFOLIO - FULL UPDATED SCRIPT.JS
   ==========================================================================
   FEATURES
   --------------------------------------------------------------------------
   1. VS Code-style tab system
   2. Copilot opens ONLY on right side
   3. copilot.md / copilot file item auto-removed
   4. File menu close tab / close all / close others
   5. Command palette
   6. Sidebar and activity bar sync
   7. Voice assistant
   8. Smart navigation from Copilot
   9. Real JS execution in terminal
   10. Python execution via Pyodide if available
   11. Motion.dev animation hooks if loaded
   12. Responsive safety helpers
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ==========================================================================
     DOM REFERENCES
     ========================================================================== */

  const editorContent = document.getElementById("editorContent");
  const tabsContainer = document.getElementById("editorTabs");

  const paletteOverlay = document.getElementById("paletteOverlay");
  const paletteBackdrop = document.getElementById("paletteBackdrop");
  const openPaletteBtn = document.getElementById("openPaletteBtn");
  const paletteInput = document.getElementById("paletteInput");
  const settingsPanel = document.getElementById("settingsPanel");

  const red = document.getElementById("btnRed");
  const yellow = document.getElementById("btnYellow");
  const green = document.getElementById("btnGreen");
  const feedback = document.getElementById("headerFeedback");

  const cursorSquare = document.getElementById("cursorSquare");
  const cursorDot = document.getElementById("cursorDot");

  const terminal = document.getElementById("terminalPanel");
  const terminalBody = document.getElementById("terminalBody");
  const terminalInput = document.getElementById("terminalInput");

  let sidebarFiles = [];
  let menuItems = [];
  let paletteItems = [];

  /* ==========================================================================
     GLOBAL STATE
     ========================================================================== */

  let openTabs = [];
  let activeTab = "";
  let currentPaletteIndex = 0;
  let currentDir = "~";
  let terminalHistory = [];
  let terminalHistoryIndex = -1;
  let pyodideInstance = null;
  let isCopilotOpen = false;
  let currentTheme = "dark";

  const STORAGE_KEYS = {
    theme: "agrani_portfolio_theme_v2",
    tabs: "agrani_portfolio_tabs_v2",
    activeTab: "agrani_portfolio_active_tab_v2",
    terminalHistory: "agrani_portfolio_terminal_history_v2",
    copilotOpen: "agrani_portfolio_copilot_open_v2"
  };

  const funnyQuotes = [
    "Nice try 😏 but I’ll stay open.",
    "You can’t close me that easily 😎",
    "Still running and glowing ✨",
    "This portfolio is immortal 🚀",
    "Denied 😈"
  ];

  const TAB_LABELS = {
    home: "⚛ home.tsx",
    about: "🌐 about.html",
    projects: "🟨 projects.js",
    skills: "🟩 skills.json",
    experience: "🟦 experience.ts",
    contact: "🎨 contact.css",
    readme: "📄 README.md",
    resume: "📕 Resume.pdf"
  };

  const TAB_ORDER = [
    "home",
    "about",
    "projects",
    "skills",
    "experience",
    "contact",
    "readme",
    "resume"
  ];

   // AFTER initialization (BOTTOM of DOMContentLoaded)

   const copilotSidebarEl = document.getElementById("copilotSidebar");
   
   if (copilotSidebarEl) {
     copilotSidebarEl.addEventListener("click", (e) => {
       if (
         copilotSidebarEl.classList.contains("minimized") &&
         e.target.closest(".copilot-side-header")
       ) {
         minimizeCopilot();
       }
     });
   }
   
   const settingsPanelEl = document.getElementById("settingsPanel");
   
   if (settingsPanelEl) {
     settingsPanelEl.addEventListener("click", (e) => {
       if (
         settingsPanelEl.classList.contains("minimized") &&
         e.target.closest(".settings-header")
       ) {
         minimizeSettings();
       }
     });
   }

  const COPILOT_REPLIES = {
    intro:
      "Hi — I’m Agrani’s portfolio copilot. Ask about projects, experience, skills, education, healthcare AI work, or contact details.",
    projects:
      "Agrani has built projects across ML drug discovery, Flutter inventory systems, healthcare chatbots, AI plant identification, bioinformatics, AI game systems, and practical healthcare technology solutions.",
    experience:
      "Agrani’s experience includes Clinical Informatics Intern at Alivia Care, Data Science Analyst at BluCognition, Academic Research Associate at Digiversal, and research work in bioinformatics and diagnostics.",
    skills:
      "Core skills include Python, Java, C/C++, JavaScript, HTML/CSS, Flutter, TensorFlow, Machine Learning, Computer Vision, SAS, Excel, EHRGo, WellSky, Android Studio, GitHub, and healthcare analytics.",
    education:
      "Agrani is pursuing an M.S. in Health Informatics at the University of North Florida and completed an Integrated Master of Technology in Biotechnology from JIIT.",
    contact:
      "You can contact Agrani at agbrian521@gmail.com, phone (904) 228-1179, based in Jacksonville, FL.",
    healthcare:
      "Agrani’s work focuses on AI-driven healthcare systems, clinical informatics, healthcare analytics, digital health solutions, EHR-centered workflows, and practical intelligent systems.",
    leadership:
      "Agrani has served as Marketing Chair in the Health Informatics & Analytics Club and has worked on healthcare outreach, podcast coordination, and student engagement initiatives.",
    resume:
      "You can open the Resume tab or use the File menu to download Agrani’s latest resume.",
    default:
      "I can answer questions about Agrani’s projects, experience, skills, education, healthcare AI focus, leadership, resume, and contact details."
  };

  /* ==========================================================================
     DYNAMIC VIEW REGISTRY
     ========================================================================== */

  function getViews() {
    return {
      home: getHome(),
      about: getAbout(),
      projects: getProjects(),
      skills: getSkills(),
      experience: getExperience(),
      contact: getContact(),
      readme: getReadme(),
      resume: getResume()
    };
  }

  /* ==========================================================================
     BASIC HELPERS
     ========================================================================== */

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function safeText(value) {
    return String(value ?? "").trim();
  }

  function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
  }

  function debounce(fn, delay = 150) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function createElement(tag, className = "", html = "") {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html) el.innerHTML = html;
    return el;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updateCollections() {
    sidebarFiles = qsa(".file");
    menuItems = qsa(".menu-item");
    paletteItems = qsa(".palette-item");
  }

  function persistState() {
    try {
      localStorage.setItem(STORAGE_KEYS.theme, currentTheme);
      localStorage.setItem(STORAGE_KEYS.tabs, JSON.stringify(openTabs));
      localStorage.setItem(STORAGE_KEYS.activeTab, activeTab);
      localStorage.setItem(STORAGE_KEYS.terminalHistory, JSON.stringify(terminalHistory.slice(-60)));
      localStorage.setItem(STORAGE_KEYS.copilotOpen, JSON.stringify(isCopilotOpen));
    } catch (_error) {
      /* ignore */
    }
  }

  function restoreState() {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
      const storedTabs = JSON.parse(localStorage.getItem(STORAGE_KEYS.tabs) || "[]");
      const storedActive = localStorage.getItem(STORAGE_KEYS.activeTab);
      const storedTerminalHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.terminalHistory) || "[]");
      const storedCopilotOpen = JSON.parse(localStorage.getItem(STORAGE_KEYS.copilotOpen) || "false");

      if (storedTheme) {
        currentTheme = storedTheme;
      }

      if (Array.isArray(storedTabs) && storedTabs.length) {
        openTabs = storedTabs.filter((tab) => TAB_ORDER.includes(tab));
      }

      if (storedActive && TAB_ORDER.includes(storedActive)) {
        activeTab = storedActive;
      }

      if (Array.isArray(storedTerminalHistory)) {
        terminalHistory = storedTerminalHistory;
      }

      if (typeof storedCopilotOpen === "boolean") {
        isCopilotOpen = storedCopilotOpen;
      }
    } catch (_error) {
      /* ignore */
    }
  }

  /* ==========================================================================
     NORMALIZATION
     ========================================================================== */

  function normalizeName(name) {
    const value = String(name).toLowerCase().trim();

    if (value.includes("home")) return "home";
    if (value.includes("about")) return "about";
    if (value.includes("project")) return "projects";
    if (value.includes("skill")) return "skills";
    if (value.includes("experience")) return "experience";
    if (value.includes("contact")) return "contact";
    if (value.includes("readme")) return "readme";
    if (value.includes("resume")) return "resume";

    return "home";
  }

  function getIcon(tab) {
    return TAB_LABELS[tab] ? TAB_LABELS[tab].split(" ")[0] : "📄";
  }

  function getLabel(tab) {
    return TAB_LABELS[tab] || `📄 ${tab}`;
  }

  function isValidTab(tab) {
    return TAB_ORDER.includes(tab);
  }

  /* ==========================================================================
     REMOVE COPILOT.MD / COPILOT FILE ITEM
     ========================================================================== */

  function removeCopilotFileEntries() {
    qsa(".file").forEach((file) => {
      const text = file.textContent.toLowerCase();
      if (text.includes("copilot")) {
        file.remove();
      }
    });

    qsa(".palette-item").forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes("copilot.md")) {
        item.remove();
      }
    });

    qsa(".dropdown div").forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes("copilot.md")) {
        item.remove();
      }
    });

    updateCollections();
  }

  /* ==========================================================================
     CREATE RIGHT-SIDE COPILOT PANEL IF NOT PRESENT
     ========================================================================== */

  function ensureCopilotSidebar() {
    let panel = document.getElementById("copilotSidebar");

    if (panel) return panel;

    panel = createElement("aside", "copilot-sidebar");
    panel.id = "copilotSidebar";
    panel.setAttribute("aria-hidden", "true");

    panel.innerHTML = `
      <div class="copilot-side-header">
        <div class="copilot-side-title">✨ Agrani's Copilot</div>
        <div class="copilot-side-actions">
          <button class="copilot-side-minimize" id="copilotSideMinimize" type="button" aria-label="Minimize Copilot">—</button>
          <button class="copilot-side-close" id="copilotSideClose" type="button" aria-label="Close Copilot">×</button>
        </div>
      </div>

      <div class="copilot-workspace-row">
        <span class="copilot-workspace-label">WORKSPACE</span>
        <span class="copilot-workspace-pill">● portfolio · agrani-sinha</span>
      </div>

      <div class="copilot-side-hero">
        <div class="copilot-avatar-ring">
          <div class="copilot-avatar-core">🙂</div>
        </div>
        <h3>Hi! I'm Agrani's Copilot 👋</h3>
        <p>
          Ask me about projects, skills, experience, education, healthcare AI work,
          leadership, resume, or contact details.
        </p>
      </div>

      <div class="copilot-suggest-grid">
        <button class="copilot-suggest" data-quick="Tell me about Agrani's projects">
          Tell me about Agrani's projects
        </button>
        <button class="copilot-suggest" data-quick="What is Agrani's tech stack?">
          What's her tech stack?
        </button>
        <button class="copilot-suggest" data-quick="Tell me about Agrani's experience">
          Tell me about her experience
        </button>
        <button class="copilot-suggest" data-quick="How can I contact Agrani?">
          How can I contact Agrani?
        </button>
      </div>

      <div class="copilot-side-messages" id="copilotMessages"></div>

      <div class="copilot-side-input-wrap">
        <div class="copilot-input-row">
          <input
            id="copilotInput"
            type="text"
            placeholder="Ask about Agrani..."
            autocomplete="off"
          />
          <button id="copilotSend" type="button" aria-label="Send">➤</button>
          <button id="copilotVoice" type="button" aria-label="Voice assistant">🎤</button>
        </div>
        <div class="copilot-side-note">
          AI can make mistakes • Contact Agrani directly for important info
        </div>
      </div>
    `;

    const appShell = document.querySelector(".app-shell") || document.body;
    appShell.appendChild(panel);

    return panel;
  }

  const copilotSidebar = ensureCopilotSidebar();

  /* ==========================================================================
     THEME
     ========================================================================== */

  function applyTheme(theme) {
    currentTheme = theme || "dark";

    document.body.classList.remove("rose", "tokyo", "cat", "nord", "gruv");
    if (currentTheme !== "dark") {
      document.body.classList.add(currentTheme);
    }

    qsa(".theme-option").forEach((el) => el.classList.remove("active"));
    qsa(".theme-option").forEach((el) => {
      const text = el.textContent.toLowerCase();
      const match =
        (currentTheme === "dark" && text.includes("dark")) ||
        (currentTheme === "rose" && text.includes("ros")) ||
        (currentTheme === "tokyo" && text.includes("tokyo")) ||
        (currentTheme === "cat" && text.includes("cat")) ||
        (currentTheme === "nord" && text.includes("nord")) ||
        (currentTheme === "gruv" && text.includes("gruv"));

      if (match) el.classList.add("active");
    });

    persistState();
  }

  window.setTheme = function setTheme(theme) {
    applyTheme(theme);
  };

  window.toggleSettings = function toggleSettings() {
  const panel = document.getElementById("settingsPanel");

  if (!panel) return;

  const isOpen = panel.classList.contains("open");

  if (isOpen) {
    panel.classList.remove("open");
    panel.classList.remove("minimized");
  } else {
    panel.classList.add("open");
    panel.classList.remove("minimized");
  }
};

  /* ==========================================================================
     SIDEBAR / ACTIVITY BAR
     ========================================================================== */

  function setActivityActive(type) {
    qsa(".activity-icon").forEach((icon) => {
      icon.classList.remove("active");
    });

    const map = {
      explorer: 0,
      search: 1,
      git: 2,
      files: 3,
      copilot: 4
    };

    const index = map[type];
    const icons = qsa(".activity-icon");

    if (typeof index === "number" && icons[index]) {
      icons[index].classList.add("active");
    }
  }

  window.openSidebar = function openSidebar(type) {
    setActivityActive(type);

    if (type === "copilot") {
      toggleCopilotSidebar(true);
      return;
    }

    if (type === "explorer") {
      const panel = document.querySelector(".sidebar-panel");
      if (panel) panel.classList.remove("hide");
      return;
    }

    if (type === "search") {
      openPalette();
      return;
    }

    if (type === "git") {
      printToTerminal("Git panel is simulated. Use `git log` in terminal.", "warning");
      return;
    }

    if (type === "files") {
      openTab("readme");
      return;
    }
  };

  function toggleSidebar() {
    const panel = document.querySelector(".sidebar-panel");
    if (panel) panel.classList.toggle("hide");
  }

  window.toggleSidebar = toggleSidebar;

  /* ==========================================================================
     COPILOT SIDEBAR CONTROL
     ========================================================================== */

 function toggleCopilotSidebar(force) {
  const sidebar = document.getElementById("copilotSidebar");
  const editor = document.querySelector(".editor-area");

  if (!sidebar) return;

  if (force === true) {
    isCopilotOpen = true;
    sidebar.classList.add("open");
    sidebar.classList.remove("minimized");
    editor && editor.classList.add("with-copilot");
    return;
  }

  if (force === false) {
    isCopilotOpen = false;
    sidebar.classList.remove("open");
    sidebar.classList.remove("minimized");
    editor && editor.classList.remove("with-copilot");
    return;
  }

  isCopilotOpen = !sidebar.classList.contains("open");

  sidebar.classList.toggle("open", isCopilotOpen);

  if (!isCopilotOpen) {
    sidebar.classList.remove("minimized");
  }

  editor && editor.classList.toggle("with-copilot", isCopilotOpen);
}

  window.toggleCopilotSidebar = toggleCopilotSidebar;

  /* ==========================================================================
     TABS
     ========================================================================== */

  function setActiveSidebar(tabName) {
    sidebarFiles.forEach((file) => {
      const fileText = file.textContent.toLowerCase();
      const match =
        (tabName === "home" && fileText.includes("home")) ||
        (tabName === "about" && fileText.includes("about")) ||
        (tabName === "projects" && fileText.includes("projects")) ||
        (tabName === "skills" && fileText.includes("skills")) ||
        (tabName === "experience" && fileText.includes("experience")) ||
        (tabName === "contact" && fileText.includes("contact")) ||
        (tabName === "readme" && fileText.includes("readme")) ||
        (tabName === "resume" && fileText.includes("resume"));

      file.classList.toggle("active", match);
    });
  }

  function renderTabs() {
    if (!tabsContainer) return;

    tabsContainer.innerHTML = "";

    openTabs.forEach((tab) => {
      const el = document.createElement("div");
      el.className = `tab ${tab === activeTab ? "active" : ""}`;
      el.dataset.tab = tab;

      el.innerHTML = `
        <span class="tab-icon">${getIcon(tab)}</span>
        <span class="tab-label">${escapeHtml(getLabel(tab).replace(/^[^\s]+\s/, ""))}</span>
        <span class="tab-close" aria-label="Close tab">×</span>
      `;

      el.addEventListener("click", () => {
        openTab(tab);
      });

      const closeBtn = el.querySelector(".tab-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          closeTab(tab);
        });
      }

      tabsContainer.appendChild(el);
    });
  }

  function animateInsertedContent() {
    if (!editorContent) return;

    const targets = editorContent.querySelectorAll(
      ".hero-name, .roles span, .hero-desc, .home-buttons button, .stat-card, .about-card, .project-card, .timeline-item, .skills-chip, .profile-wrapper"
    );

    targets.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.45s ease, transform 0.45s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 40 + index * 35);
    });
  }

  function runMotionAnimations() {
    if (!window.motionAnimate) return;

    try {
      window.motionAnimate(
        ".tab",
        { opacity: [0, 1], y: [-8, 0] },
        { duration: 0.22 }
      );

      window.motionAnimate(
        ".hero-name",
        { opacity: [0, 1], y: [18, 0] },
        { duration: 0.45 }
      );

      if (window.motionStagger) {
        window.motionAnimate(
          ".roles span",
          { opacity: [0, 1], y: [10, 0] },
          { duration: 0.3, delay: window.motionStagger(0.04) }
        );

        window.motionAnimate(
          ".about-card, .project-card, .stat-card",
          { opacity: [0, 1], y: [18, 0] },
          { duration: 0.35, delay: window.motionStagger(0.05) }
        );
      }
    } catch (_error) {
      /* ignore */
    }
  }

  function typeWriter(el, text, speed = 18) {
    if (!el) return;
    el.textContent = "";
    let i = 0;

    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i += 1;
        setTimeout(tick, speed);
      }
    }

    tick();
  }

  function startTyping() {
    const typingEl = document.getElementById("typingText");
    if (typingEl) {
      typeWriter(typingEl, "// hello world !! Welcome to my portfolio", 16);
    }
  }

  function renderContent(tabName) {
    if (!editorContent) return;

    const views = getViews();
    const safeTab = isValidTab(tabName) ? tabName : "home";

    editorContent.style.opacity = "0";

    setTimeout(() => {
      editorContent.innerHTML = views[safeTab] || views.home;
      editorContent.style.opacity = "1";

      if (safeTab === "home") {
        startTyping();
      }

      animateInsertedContent();
      runMotionAnimations();
      persistState();
    }, 120);
  }

  function openTab(name) {
    const tabName = normalizeName(name);

    if (!isValidTab(tabName)) return;

    if (!openTabs.includes(tabName)) {
      openTabs.push(tabName);
    }

    activeTab = tabName;
    renderTabs();
    setActiveSidebar(tabName);
    renderContent(tabName);
    closePalette();
  }

  function closeTab(tabName) {
    openTabs = openTabs.filter((t) => t !== tabName);

    if (!openTabs.length) {
      openTabs = ["home"];
    }

    if (activeTab === tabName) {
      activeTab = openTabs[openTabs.length - 1] || "home";
    }

    renderTabs();
    setActiveSidebar(activeTab);
    renderContent(activeTab);
      if (isCopilotOpen) {
        toggleCopilotSidebar(true);
      }
  }

  function closeCurrentTab() {
    if (!activeTab) return;
    closeTab(activeTab);
  }

  function closeAllTabs() {
    openTabs = ["home"];
    activeTab = "home";
    renderTabs();
    setActiveSidebar("home");
    renderContent("home");
  }

  function closeOtherTabs(tabName = activeTab) {
    if (!tabName) return;
    openTabs = [tabName];
    activeTab = tabName;
    renderTabs();
    setActiveSidebar(tabName);
    renderContent(tabName);
  }

  function closeTabsToRight(tabName = activeTab) {
    if (!tabName) return;
    const index = openTabs.indexOf(tabName);
    if (index === -1) return;
    openTabs = openTabs.slice(0, index + 1);
    activeTab = tabName;
    renderTabs();
    setActiveSidebar(tabName);
    renderContent(tabName);
  }

  window.openTab = openTab;
  window.closeCurrentTab = closeCurrentTab;
  window.closeAllTabs = closeAllTabs;
  window.closeOtherTabs = closeOtherTabs;
  window.closeTabsToRight = closeTabsToRight;

  /* ==========================================================================
     COMMAND PALETTE
     ========================================================================== */

  function openPalette() {
    if (!paletteOverlay) return;

    paletteOverlay.classList.add("open");
    paletteOverlay.setAttribute("aria-hidden", "false");

    if (paletteInput) {
      paletteInput.value = "";
      filterPalette("");
      setTimeout(() => paletteInput.focus(), 40);
    }

    highlightPaletteItem(0);
  }

  function closePalette() {
    if (!paletteOverlay) return;
    paletteOverlay.classList.remove("open");
    paletteOverlay.setAttribute("aria-hidden", "true");
  }

  window.openPalette = openPalette;
  window.closePalette = closePalette;

  function visiblePaletteItems() {
    return paletteItems.filter((item) => item.style.display !== "none");
  }

  function highlightPaletteItem(index) {
    const visible = visiblePaletteItems();
    if (!visible.length) return;

    currentPaletteIndex = clamp(index, 0, visible.length - 1);
    paletteItems.forEach((item) => item.classList.remove("active"));

    if (visible[currentPaletteIndex]) {
      visible[currentPaletteIndex].classList.add("active");
    }
  }

  function filterPalette(query) {
    const q = query.toLowerCase().trim();

    paletteItems.forEach((item) => {
      const txt = item.innerText.toLowerCase();
      item.style.display = txt.includes(q) ? "flex" : "none";
    });

    highlightPaletteItem(0);
  }

  function runPaletteItem(item) {
    const txt = item.innerText.toLowerCase();

    if (txt.includes("home")) {
      openTab("home");
      return;
    }
    if (txt.includes("about")) {
      openTab("about");
      return;
    }
    if (txt.includes("projects")) {
      openTab("projects");
      return;
    }
    if (txt.includes("skills")) {
      openTab("skills");
      return;
    }
    if (txt.includes("experience")) {
      openTab("experience");
      return;
    }
    if (txt.includes("contact")) {
      openTab("contact");
      return;
    }
    if (txt.includes("readme")) {
      openTab("readme");
      return;
    }
    if (txt.includes("resume")) {
      openTab("resume");
      return;
    }
    if (txt.includes("copilot")) {
      toggleCopilotSidebar(true);
      return;
    }
  }

  if (openPaletteBtn) {
    openPaletteBtn.addEventListener("click", openPalette);
  }

  if (paletteBackdrop) {
    paletteBackdrop.addEventListener("click", closePalette);
  }

  function bindPaletteEvents() {
    paletteItems = qsa(".palette-item");

    if (paletteInput) {
      paletteInput.addEventListener("input", (e) => {
        filterPalette(e.target.value);
      });

      paletteInput.addEventListener("keydown", (e) => {
        const visible = visiblePaletteItems();

        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (visible.length) {
            highlightPaletteItem((currentPaletteIndex + 1) % visible.length);
          }
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (visible.length) {
            highlightPaletteItem(
              (currentPaletteIndex - 1 + visible.length) % visible.length
            );
          }
        }

        if (e.key === "Enter") {
          e.preventDefault();
          if (visible.length) {
            runPaletteItem(visible[currentPaletteIndex]);
          }
        }
      });
    }

    paletteItems.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        const visible = visiblePaletteItems();
        const visibleIndex = visible.indexOf(item);
        if (visibleIndex !== -1) {
          highlightPaletteItem(visibleIndex);
        } else {
          highlightPaletteItem(index);
        }
      });

      item.addEventListener("click", () => {
        runPaletteItem(item);
      });
    });
  }

  bindPaletteEvents();

  /* ==========================================================================
     GLOBAL KEYBOARD SHORTCUTS
     ========================================================================== */

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
      e.preventDefault();
      openPalette();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w") {
      e.preventDefault();
      closeCurrentTab();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "w") {
      e.preventDefault();
      closeAllTabs();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
      e.preventDefault();
      toggleTerminal();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      toggleCopilotSidebar(true);
      return;
    }

    if (e.key === "Escape") {
        closePalette();
      
        if (settingsPanel) {
          settingsPanel.classList.remove("open");
        }
      }
  });

  /* ==========================================================================
     MENU BAR
     ========================================================================== */

function bindMenuEvents() {
  menuItems = qsa(".menu-item");

  menuItems.forEach((menu) => {
    menu.addEventListener("click", (e) => {
      e.stopPropagation();

      const label = safeText(
        e.currentTarget.childNodes[0]?.textContent || ""
      ).toLowerCase();

      const isActive = menu.classList.contains("active");

      // ✅ Close all menus first
      menuItems.forEach((m) => m.classList.remove("active"));

      // ✅ Toggle current menu (VS Code behavior)
      if (!isActive) {
        menu.classList.add("active");
      }

      // ✅ ONLY run actions that should trigger immediately
      switch (label) {
        case "edit":
        case "go":
          openPalette();
          break;

        case "view":
          toggleSidebar();
          break;

        case "run":
        case "terminal":
          toggleTerminal();
          setTimeout(() => terminalInput?.focus(), 80);
          break;

        case "help":
          openTab("readme");
          break;

        case "copilot":
          toggleCopilotSidebar(true);
          break;

        // ❌ IMPORTANT: DO NOTHING for "file"
        // File menu should only open dropdown
      }
    });
  });

  // ✅ CLICK OUTSIDE → CLOSE ALL MENUS
  document.addEventListener("click", () => {
    menuItems.forEach((m) => m.classList.remove("active"));
  });

  // ✅ PREVENT DROPDOWN FROM CLOSING WHEN CLICKING INSIDE
  document.querySelectorAll(".dropdown").forEach((drop) => {
    drop.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  // ✅ HANDLE DROPDOWN ITEMS (VERY IMPORTANT FIX)
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const action = item.dataset.action;

      switch (action) {
        case "home":
          openTab("home");
          break;
        case "about":
          openTab("about");
          break;
        case "projects":
          openTab("projects");
          break;
        case "skills":
          openTab("skills");
          break;
        case "experience":
          openTab("experience");
          break;
        case "contact":
          openTab("contact");
          break;
        case "resume":
          window.open("Resume.pdf", "_blank");
          break;
      }

      // ✅ Close menu after click
      menuItems.forEach((m) => m.classList.remove("active"));
    });
  });
}
  /* ==========================================================================
     SIDEBAR FILE EVENTS
     ========================================================================== */

  function bindSidebarEvents() {
    sidebarFiles = qsa(".file");

    sidebarFiles.forEach((file) => {
      file.addEventListener("click", () => {
        const tabName = normalizeName(file.textContent);
        openTab(tabName);
      });
    });

    const copilotBox = qsa(".copilot-box")[0];
    if (copilotBox) {
      copilotBox.addEventListener("click", () => {
        toggleCopilotSidebar(true);
      });
    }
  }

  bindSidebarEvents();

  /* ==========================================================================
     TERMINAL
     ========================================================================== */

  function toggleTerminal() {
    if (!terminal) return;

    terminal.classList.toggle("open");

    if (terminal.classList.contains("open") && terminalInput) {
      terminalInput.focus();
    }
  }

  function clearTerminal() {
    if (terminalBody) {
      terminalBody.innerHTML = "";
    }
  }

  function printToTerminal(text, type = "normal") {
    if (!terminalBody) return;

    const line = document.createElement("div");

    if (type === "success") line.classList.add("success");
    if (type === "error") line.classList.add("error");
    if (type === "warning") line.classList.add("warning");

    line.textContent = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  async function initPyodideEngine() {
    if (pyodideInstance) return pyodideInstance;

    if (typeof loadPyodide === "undefined") {
      throw new Error("Pyodide is not loaded. Add pyodide.js to your HTML.");
    }

    printToTerminal("Loading Python runtime...", "warning");
    pyodideInstance = await loadPyodide();
    printToTerminal("Python runtime ready.", "success");
    return pyodideInstance;
  }

  async function runJavaScriptInTerminal(code) {
    try {
      const result = Function(`"use strict"; return (${code})`)();
      printToTerminal(String(result), "success");
    } catch (_error) {
      try {
        const result = Function(`"use strict"; ${code}`)();
        if (result !== undefined) {
          printToTerminal(String(result), "success");
        } else {
          printToTerminal("JavaScript executed.", "success");
        }
      } catch (err) {
        printToTerminal(`JS Error: ${err.message}`, "error");
      }
    }
  }

  async function runPythonInTerminal(code) {
    try {
      const py = await initPyodideEngine();
      const result = py.runPython(code);

      if (result !== undefined) {
        printToTerminal(String(result), "success");
      } else {
        printToTerminal("Python executed.", "success");
      }
    } catch (err) {
      printToTerminal(`Python Error: ${err.message}`, "error");
    }
  }

  async function runTerminalCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;

    terminalHistory.push(cmd);
    terminalHistoryIndex = terminalHistory.length;
    persistState();

    printToTerminal(`agrani@portfolio:${currentDir}$ ${cmd}`);

    const parts = cmd.split(" ");
    const first = parts[0].toLowerCase();

    switch (first) {
      case "help":
        printToTerminal("Available commands:", "success");
        printToTerminal("ls — list files");
        printToTerminal("pwd — print working directory");
        printToTerminal("cd <dir> — change directory");
        printToTerminal("cat <file> — open a file");
        printToTerminal("open <file> — open a file");
        printToTerminal("whoami — who am I?");
        printToTerminal("echo <text> — print text");
        printToTerminal("date — current date & time");
        printToTerminal("git log — show recent commits");
        printToTerminal("python --version — show Python runtime status");
        printToTerminal("js <code> — execute JavaScript");
        printToTerminal("py <code> — execute Python");
        printToTerminal("copilot — open Agrani's Copilot");
        printToTerminal("clear — clear terminal");
        break;

      case "ls":
        printToTerminal(
          "home.tsx  about.html  projects.js  skills.json  experience.ts  contact.css  README.md  Resume.pdf"
        );
        break;

      case "pwd":
        printToTerminal(`/portfolio/${currentDir === "~" ? "" : currentDir}`.replace(/\/$/, ""));
        break;

      case "cd":
        if (!parts[1] || parts[1] === "~") {
          currentDir = "~";
        } else if (parts[1] === "..") {
          currentDir = "~";
        } else {
          currentDir = parts[1];
        }
        printToTerminal(`moved to ${currentDir}`, "success");
        break;

      case "cat":
      case "open":
        if (parts[1]) {
          const target = normalizeName(parts[1]);
          if (isValidTab(target)) {
            openTab(target);
            printToTerminal(`opening ${parts[1]}`, "success");
          } else {
            printToTerminal(`file not found: ${parts[1]}`, "error");
          }
        } else {
          printToTerminal(`usage: ${first} <file>`, "error");
        }
        break;

      case "whoami":
        printToTerminal("Agrani Sinha", "success");
        break;

      case "echo":
        printToTerminal(parts.slice(1).join(" "));
        break;

      case "date":
        printToTerminal(new Date().toString());
        break;

      case "git":
        if (parts[1] === "log") {
          printToTerminal("commit 9f2e1a2 - Upgrade premium portfolio UI");
          printToTerminal("commit 51af89d - Add VS Code tabs and command palette");
          printToTerminal("commit 3b21d9a - Initial portfolio structure");
        } else {
          printToTerminal("git: command not recognized", "error");
        }
        break;

      case "python":
        if (parts[1] === "--version") {
          try {
            await initPyodideEngine();
            printToTerminal("Python runtime loaded via Pyodide", "success");
          } catch (error) {
            printToTerminal(error.message, "error");
          }
        } else {
          printToTerminal("python: unsupported argument", "error");
        }
        break;

      case "js": {
        const jsCode = cmd.slice(3).trim();
        if (!jsCode) {
          printToTerminal("usage: js <code>", "error");
        } else {
          await runJavaScriptInTerminal(jsCode);
        }
        break;
      }

      case "py": {
        const pyCode = cmd.slice(3).trim();
        if (!pyCode) {
          printToTerminal("usage: py <code>", "error");
        } else {
          await runPythonInTerminal(pyCode);
        }
        break;
      }

      case "projects":
      case "about":
      case "skills":
      case "experience":
      case "contact":
      case "readme":
      case "resume":
      case "home":
        openTab(first);
        break;

      case "copilot":
        toggleCopilotSidebar(true);
        printToTerminal("Agrani's Copilot opened.", "success");
        break;

      case "clear":
        clearTerminal();
        break;

      default:
        printToTerminal(`command not found: ${cmd} — type 'help' for commands`, "error");
    }
  }

  function bindTerminalEvents() {
    if (!terminalInput) return;

    terminalInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const value = terminalInput.value;
        terminalInput.value = "";
        await runTerminalCommand(value);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!terminalHistory.length) return;
        terminalHistoryIndex = Math.max(0, terminalHistoryIndex - 1);
        terminalInput.value = terminalHistory[terminalHistoryIndex] || "";
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!terminalHistory.length) return;

        terminalHistoryIndex = Math.min(terminalHistory.length, terminalHistoryIndex + 1);

        if (terminalHistoryIndex >= terminalHistory.length) {
          terminalInput.value = "";
        } else {
          terminalInput.value = terminalHistory[terminalHistoryIndex] || "";
        }
      }
    });
  }

  bindTerminalEvents();

  window.toggleTerminal = toggleTerminal;
  window.clearTerminal = clearTerminal;

  /* ==========================================================================
     RESUME / FULLSCREEN / WINDOW BUTTONS
     ========================================================================== */

  function downloadResume() {
    window.open("Agrani Sinha Resume(1).docx", "_blank");
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  window.downloadResume = downloadResume;
  window.toggleFullscreen = toggleFullscreen;

  function showMessage(msg) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.classList.add("show");
    setTimeout(() => feedback.classList.remove("show"), 2200);
  }

  if (red) {
    red.addEventListener("click", () => {
      const msg = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
      showMessage(msg);
    });
  }

  if (yellow) {
    yellow.addEventListener("click", () => {
      document.body.style.transition = "transform 0.2s ease";
      document.body.style.transform = "scale(0.97)";
      setTimeout(() => {
        document.body.style.transform = "scale(1)";
      }, 180);
    });
  }

  if (green) {
    green.addEventListener("click", toggleFullscreen);
  }

  /* ==========================================================================
     CURSOR
     ========================================================================== */

  function bindCursorEffects() {
    if (!cursorSquare || !cursorDot) return;

    document.addEventListener("mousemove", (e) => {
      cursorSquare.style.left = `${e.clientX}px`;
      cursorSquare.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    document.addEventListener("mousedown", () => {
      cursorSquare.style.width = "18px";
      cursorSquare.style.height = "18px";
    });

    document.addEventListener("mouseup", () => {
      cursorSquare.style.width = "24px";
      cursorSquare.style.height = "24px";
    });
  }

  bindCursorEffects();

  /* ==========================================================================
     COPILOT ENGINE
     ========================================================================== */

 function appendCopilotMessage(text, sender = "assistant") {
  const container = document.getElementById("copilotMessages");

  const msg = document.createElement("div");
  msg.className = `copilot-message ${sender}`;

  container.appendChild(msg);

  // USER message (no typing animation)
  if (sender === "user") {
    msg.textContent = text;
    container.scrollTop = container.scrollHeight;
    return;
  }

  // ✨ Typing animation for assistant
  let i = 0;
  function type() {
    if (i < text.length) {
      msg.textContent += text.charAt(i);
      i++;
      setTimeout(type, 15); // speed (lower = faster)
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }

  type();
}
   function smartNavigate(query) {
  query = query.toLowerCase();

        if (query.includes("project")) openTab("projects");
        else if (query.includes("skill")) openTab("skills");
        else if (query.includes("contact")) openTab("contact");
        else if (query.includes("about")) openTab("about");
      }
  function getCopilotReply(prompt) {
    const q = prompt.toLowerCase();
      smartNavigate(q); 

    if (q.includes("project")) {
      openTab("projects");
      return COPILOT_REPLIES.projects;
    }

    if (q.includes("experience")) {
      openTab("experience");
      return COPILOT_REPLIES.experience;
    }

    if (q.includes("skill") || q.includes("tech stack")) {
      openTab("skills");
      return COPILOT_REPLIES.skills;
    }

    if (q.includes("education")) {
      openTab("about");
      return COPILOT_REPLIES.education;
    }

    if (q.includes("contact") || q.includes("email") || q.includes("phone")) {
      openTab("contact");
      return COPILOT_REPLIES.contact;
    }

    if (q.includes("healthcare") || q.includes("ai")) {
      openTab("about");
      return COPILOT_REPLIES.healthcare;
    }

    if (q.includes("leadership") || q.includes("club")) {
      openTab("about");
      return COPILOT_REPLIES.leadership;
    }

    if (q.includes("resume") || q.includes("cv")) {
      openTab("resume");
      return COPILOT_REPLIES.resume;
    }

   
    if (q.includes("open home")) {
      openTab("home");
      return "Opening Home.";
    }

    if (q.includes("open about")) {
      openTab("about");
      return "Opening About.";
    }

    if (q.includes("open projects")) {
      openTab("projects");
      return "Opening Projects.";
    }

    if (q.includes("open skills")) {
      openTab("skills");
      return "Opening Skills.";
    }

    if (q.includes("open experience")) {
      openTab("experience");
      return "Opening Experience.";
    }

    if (q.includes("open contact")) {
      openTab("contact");
      return "Opening Contact.";
    }

    if (q.includes("open resume")) {
      openTab("resume");
      return "Opening Resume.";
    }

    return COPILOT_REPLIES.default;
  }

  function sendCopilotPrompt(customText = "") {
    const chatInput = document.getElementById("copilotInput");
    if (!chatInput) return;

    const cleaned = safeText(customText || chatInput.value);
    if (!cleaned) return;

    appendCopilotMessage(cleaned, "user");

    if (!customText) {
      chatInput.value = "";
    } else {
      chatInput.value = "";
    }

    setTimeout(() => {
      appendCopilotMessage(getCopilotReply(cleaned), "assistant");
    }, 260);
  }

  function quickAsk(text) {
    toggleCopilotSidebar(true);
    sendCopilotPrompt(text);
  }

  function startVoiceAssistant() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const chatInput = document.getElementById("copilotInput");

  if (!SpeechRecognition) {
    appendCopilotMessage("Voice assistant not supported in this browser.", "assistant");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    if (chatInput) {
      chatInput.value = text;
    }
    sendCopilotPrompt(); // auto send
  };

  recognition.onerror = () => {
    appendCopilotMessage("Voice input failed. Try again.", "assistant");
  };
}

   
function bindCopilotEvents() {
  const chatInput = document.getElementById("copilotInput");
  const chatSend = document.getElementById("copilotSend");
  const voiceBtn = document.getElementById("copilotVoice");
  const closeBtn = document.getElementById("copilotSideClose");
  const minimizeBtn = document.getElementById("copilotSideMinimize");

  if (chatSend) {
    chatSend.onclick = () => sendCopilotPrompt();
  }

  if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        sendCopilotPrompt();
      }
    });
  }

  if (voiceBtn) {
    voiceBtn.onclick = startVoiceAssistant;
  }

  if (closeBtn) {
    closeBtn.onclick = () => toggleCopilotSidebar(false);
  }

  if (minimizeBtn) {
    minimizeBtn.onclick = (e) => {
      e.stopPropagation();
      minimizeCopilot();
    };
  }

  // Suggestions
  const sidebar = document.getElementById("copilotSidebar");

  if (sidebar) {
    qsa(".copilot-suggest", sidebar).forEach((btn) => {
      btn.onclick = () => {
        quickAsk(btn.dataset.quick || btn.textContent);
      };
    });
  }
}
  window.quickAsk = quickAsk;
  window.sendCopilotPrompt = sendCopilotPrompt;
  window.startVoiceAssistant = startVoiceAssistant;


  /* ==========================================================================
     RESPONSIVE HELPERS
     ========================================================================== */

  function handleResize() {
    if (window.innerWidth < 560) {
      if (cursorSquare) cursorSquare.style.display = "none";
      if (cursorDot) cursorDot.style.display = "none";
    } else {
      if (cursorSquare) cursorSquare.style.display = "";
      if (cursorDot) cursorDot.style.display = "";
    }
  }

  window.addEventListener("resize", debounce(handleResize, 80));
  handleResize();

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */

  restoreState();
  removeCopilotFileEntries();
  updateCollections();
  bindSidebarEvents();
  bindMenuEvents();
  bindPaletteEvents();
  applyTheme(currentTheme);
  bindCopilotEvents();   // ✅ MISSING LINE

  if (!openTabs.length) {
    openTabs = ["home"];
  }

  if (!activeTab || !isValidTab(activeTab)) {
    activeTab = openTabs[0] || "home";
  }

  renderTabs();
  setActiveSidebar(activeTab);
  renderContent(activeTab);


  persistState();
});

/* ==========================================================================
   VIEW TEMPLATES
   ========================================================================== */

function getHome() {
  return `
    <div class="home-container home-animate">
      <div class="home-grid">
        <div class="home-left">
          <p class="code-line" id="typingText"></p>

          <h1 class="hero-name hero-reveal">
            Agrani <span>Sinha</span>
          </h1>

          <div class="roles role-reveal">
            <span>AI Engineer</span>
            <span>Clinical Informatics</span>
            <span>Data Scientist</span>
            <span>Healthcare Systems</span>
          </div>

          <p class="hero-desc desc-reveal">
            I build intelligent healthcare systems using AI, machine learning,
            clinical informatics, and data-driven workflows to solve real-world problems.
          </p>

          <div class="home-buttons button-reveal">
            <button onclick="openTab('projects')">📁 Projects</button>
            <button onclick="openTab('about')">👤 About</button>
            <button onclick="openTab('contact')">✉️ Contact</button>
          </div>

          <div class="stats stats-reveal">
            <div class="stat-card">
              <strong>10+</strong>
              <span>Projects</span>
            </div>

            <div class="stat-card">
              <strong>3+</strong>
              <span>Years Experience</span>
            </div>
          </div>
        </div>

        <div class="home-right image-reveal">
          <div class="profile-wrapper floating-photo">
            <div class="profile-glow"></div>
            <img
              src="assets/images/profile.png"
              alt="Agrani Sinha"
              onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=&quot;profile-fallback&quot;>AS</div>';"
            />
          </div>
        </div>
      </div>
    </div>
  `;
}

function getAbout() {
  return `
    <div class="about-container">
      <p class="code-line">&lt;!-- about.html - Agrani Sinha --&gt;</p>

      <h1 class="hero-name">About Me</h1>
      <p class="about-sub">// who I am • what I do • where I build</p>

      <div class="about-card">
        <p>
          Hi! I'm <span class="highlight">Agrani Sinha</span>, a
          <span class="highlight">Health Informatics graduate student</span>
          with experience across
          <span class="highlight">clinical informatics, healthcare analytics, digital health, AI-driven applications, and data-informed systems</span>.
          <br><br>
          My work focuses on building intelligent, scalable solutions that support
          <span class="highlight">healthcare innovation, operational efficiency, and better data-driven decision making</span>.
        </p>
      </div>

      <div class="about-card">
        <h3 class="section-title">PROFESSIONAL SUMMARY</h3>
        <p>
          I bring together <span class="highlight">AI, machine learning, backend systems, and healthcare workflows</span>
          to design solutions that are practical, efficient, and impactful. I enjoy building systems that connect
          data, technology, and real clinical needs.
        </p>
      </div>

      <div class="about-card">
        <h3 class="section-title">CURRENT FOCUS</h3>
        <div class="focus-grid">
          <div>⚙ AI-driven healthcare systems</div>
          <div>🤖 ML, deep learning, and intelligent pipelines</div>
          <div>📊 Healthcare analytics and data-informed workflows</div>
          <div>🏥 Clinical informatics and EHR-centered innovation</div>
          <div>📱 AI-powered applications and digital health solutions</div>
          <div>🚀 Scalable backend and operational systems</div>
        </div>
      </div>

      <div class="about-card">
        <h3 class="section-title">EDUCATION</h3>

        <div class="timeline">
          <div class="timeline-item">
            <strong>University of North Florida</strong>
            <span>Jacksonville, FL • 2025 – Present</span>
            <p>M.S. in Health Informatics</p>
          </div>

          <div class="timeline-item">
            <strong>Jaypee Institute of Information Technology</strong>
            <span>Noida, India • 2015 – 2020</span>
            <p>Integrated Master of Technology in Biotechnology</p>
          </div>
        </div>
      </div>

      <div class="about-card">
        <h3 class="section-title">LEADERSHIP & INITIATIVES</h3>
        <div class="timeline">
          <div class="timeline-item">
            <strong>Marketing Chair</strong>
            <span>Health Informatics & Analytics Club (HIAC), University of North Florida</span>
            <p>
              Lead marketing and digital outreach for healthcare informatics events, guest lectures, and student engagement activities.
              Initiated and produced the HIAC Podcast, managing speaker outreach, promotion, and healthcare technology networking.
            </p>
          </div>
        </div>
      </div>

      <div class="about-card">
        <h3 class="section-title">TECH STACK</h3>
        <div class="skills-grid">
          <span class="skills-chip">Python</span>
          <span class="skills-chip">Java</span>
          <span class="skills-chip">C</span>
          <span class="skills-chip">C++</span>
          <span class="skills-chip">JavaScript</span>
          <span class="skills-chip">HTML</span>
          <span class="skills-chip">CSS</span>
          <span class="skills-chip">Flutter</span>
          <span class="skills-chip">TensorFlow</span>
          <span class="skills-chip">Machine Learning</span>
          <span class="skills-chip">Computer Vision</span>
          <span class="skills-chip">Jupyter Notebook</span>
          <span class="skills-chip">Google Colab</span>
          <span class="skills-chip">SAS</span>
          <span class="skills-chip">Microsoft Excel</span>
          <span class="skills-chip">EHRGo</span>
          <span class="skills-chip">WellSky</span>
          <span class="skills-chip">Android Studio</span>
          <span class="skills-chip">GitHub</span>
        </div>
      </div>
    </div>
  `;
}

function getProjects() {
  return `
    <div class="projects-container">
      <p class="code-line">&lt;!-- projects.js - selected work --&gt;</p>

      <h1 class="hero-name">Projects</h1>
      <p class="about-sub">// selected work • applied AI • healthcare + software</p>

      <div class="project-grid">
        <div class="project-card">
          <h3>ML Drug Discovery</h3>
          <p>Built SVM models with 96.8% accuracy for tuberculosis inhibitor prediction using MATLAB and AutoDock.</p>
        </div>

        <div class="project-card">
          <h3>Inventory Management App</h3>
          <p>Flutter app with Google Sheets backend for real-time inventory tracking and operational workflows.</p>
        </div>

        <div class="project-card">
          <h3>Bio Calculator App</h3>
          <p>Lab calculation tool built with HTML, CSS, and JavaScript and published on Google Play Store.</p>
        </div>

        <div class="project-card">
          <h3>Respiratory Health Chatbot</h3>
          <p>Healthcare chatbot built with HTML, CSS, and Vue.js for interactive respiratory guidance.</p>
        </div>

        <div class="project-card">
          <h3>AI Plant Identification</h3>
          <p>TensorFlow computer vision system with voice feedback for plant detection and classification.</p>
        </div>

        <div class="project-card">
          <h3>AI Games</h3>
          <p>Chess and Checkers gameplay systems with AI functionality, plus Connect4 desktop implementation.</p>
        </div>
      </div>
    </div>
  `;
}

function getSkills() {
  return `
    <div class="about-container">
      <p class="code-line">{ /* skills.json */ }</p>
      <h1 class="hero-name">Skills</h1>

      <div class="about-card">
        <h3 class="section-title">PROGRAMMING</h3>
        <div class="skills-grid">
          <span class="skills-chip">Python</span>
          <span class="skills-chip">Java</span>
          <span class="skills-chip">C</span>
          <span class="skills-chip">C++</span>
          <span class="skills-chip">JavaScript</span>
          <span class="skills-chip">HTML</span>
          <span class="skills-chip">CSS</span>
          <span class="skills-chip">Flutter</span>
        </div>
      </div>

      <div class="about-card">
        <h3 class="section-title">AI & DATA</h3>
        <div class="skills-grid">
          <span class="skills-chip">TensorFlow</span>
          <span class="skills-chip">Machine Learning</span>
          <span class="skills-chip">Computer Vision</span>
          <span class="skills-chip">Jupyter Notebook</span>
          <span class="skills-chip">Google Colab</span>
          <span class="skills-chip">SAS</span>
          <span class="skills-chip">Microsoft Excel</span>
        </div>
      </div>

      <div class="about-card">
        <h3 class="section-title">HEALTHCARE TOOLS</h3>
        <div class="skills-grid">
          <span class="skills-chip">EHRGo</span>
          <span class="skills-chip">WellSky</span>
          <span class="skills-chip">Clinical Informatics</span>
          <span class="skills-chip">Healthcare Analytics</span>
        </div>
      </div>
    </div>
  `;
}

function getExperience() {
  return `
    <div class="about-container">
      <p class="code-line">// experience.ts</p>
      <h1 class="hero-name">Experience</h1>

      <div class="about-card">
        <h3 class="section-title">PROFESSIONAL EXPERIENCE</h3>

        <div class="timeline">
          <div class="timeline-item">
            <strong>Clinical Informatics Intern — Alivia Care</strong>
            <span>Jacksonville, FL • Oct 2025 – Feb 2026</span>
            <p>Analyzed clinical workflows, supported EHR-based reporting initiatives, and collaborated with informatics teams to interpret clinical data for operational insights. Earned WellSky certifications.</p>
          </div>

          <div class="timeline-item">
            <strong>Data Science Analyst — BluCognition</strong>
            <span>Pune, India • Mar 2022 – Jun 2023</span>
            <p>Developed TensorFlow-based CNN models for bank statement extraction and financial document classification. Built machine learning pipelines for structured analytics and automation.</p>
          </div>

          <div class="timeline-item">
            <strong>Academic Research Associate — Digiversal Consultant</strong>
            <span>Noida, India • Dec 2020 – Mar 2022</span>
            <p>Conducted technical research and data analysis for IT and analytics consulting projects, preparing structured reports and documentation.</p>
          </div>

          <div class="timeline-item">
            <strong>Bioinformatics Research Intern — IBAB</strong>
            <span>Remote • Jul 2020 – Dec 2020</span>
            <p>Curated biological datasets and organized genomic data to support a COVID-19 research meta-database.</p>
          </div>

          <div class="timeline-item">
            <strong>Microbiology Trainee — SRL Diagnostics</strong>
            <span>Noida, India • Jun 2018 – Jul 2018</span>
            <p>Conducted microbial testing using culture techniques, microscopy, antibody-based assays, and supported BD blood culture diagnostic workflows.</p>
          </div>

          <div class="timeline-item">
            <strong>Content Developer — Sanfoundry</strong>
            <span>Remote • Dec 2017 – Mar 2018</span>
            <p>Developed and curated 1000+ bioprocess engineering MCQs and technical learning content for an online education platform.</p>
          </div>
        </div>
      </div>

      <div class="about-card">
        <h3 class="section-title">VOLUNTEER</h3>
        <div class="timeline">
          <div class="timeline-item">
            <strong>Volunteer — Game Development & Graphic Design</strong>
            <span>Lemonade Stand Bootcamp, Pensacola, FL • May 2025 – Aug 2025</span>
            <p>Designed 2D/3D visual assets using Canva and Blender for educational games and collaborated with cross-functional teams on interactive learning content.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getContact() {
  return `
    <div class="about-container">
      <p class="code-line">/* contact.css */</p>
      <h1 class="hero-name">Contact</h1>

      <div class="about-card">
        <p><span class="highlight">Email:</span> agbrian521@gmail.com</p>
        <p><span class="highlight">Phone:</span> (904) 228-1179</p>
        <p><span class="highlight">Location:</span> Jacksonville, FL</p>
        <p><span class="highlight">LinkedIn:</span> linkedin.com/in/agranisinha</p>
      </div>
    </div>
  `;
}

function getReadme() {
  return `
    <div class="about-container">
      <p class="code-line"># README.md</p>
      <h1 class="hero-name">README</h1>

      <div class="about-card">
        <p>
          This portfolio presents my work across
          <span class="highlight">health informatics, AI, machine learning, data analytics, and software systems</span>.
          Use the sidebar or tabs to explore sections like About, Projects, Skills, Experience, Contact, and Resume.
        </p>
      </div>
    </div>
  `;
}

function minimizeCopilot() {
  const sidebar = document.getElementById("copilotSidebar");
  const editor = document.querySelector(".editor-area");
  if (!sidebar) return;

  const isMinimized = sidebar.classList.contains("minimized");

  if (!isMinimized) {
    sidebar.classList.add("minimized");
    sidebar.classList.add("open");
    editor && editor.classList.remove("with-copilot");
    isCopilotOpen = true;
  } else {
    sidebar.classList.remove("minimized");
    sidebar.classList.add("open");
    editor && editor.classList.add("with-copilot");
    isCopilotOpen = true;
  }
}

function minimizeSettings() {
  const panel = document.getElementById("settingsPanel");

  if (!panel) return;

  const isMinimized = panel.classList.contains("minimized");

  if (!isMinimized) {
    panel.classList.add("minimized");
    panel.classList.add("open"); // keep visible
  } else {
    panel.classList.remove("minimized");
    panel.classList.add("open");
  }
}
function getResume() {
  return `
    <div class="about-container">
      <p class="code-line">/* Resume.pdf */</p>
      <h1 class="hero-name">Resume</h1>

      <div class="about-card">
        <p>
          Open my latest resume for the complete professional record.
        </p>
        <div class="home-buttons">
          <button onclick="window.open('Agrani Sinha Resume(1).docx', '_blank')">📄 Open Resume</button>
        </div>
      </div>
    </div>
  `;
}

(() => {
  const MOBILE = 768;

  function isMobile() {
    return window.innerWidth <= MOBILE;
  }

  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));

  function closeMenus() {
    qa(".menu-item").forEach((m) => m.classList.remove("active"));
  }

  function openSidebarDrawer() {
    const panel = q(".sidebar-panel");
    if (!panel) return;
    panel.classList.add("show");
    panel.classList.remove("hide");
  }

  function closeSidebarDrawer() {
    const panel = q(".sidebar-panel");
    if (!panel) return;
    panel.classList.remove("show");
    panel.classList.add("hide");
  }

  function openCopilotPanel() {
    const panel = document.getElementById("copilotSidebar");
    const editor = q(".editor-area");
    if (!panel) return;
    panel.classList.add("open");
    panel.classList.remove("minimized");
    panel.setAttribute("aria-hidden", "false");
    editor?.classList.remove("with-copilot");
  }

  function closeCopilotPanel() {
    const panel = document.getElementById("copilotSidebar");
    const editor = q(".editor-area");
    if (!panel) return;
    panel.classList.remove("open", "minimized");
    panel.setAttribute("aria-hidden", "true");
    editor?.classList.remove("with-copilot");
  }

  window.openSidebar = function(type) {
    if (!isMobile()) return;
    const t = String(type || "").toLowerCase();

    if (t === "copilot") {
      closeMenus();
      closeSidebarDrawer();
      openCopilotPanel();
      return;
    }

    if (t === "search") {
      closeMenus();
      closeSidebarDrawer();
      closeCopilotPanel();
      if (typeof window.openPalette === "function") window.openPalette();
      return;
    }

    if (t === "git") {
      closeMenus();
      closeSidebarDrawer();
      closeCopilotPanel();
      if (typeof window.printToTerminal === "function") {
        window.printToTerminal("Git panel is simulated. Use `git log` in terminal.", "warning");
      }
      return;
    }

    if (t === "files") {
      closeMenus();
      openSidebarDrawer();
      if (typeof window.openTab === "function") window.openTab("readme");
      return;
    }

    closeMenus();
    closeCopilotPanel();
    openSidebarDrawer();
  };

  window.toggleSidebar = function() {
    if (!isMobile()) return;
    const panel = q(".sidebar-panel");
    if (!panel) return;
    if (panel.classList.contains("show")) closeSidebarDrawer();
    else openSidebarDrawer();
  };

  window.toggleCopilotSidebar = function(force) {
    if (!isMobile()) return;

    if (force === true) {
      closeMenus();
      closeSidebarDrawer();
      openCopilotPanel();
      return;
    }

    if (force === false) {
      closeCopilotPanel();
      return;
    }

    const panel = document.getElementById("copilotSidebar");
    if (!panel) return;

    if (panel.classList.contains("open")) closeCopilotPanel();
    else {
      closeMenus();
      closeSidebarDrawer();
      openCopilotPanel();
    }
  };

  window.toggleSettings = function() {
    if (!isMobile()) return;
    const panel = document.getElementById("settingsPanel");
    if (!panel) return;

    closeMenus();
    closeSidebarDrawer();
    closeCopilotPanel();

    const willOpen = !panel.classList.contains("open");
    panel.classList.toggle("open", willOpen);
    panel.classList.remove("minimized");
  };

  function bindMobileMenus() {
    qa(".menu-item").forEach((menu) => {
      if (menu.dataset.mobileFixed === "1") return;
      menu.dataset.mobileFixed = "1";

      menu.addEventListener("click", (e) => {
        if (!isMobile()) return;

        const hasDropdown = !!menu.querySelector(".dropdown");
        const wasActive = menu.classList.contains("active");
        const label = String(menu.childNodes[0]?.textContent || "").trim().toLowerCase();

        e.stopPropagation();

        closeSidebarDrawer();

        qa(".menu-item").forEach((m) => m.classList.remove("active"));

        if (hasDropdown) {
          if (!wasActive) menu.classList.add("active");
          return;
        }

        if (label === "copilot") {
          openCopilotPanel();
        }
      });
    });

    qa(".dropdown").forEach((drop) => {
      if (drop.dataset.mobileFixed === "1") return;
      drop.dataset.mobileFixed = "1";
      drop.addEventListener("click", (e) => {
        if (!isMobile()) return;
        e.stopPropagation();
      });
    });
  }

  function bindOutsideClose() {
    if (document.body.dataset.mobileOutsideClose === "1") return;
    document.body.dataset.mobileOutsideClose = "1";

    document.addEventListener("click", (e) => {
      if (!isMobile()) return;

      const target = e.target;
      const sidebar = q(".sidebar-panel");
      const settings = document.getElementById("settingsPanel");
      const copilot = document.getElementById("copilotSidebar");

      if (!target.closest(".menu-item")) {
        closeMenus();
      }

      if (
        sidebar?.classList.contains("show") &&
        !target.closest(".sidebar-panel") &&
        !target.closest(".activity-icon")
      ) {
        closeSidebarDrawer();
      }

      if (
        settings?.classList.contains("open") &&
        !target.closest("#settingsPanel") &&
        !target.closest(".settings-btn")
      ) {
        settings.classList.remove("open");
      }

      if (
        copilot?.classList.contains("open") &&
        !target.closest("#copilotSidebar") &&
        !target.closest(".copilot-box") &&
        !target.closest('[onclick*="toggleCopilot"]') &&
        !target.closest('[onclick*="toggleCopilotSidebar"]')
      ) {
        closeCopilotPanel();
      }
    });
  }

  function bindRedButton() {
    const red = document.getElementById("btnRed");
    if (!red || red.dataset.mobileFixed === "1") return;
    red.dataset.mobileFixed = "1";

    red.addEventListener("click", (e) => {
      if (!isMobile()) return;
      e.preventDefault();
      e.stopPropagation();
      closeMenus();
      closeSidebarDrawer();
      closeCopilotPanel();
      document.getElementById("settingsPanel")?.classList.remove("open");
    });
  }

  function bindSwipe() {
    if (document.body.dataset.mobileSwipeFixed === "1") return;
    document.body.dataset.mobileSwipeFixed = "1";

    let startX = 0;
    let endX = 0;

    document.addEventListener("touchstart", (e) => {
      if (!isMobile()) return;
      startX = e.changedTouches[0].clientX;
      endX = startX;
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
      if (!isMobile()) return;
      endX = e.changedTouches[0].clientX;
    }, { passive: true });

    document.addEventListener("touchend", () => {
      if (!isMobile()) return;
      const dx = endX - startX;

      if (startX < 22 && dx > 70) {
        openSidebarDrawer();
      }

      if (q(".sidebar-panel")?.classList.contains("show") && dx < -70) {
        closeSidebarDrawer();
      }
    });
  }

  function initMobileFix() {
    bindMobileMenus();
    bindOutsideClose();
    bindRedButton();
    bindSwipe();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileFix);
  } else {
    initMobileFix();
  }
})();
