import React, { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Brain, Settings } from 'lucide-react';
import PreferencesModal from './PreferencesModal';

const Header = () => {
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  return (
    <>
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-xl font-bold">Solana AI Advisor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreferencesOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 transition-colors" />
            </div>
          </div>
        </div>
      </header>

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </>
  );
};

export default Header;