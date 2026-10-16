---
name: slag-design-system
description: Joe's house visual style for anything with a user interface — web pages, artifacts, dashboards, mockups, docs sites, READMEs rendered as HTML, app screens, dev tools. Slag palette, Geist and Geist Mono, five type sizes, Fibonacci spacing, in two modes — editorial (the quiet layout of cognition.com, for decks, explainers, docs) and workbench (dense and VS Code-like, for apps, dashboards, internal and dev tools). Use whenever you are about to write HTML, CSS, JSX, or Tailwind that a person will look at, and whenever Joe says "use my design system", "house style", "slag style", or "make it look like mine".
---

# Slag Design System

The source of truth is `tokens.css`, sitting next to this file at
`~/.claude/skills/slag-design-system/tokens.css`. Read it before you write any
styles. `styleguide.html` in the same folder shows every token rendered — open
it in a browser to check a decision.

## Pick a mode first

The palette, fonts, number rule, hairlines, and one-accent rule are shared. Only
density and layout change.

| Mode | For | Files |
| --- | --- | --- |
| **Editorial** (default) | Slides, explainers, docs, reports, landing pages — things read top to bottom | `tokens.css`, `styleguide.html` |
| **Workbench** | Apps, dashboards, admin panels, dev and internal tools — things people work in | `tokens.css` + `workbench.css`, `workbench.html` |

If the page has a sidebar, tabs, panes, or a table people scan all day, it's
workbench. If someone scrolls it once to understand something, it's editorial.
Everything below this section describes editorial; workbench overrides are in
**Workbench mode** at the end.

## How to use it

1. **Read `tokens.css`.** Never retype the values from this document; they drift.
2. **Copy the whole file in** as a stylesheet, a `<style>` block, or the
   `:root` block of a Tailwind theme. Do not hand-pick a few variables.
3. **Style with the variables, never raw hex or pixels.** `var(--accent)`, not
   `#fabd2f`. `var(--space-5)`, not `21px`.
4. **Use the helper classes** already in the file — `.container`, `.section`,
   `.prose`, `.stack`, `.grid`, `.section-head`, `.display`, `.label`, `.lead`,
   `.btn`, `.card`, `.tag`, `.input` — before you invent a new one.

## The number rule

Every size in the system is a Fibonacci number in pixels:

    3  5  8  13  21  34  55  89  144  233  610  987

Spacing, radius, section padding, the reading column, the page frame, and the
two transition durations all come off that list. If a measurement isn't on the
list, it's wrong — round to the nearest one rather than splitting the difference.

Type is the one exception, and only because pure Fibonacci jumps too hard between
13 and 21. It uses the ratio the series converges on, 1.618, anchored on 17px
body text. Three of the five sizes land on Fibonacci numbers anyway.

## Fonts

Geist for everything, Geist Mono for labels, code, and numbers. Two weights
only — 400 and 500. There is no bold.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Both fall back to the system sans and mono if the fonts fail to load.

## Type: five sizes, and that's all

| Token | Size | What it's for |
| --- | --- | --- |
| `--text-display` | 34 → 55px | One per page, at the top |
| `--text-title` | 21 → 34px | `h1` and `h2`, same size as each other |
| `--text-lead` | 21px | The sentence under a heading |
| `--text-body` | 17px | Everything you read |
| `--text-label` | 13px | Mono caps, buttons, inputs, tables |

Rules that keep it to five:

- `h1` and `h2` are the same size. Depth comes from where they sit and the mono
  number above them, not from a new size.
- `h3` and `h4` are body size in medium weight. A sub-heading is a label, not a
  headline.
- Need something to recede? Change the color to `--fg-muted`. Don't shrink it.
- Need something to stand out? Use medium weight or the mono label. Don't
  invent a size between two existing ones.
- Three line heights (`tight`, `normal`, `prose`) and three letter-spacings
  (`tight`, `normal`, `wide`). Nothing else.

The small uppercase mono label (`.label`) is the signature move — number
sections with it (`01 —`), tag a card, caption a figure.

## Color

Straight from the Slag terminal and editor theme. Light is the default, dark
follows the operating system, and `data-theme="dark"` or `"light"` on `<html>`
forces one. Anything you build has to look right in both — check it.

- One background per surface. Don't stack `--layer-1` on `--layer-2` to fake depth.
- Separate things with a hairline border, not a shadow. There are no shadow tokens.
- `--accent` does one job per screen: the hover state, the active tab, the focus
  ring. The moment there are two accents competing, both stop working.
- Secondary text is `--fg-muted`, never a lower opacity of `--fg`.

## Layout

- Page frame maxes at 987px, reading column at 610px (`.prose`).
- Sections get `--section-y` (55–89px) top and bottom. The hero gets
  `--section-y-lg` (89–144px). This is the main thing that makes it look like
  the reference — when in doubt, add room rather than take it away.
- Sections are separated by a hairline rule, which `.section + .section` handles.
- Section heads use `.section-head`: the mono number in a narrow left column,
  the heading and lead copy on the right. It collapses to one column under 768px.

## Shape and motion

- Radius: 3px for chips, 8px for inputs, 13px for cards, full round for buttons
  and tags. Nothing else.
- Transitions are 144ms on hover, 233ms for anything larger, on
  `cubic-bezier(0.2, 0, 0, 1)`. No bounce, no spring.
- Focus is always a 2px `--accent` outline at 2px offset. Never remove it.

## The feel, in a sentence

Restrained and editorial — a lot of empty space, hairline seams, one accent
doing one job, and type that gets out of the way. If it looks busy, delete
something rather than styling it.

## Workbench mode

For apps and tools. Load `workbench.css` **after** `tokens.css` and put
`data-mode="workbench"` on `<html>`. Read `workbench.css` before writing styles;
`workbench.html` is a working editor shell (explorer, tabs, code, panel, status
bar, command palette, and a Components tab) to copy patterns from.

```html
<html lang="en" data-mode="workbench">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="workbench.css">
```

What changes from editorial:

- **Type drops a register.** Same five token names, smaller values: label 11,
  body 13, lead 17, title 21, display 34 (empty states only). Code is 13px on a
  21px line (13 × 1.618). Pane headers use `.label` — the `EXPLORER` look.
- **Spacing stays at the small end** — 3, 5, 8, 13 for almost everything, 21 at
  most between groups. No `--section-y`, no hero.
- **Full-bleed panes, no page frame.** Drop `.container`, `.section`, `.prose`,
  `.section-head`. Use the shell: `.wb` grid with `.wb-titlebar`,
  `.wb-activity`, `.wb-sidebar`, `.wb-main` (`.tabs`, `.wb-editor`, `.wb-panel`),
  `.wb-status`.
- **Shell sizes are tokens, still Fibonacci:** `--row` 21 (tree rows, status
  bar), `--bar` 34 (title bar, tab bar), `--activity` 55, `--sidebar` 233,
  `--panel` 233.
- **Two surfaces are allowed:** `--surface` for the working area (editor,
  panel), `--layer-1` for chrome (title bar, activity bar, sidebar, status bar,
  inactive tabs). Hover rows use `--layer-2`; the selected row uses
  `--selection`. Still no shadows — overlays get a hairline in `--fg-muted`.
- **3px corners everywhere** (5px on cards, toasts, overlays). No pills — the
  file remaps `--radius-full` to 3px so `.btn` and `.tag` square off.
- **Accent marks what's active or focused:** the active tab's top line, the
  active activity item's left bar, the focus ring. Buttons don't turn accent on
  hover in this mode.
- **Mono carries data:** paths, IDs, counts, times, table headers, the status
  bar.
- **Motion is quicker:** 89ms hover, 144ms for anything larger.
- Extra pieces in `workbench.css`: `.kbd`, `.count`, `.dot` (color it with
  `color: var(--success)` etc.), `.icon`, `.tree`, `.tab`, `.breadcrumbs`,
  `.code` with `.tok-*` syntax colors, `.panel-tabs`, `.problems`, `.term`,
  `.palette`, `.btn--danger`.
- Under 768px the sidebar hides and the status bar drops its extras.

The feel: a calm editor. Dense but not cramped, hairlines between every pane,
color only where it means something (syntax, status, the one accent).

## Tailwind

Paste the `:root` and `[data-theme]` blocks from `tokens.css` into your global
stylesheet, then point Tailwind's theme at them:

```js
theme: {
  extend: {
    colors: {
      surface: 'var(--surface)',
      fg: 'var(--fg)',
      muted: 'var(--fg-muted)',
      accent: 'var(--accent)',
      border: 'var(--border)',
    },
    fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)' },
    fontSize: {
      label: 'var(--text-label)',
      body: 'var(--text-body)',
      lead: 'var(--text-lead)',
      title: 'var(--text-title)',
      display: 'var(--text-display)',
    },
    spacing: {
      1: 'var(--space-1)', 2: 'var(--space-2)', 3: 'var(--space-3)',
      4: 'var(--space-4)', 5: 'var(--space-5)', 6: 'var(--space-6)',
      7: 'var(--space-7)', 8: 'var(--space-8)', 9: 'var(--space-9)',
      10: 'var(--space-10)',
    },
  },
}
```
