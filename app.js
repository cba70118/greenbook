// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.section).classList.add('active');
    });
});

// Sub-tabs
document.querySelectorAll('.sub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.closest('.card');
        parent.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
        parent.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.subtab).classList.add('active');
    });
});

// Chart defaults — Greenbook palette
Chart.defaults.color = '#A89880';
Chart.defaults.borderColor = 'rgba(109, 196, 142, 0.12)';
Chart.defaults.font.family = "'DM Mono', 'Courier New', monospace";
Chart.defaults.font.size = 10;

// ============================================================
// THIS WEEK
// ============================================================

let weekRadarInstance = null;

function loadThisWeek(key) {
    key = key || 'masters';
    const t = TOURNAMENT_DATA[key];
    if (!t) return;

    document.getElementById('week-event-name').textContent = t.name;
    document.getElementById('week-course-name').textContent = t.course;
    document.getElementById('week-course-meta').textContent = t.meta;
    document.getElementById('week-archetype').textContent = t.archetype;

    // Result banner for settled tournaments
    const existingBanner = document.getElementById('result-banner');
    if (existingBanner) existingBanner.remove();
    if (t.result2026) {
        const banner = document.createElement('div');
        banner.id = 'result-banner';
        banner.className = 'result-banner';
        banner.innerHTML = `
            <div class="result-winner"><span class="result-label">Winner:</span> ${t.result2026.winner} (${t.result2026.score}, ${t.result2026.odds})</div>
            <div class="result-why">${t.result2026.why}</div>
            <div class="result-record">Our record: ${t.result2026.record}</div>
        `;
        document.getElementById('week-course-bar').after(banner);
    }

    if (t.narrative) {
        document.getElementById('week-description').textContent = t.narrative.description;
        document.getElementById('week-tags').innerHTML = t.narrative.tags.map(tag =>
            `<span class="course-stat-tag">${tag}</span>`).join('');
        document.getElementById('week-masked').innerHTML = t.masked.map(m => `<div class="mask-item">${m}</div>`).join('');
        document.getElementById('week-amplified').innerHTML = t.amplified.map(a => `<div class="amp-item">${a}</div>`).join('');
        document.getElementById('week-winner-dna').textContent = t.narrative.winnerDNA;
        document.getElementById('week-key-holes').innerHTML = t.narrative.keyHoles.map(h =>
            `<div class="key-hole"><span class="hole-num">${h.num}</span><span class="hole-meta">Par ${h.par} | ${h.yds} yds</span><span class="hole-note">${h.note}</span></div>`
        ).join('');
        document.getElementById('week-recent-winners').innerHTML = t.narrative.recentWinners.map(w =>
            `<div class="winner-row"><span class="winner-yr">${w.yr}</span><span class="winner-name">${w.name}</span><span class="winner-score">${w.score}</span><span class="winner-odds">${w.odds}</span><span class="winner-note">${w.note}</span></div>`
        ).join('');
    }

    // Fingerprint
    document.getElementById('week-fingerprint').innerHTML = t.fingerprint.map(f => `
        <div class="fp-item">
            <div class="fp-bar-track"><div class="fp-bar" style="width:${f.weight*100*3}%"></div></div>
            <div class="fp-label">${f.stat} <span class="fp-weight">${(f.weight*100).toFixed(0)}%</span></div>
            <div class="fp-note">${f.note}</div>
        </div>
    `).join('');

    // Week radar
    if (t.radarAxes && t.radarPlayers) {
        const names = Object.keys(t.radarPlayers);
        ['week-radar-1','week-radar-2'].forEach((id, i) => {
            const sel = document.getElementById(id);
            sel.innerHTML = '<option value="">-- Select --</option>' +
                names.map(n => `<option value="${n}" ${n === names[i] ? 'selected' : ''}>${n}</option>`).join('');
            sel.onchange = () => renderWeekRadar(t);
        });
        renderWeekRadar(t);
    }

    // Odds board
    const oddsBody = document.getElementById('odds-body');
    const oddsCard = document.getElementById('odds-board-card');
    if (oddsBody) oddsBody.innerHTML = '';
    if (t.oddsBoard && t.oddsBoard.length > 0) {
        if (oddsCard) oddsCard.style.display = '';
        t.oddsBoard.forEach(o => {
            const tr = document.createElement('tr');
            const edgeVal = parseFloat(o.edge);
            const edgeClass = edgeVal > 3 ? 'pos' : edgeVal > 0 ? 'form-warm' : edgeVal > -3 ? 'form-neutral' : 'neg';
            const verdictClass = o.verdict.includes('VALUE') ? 'pos' : o.verdict.includes('OVERPRICED') ? 'neg' : '';
            tr.innerHTML = `
                <td>${o.rank}</td>
                <td><strong>${o.name}</strong></td>
                <td style="font-family:var(--font-mono)">${o.fair}</td>
                <td style="font-family:var(--font-mono)">${o.best}</td>
                <td style="font-family:var(--font-mono)">${o.b365}</td>
                <td class="${edgeClass}" style="font-family:var(--font-mono);font-weight:600">${o.edge}</td>
                <td class="${signalClass(o.form)}">${o.form}</td>
                <td class="${verdictClass}" style="font-size:0.72rem">${o.verdict}</td>
            `;
            oddsBody.appendChild(tr);
        });
    } else {
        if (oddsCard) oddsCard.style.display = 'none';
    }

    // Current bets
    const betsData = key === 'masters' ? MASTERS_CARD :
                     key === 'houston' ? HOUSTON_CARD : [];
    const tbody = document.getElementById('week-bets-body');
    tbody.innerHTML = '';
    if (betsData.length > 0) {
        document.getElementById('week-bets-card').style.display = '';
        betsData.forEach(d => {
            const tr = document.createElement('tr');
            const sc = d.status === 'Lost' ? 'neg' : d.status === 'Open' ? '' : 'pos';
            const thesis = d.edge || d.comp || '';
            tr.innerHTML = `<td>${d.num}</td><td>${d.player}</td><td>${d.market}</td><td>${d.terms}</td><td>${d.odds}</td><td>$${d.stake}</td><td style="font-size:0.75rem">${thesis}</td><td class="${sc}">${d.status}</td>`;
            tbody.appendChild(tr);
        });
    } else {
        document.getElementById('week-bets-card').style.display = 'none';
    }

    // Also load the deep-dive components (composite, RH heatmap, form, etc.) via loadTournament
    loadTournament(key);
}

function renderWeekRadar(t) {
    const selected = ['week-radar-1','week-radar-2'].map(id => document.getElementById(id).value).filter(Boolean);
    const datasets = [{
        label: 'Avg Winner',
        data: t.winnerProfile,
        backgroundColor: 'rgba(248,81,73,0.08)',
        borderColor: 'rgba(248,81,73,0.5)',
        borderWidth: 2, borderDash: [6,3], pointRadius: 3, pointBackgroundColor: 'rgba(248,81,73,0.5)',
    }];
    selected.forEach((name, i) => {
        const data = t.radarPlayers[name];
        if (!data) return;
        datasets.push({
            label: name, data: data,
            backgroundColor: radarColors[i].bg, borderColor: radarColors[i].border,
            borderWidth: 2.5, pointRadius: 5, pointBackgroundColor: radarColors[i].border,
            pointBorderColor: '#161b22', pointBorderWidth: 2,
        });
    });
    if (weekRadarInstance) weekRadarInstance.destroy();
    weekRadarInstance = new Chart(document.getElementById('week-radar-chart'), {
        type: 'radar', data: { labels: t.radarAxes, datasets },
        options: {
            responsive: true, maintainAspectRatio: true,
            plugins: { legend: { position:'bottom', labels:{boxWidth:10,font:{size:10},usePointStyle:true} } },
            scales: { r: { min:0, max:100, ticks:{display:false}, grid:{color:'#30363d'}, angleLines:{color:'#30363d'}, pointLabels:{font:{size:10,weight:'600'},color:'#e6edf3'} } }
        }
    });
    const legendDiv = document.getElementById('week-radar-legend');
    legendDiv.innerHTML = selected.map((name,i) => {
        const data = t.radarPlayers[name];
        if (!data) return '';
        const fit = data.reduce((s,v,idx) => s + Math.min(v/t.winnerProfile[idx],1.2),0)/data.length*100;
        const cls = fit>=95?'pos':fit>=80?'form-warm':fit>=65?'form-neutral':'neg';
        return `<div class="radar-legend-item"><span class="radar-dot" style="background:${radarColors[i].border}"></span><strong>${name}</strong> <span class="${cls}">Fit: ${fit.toFixed(0)}%</span></div>`;
    }).join('');
}

loadThisWeek('masters');

// Timeline navigation
document.querySelectorAll('.timeline-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadThisWeek(btn.dataset.t);
    });
});

// ============================================================
// DATA CENTER: Archetype Matrix + SG Leaderboard
// ============================================================

function buildArchetypeMatrix() {
    const tbody = document.getElementById('archetype-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    // Score each player on each archetype (0-100)
    SCOUTING.forEach(p => {
        const secondShot = Math.min(100, (p.app / 0.9) * 50 + (p.arg / 0.4) * 25 + 25);
        const bomber = Math.min(100, (p.dd / 20) * 40 + (p.ott / 0.9) * 35 + 25);
        const bermuda = Math.min(100, (p.putt / 0.6) * 45 + (p.arg / 0.4) * 30 + 25);
        const poa = Math.min(100, (p.putt / 0.6) * 40 + (p.app / 0.9) * 35 + 25);
        const grinder = Math.min(100, 50 + (p.arg / 0.4) * 25 + (p.putt / 0.6) * 25 - (p.dd / 20) * 10);
        const shortGame = Math.min(100, (p.arg / 0.4) * 45 + (p.putt / 0.6) * 30 + 25);
        const wind = Math.min(100, (p.ott / 0.9) * 35 + (p.app / 0.9) * 35 + 30);

        const scores = [secondShot, bomber, bermuda, poa, grinder, shortGame, wind];
        const tr = document.createElement('tr');
        tr.innerHTML = `<td><strong>${p.name}</strong></td>` +
            scores.map(s => {
                const v = Math.max(0, Math.min(100, s)).toFixed(0);
                const cls = v >= 75 ? 'heat-elite' : v >= 60 ? 'heat-top10' : v >= 45 ? 'heat-top25' : 'heat-mid';
                return `<td class="${cls}">${v}</td>`;
            }).join('');
        tbody.appendChild(tr);
    });
}

function buildSGLeaderboard() {
    const tbody = document.getElementById('sg-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    const top30 = document.getElementById('sg-top30').checked;
    const sorted = [...SCOUTING].sort((a,b) => b.sg_tot - a.sg_tot);
    const show = top30 ? sorted.slice(0,30) : sorted;
    show.forEach((p, i) => {
        const tr = document.createElement('tr');
        const tierClass = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':p.tier==='Mid-field'?'tier-midfield':'tier-veteran';
        tr.innerHTML = `
            <td>${i+1}</td><td><strong>${p.name}</strong></td>
            <td class="${p.sg_tot>1.5?'pos':''}">${p.sg_tot>0?'+':''}${p.sg_tot.toFixed(2)}</td>
            <td class="${p.app>0.5?'pos':''}">${p.app>0?'+':''}${p.app.toFixed(2)}</td>
            <td class="${p.ott>0.4?'pos':''}">${p.ott>0?'+':''}${p.ott.toFixed(2)}</td>
            <td class="${p.arg>0.2?'pos':''}">${p.arg>0?'+':''}${p.arg.toFixed(2)}</td>
            <td class="${p.putt>0.3?'pos':''}">${p.putt>0?'+':''}${p.putt.toFixed(2)}</td>
            <td>${p.dd>0?'+':''}${p.dd.toFixed(1)}</td>
            <td><span class="tier-badge ${tierClass}" style="font-size:0.6rem">${p.tier}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

if (document.getElementById('sg-top30')) {
    document.getElementById('sg-top30').addEventListener('change', buildSGLeaderboard);
}
buildArchetypeMatrix();
buildSGLeaderboard();
buildDataCenterGlance();

function buildDataCenterGlance() {
    const sorted = [...SCOUTING].sort((a,b) => b.sg_tot - a.sg_tot);
    const bestTot = sorted[0];
    const bestApp = [...SCOUTING].sort((a,b) => b.app - a.app)[0];
    const bestOtt = [...SCOUTING].sort((a,b) => b.ott - a.ott)[0];
    const bestArg = [...SCOUTING].sort((a,b) => b.arg - a.arg)[0];
    const bestPutt = [...SCOUTING].sort((a,b) => b.putt - a.putt)[0];
    const bestDd = [...SCOUTING].sort((a,b) => b.dd - a.dd)[0];

    const setCard = (id, name, val) => {
        const card = document.getElementById(id);
        if (card) {
            card.querySelector('.stat-value').textContent = name;
            card.querySelector('.stat-label').textContent += ` (+${val.toFixed(2)})`;
        }
    };
    setCard('dc-best-tot', bestTot.name.split(' ').pop(), bestTot.sg_tot);
    setCard('dc-best-app', bestApp.name.split(' ').pop(), bestApp.app);
    setCard('dc-best-ott', bestOtt.name.split(' ').pop(), bestOtt.ott);
    setCard('dc-best-arg', bestArg.name.split(' ').pop(), bestArg.arg);
    setCard('dc-best-putt', bestPutt.name.split(' ').pop(), bestPutt.putt);

    const ddCard = document.getElementById('dc-best-dd');
    if (ddCard) {
        ddCard.querySelector('.stat-value').textContent = bestDd.name.split(' ').pop();
        ddCard.querySelector('.stat-label').textContent += ` (+${bestDd.dd.toFixed(1)} yds)`;
    }

    // Stacked bar: top 10 by SG:Total
    const top10 = sorted.slice(0, 10);
    new Chart(document.getElementById('dc-stacked-chart'), {
        type: 'bar',
        data: {
            labels: top10.map(p => p.name.split(' ').pop()),
            datasets: [
                { label: 'APP', data: top10.map(p => Math.max(0, p.app)), backgroundColor: 'rgba(88,166,255,0.8)', borderRadius: 2 },
                { label: 'OTT', data: top10.map(p => Math.max(0, p.ott)), backgroundColor: 'rgba(63,185,80,0.8)', borderRadius: 2 },
                { label: 'ARG', data: top10.map(p => Math.max(0, p.arg)), backgroundColor: 'rgba(210,153,34,0.8)', borderRadius: 2 },
                { label: 'PUTT', data: top10.map(p => Math.max(0, p.putt)), backgroundColor: 'rgba(188,140,255,0.8)', borderRadius: 2 },
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10 } } } },
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: { stacked: true, grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => '+' + v.toFixed(1) } }
            }
        }
    });

    // Scatter: APP vs PUTT
    new Chart(document.getElementById('dc-scatter-chart'), {
        type: 'scatter',
        data: {
            datasets: [{
                data: SCOUTING.map(p => ({ x: p.app, y: p.putt, name: p.name })),
                backgroundColor: SCOUTING.map(p =>
                    p.tier === 'Elite' ? 'rgba(63,185,80,0.8)' :
                    p.tier === 'Contender' ? 'rgba(88,166,255,0.7)' :
                    'rgba(139,148,158,0.5)'
                ),
                pointRadius: SCOUTING.map(p => p.tier === 'Elite' ? 8 : p.tier === 'Contender' ? 6 : 4),
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => `${ctx.raw.name}: APP ${ctx.raw.x > 0 ? '+' : ''}${ctx.raw.x.toFixed(2)}, PUTT ${ctx.raw.y > 0 ? '+' : ''}${ctx.raw.y.toFixed(2)}` } }
            },
            scales: {
                x: { title: { display: true, text: 'SG: Approach', color: '#8b949e' }, grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => (v > 0 ? '+' : '') + v.toFixed(1) } },
                y: { title: { display: true, text: 'SG: Putting', color: '#8b949e' }, grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => (v > 0 ? '+' : '') + v.toFixed(1) } }
            }
        }
    });
}

// ============================================================
// RADAR CHART (for tournament archive)
// ============================================================

let radarChartInstance = null;
const radarColors = [
    { bg: 'rgba(46,125,209,0.15)', border: '#2E7DD1' },
    { bg: 'rgba(42,122,75,0.15)', border: '#3D9E64' },
    { bg: 'rgba(201,160,70,0.15)', border: '#C9A046' },
];

function renderRadar(t) {
    const selects = ['radar-player-1', 'radar-player-2', 'radar-player-3'];
    const selected = selects.map(id => document.getElementById(id).value).filter(Boolean);

    const datasets = [];

    // Winner profile baseline (always shown)
    datasets.push({
        label: 'Avg Winner Profile',
        data: t.winnerProfile,
        backgroundColor: 'rgba(248,81,73,0.08)',
        borderColor: 'rgba(248,81,73,0.5)',
        borderWidth: 2,
        borderDash: [6, 3],
        pointRadius: 3,
        pointBackgroundColor: 'rgba(248,81,73,0.5)',
    });

    // Selected players
    selected.forEach((name, i) => {
        const data = t.radarPlayers[name];
        if (!data) return;
        datasets.push({
            label: name,
            data: data,
            backgroundColor: radarColors[i].bg,
            borderColor: radarColors[i].border,
            borderWidth: 2.5,
            pointRadius: 5,
            pointBackgroundColor: radarColors[i].border,
            pointBorderColor: '#161b22',
            pointBorderWidth: 2,
        });
    });

    if (radarChartInstance) radarChartInstance.destroy();
    radarChartInstance = new Chart(document.getElementById('radar-chart'), {
        type: 'radar',
        data: { labels: t.radarAxes, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { size: 11 }, padding: 15, usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.raw}/100`
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: { stepSize: 20, display: false },
                    grid: { color: '#30363d' },
                    angleLines: { color: '#30363d' },
                    pointLabels: {
                        font: { size: 11, weight: '600' },
                        color: '#e6edf3',
                    }
                }
            }
        }
    });

    // Legend with fit scores
    const legendDiv = document.getElementById('radar-legend');
    legendDiv.innerHTML = selected.map((name, i) => {
        const data = t.radarPlayers[name];
        if (!data) return '';
        const winData = t.winnerProfile;
        // Calculate fit score: average of (player / winner) capped at 100
        const fitScore = data.reduce((sum, val, idx) => {
            const ratio = Math.min(val / winData[idx], 1.2);
            return sum + ratio;
        }, 0) / data.length * 100;
        const fitClass = fitScore >= 95 ? 'pos' : fitScore >= 80 ? 'form-warm' : fitScore >= 65 ? 'form-neutral' : 'neg';
        return `<div class="radar-legend-item">
            <span class="radar-dot" style="background:${radarColors[i].border}"></span>
            <strong>${name}</strong>
            <span class="${fitClass}">Fit: ${fitScore.toFixed(0)}%</span>
        </div>`;
    }).join('');
}

// ============================================================
// TOURNAMENT DATA DASHBOARD
// ============================================================

function loadTournament(key) {
    const t = TOURNAMENT_DATA[key];
    if (!t) return;

    // Course bar
    document.getElementById('course-name').textContent = t.course;
    document.getElementById('course-meta').textContent = t.meta;
    document.getElementById('course-archetype').textContent = t.archetype;

    // Course narrative
    if (t.narrative) {
        document.getElementById('course-description').textContent = t.narrative.description;
        document.getElementById('course-tags').innerHTML = t.narrative.tags.map(tag =>
            `<span class="course-stat-tag">${tag}</span>`
        ).join('');
        document.getElementById('key-holes-list').innerHTML = t.narrative.keyHoles.map(h =>
            `<div class="key-hole"><span class="hole-num">${h.num}</span><span class="hole-meta">Par ${h.par} | ${h.yds} yds</span><span class="hole-note">${h.note}</span></div>`
        ).join('');
        document.getElementById('winner-dna').innerHTML = `<p class="narrative-text">${t.narrative.winnerDNA}</p>`;
        document.getElementById('recent-winners').innerHTML = t.narrative.recentWinners.map(w =>
            `<div class="winner-row"><span class="winner-yr">${w.yr}</span><span class="winner-name">${w.name}</span><span class="winner-score">${w.score}</span><span class="winner-odds">${w.odds}</span><span class="winner-note">${w.note}</span></div>`
        ).join('');
        document.getElementById('course-narrative-card').style.display = '';
    } else {
        document.getElementById('course-narrative-card').style.display = 'none';
    }

    // Stat fingerprint
    const fpGrid = document.getElementById('fingerprint-grid');
    fpGrid.innerHTML = t.fingerprint.map(f => `
        <div class="fp-item">
            <div class="fp-bar-track"><div class="fp-bar" style="width:${f.weight*100*3}%"></div></div>
            <div class="fp-label">${f.stat} <span class="fp-weight">${(f.weight*100).toFixed(0)}%</span></div>
            <div class="fp-note">${f.note}</div>
        </div>
    `).join('');

    // Masked / Amplified
    document.getElementById('masked-list').innerHTML = t.masked.map(m => `<div class="mask-item">${m}</div>`).join('');
    document.getElementById('amplified-list').innerHTML = t.amplified.map(a => `<div class="amp-item">${a}</div>`).join('');

    // Density check
    const d = t.densityCheck;
    document.getElementById('density-bar').innerHTML = `
        <span class="density-label">Profile Density: ${d.profiled}/${d.total} (${d.pct}%)</span>
        <span class="density-status density-${d.status.toLowerCase()}">${d.status}</span>
        <div class="density-track"><div class="density-fill" style="width:${d.pct}%"></div></div>
    `;

    // Show/hide sections based on data availability
    const hasComposite = t.composite && t.composite.length > 0;
    const hasRH = t.rhModels && t.rhModels.length > 0;
    const hasForm = t.formSignals && t.formSignals.length > 0;
    const hasMasked = t.weaknessMasked && t.weaknessMasked.length > 0;
    const hasNarrative = t.narratives && t.narratives.length > 0;
    const hasHistory = t.courseHistory && t.courseHistory.length > 0;

    // Helper to show/hide cards — find parent card or grid-2 container
    const showCard = (el, show) => {
        if (!el) return;
        let parent = el.closest('.card');
        if (!parent) parent = el.closest('.grid-2');
        if (parent) parent.style.display = show ? '' : 'none';
    };
    showCard(document.getElementById('composite-body'), hasComposite);
    showCard(document.getElementById('rh-body'), hasRH);
    showCard(document.getElementById('form-chart'), hasForm);
    showCard(document.getElementById('masked-body'), hasMasked);
    showCard(document.getElementById('narrative-body'), hasNarrative);
    showCard(document.getElementById('history-body'), hasHistory);

    // Composite table
    const compBody = document.getElementById('composite-body');
    compBody.innerHTML = '';
    t.composite.forEach(p => {
        const tr = document.createElement('tr');
        const sigClass = signalClass(p.signal);
        const flagClass = flagStyle(p.flag);
        tr.innerHTML = `
            <td>${p.rank}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.comp.toFixed(3)}</td>
            <td>${p.form.toFixed(2)}x</td>
            <td class="${sigClass}">${p.signal}</td>
            <td>${fmtSG(p.app)}</td>
            <td>${fmtSG(p.ott)}</td>
            <td>${p.dd > 0 ? '+' : ''}${p.dd.toFixed(1)}</td>
            <td>${fmtSG(p.arg)}</td>
            <td>${fmtSG(p.putt)}</td>
            <td>${p.t10.toFixed(1)}%</td>
            <td class="flag-spike">${p.spikes || ''}</td>
            <td class="${flagClass}">${p.flag}</td>
        `;
        compBody.appendChild(tr);
    });

    // Radar chart setup
    if (t.radarAxes && t.radarPlayers) {
        const selects = ['radar-player-1', 'radar-player-2', 'radar-player-3'];
        const playerNames = Object.keys(t.radarPlayers);
        const defaults = playerNames.slice(0, 3);

        selects.forEach((id, i) => {
            const sel = document.getElementById(id);
            sel.innerHTML = '<option value="">-- Select --</option>' +
                playerNames.map(n => `<option value="${n}" ${n === defaults[i] ? 'selected' : ''}>${n}</option>`).join('');
            sel.onchange = () => renderRadar(t);
        });
        renderRadar(t);
    }

    // RH Heatmap
    const rhBody = document.getElementById('rh-body');
    rhBody.innerHTML = '';
    t.rhModels.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.name}</strong></td>
            ${heatCell(p.m15)}${heatCell(p.m16)}${heatCell(p.m17)}${heatCell(p.m18)}${heatCell(p.m19)}
            <td><strong>${p.meta}</strong></td>
        `;
        rhBody.appendChild(tr);
    });

    // Form chart
    renderFormChart(t.formSignals);

    // Weakness masked table
    const maskedBody = document.getElementById('masked-body');
    maskedBody.innerHTML = '';
    t.weaknessMasked.forEach(p => {
        const tr = document.createElement('tr');
        const maskedClass = p.masked.startsWith('YES') ? 'pos' : '';
        const ampClass = p.amplified.startsWith('YES') ? 'pos' : '';
        tr.innerHTML = `
            <td>${p.name}</td>
            <td>${p.weakness}</td>
            <td class="${maskedClass}">${p.masked}</td>
            <td>${p.strength}</td>
            <td class="${ampClass}">${p.amplified}</td>
            <td>#${p.rank}</td>
            <td class="${signalClass(p.form.split(' ')[0])}">${p.form}</td>
            <td>${p.verdict}</td>
        `;
        maskedBody.appendChild(tr);
    });

    // Narrative matrix
    const narBody = document.getElementById('narrative-body');
    narBody.innerHTML = '';
    t.narratives.sort((a, b) => b.count - a.count).forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.name}</strong></td>
            ${checkCell(p.noonan)}${checkCell(p.klos)}${checkCell(p.mayo)}${checkCell(p.stewart)}${checkCell(p.titanic)}
            <td><strong class="${p.count >= 3 ? 'pos' : ''}">${p.count}</strong></td>
            <td>#${p.rank}</td>
        `;
        narBody.appendChild(tr);
    });

    // Course history
    const histBody = document.getElementById('history-body');
    histBody.innerHTML = '';
    if (t.courseHistory) {
        t.courseHistory.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.rank}</td><td>${p.name}</td><td>${p.rounds}</td>
                <td>${p.tot}</td><td>${p.app}</td><td>${p.arg}</td>
                <td>${p.putt}</td><td>${p.ott}</td>
                <td class="${p.masters === 'N' ? 'flag-hungry' : ''}">${p.masters}</td>
            `;
            histBody.appendChild(tr);
        });
    }
}

function signalClass(sig) {
    if (sig === 'TAILWIND') return 'form-tailwind';
    if (sig === 'warm') return 'form-warm';
    if (sig === 'neutral') return 'form-neutral';
    if (sig === 'cool') return 'form-cool';
    if (sig === 'HEADWIND') return 'form-headwind';
    return '';
}

function flagStyle(flag) {
    if (flag === 'ON CARD') return 'pos';
    if (flag === 'DARK HORSE') return 'flag-value';
    if (flag === 'FADE') return 'flag-fade';
    if (flag === 'HARD ROTATE') return 'neg';
    return '';
}

function fmtSG(v) {
    const cls = v > 0 ? 'pos' : v < 0 ? 'neg' : '';
    return `<span class="${cls}">${v > 0 ? '+' : ''}${v.toFixed(2)}</span>`;
}

function heatCell(val) {
    let cls = '';
    if (val <= 5) cls = 'heat-elite';
    else if (val <= 10) cls = 'heat-top10';
    else if (val <= 25) cls = 'heat-top25';
    else if (val <= 50) cls = 'heat-mid';
    return `<td class="${cls}">${val}</td>`;
}

function checkCell(val) {
    return val ? '<td class="pos">&#10003;</td>' : '<td class="form-neutral">-</td>';
}

let formChartInstance = null;
function renderFormChart(data) {
    if (formChartInstance) formChartInstance.destroy();
    const sorted = [...data].sort((a, b) => b.bhf - a.bhf);
    formChartInstance = new Chart(document.getElementById('form-chart'), {
        type: 'bar',
        data: {
            labels: sorted.map(d => d.name.split(' ').pop()),
            datasets: [
                { label: 'Baseline %', data: sorted.map(d => d.base), backgroundColor: 'rgba(139,148,158,0.4)', borderRadius: 2 },
                { label: 'BHF (w/ form) %', data: sorted.map(d => d.bhf), backgroundColor: sorted.map(d =>
                    d.signal === 'TAILWIND' ? 'rgba(42,122,75,0.7)' :
                    d.signal === 'warm' ? 'rgba(126,231,135,0.6)' :
                    d.signal === 'cool' ? 'rgba(210,153,34,0.6)' :
                    d.signal === 'HEADWIND' ? 'rgba(248,81,73,0.6)' : 'rgba(139,148,158,0.6)'
                ), borderRadius: 2 },
            ]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'top', labels: { boxWidth: 12 } } },
            scales: {
                y: { grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => v + '%' } },
                x: { grid: { display: false }, ticks: { font: { size: 9 } } }
            }
        }
    });
}

// Tournament selector
document.getElementById('tourney-select').addEventListener('change', e => {
    loadTournament(e.target.value);
});

// Initial load
loadTournament('masters');

// Filter checkboxes
document.getElementById('filter-top30').addEventListener('change', applyFilters);
document.getElementById('filter-hungry').addEventListener('change', applyFilters);
document.getElementById('filter-spikes').addEventListener('change', applyFilters);

function applyFilters() {
    const top30 = document.getElementById('filter-top30').checked;
    const hungry = document.getElementById('filter-hungry').checked;
    const spikes = document.getElementById('filter-spikes').checked;
    const rows = document.querySelectorAll('#composite-body tr');
    rows.forEach(row => {
        const rank = parseInt(row.cells[0].textContent);
        const flag = row.cells[12].textContent;
        const spikeText = row.cells[11].textContent;
        let show = true;
        if (top30 && rank > 30) show = false;
        if (hungry && !flag.includes('HUNGRY') && !flag.includes('DARK HORSE')) show = false;
        if (spikes && !spikeText.trim()) show = false;
        row.style.display = show ? '' : 'none';
    });
}

// ============================================================
// BETTING SECTION (Season Overview)
// ============================================================

new Chart(document.getElementById('tournament-pl-chart'), {
    type: 'bar',
    data: {
        labels: TOURNAMENTS.map(t => t.name),
        datasets: [{ data: TOURNAMENTS.map(t => t.pl), backgroundColor: TOURNAMENTS.map(t => t.pl >= 0 ? 'rgba(42,122,75,0.7)' : 'rgba(192,57,43,0.6)'), borderRadius: 4 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => '$' + v } }, x: { grid: { display: false } } } }
});

const cumPL = []; let running = 0;
TOURNAMENTS.forEach(t => { running += t.pl; cumPL.push(running); });
new Chart(document.getElementById('cumulative-pl-chart'), {
    type: 'line',
    data: { labels: TOURNAMENTS.map(t => t.name), datasets: [{ data: cumPL, borderColor: '#2A7A4B', backgroundColor: 'rgba(63,185,80,0.1)', fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: cumPL.map(v => v >= 0 ? '#2A7A4B' : '#C0392B') }] },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => '$' + v } }, x: { grid: { display: false } } } }
});

new Chart(document.getElementById('market-chart'), {
    type: 'bar',
    data: { labels: MARKETS.map(m => m.type), datasets: [{ data: MARKETS.map(m => m.pl), backgroundColor: MARKETS.map(m => m.pl >= 0 ? 'rgba(42,122,75,0.7)' : 'rgba(192,57,43,0.6)'), borderRadius: 4 }] },
    options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => '$' + v } }, y: { grid: { display: false } } } }
});

new Chart(document.getElementById('ew-chart'), {
    type: 'bar',
    data: { labels: EW_TERMS.map(e => e.terms), datasets: [{ data: EW_TERMS.map(e => e.roi), backgroundColor: EW_TERMS.map(e => e.roi >= 0 ? 'rgba(42,122,75,0.7)' : 'rgba(192,57,43,0.6)'), borderRadius: 4 }] },
    options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => v + '%' } }, y: { grid: { display: false } } } }
});

// Winners table
const winnersBody = document.getElementById('winners-table');
WINNERS.forEach(w => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${w.tournament}</td><td>${w.player}</td><td>${w.market}</td><td>${w.odds}</td><td>$${w.stake.toFixed(2)}</td><td>$${w.ret.toFixed(2)}</td><td class="pos">+$${w.pl.toFixed(2)}</td>`;
    winnersBody.appendChild(tr);
});

// Current card tables
function renderCard(data, tableId, cols) {
    const tbody = document.getElementById(tableId);
    data.forEach(d => {
        const tr = document.createElement('tr');
        const sc = d.status === 'Lost' ? 'neg' : d.status === 'Open' ? '' : 'pos';
        tr.innerHTML = cols(d, sc);
        tbody.appendChild(tr);
    });
}

function formClass(form) {
    if (form.includes('TAILWIND')) return 'form-tailwind';
    if (form.includes('warm')) return 'form-warm';
    if (form.includes('HEADWIND')) return 'form-headwind';
    return 'form-neutral';
}

renderCard(HOUSTON_CARD, 'current-card-table', (d, sc) => `<td>${d.num}</td><td>${d.player}</td><td>${d.market}</td><td>${d.terms}</td><td>${d.odds}</td><td>$${d.stake}</td><td class="${formClass(d.form)}">${d.form}</td><td>${d.edge}</td><td class="${sc}">${d.status}</td>`);
renderCard(MASTERS_CARD, 'masters-card-table', (d, sc) => `<td>${d.num}</td><td>${d.player}</td><td>${d.market}</td><td>${d.terms}</td><td>${d.odds}</td><td>$${d.stake}</td><td>${d.t10s}</td><td>${d.comp}</td><td class="${sc}">${d.status}</td>`);

// ============================================================
// PLAYER INTEL
// ============================================================

function renderPlayerList(players, containerId) {
    const container = document.getElementById(containerId);
    players.forEach(p => {
        const tag = document.createElement('span');
        tag.className = 'player-tag';
        tag.innerHTML = `${p.name} <span class="${p.pl >= 0 ? 'pos' : 'neg'}">${p.pl >= 0 ? '+' : ''}$${p.pl}</span>`;
        container.appendChild(tag);
    });
}
renderPlayerList(PLAYERS.active, 'active-players');
renderPlayerList(PLAYERS.softRotate, 'soft-players');
renderPlayerList(PLAYERS.hardRotate, 'hard-players');

const allPlayers = [...PLAYERS.active, ...PLAYERS.softRotate, ...PLAYERS.hardRotate].sort((a, b) => b.pl - a.pl);
new Chart(document.getElementById('player-pl-chart'), {
    type: 'bar',
    data: { labels: allPlayers.map(p => p.name), datasets: [{ data: allPlayers.map(p => p.pl), backgroundColor: allPlayers.map(p => p.pl >= 0 ? 'rgba(42,122,75,0.7)' : 'rgba(248,81,73,0.5)'), borderRadius: 3 }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(109,196,142,0.06)' }, ticks: { callback: v => '$' + v } }, y: { grid: { display: false }, ticks: { font: { size: 10 } } } } }
});
document.getElementById('player-pl-chart').parentElement.style.height = (allPlayers.length * 28 + 50) + 'px';

const repeatBody = document.getElementById('repeat-table');
[...PLAYERS.active, ...PLAYERS.softRotate, ...PLAYERS.hardRotate].filter(p => p.bets >= 3).sort((a, b) => b.bets - a.bets).forEach(p => {
    const status = PLAYERS.hardRotate.find(h => h.name === p.name) ? 'HARD' : PLAYERS.softRotate.find(s => s.name === p.name) ? 'SOFT' : 'Active';
    const statusClass = status === 'HARD' ? 'neg' : status === 'SOFT' ? 'form-cool' : 'pos';
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>${p.bets}</td><td>${p.wins || 0}</td><td class="${p.pl >= 0 ? 'pos' : 'neg'}">${p.pl >= 0 ? '+' : ''}$${p.pl}</td><td class="${p.roi >= 0 ? 'pos' : 'neg'}">${p.roi >= 0 ? '+' : ''}${p.roi}%</td><td>${p.consec || 0}</td><td class="${statusClass}">${status}</td>`;
    repeatBody.appendChild(tr);
});

// ============================================================
// PLAYER SCOUTING
// ============================================================

function renderScoutCards(filter = '', tierFilter = '') {
    const grid = document.getElementById('scout-grid');
    grid.innerHTML = '';
    let filtered = SCOUTING;
    if (filter) filtered = filtered.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
    if (tierFilter) filtered = filtered.filter(p => p.tier === tierFilter);
    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'scout-card';
        const tierClass = p.tier === 'Elite' ? 'tier-elite' : p.tier === 'Contender' ? 'tier-contender' : p.tier === 'Mid-field' ? 'tier-midfield' : 'tier-veteran';

        // SG bar widths (normalize to 0-100 based on max ~1.0)
        const sgBars = [
            { label: 'APP', val: p.app, max: 1.0 },
            { label: 'OTT', val: p.ott, max: 1.0 },
            { label: 'ARG', val: p.arg, max: 0.5 },
            { label: 'PUTT', val: p.putt, max: 0.7 },
        ];

        card.innerHTML = `
            <div class="scout-header">
                <h4>${p.name}</h4>
                <span class="tier-badge ${tierClass}">${p.tier}</span>
            </div>
            <div class="scout-sg-bars">
                ${sgBars.map(s => {
                    const pct = Math.min(Math.max((s.val / s.max) * 50 + 50, 5), 100);
                    const cls = s.val > 0.2 ? 'sg-positive' : s.val > 0 ? 'sg-neutral' : 'sg-negative';
                    return `<div class="sg-bar-row">
                        <span class="sg-bar-label">${s.label}</span>
                        <div class="sg-bar-track"><div class="sg-bar-fill ${cls}" style="width:${pct}%"></div></div>
                        <span class="sg-bar-val ${s.val >= 0 ? 'pos' : 'neg'}">${s.val >= 0 ? '+' : ''}${s.val.toFixed(2)}</span>
                    </div>`;
                }).join('')}
            </div>
            <div class="scout-meta">
                <span>SG:TOT ${p.sg_tot >= 0 ? '+' : ''}${p.sg_tot.toFixed(2)}</span>
                <span>DD ${p.dd >= 0 ? '+' : ''}${p.dd.toFixed(1)}</span>
                <span>${p.shape}</span>
                <span>${p.surface}</span>
            </div>
            <div class="scout-section"><strong class="pos">Strengths:</strong> ${p.strengths}</div>
            <div class="scout-section"><strong class="neg">Weaknesses:</strong> ${p.weaknesses}</div>
            <div class="scout-section scout-notes">${p.notes}</div>
        `;
        grid.appendChild(card);
    });
}

document.getElementById('scout-search-input').addEventListener('input', () => applyScoutFilters());
const tierFilter = document.getElementById('scout-tier-filter');
if (tierFilter) tierFilter.addEventListener('change', () => applyScoutFilters());

function applyScoutFilters() {
    const search = document.getElementById('scout-search-input').value;
    const tier = document.getElementById('scout-tier-filter') ? document.getElementById('scout-tier-filter').value : '';
    renderScoutCards(search, tier);
}
renderScoutCards('', '');

// ============================================================
// COURSES
// ============================================================
const courseGrid = document.getElementById('course-grid');
COURSES.forEach(c => {
    const card = document.createElement('div');
    card.className = 'course-card';
    const badge = c.status === 'live' ? '<span class="badge live">LIVE</span>' : c.status === 'upcoming' ? '<span class="badge upcoming">UPCOMING</span>' : '<span class="badge settled">SETTLED</span>';
    card.innerHTML = `
        <h4>${c.name} ${badge}</h4>
        <div class="course-meta">${c.event} | ${c.surface} | ${c.length} | ${c.scoring}</div>
        <div class="course-meta"><strong>Archetype:</strong> ${c.archetype}</div>
        <div class="course-meta"><strong>Masked:</strong> ${c.masked}</div>
        <div class="course-meta"><strong>Amplified:</strong> ${c.amplified}</div>
        <div class="course-stats">${c.topStats.map(s => `<span class="course-stat-tag">${s}</span>`).join('')}</div>
        <div class="course-meta" style="margin-top:0.5rem">${c.bets} bets | P/L: <span class="${c.pl >= 0 ? 'pos' : 'neg'}">$${c.pl}</span></div>
    `;
    courseGrid.appendChild(card);
});
