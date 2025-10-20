const gamemodeBtn = document.getElementById("gamemodesBtn");
const dropdown = document.getElementById("gamemodesDropdown");

gamemodeBtn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

