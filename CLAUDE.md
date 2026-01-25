# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start local development server at localhost:4321
- `npm run build` - Create production build to `./dist/`
- `npm run preview` - Preview production build locally

## Tech Stack

- **Framework**: Astro v5 with TypeScript (strict mode)
- **Content**: MDX with Content Collections
- **Styling**: Tailwind CSS v3 with @tailwindcss/typography plugin
- **Fonts**: Inter (sans) + JetBrains Mono (mono) via Fontsource
- **Hosting**: GitHub Pages with custom domain

## Architecture

### Theming System

Dark/light mode uses CSS custom properties defined in `src/styles/global.css`:
- Variables: `--color-bg`, `--color-text`, `--color-text-muted`, `--color-accent`, `--color-border`, `--color-code-bg`, `--color-code-text`
- Toggle: Class-based (`darkMode: 'class'` in Tailwind config)
- Persistence: localStorage with system preference fallback
- Flash prevention: Inline script in `<head>` (see BaseLayout.astro)

### Layouts

- `BaseLayout.astro` - Document wrapper with meta tags, theme script, named slots for header/footer
- `PostLayout.astro` - Extends BaseLayout with article styling, date/tags header, prose content area

### Code Syntax Highlighting

Shiki with dual themes configured in `astro.config.mjs`:
- Light: `github-light`
- Dark: `github-dark`

### Color Palette

- Orange accent: `#f97316` (Tailwind orange-500) with full 50-950 scale in `tailwind.config.mjs`
- Light mode: White background, near-black text
- Dark mode: Near-black background, off-white text

## Git Commits

Do not include AI attribution (Co-Authored-By) in commit messages.

## Implementation Plan

See `PLAN.md` for the 8-phase implementation roadmap. Current status: Phases 1-3 complete (setup, theming, layouts). Phase 4 (components) is next.
