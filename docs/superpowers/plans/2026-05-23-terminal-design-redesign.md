# Terminal Design Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the "Terminal" design direction to all pages of the Astro blog — warm neutral palette, amber accent, mono nav, terminal decorations, two/three-column page layouts.

**Architecture:** Update global CSS tokens first (all color/font vars), then shared components (BaseLayout, Header, Footer), then each page top-down. Each task is self-contained and buildable. No new dependencies needed — all fonts already installed via Fontsource.

**Tech Stack:** Astro v5, Tailwind CSS v4, TypeScript strict, @tailwindcss/typography, Inter + JetBrains Mono (Fontsource)

**Spec:** `docs/superpowers/specs/2026-05-23-terminal-design-redesign.md`

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/styles/global.css` | New color tokens, amber accent, terminal-prose heading prefix |
| Create | `src/utils/readTime.ts` | Estimate reading time from raw post body |
| Create | `src/components/TerminalBlock.astro` | macOS-style terminal window decoration |
| Modify | `src/layouts/BaseLayout.astro` | Remove max-w constraint from `<main>` |
| Modify | `src/components/Header.astro` | Terminal nav: `~/adam.busha`, mono links, status dot |
| Modify | `src/components/Footer.astro` | Minimal mono copyright |
| Modify | `src/components/TagPill.astro` | Mono bordered tag instead of rounded pill |
| Modify | `src/components/PostCard.astro` | Bordered card with index number, date, excerpt |
| Modify | `src/pages/index.astro` | Two-column home: headline + terminal block + post list |
| Modify | `src/pages/blog/index.astro` | Card grid with tag filters |
| Modify | `src/layouts/PostLayout.astro` | Three-column article: TOC sidebar \| content \| meta sidebar |
| Modify | `src/pages/blog/[...slug].astro` | Pass `slug` + `nextPost.date` to PostLayout |
| Modify | `src/pages/about.astro` | `$ whoami` layout with terminal panels |
| Modify | `src/pages/projects.astro` | Table layout with real project data |

---

## Task 1: Global CSS Tokens

**Files:**
- Modify: `src/styles/global.css`

Replace the orange-500 scale with amber oklch. Add `--color-panel`, `--color-panel-alt`, `--color-border-soft`, `--color-dim`, `--color-success`. Update all light/dark values to warm neutrals. Add `.terminal-prose` heading prefix rule.

- [ ] **Replace `src/styles/global.css` entirely with:**

```css
/* Fontsource imports */
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/500.css';

/* Tailwind v4 */
@import 'tailwindcss';
@plugin '@tailwindcss/typography';

/* Class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

/* Theme tokens exposed as Tailwind utilities */
@theme {
  --color-accent: oklch(0.62 0.16 38);
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* CSS Custom Properties */
@layer base {
  :root {
    /* Light mode — warm off-white neutrals, amber accent */
    --color-bg: #fafaf9;
    --color-bg-secondary: #ffffff;
    --color-panel: #ffffff;
    --color-panel-alt: #f3f3f1;
    --color-text: #15171a;
    --color-text-muted: #6b6864;
    --color-dim: #9a9692;
    --color-accent: oklch(0.62 0.16 38);
    --color-accent-hover: oklch(0.55 0.16 38);
    --color-border: #e5e3df;
    --color-border-soft: #eeece7;
    --color-code-bg: #f3f3f1;
    --color-code-text: #15171a;
    --color-success: #3a7d5d;
  }

  .dark {
    /* Dark mode — near-black warm, amber accent brightened */
    --color-bg: #0c0d0e;
    --color-bg-secondary: #141517;
    --color-panel: #141517;
    --color-panel-alt: #1a1c1f;
    --color-text: #e8e6e0;
    --color-text-muted: #8a8a86;
    --color-dim: #5e5e5a;
    --color-accent: oklch(0.75 0.16 38);
    --color-accent-hover: oklch(0.82 0.16 38);
    --color-border: #23252a;
    --color-border-soft: #1a1c20;
    --color-code-bg: #141517;
    --color-code-text: #e8e6e0;
    --color-success: #7fc89c;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-[var(--color-bg)] text-[var(--color-text)] font-sans antialiased;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold tracking-tight;
  }

  a {
    @apply text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors;
  }

  code {
    @apply font-mono text-sm;
  }

  :not(pre) > code {
    @apply bg-[var(--color-code-bg)] text-[var(--color-code-text)] px-1.5 py-0.5 rounded;
  }

  pre {
    @apply bg-[var(--color-code-bg)] p-4 rounded-lg overflow-x-auto;
  }

  pre.shiki,
  pre.astro-code {
    @apply bg-[var(--color-code-bg)]!;
  }

  html:not(.dark) .shiki .dark,
  html:not(.dark) .astro-code .dark {
    display: none;
  }

  html.dark .shiki .light,
  html.dark .astro-code .light {
    display: none;
  }

  ::selection {
    @apply bg-[var(--color-accent)] text-white;
  }
}

@layer components {
  .prose {
    --tw-prose-body: var(--color-text);
    --tw-prose-headings: var(--color-text);
    --tw-prose-links: var(--color-accent);
    --tw-prose-bold: var(--color-text);
    --tw-prose-quotes: var(--color-text-muted);
    --tw-prose-quote-borders: var(--color-accent);
    --tw-prose-code: var(--color-code-text);
    --tw-prose-pre-bg: var(--color-code-bg);
    --tw-prose-hr: var(--color-border);
  }

  /* Prefix h2 with ## in terminal article view */
  .terminal-prose :where(h2)::before {
    content: '## ';
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--color-accent);
  }

  /* Header bottom border */
  .header-accent {
    @apply relative;
  }

  .header-accent::after {
    content: '';
    @apply absolute bottom-0 left-0 right-0 h-px;
    background: linear-gradient(
      90deg,
      var(--color-accent) 0%,
      var(--color-accent) 20%,
      var(--color-border) 20%,
      var(--color-border) 100%
    );
  }

  /* Footer top border */
  .footer-accent {
    @apply relative;
  }

  .footer-accent::before {
    content: '';
    @apply absolute top-0 left-0 right-0 h-px;
    background: linear-gradient(
      90deg,
      var(--color-border) 0%,
      var(--color-border) 80%,
      var(--color-accent) 80%,
      var(--color-accent) 100%
    );
  }
}
```

- [ ] **Build to check for errors:**
```bash
npm run build
```
Expected: build completes, no TypeScript errors.

- [ ] **Commit:**
```bash
git add src/styles/global.css
git commit -m "feat: switch to amber oklch accent and warm neutral token palette"
```

---

## Task 2: Read-time Utility + TerminalBlock Component

**Files:**
- Create: `src/utils/readTime.ts`
- Create: `src/components/TerminalBlock.astro`

- [ ] **Create `src/utils/readTime.ts`:**

```typescript
export function readTime(body: string | undefined): string {
  if (!body) return '5 min';
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}
```

- [ ] **Create `src/components/TerminalBlock.astro`:**

```astro
---
export interface Props {
  command: string;
  output: string;
}

const { command, output } = Astro.props;
---

<div class="border border-[var(--color-border)] rounded-md font-mono text-[12.5px] overflow-hidden bg-[var(--color-panel)]">
  <div class="flex items-center gap-2 px-3.5 py-2 border-b border-[var(--color-border)] bg-[var(--color-panel-alt)] text-[var(--color-text-muted)]">
    <span class="w-2.5 h-2.5 rounded-full bg-[#e06c5e] inline-block"></span>
    <span class="w-2.5 h-2.5 rounded-full bg-[#e0c25e] inline-block"></span>
    <span class="w-2.5 h-2.5 rounded-full bg-[#7fc89c] inline-block"></span>
    <span class="ml-2.5 text-[11px]">~/adam.busha — zsh</span>
  </div>
  <div class="px-4 py-4 leading-relaxed">
    <div>
      <span class="text-[var(--color-accent)]">›</span>
      <span class="text-[var(--color-text)] ml-1">{command}</span>
    </div>
    <div class="text-[var(--color-text-muted)] whitespace-pre-wrap mt-1">{output}</div>
  </div>
</div>
```

- [ ] **Build:**
```bash
npm run build
```
Expected: passes.

- [ ] **Commit:**
```bash
git add src/utils/readTime.ts src/components/TerminalBlock.astro
git commit -m "feat: add read-time utility and TerminalBlock component"
```

---

## Task 3: BaseLayout — Remove Width Constraint

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

The current `<main>` has `max-w-3xl mx-auto px-4 sm:px-6 py-8` — pages can't go wider than 48rem. Remove that; each page now controls its own width and padding.

- [ ] **Replace the `<main>` line in `src/layouts/BaseLayout.astro` (line 64):**

Old:
```astro
    <main class="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
```

New:
```astro
    <main class="flex-1 w-full">
```

- [ ] **Build:**
```bash
npm run build
```
Expected: passes. Pages will now be full-width.

- [ ] **Commit:**
```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: make main full-width; pages own their padding"
```

---

## Task 4: Header — Terminal Nav

**Files:**
- Modify: `src/components/Header.astro`

Replace the current centered nav with the terminal-style layout: brand on left, mono nav links in center, `⌘K` + status dot + theme toggle on right.

- [ ] **Replace `src/components/Header.astro` entirely with:**

```astro
---
import ThemeToggle from './ThemeToggle.astro';

const pathname = Astro.url.pathname;

const navLinks = [
  { href: '/', label: 'index' },
  { href: '/blog', label: 'blog' },
  { href: '/projects', label: 'projects' },
  { href: '/about', label: 'about' },
];

function isActive(href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

const version = `v${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}`;
---

<header class="w-full border-b border-[var(--color-border)]">
  <nav class="flex items-center justify-between px-12 py-5 font-mono text-[13px]">
    <!-- Brand -->
    <div class="flex items-center gap-2.5">
      <span class="text-[var(--color-accent)] font-semibold">~/</span>
      <span class="text-[var(--color-text)] font-medium">adam.busha</span>
      <span class="text-[var(--color-dim)]">·</span>
      <span class="text-[var(--color-text-muted)]">{version}</span>
    </div>

    <!-- Nav links -->
    <div class="flex gap-7">
      {navLinks.map(({ href, label }) => (
        <a
          href={href}
          class:list={[
            'pb-1 no-underline transition-colors',
            isActive(href)
              ? 'text-[var(--color-text)] border-b border-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
          ]}
        >
          {label}
        </a>
      ))}
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-3.5 text-[var(--color-text-muted)]">
      <span>⌘K</span>
      <span
        class="w-2 h-2 rounded-full bg-[var(--color-success)]"
        style="box-shadow: 0 0 6px var(--color-success)"
      ></span>
      <ThemeToggle />
    </div>
  </nav>
</header>
```

- [ ] **Build:**
```bash
npm run build
```
Expected: passes.

- [ ] **Start dev server and verify:**
```bash
npm run dev
```
Open `http://localhost:4321`. Check: `~/adam.busha · v2026.05` on left, nav links in center with amber underline on active, status dot glowing green on right.

- [ ] **Commit:**
```bash
git add src/components/Header.astro
git commit -m "feat: terminal-style nav with brand, mono links, status dot"
```

---

## Task 5: Footer — Minimal Mono

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Replace `src/components/Footer.astro` entirely with:**

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="w-full footer-accent">
  <div class="px-12 py-5">
    <p class="font-mono text-xs text-[var(--color-dim)] text-center">
      © {currentYear} adam.busha
    </p>
  </div>
</footer>
```

- [ ] **Build and commit:**
```bash
npm run build
git add src/components/Footer.astro
git commit -m "feat: minimal mono footer"
```

---

## Task 6: TagPill + PostCard

**Files:**
- Modify: `src/components/TagPill.astro`
- Modify: `src/components/PostCard.astro`

### TagPill — mono border box

Replace the rounded pill with a mono-font bordered tag that matches the terminal design.

- [ ] **Replace `src/components/TagPill.astro` entirely with:**

```astro
---
export interface Props {
  tag: string;
  linked?: boolean;
}

const { tag, linked = true } = Astro.props;
const href = `/tags/${tag.toLowerCase()}`;
---

{linked ? (
  <a
    href={href}
    class="inline-block px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-sm no-underline hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors"
  >
    {tag}
  </a>
) : (
  <span class="inline-block px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-sm">
    {tag}
  </span>
)}
```

### PostCard — bordered card for blog index

PostCard is now used only on the blog index as a bordered card. The home page uses its own inline list rows.

- [ ] **Replace `src/components/PostCard.astro` entirely with:**

```astro
---
import TagPill from './TagPill.astro';

export interface Props {
  title: string;
  date: Date;
  description?: string;
  tags?: string[];
  slug: string;
  index?: number;
  readTime?: string;
}

const { title, date, description, tags = [], slug, index = 0, readTime } = Astro.props;
const iso = date.toISOString().slice(0, 10);
---

<a
  href={`/blog/${slug}`}
  class="block border border-[var(--color-border)] rounded-md bg-[var(--color-panel)] p-5 no-underline flex flex-col gap-2.5 hover:border-[var(--color-accent)] transition-colors"
>
  <div class="flex items-center gap-2.5 font-mono text-[11px] text-[var(--color-dim)]">
    <span>{iso}</span>
    {readTime && (
      <>
        <span>·</span>
        <span>{readTime}</span>
      </>
    )}
    <span class="ml-auto text-[var(--color-accent)]">#{String(index + 1).padStart(2, '0')}</span>
  </div>
  <div class="text-[19px] font-semibold tracking-tight text-[var(--color-text)] leading-snug">
    {title}
  </div>
  {description && (
    <p class="text-[13.5px] text-[var(--color-text-muted)] leading-[1.55] m-0">
      {description}
    </p>
  )}
  {tags.length > 0 && (
    <div class="flex gap-1.5 mt-auto pt-1 flex-wrap">
      {tags.map((tag) => <TagPill tag={tag} linked={false} />)}
    </div>
  )}
</a>
```

- [ ] **Build:**
```bash
npm run build
```
Expected: passes.

- [ ] **Commit:**
```bash
git add src/components/TagPill.astro src/components/PostCard.astro
git commit -m "feat: terminal-style tag pill and blog index card"
```

---

## Task 7: Home Page

**Files:**
- Modify: `src/pages/index.astro`

Two-column layout. Left: big headline, description, CTA buttons, stats row. Right: TerminalBlock + recent 3-post list.

- [ ] **Replace `src/pages/index.astro` entirely with:**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import TerminalBlock from '../components/TerminalBlock.astro';
import { readTime } from '../utils/readTime';

const allPosts = await getCollection('blog');
const publishedPosts = allPosts
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
const recentPosts = publishedPosts.slice(0, 3);

const daysSince = recentPosts.length > 0
  ? Math.floor((Date.now() - recentPosts[0].data.pubDate.valueOf()) / (1000 * 60 * 60 * 24))
  : 0;
const lastPush = daysSince === 0 ? 'today' : daysSince === 1 ? '1d ago' : `${daysSince}d ago`;
---

<BaseLayout
  title="Adam Busha"
  description="A blog about software, the slow craft of shipping small things, and whatever else I can't stop thinking about that week."
>
  <Header slot="header" />
  <Footer slot="footer" />

  <div class="grid grid-cols-[1.05fr_1fr] gap-16 px-12 pt-16 pb-16">
    <!-- Left column -->
    <div>
      <div class="font-mono text-xs text-[var(--color-text-muted)] mb-4 tracking-wide">
        <span class="text-[var(--color-accent)]">// </span>introducing
      </div>
      <h1 class="m-0 text-[56px] leading-[1.05] tracking-[-0.09rem] font-semibold">
        Hi, I'm Adam.<br />
        <span class="text-[var(--color-text-muted)]">I write things on</span><br />
        <span class="text-[var(--color-text-muted)]">the web and</span>{' '}
        <span class="text-[var(--color-accent)]">about</span>{' '}
        <span class="text-[var(--color-text-muted)]">the web.</span>
      </h1>
      <p class="mt-7 text-base leading-relaxed text-[var(--color-text-muted)] max-w-[460px]">
        A blog about software, the slow craft of shipping small things, and
        whatever else I can't stop thinking about that week.
      </p>
      <div class="mt-9 flex gap-3 font-mono text-[13px]">
        <a
          href="/blog"
          class="bg-[var(--color-text)] text-[var(--color-bg)] no-underline px-4 py-2.5 rounded font-medium hover:opacity-90 transition-opacity"
        >
          read the blog →
        </a>
        <a
          href="/projects"
          class="bg-transparent text-[var(--color-text)] no-underline px-4 py-2.5 rounded border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
        >
          $ ls projects/
        </a>
      </div>
      <div class="mt-16 flex gap-10 font-mono text-xs">
        <div>
          <div class="text-[var(--color-dim)] mb-1">POSTS</div>
          <div class="text-[var(--color-text)] text-[18px]">{publishedPosts.length}</div>
        </div>
        <div>
          <div class="text-[var(--color-dim)] mb-1">PROJECTS</div>
          <div class="text-[var(--color-text)] text-[18px]">4</div>
        </div>
        <div>
          <div class="text-[var(--color-dim)] mb-1">LAST PUSH</div>
          <div class="text-[var(--color-text)] text-[18px]">{lastPush}</div>
        </div>
        <div>
          <div class="text-[var(--color-dim)] mb-1">YEAR</div>
          <div class="text-[var(--color-text)] text-[18px]">{new Date().getFullYear()}</div>
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div class="pt-1">
      <TerminalBlock
        command="cat about.md | head -8"
        output={"# adam.busha\n> software, the web, and slow craft.\n\n  → typescript, rust, a little go\n  → typography, perf budgets, details\n  → side projects i rarely finish\n  → currently: trailmark, lichen"}
      />

      <div class="mt-7">
        <div class="flex items-baseline justify-between font-mono text-xs text-[var(--color-text-muted)] mb-3.5">
          <span>
            <span class="text-[var(--color-accent)]">$</span> ls -t blog/ | head -3
          </span>
          <a href="/blog" class="text-[var(--color-dim)] no-underline hover:text-[var(--color-text)] transition-colors">
            view all →
          </a>
        </div>
        <div class="flex flex-col">
          {recentPosts.map((post, i) => (
            <a
              href={`/blog/${post.id}`}
              class:list={[
                'grid grid-cols-[90px_1fr_auto] gap-4 py-3.5 items-baseline no-underline group',
                i === 0
                  ? 'border-t border-[var(--color-border)]'
                  : 'border-t border-[var(--color-border-soft)]',
                i === recentPosts.length - 1 ? 'border-b border-[var(--color-border)]' : '',
              ]}
            >
              <div class="font-mono text-xs text-[var(--color-dim)]">
                {post.data.pubDate.toISOString().slice(0, 10)}
              </div>
              <div>
                <div class="text-[15px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {post.data.title}
                </div>
                <div class="text-[13px] text-[var(--color-text-muted)] mt-1 leading-[1.5]">
                  {post.data.description}
                </div>
              </div>
              <div class="font-mono text-[11px] text-[var(--color-dim)]">
                {readTime(post.body)}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Build:**
```bash
npm run build
```
Expected: passes.

- [ ] **Dev verify:**
```bash
npm run dev
```
Open `http://localhost:4321`. Check: two-column layout, big headline with amber "about" word, terminal block on right, three recent posts listed as date | title | read-time rows.

- [ ] **Commit:**
```bash
git add src/pages/index.astro
git commit -m "feat: two-column terminal home page"
```

---

## Task 8: Blog Index Page

**Files:**
- Modify: `src/pages/blog/index.astro`

Card grid with `~/blog` breadcrumb, tag filter buttons (decorative), and two-column card grid using updated PostCard.

- [ ] **Replace `src/pages/blog/index.astro` entirely with:**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import PostCard from '../../components/PostCard.astro';
import { readTime } from '../../utils/readTime';

const allPosts = await getCollection('blog');
const posts = allPosts
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

const filterTags = ['all', 'engineering', 'css', 'typescript', 'process', 'astro', 'opinion'];
---

<BaseLayout title="Blog — Adam Busha" description="Notes on shipping software.">
  <Header slot="header" />
  <Footer slot="footer" />

  <div class="px-12 pt-12 pb-16">
    <div class="flex items-baseline justify-between">
      <div>
        <div class="font-mono text-xs text-[var(--color-text-muted)] mb-2.5">
          <span class="text-[var(--color-accent)]">~/</span>blog
        </div>
        <h1 class="m-0 text-[40px] font-semibold tracking-[-0.05rem]">The blog</h1>
        <p class="mt-2.5 text-[15px] text-[var(--color-text-muted)] max-w-[480px]">
          Notes on shipping software. {posts.length} posts, most recent first. Probably typo-free.
        </p>
      </div>
      <div class="flex items-center gap-2.5 px-3.5 py-2 border border-[var(--color-border)] rounded bg-[var(--color-panel)] font-mono text-xs text-[var(--color-text-muted)]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="5" cy="5" r="3.5"/>
          <path d="M8 8l3 3"/>
        </svg>
        <span>grep posts…</span>
        <span class="ml-7 text-[var(--color-dim)]">⌘K</span>
      </div>
    </div>

    <div class="mt-7 flex gap-2 flex-wrap">
      {filterTags.map((tag, i) => (
        <button
          class:list={[
            'font-mono text-xs px-3 py-1.5 rounded border cursor-default',
            i === 0
              ? 'border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]'
              : 'border-[var(--color-border)] bg-transparent text-[var(--color-text-muted)]',
          ]}
        >
          {tag}
        </button>
      ))}
    </div>

    {posts.length > 0 ? (
      <div class="mt-9 grid grid-cols-2 gap-4">
        {posts.map((post, i) => (
          <PostCard
            title={post.data.title}
            date={post.data.pubDate}
            description={post.data.description}
            tags={post.data.tags}
            slug={post.id}
            index={i}
            readTime={readTime(post.body)}
          />
        ))}
      </div>
    ) : (
      <p class="mt-9 font-mono text-sm text-[var(--color-text-muted)]">No posts yet.</p>
    )}
  </div>
</BaseLayout>
```

- [ ] **Build:**
```bash
npm run build
```
Expected: passes.

- [ ] **Dev verify:**
Open `http://localhost:4321/blog`. Check: `~/blog` path, two-column card grid, each card has date + `#01` index number in amber, tag pills at bottom.

- [ ] **Commit:**
```bash
git add src/pages/blog/index.astro
git commit -m "feat: two-column card grid blog index with tag filters"
```

---

## Task 9: PostLayout — Three-Column Article

**Files:**
- Modify: `src/layouts/PostLayout.astro`

Replace the single-column centered article with three columns: TOC sidebar (220px) | article content | meta sidebar (220px). Add `slug` and `nextPost` props.

- [ ] **Replace `src/layouts/PostLayout.astro` entirely with:**

```astro
---
import BaseLayout from './BaseLayout.astro';

export interface Props {
  title: string;
  description: string;
  pubDate: Date;
  tags?: string[];
  image?: string;
  slug?: string;
  nextPost?: { slug: string; title: string; date: Date };
}

const { title, description, pubDate, tags = [], image, slug = '', nextPost } = Astro.props;

const isoDate = pubDate.toISOString().slice(0, 10);
---

<BaseLayout title={`${title} — Adam Busha`} description={description} image={image}>
  <slot name="header" slot="header" />
  <slot name="footer" slot="footer" />

  <div class="grid grid-cols-[220px_1fr_220px]" style="min-height: calc(100vh - 65px)">
    <!-- Left: TOC + Meta -->
    <aside class="pt-12 pl-12 pr-6 border-r border-[var(--color-border-soft)]">
      <div class="font-mono text-[11px] text-[var(--color-dim)] mb-3.5 tracking-wide uppercase">
        On This Page
      </div>
      <div class="font-mono text-xs text-[var(--color-text-muted)] space-y-1.5">
        <div class="pl-2.5 text-[var(--color-accent)] border-l-2 border-[var(--color-accent)]">
          Introduction
        </div>
        <div class="pl-2.5 border-l-2 border-transparent">Body</div>
      </div>

      <div class="mt-8 pt-4 border-t border-[var(--color-border-soft)]">
        <div class="font-mono text-[11px] text-[var(--color-dim)] mb-2.5 tracking-wide uppercase">
          Meta
        </div>
        <div class="font-mono text-[11.5px] text-[var(--color-text-muted)] leading-[1.7]">
          <div>commit&nbsp; <span class="text-[var(--color-accent)]">a47f2b1</span></div>
          <div>posted&nbsp; <span class="text-[var(--color-text)]">{isoDate}</span></div>
          {tags.length > 0 && (
            <div>tags&nbsp;&nbsp;&nbsp; <span class="text-[var(--color-text)]">{tags.join(', ')}</span></div>
          )}
        </div>
      </div>
    </aside>

    <!-- Center: Article content -->
    <div class="pt-12 px-14 pb-16 max-w-[780px]">
      <div class="font-mono text-xs text-[var(--color-text-muted)] mb-3.5">
        <span class="text-[var(--color-accent)]">blog/</span>{slug || 'post'}.md
      </div>
      <h1 class="m-0 text-[42px] font-semibold tracking-[-0.05rem] leading-[1.1] text-[var(--color-text)]">
        {title}
      </h1>
      {tags.length > 0 && (
        <div class="flex gap-2 mt-4 flex-wrap">
          {tags.map((tag) => (
            <a
              href={`/tags/${tag}`}
              class="inline-block px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-sm no-underline hover:border-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors"
            >
              {tag}
            </a>
          ))}
        </div>
      )}
      <div
        class="mt-7 prose prose-lg max-w-none terminal-prose
          prose-headings:text-[var(--color-text)]
          prose-p:text-[var(--color-text-muted)]
          prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[var(--color-text)]
          prose-code:text-[var(--color-code-text)] prose-code:bg-[var(--color-code-bg)]
          prose-pre:bg-[var(--color-code-bg)]
          prose-blockquote:border-l-[var(--color-accent)] prose-blockquote:text-[var(--color-text-muted)]
          prose-hr:border-[var(--color-border)]
          prose-li:text-[var(--color-text-muted)]
          prose-ul:text-[var(--color-text-muted)]
          prose-ol:text-[var(--color-text-muted)]"
      >
        <slot />
      </div>
    </div>

    <!-- Right: Next post + Share -->
    <aside class="pt-12 pl-4 pr-6">
      {nextPost && (
        <div class="mb-7">
          <div class="font-mono text-[11px] text-[var(--color-dim)] mb-3.5 tracking-wide uppercase">
            Next
          </div>
          <a href={`/blog/${nextPost.slug}`} class="no-underline group">
            <div class="text-[14px] font-medium text-[var(--color-text)] leading-snug group-hover:text-[var(--color-accent)] transition-colors">
              {nextPost.title}
            </div>
            <div class="mt-1.5 font-mono text-xs text-[var(--color-text-muted)]">
              {nextPost.date.toISOString().slice(0, 10)}
            </div>
          </a>
        </div>
      )}
      <div class:list={["pt-4 border-t border-[var(--color-border-soft)]", nextPost ? "" : "mt-0"]}>
        <div class="font-mono text-[11px] text-[var(--color-dim)] mb-2.5 tracking-wide uppercase">
          Share
        </div>
        <div class="flex flex-col gap-2 font-mono text-xs text-[var(--color-text-muted)]">
          <div>$ pbcopy &lt;&lt;&lt; url</div>
          <div>$ open in rss</div>
          <div>$ reply via email</div>
        </div>
      </div>
    </aside>
  </div>
</BaseLayout>
```

- [ ] **Build:**
```bash
npm run build
```
Expected: TypeScript error — PostLayout now expects `slug` and `nextPost.date`, but `[...slug].astro` doesn't pass them yet. That's fine; fix in Task 10.

- [ ] **Commit:**
```bash
git add src/layouts/PostLayout.astro
git commit -m "feat: three-column article layout with TOC and meta sidebars"
```

---

## Task 10: Update Article Slug Page

**Files:**
- Modify: `src/pages/blog/[...slug].astro`

Pass `slug` and `nextPost` (with `date`) to PostLayout. Also remove the `PostNav` slot since prev/next nav is now in the right sidebar.

- [ ] **Replace `src/pages/blog/[...slug].astro` entirely with:**

```astro
---
import { getCollection, render, type CollectionEntry } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const allPosts = await getCollection('blog');
  const publishedPosts = allPosts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return publishedPosts.map((post, index) => {
    const nextPost = publishedPosts[index - 1];

    return {
      params: { slug: post.id },
      props: {
        post,
        nextPost: nextPost
          ? { slug: nextPost.id, title: nextPost.data.title, date: nextPost.data.pubDate }
          : undefined,
      },
    };
  });
}

interface Props {
  post: CollectionEntry<'blog'>;
  nextPost?: { slug: string; title: string; date: Date };
}

const { post, nextPost } = Astro.props;
const { Content } = await render(post);
---

<PostLayout
  title={post.data.title}
  description={post.data.description}
  pubDate={post.data.pubDate}
  tags={post.data.tags}
  slug={post.id}
  nextPost={nextPost}
>
  <Header slot="header" />
  <Footer slot="footer" />

  <Content />
</PostLayout>
```

- [ ] **Build:**
```bash
npm run build
```
Expected: passes cleanly.

- [ ] **Dev verify:**
```bash
npm run dev
```
Open any blog post (e.g., `http://localhost:4321/blog/hello-world`). Check: three columns visible — left TOC sidebar, center article with `blog/hello-world.md` breadcrumb, right sidebar with SHARE commands. If a next post exists, it appears in the right sidebar.

- [ ] **Commit:**
```bash
git add src/pages/blog/[...slug].astro
git commit -m "feat: pass slug and nextPost to PostLayout, remove PostNav slot"
```

---

## Task 11: About Page

**Files:**
- Modify: `src/pages/about.astro`

Two columns: left has `$ whoami` heading + paragraphs + contact panel; right has `$ uname -a` system panel + `$ history` timeline.

- [ ] **Replace `src/pages/about.astro` entirely with:**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<BaseLayout title="About — Adam Busha" description="Hi, I'm Adam. Software, the web, and slow craft.">
  <Header slot="header" />
  <Footer slot="footer" />

  <div class="grid grid-cols-[1fr_0.85fr] gap-16 px-12 pt-16 pb-16">
    <!-- Left column -->
    <div class="max-w-[580px]">
      <div class="font-mono text-xs text-[var(--color-text-muted)] mb-4">
        <span class="text-[var(--color-accent)]">$</span> whoami
      </div>
      <h1 class="m-0 text-[56px] font-semibold tracking-[-0.09rem] leading-[1.05]">
        About,<br />at the moment.
      </h1>
      <div class="mt-8 text-base leading-[1.65] text-[var(--color-text-muted)] space-y-4">
        <p class="m-0">
          Hi, I'm Adam. I write code for the web — mostly TypeScript and Rust these days, with a
          soft spot for Go on the server.
        </p>
        <p class="m-0">
          I work on shipping small things that try to feel good to use. I care about typography,
          performance budgets, and the kind of details nobody is asked to notice.
        </p>
        <p class="m-0">
          Outside of work I read a lot, run slowly, and tinker with side projects I rarely finish.
          This blog is where I put down whatever I've been thinking about lately — half notebook,
          half public draft.
        </p>
      </div>
      <div class="mt-9 p-5 border border-[var(--color-border)] rounded-md bg-[var(--color-panel)]">
        <div class="font-mono text-[11px] text-[var(--color-dim)] mb-2.5 tracking-wide">
          $ cat /etc/contact
        </div>
        <div class="font-mono text-[13px] text-[var(--color-text)] leading-[1.8]">
          <div>
            email&nbsp;&nbsp; <a href="mailto:hi@adambusha.com" class="text-[var(--color-accent)] no-underline hover:underline">hi@adambusha.com</a>
          </div>
          <div>
            github&nbsp; <a href="https://github.com/adambusha" class="text-[var(--color-accent)] no-underline hover:underline">github.com/adambusha</a>
          </div>
          <div>
            rss&nbsp;&nbsp;&nbsp;&nbsp; <a href="/rss.xml" class="text-[var(--color-accent)] no-underline hover:underline">/rss.xml</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div>
      <div class="font-mono text-[11px] text-[var(--color-dim)] mb-3.5 tracking-wide">
        $ uname -a
      </div>
      <div class="border border-[var(--color-border)] rounded-md p-5 bg-[var(--color-panel)] font-mono text-[13px] leading-[1.7] text-[var(--color-text-muted)]">
        <div><span class="text-[var(--color-dim)]">kernel&nbsp;</span><span class="text-[var(--color-text)]">adam-busha</span></div>
        <div><span class="text-[var(--color-dim)]">arch&nbsp;&nbsp; </span><span class="text-[var(--color-text)]">x86_64 brooklyn</span></div>
        <div><span class="text-[var(--color-dim)]">shell&nbsp; </span><span class="text-[var(--color-text)]">zsh, slowly</span></div>
        <div><span class="text-[var(--color-dim)]">now&nbsp;&nbsp;&nbsp; </span><span class="text-[var(--color-text)]">writing more, shipping less</span></div>
      </div>

      <div class="mt-7 font-mono text-[11px] text-[var(--color-dim)] mb-3.5 tracking-wide">
        $ history | tail
      </div>
      <div class="font-mono text-[12.5px] text-[var(--color-text-muted)] leading-[1.9]">
        <div><span class="text-[var(--color-dim)]">2026&nbsp;</span>writing more, shipping less</div>
        <div><span class="text-[var(--color-dim)]">2025&nbsp;</span>moved to brooklyn; learned go</div>
        <div>
          <span class="text-[var(--color-dim)]">2024&nbsp;</span>started{' '}
          <a href="/projects" class="text-[var(--color-accent)] no-underline hover:underline">trailmark</a>
        </div>
        <div><span class="text-[var(--color-dim)]">2023&nbsp;</span>went freelance; bought a synth</div>
        <div><span class="text-[var(--color-dim)]">2022&nbsp;</span>finally read SICP. didn't finish.</div>
      </div>
    </div>
  </div>
</BaseLayout>
```

- [ ] **Build and verify:**
```bash
npm run build && npm run dev
```
Open `http://localhost:4321/about`. Check: two columns, `$ whoami` above large heading, contact panel with amber links, `$ uname -a` block on right, history timeline.

- [ ] **Commit:**
```bash
git add src/pages/about.astro
git commit -m "feat: terminal whoami/uname/history about page"
```

---

## Task 12: Projects Page

**Files:**
- Modify: `src/pages/projects.astro`

Replace placeholder cards with a terminal-style table. Real project data from the design.

- [ ] **Replace `src/pages/projects.astro` entirely with:**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';

const projects = [
  {
    name: 'Trailmark',
    tagline: 'Offline-first maps for hikers and trip planners.',
    stack: ['TypeScript', 'Mapbox', 'IndexedDB'],
    year: '2024 →',
    status: 'Active',
  },
  {
    name: 'Bytecount',
    tagline: 'A minimal word and reading-time counter that runs entirely in the browser.',
    stack: ['Rust', 'WASM'],
    year: '2024',
    status: 'Shipped',
  },
  {
    name: 'Lichen',
    tagline: 'A quiet RSS reader. No algorithm, no unread badge anxiety, just feeds.',
    stack: ['Go', 'React', 'SQLite'],
    year: '2023',
    status: 'Maintained',
  },
  {
    name: 'Pebble',
    tagline: 'A tiny URL shortener I host for myself, mostly to learn Workers.',
    stack: ['Cloudflare Workers', 'KV'],
    year: '2023',
    status: 'Personal',
  },
];
---

<BaseLayout title="Projects — Adam Busha" description="A short list of things I've made.">
  <Header slot="header" />
  <Footer slot="footer" />

  <div class="px-12 pt-12 pb-16">
    <div class="font-mono text-xs text-[var(--color-text-muted)] mb-2.5">
      <span class="text-[var(--color-accent)]">~/</span>projects
    </div>
    <h1 class="m-0 text-[40px] font-semibold tracking-[-0.05rem]">Things I made</h1>
    <p class="mt-2.5 text-[15px] text-[var(--color-text-muted)] max-w-[540px]">
      A short list. Some are public, some I run for myself, some I keep meaning to rewrite.
    </p>

    <div class="mt-9 border border-[var(--color-border)] rounded-md bg-[var(--color-panel)] overflow-hidden">
      <!-- Header row -->
      <div class="grid grid-cols-[32px_200px_1fr_220px_100px] gap-4 px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-panel-alt)] font-mono text-[11px] text-[var(--color-dim)] tracking-wide uppercase">
        <div>#</div>
        <div>Name</div>
        <div>What</div>
        <div>Stack</div>
        <div>Year</div>
      </div>

      {projects.map((project, i) => (
        <div
          class:list={[
            'grid grid-cols-[32px_200px_1fr_220px_100px] gap-4 px-5 py-5 items-baseline',
            i > 0 ? 'border-t border-[var(--color-border-soft)]' : '',
          ]}
        >
          <div class="font-mono text-xs text-[var(--color-dim)]">
            {String(i + 1).padStart(2, '0')}
          </div>
          <div>
            <div class="text-[17px] font-semibold tracking-tight text-[var(--color-text)]">
              {project.name}
            </div>
            <span class="mt-1 inline-block px-2 py-0.5 font-mono text-[10px] text-[var(--color-success)] border border-[var(--color-success)] rounded-sm opacity-80">
              {project.status}
            </span>
          </div>
          <div class="text-[14px] text-[var(--color-text-muted)] leading-[1.55]">
            {project.tagline}
          </div>
          <div class="flex gap-1.5 flex-wrap">
            {project.stack.map((tech) => (
              <span class="inline-block px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-sm">
                {tech}
              </span>
            ))}
          </div>
          <div class="font-mono text-xs text-[var(--color-dim)]">{project.year}</div>
        </div>
      ))}
    </div>
  </div>
</BaseLayout>
```

- [ ] **Build:**
```bash
npm run build
```
Expected: passes cleanly.

- [ ] **Dev verify:**
```bash
npm run dev
```
Open `http://localhost:4321/projects`. Check: `~/projects` breadcrumb, table with header row (#, NAME, WHAT, STACK, YEAR), four projects with green status badges and tech tag pills.

- [ ] **Final full build:**
```bash
npm run build
```
Expected: zero TypeScript errors, zero warnings, all pages generated.

- [ ] **Commit:**
```bash
git add src/pages/projects.astro
git commit -m "feat: terminal table projects page with real project data"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Color tokens (amber oklch, warm neutrals, panel/dim/success) — Task 1
- [x] BaseLayout full-width — Task 3
- [x] Header terminal nav — Task 4
- [x] Footer minimal — Task 5
- [x] TagPill mono bordered — Task 6
- [x] Home two-column with terminal block + stats — Task 7
- [x] Blog index card grid — Task 8
- [x] Article three-column — Task 9 + 10
- [x] About whoami/uname/history — Task 11
- [x] Projects table — Task 12
- [x] `## ` heading prefix in terminal-prose — Task 1 (global.css)
- [x] `readTime` utility — Task 2

**No placeholders:** All steps contain exact code.

**Type consistency:**
- `readTime(body: string | undefined): string` — used in Tasks 7 and 8
- `PostLayout.Props.nextPost: { slug: string; title: string; date: Date }` — defined in Task 9, consumed in Task 10
- `PostCard.Props.readTime?: string` — defined in Task 6, passed in Tasks 7 and 8
