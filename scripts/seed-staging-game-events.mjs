import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function buildSeedEvents() {
  const now = Date.now();
  const users = [
    {
      email: "alex.tester@example.org",
      name: "Alex Tester",
      grade: "6",
      teacherName: "Ms. Green",
      schoolName: "Staging Academy",
      school: "Staging Academy",
    },
    {
      email: "sam.peer@example.org",
      name: "Sam Peer",
      grade: "7",
      teacherName: "Mr. Blake",
      schoolName: "Pilot School",
      school: "Pilot School",
    },
  ];

  return [
    {
      gameId: "least-sugar-game",
      event: "start",
      sessionId: "stage-seed-session-1",
      user: users[0],
      timestamp: new Date(now - 1000 * 60 * 10).toISOString(),
      createdAt: new Date(now - 1000 * 60 * 10).toISOString(),
    },
    {
      gameId: "least-sugar-game",
      event: "complete",
      sessionId: "stage-seed-session-1",
      user: users[0],
      score: 8,
      moves: 12,
      timeRemaining: 46,
      timestamp: new Date(now - 1000 * 60 * 8).toISOString(),
      createdAt: new Date(now - 1000 * 60 * 8).toISOString(),
    },
    {
      gameId: "budgeting-game",
      event: "start",
      sessionId: "stage-seed-session-2",
      user: users[1],
      timestamp: new Date(now - 1000 * 60 * 6).toISOString(),
      createdAt: new Date(now - 1000 * 60 * 6).toISOString(),
    },
    {
      gameId: "budgeting-game",
      event: "abandon",
      sessionId: "stage-seed-session-2",
      user: users[1],
      moves: 7,
      timestamp: new Date(now - 1000 * 60 * 5).toISOString(),
      createdAt: new Date(now - 1000 * 60 * 5).toISOString(),
    },
  ];
}

async function main() {
  const firebaseConfig = {
    apiKey: getRequiredEnv("VITE_FIREBASE_API_KEY"),
    authDomain: getRequiredEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: getRequiredEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: getRequiredEnv("VITE_FIREBASE_APP_ID"),
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const events = buildSeedEvents();

  for (const event of events) {
    await addDoc(collection(db, "game_events"), event);
  }

  console.log(
    `Seeded ${events.length} staging events into project "${firebaseConfig.projectId}".`
  );
}

main().catch((error) => {
  console.error("Failed to seed staging events:", error);
  process.exitCode = 1;
});
