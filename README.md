# SiteBlueprint

Catalog of replicable AI system prompts for web applications, plus a reverse-prompt generator for new sites.

Hosted at [clarkngo.github.io/site-blueprint](https://clarkngo.github.io/site-blueprint/).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build uses the `/site-blueprint/` base path. Pushes to `main` build `dist` and deploy it to GitHub Pages.

## Data

Starter cards live in `src/data/blueprints.json`. Cards added in the browser stay in `localStorage` until you export the catalog as JSON.
