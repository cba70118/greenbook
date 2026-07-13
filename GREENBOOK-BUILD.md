# GREENBOOK — Build Handoff & Spec
**Written:** 2026-07-12 (before context clear) | **Read this first, then continue with "PENDING: Piece 3".**

The greenbook was rebuilt this session into a **growing, outward-facing golf-intelligence product**
(public) + a **gated internal war room** (the original full app). This file is the source of truth for
where things stand and what's left to build. Preview quirk: **`file://` ignores the `?v=` cache-bust** —
to see changes locally, hard-refresh (Ctrl+Shift+R) or open an Incognito window; GitHub Pages honors `?v=`.

---

## The vision (don't lose this)
The greenbook is NOT a personal bet tracker. It is an **ever-growing golf-intelligence resource, useful to
other people** — individual golfer data + accumulated learnings that deepen every event. The **golfer is the
hub**: stats + what we've learned (with confidence) + course fit. Courses and the weekly read link back to
golfers. The betting record is the *proof the intelligence works*, not the main event.

## Two faces
- **`index.html` = PUBLIC** (light editorial theme). Anyone can view. The intelligence product.
- **`war-room.html` = INTERNAL** (dark theme, auth-gated via `auth.js`). The original full app, all tools intact.
  Has a `← Public Greenbook` link; public has a brass `War Room ▸` link. Do NOT change the auth gate.
- `index-legacy.html` may exist as an archive — ignore/delete only if confirmed redundant.

## Files & data model
**Public `index.html`** loads: `data.js`, `tools-data.js`, `player-kb.js` (+ Google Fonts). Self-contained
inline `<style>` + `<script>`. Sections: Overview (P/L hero + **hand-built SVG cumulative-P/L chart**),
**Golfers** (searchable/tier-filtered DB, SG bars, learnings, **click → fit modal**), **Courses**
(click → field ranked by fit), This Week (`CURRENT_INTEL`), Active Bets (`OPEN_CARD`), Edge (`EW_TERMS`),
Markets (`MARKETS`), Sources (`SOURCE_PERFORMANCE`), Ledger (`TOURNAMENTS`), Bet History (all `*_CARD`),
Winners (`WINNERS`). **Everything in UNITS (1u = $20).** Current cache: `?v=101`.

**War room `war-room.html`** loads: `style.css` (design tokens + DESIGN EVOLUTION overrides appended),
`auth.js`, `data.js`, `tournament-data.js`, `settled-data.js`, `masters-odds.js`, `valero-odds.js`,
`tools-data.js`, `news-feed.js`, `source-attribution.js`, `app.js` (main render), `masters-pool.js`,
`tools.js`. All money is units (app.js `dollars()/money()/uSigned/uStake/uAxis`; tools.js analyzer + Kelly calc).
KNOWN GAP: the tournament **timeline is hardcoded HTML frozen at ~Truist (May)** — no buttons for US Open→Open,
though `TOURNAMENT_DATA` has `usopen`/`openchampionship`. Fixing it = make the timeline data-driven from
`TOURNAMENT_DATA` keys (future task, not piece 3).

**Data files (shared):**
- `data.js` — `SEASON` (authoritative: +$634.18 / +31.7u / 20.1% ROI / 30 winners / 297 settled — VERIFIED tie-out),
  `TOURNAMENTS` (per-event ledger, sums to SEASON.pl), `WINNERS` (30), `MARKETS` + `EW_TERMS` (RECOMPUTED
  2026-07-12 from bet-level cards, carded-era basis Houston→Open + majors; early season is event-level only),
  `CURRENT_INTEL` (this week's read), `OPEN_CARD` + all per-event `*_CARD`, `PLAYERS` (rotation — recomputed
  records, Clark correctly ACTIVE as US Open champ), `SCOUTING` (~90+ golfer profiles: tier, sg_tot/app/ott/arg/putt,
  putt_bermuda/bent/poa, dd, shape, surface, strengths, weaknesses, notes), `PLAYER_STATUS`, `COURSES`
  (name, event, surface, length, archetype, scoring, dataKey, topStats[], masked, amplified, bets, pl, status).
- `tournament-data.js` — `TOURNAMENT_DATA` keyed by event (masters, cognizant, …, usopen, openchampionship).
  Per event: `fingerprint`, `winnerProfile` (radar baseline), `radarPlayers` {name:[5 vals]}, `composite`
  (field ranked w/ fit — rank/name/comp/form/signal/app/ott/dd/arg/putt/t10/flag), `frl`, `keyHoles`, skill-fit data.
- `settled-data.js` — patches `TOURNAMENT_DATA[ev]` with `radarPlayers`/`composite` for settled events (IIFE).
- `tools-data.js` — `VENUE_HISTORY` {event:{name, years[], results:[{player, finishes:[{yr,pos}]}], field2026[]}},
  `SOURCE_PERFORMANCE` (attribution, directional/through-mid-season — honestly scoped, not bet-level).
- `player-kb.js` — `PLAYER_KB` keyed by full name: {id, dg_id, updated, learnings:[{claim, tier, conf, support,
  contra, pending}]}. **AUTO-BUNDLED** from `../player-kb/*.json` (17 golfers / 25 learnings today).

## The player-kb "growing" pipeline (IMPORTANT — this is the learning engine)
`player-kb/*.json` (repo root) holds durable per-golfer learnings, grown by the settlement-append loop after
each event. To refresh the greenbook after learnings change, re-run this bundler:
```
cd c:/Users/corya/Golf && py -3 -c "
import json, glob, os
kb={}
for f in glob.glob('player-kb/*.json'):
    d=json.load(open(f,encoding='utf-8')); pid=d.get('player_id') or os.path.basename(f)[:-5]
    L=[{'claim':x.get('claim'),'tier':x.get('tier'),'conf':x.get('conf'),'support':x.get('support',0),'contra':x.get('contradictions',0),'pending':x.get('pending',False)} for x in d.get('learnings',[])]
    kb[d.get('player','')]={'id':pid,'dg_id':d.get('dg_id'),'updated':d.get('updated'),'learnings':L}
open('dashboard/player-kb.js','w',encoding='utf-8').write('const PLAYER_KB = '+json.dumps(kb,ensure_ascii=False).replace(chr(10),'')+';\n')
print('bundled',len(kb),'golfers')"
```

## Design system (both faces share tokens; public LIGHT, war room DARK — keep it that way)
Green ramp #071209→#EEF8F3, brass #2B1E06→#F9EFD5, cream #2B2720→#FAF7F1, scarlet #C0392B (loss),
birdie #2E7DD1 (accent). Fonts: Cormorant Garamond (display), Lora (body), DM Mono (mono). Public conventions:
`.card`, `.sec-label`/`.sec-title`/`.brass-rule`, `.bars` (diverging), `.fit-row`, `.chip`/`.search`, `.modal`.
Never rename app.js class hooks. Verify JS after edits: `awk '/<script>/{f=1;next} /<\/script>/{f=0} f' index.html > t.js && node --check t.js`.

---

## DONE this session
1. **Structure:** public front door (`index.html`) + gated war room (`war-room.html`); back-links both ways.
2. **Units everywhere** (1u=$20) — public + war room (app.js, tools.js incl. Kelly calc bankroll default 40u).
3. **Accurate reporting** — SEASON/ledger/winners verified; MARKETS/EW_TERMS/PLAYERS recomputed from bet-level
   data (stale May-13 arrays replaced); SOURCE honestly scoped. Coverage labeled (carded era vs early event-level).
4. **Golfer Intelligence** — searchable golfer DB is the star; SG bars + surface putting + strengths/weaknesses.
5. **player-kb learnings** on golfer cards (confidence % + support counts) — the learning engine, wired.
6. **Cross-link** — golfer→best course fits, course→field ranked, via a transparent fit model
   (course `amplified`/`topStats` × golfer SG, surface-specific putting, accuracy-course bomber penalty). Click modal.

## DONE: Piece 4 — IA reorder + DG-style player breakdowns + scalable nav (2026-07-12, cache `?v=103`)
Operator direction: "overview is really upcoming tournaments + golfers in form, my record is secondary";
"data is there, just isn't broken down well, I like the graphics"; top nav "isn't scalable."
- **IA reordered** via CSS `order` on `#content` (flex column) — DOM untouched, JS untouched. New top-to-bottom:
  This Week → Active Bets → **In Form** → Tournament → Golfers → Courses → History → Data Center →
  **`.record-band` divider ("The Betting Record — the proof")** → Season P/L → Edge → Markets → Sources →
  Ledger → Bet History → Winners. The forward-looking product leads; the P/L record is demoted below a divider.
- **NEW `#inform` section** — "Golfers In Form": field ranked by current SG:Total (all 146), tier chips
  (Top 25/Elite/Contender/All), each row = rank + name/tier + 4 field-percentile mini-bars (APP/OTT/ARG/PUTT) +
  SG:Total. Rows click → the player breakdown modal (delegation wired on `#informGrid`).
- **DG-style player breakdown** — the data was always there (raw SG for 146); it just wasn't *broken down*. Added
  a **field-statistics engine** (`FIELD`: per-key sorted vals + mean/sd → `pct()`/`rank()`/`z()` vs the tracked
  field). Golfer-card SG bars now scale to **field percentile** (+ pct number). The golfer modal (`.modal.wide`,
  two-col `.pb-grid`) is now a real breakdown: big SG:Total with **field rank ("#6 of 146 · 96th pct")**, diverging
  **z-score skill bars** centered on field average w/ **percentile pills**, putting-by-surface (best ★), a Chart.js
  **percentile radar** (player vs field-median ring), strengths/weaknesses, player-kb learnings, and course fits.
- **Scalable grouped nav** — 5 primary items (This Week▾ · In Form · Golfers · Intelligence▾ · The Record▾) +
  right-aligned War Room. Dropdown menus (hover + click toggle, Esc/outside-click close) hold the secondary anchors;
  **IntersectionObserver scrollspy** lights the active group. New sections slot into a group's menu — no more flat sprawl.
Verified: inline JS `node --check` clean; headless FIELD math sane (Scheffler #1/99th, Clark #62/56th); all 15
sections + record-divider present; nav spy covers every section. SEASON headline untouched.

## DONE: Piece 3 — war-room DATA TOOLS ported to PUBLIC greenbook (2026-07-12, cache `?v=102`)
Public `index.html` now loads `tournament-data.js` + `settled-data.js` + Chart.js (jsdelivr CDN — GH Pages, no CSP)
and has three new nav sections, all light-theme / units / golfer-linked:
- **#tournament — Tournament Intelligence** (event `<select>`, defaults to `openchampionship` = this week):
  Stat Fingerprint (weighted bars from `fingerprint[]`) + tags/meta; **Player·Course Fit Radar** (Chart.js, 3
  golfer selects vs `winnerProfile`, fit% legend — guards `typeof Chart==='undefined'` and missing radarPlayers);
  **Skill-Fit Composite** table (rank/comp/form/signal/APP/OTT/DD/ARG/PUTT/T10/flag from `composite[]`, "pending"
  when empty); **Key Holes** + **Recent Winners** (from `narrative.keyHoles`/`recentWinners`).
- **#venuehist — Historical Overlay** (venue `<select>`: masters, valero): players×years finish grid, cells colored
  win/T5/T20, sorted by appearances then best finish, `● in field` flag from `field2026`.
- **#datacenter — Data Center**: SG leaderboards from `SCOUTING` (TOT/APP/OTT/ARG/PUTT/DD + Bermuda/Bent/Poa putting).
Verified: inline JS `node --check` clean; headless eval of all data files confirms every render path resolves
(146 SCOUTING players, 13 TOURNAMENT_DATA events, VENUE_HISTORY masters/valero). SEASON headline untouched (+$634.18).
Note: many events lack `composite`/`radarPlayers` (built only during their tournament week) — those tools show an
honest "pending"/"no data" state; cognizant is the fullest showcase, masters has the richest radar.

## (superseded) Original Piece 3 spec — kept for reference
Operator: "build it all — we need the same level of detail as the original greenbook." Do these on the PUBLIC
`index.html` (light theme, existing design language). Public page must now ALSO load `tournament-data.js` +
`settled-data.js` (for `TOURNAMENT_DATA`) and keep `tools-data.js` (for `VENUE_HISTORY`). Build:

A. **Historical Overlay** (highest value, real multi-year data) — from `VENUE_HISTORY`: venue selector →
   table/scatter of who's finished where over the years + "repeaters"; flag who's in the 2026 field. Mirror
   war-room `#tools` historical overlay + `app.js` `renderPlayers`/history logic.
B. **Radar Player-Course Fit** — Chart.js radar (public can add the CDN `<script>` — it's a local/GH file, no CSP):
   overlay up to 3 golfers vs the course `winnerProfile` using `TOURNAMENT_DATA[ev].radarPlayers`. Mirror
   war-room `#radar-chart` + `radar-legend` fit%.
C. **Skill-Fit / Composite rankings** — the full field scored on a course's exact stat weighting, from
   `TOURNAMENT_DATA[ev].composite` (rank/comp/form/signal/SG splits/t10/flag). More detailed than the fit modal
   heuristic (which stays for quick golfer↔course). Mirror war-room `#composite-body` / blind composite.
D. **Stat Fingerprint + FRL + Key Holes + Recent Winners** per current event — from `TOURNAMENT_DATA[ev].fingerprint`,
   `.frl`, `.keyHoles`, `.winnerProfile`. This is the per-tournament DETAIL the original had; replicate it.
E. **Course-Type Fit / Surface Performance / Stat Leaders** (Data Center depth) — from `SCOUTING`: leaders by
   SG:TOT/APP/OTT/ARG/PUTT/DD, surface-putting splits, archetype filters. Mirror war-room `#datacenter`.
F. Keep the **E/W Kelly calculator** available publicly (or leave in war room) — operator's call; it's units-ready in tools.js.

Reuse `TOURNAMENT_DATA` render logic from `app.js` (functions: `loadTournament`, radar build ~line 900-955,
composite ~line 760-790, fingerprint ~488, FRL, key holes) — port to the public light theme. Match the
original's depth: every per-tournament tool the war room has should have a public, light, units, golfer-linked
equivalent. Wire new golfer names into the cross-link modal where possible.

## Verify after building
- `node --check` the extracted inline JS (command above).
- Bump `?v=` on changed files in `index.html`, hard-refresh / Incognito to preview.
- Confirm SEASON headline still ties: +$634.18 / +31.7u / 20.1% / 30 winners.

## Next candidates (post-Piece-3)
- Grow `VENUE_HISTORY` beyond masters/valero (usopen, openchampionship, pga… — real course-history edge).
- Backfill `composite`/`radarPlayers` for current-week events so the public deep-dive isn't "pending" during the week.
- Make war-room timeline data-driven from `TOURNAMENT_DATA` keys (frozen at ~Truist).
- Push to GitHub Pages (`dashboard/` is its own git repo → `git -C dashboard add/commit/push`) when operator says go.
