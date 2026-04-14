// =============================
// VS Code-style Portfolio Logic
// =============================

const DEFAULT_TAB = "about";

const panelIds = [
  "about",
  "projects",
  "experience",
  "skills",
  "lor",
  "research",
  "resume",
  "contact",
];

// -----------------------------
// Helpers
// -----------------------------
function getPanel(id) {
  return document.getElementById(id);
}

function getEditorTabs() {
  return document.getElementById("editorTabs");
}

function getTabButton(id) {
  return document.querySelector(`.editor-tab[data-tab="${id}"]`);
}

function getFileItem(id) {
  return document.querySelector(`.file-item[onclick*="'${id}'"]`);
}

function appendTerminalLine(text, className = "") {
  const output = document.getElementById("terminalOutput");
  if (!output) return;

  const line = document.createElement("div");
  if (className) line.className = className;
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function setActivePanel(id) {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.remove("active");
  });

  const panel = getPanel(id);
  if (panel) {
    panel.classList.add("active");
  }
}

function setActiveFile(id) {
  document.querySelectorAll(".file-item").forEach((item) => {
    item.classList.remove("active");
  });

  const fileItem = getFileItem(id);
  if (fileItem) {
    fileItem.classList.add("active");
  }
}

function setActiveTab(id) {
  document.querySelectorAll(".editor-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  const tab = getTabButton(id);
  if (tab) {
    tab.classList.add("active");
  }
}

function createTab(id) {
  const tabsContainer = getEditorTabs();
  if (!tabsContainer) return null;

  const tab = document.createElement("button");
  tab.className = "editor-tab active";
  tab.setAttribute("data-tab", id);
  tab.type = "button";

  tab.innerHTML = `
    <span class="icon js">JS</span> ${id}.js
    <span class="close-tab" title="Close">×</span>
  `;

  tab.addEventListener("click", () => {
    openTab(null, id);
  });

  const closeBtn = tab.querySelector(".close-tab");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      closeTab(e, id);
    });
  }

  tabsContainer.appendChild(tab);
  return tab;
}

function ensureTabExists(id) {
  let tab = getTabButton(id);
  if (!tab) {
    tab = createTab(id);
  }
  return tab;
}

// -----------------------------
// Open Tab
// -----------------------------
function openTab(event, id) {
  if (!panelIds.includes(id)) return;

  setActivePanel(id);
  setActiveFile(id);
  ensureTabExists(id);
  setActiveTab(id);
}

// -----------------------------
// Close Tab
// -----------------------------
function closeTab(e, id) {
  e.stopPropagation();

  const tab = getTabButton(id);
  if (!tab) return;

  const wasActive = tab.classList.contains("active");
  tab.remove();

  // Never leave the UI without a visible panel
  if (wasActive) {
    const remainingTabs = document.querySelectorAll(".editor-tab");
    if (remainingTabs.length > 0) {
      const nextId = remainingTabs[remainingTabs.length - 1].getAttribute("data-tab");
      openTab(null, nextId);
    } else {
      openTab(null, DEFAULT_TAB);
    }
  }
}

// -----------------------------
// Folder Toggle
// -----------------------------
function toggleFolder(id) {
  const folder = document.getElementById(id);
  const caret = document.getElementById(id + "Caret");

  if (!folder || !caret) return;

  folder.classList.toggle("show");
  caret.textContent = folder.classList.contains("show") ? "▾" : "▸";
}

// -----------------------------
// Terminal Commands
// -----------------------------
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

function handleCommand(rawCmd) {
  const cmd = rawCmd.trim().toLowerCase();

  if (!cmd) return;

  appendTerminalLine("> " + cmd);

  switch (cmd) {
    case "help":
      appendTerminalLine("Available commands:");
      appendTerminalLine("about, projects, experience, skills, lor, research, resume, contact");
      appendTerminalLine("linkedin, clear, help");
      break;

    case "about":
    case "projects":
    case "experience":
    case "skills":
    case "lor":
    case "research":
    case "contact":
      openTab(null, cmd);
      appendTerminalLine(`Opened ${cmd}.js`);
      break;

    case "resume":
      openTab(null, "resume");
      appendTerminalLine("Opened resume.js");
      window.open("docs/Agrani Sinha Resume.pdf", "_blank");
      break;

    case "linkedin":
      appendTerminalLine("Opening LinkedIn...");
      window.open("https://www.linkedin.com/in/agranisinha", "_blank");
      break;

    case "clear":
      if (output) output.innerHTML = "";
      break;

    default:
      appendTerminalLine(`Command not found: ${cmd}`);
      appendTerminalLine("Type 'help' for available commands.");
      break;
  }
}

if (input) {
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      handleCommand(input.value);
      input.value = "";
    }
  });
}

// -----------------------------
// Typing Effect
// -----------------------------
const typingTarget = document.getElementById("typing");
const titleText = "AI × Healthcare × Systems";
let typeIndex = 0;

function type() {
  if (!typingTarget) return;

  if (typeIndex < titleText.length) {
    typingTarget.textContent += titleText[typeIndex];
    typeIndex += 1;
    setTimeout(type, 70);
  }
}

// -----------------------------
// Theme Toggle
// -----------------------------
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
  });
}

// -----------------------------
// Init
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Ensure only default panel is active on load
  setActivePanel(DEFAULT_TAB);
  setActiveFile(DEFAULT_TAB);
  ensureTabExists(DEFAULT_TAB);
  setActiveTab(DEFAULT_TAB);

  // Default terminal hint
  if (output && output.children.length === 0) {
    appendTerminalLine("> help");
    appendTerminalLine("Try: about, projects, experience, skills, lor, research, resume, contact");
  }

  type();
});
