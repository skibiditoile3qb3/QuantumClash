const gamemodeBtn = document.getElementById("gamemodesBtn");
const dropdown = document.getElementById("gamemodesDropdown");
const gamemodeOptions = document.querySelectorAll(".gamemode-option");
const battleBtn = document.getElementById("battleBtn");
const mainContainer = document.getElementById("mainContainer");

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

document.addEventListener("click", e => {
  if (!gamemodeBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

battleBtn.addEventListener("click", () => {
  mainContainer.style.transition = "opacity 0.6s ease";
  mainContainer.style.opacity = "0";
  setTimeout(() => {
    mainContainer.innerHTML = `
      <div id="loadingScreen">
        <h1>Loading ${selectedMode} Match...</h1>
        <div class="loading-bar">
          <div class="loading-fill"></div>
        </div>
      </div>
    `;
    mainContainer.style.opacity = "1";

    setTimeout(() => {
      mainContainer.innerHTML = "";
    }, 2500); 
  }, 600);
});
