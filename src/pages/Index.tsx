
import React from 'react';
import { Coins, Dice1Icon, Gift } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SLOTS } from '@/data/slotData';

const Index = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-casino-gold text-center mb-8">DodepOnline</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Slots Section */}
          <div className="glass-panel p-6 rounded-xl col-span-full">
            <h2 className="text-xl font-semibold text-casino-gold mb-4 flex items-center">
              <Coins className="mr-2 h-5 w-5" />
              Игровые автоматы
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SLOTS.map((slot) => (
                <div key={slot.id} className={`glass-panel p-4 rounded-lg ${slot.bgColor}`}>
                  <h3 className="text-lg font-semibold text-casino-gold mb-2">{slot.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{slot.description}</p>
                  <div className="text-casino-gold mb-3">Ставка: {slot.cost} ₽</div>
                  <Button 
                    onClick={() => navigate(`/slot/${slot.id}`)} 
                    variant="secondary" 
                    className="w-full"
                  >
                    Играть
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Blackjack Card */}
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-casino-gold mb-4 flex items-center">
              <Dice1Icon className="mr-2 h-5 w-5" />
              Блэкджек
            </h2>
            <p className="text-gray-300 mb-4">Классическая карточная игра, в которой нужно набрать 21 очко!</p>
            <Button onClick={() => navigate('/blackjack')} variant="secondary" className="w-full">
              Играть
            </Button>
          </div>
          
          {/* Free Case Card */}
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-casino-gold mb-4 flex items-center">
              <Gift className="mr-2 h-5 w-5" />
              Бесплатный кейс
            </h2>
            <p className="text-gray-300 mb-4">Открывайте бесплатный кейс каждые 5 минут и получайте подарки!</p>
            <Button onClick={() => navigate('/profile')} variant="secondary" className="w-full">
              Открыть
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
