// User-generated content management service
import { GameData, UserContribution } from '../types/dataTypes';

export class UserContentService {
  private contributions = new Map<string, UserContribution[]>();
  private moderationQueue: UserContribution[] = [];

  constructor() {
    this.loadContributions();
  }

  async submitContribution(gameId: number, field: string, newValue: any): Promise<void> {
    const contribution: UserContribution = {
      id: this.generateId(),
      userId: this.getCurrentUserId(),
      field,
      oldValue: await this.getCurrentFieldValue(gameId, field),
      newValue,
      status: 'pending',
      timestamp: new Date().toISOString(),
      votes: { up: 0, down: 0 }
    };

    const gameKey = `game_${gameId}`;
    const existing = this.contributions.get(gameKey) || [];
    existing.push(contribution);
    this.contributions.set(gameKey, existing);

    this.moderationQueue.push(contribution);
    this.saveContributions();

    // Auto-approve certain types of contributions
    if (this.shouldAutoApprove(contribution)) {
      await this.approveContribution(contribution.id);
    }
  }

  async getContributions(gameId: number): Promise<UserContribution[]> {
    const gameKey = `game_${gameId}`;
    return this.contributions.get(gameKey) || [];
  }

  async applyUserContributions(game: GameData): Promise<GameData> {
    const contributions = await this.getContributions(game.appid);
    const approvedContributions = contributions.filter(c => c.status === 'approved');

    let enhancedGame = { ...game };

    for (const contribution of approvedContributions) {
      // Apply contribution based on field type
      switch (contribution.field) {
        case 'short_description':
          if (contribution.votes.up > contribution.votes.down) {
            enhancedGame.short_description = contribution.newValue;
          }
          break;
        case 'genres':
          if (Array.isArray(contribution.newValue)) {
            enhancedGame.genres = contribution.newValue;
          }
          break;
        case 'developers':
          if (Array.isArray(contribution.newValue)) {
            enhancedGame.developers = contribution.newValue;
          }
          break;
        // Add more field handlers as needed
      }
    }

    // Mark as user-enhanced if contributions were applied
    if (approvedContributions.length > 0) {
      enhancedGame.userContributions = approvedContributions;
      enhancedGame.dataSource = 'user';
      enhancedGame.lastUpdated = new Date().toISOString();
    }

    return enhancedGame;
  }

  async voteOnContribution(contributionId: string, vote: 'up' | 'down'): Promise<void> {
    for (const contributions of this.contributions.values()) {
      const contribution = contributions.find(c => c.id === contributionId);
      if (contribution) {
        contribution.votes[vote]++;
        
        // Auto-approve if enough positive votes
        if (contribution.votes.up >= 5 && contribution.votes.up > contribution.votes.down * 2) {
          contribution.status = 'approved';
        }
        // Auto-reject if too many negative votes
        else if (contribution.votes.down >= 3 && contribution.votes.down > contribution.votes.up) {
          contribution.status = 'rejected';
        }
        
        this.saveContributions();
        break;
      }
    }
  }

  async approveContribution(contributionId: string): Promise<void> {
    for (const contributions of this.contributions.values()) {
      const contribution = contributions.find(c => c.id === contributionId);
      if (contribution) {
        contribution.status = 'approved';
        this.saveContributions();
        break;
      }
    }
  }

  async rejectContribution(contributionId: string): Promise<void> {
    for (const contributions of this.contributions.values()) {
      const contribution = contributions.find(c => c.id === contributionId);
      if (contribution) {
        contribution.status = 'rejected';
        this.saveContributions();
        break;
      }
    }
  }

  getModerationQueue(): UserContribution[] {
    return this.moderationQueue.filter(c => c.status === 'pending');
  }

  private shouldAutoApprove(contribution: UserContribution): boolean {
    // Auto-approve simple corrections from trusted users
    const trustedFields = ['short_description', 'release_date'];
    const userId = contribution.userId;
    
    // Check if user has good contribution history
    const userContributions = Array.from(this.contributions.values())
      .flat()
      .filter(c => c.userId === userId && c.status === 'approved');
    
    return trustedFields.includes(contribution.field) && userContributions.length >= 5;
  }

  private async getCurrentFieldValue(gameId: number, field: string): Promise<any> {
    // This would typically fetch from the current game data
    // For now, return null as placeholder
    return null;
  }

  private getCurrentUserId(): string {
    // In a real app, this would get the authenticated user ID
    return localStorage.getItem('userId') || 'anonymous';
  }

  private generateId(): string {
    return `contrib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadContributions(): void {
    try {
      const saved = localStorage.getItem('userContributions');
      if (saved) {
        const data = JSON.parse(saved);
        this.contributions = new Map(data.contributions);
        this.moderationQueue = data.moderationQueue || [];
      }
    } catch (error) {
      console.warn('Failed to load user contributions:', error);
    }
  }

  private saveContributions(): void {
    try {
      const data = {
        contributions: Array.from(this.contributions.entries()),
        moderationQueue: this.moderationQueue
      };
      localStorage.setItem('userContributions', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save user contributions:', error);
    }
  }
}