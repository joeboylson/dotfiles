---
name: c
description: One status check on whatever development work is running — Legion missions if there are any, otherwise branches, PRs, CI, Jira and background agents. Reports only what changed, what's waiting on Joe, and what should start next. Use when Joe says "check in", "status", "how's it going", or invokes /c.
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
- Bring up one or two concrete ideas, each with the time it would save.

## 4. Report
- **Only what changed since the last check.** A quiet check is one line.
- Lead with the state: what moved, what's done, what's stuck.
- **Waiting on Joe:** numbered, each with a recommendation, so he can answer "yes to 1, change 2".
- **If nothing is queued:** say what should start next.
- End with **Still open:** every suggestion or question Joe hasn't answered yet, repeated each
  check until he answers it.
- Plain words, short. File paths and code names only where Joe needs them to act.

## Don't
- Don't start, merge, post or move anything unless Joe asked. This skill looks and reports.
- Don't schedule yourself. Joe invokes it when he wants it.
