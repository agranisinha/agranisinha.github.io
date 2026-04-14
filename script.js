// ================= TAB SYSTEM =================
function openTab(id, el = null) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".file-item").forEach(f => f.classList.remove("active"));
  if (el) el.classList.add("active");

  // 🔥 GSAP animation on tab change
  gsap.from(`#${id}`, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: "power2.out"
  });
}

// ================= MODAL =================
function openModal(key) {
  const modal = document.getElementById("detailModal");
  const content = document.getElementById("modalContent");

  const data = modalData[key];

  const gallery = data.gallery.map(img =>
    `<img src="${img}" />`
  ).join("");

  content.innerHTML = `
    <h2>${data.title}</h2>
    ${data.description}
    <div class="modal-gallery">${gallery}</div>
  `;

  modal.setAttribute("aria-hidden", "false");

  // 🔥 GSAP modal animation
  gsap.from(".detail-modal-content", {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: "back.out(1.7)"
  });
}

function closeModal() {
  document.getElementById("detailModal").setAttribute("aria-hidden", "true");
}

// ================= TERMINAL AI =================
const input = document.getElementById("terminalInput");
const output = document.getElementById("terminalOutput");

function typeLine(text, speed = 15) {
  const line = document.createElement("div");
  output.appendChild(line);

  let i = 0;
  function typing() {
    if (i < text.length) {
      line.textContent += text[i];
      i++;
      output.scrollTop = output.scrollHeight;
      setTimeout(typing, speed);
    }
  }
  typing();
}

function handleCommand(cmd) {
  cmd = cmd.toLowerCase();

  if (cmd.includes("project")) {
    openTab("projects");
    typeLine("📂 Opening projects...");
    return;
  }

  if (cmd.includes("experience")) {
    openTab("experience");
    typeLine("💼 Opening experience...");
    return;
  }

  if (cmd.includes("skills")) {
    openTab("skills");
    typeLine("🧠 Loading skills...");
    return;
  }

  if (cmd.includes("resume")) {
    window.open("docs/Agrani Sinha Resume.pdf");
    typeLine("📄 Opening resume...");
    return;
  }

  if (cmd.includes("contact")) {
    openTab("contact");
    typeLine("📬 Opening contact...");
    return;
  }

  if (cmd.includes("help")) {
    typeLine("Available commands:");
    typeLine("- show projects");
    typeLine("- show experience");
    typeLine("- open resume");
    typeLine("- contact");
    return;
  }

  typeLine("🤖 Command not recognized");
}

input.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    const cmd = input.value.trim();

    typeLine("> " + cmd, 5);
    handleCommand(cmd);

    input.value = "";
  }
});

// ================= HERO TYPING =================
const typingText = ["AI in Healthcare", "Clinical Informatics", "Data Science", "System Design"];
let i = 0, j = 0, current = "", isDeleting = false;

function typeEffect() {
  const el = document.getElementById("typing");
  if (!el) return;

  current = typingText[i];

  if (isDeleting) {
    el.textContent = current.substring(0, j--);
  } else {
    el.textContent = current.substring(0, j++);
  }

  if (!isDeleting && j === current.length) {
    isDeleting = true;
    setTimeout(typeEffect, 1200);
  } else if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % typingText.length;
    setTimeout(typeEffect, 300);
  } else {
    setTimeout(typeEffect, isDeleting ? 40 : 80);
  }
}

typeEffect();

// ================= GSAP ANIMATIONS =================
gsap.registerPlugin(ScrollTrigger);

// HERO ENTRY
gsap.from(".big-title", {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: "power3.out"
});

gsap.from(".hero-card", {
  opacity: 0,
  y: 60,
  delay: 0.2,
  duration: 1,
  ease: "power3.out"
});

// CARDS ANIMATION
gsap.utils.toArray(".mini-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%"
    },
    opacity: 0,
    y: 30,
    duration: 0.5,
    delay: i * 0.05
  });
});

// SIDEBAR ANIMATION
gsap.from(".sidebar", {
  x: -60,
  opacity: 0,
  duration: 0.6
});

// TERMINAL FLOAT EFFECT
gsap.to(".terminal", {
  y: 5,
  repeat: -1,
  yoyo: true,
  duration: 2,
  ease: "sine.inOut"
});
