/* CareConnect — app bootstrap, runs on every page */

document.addEventListener("DOMContentLoaded", () => {
  Store.init();
  UI.applyDarkMode();
  if (window.lucide) lucide.createIcons();
});
