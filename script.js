// ================= CURSOR GLOW =================
const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);

document.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

// ================= TAB SYSTEM (SYNC TABS + PANELS) =================
function openTab(id, el=null){
  // panels
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  const panel = document.getElementById(id);
  if(panel) panel.classList.add('active');

  // sidebar active
  document.querySelectorAll('.file-item').forEach(f=>f.classList.remove('active'));
  if(el) el.classList.add('active');
  else {
    const auto = document.querySelector(`.file-item[onclick*="${id}"]`);
    if(auto) auto.classList.add('active');
  }

  // tabs
  const tabs = document.querySelectorAll('.editor-tab');
  tabs.forEach(t=>t.classList.remove('active'));

  let tab = document.querySelector(`.editor-tab[data-tab="${id}"]`);
  if(!tab){
    tab = document.createElement('button');
    tab.className = 'editor-tab active';
    tab.dataset.tab = id;
    tab.innerHTML = `<span class="icon js">JS</span> ${id}.js <span class="close-tab" onclick="closeTab(event,'${id}')">×</span>`;
    tab.onclick = () => openTab(id);
    document.getElementById('editorTabs').appendChild(tab);
  } else {
    tab.classList.add('active');
  }
}

function closeTab(e,id){
  e.stopPropagation();
  const tab = document.querySelector(`.editor-tab[data-tab="${id}"]`);
  tab?.remove();
  openTab('about');
}

window.addEventListener('load', () => openTab('about'));

// ================= MODAL =================
function openModal(key){
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('modalContent');
  const item = modalData[key];
  if(!item) return;

  const gallery = item.gallery?.length
    ? `<div class="modal-gallery">${item.gallery.map(src=>`<img src="${src}" onerror="this.style.display='none'">`).join('')}</div>`
    : '';

  content.innerHTML = `<h2>${item.title}</h2>${item.description}${gallery}`;
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  document.getElementById('detailModal').setAttribute('aria-hidden','true');
}

// ================= AI TERMINAL (ROBUST) =================
const input = document.getElementById('terminalInput');
const output = document.getElementById('terminalOutput');

function log(line){
  const d = document.createElement('div');
  d.textContent = line;
  output.appendChild(d);
  output.scrollTop = output.scrollHeight;
}

const routes = {
  projects:'projects',
  experience:'experience',
  skills:'skills',
  contact:'contact',
  research:'research',
  resume:'resume'
};

input?.addEventListener('keydown', (e)=>{
  if(e.key !== 'Enter') return;
  const cmd = (input.value || '').trim().toLowerCase();
  if(!cmd) return;

  log(`> ${cmd}`);

  const hit = Object.keys(routes).find(k => cmd.includes(k));
  if(hit){
    openTab(routes[hit]);
    log(`Opening ${routes[hit]}...`);
    if(hit === 'resume'){
      window.open('docs/Agrani Sinha Resume.pdf','_blank');
    }
  } else {
    log('Try: projects, experience, skills, research, resume, contact');
  }
  input.value = '';
});

// ================= TYPING =================
const typingEl = document.getElementById('typing');
const text = "AI × Healthcare × Systems";
let idx = 0;
(function type(){
  if(!typingEl) return;
  typingEl.textContent = text.slice(0, idx++);
  if(idx <= text.length) setTimeout(type, 60);
})();
