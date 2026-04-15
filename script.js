// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {

  const editorContent = document.getElementById("editorContent");
  const tabsContainer = document.getElementById("editorTabs");

  const paletteOverlay = document.getElementById("paletteOverlay");
  const paletteBackdrop = document.getElementById("paletteBackdrop");
  const openPaletteBtn = document.getElementById("openPaletteBtn");
  const paletteInput = document.getElementById("paletteInput");

  const terminal = document.getElementById("terminalPanel");
  const terminalBody = document.getElementById("terminalBody");
  const terminalInput = document.getElementById("terminalInput");

  const settingsPanel = document.getElementById("settingsPanel");

  const red = document.getElementById("btnRed");
  const yellow = document.getElementById("btnYellow");
  const green = document.getElementById("btnGreen");
  const feedback = document.getElementById("headerFeedback");

  const sidebarFiles = document.querySelectorAll(".file");

  // ================= TAB SYSTEM =================
  let openTabs = [];
  let activeTab = "";

  function normalize(name) {
    if (name.includes("home")) return "home";
    if (name.includes("about")) return "about";
    if (name.includes("project")) return "projects";
    if (name.includes("skill")) return "skills";
    if (name.includes("experience")) return "experience";
    if (name.includes("contact")) return "contact";
    return "home";
  }

  function openTab(name) {
    name = normalize(name);

    if (!openTabs.includes(name)) openTabs.push(name);
    activeTab = name;

    renderTabs();
    renderContent(name);
  }

  function closeTab(name) {
    openTabs = openTabs.filter(t => t !== name);

    if (activeTab === name) {
      activeTab = openTabs[openTabs.length - 1] || "home";
    }

    renderTabs();
    renderContent(activeTab);
  }

  function renderTabs() {
    tabsContainer.innerHTML = "";

    openTabs.forEach(tab => {
      const el = document.createElement("div");
      el.className = "tab " + (tab === activeTab ? "active" : "");

      el.innerHTML = `
        <span>${tab}</span>
        <span class="close">×</span>
      `;

      el.onclick = () => openTab(tab);

      el.querySelector(".close").onclick = (e) => {
        e.stopPropagation();
        closeTab(tab);
      };

      tabsContainer.appendChild(el);
    });
  }

  function renderContent(tab) {
    editorContent.style.opacity = "0";

    setTimeout(() => {
      editorContent.innerHTML = views[tab] || views.home;
      animate();
      editorContent.style.opacity = "1";
    }, 150);
  }

  // ================= VIEWS =================
  const views = {

    home: `
      <div class="home-grid">

        <div class="home-left">
          <p class="code-line" id="typing"></p>

          <h1 class="hero">
            Agrani <span>Sinha</span>
          </h1>

          <div class="roles">
            <span>AI Engineer</span>
            <span>Clinical Informatics</span>
            <span>Data Scientist</span>
            <span>Healthcare Systems</span>
          </div>

          <p class="desc">
            I build intelligent healthcare systems using AI, ML and real-world data workflows.
          </p>

          <div class="btns">
            <button onclick="openTab('projects')">Projects</button>
            <button onclick="openTab('about')">About</button>
            <button onclick="openTab('contact')">Contact</button>
          </div>

          <div class="stats">
            <div><b>10+</b><span>Projects</span></div>
            <div><b>3+</b><span>Experience</span></div>
          </div>
        </div>

        <div class="home-right">
          <img src="assets/images/profile.png" class="profile"/>
        </div>

      </div>
    `,

    about: `
      <div class="card">
        <h1>About Me</h1>
        <p>
          I'm Agrani Sinha — working at the intersection of AI, healthcare, and data systems.
        </p>
      </div>
    `,

    projects: `<h1>Projects</h1>`,
    skills: `<h1>Skills</h1>`,
    experience: `<h1>Experience</h1>`,
    contact: `<h1>Contact</h1>`
  };

  window.openTab = openTab;

  // ================= ANIMATION =================
  function animate() {
    const typing = document.getElementById("typing");

    if (!typing) return;

    const text = "// hello world !! Welcome to my portfolio";
    let i = 0;
    typing.textContent = "";

    function type() {
      if (i < text.length) {
        typing.textContent += text.charAt(i);
        i++;
        setTimeout(type, 20);
      }
    }
    type();
  }

  // ================= COMMAND PALETTE =================
  function openPalette() {
    paletteOverlay.classList.add("open");
    paletteInput.focus();
  }

  function closePalette() {
    paletteOverlay.classList.remove("open");
  }

  openPaletteBtn.onclick = openPalette;
  paletteBackdrop.onclick = closePalette;

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      openPalette();
    }

    if (e.key === "Escape") closePalette();
  });

  paletteInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      openTab(paletteInput.value);
      closePalette();
    }
  });

  // ================= TERMINAL =================
  function print(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function runCommand(cmd) {
    print(`agrani@portfolio:~$ ${cmd}`);

    if (cmd === "help") {
      print("Available: ls, whoami, clear, projects, about");
    }
    else if (cmd === "ls") {
      print("home about projects skills experience contact");
    }
    else if (cmd === "projects") {
      openTab("projects");
    }
    else if (cmd === "about") {
      openTab("about");
    }
    else if (cmd === "whoami") {
      print("Agrani Sinha");
    }
    else if (cmd === "clear") {
      terminalBody.innerHTML = "";
    }
    else {
      print("command not found");
    }
  }

  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      runCommand(terminalInput.value.trim());
      terminalInput.value = "";
    }
  });

  // ================= SIDEBAR =================
  sidebarFiles.forEach(file => {
    file.onclick = () => openTab(file.textContent);
  });

  // ================= SETTINGS =================
  window.toggleSettings = () => {
    settingsPanel.classList.toggle("open");
  };

  // ================= MAC BUTTONS =================
  red.onclick = () => {
    feedback.textContent = "Nice try 😏";
    feedback.classList.add("show");
    setTimeout(() => feedback.classList.remove("show"), 1500);
  };

  yellow.onclick = () => {
    document.body.style.transform = "scale(0.95)";
    setTimeout(() => document.body.style.transform = "scale(1)", 200);
  };

  green.onclick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ================= START =================
  openTab("home");
});
