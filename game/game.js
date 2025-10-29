// game.js - game logic

class QuantumClash {
  constructor(gridSize = 8, moveLimit = 50) {
    this.gridSize = gridSize;
    this.totalTiles = gridSize * gridSize;
    
    // color: 0 = black, 1 = white
    this.board = Array(this.totalTiles).fill(null).map(() => [0, 0]);
    

    this.currentTurn = 0;
    this.playerMana = 50;
    this.opponentMana = 50;
    this.maxMoves = moveLimit;
    this.movesRemaining = 50;
    

    this.objectIDs = {
      QUANTUM: 1,
      MANA_TILE: 2,
      LOCKED: 3,
      HORSEMEN: 10,
      FIRE_TOWER: 11,
      MINER: 12,
      CLONER: 13,
      KNIGHT: 14,
      QUEEN: 15,
      KING: 16,
      ENERGY_PYLON: 17,
      FROST_GOLEM: 18,
      QUANTUM_OBELISK: 19,
      ROGUE_DRONE: 20,
      SHADOW_WRAITH: 21
    };
  }
  

  getTile(x, y) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
      return null;
    }
    const index = y * this.gridSize + x;
    return this.board[index];
  }
  

  setTile(x, y, tileData) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
      return false;
    }
    const index = y * this.gridSize + x;
    this.board[index] = tileData;
    return true;
  }
  

  flipTileColor(x, y) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    

    const hasLock = tile.slice(2).includes(this.objectIDs.LOCKED);
    if (hasLock) {

      this.removeTileObject(x, y, this.objectIDs.LOCKED);
      return true;
    }
    
    // Flip color: 0 -> 1, 1 -> 0
    tile[0] = tile[0] === 0 ? 1 : 0;
    this.setTile(x, y, tile);
    return true;
  }
  

flipCross(x, y) {
  const positions = [
    [x, y],           // center
    [x, y - 1],       // top
    [x, y + 1],       // bottom
    [x - 1, y],       // left
    [x + 1, y]        // right
  ];
  
  positions.forEach(([px, py]) => {
    this.flipTileColor(px, py);
  });
  
  this.movesRemaining--;
  
  // Add 5 mana per turn
  this.playerMana = Math.min(this.playerMana + 5, 100);
}
  

  addTileObject(x, y, objectID) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    
    tile[1]++;
    tile.push(objectID); // Add object ID
    this.setTile(x, y, tile);
    return true;
  }
  

  removeTileObject(x, y, objectID) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    
    const objIndex = tile.indexOf(objectID, 2); // Start search after count
    if (objIndex !== -1) {
      tile.splice(objIndex, 1);
      tile[1]--;
      this.setTile(x, y, tile);
      return true;
    }
    return false;
  }

  countTiles() {
    let black = 0, white = 0;
    this.board.forEach(tile => {
      if (tile[0] === 0) black++;
      else white++;
    });
    return { black, white };
  }
  initSplitBoard() {
  const halfPoint = Math.floor(this.gridSize / 2);
  this.playerColor = Math.random() < 0.5 ? 0 : 1;
  const enemyColor = this.playerColor === 0 ? 1 : 0;

  for (let y = 0; y < this.gridSize; y++) {
    for (let x = 0; x < this.gridSize; x++) {
      if (y < halfPoint) {
        this.setTile(x, y, [enemyColor, 0]);
      } else {
        this.setTile(x, y, [this.playerColor, 0]);
      }
    }
  }

  console.log(`You are ${this.playerColor === 0 ? "Black" : "White"}`);
}

}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuantumClash;
}
