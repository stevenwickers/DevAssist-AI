import type { NextFunction, Request, Response } from 'express'

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

function getClientId(req: Request) {
  return req.ip || req.socket.remoteAddress || 'unknown'
}

export function createRateLimit({ windowMs, maxRequests }: RateLimitOptions) {
  const clients = new Map<string, RateLimitEntry>()

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now()
    const clientId = getClientId(req)
    const current = clients.get(clientId)

    if (!current || current.resetAt <= now) {
      clients.set(clientId, {
        count: 1,
        resetAt: now + windowMs,
      })
      next()
      return
    }

    current.count += 1

    if (current.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000)

      res.setHeader('Retry-After', retryAfterSeconds)
      res.status(429).json({
        error: 'Too many AI requests. Please try again later.',
      })
      return
    }

    next()
  }
}
