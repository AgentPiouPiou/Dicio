export function setAvatar(img, url) {
  if (!img) return;

  img.src = url || "/img/default-avatar.png";

  img.onerror = () => {
    img.src = "/img/default-avatar.png";
  };
}
