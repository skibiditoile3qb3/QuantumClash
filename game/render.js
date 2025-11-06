// board rendering

class BoardRenderer {
  constructor(game, canvasId) {
    this.game = game;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    this.calculateTileSize();
    this.padding = 4;
    this.canvas.width = (this.tileSize + this.padding) * game.gridSize + this.padding;
    this.canvas.height = (this.tileSize + this.padding) * game.gridSize + this.padding;
    
    this.colors = {
      black: '#1a1a2e',
      white: '#e8e8f0',
      blackHover: '#252540',
      whiteHover: '#ffffff',
      blackBorder: '#0f0f1a',
      whiteBorder: '#d0d0d8',
      grid: '#16213e',
      quantum: 'rgba(139, 92, 246, 0.6)',
      quantumGlow: 'rgba(139, 92, 246, 0.3)',
      mana: '#00d4ff',
      manaGlow: 'rgba(0, 212, 255, 0.4)',
      lock: '#ffd700',
      lockGlow: 'rgba(255, 215, 0, 0.3)'
    };
    
    this.hoveredTile = null;
    this.animationFrame = 0;
    this.setupEvents();
    this.startAnimation();
  }
  
endGame() {
  if (this.animationId) {
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }

  this.canvas.style.pointerEvents = 'none';
  const counts = this.game.countTiles();
  const playerCount = this.game.playerColor === 0 ? counts.black : counts.white;
  const enemyCount = this.game.playerColor === 0 ? counts.white : counts.black;
  const isVictory = playerCount > enemyCount;
  this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.ctx.fillStyle = isVictory ? '#00ff88' : '#ff0072';
  this.ctx.font = 'bold 36px sans-serif';
  this.ctx.textAlign = 'center';
  this.ctx.fillText(isVictory ? 'VICTORY!' : 'DEFEAT', this.canvas.width / 2, this.canvas.height / 2 - 30);
  
  this.ctx.fillStyle = '#fff';
  this.ctx.font = '20px sans-serif';
  this.ctx.fillText(`You: ${playerCount} tiles`, this.canvas.width / 2, this.canvas.height / 2 + 10);
  this.ctx.fillText(`Opponent: ${enemyCount} tiles`, this.canvas.width / 2, this.canvas.height / 2 + 40);

  console.log('Game ended 🕹️');
}
    
    
startAnimation() {
  const animate = () => {
    this.animationFrame++;
    this.render();
    this.animationId = requestAnimationFrame(animate);
  };
  animate();
}

  getTileFromMouse(mouseX, mouseY) {
    const x = Math.floor((mouseX - this.padding) / (this.tileSize + this.padding));
    const y = Math.floor((mouseY - this.padding) / (this.tileSize + this.padding));
    
    if (x >= 0 && x < this.game.gridSize && y >= 0 && y < this.game.gridSize) {
      return { x, y };
    }
    return null;
  }

  setupEvents() {
      
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      this.hoveredTile = this.getTileFromMouse(mouseX, mouseY);
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.hoveredTile = null;
    });
    
    this.canvas.addEventListener('click', (e) => {
      if (isAITurn) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const tile = this.getTileFromMouse(mouseX, mouseY);
      if (tile) {
        this.game.flipCross(tile.x, tile.y);
        this.updateUI();
        
      if (this.game.movesRemaining <= 0) {
      this.endGame();
      return;
    }
if (isAIGame && ai && !isAITurn) {
  isAITurn = true;
  ai.makeMove((x, y) => {
    this.game.flipCross(x, y);
    this.updateUI();
    isAITurn = false;
    if (this.game.movesRemaining <= 0) {
      this.endGame();
    }
  });
}
      }
    });
  }

  drawTile(x, y) {
    const tile = this.game.getTile(x, y);
    if (!tile) return;
    
    const screenX = this.padding + x * (this.tileSize + this.padding);
    const screenY = this.padding + y * (this.tileSize + this.padding);

    const isHovered = this.hoveredTile && 
                     this.hoveredTile.x === x && 
                     this.hoveredTile.y === y;

    let baseColor = tile[0] === 0 ? this.colors.black : this.colors.white;
    let borderColor = tile[0] === 0 ? this.colors.blackBorder : this.colors.whiteBorder;
    
    if (isHovered) {
      baseColor = tile[0] === 0 ? this.colors.blackHover : this.colors.whiteHover;
    }

    this.ctx.fillStyle = baseColor;
    this.roundRect(screenX, screenY, this.tileSize, this.tileSize, 6);
    this.ctx.fill();

    const hasQuantum = tile.slice(2).includes(this.game.objectIDs.QUANTUM);
    const hasMana = tile.slice(2).includes(this.game.objectIDs.MANA_TILE);
    const hasLock = tile.slice(2).includes(this.game.objectIDs.LOCKED);

    if (hasQuantum) {
      const pulse = Math.sin(this.animationFrame * 0.05) * 0.3 + 0.7;

      const gradient = this.ctx.createRadialGradient(
        screenX + this.tileSize / 2, screenY + this.tileSize / 2, 0,
        screenX + this.tileSize / 2, screenY + this.tileSize / 2, this.tileSize * 0.6
      );
      gradient.addColorStop(0, `rgba(139, 92, 246, ${pulse * 0.4})`);
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      this.ctx.fillStyle = gradient;
      this.roundRect(screenX, screenY, this.tileSize, this.tileSize, 6);
      this.ctx.fill();

      for (let i = 0; i < 3; i++) {
        const angle = (this.animationFrame * 0.02) + (i * Math.PI * 2 / 3);
        const radius = 15;
        const px = screenX + this.tileSize / 2 + Math.cos(angle) * radius;
        const py = screenY + this.tileSize / 2 + Math.sin(angle) * radius;
        
        this.ctx.fillStyle = `rgba(139, 92, 246, ${pulse})`;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    if (hasMana) {
      const pulse = Math.sin(this.animationFrame * 0.08) * 0.2 + 0.8;
      const centerX = screenX + this.tileSize / 2;
      const centerY = screenY + this.tileSize / 2;
      
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 20
      );
      gradient.addColorStop(0, `rgba(0, 212, 255, ${pulse * 0.6})`);
      gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = this.colors.mana;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY - 12);
      this.ctx.lineTo(centerX + 8, centerY - 4);
      this.ctx.lineTo(centerX + 8, centerY + 8);
      this.ctx.lineTo(centerX, centerY + 12);
      this.ctx.lineTo(centerX - 8, centerY + 8);
      this.ctx.lineTo(centerX - 8, centerY - 4);
      this.ctx.closePath();
      this.ctx.stroke();
      
      this.ctx.fillStyle = `rgba(0, 212, 255, ${pulse * 0.3})`;
      this.ctx.fill();
    }
    
    if (hasLock) {
      const centerX = screenX + this.tileSize / 2;
      const centerY = screenY + this.tileSize / 2;
      const pulse = Math.sin(this.animationFrame * 0.06) * 0.2 + 0.8;
      const gradient = this.ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 18
      );
      gradient.addColorStop(0, `rgba(255, 215, 0, ${pulse * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, 18, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = this.colors.lock;
      this.ctx.fillRect(centerX - 8, centerY - 2, 16, 10);
      this.ctx.strokeStyle = this.colors.lock;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY - 2, 6, Math.PI, 0, true);
      this.ctx.stroke();
      this.ctx.fillStyle = '#1a1a2e';
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY + 1, 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillRect(centerX - 1, centerY + 1, 2, 4);
    }
    
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 2;
    this.roundRect(screenX, screenY, this.tileSize, this.tileSize, 6);
    this.ctx.stroke();
    
    if (isHovered) {
      this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.8)';
      this.ctx.lineWidth = 3;
      this.roundRect(screenX, screenY, this.tileSize, this.tileSize, 6);
      this.ctx.stroke();
    }
  }
  
  roundRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + radius, radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.arcTo(x, y, x + radius, y, radius);
    this.ctx.closePath();
  }
  
  render() {
    this.ctx.fillStyle = '#0a0015';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let y = 0; y < this.game.gridSize; y++) {
      for (let x = 0; x < this.game.gridSize; x++) {
        this.drawTile(x, y);
      }
    }
  }
  
  calculateTileSize() {
    const baseSize = 70;
    const baseGridSize = 8;
    this.tileSize = Math.floor(baseSize * ((baseGridSize / this.game.gridSize)/1.3));
  }
  
  updateUI() {
    document.getElementById('movesRemaining').textContent = this.game.movesRemaining;
    document.getElementById('manaText').textContent = this.game.playerMana;
    
    const manaPercent = (this.game.playerMana / 100) * 100;
    document.getElementById('manaFill').style.width = `${manaPercent}%`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BoardRenderer;
}
