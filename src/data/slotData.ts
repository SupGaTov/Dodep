export interface SlotData {
  id: string;
  name: string;
  description: string;
  cost: number;
  theme: string;
  symbols: string[];
  payouts: Record<string, number>;
  specialSymbol?: string;
  isBirthdaySlot?: boolean;
  bgColor: string;
}

export const SLOTS: SlotData[] = [
  {
    id: 'fruit-slot',
    name: 'Фруктовый Микс',
    description: 'Классический фруктовый слот с сочными выигрышами!',
    cost: 100,
    theme: 'fruits',
    symbols: ['🍒', '🍋', '🍉', '🍓', '🍇', '🍍', '🍌', '⭐'],
    payouts: {
      '🍒': 1,
      '🍋': 2,
      '🍉': 3,
      '🍓': 4,
      '🍇': 5,
      '🍍': 8,
      '🍌': 10,
      '⭐': 15,
    },
    specialSymbol: '⭐',
    bgColor: 'bg-gradient-to-br from-green-600 to-green-800',
  },
  {
    id: 'card-slot',
    name: 'Королевский Покер',
    description: 'Слот с игральными картами для настоящих ценителей!',
    cost: 250,
    theme: 'cards',
    symbols: ['♠️', '♥️', '♦️', '♣️', 'J', 'Q', 'K', 'A'],
    payouts: {
      '♠️': 2,
      '♥️': 2,
      '♦️': 2,
      '♣️': 2,
      'J': 5,
      'Q': 8,
      'K': 10,
      'A': 15,
    },
    specialSymbol: 'A',
    bgColor: 'bg-gradient-to-br from-casino-red to-casino-black',
  },
  {
    id: 'gem-slot',
    name: 'Сокровища и Алмазы',
    description: 'Блестящие драгоценности и невероятные выигрыши!',
    cost: 500,
    theme: 'gems',
    symbols: ['💎', '💰', '💍', '🔶', '🔷', '🟡', '🟣', '💫'],
    payouts: {
      '💎': 5,
      '💰': 8,
      '💍': 10,
      '🔶': 3,
      '🔷': 3,
      '🟡': 2,
      '🟣': 2,
      '💫': 15,
    },
    specialSymbol: '💫',
    bgColor: 'bg-gradient-to-br from-blue-600 to-purple-800',
  },
  {
    id: 'god-slot',
    name: 'Олимп Богов',
    description: 'Слот с богами древней Греции и их невероятными силами!',
    cost: 1000,
    theme: 'gods',
    symbols: ['⚡', '🔱', '👑', '🏺', '🏛️', '🐉', '🦁', '⚔️'],
    payouts: {
      '⚡': 10, // Zeus
      '🔱': 10, // Poseidon
      '👑': 15, // Hera
      '🏺': 5,
      '🏛️': 5,
      '🐉': 7,
      '🦁': 7,
      '⚔️': 20, // Special
    },
    specialSymbol: '⚔️',
    bgColor: 'bg-gradient-to-br from-casino-gold to-amber-800',
  },
  {
    id: 'birthday-slot',
    name: '🎂 ДЕНЬ РОЖДЕНИЯ КИРЮХИ 🎂',
    description: 'Эксклюзивный слот в честь дня рождения! Гарантированный выигрыш!',
    cost: 30000,
    theme: 'birthday',
    symbols: ['7', '8', '9', '1', '2', '3', '4', '5', '6'],
    payouts: {
      '7': 3,
      '8': 3,
      '9': 3,
      '1': 3,
      '2': 3,
      '3': 3,
      '4': 3,
      '5': 3,
      '6': 3,
    },
    isBirthdaySlot: true,
    bgColor: 'bg-gradient-to-br from-pink-500 to-purple-700',
  },
  {
    id: 'fruit-slot-pro',
    name: 'Фруктовый Премиум',
    description: 'Улучшенная версия фруктового слота с повышенными выигрышами!',
    cost: 200,
    theme: 'fruits',
    symbols: ['🍒', '🍋', '🍉', '🍓', '🍇', '🍍', '🍌', '⭐'],
    payouts: {
      '🍒': 2,
      '🍋': 4,
      '🍉': 6,
      '🍓': 8,
      '🍇': 10,
      '🍍': 15,
      '🍌': 20,
      '⭐': 30,
    },
    specialSymbol: '⭐',
    bgColor: 'bg-gradient-to-br from-green-500 to-green-700',
  },
  {
    id: 'card-slot-pro',
    name: 'Покер Джекпот',
    description: 'Королевский покер с увеличенными ставками и выигрышами!',
    cost: 400,
    theme: 'cards',
    symbols: ['♠️', '♥️', '♦️', '♣️', 'J', 'Q', 'K', 'A'],
    payouts: {
      '♠️': 4,
      '♥️': 4,
      '♦️': 4,
      '♣️': 4,
      'J': 8,
      'Q': 12,
      'K': 16,
      'A': 25,
    },
    specialSymbol: 'A',
    bgColor: 'bg-gradient-to-br from-casino-red/90 to-casino-black',
  }
];
