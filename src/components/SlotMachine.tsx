import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGame } from '@/contexts/GameContext';
import { playSound, playLoopingSound } from '@/utils/audio';
import SlotSymbol from './SlotSymbol';
import { Coins, Star, MinusCircle, PlusCircle } from 'lucide-react';

interface SlotMachineProps {
  id: string;
  name: string;
  cost: number;
  theme: string;
  symbols: string[];
  payouts: Record<string, number>;
  specialSymbol?: string;
  isBirthdaySlot?: boolean;
}

const SlotMachine: React.FC<SlotMachineProps> = ({
  id,
  name,
  cost: defaultCost,
  theme,
  symbols,
  payouts,
  specialSymbol,
  isBirthdaySlot = false
}) => {
  const [currentBet, setCurrentBet] = useState(defaultCost);
  const [reels, setReels] = useState<string[][]>([
    [symbols[0], symbols[1], symbols[2]],
    [symbols[1], symbols[2], symbols[0]],
    [symbols[2], symbols[0], symbols[1]]
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [winningSymbols, setWinningSymbols] = useState<string[]>([]);
  const [showJackpot, setShowJackpot] = useState(false);
  
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const birthdaySongRef = useRef<HTMLAudioElement | null>(null);
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  
  const { 
    balance, 
    addToBalance, 
    playSlot, 
    soundVolume, 
    soundEnabled,
    freeSpinsAvailable,
    addFreeSpins,
    useFreeSpins
  } = useGame();
  
  const { toast } = useToast();

  useEffect(() => {
    if (isBirthdaySlot) {
      birthdaySongRef.current = new Audio('/sounds/birthday-song.mp3');
      birthdaySongRef.current.loop = true;
      birthdaySongRef.current.volume = soundVolume / 100;
      
      return () => {
        if (birthdaySongRef.current) {
          birthdaySongRef.current.pause();
          birthdaySongRef.current.currentTime = 0;
        }
      };
    }
  }, [isBirthdaySlot]);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current = null;
      }
    };
  }, []);

  const handleBetChange = (amount: number) => {
    const newBet = Math.max(defaultCost, Math.min(100000, currentBet + amount));
    setCurrentBet(newBet);
  };

  const handleCustomBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || defaultCost;
    setCurrentBet(Math.max(defaultCost, Math.min(100000, value)));
  };

  const spin = () => {
    const hasFreeSpins = useFreeSpins(id);
    if (!hasFreeSpins && !playSlot(currentBet)) {
      return;
    }

    setWinAmount(0);
    setWinningSymbols([]);
    setShowJackpot(false);
    setIsSpinning(true);
    
    if (isBirthdaySlot && birthdaySongRef.current && soundEnabled) {
      birthdaySongRef.current.play().catch(console.error);
    } else if (soundEnabled) {
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
      }
      spinSoundRef.current = playLoopingSound('spin-loop');
    }

    const spinDuration = 2000;
    const spinInterval = 100;
    let elapsed = 0;
    
    const spinAnimation = setInterval(() => {
      elapsed += spinInterval;
      
      setReels([
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      ]);
      
      if (elapsed >= spinDuration) {
        clearInterval(spinAnimation);
        if (spinSoundRef.current) {
          spinSoundRef.current.pause();
          spinSoundRef.current = null;
        }
        playSound('stop');
        determineOutcome(hasFreeSpins);
      }
    }, spinInterval);
  };

  const getRandomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const determineOutcome = (wasFree: boolean) => {
    let finalReels: string[][];
    let win = 0;
    let winning: string[] = [];
    
    if (isBirthdaySlot) {
      finalReels = [
        ["7", "7", "7"],
        ["7", "7", "7"],
        ["7", "7", "7"]
      ];
      win = currentBet * 2;
      winning = ["7", "7", "7"];
      setShowJackpot(true);
    } else {
      finalReels = [
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      ];
      
      const midRow = [finalReels[0][1], finalReels[1][1], finalReels[2][1]];
      
      const uniqueSymbols = new Set(midRow);
      if (uniqueSymbols.size === 1) {
        const symbol = midRow[0];
        win = payouts[symbol] * currentBet;
        winning = [symbol, symbol, symbol];
        
        if (symbol === specialSymbol) {
          addFreeSpins(id, 5);
        }
      } 
      else if (uniqueSymbols.size === 2) {
        const counts: Record<string, number> = {};
        midRow.forEach(s => {
          counts[s] = (counts[s] || 0) + 1;
        });
        
        for (const [symbol, count] of Object.entries(counts)) {
          if (count === 2) {
            win = Math.floor(payouts[symbol] * currentBet * 0.5);
            winning = midRow.filter(s => s === symbol);
            break;
          }
        }
      }
      
      if (specialSymbol) {
        let scatterCount = 0;
        finalReels.forEach(reel => {
          reel.forEach(symbol => {
            if (symbol === specialSymbol) scatterCount++;
          });
        });
        
        if (scatterCount >= 3) {
          addFreeSpins(id, scatterCount * 2);
          playSound('scatter');
        }
      }
    }
    
    setReels(finalReels);
    setIsSpinning(false);
    
    spinTimeoutRef.current = setTimeout(() => {
      setWinAmount(win);
      setWinningSymbols(winning);
      
      if (win > 0) {
        if (win >= currentBet * 5) {
          playSound('bigWin');
        } else {
          playSound('win');
        }
        
        if (isBirthdaySlot) {
          playSound('jackpot');
        }
        
        setTimeout(() => {
          addToBalance(win);
        }, 500);
      }
    }, 500);
  };

  const generateOutcome = (wasFree: boolean) => {
    const winProbability = wasFree ? 0.6 : 0.3;
    const balanceAdjustment = balance < 500 ? 0.2 : 0;
    const isWin = Math.random() < (winProbability + balanceAdjustment);
    
    if (isWin) {
      const winningSymbol = symbols[Math.floor(Math.random() * (symbols.length - (specialSymbol ? 1 : 0)))];
      return [
        [getRandomSymbol(), winningSymbol, getRandomSymbol()],
        [getRandomSymbol(), winningSymbol, getRandomSymbol()],
        [getRandomSymbol(), winningSymbol, getRandomSymbol()]
      ];
    } else {
      let result: string[][] = [
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      ];
      
      while (new Set([result[0][1], result[1][1], result[2][1]]).size === 1) {
        result[2][1] = getRandomSymbol();
      }
      
      return result;
    }
  };

  const freeSpinsCount = freeSpinsAvailable[id] || 0;

  return (
    <div className="slot-machine p-4 md:p-6 max-w-xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-casino-gold text-xl md:text-2xl font-bold">{name}</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleBetChange(-100)}
              className="h-8 w-8"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={currentBet}
              onChange={handleCustomBetChange}
              className="w-24 text-center"
              min={defaultCost}
              max={100000}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleBetChange(100)}
              className="h-8 w-8"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          {freeSpinsCount > 0 && (
            <Badge className="bg-green-600">
              <Star className="w-4 h-4 mr-1" />
              {freeSpinsCount} фриспинов
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {reels && reels.map((reel, reelIndex) => (
          <div key={reelIndex} className="slot-reel bg-casino-black/50 rounded-lg">
            {reel && reel.map((symbol, symbolIndex) => (
              <div 
                key={`${reelIndex}-${symbolIndex}`} 
                className="h-full flex items-center justify-center p-1"
              >
                <SlotSymbol 
                  symbol={symbol} 
                  theme={theme} 
                  isWinning={winningSymbols.includes(symbol) && symbolIndex === 1}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {showJackpot && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 animate-jackpot">
          <div className="text-center">
            <h2 className="jackpot-text mb-2">С ДНЕМ РОЖДЕНИЯ КИРЮХА!</h2>
            <p className="text-casino-gold text-lg">ОТЛИЧНОГО ТЕБЕ ДНЯ!</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        {winAmount > 0 ? (
          <div className="flex items-center text-casino-gold font-bold">
            <Coins className="w-5 h-5 mr-2" />
            Выигрыш: {winAmount} ₽
          </div>
        ) : (
          <div className="h-6"></div>
        )}
        
        <Button 
          onClick={spin} 
          disabled={isSpinning || (!freeSpinsCount && balance < currentBet)}
          className="slot-button"
        >
          {freeSpinsCount > 0 ? "Бесплатное вращение" : "Крутить"}
        </Button>
      </div>
    </div>
  );
};

export default SlotMachine;
