function openTab(event,id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.file-item').forEach(f=>f.classList.remove('active'));
  event.target.classList.add('active');
}

const input=document.getElementById("terminalInput");
const output=document.getElementById("terminalOutput");

input.addEventListener("keypress",function(e){
  if(e.key==="Enter"){
    const cmd=input.value.toLowerCase();

    const line=document.createElement("div");
    line.textContent="> "+cmd;
    output.appendChild(line);

    if(cmd==="projects") openTab({target:document.querySelector("[onclick*='projects']")},"projects");
    if(cmd==="about") openTab({target:document.querySelector("[onclick*='about']")},"about");

    input.value="";
  }
});
