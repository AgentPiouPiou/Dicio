const BASE_PATH = "/Dicio";

/**
 * Redirection simple et fiable
 */
export function goTo(page) {
  window.location.href = BASE_PATH + page;
}

/**
 * Vérifie si on est sur une page précise
 */
export function isOn(page) {
  return window.location.pathname.endsWith(page);
}