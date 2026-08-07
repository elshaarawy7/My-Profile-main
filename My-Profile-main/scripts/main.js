/**
 * main.js — Core application logic
 * Portfolio: Elshaarawy Hassan | Flutter Developer
 *
 * Handles:
 *  1. Loading screen removal
 *  2. Hamburger / mobile menu
 *  3. Skills tab switching
 *  4. Service card accordion
 *  5. Star rating widget
 *  6. Feedback form submission
 *  7. Particle canvas background animation
 *  8. Keyboard navigation helpers
 *  9. Lazy image loading
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. LOADING SCREEN
   ═══════════════════════════════════════════════════════════ */
function initLoader() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  // Hide after resources are ready
  window.addEventListener('load', () => {
    setTimeout(() => {
      screen.classList.add('hidden');
      // Remove from DOM completely after transition
      screen.addEventListener('transitionend', () => screen.remove(), { once: true });
    }, 600);
  });
}

/* ═══════════════════════════════════════════════════════════
   2. HAMBURGER MENU
   ═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const ham     = document.getElementById('hamburger');
  const menu    = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  if (!ham || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    ham.classList.add('open');
    ham.setAttribute('aria-expanded', 'true');
    overlay && overlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // prevent page scroll
  }

  function closeMenu() {
    menu.classList.remove('open');
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded', 'false');
    overlay && overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', () => {
    ham.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  // Close on overlay click
  overlay && overlay.addEventListener('click', closeMenu);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
}

/* ═══════════════════════════════════════════════════════════
   3. SKILLS TABS
   ═══════════════════════════════════════════════════════════ */
function initSkillsTabs() {
  const tabs   = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skill-panel');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      // Update panels
      panels.forEach((panel) => {
        const isActive = panel.dataset.panel === target;
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      });
    });

    // Keyboard: arrow keys navigate tabs
    tab.addEventListener('keydown', (e) => {
      const idx  = [...tabs].indexOf(tab);
      if (e.key === 'ArrowRight') {
        tabs[(idx + 1) % tabs.length].focus();
        tabs[(idx + 1) % tabs.length].click();
      } else if (e.key === 'ArrowLeft') {
        tabs[(idx - 1 + tabs.length) % tabs.length].focus();
        tabs[(idx - 1 + tabs.length) % tabs.length].click();
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   4. SERVICES ACCORDION
   ═══════════════════════════════════════════════════════════ */
function initServicesAccordion() {
  document.querySelectorAll('.service-card').forEach((card) => {
    const header = card.querySelector('.service-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      // Close all first (single-open behaviour)
      document.querySelectorAll('.service-card.open').forEach((c) => {
        c.classList.remove('open');
        c.querySelector('.service-header')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked card
      if (!isOpen) {
        card.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   5. STAR RATING WIDGET
   ═══════════════════════════════════════════════════════════ */
const STAR_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

function initStarRating() {
  const stars      = document.querySelectorAll('.star-btn');
  const displayEl  = document.getElementById('stars-display-text');
  if (!stars.length) return;

  let currentRating = 0;

  function setHighlight(upTo) {
    stars.forEach((star, i) => {
      star.classList.toggle('active',   i < upTo);
      star.classList.toggle('hovered',  false);
    });
    if (displayEl) {
      displayEl.textContent = upTo > 0 ? `${STAR_LABELS[upTo]} (${upTo}/5)` : '';
    }
  }

  function setHover(upTo) {
    stars.forEach((star, i) => {
      star.classList.toggle('hovered', i < upTo && i >= currentRating);
      star.classList.toggle('active',  i < currentRating);
    });
    if (displayEl) {
      displayEl.textContent = upTo > 0 ? `${STAR_LABELS[upTo]} (${upTo}/5)` : (currentRating > 0 ? `${STAR_LABELS[currentRating]} (${currentRating}/5)` : '');
    }
  }

  stars.forEach((star, i) => {
    const value = i + 1;

    star.addEventListener('click', () => {
      currentRating = value;
      setHighlight(currentRating);
      // Update hidden input
      const input = document.getElementById('rating-value');
      if (input) input.value = currentRating;
    });

    star.addEventListener('mouseenter', () => setHover(value));
    star.addEventListener('mouseleave', () => setHover(0));

    // Keyboard
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        star.click();
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   6. FEEDBACK FORM
   ═══════════════════════════════════════════════════════════ */
function initFeedbackForm() {
  const form      = document.getElementById('feedback-form');
  const successEl = document.getElementById('feedback-success');
  if (!form) return;

  // Live slider value display
  const slider     = document.getElementById('satisfaction-slider');
  const sliderDisp = document.getElementById('slider-value-display');
  if (slider && sliderDisp) {
    slider.addEventListener('input', () => {
      sliderDisp.textContent = `${slider.value}%`;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('feedback-name')?.value.trim();
    const message = document.getElementById('feedback-message')?.value.trim();
    const rating  = document.getElementById('rating-value')?.value;

    if (!message) {
      document.getElementById('feedback-message')?.focus();
      return;
    }

    // In a real app you'd POST to an API. Here we simulate success.
    console.log('[Feedback submitted]', { name, rating, message });

    form.style.display = 'none';
    if (successEl) {
      successEl.style.display = 'block';
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   7. PARTICLE CANVAS BACKGROUND
   ═══════════════════════════════════════════════════════════ */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  // ── Config ─────────────────────────────────────────────
  const PARTICLE_COUNT = 60;
  const MAX_DIST       = 130; // px — max distance to draw connecting line
  const SPEED          = 0.4;
  // ────────────────────────────────────────────────────────

  let particles = [];
  let animId    = null;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function getAccentColor() {
    // Read computed CSS accent colour from :root
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue('--accent').trim() || '#007DCC';
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * canvas.width;
      this.y  = initial ? Math.random() * canvas.height : -5;
      this.vx = (Math.random() - 0.5) * SPEED;
      this.vy = (Math.random() - 0.5) * SPEED;
      this.r  = Math.random() * 1.5 + 0.75;
      this.a  = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }

    draw(color) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hexToRgb(color)},${this.a})`;
      ctx.fill();
    }
  }

  /** Convert hex colour string to "r,g,b" string */
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const n = parseInt(hex, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getAccentColor();

    particles.forEach((p) => p.update());

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${hexToRgb(color)},${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach((p) => p.draw(color));

    animId = requestAnimationFrame(draw);
  }

  // Init
  init();
  draw();

  // Resize handler
  const resizeObserver = new ResizeObserver(() => {
    resize();
  });
  resizeObserver.observe(canvas.parentElement || document.body);

  // Clean up on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   8. KEYBOARD NAVIGATION — Focus trap for mobile menu
   ═══════════════════════════════════════════════════════════ */
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Tab trap inside open mobile menu
    const menu = document.getElementById('nav-menu');
    if (!menu || !menu.classList.contains('open')) return;

    const focusable = [...menu.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )].filter((el) => !el.disabled);

    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   9. LAZY IMAGE LOADING
   ═══════════════════════════════════════════════════════════ */
function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '200px' }
  );

  document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));
}

/* ═══════════════════════════════════════════════════════════
   10. CUSTOM FLUTTER CURSOR
   ═══════════════════════════════════════════════════════════ */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches) {
    return;
  }

  const cursor = document.getElementById('flutter-cursor');
  if (!cursor) return;

  document.documentElement.classList.add('has-custom-cursor');

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let isMoving = false;

  function render() {
    cursorX += (mouseX - cursorX) * 0.35;
    cursorY += (mouseY - cursorY) * 0.35;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

    if (Math.abs(mouseX - cursorX) > 0.1 || Math.abs(mouseY - cursorY) > 0.1) {
      requestAnimationFrame(render);
    } else {
      isMoving = false;
    }
  }

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!cursor.classList.contains('active')) {
      cursor.classList.add('active');
    }

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(render);
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    cursor.classList.remove('active');
  });

  const hoverSelectors = 'a, button, input, textarea, select, [role="button"], .btn, .project-card, .contact-card, .skill-tab, .star-btn, .nav-logo, .hero-badge';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      cursor.classList.add('hovering');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      cursor.classList.remove('hovering');
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   11. COPY EMAIL HELPER
   ═══════════════════════════════════════════════════════════ */
function initCopyEmail() {
  const btn = document.getElementById('copy-email-btn');
  const textSpan = document.getElementById('copy-btn-text');
  if (!btn || !textSpan) return;

  btn.addEventListener('click', () => {
    const email = 'elshaarawyhassan7@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      textSpan.textContent = 'Copied!';
      btn.style.borderColor = 'var(--accent)';
      btn.style.color = 'var(--accent)';

      setTimeout(() => {
        textSpan.textContent = 'Copy Email';
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 2000);
    }).catch(() => {
      textSpan.textContent = 'Copied!';
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   INIT ALL
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initMobileMenu();
  initSkillsTabs();
  initStarRating();
  initFeedbackForm();
  initParticleCanvas();
  initKeyboardNav();
  initLazyImages();
  initCustomCursor();
  initCopyEmail();
});
