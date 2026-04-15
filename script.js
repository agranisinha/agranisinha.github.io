document.addEventListener("DOMContentLoaded", () => {
  const editorContent = document.getElementById("editorContent");
  const tabsContainer = document.getElementById("editorTabs");

  const paletteOverlay = document.getElementById("paletteOverlay");
  const paletteBackdrop = document.getElementById("paletteBackdrop");
  const openPaletteBtn = document.getElementById("openPaletteBtn");
  const paletteInput = document.getElementById("paletteInput");
  const paletteItems = Array.from(document.querySelectorAll(".palette-item"));

  const settingsPanel = document.getElementById("settingsPanel");

  const red = document.getElementById("btnRed");
  const yellow = document.getElementById("btnYellow");
  const green = document.getElementById("btnGreen");
  const feedback = document.getElementById("headerFeedback");

  const sidebarFiles = document.querySelectorAll(".file");
  const menuItems = document.querySelectorAll(".menu-item");

  const cursorSquare = document.getElementById("cursorSquare");
  const cursorDot = document.getElementById("cursorDot");

  const terminal = document.getElementById("terminalPanel");
  const terminalBody = document.getElementById("terminalBody");
  const terminalInput = document.getElementById("terminalInput");

  let openTabs = [];
  let activeTab = "";
  let currentPaletteIndex = 0;
  let currentDir = "~";

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
    resume: "📕 Resume.pdf",
    copilot: "✨ copilot.md"
  };

  const COPILOT_REPLIES = {
    intro:
      "Hi — I’m Agrani’s portfolio copilot. Ask about projects, experience, skills, healthcare AI work, education, or contact details.",
    projects:
      "Agrani has built projects across ML drug discovery, Flutter inventory systems, healthcare chatbots, AI plant identification, bioinformatics, and AI game systems.",
    experience:
      "Agrani’s experience includes Clinical Informatics Intern at Alivia Care, Data Science Analyst at BluCognition, Academic Research Associate at Digiversal, and research roles in bioinformatics and diagnostics.",
    skills:
      "Core skills include Python, Java, C/C++, JavaScript, HTML/CSS, Flutter, TensorFlow, Machine Learning, Computer Vision, SAS, Excel, EHRGo, WellSky, Android Studio, and GitHub.",
    education:
      "Agrani is pursuing an M.S. in Health Informatics at the University of North Florida and completed an Integrated Master of Technology in Biotechnology from JIIT.",
    contact:
      "You can contact Agrani at agbrian521@gmail.com, phone (904) 228-1179, based in Jacksonville, FL.",
    healthcare:
      "Agrani’s work focuses on AI-driven healthcare systems, clinical informatics, healthcare analytics, digital health solutions, and EHR-centered workflows.",
    default:
      "I can answer questions about Agrani’s projects, experience, skills, education, healthcare AI focus, and contact details."
  };

  const views = {
    home: getHome(),
    about: getAbout(),
    projects: getProjects(),
    skills: getSkills(),
    experience: getExperience(),
    contact: getContact(),
    readme: getReadme(),
    resume: getResume()
  };

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
    if (value.includes("copilot")) return "copilot";
    return "home";
  }

  function getIcon(tab) {
    return TAB_LABELS[tab] ? TAB_LABELS[tab].split(" ")[0] : "📄";
  }

  function getLabel(tab) {
    return TAB_LABELS[tab] || `📄 ${tab}`;
  }

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
        <span class="tab-label">${getLabel(tab).replace(/^[^\s]+\s/, "")}</span>
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
    const targets = editorContent.querySelectorAll(
      ".hero-name, .roles span, .hero-desc, .home-buttons button, .stat-card, .about-card, .project-card, .timeline-item, .skills-chip, .profile-wrapper, .copilot-card"
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
      typeWriter(typingEl, "// hello world !! Welcome to my portfolio");
    }
  }

  function renderContent(tabName) {
    if (!editorContent) return;
    editorContent.style.opacity = "0";

    setTimeout(() => {
      editorContent.innerHTML = views[tabName] || views.home;
      editorContent.style.opacity = "1";
      if (tabName === "home") startTyping();
      animateInsertedContent();
      if (tabName === "copilot") initCopilotUI();
    }, 160);
  }

  function openTab(name) {
    const tabName = normalizeName(name);

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

    if (activeTab === tabName) {
      activeTab = openTabs[openTabs.length - 1] || "home";
    }

    renderTabs();
    setActiveSidebar(activeTab);
    renderContent(activeTab);
  }

  window.openTab = openTab;

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
    currentPaletteIndex = Math.max(0, Math.min(index, visible.length - 1));
    paletteItems.forEach((item) => item.classList.remove("active"));
    visible[currentPaletteIndex].classList.add("active");
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

    if (txt.includes("copilot")) {
      openTab("copilot");
      return;
    }
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
    }
  }

  if (openPaletteBtn) openPaletteBtn.addEventListener("click", openPalette);
  if (paletteBackdrop) paletteBackdrop.addEventListener("click", closePalette);

  if (paletteInput) {
    paletteInput.addEventListener("input", (e) => {
      filterPalette(e.target.value);
    });

    paletteInput.addEventListener("keydown", (e) => {
      const visible = visiblePaletteItems();

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (visible.length) highlightPaletteItem((currentPaletteIndex + 1) % visible.length);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (visible.length) {
          highlightPaletteItem((currentPaletteIndex - 1 + visible.length) % visible.length);
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (visible.length) runPaletteItem(visible[currentPaletteIndex]);
      }
    });
  }

  paletteItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      highlightPaletteItem(index);
    });

    item.addEventListener("click", () => {
      runPaletteItem(item);
    });
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
      e.preventDefault();
      openPalette();
    }

    if (e.key === "Escape") {
      closePalette();
      if (settingsPanel) settingsPanel.classList.remove("open");
    }
  });

  window.toggleSettings = function toggleSettings() {
    if (settingsPanel) settingsPanel.classList.toggle("open");
  };

  window.setTheme = function setTheme(theme) {
    document.body.className = theme === "dark" ? "" : theme;
    document.querySelectorAll(".theme-option").forEach((el) => {
      el.classList.remove("active");
    });

    if (window.event && window.event.currentTarget) {
      window.event.currentTarget.classList.add("active");
    }
  };

  window.openSidebar = function openSidebar(type) {
    document.querySelectorAll(".activity-icon").forEach((icon) => {
      icon.classList.remove("active");
    });

    if (window.event && window.event.currentTarget) {
      window.event.currentTarget.classList.add("active");
    }

    if (type === "copilot") {
      openTab("copilot");
    }
  };

  function toggleSidebar() {
    const panel = document.querySelector(".sidebar-panel");
    if (panel) panel.classList.toggle("hide");
  }

  function toggleTerminal() {
    if (!terminal) return;
    terminal.classList.toggle("open");
    if (terminal.classList.contains("open") && terminalInput) {
      terminalInput.focus();
    }
  }

  function clearTerminal() {
    if (terminalBody) terminalBody.innerHTML = "";
  }

  function downloadResume() {
    window.open("Agrani Sinha Resume(1).docx", "_blank");
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  window.toggleSidebar = toggleSidebar;
  window.toggleTerminal = toggleTerminal;
  window.clearTerminal = clearTerminal;
  window.downloadResume = downloadResume;
  window.toggleFullscreen = toggleFullscreen;

  menuItems.forEach((menu) => {
    menu.addEventListener("click", (e) => {
      const text = e.currentTarget.firstChild.textContent.trim().toLowerCase();

      if (text === "file") openTab("home");
      if (text === "view") toggleSidebar();
      if (text === "go") openPalette();
      if (text === "run") openTab("projects");
      if (text === "terminal") toggleTerminal();
      if (text === "help") openTab("readme");
      if (text === "copilot") openTab("copilot");
    });
  });

  sidebarFiles.forEach((file) => {
    file.addEventListener("click", () => {
      openTab(file.textContent.toLowerCase());
    });
  });

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

function runTerminalCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;

  printToTerminal(`agrani@portfolio:${currentDir}$ ${cmd}`);

  const parts = cmd.split(" ");
  const first = parts[0].toLowerCase();

  switch (first) {
    case "help":
      printToTerminal("📘 Available commands:", "success");
      printToTerminal("ls, cd, pwd, open <file>, whoami, clear, date");
      break;

    case "ls":
      printToTerminal("📂 Files:");
      printToTerminal("home.tsx  about.html  projects.js  skills.json  experience.ts  contact.css");
      break;

    case "pwd":
      printToTerminal(`/portfolio/${currentDir === "~" ? "" : currentDir}`);
      break;

    case "cd":
      if (!parts[1] || parts[1] === "~") {
        currentDir = "~";
      } else if (parts[1] === "..") {
        currentDir = "~";
      } else {
        currentDir = parts[1];
      }
      printToTerminal(`📁 moved to ${currentDir}`, "success");
      break;

    case "open":
    case "cat":
      if (parts[1]) {
        openTab(parts[1]);
        printToTerminal(`📄 opening ${parts[1]}`, "success");
      } else {
        printToTerminal("usage: open <file>", "error");
      }
      break;

    case "whoami":
      printToTerminal("👩‍💻 Agrani Sinha — AI + Health Informatics Engineer", "success");
      break;

    case "date":
      printToTerminal(new Date().toString());
      break;

    case "clear":
      clearTerminal();
      break;

    case "projects":
    case "about":
    case "skills":
    case "experience":
    case "contact":
      openTab(first);
      break;

    default:
      printToTerminal(`❌ command not found: ${cmd}`, "error");
  }
}
  if (terminalInput) {
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        runTerminalCommand(terminalInput.value);
        terminalInput.value = "";
      }
    });
  }

 function initCopilotUI() {
  const chatInput = document.getElementById("copilotInput");
  const chatSend = document.getElementById("copilotSend");
  const chatBody = document.getElementById("copilotMessages");
  const chipButtons = document.querySelectorAll(".copilot-chip");

  if (!chatInput || !chatSend || !chatBody) return;

  function appendMessage(text, role = "assistant") {
    const msg = document.createElement("div");
    msg.className = `copilot-message ${role}`;
    chatBody.appendChild(msg);

    // typing effect for AI
    if (role === "assistant") {
      let i = 0;
      function type() {
        if (i < text.length) {
          msg.textContent += text.charAt(i);
          i++;
          setTimeout(type, 12);
        }
      }
      type();
    } else {
      msg.textContent = text;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function answer(prompt) {
    const q = prompt.toLowerCase();

    if (q.includes("project"))
      return "🚀 Agrani has built ML drug discovery systems, healthcare chatbots, Flutter apps, and AI pipelines.";

    if (q.includes("experience"))
      return "💼 Experience includes Alivia Care (Clinical Informatics), BluCognition (Data Science), and research roles.";

    if (q.includes("skill"))
      return "🧠 Skills: Python, ML, Flutter, TensorFlow, Healthcare Analytics, Computer Vision.";

    if (q.includes("education"))
      return "🎓 MS Health Informatics (UNF) + Integrated M.Tech Biotechnology (JIIT).";

    if (q.includes("contact"))
      return "📩 Email: agbrian521@gmail.com | 📍 Jacksonville, FL";

    return "🤖 Ask me about projects, experience, skills, or healthcare AI!";
  }

  function sendPrompt(text) {
    const cleaned = text.trim();
    if (!cleaned) return;

    appendMessage(cleaned, "user");

    setTimeout(() => {
      appendMessage(answer(cleaned), "assistant");
    }, 300);
  }

  chatSend.onclick = () => {
    sendPrompt(chatInput.value);
    chatInput.value = "";
  };

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendPrompt(chatInput.value);
      chatInput.value = "";
    }
  });

  chipButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sendPrompt(btn.textContent);
    });
  });
}

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

  if (cursorSquare && cursorDot) {
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

  openTab("home");
});

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
          Use the sidebar or tabs to explore sections like About, Projects, Skills, Experience, and Contact.
        </p>
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

function quickAsk(type) {
  sendCopilot(type);

  if (type === "projects") openTab("projects");
  if (type === "experience") openTab("experience");
  if (type === "skills") openTab("skills");
  if (type === "contact") openTab("contact");
}

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    document.getElementById("copilotInput").value = text;
    sendCopilot();
  };

  recognition.start();
}

function sendCopilot() {
  const input = document.getElementById("copilotInput");
  const msg = input.value.trim();
  if (!msg) return;

  appendMessage(msg, "user");

  setTimeout(() => {
    appendMessage(getReply(msg), "assistant");
  }, 300);

  input.value = "";
}

function appendMessage(text, role) {
  const container = document.getElementById("copilotMessages");
  const div = document.createElement("div");

  div.className = `msg ${role}`;
  div.textContent = text;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function getReply(q) {
  q = q.toLowerCase();

  if (q.includes("project")) return "Opening projects 🚀";
  if (q.includes("experience")) return "Showing experience 💼";
  if (q.includes("skills")) return "Here are skills 🧠";
  if (q.includes("contact")) return "Contact info 📩";

  return "Ask me about Agrani!";
}
