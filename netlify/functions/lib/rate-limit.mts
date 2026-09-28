import { query } from './db.mjs'

/**
 * Durable per-user rate limit backed by the `rate_limit_events` table.
 * Survives cold starts and is shared across all function instances.
 *
 * Records the attempt and returns true only if the user is under `limit`
 * events for `action` in the last `windowSeconds`. Check + insert happen in
 * one statement, so a burst of parallel requests can overshoot by at most a
 * handful — fine for cost protection.
 */

export const RATE_LIMITS = {
  import_profile: { limit: 10, windowSeconds: 3600 },
  import_target: { limit: 20, windowSeconds: 3600 },
  generate: { limit: 30, windowSeconds: 3600 },
  regenerate: { limit: 60, windowSeconds: 3600 }
} as const

export type RateLimitAction = keyof typeof RATE_LIMITS

export async function checkRateLimit(userId: string, action: RateLimitAction): Promise<boolean> {
  const { limit, windowSeconds } = RATE_LIMITS[action]
  const result = await query(
    `WITH recent AS (
       SELECT COUNT(*) AS n FROM rate_limit_events
       WHERE user_id = $1 AND action = $2 AND created_at > NOW() - make_interval(secs => $4)
     )
     INSERT INTO rate_limit_events (user_id, action)
     SELECT $1, $2 FROM recent WHERE n < $3
     RETURNING id`,
    [userId, action, limit, windowSeconds]
  )

  // Occasional cleanup so the table stays tiny (~1% of calls)
  if (Math.random() < 0.01) {
    query(`DELETE FROM rate_limit_events WHERE created_at < NOW() - INTERVAL '1 day'`).catch(() => {})
  }

  return result.rows.length > 0
}

export const RATE_LIMIT_MESSAGE = 'You\'re doing that a lot — please wait a bit and try again.'
