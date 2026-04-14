// OPEN TAB
function openTab(event, id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
  if (event) event.currentTarget.classList.add('active');

  document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));

  let existing = document.querySelector(`[data-tab="${id}"]`);

  if (!existing) {
    const tab = document.createElement('button');
    tab.className = 'editor-tab active';
    tab.innerHTML = `${id}.js <span class="close-tab">×</span>`;
    tab.setAttribute('data-tab', id);

    tab.onclick = () => openTab(null, id);

    document.getElementById('editorTabs').appendChild(tab);
  } else {
    existing.classList.add('active');
  }
}

// CLOSE TAB
function closeTab(e, id) {
  e.stopPropagation();

  const tab = document.querySelector(`[data-tab="${id}"]`);
  tab.remove();

  openTab(null, "about");
}

// FOLDER TOGGLE
function toggleFolder(id) {
  const el = document.getElementById(id);
  const caret = document.getElementById(id + "Caret");

  el.classList.toggle("show");

  caret.textContent = el.classList.contains("show") ? "▾" : "▸";
}

// TERMINAL COMMANDS
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    const cmd = input.value.toLowerCase();

    const line = document.createElement("div");
    line.textContent = "> " + cmd;
    output.appendChild(line);

    switch(cmd){
      case "about":
      case "projects":
      case "experience":
      case "skills":
      case "lor":
      case "contact":
        openTab(null, cmd);
        break;

      case "resume":
        window.open("docs/Agrani Sinha Resume.pdf");
        break;

      case "clear":
        output.innerHTML = "";
        break;

      default:
        output.appendChild(document.createTextNode("Command not found"));
    }

    input.value = "";
  }
});

// TYPING EFFECT
const text = "AI × Healthcare × Systems";
let i = 0;

function type(){
  if(i < text.length){
    document.getElementById("typing").innerHTML += text[i];
    i++;
    setTimeout(type, 70);
  }
}
type();
