# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal GitHub profile repo for `aravindtm`. Contains:
- `README.md` — GitHub profile README with badges and stats
- `portfolio/` — React + Vite + Tailwind interactive portfolio site deployed to GitHub Pages

## Commands

All commands run from `portfolio/` directory:

```bash
cd portfolio
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build
npm run deploy       # Build + deploy via gh-pages
```

**Note:** Node is at `/opt/homebrew/bin/node` (not on default PATH in some contexts). The custom `start-dev.js` uses `process.chdir(import.meta.dirname)` to ensure Tailwind/PostCSS configs resolve correctly when vite is started from a parent directory.

## Architecture

**Stack:** React 18, Vite 5, Tailwind CSS 3, Framer Motion, React Router 6

**Routing:** Uses `HashRouter` (not BrowserRouter) for GitHub Pages SPA compatibility. URLs are `/#/about`, `/#/skills`, etc.

**Dark mode:** Class-based (`darkMode: 'class'` in Tailwind config), toggled via `ThemeToggle` component, persisted in localStorage.

**Animations:** `AnimatedSection` component wraps content with Framer Motion `whileInView` fade-in/slide-up. Used across all pages.

**Projects page:** Fetches repos live from GitHub API (`/users/aravindtm/repos`), filters out forks, sorts by stars+forks.

**Vite base path:** Set to `/aravindtm/` for GitHub Pages deployment under the repo name.

## Git Workflow

**NEVER push directly to `main`.** Always follow this workflow:
1. Create a feature branch (`git checkout -b feature/description`)
2. Commit changes to the branch
3. Push the branch and create a PR (`gh pr create` or git push + GitHub UI)
4. Merge the PR on GitHub
5. Delete the branch after merge (`git branch -d feature/description`)

## Attribution Policy

**NEVER include "Co-Authored-By" lines in commits, PRs, or documents.** No AI attribution should appear anywhere in this repository — not in commit messages, pull request descriptions, code comments, or documentation.

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys on push to `main`:
- Builds in `portfolio/` with Node 20
- Deploys `portfolio/dist/` to GitHub Pages
- Live at: https://aravindtm.github.io/aravindtm/

**Important:** GitHub Pages source must be set to "GitHub Actions" in repo settings.

## Placeholders to Update

These files contain placeholder values that need real data:
- `portfolio/src/components/Footer.jsx` — `YOUR-LINKEDIN`, `YOUR-EMAIL@example.com`
- `portfolio/src/pages/Contact.jsx` — `YOUR-LINKEDIN`, `YOUR-EMAIL@example.com`, `YOUR-FORM-ID` (Formspree)
- `portfolio/src/pages/About.jsx` — Timeline entries (company names, dates, descriptions)
- `README.md` — `YOUR-LINKEDIN-HERE`, `YOUR-EMAIL-HERE`
