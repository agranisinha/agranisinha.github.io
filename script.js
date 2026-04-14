// TAB SWITCH
function openTab(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// TYPING
const text = ["AI Engineer", "Healthcare Systems", "Data Scientist"];
let i = 0, j = 0;

function type() {
  let el = document.getElementById("typing");
  if (!el) return;

  el.innerHTML = text[i].substring(0, j++);
  if (j > text[i].length) {
    i = (i + 1) % text.length;
    j = 0;
  }
  setTimeout(type, 100);
}
type();

// AI TERMINAL
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

input.addEventListener("keydown", function(e){
  if(e.key === "Enter"){
    let cmd = input.value.toLowerCase();

    let line = document.createElement("div");
    line.innerText = "> " + cmd;
    output.appendChild(line);

    if(cmd.includes("project")) openTab("projects");
    else if(cmd.includes("experience")) openTab("experience");
    else if(cmd.includes("skills")) openTab("skills");
    else if(cmd.includes("contact")) openTab("contact");
    else output.appendChild(document.createTextNode("Try: projects, skills"));

    input.value = "";
  }
});

// GSAP
gsap.from(".hero-title", {opacity:0, y:40, duration:1});
gsap.from(".profile-card", {opacity:0, scale:0.8, duration:1});
