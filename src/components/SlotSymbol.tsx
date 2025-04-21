
import React from 'react';
import { cn } from '@/lib/utils';

interface SlotSymbolProps {
  symbol: string;
  theme: string;
  isWinning?: boolean;
}

const SlotSymbol: React.FC<SlotSymbolProps> = ({ symbol, theme, isWinning = false }) => {
  // Different styling based on the theme
  const getSymbolStyle = () => {
    switch (theme) {
      case 'fruits':
        return 'bg-gradient-to-b from-green-500 to-green-700 text-white';
      case 'cards':
        return 'bg-gradient-to-b from-casino-red to-casino-red/80 text-white';
      case 'gems':
        return 'bg-gradient-to-b from-blue-500 to-purple-600 text-white';
      case 'gods':
        return 'bg-gradient-to-b from-casino-gold to-amber-600 text-white';
      case 'birthday':
        return 'bg-gradient-to-b from-pink-500 to-purple-600 text-white';
      default:
        return 'bg-gray-700 text-white';
    }
  };

  return (
    <div 
      className={cn(
        "w-full h-full flex items-center justify-center text-4xl font-bold rounded-md border-2",
        getSymbolStyle(),
        isWinning && "animate-celebrate border-yellow-300 shadow-lg shadow-yellow-300/50"
      )}
    >
      {symbol}
    </div>
  );
};

export default SlotSymbol;
