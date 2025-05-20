document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('enter-site').addEventListener('click', () => {
    window.location.href = 'portfolio.html';
  });
});

 (() => {
  const theme = localStorage.getItem("preferred-theme");

  if (theme) {
    document.body.setAttribute("data-theme", theme);
    applyThemeColors(theme);
  } else {
    applyThemeColors("main");
  }

  document.querySelectorAll(".theme-option").forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTheme = option.dataset.theme;
      document.body.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("preferred-theme", selectedTheme);
      applyThemeColors(selectedTheme);
    });
  });
})();

// Thema-kleuren toepassen
function applyThemeColors(theme) {
  const themes = {
    main: {
      bg: "#0d0d0d",
      text: "#eaeaea",
    },
    japan: {
      bg: "#f7f0e8",
      text: "#5f1d1d",
    },
    nfs: {
      bg: "#0a0a0a",
      text: "#00ffae",
    },
    // voeg extra thema's toe als je wilt
  };

  if (themes[theme]) {
    document.body.style.backgroundColor = themes[theme].bg;
    document.body.style.color = themes[theme].text;
  }
}
