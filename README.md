# Sparkle Hua Hin — Cleaning Services

Landing page for a professional cleaning service on the Gulf coast of Thailand
(Hua Hin, Cha-Am, Pranburi). Single-page static site, no build step.

**Live site:** https://sparkle.smartview-huahin.com/

The custom domain is set in `CNAME`. GitHub Pages redirects
`sebastien544.github.io/hua-hin-cleaning/` to it, and `index.html` declares the
same URL as its canonical — do not reintroduce the github.io address as a link.

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
404.html            # error page — root-relative asset paths, served at any depth
robots.txt          # allows everything, points at the sitemap
sitemap.xml         # the single URL
CNAME               # custom domain
.nojekyll           # skip the Jekyll build
assets/styles.css   # styles + design tokens
assets/script.js    # nav, floating contact, scroll reveals, quote form
assets/img/         # gallery photos
```

## Quote form

The form posts to a Make webhook shared with `smartview-live`'s contact page.
Leads are tagged `brand: "Sparkle"` and `lead_source: "sparkle"` (overridable
with `?source=`) so the scenario can tell them apart. A honeypot field and a
two-second time-trap drop bot submissions without showing an error.

## Still to do

- Gallery photos are royalty-free placeholders ([Unsplash license](https://unsplash.com/license)) — swap in real before/after shots when available. `villa.jpg` also serves as the Open Graph share image.
- The stats (500+ homes, 4.9★, 25+ cleaners) and the three testimonials are not real. They are deliberately **not** marked up in the JSON-LD.
- Confirm the "vetted & insured" and "satisfaction guarantee" claims before leaving them up.
