// ==============================
// PANEL NAVIGATION
// ==============================
function openTab(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".file-item").forEach(f => f.classList.remove("active"));
  const activeFile = document.querySelector(`[onclick="openTab('${id}')"]`);
  if (activeFile) activeFile.classList.add("active");
}

// ==============================
// AI TERMINAL
// ==============================
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

// helper to print output
function print(text) {
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

// ==============================
// AI RESPONSE ENGINE
// ==============================
function handleAI(command) {
  command = command.toLowerCase();

  // NAVIGATION COMMANDS
  if (command.includes("project")) {
    openTab("projects");
    print("📂 Showing projects...");
    return;
  }

  if (command.includes("experience")) {
    openTab("experience");
    print("💼 Showing experience...");
    return;
  }

  if (command.includes("skill")) {
    openTab("skills");
    print("🧠 Showing skills...");
    return;
  }

  if (command.includes("contact")) {
    openTab("contact");
    print("📬 Opening contact...");
    return;
  }

  if (command.includes("resume")) {
    window.open("docs/Agrani Sinha Resume.pdf");
    print("📄 Opening resume...");
    return;
  }

  if (command.includes("linkedin")) {
    window.open("https://www.linkedin.com/in/agranisinha");
    print("🔗 Opening LinkedIn...");
    return;
  }

  // SMART RESPONSES (AI FEEL)
  if (command.includes("who are you") || command.includes("about")) {
    print("👋 I'm Agrani — Health Informatics + AI enthusiast building healthcare solutions.");
    openTab("about");
    return;
  }

  if (command.includes("what do you do")) {
    print("💡 I build AI-driven healthcare systems combining data science, clinical informatics, and biotechnology.");
    return;
  }

  if (command.includes("help")) {
    print("💡 Try:");
    print("- show projects");
    print("- show experience");
    print("- open resume");
    print("- who are you");
    return;
  }

  if (command.includes("clear")) {
    output.innerHTML = "";
    return;
  }

  // DEFAULT
  print("🤖 I didn’t understand that. Try 'help'");
}

// ==============================
// INPUT LISTENER
// ==============================
input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    const command = input.value.trim();

    print("> " + command);
    handleAI(command);

    input.value = "";
  }
});

// ==============================
// TYPING EFFECT (HERO)
// ==============================
const typingText = ["AI in Healthcare", "Clinical Informatics", "Data Science", "System Design"];
let i = 0, j = 0;
let current = "";
let isDeleting = false;

function typeEffect() {
  const element = document.getElementById("typing");
  if (!element) return;

  current = typingText[i];

  if (isDeleting) {
    element.textContent = current.substring(0, j--);
  } else {
    element.textContent = current.substring(0, j++);
  }

  if (!isDeleting && j === current.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1000);
  } else if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % typingText.length;
    setTimeout(typeEffect, 300);
  } else {
    setTimeout(typeEffect, isDeleting ? 50 : 80);
  }
}

typeEffect();
