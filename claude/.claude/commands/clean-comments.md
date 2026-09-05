---
description: Clean code comments — keep only business-logic ("why") and non-obvious clarification, delete the rest, and rewrite the keepers using the /say plain-language rules
---

Clean the comments in code. A comment earns its place only if it explains **why** (business logic, a non-obvious decision, a constraint, a gotcha) or **clarifies code a competent reader couldn't infer from the code itself**. Everything else gets deleted. The comments that survive are rewritten in plain language.

## Step 1 — load the prose rules
Read `~/.claude/commands/say.md` and apply its plain-language rules to the wording of every comment you keep. Those rules are the single source of truth for *how a kept comment should read* (active voice, main point first, common words, no hedging/filler, concrete over abstract). Do not restate them here — read the file.

## Step 2 — decide the scope
- If `$ARGUMENTS` names a file, directory, or glob, operate on exactly that.
- Otherwise, operate on **every file in the current git diff**. Get the list with `git diff --name-only HEAD` plus untracked files (`git ls-files --others --exclude-standard`). Skip binaries, lockfiles, and generated files.

## Input
$ARGUMENTS

## Step 3 — the keep/delete test
For each comment, ask: *does this tell the reader something the code can't?*

**KEEP (then rewrite with the /say rules):**
- **Why** — the business reason, the rule from a spec, why this and not the obvious alternative.
- **Non-obvious clarification** — a workaround, an ordering constraint, a unit/edge case, a "looks wrong but isn't," a link to a ticket/issue explaining context.
- Public API / docstrings that describe contract, params, return, or errors.

**DELETE:**
- Comments that restate the code (`// increment i`, `// set name to name`).
- Decoration, banners, section dividers, signatures, dated change-logs.
- Commented-out / dead code.
- TODO / FIXME / HACK / XXX markers — the user has chosen to delete these too. (If one references an open ticket or encodes a real constraint, surface it in your summary before deleting so it isn't lost.)
- Redundant boilerplate added by generators or by habit.

When unsure whether a comment carries real "why," lean toward keeping it but rewrite it to make the "why" explicit. If it has no "why" to make explicit, delete it.

## Step 4 — apply
Edit the files in place. Delete the dead comments; rewrite the survivors so each reads the way a competent colleague would say it out loud. Don't touch the code logic — only comments.

## Output
After editing, give a short summary per file:
- count deleted, count rewritten, count left as-is
- call out any deleted TODO/FIXME that referenced a ticket or a real constraint, so the user can decide whether to track it elsewhere

No preamble. If the scope resolves to zero files (clean diff, no argument), say so and stop.
