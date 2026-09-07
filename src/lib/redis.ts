import { Redis } from "@upstash/redis";
export const redis = Redis.fromEnv();

// Redis key utilities for consistent key construction
export const RedisKeys = {} as const;
