const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

const btn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  btn.style.display = window.scrollY > 300 ? "block" : "none";
});

btn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
