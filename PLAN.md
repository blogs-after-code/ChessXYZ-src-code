# PLAN.md: ChessXYZ

> **This file is the single source of truth for progress.** Product requirements live in [PRD.md](PRD.md).
> Update it after every task and every phase (see "How to update this file").

**Current phase:** [Phase 0: Setup](#phase-0-setup)
**Next task:** Create the Git repo and get `frontend/index.html` loading in the browser
**Last updated:** 2026-10-27

Legend: `[ ]` not started, `[~]` in progress, `[x]` done

---

## Progress summary

| Phase | Goal | Status | Done / Total |
|---|---|---|---|
| [0](#phase-0-setup) | Setup | In progress | 0 / 4 |
| [1](#phase-1-core-engine-weeks-1-5) | Core engine | Not started | 0 / 9 |
| [2](#phase-2-memes-and-accounts-weeks-6-8) | Memes and accounts | Not started | 0 / 6 |
| [3](#phase-3-money-and-first-publishing-weeks-9-12) | Payments and YouTube | Not started | 0 / 5 |
| [4](#phase-4-later) | Later | Not started | 0 / 5 |

---

## Phase 0: Setup

**Goal:** repo, folders and a page that loads.

- [ ] Create Git repo, first commit, push to GitHub
- [ ] `frontend/index.html` loads with no console errors
- [ ] Local dev server running (`npx serve .`)
- [ ] Fill `docs/THIRD_PARTY.md` for chess.js and Stockfish

**Done when:** you can open the page locally and it is in GitHub.

---

## Phase 1: Core engine (weeks 1-5)

**Goal:** paste a game, see it play, find the key moments, export a clip.

- [ ] PGN input box + chess.js parsing, with clear error for invalid PGN
- [ ] Canvas board renders a position (`board.js`)
- [ ] Move playback: play, pause, step, speed (`ui.js`)
- [ ] Chess.com + Lichess username import, pick a game (`api.js`)
- [ ] Stockfish runs in a Web Worker and returns evals (`workers/`, `analysis.js`)
- [ ] Move classification: best / inaccuracy / mistake / blunder (`analysis.js`)
- [ ] Moment detection + highlight score, top 3 clips (`moments.js`)
- [ ] Themes: 3 board colors, 2 open-licensed piece sets (`board.js`)
- [ ] Export GIF and 1080x1920 MP4 with move captions (`render.js`)

**Done when:** a stranger can paste a PGN and download a captioned vertical MP4 of a suggested clip.

---

## Phase 2: Memes and accounts (weeks 6-8)

**Goal:** the differentiator plus user accounts.

- [ ] Tagged meme library (30-50), licenses recorded in `docs/THIRD_PARTY.md`
- [ ] Rule-based meme placement per moment type, with accept / swap / remove
- [ ] Log every accept/swap (future training data)
- [ ] Supabase auth: sign up, log in, log out, password reset
- [ ] Saved projects (reopen a game with its edits)
- [ ] Free tier: 3 exports per month with watermark

**Done when:** a logged-in user can save a project and export a meme-edited clip.

---

## Phase 3: Money and first publishing (weeks 9-12)

**Goal:** first paying customer.

- [ ] Razorpay (India) + Stripe (international) subscriptions
- [ ] Webhooks with signature verification; failed payment downgrades cleanly
- [ ] Pro plan limits enforced on the backend
- [ ] Brand kit: logo, watermark, intro, colors
- [ ] YouTube OAuth + upload/schedule (start API audit early)

**Done when:** a real user can pay, get Pro features, and schedule a YouTube upload.

---

## Phase 4: Later

- [ ] Instagram scheduling (Meta app review)
- [ ] Twitch clip sharing
- [ ] Team seats + bulk export
- [ ] Model-based meme placement trained on accept/swap data
- [ ] Server-side render queue (only if browser export is too slow)

---

## Backlog / ideas (not committed)

- Templates: "Guess the move", "Rate my blunder", "Brilliant or blunder?"
- Time-pressure blunder highlight (needs PGN clock data)
- Opening name + accuracy % per side

---

## Decisions log

| Date | Decision | Reason |
|---|---|---|
| 2026-10-27 | Stockfish WASM in browser | Free, no server cost |
| 2026-10-27 | Plain HTML/CSS/JS in separate files | Learning fundamentals, owner preference |
| 2026-10-27 | Backend: Node.js + Express with Supabase (Postgres, auth, storage). Revisit at the start of Phase 2; Django is the alternative (use its own auth and Postgres, drop Supabase, never both) | One language across the project, thin backend. Phase 1 needs no backend |

---

## Changelog

| Date | Phase | What changed |
|---|---|---|
| 2026-10-27 | 0 | Project scaffolded, PRD v2.0 added |

---

## How to update this file

After every finished task, and at the end of every phase:
1. Tick the task (`[ ]` to `[x]`; use `[~]` while in progress).
2. Update the **Done / Total** and **Status** in the summary table.
3. Update **Current phase**, **Next task** and **Last updated** at the top.
4. Add one line to the **Changelog**. Add to the **Decisions log** if a choice was made.
5. When a phase is complete, confirm its **Done when** line is actually true.

---

## AI Agent section

Rules for any AI agent (Claude, Copilot, Cursor, etc.) writing code in this repo. Read this whole section before every session.

### Workflow
1. **Read this file and [PRD.md](PRD.md) first.** Work only on the **Next task** in the **Current phase**. Do not build ahead.
2. **Update this file** after each task (see "How to update this file"). Never mark a task done unless it was run and verified.
3. **One task per change.** Keep changes small and reviewable. No unrelated refactors.
4. **Do not change decisions** (stack, structure, phases) silently. Flag the change and log it in the Decisions log.

### The owner is learning
5. The owner's goal is developer-level understanding, so **explain the data flow** of every module you touch: what goes in, what happens, what comes out.
6. Prefer **hints, review and small steps**. Give full code only when asked. Never dump large amounts of code the owner cannot explain.
7. Add short comments for **why**, not what. Leave `TODO` markers for work left to the owner.
8. When giving run or test steps, use **simple numbered steps** (what to run, what to expect).

### Code rules
9. **Separate files:** HTML, CSS and JavaScript always live in their own files. No inline `<script>` logic, no inline `style=""`. Use ES modules.
10. **Respect module roles:** `api.js` (fetching), `board.js` (drawing), `analysis.js` (engine + classification), `moments.js` (detection), `render.js` (export), `ui.js` (DOM), `main.js` (wiring only). Do not mix responsibilities.
11. **Never block the main thread.** Stockfish and heavy loops run in Web Workers.
12. **No dead code, no commented-out blocks, no unused dependencies.** Clear names, small functions.
13. **New dependency?** State why, check its license, and record it in `docs/THIRD_PARTY.md` before using it.

### Correctness and safety
14. **Do not invent APIs, endpoints or library functions.** If unsure, say so and check the official docs.
15. **Handle failure paths:** user not found, API rate limits, network errors, invalid or huge PGN (set a size limit), engine timeouts. Show a clear message in the UI.
16. **Secrets:** never in frontend code or Git. Use `.env` (listed in `.gitignore`) and update `.env.example` when adding a variable.
17. **Backend rules (Phase 2+):** validate and sanitize all input, rate-limit public routes, verify payment webhook signatures, keep OAuth tokens server-side only, check plan limits on the server, not the client.
18. **Performance defaults:** engine depth 12-16 per move, throttle UI updates, free memory (revoke object URLs, terminate unused workers).

### Licensing and content
19. **Only use open-licensed or self-made assets** (piece sets, board art, memes, sounds). Never copy Chess.com or Lichess assets, or random viral clips.
20. **Stockfish is GPLv3:** keep it as a separate file, credit it and link its source in `docs/THIRD_PARTY.md`.

### Git
21. Small commits, one task each. Message format: `phaseN: short description` (example: `phase1: parse PGN with chess.js`).

### Definition of done (per task)
- It runs with no console errors.
- The failure paths in rule 15 are handled.
- You gave the owner a manual test (numbered steps).
- `PLAN.md` is updated.
