// ================= ELEMENTS =================
const openPaletteBtn = document.getElementById("openPaletteBtn");
const paletteOverlay = document.getElementById("paletteOverlay");
const paletteBackdrop = document.getElementById("paletteBackdrop");
const paletteInput = document.getElementById("paletteInput");
const paletteItems = Array.from(document.querySelectorAll(".palette-item"));

const cursorSquare = document.getElementById("cursorSquare");
const cursorDot = document.getElementById("cursorDot");

// ================= COMMAND PALETTE =================
function openPalette() {
  if (!paletteOverlay) return;
  paletteOverlay.classList.add("open");
  paletteOverlay.setAttribute("aria-hidden", "false");
  if (paletteInput) setTimeout(() => paletteInput.focus(), 20);
}

function closePalette() {
  if (!paletteOverlay) return;
  paletteOverlay.classList.remove("open");
  paletteOverlay.setAttribute("aria-hidden", "true");
}

// OPEN BUTTON
if (openPaletteBtn) openPaletteBtn.addEventListener("click", openPalette);
if (paletteBackdrop) paletteBackdrop.addEventListener("click", closePalette);

// SHORTCUT
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
    e.preventDefault();
    openPalette();
  }
  if (e.key === "Escape") closePalette();
});

// ================= CUSTOM CURSOR =================
document.addEventListener("mousemove", (e) => {
  if (!cursorSquare || !cursorDot) return;

  cursorDot.style.left = e.clientX + "px";
  cursorDot.style.top = e.clientY + "px";

  cursorSquare.style.left = e.clientX + "px";
  cursorSquare.style.top = e.clientY + "px";
});

// CLICK ANIMATION
document.addEventListener("mousedown", () => {
  if (cursorSquare) {
    cursorSquare.style.width = "18px";
    cursorSquare.style.height = "18px";
  }
});
document.addEventListener("mouseup", () => {
  if (cursorSquare) {
    cursorSquare.style.width = "24px";
    cursorSquare.style.height = "24px";
  }
});

// ================= SIDEBAR =================
function openSidebar(type) {
  document.querySelectorAll('.activity-icon').forEach(i => i.classList.remove('active'));
  event.target.classList.add('active');
}

// ================= SETTINGS =================
function toggleSettings() {
  document.getElementById('settingsPanel')?.classList.toggle('open');
}

// ================= THEMES =================
function setTheme(theme) {
  document.body.className = theme;

  document.querySelectorAll('.theme-option').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}

// ================= TYPEWRITER =================
function typeWriter(element, text, speed = 30) {
  let i = 0;
  element.innerHTML = "";

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

// ================= TAB SYSTEM =================
function openTab(name) {

  const editor = document.querySelector(".editor-content");
  if (!editor) return;

  // RESET ANIMATION
  editor.style.opacity = 0;

  setTimeout(() => {

    // ================= HOME =================
    if (name === "home") {
      editor.innerHTML = `
        <div class="home-container fade">
          <p id="typingText" class="code-line"></p>

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
            I build intelligent healthcare systems using AI, ML, and clinical workflows.
            My focus is on scalable, impactful, and real-world solutions.
          </p>

          <div class="home-buttons">
            <button onclick="openTab('projects')">📁 Projects</button>
            <button onclick="openTab('about')">👤 About Me</button>
            <button onclick="openTab('contact')">✉️ Contact</button>
          </div>

          <div class="stats">
            <div><strong>10+</strong><span>Projects</span></div>
            <div><strong>6+</strong><span>Experience</span></div>
            <div><strong>96.8%</strong><span>Accuracy</span></div>
          </div>
        </div>
      `;

      // TYPEWRITER
      const typingEl = document.getElementById("typingText");
      if (typingEl) {
        typeWriter(typingEl, "// hello world !! Welcome to my portfolio");
      }
    }

    // ================= PROJECTS =================
    if (name === "projects") {
      editor.innerHTML = `
        <div class="home-container fade">
          <h2 class="hero-name">Projects</h2>
          <p class="hero-desc">AI-powered healthcare + Flutter apps</p>

          <ul style="margin-top:20px; line-height:1.8;">
            <li>📊 AI Healthcare EHR System</li>
            <li>📱 Flutter Face Recognition App</li>
            <li>📈 Data Science Dashboard</li>
            <li>🤖 Clinical Decision Support Tool</li>
          </ul>

          <div class="home-buttons">
            <button onclick="openTab('home')">← Back</button>
          </div>
        </div>
      `;
    }

    // ================= ABOUT =================
    if (name === "about") {
      editor.innerHTML = `
        <div class="home-container fade">
          <h2 class="hero-name">About Me</h2>

          <p class="hero-desc">
            Health Informatics @ UNF | AI in Healthcare | Backend + ML systems.
          </p>

          <div class="home-buttons">
            <button onclick="openTab('home')">← Back</button>
          </div>
        </div>
      `;
    }

    // ================= CONTACT =================
    if (name === "contact") {
      editor.innerHTML = `
        <div class="home-container fade">
          <h2 class="hero-name">Contact</h2>

          <p class="hero-desc">
            📧 agrani@example.com <br>
            💼 linkedin.com/in/agranisinha
          </p>

          <div class="home-buttons">
            <button onclick="openTab('home')">← Back</button>
          </div>
        </div>
      `;
    }

    editor.style.opacity = 1;

  }, 150);
}

// ================= TRAFFIC BUTTONS =================
window.onload = function () {

  openTab("home"); // 🔥 FORCE HOME LOAD

  const red = document.querySelector(".traffic.red");
  const yellow = document.querySelector(".traffic.yellow");
  const green = document.querySelector(".traffic.green");
  const feedback = document.getElementById("headerFeedback");

  const quotes = [
    "Nice try 😏 but I’ll stay open.",
    "You can't close me that easily 😎",
    "This portfolio is immortal 🚀",
    "Denied. Try harder 😈",
    "I’m not going anywhere 👀"
  ];

  function showMessage(msg) {
    if (!feedback) return;

    feedback.innerText = msg;
    feedback.classList.add("show");

    setTimeout(() => {
      feedback.classList.remove("show");
    }, 2000);
  }

  if (red) {
    red.onclick = (e) => {
      e.stopPropagation();
      showMessage(quotes[Math.floor(Math.random() * quotes.length)]);
    };
  }

  if (yellow) {
    yellow.onclick = () => {
      document.body.style.transform = "scale(0.96)";
      setTimeout(() => {
        document.body.style.transform = "scale(1)";
      }, 200);
    };
  }

  if (green) {
    green.onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    };
  }
};
