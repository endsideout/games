/**
 * Generates a unique session ID for correlating game events.
 * Format: timestamp-random (e.g., "1708368483584-a3f2b1c9")
 * 
 * This allows linking game_started and game_completed events
 * in analytics tools like Power BI or SQL queries.
 */
export function generateSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${timestamp}-${random}`;
}
