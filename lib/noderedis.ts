import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;
let redisClientPromise: Promise<RedisClientType> | null = null;

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error('REDIS_URL not found');
};


export async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient) return redisClient;
  if (redisClientPromise) return redisClientPromise;

  const client: RedisClientType = createClient({
    url: getRedisUrl(),
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
      connectTimeout: 10000,
    },
  });

  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  client.on('connect', () => {
    console.log('Redis connected successfully');
  });
  client.on('ready', () => {
    console.log('Redis client ready');
  });
  client.on('end', () => {
    console.log('Redis connection closed');
  });
  client.on('reconnecting', () => {
    console.log('Redis client reconnecting...');
  });

  redisClientPromise = client.connect().then(() => {
    redisClient = client;
    return client;
  });

  return redisClientPromise;
}
