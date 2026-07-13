# GREENBOOK — Build Handoff & Spec
**Rewritten 2026-07-12 (late).** Read THIS section first. Everything below the "SUPERSEDED" line is
prior-architecture history, kept for reference only.

## CURRENT ARCHITECTURE — a multi-page Golf Intelligence Center (cache `?v=200`)

Operator feedback that drove this pivot (all same night): "pages need to be broken up more, there's just
links to shit — not usable"; "think about why DataGolf is usable" (focused pages, verdict-first, depth on
demand — not one long scroll with an anchor-link wall); "I don't get the war room concept — rethink or
repackage"; "this is a persistent space where we keep learning." And a packaged skill: **golf-intel-center**
(installed at `../.claude/skills/golf-intel-center/` — SKILL.md + references/glossary.md). READ THAT SKILL
before touching any view; it is the design contract (progressive disclosure: headline → reasons → depth;
plain-language label first, technical term second; honest rounding; consistent color meaning; course DNA
before narrative; anti-anchoring).

**The war-room / public-vs-private split is DEAD.** No auth gate, no dark twin. One light design language,
depth layered inline (expand/detail pages), not hidden behind a password. `war-room.html` + `app.js` +
`style.css` remain on disk but are UNLINKED from nav — retired, not deleted. Their unique tools (matchup,
DFS, Kelly) are future candidates to fold into these pages as depth.

### The pages (each answers ONE question; nav = Board · Players · Events · The Record)
- **`index.html` = The Board** — this week (The Open @ Royal Birkdale). Course DNA banner first
  (anti-anchoring), then the whole tracked field ranked by course fit (the independent read), each row =
  verdict chip + 2–3 plain reasons + fit/100, expand (`<details>`) → SG breakdown (labeled bars +
  percentiles + glossary info-dots). Backed plays badged with price; a "Where We See Value / On The Card"
  strip shows the 4 OPEN_CARD plays with implied %.
- **`players.html` = Players** — In-Form leaderboard (SG:Total, field-percentile mini-bars) + searchable
  tier-filtered directory + stat-leader boards. Every name links to a player page. The knowledge-base front door.
- **`player.html?p=<name>` = Player page** — the persistent learning hub. One-line plain read (generated from
  the SG profile) → big SG:Total + field rank → diverging z-score skill bars (plain labels) → surface putting
  → Chart.js percentile radar → player-kb learnings (the learning engine) → best course fits across the
  schedule → scouting notes. Reads the `?p=` query param.
- **`events.html?ev=<key>` = Events** — course DNA first → fingerprint (weighted) → fit radar (Chart.js) →
  the field ranked by fit (verdict + reasons) → key holes → recent winners → venue history overlay
  (VENUE_HISTORY, masters/valero). Event selector; `?ev=` param.
- **`record.html` = The Record** — the proof, its own page: P/L hero, cumulative SVG chart, phase cards,
  bet-structure + market + source bars, ledger, bet history (all `*_CARD`), winners.

### Shared foundation (DRY — every page loads these)
- **`greenbook.css`** — the design system: tokens (green/brass/cream, Cormorant/Lora/DM Mono), masthead +
  `.pagenav`, verdict/state `.chip`s (words+color), plain-label `.lab` + glossary `.info` tooltip, `.mbar`
  (magnitude) + `.dbar` (diverging), `.pctpill`, `.prob`, `table.gt`, `details.disc` (progressive disclosure).
  Single-theme LIGHT by deliberate choice.
- **`greenbook-core.js`** — global `GB`: number/odds house rules (`pctW`,`sg`,`units`,`impliedPct`), the
  `GLOSSARY` + `LABELS` maps and `GB.info()`/`GB.label()` (wire the glossary into tooltips), the `FIELD`
  percentile engine, the **course-fit model** (`fitByFingerprint`/`eventFitField` — scores any player against
  any event's fingerprint weights, with a bomber-misfit penalty and a links-pedigree bonus from player-kb),
  `verdict()` tiers, plain-language `reasons()`, and `mountChrome()` (renders masthead+nav+footer into
  `#gb-head`/`#gb-foot`). **Load order matters:** data.js → tournament-data.js → settled-data.js →
  tools-data.js → player-kb.js → greenbook-core.js → (Chart.js) → page inline script.

### Verified this build
All 5 pages `node --check` clean AND executed headlessly against real data via a DOM shim (no runtime errors);
the Open fit board is defensible (Scheffler/Rahm/McIlroy/Schauffele/Fleetwood/Fitz/Aberg… links horses surface
via the pedigree bonus). SEASON headline untouched (+$634.18 / 20.1% / 30 winners).

### Known gaps / next candidates
- "Form" is currently proxied by current SG level (honest but not week-over-week momentum). `_sg_trajectory.csv`
  exists — join it (by dg_id/name) for true form sparklines + "Hot/Cooling" states. The skill wants real form.
- No full-field live odds → the Board's verdict is course FIT, not market EDGE, for the whole field; only the
  4 backed plays show a real price. When a full odds board exists, add per-row edge (model% vs implied%).
- Fold the retired war-room tools (matchup H2H, DFS, Kelly) into player/event pages as depth.
- Wire more glossary info-dots per the skill (every jargon term one hover from plain English).
- Grow VENUE_HISTORY beyond masters/valero.

---
## ⬇⬇⬇ SUPERSEDED — prior single-page "public product + war room" architecture (history only) ⬇⬇⬇

Preview quirk (still true): **`file://` ignores the `?v=` cache-bust** — hard-refresh or Incognito locally;
GitHub Pages honors `?v=`.

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
