# Personal Blog Site - Implementation Plan

## Quick Reference

| Item | Decision |
|------|----------|
| Framework | Astro + TypeScript |
| Content | MDX with Content Collections |
| Styling | Tailwind CSS + @tailwindcss/typography |
| Fonts | Inter + JetBrains Mono |
| Colors | Monochrome + orange/amber accent |
| Hosting | GitHub Pages (custom domain) |

---

## Phase 1: Project Setup

### Tasks
- [x] Create new Astro project with TypeScript
  ```bash
  npm create astro@latest -- --template minimal --typescript strict
  ```
- [x] Install core dependencies
  ```bash
  npm install @astrojs/mdx @astrojs/tailwind @astrojs/rss
  npm install -D tailwindcss @tailwindcss/typography
  ```
- [x] Initialize Tailwind config
  ```bash
  npx tailwindcss init
  ```
- [x] Configure `astro.config.mjs`
  - Add MDX integration
  - Add Tailwind integration
  - Set `site` URL for custom domain
  - Configure Shiki for dual-theme syntax highlighting
- [x] Configure `tailwind.config.mjs`
  - Add typography plugin
  - Set content paths
  - Define custom colors (orange accent)
- [x] Add fonts (Inter + JetBrains Mono)
  - Download and add to `/public/fonts/` OR
  - Use Fontsource packages

### Files to Create
- `astro.config.mjs`
- `tailwind.config.mjs`
- `tsconfig.json` (generated)
- `src/env.d.ts`

---

## Phase 2: Theming & Base Styles

### Tasks
- [x] Create `src/styles/global.css`
  - Define CSS custom properties for light theme
  - Define CSS custom properties for dark theme
  - Set up `@font-face` rules for Inter and JetBrains Mono
  - Base typography styles
  - Tailwind directives (`@tailwind base/components/utilities`)
- [x] Define color palette
  - Light mode: white bg, near-black text, gray accents
  - Dark mode: near-black bg, off-white text, gray accents
  - Orange accent: `#f97316` (Tailwind orange-500) or similar
- [x] Configure Shiki themes in Astro config
  - Light: `github-light`
  - Dark: `github-dark`

### CSS Variables to Define
```css
:root {
  --color-bg: ...
  --color-text: ...
  --color-text-muted: ...
  --color-accent: ...
  --color-border: ...
  --color-code-bg: ...
}
```

---

## Phase 3: Core Layouts

### Tasks
- [x] Create `src/layouts/BaseLayout.astro`
  - HTML document structure
  - `<head>` with meta, fonts, global CSS
  - Inline theme script (prevent flash)
  - Open Graph meta tags (props: title, description, image)
  - Slot for page content
- [x] Create `src/layouts/PostLayout.astro`
  - Extends BaseLayout
  - Post title, date, tags
  - Prose styling for content
  - Prev/next navigation slot

### Theme Script (inline in head)
```js
// Check localStorage, fallback to system preference
const theme = localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.classList.toggle('dark', theme === 'dark');
```

---

## Phase 4: Components

### Tasks
- [x] Create `src/components/Header.astro`
  - Navigation links: Home, Blog, Projects, About
  - Theme toggle (desktop)
  - Active link indicator (underline)
- [x] Create `src/components/MobileNav.astro`
  - Hamburger button
  - Slide-out menu
  - Links + theme toggle
  - Close button / overlay dismiss
- [x] Create `src/components/ThemeToggle.astro`
  - iOS-style switch
  - Client-side script to toggle and persist
- [x] Create `src/components/Footer.astro`
  - Copyright line only
- [x] Create `src/components/PostCard.astro`
  - Props: title, date, description, tags, slug
  - Simple list item: title (link), date, tag pills
- [x] Create `src/components/PostNav.astro`
  - Props: prevPost, nextPost
  - Previous/Next links with titles
- [x] Create `src/components/TagPill.astro`
  - Props: tag, linked (boolean)
  - Orange accent pill/chip style
- [x] Create `src/components/ProjectCard.astro`
  - Props: title, description, url, tags
  - Card layout with link

---

## Phase 5: Content Collections

### Tasks
- [x] Create `src/content/config.ts`
  - Define `blog` collection schema
  - Define `projects` collection schema (optional, could use JSON/frontmatter page)
- [x] Create `src/content/blog/` directory
- [x] Create sample blog post(s) for testing

### Blog Schema
```ts
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});
```

---

## Phase 6: Pages

### Tasks
- [x] Create `src/pages/index.astro` (Homepage)
  - Brief intro section
  - Recent posts (3-5)
  - Link to full blog
- [x] Create `src/pages/blog/index.astro` (Blog listing)
  - Fetch all posts, sort newest first
  - Filter out drafts
  - Render PostCard for each
- [x] Create `src/pages/blog/[...slug].astro` (Individual posts)
  - Dynamic route from content collection
  - PostLayout with content
  - Prev/next navigation
- [x] Create `src/pages/tags/index.astro` (All tags)
  - List all unique tags
  - Show post count per tag
- [x] Create `src/pages/tags/[tag].astro` (Filtered by tag)
  - Dynamic route
  - Posts filtered by tag
- [x] Create `src/pages/about.astro`
  - Brief bio paragraph
  - BaseLayout
- [x] Create `src/pages/projects.astro`
  - List/cards of projects
  - BaseLayout
- [x] Create `src/pages/404.astro`
  - Custom styled 404
  - Link back to home
- [x] Create `src/pages/rss.xml.ts`
  - RSS feed endpoint using @astrojs/rss

---

## Phase 7: Visual Polish

### Tasks
- [x] Implement geometric line accents
  - Corner decorations (`.corner-accent`, `.corner-accent-hover`, `.corner-accent-double`)
  - Section dividers (`.section-divider`)
  - Header/footer accent bars (`.header-accent`, `.footer-accent` with gradient borders)
- [x] Verify responsive design
  - Mobile (375px), tablet (768px), desktop (1024px+) supported
  - Hamburger menu works properly with slide-out animation
- [x] Verify dark/light mode
  - All colors swap correctly via CSS custom properties
  - Code blocks match theme with Shiki dual themes
  - No flash on page load (inline script in `<head>`)
- [x] Verify typography
  - Headings hierarchy clear (Inter font, semibold, tracking-tight)
  - Body text readable (proper line heights, muted secondary text)
  - Code font renders correctly (JetBrains Mono)
- [x] Test RSS feed validity
  - Valid RSS 2.0 XML with channel and items

---

## Phase 8: Deployment

### Tasks
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Enable GitHub Pages in repo settings
  - Source: GitHub Actions
- [ ] Configure custom domain
  - Add CNAME file to `public/`
  - Set DNS records (A records or CNAME to github.io)
  - Enable HTTPS in GitHub Pages settings
- [ ] Verify deployment works

### GitHub Actions Workflow
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

---

## Final Verification Checklist

- [ ] `npm run dev` serves site at localhost:4321
- [ ] Homepage shows intro + recent posts
- [ ] Blog listing shows all posts (newest first)
- [ ] Individual posts render MDX content
- [ ] Prev/next navigation works on posts
- [ ] Tags page lists all tags with counts
- [ ] Tag filtering shows correct posts
- [ ] About page renders
- [ ] Projects page renders
- [ ] 404 page displays for invalid routes
- [ ] Dark/light toggle works and persists
- [ ] Code syntax highlighting works in both themes
- [ ] Mobile hamburger menu slides out
- [ ] RSS feed is valid XML
- [ ] OG meta tags present (check with debugger)
- [ ] `npm run build` completes successfully
- [ ] GitHub Pages deploys on push
- [ ] Custom domain resolves with HTTPS

---

## Project Structure (Reference)

```
/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── MobileNav.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   ├── PostNav.astro
│   │   ├── ProjectCard.astro
│   │   ├── TagPill.astro
│   │   └── ThemeToggle.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   ├── 404.astro
│   │   ├── rss.xml.ts
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── tags/
│   │       ├── index.astro
│   │       └── [tag].astro
│   ├── content/
│   │   ├── config.ts
│   │   └── blog/
│   │       └── *.mdx
│   └── styles/
│       └── global.css
├── public/
│   ├── fonts/
│   └── CNAME
├── .github/
│   └── workflows/
│       └── deploy.yml
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Notes

- **Search**: Future addition — Pagefind or Fuse.js can be added without major refactoring
- **Geometric lines**: Experimental — will iterate during Phase 7
- **No analytics**: Intentionally skipped for simplicity
