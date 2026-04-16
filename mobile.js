window.openMobilePanel = function (type) {
  const sidebar = document.getElementById("sidebarPanel");
  const copilot = document.getElementById("copilotSidebar");
  const terminal = document.getElementById("terminalPanel");
  const settings = document.getElementById("settingsPanel");
  const backdrop = document.querySelector(".mobile-backdrop");

  // CLOSE ALL
  [sidebar, copilot, terminal, settings].forEach(el => el?.classList.remove("m-show"));

  // OPEN TARGET
  if (type === "explorer") sidebar?.classList.add("m-show");
  if (type === "copilot") copilot?.classList.add("m-show");
  if (type === "terminal") terminal?.classList.add("m-show");
  if (type === "settings") settings?.classList.add("m-show");

  backdrop?.classList.add("show");
};

window.closeAllMobilePanels = function () {
  document.querySelectorAll(".m-sidebar, .m-copilot, .m-terminal, .m-settings")
    .forEach(el => el.classList.remove("m-show"));

  document.querySelector(".mobile-backdrop")?.classList.remove("show");
};

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  if (!body.classList.contains("mobile-page")) return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const sidebar = $("#sidebarPanel");
  const copilot = $("#copilotSidebar");
  const terminal = $("#terminalPanel");
  const settings = $("#settingsPanel");
  const backdrop = $(".mobile-backdrop");
  const fab = $(".m-fab");
  const terminalInput = $("#terminalInput");
  const copilotInput = $("#copilotInput");
  const copilotMessages = $("#copilotMessages");

  let activePanel = null;
  let startX = 0;
  let startY = 0;

  function setBottomNavActive(type = "home") {
    $$(".m-nav-btn").forEach((btn) => btn.classList.remove("active"));
    const map = {
      home: 0,
      explorer: 1,
      terminal: 2,
      copilot: 3,
      settings: 4
    };
    const idx = map[type];
    const btns = $$(".m-nav-btn");
    if (typeof idx === "number" && btns[idx]) btns[idx].classList.add("active");
  }

  function closeAllMobilePanels() {
    sidebar?.classList.remove("m-show");
    copilot?.classList.remove("m-show");
    terminal?.classList.remove("m-show");
    settings?.classList.remove("m-show");
    backdrop?.classList.remove("show");
    activePanel = null;
    setBottomNavActive("home");
  }

  function openMobilePanel(type) {
  closeAllMobilePanels();

  if (type === "explorer") show(sidebar);
  if (type === "copilot") show(copilot);
  if (type === "terminal") show(terminal);
  if (type === "settings") show(settings);

  backdrop?.classList.add("show");
}
  window.closeAllMobilePanels = closeAllMobilePanels;

  window.toggleSidebar = function () {
    if (activePanel === "explorer") {
      closeAllMobilePanels();
    } else {
      openMobilePanel("explorer");
    }
  };

  window.toggleCopilotSidebar = function (force) {
    if (force === false) {
      closeAllMobilePanels();
      return;
    }
    if (activePanel === "copilot" && force !== true) {
      closeAllMobilePanels();
    } else {
      openMobilePanel("copilot");
    }
  };

  window.toggleTerminal = function () {
    if (activePanel === "terminal") {
      closeAllMobilePanels();
    } else {
      openMobilePanel("terminal");
    }
  };

  window.toggleSettings = function () {
    if (activePanel === "settings") {
      closeAllMobilePanels();
    } else {
      openMobilePanel("settings");
    }
  };

  backdrop?.addEventListener("click", closeAllMobilePanels);

  fab?.addEventListener("click", () => {
    openMobilePanel("copilot");
  });

  $$("[data-close-panel]").forEach((btn) => {
    btn.addEventListener("click", closeAllMobilePanels);
  });

  document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.closest(".file")) {
      setBottomNavActive("home");
      setTimeout(closeAllMobilePanels, 80);
      return;
    }

    if (target.closest(".theme-option") || target.closest(".action")) {
      setTimeout(closeAllMobilePanels, 120);
    }
  });

  const originalOpenTab = window.openTab;
  if (typeof originalOpenTab === "function") {
    window.openTab = function (name) {
      originalOpenTab(name);
      closeAllMobilePanels();
      setBottomNavActive("home");
    };
  }

  function appendMobileCopilotMessage(text, sender = "assistant") {
    if (!copilotMessages) return;
    const msg = document.createElement("div");
    msg.className = `copilot-message ${sender}`;
    msg.textContent = text;
    copilotMessages.appendChild(msg);
    copilotMessages.scrollTop = copilotMessages.scrollHeight;
  }

  function getMobileCopilotReply(prompt) {
    const q = String(prompt).toLowerCase();

    if (q.includes("project")) {
      window.openTab?.("projects");
      return "Opened Projects. Agrani has work across healthcare AI, Flutter apps, bioinformatics, and intelligent systems.";
    }
    if (q.includes("experience")) {
      window.openTab?.("experience");
      return "Opened Experience. Agrani has worked in clinical informatics, data science, research, and healthcare analytics.";
    }
    if (q.includes("skill") || q.includes("tech")) {
      window.openTab?.("skills");
      return "Opened Skills. Core stack includes Python, Flutter, ML, TensorFlow, healthcare tools, and analytics.";
    }
    if (q.includes("contact") || q.includes("email") || q.includes("phone")) {
      window.openTab?.("contact");
      return "Opened Contact. You can reach Agrani by email, phone, or LinkedIn.";
    }
    if (q.includes("resume") || q.includes("cv")) {
      window.openTab?.("resume");
      return "Opened Resume.";
    }
    if (q.includes("lor")) {
      window.openTab?.("lor");
      return "Opened LOR section.";
    }
    if (q.includes("about")) {
      window.openTab?.("about");
      return "Opened About.";
    }
    return "Ask me about projects, experience, skills, LOR, resume, or contact.";
  }

  function sendMobileCopilotPrompt() {
    const value = copilotInput?.value?.trim();
    if (!value) return;
    appendMobileCopilotMessage(value, "user");
    copilotInput.value = "";
    setTimeout(() => {
      appendMobileCopilotMessage(getMobileCopilotReply(value), "assistant");
    }, 180);
  }

  $("#copilotSend")?.addEventListener("click", sendMobileCopilotPrompt);

  copilotInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMobileCopilotPrompt();
    }
  });

  $("#copilotVoice")?.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      appendMobileCopilotMessage("Voice input is not supported in this browser.", "assistant");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (copilotInput) {
        copilotInput.value = transcript;
      }
      sendMobileCopilotPrompt();
    };

    recognition.onerror = () => {
      appendMobileCopilotMessage("Voice input failed. Please try again.", "assistant");
    };
  });

  function handleTerminalShortcuts(cmd) {
    const q = cmd.toLowerCase();

    if (q === "projects") {
      window.openTab?.("projects");
      return "Opened Projects.";
    }
    if (q === "about") {
      window.openTab?.("about");
      return "Opened About.";
    }
    if (q === "skills") {
      window.openTab?.("skills");
      return "Opened Skills.";
    }
    if (q === "experience") {
      window.openTab?.("experience");
      return "Opened Experience.";
    }
    if (q === "contact") {
      window.openTab?.("contact");
      return "Opened Contact.";
    }
    if (q === "resume") {
      window.openTab?.("resume");
      return "Opened Resume.";
    }
    if (q === "lor") {
      window.openTab?.("lor");
      return "Opened LOR.";
    }
    if (q === "copilot") {
      openMobilePanel("copilot");
      return "Opened Copilot.";
    }

    return null;
  }

  function runMobileTerminalCommand(raw) {
    const cmd = String(raw).trim();
    const body = $("#terminalBody");
    if (!cmd || !body) return;

    const line = document.createElement("div");
    line.textContent = `$ ${cmd}`;
    body.appendChild(line);

    if (cmd === "clear") {
      body.innerHTML = "";
      return;
    }

    const quick = handleTerminalShortcuts(cmd);
    const out = document.createElement("div");

    if (quick) {
      out.textContent = quick;
      body.appendChild(out);
      body.scrollTop = body.scrollHeight;
      return;
    }

    const commands = {
      help: "Available: help, projects, about, skills, experience, contact, lor, resume, copilot, clear",
      ls: "home.tsx  about.html  projects.js  skills.json  experience.ts  lor.pdf  contact.css  README.md  Resume.pdf",
      pwd: "/portfolio/mobile",
      whoami: "Agrani Sinha",
      date: new Date().toString()
    };

    out.textContent = commands[cmd.toLowerCase()] || "Command not found";
    body.appendChild(out);
    body.scrollTop = body.scrollHeight;
  }

  terminalInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = terminalInput.value;
      terminalInput.value = "";
      runMobileTerminalCommand(value);
    }
  });

  document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - startX;
    const dy = endY - startY;

    const horizontalSwipe = Math.abs(dx) > Math.abs(dy);

    if (horizontalSwipe) {
      if (startX < 28 && dx > 75) {
        openMobilePanel("explorer");
      }
      if (dx < -75) {
        closeAllMobilePanels();
      }
    } else {
      if (dy < -95 && Math.abs(dx) < 40) {
        openMobilePanel("terminal");
      }
      if (dy > 95 && Math.abs(dx) < 40) {
        closeAllMobilePanels();
      }
    }
  }, { passive: true });

  document.querySelector(".mobile-backdrop")?.addEventListener("click", () => {
  closeAllMobilePanels();
});

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllMobilePanels();
      window.closePalette?.();
    }
  });

  $$(".copilot-suggest").forEach((btn) => {
    btn.addEventListener("click", () => {
      const q = btn.dataset.quick || btn.textContent.trim();
      if (copilotInput) copilotInput.value = q;
      sendMobileCopilotPrompt();
    });
  });

  setBottomNavActive("home");
  closeAllMobilePanels();
});

window.openMobilePanel = openMobilePanel;
