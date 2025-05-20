import { Redis } from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error("REDIS_URL not found");
};

// Create a singleton Redis instance
let redisInstance: Redis | null = null;

const initializeRedis = () => {
  if (redisInstance) return redisInstance;

  redisInstance = new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 5,
    connectTimeout: 10000,
    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    reconnectOnError: (err) => {
      const targetErrors = ['READONLY', 'ETIMEDOUT', 'ECONNREFUSED', 'MaxRetriesPerRequestError'];
      if (targetErrors.some(error => err.message.includes(error))) {
        return true;
      }
      return false;
    },
    enableReadyCheck: true,
    keepAlive: 10000,
    family: 4,
    db: 0
  });

  redisInstance.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  redisInstance.on('connect', () => {
    console.log('Redis connected successfully');
  });

  redisInstance.on('ready', () => {
    console.log('Redis client ready');
  });

  redisInstance.on('reconnecting', () => {
    console.log('Redis client reconnecting...');
  });

  return redisInstance;
};

// Initialize Redis connection
const redis = initializeRedis();

// Helper functions for common Redis operations
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

export const setCachedData = async <T>(key: string, data: T, expirySeconds?: number): Promise<void> => {
  try {
    const stringifiedData = JSON.stringify(data);
    if (expirySeconds) {
      await redis.setex(key, expirySeconds, stringifiedData);
    } else {
      await redis.set(key, stringifiedData);
    }
  } catch (error) {
    console.error('Error setting cached data:', error);
  }
};

export const deleteCachedData = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Error deleting cached data:', error);
  }
};

export { redis };