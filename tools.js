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
