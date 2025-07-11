import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'http://localhost:6379/');

// Cache middleware for API routes
export const cacheMiddleware = async (key: string, duration: number = 3600) => {
  try {
    // Try to get cached data
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Redis cache error:', error);
    return null;
  }
};

// Set cache data
export const setCache = async (key: string, data: any, duration: number = 3600) => {
  try {
    await redis.setex(key, duration, JSON.stringify(data));
  } catch (error) {
    console.error('Redis set cache error:', error);
  }
};

// Delete cache data
export const deleteCache = async (key: string) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete cache error:', error);
  }
};

// Generate cache key from request parameters
export const generateCacheKey = (prefix: string, params: Record<string, any>) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);
  
  return `${prefix}:${JSON.stringify(sortedParams)}`;
};

export default redis; 