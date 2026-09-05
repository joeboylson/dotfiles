---
description: Gather context on a claim, then adversarially stress-test it
argument-hint: [claim or assumption to vet]
model: opus
context: fork
---

# Vet: $ARGUMENTS

Run two phases. Do not let phase 1's framing leak into phase 2.

## Preflight — pin the ref (before any scouting)
If the claim touches code, a repo, or a PR, first decide **which ref** it lives
on (PR head branch, `develop`, `main`, a tag, a sha). Verify load-bearing facts
against the live HEAD of that ref — e.g. `gh api .../contents/...?ref=<ref>` — not
against a cached index, search tool, PR comments, or docs, which can lag the
branch.

If you can't tell which ref, **ask the user before spawning anything.** Then pass
that ref to every scout and require them to verify any load-bearing fact — "this
consumer exists," "this comparison runs," "this caller reads that column" — on
that ref. Agreeing snapshots from the same era are one source, not many. A common
miss: a blocker resting on diff code that had already been deleted from the
branch — the red team must attack whether the premise still exists in the
*current* code, not just whether it's plausible.

## Sizing the fan-out
Cover the claim from as many **distinct, non-overlapping angles** as are
reasonable — one agent per angle, not a fixed count. Let the claim set the
number:
- Broad or vague claims open many independent angles → more agents.
- Narrow, specific claims collapse to a few real angles → fewer agents.
Add an agent only when it attacks something the others can't reach. Stop when
the next agent would just rephrase an existing one. Don't pad to hit a number,
and don't cap yourself at a small one if the claim genuinely splits more ways.

## Confirm before spawning
Before launching any subagents, report to the user:
- The angles you've identified (one line each) and the agent count that implies.
- Which phase each belongs to.
Write this plan using the `/say` plain-language rules from global CLAUDE.md.
Wait for the user to confirm or adjust the plan. Do NOT spawn until they approve.

## Phase 1 — Scouts (gather)
Spawn one subagent per gathering angle, in parallel, to collect grounding
context on: $ARGUMENTS
- Pull relevant code, docs, prior decisions, and external facts.
- Each returns: what's established, what's assumed, what's unknown.
- Scouts describe; they do NOT defend or conclude.

## Phase 2 — Red team (challenge)
Spawn one subagent per attack angle, whose ONLY mandate is to break the claim.
Give each the scout findings but a distinct angle, e.g.:
- "Find the strongest reason this is wrong."
- "What load-bearing assumption is unstated, and what if it's false?"
- "Where does the evidence actually not support the conclusion?"
Generate as many distinct angles as the claim warrants — the list above is a
starting set, not a limit.

## Synthesis
Report back to the main thread:
1. The claim, restated precisely.
2. What survived scrutiny vs. what cracked.
3. Assumptions that are doing more work than acknowledged.
4. A confidence level + what evidence would change it.
