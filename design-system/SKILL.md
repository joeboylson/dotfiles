---
name: slag-design-system
description: Joe's house visual style for anything with a user interface — web pages, artifacts, dashboards, mockups, docs sites, READMEs rendered as HTML, app screens. Slag palette, Geist and Geist Mono, five type sizes, Fibonacci spacing, and the quiet editorial layout of cognition.com. Use whenever you are about to write HTML, CSS, JSX, or Tailwind that a person will look at, and whenever Joe says "use my design system", "house style", "slag style", or "make it look like mine".
---

# Slag Design System

The source of truth is `tokens.css`, sitting next to this file at
`~/.claude/skills/slag-design-system/tokens.css`. Read it before you write any
styles. `styleguide.html` in the same folder shows every token rendered — open
it in a browser to check a decision.

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
