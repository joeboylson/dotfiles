---
description: Orient me in the current workspace — figure out what each repo is and how they connect, then give a terse summary. Prefers CLAUDE.md and the .code-workspace file; falls back to search and parallel exploration agents. Use when I say "what's here", "orient me", or "take a look and give me a summary".
---

# WHAT'S HERE

Orient me fast. I often open a **code-workspace** whose root is just an umbrella — the real work lives in the *referenced* folders. Find those, say what each one is, and how they fit together. Cheapest accurate source first; explore only when the docs don't answer it.

Output in the **`/s` voice**: active, direct, no filler, no next-steps, no preamble. Headers + tight bullets, not prose walls.

## Step 1 — Read the room (one pass)

In the working directory (and any additional working dirs), look for both at once:

- **`*.code-workspace`** — a JSON file with `"folders": [{ "path": "..." }]`. Each `path` is a referenced repo. These are the real targets.
- **`CLAUDE.md`** — read it if present; it often already describes the setup.

Resolve targets:

- **`.code-workspace` found** → the target set is its referenced folders (skip the umbrella root itself unless it holds real code).
- **No `.code-workspace`** → the single target is the current folder.

## Step 2 — What each repo is (cheapest source first)

For **each** target repo, in order, stop as soon as you have a clear one-liner:

1. The repo's **own `CLAUDE.md`**, then its **`README`** — the cheapest accurate "what is this + stack".
2. If those are missing or too thin, spawn **one `Explore` agent per repo, in parallel** (single message, multiple Agent calls) — each returns a short "what this repo is" blurb and its stack/language. Their file-dumps stay out of the main context; you keep only the conclusion.

## Step 3 — How they connect (only with 2+ repos)

Run **one search pass** over the cross-repo relationships — who calls whom, shared contracts, the umbrella wiring — using whatever code/knowledge search you have available (or a focused `Explore` agent if none). Skip this step entirely when there's only one target.

## Step 4 — Summarize (`/s` voice)

Print, tersely:

- **Repos** — one line per repo: name → what it is + stack.
- **How they connect** — a few bullets on the wiring (omit if single repo).

Do **not** include current work state (branches, PRs) or how-to-run instructions unless I ask — this skill answers "where am I and what's here", nothing more.
