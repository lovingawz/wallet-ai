import { create } from 'zustand';
import type { TokenBalance } from './useWalletStore';

interface RiskMetrics {
  diversificationScore: number;
  volatilityScore: number;
  concentrationRisk: number;
  overallRisk: number;
}

interface AIRecommendation {
  type: 'BUY' | 'SELL' | 'HOLD' | 'SWAP';
  asset: string;
  confidence: number;
  reasoning: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface AIState {
  riskMetrics: RiskMetrics;
  recommendations: AIRecommendation[];
  isLoading: boolean;
  error: string | null;
  analyzePortfolio: (tokens: TokenBalance[], solBalance: number) => void;
}

const useAIStore = create<AIState>((set) => ({
  riskMetrics: {
    diversificationScore: 0,
    volatilityScore: 0,
    concentrationRisk: 0,
    overallRisk: 0,
  },
  recommendations: [],
  isLoading: false,
  error: null,

  analyzePortfolio: (tokens, solBalance) => {
    set({ isLoading: true });

    try {
      // Calculate risk metrics
      const totalValue = tokens.reduce((acc, token) => acc + (token.value || 0), 0) + solBalance;
      
      // Calculate concentration risk
      const concentrationRisk = calculateConcentrationRisk(tokens, solBalance, totalValue);
      
      // Calculate diversification score
      const diversificationScore = calculateDiversificationScore(tokens.length);
      
      // Calculate volatility score based on 24h changes
      const volatilityScore = calculateVolatilityScore(tokens);

      // Generate recommendations
      const recommendations = generateRecommendations(tokens, solBalance, totalValue);

      set({
        riskMetrics: {
          diversificationScore,
          volatilityScore,
          concentrationRisk,
          overallRisk: (concentrationRisk + (100 - diversificationScore) + volatilityScore) / 3,
        },
        recommendations,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to analyze portfolio', isLoading: false });
    }
  },
}));

function calculateConcentrationRisk(tokens: TokenBalance[], solBalance: number, totalValue: number): number {
  const threshold = 0.3; // 30% concentration warning threshold
  const maxConcentration = Math.max(
    solBalance / totalValue,
    ...tokens.map((token) => (token.value || 0) / totalValue)
  );
  return Math.min(100, (maxConcentration / threshold) * 100);
}

function calculateDiversificationScore(assetCount: number): number {
  const optimalCount = 10;
  return Math.min(100, (assetCount / optimalCount) * 100);
}

function calculateVolatilityScore(tokens: TokenBalance[]): number {
  const changes = tokens
    .map((token) => Math.abs(token.change24h || 0))
    .filter((change) => !isNaN(change));
  
  if (changes.length === 0) return 0;
  
  const avgChange = changes.reduce((acc, val) => acc + val, 0) / changes.length;
  return Math.min(100, (avgChange / 10) * 100); // 10% as baseline for max volatility
}

function generateRecommendations(
  tokens: TokenBalance[],
  solBalance: number,
  totalValue: number
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  // Check for high concentration
  const solConcentration = solBalance / totalValue;
  if (solConcentration > 0.5) {
    recommendations.push({
      type: 'SELL',
      asset: 'SOL',
      confidence: 0.8,
      reasoning: 'High concentration in SOL. Consider diversifying into other assets.',
      priority: 'HIGH',
    });
  }

  // Check for underperforming assets
  tokens.forEach((token) => {
    if (token.change24h && token.change24h < -10) {
      recommendations.push({
        type: 'SELL',
        asset: token.symbol || token.mint,
        confidence: 0.7,
        reasoning: 'Significant price decline in the last 24 hours.',
        priority: 'MEDIUM',
      });
    }
  });

  return recommendations;
}

export default useAIStore;