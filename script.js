const openPaletteBtn = document.getElementById("openPaletteBtn");
const paletteOverlay = document.getElementById("paletteOverlay");
const paletteBackdrop = document.getElementById("paletteBackdrop");
const paletteInput = document.getElementById("paletteInput");
const paletteItems = Array.from(document.querySelectorAll(".palette-item"));
const cursorSquare = document.getElementById("cursorSquare");
const cursorDot = document.getElementById("cursorDot");

function openPalette() {
  paletteOverlay.classList.add("open");
  paletteOverlay.setAttribute("aria-hidden", "false");
  setTimeout(() => paletteInput.focus(), 20);
}

function closePalette() {
  paletteOverlay.classList.remove("open");
  paletteOverlay.setAttribute("aria-hidden", "true");
}

function setActiveItem(index) {
  const visibleItems = paletteItems.filter((item) => item.style.display !== "none");
  if (!visibleItems.length) return;

  visibleItems.forEach((item) => item.classList.remove("active"));
  const safeIndex = Math.max(0, Math.min(index, visibleItems.length - 1));
  visibleItems[safeIndex].classList.add("active");
  visibleItems[safeIndex].scrollIntoView({ block: "nearest" });
}

function getVisibleItems() {
  return paletteItems.filter((item) => item.style.display !== "none");
}

function filterPalette(query) {
  const normalized = query.trim().toLowerCase();

  paletteItems.forEach((item) => {
    const text = item.innerText.toLowerCase();
    item.style.display = text.includes(normalized) ? "flex" : "none";
  });

  setActiveItem(0);
}

openPaletteBtn.addEventListener("click", openPalette);
paletteBackdrop.addEventListener("click", closePalette);

paletteItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    getVisibleItems().forEach((node) => node.classList.remove("active"));
    item.classList.add("active");
  });

  item.addEventListener("click", () => {
    closePalette();
  });
});

paletteInput.addEventListener("input", (e) => {
  filterPalette(e.target.value);
});

paletteInput.addEventListener("keydown", (e) => {
  const visibleItems = getVisibleItems();
  const currentIndex = visibleItems.findIndex((item) => item.classList.contains("active"));

  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = currentIndex < visibleItems.length - 1 ? currentIndex + 1 : 0;
    visibleItems.forEach((item) => item.classList.remove("active"));
    visibleItems[next].classList.add("active");
    visibleItems[next].scrollIntoView({ block: "nearest" });
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    const next = currentIndex > 0 ? currentIndex - 1 : visibleItems.length - 1;
    visibleItems.forEach((item) => item.classList.remove("active"));
    visibleItems[next].classList.add("active");
    visibleItems[next].scrollIntoView({ block: "nearest" });
  }

  if (e.key === "Enter") {
    e.preventDefault();
    const active = document.querySelector(".palette-item.active");
    if (active) {
      closePalette();
    }
  }

  if (e.key === "Escape") {
    closePalette();
  }
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
    e.preventDefault();
    openPalette();
  }

  if (e.key === "Escape" && paletteOverlay.classList.contains("open")) {
    closePalette();
  }
});

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

// ================= SIDEBAR =================
function openSidebar(type) {
  document.querySelectorAll('.activity-icon').forEach(i => i.classList.remove('active'));
  event.target.classList.add('active');
}

// ================= SETTINGS =================
function toggleSettings() {
  document.getElementById('settingsPanel').classList.toggle('open');
}

// ================= THEMES =================
function setTheme(theme) {
  document.body.className = theme;

  document.querySelectorAll('.theme-option').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
}
function openTab(name) {
  alert("Opening " + name + " (next step we will connect real pages)");
}
