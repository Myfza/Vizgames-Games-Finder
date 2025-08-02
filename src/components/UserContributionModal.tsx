// User contribution interface component
import React, { useState } from 'react';
import { X, Save, Users, ThumbsUp, ThumbsDown } from 'lucide-react';
import { hybridDataService } from '../services/hybridDataService';
import { GameData, UserContribution } from '../types/dataTypes';

interface UserContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: GameData;
  onContributionSubmitted?: () => void;
}

export function UserContributionModal({ 
  isOpen, 
  onClose, 
  game, 
  onContributionSubmitted 
}: UserContributionModalProps) {
  const [activeTab, setActiveTab] = useState<'contribute' | 'review'>('contribute');
  const [selectedField, setSelectedField] = useState('');
  const [newValue, setNewValue] = useState('');
  const [contributions, setContributions] = useState<UserContribution[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadContributions();
    }
  }, [isOpen, game.appid]);

  const loadContributions = async () => {
    try {
      const gameContributions = await hybridDataService.getUserContributions(game.appid);
      setContributions(gameContributions);
    } catch (error) {
      console.error('Failed to load contributions:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField || !newValue.trim()) return;

    setLoading(true);
    try {
      await hybridDataService.submitUserContribution(game.appid, selectedField, newValue);
      setSelectedField('');
      setNewValue('');
      await loadContributions();
      onContributionSubmitted?.();
    } catch (error) {
      console.error('Failed to submit contribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (contributionId: string, vote: 'up' | 'down') => {
    try {
      // This would call the voting API
      console.log(`Voting ${vote} on contribution ${contributionId}`);
      await loadContributions();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const editableFields = [
    { key: 'short_description', label: 'Short Description', type: 'textarea' },
    { key: 'detailed_description', label: 'Detailed Description', type: 'textarea' },
    { key: 'developers', label: 'Developers', type: 'text' },
    { key: 'publishers', label: 'Publishers', type: 'text' },
    { key: 'genres', label: 'Genres', type: 'text' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Contribute to {game.name}</h2>
            <p className="text-gray-400 text-sm">Help improve game information for everyone</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('contribute')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'contribute'
                ? 'text-red-400 border-b-2 border-red-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Contribute
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'review'
                ? 'text-red-400 border-b-2 border-red-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Review Contributions ({contributions.filter(c => c.status === 'pending').length})
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'contribute' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What would you like to edit?
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                  required
                >
                  <option value="">Select a field...</option>
                  {editableFields.map(field => (
                    <option key={field.key} value={field.key}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Value Display */}
              {selectedField && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Value:
                  </label>
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-300">
                    {selectedField === 'developers' ? game.developers?.join(', ') :
                     selectedField === 'publishers' ? game.publishers?.join(', ') :
                     selectedField === 'genres' ? game.genres?.map(g => g.description).join(', ') :
                     (game as any)[selectedField] || 'Not set'}
                  </div>
                </div>
              )}

              {/* New Value Input */}
              {selectedField && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Value:
                  </label>
                  {editableFields.find(f => f.key === selectedField)?.type === 'textarea' ? (
                    <textarea
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none h-32 resize-none"
                      placeholder="Enter the corrected information..."
                      required
                    />
                  ) : (
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                      placeholder="Enter the corrected information..."
                      required
                    />
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Your contribution will be reviewed by the community before being applied.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedField || !newValue.trim()}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Submit Contribution
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {contributions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No contributions yet for this game.
                </p>
              ) : (
                contributions.map(contribution => (
                  <div
                    key={contribution.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white">
                          {editableFields.find(f => f.key === contribution.field)?.label}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {new Date(contribution.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        contribution.status === 'approved' ? 'bg-green-900 text-green-300' :
                        contribution.status === 'rejected' ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {contribution.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">From: </span>
                        <span className="text-gray-300">{contribution.oldValue || 'Not set'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">To: </span>
                        <span className="text-white">{contribution.newValue}</span>
                      </div>
                    </div>

                    {contribution.status === 'pending' && (
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleVote(contribution.id, 'up')}
                          className="flex items-center gap-1 px-2 py-1 bg-green-900/50 text-green-300 rounded hover:bg-green-900 transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {contribution.votes.up}
                        </button>
                        <button
                          onClick={() => handleVote(contribution.id, 'down')}
                          className="flex items-center gap-1 px-2 py-1 bg-red-900/50 text-red-300 rounded hover:bg-red-900 transition-colors"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          {contribution.votes.down}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}