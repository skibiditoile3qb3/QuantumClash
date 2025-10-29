class QuantumAI {
  constructor(game, difficulty = 'medium') {
    this.game = game;
    this.difficulty = difficulty;
    this.aiColor = null;
    this.playerColor = null;
    
    this.difficultySettings = {
      easy: { movePoolSize: 20, randomness: 0.6, thinkTime: 800 },
      medium: { movePoolSize: 10, randomness: 0.3, thinkTime: 1200 },
      hard: { movePoolSize: 5, randomness: 0.1, thinkTime: 1500 },
      impossible: { movePoolSize: 1, randomness: 0, thinkTime: 2000 }
    };
  }
  
  setColors(aiColor, playerColor) {
    this.aiColor = aiColor;
    this.playerColor = playerColor;
  }
  
  evaluateBoard() {
    let score = 0;
    const counts = this.game.countTiles();
    
    const aiTiles = this.aiColor === 0 ? counts.black : counts.white;
    const playerTiles = this.playerColor === 0 ? counts.black : counts.white;
    score += (aiTiles - playerTiles) * 10;
    
    const centerStart = Math.floor(this.game.gridSize / 4);
    const centerEnd = Math.ceil(this.game.gridSize * 3 / 4);
    let centerControl = 0;
    
    for (let y = centerStart; y < centerEnd; y++) {
      for (let x = centerStart; x < centerEnd; x++) {
        const tile = this.game.getTile(x, y);
        if (tile && tile[0] === this.aiColor) centerControl++;
        else if (tile && tile[0] === this.playerColor) centerControl--;
      }
    }
    score += centerControl * 15;
    
    for (let y = 0; y < this.game.gridSize; y++) {
      for (let x = 0; x < this.game.gridSize; x++) {
        const tile = this.game.getTile(x, y);
        if (!tile) continue;
        
        const isAIColor = tile[0] === this.aiColor;
        const hasQuantum = tile.slice(2).includes(this.game.objectIDs.QUANTUM);
        const hasMana = tile.slice(2).includes(this.game.objectIDs.MANA_TILE);
        const hasLock = tile.slice(2).includes(this.game.objectIDs.LOCKED);
        
        if (hasQuantum) score += isAIColor ? 20 : -20;
        if (hasMana) score += isAIColor ? 15 : -15;
        if (hasLock) score += isAIColor ? -10 : 10;
      }
    }
    
    return score;
  }
  
  simulateMove(x, y) {
    const boardCopy = this.game.board.map(tile => [...tile]);
    const originalMana = this.game.playerMana;
    const originalMoves = this.game.movesRemaining;
    
    this.game.flipCross(x, y);
    const score = this.evaluateBoard();
    
    this.game.board = boardCopy;
    this.game.playerMana = originalMana;
    this.game.movesRemaining = originalMoves;
    
    return score;
  }
  
  getAllPossibleMoves() {
    const moves = [];
    
    for (let y = 0; y < this.game.gridSize; y++) {
      for (let x = 0; x < this.game.gridSize; x++) {
        const score = this.simulateMove(x, y);
        moves.push({ x, y, score });
      }
    }
    
    moves.sort((a, b) => b.score - a.score);
    return moves;
  }
  
  selectMove() {
    const settings = this.difficultySettings[this.difficulty];
    const allMoves = this.getAllPossibleMoves();
    
    if (allMoves.length === 0) return null;
    
    if (Math.random() < settings.randomness) {
      return allMoves[Math.floor(Math.random() * allMoves.length)];
    }
    
    const topMoves = allMoves.slice(0, settings.movePoolSize);
    return topMoves[Math.floor(Math.random() * topMoves.length)];
  }
  
  makeMove(callback) {
    const settings = this.difficultySettings[this.difficulty];
    
    setTimeout(() => {
      const move = this.selectMove();
      if (move) {
        callback(move.x, move.y);
      }
    }, settings.thinkTime);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuantumAI;
}
