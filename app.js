// ═══════════════════════════════════════════════════════════
// GREENBOOK — Main Application
// ═══════════════════════════════════════════════════════════

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.section).classList.add('active');
    });
});

// Chart defaults
Chart.defaults.color = '#A89880';
Chart.defaults.borderColor = 'rgba(109, 196, 142, 0.12)';
Chart.defaults.font.family = "'DM Mono', 'Courier New', monospace";
Chart.defaults.font.size = 10;

const GRID_COLOR = 'rgba(109,196,142,0.06)';
const GREEN_BAR = 'rgba(42,122,75,0.7)';
const RED_BAR = 'rgba(192,57,43,0.6)';
const radarColors = [
    { bg: 'rgba(46,125,209,0.15)', border: '#2E7DD1' },
    { bg: 'rgba(42,122,75,0.15)', border: '#3D9E64' },
    { bg: 'rgba(201,160,70,0.15)', border: '#C9A046' },
];

// ═══ TOURNAMENT LOADER (single function, one set of IDs) ═══

let radarInst = null;
let formInst = null;

function loadTournament(key) {
    const t = TOURNAMENT_DATA[key];
    if (!t) return;

    // Course bar
    document.getElementById('course-name').textContent = t.course || t.name;
    document.getElementById('course-meta').textContent = t.meta || '';
    document.getElementById('course-archetype').textContent = t.archetype || '';

    // Result banner
    const slot = document.getElementById('result-banner-slot');
    slot.innerHTML = '';
    if (t.result2026) {
        slot.innerHTML = `<div class="result-banner"><div class="result-winner"><span class="result-label">2026 Winner: </span>${t.result2026.winner} (${t.result2026.score})</div><div class="result-why">${t.result2026.why}</div></div>`;
    }

    // Narrative
    const ns = document.getElementById('narrative-section');
    if (t.narrative) {
        ns.style.display = '';
        document.getElementById('course-description').textContent = t.narrative.description || '';
        document.getElementById('course-tags').innerHTML = (t.narrative.tags||[]).map(s => `<span class="course-stat-tag">${s}</span>`).join('');
        document.getElementById('masked-list').innerHTML = (t.masked||[]).map(m => `<div class="mask-item">${m}</div>`).join('');
        document.getElementById('amplified-list').innerHTML = (t.amplified||[]).map(a => `<div class="amp-item">${a}</div>`).join('');
        document.getElementById('winner-dna').textContent = t.narrative.winnerDNA || '';
        const corrEl = document.getElementById('correlated-courses');
        if (t.narrative.correlated) {
            corrEl.innerHTML = `<div style="font-family:var(--font-mono);font-size:0.65rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--brass-500);margin-bottom:0.35rem">Correlated Courses</div><div class="narrative-text" style="font-size:0.78rem">${t.narrative.correlated}</div>`;
        } else { corrEl.innerHTML = ''; }
        document.getElementById('key-holes').innerHTML = (t.narrative.keyHoles||[]).map(h => `<div class="key-hole"><span class="hole-num">${h.num}</span><span class="hole-meta">Par ${h.par} | ${h.yds} yds</span><span class="hole-note">${h.note}</span></div>`).join('');
        document.getElementById('recent-winners').innerHTML = (t.narrative.recentWinners||[]).map(w => `<div class="winner-row"><span class="winner-yr">${w.yr}</span><span class="winner-name">${w.name}</span><span class="winner-score">${w.score}</span><span class="winner-odds">${w.odds}</span><span class="winner-note">${w.note}</span></div>`).join('');
    } else { ns.style.display = 'none'; }

    // Fingerprint
    document.getElementById('fingerprint-grid').innerHTML = (t.fingerprint||[]).map(f => `<div class="fp-item"><div class="fp-bar-track"><div class="fp-bar" style="width:${f.weight*300}%"></div></div><div class="fp-label">${f.stat} <span class="fp-weight">${(f.weight*100).toFixed(0)}%</span></div><div class="fp-note">${f.note}</div></div>`).join('');

    // Radar
    if (t.radarAxes && t.radarPlayers) {
        const names = Object.keys(t.radarPlayers);
        ['radar-p1','radar-p2','radar-p3'].forEach((id,i) => {
            const el = document.getElementById(id);
            el.innerHTML = '<option value="">-- Select --</option>' + names.map(n => `<option value="${n}" ${n===names[i]?'selected':''}>${n}</option>`).join('');
            el.onchange = () => drawRadar(t);
        });
        drawRadar(t);
    }

    // Tournament Notes
    const notesEl = document.getElementById('tourney-notes');
    const notesCard = document.getElementById('tourney-notes-card');
    if (notesEl) notesEl.innerHTML = '';
    if (t.notes && t.notes.length) {
        if (notesCard) notesCard.style.display = '';
        const icons = { like: '&#9650;', bet: '&#10003;', fade: '&#9660;', watch: '&#9673;', process: '&#9881;' };
        const colors = { like: 'pos', bet: 'pos', fade: 'neg', watch: 'form-warm', process: 'form-neutral' };
        const labels = { like: 'LIKE', bet: 'ON CARD', fade: 'FADE', watch: 'WATCH', process: 'PROCESS' };
        t.notes.forEach(n => {
            const icon = icons[n.type] || '';
            const cls = colors[n.type] || '';
            const label = labels[n.type] || '';
            const playerLine = n.player ? `<strong>${n.player}</strong> ` : '';
            notesEl.innerHTML += `<div class="note-item"><span class="note-badge ${cls}">${icon} ${label}</span>${playerLine}<span class="note-text">${n.text}</span></div>`;
        });
    } else {
        if (notesCard) notesCard.style.display = 'none';
    }

    // Composite
    const cb = document.getElementById('composite-body');
    cb.innerHTML = '';
    if (t.composite && t.composite.length) {
        if (t.densityCheck) {
            const d = t.densityCheck;
            document.getElementById('density-bar').innerHTML = `<span class="density-label">Profile Density: ${d.profiled}/${d.total} (${d.pct}%)</span><span class="density-status density-${d.status.toLowerCase()}">${d.status}</span><div class="density-track"><div class="density-fill" style="width:${d.pct}%"></div></div>`;
        }
        t.composite.forEach(p => {
            cb.innerHTML += `<tr><td>${p.rank}</td><td><strong>${p.name}</strong></td><td>${p.comp.toFixed(3)}</td><td>${p.form.toFixed(2)}x</td><td class="${sigCls(p.signal)}">${p.signal}</td><td>${sg(p.app)}</td><td>${sg(p.ott)}</td><td>${p.dd>0?'+':''}${p.dd.toFixed(1)}</td><td>${sg(p.arg)}</td><td>${sg(p.putt)}</td><td>${p.t10.toFixed(1)}%</td><td class="flag-spike">${p.spikes||''}</td><td class="${flagCls(p.flag)}">${p.flag}</td></tr>`;
        });
    } else { cb.innerHTML = '<tr><td colspan="13" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1.5rem">Composite data populates closer to tournament week</td></tr>'; }

    // RH Heatmap
    const rb = document.getElementById('rh-body');
    rb.innerHTML = '';
    if (t.rhModels && t.rhModels.length) {
        t.rhModels.forEach(p => { rb.innerHTML += `<tr><td><strong>${p.name}</strong></td>${hc(p.m15)}${hc(p.m16)}${hc(p.m17)}${hc(p.m18)}${hc(p.m19)}<td><strong>${p.meta}</strong></td></tr>`; });
    } else { rb.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1rem">RH model data loads with tournament analysis</td></tr>'; }

    // Form chart
    if (formInst) { formInst.destroy(); formInst = null; }
    const formPlaceholder = document.getElementById('form-chart-placeholder');
    const formCanvas = document.getElementById('form-chart');
    if (t.formSignals && t.formSignals.length) {
        if (formPlaceholder) formPlaceholder.style.display = 'none';
        if (formCanvas) formCanvas.style.display = '';
        const sorted = [...t.formSignals].sort((a,b) => b.bhf - a.bhf);
        formInst = new Chart(document.getElementById('form-chart'), {
            type:'bar', data: { labels: sorted.map(d=>d.name.split(' ').pop()),
            datasets: [
                { label:'Baseline %', data:sorted.map(d=>d.base), backgroundColor:'rgba(168,152,128,0.3)', borderRadius:2 },
                { label:'BHF %', data:sorted.map(d=>d.bhf), backgroundColor:sorted.map(d=> d.signal==='TAILWIND'?GREEN_BAR:d.signal==='warm'?'rgba(109,196,142,0.5)':d.signal==='cool'?'rgba(201,160,70,0.5)':d.signal==='HEADWIND'?RED_BAR:'rgba(168,152,128,0.5)'), borderRadius:2 }
            ]}, options: { responsive:true, plugins:{legend:{position:'top',labels:{boxWidth:10,font:{size:9}}}}, scales:{y:{grid:{color:GRID_COLOR},ticks:{callback:v=>v+'%'}},x:{grid:{display:false},ticks:{font:{size:8}}}} }
        });
    } else {
        if (formPlaceholder) formPlaceholder.style.display = '';
        if (formCanvas) formCanvas.style.display = 'none';
    }

    // Weakness masked
    const mb = document.getElementById('masked-body');
    mb.innerHTML = '';
    if (t.weaknessMasked && t.weaknessMasked.length) {
        t.weaknessMasked.forEach(p => { mb.innerHTML += `<tr><td>${p.name}</td><td>${p.weakness}</td><td class="${p.masked.startsWith('YES')?'pos':''}">${p.masked}</td><td>${p.strength}</td><td class="${p.amplified.startsWith('YES')?'pos':''}">${p.amplified}</td><td>#${p.rank}</td><td class="${sigCls(p.form.split(' ')[0])}">${p.form}</td><td>${p.verdict}</td></tr>`; });
    } else { mb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1rem">Weakness-masked analysis loads with tournament data</td></tr>'; }

    // Narrative matrix
    const nb = document.getElementById('narrative-body');
    nb.innerHTML = '';
    if (t.narratives && t.narratives.length) {
        t.narratives.sort((a,b)=>b.count-a.count).forEach(p => { nb.innerHTML += `<tr><td><strong>${p.name}</strong></td>${ck(p.noonan)}${ck(p.klos)}${ck(p.mayo)}${ck(p.stewart)}${ck(p.titanic)}<td><strong class="${p.count>=3?'pos':''}">${p.count}</strong></td><td>#${p.rank}</td></tr>`; });
    } else { nb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1rem">Narrative source data loads with analysis</td></tr>'; }

    // Bets rendering moved to My Betting tab
}

function drawRadar(t) {
    const sel = ['radar-p1','radar-p2','radar-p3'].map(id=>document.getElementById(id).value).filter(Boolean);
    const ds = [{ label:'Avg Winner', data:t.winnerProfile, backgroundColor:'rgba(192,57,43,0.06)', borderColor:'rgba(192,57,43,0.45)', borderWidth:2, borderDash:[6,3], pointRadius:3, pointBackgroundColor:'rgba(192,57,43,0.45)' }];
    sel.forEach((n,i) => { const d=t.radarPlayers[n]; if(!d) return; ds.push({ label:n, data:d, backgroundColor:radarColors[i].bg, borderColor:radarColors[i].border, borderWidth:2.5, pointRadius:5, pointBackgroundColor:radarColors[i].border, pointBorderColor:'#0D1F16', pointBorderWidth:2 }); });
    if (radarInst) radarInst.destroy();
    radarInst = new Chart(document.getElementById('radar-chart'), {
        type:'radar', data:{labels:t.radarAxes, datasets:ds},
        options: { responsive:true, plugins:{legend:{position:'bottom',labels:{boxWidth:10,font:{size:9},usePointStyle:true}}}, scales:{r:{min:0,max:100,ticks:{display:false},grid:{color:'rgba(109,196,142,0.1)'},angleLines:{color:'rgba(109,196,142,0.1)'},pointLabels:{font:{size:10,weight:'600'},color:'#F5EDD9'}}} }
    });
    document.getElementById('radar-legend').innerHTML = sel.map((n,i) => { const d=t.radarPlayers[n]; if(!d) return ''; const fit=d.reduce((s,v,idx)=>s+Math.min(v/t.winnerProfile[idx],1.2),0)/d.length*100; const c=fit>=95?'pos':fit>=80?'form-warm':fit>=65?'form-neutral':'neg'; return `<div class="radar-legend-item"><span class="radar-dot" style="background:${radarColors[i].border}"></span><strong>${n}</strong> <span class="${c}">Fit: ${fit.toFixed(0)}%</span></div>`; }).join('');
}

// Helpers
function sigCls(s) { return s==='TAILWIND'?'form-tailwind':s==='warm'?'form-warm':s==='neutral'?'form-neutral':s==='cool'?'form-cool':s==='HEADWIND'?'form-headwind':''; }
function flagCls(f) { return f==='ON CARD'||f.includes('WON')?'pos':f==='DARK HORSE'?'flag-value':f==='FADE'?'flag-fade':f==='HARD ROTATE'?'neg':''; }
function sg(v) { const c=v>0?'pos':v<0?'neg':''; return `<span class="${c}">${v>0?'+':''}${v.toFixed(2)}</span>`; }
function hc(v) { const c=v<=5?'heat-elite':v<=10?'heat-top10':v<=25?'heat-top25':'heat-mid'; return `<td class="${c}">${v}</td>`; }
function ck(v) { return v?'<td class="pos">&#10003;</td>':'<td style="color:var(--cream-700)">-</td>'; }

// Timeline
document.querySelectorAll('.timeline-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadTournament(btn.dataset.t);
    });
});

// Initial load — find the most current tournament (first live, then first upcoming)
function getCurrentTournament() {
    const timeline = document.querySelectorAll('.timeline-btn[data-t]');
    for (const btn of timeline) {
        if (btn.classList.contains('live')) return btn.dataset.t;
    }
    for (const btn of timeline) {
        if (btn.classList.contains('upcoming')) return btn.dataset.t;
    }
    return 'masters';
}
const currentKey = getCurrentTournament();
loadTournament(currentKey);
// Set the matching timeline button as active
document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
const activeBtn = document.querySelector(`.timeline-btn[data-t="${currentKey}"]`);
if (activeBtn) activeBtn.classList.add('active');

// ═══ DATA CENTER ═══

function buildDataCenter() {
    const sorted = [...SCOUTING].sort((a,b)=>b.sg_tot-a.sg_tot);
    const best = (key) => [...SCOUTING].sort((a,b)=>b[key]-a[key])[0];

    // Stat leader cards
    [['dc-best-tot','sg_tot'],['dc-best-app','app'],['dc-best-ott','ott'],['dc-best-arg','arg'],['dc-best-putt','putt']].forEach(([id,key]) => {
        const p = best(key);
        const el = document.getElementById(id);
        if(el) { el.querySelector('.stat-value').textContent = p.name.split(' ').pop(); el.querySelector('.stat-label').textContent += ` (+${p[key].toFixed(2)})`; }
    });
    const dd = best('dd');
    const ddEl = document.getElementById('dc-best-dd');
    if(ddEl) { ddEl.querySelector('.stat-value').textContent = dd.name.split(' ').pop(); ddEl.querySelector('.stat-label').textContent += ` (+${dd.dd.toFixed(1)})`; }

    // Stacked bar
    const top10 = sorted.slice(0,10);
    new Chart(document.getElementById('dc-stacked-chart'), {
        type:'bar', data:{ labels:top10.map(p=>p.name.split(' ').pop()),
        datasets:[
            {label:'APP',data:top10.map(p=>Math.max(0,p.app)),backgroundColor:'rgba(46,125,209,0.8)',borderRadius:2},
            {label:'OTT',data:top10.map(p=>Math.max(0,p.ott)),backgroundColor:'rgba(42,122,75,0.8)',borderRadius:2},
            {label:'ARG',data:top10.map(p=>Math.max(0,p.arg)),backgroundColor:'rgba(201,160,70,0.8)',borderRadius:2},
            {label:'PUTT',data:top10.map(p=>Math.max(0,p.putt)),backgroundColor:'rgba(188,140,255,0.7)',borderRadius:2},
        ]}, options:{responsive:true,plugins:{legend:{position:'top',labels:{boxWidth:10,font:{size:9}}}},scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,grid:{color:GRID_COLOR},ticks:{callback:v=>'+'+v.toFixed(1)}}}}
    });

    // Scatter
    new Chart(document.getElementById('dc-scatter-chart'), {
        type:'scatter', data:{ datasets:[{ data:SCOUTING.map(p=>({x:p.app,y:p.putt,name:p.name})),
        backgroundColor:SCOUTING.map(p=>p.tier==='Elite'?'rgba(42,122,75,0.8)':p.tier==='Contender'?'rgba(46,125,209,0.6)':'rgba(168,152,128,0.4)'),
        pointRadius:SCOUTING.map(p=>p.tier==='Elite'?8:p.tier==='Contender'?6:4) }]},
        options:{responsive:true,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.raw.name}: APP ${c.raw.x>0?'+':''}${c.raw.x.toFixed(2)}, PUTT ${c.raw.y>0?'+':''}${c.raw.y.toFixed(2)}`}}},scales:{x:{title:{display:true,text:'SG: Approach',color:'#A89880'},grid:{color:GRID_COLOR}},y:{title:{display:true,text:'SG: Putting',color:'#A89880'},grid:{color:GRID_COLOR}}}}
    });

    // Player profiles
    renderScoutCards();

    // Archetype matrix
    const ab = document.getElementById('archetype-body');
    SCOUTING.forEach(p => {
        const ss=Math.min(100,(p.app/0.9)*50+(p.arg/0.4)*25+25);
        const bo=Math.min(100,(p.dd/20)*40+(p.ott/0.9)*35+25);
        const be=Math.min(100,(p.putt/0.6)*45+(p.arg/0.4)*30+25);
        const po=Math.min(100,(p.putt/0.6)*40+(p.app/0.9)*35+25);
        const gr=Math.min(100,50+(p.arg/0.4)*25+(p.putt/0.6)*25-(p.dd/20)*10);
        const sg=Math.min(100,(p.arg/0.4)*45+(p.putt/0.6)*30+25);
        const wi=Math.min(100,(p.ott/0.9)*35+(p.app/0.9)*35+30);
        ab.innerHTML += `<tr><td><strong>${p.name}</strong></td>${[ss,bo,be,po,gr,sg,wi].map(v=>{v=Math.max(0,Math.min(100,v)).toFixed(0);const c=v>=75?'heat-elite':v>=60?'heat-top10':v>=45?'heat-top25':'heat-mid';return `<td class="${c}">${v}</td>`;}).join('')}</tr>`;
    });

    // Course library
    const cg = document.getElementById('course-grid');
    COURSES.forEach(c => {
        const badge = c.status==='live'?'<span class="badge live">LIVE</span>':c.status==='upcoming'?'<span class="badge upcoming">UPCOMING</span>':'<span class="badge settled">SETTLED</span>';
        const tKey = c.dataKey || '';
        cg.innerHTML += `<div class="course-card" ${tKey ? `data-tournament="${tKey}"` : ''}><h4>${c.name} ${badge}</h4><div class="course-meta">${c.event} | ${c.surface} | ${c.length}</div><div class="course-meta"><strong>Archetype:</strong> ${c.archetype}</div><div class="course-meta"><strong>Masked:</strong> ${c.masked}</div><div class="course-meta"><strong>Amplified:</strong> ${c.amplified}</div><div class="course-stats">${c.topStats.map(s=>`<span class="course-stat-tag">${s}</span>`).join('')}</div>${tKey ? '<div class="course-meta" style="margin-top:0.5rem;color:var(--brass-400)">Click to view tournament analysis &rarr;</div>' : ''}</div>`;
    });
}

function renderScoutCards(filter,tier) {
    const grid = document.getElementById('scout-grid');
    grid.innerHTML = '';
    let list = SCOUTING;
    if (filter) list = list.filter(p=>p.name.toLowerCase().includes(filter.toLowerCase()));
    if (tier) list = list.filter(p=>p.tier===tier);
    list.forEach(p => {
        const tc = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':p.tier==='Mid-field'?'tier-midfield':'tier-veteran';
        const bars = [{l:'APP',v:p.app,m:1},{l:'OTT',v:p.ott,m:1},{l:'ARG',v:p.arg,m:0.5},{l:'PUTT',v:p.putt,m:0.7}];
        const hasSurface = p.putt_bermuda !== undefined;
        const surfaceHtml = hasSurface ? `<div class="surface-putting"><span class="sp-label">Putting by surface:</span><span class="sp-val ${p.putt_bermuda>=0?'pos':'neg'}">Bermuda ${p.putt_bermuda>=0?'+':''}${p.putt_bermuda.toFixed(2)}</span><span class="sp-val ${p.putt_bent>=0?'pos':'neg'}">Bent ${p.putt_bent>=0?'+':''}${p.putt_bent.toFixed(2)}</span><span class="sp-val ${p.putt_poa>=0?'pos':'neg'}">Poa ${p.putt_poa>=0?'+':''}${p.putt_poa.toFixed(2)}</span></div>` : '';
        grid.innerHTML += `<div class="scout-card"><div class="scout-header"><h4>${p.name}</h4><span class="tier-badge ${tc}">${p.tier}</span></div><div class="scout-sg-bars">${bars.map(b=>{const pct=Math.min(Math.max((b.v/b.m)*50+50,5),100);const cls=b.v>0.2?'sg-positive':b.v>0?'sg-neutral':'sg-negative';return `<div class="sg-bar-row"><span class="sg-bar-label">${b.l}</span><div class="sg-bar-track"><div class="sg-bar-fill ${cls}" style="width:${pct}%"></div></div><span class="sg-bar-val ${b.v>=0?'pos':'neg'}">${b.v>=0?'+':''}${b.v.toFixed(2)}</span></div>`;}).join('')}</div><div class="scout-meta"><span>TOT ${p.sg_tot>=0?'+':''}${p.sg_tot.toFixed(2)}</span><span>DD ${p.dd>=0?'+':''}${p.dd.toFixed(1)}</span><span>${p.shape}</span><span>${p.surface}</span></div>${surfaceHtml}<div class="scout-section"><strong class="pos">Strengths:</strong> ${p.strengths}</div><div class="scout-section"><strong class="neg">Weaknesses:</strong> ${p.weaknesses}</div><div class="scout-section scout-notes">${p.notes}</div></div>`;
    });
}

document.getElementById('scout-search-input').addEventListener('input', () => { renderScoutCards(document.getElementById('scout-search-input').value, document.getElementById('scout-tier-filter').value); });
document.getElementById('scout-tier-filter').addEventListener('change', () => { renderScoutCards(document.getElementById('scout-search-input').value, document.getElementById('scout-tier-filter').value); });

// Quick tags
document.querySelectorAll('.quick-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.quick-tag').forEach(t => t.classList.remove('active'));

        if (tag.dataset.reset) {
            document.getElementById('scout-tier-filter').value = '';
            renderScoutCards('', '');
            return;
        }

        tag.classList.add('active');

        if (tag.dataset.filter) {
            document.getElementById('scout-tier-filter').value = tag.dataset.filter;
            renderScoutCards('', tag.dataset.filter);
        } else if (tag.dataset.stat) {
            // Sort by specific stat, show top 15
            document.getElementById('scout-tier-filter').value = '';
            const key = tag.dataset.stat;
            const sorted = [...SCOUTING].sort((a,b) => b[key] - a[key]).slice(0,15);
            renderScoutCardsFromList(sorted);
        } else if (tag.dataset.surface) {
            // Sort by surface-specific putting
            document.getElementById('scout-tier-filter').value = '';
            const key = 'putt_' + tag.dataset.surface;
            const sorted = [...SCOUTING].filter(p => p[key] !== undefined).sort((a,b) => b[key] - a[key]).slice(0,15);
            renderScoutCardsFromList(sorted);
        }
    });
});

function renderScoutCardsFromList(list) {
    const grid = document.getElementById('scout-grid');
    grid.innerHTML = '';
    list.forEach(p => {
        const tc = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':p.tier==='Mid-field'?'tier-midfield':'tier-veteran';
        const bars = [{l:'APP',v:p.app,m:1},{l:'OTT',v:p.ott,m:1},{l:'ARG',v:p.arg,m:0.5},{l:'PUTT',v:p.putt,m:0.7}];
        const hasSurface = p.putt_bermuda !== undefined;
        const surfaceHtml = hasSurface ? `<div class="surface-putting"><span class="sp-label">Putting by surface:</span><span class="sp-val ${p.putt_bermuda>=0?'pos':'neg'}">Bermuda ${p.putt_bermuda>=0?'+':''}${p.putt_bermuda.toFixed(2)}</span><span class="sp-val ${p.putt_bent>=0?'pos':'neg'}">Bent ${p.putt_bent>=0?'+':''}${p.putt_bent.toFixed(2)}</span><span class="sp-val ${p.putt_poa>=0?'pos':'neg'}">Poa ${p.putt_poa>=0?'+':''}${p.putt_poa.toFixed(2)}</span></div>` : '';
        grid.innerHTML += `<div class="scout-card"><div class="scout-header"><h4>${p.name}</h4><span class="tier-badge ${tc}">${p.tier}</span></div><div class="scout-sg-bars">${bars.map(b=>{const pct=Math.min(Math.max((b.v/b.m)*50+50,5),100);const cls=b.v>0.2?'sg-positive':b.v>0?'sg-neutral':'sg-negative';return `<div class="sg-bar-row"><span class="sg-bar-label">${b.l}</span><div class="sg-bar-track"><div class="sg-bar-fill ${cls}" style="width:${pct}%"></div></div><span class="sg-bar-val ${b.v>=0?'pos':'neg'}">${b.v>=0?'+':''}${b.v.toFixed(2)}</span></div>`;}).join('')}</div><div class="scout-meta"><span>TOT ${p.sg_tot>=0?'+':''}${p.sg_tot.toFixed(2)}</span><span>DD ${p.dd>=0?'+':''}${p.dd.toFixed(1)}</span><span>${p.shape}</span><span>${p.surface}</span></div>${surfaceHtml}<div class="scout-section"><strong class="pos">Strengths:</strong> ${p.strengths}</div><div class="scout-section"><strong class="neg">Weaknesses:</strong> ${p.weaknesses}</div><div class="scout-section scout-notes">${p.notes}</div></div>`;
    });
}

buildDataCenter();

// Course card click -> navigate to tournament
document.getElementById('course-grid').addEventListener('click', e => {
    const card = e.target.closest('.course-card[data-tournament]');
    if (!card) return;
    const key = card.dataset.tournament;
    // Switch to Tournaments tab
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelector('[data-section="tournament"]').classList.add('active');
    document.getElementById('tournament').classList.add('active');
    // Load the tournament
    document.querySelectorAll('.timeline-btn').forEach(b => b.classList.remove('active'));
    const tb = document.querySelector(`.timeline-btn[data-t="${key}"]`);
    if (tb) tb.classList.add('active');
    loadTournament(key);
    window.scrollTo(0, 0);
});

// ═══ BETTING SECTION ═══

new Chart(document.getElementById('tournament-pl-chart'), { type:'bar', data:{labels:TOURNAMENTS.map(t=>t.name),datasets:[{data:TOURNAMENTS.map(t=>t.pl),backgroundColor:TOURNAMENTS.map(t=>t.pl>=0?GREEN_BAR:RED_BAR),borderRadius:4}]}, options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{grid:{color:GRID_COLOR},ticks:{callback:v=>'$'+v}},x:{grid:{display:false}}}} });

const cumPL=[]; let run=0; TOURNAMENTS.forEach(t=>{run+=t.pl;cumPL.push(run);});
new Chart(document.getElementById('cumulative-pl-chart'), { type:'line', data:{labels:TOURNAMENTS.map(t=>t.name),datasets:[{data:cumPL,borderColor:'#2A7A4B',backgroundColor:'rgba(42,122,75,0.1)',fill:true,tension:0.3,pointRadius:4,pointBackgroundColor:cumPL.map(v=>v>=0?'#2A7A4B':'#C0392B')}]}, options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{grid:{color:GRID_COLOR},ticks:{callback:v=>'$'+v}},x:{grid:{display:false}}}} });

new Chart(document.getElementById('market-chart'), { type:'bar', data:{labels:MARKETS.map(m=>m.type),datasets:[{data:MARKETS.map(m=>m.pl),backgroundColor:MARKETS.map(m=>m.pl>=0?GREEN_BAR:RED_BAR),borderRadius:4}]}, options:{indexAxis:'y',responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{color:GRID_COLOR},ticks:{callback:v=>'$'+v}},y:{grid:{display:false}}}} });

new Chart(document.getElementById('ew-chart'), { type:'bar', data:{labels:EW_TERMS.map(e=>e.terms),datasets:[{data:EW_TERMS.map(e=>e.roi),backgroundColor:EW_TERMS.map(e=>e.roi>=0?GREEN_BAR:RED_BAR),borderRadius:4}]}, options:{indexAxis:'y',responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{color:GRID_COLOR},ticks:{callback:v=>v+'%'}},y:{grid:{display:false}}}} });

document.getElementById('winners-table').innerHTML = WINNERS.map(w => `<tr><td>${w.tournament}</td><td>${w.player}</td><td>${w.market}</td><td>${w.odds}</td><td>$${w.stake.toFixed(2)}</td><td>$${w.ret.toFixed(2)}</td><td class="pos">+$${w.pl.toFixed(2)}</td></tr>`).join('');

function renderPlayers(list, id) { const el=document.getElementById(id); list.forEach(p=>{ el.innerHTML += `<span class="player-tag">${p.name} <span class="${p.pl>=0?'pos':'neg'}">${p.pl>=0?'+':''}$${p.pl}</span></span>`; }); }
renderPlayers(PLAYERS.active,'active-players');
renderPlayers(PLAYERS.softRotate,'soft-players');
renderPlayers(PLAYERS.hardRotate,'hard-players');

// Sub-tabs (used in Data Center and elsewhere)
document.querySelectorAll('.sub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.closest('.card');
        if (!parent) return;
        parent.querySelectorAll('.sub-tab').forEach(b => b.classList.remove('active'));
        parent.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.subtab);
        if (target) target.classList.add('active');
    });
});

// Render bet cards
function renderBetCard(data, tbodyId, book) {
    const tb = document.getElementById(tbodyId);
    if (!tb) return;
    data.forEach(d => {
        const sc = d.status==='Lost'?'neg':d.status==='Open'?'':'pos';
        // Clean bet description
        let betType = d.market || 'Outright';
        if (d.terms && d.terms !== 'Win') betType += ' ' + d.terms;
        const bk = book || d.book || 'bet365';
        tb.innerHTML += `<tr><td><strong>${d.player}</strong></td><td>${betType}</td><td>${bk}</td><td>${d.odds}</td><td>$${d.stake.toFixed(2)}</td><td class="${sc}">${d.status}</td></tr>`;
    });
}
renderBetCard(HOUSTON_CARD, 'ab-houston', 'bet365');
renderBetCard(VALERO_CARD, 'ab-valero', 'DraftKings');
renderBetCard(MASTERS_CARD, 'ab-masters', 'bet365');

// Odds board in My Betting
function renderBettingOdds(key) {
    const t = TOURNAMENT_DATA[key];
    const ob = document.getElementById('odds-body');
    ob.innerHTML = '';
    if (t && t.oddsBoard && t.oddsBoard.length) {
        t.oddsBoard.forEach(o => {
            const ev = parseFloat(o.edge);
            const ec = ev>3?'pos':ev>0?'form-warm':ev>-3?'form-neutral':'neg';
            const vc = o.verdict.includes('VALUE')?'pos':o.verdict.includes('OVERPRICED')?'neg':'';
            ob.innerHTML += `<tr><td>${o.rank}</td><td><strong>${o.name}</strong></td><td style="font-family:var(--font-mono)">${o.fair}</td><td style="font-family:var(--font-mono)">${o.best}</td><td style="font-family:var(--font-mono)">${o.b365}</td><td class="${ec}" style="font-family:var(--font-mono);font-weight:600">${o.edge}</td><td class="${sigCls(o.form)}">${o.form}</td><td class="${vc}" style="font-size:0.72rem">${o.verdict}</td></tr>`;
        });
    } else {
        ob.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1rem">No odds board data for this tournament yet</td></tr>';
    }
}
document.getElementById('betting-tourney-select').addEventListener('change', e => renderBettingOdds(e.target.value));
renderBettingOdds('masters');
