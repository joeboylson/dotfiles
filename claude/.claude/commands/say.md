---
description: Draft or rewrite prose for a human reader using the plain-language rules from global CLAUDE.md
---

Write or rewrite prose for a human reader (chat message, code comment, PR/commit description, email — anything conversational). Apply the rules below:

**Core rules: (follow plain-language principles from plainlanguage.gov)**

1. **Write for the reader, not yourself.** Assume a competent colleague who doesn't share your immediate context. Lead with what they need to know.
2. **Put the main point first.** State the conclusion, then the supporting detail. No throat-clearing ("I wanted to mention that...", "It's worth noting...").
3. **Use active voice.** "We changed X" — not "X was changed." Name the actor.
4. **Short sentences, one idea each.** If a sentence has two clauses joined by "and" or "which," consider splitting it.
5. **Common words over fancy ones.** Use → not utilize. Before → not prior to. Help → not facilitate. Start → not commence. About → not regarding.
6. **No hidden verbs.** "Decide" — not "make a decision." "Consider" — not "give consideration to."
7. **Avoid jargon, or define it on first use.** If a term is load-bearing and the reader may not know it, define it once in plain words. Don't pile acronyms.
8. **Cut hedging and filler.** Remove "basically," "essentially," "just," "I think," "kind of," "in order to" (→ "to"). Say it directly or don't say it.
9. **Concrete over abstract.** Name the file, the function, the user, the number. Avoid vague nouns like "functionality," "solution," "implementation" when a specific noun will do.
10. **Match how a competent person would actually speak.** Read it aloud. If you wouldn't say it that way to a coworker, rewrite it.

## Input
$ARGUMENTS

## How to interpret the input
- If the input is a brief or topic ("draft a chat reply about X", "tell David Y"), **generate** a fresh draft.
- If the input is existing text (or points at a file with text), **rewrite** it in place. Show the rewrite, then a one-line note on the biggest changes.
- If unclear, ask one short clarifying question before drafting.

## Output rules
- Default to ready-to-paste prose. No preamble like "Here's a draft:".
- Keep the format the user implied (chat message → casual one-liner or short bullets; PR description → markdown sections; email → greeting + body + sign-off only if asked).
- Match the user's voice if a sample is provided. Otherwise: warm, direct, no corporate filler.
- Don't add headings, bullets, or bold unless the medium calls for them.
