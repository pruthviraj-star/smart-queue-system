// theme.js
function getInitialTheme() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'dark'; // default to premium dark theme
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
  window.localStorage.setItem('color-theme', theme);
  updateToggleButton(theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
}

// Automatically apply theme before page loads fully
const currentTheme = getInitialTheme();
if (currentTheme === 'dark') {
  document.documentElement.classList.add('dark');
  document.documentElement.classList.remove('light');
} else {
  document.documentElement.classList.remove('dark');
  document.documentElement.classList.add('light');
}

// Function to update the button icon if it exists
function updateToggleButton(theme) {
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    if (theme === 'dark') {
      btn.innerHTML = `<svg style="width:18px;height:18px;color:#fbbf24;" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.707a1 1 0 01-1.414 1.414l-.708-.707a1 1 0 010-1.414zM6.343 7.757a1 1 0 01-1.414-1.414l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM10 5a5 5 0 100 10 5 5 0 000-10zm-1 12a1 1 0 112 0v1a1 1 0 11-2 0v-1zm-6.22-4.22a1 1 0 010-1.415l.708-.707a1 1 0 011.414 1.414l-.708.707a1 1 0 01-1.414 0zM16.343 14.243a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 010-1.414zM18 10a1 1 0 110-2h1a1 1 0 110 2h-1zM2 10a1 1 0 110-2H1a1 1 0 110 2h1z"></path></svg>`;
    } else {
      btn.innerHTML = `<svg style="width:18px;height:18px;color:#636366;" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>`;
    }
  }
}

// Call on load
window.addEventListener('DOMContentLoaded', () => {
  updateToggleButton(currentTheme);
  
  // Scroll Reveal Observer
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  window.observeReveals = () => {
    document.querySelectorAll('.reveal-on-scroll:not(.reveal-visible)').forEach(el => {
      observer.observe(el);
    });
  };
  
  observeReveals();
  
  // Re-run observeReveals when dynamic content is added
  const mutationObserver = new MutationObserver((mutations) => {
    let shouldObserve = false;
    mutations.forEach(m => { if(m.addedNodes.length > 0) shouldObserve = true; });
    if(shouldObserve) observeReveals();
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
});


