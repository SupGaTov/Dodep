
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import SlotMachine from '@/components/SlotMachine';
import { SLOTS } from '@/data/slotData';

const SlotPage = () => {
  const { id } = useParams<{ id: string }>();
  const slot = SLOTS.find(s => s.id === id);
  
  // Redirect if invalid slot ID
  useEffect(() => {
    if (!slot) {
      window.location.href = '/';
    }
  }, [slot]);
  
  if (!slot) return null;

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/">
          <Button variant="outline" className="bg-transparent border-casino-gold/30 text-casino-gold hover:bg-casino-gold/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к списку
          </Button>
        </Link>
      </div>
      
      <div className={`glass-panel max-w-6xl mx-auto ${slot.bgColor} bg-opacity-20`}>
        <SlotMachine
          id={slot.id}
          name={slot.name}
          cost={slot.cost}
          theme={slot.theme}
          symbols={slot.symbols || []}
          payouts={slot.payouts}
          specialSymbol={slot.specialSymbol}
          isBirthdaySlot={slot.isBirthdaySlot}
        />
      </div>
      
      {!slot.isBirthdaySlot && (
        <div className="mt-8 glass-panel max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-casino-gold mb-4">Таблица выплат</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(slot.payouts).map(([symbol, payout]) => (
              <div key={symbol} className="bg-casino-black/50 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">{symbol}</div>
                <div className="text-casino-gold font-bold">x{payout}</div>
              </div>
            ))}
          </div>
          
          {slot.specialSymbol && (
            <div className="mt-6 bg-casino-gold/20 rounded-lg p-4">
              <h3 className="text-xl font-bold text-casino-gold mb-2">Специальный символ</h3>
              <p className="text-gray-300">
                Символ {slot.specialSymbol} - это скаттер. Соберите 3 или более таких символа, чтобы получить бесплатные вращения!
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default SlotPage;
