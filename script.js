const openPaletteBtn = document.getElementById("openPaletteBtn");
const paletteOverlay = document.getElementById("paletteOverlay");
const paletteBackdrop = document.getElementById("paletteBackdrop");
const paletteInput = document.getElementById("paletteInput");
const paletteItems = Array.from(document.querySelectorAll(".palette-item"));
const cursorSquare = document.getElementById("cursorSquare");
const cursorDot = document.getElementById("cursorDot");

function openPalette() {
  paletteOverlay.classList.add("open");
  paletteOverlay.setAttribute("aria-hidden", "false");
  setTimeout(() => paletteInput.focus(), 20);
}

function closePalette() {
  paletteOverlay.classList.remove("open");
  paletteOverlay.setAttribute("aria-hidden", "true");
}

function setActiveItem(index) {
  const visibleItems = paletteItems.filter((item) => item.style.display !== "none");
  if (!visibleItems.length) return;

  visibleItems.forEach((item) => item.classList.remove("active"));
  const safeIndex = Math.max(0, Math.min(index, visibleItems.length - 1));
  visibleItems[safeIndex].classList.add("active");
  visibleItems[safeIndex].scrollIntoView({ block: "nearest" });
}

function getVisibleItems() {
  return paletteItems.filter((item) => item.style.display !== "none");
}

function filterPalette(query) {
  const normalized = query.trim().toLowerCase();

  paletteItems.forEach((item) => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(normalized) ? "flex" : "none";
  });

  setActiveItem(0);
}

openPaletteBtn.addEventListener("click", openPalette);
paletteBackdrop.addEventListener("click", closePalette);

paletteItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    getVisibleItems().forEach((node) => node.classList.remove("active"));
    item.classList.add("active");
  });

  item.addEventListener("click", () => {
    closePalette();
  });
});

paletteInput.addEventListener("input", (e) => {
  filterPalette(e.target.value);
});

paletteInput.addEventListener("keydown", (e) => {
  const visibleItems = getVisibleItems();
  const currentIndex = visibleItems.findIndex((item) => item.classList.contains("active"));

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
    visibleItems.forEach((item) => item.classList.remove("active"));
    visibleItems[next].classList.add("active");
    visibleItems[next].scrollIntoView({ block: "nearest" });
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const next = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
    visibleItems.forEach((item) => item.classList.remove("active"));
    visibleItems[next].classList.add("active");
    visibleItems[next].scrollIntoView({ block: "nearest" });
  }

  if (e.key === "Enter") {
    e.preventDefault();
    const active = document.querySelector(".palette-item.active");
    if (active) {
      closePalette();
    }
  }

  if (e.key === "Escape") {
    closePalette();
  }
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
    e.preventDefault();
    openPalette();
  }

  if (e.key === "Escape" && paletteOverlay.classList.contains("open")) {
    closePalette();
  }
});

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

// ================= SIDEBAR =================
function openSidebar(type) {
  document.querySelectorAll('.activity-icon').forEach(i => i.classList.remove('active'));
  event.target.classList.add('active');
}

// ================= SETTINGS =================
function toggleSettings() {
  document.getElementById('settingsPanel').classList.toggle('open');
}

// ================= THEMES =================
function setTheme(theme) {
  document.body.className = theme;

  document.querySelectorAll('.theme-option').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}
function openTab(name) {

  const editor = document.querySelector(".editor-content");

  if (!editor) return;

  // 🔥 HOME
  if (name === "home") {
    editor.innerHTML = `
      <div class="home-container">
        <p class="code-line typing">// hello world !! Welcome to my portfolio</p>

        <h1 class="home-title">
          Agrani <span>Sinha</span>
        </h1>

        <div class="home-tags">
          <span>Backend Engineer</span>
          <span>AI / ML Dev</span>
          <span>Data Scientist</span>
          <span>Clinical Informatics</span>
        </div>

        <p class="home-desc">
          I build intelligent healthcare systems using AI, ML, and clinical workflows.
          My focus is on scalable, impactful, and real-world solutions.
        </p>

        <div class="home-buttons">
          <button onclick="openTab('projects')">📁 Projects</button>
          <button onclick="openTab('about')">👤 About Me</button>
          <button onclick="openTab('contact')">✉️ Contact</button>
        </div>

        <div class="home-stats">
          <div><strong>10+</strong><span>Projects</span></div>
          <div><strong>6+</strong><span>Experience</span></div>
          <div><strong>96.8%</strong><span>Accuracy</span></div>
        </div>
      </div>
    `;
  }

  // 🔥 PROJECTS
  if (name === "projects") {
    editor.innerHTML = `
      <div class="home-container">
        <h2 class="home-title">Projects</h2>

        <p class="home-desc">
          AI-powered healthcare systems, Flutter apps, and data analytics solutions.
        </p>

        <ul style="margin-top:20px; line-height:1.8;">
          <li>📊 AI Healthcare EHR System</li>
          <li>📱 Flutter Face Recognition App</li>
          <li>📈 Data Science Dashboard</li>
          <li>🤖 Clinical Decision Support Tool</li>
        </ul>

        <div class="home-buttons" style="margin-top:30px;">
          <button onclick="openTab('home')">← Back Home</button>
        </div>
      </div>
    `;
  }

  // 🔥 ABOUT
  if (name === "about") {
    editor.innerHTML = `
      <div class="home-container">
        <h2 class="home-title">About Me</h2>

        <p class="home-desc">
          I'm Agrani Sinha, a Health Informatics graduate student at UNF,
          focusing on AI-driven healthcare systems, clinical workflows,
          and intelligent data-driven applications.
        </p>

        <p class="home-desc">
          My work combines backend engineering, machine learning,
          and real-world healthcare impact.
        </p>

        <div class="home-buttons">
          <button onclick="openTab('home')">← Back Home</button>
        </div>
      </div>
    `;
  }

  // 🔥 CONTACT
  if (name === "contact") {
    editor.innerHTML = `
      <div class="home-container">
        <h2 class="home-title">Contact</h2>

        <p class="home-desc">
          📧 Email: agrani@example.com  
          <br>
          💼 LinkedIn: linkedin.com/in/agranisinha  
          <br>
          🌐 Portfolio: agranisinha.dev
        </p>

        <div class="home-buttons">
          <button onclick="openTab('home')">← Back Home</button>
        </div>
      </div>
    `;
  }
}

window.onload = function () {

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

   // 🔴 RED BUTTON (ONLY MESSAGE)
  if (red) {
    red.onclick = (e) => {
      e.stopPropagation(); // 🔥 prevent accidental triggers
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      showMessage(randomQuote);
    };
  }
  
  // 🟡 YELLOW BUTTON (ONLY THIS SHRINKS)
  if (yellow) {
    yellow.onclick = () => {
      document.body.style.transition = "transform 0.2s ease";
      document.body.style.transform = "scale(0.96)";
      setTimeout(() => {
        document.body.style.transform = "scale(1)";
      }, 200);
    };
  }

  // 🟢 GREEN FULLSCREEN
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
// ================= CUSTOM CURSOR =================

document.addEventListener("DOMContentLoaded", () => {

  const square = document.getElementById("cursorSquare");
  const dot = document.getElementById("cursorDot");

  if (!square || !dot) return;

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // dot follows exactly
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";

    // square follows smoothly (lag effect)
    square.style.left = mouseX + "px";
    square.style.top = mouseY + "px";
  });

});

document.addEventListener("DOMContentLoaded", () => {
  openTab("home");
});
