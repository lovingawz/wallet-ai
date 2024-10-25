import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import useWalletStore from '../store/useWalletStore';

const AssetList = () => {
  const { tokens, isLoading } = useWalletStore();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Your Assets</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-600 h-10 w-10"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Your Assets</h2>
      
      <div className="space-y-4">
        {tokens.map((token) => (
          <div key={token.mint} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {token.logo ? (
                  <img src={token.logo} alt={token.symbol} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                    {token.symbol?.[0] || '?'}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{token.name || 'Unknown Token'}</div>
                  <div className="text-sm text-gray-400">{token.symbol || token.mint.slice(0, 8)}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold">
                  {token.uiAmount.toLocaleString()} {token.symbol}
                </div>
                <div className="text-sm text-gray-400">
                  ${token.value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '0.00'}
                </div>
                {token.change24h && (
                  <div className={`text-sm flex items-center justify-end ${
                    token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {token.change24h >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(token.change24h).toFixed(2)}%
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetList;