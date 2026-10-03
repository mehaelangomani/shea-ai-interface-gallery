# Promptly

Landing page for **Promptly** — a tool that helps users transform simple ideas into high-quality AI prompts.

Built with **HTML**, **CSS**, and **vanilla JavaScript** only (no frameworks).

## Theme

- **Default:** dark mode (`data-theme="dark"`)
- **Toggle:** sun in dark mode (switch to light), moon in light mode (switch to dark); persisted as `promptly-theme-v2`
- An inline script in each page `<head>` applies the saved theme before paint to avoid flash

## Quick start

1. Open `index.html` in a browser, or serve the folder locally:

   ```bash
   npx serve .
   ```

2. Add your licensed hero video at:

   ```
   assets/videos/clouds.mp4
   ```

   If the video is missing or fails to load, an animated CSS cloud fallback is shown automatically.

## Structure

```
├── index.html          # Landing page
├── css/style.css
├── js/script.js
├── assets/videos/      # Place clouds.mp4 here
└── *.html              # Stub pages for navigation targets
```

## Generator CTAs

Only two links go to the generator:

- **Generate Prompt** (hero preview panel)
- **Create Your First Prompt** (final CTA section)
