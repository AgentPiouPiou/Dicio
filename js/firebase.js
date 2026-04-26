// ==============================
// 🔥 INITIALISATION FIREBASE
// ==============================

// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Import Auth
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ⚠️ Remplace avec ta config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTVEsUH2U1Rmmk7Y45L8a9KjDwvFaNmmM",
  authDomain: "dicio-ea758.firebaseapp.com",
  projectId: "dicio-ea758",
  appId: "1:205631559932:web:3a8543f6fc446b2d97df79"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de l'authentification
const auth = getAuth(app);

// Export pour utilisation ailleurs
export { auth };   