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
  }, 600);

  function getCookie(name) {
    const cookies = document.cookie.split(";").map(c => c.trim());
    for (let c of cookies) {
      if (c.startsWith(name + "=")) return c.split("=")[1];
    }
    return null;
  }

  const tierData = {
    1: { name: "Novice", grid: 4, moves: 25, xp: "0–250", reward: "10 coins", deck: "3ih7ttal" },
    2: { name: "Rookie", grid: 5, moves: 30, xp: "250–500", reward: "25 coins", deck: "3ih7ttal" },
    3: { name: "Apprentice", grid: 6, moves: 40, xp: "500–1000", reward: "40 coins", deck: "4ih8ttal" },
    4: { name: "Veteran", grid: 8, moves: 50, xp: "1000–2000", reward: "60 coins", deck: "5ih9ttal" },
    5: { name: "Elite", grid: 10, moves: 80, xp: "2000–3500", reward: "120 coins", deck: "6ih10ttal" },
    6: { name: "Master", grid: 12, moves: 100, xp: "3500–6000", reward: "200 coins", deck: "7ih11ttal" },
    7: { name: "Ascendant", grid: 14, moves: 120, xp: "6000+", reward: "300 coins", deck: "8ih12ttal" }
  };

  const tier = parseInt(getCookie("tier") || "1");
  const currentTier = tierData[tier] || tierData[1];

  setTimeout(() => {
    mainContainer.innerHTML = `
      <div id="gameContainer">
        <div id="moveCounter">
          <div class="clock-icon">⏱️</div>
          <span id="movesRemaining">${currentTier.moves}</span>
        </div>
        <canvas id="gameBoard"></canvas>
        <div id="manaBar">
          <div id="manaFill"></div>
          <span id="manaText">${currentTier.moves}</span>
        </div>
      </div>
    `;

    console.log(`Current Tier: ${currentTier.name}`);

    const game = new QuantumClash(currentTier.grid, currentTier.moves);
    game.initSplitBoard();

    const renderer = new BoardRenderer(game, "gameBoard");
    renderer.render();
    renderer.updateUI();

    mainContainer.style.opacity = "1";
  }, 2500);
});
