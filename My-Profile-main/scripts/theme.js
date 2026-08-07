/**
 * theme.js — Dark / Light mode toggle with persistence
 * Portfolio: Elshaarawy Hassan | Flutter Developer
 *
 * Reads preference from localStorage, falls back to
 * prefers-color-scheme media query.
 */

'use strict';

const THEME_KEY  = 'portfolio-theme';   // localStorage key
const DARK_ICON  = '<i class="fa-solid fa-sun" aria-hidden="true"></i>';  // shown in dark mode (click → go light)
const LIGHT_ICON = '<i class="fa-solid fa-moon" aria-hidden="true"></i>'; // shown in light mode (click → go dark)

/**
 * Apply a theme by setting data-theme on <html> and updating
 * the toggle button icon.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');

  // Update all theme toggle buttons on the page
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = theme === 'dark' ? DARK_ICON : LIGHT_ICON;
  });

  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Toggle between dark and light themes.
 */
function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/**
 * Initialise theme on page load.
 * Priority: localStorage → prefers-color-scheme → default dark
 */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);

  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else {
    // Respect OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Wire up all toggle buttons
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });

  // React to OS-level theme changes while the tab is open
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user has NOT manually set a preference
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Run immediately (before DOMContentLoaded) to avoid flash of wrong theme
initTheme();
