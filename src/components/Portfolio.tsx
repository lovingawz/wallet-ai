import React, { useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Wallet, TrendingUp, PieChart } from 'lucide-react';
import useWalletStore from '../store/useWalletStore';

const Portfolio = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { totalValue, solBalance, tokens, isLoading, fetchBalances } = useWalletStore();

  useEffect(() => {
    if (publicKey) {
      fetchBalances(publicKey, connection);
      const interval = setInterval(() => {
        fetchBalances(publicKey, connection);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [publicKey, connection]);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Portfolio Overview</h2>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <TrendingUp className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <PieChart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total Value</div>
          <div className="text-2xl font-bold">
            ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="text-green-400 text-sm">Updated just now</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">SOL Balance</div>
          <div className="text-2xl font-bold">{solBalance.toFixed(4)} SOL</div>
          <div className="text-blue-400 text-sm">≈ ${(solBalance * 0).toFixed(2)}</div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Token Assets</div>
          <div className="text-2xl font-bold">{tokens.length}</div>
          <div className="text-blue-400 text-sm">View All</div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;