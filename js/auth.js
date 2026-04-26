// ==============================
// 🔐 AUTH + USER SYSTEM
// ==============================

import { auth, db, doc, getDoc, setDoc, collection, query, where, getDocs } from "./firebase.js";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ==============================
// VARIABLES
// ==============================
let currentUserData = null;

const provider = new GoogleAuthProvider();

// ==============================
// LOGIN
// ==============================
export function loginWithGoogle() {
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "accueil.html";
    });
}

// ==============================
// LOGOUT
// ==============================
export function logoutUser() {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
}

// ==============================
// USER ID UNIQUE
// ==============================
async function generateUserId(name) {
  let base = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!base) base = "user";

  let id = base;
  let i = 1;

  while (true) {
    const q = query(collection(db, "users"), where("userId", "==", id));
    const snap = await getDocs(q);

    if (snap.empty) break;

    id = base + i;
    i++;
  }

  return id;
}

// ==============================
// SAVE USER
// ==============================
async function saveUserIfNeeded(user) {
  const ref = doc(db, "users", user.email);
  const snap = await getDoc(ref);

  if (snap.exists()) return snap.data();

  const userId = await generateUserId(user.displayName);

  const data = {
    email: user.email,
    username: user.displayName,
    photoURL: user.photoURL,
    userId: userId
  };

  await setDoc(ref, data);
  return data;
}

// ==============================
// OBSERVER USER
// ==============================
export function onUserState(callback) {
  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      callback(null);
      return;
    }

    currentUserData = await saveUserIfNeeded(user);

    const ref = doc(db, "users", user.email);
    const snap = await getDoc(ref);

    currentUserData = snap.data();

    callback(currentUserData);
  });
}

// ==============================
// GET CURRENT USER
// ==============================
export function getCurrentUser() {
  return currentUserData;
}