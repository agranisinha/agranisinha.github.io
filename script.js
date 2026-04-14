/* =========================
   TAB SYSTEM (FIXED)
========================= */
function openTab(id, el = null) {
  // panels
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  // sidebar highlight
  document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
  if (el) el.classList.add('active');

  // tabs
  const tabs = document.querySelectorAll('.editor-tab');
  tabs.forEach(t => t.classList.remove('active'));

  let existing = document.querySelector(`[data-tab="${id}"]`);

  if (!existing) {
    const tab = document.createElement('button');
    tab.className = 'editor-tab active';
    tab.setAttribute('data-tab', id);
    tab.innerHTML = `<span class="icon js">JS</span> ${id}.js <span class="close-tab">×</span>`;

    tab.onclick = () => openTab(id);

    tab.querySelector('.close-tab').onclick = (e) => {
      e.stopPropagation();
      tab.remove();
      openTab('about');
    };

    document.getElementById('editorTabs').appendChild(tab);
  } else {
    existing.classList.add('active');
  }
}

/* =========================
   MODAL SYSTEM
========================= */
function openModal(key) {
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('modalContent');

  const item = modalData[key];
  if (!item) return;

  let images = '';
  if (item.gallery.length) {
    images = `<div class="modal-gallery">
      ${item.gallery.map(img => `<img src="${img}">`).join("")}
    </div>`;
  }

  content.innerHTML = `
    <h2>${item.title}</h2>
    ${item.description}
    ${images}
  `;

  modal.style.display = "block";
}

function closeModal() {
  document.getElementById('detailModal').style.display = "none";
}

/* =========================
   AI TERMINAL (FIXED)
========================= */
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

function typeLine(text) {
  const line = document.createElement("div");
  output.appendChild(line);

  let i = 0;
  function typing() {
    if (i < text.length) {
      line.textContent += text[i];
      i++;
      setTimeout(typing, 20);
    }
  }
  typing();
}

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const cmd = input.value.toLowerCase().trim();
    typeLine("> " + cmd);

    if (cmd.includes("project")) {
      typeLine("Opening projects...");
      openTab("projects");
    }
    else if (cmd.includes("experience")) {
      typeLine("Opening experience...");
      openTab("experience");
    }
    else if (cmd.includes("skills")) {
      typeLine("Opening skills...");
      openTab("skills");
    }
    else if (cmd.includes("contact")) {
      typeLine("Opening contact...");
      openTab("contact");
    }
    else if (cmd.includes("resume")) {
      typeLine("Opening resume...");
      window.open("docs/Agrani Sinha Resume.pdf");
    }
    else {
      typeLine("Try: projects, experience, skills, resume");
    }

    input.value = "";
  }
});

/* =========================
   HERO TYPING EFFECT
========================= */
const typing = document.getElementById("typing");
const text = "AI × Healthcare × Systems";
let i = 0;

function typeHero() {
  if (i < text.length) {
    typing.innerHTML += text[i];
    i++;
    setTimeout(typeHero, 50);
  }
}
typeHero();

/* =========================
   CURSOR GLOW
========================= */
const glow = document.createElement("div");
glow.className = "cursor-glow";
document.body.appendChild(glow);

document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

/* =========================
   GSAP ANIMATIONS
========================= */
gsap.from(".hero-title", { y: 40, opacity: 0, duration: 1 });
gsap.from(".hero-roles span", { y: 20, opacity: 0, stagger: 0.1 });
gsap.from(".mini-card", {
  scrollTrigger: ".mini-card",
  y: 30,
  opacity: 0,
  stagger: 0.1
});
