import { db } from "../core/firebase.js";

export async function generateUserId(name) {
  let base = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "user";

  let id = base;
  let i = 1;

  while (true) {
    const snap = await db.collection("users")
      .where("userId", "==", id)
      .get();

    if (snap.empty) break;

    id = base + i;
    i++;
  }

  return id;
}

export async function saveUserIfNeeded(user) {
  const ref = db.collection("users").doc(user.email);
  const snap = await ref.get();

  if (snap.exists) return snap.data();

  const userId = await generateUserId(user.displayName);

  const data = {
    email: user.email,
    username: user.displayName,
    photoURL: user.photoURL,
    userId
  };

  await ref.set(data);
  return data;
}
