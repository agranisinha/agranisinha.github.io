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

  // ================= TABS =================
  window.openTab = function (tab) {
    const container = document.getElementById("editorContent");

    container.style.opacity = 0;

    setTimeout(() => {
      if (tab === "home") container.innerHTML = getHome();
      if (tab === "about") container.innerHTML = getAbout();
      if (tab === "projects") container.innerHTML = getProjects();
      if (tab === "contact") container.innerHTML = getContact();

      container.style.opacity = 1;
      startTyping();
    }, 200);
  };

  // ================= PAGES =================
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
          I build intelligent healthcare systems using AI, ML, and clinical workflows.
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
    return `<div class="home-container"><h2>About Me</h2></div>`;
  }

  function getProjects() {
    return `<div class="home-container"><h2>Projects</h2></div>`;
  }

  function getContact() {
    return `<div class="home-container"><h2>Contact</h2></div>`;
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
        setTimeout(type, 25);
      }
    }
    type();
  }

  // ================= MAC BUTTONS =================
  const quotes = [
    "Nice try 😏",
    "You can't close me 😎",
    "Still running 🚀",
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

  startTyping();
});
