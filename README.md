# Sparkle Hua Hin — Cleaning Services

Landing page for a professional cleaning service on the Gulf coast of Thailand
(Hua Hin, Cha-Am, Pranburi). Single-page static site, no build step.

**Live site:** https://sebastien544.github.io/hua-hin-cleaning/

## Stack

- Plain HTML / CSS / vanilla JS — no framework, no dependencies
- Type: Cabinet Grotesk (display) + Plus Jakarta Sans (body)
- Inline SVG icon sprite, orchestrated hero entrance animation
- Responsive, keyboard-accessible, respects `prefers-reduced-motion`

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server
# then visit http://localhost:8000
```

## Structure

```
index.html          # the page
assets/styles.css   # styles + design tokens
assets/script.js    # nav, floating contact, scroll reveals, demo form
assets/img/         # gallery photos
```

## Notes before going live

- The contact form is a **demo** — wire it to email / LINE / a form service to receive leads.
- Replace placeholder contact details (phone, LINE, email) with the real ones.
- Gallery photos are royalty-free placeholders ([Unsplash license](https://unsplash.com/license)) — swap in real before/after shots when available.
