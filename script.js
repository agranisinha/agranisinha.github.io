// ================= TAB FIX =================
function openTab(id, el = null) {

  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
  if (el) el.classList.add('active');

  document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));

  let tab = document.querySelector(`[data-tab="${id}"]`);

  if (!tab) {
    tab = document.createElement('div');
    tab.className = 'editor-tab active';
    tab.setAttribute('data-tab', id);

    tab.innerHTML = `JS ${id}.js`;
    tab.onclick = () => openTab(id);

    document.getElementById('editorTabs').appendChild(tab);
  } else {
    tab.classList.add('active');
  }
}

// ================= AI ASSISTANT (FIXED) =================
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
      print("🧠 Opening skills...");
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

// ================= TYPING =================
const text = "AI × Healthcare × Systems";
let i = 0;

function type() {
  const el = document.getElementById("typing");
  if (!el) return;

  if (i < text.length) {
    el.innerHTML += text[i];
    i++;
    setTimeout(type, 80);
  }
}
type();

// ================= GSAP =================
gsap.from(".hero-title", {
  opacity: 0,
  y: 40,
  duration: 1
});

gsap.from(".mini-card", {
  opacity: 0,
  y: 20,
  stagger: 0.1,
  duration: 0.5
});
