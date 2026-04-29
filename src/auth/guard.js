import { observeAuth } from "./observer.js";

export function protectPage() {
  observeAuth((user) => {
    if (!user) {
      window.location.href = "/index.html";
    }
  });
}