
/**
 * Slot machine data
 */
const SLOTS = [
  {
    id: 'fruits',
    name: 'Фруктовый Микс',
    description: 'Классический слот с фруктовыми символами',
    cost: 100,
    theme: 'fruits',
    symbols: ['🍋', '🍊', '🍒', '🍇', '🍎', '🍉', '🍓', '🍑'],
    payouts: {
      '🍋': 2,
      '🍊': 3,
      '🍒': 3,
      '🍇': 4,
      '🍎': 5,
      '🍉': 6,
      '🍓': 8,
      '🍑': 10
    },
    specialSymbol: '🍑',
    bgColor: 'bg-green-900'
  },
  {
    id: 'cards',
    name: 'Королевский Покер',
    description: 'Слот с карточными символами для любителей покера',
    cost: 200,
    theme: 'cards',
    symbols: ['♠', '♥', '♦', '♣', 'J', 'Q', 'K', 'A'],
    payouts: {
      '♠': 2,
      '♥': 2,
      '♦': 2,
      '♣': 2,
      'J': 5,
      'Q': 8,
      'K': 10,
      'A': 15
    },
    specialSymbol: 'A',
    bgColor: 'bg-red-900'
  },
  {
    id: 'gems',
    name: 'Сокровища и Алмазы',
    description: 'Драгоценные камни и сокровища ждут вас',
    cost: 300,
    theme: 'gems',
    symbols: ['💎', '🔷', '🔶', '💰', '🏆', '👑', '💍', '🔮'],
    payouts: {
      '💎': 3,
      '🔷': 4,
      '🔶': 4,
      '💰': 5,
      '🏆': 8,
      '👑': 10,
      '💍': 12,
      '🔮': 15
    },
    specialSymbol: '💎',
    bgColor: 'bg-blue-900'
  },
  {
    id: 'gods',
    name: 'Мифы Олимпа',
    description: 'Слот, вдохновленный древнегреческими богами',
    cost: 500,
    theme: 'gods',
    symbols: ['⚡', '🔱', '🌊', '🏛️', '🦅', '🐂', '🦁', '🏺'],
    payouts: {
      '⚡': 4,
      '🔱': 5,
      '🌊': 6,
      '🏛️': 7,
      '🦅': 8,
      '🐂': 10,
      '🦁': 12,
      '🏺': 15
    },
    specialSymbol: '⚡',
    bgColor: 'bg-yellow-900'
  },
  {
    id: 'birthday',
    name: 'для s1ayka',
    description: 'Специальный праздничный слот с гарантированным выигрышем',
    cost: 300000,
    theme: 'birthday',
    symbols: ['🎂', '🎁', '🎈', '🎉', '🎊', '🥂', '🎵', '7'],
    payouts: {
      '🎂': 5,
      '🎁': 5,
      '🎈': 5,
      '🎉': 5,
      '🎊': 5,
      '🥂': 5,
      '🎵': 5,
      '7': 7
    },
    isBirthdaySlot: true,
    bgColor: 'bg-pink-900'
  }
];
