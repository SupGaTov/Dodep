import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from '@/components/Layout';
import { useGame } from '@/contexts/GameContext';
import { Coins, History, Trophy, RotateCcw, Gift } from 'lucide-react';

const CASE_REWARDS = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];

const ProfilePage = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const { 
    balance, 
    setBalance, 
    resetBalance, 
    playFreeCase, 
    canPlayFreeCase 
  } = useGame();
  
  const animateCaseOpening = () => {
    if (!canPlayFreeCase()) return;
    
    setIsSpinning(true);
    let duration = 3000;
    let startTime = Date.now();
    let frame = 0;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed < duration) {
        frame = (frame + 1) % CASE_REWARDS.length;
        setDisplayedAmount(CASE_REWARDS[frame]);
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        playFreeCase();
      }
    };
    
    requestAnimationFrame(animate);
  };
  
  const addFunds = (amount: number) => {
    setBalance(prev => prev + amount);
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Личный кабинет</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-casino-black/50 border-casino-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-casino-gold flex items-center">
                <Coins className="w-5 h-5 mr-2" />
                Баланс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">{balance} ₽</p>
            </CardContent>
          </Card>
          
          <Card className="bg-casino-black/50 border-casino-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-casino-gold flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Лучший выигрыш
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">10,000 ₽</p>
            </CardContent>
          </Card>
          
          <Card className="bg-casino-black/50 border-casino-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-casino-gold flex items-center">
                <History className="w-5 h-5 mr-2" />
                Всего игр
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-white">24</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="glass-panel mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-casino-gold">Пополнить баланс</h2>
            <Button 
              variant="destructive" 
              onClick={resetBalance}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Сбросить баланс
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {[1000, 5000, 10000, 25000, 50000, 100000].map((amount) => (
              <Button 
                key={amount}
                onClick={() => addFunds(amount)}
                className="slot-button"
              >
                {amount.toLocaleString()} ₽
              </Button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={animateCaseOpening}
              disabled={!canPlayFreeCase() || isSpinning}
              className="slot-button bg-gradient-to-b from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              {isSpinning ? (
                <span className="animate-pulse">{displayedAmount} ₽</span>
              ) : (
                'Открыть бесплатный кейс'
              )}
            </Button>
          </div>
        </div>
        
        <div className="glass-panel">
          <h2 className="text-2xl font-bold text-casino-gold mb-4">История игр</h2>
          <div className="space-y-2">
            <div className="bg-casino-black/50 p-4 rounded-lg flex justify-between">
              <div>
                <span className="text-white font-bold">Фруктовый Микс</span>
                <span className="text-gray-400 ml-2">2 часа назад</span>
              </div>
              <span className="text-green-500 font-bold">+450 ₽</span>
            </div>
            <div className="bg-casino-black/50 p-4 rounded-lg flex justify-between">
              <div>
                <span className="text-white font-bold">Королевский Покер</span>
                <span className="text-gray-400 ml-2">3 часа назад</span>
              </div>
              <span className="text-red-500 font-bold">-250 ₽</span>
            </div>
            <div className="bg-casino-black/50 p-4 rounded-lg flex justify-between">
              <div>
                <span className="text-white font-bold">Сокровища и Алмазы</span>
                <span className="text-gray-400 ml-2">вчера</span>
              </div>
              <span className="text-green-500 font-bold">+1,250 ₽</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
