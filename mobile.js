/* =========================================================
   AGRANI PORTFOLIO — MOBILE JS (ULTRA PREMIUM)
========================================================= */

const panel = document.getElementById("mobilePanel");
const panelTitle = document.getElementById("panelTitle");
const panelContent = document.getElementById("panelContent");

const backdrop = document.getElementById("mobileBackdrop");
const copilot = document.getElementById("mobileCopilot");

const editor = document.getElementById("mobileEditor");

const commandOverlay = document.getElementById("commandOverlay");

/* =========================================================
   PANEL CONTROL
========================================================= */

function openPanel(type) {
  panel.classList.add("open");
  backdrop.classList.add("show");

  setActiveNav(type);

  if (type === "explorer") {
    panelTitle.innerText = "Explorer";

    panelContent.innerHTML = `
      <div class="panel-list">
        <div class="panel-item" onclick="loadPage('home')">
          <div class="icon">⚛️</div>
          <div class="meta">
            <strong>home.tsx</strong>
            <small>Main landing page</small>
          </div>
        </div>

        <div class="panel-item" onclick="loadPage('projects')">
          <div class="icon">🟨</div>
          <div class="meta">
            <strong>projects.js</strong>
            <small>All projects</small>
          </div>
        </div>

        <div class="panel-item" onclick="loadPage('skills')">
          <div class="icon">🟩</div>
          <div class="meta">
            <strong>skills.json</strong>
            <small>Technical skills</small>
          </div>
        </div>

        <div class="panel-item" onclick="loadPage('contact')">
          <div class="icon">📧</div>
          <div class="meta">
            <strong>contact.css</strong>
            <small>Contact details</small>
          </div>
        </div>
      </div>
    `;
  }

  if (type === "terminal") {
    panelTitle.innerText = "Terminal";

    panelContent.innerHTML = `
      <div class="terminal-shell">
        <div class="terminal-top">
          <span></span><span></span><span></span>
        </div>

        <div class="terminal-body-mobile" id="terminalMobile">
          <div class="terminal-line prompt">agrani@mobile:~$ help</div>
          <div class="terminal-line success">Available commands:</div>
          <div class="terminal-line">open projects</div>
          <div class="terminal-line">open contact</div>
        </div>
      </div>
    `;
  }

  if (type === "settings") {
    panelTitle.innerText = "Settings";

    panelContent.innerHTML = `
      <div class="mobile-card">
        <h3>🎨 Theme</h3>
        <p>Dark mode active</p>
      </div>

      <div class="mobile-card">
        <h3>⚡ Quick Actions</h3>
        <p onclick="openCommand()">Command Palette</p>
        <p onclick="toggleCopilot()">Open Copilot</p>
      </div>
    `;
  }
}

function closePanel() {
  panel.classList.remove("open");
  backdrop.classList.remove("show");
  clearActiveNav();
}

/* =========================================================
   PAGE LOAD (EDITOR CONTENT)
========================================================= */

function loadPage(page) {
  let content = "";

  if (page === "home") {
    content = `
      <div class="editor-hero-card">
        <h2>Welcome 👋</h2>
        <p>I build intelligent healthcare & AI systems.</p>

        <div class="editor-code-block">
          <div class="editor-code-top">
            <span></span><span></span><span></span>
          </div>
          <div class="editor-code-content">
const agrani = {
  role: "Health Informatics + AI",
  passion: "Building real-world solutions"
};
          </div>
        </div>
      </div>
    `;
  }

  if (page === "projects") {
    content = `
      <h2>Projects 🚀</h2>
      <div class="mobile-card">AI Healthcare Assistant</div>
      <div class="mobile-card">Flutter Inventory App</div>
      <div class="mobile-card">Bioinformatics ML System</div>
    `;
  }

  if (page === "skills") {
    content = `
      <h2>Skills 💡</h2>
      <div class="mobile-chip-row">
        <div class="mobile-chip">Flutter</div>
        <div class="mobile-chip">Python</div>
        <div class="mobile-chip">Machine Learning</div>
        <div class="mobile-chip">EHR Systems</div>
      </div>
    `;
  }

  if (page === "contact") {
    content = `
      <h2>Contact 📬</h2>
      <div class="mobile-card">Email: agbrian521@gmail.com</div>
      <div class="mobile-card">Location: Florida</div>
    `;
  }

  editor.innerHTML = content;

  closePanel();
}

/* =========================================================
   COPILOT
========================================================= */

function toggleCopilot() {
  copilot.classList.toggle("open");
  backdrop.classList.toggle("show");
}

function sendMessage() {
  const input = document.getElementById("copilotInput");
  const box = document.getElementById("copilotMessages");

  if (!input.value.trim()) return;

  box.innerHTML += `<div class="user-msg">${input.value}</div>`;
  box.innerHTML += `<div class="bot-msg">Thinking...</div>`;

  input.value = "";

  box.scrollTop = box.scrollHeight;
}

/* =========================================================
   COMMAND PALETTE
========================================================= */

function openCommand() {
  commandOverlay.classList.add("open");
}

function closeCommand() {
  commandOverlay.classList.remove("open");
}

/* =========================================================
   BACKDROP CLOSE
========================================================= */

function closeAllMobile() {
  closePanel();
  copilot.classList.remove("open");
  closeCommand();
}

/* =========================================================
   NAV ACTIVE STATE
========================================================= */

function setActiveNav(type) {
  document.querySelectorAll(".bottom-nav button").forEach(btn => {
    btn.classList.remove("active");
  });

  if (type === "explorer") {
    document.querySelectorAll(".bottom-nav button")[0].classList.add("active");
  }

  if (type === "terminal") {
    document.querySelectorAll(".bottom-nav button")[2].classList.add("active");
  }

  if (type === "settings") {
    document.querySelectorAll(".bottom-nav button")[3].classList.add("active");
  }
}

function clearActiveNav() {
  document.querySelectorAll(".bottom-nav button").forEach(btn => {
    btn.classList.remove("active");
  });
}

/* =========================================================
   SWIPE GESTURES (🔥 PREMIUM)
========================================================= */

let startY = 0;
let currentY = 0;

panel.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});

panel.addEventListener("touchmove", (e) => {
  currentY = e.touches[0].clientY;
  let diff = currentY - startY;

  if (diff > 0) {
    panel.style.transform = `translateY(${diff}px)`;
  }
});

panel.addEventListener("touchend", () => {
  let diff = currentY - startY;

  if (diff > 100) {
    closePanel();
  } else {
    panel.style.transform = "translateY(0)";
  }
});

/* =========================================================
   COPILOT SWIPE
========================================================= */

let startX = 0;

copilot.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

copilot.addEventListener("touchmove", (e) => {
  let moveX = e.touches[0].clientX;
  let diff = moveX - startX;

  if (diff > 0) {
    copilot.style.transform = `translateX(${diff}px)`;
  }
});

copilot.addEventListener("touchend", (e) => {
  let diff = e.changedTouches[0].clientX - startX;

  if (diff > 120) {
    toggleCopilot();
  } else {
    copilot.style.transform = "translateX(0)";
  }
});
