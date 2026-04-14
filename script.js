const paletteInput = document.getElementById("paletteInput");
const paletteItems = Array.from(document.querySelectorAll(".palette-item"));
const cursorSquare = document.getElementById("cursorSquare");
const cursorDot = document.getElementById("cursorDot");

let activeIndex = 0;

function setActiveItem(index) {
  paletteItems.forEach((item) => item.classList.remove("active"));
  activeIndex = Math.max(0, Math.min(index, paletteItems.length - 1));
  paletteItems[activeIndex].classList.add("active");
  paletteItems[activeIndex].scrollIntoView({ block: "nearest" });
}

function filterPalette(query) {
  const normalized = query.trim().toLowerCase();

  let firstVisibleIndex = -1;

  paletteItems.forEach((item, index) => {
    const text = item.innerText.toLowerCase();
    const visible = text.includes(normalized);
    item.style.display = visible ? "flex" : "none";

    if (visible && firstVisibleIndex === -1) {
      firstVisibleIndex = index;
    }
  });

  if (firstVisibleIndex !== -1) {
    paletteItems.forEach((item) => item.classList.remove("active"));
    paletteItems[firstVisibleIndex].classList.add("active");
    activeIndex = firstVisibleIndex;
  }
}

paletteInput.addEventListener("input", (e) => {
  filterPalette(e.target.value);
});

paletteInput.addEventListener("keydown", (e) => {
  const visibleItems = paletteItems.filter((item) => item.style.display !== "none");
  const currentVisibleIndex = visibleItems.findIndex((item) =>
    item.classList.contains("active")
  );

  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (!visibleItems.length) return;
    const next = (currentVisibleIndex + 1) % visibleItems.length;
    paletteItems.forEach((item) => item.classList.remove("active"));
    visibleItems[next].classList.add("active");
    visibleItems[next].scrollIntoView({ block: "nearest" });
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (!visibleItems.length) return;
    const next = (currentVisibleIndex - 1 + visibleItems.length) % visibleItems.length;
    paletteItems.forEach((item) => item.classList.remove("active"));
    visibleItems[next].classList.add("active");
    visibleItems[next].scrollIntoView({ block: "nearest" });
  }

  if (e.key === "Enter") {
    e.preventDefault();
    const active = document.querySelector(".palette-item.active");
    if (active) {
      alert(`Selected: ${active.innerText.trim()}`);
    }
  }

  if (e.key === "Escape") {
    paletteInput.blur();
  }
});

paletteItems.forEach((item, index) => {
  item.addEventListener("mouseenter", () => setActiveItem(index));
  item.addEventListener("click", () => {
    alert(`Selected: ${item.innerText.trim()}`);
  });
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

window.addEventListener("load", () => {
  paletteInput.focus();
  setActiveItem(0);
});
