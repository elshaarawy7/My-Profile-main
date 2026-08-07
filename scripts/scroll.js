/**
 * scroll.js — Scroll-related behaviours
 * Portfolio: Elshaarawy Hassan | Flutter Developer
 *
 * Handles:
 *  1. Smooth anchor scrolling
 *  2. Active nav-link highlighting on scroll
 *  3. Scroll-reveal animations (IntersectionObserver)
 *  4. Skill progress bar triggering on scroll
 */

'use strict';

/* ── 1. Smooth scrolling ────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile menu if open
      const menu = document.getElementById('nav-menu');
      const ham  = document.getElementById('hamburger');
      const overlay = document.getElementById('nav-overlay');
      if (menu && menu.classList.contains('open')) {
        menu.classList.remove('open');
        ham  && ham.classList.remove('open');
        ham  && ham.setAttribute('aria-expanded', 'false');
        overlay && overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ── 2. Active nav highlight ────────────────────────────── */
function initActiveNav() {
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');
  const sections  = document.querySelectorAll('section[id]');
  const navbar    = document.getElementById('navbar');

  if (!navLinks.length || !sections.length) return;

  const NAV_OFFSET = 90; // px — accounts for fixed navbar height

  function onScroll() {
    // Navbar scroll class
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }

    // Find the current section
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= NAV_OFFSET + 20) {
        currentId = sec.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href').slice(1); // remove '#'
      link.classList.toggle('active', href === currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}

/* ── 3. Scroll-reveal animations ────────────────────────── */
function initScrollReveal() {
  // Guard: skip if browser doesn't support IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach((el) => {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after revealing to free memory
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,      // 12 % of element must be visible
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ── 4. Skill progress bars ─────────────────────────────── */
function initProgressBars() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: fill all bars immediately
    document.querySelectorAll('.progress-bar-fill').forEach((bar) => {
      bar.style.width = bar.dataset.width || '0%';
    });
    return;
  }

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          // Small delay so animation plays visibly after reveal
          setTimeout(() => {
            bar.style.width = bar.dataset.width || '0%';
          }, 100);
          barObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.progress-bar-fill').forEach((bar) => {
    barObserver.observe(bar);
  });
}

/* ── Back-to-top button visibility ─────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Init all ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initActiveNav();
  initScrollReveal();
  initProgressBars();
  initBackToTop();
});
