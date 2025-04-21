
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useGame } from '@/contexts/GameContext';
import PlayingCard from './PlayingCard';
import { playSound } from '@/utils/audio';

// Define the types Suit and Rank
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

// Ensure the Card type has a 'hidden' property
type Card = {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
};

// Modify any function that creates or uses cards to ensure 'hidden' is always set
const createCard = (suit: Suit, rank: Rank, hidden: boolean = false): Card => ({
  suit,
  rank,
  hidden
});

const BlackJack = () => {
  const { balance, addToBalance, playSlot } = useGame();
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [bet, setBet] = useState(100);
  const [result, setResult] = useState<'win' | 'lose' | 'push' | 'blackjack' | ''>('');
  const [canSplit, setCanSplit] = useState(false);
  const [splitHand, setSplitHand] = useState<Card[]>([]);
  const [currentHand, setCurrentHand] = useState<'main' | 'split'>('main');
  const [splitResult, setSplitResult] = useState<'win' | 'lose' | 'push' | 'blackjack' | ''>('');

  // Initialize deck
  useEffect(() => {
    initializeDeck();
  }, []);

  // Check if player can split after cards are dealt
  useEffect(() => {
    if (playerHand.length === 2 && gameState === 'playing') {
      const card1Value = getCardValue(playerHand[0]);
      const card2Value = getCardValue(playerHand[1]);
      setCanSplit(card1Value === card2Value && splitHand.length === 0);
    } else {
      setCanSplit(false);
    }
  }, [playerHand, gameState, splitHand]);

  const initializeDeck = () => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    const newDeck: Card[] = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        newDeck.push(createCard(suit, rank));
      }
    }
    
    setDeck(shuffleDeck([...newDeck]));
  };

  const shuffleDeck = (deckToShuffle: Card[]) => {
    const shuffled = [...deckToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    if (bet > balance) {
      return;
    }
    
    if (!playSlot(bet)) return;
    
    playSound('card-deal');
    
    // Reset hands and state
    setPlayerHand([]);
    setDealerHand([]);
    setSplitHand([]);
    setCurrentHand('main');
    setResult('');
    setSplitResult('');
    
    // Deal initial cards
    const currentDeck = [...deck];
    const newPlayerHand = [currentDeck.pop()!, currentDeck.pop()!];
    
    // Dealer's second card is face down
    const dealerCard1 = currentDeck.pop()!;
    const dealerCard2 = currentDeck.pop()!;
    dealerCard2.hidden = true;
    const newDealerHand = [dealerCard1, dealerCard2];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setDeck(currentDeck);
    setGameState('playing');
    
    // Check for blackjack
    if (calculateHandValue(newPlayerHand) === 21) {
      setTimeout(() => {
        handleDealerTurn(newPlayerHand, newDealerHand, currentDeck);
      }, 500);
    }
  };

  const hit = () => {
    playSound('card-deal');
    
    const currentDeck = [...deck];
    const newCard = currentDeck.pop()!;
    
    if (currentHand === 'main') {
      const newHand = [...playerHand, newCard];
      setPlayerHand(newHand);
      
      // Check if player busts
      if (calculateHandValue(newHand) > 21) {
        if (splitHand.length > 0 && currentHand === 'main') {
          // Switch to split hand if available
          setCurrentHand('split');
        } else {
          // End game if player busts and no split hand
          handleDealerTurn(newHand, dealerHand, currentDeck);
        }
      }
    } else {
      // Hit on split hand
      const newSplitHand = [...splitHand, newCard];
      setSplitHand(newSplitHand);
      
      // Check if split hand busts
      if (calculateHandValue(newSplitHand) > 21) {
        handleDealerTurn(playerHand, dealerHand, currentDeck, newSplitHand);
      }
    }
    
    setDeck(currentDeck);
  };

  const stand = () => {
    if (splitHand.length > 0 && currentHand === 'main') {
      // Switch to split hand if available
      setCurrentHand('split');
    } else {
      // Stand on both hands or just main hand
      handleDealerTurn(playerHand, dealerHand, deck, splitHand);
    }
  };

  const doubleDown = () => {
    if (balance < bet * 2) return;
    
    playSlot(bet); // Deduct additional bet
    
    const currentDeck = [...deck];
    const newCard = currentDeck.pop()!;
    
    if (currentHand === 'main') {
      const newHand = [...playerHand, newCard];
      setPlayerHand(newHand);
      setBet(bet * 2);
      
      if (splitHand.length > 0) {
        setCurrentHand('split');
      } else {
        handleDealerTurn(newHand, dealerHand, currentDeck);
      }
    } else {
      // Double down on split hand
      const newSplitHand = [...splitHand, newCard];
      setSplitHand(newSplitHand);
      setBet(bet * 2);
      
      handleDealerTurn(playerHand, dealerHand, currentDeck, newSplitHand);
    }
    
    setDeck(currentDeck);
  };

  const splitCards = () => {
    if (balance < bet * 2 || !canSplit) return;
    
    playSlot(bet); // Deduct additional bet for split hand
    
    const currentDeck = [...deck];
    
    // Split the cards
    const card1 = playerHand[0];
    const card2 = playerHand[1];
    
    // Draw one additional card for each hand
    const newCard1 = currentDeck.pop()!;
    const newCard2 = currentDeck.pop()!;
    
    setPlayerHand([card1, newCard1]);
    setSplitHand([card2, newCard2]);
    setDeck(currentDeck);
    setCurrentHand('main');
  };

  const handleDealerTurn = (
    pHand: Card[], 
    dHand: Card[], 
    currentDeck: Card[],
    sHand: Card[] = []
  ) => {
    setGameState('dealerTurn');
    
    // Reveal dealer's hidden card
    const updatedDealerHand = [...dHand];
    if (updatedDealerHand[1].hidden) {
      updatedDealerHand[1].hidden = false;
    }
    
    // Determine if dealer needs to draw more cards
    let dealerValue = calculateHandValue(updatedDealerHand);
    let updatedDeck = [...currentDeck];
    
    // Dealer draws until reaching 17 or higher
    const dealerDrawCards = () => {
      while (dealerValue < 17) {
        const newCard = updatedDeck.pop()!;
        updatedDealerHand.push(newCard);
        dealerValue = calculateHandValue(updatedDealerHand);
      }
    };
    
    // Check player's main hand
    const playerValue = calculateHandValue(pHand);
    const isPlayerBust = playerValue > 21;
    
    // Check player's split hand if it exists
    const splitValue = sHand.length > 0 ? calculateHandValue(sHand) : 0;
    const isSplitBust = splitValue > 21;
    
    // Dealer only draws if player hasn't busted or if there's a split hand that hasn't busted
    if (!isPlayerBust || (sHand.length > 0 && !isSplitBust)) {
      dealerDrawCards();
    }
    
    setDealerHand(updatedDealerHand);
    setDeck(updatedDeck);
    
    // Determine game outcome
    determineOutcome(pHand, updatedDealerHand, sHand);
  };

  const determineOutcome = (
    pHand: Card[], 
    dHand: Card[],
    sHand: Card[] = []
  ) => {
    const playerValue = calculateHandValue(pHand);
    const dealerValue = calculateHandValue(dHand);
    
    // Determine main hand result
    let mainResult: 'win' | 'lose' | 'push' | 'blackjack' | '' = '';
    let splitResult: 'win' | 'lose' | 'push' | 'blackjack' | '' = '';
    
    // Calculate main hand result
    if (playerValue > 21) {
      mainResult = 'lose';
    } else if (dealerValue > 21) {
      mainResult = 'win';
    } else if (playerValue > dealerValue) {
      mainResult = playerValue === 21 && pHand.length === 2 ? 'blackjack' : 'win';
    } else if (playerValue < dealerValue) {
      mainResult = 'lose';
    } else {
      mainResult = 'push';
    }
    
    // Calculate split hand result if it exists
    if (sHand.length > 0) {
      const splitValue = calculateHandValue(sHand);
      
      if (splitValue > 21) {
        splitResult = 'lose';
      } else if (dealerValue > 21) {
        splitResult = 'win';
      } else if (splitValue > dealerValue) {
        splitResult = splitValue === 21 && sHand.length === 2 ? 'blackjack' : 'win';
      } else if (splitValue < dealerValue) {
        splitResult = 'lose';
      } else {
        splitResult = 'push';
      }
    }
    
    setResult(mainResult);
    setSplitResult(splitResult);
    setGameState('gameOver');
    
    // Payout winnings
    let winnings = 0;
    
    // Main hand payout
    if (mainResult === 'win') {
      winnings += bet * 2;
    } else if (mainResult === 'blackjack') {
      winnings += bet * 2.5;
    } else if (mainResult === 'push') {
      winnings += bet;
    }
    
    // Split hand payout
    if (splitResult === 'win') {
      winnings += bet * 2;
    } else if (splitResult === 'blackjack') {
      winnings += bet * 2.5;
    } else if (splitResult === 'push') {
      winnings += bet;
    }
    
    if (winnings > 0) {
      setTimeout(() => {
        addToBalance(winnings);
        if (winnings > bet * 2) {
          playSound('big-win');
        } else if (winnings > 0) {
          playSound('win');
        }
      }, 1000);
    }
  };

  const calculateHandValue = (hand: Card[]): number => {
    let value = 0;
    let aces = 0;
    
    for (const card of hand) {
      if (card.hidden) continue;
      
      const cardValue = getCardValue(card);
      
      if (cardValue === 11) {
        aces++;
        value += 11;
      } else {
        value += cardValue;
      }
    }
    
    // Adjust aces to avoid busting
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const getCardValue = (card: Card): number => {
    if (card.hidden) return 0;
    
    if (card.rank === 'A') return 11;
    if (card.rank === 'K' || card.rank === 'Q' || card.rank === 'J') return 10;
    return parseInt(card.rank);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(100, Math.min(balance, bet + amount));
    setBet(newBet);
  };

  const resetGame = () => {
    setGameState('betting');
    initializeDeck();
  };

  const renderOutcomeMessage = () => {
    if (result === 'blackjack') {
      return <div className="text-casino-gold text-xl font-bold">Блэкджек! Вы выиграли!</div>;
    } else if (result === 'win') {
      return <div className="text-casino-gold text-xl font-bold">Вы выиграли!</div>;
    } else if (result === 'lose') {
      return <div className="text-red-500 text-xl font-bold">Вы проиграли.</div>;
    } else if (result === 'push') {
      return <div className="text-white text-xl font-bold">Ничья.</div>;
    }
    return null;
  };

  const renderSplitOutcomeMessage = () => {
    if (splitResult && splitHand.length > 0) {
      if (splitResult === 'blackjack') {
        return <div className="text-casino-gold text-xl font-bold">Блэкджек на второй руке!</div>;
      } else if (splitResult === 'win') {
        return <div className="text-casino-gold text-xl font-bold">Вторая рука выиграла!</div>;
      } else if (splitResult === 'lose') {
        return <div className="text-red-500 text-xl font-bold">Вторая рука проиграла.</div>;
      } else if (splitResult === 'push') {
        return <div className="text-white text-xl font-bold">Ничья на второй руке.</div>;
      }
    }
    return null;
  };

  return (
    <div className="blackjack-table relative p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-white text-lg">
          Ставка: <span className="text-casino-gold">{bet} ₽</span>
        </div>
        <div className="text-white text-lg">
          Баланс: <span className="text-casino-gold">{balance} ₽</span>
        </div>
      </div>
      
      {gameState === 'betting' && (
        <div className="betting-ui flex flex-col items-center">
          <div className="text-white text-xl mb-4">Выберите ставку:</div>
          <div className="flex gap-3 mb-6">
            <Button onClick={() => adjustBet(-100)} variant="outline" disabled={bet <= 100}>-100</Button>
            <div className="bg-black/40 p-3 rounded-md text-casino-gold text-xl">{bet} ₽</div>
            <Button onClick={() => adjustBet(100)} variant="outline" disabled={bet + 100 > balance}>+100</Button>
          </div>
          <Button 
            onClick={startGame} 
            disabled={bet > balance}
            className="w-full max-w-xs"
          >
            Начать игру
          </Button>
        </div>
      )}
      
      {gameState !== 'betting' && (
        <>
          <div className="dealer-area mb-8">
            <div className="text-white text-lg mb-2">Дилер {gameState === 'gameOver' && `(${calculateHandValue(dealerHand)})`}</div>
            <div className="flex gap-2 flex-wrap">
              {dealerHand.map((card, index) => (
                <PlayingCard key={`dealer-${index}`} card={card} />
              ))}
            </div>
          </div>
          
          <div className="player-area mb-8">
            <div className="text-white text-lg mb-2">
              {splitHand.length > 0 ? 'Первая рука' : 'Ваша рука'} 
              {` (${calculateHandValue(playerHand)})`}
              {currentHand === 'main' && gameState === 'playing' && ' ← Активна'}
            </div>
            <div className="flex gap-2 flex-wrap">
              {playerHand.map((card, index) => (
                <PlayingCard key={`player-${index}`} card={card} />
              ))}
            </div>
          </div>
          
          {splitHand.length > 0 && (
            <div className="split-area mb-8">
              <div className="text-white text-lg mb-2">
                Вторая рука {`(${calculateHandValue(splitHand)})`}
                {currentHand === 'split' && gameState === 'playing' && ' ← Активна'}
              </div>
              <div className="flex gap-2 flex-wrap">
                {splitHand.map((card, index) => (
                  <PlayingCard key={`split-${index}`} card={card} />
                ))}
              </div>
            </div>
          )}
          
          {gameState === 'playing' && (
            <div className="actions flex flex-wrap gap-3 justify-center">
              <Button onClick={hit}>Ещё</Button>
              <Button onClick={stand}>Хватит</Button>
              
              {/* Double down only available on first two cards */}
              {((currentHand === 'main' && playerHand.length === 2) || 
                (currentHand === 'split' && splitHand.length === 2)) && 
                balance >= bet && (
                <Button onClick={doubleDown}>Удвоить</Button>
              )}
              
              {/* Split only available on first two cards with same value */}
              {canSplit && balance >= bet && (
                <Button onClick={splitCards}>Разделить</Button>
              )}
            </div>
          )}
          
          {gameState === 'gameOver' && (
            <div className="results text-center mb-6">
              {renderOutcomeMessage()}
              {renderSplitOutcomeMessage()}
              <Button onClick={resetGame} className="mt-4">Новая игра</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlackJack;
