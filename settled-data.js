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
    val.formSignals = [
        { name:"Hovland", base:3.0, bhf:3.5, signal:"warm" },
        { name:"McCarty", base:1.1, bhf:1.3, signal:"warm" },
        { name:"Conners", base:1.5, bhf:1.8, signal:"warm" },
        { name:"Theegala", base:1.9, bhf:2.0, signal:"warm" },
        { name:"Pendrith", base:2.0, bhf:1.7, signal:"cool" },
        { name:"Jaeger", base:0.6, bhf:0.5, signal:"cool" },
        { name:"Cole", base:0.4, bhf:0.4, signal:"cool" },
    ];
}

})();
