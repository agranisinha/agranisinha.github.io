// ================= NEON CURSOR =================
document.addEventListener("mousemove", (e) => {
  document.body.style.setProperty("--x", e.clientX + "px");
  document.body.style.setProperty("--y", e.clientY + "px");
});

// ================= TAB FIX =================
function openTab(id, el = null) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".file-item").forEach(f => f.classList.remove("active"));
  if (el) el.classList.add("active");

  document.querySelectorAll(".editor-tab").forEach(t => t.classList.remove("active"));

  let tab = document.querySelector(`[data-tab="${id}"]`);
  if (tab) tab.classList.add("active");
}

// ================= AI ASSISTANT (FIXED) =================
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

function addLine(text) {
  const div = document.createElement("div");
  div.innerText = text;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

input.addEventListener("keydown", function(e){
  if(e.key === "Enter") {
    let cmd = input.value.toLowerCase();
    addLine("> " + cmd);

    if(cmd.includes("project")) {
      openTab("projects");
      addLine("Opening projects...");
    }
    else if(cmd.includes("experience")) {
      openTab("experience");
      addLine("Opening experience...");
    }
    else if(cmd.includes("skills")) {
      openTab("skills");
      addLine("Opening skills...");
    }
    else if(cmd.includes("contact")) {
      openTab("contact");
      addLine("Opening contact...");
    }
    else if(cmd.includes("resume")) {
      window.open("docs/Agrani Sinha Resume.pdf");
      addLine("Opening resume...");
    }
    else {
      addLine("Try: projects, experience, skills, resume");
    }

    input.value = "";
  }
});

// ================= PARTICLES =================
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 50; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#00eaff";
    ctx.fill();

    p.y += 0.5;
    if (p.y > canvas.height) p.y = 0;
  });

  requestAnimationFrame(animate);
}

animate();

// ================= TYPING =================
const text = "AI × Healthcare × Systems";
let i = 0;

function type() {
  let el = document.getElementById("typing");
  if (!el) return;

  el.innerHTML = text.substring(0, i++);
  if (i > text.length) i = 0;

  setTimeout(type, 100);
}
type();
