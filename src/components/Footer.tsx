
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 px-4 bg-casino-black/80 backdrop-blur-lg border-t border-casino-gold/30 mt-auto">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-casino-gold text-sm">
              © 2025 Lucky Slots. Все права защищены.
            </p>
          </div>
          
          <nav className="flex gap-6">
            <Link to="/" className="text-casino-gold/70 hover:text-casino-gold text-sm">
              Главная
            </Link>
            <Link to="/profile" className="text-casino-gold/70 hover:text-casino-gold text-sm">
              Профиль
            </Link>
            <Link to="/settings" className="text-casino-gold/70 hover:text-casino-gold text-sm">
              Настройки
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
