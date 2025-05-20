 // Thema laden uit localStorage
 const theme = localStorage.getItem('preferred-theme');
 if (theme) {
   document.body.setAttribute('data-theme', theme);
   applyThemeColors(theme);
 } else {
   applyThemeColors('main');
 }

 // Klik op naam = naar portfolio
 document.getElementById('enter-site').addEventListener('click', () => {
   window.location.href = 'portfolio.html';
 });

 // Thema-kleuren toepassen (optioneel uitbreidbaar per thema)
 function applyThemeColors(theme) {
   const themes = {
     main: {
       bg: '#0d0d0d',
       text: '#eaeaea'
     },
     japan: {
       bg: '#f7f0e8',
       text: '#5f1d1d'
     },
     nfs: {
       bg: '#0a0a0a',
       text: '#00ffae'
     }
     // Voeg hier meer thema's toe indien gewenst
   };

   if (themes[theme]) {
     document.body.style.backgroundColor = themes[theme].bg;
     document.body.style.color = themes[theme].text;
   }
 }

(() => {
    document.querySelectorAll(".theme-option").forEach((option) => {
      option.addEventListener("click", () => {
        document.body.setAttribute("data-theme", option.dataset.theme);
        localStorage.setItem("preferred-theme", option.dataset.theme);
      });
    });

    const theme = localStorage.getItem("preferred-theme");
    if (theme) {
      document.body.setAttribute("data-theme", theme);
    }
  })();