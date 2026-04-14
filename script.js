// ================= CURSOR GLOW =================
document.addEventListener("mousemove", e => {
  document.body.style.setProperty("--x", e.clientX + "px");
  document.body.style.setProperty("--y", e.clientY + "px");

  document.body.style.setProperty(
    "background",
    `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, #0a192f, #000)`
  );
});

// ================= TAB FIX =================
function openTab(id, el=null){

  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".file-item").forEach(f=>f.classList.remove("active"));
  if(el) el.classList.add("active");

  document.querySelectorAll(".editor-tab").forEach(t=>t.classList.remove("active"));

  let tab=document.querySelector(`[data-tab="${id}"]`);

  if(!tab){
    tab=document.createElement("div");
    tab.className="editor-tab active";
    tab.setAttribute("data-tab",id);
    tab.innerHTML=`JS ${id}.js <span class="close-tab" onclick="closeTab(event,'${id}')">×</span>`;
    tab.onclick=()=>openTab(id);
    document.getElementById("editorTabs").appendChild(tab);
  } else {
    tab.classList.add("active");
  }
}

// ================= CLOSE TAB =================
function closeTab(e,id){
  e.stopPropagation();
  document.querySelector(`[data-tab="${id}"]`)?.remove();
  openTab("about");
}

// ================= MODAL =================
function openModal(key){
  const modal=document.getElementById("detailModal");
  const content=document.getElementById("modalContent");
  const item=modalData[key];

  content.innerHTML=`
    <h2>${item.title}</h2>
    ${item.description}
    <div class="modal-gallery">
      ${item.gallery.map(i=>`<img src="${i}">`).join("")}
    </div>
  `;

  modal.setAttribute("aria-hidden","false");
}

function closeModal(){
  document.getElementById("detailModal").setAttribute("aria-hidden","true");
}

// ================= AI ASSISTANT =================
const input=document.getElementById("terminalInput");
const output=document.getElementById("terminalOutput");

input.addEventListener("keydown",function(e){
  if(e.key==="Enter"){
    let cmd=input.value.toLowerCase();
    output.innerHTML+=`<div>> ${cmd}</div>`;

    if(cmd.includes("project")) openTab("projects");
    else if(cmd.includes("experience")) openTab("experience");
    else if(cmd.includes("skills")) openTab("skills");
    else if(cmd.includes("contact")) openTab("contact");
    else if(cmd.includes("resume")) window.open("docs/Agrani Sinha Resume.pdf");
    else output.innerHTML+=`<div>Try: projects, experience, skills</div>`;

    input.value="";
  }
});

// ================= TYPING =================
const text="AI × Healthcare × Systems";
let i=0;

function type(){
  if(i<text.length){
    document.getElementById("typing").innerHTML+=text[i];
    i++;
    setTimeout(type,70);
  }
}
type();
