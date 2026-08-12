// ===== Sparkle Hua Hin — interactions =====
(function () {
  'use strict';

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var setNav = function (open) {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setNav(!links.classList.contains('open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setNav(false);
    });
    // Escape closes and hands focus back to the button that opened it,
    // otherwise focus would be left on a link that just became unreachable
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        setNav(false);
        toggle.focus();
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
    // Dark grounds the widget can pass over — the coverage band and the footer,
    // both --teal-900. Marked with data-dark-ground rather than matched on a
    // style class, so a new dark surface only has to carry the attribute.
    // Read once: none of them move.
    var darkZones = Array.prototype.slice.call(document.querySelectorAll('[data-dark-ground]'));

    var syncFloat = function () {
      var show = window.scrollY > showAfter;
      floatWrap.classList.toggle('is-visible', show);
      if (!show) {
        floatWrap.classList.remove('open');
        if (floatToggle) floatToggle.setAttribute('aria-expanded', 'false');
      }
      // Flip the widget's tones while it sits over a dark band. Tested against
      // the toggle's own midpoint, not the wrapper, so the open menu extending
      // upward out of the band does not trigger the swap on its own.
      if (darkZones.length) {
        var mid = floatToggle.getBoundingClientRect();
        var y = mid.top + mid.height / 2;
        var onDark = darkZones.some(function (s) {
          var b = s.getBoundingClientRect();
          return b.top <= y && b.bottom >= y;
        });
        floatWrap.classList.toggle('on-dark', onDark);
      }
    };

    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; syncFloat(); });
    }, { passive: true });
    window.addEventListener('resize', syncFloat, { passive: true });
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
