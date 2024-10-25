import React from 'react';
import { Shield, PieChart, TrendingUp, AlertTriangle } from 'lucide-react';
import useAIStore from '../store/useAIStore';

const RiskMetrics = () => {
  const { riskMetrics, isLoading } = useAIStore();

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-400';
    if (score < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const metrics = [
    {
      icon: Shield,
      label: 'Overall Risk',
      value: riskMetrics.overallRisk,
      color: getRiskColor(riskMetrics.overallRisk),
    },
    {
      icon: PieChart,
      label: 'Diversification',
      value: riskMetrics.diversificationScore,
      color: getRiskColor(100 - riskMetrics.diversificationScore),
    },
    {
      icon: TrendingUp,
      label: 'Volatility',
      value: riskMetrics.volatilityScore,
      color: getRiskColor(riskMetrics.volatilityScore),
    },
    {
      icon: AlertTriangle,
      label: 'Concentration',
      value: riskMetrics.concentrationRisk,
      color: getRiskColor(riskMetrics.concentrationRisk),
    },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-sm text-gray-400">{label}</span>
            </div>
            <div className={`text-xl font-bold ${color}`}>
              {value.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskMetrics;