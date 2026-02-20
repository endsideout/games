import { collection, addDoc } from "firebase/firestore";
import { getFirestoreDb } from "./firebase";
import type { GameUser } from "../context/GameUserContext";
import type { GameTrackingEvent } from "../context/GameUserContext";

const COLLECTION_NAME = "game_events";

export interface GameEventPayload extends GameTrackingEvent {
  user: GameUser;
  timestamp: string;
}

export async function saveGameEventToFirebase(
  payload: GameEventPayload
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    if (import.meta.env.DEV) {
      console.warn("[Game Tracking] Firebase not configured. Add .env vars.");
    }
    return;
  }

  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      ...payload,
      // Firestore prefers serverTimestamp for consistency; we send client timestamp as fallback
      createdAt: new Date().toISOString(),
    });
    if (import.meta.env.DEV) {
      console.log("[Game Tracking] Saved to Firebase", payload);
    }
  } catch (err) {
    console.error("[Game Tracking] Failed to save to Firebase:", err);
  }
}
