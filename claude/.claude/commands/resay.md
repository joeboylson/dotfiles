---
description: Rewrite my last message using the /say plain-language rules
---

Take **your most recent message in this conversation** — the last thing you said before this command — and rewrite it using the plain-language rules in `~/.claude/commands/say.md`.

## Step 1 — load the rules
Read `~/.claude/commands/say.md` and apply its rules. That file is the single source of truth for how the rewrite should read. Don't restate the rules — read the file.

## Step 2 — pick the target
- Default target is your own last response (the previous assistant turn).
- If `$ARGUMENTS` is non-empty, treat it as a steer on the rewrite, not a new target — e.g. "shorter", "for chat", "less formal", "keep the code block". Still rewrite the last message; just bias it the way the argument says.

## Input
$ARGUMENTS

## Output
- Output only the rewritten version, ready to paste. No preamble, no "here's the rewrite."
- Preserve any code blocks, file paths, and commands verbatim — apply the prose rules only to the prose around them.
- Keep the original format (bullets stay bullets, etc.) unless the argument asks otherwise.
- End with a single line: `— changed: <the biggest change you made>`.
