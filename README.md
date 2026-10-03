# SHEA — AI Interface Template Collection

Static vanilla HTML, CSS, and JavaScript implementation of the SHEA landing page.

## Run locally

Open `index.html` in a browser, or use a simple static server (for example VS Code Live Server):

```bash
npx --yes serve .
```

## Structure

- `index.html` — page markup
- `style.css` — layout and visual styles (converted from Tailwind)
- `script.js` — navigation, contact overlay, video scrubbing, typewriter, category pills
- `assets/` — optional local images, videos, icons, and fonts

## Deploy

GitHub Actions workflow uploads `index.html`, `style.css`, `script.js`, and `assets/` to GitHub Pages on push to `main`.
