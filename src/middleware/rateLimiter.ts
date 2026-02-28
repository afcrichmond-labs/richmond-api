import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../db/redis";

const publicLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_public",
  points: 100,       // requests
  duration: 60,      // per 60 seconds
  blockDuration: 60, // block for 60s when exceeded
});

const authenticatedLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_auth",
  points: 1000,
  duration: 60,
});

export async function rateLimitMiddleware(req, res, next) {
  const limiter = req.user ? authenticatedLimiter : publicLimiter;
  const key = req.user?.apiKey || req.ip;

  try {
    const result = await limiter.consume(key);
    res.set("X-RateLimit-Limit", limiter.points);
    res.set("X-RateLimit-Remaining", result.remainingPoints);
    res.set("X-RateLimit-Reset", new Date(Date.now() + result.msBeforeNext).toISOString());
    next();
  } catch (rejRes) {
    res.set("Retry-After", Math.ceil(rejRes.msBeforeNext / 1000));
    res.status(429).json({
      error: "Too many requests",
      retry_after: Math.ceil(rejRes.msBeforeNext / 1000),
    });
  }
}
