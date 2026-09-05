---
description: Rate the current plan or change with a "splash score" (1–10) — how big a ripple it makes across the codebase and its blast radius. Use when you want a quick read on how disruptive or far-reaching a change is.
argument-hint: [optional: the change/plan to score, if not already in context]
---

# Splash Score: $ARGUMENTS

Score the change we're currently planning (or the one described above) on the
**Splash Score** — a 1–10 read on how big a ripple this change makes. A 1 is a
pebble in a puddle; a 10 is a cannonball off the high dive.

Example call: `whats the /splash-score for this change`

If no specific change is given in `$ARGUMENTS`, score whatever plan or diff is
already in this conversation. If you can't tell what change to score, ask in one
line before scoring.

## What this measures

The Splash Score measures **blast radius**, not urgency — it's a different axis
from issue priority and from whatever review gates the project uses. A high
splash score is a signal to slow the review down and pull in the right people; it
does not replace those gates. Keep it complementary, never a substitute.

## Step 1 — Post the rating system

Always print the rubric first, exactly as below, so the reader knows how the
score was reached:

> **The Splash Score (1–10)** — how big a ripple does this change make?
>
> | Score | Band | What it means |
> |-------|------|---------------|
> | 1 | Droplet | Cosmetic only — a comment, a typo, a rename. No behavior change. |
> | 2 | Droplet | One-line logic tweak in one file. No new surface area. |
> | 3 | Ripple | Small, contained change to one component. Blast radius obvious. |
> | 4 | Ripple | One component plus its test; a self-contained new helper. |
> | 5 | Splash | Touches a few files on a shared path. Needs a test or two. |
> | 6 | Splash | A shared module changes; several callers feel it. |
> | 7 | Wave | Cross-cutting: multiple modules, or a new/changed internal API. |
> | 8 | Wave | A migration or a public contract shifts. Coordination needed. |
> | 9 | Cannonball | Architecture-level. Wide blast radius, hard to reverse. |
> | 10 | Cannonball | Foundational rip-out or rewrite. Everyone feels it; near-irreversible. |

## Step 2 — Score this change

Rate the change on four dimensions, each 1–10, then give the overall score.

- **Blast radius** — how many files, modules, or services does it touch?
- **Reversibility** — how hard is it to undo once shipped? (migrations, data,
  public contracts = low reversibility = higher splash)
- **Coordination** — how many people/teams need to know or sign off?
- **Risk** — how likely is it to break something, and how loudly?

The **overall Splash Score** is your judgment across those four — not a strict
average. A single sky-high dimension (e.g. an irreversible migration) can pull
the whole score up on its own.

## Step 3 — Output

Format the result as:

**Splash Score: 6/10 — Splash**

Then one line per dimension (`Blast radius: 4/10 — …`), each with a few words of
why. Close with a single sentence naming the one thing that most drives the
score up or down.

Apply the plain-language voice from `/say`: active, direct, no filler. No next
steps unless the score reveals a real risk worth flagging.
