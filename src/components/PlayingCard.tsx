
import React from 'react';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface Card {
  suit: Suit;
  rank: Rank;
  hidden?: boolean;
}

interface PlayingCardProps {
  card: Card;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card }) => {
  const getSuitSymbol = (suit: Suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
    }
  };
  
  const getSuitColor = (suit: Suit) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';
  };
  
  const getRankDisplay = (rank: Rank) => {
    return rank;
  };
  
  if (card.hidden) {
    return (
      <div className="playing-card bg-casino-gold/90 rounded-lg w-20 h-28 shadow-md flex items-center justify-center border-2 border-white">
        <div className="card-back w-16 h-24 bg-gradient-to-br from-casino-red to-casino-black rounded-md flex items-center justify-center">
          <div className="text-white text-2xl">♠♥♣♦</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="playing-card bg-white rounded-lg w-20 h-28 shadow-md flex flex-col p-2 relative">
      <div className={`card-rank-top text-lg font-bold ${getSuitColor(card.suit)} absolute top-1 left-2`}>
        {getRankDisplay(card.rank)}
      </div>
      
      <div className={`card-suit flex-grow flex items-center justify-center text-3xl ${getSuitColor(card.suit)}`}>
        {getSuitSymbol(card.suit)}
      </div>
      
      <div className={`card-rank-bottom text-lg font-bold ${getSuitColor(card.suit)} absolute bottom-1 right-2 rotate-180`}>
        {getRankDisplay(card.rank)}
      </div>
    </div>
  );
};

export default PlayingCard;
