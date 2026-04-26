const BASE_PATH = "/Dicio";

/**
 * Redirige vers une page en tenant compte du basePath
 * @param {string} page - ex: "/home.html"
 */
export function goTo(page) {
  window.location.href = BASE_PATH + page;
}

/**
 * Vérifie si on est actuellement sur une page donnée
 * @param {string} page - ex: "home.html"
 * @returns {boolean}
 */
export function isOn(page) {
  return window.location.pathname.endsWith(page);
}

/**
 * Retourne le chemin actuel (debug utile)
 */
export function getFullPath() {
  return window.location.pathname;
}