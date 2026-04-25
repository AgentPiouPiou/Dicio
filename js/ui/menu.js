window.toggleMenu = function(e) {
  e.stopPropagation();
  document.getElementById("dropdown")?.classList.toggle("active");
};

document.addEventListener("click", () => {
  document.getElementById("dropdown")?.classList.remove("active");
});
