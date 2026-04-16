
const isMobile = () => window.innerWidth <= 768;

document.addEventListener("DOMContentLoaded", () => {
  if (isMobile()) {
    document.body.classList.add("mobile-mode");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const safeText = (v) => String(v ?? "").trim();
  const isMobile = () => window.innerWidth <= 768;

  const editorContent = $("#editorContent");
  const tabsContainer = $("#editorTabs");
  const paletteOverlay = $("#paletteOverlay");
  const paletteBackdrop = $("#paletteBackdrop");
  const paletteInput = $("#paletteInput");
  const openPaletteBtn = $("#openPaletteBtn");
  const terminal = $("#terminalPanel");
  const terminalBody = $("#terminalBody");
  const terminalInput = $("#terminalInput");
  const settingsPanel = $("#settingsPanel");
  const feedback = $("#headerFeedback");
  const red = $("#btnRed");
  const yellow = $("#btnYellow");
  const green = $("#btnGreen");
  const sidebarPanel = $("#sidebarPanel") || $(".sidebar-panel");
  const copilotSidebar = $("#copilotSidebar");
  const cursorSquare = $("#cursorSquare");
  const cursorDot = $("#cursorDot");

  let mobileBackdrop = $(".mobile-backdrop");
  if (!mobileBackdrop) {
    mobileBackdrop = document.createElement("div");
    mobileBackdrop.className = "mobile-backdrop";
    document.body.appendChild(mobileBackdrop);
  }

  const TAB_LABELS = {
    home: "⚛ home.tsx",
    about: "🌐 about.html",
    projects: "🟨 projects.js",
    skills: "🟩 skills.json",
    experience: "🟦 experience.ts",
    lor: "📜 lor.pdf",
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
    "lor",
    "contact",
    "readme",
    "resume"
  ];

  const STORAGE = {
    theme: "agrani_portfolio_theme_v3",
    tabs: "agrani_portfolio_tabs_v3",
    active: "agrani_portfolio_active_v3",
    history: "agrani_portfolio_terminal_history_v3",
    copilot: "agrani_portfolio_copilot_v3"
  };

  const funnyQuotes = [
    "Nice try 😏 but I’ll stay open.",
    "You can’t close me that easily 😎",
    "Still running and glowing ✨",
    "This portfolio is immortal 🚀",
    "Denied 😈"
  ];

  const COPILOT_REPLIES = {
    intro: "Hi — I’m Agrani’s portfolio copilot. Ask about projects, experience, skills, education, healthcare AI work, or contact details.",
    projects: "Agrani has built projects across ML drug discovery, Flutter inventory systems, healthcare chatbots, AI plant identification, bioinformatics, and AI game systems.",
    experience: "Agrani’s experience includes Clinical Informatics Intern at Alivia Care, Data Science Analyst at BluCognition, Academic Research Associate at Digiversal, and bioinformatics research.",
    skills: "Core skills include Python, Java, C/C++, JavaScript, HTML/CSS, Flutter, TensorFlow, Machine Learning, Computer Vision, SAS, Excel, EHRGo, WellSky, Android Studio, and GitHub.",
    education: "Agrani is pursuing an M.S. in Health Informatics at the University of North Florida and completed an Integrated Master of Technology in Biotechnology from JIIT.",
    contact: "You can contact Agrani at agbrian521@gmail.com,  based in Jacksonville, FL.",
    healthcare: "Agrani’s work focuses on AI-driven healthcare systems, clinical informatics, healthcare analytics, digital health solutions, and practical intelligent systems.",
    leadership: "Agrani has served as Marketing Chair in the Health Informatics & Analytics Club and led outreach, podcast coordination, and student engagement efforts.",
    resume: "You can open the Resume tab or use the resume section to access the latest resume.",
    lor: "Agrani has multiple Letters of Recommendation from academic and professional experiences. Open the LOR tab to view them.",
    default: "I can answer questions about Agrani’s projects, experience, skills, education, leadership, resume, and contact details."
  };

  let openTabs = [];
  let activeTab = "";
  let currentPaletteIndex = 0;
  let currentDir = "~";
  let terminalHistory = [];
  let terminalHistoryIndex = -1;
  let pyodideInstance = null;
  let isCopilotOpen = false;
  let currentTheme = "dark";
  let heroTyped = false;
  let sidebarFiles = [];
  let paletteItems = [];
  let menuItems = [];

  function persistState() {
    try {
      localStorage.setItem(STORAGE.theme, currentTheme);
      localStorage.setItem(STORAGE.tabs, JSON.stringify(openTabs));
      localStorage.setItem(STORAGE.active, activeTab);
      localStorage.setItem(STORAGE.history, JSON.stringify(terminalHistory.slice(-50)));
      localStorage.setItem(STORAGE.copilot, JSON.stringify(isCopilotOpen));
    } catch (_) {}
  }

  function restoreState() {
    try {
      currentTheme = localStorage.getItem(STORAGE.theme) || "dark";
      openTabs = JSON.parse(localStorage.getItem(STORAGE.tabs) || "[]").filter((t) => TAB_ORDER.includes(t));
      activeTab = localStorage.getItem(STORAGE.active) || "home";
      terminalHistory = JSON.parse(localStorage.getItem(STORAGE.history) || "[]");
      isCopilotOpen = JSON.parse(localStorage.getItem(STORAGE.copilot) || "false");
    } catch (_) {
      openTabs = [];
      activeTab = "home";
      terminalHistory = [];
      isCopilotOpen = false;
    }
  }

  function normalizeName(name) {
    const value = String(name).toLowerCase().trim();
    if (value.includes("home")) return "home";
    if (value.includes("about")) return "about";
    if (value.includes("project")) return "projects";
    if (value.includes("skill")) return "skills";
    if (value.includes("experience")) return "experience";
    if (value.includes("lor")) return "lor";
    if (value.includes("contact")) return "contact";
    if (value.includes("readme")) return "readme";
    if (value.includes("resume")) return "resume";
    return "home";
  }

  function isValidTab(tab) {
    return TAB_ORDER.includes(tab);
  }

  function getIcon(tab) {
    return (TAB_LABELS[tab] || "📄 file").split(" ")[0];
  }

  function getLabel(tab) {
    return TAB_LABELS[tab] || `📄 ${tab}`;
  }

  function updateCollections() {
    sidebarFiles = $$(".file");
    paletteItems = $$(".palette-item");
    menuItems = $$(".menu-item");
  }

  function applyTheme(theme) {
    currentTheme = theme || "dark";
    document.body.classList.remove("rose", "tokyo", "cat", "nord", "gruv");
    if (currentTheme !== "dark") document.body.classList.add(currentTheme);
    $$(".theme-option").forEach((el) => el.classList.remove("active"));
    $$(".theme-option").forEach((el) => {
      const text = el.textContent.toLowerCase();
      if (
        (currentTheme === "dark" && text.includes("dark")) ||
        (currentTheme === "rose" && text.includes("ros")) ||
        (currentTheme === "tokyo" && text.includes("tokyo")) ||
        (currentTheme === "cat" && text.includes("cat")) ||
        (currentTheme === "nord" && text.includes("nord")) ||
        (currentTheme === "gruv" && text.includes("gruv"))
      ) {
        el.classList.add("active");
      }
    });
    persistState();
  }

  window.setTheme = applyTheme;

  function showMessage(msg) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.classList.add("show");
    setTimeout(() => feedback.classList.remove("show"), 2200);
  }

  function openMobilePanel(type) {
    if (!isMobile()) return;
    sidebarPanel?.classList.remove("m-show");
    copilotSidebar?.classList.remove("m-show");
    settingsPanel?.classList.remove("m-show");

    if (type === "sidebar") sidebarPanel?.classList.add("m-show");
    if (type === "copilot") copilotSidebar?.classList.add("m-show");
    if (type === "settings") settingsPanel?.classList.add("m-show");

    if (type) mobileBackdrop.classList.add("show");
    else mobileBackdrop.classList.remove("show");
  }

  function closeMobilePanels() {
    sidebarPanel?.classList.remove("m-show");
    copilotSidebar?.classList.remove("m-show");
    settingsPanel?.classList.remove("m-show");
    mobileBackdrop.classList.remove("show");
  }

  mobileBackdrop.addEventListener("click", closeMobilePanels);

 function toggleSidebar() {
  const sidebar = document.getElementById("sidebarPanel");
  const backdrop = document.getElementById("mobileBackdrop");

  const isOpen = sidebar.classList.contains("show");

  if (isOpen) {
    sidebar.classList.remove("show");
    backdrop.classList.remove("show");
  } else {
    sidebar.classList.add("show");
    backdrop.classList.add("show");
  }
}
  function toggleCopilotSidebar(force) {
  
  const editor = $(".editor-area");
  if (!copilotSidebar) return;

  if (force === true) {
    isCopilotOpen = true;
    copilotSidebar.classList.add("open");
    copilotSidebar.classList.remove("minimized");
    editor?.classList.add("with-copilot");
    persistState();
    return;
  }

  if (force === false) {
    isCopilotOpen = false;
    copilotSidebar.classList.remove("open", "minimized");
    editor?.classList.remove("with-copilot");
    persistState();
    return;
  }

  isCopilotOpen = !copilotSidebar.classList.contains("open");
  copilotSidebar.classList.toggle("open", isCopilotOpen);

  if (!isCopilotOpen) {
    copilotSidebar.classList.remove("minimized");
  }

  editor?.classList.toggle("with-copilot", isCopilotOpen);
  persistState();
}

  function minimizeCopilot() {
    if (!copilotSidebar) return;
    const editor = $(".editor-area");
    const minimized = copilotSidebar.classList.contains("minimized");
    if (minimized) {
      copilotSidebar.classList.remove("minimized");
      copilotSidebar.classList.add("open");
      editor?.classList.add("with-copilot");
    } else {
      copilotSidebar.classList.add("minimized", "open");
      editor?.classList.remove("with-copilot");
    }
    isCopilotOpen = true;
    persistState();
  }

  function toggleSettings() {
  const settings = document.getElementById("settingsPanel");
  const backdrop = document.getElementById("mobileBackdrop");

  if (window.innerWidth <= 768) {
    settings.classList.toggle("open");
    backdrop.classList.toggle("show");
    return;
  }

  settings?.classList.toggle("open");
}

  function minimizeSettings() {
    if (!settingsPanel) return;
    settingsPanel.classList.toggle("minimized");
    settingsPanel.classList.add("open");
  }

  window.toggleSidebar = toggleSidebar;
  window.toggleCopilotSidebar = toggleCopilotSidebar;
  window.toggleSettings = toggleSettings;
  window.minimizeCopilot = minimizeCopilot;
  window.minimizeSettings = minimizeSettings;

  function setActivityActive(type) {
    const map = { explorer: 0, search: 1, git: 2, files: 3, copilot: 4 };
    $$(".activity-icon").forEach((icon) => icon.classList.remove("active"));
    const index = map[type];
    const icons = $$(".activity-icon");
    if (typeof index === "number" && icons[index]) icons[index].classList.add("active");
  }

  function openSidebar(type) {
    setActivityActive(type);
    if (type === "copilot") return toggleCopilotSidebar(true);
    if (type === "explorer") return toggleSidebar();
    if (type === "search") return openPalette();
    if (type === "git") return printToTerminal("Git panel is simulated. Use 'git log' in terminal.", "warning");
    if (type === "files") return openTab("readme");
  }

  window.openSidebar = openSidebar;

  function setActiveSidebar(tabName) {
    sidebarFiles.forEach((file) => {
      file.classList.toggle("active", file.dataset.tab === tabName || normalizeName(file.textContent) === tabName);
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
        <span class="tab-label">${getLabel(tab).replace(/^[^\s]+\s/, "")}</span>
        <span class="tab-close" aria-label="Close tab">×</span>
      `;
      el.addEventListener("click", () => openTab(tab));
      el.querySelector(".tab-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeTab(tab);
      });
      tabsContainer.appendChild(el);
    });
  }

  function typeWriter(el, text, speed = 18) {
    if (!el) return;
    el.textContent = "";
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        setTimeout(tick, speed);
      }
    };
    tick();
  }

  function startTyping() {
    const typingEl = $("#typingText");
    if (typingEl) typeWriter(typingEl, "// hello world !! Welcome to my portfolio", 16);
  }

  function highlightKeywords() {
    const el = $("#typingHero");
    if (!el) return;
    let html = el.innerHTML;
    ["AI", "Biotechnology", "Health Informatics", "Technology"].forEach((word) => {
      html = html.replace(new RegExp(word, "g"), `<span class=\"gradient-text\">${word}</span>`);
    });
    el.innerHTML = html;
  }

  function startHeroTyping() {
    if (heroTyped) return;
    heroTyped = true;
    const el = $("#typingHero");
    if (!el) return;
    const text = "I design and build intelligent solutions at the intersection of AI, Biotechnology, Health Informatics, and Technology—leveraging data to solve real-world healthcare challenges.";
    let i = 0;
    el.innerHTML = "";
    const type = () => {
      if (i < text.length) {
        el.innerHTML += text.charAt(i++);
        setTimeout(type, 16);
      } else {
        highlightKeywords();
      }
    };
    type();
  }

  function getViews() {
    return {
      home: getHome(),
      about: getAbout(),
      projects: getProjects(),
      skills: getSkills(),
      experience: getExperience(),
      lor: getLOR(),
      contact: getContact(),
      readme: getReadme(),
      resume: getResume()
    };
  }

  function renderContent(tabName) {
    if (!editorContent) return;
    try {
      const views = getViews();
      const safeTab = isValidTab(tabName) ? tabName : "home";
      heroTyped = false;
      editorContent.style.opacity = "0";
      setTimeout(() => {
        editorContent.innerHTML = views[safeTab] || views.home;
        editorContent.style.opacity = "1";
        if (safeTab === "home") {
          startTyping();
          setTimeout(startHeroTyping, 250);
        }
        if (safeTab === "projects" || safeTab === "lor") {
          editorContent.scrollTop = 0;
        }
      }, 80);
    } catch (err) {
      console.error(err);
      editorContent.innerHTML = `<div style=\"padding:20px;color:#ff8a8a\"><h2>⚠️ Error loading content</h2><p>${err.message}</p></div>`;
    }
  }

  function openTab(name) {
    const tabName = normalizeName(name);
    if (!isValidTab(tabName)) return;
    if (!openTabs.includes(tabName)) openTabs.push(tabName);
    activeTab = tabName;
    renderTabs();
    setActiveSidebar(tabName);
    renderContent(tabName);
    closePalette();
    if (isMobile()) closeMobilePanels();
    persistState();
    // ✅ FORCE CLOSE SIDEBAR (GLOBAL FIX)
if (window.innerWidth <= 768) {
  document.getElementById("sidebarPanel")?.classList.remove("show");
  document.getElementById("mobileBackdrop")?.classList.remove("show");
}
  }

  function closeTab(tabName) {
    openTabs = openTabs.filter((t) => t !== tabName);
    if (!openTabs.length) openTabs = ["home"];
    if (activeTab === tabName) activeTab = openTabs[openTabs.length - 1] || "home";
    renderTabs();
    setActiveSidebar(activeTab);
    renderContent(activeTab);
    persistState();
  }

  function closeCurrentTab() {
    if (activeTab) closeTab(activeTab);
  }

  function closeAllTabs() {
    openTabs = ["home"];
    activeTab = "home";
    renderTabs();
    setActiveSidebar("home");
    renderContent("home");
    persistState();
  }

  function closeOtherTabs(tabName = activeTab) {
    if (!tabName) return;
    openTabs = [tabName];
    activeTab = tabName;
    renderTabs();
    setActiveSidebar(tabName);
    renderContent(tabName);
    persistState();
  }

  function closeTabsToRight(tabName = activeTab) {
    const index = openTabs.indexOf(tabName);
    if (index === -1) return;
    openTabs = openTabs.slice(0, index + 1);
    activeTab = tabName;
    renderTabs();
    setActiveSidebar(tabName);
    renderContent(tabName);
    persistState();
  }

  window.openTab = openTab;
  window.closeCurrentTab = closeCurrentTab;
  window.closeAllTabs = closeAllTabs;
  window.closeOtherTabs = closeOtherTabs;
  window.closeTabsToRight = closeTabsToRight;

  function openPalette() {
    if (!paletteOverlay) return;
    paletteOverlay.classList.add("open");
    paletteOverlay.setAttribute("aria-hidden", "false");
    if (paletteInput) {
      paletteInput.value = "";
      filterPalette("");
      setTimeout(() => paletteInput.focus(), 30);
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
    currentPaletteIndex = Math.max(0, Math.min(index, visible.length - 1));
    paletteItems.forEach((item) => item.classList.remove("active"));
    visible[currentPaletteIndex]?.classList.add("active");
  }

  function filterPalette(query) {
    const q = query.toLowerCase().trim();
    paletteItems.forEach((item) => {
      item.style.display = item.innerText.toLowerCase().includes(q) ? "flex" : "none";
    });
    highlightPaletteItem(0);
  }

  function runPaletteItem(item) {
    const txt = item.innerText.toLowerCase();
    if (txt.includes("home")) return openTab("home");
    if (txt.includes("about")) return openTab("about");
    if (txt.includes("projects")) return openTab("projects");
    if (txt.includes("skills")) return openTab("skills");
    if (txt.includes("experience")) return openTab("experience");
    if (txt.includes("lor")) return openTab("lor");
    if (txt.includes("contact")) return openTab("contact");
    if (txt.includes("readme")) return openTab("readme");
    if (txt.includes("resume")) return openTab("resume");
    if (txt.includes("copilot")) return toggleCopilotSidebar(true);
  }

  function bindPaletteEvents() {
    updateCollections();
    if (openPaletteBtn) openPaletteBtn.addEventListener("click", openPalette);
    if (paletteBackdrop) paletteBackdrop.addEventListener("click", closePalette);
    if (paletteInput) {
      paletteInput.addEventListener("input", (e) => filterPalette(e.target.value));
      paletteInput.addEventListener("keydown", (e) => {
        const visible = visiblePaletteItems();
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (visible.length) highlightPaletteItem((currentPaletteIndex + 1) % visible.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (visible.length) highlightPaletteItem((currentPaletteIndex - 1 + visible.length) % visible.length);
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (visible.length) runPaletteItem(visible[currentPaletteIndex]);
        }
      });
    }
    paletteItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const visible = visiblePaletteItems();
        const idx = visible.indexOf(item);
        if (idx !== -1) highlightPaletteItem(idx);
      });
      item.addEventListener("click", () => runPaletteItem(item));
    });
  }

  function bindMenuEvents() {
    updateCollections();
    menuItems.forEach((menu) => {
      const clickHandler = (e) => {
        e.stopPropagation();
        const label = safeText(menu.childNodes[0]?.textContent || "").toLowerCase();
        const isActive = menu.classList.contains("active");
        menuItems.forEach((m) => m.classList.remove("active"));
        if (!isActive) menu.classList.add("active");
        if (label === "copilot") toggleCopilotSidebar(true);
      };
      menu.addEventListener("click", clickHandler);
      if (isMobile()) menu.addEventListener("touchstart", clickHandler, { passive: false });
    });

    document.addEventListener("click", () => {
      menuItems.forEach((m) => m.classList.remove("active"));
    });

    $$(".dropdown").forEach((drop) => {
      drop.addEventListener("click", (e) => e.stopPropagation());
    });
  }

  function bindSidebarEvents() {
  updateCollections();

  sidebarFiles.forEach((file) => {
    file.addEventListener("click", () => {

      // ✅ GET TAB NAME CORRECTLY
      const tabName = file.dataset.tab || normalizeName(file.textContent);

      openTab(tabName);

      // ✅ CLOSE SIDEBAR (MOBILE FIX)
      if (window.innerWidth <= 768) {
        document.getElementById("sidebarPanel")?.classList.remove("show");
        document.getElementById("mobileBackdrop")?.classList.remove("show");
      }
    });
  });

  $(".copilot-box")?.addEventListener("click", () => toggleCopilotSidebar(true));
}

 function toggleTerminal() {
  
  if (!terminal) return;

  terminal.classList.toggle("open");

  if (terminal.classList.contains("open")) {
    terminalInput?.focus();
  }
}
  function clearTerminal() {
    if (terminalBody) terminalBody.innerHTML = "";
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
    if (typeof loadPyodide === "undefined") throw new Error("Pyodide is not loaded. Add pyodide.js to your HTML.");
    printToTerminal("Loading Python runtime...", "warning");
    pyodideInstance = await loadPyodide();
    printToTerminal("Python runtime ready.", "success");
    return pyodideInstance;
  }

  async function runJavaScriptInTerminal(code) {
    try {
      const result = Function(`\"use strict\"; return (${code})`)();
      printToTerminal(String(result), "success");
    } catch (_) {
      try {
        const result = Function(`\"use strict\"; ${code}`)();
        printToTerminal(result !== undefined ? String(result) : "JavaScript executed.", "success");
      } catch (err) {
        printToTerminal(`JS Error: ${err.message}`, "error");
      }
    }
  }

  async function runPythonInTerminal(code) {
    try {
      const py = await initPyodideEngine();
      const result = py.runPython(code);
      printToTerminal(result !== undefined ? String(result) : "Python executed.", "success");
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
        [
          "Available commands:",
          "ls — list files",
          "pwd — print working directory",
          "cd <dir> — change directory",
          "cat <file> — open a file",
          "open <file> — open a file",
          "whoami — who am I?",
          "echo <text> — print text",
          "date — current date & time",
          "git log — show recent commits",
          "python --version — show Python runtime status",
          "js <code> — execute JavaScript",
          "py <code> — execute Python",
          "copilot — open Agrani's Copilot",
          "lor — open LOR section",
          "clear — clear terminal"
        ].forEach((line, i) => printToTerminal(line, i === 0 ? "success" : "normal"));
        break;
      case "ls":
        printToTerminal("home.tsx  about.html  projects.js  skills.json  experience.ts  lor.pdf  contact.css  README.md  Resume.pdf");
        break;
      case "pwd":
        printToTerminal(`/portfolio/${currentDir === "~" ? "" : currentDir}`.replace(/\/$/, ""));
        break;
      case "cd":
        currentDir = !parts[1] || parts[1] === "~" || parts[1] === ".." ? "~" : parts[1];
        printToTerminal(`moved to ${currentDir}`, "success");
        break;
      case "cat":
      case "open":
        if (!parts[1]) {
          printToTerminal(`usage: ${first} <file>`, "error");
          break;
        }
        const target = normalizeName(parts[1]);
        if (isValidTab(target)) {
          openTab(target);
          printToTerminal(`opening ${parts[1]}`, "success");
        } else {
          printToTerminal(`file not found: ${parts[1]}`, "error");
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
      case "js":
        await runJavaScriptInTerminal(cmd.slice(3).trim());
        break;
      case "py":
        await runPythonInTerminal(cmd.slice(3).trim());
        break;
      case "projects":
      case "about":
      case "skills":
      case "experience":
      case "contact":
      case "readme":
      case "resume":
      case "home":
      case "lor":
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
        terminalInput.value = terminalHistoryIndex >= terminalHistory.length ? "" : terminalHistory[terminalHistoryIndex] || "";
      }
    });
  }

  window.toggleTerminal = toggleTerminal;
  window.clearTerminal = clearTerminal;

  function downloadResume() {
    window.open("docs/Agrani Sinha Resume.pdf", "_blank");
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

  if (red) {
    red.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isMobile()) {
        closeMobilePanels();
      }
      showMessage(funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)]);
    });
  }

  if (yellow) {
    yellow.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isMobile()) {
        toggleSidebar();
      } else {
        document.body.style.transition = "transform 0.2s ease";
        document.body.style.transform = "scale(0.97)";
        setTimeout(() => (document.body.style.transform = "scale(1)"), 180);
      }
    });
  }

  if (green) {
    green.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isMobile()) {
        toggleCopilotSidebar(true);
      } else {
        toggleFullscreen();
      }
    });
  }

  function bindCursorEffects() {
    if (!cursorSquare || !cursorDot || isMobile()) return;
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

  



function sendCopilotPrompt(customText = "") {
  const { input } = getSiriElements();
  if (!input) return;

  const text = (customText || input.value || "").trim();
  if (!text) return;

  input.value = text;

  // ✅ ONLY THIS
  sendMessage();
}

  function quickAsk(text) {
    toggleCopilotSidebar(true);
  
    const { input } = getSiriElements();
    if (input) {
      input.value = text;
      sendMessage(); // ✅ USE NEW SIRI
    }
  }



  function bindCopilotEvents() {
    
    $("#copilotSideClose")?.addEventListener("click", () => toggleCopilotSidebar(false));
    $("#copilotSideMinimize")?.addEventListener("click", (e) => {
      e.stopPropagation();
      minimizeCopilot();
    });
    $$(".copilot-suggest", copilotSidebar).forEach((btn) => {
      btn.addEventListener("click", () => quickAsk(btn.dataset.quick || btn.textContent));
    });
  }

  window.quickAsk = quickAsk;
  window.sendCopilotPrompt = sendCopilotPrompt;


  function handleResize() {
    if (isMobile()) {
      if (cursorSquare) cursorSquare.style.display = "none";
      if (cursorDot) cursorDot.style.display = "none";
    } else {
      if (cursorSquare) cursorSquare.style.display = "";
      if (cursorDot) cursorDot.style.display = "";
      closeMobilePanels();
    }
  }

  let touchStartX = 0;
  document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  document.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (!isMobile()) return;
    if (touchStartX < 40 && touchEndX > 110) openMobilePanel("sidebar");
    if (touchStartX > 200 && touchEndX < 100) closeMobilePanels();
  });

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
      settingsPanel?.classList.remove("open");
      closeMobilePanels();
      if (!isMobile()) toggleCopilotSidebar(false);
    }
  });

  bindCursorEffects();
  bindTerminalEvents();
  restoreState();
  updateCollections();
  bindSidebarEvents();
  bindMenuEvents();
  bindPaletteEvents();
  bindCopilotEvents();
  applyTheme(currentTheme);
  handleResize();
  window.addEventListener("resize", handleResize);

  if (!openTabs.length) openTabs = ["home"];
  if (!activeTab || !isValidTab(activeTab)) activeTab = openTabs[0] || "home";
  if (isCopilotOpen && !isMobile()) toggleCopilotSidebar(true);

  renderTabs();
  setActiveSidebar(activeTab);
  renderContent(activeTab);
  persistState();
});

function getHome() {
  return `
    <div class="home-container home-animate">
      <div class="home-grid">
        <div class="home-left">
          <p class="code-line" id="typingText"></p>
          <h1 class="hero-name hero-reveal">Agrani <span>Sinha</span></h1>
          <div class="roles role-reveal">
            <span>AI Engineer</span>
            <span>Clinical Informatics</span>
            <span>Data Scientist</span>
            <span>Healthcare Systems</span>
          </div>
          <p class="hero-desc desc-reveal"><span id="typingHero"></span></p>
          <div class="home-buttons button-reveal">
            <button onclick="openTab('projects')">📁 Projects</button>
            <button onclick="openTab('about')">👤 About</button>
            <button onclick="openTab('contact')">✉️ Contact</button>
          </div>
          <div class="stats stats-reveal">
            <div class="stat-card"><strong>10+</strong><span>Projects</span></div>
            <div class="stat-card"><strong>3+</strong><span>Years Experience</span></div>
          </div>
        </div>
        <div class="home-right image-reveal">
          <div class="profile-wrapper floating-photo">
            <div class="profile-glow"></div>
            <img src="assets/images/profile.png" alt="Agrani Sinha" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=&quot;profile-fallback&quot;>AS</div>';" />
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
          to design solutions that are practical, efficient, and impactful.
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
            <p>Lead marketing and digital outreach for healthcare informatics events, guest lectures, and student engagement activities.</p>
          </div>
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
        <div class="project-card"><h3>ML Drug Discovery</h3><p>Built SVM models with 96.8% accuracy for tuberculosis inhibitor prediction.</p></div>
        <div class="project-card"><h3>Inventory Management App</h3><p>Flutter app with Google Sheets backend.</p></div>
        <div class="project-card clickable" onclick="openProjectCarousel(['assets/images/Biocalculator/bio1.webp','assets/images/Biocalculator/bio2.webp','assets/images/Biocalculator/bio3.webp','assets/images/Biocalculator/bio4.webp'])"><h3>Bio Calculator App</h3><p>Lab calculation tool published on Play Store.</p><span class="view-btn">👁 View</span></div>
        <div class="project-card clickable" onclick="openProjectCarousel(['assets/images/WhatsApp Image 2026-04-13 at 22.27.44 (1).jpeg','assets/images/WhatsApp Image 2026-04-13 at 22.27.44 (4).jpeg','assets/images/WhatsApp Image 2026-04-13 at 22.27.45.jpeg'])"><h3>Respiratory Health Chatbot</h3><p>Interactive healthcare chatbot using Vue.js.</p><span class="view-btn">👁 View</span></div>
        <div class="project-card"><h3>AI Plant Identification</h3><p>TensorFlow system for plant detection.</p></div>
        <div class="project-card clickable" onclick="window.open('https://github.com/agranisinha/AI-chess-and-checker', '_blank')">
          <h3>AI Chess & Checkers</h3>
          <p>Developed intelligent AI systems for Chess and Checkers using strategic algorithms and game theory.</p>
          <div class="project-actions">
            <button class="github-btn" onclick="event.stopPropagation(); window.open('https://github.com/agranisinha/AI-chess-and-checker', '_blank')">🔗 View on GitHub</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getLOR() {
  return `
    <div class="projects-container">
      <p class="code-line">// LORs - Recommendations</p>
      <h1 class="hero-name">Letters of Recommendation</h1>
      <div class="project-grid">
        <div class="project-card clickable" onclick="openLOR('docs/Agrani Letter of Recommendation.pdf')"><h3>Clinical Informatics Internship</h3><p>Alivia Care</p><span class="view-btn">📄 View LOR</span></div>
        <div class="project-card clickable" onclick="openLOR('docs/LemonadestandLOR.jpeg')"><h3>Graphic Design & Game Development</h3><p>Lemonade Stand Bootcamp</p><span class="view-btn">📄 View LOR</span></div>
        <div class="project-card clickable" onclick="openLOR('docs/cdri-lor.jpeg')"><h3>Academic Recommendation</h3><p>Central Drug Research Institute</p><span class="view-btn">📄 View LOR</span></div>
        <div class="project-card clickable" onclick="openLOR('docs/sanfoundry-lor.jpeg')"><h3>Content Developer Role</h3><p>Sanfoundry</p><span class="view-btn">📄 View LOR</span></div>
      </div>
    </div>
  `;
}

function getSkills() {
  return `
    <div class="about-container">
      <p class="code-line">{ /* skills.json */ }</p>
      <h1 class="hero-name">Skills</h1>
      <div class="about-card"><h3 class="section-title">PROGRAMMING</h3><div class="skills-grid"><span class="skills-chip">Python</span><span class="skills-chip">Java</span><span class="skills-chip">C</span><span class="skills-chip">C++</span><span class="skills-chip">JavaScript</span><span class="skills-chip">HTML</span><span class="skills-chip">CSS</span><span class="skills-chip">Flutter</span></div></div>
      <div class="about-card"><h3 class="section-title">AI & DATA</h3><div class="skills-grid"><span class="skills-chip">TensorFlow</span><span class="skills-chip">Machine Learning</span><span class="skills-chip">Computer Vision</span><span class="skills-chip">Jupyter Notebook</span><span class="skills-chip">Google Colab</span><span class="skills-chip">SAS</span><span class="skills-chip">Microsoft Excel</span></div></div>
      <div class="about-card"><h3 class="section-title">HEALTHCARE TOOLS</h3><div class="skills-grid"><span class="skills-chip">EHRGo</span><span class="skills-chip">WellSky</span><span class="skills-chip">Clinical Informatics</span><span class="skills-chip">Healthcare Analytics</span></div></div>
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
          <div class="timeline-item"><strong>Clinical Informatics Intern — Alivia Care</strong><span>Jacksonville, FL • Oct 2025 – Feb 2026</span><p>Analyzed clinical workflows, supported EHR-based reporting initiatives, and collaborated with informatics teams.</p></div>
          <div class="timeline-item"><strong>Data Science Analyst — BluCognition</strong><span>Pune, India • Mar 2022 – Jun 2023</span><p>Developed TensorFlow-based CNN models for bank statement extraction and financial document classification.</p></div>
          <div class="timeline-item"><strong>Academic Research Associate — Digiversal Consultant</strong><span>Noida, India • Dec 2020 – Mar 2022</span><p>Conducted technical research and data analysis for IT and analytics consulting projects.</p></div>
          <div class="timeline-item"><strong>Bioinformatics Research Intern — IBAB</strong><span>Remote • Jul 2020 – Dec 2020</span><p>Curated biological datasets and organized genomic data.</p></div>
          <div class="timeline-item"><strong>Microbiology Trainee — SRL Diagnostics</strong><span>Noida, India • Jun 2018 – Jul 2018</span><p>Conducted microbial testing using culture techniques and microscopy.</p></div>
          <div class="timeline-item"><strong>Content Developer — Sanfoundry</strong><span>Remote • Dec 2017 – Mar 2018</span><p>Developed and curated 1000+ bioprocess engineering MCQs.</p></div>
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
        <p>This portfolio presents my work across <span class="highlight">health informatics, AI, machine learning, data analytics, and software systems</span>. Use the sidebar or tabs to explore About, Projects, Skills, Experience, Contact, LOR, and Resume.</p>
      </div>
    </div>
  `;
}

function getResume() {
  return `
    <div class="about-container">
      <p class="code-line">/* Resume.pdf */</p>
      <h1 class="hero-name">Resume</h1>
      <div class="about-card">
        <p>Open my latest resume for the complete professional record.</p>
        <div class="home-buttons">
          <button onclick="window.open('docs/Agrani Sinha Resume.pdf', '_blank')">📄 Open Resume</button>
        </div>
      </div>
    </div>
  `;
}

window.openLOR = function (src) {
  const modal = document.createElement("div");
  modal.className = "image-modal";
  const isPDF = src.toLowerCase().endsWith(".pdf");
  modal.innerHTML = `
    <div class="image-modal-content">
      <span class="close-modal">&times;</span>
      ${isPDF ? `<iframe src="${src}" frameborder="0"></iframe>` : `<img src="${src}" class="lor-img" />`}
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close-modal").onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
};

window.openProjectCarousel = function (images) {
  let current = 0;
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
    <div class="carousel-container">
      <span class="close-modal">&times;</span>
      <button class="nav prev">❮</button>
      <img class="carousel-img" src="${images[0]}" />
      <button class="nav next">❯</button>
    </div>
  `;
  document.body.appendChild(modal);
  const img = modal.querySelector(".carousel-img");
  modal.querySelector(".close-modal").onclick = () => modal.remove();
  modal.querySelector(".prev").onclick = (e) => {
    e.stopPropagation();
    current = (current - 1 + images.length) % images.length;
    img.src = images[current];
  };
  modal.querySelector(".next").onclick = (e) => {
    e.stopPropagation();
    current = (current + 1) % images.length;
    img.src = images[current];
  };
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
};

document.getElementById("mobileBackdrop")?.addEventListener("click", () => {
  document.getElementById("sidebarPanel")?.classList.remove("show");
  document.getElementById("mobileBackdrop")?.classList.remove("show");
});

let startX = 0;

document.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  let diff = endX - startX;

  // 👉 Swipe right → open sidebar
  if (diff > 100 && startX < 50) {
    document.getElementById("sidebarPanel")?.classList.add("show");
    document.getElementById("mobileBackdrop")?.classList.add("show");
  }

  // 👉 Swipe left → close sidebar
  // Swipe LEFT to close
if (diff < -100) {
  document.getElementById("sidebarPanel")?.classList.remove("show");
  document.getElementById("mobileBackdrop")?.classList.remove("show");
}
});

document.getElementById("mobileBackdrop")?.addEventListener("click", () => {
  document.getElementById("sidebarPanel")?.classList.remove("show");
  document.getElementById("mobileBackdrop")?.classList.remove("show");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.getElementById("sidebarPanel")?.classList.remove("show");
    document.getElementById("mobileBackdrop")?.classList.remove("show");
  }
});
/* ================= SIRI COPILOT ================= */

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;
}

function getSiriElements() {
  return {
    input: document.getElementById("copilotInput"),
    messages: document.getElementById("copilotMessages"),
    voiceBtn: document.getElementById("copilotVoice"),
    sendBtn: document.getElementById("copilotSend"),
    orb: document.getElementById("siriOrb"),
    status: document.getElementById("siriStatus"),
    hint: document.getElementById("siriHint")
  };
}

function addCopilotMessage(text, sender = "bot") {
  const { messages } = getSiriElements();
  if (!messages) return;

  const div = document.createElement("div");
  div.className = sender === "user" ? "user-msg" : "bot-msg";
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function setSiriState(state = "idle", label = "", hintText = "") {
  const { orb, voiceBtn, status, hint } = getSiriElements();
  if (!orb || !voiceBtn) return;

  orb.classList.remove("listening", "speaking", "thinking");
  voiceBtn.classList.remove("listening");

  if (state === "listening") {
    orb.classList.add("listening");
    voiceBtn.classList.add("listening");
    voiceBtn.textContent = "🎙️";
  } else if (state === "speaking") {
    orb.classList.add("speaking");
    voiceBtn.textContent = "🔊";
  } else if (state === "thinking") {
    orb.classList.add("thinking");
    voiceBtn.textContent = "✨";
  } else {
    voiceBtn.textContent = "🎤";
  }

  if (status && label) status.textContent = label;
  if (hint && hintText) hint.textContent = hintText;
}

function getNaturalReply(message) {
  try {
    const msg = (message || "").toLowerCase();

    const random = (arr) =>
      Array.isArray(arr) && arr.length
        ? arr[Math.floor(Math.random() * arr.length)]
        : "";

    /* ===== PROJECTS ===== */
    if (msg.includes("project")) {
      return {
        reply: random([
          "Sure. Opening Agrani’s projects.",
          "Here are some of Agrani’s key projects.",
          "Let me show you what Agrani has built.",
          "Opening the projects section now.",
          "Let’s explore Agrani’s work."
        ]),
        action: () => openTab("projects")
      };
    }

    /* ===== SKILLS ===== */
    if (msg.includes("skill") || msg.includes("tech")) {
      return {
        reply: random([
          "Here are Agrani’s core skills.",
          "Showing Agrani’s technical strengths.",
          "These are the technologies Agrani works with.",
          "Let me walk you through Agrani’s skill set."
        ]),
        action: () => openTab("skills")
      };
    }

    /* ===== EXPERIENCE ===== */
    if (msg.includes("experience") || msg.includes("work")) {
      return {
        reply: random([
          "Here’s Agrani’s professional experience.",
          "Showing Agrani’s career journey.",
          "Let me open Agrani’s experience section."
        ]),
        action: () => openTab("experience")
      };
    }

    /* ===== CONTACT ===== */
    if (msg.includes("contact") || msg.includes("email")) {
      return {
        reply: random([
          "Here’s how you can contact Agrani.",
          "Opening Agrani’s contact details.",
          "You can reach Agrani through the contact section."
        ]),
        action: () => openTab("contact")
      };
    }

    /* ===== RESUME ===== */
    if (msg.includes("resume")) {
      return {
        reply: random([
          "Opening Agrani’s resume.",
          "Here’s Agrani’s professional resume.",
          "Let me bring up Agrani’s resume for you."
        ]),
        action: () => openTab("resume")
      };
    }

    /* ===== ABOUT ===== */
    if (msg.includes("about")) {
      return {
        reply: random([
          "Here’s more information about Agrani.",
          "Let me introduce Agrani to you.",
          "Opening the about section."
        ]),
        action: () => openTab("about")
      };
    }

    /* ===== GREETING ===== */
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return {
        reply: random([
          "Hello. How can I assist you today?",
          "Hi there. What would you like to explore?",
          "Hello. I can guide you through Agrani’s portfolio."
        ]),
        action: null
      };
    }

    /* ===== DEFAULT ===== */
    return {
      reply: random([
        "You can ask about Agrani’s projects, skills, or experience.",
        "I can guide you through different sections of the portfolio.",
        "Try asking something like show projects or open skills.",
        "I’m here to help you explore Agrani’s work."
      ]),
      action: null
    };

  } catch (error) {
    console.error("Siri Error:", error);

    // ✅ SAFE FALLBACK (prevents "Thinking..." freeze)
    return {
      reply: "You can ask about Agrani’s projects, skills, or experience.",
      action: null
    };
  }
}

function sendMessage() {
  const { input } = getSiriElements();
  if (!input) return;

  const raw = input.value.trim();
  if (!raw) return;

  // 👤 USER MESSAGE
  addCopilotMessage(raw, "user");
  input.value = "";

  // 🧠 Thinking state
  setSiriState("thinking", "Thinking…", "Working on that.");

  let response = {};
  try {
    response = getNaturalReply(raw) || {};
  } catch (e) {
    console.error("Reply error:", e);
  }

  const reply =
    response.reply ||
    "You can ask about Agrani’s projects, skills, or experience.";
  const action = response.action || null;

  // ⚡ RESPONSE FLOW
  setTimeout(() => {
    try {
      addCopilotMessage(reply, "bot");
    } catch (e) {
      console.error("Message error:", e);
    }

    // 🚀 Run action immediately
    if (typeof action === "function") {
      try {
        action();
      } catch (e) {
        console.error("Action error:", e);
      }
    }

    // 🎤 Speak (non-blocking)
    setTimeout(() => {
      try {
        speak(reply);
      } catch (e) {
        console.error("Speak error:", e);
      }
    }, 100);

    // ✅ Reset UI (prevents stuck)
    setTimeout(() => {
      setSiriState(
        "idle",
        "Hi! I’m Agrani’s Siri Copilot 👋",
        "Tap the mic and ask about projects, skills, experience, resume, or contact."
      );
    }, 700);

  }, 200);
}
  
function speak(text) {
  if (!("speechSynthesis" in window)) return;

  // 🚫 stop previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.pitch = 1;

  utterance.onstart = () => {
    setSiriState("speaking", "Speaking…", "Here’s what I found.");
  };

  utterance.onend = () => {
    setSiriState("idle");
  };

  speechSynthesis.speak(utterance);
}
function startListening() {
  const { input } = getSiriElements();

  if (!recognition) {
    addCopilotMessage("Voice input is not supported in this browser. Please use Chrome or Safari.", "bot");
    speak("Voice input is not supported in this browser.");
    return;
  }

  setSiriState("listening", "Listening…", "Speak naturally.");
  input?.focus();

  recognition.start();
}

if (recognition) {
  recognition.onresult = function (event) {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(" ")
      .trim();

    const { input } = getSiriElements();
    if (input) input.value = transcript;
  };

  recognition.onend = function () {
    const { input } = getSiriElements();
    const value = input?.value?.trim();

    if (value) {
      setSiriState("thinking", "Thinking…", "I heard you.");
      sendMessage();
    } else {
      setSiriState("idle", "Hi! I’m Agrani’s Siri Copilot 👋", "Tap the mic and ask about projects, skills, experience, resume, or contact.");
    }
  };

  recognition.onerror = function () {
    setSiriState("idle", "Hi! I’m Agrani’s Siri Copilot 👋", "Tap the mic and try again.");
    addCopilotMessage("I couldn’t catch that. Please try again.", "bot");
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const { input, sendBtn, voiceBtn } = getSiriElements();

  sendBtn?.addEventListener("click", sendMessage);
  voiceBtn?.addEventListener("click", startListening);

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
});
