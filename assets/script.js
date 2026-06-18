// ===== Sparkle Hua Hin — interactions =====
(function () {
  'use strict';

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Current year
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Floating contact widget
  var floatWrap = document.querySelector('[data-float]');
  var floatToggle = document.querySelector('[data-float-toggle]');
  if (floatWrap && floatToggle) {
    floatToggle.addEventListener('click', function () {
      var open = floatWrap.classList.toggle('open');
      floatToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!floatWrap.contains(e.target)) {
        floatWrap.classList.remove('open');
        floatToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reveal the floating contact widget once the user scrolls past the hero
  if (floatWrap) {
    var showAfter = 260;
    var syncFloat = function () {
      var show = window.scrollY > showAfter;
      floatWrap.classList.toggle('is-visible', show);
      if (!show) {
        floatWrap.classList.remove('open');
        if (floatToggle) floatToggle.setAttribute('aria-expanded', 'false');
      }
    };
    window.addEventListener('scroll', syncFloat, { passive: true });
    syncFloat();
  }

  // Reveal on scroll
  var revealTargets = document.querySelectorAll(
    '.section-head, .card, .why-copy, .why-stats .stat, .areas-list li, .contact-copy, .contact-form'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  // Demo form handling (no backend — shows confirmation)
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = contactForm.querySelector('[data-form-note]');
      if (note) note.hidden = false;
      var btn = contactForm.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Request sent ✓'; btn.disabled = true; }
    });
  }
})();
