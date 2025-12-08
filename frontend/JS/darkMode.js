export function initDarkMode() {
  const darkModeBtn = document.getElementById('dark-mode-btn');
  const htmlElement = document.documentElement;
  console.log(darkModeBtn);
  // Verificar se há preferência salva no localStorage, padrão é modo escuro
  const isDarkMode = localStorage.getItem('darkMode') !== 'false';
  
  // Inicializar com modo escuro ativado
  if (isDarkMode) {
    htmlElement.classList.add('dark-mode');
    if (darkModeBtn) darkModeBtn.textContent = '☀️';
    localStorage.setItem('darkMode', 'true');
  } else {
    htmlElement.classList.remove('dark-mode');
    if (darkModeBtn) darkModeBtn.textContent = '🌙';
  }
  
  // Adicionar evento de clique
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isCurrentlyDark = htmlElement.classList.contains('dark-mode');
      
      if (isCurrentlyDark) {
        htmlElement.classList.remove('dark-mode');
        darkModeBtn.textContent = '🌙';
        localStorage.setItem('darkMode', 'false');
      } else {
        htmlElement.classList.add('dark-mode');
        darkModeBtn.textContent = '☀️';
        localStorage.setItem('darkMode', 'true');
      }
    });
  }
}

// Executar inicialização imediatamente
document.addEventListener('DOMContentLoaded', initDarkMode);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
}
