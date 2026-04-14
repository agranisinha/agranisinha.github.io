function showSection(id) {
  document.querySelectorAll('.panel').forEach(sec => {
    sec.classList.remove('active');
  });

  document.getElementById(id).classList.add('active');
}
