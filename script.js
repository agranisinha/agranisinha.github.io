// SCROLL ANIMATION
const items = document.querySelectorAll('.fade');

window.addEventListener('scroll', () => {
  items.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add('show');
    }
  });
});

// CURSOR GLOW
document.addEventListener("mousemove", e => {
  const glow = document.getElementById("cursorGlow");
  glow.style.left = e.pageX + "px";
  glow.style.top = e.pageY + "px";
});
