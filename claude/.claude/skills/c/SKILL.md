---
name: c
description: One status check on whatever development work is running — Legion missions if there are any, otherwise branches, PRs, CI, Jira and background agents. Terse list report of what changed, ending in numbered Action items for Joe. Use when Joe says "check in", "status", "how's it going", or invokes /c.
---

You check on the work in progress once and report. You don't start a loop.

## 1. Find what's running
Look for each and use what's there. None is required.
- **Legion:** a `.legion/` folder up the tree, or `~/.local/bin/legion`. If found: `legion status`,
  then `legion log --since <time since last check>` for handoffs, questions, decisions and
  "ended its turn" stalls.
- **Background agents and tasks** in this session: any still running, and any reports not yet
  passed on.
- **Branches and worktrees** for the current ticket or group: ahead/behind `develop`, uncommitted work.
- **PRs** for those branches (`gh pr list --head <branch>`): state, review comments,
  `gh pr checks`. When a check fails, read the failing job's log and name the real cause.
- **Jira** (via `twg`) for the tickets in flight. If `.legion/tools/jira-check.py` exists, use it.
- **The plan** — a ticket file, progress file or README with rounds or waits-on columns — to
  know what comes next.

## 2. Check it's working as intended
- Things match: Jira status vs. the work, PR checks vs. "done", plan vs. what's running.
- Nothing is stuck: no session idle with work queued, no question unanswered for long, no
  repeated failure.
- Calls made for Joe: any decision an agent or commander took on his behalf, especially
  anything cut from a ticket or pushed to a follow-up. Those come to Joe, with a
  recommendation.

## 3. Look for efficiencies
- Measure first: use log or commit timestamps to find the steps that take longest or repeat most.
- Prefer code over agents: a repeated action becomes a script, a fixed-shape file becomes a
  template, waiting in line becomes running at the same time.
- At most one or two ideas, each with the time it would save. They go in Action items.

## 4. Report
Terse. Lists, not paragraphs. One line per bullet. File paths and code names only where Joe needs them to act.

**Only what changed since the last check.** A quiet check is one line, plus Action items if any are open.

Shape, in this order:

```
**State:** <one line: what's running, what's done, what's stuck>

**Moved**
- <one line each>

**Stuck**            (omit if nothing)
- <what, since when, why>

**Next up**          (only if nothing is queued: what should start)
- <one line>

**Action items**
1. <the decision as a question, e.g. "Add a line so shippers run the label and lookup specs?">
   - Yes → <what happens>
   - No → <what happens>
   - Recommend: <yes/no>, <why in a few words>
2. ...
```

Action items rules:
- Everything that needs Joe goes here and only here: decisions, merges, approvals, calls an agent
  made on his behalf (especially anything cut or pushed to a follow-up), and every earlier
  suggestion or question he hasn't answered yet. Repeat unanswered ones every check until answered.
- Each item stands on its own: a question Joe can answer without reading anything above.
  Never "the change above" or "see 2".
- Numbered, so Joe can answer "yes to 1, no to 3".
- None open → `**Action items:** none.`

## Don't
- Don't start, merge, post or move anything unless Joe asked. This skill looks and reports.
- Don't schedule yourself. Joe invokes it when he wants it.
