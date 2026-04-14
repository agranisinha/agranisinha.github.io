function openTab(id) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const tabs = document.getElementById('tabs');

  if (!document.querySelector(`[data-tab='${id}']`)) {
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.innerText = id + ".js";
    tab.setAttribute("data-tab", id);

    tab.onclick = () => openTab(id);

    tabs.appendChild(tab);
  }
}

// TYPING EFFECT
const text = "Agrani Sinha";
let i = 0;

function type() {
  if (i < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}

type();
