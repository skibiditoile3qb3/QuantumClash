const gamemodeBtn = document.getElementById("gamemodesBtn");
const dropdown = document.getElementById("gamemodesDropdown");
const gamemodeOptions = document.querySelectorAll(".gamemode-option");
let selectedMode = "Online";
gamemodeBtn.textContent = selectedMode;
gamemodeBtn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});
gamemodeOptions.forEach(option => {
  option.addEventListener("click", () => {
    selectedMode = option.textContent;
    gamemodeBtn.textContent = selectedMode;
    dropdown.classList.remove("show");
  });
});

document.addEventListener("click", (e) => {
  if (!gamemodeBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});
