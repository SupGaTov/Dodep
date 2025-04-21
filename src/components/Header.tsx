
import React from 'react';
import { Button } from "@/components/ui/button";
import { useGame } from '@/contexts/GameContext';
import { Coins, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { balance } = useGame();
  
  return (
    <header className="py-4 px-4 bg-casino-black/80 backdrop-blur-lg border-b border-casino-gold/30 sticky top-0 z-30">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-casino-gold font-bold text-2xl md:text-3xl hover:text-casino-gold/80 transition-colors">
          Lucky Slots
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="balance-display flex items-center">
            <Coins className="w-5 h-5 mr-2 text-casino-gold" />
            <span>{balance} ₽</span>
          </div>
          
          <Link to="/profile">
            <Button variant="outline" size="icon" className="bg-transparent border-casino-gold/30 text-casino-gold hover:bg-casino-gold/10">
              <User className="w-5 h-5" />
            </Button>
          </Link>
          
          <Link to="/settings">
            <Button variant="outline" size="icon" className="bg-transparent border-casino-gold/30 text-casino-gold hover:bg-casino-gold/10">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
