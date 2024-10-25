import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet, BarChart3, PieChart, ArrowUpDown } from 'lucide-react';
import WalletContextProvider from './contexts/WalletContextProvider';
import Portfolio from './components/Portfolio';
import AssetList from './components/AssetList';
import AIAdvice from './components/AIAdvice';
import Header from './components/Header';

function AppContent() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {!connected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center space-y-4">
              <Wallet className="w-16 h-16 mx-auto text-blue-400" />
              <h2 className="text-3xl font-bold">Connect Your Wallet</h2>
              <p className="text-gray-400 max-w-md">
                Connect your Solana wallet to get personalized AI-powered investment advice
              </p>
            </div>
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 transition-colors" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <Portfolio />
              <AssetList />
            </div>
            <div className="lg:col-span-4">
              <AIAdvice />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <BarChart3 className="text-blue-400" />
              <PieChart className="text-green-400" />
              <ArrowUpDown className="text-purple-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Powered by Solana & OpenAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WalletContextProvider>
      <AppContent />
    </WalletContextProvider>
  );
}

export default App;