import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import usePreferencesStore from '../store/usePreferencesStore';
import type { InvestmentPreferences } from '../store/usePreferencesStore';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = usePreferencesStore();
  const [formData, setFormData] = useState<InvestmentPreferences>(preferences);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof InvestmentPreferences],
          [child]: type === 'checkbox' 
            ? (e.target as HTMLInputElement).checked 
            : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold">Investment Preferences</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Risk Tolerance
                </label>
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Horizon
                </label>
                <select
                  name="investmentHorizon"
                  value={formData.investmentHorizon}
                  onChange={handleChange}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                >
                  <option value="short">Short Term (< 1 year)</option>
                  <option value="medium">Medium Term (1-3 years)</option>
                  <option value="long">Long Term (> 3 years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Annual Return (%)
                </label>
                <input
                  type="number"
                  name="targetReturn"
                  value={formData.targetReturn}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rebalance Threshold (%)
                </label>
                <input
                  type="number"
                  name="rebalanceThreshold"
                  value={formData.rebalanceThreshold}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="notifications.priceAlerts"
                      checked={formData.notifications.priceAlerts}
                      onChange={handleChange}
                      className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-sm text-gray-300">Price Alerts</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="notifications.riskWarnings"
                      checked={formData.notifications.riskWarnings}
                      onChange={handleChange}
                      className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-sm text-gray-300">Risk Warnings</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="notifications.opportunityAlerts"
                      checked={formData.notifications.opportunityAlerts}
                      onChange={handleChange}
                      className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500/20"
                    />
                    <span className="text-sm text-gray-300">
                      Investment Opportunities
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;