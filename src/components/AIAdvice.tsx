import React, { useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import useWalletStore from '../store/useWalletStore';
import useAIStore from '../store/useAIStore';
import RiskMetrics from './RiskMetrics';

const AIAdvice = () => {
  const { tokens, solBalance } = useWalletStore();
  const { recommendations, analyzePortfolio } = useAIStore();

  useEffect(() => {
    if (tokens.length > 0 || solBalance > 0) {
      analyzePortfolio(tokens, solBalance);
    }
  }, [tokens, solBalance, analyzePortfolio]);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'BUY':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'SELL':
        return <TrendingUp className="w-5 h-5 text-red-400" />;
      case 'SWAP':
        return <ArrowRightLeft className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold">AI Recommendations</h2>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`bg-gray-700/50 border border-gray-600 rounded-lg p-4 ${
                rec.priority === 'HIGH'
                  ? 'border-l-4 border-l-red-500'
                  : rec.priority === 'MEDIUM'
                  ? 'border-l-4 border-l-yellow-500'
                  : ''
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {getRecommendationIcon(rec.type)}
                <span className="font-semibold">
                  {rec.type} {rec.asset}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{rec.reasoning}</p>
              <div className="mt-2 text-xs text-gray-400">
                Confidence: {(rec.confidence * 100).toFixed(0)}%
              </div>
            </div>
          ))}

          {recommendations.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              No recommendations at this time. Your portfolio looks healthy!
            </div>
          )}
        </div>
      </div>

      <RiskMetrics />
    </div>
  );
};

export default AIAdvice;