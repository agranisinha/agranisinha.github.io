function openTab(id) {
  // switch panels
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  // tabs
  document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));

  let existing = document.querySelector(`[data-tab="${id}"]`);

  if (!existing) {
    const tab = document.createElement('button');
    tab.className = 'editor-tab active';
    tab.innerHTML = `<span class="icon js">JS</span> ${id}.js`;
    tab.setAttribute('data-tab', id);

    tab.onclick = () => openTab(id);

    document.getElementById('editorTabs').appendChild(tab);
  } else {
    existing.classList.add('active');
  }
}

/* FOLDER TOGGLE */
function toggleFolder(id) {
  const el = document.getElementById(id);
  const caret = document.getElementById(id + "Caret");

  el.classList.toggle('show');
  caret.textContent = el.classList.contains('show') ? "▾" : "▸";
}

/* TYPING */
const text = "AI × Healthcare × Systems";
let i = 0;

function type() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text[i];
    i++;
    setTimeout(type, 80);
  }
}

type();
