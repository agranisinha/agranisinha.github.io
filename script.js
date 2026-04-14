// SCROLL ANIMATION
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

// BACK TO TOP
const topBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

// DARK MODE
const toggle = document.getElementById("themeToggle");

toggle.onclick = () => {
  document.body.classList.toggle("dark");
};

// TYPING EFFECT
const text = ["AI in Healthcare", "Clinical Informatics", "Data Science", "System Design"];
let i = 0, j = 0, current = "", isDeleting = false;

function type() {
  current = text[i];
  if (isDeleting) {
    document.getElementById("typing").textContent = current.substring(0, j--);
  } else {
    document.getElementById("typing").textContent = current.substring(0, j++);
  }

  if (!isDeleting && j === current.length) {
    isDeleting = true;
    setTimeout(type, 1000);
  } else if (isDeleting && j === 0) {
    isDeleting = false;
    i = (i + 1) % text.length;
    setTimeout(type, 300);
  } else {
    setTimeout(type, isDeleting ? 50 : 100);
  }
}
type();

// CAROUSEL LOGIC
document.querySelectorAll(".carousel").forEach(carousel => {
  const track = carousel.querySelector(".carousel-track");
  const next = carousel.querySelector(".next");
  const prev = carousel.querySelector(".prev");

  let index = 0;

  next.onclick = () => {
    index++;
    track.style.transform = `translateX(-${index * 300}px)`;
  };

  prev.onclick = () => {
    index = Math.max(0, index - 1);
    track.style.transform = `translateX(-${index * 300}px)`;
  };
});
