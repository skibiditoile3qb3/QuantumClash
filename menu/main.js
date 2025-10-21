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
      mainContainer.innerHTML = `
        <div id="gameContainer">
          <div id="gameStats">
            <div class="stat-row">
              <span>Black: <strong id="blackCount">32</strong></span>
              <span>White: <strong id="whiteCount">32</strong></span>
            </div>
            <div class="stat-row">
              <span>Moves: <strong id="movesRemaining">50</strong></span>
              <span>Mana: <strong id="playerMana">50</strong></span>
            </div>
          </div>
          <canvas id="gameBoard"></canvas>
        </div>
      `;

     const game = new QuantumClash(12);
     game.initSplitBoard(); 
      
      const renderer = new BoardRenderer(game, 'gameBoard');
      renderer.render();
      renderer.updateUI();
      
      mainContainer.style.opacity = "1";
    }, 2500); 
  }, 600);
});
