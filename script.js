// ================= FIX TAB SYSTEM =================
function openTab(id, el = null) {

  // 🔥 HIDE ALL PANELS
  document.querySelectorAll('.panel').forEach(p => {
    p.classList.remove('active');
  });

  // 🔥 SHOW ONLY CLICKED PANEL
  const panel = document.getElementById(id);
  if (panel) panel.classList.add('active');

  // 🔥 UPDATE SIDEBAR
  document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
  if (el) el.classList.add('active');

  // 🔥 FIX TAB BAR
  document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));

  let tab = document.querySelector(`[data-tab="${id}"]`);

  if (!tab) {
    tab = document.createElement('div');
    tab.className = 'editor-tab active';
    tab.setAttribute('data-tab', id);
    tab.innerHTML = `JS ${id}.js ×`;
    tab.onclick = () => openTab(id);
    document.getElementById('editorTabs').appendChild(tab);
  } else {
    tab.classList.add('active');
  }
}

// ================= FIX INITIAL LOAD =================
window.onload = () => {
  openTab('about');
};

// ================= MODAL =================
function openModal(key) {
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('modalContent');
  const item = modalData[key];

  if (!item) return;

  content.innerHTML = `
    <h2>${item.title}</h2>
    ${item.description}
    <div class="modal-gallery">
      ${item.gallery.map(img => `<img src="${img}" onerror="this.style.display='none'">`).join('')}
    </div>
  `;

  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  document.getElementById('detailModal').setAttribute("aria-hidden", "true");
}

// ================= AI ASSISTANT FIX =================
const input = document.getElementById('terminalInput');
const output = document.getElementById('terminalOutput');

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {

    let cmd = input.value.toLowerCase();

    output.innerHTML += `<div>> ${cmd}</div>`;

    if (cmd.includes("project")) openTab("projects");
    else if (cmd.includes("experience")) openTab("experience");
    else if (cmd.includes("skills")) openTab("skills");
    else if (cmd.includes("contact")) openTab("contact");
    else if (cmd.includes("resume")) window.open("docs/Agrani Sinha Resume.pdf");
    else output.innerHTML += `<div>Try: projects, experience, skills</div>`;

    input.value = "";
    output.scrollTop = output.scrollHeight;
  }
});

// ================= TYPING =================
const text = "AI × Healthcare × Systems";
let i = 0;

function type() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text[i];
    i++;
    setTimeout(type, 60);
  }
}
type();
