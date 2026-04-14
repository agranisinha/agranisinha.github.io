// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

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

  // ================= COMMAND PALETTE =================
  function openPalette() {
    paletteOverlay.classList.add("open");
    setTimeout(() => paletteInput?.focus(), 50);
  }

  function closePalette() {
    paletteOverlay.classList.remove("open");
  }

  openPaletteBtn?.addEventListener("click", openPalette);
  paletteBackdrop?.addEventListener("click", closePalette);

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
      e.preventDefault();
      openPalette();
    }

    if (e.key === "Escape") {
      closePalette();
      settingsPanel.classList.remove("open");
    }
  });

  // ================= SETTINGS =================
  window.toggleSettings = function () {
    settingsPanel.classList.toggle("open");
  };

  // ================= THEMES =================
  window.setTheme = function (theme) {
    document.body.className = theme;

    document.querySelectorAll(".theme-option").forEach(el => {
      el.classList.remove("active");
    });

    event.target.classList.add("active");
  };

  // ================= TAB SYSTEM =================
  function addTab(name, label) {

    const existing = document.querySelector(`.tab[data-tab="${name}"]`);
    if (existing) {
      setActiveTab(existing);
      return;
    }

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.tab = name;

    tab.innerHTML = `
      ${label}
      <span class="close-tab">×</span>
    `;

    tab.onclick = () => {
      openTab(name);
      setActiveTab(tab);
    };

    tab.querySelector(".close-tab").onclick = (e) => {
      e.stopPropagation();
      tab.remove();
    };

    tabsContainer.appendChild(tab);
    setActiveTab(tab);
  }

  function setActiveTab(tab) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  }

  // ================= PAGE NAV =================
  window.openTab = function (tab) {

    const labels = {
      home: "⚛ home.tsx",
      about: "🌐 about.html",
      projects: "🟨 projects.js",
      contact: "🎨 contact.css"
    };

    addTab(tab, labels[tab]);

    editorContent.style.opacity = 0;

    setTimeout(() => {

      if (tab === "home") editorContent.innerHTML = getHome();
      if (tab === "about") editorContent.innerHTML = getAbout();
      if (tab === "projects") editorContent.innerHTML = getProjects();
      if (tab === "contact") editorContent.innerHTML = getContact();

      editorContent.style.opacity = 1;

      startTyping();
      animateElements();

    }, 200);
  };

  // ================= HOME =================
  function getHome() {
    return `
      <div class="home-container">

        <p class="code-line" id="typingText"></p>

        <h1 class="hero-name">
          Agrani <span>Sinha</span>
        </h1>

        <div class="roles">
          <span>Backend Engineer</span>
          <span>AI / ML Dev</span>
          <span>Data Scientist</span>
          <span>Clinical Informatics</span>
        </div>

        <p class="hero-desc">
          I build intelligent healthcare systems using AI, machine learning,
          and clinical informatics to solve real-world problems.
        </p>

        <div class="home-buttons">
          <button onclick="openTab('projects')">📁 Projects</button>
          <button onclick="openTab('about')">👤 About</button>
          <button onclick="openTab('contact')">✉️ Contact</button>
        </div>

        <div class="stats">
          <div><strong>10+</strong><span>Projects</span></div>
          <div><strong>6+</strong><span>Experience</span></div>
          <div><strong>96.8%</strong><span>Accuracy</span></div>
        </div>

      </div>
    `;
  }

  // ================= ABOUT (YOUR PROFILE STYLE) =================
  function getAbout() {
    return `
      <div class="about-container">

        <p class="code-line">&lt;!-- about.html - Agrani Sinha --&gt;</p>

        <h1 class="hero-name">About Me</h1>

        <p class="about-sub">// who I am • what I do • where I build</p>

        <div class="about-card">
          <p>
            Hi! I'm <span class="highlight">Agrani Sinha</span>, a software developer 
            working at the intersection of 
            <span class="highlight">AI, backend engineering, and healthcare systems</span>.
            <br/><br/>
            I specialize in building intelligent, scalable solutions using 
            machine learning, clinical informatics, and real-world data systems.
            <br/><br/>
            Currently focused on 
            <span class="highlight">AI-driven healthcare workflows</span>, 
            EHR systems, and production-ready ML pipelines.
          </p>
        </div>

        <div class="about-card">
          <h3 class="section-title">CURRENT FOCUS</h3>

          <div class="focus-grid">
            <div>⚙ Building AI Healthcare Systems</div>
            <div>🤖 ML & LLM Pipelines</div>
            <div>📊 Data Science + Informatics</div>
            <div>🚀 Backend Architectures</div>
          </div>
        </div>

        <div class="about-card">
          <h3 class="section-title">EDUCATION</h3>

          <p>
            🎓 MSc Health Informatics <br/>
            University of North Florida
          </p>

          <p>
            💡 Focus: AI, Clinical Systems, Data Science
          </p>
        </div>

      </div>
    `;
  }

  // ================= PROJECTS =================
  function getProjects() {
    return `
      <div class="home-container">
        <h2 class="hero-name" style="font-size:48px;">Projects</h2>

        <div class="roles">
          <span>AI Chatbot</span>
          <span>Inventory App</span>
          <span>Bioinformatics</span>
          <span>ML Systems</span>
        </div>

        <p class="hero-desc">
          My work combines machine learning, backend systems,
          and healthcare innovation.
        </p>
      </div>
    `;
  }

  // ================= CONTACT =================
  function getContact() {
    return `
      <div class="home-container">
        <h2 class="hero-name" style="font-size:48px;">Contact</h2>

        <p class="hero-desc">
          📧 agbrian521@gmail.com <br/>
          🔗 linkedin.com/in/agranisinha
        </p>
      </div>
    `;
  }

  // ================= TYPING =================
  function startTyping() {
    const el = document.getElementById("typingText");
    if (!el) return;

    const text = "// hello world !! Welcome to my portfolio";
    el.innerHTML = "";

    let i = 0;

    function type() {
      if (i < text.length) {
        el.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, 20);
      }
    }

    type();
  }

  // ================= ANIMATION =================
  function animateElements() {
    const elements = document.querySelectorAll(
      ".hero-name, .roles span, .home-buttons button, .stats div"
    );

    elements.forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(20px)";

      setTimeout(() => {
        el.style.transition = "all 0.4s ease";
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }, i * 80);
    });
  }

  // ================= MAC BUTTONS =================
  const quotes = [
    "Nice try 😏",
    "Still running 🚀",
    "You can't close me 😎",
    "Access denied 😈"
  ];

  function showMessage(msg) {
    feedback.innerText = msg;
    feedback.classList.add("show");

    setTimeout(() => {
      feedback.classList.remove("show");
    }, 2000);
  }

  red.onclick = () => {
    showMessage(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  yellow.onclick = () => {
    document.body.style.transform = "scale(0.96)";
    setTimeout(() => {
      document.body.style.transform = "scale(1)";
    }, 200);
  };

  green.onclick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ================= CURSOR =================
  document.addEventListener("mousemove", (e) => {
    const square = document.getElementById("cursorSquare");
    const dot = document.getElementById("cursorDot");

    square.style.left = e.clientX + "px";
    square.style.top = e.clientY + "px";

    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
  });

  // ================= INITIAL LOAD =================
  openTab("home");

});
