export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};

export function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every(
    (value) => typeof value === "string" && value.trim() !== "" && value.trim() !== "...",
  );
}
