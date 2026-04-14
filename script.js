document.addEventListener("DOMContentLoaded", () => {
  const editorContent = document.getElementById("editorContent");
  const tabsContainer = document.getElementById("editorTabs");

  const paletteOverlay = document.getElementById("paletteOverlay");
  const paletteBackdrop = document.getElementById("paletteBackdrop");
  const openPaletteBtn = document.getElementById("openPaletteBtn");
  const paletteInput = document.getElementById("paletteInput");

  const settingsPanel = document.getElementById("settingsPanel");

  const red = document.getElementById("btnRed");
  const yellow = document.getElementById("btnYellow");
  const green = document.getElementById("btnGreen");
  const feedback = document.getElementById("headerFeedback");

  const sidebarFiles = document.querySelectorAll(".file");
  const cursorSquare = document.getElementById("cursorSquare");
  const cursorDot = document.getElementById("cursorDot");

  const TAB_LABELS = {
    home: "⚛ home.tsx",
    about: "🌐 about.html",
    projects: "🟨 projects.js",
    skills: "🟩 skills.json",
    experience: "🟦 experience.ts",
    contact: "🎨 contact.css",
    readme: "📄 README.md",
    resume: "📕 Resume.pdf",
  };

  const funnyQuotes = [
    "Nice try 😏 but I’ll stay open.",
    "You can’t close me that easily 😎",
    "This portfolio is immortal 🚀",
    "Denied 😈",
    "Still running and glowing ✨",
  ];

  let currentTab = "home";

  function safeFocus(el) {
    if (el && typeof el.focus === "function") {
      setTimeout(() => el.focus(), 50);
    }
  }

  function openPalette() {
    if (!paletteOverlay) return;
    paletteOverlay.classList.add("open");
    paletteOverlay.setAttribute("aria-hidden", "false");
    safeFocus(paletteInput);
  }

  function closePalette() {
    if (!paletteOverlay) return;
    paletteOverlay.classList.remove("open");
    paletteOverlay.setAttribute("aria-hidden", "true");
  }

  window.openPalette = openPalette;
  window.closePalette = closePalette;

  if (openPaletteBtn) {
    openPaletteBtn.addEventListener("click", openPalette);
  }

  if (paletteBackdrop) {
    paletteBackdrop.addEventListener("click", closePalette);
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
      e.preventDefault();
      openPalette();
    }

    if (e.key === "Escape") {
      closePalette();
      if (settingsPanel) settingsPanel.classList.remove("open");
    }
  });

  window.toggleSettings = function toggleSettings() {
    if (!settingsPanel) return;
    settingsPanel.classList.toggle("open");
  };

  window.setTheme = function setTheme(theme) {
    document.body.className = theme === "dark" ? "" : theme;

    document.querySelectorAll(".theme-option").forEach((el) => {
      el.classList.remove("active");
    });

    if (window.event && window.event.currentTarget) {
      window.event.currentTarget.classList.add("active");
    }
  };

  function ensureTabsContainer() {
    if (tabsContainer) return tabsContainer;

    const editorArea = document.querySelector(".editor-area");
    if (!editorArea) return null;

    const newTabs = document.createElement("div");
    newTabs.className = "editor-tabs";
    newTabs.id = "editorTabs";
    editorArea.prepend(newTabs);
    return newTabs;
  }

  function setActiveSidebar(tabName) {
    sidebarFiles.forEach((file) => {
      const match = file.dataset.tab === tabName;
      file.classList.toggle("active", match);
    });
  }

  function setActiveTab(tabName) {
    const tabEls = document.querySelectorAll(".tab");
    tabEls.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.tab === tabName);
    });
    currentTab = tabName;
    setActiveSidebar(tabName);
  }

  function closeTab(tabName) {
    const tabEl = document.querySelector(`.tab[data-tab="${tabName}"]`);
    if (!tabEl) return;

    const wasActive = tabEl.classList.contains("active");
    tabEl.remove();

    if (wasActive) {
      const remainingTabs = Array.from(document.querySelectorAll(".tab"));
      if (remainingTabs.length > 0) {
        const lastTab = remainingTabs[remainingTabs.length - 1];
        openTab(lastTab.dataset.tab);
      } else {
        openTab("home");
      }
    }
  }

  function addTab(tabName) {
    const container = ensureTabsContainer();
    if (!container) return;

    const existing = container.querySelector(`.tab[data-tab="${tabName}"]`);
    if (existing) {
      setActiveTab(tabName);
      return;
    }

    const tab = document.createElement("div");
    tab.className = "tab";
    tab.dataset.tab = tabName;

    tab.innerHTML = `
      <span class="tab-label">${TAB_LABELS[tabName] || tabName}</span>
      <span class="close-tab" aria-label="Close tab">×</span>
    `;

    tab.addEventListener("click", () => {
      openTab(tabName);
    });

    const closeBtn = tab.querySelector(".close-tab");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeTab(tabName);
      });
    }

    container.appendChild(tab);
    setActiveTab(tabName);
  }

  function typeWriter(el, text, speed = 18) {
    if (!el) return;
    el.textContent = "";
    let i = 0;

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i += 1;
        setTimeout(type, speed);
      }
    }

    type();
  }

 function animateElements() {
  const cards = document.querySelectorAll(
    ".about-card, .project-card, .exp-card, .skills-chip, .timeline-item"
  );

  cards.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";

    setTimeout(() => {
      el.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 40 + index * 35);
  });
}
  function startTyping() {
    const typingEl = document.getElementById("typingText");
    if (!typingEl) return;
    typeWriter(typingEl, "// hello world !! Welcome to my portfolio");
  }

  function render(tabName) {
    if (!editorContent) return;

    const views = {
      home: getHome(),
      about: getAbout(),
      projects: getProjects(),
      skills: getSkills(),
      experience: getExperience(),
      contact: getContact(),
      readme: getReadme(),
      resume: getResume(),
    };

    editorContent.style.opacity = "0";

    setTimeout(() => {
      editorContent.innerHTML = views[tabName] || getHome();
      editorContent.style.opacity = "1";

      if (tabName === "home") startTyping();
      animateElements();
    }, 180);
  }

  window.openTab = function openTab(tabName) {
    addTab(tabName);
    setActiveTab(tabName);
    render(tabName);
    closePalette();
  };

  function getHome() {
  return `
    <div class="home-container home-animate">

      <div class="home-grid">

        <div class="home-left">
          <p class="code-line" id="typingText"></p>

          <h1 class="hero-name hero-reveal">
            Agrani <span>Sinha</span>
          </h1>

          <div class="roles role-reveal">
            <span>AI Engineer</span>
            <span>Clinical Informatics</span>
            <span>Data Scientist</span>
            <span>Healthcare Systems</span>
          </div>

          <p class="hero-desc desc-reveal">
            I build intelligent healthcare systems using AI, machine learning,
            clinical informatics, and data-driven workflows to solve real-world problems.
          </p>

          <div class="home-buttons button-reveal">
            <button onclick="openTab('projects')">📁 Projects</button>
            <button onclick="openTab('about')">👤 About</button>
            <button onclick="openTab('contact')">✉️ Contact</button>
          </div>

          <div class="stats stats-reveal">
            <div class="stat-card">
              <strong>10+</strong>
              <span>Projects</span>
            </div>

            <div class="stat-card">
              <strong>3+</strong>
              <span>Years Experience</span>
            </div>
          </div>
        </div>

        <div class="home-right image-reveal">
          <div class="profile-wrapper floating-photo">
            <div class="profile-glow"></div>
            <img
              src="assets/images/profile.png"
              alt="Agrani Sinha"
              onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=&quot;profile-fallback&quot;>AS</div>';"
            />
          </div>
        </div>

      </div>
    </div>
  `;
}
  function getAbout() {
    return `
      <div class="about-container">
        <p class="code-line">&lt;!-- about.html - Agrani Sinha --&gt;</p>

        <h1 class="hero-name">About Me</h1>
        <p class="about-sub">// who I am • what I do • where I build</p>

        <div class="about-card">
          <p>
            Hi! I'm <span class="highlight">Agrani Sinha</span>, a
            <span class="highlight">Health Informatics graduate student</span>
            with experience across
            <span class="highlight">clinical informatics, healthcare analytics, digital health, AI-driven applications, and data-informed systems</span>.
            <br><br>
            My work focuses on building intelligent, scalable solutions that support
            <span class="highlight">healthcare innovation, operational efficiency, and better data-driven decision making</span>.
          </p>
        </div>

        <div class="about-card">
          <h3 class="section-title">PROFESSIONAL SUMMARY</h3>
          <p>
            I bring together <span class="highlight">AI, machine learning, backend systems, and healthcare workflows</span>
            to design solutions that are practical, efficient, and impactful. I enjoy building systems that connect
            data, technology, and real clinical needs.
          </p>
        </div>

        <div class="about-card">
          <h3 class="section-title">CURRENT FOCUS</h3>
          <div class="focus-grid">
            <div>⚙ AI-driven healthcare systems</div>
            <div>🤖 ML, deep learning, and intelligent pipelines</div>
            <div>📊 Healthcare analytics and data-informed workflows</div>
            <div>🏥 Clinical informatics and EHR-centered innovation</div>
            <div>📱 AI-powered applications and digital health solutions</div>
            <div>🚀 Scalable backend and operational systems</div>
          </div>
        </div>

        <div class="about-card">
          <h3 class="section-title">EDUCATION</h3>

          <div class="timeline">
            <div class="timeline-item">
              <strong>University of North Florida</strong>
              <span>Jacksonville, FL • 2025 – Present</span>
              <p>M.S. in Health Informatics</p>
            </div>

            <div class="timeline-item">
              <strong>Jaypee Institute of Information Technology</strong>
              <span>Noida, India • 2015 – 2020</span>
              <p>Integrated Master of Technology in Biotechnology</p>
            </div>
          </div>
        </div>

        <div class="about-card">
          <h3 class="section-title">LEADERSHIP & INITIATIVES</h3>
          <div class="timeline">
            <div class="timeline-item">
              <strong>Marketing Chair</strong>
              <span>Health Informatics & Analytics Club (HIAC), University of North Florida</span>
              <p>
                Lead marketing and digital outreach for healthcare informatics events, guest lectures, and student engagement activities.
                Initiated and produced the HIAC Podcast, managing speaker outreach, promotion, and healthcare technology networking.
              </p>
            </div>
          </div>
        </div>

        <div class="about-card">
          <h3 class="section-title">TECH STACK</h3>
          <div class="skills-grid">
            <span class="skills-chip">Python</span>
            <span class="skills-chip">Java</span>
            <span class="skills-chip">C</span>
            <span class="skills-chip">C++</span>
            <span class="skills-chip">JavaScript</span>
            <span class="skills-chip">HTML</span>
            <span class="skills-chip">CSS</span>
            <span class="skills-chip">Flutter</span>
            <span class="skills-chip">TensorFlow</span>
            <span class="skills-chip">Machine Learning</span>
            <span class="skills-chip">Computer Vision</span>
            <span class="skills-chip">Jupyter Notebook</span>
            <span class="skills-chip">Google Colab</span>
            <span class="skills-chip">SAS</span>
            <span class="skills-chip">Microsoft Excel</span>
            <span class="skills-chip">EHRGo</span>
            <span class="skills-chip">WellSky</span>
            <span class="skills-chip">Android Studio</span>
            <span class="skills-chip">GitHub</span>
          </div>
        </div>
      </div>
    `;
  }

  function getProjects() {
    return `
      <div class="projects-container">
        <p class="code-line">&lt;!-- projects.js - selected work --&gt;</p>

        <h1 class="hero-name">Projects</h1>
        <p class="about-sub">// selected work • applied AI • healthcare + software</p>

        <div class="project-grid">
          <div class="project-card">
            <h3>ML Drug Discovery</h3>
            <p>Built SVM models with 96.8% accuracy for tuberculosis inhibitor prediction using MATLAB and AutoDock.</p>
          </div>

          <div class="project-card">
            <h3>Inventory Management App</h3>
            <p>Flutter app with Google Sheets backend for real-time inventory tracking and operational workflows.</p>
          </div>

          <div class="project-card">
            <h3>Bio Calculator App</h3>
            <p>Lab calculation tool built with HTML, CSS, and JavaScript and published on Google Play Store.</p>
          </div>

          <div class="project-card">
            <h3>Respiratory Health Chatbot</h3>
            <p>Healthcare chatbot built with HTML, CSS, and Vue.js for interactive respiratory guidance.</p>
          </div>

          <div class="project-card">
            <h3>AI Plant Identification</h3>
            <p>TensorFlow computer vision system with voice feedback for plant detection and classification.</p>
          </div>

          <div class="project-card">
            <h3>AI Games</h3>
            <p>Chess and Checkers gameplay systems with AI functionality, plus Connect4 desktop implementation.</p>
          </div>
        </div>
      </div>
    `;
  }

  function getSkills() {
    return `
      <div class="about-container">
        <p class="code-line">{ /* skills.json */ }</p>
        <h1 class="hero-name">Skills</h1>

        <div class="about-card">
          <h3 class="section-title">PROGRAMMING</h3>
          <div class="skills-grid">
            <span class="skills-chip">Python</span>
            <span class="skills-chip">Java</span>
            <span class="skills-chip">C</span>
            <span class="skills-chip">C++</span>
            <span class="skills-chip">JavaScript</span>
            <span class="skills-chip">HTML</span>
            <span class="skills-chip">CSS</span>
            <span class="skills-chip">Flutter</span>
          </div>
        </div>

        <div class="about-card">
          <h3 class="section-title">AI & DATA</h3>
          <div class="skills-grid">
            <span class="skills-chip">TensorFlow</span>
            <span class="skills-chip">Machine Learning</span>
            <span class="skills-chip">Computer Vision</span>
            <span class="skills-chip">Jupyter Notebook</span>
            <span class="skills-chip">Google Colab</span>
            <span class="skills-chip">SAS</span>
            <span class="skills-chip">Microsoft Excel</span>
          </div>
        </div>

        <div class="about-card">
          <h3 class="section-title">HEALTHCARE TOOLS</h3>
          <div class="skills-grid">
            <span class="skills-chip">EHRGo</span>
            <span class="skills-chip">WellSky</span>
            <span class="skills-chip">Clinical Informatics</span>
            <span class="skills-chip">Healthcare Analytics</span>
          </div>
        </div>
      </div>
    `;
  }

  function getExperience() {
    return `
      <div class="about-container">
        <p class="code-line">// experience.ts</p>
        <h1 class="hero-name">Experience</h1>

        <div class="about-card">
          <h3 class="section-title">PROFESSIONAL EXPERIENCE</h3>

          <div class="timeline">
            <div class="timeline-item">
              <strong>Clinical Informatics Intern — Alivia Care</strong>
              <span>Jacksonville, FL • Oct 2025 – Feb 2026</span>
              <p>Analyzed clinical workflows, supported EHR-based reporting initiatives, and collaborated with informatics teams to interpret clinical data for operational insights. Earned WellSky certifications.</p>
            </div>

            <div class="timeline-item">
              <strong>Data Science Analyst — BluCognition</strong>
              <span>Pune, India • Mar 2022 – Jun 2023</span>
              <p>Developed TensorFlow-based CNN models for bank statement extraction and financial document classification. Built machine learning pipelines for structured analytics and automation.</p>
            </div>

            <div class="timeline-item">
              <strong>Academic Research Associate — Digiversal Consultant</strong>
              <span>Noida, India • Dec 2020 – Mar 2022</span>
              <p>Conducted technical research and data analysis for IT and analytics consulting projects, preparing structured reports and documentation.</p>
            </div>

            <div class="timeline-item">
              <strong>Bioinformatics Research Intern — IBAB</strong>
              <span>Remote • Jul 2020 – Dec 2020</span>
              <p>Curated biological datasets and organized genomic data to support a COVID-19 research meta-database.</p>
            </div>

            <div class="timeline-item">
              <strong>Microbiology Trainee — SRL Diagnostics</strong>
              <span>Noida, India • Jun 2018 – Jul 2018</span>
              <p>Conducted microbial testing using culture techniques, microscopy, antibody-based assays, and supported BD blood culture diagnostic workflows.</p>
            </div>

            <div class="timeline-item">
              <strong>Content Developer — Sanfoundry</strong>
              <span>Remote • Dec 2017 – Mar 2018</span>
              <p>Developed and curated 1000+ bioprocess engineering MCQs and technical learning content for an online education platform.</p>
            </div>
          </div>
        </div>

        <div class="about-card">
          <h3 class="section-title">VOLUNTEER</h3>
          <div class="timeline">
            <div class="timeline-item">
              <strong>Volunteer — Game Development & Graphic Design</strong>
              <span>Lemonade Stand Bootcamp, Pensacola, FL • May 2025 – Aug 2025</span>
              <p>Designed 2D/3D visual assets using Canva and Blender for educational games and collaborated with cross-functional teams on interactive learning content.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getContact() {
    return `
      <div class="about-container">
        <p class="code-line">/* contact.css */</p>
        <h1 class="hero-name">Contact</h1>

        <div class="about-card">
          <p><span class="highlight">Email:</span> agbrian521@gmail.com</p>
          <p><span class="highlight">Phone:</span> (904) 228-1179</p>
          <p><span class="highlight">Location:</span> Jacksonville, FL</p>
          <p><span class="highlight">LinkedIn:</span> linkedin.com/in/agranisinha</p>
        </div>
      </div>
    `;
  }

  function getReadme() {
    return `
      <div class="about-container">
        <p class="code-line"># README.md</p>
        <h1 class="hero-name">README</h1>

        <div class="about-card">
          <p>
            This portfolio presents my work across
            <span class="highlight">health informatics, AI, machine learning, data analytics, and software systems</span>.
            Use the sidebar or tabs to explore sections like About, Projects, Skills, Experience, and Contact.
          </p>
        </div>
      </div>
    `;
  }

  function getResume() {
    return `
      <div class="about-container">
        <p class="code-line">/* Resume.pdf */</p>
        <h1 class="hero-name">Resume</h1>

        <div class="about-card">
          <p>
            Open my latest resume for the complete professional record.
          </p>
          <div class="home-buttons">
            <button onclick="window.open('Agrani Sinha Resume(1).docx', '_blank')">📄 Open Resume</button>
          </div>
        </div>
      </div>
    `;
  }

  function showMessage(msg) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.classList.add("show");

    setTimeout(() => {
      feedback.classList.remove("show");
    }, 2200);
  }

  if (red) {
    red.addEventListener("click", () => {
      const msg = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
      showMessage(msg);
    });
  }

  if (yellow) {
    yellow.addEventListener("click", () => {
      document.body.style.transition = "transform 0.2s ease";
      document.body.style.transform = "scale(0.97)";
      setTimeout(() => {
        document.body.style.transform = "scale(1)";
      }, 180);
    });
  }

  if (green) {
    green.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.error("Fullscreen error:", error);
      }
    });
  }

  window.openSidebar = function openSidebar(type) {
    document.querySelectorAll(".activity-icon").forEach((icon) => {
      icon.classList.remove("active");
    });

    if (window.event && window.event.currentTarget) {
      window.event.currentTarget.classList.add("active");
    }

    if (type === "copilot") openPalette();
  };

  if (cursorSquare && cursorDot) {
    document.addEventListener("mousemove", (e) => {
      cursorSquare.style.left = `${e.clientX}px`;
      cursorSquare.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    });

    document.addEventListener("mousedown", () => {
      cursorSquare.style.width = "18px";
      cursorSquare.style.height = "18px";
    });

    document.addEventListener("mouseup", () => {
      cursorSquare.style.width = "24px";
      cursorSquare.style.height = "24px";
    });
  }

  if (paletteInput) {
    paletteInput.addEventListener("input", () => {
      const value = paletteInput.value.trim().toLowerCase();

      if (value.includes("about")) openTab("about");
      if (value.includes("project")) openTab("projects");
      if (value.includes("skill")) openTab("skills");
      if (value.includes("experience")) openTab("experience");
      if (value.includes("contact")) openTab("contact");
      if (value.includes("resume")) openTab("resume");
      if (value.includes("readme")) openTab("readme");
      if (value.includes("home")) openTab("home");
    });
  }

  openTab("home");
});
