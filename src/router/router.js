const BASE_PATH = "/Dicio";

/**
 * Redirige vers une page en tenant compte du basePath GitHub Pages
 * @param {string} path - ex: "/home.html"
 */
export function redirectTo(path) {
  window.location.href = `${BASE_PATH}${path}`;
}

/**
 * Retourne le chemin courant SANS le basePath
 * ex: "/Dicio/home.html" → "/home.html"
 */
export function getCurrentPath() {
  const fullPath = window.location.pathname;

  if (fullPath.startsWith(BASE_PATH)) {
    return fullPath.replace(BASE_PATH, "") || "/index.html";
  }

  return fullPath;
}