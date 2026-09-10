# Portfolio — Trần Nguyễn Khánh Trình

Personal robotics portfolio, built as a static site for GitHub Pages.
No build step, no backend, no dependencies. Open `index.html` and it works.

**Live:** https://long539539.github.io/portfolio/

---

## Structure

```
portfolio/
├── index.html            Home — hero, About Me story, section previews, season timeline
├── vex.html              VEX overview — role, both seasons, full competition record
├── vex-2024-2025.html    Season one · High Stakes (first year)
├── vex-2025-2026.html    Season two · Push Back (5 competition chapters)
├── service.html          Service Learning — camps, club, FGC ambassador, house leadership
├── projects.html         Projects — Fridgi, VR Coding Challenge, engineering notebook
├── awards.html           Full record — competition, academic, leadership
├── styles.css            The whole design system (one file)
├── script.js             Scroll reveal, nav, lightbox, chapter rail, drag galleries
└── assets/
    ├── s2425/            2024–2025 High Stakes season
    ├── scrimmage/        Chapter 01 · SSIS Scrimmage
    ├── southern/         Chapter 02 · Southern Regional
    ├── taiwan/           Chapter 03 · Taiwan Signature Event
    ├── nationals/        Chapter 04 · Vietnam National Championship
    └── vsig/             Chapter 05 · Vietnam Signature Event
```

## Design system

Modern robotics × editorial portfolio × youthful engineering.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#0C0D10` | Dark sections, hero, footer |
| `--bone` | `#F3F0EA` | Paper / light sections |
| `--red` | `#E43A2B` | Signature accent (VERTEX red) |
| `--acid` | `#D8FF3E` | Accent on dark surfaces only |

Type: **Space Grotesk** (display) · **Inter** (body) · **JetBrains Mono** (technical labels).

Sections alternate light `paper` and `.dark` surfaces to give the long season page a rhythm.
Add `.dark` to a `<section>` and every component inside it re-themes automatically.

## Reusable components

`.hero` `.phero` `.rail` `.chapter` `.beats` `.statement` `.pull` `.ba` (before/after)
`.tl` (timeline) `.stats` `.previews`/`.pv` `.scard` `.fig-grid` `.bleed` `.hscroll`
`.awards`/`.aw` `.chips` `.list` `.marquee`

Add `.rv` to any element for a scroll reveal (`.rv-d1`–`.rv-d4` stagger the delay).
Add `.clickable` to a `.fig` to make the photo open in the lightbox.

## Editing notes

- **Images** live only in `assets/<event>/`. Paths are relative, so the site works at
  `username.github.io/repository-name/` without changes. Never use a leading `/`.
- Everything below the first screen is `loading="lazy"`; heroes use `fetchpriority="high"`.
- Source photos were resized to max 1800px and saved as progressive JPEG (quality 86).
  Keep new photos under ~400 KB.
- Every image needs a real `alt`. Captions go in `<figcaption class="cap">`.
- To add a chapter to the Push Back season: copy a `<section class="chapter">` block,
  give it a new `id`, and add a matching link to the `.rail`. The rail highlights itself.
- Motion respects `prefers-reduced-motion`. Don't add animation that can't be disabled.

## Accessibility

Skip link, focus-visible outlines, keyboard-operable lightbox (Enter/Space to open,
Escape to close), labelled nav and dialog, and alt text on every content image.

## Local preview

```bash
python -m http.server 8899
```
