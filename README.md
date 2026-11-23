# malak-dev

Portfolio of Malak Alomary, Senior Frontend Engineer. Plain HTML, CSS and JavaScript with no build step, published with GitHub Pages at https://malakalomari.github.io/malak-dev/.

## Structure

```
index.html                 English home
work/<slug>/index.html     English case studies
ar/                        Arabic (RTL) mirror of every page
assets/css/tokens.css      colors, type, spacing, motion (edit the look here)
assets/css/base.css        reset, typography, buttons, sections
assets/css/layout.css      header, mobile menu, footer, case page frame
assets/css/sections.css    home page sections (hero, work, about, contact)
assets/css/case.css        case study pages
assets/js/main.js          mobile menu, copy email, scroll reveal, count-up, nav highlight
assets/fonts/              self-hosted fonts (OFL)
404.html                   served by GitHub Pages for missing paths
sitemap.xml                list of all pages with their English/Arabic pairs
assets/img/og-en.png, og-ar.png   link preview images (LinkedIn, WhatsApp, X)
```

Case study slugs: `marketplace-web`, `map-search`, `admin-console`, `web-chat`.

All links and assets use relative paths so the site works under the `/malak-dev/` subpath; only `404.html` uses absolute `/malak-dev/...` paths because GitHub Pages serves it at any depth.

## Preview locally

```bash
python3 -m http.server 8000 --directory ..
# open http://localhost:8000/malak-dev/
```

## Publish

1. Create a GitHub repo named `malak-dev` and push this folder to `main`.
2. Settings → Pages → Build and deployment → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site appears at https://malakalomari.github.io/malak-dev/.

## After publishing

- Check the link preview with LinkedIn's Post Inspector (https://www.linkedin.com/post-inspector/) using https://malakalomari.github.io/malak-dev/.
- Submit `https://malakalomari.github.io/malak-dev/sitemap.xml` in Google Search Console to get the English and Arabic pages indexed.

## Editing tips

- Change colors, fonts or spacing in `assets/css/tokens.css`; both themes are defined there.
- English and Arabic pages are separate files: when you change text on one, change its pair too.
- Animations live at the end of `assets/css/base.css` and `assets/js/main.js`; they switch off for visitors who prefer reduced motion.
