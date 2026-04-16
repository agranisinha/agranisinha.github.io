document.addEventListener("DOMContentLoaded", () => {

  const sidebar = document.getElementById("sidebarPanel");
  const copilot = document.getElementById("copilotSidebar");
  const terminal = document.getElementById("terminalPanel");
  const settings = document.getElementById("settingsPanel");
  const backdrop = document.querySelector(".mobile-backdrop");

  function closeAll() {
    [sidebar, copilot, terminal, settings].forEach(el => el?.classList.remove("m-show"));
    backdrop.classList.remove("show");
  }

  window.openMobilePanel = function(type) {
    closeAll();

    if (type === "explorer") sidebar.classList.add("m-show");
    if (type === "copilot") copilot.classList.add("m-show");
    if (type === "terminal") terminal.classList.add("m-show");
    if (type === "settings") settings.classList.add("m-show");

    backdrop.classList.add("show");
  };

  backdrop.addEventListener("click", closeAll);

  // COPILOT
  document.getElementById("copilotSend").onclick = () => {
    const input = document.getElementById("copilotInput");
    const msg = document.getElementById("copilotMessages");

    const text = input.value;
    if (!text) return;

    msg.innerHTML += `<div>👤 ${text}</div>`;
    msg.innerHTML += `<div>🤖 Response for: ${text}</div>`;
    input.value = "";
  };

  // TERMINAL
  document.getElementById("terminalInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const body = document.getElementById("terminalBody");
      body.innerHTML += `<div>$ ${e.target.value}</div>`;
      e.target.value = "";
    }
  });

  // TAB NAV
  window.openTab = function(name) {
    document.getElementById("editorContent").innerHTML = `<h2>${name}</h2>`;
    closeAll();
  };

});
