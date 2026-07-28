/* CareConnect Mobile — bootstrap */
document.addEventListener("DOMContentLoaded", () => {
  Store.init();
  UI.applyDarkMode();
  if (window.lucide) lucide.createIcons();
});
