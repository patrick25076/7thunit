# 7th Unit — Marketing Site

The investor-, operator-, and recruiting-facing website for 7th Unit, a humanoid robotics company.

Plain HTML, CSS, and JavaScript. No framework, no build step, no `npm install`.

---

## What's in here

| Path | What it is |
|---|---|
| `index.html` | Homepage (hero, robot-at-work, intelligence layer) |
| `about.html` | Founder story + market data |
| `product.html` | Early-access request form |
| `os.html` | Unit OS detail page |
| `careers.html` | Open roles + application form |
| `film-en.html` / `film.html` | Data-collection landing pages (English + Russian) |
| `assets/css/styles.css` | Single stylesheet — the entire design system |
| `assets/js/main.js` | Vanilla JS — nav toggle, fade-up reveals, form handling |
| `assets/images/` | Hero photos, scene renders, founder portrait |
| `_headers`, `_redirects` | Cloudflare Pages config (security headers + URL rewrites like `/product` → `product.html`) |
| `.gitignore` | Excludes design references, Word docs, and OS junk from Git |

The folder `_local/` (if you ever see it on disk) holds design references, copy drafts, and old version snapshots. It's gitignored and stays on the developer's machine only.

---

## Run it locally

You only need to serve the files. Any static server works — there is nothing to compile.

**Easiest — VS Code:**
1. Install VS Code.
2. Install the **Live Server** extension by Ritwick Dey.
3. Open this folder in VS Code, right-click `index.html` → **Open with Live Server**.
4. Your browser opens at something like `http://127.0.0.1:5500/`.

**With Python (already installed on macOS/Linux, easy on Windows):**
```bash
cd path/to/7thUnit
python -m http.server 4173
```
Open `http://localhost:4173` in your browser.

**With Node.js:**
```bash
cd path/to/7thUnit
npx serve -l 4173
```

Edit any HTML / CSS file → save → refresh the browser. That's the whole workflow.

---

## Editing content

Each page is a single HTML file. Copy lives directly in the markup — change the text in the file and refresh.

- The `<title>` and `<meta name="description">` near the top of each page are what shows up in Google results and Slack / WhatsApp / LinkedIn link previews.
- Navigation links are repeated in every page's `<header class="nav">` block — keep them in sync across files.
- The shared footer is repeated in every page's `<footer class="footer">` block — same rule.

**After editing CSS or JS:** search every HTML file for `?v=` and bump the version number (e.g. `?v=20260518-typesize-2` → `?v=20260520-fix`). This forces visitors' browsers to fetch the new file instead of using a stale cached copy.

---

## Forms

Two forms are wired up to [Formspree](https://formspree.io), which forwards submissions to email:

| Page | Endpoint |
|---|---|
| `product.html`, `film-en.html`, `film.html` | `https://formspree.io/f/xvzleeyw` |
| `careers.html` | `https://formspree.io/f/xgopddpz` |

To change the destination email, log into Formspree with the account that owns those endpoints. To replace the endpoint entirely, search for `formspree.io` in the HTML files and swap the ID.

---

## Deploy to Cloudflare Pages

The site is set up to deploy automatically on every push to `main`.

**First-time setup:**

1. Log into the [Cloudflare dashboard](https://dash.cloudflare.com).
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Authorize GitHub and pick this repository.
4. On the build configuration screen:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
   - **Root directory:** *(leave empty)*
5. Click **Save and Deploy**. First deploy takes ~30 seconds.
6. To use your own domain, open the project → **Custom domains** → **Set up a custom domain**.

After this, every `git push` to `main` triggers an automatic deploy. The `_headers` and `_redirects` files at the repo root are picked up automatically.

---

## Updating images

Drop new images into `assets/images/` and reference them in the HTML as `/assets/images/your-file.jpg`. No upload step — they ship with the next `git push`.

Recommended formats: `.jpg` for photos, `.png` for renders with transparency, `.webp` if you want smaller file sizes (modern browsers all support it).

---

## Browser support

All evergreen browsers from 2023 onwards (Chrome, Edge, Firefox, Safari, mobile Safari, Samsung Internet). The site uses CSS `clamp()`, CSS Grid, custom properties, and Intersection Observer — all standard.

---

## Stack — kept deliberately strict

- No React, Vue, Astro, Next, or any framework
- No build step, no bundler, no transpiler
- Tailwind / Motion One available via CDN if ever needed, but currently unused
- Vanilla JS, semantic HTML5, BEM-style CSS class names
- Mobile-first CSS with `@media (min-width: ...)` desktop overrides
- Hosted on Cloudflare Pages
- Forms via Formspree (no backend required)

The simplicity is the feature — anyone who can read HTML can edit this site.
