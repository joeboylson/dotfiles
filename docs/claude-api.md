# Local Claude API

An always-on local HTTP API in front of Claude Code, so other things on the
machine can ask Claude something without shelling out to the `claude` command
and without an Anthropic API key. It runs on the Claude Code subscription
already signed in on that machine.

This is a writeup, not a package — the code lives outside these dotfiles, in its
own `claude-api` project. It is here because the setup is worth reusing.

It wraps [`claude-api-bridge`](https://github.com/smy383/claude-api-bridge),
pinned at `0.1.2` and vendored rather than run through `npx`, because it carries
a local patch. Launchd keeps it alive: started at login, restarted if it dies.

## Running it

```bash
./install.sh            # http://127.0.0.1:3456
PORT=8500 ./install.sh  # or somewhere else
```

Install writes a launchd agent (`dev.local.claude-api`) and starts it. After
that:

```bash
./status.sh       # up? on what port? what does launchd think?
./stop.sh         # stop, and stop launchd restarting it
./uninstall.sh    # remove the service; keeps the token database
tail -f claude-api.log
```

`status.sh` reports the process and launchd separately, and they can disagree —
a service started by hand runs fine while launchd says `not loaded`, which means
nothing brings it back after a reboot. Re-run `install.sh` to restore that.

The admin token is printed **once**, on the very first run, and only into
`claude-api.log`. `install.sh` scrapes it out into `~/.config/claude-api/token`
with mode 600 rather than leaving that to whoever ran it. If that file is empty,
the token is gone from everywhere but the log.

## Asking it something

Asking is two steps: post a question, get a request id, then poll for the
answer. Claude takes as long as Claude takes, so there is no single blocking
call.

```bash
TOKEN=$(cat ~/.config/claude-api/token)

ID=$(curl -s -X POST http://127.0.0.1:3456/api/ask \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"message":"Reply with only the word ok"}' \
  | python3 -c 'import json,sys;print(json.load(sys.stdin)["requestId"])')

curl -s http://127.0.0.1:3456/api/ask/$ID -H "Authorization: Bearer $TOKEN"
```

`GET /api/status` needs no token and is what the install script polls while
waiting for the service to come up.

## Local only, deliberately

The bridge can open a public Cloudflare tunnel, which would put a Claude
subscription on the internet behind a single token. `run.sh` passes
`--no-tunnel` and does not make that configurable.

Local only is not the same as private: anything on the machine can still reach
the port, so the token is the whole boundary between a local process and the
subscription. The bridge's own data — tokens, request history — lives in
`~/.claude-api-bridge`, which `uninstall.sh` leaves alone.

## The local patch

Two optional fields are added to `POST /api/ask`. Both are ignored when absent,
so every existing caller keeps working:

| field | what it does |
| --- | --- |
| `model` | passed to the CLI as `--model` — `haiku`, `sonnet`, `opus`, or a full id |
| `workingDir` | the directory Claude runs in for that request |

Without `model`, the CLI uses whatever that machine's Claude Code is set to in
`~/.claude/settings.json`, which is how the bridge behaved before the patch.

```bash
curl -s -X POST http://127.0.0.1:3456/api/ask \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"message":"say ok","model":"haiku"}'
```

Three edits, each marked `LOCAL PATCH` in the source:

- `src/routes.js` — reads `model` and `workingDir` off the request body.
- `src/queue.js` — holds them in memory against the request id and applies them
  when that request runs. The database schema is untouched.
- `src/claude.js` — adds `--model` to the CLI arguments.

Vendoring is what makes this survive: the copy in `vendor/` is installed with
`npm install --prefix vendor claude-api-bridge@0.1.2`, so a cleared npx cache
cannot take the patch with it. Taking a newer upstream version means
reinstalling into `vendor/` and reapplying those three edits.

## Why bother

Anything that would otherwise shell out to `claude -p` can use this instead. The
gain is that it works from a container or a background service, where the
command-line tool and its login are not available.
