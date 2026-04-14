// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  const paletteOverlay = document.getElementById("paletteOverlay");
  const paletteBackdrop = document.getElementById("paletteBackdrop");
  const openPaletteBtn = document.getElementById("openPaletteBtn");
  const paletteInput = document.getElementById("paletteInput");

  const settingsPanel = document.getElementById("settingsPanel");

  const red = document.getElementById("btnRed");
  const yellow = document.getElementById("btnYellow");
  const green = document.getElementById("btnGreen");
  const feedback = document.getElementById("headerFeedback");

  const editorContent = document.getElementById("editorContent");

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

  // ================= DYNAMIC PAGES =================
  window.openTab = function (tab) {

    // smooth fade out
    editorContent.style.opacity = 0;

    setTimeout(() => {

      if (tab === "home") editorContent.innerHTML = getHome();
      if (tab === "about") editorContent.innerHTML = getAbout();
      if (tab === "projects") editorContent.innerHTML = getProjects();
      if (tab === "contact") editorContent.innerHTML = getContact();

      // fade in
      editorContent.style.opacity = 1;

      // re-run animations
      startTyping();
      animateElements();

    }, 250);
  };

  // ================= PAGE CONTENT =================
  function getHome() {
    return `
      <div class="home-container">

        <p class="code-line" id="typingText"></p>

        <h1 class="hero-name">
          Agrani <span>Sinha</span>
        </h1>

        <div class="roles">
          <span>AI Engineer</span>
          <span>Clinical Informatics</span>
          <span>Data Scientist</span>
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

  function getAbout() {
    return `
      <div class="home-container">
        <h2 class="hero-name" style="font-size:48px;">About Me</h2>
        <p class="hero-desc">
          I specialize in AI + Healthcare systems, building intelligent,
          user-focused applications that integrate data, clinical workflows,
          and real-world impact.
        </p>
      </div>
    `;
  }

  function getProjects() {
    return `
      <div class="home-container">
        <h2 class="hero-name" style="font-size:48px;">Projects</h2>

        <div class="roles">
          <span>AI Chatbot</span>
          <span>Inventory App</span>
          <span>Drug Discovery ML</span>
          <span>Bioinformatics DB</span>
        </div>

        <p class="hero-desc">
          My work combines machine learning, mobile apps, and healthcare systems.
        </p>
      </div>
    `;
  }

  function getContact() {
    return `
      <div class="home-container">
        <h2 class="hero-name" style="font-size:48px;">Contact</h2>

        <p class="hero-desc">
          Email: agbrian521@gmail.com <br/>
          LinkedIn: linkedin.com/in/agranisinha
        </p>
      </div>
    `;
  }

  // ================= TYPING EFFECT =================
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

  // ================= ANIMATIONS =================
  function animateElements() {
    const elements = document.querySelectorAll(".hero-name, .roles span, .home-buttons button, .stats div");

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

  // ================= INIT LOAD =================
  startTyping();
  animateElements();
});
