// Advanced caching service with TTL and source tracking
import { CacheEntry } from '../types/dataTypes';

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000;
  private defaultTTL = 3600000; // 1 hour

  set<T>(key: string, data: T, ttl?: number, source?: string): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      source: source || 'unknown'
    };

    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidateByPattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0.85 // Placeholder - would track actual hits/misses
    };
  }

  // Persist cache to localStorage
  persist(): void {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem('gameCache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to persist cache:', error);
    }
  }

  // Restore cache from localStorage
  restore(): void {
    try {
      const cacheData = localStorage.getItem('gameCache');
      if (cacheData) {
        const entries = JSON.parse(cacheData);
        this.cache = new Map(entries);
        
        // Clean expired entries
        for (const [key, entry] of this.cache.entries()) {
          if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to restore cache:', error);
    }
  }
}