---
description: Explain something to me like I'm a junior developer — plain language, define the jargon, and anchor it with a metaphor
---

Explain the target below as if you're mentoring a **junior developer**: someone who can code and is smart, but does **not** know this codebase, this domain, or the acronyms flying around. Make them actually understand it — and anchor it with a metaphor.

## Step 1 — load the plain-language rules
Read `~/.claude/commands/say.md` and apply its rules. That file is the single source of truth for how the prose should read. Don't restate the rules — read the file.

## Step 2 — pick the target
- If `$ARGUMENTS` is non-empty, that's what to explain — a concept, a file, a chunk of code, an error, a decision, whatever.
- If `$ARGUMENTS` is empty, explain **the thing we were just discussing** (the current topic / your last substantive message).

## How to teach it
On top of the `/say` rules, do these:
1. **Lead with the big picture.** One or two plain sentences on *what this is and why it matters* before any detail. The junior should know what they're looking at before you zoom in.
2. **Use a metaphor — required.** Map the concept onto something ordinary and familiar (a kitchen, mail, a library, a bouncer, plumbing…). Make the mapping **explicit**: say what corresponds to what ("the queue is the line at a coffee shop; the barista is the worker; …"). One strong, sustained metaphor beats three half-ones. If the topic genuinely resists metaphor, say so and use a concrete worked example instead.
3. **Define every load-bearing term on first use** — in plain words, in-line. No unexplained acronyms or insider nouns. If a term isn't load-bearing, cut it.
4. **Build from the familiar to the new.** Start where they already have intuition, add one new idea at a time. Short sentences, one idea each.
5. **Be concrete.** Name the real file, number, function, or value where it helps — but keep file paths, code, and commands verbatim; apply the plain-language rules only to the prose around them.
6. **No condescension.** Junior ≠ dim. Skip "simply" / "just" / "obviously." Respect their intelligence; only their *context* is missing.

## Output
- Lead with a short **big-picture** line, then the explanation, with the metaphor woven through (not bolted on at the end).
- Keep it as long as it needs to be and no longer — depth over padding.
- End with one line: `— in a sentence: <the whole thing compressed to one plain sentence>`.
- Then offer to go deeper on any one part.

## Input
$ARGUMENTS
