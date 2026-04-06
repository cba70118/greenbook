// Masters Pool Tier Data
// Pick 1 per tier, best 4 of 6 combined to-par scores
// rec: "top" = our top pick, "strong" = strong option, "avoid" = avoid, "" = neutral

const POOL_TIERS = [
    {
        name: "Tier 1 — Favorites",
        range: "+500 to +2800",
        players: [
            { name:"Scottie Scheffler", odds:"+500", augSG:2.96, comp:1.6, tindall:"67/79", rec:"strong", note:"Augusta SG king. Sporadic R1s but still the standard. Safe floor." },
            { name:"Jon Rahm", odds:"+1100", augSG:1.67, comp:19.2, tindall:"76/79", rec:"top", note:"Tindall #1. GBS #1 pick. 9 cuts in 9 starts. APP back to elite. Best form in golf right now." },
            { name:"Rory McIlroy", odds:"+1100", augSG:1.55, comp:2.8, tindall:"-", rec:"", note:"Defending champ. 0/10 defended in last decade. Models love him but history says fade." },
            { name:"Xander Schauffele", odds:"+1600", augSG:1.80, comp:3.2, tindall:"65/79", rec:"strong", note:"T8, T8, T10, T3. Most consistent non-winner. Mayo bet with boost." },
            { name:"Ludvig Aberg", odds:"+1400", augSG:2.88, comp:7.4, tindall:"-", rec:"", note:"Augusta SG #2 but only 2 starts. 'When not if' per Noonan. Age trend concern (too young historically)." },
            { name:"Tommy Fleetwood", odds:"+2200", augSG:1.06, comp:5.6, tindall:"71/79", rec:"top", note:"ONLY player surviving all Mayo trends. All 5 models top 7. ARG#1 on Tour. ON CARD E/W." },
            { name:"Cameron Young", odds:"+2000", augSG:0.59, comp:17.8, tindall:"74/79", rec:"strong", note:"Tindall #2. GBS bet #2. Players champ won Masters last 2 years. Scrambling surged." },
            { name:"Matt Fitzpatrick", odds:"+2000", augSG:0.91, comp:10.0, tindall:"71/79", rec:"strong", note:"Tindall T4. Mayo's only Masters future (110/1). RH30+32 both #6." },
            { name:"Bryson DeChambeau", odds:"+1000", augSG:0.49, comp:24.2, tindall:"70/79", rec:"", note:"ON CARD. T10 in 6/8 recent majors but Noonan: 'rigid, lacks nuance.' LIV data split in models." },
            { name:"Robert MacIntyre", odds:"+2500", augSG:0.65, comp:28.6, tindall:"-", rec:"", note:"Leading Valero. Lefty. MC at 2025 Masters. Bamford: Valero winner never wins Masters." },
            { name:"Justin Rose", odds:"+2800", augSG:1.41, comp:26.0, tindall:"-", rec:"", note:"Augusta SG +1.41 (#9). 2x runner-up. Tindall bet at 45/1. 'Never models well but ceiling there.'" },
        ]
    },
    {
        name: "Tier 2 — Contenders",
        range: "+3300 to +6000",
        players: [
            { name:"Hideki Matsuyama", odds:"+3500", augSG:1.52, comp:12.0, tindall:"65/79", rec:"top", note:"Past champ. Augusta SG #7. Mayo #9. Wide outcome range but ceiling = anyone. Driver concern." },
            { name:"Jordan Spieth", odds:"+4000", augSG:1.35, comp:17.0, tindall:"-", rec:"strong", note:"6 T10s in 11 starts. Augusta SG +1.35. MC-T4-MC-T3 = extreme variance. Course mastery is real." },
            { name:"Viktor Hovland", odds:"+4500", augSG:1.03, comp:11.8, tindall:"-", rec:"strong", note:"Comp #10. T7 2023. Short game improved. Still 28. Both models top 10." },
            { name:"Collin Morikawa", odds:"+3300", augSG:2.07, comp:7.0, tindall:"73/79", rec:"", note:"Augusta SG #3 (2.07!) but back injury. WD from Valero. Masters status uncertain. HIGH RISK." },
            { name:"Russell Henley", odds:"+6000", augSG:0.93, comp:10.8, tindall:"70/79", rec:"top", note:"ON CARD T20. All 5 models top 13. RH30 #4. Fits every fingerprint. Distance concern for WIN but not for pool T20." },
            { name:"Akshay Bhatia", odds:"+6000", augSG:-0.32, comp:18.2, tindall:"-", rec:"", note:"ON CARD. GBS #3. Short game improved. But Augusta SG NEGATIVE. No history." },
            { name:"Min Woo Lee", odds:"+3500", augSG:0.07, comp:35.6, tindall:"-", rec:"avoid", note:"Augusta SG near zero. Mayo+Noonan both fade ('can't trust long irons'). Dialed back distance hurts at long Augusta." },
            { name:"Brooks Koepka", odds:"+4000", augSG:0.27, comp:28.4, tindall:"-", rec:"", note:"2x runner-up but MC in 3/5 recent. Major gear-shift thesis. Boom or bust." },
            { name:"Chris Gotterup", odds:"+5000", augSG:0, comp:33.6, tindall:"-", rec:"avoid", note:"Debutant. No Augusta data. Mayo+Noonan won't bet debut at any price. 0 FRL since 2007 for debutants." },
            { name:"Jake Knapp", odds:"+6000", augSG:0, comp:30, tindall:"-", rec:"", note:"SG:TOT #1 on Tour this season. Putting unsustainably hot (+5 SG/week). 2nd start. GBS #2 but models disagree." },
            { name:"Patrick Reed", odds:"+3300", augSG:0, comp:28.6, tindall:"-", rec:"", note:"Tindall bet at 66/1. T3 2025. LIV form hard to read. Controversial but Augusta SG exists." },
        ]
    },
    {
        name: "Tier 3 — Mid-Range",
        range: "+6000 to +7000",
        players: [
            { name:"Corey Conners", odds:"+7500", augSG:1.10, comp:15.2, tindall:"-", rec:"top", note:"ON CARD T20. 4 T10s in 6 starts. 'Insane course history.' Both Mayo+Noonan like. BEST POOL VALUE IN THIS TIER." },
            { name:"Shane Lowry", odds:"+6000", augSG:1.02, comp:27.6, tindall:"-", rec:"strong", note:"Augusta SG +1.02. 3rd in 2022. Major champ. GBS #11. Shot 81 on Sunday 2025 = volatility." },
            { name:"Si Woo Kim", odds:"+6600", augSG:0.72, comp:11.2, tindall:"-", rec:"strong", note:"Most consistent across all 5 models (8-13 range). Comp #9. Sneaky solid." },
            { name:"Patrick Cantlay", odds:"+6600", augSG:0.35, comp:20.2, tindall:"65/79", rec:"", note:"65 starts since last win. SG dropped 1.7->0.9/rd. Tindall T9. 'Far from elite' per Noonan." },
            { name:"Sepp Straka", odds:"+6600", augSG:0.14, comp:23.8, tindall:"-", rec:"", note:"MC last year. Augusta SG only +0.14. 5 narrative sources at Valero but T30 there." },
            { name:"Nicolai Hojgaard", odds:"+7000", augSG:0.26, comp:20.4, tindall:"-", rec:"strong", note:"Hot form (Houston 2nd). Plus distance, high apex, shot shaping. Only 1 Augusta start (T16)." },
            { name:"Adam Scott", odds:"+7000", augSG:-0.79, comp:22.4, tindall:"-", rec:"", note:"ON CARD. Won 2013. APP 3rd (36-round). But Augusta SG NEGATIVE. Putter is wildcard." },
            { name:"Jason Day", odds:"+7000", augSG:0.20, comp:45.6, tindall:"-", rec:"avoid", note:"ON CARD but weakest bet. All 5 models 39+. T8 2025 but T30, T39, MC, MC trending badly." },
            { name:"Tyrrell Hatton", odds:"+7000", augSG:0.42, comp:26.8, tindall:"-", rec:"", note:"T9 2024, T14 2025. Warming to Augusta. LIV data split in models." },
            { name:"Marco Penge", odds:"+7000", augSG:0, comp:99, tindall:"-", rec:"avoid", note:"Debutant. OTT bomber but no Augusta feel. No data." },
            { name:"Will Zalatoris", odds:"+7000", augSG:0, comp:99, tindall:"-", rec:"", note:"Back from injury. T9 2024. APP elite but health unknown." },
        ]
    },
    {
        name: "Tier 4 — Longshots",
        range: "+7500 to +11000",
        players: [
            { name:"Harris English", odds:"+11000", augSG:0.74, comp:23.8, tindall:"-", rec:"top", note:"GBS: 'Justin Rose of 2026.' 2nd in bentgrass putting. T12+T22 last 2 Masters. 97th putting pctile. HIDDEN GEM." },
            { name:"Sungjae Im", odds:"+10000", augSG:0.72, comp:50.3, tindall:"-", rec:"strong", note:"T5 2025 Masters surprised everyone. Augusta SG +0.72. Rotates good/bad years — 2026 could be ON." },
            { name:"Sam Burns", odds:"+8000", augSG:0, comp:35.0, tindall:"-", rec:"", note:"Streaky. Form-dependent. When on, he's live anywhere." },
            { name:"Jacob Bridgeman", odds:"+8000", augSG:0, comp:35.6, tindall:"-", rec:"", note:"8-for-8 in 2026 incl Riviera win. Debutant — Augusta experience matters." },
            { name:"Cameron Smith", odds:"+9000", augSG:1.44, comp:50.1, tindall:"-", rec:"", note:"Augusta SG +1.44 (#8!) but Noonan: 'not a serious golfer.' 4 MCs in 2025 majors. History vs engagement." },
            { name:"Gary Woodland", odds:"+9000", augSG:-0.50, comp:44.2, tindall:"-", rec:"avoid", note:"Augusta SG negative. Houston win was course-specific. MC in 3/5 Masters." },
            { name:"Maverick McNealy", odds:"+9000", augSG:0.43, comp:22.6, tindall:"-", rec:"", note:"T32 last year (only start). Comp #18. Good all-around but only 1 Augusta data point." },
            { name:"Max Homa", odds:"+11000", augSG:0.46, comp:51.5, tindall:"-", rec:"", note:"T3 2024 Masters. OWGR 156. Struggling in 2026 but ceiling exists at Augusta." },
            { name:"J.J. Spaun", odds:"+11000", augSG:0, comp:99, tindall:"-", rec:"", note:"Just won Valero. Bamford: Valero winner never wins Masters (19 straight failed)." },
            { name:"Daniel Berger", odds:"+12500", augSG:-0.41, comp:29.4, tindall:"-", rec:"", note:"Augusta SG negative. Ball-striking elite but short game suspect here." },
            { name:"Sahith Theegala", odds:"+10000", augSG:0, comp:99, tindall:"-", rec:"", note:"Not in our models. Raw talent but no Augusta profile." },
        ]
    },
    {
        name: "Tier 5 — Deep Longshots",
        range: "+14000 to +17500",
        players: [
            { name:"Keegan Bradley", odds:"+20000", augSG:0.76, comp:29.6, tindall:"-", rec:"strong", note:"Augusta SG +0.76 (data says he plays well!). 0 top-20s in 9 starts contradicts SG. Ryder Cup captain energy." },
            { name:"Ben Griffin", odds:"+14000", augSG:0, comp:40.1, tindall:"-", rec:"", note:"Debutant. 3 wins in 2025. Ryder Cup squad. No Augusta data." },
            { name:"Aaron Rai", odds:"+15000", augSG:0, comp:53.8, tindall:"-", rec:"", note:"Solid ball-striker. No Augusta profile." },
            { name:"Brian Harman", odds:"+15000", augSG:0, comp:40.7, tindall:"-", rec:"", note:"Won 2025 Valero. Short. T12 at Masters 2021. Can grind." },
            { name:"Rasmus Hojgaard", odds:"+15000", augSG:0.43, comp:42.6, tindall:"-", rec:"", note:"T32 2025. Augusta SG +0.43. Alternating good/bad years with Nicolai." },
            { name:"Ryan Fox", odds:"+15000", augSG:0.54, comp:55.9, tindall:"-", rec:"", note:"Augusta SG +0.54. T26+T38 in 2 starts. Ball-striking upside." },
            { name:"Casey Jarvis", odds:"+15000", augSG:0, comp:99, tindall:"-", rec:"", note:"22yo. 3rd in DP World Tour rankings. Won B2B in Africa. Debutant fire." },
            { name:"Kurt Kitayama", odds:"+17500", augSG:0, comp:53.4, tindall:"-", rec:"", note:"Ball-striking spikes. T35 in 2024. Inconsistent." },
            { name:"Ryan Gerard", odds:"+17500", augSG:0, comp:41.8, tindall:"-", rec:"avoid", note:"Debutant. Cooled off (2 MCs in 3). Hard rotation (0-4 in tracker)." },
            { name:"Tom Kim", odds:"+17500", augSG:0, comp:99, tindall:"-", rec:"", note:"Fan favorite. Ball-striking good but short game suspect at Augusta." },
            { name:"Wyndham Clark", odds:"+17500", augSG:0, comp:44.3, tindall:"-", rec:"avoid", note:"T46 last year. Struggles with consistency. US Open champ but wrong course." },
        ]
    },
    {
        name: "Tier 6 — Darts",
        range: "+20000+",
        players: [
            { name:"Matt McCarty", odds:"+25000", augSG:1.43, comp:37.7, tindall:"-", rec:"top", note:"Augusta SG +1.43 (!!). Only 1 start (T14 2025). Lefty. If SG holds, this is the steal of the tier." },
            { name:"Nick Taylor", odds:"+25000", augSG:0, comp:37.2, tindall:"-", rec:"strong", note:"Mayo: 'sleeping giant.' TAILWIND 1.40x form. Great putter. RH31 comp #58." },
            { name:"Michael Kim", odds:"+25000", augSG:0.93, comp:46.7, tindall:"-", rec:"", note:"Augusta SG +0.93. T27 2025. Sneaky history." },
            { name:"Sergio Garcia", odds:"+20000", augSG:0, comp:99, tindall:"-", rec:"", note:"Won 2017. MC in 5/6 since. Past champ but done." },
            { name:"Dustin Johnson", odds:"+20000", augSG:0, comp:50.1, tindall:"-", rec:"avoid", note:"Noonan: 'doesn't care about competitive golf anymore.' Won 2020 (soft Nov). Done." },
            { name:"Davis Thompson", odds:"+20000", augSG:0, comp:99, tindall:"-", rec:"", note:"Young talent. No Augusta data. Ball-striking upside." },
            { name:"Nico Echavarria", odds:"+25000", augSG:0, comp:99, tindall:"-", rec:"", note:"Our Cognizant winner! T51 2025. No real Augusta fit." },
            { name:"Denny McCarthy", odds:"+25000", augSG:0, comp:99, tindall:"-", rec:"", note:"Elite putter but OTT is terrible. Augusta needs more than putting." },
            { name:"Andrew Novak", odds:"+25000", augSG:0, comp:99, tindall:"-", rec:"", note:"Debutant. Mayo liked at Valero. No Augusta data." },
            { name:"Sam Stevens", odds:"+25000", augSG:0, comp:34.5, tindall:"-", rec:"", note:"Debutant. Solid all-around." },
            { name:"Davis Riley", odds:"+40000", augSG:0, comp:42.6, tindall:"-", rec:"", note:"Won colonial qualifier for Masters. B2B Masters starts. Noonan comp #52." },
            { name:"Zach Johnson", odds:"+50000", augSG:0.03, comp:99, tindall:"-", rec:"", note:"Won 2007. T8 2025. 56 years old. One last run?" },
        ]
    }
];

// Pool pick state
var poolPicks = {};

function renderPoolTiers() {
    var container = document.getElementById('pool-tiers');
    if (!container) return;
    container.innerHTML = '';

    POOL_TIERS.forEach(function(tier, ti) {
        var card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '0.75rem';

        var html = '<h3>' + tier.name + '</h3>';
        html += '<p class="card-subtitle">' + tier.range + '</p>';
        html += '<table class="data-table compact"><thead><tr><th>Player</th><th>Odds</th><th>Aug SG</th><th>Comp</th><th>Tindall</th><th>Pick</th><th>Intel</th></tr></thead><tbody>';

        tier.players.forEach(function(p) {
            var recCls = p.rec === 'top' ? 'pos' : (p.rec === 'avoid' ? 'neg' : (p.rec === 'strong' ? 'form-warm' : ''));
            var recLabel = p.rec === 'top' ? 'TOP PICK' : (p.rec === 'strong' ? 'STRONG' : (p.rec === 'avoid' ? 'AVOID' : ''));
            var selected = poolPicks[ti] === p.name;
            var selectStyle = selected ? 'background:var(--green-700);color:var(--green-300);border:1px solid var(--green-500)' : 'background:var(--green-900);color:var(--cream-500);border:1px solid var(--border)';
            var sgColor = p.augSG > 1.0 ? 'pos' : (p.augSG > 0 ? 'form-warm' : (p.augSG < 0 ? 'neg' : ''));
            var compColor = p.comp <= 12 ? 'pos' : (p.comp <= 20 ? '' : (p.comp >= 40 ? 'neg' : ''));

            html += '<tr' + (selected ? ' style="background:rgba(109,196,142,0.08)"' : '') + '>';
            html += '<td><strong>' + p.name + '</strong></td>';
            html += '<td>' + p.odds + '</td>';
            html += '<td class="' + sgColor + '">' + (p.augSG ? (p.augSG > 0 ? '+' : '') + p.augSG.toFixed(2) : '-') + '</td>';
            html += '<td class="' + compColor + '">#' + (p.comp < 90 ? Math.round(p.comp) : '-') + '</td>';
            html += '<td>' + (p.tindall || '-') + '</td>';
            html += '<td><span class="' + recCls + '" style="font-weight:600;font-size:0.65rem">' + recLabel + '</span></td>';
            html += '<td style="font-size:0.6rem;max-width:250px;color:var(--cream-500)">' + p.note + '</td>';
            html += '</tr>';
        });

        html += '</tbody></table>';
        card.innerHTML = html;

        // Click handler for selecting picks
        card.addEventListener('click', function(e) {
            var row = e.target.closest('tr');
            if (!row || row.parentElement.tagName === 'THEAD') return;
            var name = row.querySelector('strong');
            if (!name) return;
            var playerName = name.textContent;
            if (poolPicks[ti] === playerName) {
                delete poolPicks[ti]; // deselect
            } else {
                poolPicks[ti] = playerName; // select
            }
            renderPoolTiers();
            renderPoolPicks();
        });

        container.appendChild(card);
    });
}

function renderPoolPicks() {
    var container = document.getElementById('pool-picks');
    if (!container) return;
    var html = '';
    for (var i = 0; i < 6; i++) {
        var pick = poolPicks[i];
        if (pick) {
            html += '<span style="display:inline-block;padding:0.3rem 0.6rem;background:var(--green-700);border:1px solid var(--green-500);border-radius:4px;color:var(--green-300);font-family:var(--font-mono);font-size:0.7rem;font-weight:600">T' + (i+1) + ': ' + pick + '</span>';
        } else {
            html += '<span style="display:inline-block;padding:0.3rem 0.6rem;background:var(--green-900);border:1px dashed var(--border);border-radius:4px;color:var(--cream-700);font-family:var(--font-mono);font-size:0.7rem">T' + (i+1) + ': —</span>';
        }
    }
    container.innerHTML = html;
}

// Init when tab becomes visible
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.nav-btn[data-section="masterspool"]');
    if (btn) {
        setTimeout(function() { renderPoolTiers(); renderPoolPicks(); }, 50);
    }
});
// Also try on load in case tab is already active
try { if (document.getElementById('pool-tiers') && document.getElementById('masterspool').classList.contains('active')) { renderPoolTiers(); renderPoolPicks(); } } catch(ex) {}
