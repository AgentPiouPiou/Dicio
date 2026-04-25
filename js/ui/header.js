import { setAvatar } from "./avatar.js";

export function renderHeader(data) {
  const photo = document.getElementById("userPhoto");
  const name = document.getElementById("userName");

  if (photo) setAvatar(photo, data.photoURL);
  if (name) name.textContent = data.username || "Utilisateur";
}
