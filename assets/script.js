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

  // Contact form → Make webhook (honeypot + time-trap), inline confirmation
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    var WEBHOOK = 'https://hook.eu1.make.com/9djgmkfap4lqotr9tx4d5tj9shyy96w8';
    var loadedAt = Date.now();
    var lang = (document.documentElement.lang || 'en').slice(0, 2);
    var T = lang === 'fr'
      ? { sending: 'Envoi…', sent: 'Demande envoyée ✓' }
      : { sending: 'Sending…', sent: 'Request sent ✓' };
    var leadSource = new URLSearchParams(location.search).get('source') || 'sparkle';
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.reportValidity()) return;
      var el = contactForm.elements;
      var note = contactForm.querySelector('[data-form-note]');
      var btn = contactForm.querySelector('button[type="submit"]');
      function val(n) { return el[n] ? el[n].value.trim() : ''; }
      function done() {
        if (note) note.hidden = false;
        if (btn) { btn.textContent = T.sent; btn.disabled = true; }
      }
      // bot traps: honeypot filled or submitted too fast → skip send, still confirm
      if (val('website') || Date.now() - loadedAt < 2000) { done(); return; }
      if (btn) { btn.disabled = true; btn.textContent = T.sending; }
      var payload = {
        brand: 'Sparkle',
        name: val('name'),
        phone: val('contact'),
        subject: val('service'),
        area: val('area'),
        message: val('message'),
        email: '',
        lang: lang,
        lead_source: leadSource,
        website: '',
        form_dwell_ms: Date.now() - loadedAt
      };
      fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(function () {}).finally(function () { contactForm.reset(); done(); });
    });
  }
})();
