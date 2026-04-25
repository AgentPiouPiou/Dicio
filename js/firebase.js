const firebaseConfig = {
  apiKey: "AIzaSyDTVEsUH2U1Rmmk7Y45L8a9KjDwvFaNmmM",
  authDomain: "dicio-ea758.firebaseapp.com",
  projectId: "dicio-ea758"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
