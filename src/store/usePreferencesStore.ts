import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InvestmentPreferences {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentHorizon: 'short' | 'medium' | 'long';
  targetReturn: number;
  rebalanceThreshold: number;
  notifications: {
    priceAlerts: boolean;
    riskWarnings: boolean;
    opportunityAlerts: boolean;
  };
}

interface PreferencesState {
  preferences: InvestmentPreferences;
  isConfigured: boolean;
  updatePreferences: (preferences: Partial<InvestmentPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: InvestmentPreferences = {
  riskTolerance: 'moderate',
  investmentHorizon: 'medium',
  targetReturn: 15,
  rebalanceThreshold: 10,
  notifications: {
    priceAlerts: true,
    riskWarnings: true,
    opportunityAlerts: true,
  },
};

const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      isConfigured: false,
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
          isConfigured: true,
        })),
      resetPreferences: () =>
        set({ preferences: defaultPreferences, isConfigured: false }),
    }),
    {
      name: 'investment-preferences',
    }
  )
);

export default usePreferencesStore;