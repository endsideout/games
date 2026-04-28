export type GameTrackingEventType = "game_started" | "game_completed" | "game_over";

export interface PlayerProfile {
  name: string;
  grade: string;
  teacherName: string;
  schoolName: string;
}

export interface GameUser {
  email: string | null;
  name: string | null;
  grade: string | null;
  teacherName: string | null;
  schoolName: string | null;
  school: string | null;
}

export interface GameTrackingEvent {
  gameId: string;
  event: GameTrackingEventType;
  sessionId?: string;
  score?: number;
  moves?: number;
  timeRemaining?: number;
  metadata?: Record<string, unknown>;
}

export interface GameEventPayload extends GameTrackingEvent {
  user: GameUser;
  timestamp: string;
  createdAt?: string;
}
