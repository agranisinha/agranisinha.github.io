// ================= TAB =================
function openTab(id, el = null) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
  if (el) el.classList.add('active');

  gsap.from(`#${id}`, {
    opacity: 0,
    y: 20,
    duration: 0.5
  });
}

// ================= MODAL =================
function openModal(key) {
  const modal = document.getElementById("detailModal");
  const content = document.getElementById("modalContent");
  const item = modalData[key];

  content.innerHTML = `
    <h2>${item.title}</h2>
    ${item.description}
    <div class="modal-gallery">
      ${item.gallery.map(i => `<img src="${i}">`).join("")}
    </div>
  `;

  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  document.getElementById("detailModal").setAttribute("aria-hidden", "true");
}

// ================= AI TERMINAL =================
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

function print(text) {
  const line = document.createElement("div");
  line.textContent = text;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    const cmd = input.value.toLowerCase();
    print("> " + cmd);

    if(cmd.includes("project")){
      openTab("projects");
      print("Opening projects...");
    }
    else if(cmd.includes("experience")){
      openTab("experience");
      print("Opening experience...");
    }
    else if(cmd.includes("skills")){
      openTab("skills");
      print("Loading skills...");
    }
    else if(cmd.includes("resume")){
      window.open("docs/Agrani Sinha Resume.pdf");
      print("Opening resume...");
    }
    else if(cmd.includes("contact")){
      openTab("contact");
      print("Opening contact...");
    }
    else if(cmd.includes("help")){
      print("Try: projects, experience, skills, resume");
    }
    else{
      print("Unknown command");
    }

    input.value="";
  }
});

// ================= GSAP =================
gsap.from(".sidebar", {
  x: -50,
  opacity: 0,
  duration: 0.5
});

gsap.utils.toArray(".mini-card").forEach(card=>{
  gsap.from(card,{
    scrollTrigger: card,
    opacity:0,
    y:20,
    duration:0.4
  });
});
