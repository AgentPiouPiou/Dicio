import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBn6QMgzKYf4CsyMvXWl7IykmBlN_EJoN0",
  authDomain: "jeu-multijoueur-3cdc7.firebaseapp.com",
  projectId: "jeu-multijoueur-3cdc7",
  storageBucket: "jeu-multijoueur-3cdc7.firebasestorage.app",
  messagingSenderId: "368113506521",
  appId: "1:368113506521:web:5bdf41bfd77751300046c8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);