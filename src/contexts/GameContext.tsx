import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface GameContextType {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  soundVolume: number;
  setSoundVolume: React.Dispatch<React.SetStateAction<number>>;
  soundEnabled: boolean;
  setSoundEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  addToBalance: (amount: number) => void;
  canPlay: (cost: number) => boolean;
  playSlot: (cost: number) => boolean;
  freeSpinsAvailable: Record<string, number>;
  addFreeSpins: (slotId: string, spins: number) => void;
  useFreeSpins: (slotId: string) => boolean;
  resetBalance: () => void;
  lastFreeCaseTime: number;
  canPlayFreeCase: () => boolean;
  playFreeCase: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number>(1000);
  const [soundVolume, setSoundVolume] = useState<number>(50);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [freeSpinsAvailable, setFreeSpinsAvailable] = useState<Record<string, number>>({});
  const [lastFreeCaseTime, setLastFreeCaseTime] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const savedBalance = localStorage.getItem('slotBalance');
    const savedVolume = localStorage.getItem('soundVolume');
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    const savedFreeSpins = localStorage.getItem('freeSpins');
    const savedLastFreeCaseTime = localStorage.getItem('lastFreeCaseTime');
    
    if (savedBalance) setBalance(Number(savedBalance));
    if (savedVolume) setSoundVolume(Number(savedVolume));
    if (savedSoundEnabled) setSoundEnabled(savedSoundEnabled === 'true');
    if (savedFreeSpins) setFreeSpinsAvailable(JSON.parse(savedFreeSpins));
    if (savedLastFreeCaseTime) setLastFreeCaseTime(Number(savedLastFreeCaseTime));
  }, []);

  useEffect(() => {
    localStorage.setItem('slotBalance', balance.toString());
    localStorage.setItem('soundVolume', soundVolume.toString());
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    localStorage.setItem('freeSpins', JSON.stringify(freeSpinsAvailable));
    localStorage.setItem('lastFreeCaseTime', lastFreeCaseTime.toString());
  }, [balance, soundVolume, soundEnabled, freeSpinsAvailable, lastFreeCaseTime]);

  const addToBalance = (amount: number) => {
    setBalance(prev => {
      const newBalance = prev + amount;
      if (amount > 0) {
        toast({
          title: "Выигрыш!",
          description: `Вы выиграли ${amount} рублей!`,
          duration: 3000,
        });
      }
      return newBalance;
    });
  };

  const canPlay = (cost: number) => {
    return balance >= cost;
  };

  const playSlot = (cost: number) => {
    if (balance < cost) {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс для игры",
        variant: "destructive",
      });
      return false;
    }
    
    setBalance(prev => prev - cost);
    return true;
  };

  const addFreeSpins = (slotId: string, spins: number) => {
    setFreeSpinsAvailable(prev => ({
      ...prev,
      [slotId]: (prev[slotId] || 0) + spins
    }));
    
    toast({
      title: "Бесплатные вращения!",
      description: `Вы получили ${spins} бесплатных вращений!`,
      duration: 3000,
    });
  };

  const useFreeSpins = (slotId: string) => {
    if (!freeSpinsAvailable[slotId] || freeSpinsAvailable[slotId] <= 0) {
      return false;
    }
    
    setFreeSpinsAvailable(prev => ({
      ...prev,
      [slotId]: prev[slotId] - 1
    }));
    
    return true;
  };

  const resetBalance = () => {
    setBalance(1000);
    toast({
      title: "Баланс сброшен",
      description: "Ваш баланс был сброшен до 1000 рублей",
      duration: 3000,
    });
  };

  const canPlayFreeCase = () => {
    const now = Date.now();
    const timePassedSinceLastPlay = now - lastFreeCaseTime;
    const fiveMinutesInMs = 5 * 60 * 1000;
    return timePassedSinceLastPlay >= fiveMinutesInMs;
  };

  const playFreeCase = () => {
    if (!canPlayFreeCase()) {
      const timeLeft = Math.ceil((5 * 60 * 1000 - (Date.now() - lastFreeCaseTime)) / 1000 / 60);
      toast({
        title: "Подождите",
        description: `Вы сможете открыть бесплатный кейс через ${timeLeft} минут`,
        variant: "destructive",
      });
      return;
    }

    const isHighReward = Math.random() < 0.2;
    let reward;
    
    if (isHighReward) {
      reward = Math.floor(Math.random() * (15000 - 6000 + 1)) + 6000;
    } else {
      reward = Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000;
    }

    setLastFreeCaseTime(Date.now());
    addToBalance(reward);
  };

  return (
    <GameContext.Provider
      value={{
        balance,
        setBalance,
        soundVolume,
        setSoundVolume,
        soundEnabled,
        setSoundEnabled,
        addToBalance,
        canPlay,
        playSlot,
        freeSpinsAvailable,
        addFreeSpins,
        useFreeSpins,
        resetBalance,
        lastFreeCaseTime,
        canPlayFreeCase,
        playFreeCase
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
