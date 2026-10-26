# PRD: ChessXYZ (working title)

**Version:** 2.0 (supersedes the earlier draft)
**Owner:** Divyansh Seth
**Status:** Draft, ready to build Phase 0 and 1
**Companion files:** [PLAN.md](PLAN.md) (progress and AI agent rules), [docs/THIRD_PARTY.md](docs/THIRD_PARTY.md) (licenses)

---

## 1. Summary

ChessXYZ is a web toolkit for chess content creators. It turns a chess game (from Chess.com, Lichess or a pasted PGN) into post-ready content: captioned vertical videos, GIFs and key-moment clips, with a meme layer, and later scheduled publishing to YouTube and Instagram.

**Pitch:** from game to a ready-to-post Reel in two minutes instead of an hour in an editor.

**Owner goal:** build a real full-stack product solo to gain developer-level understanding. Revenue is a long-term outcome, not a short-term target.

---

## 2. Problem

- Chess creators post often, but most time goes into editing: recording a board, hunting for the interesting move, adding captions and effects.
- Chess.com and Lichess offer a PGN, a static image, a square GIF of the whole game and move labels. They do not produce vertical video, key-moment clips, memes or publishing.
- General video editors know nothing about chess, so every clip is manual work.

**Evidence status:** these are assumptions until validated. Validation plan in section 12.

---

## 3. Users and jobs to be done

| Persona | Job to be done | Willingness to pay |
|---|---|---|
| **Creator** (chess YouTuber or Instagram page, 5K to 500K followers) | "Turn my game into a Reel quickly, with a hook." | High |
| **Coach** (markets on social media) | "Make a clip of my student's mistake for a lesson post." | Medium to high |
| **Club or academy page** | "Post branded results and highlights." | Medium |
| **Casual player** | "Make a funny clip of my blunder." | Low (free tier) |

**Primary persona for v1:** Creator. Every decision is checked against: does this save a creator time or make their clip more shareable?

---

## 4. Goals, non-goals, principles

**Goals**
1. Export a captioned 9:16 MP4 from any game in under two minutes.
2. Auto-suggest the three most clip-worthy moments in a game.
3. Meme overlays matched to the moment type, editable in one click.
4. A free tier that works, and a Pro tier worth paying for.

**Non-goals (v1)**
- Competing with Chess.com or Lichess on analysis depth or full game review.
- Live game streaming overlays.
- A native mobile app.
- Social scheduling (Phase 3 and later).
- A general-purpose video editor.

**Principles**
- Engine analysis finds moments. It is never the product.
- Ship each phase to real use before starting the next.
- Own or license every asset.
- The owner must be able to explain every module.

---

## 5. Differentiation vs Chess.com and Lichess

| Capability | Chess.com / Lichess today | ChessXYZ |
|---|---|---|
| PGN export, image, square GIF | Yes | Yes (parity) |
| Move labels (best, blunder) | Yes | Yes (used internally) |
| 9:16 video with captions | No | **Yes** |
| Key-moment clips (zoom, freeze, eval swing) | No | **Yes** |
| Memes matched to tactics | No | **Yes** |
| Multi-source in one workflow | Each site only its own | **Yes** |
| Brand kit (logo, intro, watermark) | No | **Yes** (Phase 3) |
| Scheduling to YouTube / Instagram | No | **Yes** (Phase 3+) |

**Main risk:** Chess.com could add video export. Defense: creator-specific workflow, memes, multi-source support and brand kit.

---

## 6. Functional requirements

Priority: **P0** must ship in the phase, **P1** should, **P2** could.

### Phase 1: Core engine

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| F1 | Import by PGN paste | P0 | Valid PGN loads. Invalid or over-limit PGN (more than 200 KB) shows a clear error. |
| F2 | Import by username (Chess.com, Lichess) | P0 | Enter a username, see the last 20 games with result, opponent and date. Pick one to load. Unknown user and rate-limit errors are handled. |
| F3 | Board playback | P0 | Play, pause, step forward/back, speed control, flip board. |
| F4 | Engine analysis | P0 | Stockfish runs in a Web Worker. UI stays responsive. Progress bar shown. Each position gets an eval. |
| F5 | Move classification | P0 | Each move labeled best, good, inaccuracy, mistake or blunder (rules in section 8). |
| F6 | Moment detection and ranking | P0 | Blunders, brilliant moves and mates flagged. Top 3 clips suggested with a label and a score. |
| F7 | Themes | P1 | 3 board colors and 2 open-licensed piece sets, switchable live. |
| F8 | Export GIF | P0 | Whole game or a clip as GIF, up to 480 px wide. |
| F9 | Export MP4 | P0 | Vertical 1080x1920, 30 fps, H.264, with move captions. |

### Phase 2: Memes and accounts

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| F10 | Meme library | P0 | 30 to 50 tagged memes (fork, blunder, brilliant, mate, time scramble, resign). License recorded per file. |
| F11 | Meme placement | P0 | Each detected moment gets a suggested meme at the right square and time. User can accept, swap or remove. |
| F12 | Placement logging | P1 | Every accept, swap and remove is stored (future training data). |
| F13 | Auth | P0 | Sign up, log in, log out, password reset, delete account. |
| F14 | Saved projects | P0 | Save and reopen a game with its settings and meme choices. |
| F15 | Free tier limits | P0 | 3 exports per month with watermark, enforced on the server. |

### Phase 3: Money and first publishing

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| F16 | Subscriptions | P0 | Razorpay (India) and Stripe (international). Webhooks update plan. Failed payment downgrades cleanly. |
| F17 | Pro limits | P0 | Plan checked on the server for every export. |
| F18 | Brand kit | P1 | Logo, watermark, intro clip and colors saved per user. |
| F19 | YouTube scheduling | P1 | Connect channel (OAuth), upload and schedule, show status. |

### Phase 4 (future)
Instagram scheduling, Twitch clip sharing, team seats, bulk export, model-based meme placement, server-side render queue, mobile-friendly UI, templates ("Guess the move", "Rate my blunder").

---

## 7. Core user flow

1. Open the site. Paste a PGN or enter a username.
2. Pick a game. The board loads and analysis starts in the background with a progress bar.
3. See three suggested clips, each labeled (for example "Blunder, move 23, queen hangs").
4. Pick a clip. Choose theme and optional meme. Preview.
5. Export MP4 or GIF. Free users get a watermark.
6. (Phase 2+) Save the project. (Phase 3+) Schedule or publish.

**Empty and error states (required):** no games found, user not found, invalid PGN, engine timeout, export failed, offline.

---

## 8. Moment detection spec (starting values, all tunable)

**Inputs:** PGN moves, Stockfish eval per position, clock times if present.

**Centipawn loss (CPL)** = eval after the best move minus eval after the played move, from the mover's side.

| Class | CPL |
|---|---|
| Best / good | below 50 |
| Inaccuracy | 50 to 99 |
| Mistake | 100 to 199 |
| Blunder | 200 or more |

Improvement later: classify by win-probability drop instead of raw centipawns, so the same CPL is judged differently in winning and equal positions.

**Brilliant move:** gives up at least 2 points of material, the eval stays within about 50 cp of the best move, and the side was not already winning by a large margin.

**Tactic tags (rule-based with chess.js, not engine-based):** fork, pin, skewer, hanging piece, back-rank mate, discovered attack.

**Highlight score** = weighted sum of: eval swing, tactic type, material change, mate proximity, and a bonus for time-pressure blunders. Weights live in one config object so they can be tuned.

**Clip window:** from 3 moves before the moment to 2 moves after, 8 to 30 seconds total.

**Validation:** test on at least 20 real games. A human checks that the top 3 clips are "the ones I would post" in at least 70% of games. Adjust weights until true.

---

## 9. Export spec

| Output | Spec |
|---|---|
| MP4 | 1080x1920, 30 fps, H.264, no audio in v1 (audio and music later) |
| GIF | max 480 px wide, 10 to 12 fps, loop |
| Captions | move in standard notation, move number, optional classification tag |
| Watermark | corner logo on free tier, removable on Pro |
| Length | clip 8 to 60 seconds. Full game up to 3 minutes |

**Rendering:** canvas frames, encoded in the browser with ffmpeg.wasm. Single-threaded build first (no special hosting headers). Multithreaded build needs COOP/COEP headers, so it is a later optimization.

---

## 10. Meme engine spec

- Each meme has: id, tag, file, type (image, gif, video, sound), license, source, created_by.
- A moment type maps to one or more tags. The engine picks the highest-matching meme not recently used in the same video.
- Placement: anchored to the relevant square (for example the forking knight's square) at the moment's timestamp, for 1 to 2 seconds.
- User controls: accept, swap (shows 5 alternatives), remove, change duration.
- **Content rules:** only self-made, licensed or user-uploaded memes. No unlicensed viral clips. A takedown path exists for reported content.
- **Future model:** train on logged accept/swap data. Do not build before 1,000 or more placement records exist.

---

## 11. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | 40-move game analyzed in under 60 s at depth 12 to 14 on a mid-range laptop. 30 s clip exported in under 90 s. (Targets, to be measured.) |
| Browsers | Latest Chrome, Edge, Firefox and Safari on desktop. Mobile layout is a later phase. |
| Reliability | Engine and export failures show a clear message and never freeze the tab. |
| Security | No secrets in frontend. Input validation and rate limiting on the API. Payment webhook signatures verified. OAuth tokens stored server-side only. |
| Privacy | Store minimum data. Games are public data, but saved projects are private to the user. Account deletion removes user data. Review India's DPDP Act obligations and get a legal read before charging users. |
| Accessibility | Keyboard-operable controls, sufficient color contrast, captions readable on video. |
| Licensing | Stockfish is GPLv3: keep it a separate file, credit it, link its source. Track every asset in `docs/THIRD_PARTY.md`. |
| Maintainability | Module roles fixed (see PLAN.md). No dead code. HTML, CSS and JS in separate files. |

---

## 12. Validation plan

Before investing in Phase 2:
1. Make 5 clips from real public games using Phase 1.
2. Show them to 10 small chess creators (5K to 50K followers) through DMs or chess communities.
3. Ask: "Would you use this weekly? Would you pay for it?" Ask for a waitlist signup, not compliments.
4. **Go signal:** at least 3 of 10 say they would use it again and at least 1 says they would pay.
5. **If no go:** keep the project as a learning build, and iterate on the clip quality before adding more features.

---

## 12b. Pricing (hypothesis, test later)

| Plan | Price | Includes |
|---|---|---|
| Free | 0 | 3 exports per month, watermark, standard themes |
| Pro | about 399 INR or 5 USD per month | No watermark, HD, unlimited clips, full meme library, custom themes |
| Studio | about 999 INR per month | Scheduling, team seats, brand kit, bulk export |

Extra: one-off meme packs and template packs.

---

## 13. Success metrics

**Learning (primary)**
- Each phase ships and is deployed.
- The owner can explain every module's data flow without help.

**Product (secondary)**
- Phase 1: 10 creators try it, 3 or more would use it again.
- Phase 2: 100 waitlist signups, 30 weekly active users.
- Phase 3: first paying customer. Long-term target 100 Pro users (about 40K INR per month).

**Analytics events to track:** `pgn_imported`, `username_imported`, `analysis_completed`, `clip_suggested`, `clip_exported`, `meme_accepted`, `meme_swapped`, `meme_removed`, `signup`, `upgrade_clicked`, `subscription_started`.

---

## 14. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | HTML, CSS, JavaScript in separate files, ES modules | Fundamentals, owner preference |
| Chess logic | chess.js | Legal moves, PGN parsing, tactic checks |
| Board rendering | Canvas, custom | Same frames feed video export |
| Engine | Stockfish WASM in a Web Worker (lite single-threaded build first) | Free, in-browser |
| Video / GIF | Canvas frames plus ffmpeg.wasm | No server render cost in v1 |
| Backend | Node.js and Express | API, proxies, webhooks, OAuth |
| Database, auth, storage | Supabase (Postgres, Auth, Storage) | One service for all three |
| Payments | Razorpay (India), Stripe (international) | Subscriptions and webhooks |
| Jobs (Phase 3+) | Cron or BullMQ with Redis | Scheduled posts |
| Hosting | Cloudflare Pages or Netlify (frontend), Render or Railway (API) | Cheap, free tiers |
| CI and errors | GitHub Actions, Sentry | Production habits |

**Backend decision:** Node + Express with Supabase for now. Phase 1 has no backend, so revisit at the start of Phase 2. Alternative: Django with its own auth and Postgres (drop Supabase, never run both).

**External APIs:** Chess.com Published Data API, Lichess API, YouTube Data API v3, Instagram Graph API. If the browser blocks a call (CORS), proxy it through the backend.

---

## 15. Architecture and data flow

1. **Import:** browser (or backend proxy) fetches PGN from Chess.com or Lichess.
2. **Parse:** chess.js converts PGN to moves and positions.
3. **Analyze:** a Web Worker runs Stockfish, returns evals.
4. **Detect:** moment rules plus scoring produce tagged moments and a ranked clip list.
5. **Render:** canvas draws frames (board, captions, memes). ffmpeg.wasm encodes to MP4 or GIF.
6. **Save and publish (Phase 2+):** backend stores projects in Supabase and calls platform APIs.

### Data model (Phase 2+)

| Table | Key fields |
|---|---|
| users | id, email, plan, created_at |
| projects | id, user_id, source, pgn, settings_json, created_at |
| moments | id, project_id, move_number, type, score, clip_start, clip_end |
| exports | id, project_id, format, file_url, created_at |
| memes | id, tag, file_url, type, license, source, created_by |
| meme_placements | id, moment_id, meme_id, action (accepted, swapped, removed), swapped_to |
| subscriptions | id, user_id, provider, status, current_period_end |
| social_accounts | id, user_id, platform, token_ref, status |
| usage | id, user_id, month, exports_count |

### API sketch (Phase 2+)

| Method and path | Purpose |
|---|---|
| POST /api/projects, GET /api/projects, GET/DELETE /api/projects/:id | Saved projects |
| POST /api/exports | Record an export and check quota |
| POST /api/webhooks/razorpay, POST /api/webhooks/stripe | Payment events (signature verified) |
| GET /api/auth/youtube, GET /api/auth/youtube/callback | YouTube OAuth |
| POST /api/schedule | Create a scheduled post |

---

## 16. Release criteria per phase

| Phase | Ready when |
|---|---|
| 0 | Page loads locally, repo on GitHub. |
| 1 | A stranger can paste a PGN and download a captioned vertical MP4 of a suggested clip, with no console errors, on Chrome and Firefox. |
| 2 | A logged-in user can save a project and export a meme-edited clip. Free limits enforced on the server. |
| 3 | A real user can pay, receive Pro features and schedule a YouTube upload. |

---

## 17. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Chess.com adds video export | High | Compete on workflow, memes, multi-source, brand kit |
| Meme copyright claims | High | Owned or licensed library only, takedown path, license per file |
| Piece and board art licensing | Medium | Open-licensed sets only, recorded in THIRD_PARTY.md |
| Stockfish GPL obligations | Medium | Separate file, credit, source link |
| YouTube and Instagram approvals are slow | Medium | Apply early, ship download and copy-caption first |
| Browser rendering too slow or memory heavy | Medium | Lower resolution option, short clips, server queue later |
| Small niche, slow revenue | Medium | Treat as learning-first, reuse the stack for later projects |
| Chess.com API changes or rate limits | Low to medium | Cache, backoff, backend proxy, Lichess as fallback |
| Scope creep | High | One task at a time, tracked in PLAN.md |
| Copy-paste coding without understanding | High | Learning rules in PLAN.md, explain data flow per module |

---

## 18. Assumptions to verify

- Creators will pay for time saved on clips.
- A browser-only pipeline (Stockfish WASM plus ffmpeg.wasm) is fast enough on typical laptops.
- Rule-based moment detection picks clips creators actually want.
- Memes improve engagement enough to be a selling point.

---

## 19. Open questions

- Product name and domain.
- Meme sourcing: self-made, licensed packs, user uploads only, or a mix.
- Whether audio and music is in scope for v1.
- Which piece sets and licenses to bundle.
- Whether to support Lichess studies and tournament PGNs in Phase 1.
- Legal review for payments, privacy and terms of service before launch.

---

## 20. Glossary

- **PGN:** text format for a chess game.
- **FEN:** text format for a single position.
- **CPL:** centipawn loss, how much worse a move is than the best move.
- **Moment:** a notable point in a game (blunder, brilliancy, mate).
- **Clip:** a short video window around a moment.
- **Highlight score:** how clip-worthy a moment is.
