import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getDatabase,
  onValue,
  push,
  ref,
  runTransaction,
  serverTimestamp,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { firebaseConfig, hasFirebaseConfig } from "./firebase-config.js";

export const firebaseReady = hasFirebaseConfig();

let database = null;

if (firebaseReady) {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
}

function requireDatabase() {
  if (!database) {
    throw new Error("Firebase is not configured.");
  }

  return database;
}

export async function recordPlaythrough(payload) {
  if (!firebaseReady) {
    return false;
  }

  const db = requireDatabase();
  const playthroughRef = push(ref(db, "playthroughs"));

  await Promise.all([
    set(playthroughRef, {
      ...payload,
      createdAt: Date.now(),
    }),
    runTransaction(ref(db, "summary/totalRuns"), (current) => (Number(current || 0) + 1)),
    runTransaction(
      ref(db, `summary/personas/${payload.persona}`),
      (current) => Number(current || 0) + 1,
    ),
    update(ref(db, "summary/meta"), {
      lastPersona: payload.persona,
      updatedAt: Date.now(),
    }),
  ]);

  return true;
}

export function subscribeToSummary(onData, onError) {
  if (!firebaseReady) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  const db = requireDatabase();
  const summaryRef = ref(db, "summary");

  return onValue(
    summaryRef,
    (snapshot) => {
      onData(snapshot.val() || {});
    },
    (error) => {
      onError?.(error);
    },
  );
}
