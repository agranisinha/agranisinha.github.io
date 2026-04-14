// ================= TAB SYSTEM =================
function openTab(id, el = null) {

  // SWITCH CONTENT
  document.querySelectorAll('.panel').forEach(p => {
    p.style.display = "none";
  });

  const activePanel = document.getElementById(id);
  if (activePanel) activePanel.style.display = "block";

  // SIDEBAR ACTIVE
  document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
  if (el) el.classList.add('active');

  // REMOVE ACTIVE FROM ALL TABS
  document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));

  // CHECK EXISTING TAB
  let existing = document.querySelector(`[data-tab="${id}"]`);

  if (!existing) {
    const tab = document.createElement('div');
    tab.className = 'editor-tab active';
    tab.setAttribute('data-tab', id);

    tab.innerHTML = `
      <span>JS ${id}.js</span>
      <span class="close-tab" onclick="closeTab(event,'${id}')">×</span>
    `;

    tab.onclick = () => openTab(id);

    document.getElementById('editorTabs').appendChild(tab);
  } else {
    existing.classList.add('active');
  }

  // ANIMATION
  gsap.from(activePanel, {
    opacity: 0,
    y: 20,
    duration: 0.4
  });
}

// ================= CLOSE TAB =================
function closeTab(e, id) {
  e.stopPropagation();

  const tab = document.querySelector(`[data-tab="${id}"]`);
  if (tab) tab.remove();

  openTab("about");
}

// ================= INITIAL LOAD =================
window.onload = () => {
  document.querySelectorAll('.panel').forEach(p => p.style.display = "none");
  document.getElementById("about").style.display = "block";
};

// ================= AI TERMINAL =================
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

function print(text) {
  const line = document.createElement("div");
  line.innerText = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {

    let cmd = input.value.toLowerCase();
    print("> " + cmd);

    if (cmd.includes("project")) {
      openTab("projects");
      print("📂 Opening projects...");
    }
    else if (cmd.includes("experience")) {
      openTab("experience");
      print("💼 Opening experience...");
    }
    else if (cmd.includes("skills")) {
      openTab("skills");
      print("🧠 Loading skills...");
    }
    else if (cmd.includes("resume")) {
      window.open("docs/Agrani Sinha Resume.pdf");
      print("📄 Opening resume...");
    }
    else {
      print("Try: projects, experience, skills, resume");
    }

    input.value = "";
  }
});

// ================= HERO TYPING =================
const words = ["AI Engineer", "Healthcare Systems", "Data Scientist"];
let i = 0, j = 0;

function type() {
  let el = document.getElementById("typing");
  if (!el) return;

  el.innerHTML = words[i].substring(0, j++);

  if (j > words[i].length) {
    i = (i + 1) % words.length;
    j = 0;
  }

  setTimeout(type, 100);
}
type();
