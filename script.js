// ================= TAB SWITCHING =================
function openTab(id, el = null) {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
  }

  document.querySelectorAll(".file-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (el) {
    el.classList.add("active");
  } else {
    const autoFile = [...document.querySelectorAll(".file-item")].find((item) => {
      const onclickValue = item.getAttribute("onclick");
      return onclickValue && onclickValue.includes(`'${id}'`);
    });

    if (autoFile) {
      autoFile.classList.add("active");
    }
  }

  document.querySelectorAll(".editor-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  let existingTab = document.querySelector(`.editor-tab[data-tab="${id}"]`);

  if (!existingTab) {
    const tab = document.createElement("button");
    tab.className = "editor-tab active";
    tab.setAttribute("data-tab", id);
    tab.setAttribute("onclick", `openTab('${id}')`);
    tab.innerHTML = `
      <span class="icon js">JS</span> ${id}.js
      <span class="close-tab" onclick="closeTab(event, '${id}')">×</span>
    `;
    document.getElementById("editorTabs").appendChild(tab);
  } else {
    existingTab.classList.add("active");
  }
}

function closeTab(event, id) {
  event.stopPropagation();

  const tab = document.querySelector(`.editor-tab[data-tab="${id}"]`);
  if (!tab) return;

  if (id === "about") return;

  const isActive = tab.classList.contains("active");
  tab.remove();

  if (isActive) {
    openTab("about");
  }
}

// ================= MODAL DATA =================
const modalData = {
  chatbot: {
    title: "Respiratory Health Chatbot",
    description: `
      <p>Built a web-based chatbot for respiratory health guidance using HTML, CSS, and Vue.js.</p>
      <p>The objective was to make symptom-based healthcare information more accessible, interactive, and easier to understand for users.</p>
      <p><strong>Focus:</strong> User interaction, healthcare guidance, front-end logic.</p>
    `,
    gallery: [
      "assets/images/WhatsApp Image 2026-04-13 at 22.27.44 (1).jpeg",
      "assets/images/WhatsApp Image 2026-04-13 at 22.27.44 (2).jpeg",
      "assets/images/WhatsApp Image 2026-04-13 at 22.27.44 (3).jpeg",
      "assets/images/WhatsApp Image 2026-04-13 at 22.27.44 (4).jpeg",
      "assets/images/WhatsApp Image 2026-04-13 at 22.27.44 (5).jpeg",
      "assets/images/WhatsApp Image 2026-04-13 at 22.27.45.jpeg",
    ],
  },
  bioapp: {
    title: "Bio Calculator App",
    description: `
      <p>Created a biological and chemical lab calculation tool using HTML, CSS, and JavaScript.</p>
      <p>The tool reduced manual lab calculation effort and was published on the Google Play Store.</p>
      <p><strong>Focus:</strong> Utility-driven application development and science-based calculation support.</p>
    `,
    gallery: [
      "assets/images/Biocalculator/bio1.webp",
      "assets/images/Biocalculator/bio2.webp",
      "assets/images/Biocalculator/bio3.webp",
      "assets/images/Biocalculator/bio4.webp",
    ],
  },
  drugdiscovery: {
    title: "ML Drug Discovery",
    description: `
      <p>Developed an SVM model with 96.8% accuracy for tuberculosis inhibitor prediction using MATLAB and AutoDock.</p>
      <p>This project demonstrated machine learning application in biomedical screening and drug discovery support.</p>
      <p><strong>Focus:</strong> Bioinformatics, classification models, research-driven analytics.</p>
    `,
    gallery: [],
  },
  inventory: {
    title: "Inventory Management App",
    description: `
      <p>Built a Flutter + Google Sheets based inventory system with tracking, updates, filtering, and business-oriented workflows.</p>
      <p>The system supported real-time inventory visibility and practical inventory operations.</p>
      <p><strong>Focus:</strong> Mobile app development, workflow automation, inventory operations, and live data handling.</p>
    `,
    gallery: [],
  },
  plant: {
    title: "AI Plant Identification",
    description: `
      <p>Built a TensorFlow-based computer vision system for plant identification with voice feedback integration.</p>
      <p>The system combined image classification with a user-friendly interaction layer.</p>
      <p><strong>Focus:</strong> Computer vision, TensorFlow, accessibility-oriented interaction.</p>
    `,
    gallery: [],
  },
  games: {
    title: "AI Games — Chess & Checkers",
    description: `
      <p>Built Python-based AI gameplay logic to demonstrate algorithmic reasoning and decision-making.</p>
      <p>The project explored rule-based systems, game intelligence, and strategic optimization.</p>
      <p><strong>Focus:</strong> Problem solving, algorithms, and AI gameplay logic.</p>
    `,
    gallery: [],
  },
  covid: {
    title: "COVID-19 Bioinformatics Database",
    description: `
      <p>Worked on genomic data structuring and research-focused bioinformatics database organization.</p>
      <p>This work supported biological data management and research accessibility.</p>
      <p><strong>Focus:</strong> Bioinformatics, data structuring, and research support workflows.</p>
    `,
    gallery: [],
  },
  voicehealth: {
    title: "Voice of Health EHR Concept",
    description: `
      <p>Designed a context-aware healthcare communication and workflow concept focused on patient-centered information exchange.</p>
      <p>The idea connects symptom intake, contextual understanding, structured reporting, and clinician-facing workflow support.</p>
      <p><strong>Focus:</strong> Health informatics, AI-enabled workflows, communication design, and patient-centered systems.</p>
    `,
    gallery: [],
  },
  portfolio: {
    title: "Interactive VS Code Portfolio",
    description: `
      <p>Built a Visual Studio Code-inspired portfolio with dynamic tabs, side navigation, modal-based detail views, and integrated assistant behavior.</p>
      <p>The portfolio was designed to feel like a real interface rather than a static website.</p>
      <p><strong>Focus:</strong> UI architecture, dynamic front-end behavior, and polished interaction design.</p>
    `,
    gallery: [],
  },
  alivia: {
    title: "Clinical Informatics Intern — Alivia Care",
    description: `
      <p><strong>Location:</strong> Jacksonville, FL | <strong>Duration:</strong> Oct 2025 – Feb 2026</p>
      <p>Worked on EHR-based reporting, workflow support, and clinical data accessibility within a healthcare setting.</p>
      <p>Collaborated on healthcare information use cases, data visibility, and informatics-aligned workflow understanding.</p>
      <p><strong>Focus:</strong> Clinical informatics, EHR workflows, and healthcare reporting support.</p>
    `,
    gallery: ["assets/images/badge.png"],
  },
  blu: {
    title: "Data Science Analyst — BluCognition",
    description: `
      <p><strong>Location:</strong> Pune, India | <strong>Duration:</strong> Mar 2022 – Jun 2023</p>
      <p>Built machine learning pipelines for processing and structuring complex financial data.</p>
      <p>Worked on automation-oriented solutions using analytics and AI to convert unstructured information into usable outputs.</p>
      <p><strong>Focus:</strong> Data science, automation, ML workflows, and structured intelligence generation.</p>
    `,
    gallery: [],
  },
  digiversal: {
    title: "Academic Research Associate — Digiversal Consultant",
    description: `
      <p><strong>Location:</strong> Noida, India | <strong>Duration:</strong> Dec 2020 – Mar 2022</p>
      <p>Conducted research, analytics support, and technical documentation work for academic and consulting-oriented projects.</p>
      <p><strong>Focus:</strong> Structured research, analysis, reporting, and documentation.</p>
    `,
    gallery: [],
  },
  ibab: {
    title: "Bioinformatics Research Intern — IBAB",
    description: `
      <p><strong>Location:</strong> Remote | <strong>Duration:</strong> Jul 2020 – Dec 2020</p>
      <p>Curated genomic datasets for COVID-19 research support and contributed to biological data organization work.</p>
      <p><strong>Focus:</strong> Bioinformatics data curation, biological databases, and research support.</p>
    `,
    gallery: [],
  },
  srl: {
    title: "Microbiology Trainee — SRL Diagnostics",
    description: `
      <p><strong>Location:</strong> Noida, India | <strong>Duration:</strong> Jun 2018 – Jul 2018</p>
      <p>Performed microbiology-related testing exposure using culture techniques and diagnostics support workflows.</p>
      <p><strong>Focus:</strong> Laboratory diagnostics, microbiology exposure, and testing processes.</p>
    `,
    gallery: [
      "assets/images/Microbiology/m1.png",
      "assets/images/Microbiology/m2.png",
      "assets/images/Microbiology/m3.png",
      "assets/images/Microbiology/m4.png",
      "assets/images/Microbiology/m5.png.png",
      "assets/images/Microbiology/m6.png",
    ],
  },
  sanfoundry: {
    title: "Content Developer — Sanfoundry",
    description: `
      <p><strong>Location:</strong> Remote</p>
      <p>Created 1000+ MCQs for Bioprocess Engineering and contributed to structured educational technical content.</p>
      <p><a href="https://www.sanfoundry.com/1000-bioprocess-engineering-questions-answers/" target="_blank">View Published Work</a></p>
      <p><strong>Focus:</strong> Technical content creation, education support, and subject-matter structuring.</p>
    `,
    gallery: [],
  },
};

function openModal(key) {
  const modal = document.getElementById("detailModal");
  const content = document.getElementById("modalContent");
  const item = modalData[key];
  if (!item) return;

  const galleryHtml = item.gallery.length
    ? `<div class="modal-gallery">${item.gallery
        .map((src) => `<img src="${src}" alt="">`)
        .join("")}</div>`
    : "";

  content.innerHTML = `
    <h2>${item.title}</h2>
    ${item.description}
    ${galleryHtml}
  `;

  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  const modal = document.getElementById("detailModal");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

// ================= COPILOT PANEL =================
function toggleCopilot() {
  const panel = document.getElementById("copilotPanel");
  const isOpen = panel.classList.contains("open");

  panel.classList.toggle("open");
  panel.setAttribute("aria-hidden", isOpen ? "true" : "false");
}

const copilotResponses = {
  "show projects": {
    text: "Opening projects. Agrani’s work includes healthcare chatbots, AI tools, inventory systems, bioinformatics projects, and interactive product-style interfaces.",
    tab: "projects",
  },
  "show experience": {
    text: "Opening experience. Agrani’s background spans clinical informatics, data science, academic research, bioinformatics, diagnostics, and technical content development.",
    tab: "experience",
  },
  "show skills": {
    text: "Opening skills. Core strengths include AI, machine learning, Flutter, data science, clinical informatics, EHR workflows, bioinformatics, and analytics.",
    tab: "skills",
  },
  "show leadership": {
    text: "Opening leadership. Agrani has contributed to student leadership, podcast coordination, healthcare event engagement, and academic outreach.",
    tab: "leadership",
  },
  "show certifications": {
    text: "Opening certifications. This includes health IT exposure, leadership development, and applied portfolio-building across AI and healthcare projects.",
    tab: "certifications",
  },
  "how can i contact agrani?": {
    text: "Opening contact. You can reach Agrani by email at agbrian521@gmail.com or through LinkedIn at linkedin.com/in/agranisinha.",
    tab: "contact",
  },
  "show research": {
    text: "Opening research. This section includes dissertation and thesis materials related to academic work and research documentation.",
    tab: "research",
  },
  "show resume": {
    text: "Opening resume. You can access the latest resume directly from the resume section.",
    tab: "resume",
  },
};

function appendCopilotMessage(text, role = "assistant") {
  const messages = document.getElementById("copilotMessages");
  const div = document.createElement("div");
  div.className = `copilot-message ${role}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function sendCopilotPrompt(prompt) {
  appendCopilotMessage(prompt, "user");

  const normalized = prompt.trim().toLowerCase();
  const response = copilotResponses[normalized];

  if (response) {
    appendCopilotMessage(response.text, "assistant");
    openTab(response.tab);
  } else {
    appendCopilotMessage(
      "I can help with projects, experience, skills, leadership, certifications, research, resume, and contact.",
      "assistant"
    );
  }
}

function submitCopilotInput() {
  const input = document.getElementById("copilotInput");
  const value = input.value.trim();
  if (!value) return;

  sendCopilotPrompt(value);
  input.value = "";
}

// ================= TERMINAL ASSISTANT =================
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

const assistantReplies = {
  projects: "Opening projects...",
  "show projects": "Opening projects...",
  experience: "Opening experience...",
  "show experience": "Opening experience...",
  skills: "Opening skills...",
  "show skills": "Opening skills...",
  leadership: "Opening leadership...",
  "show leadership": "Opening leadership...",
  certifications: "Opening certifications...",
  "show certifications": "Opening certifications...",
  resume: "Opening resume...",
  contact: "Opening contact...",
  research: "Opening research...",
  help: "Try: projects, experience, skills, leadership, certifications, research, resume, contact, clear",
  clear: "__CLEAR__",
};

function addTerminalLine(text) {
  const line = document.createElement("div");
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleTerminalCommand(value) {
  addTerminalLine(`> ${value}`);

  if (assistantReplies[value]) {
    if (assistantReplies[value] === "__CLEAR__") {
      terminalOutput.innerHTML = "";
      return;
    }

    addTerminalLine(assistantReplies[value]);

    if (value.includes("project")) openTab("projects");
    if (value.includes("experience")) openTab("experience");
    if (value.includes("skills")) openTab("skills");
    if (value.includes("leadership")) openTab("leadership");
    if (value.includes("certification")) openTab("certifications");
    if (value.includes("contact")) openTab("contact");
    if (value.includes("research")) openTab("research");

    if (value === "resume") {
      openTab("resume");
      window.open("docs/Agrani Sinha Resume.pdf", "_blank");
    }
  } else {
    addTerminalLine(
      "Try: projects, experience, skills, leadership, certifications, research, resume, contact"
    );
  }
}

// ================= TYPING EFFECT =================
function typeHeroText() {
  const typingEl = document.getElementById("typing");
  const typingText = "AI × Healthcare × Systems";
  let typingIndex = 0;

  function typeLoop() {
    if (!typingEl) return;
    if (typingIndex <= typingText.length) {
      typingEl.textContent = typingText.slice(0, typingIndex);
      typingIndex += 1;
      setTimeout(typeLoop, 70);
    }
  }

  typeLoop();
}

// ================= THEME / GLOW =================
function setupThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;

  themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("glow-mode");
  });
}

// ================= GSAP =================
function initAnimations() {
  if (!window.gsap) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero-title", {
    y: 30,
    opacity: 0,
    duration: 1,
  });

  gsap.from(".hero-roles span", {
    y: 18,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5,
  });

  gsap.from(".mini-card, .skill-group, .stat-card", {
    scrollTrigger: {
      trigger: ".editor-content",
      start: "top 75%",
    },
    y: 20,
    opacity: 0,
    stagger: 0.06,
    duration: 0.45,
  });
}

// ================= EVENT LISTENERS =================
document.addEventListener("DOMContentLoaded", function () {
  const copilotInput = document.getElementById("copilotInput");
  if (copilotInput) {
    copilotInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        submitCopilotInput();
      }
    });
  }

  const copilotToggle = document.getElementById("copilotToggle");
  if (copilotToggle) {
    copilotToggle.addEventListener("click", toggleCopilot);
  }

  if (terminalInput) {
    terminalInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        const value = terminalInput.value.trim().toLowerCase();
        if (!value) return;

        handleTerminalCommand(value);
        terminalInput.value = "";
      }
    });
  }

  const modal = document.getElementById("detailModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target.classList.contains("detail-modal-backdrop")) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal();

      const copilotPanel = document.getElementById("copilotPanel");
      if (copilotPanel && copilotPanel.classList.contains("open")) {
        toggleCopilot();
      }
    }
  });

  typeHeroText();
  setupThemeToggle();
  initAnimations();
});
