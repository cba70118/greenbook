// Backfill data for settled tournaments
// This runs after tournament-data.js loads and patches in the deep-dive data

(function() {

// === COGNIZANT CLASSIC ===
const cog = TOURNAMENT_DATA.cognizant;
if (cog) {
    cog.radarPlayers = {
        "Nico Echavarria": [72, 68, 55, 62, 58],
        "Keith Mitchell": [38, 65, 75, 48, 72],
        "Shane Lowry": [58, 72, 82, 68, 65],
        "Austin Smotherman": [42, 55, 48, 72, 38],
        "Nicolai Hojgaard": [65, 58, 78, 52, 72],
        "Mac Meissner": [55, 62, 68, 58, 48],
        "Max McGreevy": [42, 48, 52, 45, 68],
        "Stephan Jaeger": [45, 52, 58, 62, 55],
        "Haotong Li": [48, 42, 65, 58, 38],
    };
    cog.composite = [
        { rank:1, name:"Shane Lowry", comp:0.72, form:1.18, signal:"warm", app:0.70, ott:0.14, dd:-0.5, arg:-0.05, putt:0.11, t10:18.2, spikes:"", flag:"ON CARD" },
        { rank:2, name:"Nicolai Hojgaard", comp:0.68, form:1.12, signal:"warm", app:0.52, ott:0.36, dd:14.3, arg:-0.01, putt:0.23, t10:15.8, spikes:"", flag:"FRL" },
        { rank:3, name:"Keith Mitchell", comp:0.65, form:1.15, signal:"warm", app:0.45, ott:0.56, dd:9.5, arg:-0.03, putt:-0.12, t10:14.2, spikes:"", flag:"ON CARD" },
        { rank:4, name:"Mac Meissner", comp:0.62, form:1.08, signal:"warm", app:0.34, ott:0.12, dd:2.5, arg:0.11, putt:0.01, t10:12.5, spikes:"", flag:"ON CARD" },
        { rank:5, name:"Nico Echavarria", comp:0.58, form:0.95, signal:"neutral", app:0.21, ott:0.12, dd:-5.3, arg:-0.11, putt:0.23, t10:8.4, spikes:"", flag:"WINNER" },
        { rank:6, name:"Max McGreevy", comp:0.55, form:1.02, signal:"neutral", app:0.30, ott:0.47, dd:-2.8, arg:-0.01, putt:-0.13, t10:7.8, spikes:"", flag:"ON CARD" },
        { rank:7, name:"Stephan Jaeger", comp:0.52, form:1.05, signal:"warm", app:0.10, ott:-0.22, dd:5.7, arg:0.27, putt:0.26, t10:8.1, spikes:"", flag:"ON CARD" },
        { rank:8, name:"Haotong Li", comp:0.48, form:0.88, signal:"cool", app:0.29, ott:0.37, dd:5.4, arg:-0.18, putt:0.00, t10:6.5, spikes:"", flag:"ON CARD" },
        { rank:9, name:"Austin Smotherman", comp:0.45, form:1.22, signal:"TAILWIND", app:0.48, ott:0.41, dd:4.2, arg:-0.12, putt:-0.26, t10:5.8, spikes:"", flag:"FRL WINNER" },
    ];
    cog.formSignals = [
        { name:"Shane Lowry", base:1.8, bhf:2.1, signal:"warm" },
        { name:"Keith Mitchell", base:1.5, bhf:1.7, signal:"warm" },
        { name:"Nico Echavarria", base:0.6, bhf:0.6, signal:"neutral" },
        { name:"Austin Smotherman", base:0.7, bhf:0.9, signal:"TAILWIND" },
        { name:"Mac Meissner", base:0.9, bhf:1.0, signal:"warm" },
        { name:"Max McGreevy", base:0.8, bhf:0.8, signal:"neutral" },
        { name:"Nicolai Hojgaard", base:2.5, bhf:2.8, signal:"warm" },
        { name:"Stephan Jaeger", base:0.8, bhf:0.8, signal:"warm" },
    ];
    cog.weaknessMasked = [
        { name:"Nico Echavarria", weakness:"OTT +0.12 (avg)", masked:"Partial (narrow fairways penalize)", strength:"PUTT +0.23 Bermuda", amplified:"YES (Bermuda greens)", rank:5, form:"neutral 0.95x", verdict:"WINNER. Putting carried despite mediocre driving." },
        { name:"Austin Smotherman", weakness:"PUTT -0.26", masked:"NO", strength:"APP +0.48", amplified:"YES (approach over water)", rank:9, form:"TAILWIND 1.22x", verdict:"FRL WINNER. Form surge + approach on water holes." },
        { name:"Keith Mitchell", weakness:"PUTT -0.12", masked:"NO", strength:"APP +0.45 + OTT +0.56", amplified:"YES (ball-striking)", rank:3, form:"warm 1.15x", verdict:"PLACED (T6). Ball-striking carried to E/W cash." },
    ];
    cog.narratives = [
        { name:"Shane Lowry", noonan:true, klos:true, mayo:false, stewart:false, titanic:false, count:2, rank:1 },
        { name:"Keith Mitchell", noonan:false, klos:false, mayo:false, stewart:false, titanic:true, count:1, rank:3 },
        { name:"Nico Echavarria", noonan:false, klos:false, mayo:false, stewart:false, titanic:false, count:0, rank:5 },
        { name:"Austin Smotherman", noonan:false, klos:false, mayo:false, stewart:false, titanic:false, count:0, rank:9 },
    ];
    cog.review = {
        record: "3W-14L",
        pl: 341.75,
        winner: "Nico Echavarria",
        winnerOdds: "50/1",
        bestPick: "Echavarria E/W won +$312.50",
        summary: "Best week of the season. Echavarria was composite #5 at neutral form — not a model favorite but correctly identified as a Bermuda putting specialist. Mitchell T6 placed on the 8pl E/W, and Smotherman's 62 in R1 hit the FRL at +10000. Three wins from 17 bets in a single week validated the Phase 2 analytical framework.",
        picks: [
            { player:"Nico Echavarria", market:"E/W 1/4 5pl", odds:"+5000", finish:"Won (-17)", result:"Won", thesis:"Bermuda putting specialist. DG fair +1958.", verdict:"WINNER. Putting carried. Neutral form didn't predict a win, but course fit was perfect." },
            { player:"Keith Mitchell", market:"E/W 1/5 8pl", odds:"+2500", finish:"T6 (-11)", result:"Won", thesis:"APP + OTT double. Titanic lean.", verdict:"PLACED. Ball-striking carried to E/W cash. 8pl terms were key." },
            { player:"Austin Smotherman", market:"FRL 1/4 5pl", odds:"+10000", finish:"R1: 62 (FRL winner)", result:"Won", thesis:"TAILWIND 1.22x + approach on water holes.", verdict:"FRL WINNER. Form surge translated to R1 scoring spike. Our only FRL win this season." },
            { player:"Shane Lowry", market:"Win", odds:"+2100", finish:"T2 (-15)", result:"Lost", thesis:"Composite #1. Noonan + Klos consensus.", verdict:"T2 but win-only bet. Would have cashed on E/W. Lesson: always use E/W structure." },
        ],
        modelNotes: [
            { type:"hit", text:"Echavarria composite #5 won. Bermuda putting specialist thesis was correct." },
            { type:"hit", text:"Mitchell composite #3 placed T6. Ball-striking profile delivered." },
            { type:"hit", text:"Smotherman TAILWIND form translated to FRL scoring spike." },
            { type:"miss", text:"Lowry composite #1 finished T2 but we had win-only. Structural error, not model error." },
            { type:"miss", text:"Meissner and McGreevy both missed cut despite composite top-6 rankings." },
        ],
        lessons: [
            "Always use E/W structure on outright bets. Lowry T2 at +2100 would have returned significant value on E/W terms.",
            "Bermuda putting is a real separator at PGA National. Echavarria's surface-specific skill was the edge.",
            "FRL can hit when form signal (TAILWIND) aligns with R1-specific skill. Smotherman 10000/1 was the proof.",
            "Three winners in one week proves the process works. Don't let losing weeks shake conviction.",
        ],
    };
}

// === ARNOLD PALMER INVITATIONAL ===
const ap = TOURNAMENT_DATA.arnoldpalmer;
if (ap) {
    ap.radarPlayers = {
        "Akshay Bhatia": [78, 85, 58, 62, 48],
        "Collin Morikawa": [95, 42, 78, 72, 45],
        "Kurt Kitayama": [92, 38, 80, 65, 42],
        "Viktor Hovland": [82, 55, 65, 58, 52],
        "Si Woo Kim": [85, 32, 72, 68, 50],
        "Sepp Straka": [78, 45, 68, 62, 48],
        "Matt Fitzpatrick": [82, 65, 62, 72, 55],
        "Chris Gotterup": [68, 48, 72, 58, 62],
    };
    ap.composite = [
        { rank:1, name:"Collin Morikawa", comp:0.82, form:1.15, signal:"warm", app:0.96, ott:0.73, dd:2.0, arg:0.05, putt:-0.04, t10:28.5, spikes:"", flag:"T10 WON" },
        { rank:2, name:"Akshay Bhatia", comp:0.78, form:1.25, signal:"TAILWIND", app:0.74, ott:0.22, dd:1.4, arg:0.06, putt:0.41, t10:22.8, spikes:"", flag:"WINNER" },
        { rank:3, name:"Viktor Hovland", comp:0.72, form:1.08, signal:"warm", app:0.76, ott:0.10, dd:0.6, arg:0.14, putt:0.20, t10:18.5, spikes:"", flag:"ON CARD" },
        { rank:4, name:"Kurt Kitayama", comp:0.70, form:1.05, signal:"warm", app:0.69, ott:0.57, dd:10.2, arg:-0.01, putt:-0.09, t10:17.2, spikes:"", flag:"ON CARD" },
        { rank:5, name:"Si Woo Kim", comp:0.68, form:1.12, signal:"warm", app:0.81, ott:0.66, dd:-2.7, arg:0.24, putt:-0.19, t10:16.8, spikes:"", flag:"ON CARD" },
        { rank:6, name:"Sepp Straka", comp:0.65, form:1.08, signal:"warm", app:0.60, ott:0.33, dd:-0.2, arg:0.05, putt:0.12, t10:14.5, spikes:"", flag:"ON CARD" },
        { rank:7, name:"Matt Fitzpatrick", comp:0.62, form:0.92, signal:"cool", app:0.67, ott:0.42, dd:2.7, arg:0.30, putt:0.29, t10:15.2, spikes:"", flag:"ON CARD" },
        { rank:8, name:"Chris Gotterup", comp:0.60, form:1.18, signal:"warm", app:0.40, ott:0.49, dd:16.2, arg:0.08, putt:0.12, t10:12.8, spikes:"", flag:"72H WON" },
    ];
    ap.formSignals = [
        { name:"Bhatia", base:2.8, bhf:3.5, signal:"TAILWIND" },
        { name:"Morikawa", base:4.2, bhf:4.8, signal:"warm" },
        { name:"Hovland", base:3.0, bhf:3.2, signal:"warm" },
        { name:"Kitayama", base:2.5, bhf:2.6, signal:"warm" },
        { name:"Gotterup", base:2.2, bhf:2.6, signal:"warm" },
        { name:"Straka", base:1.5, bhf:1.6, signal:"warm" },
        { name:"Fitzpatrick", base:3.8, bhf:3.5, signal:"cool" },
        { name:"Si Woo Kim", base:2.0, bhf:2.2, signal:"warm" },
    ];
    ap.weaknessMasked = [
        { name:"Akshay Bhatia", weakness:"OTT +0.22 (modest)", masked:"N/A", strength:"PUTT +0.41 Bermuda", amplified:"YES (Bermuda greens 12+ stimp)", rank:2, form:"TAILWIND 1.25x", verdict:"WINNER. Bermuda putting + form surge = playoff victory." },
        { name:"Collin Morikawa", weakness:"PUTT -0.04", masked:"Partially (approach reduces putt dependency)", strength:"APP +0.96 (#1)", amplified:"YES (approach course)", rank:1, form:"warm 1.15x", verdict:"T5. Iron play was elite but couldn't putt well enough to win." },
        { name:"Chris Gotterup", weakness:"APP +0.40 (avg)", masked:"N/A", strength:"OTT +0.49 + DD +16.2", amplified:"YES (par 5 distance)", rank:8, form:"warm 1.18x", verdict:"72H matchup WIN vs Thomas. Distance advantage delivered." },
    ];
    ap.narratives = [
        { name:"Collin Morikawa", noonan:true, klos:true, mayo:true, stewart:false, titanic:true, count:4, rank:1 },
        { name:"Viktor Hovland", noonan:true, klos:false, mayo:false, stewart:false, titanic:false, count:1, rank:3 },
        { name:"Kurt Kitayama", noonan:false, klos:false, mayo:true, stewart:false, titanic:false, count:1, rank:4 },
        { name:"Chris Gotterup", noonan:false, klos:false, mayo:false, stewart:true, titanic:false, count:1, rank:8 },
        { name:"Akshay Bhatia", noonan:false, klos:false, mayo:false, stewart:false, titanic:false, count:0, rank:2 },
    ];
    ap.review = {
        record: "4W-18L",
        pl: 46.10,
        winner: "Akshay Bhatia",
        winnerOdds: "25/1",
        bestPick: "DFS lineup $144 on $20",
        summary: "Positive week driven by creative bet structures rather than outright picks. Morikawa T10 prop cashed, DFS lineup hit big, and two matchup bets won. But FRL went 0-for-5 again (Berger shot 63 to win FRL) and Fitzpatrick T41 was a disaster. The week proved that diversifying bet types (props, matchups, DFS) alongside E/W outrights creates more paths to profit.",
        picks: [
            { player:"Collin Morikawa", market:"Top 10", odds:"+230", finish:"5th (-11)", result:"Won", thesis:"Composite #1. APP #1 on Tour. Bay Hill approach course.", verdict:"T10 prop was the right structure for a player who contends but rarely wins." },
            { player:"DFS Lineup", market:"GPP", odds:"-", finish:"$144 return", result:"Won", thesis:"Fitz/Morikawa/Kitayama/Scott/Straka/N.Hojgaard stack.", verdict:"$20 buy-in returned $144. DFS stacking composite players works." },
            { player:"Conners/Bhatia", market:"2-Ball Parlay", odds:"+200", finish:"Both won", result:"Won", thesis:"Conners > Hall + Bhatia > Harman.", verdict:"Parlay hit. Matchup bets have better edge detection than outrights." },
            { player:"Chris Gotterup", market:"72H vs Thomas", odds:"-110", finish:"Gotterup T9 vs Thomas CUT", result:"Won", thesis:"25% profit boost. Gotterup T2G > Thomas.", verdict:"Blowout win. Thomas CUT made this easy. Boosted matchup = clean +EV." },
            { player:"Matt Fitzpatrick", market:"E/W 1/5 3pl", odds:"+3500", finish:"T41 (+1)", result:"Lost", thesis:"Course history model. Iron precision.", verdict:"Complete disaster. 3pl terms were too narrow. Course history model miss." },
            { player:"Kurt Kitayama", market:"Outright + T10", odds:"+4200/+290", finish:"T18 (-3)", result:"Lost", thesis:"APP + bomber profile.", verdict:"T18 = close to T10 but not there. Approach profile didn't spike enough." },
        ],
        modelNotes: [
            { type:"hit", text:"Morikawa composite #1 finished 5th. T10 prop was the perfect structure." },
            { type:"hit", text:"Bhatia composite #2 won the tournament (playoff over Berger). TAILWIND form signal validated." },
            { type:"hit", text:"DFS lineup built from composite top-8 returned 7.2x." },
            { type:"miss", text:"Fitzpatrick T41. Course history model overweighted 2017 win at Bay Hill." },
            { type:"miss", text:"Hovland, Si Woo, Straka all T13 — just outside T10. Close but E/W terms needed to be wider." },
            { type:"note", text:"Berger shot 63 R1 to win FRL. None of our FRL picks cracked top-5 R1. FRL leak continues." },
        ],
        lessons: [
            "T10 props on composite #1 players are high-probability bets. Morikawa delivered.",
            "DFS stacking composite top-8 creates diversified exposure at low cost.",
            "Matchup bets (2-balls, 72H) offer better edge clarity than outrights. Lower vig = higher hit rate.",
            "Three players at T13 = model correctly identified contention tier. Wider E/W terms (8pl+) needed.",
            "FRL is 0-for-9 across AP+Cognizant. Reducing FRL allocation is overdue.",
        ],
    };
}

// === THE PLAYERS CHAMPIONSHIP ===
const pc = TOURNAMENT_DATA.players;
if (pc) {
    pc.radarPlayers = {
        "Cameron Young": [72, 68, 62, 55, 55],
        "Si Woo Kim": [85, 35, 68, 72, 75],
        "Collin Morikawa": [95, 40, 72, 42, 65],
        "Russell Henley": [78, 72, 75, 72, 60],
        "Sepp Straka": [72, 48, 68, 58, 55],
        "Corey Conners": [78, 32, 72, 38, 62],
        "Ryo Hisatsune": [68, 42, 55, 52, 45],
        "Christiaan Bezuidenhout": [58, 75, 62, 68, 48],
    };
    pc.composite = [
        { rank:1, name:"Si Woo Kim", comp:0.75, form:1.15, signal:"warm", app:0.81, ott:0.66, dd:-2.7, arg:0.24, putt:-0.19, t10:18.5, spikes:"", flag:"ON CARD" },
        { rank:2, name:"Russell Henley", comp:0.72, form:1.10, signal:"warm", app:0.60, ott:0.29, dd:-8.4, arg:0.29, putt:0.38, t10:16.2, spikes:"", flag:"ON CARD" },
        { rank:3, name:"Collin Morikawa", comp:0.70, form:1.08, signal:"warm", app:0.96, ott:0.73, dd:2.0, arg:0.05, putt:-0.04, t10:22.5, spikes:"", flag:"ON CARD (WD)" },
        { rank:4, name:"Cameron Young", comp:0.68, form:1.28, signal:"TAILWIND", app:0.59, ott:0.69, dd:11.1, arg:0.13, putt:0.44, t10:18.8, spikes:"", flag:"WINNER" },
        { rank:5, name:"Corey Conners", comp:0.65, form:1.12, signal:"warm", app:0.56, ott:0.47, dd:-1.6, arg:-0.06, putt:-0.15, t10:14.8, spikes:"", flag:"ON CARD" },
        { rank:6, name:"Sepp Straka", comp:0.62, form:1.08, signal:"warm", app:0.60, ott:0.33, dd:-0.2, arg:0.05, putt:0.12, t10:13.5, spikes:"", flag:"ON CARD (T8)" },
        { rank:7, name:"Ricky Castillo", comp:0.55, form:1.35, signal:"TAILWIND", app:0.14, ott:0.36, dd:7.9, arg:0.05, putt:0.10, t10:6.2, spikes:"", flag:"ON CARD" },
        { rank:8, name:"Christiaan Bezuidenhout", comp:0.52, form:1.05, signal:"warm", app:0.29, ott:-0.24, dd:-11.8, arg:0.29, putt:0.31, t10:8.5, spikes:"", flag:"ON CARD" },
    ];
    pc.formSignals = [
        { name:"Cameron Young", base:3.2, bhf:4.1, signal:"TAILWIND" },
        { name:"Si Woo Kim", base:2.0, bhf:2.3, signal:"warm" },
        { name:"Morikawa", base:4.2, bhf:4.5, signal:"warm" },
        { name:"Henley", base:1.8, bhf:2.0, signal:"warm" },
        { name:"Straka", base:1.5, bhf:1.6, signal:"warm" },
        { name:"Conners", base:1.8, bhf:2.0, signal:"warm" },
        { name:"Castillo", base:0.9, bhf:1.2, signal:"TAILWIND" },
        { name:"Bezuidenhout", base:0.8, bhf:0.8, signal:"warm" },
    ];
    pc.weaknessMasked = [
        { name:"Cameron Young", weakness:"ARG +0.13 (avg)", masked:"N/A", strength:"OTT +0.69 + PUTT +0.44", amplified:"YES (distance + Poa putting)", rank:4, form:"TAILWIND 1.28x", verdict:"WINNER. Breakthrough on ball-striking + hot putter week." },
        { name:"Sepp Straka", weakness:"PUTT +0.12 (modest)", masked:"N/A", strength:"APP +0.60", amplified:"YES (approach course)", rank:6, form:"warm 1.08x", verdict:"T8. Would have cashed on 8pl terms but we had 5pl." },
    ];
    pc.review = {
        record: "0W-17L",
        pl: -110,
        winner: "Cameron Young",
        winnerOdds: "35/1",
        bestPick: "None (closest: Straka T8, Henley/Conners/Hisatsune T13)",
        summary: "Worst week of the season. Cameron Young won on ball-striking but wasn't on our card. Six of seven players with round-by-round data shot their worst round in R4. This was the week that first surfaced the R4 grinder-fade pattern. Straka co-led after R1 (67) but finished T8 on 5pl terms when 8pl would have cashed. Place-term structure cost us.",
        picks: [
            { player:"Sepp Straka", market:"E/W 1/4 5pl", odds:"+6000", finish:"T8 (-8)", result:"Lost", thesis:"Co-led R1 (67). APP +0.60 fits Sawgrass.", verdict:"3 spots outside 5pl. Would have CASHED on 8pl terms. E/W structure error." },
            { player:"Russell Henley", market:"E/W 1/5 10pl", odds:"+2800", finish:"T13 (-6)", result:"Lost", thesis:"APP + ARG fit. Klos model favorite.", verdict:"R1 68 (T6) but faded each round: 68-71-71-72. Steady decline = no closing gear." },
            { player:"Si Woo Kim", market:"E/W 1/5 10pl", odds:"+2200", finish:"T50 (+1)", result:"Lost", thesis:"APP elite. 6mo form #3.", verdict:"R4 76 COLLAPSE. Shot 68 in R3 then +8 swing in R4. Worst individual fade of the season." },
            { player:"Corey Conners", market:"E/W 1/5 10pl", odds:"+8000", finish:"T13 (-6)", result:"Lost", thesis:"APP fit. Course history.", verdict:"69-67-72-74. Classic R4 fade: R2 low raised expectations, R4 highest score." },
            { player:"Ryo Hisatsune", market:"E/W 1/5 10pl", odds:"+11000", finish:"T13 (-6)", result:"Lost", thesis:"APP model #3. 12 events gaining T2G.", verdict:"71-69-70-72. Steady but 3 spots outside 10pl. R4 was his worst round." },
            { player:"Min Woo Lee", market:"E/W 1/5 8pl", odds:"+3300", finish:"T32 (-2)", result:"Lost", thesis:"Distance + talent.", verdict:"72-70-70-74. LATE wave R1 hurt. R4 fade continued the pattern." },
        ],
        modelNotes: [
            { type:"hit", text:"Straka composite #6 finished T8. Model was right, E/W terms were wrong." },
            { type:"hit", text:"Henley, Conners, Hisatsune all T13. Model correctly identified contenders but none could close." },
            { type:"miss", text:"Cameron Young won but wasn't on our card. His TAILWIND 1.28x should have flagged him." },
            { type:"miss", text:"Si Woo Kim T50 (+1). R4 76 was a catastrophic collapse the model couldn't predict." },
            { type:"miss", text:"Castillo T70. Complete miss across all markets." },
            { type:"note", text:"6 of 7 players shot their worst round in R4. This is where the grinder-fade hypothesis was born." },
        ],
        lessons: [
            "Straka T8 on 5pl terms when 8pl cashes = structural lesson. Wider E/W terms on grinder profiles.",
            "R4 fade is real at TPC Sawgrass. Island green on 17 + Sunday pins create 2-3 stroke swings.",
            "TAILWIND form signals (Cameron Young 1.28x) deserve more weight even when composite rank is modest.",
            "Four players at T13 (-6) and one at T8 (-8) = we correctly identified the contention tier but couldn't pick the winner from within it.",
            "FRL went 0-for-5. Sawgrass R1 leaders shot 67 and our best R1 was Straka's 67 + Conners 69. FRL requires top-3 R1 not top-10.",
        ],
    };
}

// === VALSPAR ===
const val = TOURNAMENT_DATA.valspar;
if (val) {
    val.radarPlayers = {
        "Viktor Hovland": [82, 55, 72, 68, 70, 62],
        "Corey Conners": [78, 85, 70, 35, 65, 48],
        "Sahith Theegala": [72, 48, 65, 68, 62, 65],
        "Matt McCarty": [42, 55, 62, 82, 48, 55],
        "Taylor Pendrith": [62, 72, 58, 42, 55, 48],
        "Stephan Jaeger": [38, 45, 62, 68, 55, 58],
        "Eric Cole": [48, 28, 58, 78, 45, 42],
    };
    val.composite = [
        { rank:1, name:"Viktor Hovland", comp:0.72, form:1.18, signal:"warm", app:0.76, ott:0.10, dd:0.6, arg:0.14, putt:0.20, t10:22.5, spikes:"", flag:"WINNER" },
        { rank:2, name:"Matt McCarty", comp:0.68, form:1.17, signal:"warm", app:0.12, ott:0.19, dd:-2.7, arg:-0.01, putt:0.42, t10:13.5, spikes:"", flag:"ON CARD" },
        { rank:3, name:"Corey Conners", comp:0.65, form:1.20, signal:"warm", app:0.56, ott:0.47, dd:-1.6, arg:-0.06, putt:-0.15, t10:14.8, spikes:"", flag:"" },
        { rank:4, name:"Sahith Theegala", comp:0.62, form:1.06, signal:"warm", app:0.46, ott:0.01, dd:3.9, arg:0.20, putt:0.24, t10:14.2, spikes:"", flag:"" },
        { rank:5, name:"Taylor Pendrith", comp:0.58, form:0.83, signal:"cool", app:0.29, ott:0.49, dd:10.7, arg:0.11, putt:0.04, t10:12.5, spikes:"", flag:"ON CARD" },
        { rank:6, name:"Stephan Jaeger", comp:0.52, form:0.86, signal:"cool", app:0.10, ott:-0.22, dd:5.7, arg:0.27, putt:0.26, t10:6.7, spikes:"", flag:"FRL" },
        { rank:7, name:"Eric Cole", comp:0.45, form:0.88, signal:"cool", app:0.14, ott:-0.56, dd:-1.8, arg:0.21, putt:0.33, t10:5.2, spikes:"", flag:"ON CARD" },
    ];
    val.composite = [
        { rank:1, name:"Matt Fitzpatrick", comp:0.78, form:1.15, signal:"warm", app:0.77, ott:0.50, dd:2.7, arg:0.32, putt:0.29, t10:22.5, spikes:"", flag:"WINNER" },
        { rank:2, name:"Viktor Hovland", comp:0.72, form:1.18, signal:"warm", app:0.76, ott:0.10, dd:0.6, arg:0.14, putt:0.20, t10:22.5, spikes:"", flag:"" },
        { rank:3, name:"Matt McCarty", comp:0.68, form:1.17, signal:"warm", app:0.12, ott:0.19, dd:-2.7, arg:-0.01, putt:0.42, t10:13.5, spikes:"", flag:"ON CARD" },
        { rank:4, name:"Corey Conners", comp:0.65, form:1.20, signal:"warm", app:0.56, ott:0.47, dd:-1.6, arg:-0.06, putt:-0.15, t10:14.8, spikes:"", flag:"" },
        { rank:5, name:"Sahith Theegala", comp:0.62, form:1.06, signal:"warm", app:0.46, ott:0.01, dd:3.9, arg:0.20, putt:0.24, t10:14.2, spikes:"", flag:"" },
        { rank:6, name:"David Lipsky", comp:0.60, form:0.95, signal:"neutral", app:0.14, ott:-0.23, dd:-10.7, arg:0.14, putt:0.09, t10:8.5, spikes:"", flag:"RUNNER-UP" },
        { rank:7, name:"Taylor Pendrith", comp:0.58, form:0.83, signal:"cool", app:0.29, ott:0.49, dd:10.7, arg:0.11, putt:0.04, t10:12.5, spikes:"", flag:"ON CARD" },
        { rank:8, name:"Alex Smalley", comp:0.55, form:0.90, signal:"cool", app:0.28, ott:0.30, dd:5.0, arg:0.08, putt:-0.03, t10:11.0, spikes:"", flag:"ON CARD" },
        { rank:9, name:"Christiaan Bezuidenhout", comp:0.54, form:1.05, signal:"warm", app:0.29, ott:-0.24, dd:-11.9, arg:0.29, putt:0.31, t10:10.5, spikes:"", flag:"ON CARD" },
        { rank:10, name:"Stephan Jaeger", comp:0.52, form:0.86, signal:"cool", app:0.10, ott:-0.22, dd:5.7, arg:0.27, putt:0.26, t10:6.7, spikes:"", flag:"FRL T7" },
        { rank:11, name:"Pierceson Coody", comp:0.50, form:1.15, signal:"warm", app:0.32, ott:0.61, dd:13.7, arg:-0.15, putt:-0.03, t10:8.5, spikes:"", flag:"ON CARD" },
        { rank:12, name:"Ryo Hisatsune", comp:0.48, form:1.11, signal:"warm", app:0.47, ott:0.41, dd:0.3, arg:0.11, putt:-0.08, t10:8.8, spikes:"", flag:"FRL" },
        { rank:13, name:"Davis Thompson", comp:0.46, form:1.00, signal:"neutral", app:0.35, ott:0.40, dd:3.4, arg:0.04, putt:-0.13, t10:8.0, spikes:"", flag:"ON CARD" },
        { rank:14, name:"Eric Cole", comp:0.45, form:0.88, signal:"cool", app:0.14, ott:-0.56, dd:-1.8, arg:0.21, putt:0.33, t10:5.2, spikes:"", flag:"ON CARD" },
        { rank:15, name:"Kristoffer Reitan", comp:0.42, form:0.90, signal:"cool", app:-0.13, ott:0.58, dd:9.5, arg:-0.15, putt:0.26, t10:4.5, spikes:"", flag:"ON CARD" },
    ];
    val.formSignals = [
        { name:"Matt Fitzpatrick", base:3.8, bhf:4.4, signal:"warm" },
        { name:"Viktor Hovland", base:3.0, bhf:3.5, signal:"warm" },
        { name:"Matt McCarty", base:1.1, bhf:1.3, signal:"warm" },
        { name:"Corey Conners", base:1.5, bhf:1.8, signal:"warm" },
        { name:"Sahith Theegala", base:1.9, bhf:2.0, signal:"warm" },
        { name:"David Lipsky", base:0.5, bhf:0.5, signal:"neutral" },
        { name:"Taylor Pendrith", base:2.0, bhf:1.7, signal:"cool" },
        { name:"Alex Smalley", base:1.2, bhf:1.1, signal:"cool" },
        { name:"Christiaan Bezuidenhout", base:0.8, bhf:0.8, signal:"warm" },
        { name:"Stephan Jaeger", base:0.6, bhf:0.5, signal:"cool" },
        { name:"Pierceson Coody", base:1.3, bhf:1.5, signal:"warm" },
        { name:"Ryo Hisatsune", base:1.5, bhf:1.7, signal:"warm" },
        { name:"Eric Cole", base:0.4, bhf:0.4, signal:"cool" },
    ];
    val.weaknessMasked = [
        { name:"Matt Fitzpatrick", weakness:"Not a bomber (DrDist +2.7)", masked:"YES (Copperhead doesn't reward distance)", strength:"APP +0.77 + ARG +0.32 + PUTT +0.29 on Poa Triv", amplified:"YES (Poa putting is the separator)", rank:1, form:"warm 1.15x", verdict:"WINNER. Iron precision + Poa putting = exactly what Copperhead rewards." },
        { name:"David Lipsky", weakness:"OTT -0.23, short hitter", masked:"YES (accuracy > distance)", strength:"Clutch putting down the stretch", amplified:"YES (Poa surface)", rank:6, form:"neutral", verdict:"RUNNER-UP. Outperformed his skill rating through putting." },
        { name:"Christiaan Bezuidenhout", weakness:"OTT -0.24, shortest hitter in field", masked:"YES (Copperhead fairway accuracy matters more)", strength:"SG:ARG +0.29 + PUTT +0.31", amplified:"YES (short game + Poa)", rank:9, form:"warm 1.05x", verdict:"T30. Short game showed but approach didn't spike enough." },
        { name:"Stephan Jaeger", weakness:"APP +0.10, OTT -0.22", masked:"Partial (ARG compensates)", strength:"SG:ARG +0.27 + PUTT +0.26 + FRL history", amplified:"YES (scrambling around Copperhead greens)", rank:10, form:"cool 0.86x", verdict:"T7. Best result on our card. ARG + course history carried." },
        { name:"Matt McCarty", weakness:"APP +0.12 (below average)", masked:"NO", strength:"SG:PUTT +0.42 on Poa Triv (#4 in field)", amplified:"Partially (putting helps but approach is king)", rank:3, form:"warm 1.17x", verdict:"MC. Putting couldn't compensate for approach weakness. Lesson: Poa putting alone isn't enough." },
    ];
    val.narratives = [
        { name:"Matt Fitzpatrick", noonan:true, klos:true, mayo:true, stewart:false, titanic:false, count:3, rank:1 },
        { name:"Viktor Hovland", noonan:true, klos:false, mayo:false, stewart:false, titanic:false, count:1, rank:2 },
        { name:"Ryo Hisatsune", noonan:true, klos:false, mayo:true, stewart:false, titanic:false, count:2, rank:12, note:"APP model #3. T4 here 2025. R1 specialist." },
        { name:"Stephan Jaeger", noonan:false, klos:false, mayo:false, stewart:false, titanic:true, count:1, rank:10, note:"Co-FRL at Copperhead in 2023 AND 2025. Pure history play." },
        { name:"Christiaan Bezuidenhout", noonan:false, klos:false, mayo:false, stewart:false, titanic:false, count:0, rank:9, note:"T9 here in 2024. Short game specialist." },
    ];
    val.review = {
        record: "0W-11L",
        pl: -85,
        winner: "Matt Fitzpatrick",
        winnerOdds: "35/1",
        bestPick: "None (Jaeger T7, Hisatsune T30, Bezuidenhout T30 closest)",
        summary: "Worst ROI week of Phase 2. Fitzpatrick won on Poa Trivialis putting and iron precision. Three MCs (McCarty, Pendrith, Reitan) sunk the card. Jaeger T7 was the closest to cashing but would have needed 8pl terms. First full card under Phase 2.5 anti-bias protocol with all new names — the protocol surfaced interesting players but hit rate was zero. Key lesson: new names without track record need smaller sizing.",
        picks: [
            { player:"Matt McCarty", market:"E/W 1/5 8pl", odds:"+6600", finish:"MC", result:"Lost", thesis:"SG:P +0.42 on Poa Triv. Meta composite fit.", verdict:"MC. Poa putting didn't carry when everything else leaked." },
            { player:"Taylor Pendrith", market:"E/W 1/5 8pl", odds:"+4500", finish:"MC", result:"Lost", thesis:"SG:TOT +0.94. Ball-striking machine.", verdict:"MC. Cool form signal (0.83) should have been a stronger fade." },
            { player:"Christiaan Bezuidenhout", market:"E/W 1/5 8pl", odds:"+6600", finish:"T30", result:"Lost", thesis:"ARG +0.29. T9 here 2024.", verdict:"T30. Short game didn't spike. Course history from one year is thin." },
            { player:"Stephan Jaeger", market:"FRL 1/4 5pl", odds:"+7500", finish:"T7", result:"Lost", thesis:"Co-FRL in 2023 AND 2025 at Copperhead.", verdict:"T7 finish was strong but FRL was lost. Course history FRL play showed promise." },
            { player:"Ryo Hisatsune", market:"FRL 1/4 5pl", odds:"+4000", finish:"T30", result:"Lost", thesis:"APP model #3. T4 here 2025.", verdict:"T30. Course history from one year doesn't predict." },
            { player:"Kristoffer Reitan", market:"E/W 1/5 8pl", odds:"+8000", finish:"MC", result:"Lost", thesis:"SG:P +0.30 on Poa Triv.", verdict:"MC. European longshot without enough PGA Tour data." },
        ],
        modelNotes: [
            { type:"miss", text:"Fitzpatrick won but wasn't on our card. We had him profiled from AP Inv (T41) and dismissed him. Cool form 0.92 should have been reconsidered for Poa course fit." },
            { type:"miss", text:"3 MCs from 11 outright bets = 27% MC rate. Too high. Cool form signals (Pendrith, Jaeger, Cole) should have reduced exposure." },
            { type:"note", text:"Jaeger T7 with FRL history at Copperhead continues to validate course-specific FRL plays even when they don't cash." },
            { type:"note", text:"All 11 bets were 'NEW NAME' flags from Phase 2.5 protocol. First full card of new names went 0-for-11. Sample too small to judge protocol but sizing should be smaller on unproven names." },
        ],
        lessons: [
            "New names from Phase 2.5 anti-bias protocol need reduced sizing until they have a track record in our system.",
            "Cool form signals (< 0.90) should trigger automatic stake reduction, not just a note.",
            "3 MCs in 11 bets = card was too wide. Concentrate on higher-conviction picks with warm+ form.",
            "Copperhead rewards Poa Trivialis putting specialists. Fitzpatrick's surface-specific skill was the separator — same lesson as Cognizant (Bermuda).",
            "Course history from a single year (Bezuidenhout T9 2024, Hisatsune T4 2025) is not a reliable primary thesis.",
        ],
    };
}

})();
