// ============================================================
// TOOL 1: Historical Leaderboard Overlay
// ============================================================

let historyChartInstance = null;

function loadHistoryOverlay(venueKey) {
    const venue = VENUE_HISTORY[venueKey];
    if (!venue) return;

    const top10Only = document.getElementById('hist-top10').checked;
    const inFieldOnly = document.getElementById('hist-in-field').checked;

    // Build scatter data
    const datasets = [];
    const colors = [
        '#3fb950','#58a6ff','#d29922','#bc8cff','#f85149','#7ee787',
        '#79c0ff','#e3b341','#d2a8ff','#ff7b72','#56d364','#a5d6ff',
        '#f0b232','#c297ff','#ffa198','#2ea043','#388bfd','#9e6a03',
    ];

    let playerIdx = 0;
    const repeaterData = [];

    venue.results.forEach(p => {
        if (inFieldOnly && !venue.field2026.includes(p.player)) return;

        const finishes = top10Only ? p.finishes.filter(f => f.pos <= 10) : p.finishes;
        if (finishes.length === 0) return;

        const allFinishes = p.finishes;
        const t5 = allFinishes.filter(f => f.pos <= 5).length;
        const t10 = allFinishes.filter(f => f.pos <= 10).length;
        const t20 = allFinishes.filter(f => f.pos <= 20).length;
        const best = Math.min(...allFinishes.map(f => f.pos));

        if (allFinishes.length >= 2) {
            repeaterData.push({
                name: p.player, starts: allFinishes.length,
                t5, t10, t20, best,
                t10pct: (t10/allFinishes.length*100).toFixed(0),
                finStr: allFinishes.map(f => `${f.yr}:${f.pos <= 5 ? 'T'+f.pos : f.pos}`).join(' ')
            });
        }

        const color = colors[playerIdx % colors.length];
        datasets.push({
            label: p.player,
            data: finishes.map(f => ({ x: f.yr, y: f.pos })),
            backgroundColor: color,
            borderColor: color,
            pointRadius: 6,
            pointHoverRadius: 9,
            showLine: finishes.length > 1,
            borderWidth: finishes.length > 1 ? 1.5 : 0,
            tension: 0.2,
            fill: false,
        });
        playerIdx++;
    });

    // Build a cleaner dot strip chart — players on Y axis, years on X, dot size = finish quality
    // Filter to players with 2+ finishes (the repeaters) for clarity
    const repeaters = venue.results
        .filter(p => {
            if (inFieldOnly && !venue.field2026.includes(p.player)) return false;
            const fins = top10Only ? p.finishes.filter(f => f.pos <= 10) : p.finishes;
            return fins.length >= 2;
        })
        .sort((a, b) => {
            const aAvg = a.finishes.reduce((s, f) => s + f.pos, 0) / a.finishes.length;
            const bAvg = b.finishes.reduce((s, f) => s + f.pos, 0) / b.finishes.length;
            return aAvg - bAvg;
        });

    const playerNames = repeaters.map(p => p.player);
    const allDots = [];
    repeaters.forEach((p, idx) => {
        const fins = top10Only ? p.finishes.filter(f => f.pos <= 10) : p.finishes;
        fins.forEach(f => {
            allDots.push({ x: f.yr, y: idx, pos: f.pos, player: p.player });
        });
    });

    if (historyChartInstance) historyChartInstance.destroy();
    historyChartInstance = new Chart(document.getElementById('history-scatter'), {
        type: 'bubble',
        data: {
            datasets: [{
                data: allDots.map(d => ({
                    x: d.x,
                    y: d.y,
                    r: d.pos === 1 ? 12 : d.pos <= 3 ? 9 : d.pos <= 5 ? 7 : d.pos <= 10 ? 5 : 4,
                    pos: d.pos,
                    player: d.player
                })),
                backgroundColor: allDots.map(d =>
                    d.pos === 1 ? 'rgba(42,122,75,0.9)' :
                    d.pos <= 3 ? 'rgba(42,122,75,0.6)' :
                    d.pos <= 5 ? 'rgba(88,166,255,0.7)' :
                    d.pos <= 10 ? 'rgba(210,153,34,0.6)' :
                    'rgba(139,148,158,0.4)'
                ),
                borderColor: allDots.map(d =>
                    d.pos === 1 ? '#3fb950' : d.pos <= 5 ? '#58a6ff' : d.pos <= 10 ? '#d29922' : 'rgba(109,196,142,0.1)'
                ),
                borderWidth: 1.5,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => {
                            const d = ctx.raw;
                            const suffix = d.pos === 1 ? ' (WIN)' : d.pos <= 3 ? ' (podium)' : '';
                            return `${d.player}: ${d.pos}${getSuffix(d.pos)}${suffix} in ${d.x}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    min: venue.years[0] - 0.5,
                    max: venue.years[venue.years.length - 1] + 0.5,
                    ticks: { stepSize: 1, callback: v => v.toString() },
                    grid: { color: 'rgba(109,196,142,0.06)' }
                },
                y: {
                    min: -0.5,
                    max: playerNames.length - 0.5,
                    ticks: {
                        callback: (v) => playerNames[v] || '',
                        font: { size: 10 },
                        autoSkip: false,
                    },
                    grid: { color: '#1c2128' }
                }
            }
        }
    });

    // Repeaters table
    const tbody = document.getElementById('repeaters-body');
    tbody.innerHTML = '';
    repeaterData.sort((a, b) => b.t10 - a.t10).forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.name}</strong></td>
            <td>${p.starts}</td>
            <td>${p.t5}</td>
            <td class="${p.t10 >= 3 ? 'pos' : ''}">${p.t10}</td>
            <td>${p.t20}</td>
            <td class="${parseInt(p.t10pct) >= 75 ? 'pos' : ''}">${p.t10pct}%</td>
            <td>${p.best === 1 ? '<span class="pos">WIN</span>' : p.best}</td>
            <td style="font-size:0.7rem;color:var(--text-muted)">${p.finStr}</td>
        `;
        tbody.appendChild(tr);
    });
}

function getSuffix(n) {
    if (n === 1) return 'st';
    if (n === 2) return 'nd';
    if (n === 3) return 'rd';
    return 'th';
}

document.getElementById('history-venue-select').addEventListener('change', e => loadHistoryOverlay(e.target.value));
document.getElementById('hist-top10').addEventListener('change', () => loadHistoryOverlay(document.getElementById('history-venue-select').value));
document.getElementById('hist-in-field').addEventListener('change', () => loadHistoryOverlay(document.getElementById('history-venue-select').value));
loadHistoryOverlay('masters');

// ============================================================
// TOOL 2: E/W Payout Calculator
// ============================================================

document.getElementById('calc-btn').addEventListener('click', () => {
    const oddsStr = document.getElementById('calc-odds').value.trim();
    const fraction = parseFloat(document.getElementById('calc-fraction').value);
    const places = parseInt(document.getElementById('calc-places').value);
    const totalStake = parseFloat(document.getElementById('calc-stake').value);
    const winProb = parseFloat(document.getElementById('calc-win-prob').value) / 100;
    const placeProb = parseFloat(document.getElementById('calc-place-prob').value) / 100;

    const odds = parseInt(oddsStr.replace('+', ''));
    const decimalOdds = (odds / 100) + 1;
    const placeDecimal = ((decimalOdds - 1) * fraction) + 1;

    const winStake = totalStake / 2;
    const placeStake = totalStake / 2;

    const winPayout = winStake * decimalOdds;
    const placePayout = placeStake * placeDecimal;
    const totalWin = winPayout + placePayout;
    const placeOnly = placePayout;

    const impliedWin = (100 / (odds + 100) * 100).toFixed(1);
    const impliedPlace = (impliedWin * (places / 1)).toFixed(1);

    const winEV = winProb * (winStake * (decimalOdds - 1)) - (1 - winProb) * winStake;
    const placeEV = placeProb * (placeStake * (placeDecimal - 1)) - (1 - placeProb) * placeStake;
    const totalEV = winEV + placeEV;
    const evPct = (totalEV / totalStake * 100).toFixed(1);

    const resultsDiv = document.getElementById('calc-results');
    resultsDiv.innerHTML = `
        <div class="calc-results-grid">
            <div class="calc-result-card">
                <div class="calc-result-label">If Wins</div>
                <div class="calc-result-value pos">$${totalWin.toFixed(2)}</div>
                <div class="calc-result-sub">Win: $${winPayout.toFixed(2)} + Place: $${placePayout.toFixed(2)}</div>
                <div class="calc-result-sub">Profit: <span class="pos">+$${(totalWin - totalStake).toFixed(2)}</span></div>
            </div>
            <div class="calc-result-card">
                <div class="calc-result-label">If Places (Top ${places})</div>
                <div class="calc-result-value ${placeOnly > totalStake ? 'pos' : placeOnly > winStake ? 'form-warm' : 'neg'}">$${placeOnly.toFixed(2)}</div>
                <div class="calc-result-sub">Place odds: ${oddsStr.replace('+','')} x ${fraction} = +${((decimalOdds-1)*fraction*100).toFixed(0)}</div>
                <div class="calc-result-sub">P/L: <span class="${placeOnly - totalStake >= 0 ? 'pos' : 'neg'}">${placeOnly - totalStake >= 0 ? '+' : ''}$${(placeOnly - totalStake).toFixed(2)}</span></div>
            </div>
            <div class="calc-result-card">
                <div class="calc-result-label">If Misses</div>
                <div class="calc-result-value neg">-$${totalStake.toFixed(2)}</div>
                <div class="calc-result-sub">Full stake lost</div>
            </div>
            <div class="calc-result-card">
                <div class="calc-result-label">Expected Value</div>
                <div class="calc-result-value ${totalEV >= 0 ? 'pos' : 'neg'}">${totalEV >= 0 ? '+' : ''}$${totalEV.toFixed(2)} (${evPct}%)</div>
                <div class="calc-result-sub">Win EV: $${winEV.toFixed(2)} | Place EV: $${placeEV.toFixed(2)}</div>
                <div class="calc-result-sub">Implied win prob: ${impliedWin}% | Yours: ${(winProb*100).toFixed(1)}%</div>
            </div>
        </div>
        <div class="calc-breakeven">
            <strong>Breakeven:</strong> Win prob >${(100/(odds+100)).toFixed(1)}% OR place prob >${(totalStake/2 / (placeStake * (placeDecimal-1)) * 100).toFixed(1)}% to be +EV on place leg alone
        </div>
        ${(() => {
            const bankroll = parseFloat(document.getElementById('calc-bankroll').value) || 400;
            const kellyFrac = parseFloat(document.getElementById('calc-kelly').value) || 0.25;
            const edge = winProb - (100/(odds+100))/100;
            if (edge <= 0) return '<div class="calc-breakeven" style="margin-top:0.5rem"><strong>Kelly:</strong> No edge detected. No recommended stake.</div>';
            const kellyPct = (edge / ((odds/100))) * kellyFrac;
            const kellyStake = Math.max(0, bankroll * kellyPct);
            const kellyPctDisplay = (kellyPct * 100).toFixed(2);
            const warn = kellyPct > 0.03 ? ' <span class="neg">(exceeds 3% of bankroll)</span>' : '';
            return '<div class="calc-breakeven" style="margin-top:0.5rem"><strong>Kelly Stake:</strong> $' + kellyStake.toFixed(2) + ' (' + kellyPctDisplay + '% of $' + bankroll.toFixed(0) + ' bankroll, ' + (kellyFrac === 0.25 ? 'quarter' : kellyFrac === 0.5 ? 'half' : 'full') + ' Kelly)' + warn + '</div>';
        })()}
    `;
});

// Trigger initial calc
document.getElementById('calc-btn').click();

// ============================================================
// TOOL 3: Source Attribution Tracker
// ============================================================

function renderSourceTracker() {
    // ROI chart
    const sorted = [...SOURCE_PERFORMANCE].sort((a, b) => (b.pl/b.staked) - (a.pl/a.staked));

    new Chart(document.getElementById('source-roi-chart'), {
        type: 'bar',
        data: {
            labels: sorted.map(s => s.source),
            datasets: [{
                label: 'ROI %',
                data: sorted.map(s => (s.pl / s.staked * 100).toFixed(1)),
                backgroundColor: sorted.map(s => s.pl >= 0 ? 'rgba(42,122,75,0.7)' : 'rgba(248,81,73,0.6)'),
                borderRadius: 4,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false }, title: { display: true, text: 'ROI by Source', color: '#e6edf3' } },
            scales: {
                x: { grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => v + '%' } },
                y: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });

    // Win rate chart
    new Chart(document.getElementById('source-winrate-chart'), {
        type: 'bar',
        data: {
            labels: sorted.map(s => s.source),
            datasets: [{
                label: 'Win+Place Rate %',
                data: sorted.map(s => ((s.wins + s.places) / s.tagged * 100).toFixed(1)),
                backgroundColor: 'rgba(88,166,255,0.6)',
                borderRadius: 4,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false }, title: { display: true, text: 'Win+Place Rate by Source', color: '#e6edf3' } },
            scales: {
                x: { grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => v + '%' } },
                y: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });

    // Table
    const tbody = document.getElementById('source-body');
    sorted.forEach(s => {
        const roi = (s.pl / s.staked * 100).toFixed(1);
        const winRate = (s.wins / s.tagged * 100).toFixed(1);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${s.source}</strong></td>
            <td>${s.tagged}</td>
            <td>${s.wins}</td>
            <td>${s.places}</td>
            <td>${winRate}%</td>
            <td class="${s.pl >= 0 ? 'pos' : 'neg'}">${s.pl >= 0 ? '+' : ''}$${s.pl}</td>
            <td class="${parseFloat(roi) >= 0 ? 'pos' : 'neg'}">${roi}%</td>
            <td style="font-size:0.75rem">${s.bestHit}</td>
        `;
        tbody.appendChild(tr);
    });
}

renderSourceTracker();

// ============================================================
// TOOL: Player Comparison
// ============================================================

function initComparison() {
    var selects = ['compare-1','compare-2','compare-3'];
    var names = SCOUTING.map(function(p){return p.name}).sort();
    selects.forEach(function(id, i) {
        var el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = '<option value="">-- Select --</option>' + names.map(function(n){return '<option value="'+n+'">'+n+'</option>'}).join('');
        el.addEventListener('change', renderComparison);
    });
}

function renderComparison() {
    var selected = ['compare-1','compare-2','compare-3']
        .map(function(id){return document.getElementById(id).value})
        .filter(Boolean)
        .map(function(name){return SCOUTING.find(function(p){return p.name===name})})
        .filter(Boolean);
    var out = document.getElementById('compare-output');
    if (!selected.length) { out.innerHTML = ''; return; }
    var stats = [
        {label:'SG: Total',key:'sg_tot',max:2.6},
        {label:'SG: Approach',key:'app',max:1.0},
        {label:'SG: OTT',key:'ott',max:1.0},
        {label:'SG: ARG',key:'arg',max:0.5},
        {label:'SG: Putting',key:'putt',max:0.7},
        {label:'Dr Distance',key:'dd',max:20}
    ];
    var html = '<div class="compare-cards">';
    selected.forEach(function(p) {
        var tc = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':p.tier==='Mid-field'?'tier-midfield':'tier-veteran';
        var hasSurf = p.putt_bermuda !== undefined;
        html += '<div class="compare-card"><h4>'+p.name+' <span class="tier-badge '+tc+'" style="font-size:0.55rem">'+p.tier+'</span></h4>';
        stats.forEach(function(s) {
            var v = p[s.key];
            var pct = Math.max(5, Math.min(95, (v/s.max)*50+50));
            var cls = v>s.max*0.3?'sg-positive':v>0?'sg-neutral':'sg-negative';
            var vStr = s.key==='dd' ? v.toFixed(1) : v.toFixed(2);
            html += '<div class="compare-stat-row"><span class="compare-stat-label">'+s.label+'</span><div class="compare-bar-track"><div class="compare-bar-fill '+cls+'" style="width:'+pct+'%"></div></div><span class="'+(v>=0?'pos':'neg')+'">'+(v>=0?'+':'')+vStr+'</span></div>';
        });
        if (hasSurf) {
            html += '<div style="margin-top:0.5rem;font-family:var(--font-mono);font-size:0.62rem"><span class="compare-stat-label">Surface: </span>';
            html += '<span class="'+(p.putt_bermuda>=0?'pos':'neg')+'">Berm '+(p.putt_bermuda>=0?'+':'')+p.putt_bermuda.toFixed(2)+'</span> ';
            html += '<span class="'+(p.putt_bent>=0?'pos':'neg')+'">Bent '+(p.putt_bent>=0?'+':'')+p.putt_bent.toFixed(2)+'</span> ';
            html += '<span class="'+(p.putt_poa>=0?'pos':'neg')+'">Poa '+(p.putt_poa>=0?'+':'')+p.putt_poa.toFixed(2)+'</span></div>';
        }
        html += '<div style="margin-top:0.4rem;font-size:0.72rem"><strong class="pos">+</strong> '+p.strengths+'</div>';
        html += '<div style="font-size:0.72rem"><strong class="neg">-</strong> '+p.weaknesses+'</div>';
        html += '</div>';
    });
    html += '</div>';
    out.innerHTML = html;
}
initComparison();

// ============================================================
// TOOL: Course-Player Matcher
// ============================================================

function calcArchScore(p, type) {
    if (type==='secondshot') return Math.min(100,(p.app/0.9)*50+(p.arg/0.4)*25+25);
    if (type==='bomber') return Math.min(100,(p.dd/20)*40+(p.ott/0.9)*35+25);
    if (type==='bermuda') return Math.min(100,(p.putt/0.6)*45+(p.arg/0.4)*30+25);
    if (type==='poa') return Math.min(100,(p.putt/0.6)*40+(p.app/0.9)*35+25);
    if (type==='grinder') return Math.min(100,50+(p.arg/0.4)*25+(p.putt/0.6)*25-(p.dd/20)*10);
    if (type==='shortgame') return Math.min(100,(p.arg/0.4)*45+(p.putt/0.6)*30+25);
    if (type==='wind') return Math.min(100,(p.ott/0.9)*35+(p.app/0.9)*35+30);
    return 50;
}

function matcherKeyStat(p, type) {
    if (type==='secondshot') return 'APP '+(p.app>=0?'+':'')+p.app.toFixed(2);
    if (type==='bomber') return 'DD '+(p.dd>=0?'+':'')+p.dd.toFixed(1);
    if (type==='bermuda') return 'PUTT(B) '+((p.putt_bermuda||p.putt)>=0?'+':'')+((p.putt_bermuda||p.putt)).toFixed(2);
    if (type==='poa') return 'PUTT(P) '+((p.putt_poa||p.putt)>=0?'+':'')+((p.putt_poa||p.putt)).toFixed(2);
    if (type==='grinder') return 'ARG '+(p.arg>=0?'+':'')+p.arg.toFixed(2);
    if (type==='shortgame') return 'ARG '+(p.arg>=0?'+':'')+p.arg.toFixed(2);
    if (type==='wind') return 'OTT '+(p.ott>=0?'+':'')+p.ott.toFixed(2);
    return '';
}

function renderMatcher() {
    var type = document.getElementById('matcher-archetype').value;
    var scored = SCOUTING.map(function(p){return {player:p, score:Math.max(0,calcArchScore(p,type))}}).sort(function(a,b){return b.score-a.score}).slice(0,20);
    var tb = document.getElementById('matcher-body');
    tb.innerHTML = '';
    scored.forEach(function(s,i) {
        var p = s.player;
        var tc = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':'tier-midfield';
        var fitCls = s.score>=75?'pos':s.score>=60?'form-warm':s.score>=45?'form-neutral':'neg';
        var surf = p.putt_bermuda ? 'B:'+p.putt_bermuda.toFixed(2)+' P:'+p.putt_poa.toFixed(2) : '-';
        tb.innerHTML += '<tr><td>'+(i+1)+'</td><td><strong>'+p.name+'</strong></td><td class="'+fitCls+'" style="font-family:var(--font-mono);font-weight:600">'+s.score.toFixed(0)+'</td><td style="font-family:var(--font-mono);font-size:0.72rem">'+matcherKeyStat(p,type)+'</td><td style="font-family:var(--font-mono);font-size:0.68rem">'+surf+'</td><td><span class="tier-badge '+tc+'" style="font-size:0.5rem">'+p.tier+'</span></td></tr>';
    });
}
document.getElementById('matcher-archetype').addEventListener('change', renderMatcher);
renderMatcher();

// ============================================================
// TOOL: Season Bet Analyzer
// ============================================================

function renderAnalyzer() {
    var mktF = document.getElementById('analyzer-market').value;
    var statF = document.getElementById('analyzer-status').value;
    var allBets = [].concat(
        HOUSTON_CARD.map(function(b){return Object.assign({},b,{tournament:'Houston'})}),
        VALERO_CARD.map(function(b){return Object.assign({},b,{tournament:'Valero'})}),
        MASTERS_CARD.map(function(b){return Object.assign({},b,{tournament:'Masters'})})
    );
    WINNERS.forEach(function(w){allBets.push({tournament:w.tournament,player:w.player,market:w.market,odds:w.odds,stake:w.stake,status:'Won',ret:w.ret})});
    var filtered = allBets;
    if (statF) filtered = filtered.filter(function(b){return b.status===statF});
    if (mktF) filtered = filtered.filter(function(b){return (b.market||'').indexOf(mktF)>=0});
    var staked=0, returned=0, wins=0;
    filtered.forEach(function(b){staked+=b.stake||0; returned+=b.ret||0; if(b.status==='Won')wins++});
    var pl = returned - staked;
    var roi = staked>0?(pl/staked*100).toFixed(1):'0';
    document.getElementById('analyzer-summary').innerHTML = '<span>'+filtered.length+' bets</span><span>$'+staked.toFixed(2)+' staked</span><span class="'+(pl>=0?'pos':'neg')+'">'+(pl>=0?'+':'')+'$'+pl.toFixed(2)+'</span><span>'+wins+' winners</span><span>'+roi+'% ROI</span>';
    var tb = document.getElementById('analyzer-body');
    tb.innerHTML = '';
    filtered.slice(0,50).forEach(function(b){
        var sc = b.status==='Won'?'pos':b.status==='Lost'?'neg':'';
        tb.innerHTML += '<tr><td>'+(b.tournament||'')+'</td><td>'+b.player+'</td><td>'+(b.market||'')+'</td><td>'+b.odds+'</td><td>$'+b.stake.toFixed(2)+'</td><td class="'+sc+'">'+b.status+'</td><td>'+(b.ret?'$'+b.ret.toFixed(2):'-')+'</td></tr>';
    });
}
['analyzer-book','analyzer-market','analyzer-status'].forEach(function(id){document.getElementById(id).addEventListener('change',renderAnalyzer)});
renderAnalyzer();

// ============================================================
// TOOL: Form Signal Scanner
// ============================================================
var formScannerChart = null;
function renderFormScanner() {
    var players = SCOUTING.filter(function(p){return p.sg_tot>0.3}).map(function(p){
        var m = p.tier==='Elite'?1.12:p.tier==='Contender'?1.05:0.95;
        if (p.putt_bermuda) m += Math.abs(p.putt_bermuda-p.putt_poa)*0.3;
        return {name:p.name, momentum:m, tier:p.tier};
    }).sort(function(a,b){return b.momentum-a.momentum}).slice(0,25);
    if (formScannerChart) formScannerChart.destroy();
    formScannerChart = new Chart(document.getElementById('form-scanner-chart'), {
        type:'bar',
        data:{labels:players.map(function(p){return p.name.split(' ').pop()}),
        datasets:[{label:'Form Momentum',data:players.map(function(p){return p.momentum}),
        backgroundColor:players.map(function(p){return p.momentum>1.15?'rgba(42,122,75,0.8)':p.momentum>1.05?'rgba(109,196,142,0.6)':p.momentum>0.95?'rgba(168,152,128,0.4)':'rgba(192,57,43,0.5)'}),
        borderRadius:3}]},
        options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{grid:{color:'rgba(109,196,142,0.06)'},min:0.8,max:1.3,ticks:{callback:function(v){return v.toFixed(1)+'x'}}},x:{grid:{display:false},ticks:{font:{size:9}}}}}
    });
}
renderFormScanner();
