let authChecked = false;

/* LOGIN GOOGLE */
export function loginWithGoogle() {
  auth.signInWithPopup(provider).then(() => {
    window.location.href = "/Dicio/";
  });
}

/* REDIRECTION LOGIN */
export function redirectIfLogged() {

  auth.onAuthStateChanged((user) => {

    if (authChecked) return; // 🔥 empêche boucle
    authChecked = true;

    if (user) {
      window.location.href = "/Dicio/";
    }

  });

}

/* PROTECTION PAGE */
export function protectPage(callback) {

  auth.onAuthStateChanged((user) => {

    if (authChecked) return; // 🔥 empêche boucle
    authChecked = true;

    if (!user) {
      window.location.href = "/Dicio/login/";
    } else {
      callback(user);
    }

  });

}
