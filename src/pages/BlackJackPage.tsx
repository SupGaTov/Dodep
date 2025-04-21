
import React from 'react';
import Layout from '@/components/Layout';
import BlackJack from '@/components/BlackJack';

const BlackJackPage = () => {
  return (
    <Layout>
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-bold text-casino-gold text-center mb-8">Блэкджек</h1>
        <div className="glass-panel max-w-6xl mx-auto bg-gradient-to-br from-green-900 to-green-950">
          <BlackJack />
        </div>
      </div>
    </Layout>
  );
};

export default BlackJackPage;
