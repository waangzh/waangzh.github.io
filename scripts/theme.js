// Theme Management
(function() {
  'use strict';
  
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Get saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }
  
  // Initialize theme
  applyTheme(savedTheme);
  
  // Toggle theme
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Only auto-apply system theme if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      applyTheme(systemTheme);
    }
    
    // Optional: Listen for system theme changes (can be disabled if you prefer manual only)
    // mediaQuery.addEventListener('change', (e) => {
    //   if (!localStorage.getItem('theme')) {
    //     applyTheme(e.matches ? 'dark' : 'light');
    //   }
    // });
  }
})();

