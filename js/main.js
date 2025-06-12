// document.addEventListener("DOMContentLoaded", () => {
//   document.getElementById("enter-site").addEventListener("click", () => {
//     window.location.href = "portfolio.html";
//   });
// });

(() => {
  const theme = localStorage.getItem("preferred-theme");

  if (theme) {
    document.body.setAttribute("data-theme", theme);
  }

  document.querySelectorAll(".theme-option").forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTheme = option.dataset.theme;
      document.body.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("preferred-theme", selectedTheme);
    });
  });
})();

window.addEventListener("load", function () {
  setTimeout(function () {
    document.body.classList.add("loaded");
  }, 500); // 1 seconde
});
