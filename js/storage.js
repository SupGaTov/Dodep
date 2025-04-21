/**
 * Game state storage and management
 */
const gameStorage = {
  // Default values
  defaultState: {
    balance: 1000,
    soundEnabled: true,
    soundVolume: 50,
    freeSpinsAvailable: {},
    gameHistory: [],
    lastFreeCaseTime: 0
  },
  
  // Get current state from localStorage or default
  getState() {
    try {
      const savedState = localStorage.getItem('luckySlots');
      return savedState ? JSON.parse(savedState) : this.defaultState;
    } catch (error) {
      console.error('Error loading game state:', error);
      return this.defaultState;
    }
  },
  
  // Save state to localStorage
  saveState(state) {
    try {
      localStorage.setItem('luckySlots', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  },
  
  // Get balance
  getBalance() {
    return this.getState().balance;
  },
  
  // Set balance
  setBalance(amount) {
    const state = this.getState();
    state.balance = amount;
    this.saveState(state);
    
    // Update UI if needed
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
      balanceElement.textContent = amount;
    }
    
    return amount;
  },
  
  // Add to balance
  addToBalance(amount) {
    const currentBalance = this.getBalance();
    return this.setBalance(currentBalance + amount);
  },
  
  // Get sound settings
  getSoundSettings() {
    const state = this.getState();
    return {
      enabled: state.soundEnabled,
      volume: state.soundVolume
    };
  },
  
  // Set sound enabled
  setSoundEnabled(enabled) {
    const state = this.getState();
    state.soundEnabled = enabled;
    this.saveState(state);
    return enabled;
  },
  
  // Set sound volume
  setSoundVolume(volume) {
    const state = this.getState();
    state.soundVolume = volume;
    this.saveState(state);
    return volume;
  },
  
  // Get free spins available
  getFreeSpins(slotId) {
    const state = this.getState();
    return state.freeSpinsAvailable[slotId] || 0;
  },
  
  // Add free spins
  addFreeSpins(slotId, count) {
    const state = this.getState();
    state.freeSpinsAvailable[slotId] = (state.freeSpinsAvailable[slotId] || 0) + count;
    this.saveState(state);
    return state.freeSpinsAvailable[slotId];
  },
  
  // Use a free spin
  useFreeSpins(slotId) {
    const state = this.getState();
    const freeSpins = state.freeSpinsAvailable[slotId] || 0;
    
    if (freeSpins > 0) {
      state.freeSpinsAvailable[slotId] = freeSpins - 1;
      this.saveState(state);
      return true;
    }
    
    return false;
  },
  
  // Add game to history
  addToHistory(game, amount) {
    const state = this.getState();
    const historyItem = {
      game,
      amount,
      timestamp: Date.now()
    };
    
    state.gameHistory.unshift(historyItem);
    // Keep only last 20 items
    if (state.gameHistory.length > 20) {
      state.gameHistory = state.gameHistory.slice(0, 20);
    }
    
    this.saveState(state);
    return historyItem;
  },
  
  // Get game history
  getHistory() {
    return this.getState().gameHistory;
  },
  
  // Check if can open free case
  canOpenFreeCase() {
    const state = this.getState();
    const now = Date.now();
    const timeSinceLastCase = now - (state.lastFreeCaseTime || 0);
    
    // 5 minutes cooldown (300000 ms)
    return timeSinceLastCase >= 300000;
  },
  
  // Record free case opening
  recordFreeCaseOpening() {
    const state = this.getState();
    state.lastFreeCaseTime = Date.now();
    this.saveState(state);
  },
  
  // Get time until next free case
  getTimeUntilNextFreeCase() {
    const state = this.getState();
    const now = Date.now();
    const timeSinceLastCase = now - (state.lastFreeCaseTime || 0);
    
    if (timeSinceLastCase >= 300000) {
      return 0;
    }
    
    return 300000 - timeSinceLastCase;
  },
  
  // Reset game state
  resetGame() {
    this.saveState(this.defaultState);
    
    // Update UI if needed
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
      balanceElement.textContent = this.defaultState.balance;
    }
    
    return this.defaultState;
  }
};
