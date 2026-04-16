// ===============================
// MOBILE CONTROLLER (PRO LEVEL)
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const overlay = document.getElementById("mobileOverlay");
  const sidebar = document.getElementById("mobileSidebar");
  const copilot = document.getElementById("copilotSidebar");
  const terminal = document.getElementById("terminalPanel");
  const settings = document.getElementById("settingsPanel");
  const bubble = document.getElementById("copilotBubble");

  // ===============================
  // STATE
  // ===============================
  let currentPanel = null;

  // ===============================
  // CORE PANEL CONTROL
  // ===============================
  function closeAllPanels() {
    sidebar?.classList.remove("show");
    copilot?.classList.remove("show");
    terminal?.classList.remove("open");
    settings?.classList.remove("open");

    overlay?.classList.remove("show");
    currentPanel = null;
  }

  function openPanel(panel) {
    closeAllPanels();

    if (!panel) return;

    panel.classList.add(
      panel.classList.contains("bottom") ? "open" : "show"
    );

    overlay.classList.add("show");
    currentPanel = panel;
  }

  // ===============================
  // EXPOSE FUNCTIONS (HTML USE)
  // ===============================
  window.toggleMobileSidebar = () => {
    if (currentPanel === sidebar) {
      closeAllPanels();
    } else {
      openPanel(sidebar);
    }
  };

  window.toggleCopilotSidebar = () => {
    if (currentPanel === copilot) {
      closeAllPanels();
    } else {
      openPanel(copilot);
    }
  };

  window.toggleTerminal = () => {
    if (currentPanel === terminal) {
      closeAllPanels();
    } else {
      openPanel(terminal);
      setTimeout(() => {
        document.getElementById("terminalInput")?.focus();
      }, 200);
    }
  };

  window.toggleSettings = () => {
    if (currentPanel === settings) {
      closeAllPanels();
    } else {
      openPanel(settings);
    }
  };

  window.closeAllPanels = closeAllPanels;

  // ===============================
  // OVERLAY CLICK CLOSE
  // ===============================
  overlay?.addEventListener("click", closeAllPanels);

  // ===============================
  // FLOATING COPILOT
  // ===============================
  bubble?.addEventListener("click", () => {
    openPanel(copilot);
  });

  // ===============================
  // SWIPE GESTURES (REAL APP FEEL)
  // ===============================
  let startX = 0;
  let startY = 0;

  document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = endX - startX;
    const diffY = endY - startY;

    // 👉 Swipe right → open sidebar
    if (diffX > 80 && Math.abs(diffY) < 50) {
      openPanel(sidebar);
    }

    // 👉 Swipe left → close
    if (diffX < -80 && Math.abs(diffY) < 50) {
      closeAllPanels();
    }

    // 👉 Swipe up → open terminal
    if (diffY < -80 && Math.abs(diffX) < 50) {
      openPanel(terminal);
    }

    // 👉 Swipe down → close terminal
    if (diffY > 80 && Math.abs(diffX) < 50) {
      closeAllPanels();
    }
  });

  // ===============================
  // TERMINAL DRAG (SMOOTH)
  // ===============================
  let startDragY = 0;

  terminal?.addEventListener("touchstart", (e) => {
    startDragY = e.touches[0].clientY;
  });

  terminal?.addEventListener("touchmove", (e) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startDragY;

    if (diff > 100) {
      closeAllPanels();
    }
  });

  // ===============================
  // TERMINAL BASIC ENGINE
  // ===============================
  const terminalInput = document.getElementById("terminalInput");
  const terminalBody = document.getElementById("terminalBody");

  const commands = {
    help: "Available: help, about, projects, clear",
    about: "Agrani Sinha - Health Informatics + AI",
    projects: "AI + Bioinformatics + Flutter Apps",
    clear: "clear"
  };

  terminalInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = e.target.value.trim().toLowerCase();

      const line = document.createElement("div");
      line.innerText = "$ " + cmd;
      terminalBody.appendChild(line);

      if (cmd === "clear") {
        terminalBody.innerHTML = "";
      } else {
        const output = document.createElement("div");
        output.innerText = commands[cmd] || "Command not found";
        terminalBody.appendChild(output);
      }

      e.target.value = "";
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  // ===============================
  // SAFE INIT
  // ===============================
  closeAllPanels();
});
