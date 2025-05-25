import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // Convenience methods with explicit JSON handling
  async setJSON(key: string, value: object, ttl?: number): Promise<void> {
    // Explicitly stringify the object to ensure proper serialization
    const jsonString = JSON.stringify(value);
    await this.set(key, jsonString, ttl);
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const jsonString = await this.get<string>(key);
    if (!jsonString) return null;

    try {
      // Parse the string back to an object
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.error(`Failed to parse cached JSON for key: ${key}`, e);
      return null;
    }
  }

  async reset(): Promise<void> {
    await this.cacheManager.clear();
  }
}
