# Terminal Design Redesign

_Spec date: 2026-05-23_

## Overview

Full visual redesign of adambusha.com applying the "Terminal" direction from the Claude Design handoff bundle. The Terminal direction is a dev-tool minimal aesthetic: JetBrains Mono primary, terminal prompt decorations, tight grid, warm neutral palette with amber oklch accent.

All 5 pages are in scope: Home, Blog index, Article view, About, Projects.

## Color tokens

Replace the current orange accent and blue-gray neutrals with the terminal palette. Changes to `src/styles/global.css`:

**Accent:** `oklch(0.75 0.16 38)` in dark mode, `oklch(0.62 0.16 38)` in light mode (~warm amber). Remove the orange-500 Tailwind scale and replace with amber equivalents.

**Dark mode:**
- bg: `#0c0d0e` (was `#0a0a0a`)
- bg-secondary / panel: `#141517`
- panel-alt: `#1a1c1f`
- text: `#e8e6e0` (warm off-white, was `#f5f5f5`)
- muted: `#8a8a86`
- dim: `#5e5e5a`
- border: `#23252a` (was `#262626`)
- border-soft: `#1a1c20`
- code-bg: `#141517`

**Light mode:**
- bg: `#fafaf9` (warm white, was `#ffffff`)
- bg-secondary / panel: `#ffffff`
- panel-alt: `#f3f3f1`
- text: `#15171a` (was `#111827`)
- muted: `#6b6864`
- dim: `#9a9692`
- border: `#e5e3df` (was `#e5e7eb`)
- border-soft: `#eeece7`

**New token:** `--color-success: #7fc89c` (dark) / `#3a7d5d` (light) — used for the green status dot.

## BaseLayout

Remove `max-w-3xl mx-auto` constraint from `<main>` — pages control their own width. Main becomes full-width flex column container. Each page uses `px-12` (48px) side padding.

## Header

Replace current `Header.astro` entirely. New layout:

```
[LEFT]  ~/  adam.busha  ·  v2026.05
[MID]   index  blog  projects  about
[RIGHT] ⌘K  ●  [ThemeToggle]
```

- Font: JetBrains Mono, 13px
- Active nav item: `color: text`, `border-bottom: 1px solid accent`
- Inactive: `color: muted`
- `~/` in accent color, `adam.busha` in text weight 500, `v2026.05` in muted
- Status dot: 8px circle, `--color-success` with glow
- Bottom border: `1px solid --color-border`
- No mobile hamburger for now (terminal direction is desktop-focused in the prototype)
- Keep `ThemeToggle` on the right, styled to fit

## Home page

Two-column grid (`1.05fr 1fr`, gap 64px), padding `64px 48px 0`.

**Left column:**
- Label: `// introducing` in mono 12px, muted, accent `//`
- H1: 56px, `Hi, I'm Adam.` + color-treated subtitle lines
- Description paragraph: 16px, muted, max-width 460px
- Two CTA buttons: `read the blog →` (filled: text-color bg) and `$ ls projects/` (ghost with border)
- Stats row: POSTS, PROJECTS, LAST PUSH, YEAR — mono 12px labels, 18px values

**Right column:**
- Terminal prompt block: fake terminal window (`$ cat about.md | head -8`) with macOS traffic-light dots
- Recent posts list header: `$ ls -t blog/ | head -3` on left, `view all →` on right
- Post rows: `date | title + excerpt | read-time` grid, separated by hairlines

Post data comes from `getCollection('blog')`, limited to 3. Stats (POSTS, PROJECTS) computed from collection counts.

## Blog index

Padding `48px 48px 0`.

- Path: `~/blog` in mono above h1
- H1: `The blog`, 40px
- Subtitle: post count + tagline
- Search hint box (decorative): mono border box with magnifier icon + `grep posts…`
- Tag filter buttons: `all`, `engineering`, `css`, `typescript`, `process`, `astro`, `opinion` — active tag filled with text color, others ghost
- Two-column card grid (`1fr 1fr`, gap 18px)

Each card:
- Date, read-time, `#01` index number (accent) — mono 11px header row
- Title: 19px weight 600
- Excerpt: 13.5px muted
- Tag pills at bottom

Tags are decorative/non-functional filters for now (no JS routing, "all" is always active).

## Post layout (article view)

Three-column layout replacing `max-w-3xl` centered view:

```
[220px TOC] | [1fr article, max 720px] | [220px meta]
```

**Left sidebar:**
- `ON THIS PAGE` label, mono 11px dim
- TOC items derived from headings — static for now, link to anchors
- `META` section below: commit hash (decorative `a47f2b1`), posted date, read time, word count

**Center column (padding `48px 56px 0`):**
- Path breadcrumb: `blog/[slug].md` in mono
- H1: 42px weight 600
- Tag pills
- Prose content — keep existing @tailwindcss/typography but reskin:
  - H2 headings get `## ` prefix in mono accent color
  - Body text color: `--color-text` (muted for paragraphs)

**Right sidebar:**
- `NEXT` section: title + date of next post
- `SHARE` section: three terminal-style commands (`$ pbcopy <<< url`, `$ open in rss`, `$ reply via email`)

The three-column layout uses CSS grid on the article wrapper, bypassing `BaseLayout`'s main padding.

## About page

Two-column grid (`1fr 0.85fr`, gap 64px), padding `64px 48px 0`.

**Left column:**
- `$ whoami` label in mono
- H1: `About, at the moment.` 56px
- Three paragraphs (from design data — replace placeholder text)
- Contact panel: `$ cat /etc/contact` header, mono contact lines (email, github, rss)

**Right column:**
- `$ uname -a` + system info panel (kernel, arch, shell, now)
- `$ history | tail` + year timeline (2022–2026)

## Projects page

Padding `48px 48px 0`.

- Path: `~/projects` in mono
- H1: `Things I made`, 40px
- Subtitle paragraph
- Full-width table panel with:
  - Header row: `#` `NAME` `WHAT` `STACK` `YEAR` — mono 11px dim, `panel-alt` bg
  - Data rows: `01` | name + status badge | tagline | tech tags | year

Real project data: Trailmark, Bytecount, Lichen, Pebble (from design data.js).

## Footer

Minimal: `© 2026 adam.busha` centered, mono small, muted. Keep `footer-accent` gradient border.

## What is NOT in scope

- `⌘K` search functionality (decorative label only)
- JavaScript tag filtering on blog index
- Dynamic TOC generation from headings (static placeholder)
- Mobile responsive breakpoints (terminal design is desktop-focused)
- Accent color switcher (amber only, user chose to switch)
