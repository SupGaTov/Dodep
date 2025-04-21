
/**
 * UI utilities and components
 */
const ui = {
  // Create a toast notification
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, duration);
  },
  
  // Format timestamp to relative time
  formatRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? 'вчера' : `${days} дней назад`;
    } else if (hours > 0) {
      return `${hours} часов назад`;
    } else if (minutes > 0) {
      return `${minutes} минут назад`;
    } else {
      return 'только что';
    }
  },
  
  // Format number with separator
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  },
  
  // Format time in minutes and seconds
  formatTime(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
  
  // Create a slot card
  createSlotCard(slot) {
    const card = document.createElement('div');
    card.className = `slot-card ${slot.bgColor || ''}`;
    card.innerHTML = `
      <h3>${slot.name}</h3>
      <p>${slot.description}</p>
      <div class="slot-cost">Ставка: ${this.formatNumber(slot.cost)} ₽</div>
      <button class="action-button" onclick="location.href='slot.html?id=${slot.id}'">Играть</button>
    `;
    return card;
  },
  
  // Create a symbol element
  createSymbol(symbol, theme, isWinning = false) {
    const div = document.createElement('div');
    div.className = `symbol ${theme}${isWinning ? ' winning' : ''}`;
    div.textContent = symbol;
    return div;
  },
  
  // Create a playing card
  createPlayingCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'playing-card';
    
    if (card.hidden) {
      cardElement.innerHTML = `<div class="card-back">♠♥♣♦</div>`;
    } else {
      const suitSymbol = this.getSuitSymbol(card.suit);
      const colorClass = card.suit === 'hearts' || card.suit === 'diamonds' ? 'red-suit' : 'black-suit';
      
      cardElement.innerHTML = `
        <div class="card-rank-top ${colorClass}">${card.rank}</div>
        <div class="card-suit ${colorClass}">${suitSymbol}</div>
        <div class="card-rank-bottom ${colorClass}">${card.rank}</div>
      `;
    }
    
    return cardElement;
  },
  
  // Get suit symbol
  getSuitSymbol(suit) {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  },
  
  // Update balance display
  updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
      balanceElement.textContent = this.formatNumber(gameStorage.getBalance());
    }
  }
};
