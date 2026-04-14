// SCROLL ANIMATION
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
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

// TYPING
const roles = ["AI in Healthcare", "Clinical Informatics", "Data Science"];
let i = 0, j = 0;

function type() {
  document.getElementById("typing").textContent =
    roles[i].substring(0, j++);

  if (j > roles[i].length) {
    j = 0;
    i = (i + 1) % roles.length;
  }

  setTimeout(type, 100);
}
type();

// CAROUSEL (LIMITED)
document.querySelectorAll(".carousel").forEach(carousel => {
  const track = carousel.querySelector(".carousel-track");
  const slides = track.children;
  const next = carousel.querySelector(".next");
  const prev = carousel.querySelector(".prev");

  let index = 0;

  const update = () => {
    track.style.transform = `translateX(-${index * 310}px)`;
  };

  next.onclick = () => {
    if (index < slides.length - 1) {
      index++;
      update();
    }
  };

  prev.onclick = () => {
    if (index > 0) {
      index--;
      update();
    }
  };
});
