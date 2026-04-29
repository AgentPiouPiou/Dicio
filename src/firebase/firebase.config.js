import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTVEsUH2U1Rmmk7Y45L8a9KjDwvFaNmmM",
  authDomain: "dicio-ea758.firebaseapp.com",
  projectId: "dicio-ea758",
  appId: "1:205631559932:web:3a8543f6fc446b2d97df79"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);