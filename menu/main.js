const gamemodeBtn = document.getElementById("gamemodesBtn");
const dropdown = document.getElementById("gamemodesDropdown");
const gamemodeOptions = document.querySelectorAll(".gamemode-option");
const battleBtn = document.getElementById("battleBtn");
const mainContainer = document.getElementById("mainContainer");
const settingsBtn = document.getElementById("settingsBtn");

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

function getCookie(name) {
  const cookies = document.cookie.split(";").map(c => c.trim());
  for (let c of cookies) {
    if (c.startsWith(name + "=")) return c.split("=")[1];
  }
  return null;
}

function setAIDifficulty(difficulty) {
  document.cookie = `aiDifficulty=${difficulty}; path=/; max-age=31536000`;
}

function getAIDifficulty() {
  return getCookie('aiDifficulty') || 'medium';
}

settingsBtn.addEventListener('click', () => {
  const currentDifficulty = getAIDifficulty();
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); display: flex; align-items: center;
    justify-content: center; z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="background: linear-gradient(135deg, #1a0a2e, #0f0520); 
                padding: 40px; border-radius: 20px; border: 2px solid #00c6ff;
                box-shadow: 0 0 40px rgba(0,198,255,0.4); min-width: 300px;">
      <h2 style="color: #00c6ff; margin-bottom: 25px; text-align: center; font-size: 1.8rem;">AI Difficulty</h2>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button class="diff-btn" data-diff="easy">Easy</button>
        <button class="diff-btn" data-diff="medium">Medium</button>
        <button class="diff-btn" data-diff="hard">Hard</button>
        <button class="diff-btn" data-diff="impossible">Impossible</button>
      </div>
      <button id="closeModal" style="margin-top: 25px; width: 100%; padding: 12px;
              background: #ff0072; border: none; border-radius: 10px; color: white;
              font-weight: bold; cursor: pointer; font-size: 1.1rem;">Close</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelectorAll('.diff-btn').forEach(btn => {
    btn.style.cssText = `
      padding: 15px; background: linear-gradient(135deg, #00c6ff, #0072ff);
      border: none; border-radius: 10px; color: white; font-weight: bold;
      cursor: pointer; font-size: 1.1rem; transition: all 0.3s ease;
    `;
    if (btn.dataset.diff === currentDifficulty) {
      btn.style.background = 'linear-gradient(135deg, #ff6b00, #ff0072)';
      btn.style.boxShadow = '0 0 20px rgba(255, 107, 0, 0.6)';
    }
    btn.addEventListener('mouseover', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 6px 20px rgba(0, 198, 255, 0.5)';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.transform = 'translateY(0)';
      if (btn.dataset.diff !== currentDifficulty) {
        btn.style.boxShadow = 'none';
      }
    });
    btn.addEventListener('click', () => {
      setAIDifficulty(btn.dataset.diff);
      modal.remove();
    });
  });
  
  modal.querySelector('#closeModal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
});

const tierData = {
  1: { name: "Novice", grid: 4, moves: 25, xp: "0–250", reward: "10 coins", deck: "3ih7ttal" },
  2: { name: "Rookie", grid: 5, moves: 30, xp: "250–500", reward: "25 coins", deck: "3ih7ttal" },
  3: { name: "Apprentice", grid: 6, moves: 40, xp: "500–1000", reward: "40 coins", deck: "4ih8ttal" },
  4: { name: "Veteran", grid: 8, moves: 50, xp: "1000–2000", reward: "60 coins", deck: "5ih9ttal" },
  5: { name: "Elite", grid: 10, moves: 80, xp: "2000–3500", reward: "120 coins", deck: "6ih10ttal" },
  6: { name: "Master", grid: 12, moves: 100, xp: "3500–6000", reward: "200 coins", deck: "7ih11ttal" },
  7: { name: "Ascendant", grid: 14, moves: 120, xp: "6000+", reward: "300 coins", deck: "8ih12ttal" }
};

battleBtn.addEventListener("click", () => {
  isAIGame = selectedMode === "AI";
  
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
            <span id="manaText">50</span>
          </div>
        </div>
      `;
      
      console.log(`Current Tier: ${currentTier.name}`);
      const game = new QuantumClash(currentTier.grid, currentTier.moves);
      game.initSplitBoard();
      
      if (isAIGame) {
        ai = new QuantumAI(game, getAIDifficulty());
        const aiColor = game.playerColor === 0 ? 1 : 0;
        ai.setColors(aiColor, game.playerColor);
        
        if (aiColor === 0) {
          isAITurn = true;
          setTimeout(() => {
            ai.makeMove((x, y) => {
              game.flipCross(x, y);
              const renderer = window.currentRenderer;
              if (renderer) renderer.updateUI();
              isAITurn = false;
            });
          }, 500);
        }
      }
      
      const renderer = new BoardRenderer(game, "gameBoard");
      window.currentRenderer = renderer;
      window.currentGame = game;
      renderer.render();
      renderer.updateUI();
      mainContainer.style.opacity = "1";
    }, 2500);
  }, 600);
});
