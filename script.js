// ================= TAB SYSTEM =================
function openTab(id, el = null) {

  // HIDE ALL PANELS
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

  // SHOW CURRENT
  const panel = document.getElementById(id);
  if (panel) panel.classList.add('active');

  // SIDEBAR ACTIVE
  document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
  if (el) el.classList.add('active');

  // REMOVE ACTIVE FROM TABS
  document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));

  let tab = document.querySelector(`[data-tab="${id}"]`);

  if (!tab) {
    tab = document.createElement('div');
    tab.className = 'editor-tab active';
    tab.setAttribute('data-tab', id);

    tab.innerHTML = `
      JS ${id}.js
      <span class="close-tab" onclick="closeTab(event,'${id}')">×</span>
    `;

    tab.onclick = () => openTab(id);
    document.getElementById('editorTabs').appendChild(tab);
  } else {
    tab.classList.add('active');
  }
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
  openTab("about");
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

if (input) {
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
      else if (cmd.includes("contact")) {
        openTab("contact");
        print("📧 Opening contact...");
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
}

// ================= TYPING EFFECT =================
const words = ["AI Engineer", "Healthcare Systems", "Data Scientist"];
let i = 0, j = 0;

function type() {
  const el = document.getElementById("typing");
  if (!el) return;

  el.innerHTML = words[i].substring(0, j++);

  if (j > words[i].length) {
    i = (i + 1) % words.length;
    j = 0;
  }

  setTimeout(type, 100);
}
type();
