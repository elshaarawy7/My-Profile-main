/**
 * typing.js — Typewriter / typing animation effect
 * Portfolio: Elshaarawy Hassan | Flutter Developer
 *
 * Cycles through an array of strings, types each character
 * one-by-one, pauses, then erases, then moves to the next string.
 */

'use strict';

/**
 * Initialises the typing animation on the element with id="typing-text".
 */
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  // ── Configuration ──────────────────────────────────────
  const STRINGS = [
    'Flutter Dev',
    'Mobile App Developer',
    'Clean Code Enthusiast',
    'Cross-Platform Expert',
  ];

  const TYPE_SPEED   = 90;   // ms per character typed
  const ERASE_SPEED  = 50;   // ms per character erased
  const PAUSE_AFTER  = 2000; // ms to wait after full string is typed
  const PAUSE_BEFORE = 400;  // ms to wait before typing next string
  // ────────────────────────────────────────────────────────

  let stringIndex  = 0;
  let charIndex    = 0;
  let isErasing    = false;

  /**
   * Core tick function — runs on a dynamic setTimeout loop
   * so typing and erasing can run at different speeds.
   */
  function tick() {
    const currentStr = STRINGS[stringIndex];

    if (isErasing) {
      // Remove one character
      el.textContent = currentStr.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Finished erasing → move to next string
        isErasing   = false;
        stringIndex = (stringIndex + 1) % STRINGS.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }

      setTimeout(tick, ERASE_SPEED);

    } else {
      // Add one character
      el.textContent = currentStr.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentStr.length) {
        // Finished typing → pause then start erasing
        isErasing = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }

      setTimeout(tick, TYPE_SPEED);
    }
  }

  // Kick off
  setTimeout(tick, PAUSE_BEFORE);
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', initTypingAnimation);
