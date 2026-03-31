// ═══════════════════════════════════════════════════════════
// GREENBOOK — Main Application
// ═══════════════════════════════════════════════════════════

// Player popup card
function showPlayerPopup(name) {
    var p = SCOUTING.find(function(s){return s.name === name});
    var popup = document.getElementById('player-popup');
    var content = document.getElementById('player-popup-content');
    if (!popup || !content) return;
    if (!p) {
        content.innerHTML = '<div class="popup-header"><h3>'+name+'</h3><button class="popup-close" onclick="document.getElementById(\'player-popup\').classList.add(\'hidden\')">&times;</button></div><p class="narrative-text">Not in player database yet.</p>';
        popup.classList.remove('hidden');
        return;
    }

    var tc = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':p.tier==='Mid-field'?'tier-midfield':'tier-veteran';
    var stats = [{l:'APP',v:p.app,m:1},{l:'OTT',v:p.ott,m:1},{l:'ARG',v:p.arg,m:0.5},{l:'PUTT',v:p.putt,m:0.7},{l:'TOT',v:p.sg_tot,m:2.6}];
    var hasSurf = p.putt_bermuda !== undefined;

    var statusHtml = '';
    if (typeof PLAYER_STATUS !== 'undefined') {
        var ps = PLAYER_STATUS.find(function(s){return s.player===name});
        if (ps) {
            var sevCls = ps.severity==='warning'?'neg':ps.severity==='caution'?'form-cool':'form-neutral';
            statusHtml = '<div class="player-status-flag '+sevCls+'" style="margin-bottom:0.5rem">'+ps.status+'</div>';
        }
    }

    var sparkHtml = makeSparkline(name, 'sg_tot');

    content.innerHTML = '<div class="popup-header"><h3>'+p.name+' <span class="tier-badge '+tc+'" style="font-size:0.55rem;vertical-align:middle">'+p.tier+'</span></h3><button class="popup-close" onclick="document.getElementById(\'player-popup\').classList.add(\'hidden\')">&times;</button></div>' +
        statusHtml +
        '<div class="popup-meta"><span>TOT '+(p.sg_tot>=0?'+':'')+p.sg_tot.toFixed(2)+sparkHtml+'</span><span>DD '+(p.dd>=0?'+':'')+p.dd.toFixed(1)+'</span><span>'+p.shape+'</span><span>'+p.surface+'</span></div>' +
        stats.map(function(s) {
            var v=s.v; var pct=Math.max(5,Math.min(95,(v/s.m)*50+50));
            var cls=v>s.m*0.3?'sg-positive':v>0?'sg-neutral':'sg-negative';
            return '<div class="popup-sg-row"><span class="popup-sg-label">'+s.l+'</span><div class="sg-bar-track"><div class="sg-bar-fill '+cls+'" style="width:'+pct+'%"></div></div><span class="sg-bar-val '+(v>=0?'pos':'neg')+'">'+(v>=0?'+':'')+v.toFixed(2)+'</span></div>';
        }).join('') +
        (hasSurf ? '<div class="surface-putting" style="margin-top:0.5rem"><span class="sp-label">Putting:</span><span class="sp-val '+(p.putt_bermuda>=0?'pos':'neg')+'">Berm '+(p.putt_bermuda>=0?'+':'')+p.putt_bermuda.toFixed(2)+'</span><span class="sp-val '+(p.putt_bent>=0?'pos':'neg')+'">Bent '+(p.putt_bent>=0?'+':'')+p.putt_bent.toFixed(2)+'</span><span class="sp-val '+(p.putt_poa>=0?'pos':'neg')+'">Poa '+(p.putt_poa>=0?'+':'')+p.putt_poa.toFixed(2)+'</span></div>' : '') +
        '<div class="popup-section"><strong class="pos">+</strong> '+p.strengths+'</div>' +
        '<div class="popup-section"><strong class="neg">-</strong> '+p.weaknesses+'</div>' +
        '<div class="popup-section" style="color:var(--cream-500);font-style:italic;font-size:0.72rem;margin-top:0.5rem">'+p.notes+'</div>';

    popup.classList.remove('hidden');
}

// Close popup on background click
document.addEventListener('click', function(e) {
    var popup = document.getElementById('player-popup');
    if (popup && !popup.classList.contains('hidden') && e.target === popup) {
        popup.classList.add('hidden');
    }
});

// Inject clickable name styles (inline to avoid CSS cache issues)
(function(){
    var s = document.createElement('style');
    s.textContent = '#app-content strong{cursor:pointer;text-decoration:underline;text-decoration-color:rgba(255,255,255,0.25);text-underline-offset:2px;transition:color 0.15s}#app-content strong:hover{color:#c9a046;text-decoration-color:#c9a046}';
    document.head.appendChild(s);
})();

// Global click delegation for player names in tables and cards
document.addEventListener('click', function(e) {
    // Explicit clickable class
    var target = e.target.closest('.player-clickable');
    if (target) { e.preventDefault(); showPlayerPopup(target.textContent.trim()); return; }
    // Any strong tag with a player-like name
    var el = e.target;
    if (el.tagName === 'STRONG' && !el.id) {
        var name = el.textContent.trim();
        if (name.length > 4 && name.length < 30 && name.indexOf('$') < 0 && name.indexOf('+') < 0 && name.indexOf('#') < 0 && name.indexOf('%') < 0 && /[A-Z]/.test(name[0]) && name.indexOf(' ') > 0 && !name.match(/^(On Card|Updated|Latest|Upcoming|Settled|Previous|The Cut|BOOK|Green|Intel|News|Field|Status)/)) {
            showPlayerPopup(name);
        }
    }
});

// ═══ THE CUT ═══
// Use event delegation on document since element may not be visible at load time
document.addEventListener('click', function(e) {
    if (e.target.id === 'cut-link' || e.target.closest('#cut-link')) {
        document.querySelectorAll('.nav-btn').forEach(function(b){b.classList.remove('active')});
        document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active')});
        document.getElementById('thecut').classList.add('active');
        try { sessionStorage.setItem('greenbook_tab', 'thecut'); } catch(ex){}
        renderNewsTicker();
        window.scrollTo(0, 0);
    }
});

function buildTheCut() {
    var currentKey = getCurrentTournament();
    var t = TOURNAMENT_DATA[currentKey];

    // This Week
    var eventName = document.getElementById('cut-event-name');
    var eventMeta = document.getElementById('cut-event-meta');
    if (eventName && t) {
        eventName.textContent = t.name || t.course || '';
        eventMeta.textContent = (t.meta || '').substring(0, 80);
    }

    // Weather mini
    var weatherMini = document.getElementById('cut-weather-mini');
    if (weatherMini && t && t.location) {
        fetch('https://api.weatherapi.com/v1/forecast.json?key=22e06f60fa1d4696bc7175703262803&q='+encodeURIComponent(t.location)+'&days=2')
        .then(function(r){return r.json()})
        .then(function(data) {
            if (data.forecast) {
                weatherMini.innerHTML = data.forecast.forecastday.map(function(d) {
                    var dn = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
                    var dt = new Date(d.date+'T12:00:00');
                    var ic = d.day.daily_chance_of_rain>50?'🌧':d.day.maxwind_mph>18?'💨':'☀';
                    return ic+' '+dn[dt.getDay()]+' '+Math.round(d.day.maxtemp_f)+'° '+Math.round(d.day.maxwind_mph)+'mph';
                }).join(' &nbsp; ');
            }
        }).catch(function(){});
    }

    // Tournament Intel — rolling updates feed
    var otw = document.getElementById('cut-one-to-watch');
    if (otw && t) {
        var html = '';

        // On Card chips
        var bets = (t.notes || []).filter(function(n){return n.type==='bet'});
        if (bets.length) {
            html += '<div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--brass-500);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.2rem">On Card (' + bets.length + ')</div>';
            html += '<div style="margin-bottom:0.5rem">' + bets.map(function(b){
                var txt = (b.text || '').toLowerCase();
                var isFRL = txt.indexOf('frl') >= 0 || txt.indexOf('first round') >= 0;
                var borderColor = isFRL ? '#6ba3d6' : 'var(--green-500)';
                var textColor = isFRL ? '#6ba3d6' : 'var(--green-300)';
                var suffix = isFRL ? ' <span style="font-size:0.5rem;opacity:0.7">FRL</span>' : '';
                return '<span style="font-size:0.65rem;display:inline-block;padding:0.1rem 0.35rem;margin:0.08rem;border:1px solid ' + borderColor + ';border-radius:3px;color:' + textColor + '"><strong>' + (b.player||'') + '</strong>' + suffix + '</span>';
            }).join('') + '</div>';
        }

        // WDs
        if (typeof PLAYER_STATUS !== 'undefined') {
            var wds = PLAYER_STATUS.filter(function(s){return s.status && s.status.indexOf('WD') >= 0 && (s.status.indexOf('Valero') >= 0 || s.updated === 'Mar 30' || s.updated === 'Mar 31')});
            if (wds.length) {
                html += '<div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--brass-500);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.2rem">Withdrawals</div>';
                html += '<div style="margin-bottom:0.5rem">' + wds.map(function(w){
                    return '<span style="font-size:0.62rem;color:var(--cream-500)">' + w.player + '</span>';
                }).join(' &middot; ') + '</div>';
            }
        }

        // Rolling updates — last 5 notes (newest first), all types
        var allNotes = (t.notes || []).slice().reverse().slice(0, 5);
        if (allNotes.length) {
            html += '<div style="font-family:var(--font-mono);font-size:0.55rem;color:var(--brass-500);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.25rem">Updates</div>';
            html += '<div style="max-height:200px;overflow-y:auto">';
            var icons = { like:'&#9650;', bet:'&#10003;', fade:'&#9660;', watch:'&#9673;', process:'&#9881;' };
            var cls = { like:'pos', bet:'pos', fade:'neg', watch:'form-warm', process:'form-neutral' };
            allNotes.forEach(function(n) {
                var ic = icons[n.type] || '';
                var c = cls[n.type] || '';
                var ts = n.ts ? '<span style="font-family:var(--font-mono);font-size:0.5rem;color:var(--cream-600);margin-right:0.25rem">' + n.ts + '</span>' : '';
                var player = n.player ? '<strong>' + n.player + '</strong> ' : '';
                html += '<div style="padding:0.2rem 0;border-bottom:1px solid var(--border);font-size:0.65rem;line-height:1.3">' + ts + '<span class="' + c + '" style="margin-right:0.2rem">' + ic + '</span>' + player + '<span style="color:var(--cream-400)">' + n.text.substring(0, 100) + (n.text.length > 100 ? '...' : '') + '</span></div>';
            });
            html += '</div>';
        }

        otw.innerHTML = html;
    }

    // Status Feed (compact, max 5)
    var statusFeed = document.getElementById('cut-status-feed');
    if (statusFeed && typeof PLAYER_STATUS !== 'undefined') {
        var typeIcons = {injury:'&#9888;',rest:'&#9200;',travel:'&#9992;',motivation:'&#9733;',equipment:'&#9881;',note:'&#9432;',form:'&#9650;'};
        statusFeed.innerHTML = PLAYER_STATUS.sort(function(a,b){
            return b.updated.localeCompare(a.updated);
        }).slice(0,5).map(function(ps) {
            return '<div style="padding:0.2rem 0;border-bottom:1px solid var(--border);font-size:0.75rem">'+(typeIcons[ps.type]||'&#9679;')+' <strong>'+ps.player+'</strong> <span style="color:var(--cream-500)">'+(ps.status||'').substring(0,55)+'</span></div>';
        }).join('');
    }

    // Upcoming Calendar
    var calendar = document.getElementById('cut-calendar');
    if (calendar) {
        var upcoming = [
            {date:'Apr 2-5', name:'Valero Texas Open', surface:'Bermuda/Poa Triv', status:'upcoming'},
            {date:'Apr 10-13', name:'The Masters', surface:'Bentgrass', status:'upcoming'},
        ];
        calendar.innerHTML = upcoming.map(function(ev) {
            var badge = ev.status==='live'?'<span class="badge live" style="font-size:0.45rem;margin-left:0.3rem">LIVE</span>':'';
            return '<div style="padding:0.2rem 0;border-bottom:1px solid var(--border);font-size:0.75rem"><strong>'+ev.name+'</strong>'+badge+' <span style="color:var(--cream-500)">'+ev.date+'</span> <span class="cut-surface-tag">'+ev.surface+'</span></div>';
        }).join('');
    }

    // Top Course Fits — bar chart of top 8 players by radar overall fit
    var topFits = document.getElementById('cut-top-fits');
    if (topFits && t && t.radarPlayers) {
        var fitData = Object.keys(t.radarPlayers).map(function(name) {
            var d = t.radarPlayers[name];
            var avg = d.reduce(function(s,v){return s+v},0)/d.length;
            return {name:name, score:Math.round(avg)};
        }).sort(function(a,b){return b.score-a.score}).slice(0,8);

        topFits.innerHTML = fitData.map(function(p) {
            var cls = p.score>=75?'sf-elite':p.score>=60?'sf-good':p.score>=45?'sf-avg':'sf-weak';
            return '<div style="display:grid;grid-template-columns:1fr 120px 30px;gap:0.4rem;align-items:center;padding:0.2rem 0;border-bottom:1px solid var(--border)"><span style="font-size:0.78rem"><strong>'+p.name+'</strong></span><div class="sf-bar-track"><div class="sf-bar '+cls+'" style="width:'+p.score+'%"></div></div><span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--cream-300)">'+p.score+'</span></div>';
        }).join('');
    } else if (topFits) {
        topFits.innerHTML = '<p style="color:var(--cream-500);font-size:0.75rem;font-style:italic">Course fit data populates during tournament analysis.</p>';
    }

    // Field Snapshot — quick data viz
    var snapshot = document.getElementById('cut-field-snapshot');
    if (snapshot && t) {
        var hasComposite = t.composite && t.composite.length;
        var hasOdds = t.oddsBoard && t.oddsBoard.length;
        var html = '<div class="grid-3" style="gap:1rem">';

        // Form signal distribution
        if (hasComposite) {
            var tailwind = t.composite.filter(function(p){return p.signal==='TAILWIND'}).length;
            var warm = t.composite.filter(function(p){return p.signal==='warm'}).length;
            var neutral = t.composite.filter(function(p){return p.signal==='neutral'}).length;
            var cool = t.composite.filter(function(p){return p.signal==='cool'||p.signal==='HEADWIND'||p.signal==='caution'}).length;
            var total = t.composite.length;
            html += '<div style="text-align:center"><div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--brass-400);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.4rem">Form Distribution</div>';
            html += '<div style="display:flex;height:8px;border-radius:4px;overflow:hidden;margin-bottom:0.3rem">';
            if (tailwind) html += '<div style="width:'+(tailwind/total*100)+'%;background:var(--green-500)"></div>';
            if (warm) html += '<div style="width:'+(warm/total*100)+'%;background:var(--green-300);opacity:0.5"></div>';
            if (neutral) html += '<div style="width:'+(neutral/total*100)+'%;background:var(--cream-500);opacity:0.3"></div>';
            if (cool) html += '<div style="width:'+(cool/total*100)+'%;background:var(--brass-500);opacity:0.5"></div>';
            html += '</div>';
            html += '<div style="font-family:var(--font-mono);font-size:0.62rem;color:var(--cream-500)"><span class="pos">'+tailwind+' surging</span> · '+warm+' warm · '+neutral+' flat · <span class="form-cool">'+cool+' cooling</span></div>';
            html += '</div>';
        }

        // Composite rank vs price (how many are "value" by rank)
        if (hasComposite) {
            var top5 = t.composite.slice(0,5);
            html += '<div style="text-align:center"><div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--brass-400);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.4rem">Top 5 Composite</div>';
            top5.forEach(function(p) {
                html += '<div style="font-size:0.72rem;padding:0.1rem 0"><strong>'+p.name+'</strong> <span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--cream-500)">'+p.comp.toFixed(2)+'</span></div>';
            });
            html += '</div>';
        }

        // Flagged players count
        if (typeof PLAYER_STATUS !== 'undefined') {
            var injuries = PLAYER_STATUS.filter(function(s){return s.severity==='warning'||s.severity==='caution'}).length;
            var motivations = PLAYER_STATUS.filter(function(s){return s.type==='motivation'}).length;
            html += '<div style="text-align:center"><div style="font-family:var(--font-mono);font-size:0.6rem;color:var(--brass-400);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.4rem">Active Flags</div>';
            html += '<div style="font-family:var(--font-display);font-size:1.8rem;font-weight:600;color:var(--cream-100)">'+injuries+'</div>';
            html += '<div style="font-family:var(--font-mono);font-size:0.62rem;color:var(--cream-500)">injury/caution flags</div>';
            html += '<div style="font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:var(--brass-400);margin-top:0.3rem">'+motivations+'</div>';
            html += '<div style="font-family:var(--font-mono);font-size:0.62rem;color:var(--cream-500)">motivation flags</div>';
            html += '</div>';
        }

        html += '</div>';
        snapshot.innerHTML = html;
    }

    // Last Week
    var lastWeek = document.getElementById('cut-last-week');
    if (lastWeek) {
        // Find most recent settled tournament
        var settled = ['houston','valspar','players','arnoldpalmer','puertorico','cognizant'];
        for (var i=0; i<settled.length; i++) {
            var st = TOURNAMENT_DATA[settled[i]];
            if (st && st.result2026) {
                lastWeek.innerHTML = '<div class="cut-last-week">Last week: <strong>'+st.result2026.winner+'</strong> won '+st.name.replace(' 2026','')+' ('+st.result2026.score+')</div>';
                break;
            }
        }
    }
}
buildTheCut();

// News ticker from pre-fetched RSS (news-feed.js)
function renderNewsTicker() {
    var ticker = document.getElementById('news-ticker');
    var updated = document.getElementById('news-updated');
    if (!ticker || typeof NEWS_FEED === 'undefined' || !NEWS_FEED.length) {
        if (ticker) ticker.innerHTML = '<div style="padding:1rem;text-align:center;color:var(--cream-600);font-size:0.72rem">No news loaded. Run: py -3 scripts/fetch_news.py</div>';
        return;
    }

    var now = new Date();
    var sourceColors = {
        'ESPN Golf': 'var(--green-400)',
        'Golf.com': 'var(--brass-500)',
        'Yahoo Golf': 'var(--cream-400)',
        'CBS Golf': 'var(--cream-300)',
        'GolfWRX': 'var(--brass-400)',
    };

    ticker.innerHTML = NEWS_FEED.map(function(item) {
        var color = sourceColors[item.source] || 'var(--cream-500)';
        var date = new Date(item.date);
        var ago = Math.round((now - date) / (1000 * 60 * 60));
        var timeStr = isNaN(ago) || ago < 0 ? '' : ago < 1 ? 'Just now' : ago < 24 ? ago + 'h ago' : Math.round(ago / 24) + 'd ago';
        return '<a href="' + item.link + '" target="_blank" class="news-item">' +
            '<div class="news-item-row">' +
            '<span class="news-item-title">' + item.title + '</span>' +
            '<span class="news-item-time">' + timeStr + '</span>' +
            '</div>' +
            '<span class="news-item-source" style="color:' + color + '">' + item.source + '</span>' +
            '</a>';
    }).join('');

    if (updated) updated.textContent = 'Updated ' + now.toLocaleDateString();
}
renderNewsTicker();



// Notes toggle
var nt = document.getElementById('notes-toggle');
if (nt) nt.addEventListener('click', function() {
    var content = document.getElementById('notes-content');
    var arrow = document.getElementById('notes-arrow');
    content.classList.toggle('hidden');
    arrow.innerHTML = content.classList.contains('hidden') ? '&#9660;' : '&#9650;';
});

// Navigation with page persistence
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.section).classList.add('active');
        // Remember current tab
        try { sessionStorage.setItem('greenbook_tab', btn.dataset.section); } catch(e){}
    });
});

// Restore last tab on load
try {
    var savedTab = sessionStorage.getItem('greenbook_tab');
    if (savedTab) {
        var savedPanel = document.getElementById(savedTab);
        if (savedPanel) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            savedPanel.classList.add('active');
            var savedBtn = document.querySelector('[data-section="'+savedTab+'"]');
            if (savedBtn) savedBtn.classList.add('active');
        }
    }
} catch(e){}

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
    if (slot) slot.innerHTML = '';
    if (t.result2026) {
        slot.innerHTML = `<div class="result-banner"><div class="result-winner"><span class="result-label">2026 Winner: </span>${t.result2026.winner} (${t.result2026.score})</div><div class="result-why">${t.result2026.why}</div></div>`;
    }

    // Tournament Review (settled only)
    var reviewSection = document.getElementById('review-section');
    if (reviewSection && t.review) {
        reviewSection.style.display = '';
        var r = t.review;
        // Summary bar
        var sumHtml = '<div style="display:flex;gap:1.5rem;flex-wrap:wrap;margin-bottom:0.75rem">';
        sumHtml += '<div class="review-stat"><span class="review-stat-label">Record</span><span class="review-stat-value">' + r.record + '</span></div>';
        sumHtml += '<div class="review-stat"><span class="review-stat-label">P/L</span><span class="review-stat-value ' + (r.pl >= 0 ? 'positive' : 'negative') + '">' + (r.pl >= 0 ? '+$' : '-$') + Math.abs(r.pl).toFixed(0) + '</span></div>';
        sumHtml += '<div class="review-stat"><span class="review-stat-label">Winner</span><span class="review-stat-value">' + r.winner + ' (' + r.winnerOdds + ')</span></div>';
        if (r.bestPick) sumHtml += '<div class="review-stat"><span class="review-stat-label">Best Pick</span><span class="review-stat-value">' + r.bestPick + '</span></div>';
        sumHtml += '</div>';
        if (r.summary) sumHtml += '<div style="font-size:0.8rem;line-height:1.5;color:var(--cream-400);margin-top:0.5rem">' + r.summary + '</div>';
        document.getElementById('review-summary').innerHTML = sumHtml;
        // Picks table
        var picksHtml = '';
        (r.picks || []).forEach(function(p) {
            var resultClass = p.result === 'Won' ? 'positive' : p.result === 'Lost' ? 'negative' : '';
            picksHtml += '<tr><td>' + p.player + '</td><td>' + p.market + '</td><td>' + p.odds + '</td><td>' + p.finish + '</td><td class="' + resultClass + '">' + p.result + '</td><td style="font-size:0.72rem;max-width:200px">' + p.thesis + '</td><td style="font-size:0.72rem;max-width:180px">' + p.verdict + '</td></tr>';
        });
        document.getElementById('review-picks').innerHTML = picksHtml;
        // Model accuracy
        var modelHtml = '';
        if (r.modelNotes && r.modelNotes.length) {
            modelHtml = '<div style="font-family:var(--font-mono);font-size:0.62rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--brass-500);margin-bottom:0.5rem">Model vs Reality</div>';
            modelHtml += '<div style="display:flex;flex-direction:column;gap:0.4rem">';
            r.modelNotes.forEach(function(n) {
                var icon = n.type === 'hit' ? '&#10003;' : n.type === 'miss' ? '&#10007;' : '&#9679;';
                var color = n.type === 'hit' ? 'var(--green-400)' : n.type === 'miss' ? '#c44' : 'var(--brass-500)';
                modelHtml += '<div style="font-size:0.78rem;line-height:1.4;color:var(--cream-400)"><span style="color:' + color + ';margin-right:0.4rem">' + icon + '</span>' + n.text + '</div>';
            });
            modelHtml += '</div>';
        }
        document.getElementById('review-model').innerHTML = modelHtml;
        // Lessons
        var lessonsHtml = '';
        if (r.lessons && r.lessons.length) {
            lessonsHtml = '<div style="font-family:var(--font-mono);font-size:0.62rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--brass-500);margin-bottom:0.5rem">Key Takeaways</div>';
            lessonsHtml += '<div style="display:flex;flex-direction:column;gap:0.35rem">';
            r.lessons.forEach(function(l) {
                lessonsHtml += '<div style="font-size:0.78rem;line-height:1.4;color:var(--cream-400);padding-left:0.75rem;border-left:2px solid var(--border)">' + l + '</div>';
            });
            lessonsHtml += '</div>';
        }
        document.getElementById('review-lessons').innerHTML = lessonsHtml;
    } else if (reviewSection) {
        reviewSection.style.display = 'none';
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

    // Radar — add "Ideal Course Fit" as a selectable option
    if (t.radarAxes && t.radarPlayers) {
        const names = Object.keys(t.radarPlayers);
        ['radar-p1','radar-p2','radar-p3'].forEach((id,i) => {
            const el = document.getElementById(id);
            const defaultVal = i === 0 ? '__ideal__' : (names[i-1] || '');
            el.innerHTML = '<option value="">-- Select --</option><option value="__ideal__">Ideal Course Fit</option>' + names.map(n => `<option value="${n}" ${n===defaultVal?'selected':''}>${n}</option>`).join('');
            el.onchange = () => drawRadar(t);
        });
        drawRadar(t);
    }

    // Player Board + Analysis Log (split from notes)
    const boardEl = document.getElementById('player-board');
    const boardCard = document.getElementById('player-board-card');
    const logEl = document.getElementById('tourney-notes');
    const logCard = document.getElementById('tourney-notes-card');
    if (boardEl) boardEl.innerHTML = '';
    if (logEl) logEl.innerHTML = '';

    if (t.notes && t.notes.length) {
        const icons = { like: '&#9650;', bet: '&#10003;', fade: '&#9660;', watch: '&#9673;', process: '&#9881;' };
        const colors = { like: 'pos', bet: 'pos', fade: 'neg', watch: 'form-warm', process: 'form-neutral' };
        const labels = { like: 'LIKE', bet: 'ON CARD', fade: 'FADE', watch: 'WATCH', process: 'PROCESS' };

        var playerNotes = t.notes.filter(n => n.type === 'like' || n.type === 'bet' || n.type === 'fade');

        // Player Board — simple summary (bets first, then likes, then fades)
        var typeOrder = ['bet', 'like', 'fade'];
        playerNotes.sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type));

        if (boardEl && playerNotes.length) {
            if (boardCard) boardCard.style.display = '';
            playerNotes.forEach(n => {
                var icon = icons[n.type] || '';
                var cls = colors[n.type] || '';
                var label = labels[n.type] || '';
                const playerLine = n.player ? `<strong>${n.player}</strong>` : '';
                // Bet context: odds + book + tier inline
                var meta = '';
                if (n.type === 'bet') {
                    var txt = n.text || '';
                    var oddsMatch = txt.match(/\+\d{3,}/);
                    var odds = oddsMatch ? oddsMatch[0] : '';
                    var book = '';
                    if (txt.toLowerCase().indexOf('b365') >= 0 || txt.toLowerCase().indexOf('bet365') >= 0) book = 'b365';
                    else if (txt.toLowerCase().indexOf('dk') >= 0 || txt.toLowerCase().indexOf('draftkings') >= 0) book = 'DK';
                    else if (txt.toLowerCase().indexOf('fd') >= 0 || txt.toLowerCase().indexOf('fanduel') >= 0) book = 'FD';
                    var tier = '';
                    var txtL = txt.toLowerCase();
                    // Detect FRL
                    var isFRL = txtL.indexOf('frl') >= 0 || txtL.indexOf('first round') >= 0;
                    if (txtL.indexOf('dart') >= 0 || txtL.indexOf('micro') >= 0 || txtL.indexOf('$1.') >= 0 || txtL.indexOf('$2.') >= 0) tier = 'dart';
                    else if (txtL.indexOf('$5') >= 0) tier = isFRL ? 'frl' : 'mid';
                    else if (txtL.indexOf('$10') >= 0 || txtL.indexOf('$20') >= 0) tier = 'core';
                    var tierColor = tier === 'core' ? 'var(--green-400)' : tier === 'frl' ? '#6ba3d6' : tier === 'mid' ? 'var(--brass-400)' : 'var(--cream-500)';
                    var parts = [];
                    if (odds) parts.push(odds);
                    if (book) parts.push(book);
                    if (tier) parts.push(tier === 'frl' ? 'FRL' : tier);
                    meta = ' <span style="font-family:var(--font-mono);font-size:0.58rem;color:' + tierColor + '">' + parts.join(' ') + '</span>';
                    // Override badge label for FRL bets
                    if (isFRL) { label = 'FRL'; cls = ''; }
                }
                boardEl.innerHTML += `<div style="display:flex;align-items:center;gap:0.4rem;padding:0.3rem 0;border-bottom:1px solid var(--border);font-size:0.78rem"><span class="note-badge ${cls}" style="flex-shrink:0">${icon} ${label}</span>${playerLine}${meta}</div>`;
            });
        } else if (boardCard) { boardCard.style.display = 'none'; }

        // Analysis Log — ALL notes, sorted by timestamp (newest first)
        var tsOrder = {'Mar 31 Eve':10,'Mar 31 PM':9,'Mar 31 AM':8,'Mar 31':7,'Mar 30 Eve':6,'Mar 30 PM':5,'Mar 30 AM':4,'Mar 30':3,'Mar 29':2,'Mar 28':1,'':0};
        var allNotes = t.notes.slice().sort(function(a,b) {
            var aOrd = tsOrder[a.ts||''] || 0;
            var bOrd = tsOrder[b.ts||''] || 0;
            return bOrd - aOrd;
        });
        if (logEl && allNotes.length) {
            if (logCard) logCard.style.display = '';
            allNotes.forEach(n => {
                const icon = icons[n.type] || '';
                const cls = colors[n.type] || '';
                const label = labels[n.type] || '';
                const ts = n.ts || '';
                const tsHtml = ts ? `<span style="font-family:var(--font-mono);font-size:0.55rem;color:var(--cream-600);margin-right:0.3rem">${ts}</span>` : '';
                const playerLine = n.player ? `<strong>${n.player}</strong> ` : '';
                logEl.innerHTML += `<div class="note-item">${tsHtml}<span class="note-badge ${cls}">${icon} ${label}</span>${playerLine}<span class="note-text">${n.text}</span></div>`;
            });
        } else if (logCard) { logCard.style.display = 'none'; }
    } else {
        if (boardCard) boardCard.style.display = 'none';
        if (logCard) logCard.style.display = 'none';
    }

    // Weather
    var weatherCard = document.getElementById('weather-card');
    var weatherDisplay = document.getElementById('weather-display');
    if (t.location && weatherDisplay) {
        weatherCard.style.display = '';
        fetchWeather(t.location);
    } else if (weatherCard) {
        weatherCard.style.display = 'none';
    }

    // FRL — show for upcoming tournaments that have FRL data
    var frlCard = document.getElementById('frl-card');
    var frlBody = document.getElementById('frl-body');
    var frlWave = document.getElementById('frl-wave-summary');
    if (frlBody) frlBody.innerHTML = '';
    if (frlWave) frlWave.innerHTML = '';
    var isSettled = !!t.result2026;
    if (t.frl && t.frl.length && !isSettled) {
        if (frlCard) frlCard.style.display = '';
        var amPlayers = t.frl.filter(function(f){return f.wave==='AM'});
        var pmPlayers = t.frl.filter(function(f){return f.wave==='PM'});
        if (frlWave) {
            frlWave.innerHTML = '<div class="wave-card am"><h4>AM Wave</h4><div class="wave-detail">' + (amPlayers.length ? amPlayers.length + ' candidates. Typically calmer conditions, lower scores.' : 'Tee times TBD') + '</div></div>' +
                '<div class="wave-card pm"><h4>PM Wave</h4><div class="wave-detail">' + (pmPlayers.length ? pmPlayers.length + ' candidates. Wind typically builds in afternoon.' : 'Tee times TBD') + '</div></div>';
        }
        t.frl.forEach(function(f) {
            var waveCls = f.wave === 'AM' ? 'pos' : f.wave === 'PM' ? 'form-cool' : 'form-neutral';
            var windCls = f.windAdv === 'Favorable' ? 'pos' : f.windAdv === 'TBD' ? 'form-neutral' : '';
            frlBody.innerHTML += '<tr><td><strong>' + f.player + '</strong></td><td class="' + waveCls + '">' + f.wave + '</td><td style="font-family:var(--font-mono)">' + f.odds + '</td><td class="' + windCls + '">' + f.windAdv + '</td><td class="' + sigCls(f.form) + '">' + f.form + '</td><td style="font-size:0.72rem">' + f.history + '</td></tr>';
        });
    } else {
        if (frlCard) frlCard.style.display = 'none';
    }

    // Tournament comparison tool
    if (t.radarPlayers) {
        var tCompNames = Object.keys(t.radarPlayers).sort();
        ['tourney-compare-1','tourney-compare-2','tourney-compare-3'].forEach(function(id) {
            var el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = '<option value="">-- Select --</option>' + tCompNames.map(function(n){return '<option value="'+n+'">'+n+'</option>'}).join('');
            el.onchange = function() { renderComparisonWithAnalysis('tourney-compare', 'tourney-compare-output', t); };
        });
    }

    // Form Check (standalone) — only players in this tournament's field
    var formDisplay = document.getElementById('form-check-display');
    if (formDisplay) {
        // Build field list from composite + radar + FRL + odds board
        var fieldNames = {};
        if (t.composite) t.composite.forEach(function(p){fieldNames[p.name]=true});
        if (t.radarPlayers) Object.keys(t.radarPlayers).forEach(function(n){fieldNames[n]=true});
        if (t.frl) t.frl.forEach(function(p){fieldNames[p.player]=true});
        if (t.oddsBoard) t.oddsBoard.forEach(function(p){fieldNames[p.name]=true});

        var formPlayers = SCOUTING.filter(function(p){return fieldNames[p.name]}).map(function(p) {
            var fs = 50, sig = 'neutral', ctx = '';
            if (typeof PLAYER_STATUS !== 'undefined') {
                var ps = PLAYER_STATUS.find(function(s){return s.player===p.name});
                if (ps) {
                    if (ps.severity==='warning') { fs-=15; sig='caution'; ctx=ps.status.substring(0,60); }
                    else if (ps.severity==='caution') { fs-=8; sig='caution'; ctx=ps.status.substring(0,60); }
                    else if (ps.type==='motivation') { fs+=5; ctx=ps.status.substring(0,60); }
                }
            }
            if (p.notes) {
                if (p.notes.match(/won.*202[56]|champion.*202[56]/i)) { fs+=20; sig='hot'; ctx=ctx||'Recent winner'; }
                else if (p.notes.match(/TAILWIND|surging|T[1-5]\b/i)) { fs+=12; sig='hot'; ctx=ctx||'Trending up'; }
                else if (p.notes.match(/form.*declin|skill.*deteriorat|game.*declined/i)) { fs-=5; sig='cool'; ctx=ctx||'Form declining'; }
            }
            fs += Math.round(p.sg_tot * 8);
            return {name:p.name, score:Math.max(0,Math.min(100,fs)), signal:sig, context:ctx};
        }).sort(function(a,b){return b.score-a.score});

        // Show top 10 hot + flagged players only (compact)
        var hot = formPlayers.filter(function(p){return p.signal==='hot'}).slice(0,6);
        var flagged = formPlayers.filter(function(p){return p.signal==='caution'||p.signal==='cold'});
        var icons = {hot:'&#9650;',caution:'&#9888;',cold:'&#9660;',neutral:''};
        var cls = {hot:'pos',caution:'form-cool',cold:'neg',neutral:'form-neutral'};

        var html = '<div class="grid-2">';
        html += '<div><h4 style="font-family:var(--font-mono);font-size:0.7rem;color:var(--green-300);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.5rem">Trending Up</h4>';
        hot.forEach(function(p) {
            var barW = Math.min(100, Math.max(10, p.score));
            html += '<div style="padding:0.3rem 0;border-bottom:1px solid var(--border);font-size:0.78rem;display:grid;grid-template-columns:1fr 80px;gap:0.5rem;align-items:center"><div><strong>'+p.name+'</strong><div style="font-family:var(--font-mono);font-size:0.62rem;color:var(--cream-500)">'+p.context+'</div></div><div style="display:flex;align-items:center;gap:0.3rem"><div style="flex:1;height:6px;background:var(--border);border-radius:3px"><div style="height:100%;width:'+barW+'%;background:var(--green-500);border-radius:3px"></div></div><span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--green-300)">'+p.score+'</span></div></div>';
        });
        if (!hot.length) html += '<p style="color:var(--cream-500);font-size:0.75rem;font-style:italic">No strong form surges detected</p>';
        html += '</div>';

        html += '<div><h4 style="font-family:var(--font-mono);font-size:0.7rem;color:var(--brass-400);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.5rem">Flagged / Monitor</h4>';
        flagged.forEach(function(p) {
            var barW = Math.min(100, Math.max(10, p.score));
            html += '<div style="padding:0.3rem 0;border-bottom:1px solid var(--border);font-size:0.78rem;display:grid;grid-template-columns:1fr 80px;gap:0.5rem;align-items:center"><div><strong>'+p.name+'</strong><div style="font-family:var(--font-mono);font-size:0.62rem;color:var(--cream-500)">'+p.context+'</div></div><div style="display:flex;align-items:center;gap:0.3rem"><div style="flex:1;height:6px;background:var(--border);border-radius:3px"><div style="height:100%;width:'+barW+'%;background:var(--brass-600);border-radius:3px"></div></div><span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--brass-400)">'+p.score+'</span></div></div>';
        });
        if (!flagged.length) html += '<p style="color:var(--cream-500);font-size:0.75rem;font-style:italic">No active concerns</p>';
        html += '</div></div>';

        formDisplay.innerHTML = html;
    }

    // Skill Fit Rankings
    var skillCard = document.getElementById('skill-fit-card');
    if (t.radarAxes && t.radarPlayers && Object.keys(t.radarPlayers).length > 0) {
        if (skillCard) skillCard.style.display = '';
        renderSkillFit(t, 'overall');
        document.querySelectorAll('#skill-fit-tabs .quick-tag').forEach(function(btn) {
            btn.onclick = function() {
                document.querySelectorAll('#skill-fit-tabs .quick-tag').forEach(function(b){b.classList.remove('active')});
                btn.classList.add('active');
                renderSkillFit(t, btn.dataset.skill);
            };
        });
    } else {
        if (skillCard) skillCard.style.display = 'none';
    }

    // Composite
    const cb = document.getElementById('composite-body');
    if (cb) cb.innerHTML = '';
    if (cb && t.composite && t.composite.length) {
        if (t.densityCheck) {
            const d = t.densityCheck;
            document.getElementById('density-bar').innerHTML = `<span class="density-label">Profile Density: ${d.profiled}/${d.total} (${d.pct}%)</span><span class="density-status density-${d.status.toLowerCase()}">${d.status}</span><div class="density-track"><div class="density-fill" style="width:${d.pct}%"></div></div>`;
        }
        t.composite.forEach(p => {
            // Model fits as green dots instead of text codes
            var spikeDots = '';
            if (p.spikes) {
                var count = (p.spikes.match(/#/g)||[]).length;
                spikeDots = Array(Math.min(count,5)).fill('<span style="color:var(--green-300)">&#9679;</span>').join('');
                if (!spikeDots) spikeDots = '-';
            }
            cb.innerHTML += `<tr><td>${p.rank}</td><td><strong>${p.name}</strong></td><td>${p.comp.toFixed(3)}</td><td>${p.form.toFixed(2)}x</td><td class="${sigCls(p.signal)}">${p.signal}</td><td>${sg(p.app)}</td><td>${sg(p.ott)}</td><td>${p.dd>0?'+':''}${p.dd.toFixed(1)}</td><td>${sg(p.arg)}</td><td>${sg(p.putt)}</td><td>${p.t10.toFixed(1)}%</td><td title="${p.spikes||'No model fits'}">${spikeDots||'-'}</td><td class="${flagCls(p.flag)}">${p.flag}</td></tr>`;
        });
    } else { cb.innerHTML = '<tr><td colspan="13" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1.5rem">Composite data populates closer to tournament week</td></tr>'; }

    // Top Placement Pricing
    var placementsCard = document.getElementById('placements-card');
    var placementsBody = document.getElementById('placements-body');
    if (placementsCard && placementsBody) {
        placementsBody.innerHTML = '';
        // Check if any odds board entry has t5 or t20 data
        var hasPlaceData = t.oddsBoard && t.oddsBoard.some(function(o) { return o.t5 || o.t20; });
        if (hasPlaceData && t.composite && t.composite.length) {
            placementsCard.style.display = '';
            // Build market rank by outright implied probability
            var sortedOdds = (t.oddsBoard || []).slice().sort(function(a, b) {
                var aOdds = parseInt((a.best || '').replace(/[^0-9+-]/g, '')) || 99999;
                var bOdds = parseInt((b.best || '').replace(/[^0-9+-]/g, '')) || 99999;
                return aOdds - bOdds;
            });
            var mktRanks = {};
            sortedOdds.forEach(function(o, i) { mktRanks[o.name] = i + 1; });

            // For each composite player, find their odds board entry
            t.composite.forEach(function(p) {
                var ob = (t.oddsBoard || []).find(function(o) { return o.name === p.name; });
                if (!ob || (!ob.t5 && !ob.t20)) return;

                var mktRank = mktRanks[p.name] || '-';
                var gap = typeof mktRank === 'number' ? mktRank - p.rank : 0;
                var gapStr = gap > 0 ? '+' + gap : '' + gap;
                var gapCls = gap >= 5 ? 'pos' : gap >= 3 ? 'form-warm' : gap <= -3 ? 'neg' : '';

                // Calculate T20 implied probability
                var t20Str = ob.t20 || '';
                var t20Val = parseInt(t20Str);
                var t20Imp = '';
                if (!isNaN(t20Val)) {
                    var imp;
                    if (t20Val < 0) imp = Math.abs(t20Val) / (Math.abs(t20Val) + 100) * 100;
                    else imp = 100 / (t20Val + 100) * 100;
                    t20Imp = imp.toFixed(0) + '%';
                }

                var formCls = sigCls(p.signal);
                var outright = ob.best || '';
                var t5Display = ob.t5 ? (parseInt(ob.t5) > 0 ? '+' : '') + ob.t5 : '-';
                var t20Display = ob.t20 ? (parseInt(ob.t20) > 0 ? '+' : '') + ob.t20 : '-';
                var flagNote = p.flag ? ' <span style="font-size:0.6rem;color:var(--brass-500)">(' + p.flag + ')</span>' : '';

                placementsBody.innerHTML += '<tr' + (gap >= 5 ? ' style="background:rgba(0,100,0,0.08)"' : '') + '><td>' + p.rank + '</td><td><strong>' + p.name + '</strong>' + flagNote + '</td><td style="font-family:var(--font-mono);font-size:0.75rem">' + outright + '</td><td style="font-family:var(--font-mono);font-size:0.75rem">' + t5Display + '</td><td style="font-family:var(--font-mono);font-size:0.75rem">' + t20Display + '</td><td style="font-family:var(--font-mono);font-size:0.75rem">' + t20Imp + '</td><td class="' + formCls + '">' + p.signal + '</td><td>' + mktRank + '</td><td class="' + gapCls + '" style="font-weight:600">' + gapStr + '</td></tr>';
            });

            // Also add non-composite players from odds board that have notable T5/T20 pricing
            var compositeNames = {};
            t.composite.forEach(function(p) { compositeNames[p.name] = true; });
            var extras = (t.oddsBoard || []).filter(function(o) {
                return !compositeNames[o.name] && (o.t5 || o.t20) && (o.form === 'TAILWIND' || o.form === 'HEADWIND');
            });
            if (extras.length) {
                placementsBody.innerHTML += '<tr><td colspan="9" style="font-family:var(--font-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--brass-500);padding:0.6rem 0.4rem;border-top:1px solid var(--border)">Notable non-composite players</td></tr>';
                extras.forEach(function(o) {
                    var t20Val = parseInt(o.t20);
                    var t20Imp = '';
                    if (!isNaN(t20Val)) {
                        var imp = t20Val < 0 ? Math.abs(t20Val) / (Math.abs(t20Val) + 100) * 100 : 100 / (t20Val + 100) * 100;
                        t20Imp = imp.toFixed(0) + '%';
                    }
                    var mktRank = mktRanks[o.name] || '-';
                    var formCls = sigCls(o.form);
                    var t5Display = o.t5 ? (parseInt(o.t5) > 0 ? '+' : '') + o.t5 : '-';
                    var t20Display = o.t20 ? (parseInt(o.t20) > 0 ? '+' : '') + o.t20 : '-';
                    placementsBody.innerHTML += '<tr style="opacity:0.8"><td>-</td><td>' + o.name + '</td><td style="font-family:var(--font-mono);font-size:0.75rem">' + (o.best||'') + '</td><td style="font-family:var(--font-mono);font-size:0.75rem">' + t5Display + '</td><td style="font-family:var(--font-mono);font-size:0.75rem">' + t20Display + '</td><td style="font-family:var(--font-mono);font-size:0.75rem">' + t20Imp + '</td><td class="' + formCls + '">' + o.form + '</td><td>' + mktRank + '</td><td>-</td></tr>';
                });
            }
        } else {
            placementsCard.style.display = 'none';
        }
    }

    // RH Heatmap — dynamic columns
    const rb = document.getElementById('rh-body');
    const rhHeader = document.getElementById('rh-header');
    if (rb) rb.innerHTML = '';
    if (t.rhModelNames && rhHeader) {
        rhHeader.innerHTML = '<tr><th>Player</th>' + t.rhModelNames.map(n => '<th>'+n+'</th>').join('') + '<th>Meta</th></tr>';
    }
    if (t.rhModels && t.rhModels.length) {
        var modelKeys = t.rhModelNames ? t.rhModelNames.map((n,i) => 'm'+(i+1)) : ['m15','m16','m17','m18','m19'];
        t.rhModels.forEach(p => {
            var cells = modelKeys.map(k => hc(p[k] || 999)).join('');
            rb.innerHTML += '<tr><td><strong>'+p.name+'</strong></td>'+cells+'<td><strong>'+p.meta+'</strong></td></tr>';
        });
    } else { rb.innerHTML = '<tr><td colspan="'+(t.rhModelNames?t.rhModelNames.length+2:7)+'" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1rem">Model heatmap loads with tournament analysis</td></tr>'; }

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
    if (mb) mb.innerHTML = '';
    if (t.weaknessMasked && t.weaknessMasked.length) {
        t.weaknessMasked.forEach(p => { mb.innerHTML += `<tr><td>${p.name}</td><td>${p.weakness}</td><td class="${p.masked.startsWith('YES')?'pos':''}">${p.masked}</td><td>${p.strength}</td><td class="${p.amplified.startsWith('YES')?'pos':''}">${p.amplified}</td><td>#${p.rank}</td><td class="${sigCls(p.form.split(' ')[0])}">${p.form}</td><td>${p.verdict}</td></tr>`; });
    } else { mb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1rem">Weakness-masked analysis loads with tournament data</td></tr>'; }

    // Narrative matrix
    const nb = document.getElementById('narrative-body');
    if (nb) nb.innerHTML = '';
    if (t.narratives && t.narratives.length) {
        t.narratives.sort((a,b)=>b.count-a.count).forEach(p => { nb.innerHTML += `<tr><td><strong>${p.name}</strong></td>${ck(p.noonan)}${ck(p.klos)}${ck(p.mayo)}${ck(p.stewart)}${ck(p.titanic)}<td><strong class="${p.count>=3?'pos':''}">${p.count}</strong></td><td>#${p.rank}</td></tr>`; });
    } else { nb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1rem">Narrative source data loads with analysis</td></tr>'; }

    // Bets rendering moved to My Betting tab
}

function drawRadar(t) {
    const sel = ['radar-p1','radar-p2','radar-p3'].map(id=>document.getElementById(id).value).filter(Boolean);
    const ds = [{ label:'Avg Winner', data:t.winnerProfile, backgroundColor:'rgba(192,57,43,0.06)', borderColor:'rgba(192,57,43,0.45)', borderWidth:2, borderDash:[6,3], pointRadius:3, pointBackgroundColor:'rgba(192,57,43,0.45)' }];
    sel.forEach((n,i) => {
        if (n === '__ideal__') {
            // Ideal = 95 on every axis (near-perfect fit)
            ds.push({ label:'Ideal Course Fit', data:t.radarAxes.map(()=>95), backgroundColor:'rgba(201,160,70,0.08)', borderColor:'#C9A046', borderWidth:2, borderDash:[4,2], pointRadius:4, pointBackgroundColor:'#C9A046', pointBorderColor:'#0D1F16', pointBorderWidth:2 });
            return;
        }
        const d=t.radarPlayers[n]; if(!d) return; ds.push({ label:n, data:d, backgroundColor:radarColors[i].bg, borderColor:radarColors[i].border, borderWidth:2.5, pointRadius:5, pointBackgroundColor:radarColors[i].border, pointBorderColor:'#0D1F16', pointBorderWidth:2 }); });
    if (radarInst) radarInst.destroy();
    radarInst = new Chart(document.getElementById('radar-chart'), {
        type:'radar', data:{labels:t.radarAxes, datasets:ds},
        options: { responsive:true, plugins:{legend:{position:'bottom',labels:{boxWidth:10,font:{size:9},usePointStyle:true}}}, scales:{r:{min:0,max:100,ticks:{display:false},grid:{color:'rgba(109,196,142,0.1)'},angleLines:{color:'rgba(109,196,142,0.1)'},pointLabels:{font:{size:10,weight:'600'},color:'#F5EDD9'}}} }
    });
    document.getElementById('radar-legend').innerHTML = sel.map((n,i) => { const d=t.radarPlayers[n]; if(!d) return ''; const fit=d.reduce((s,v,idx)=>s+Math.min(v/t.winnerProfile[idx],1.2),0)/d.length*100; const c=fit>=95?'pos':fit>=80?'form-warm':fit>=65?'form-neutral':'neg'; return `<div class="radar-legend-item"><span class="radar-dot" style="background:${radarColors[i].border}"></span><strong>${n}</strong> <span class="${c}">Fit: ${fit.toFixed(0)}%</span></div>`; }).join('');
}

// Weather API
var weatherCache = {};
function fetchWeather(location) {
    var display = document.getElementById('weather-display');
    if (!display) return;
    if (weatherCache[location]) { renderWeather(weatherCache[location]); return; }
    display.innerHTML = '<div class="weather-loading">Loading weather for ' + location + '...</div>';
    fetch('https://api.weatherapi.com/v1/forecast.json?key=22e06f60fa1d4696bc7175703262803&q=' + encodeURIComponent(location) + '&days=4')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (data.forecast) {
                weatherCache[location] = data;
                renderWeather(data);
            } else {
                display.innerHTML = '<div class="weather-loading">Weather data unavailable for ' + location + '</div>';
            }
        })
        .catch(function() {
            display.innerHTML = '<div class="weather-loading">Could not load weather data</div>';
        });
}

function renderWeather(data) {
    var display = document.getElementById('weather-display');
    var days = data.forecast.forecastday;
    var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    display.innerHTML = days.map(function(d) {
        var date = new Date(d.date + 'T12:00:00');
        var dayName = dayNames[date.getDay()];
        var temp = Math.round(d.day.maxtemp_f);
        var low = Math.round(d.day.mintemp_f);
        var rain = d.day.daily_chance_of_rain;
        var desc = d.day.condition.text;
        var rainCls = rain > 50 ? 'high' : 'low';

        // AM wave (7-11am) vs PM wave (12-4pm) conditions
        var amWind = 0, pmWind = 0, amGust = 0, pmGust = 0, amDir = '', pmDir = '';
        if (d.hour) {
            var amHours = d.hour.filter(function(h){var hr=parseInt(h.time.split(' ')[1].split(':')[0]); return hr>=7 && hr<=11;});
            var pmHours = d.hour.filter(function(h){var hr=parseInt(h.time.split(' ')[1].split(':')[0]); return hr>=12 && hr<=16;});
            if (amHours.length) {
                amWind = Math.round(amHours.reduce(function(s,h){return s+h.wind_mph},0)/amHours.length);
                amGust = Math.round(Math.max.apply(null, amHours.map(function(h){return h.gust_mph||0})));
                amDir = amHours[Math.floor(amHours.length/2)].wind_dir;
            }
            if (pmHours.length) {
                pmWind = Math.round(pmHours.reduce(function(s,h){return s+h.wind_mph},0)/pmHours.length);
                pmGust = Math.round(Math.max.apply(null, pmHours.map(function(h){return h.gust_mph||0})));
                pmDir = pmHours[Math.floor(pmHours.length/2)].wind_dir;
            }
        }
        var windDelta = pmWind - amWind;
        var waveAdvantage = windDelta > 5 ? 'AM advantage' : windDelta < -5 ? 'PM advantage' : 'Even waves';
        var waveCls = windDelta > 5 ? 'pos' : windDelta < -5 ? 'neg' : 'form-neutral';

        var icon = rain > 60 ? '🌧' : rain > 30 ? '⛅' : pmWind > 20 ? '💨' : '☀';
        return '<div class="weather-day">' +
            '<div class="weather-day-name">' + dayName + '</div>' +
            '<div class="weather-icon">' + icon + '</div>' +
            '<div class="weather-temp">' + temp + '°<span style="font-size:0.8rem;color:var(--cream-500)">/' + low + '°</span></div>' +
            '<div class="weather-desc">' + desc + '</div>' +
            '<div class="weather-wind" style="margin-top:0.3rem"><span style="color:var(--green-300)">AM:</span> ' + amWind + ' mph ' + amDir + (amGust > amWind+5 ? ' (G' + amGust + ')' : '') + '</div>' +
            '<div class="weather-wind"><span style="color:var(--brass-400)">PM:</span> ' + pmWind + ' mph ' + pmDir + (pmGust > pmWind+5 ? ' (G' + pmGust + ')' : '') + '</div>' +
            '<div class="weather-wind ' + waveCls + '" style="font-weight:600;margin-top:0.2rem">' + waveAdvantage + (Math.abs(windDelta) > 3 ? ' (' + Math.abs(windDelta) + ' mph delta)' : '') + '</div>' +
            '<div class="weather-rain ' + rainCls + '">Rain: ' + rain + '%</div>' +
            '</div>';
    }).join('');
}

// Comparison with Analysis
function renderComparisonWithAnalysis(prefix, outputId, tourneyData) {
    var selected = [prefix+'-1',prefix+'-2',prefix+'-3']
        .map(function(id){return document.getElementById(id)})
        .filter(function(el){return el && el.value})
        .map(function(el){
            var name = el.value;
            var found = SCOUTING.find(function(p){return p.name===name});
            if (found) return found;
            // Fallback: create basic profile from name if not in SCOUTING
            return {name:name, tier:'Unknown', sg_tot:0, app:0, ott:0, arg:0, putt:0, dd:0, shape:'-', surface:'-', strengths:'Not in player database', weaknesses:'-', notes:'-'};
        })
        .filter(Boolean);
    var out = document.getElementById(outputId);
    if (!out || !selected.length) { if(out) out.innerHTML = ''; return; }

    // Build comparison cards
    var stats = [{l:'APP',k:'app',m:1},{l:'OTT',k:'ott',m:1},{l:'ARG',k:'arg',m:0.5},{l:'PUTT',k:'putt',m:0.7},{l:'TOT',k:'sg_tot',m:2.6},{l:'DD',k:'dd',m:20}];
    var html = '<div class="compare-cards">';
    selected.forEach(function(p) {
        var tc = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':'tier-midfield';
        var surf = p.putt_bermuda !== undefined;
        html += '<div class="compare-card"><h4>'+p.name+' <span class="tier-badge '+tc+'" style="font-size:0.5rem">'+p.tier+'</span></h4>';
        stats.forEach(function(s) {
            var v = p[s.k]; var pct = Math.max(5,Math.min(95,(v/s.m)*50+50));
            var cls = v>s.m*0.3?'sg-positive':v>0?'sg-neutral':'sg-negative';
            var vStr = s.k==='dd'?v.toFixed(1):v.toFixed(2);
            html += '<div class="compare-stat-row"><span class="compare-stat-label">'+s.l+'</span><div class="compare-bar-track"><div class="compare-bar-fill '+cls+'" style="width:'+pct+'%"></div></div><span class="'+(v>=0?'pos':'neg')+'">'+(v>=0?'+':'')+vStr+'</span></div>';
        });
        if (surf) html += '<div style="margin-top:0.4rem;font-family:var(--font-mono);font-size:0.6rem"><span style="color:var(--cream-500)">Surf:</span> <span class="'+(p.putt_bermuda>=0?'pos':'neg')+'">B '+(p.putt_bermuda>=0?'+':'')+p.putt_bermuda.toFixed(2)+'</span> <span class="'+(p.putt_bent>=0?'pos':'neg')+'">G '+(p.putt_bent>=0?'+':'')+p.putt_bent.toFixed(2)+'</span> <span class="'+(p.putt_poa>=0?'pos':'neg')+'">P '+(p.putt_poa>=0?'+':'')+p.putt_poa.toFixed(2)+'</span></div>';
        html += '</div>';
    });
    html += '</div>';

    // Auto-analysis for 3 players (3-ball context)
    if (selected.length >= 2) {
        html += '<div class="compare-analysis">';

        // Find advantages per stat
        var advantages = stats.map(function(s) {
            var best = selected.reduce(function(a,b){return a[s.k]>b[s.k]?a:b});
            var margin = best[s.k] - selected.reduce(function(a,b){return a[s.k]<b[s.k]?a:b})[s.k];
            return {stat:s.l, winner:best.name, margin:margin};
        }).filter(function(a){return a.margin > 0.05});

        // Overall best
        var bestTot = selected.reduce(function(a,b){return a.sg_tot>b.sg_tot?a:b});
        var bestApp = selected.reduce(function(a,b){return a.app>b.app?a:b});
        var bestPutt = selected.reduce(function(a,b){return a.putt>b.putt?a:b});

        html += '<h4 style="font-family:var(--font-display);margin:0.75rem 0 0.5rem">Analysis</h4>';
        html += '<div class="note-item"><span class="note-badge pos">&#9650; BEST OVERALL</span><strong>'+bestTot.name+'</strong> <span class="note-text">leads in SG:Total at +'+bestTot.sg_tot.toFixed(2)+'. Strongest all-around game in this group.</span></div>';

        if (bestApp.name !== bestTot.name) {
            html += '<div class="note-item"><span class="note-badge form-warm">IRON PLAY</span><strong>'+bestApp.name+'</strong> <span class="note-text">has the best approach game (APP +'+bestApp.app.toFixed(2)+'). At approach-dominant courses, this could override overall SG advantage.</span></div>';
        }

        if (bestPutt.name !== bestTot.name) {
            html += '<div class="note-item"><span class="note-badge form-warm">PUTTING</span><strong>'+bestPutt.name+'</strong> <span class="note-text">is the best putter (PUTT +'+bestPutt.putt.toFixed(2)+'). On a putting-separating week, this player has the highest ceiling.</span></div>';
        }

        // Surface-specific putting edge if tournament data available
        if (tourneyData && tourneyData.meta) {
            var surface = '';
            if (tourneyData.meta.indexOf('Bermuda') >= 0) surface = 'bermuda';
            else if (tourneyData.meta.indexOf('Poa') >= 0) surface = 'poa';
            else if (tourneyData.meta.indexOf('Bent') >= 0) surface = 'bent';

            if (surface && selected[0].putt_bermuda !== undefined) {
                var key = 'putt_' + (surface === 'bermuda' ? 'bermuda' : surface === 'poa' ? 'poa' : 'bent');
                var surfBest = selected.reduce(function(a,b){return (a[key]||0)>(b[key]||0)?a:b});
                var surfName = surface === 'bermuda' ? 'Bermuda' : surface === 'poa' ? 'Poa' : 'Bentgrass';
                html += '<div class="note-item"><span class="note-badge form-neutral">THIS WEEK</span><strong>'+surfBest.name+'</strong> <span class="note-text">putts best on '+surfName+' (+'+(surfBest[key]||0).toFixed(2)+'), which is the green surface at this course.</span></div>';
            }
        }

        // Weaknesses
        selected.forEach(function(p) {
            var weak = [];
            if (p.app < 0) weak.push('approach');
            if (p.putt < -0.1) weak.push('putting');
            if (p.arg < -0.1) weak.push('short game');
            if (p.ott < -0.1) weak.push('driving');
            if (weak.length) {
                html += '<div class="note-item"><span class="note-badge neg">&#9660; RISK</span><strong>'+p.name+'</strong> <span class="note-text">has weaknesses in '+weak.join(', ')+'. Vulnerable if these skills are tested.</span></div>';
            }
        });

        html += '</div>';
    }

    out.innerHTML = html;
}

// Surface Performance Renderer
function renderSurfaceView(surface, view) {
    var display = document.getElementById('surface-display');
    if (!display) return;
    var players = SCOUTING.filter(function(p){return p.putt_bermuda !== undefined});

    if (view === 'putting') {
        // Rank by putting on selected surface
        var sorted;
        if (surface === 'bermuda') {
            sorted = players.sort(function(a,b){return b.putt_bermuda - a.putt_bermuda});
        } else if (surface === 'bent') {
            sorted = players.sort(function(a,b){return b.putt_bent - a.putt_bent});
        } else if (surface === 'poa') {
            sorted = players.sort(function(a,b){return b.putt_poa - a.putt_poa});
        } else {
            // All: sort by overall putt
            sorted = players.sort(function(a,b){return b.putt - a.putt});
        }
        display.innerHTML = '<div class="surface-table"><table class="data-table"><thead><tr><th>Rk</th><th>Player</th>' +
            '<th>Bermuda</th><th>Bentgrass</th><th>Poa</th><th>Overall</th><th>Best Surface</th></tr></thead><tbody>' +
            sorted.slice(0,25).map(function(p,i) {
                var best = 'Bermuda';
                if (p.putt_bent > p.putt_bermuda && p.putt_bent > p.putt_poa) best = 'Bentgrass';
                if (p.putt_poa > p.putt_bermuda && p.putt_poa > p.putt_bent) best = 'Poa';
                var highlight = surface === 'bermuda' ? 'putt_bermuda' : surface === 'bent' ? 'putt_bent' : surface === 'poa' ? 'putt_poa' : '';
                return '<tr><td>'+(i+1)+'</td><td><strong>'+p.name+'</strong></td>' +
                    '<td class="'+(p.putt_bermuda>=0.2?'pos':p.putt_bermuda<0?'neg':'')+'" style="font-family:var(--font-mono);'+(highlight==='putt_bermuda'?'font-weight:700':'')+'">'+(p.putt_bermuda>=0?'+':'')+p.putt_bermuda.toFixed(2)+'</td>' +
                    '<td class="'+(p.putt_bent>=0.2?'pos':p.putt_bent<0?'neg':'')+'" style="font-family:var(--font-mono);'+(highlight==='putt_bent'?'font-weight:700':'')+'">'+(p.putt_bent>=0?'+':'')+p.putt_bent.toFixed(2)+'</td>' +
                    '<td class="'+(p.putt_poa>=0.2?'pos':p.putt_poa<0?'neg':'')+'" style="font-family:var(--font-mono);'+(highlight==='putt_poa'?'font-weight:700':'')+'">'+(p.putt_poa>=0?'+':'')+p.putt_poa.toFixed(2)+'</td>' +
                    '<td style="font-family:var(--font-mono)">'+(p.putt>=0?'+':'')+p.putt.toFixed(2)+'</td>' +
                    '<td style="font-size:0.72rem">'+best+'</td></tr>';
            }).join('') + '</tbody></table></div>';

    } else if (view === 'spread') {
        // Surface spread = difference between best and worst surface
        // High spread = surface-dependent. Low spread = consistent everywhere.
        var withSpread = players.map(function(p) {
            var vals = [p.putt_bermuda, p.putt_bent, p.putt_poa];
            var spread = Math.max.apply(null, vals) - Math.min.apply(null, vals);
            var best = 'Bermuda';
            if (p.putt_bent >= p.putt_bermuda && p.putt_bent >= p.putt_poa) best = 'Bentgrass';
            if (p.putt_poa >= p.putt_bermuda && p.putt_poa >= p.putt_bent) best = 'Poa';
            var worst = 'Bermuda';
            if (p.putt_bent <= p.putt_bermuda && p.putt_bent <= p.putt_poa) worst = 'Bentgrass';
            if (p.putt_poa <= p.putt_bermuda && p.putt_poa <= p.putt_bent) worst = 'Poa';
            return {name:p.name, spread:spread, best:best, worst:worst, b:p.putt_bermuda, g:p.putt_bent, p:p.putt_poa};
        }).sort(function(a,b){return b.spread - a.spread});

        display.innerHTML = '<p class="card-subtitle" style="margin-bottom:0.75rem">Players with the biggest gap between their best and worst putting surface. High spread = surface-dependent, target them at their best surface, avoid at their worst.</p>' +
            '<div class="surface-table"><table class="data-table"><thead><tr><th>Rk</th><th>Player</th><th>Spread</th><th>Best</th><th>Worst</th><th>Bermuda</th><th>Bent</th><th>Poa</th></tr></thead><tbody>' +
            withSpread.slice(0,25).map(function(p,i) {
                return '<tr><td>'+(i+1)+'</td><td><strong>'+p.name+'</strong></td>' +
                    '<td style="font-family:var(--font-mono);font-weight:700;color:var(--brass-400)">'+p.spread.toFixed(2)+'</td>' +
                    '<td class="pos">'+p.best+'</td><td class="neg">'+p.worst+'</td>' +
                    '<td style="font-family:var(--font-mono)">'+(p.b>=0?'+':'')+p.b.toFixed(2)+'</td>' +
                    '<td style="font-family:var(--font-mono)">'+(p.g>=0?'+':'')+p.g.toFixed(2)+'</td>' +
                    '<td style="font-family:var(--font-mono)">'+(p.p>=0?'+':'')+p.p.toFixed(2)+'</td></tr>';
            }).join('') + '</tbody></table></div>';

    } else if (view === 'specialists') {
        // Show players who are elite on one surface but average/bad on others
        var specialists = players.map(function(p) {
            var vals = [
                {surf:'Bermuda', val:p.putt_bermuda},
                {surf:'Bentgrass', val:p.putt_bent},
                {surf:'Poa', val:p.putt_poa}
            ].sort(function(a,b){return b.val - a.val});
            var bestSurf = vals[0];
            var worstSurf = vals[2];
            var gap = bestSurf.val - worstSurf.val;
            return {name:p.name, bestSurf:bestSurf.surf, bestVal:bestSurf.val, worstSurf:worstSurf.surf, worstVal:worstSurf.val, gap:gap, overall:p.putt};
        }).filter(function(p){return p.bestVal >= 0.25 && p.gap >= 0.15}).sort(function(a,b){return b.bestVal - a.bestVal});

        display.innerHTML = '<p class="card-subtitle" style="margin-bottom:0.75rem">Players who gain +0.25 or more on their best putting surface with a significant gap to their worst. These are specialists — play them on the right grass, avoid on the wrong grass.</p>' +
            '<div class="surface-table"><table class="data-table"><thead><tr><th>Player</th><th>Best Surface</th><th>SG:PUTT</th><th>Worst Surface</th><th>SG:PUTT</th><th>Gap</th></tr></thead><tbody>' +
            specialists.map(function(p) {
                return '<tr><td><strong>'+p.name+'</strong></td>' +
                    '<td class="pos">'+p.bestSurf+'</td>' +
                    '<td class="pos" style="font-family:var(--font-mono);font-weight:600">+'+p.bestVal.toFixed(2)+'</td>' +
                    '<td class="neg">'+p.worstSurf+'</td>' +
                    '<td class="'+(p.worstVal<0?'neg':'')+'" style="font-family:var(--font-mono)">'+(p.worstVal>=0?'+':'')+p.worstVal.toFixed(2)+'</td>' +
                    '<td style="font-family:var(--font-mono);color:var(--brass-400);font-weight:600">'+p.gap.toFixed(2)+'</td></tr>';
            }).join('') + '</tbody></table></div>';
    }
}

// Sparkline Generator
function makeSparkline(name, stat) {
    if (typeof SPARKLINES === 'undefined' || !SPARKLINES[name]) return '';
    var data = SPARKLINES[name];
    if (data.length < 2) return '';
    var key = stat || 'form';
    var vals = data.map(function(d){return d[key]||0});
    var min = Math.min.apply(null, vals);
    var max = Math.max.apply(null, vals);
    var range = max - min || 1;
    var w = 50, h = 16;
    var points = vals.map(function(v,i){
        var x = (i/(vals.length-1))*w;
        var y = h - ((v-min)/range)*h;
        return x+','+y;
    }).join(' ');
    var trending = vals[vals.length-1] > vals[0];
    var color = trending ? '#3D9E64' : '#C0392B';
    return '<svg width="'+w+'" height="'+h+'" style="vertical-align:middle;margin-left:0.35rem"><polyline points="'+points+'" fill="none" stroke="'+color+'" stroke-width="1.5"/></svg>';
}

// Skill Fit Renderer
function renderSkillFit(t, skill) {
    var display = document.getElementById('skill-fit-display');
    if (!display) return;

    // For surface and weekfit, pull from all SCOUTING players
    if (skill === 'surface' || skill === 'weekfit') {
        var surfScored;
        if (skill === 'surface') {
            var surfaces = [];
            if (t && t.meta) {
                if (t.meta.indexOf('Bermuda') >= 0) surfaces.push('putt_bermuda');
                if (t.meta.indexOf('Poa') >= 0) surfaces.push('putt_poa');
                if (t.meta.indexOf('Bent') >= 0) surfaces.push('putt_bent');
            }
            if (!surfaces.length) surfaces = ['putt_bermuda','putt_bent','putt_poa'];
            var surfLabel = surfaces.map(function(s){return s.replace('putt_','').replace('bermuda','Bermuda').replace('bent','Bentgrass').replace('poa','Poa')}).join(' + ');

            surfScored = SCOUTING.filter(function(p){return p[surfaces[0]] !== undefined}).map(function(p) {
                var avg = surfaces.reduce(function(s,k){return s + (p[k]||0)},0) / surfaces.length;
                return {name:p.name, score:Math.round((avg/0.7)*50+50), raw:avg};
            }).sort(function(a,b){return b.score - a.score}).slice(0,25);

            // Paginate surface results
            var surfPage = {current:0, size:10, total:Math.ceil(surfScored.length/10)};
            function renderSurfPage() {
                var s = surfPage.current*surfPage.size;
                var page = surfScored.slice(s, s+surfPage.size);
                display.innerHTML = '<p class="card-subtitle" style="margin-bottom:0.5rem">Ranked by SG:PUTT on <strong>'+surfLabel+'</strong> (this course\'s surface).</p>' +
                    '<div class="skill-fit-list">' + page.map(function(p,i) {
                        var cls = p.score>=80?'sf-elite':p.score>=60?'sf-good':p.score>=40?'sf-avg':'sf-weak';
                        return '<div class="sf-row"><span class="sf-rank">'+(s+i+1)+'</span><span class="sf-name"><strong>'+p.name+'</strong></span><div class="sf-bar-track"><div class="sf-bar '+cls+'" style="width:'+Math.max(5,p.score)+'%"></div></div><span class="sf-score">'+(p.raw>=0?'+':'')+p.raw.toFixed(2)+'</span></div>';
                    }).join('') + '</div>' +
                    '<div class="paginated-controls"><button class="page-btn" id="surf-prev" '+(surfPage.current===0?'disabled':'')+'>&#9664; Prev</button><span>'+(surfPage.current+1)+' / '+surfPage.total+'</span><button class="page-btn" id="surf-next" '+(surfPage.current>=surfPage.total-1?'disabled':'')+'>Next &#9654;</button></div>';
                document.getElementById('surf-prev').onclick = function(){if(surfPage.current>0){surfPage.current--;renderSurfPage();}};
                document.getElementById('surf-next').onclick = function(){if(surfPage.current<surfPage.total-1){surfPage.current++;renderSurfPage();}};
            }
            renderSurfPage();
            return;
        }
        if (skill === 'weekfit') {
            // Pull from radar if available, otherwise use SCOUTING sorted by APP + ARG (general course fit)
            if (t && t.radarPlayers) {
                var radarNames = Object.keys(t.radarPlayers);
                surfScored = radarNames.map(function(name) {
                    var data = t.radarPlayers[name];
                    var avg = data.reduce(function(s,v){return s+v},0)/data.length;
                    return {name:name, score:Math.round(avg)};
                }).sort(function(a,b){return b.score-a.score});
            } else {
                surfScored = SCOUTING.map(function(p){return {name:p.name, score:Math.round(((p.app+p.arg)/1.4)*50+50)}}).sort(function(a,b){return b.score-a.score}).slice(0,25);
            }
            display.innerHTML = '<p class="card-subtitle" style="margin-bottom:0.5rem">Players ranked by overall fit for this week\'s course profile.</p>' +
                '<div class="skill-fit-list">' + surfScored.map(function(p,i) {
                    var cls = p.score>=80?'sf-elite':p.score>=60?'sf-good':p.score>=40?'sf-avg':'sf-weak';
                    return '<div class="sf-row"><span class="sf-rank">'+(i+1)+'</span><span class="sf-name"><strong>'+p.name+'</strong></span><div class="sf-bar-track"><div class="sf-bar '+cls+'" style="width:'+Math.max(5,p.score)+'%"></div></div><span class="sf-score">'+p.score+'</span></div>';
                }).join('') + '</div>';
            return;
        }
    }

    if (!t.radarAxes) return;

    // Build player list: radarPlayers + all SCOUTING players in the field
    var radarP = t.radarPlayers || {};
    var fieldNames = {};
    if (t.composite) t.composite.forEach(function(p){fieldNames[p.name]=true});
    if (t.oddsBoard) t.oddsBoard.forEach(function(p){fieldNames[p.name]=true});
    if (t.frl) t.frl.forEach(function(p){fieldNames[p.player]=true});
    Object.keys(radarP).forEach(function(n){fieldNames[n]=true});

    // For players not in radarPlayers, synthesize scores from SCOUTING SG data
    var axes = t.radarAxes;
    var allPlayers = {};
    Object.keys(fieldNames).forEach(function(name) {
        if (radarP[name]) {
            allPlayers[name] = radarP[name];
        } else {
            var sc = SCOUTING.find(function(s){return s.name===name});
            if (sc) {
                // Map SG stats to radar axes scores (0-100 scale, 50=avg)
                allPlayers[name] = axes.map(function(axis) {
                    var a = axis.toLowerCase();
                    var val = 50;
                    if (a.indexOf('app') >= 0) val = Math.round(Math.min(100, Math.max(0, sc.app * 50 + 50)));
                    else if (a.indexOf('arg') >= 0 || a.indexOf('short') >= 0 || a.indexOf('scrambl') >= 0) val = Math.round(Math.min(100, Math.max(0, sc.arg * 80 + 50)));
                    else if (a.indexOf('ott') >= 0 || a.indexOf('driver') >= 0) val = Math.round(Math.min(100, Math.max(0, sc.ott * 50 + 50)));
                    else if (a.indexOf('putt') >= 0) val = Math.round(Math.min(100, Math.max(0, sc.putt * 80 + 50)));
                    else if (a.indexOf('dist') >= 0 || a.indexOf('carry') >= 0) val = Math.round(Math.min(100, Math.max(0, sc.dd / 20 * 50 + 50)));
                    else if (a.indexOf('wind') >= 0) val = Math.round(Math.min(100, Math.max(0, (sc.sg_tot * 30) + 50)));
                    else if (a.indexOf('par 5') >= 0 || a.indexOf('birdie') >= 0) val = Math.round(Math.min(100, Math.max(0, (sc.sg_tot * 25 + sc.ott * 15) + 50)));
                    return val;
                });
            }
        }
    });

    var players = Object.keys(allPlayers);
    var winner = t.winnerProfile;

    // Map skill to axis index or compute overall
    var scored = players.map(function(name) {
        var data = allPlayers[name];
        var score, label;
        if (skill === 'overall') {
            score = Math.round(data.reduce(function(s,v){return s+v},0) / data.length);
            label = 'Avg across all categories';
        } else if (skill === 'app') {
            var idx = axes.findIndex(function(a){return a.toLowerCase().indexOf('app')>=0});
            score = idx >= 0 ? data[idx] : 0;
            label = axes[idx] || 'Approach';
        } else if (skill === 'putt') {
            var idx = axes.findIndex(function(a){return a.toLowerCase().indexOf('putt')>=0 || a.toLowerCase().indexOf('3-putt')>=0});
            score = idx >= 0 ? data[idx] : 0;
            label = axes[idx] || 'Putting';
        } else if (skill === 'ott') {
            var idx = axes.findIndex(function(a){return a.toLowerCase().indexOf('ott')>=0 || a.toLowerCase().indexOf('driver')>=0});
            score = idx >= 0 ? data[idx] : 0;
            label = axes[idx] || 'Off the Tee';
        } else if (skill === 'arg') {
            var idx = axes.findIndex(function(a){return a.toLowerCase().indexOf('arg')>=0 || a.toLowerCase().indexOf('short')>=0 || a.toLowerCase().indexOf('scrambl')>=0});
            score = idx >= 0 ? data[idx] : 0;
            label = axes[idx] || 'Short Game';
        } else if (skill === 'dd') {
            var idx = axes.findIndex(function(a){return a.toLowerCase().indexOf('dist')>=0 || a.toLowerCase().indexOf('carry')>=0});
            if (idx < 0) {
                // Fallback: pull from SCOUTING dd field directly
                var sp = SCOUTING.find(function(s){return s.name===name});
                score = sp ? Math.round((sp.dd / 20) * 50 + 50) : 50;
            } else {
                score = data[idx];
            }
            label = 'Distance';
        }
        return { name: name, score: score };
    }).sort(function(a,b){return b.score - a.score});

    // Paginated display
    var PAGE_SIZE = 10;
    var pageState = {current: 0, total: Math.ceil(scored.length / PAGE_SIZE)};

    function renderPage() {
        var start = pageState.current * PAGE_SIZE;
        var page = scored.slice(start, start + PAGE_SIZE);
        var html = '<div class="skill-fit-list">' + page.map(function(p, i) {
            var barWidth = Math.max(5, Math.min(100, p.score));
            var cls = p.score >= 80 ? 'sf-elite' : p.score >= 60 ? 'sf-good' : p.score >= 40 ? 'sf-avg' : 'sf-weak';
            return '<div class="sf-row"><span class="sf-rank">' + (start+i+1) + '</span><span class="sf-name"><strong>' + p.name + '</strong></span><div class="sf-bar-track"><div class="sf-bar ' + cls + '" style="width:' + barWidth + '%"></div></div><span class="sf-score">' + p.score + '</span></div>';
        }).join('') + '</div>';
        html += '<div class="paginated-controls"><button class="page-btn" id="sf-prev" '+(pageState.current===0?'disabled':'')+'>&#9664; Prev</button><span>'+(pageState.current+1)+' / '+pageState.total+'</span><button class="page-btn" id="sf-next" '+(pageState.current>=pageState.total-1?'disabled':'')+'>Next &#9654;</button></div>';
        display.innerHTML = html;
        document.getElementById('sf-prev').onclick = function(){if(pageState.current>0){pageState.current--;renderPage();}};
        document.getElementById('sf-next').onclick = function(){if(pageState.current<pageState.total-1){pageState.current++;renderPage();}};
    }
    renderPage();
}

// Helpers
function sigCls(s) { return s==='TAILWIND'?'form-tailwind':s==='warm'?'form-warm':s==='neutral'?'form-neutral':s==='cool'?'form-cool':s==='HEADWIND'?'form-headwind':''; }
function flagCls(f) { return f==='ON CARD'||f.includes('WON')?'pos':f==='DARK HORSE'?'flag-value':f==='FADE'?'flag-fade':f==='BENCHED'?'neg':''; }
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

    // Archetype fit — visual bar ranking
    function renderArchetypeFit(type) {
        var display = document.getElementById('dc-archetype-display');
        if (!display) return;
        var scored = SCOUTING.map(function(p) {
            return { name: p.name, tier: p.tier, score: Math.max(0, Math.min(100, calcArchFit(p, type))) };
        }).sort(function(a,b){return b.score - a.score}).slice(0, 25);

        display.innerHTML = '<div class="skill-fit-list">' + scored.map(function(s, i) {
            var cls = s.score >= 80 ? 'sf-elite' : s.score >= 60 ? 'sf-good' : s.score >= 40 ? 'sf-avg' : 'sf-weak';
            var tc = s.tier==='Elite'?'tier-elite':s.tier==='Contender'?'tier-contender':'tier-midfield';
            return '<div class="sf-row"><span class="sf-rank">' + (i+1) + '</span><span class="sf-name"><strong>' + s.name + '</strong> <span class="tier-badge ' + tc + '" style="font-size:0.45rem;vertical-align:middle">' + s.tier + '</span></span><div class="sf-bar-track"><div class="sf-bar ' + cls + '" style="width:' + s.score + '%"></div></div><span class="sf-score">' + s.score.toFixed(0) + '</span></div>';
        }).join('') + '</div>';
    }

    function calcArchFit(p, type) {
        if (type==='secondshot') return Math.min(100,(p.app/0.9)*50+(p.arg/0.4)*25+25);
        if (type==='bomber') return Math.min(100,(p.dd/20)*40+(p.ott/0.9)*35+25);
        if (type==='bermuda') return Math.min(100,(p.putt/0.6)*45+(p.arg/0.4)*30+25);
        if (type==='poa') return Math.min(100,(p.putt/0.6)*40+(p.app/0.9)*35+25);
        if (type==='grinder') return Math.min(100,50+(p.arg/0.4)*25+(p.putt/0.6)*25-(p.dd/20)*10);
        if (type==='shortgame') return Math.min(100,(p.arg/0.4)*45+(p.putt/0.6)*30+25);
        if (type==='wind') return Math.min(100,(p.ott/0.9)*35+(p.app/0.9)*35+30);
        return 50;
    }

    // Surface Performance
    renderSurfaceView('all', 'putting');
    document.querySelectorAll('#surface-tabs .quick-tag').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#surface-tabs .quick-tag').forEach(function(b){b.classList.remove('active')});
            btn.classList.add('active');
            var view = document.querySelector('[data-surfview].active');
            renderSurfaceView(btn.dataset.surf, view ? view.dataset.surfview : 'putting');
        });
    });
    document.querySelectorAll('[data-surfview]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-surfview]').forEach(function(b){b.classList.remove('active')});
            btn.classList.add('active');
            var surf = document.querySelector('#surface-tabs .quick-tag.active');
            renderSurfaceView(surf ? surf.dataset.surf : 'all', btn.dataset.surfview);
        });
    });

    renderArchetypeFit('secondshot');
    document.querySelectorAll('#dc-archetype-tabs .quick-tag').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#dc-archetype-tabs .quick-tag').forEach(function(b){b.classList.remove('active')});
            btn.classList.add('active');
            renderArchetypeFit(btn.dataset.arch);
        });
    });

    // Course library
    const cg = document.getElementById('course-grid');
    COURSES.forEach(c => {
        const badge = c.status==='live'?'<span class="badge live">LIVE</span>':c.status==='upcoming'?'<span class="badge upcoming">UPCOMING</span>':'<span class="badge settled">SETTLED</span>';
        const tKey = c.dataKey || '';
        cg.innerHTML += `<div class="course-card" ${tKey ? `data-tournament="${tKey}"` : ''}><h4>${c.name} ${badge}</h4><div class="course-meta">${c.event} | ${c.surface} | ${c.length}</div><div class="course-meta"><strong>Archetype:</strong> ${c.archetype}</div><div class="course-meta"><strong>Masked:</strong> ${c.masked}</div><div class="course-meta"><strong>Amplified:</strong> ${c.amplified}</div><div class="course-stats">${c.topStats.map(s=>`<span class="course-stat-tag">${s}</span>`).join('')}</div>${tKey ? '<div class="course-meta" style="margin-top:0.5rem;color:var(--brass-400)">Click to view tournament analysis &rarr;</div>' : ''}</div>`;
    });
}

function getStatusFlag(name) {
    if (typeof PLAYER_STATUS === 'undefined') return '';
    var ps = PLAYER_STATUS.find(function(s){return s.player===name});
    if (!ps) return '';
    var sevCls = ps.severity==='warning'?'neg':ps.severity==='caution'?'form-cool':'form-neutral';
    var icons = {injury:'&#9888;',rest:'&#9200;',travel:'&#9992;',motivation:'&#9733;',equipment:'&#9881;',form:'&#9650;',note:'&#9432;'};
    var icon = icons[ps.type] || '&#9432;';
    return '<div class="player-status-flag '+sevCls+'">'+icon+' '+ps.status+' <span style="color:var(--cream-700);font-size:0.6rem">('+ps.updated+')</span></div>';
}

function renderScoutCards(filter,tier,limit) {
    const grid = document.getElementById('scout-grid');
    grid.innerHTML = '';
    let list = [...SCOUTING].sort((a,b)=>b.sg_tot-a.sg_tot);
    if (filter) list = list.filter(p=>p.name.toLowerCase().includes(filter.toLowerCase()));
    if (tier) list = list.filter(p=>p.tier===tier);
    const maxShow = (filter || tier) ? list.length : (limit || list.length);
    if (!filter && !tier && list.length > maxShow) {
        list = list.slice(0, maxShow);
    }
    list.forEach(p => {
        const tc = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':p.tier==='Mid-field'?'tier-midfield':'tier-veteran';
        const bars = [{l:'APP',v:p.app,m:1},{l:'OTT',v:p.ott,m:1},{l:'ARG',v:p.arg,m:0.5},{l:'PUTT',v:p.putt,m:0.7}];
        const hasSurface = p.putt_bermuda !== undefined;
        const surfaceHtml = hasSurface ? `<div class="surface-putting"><span class="sp-label">Putting by surface:</span><span class="sp-val ${p.putt_bermuda>=0?'pos':'neg'}">Bermuda ${p.putt_bermuda>=0?'+':''}${p.putt_bermuda.toFixed(2)}</span><span class="sp-val ${p.putt_bent>=0?'pos':'neg'}">Bent ${p.putt_bent>=0?'+':''}${p.putt_bent.toFixed(2)}</span><span class="sp-val ${p.putt_poa>=0?'pos':'neg'}">Poa ${p.putt_poa>=0?'+':''}${p.putt_poa.toFixed(2)}</span></div>` : '';
        var sflag = getStatusFlag(p.name);
        grid.innerHTML += `<div class="scout-card"><div class="scout-header"><h4>${p.name}</h4><span class="tier-badge ${tc}">${p.tier}</span></div>${sflag}<div class="scout-sg-bars">${bars.map(b=>{const pct=Math.min(Math.max((b.v/b.m)*50+50,5),100);const cls=b.v>0.2?'sg-positive':b.v>0?'sg-neutral':'sg-negative';return `<div class="sg-bar-row"><span class="sg-bar-label">${b.l}</span><div class="sg-bar-track"><div class="sg-bar-fill ${cls}" style="width:${pct}%"></div></div><span class="sg-bar-val ${b.v>=0?'pos':'neg'}">${b.v>=0?'+':''}${b.v.toFixed(2)}</span></div>`;}).join('')}</div><div class="scout-meta"><span>TOT ${p.sg_tot>=0?'+':''}${p.sg_tot.toFixed(2)}${makeSparkline(p.name,'sg_tot')}</span><span>DD ${p.dd>=0?'+':''}${p.dd.toFixed(1)}</span><span>${p.shape}</span><span>${p.surface}</span></div>${surfaceHtml}<div class="scout-section"><strong class="pos">Strengths:</strong> ${p.strengths}</div><div class="scout-section"><strong class="neg">Weaknesses:</strong> ${p.weaknesses}</div><div class="scout-section scout-notes">${p.notes}</div></div>`;
    });
}

function renderScoutCardsFromList(list) {
    renderScoutCards('', '', list.length);
    // Override with the specific list
    var grid = document.getElementById('scout-grid');
    grid.innerHTML = '';
    list.forEach(function(p) {
        var tc = p.tier==='Elite'?'tier-elite':p.tier==='Contender'?'tier-contender':p.tier==='Mid-field'?'tier-midfield':'tier-veteran';
        var bars = [{l:'APP',v:p.app,m:1},{l:'OTT',v:p.ott,m:1},{l:'ARG',v:p.arg,m:0.5},{l:'PUTT',v:p.putt,m:0.7}];
        var hasSurface = p.putt_bermuda !== undefined;
        var surfaceHtml = hasSurface ? '<div class="surface-putting"><span class="sp-label">Putting by surface:</span><span class="sp-val '+(p.putt_bermuda>=0?'pos':'neg')+'">Bermuda '+(p.putt_bermuda>=0?'+':'')+p.putt_bermuda.toFixed(2)+'</span><span class="sp-val '+(p.putt_bent>=0?'pos':'neg')+'">Bent '+(p.putt_bent>=0?'+':'')+p.putt_bent.toFixed(2)+'</span><span class="sp-val '+(p.putt_poa>=0?'pos':'neg')+'">Poa '+(p.putt_poa>=0?'+':'')+p.putt_poa.toFixed(2)+'</span></div>' : '';
        var sflag = getStatusFlag(p.name);
        grid.innerHTML += '<div class="scout-card"><div class="scout-header"><h4>'+p.name+'</h4><span class="tier-badge '+tc+'">'+p.tier+'</span></div>'+sflag+'<div class="scout-sg-bars">'+bars.map(function(b){var pct=Math.min(Math.max((b.v/b.m)*50+50,5),100);var cls=b.v>0.2?'sg-positive':b.v>0?'sg-neutral':'sg-negative';return '<div class="sg-bar-row"><span class="sg-bar-label">'+b.l+'</span><div class="sg-bar-track"><div class="sg-bar-fill '+cls+'" style="width:'+pct+'%"></div></div><span class="sg-bar-val '+(b.v>=0?'pos':'neg')+'">'+(b.v>=0?'+':'')+b.v.toFixed(2)+'</span></div>';}).join('')+'</div><div class="scout-meta"><span>TOT '+(p.sg_tot>=0?'+':'')+p.sg_tot.toFixed(2)+makeSparkline(p.name,'sg_tot')+'</span><span>DD '+(p.dd>=0?'+':'')+p.dd.toFixed(1)+'</span><span>'+p.shape+'</span><span>'+p.surface+'</span></div>'+surfaceHtml+'<div class="scout-section"><strong class="pos">Strengths:</strong> '+p.strengths+'</div><div class="scout-section"><strong class="neg">Weaknesses:</strong> '+p.weaknesses+'</div><div class="scout-section scout-notes">'+p.notes+'</div></div>';
    });
}

document.getElementById('scout-search-input').addEventListener('input', () => { renderScoutCards(document.getElementById('scout-search-input').value, document.getElementById('scout-tier-filter').value, 999); });
document.getElementById('scout-tier-filter').addEventListener('change', () => { renderScoutCards(document.getElementById('scout-search-input').value, document.getElementById('scout-tier-filter').value); });

// Quick tags
document.querySelectorAll('.quick-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        // If clicking an already-active tag, deselect and show all
        if (tag.classList.contains('active') && !tag.dataset.reset) {
            tag.classList.remove('active');
            document.getElementById('scout-tier-filter').value = '';
            renderScoutCards('', '');
            return;
        }

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
            document.getElementById('scout-tier-filter').value = '';
            const key = 'putt_' + tag.dataset.surface;
            const sorted = [...SCOUTING].filter(p => p[key] !== undefined).sort((a,b) => b[key] - a[key]).slice(0,15);
            renderScoutCardsFromList(sorted);
        } else if (tag.dataset.time) {
            document.querySelectorAll('[data-time]').forEach(function(b){b.classList.remove('active')});
            tag.classList.add('active');
            document.getElementById('scout-tier-filter').value = '';
            var time = tag.dataset.time;
            var sorted;
            if (time === 'career') {
                sorted = [...SCOUTING].sort((a,b) => b.sg_tot - a.sg_tot).slice(0,20);
            } else if (time === 'recent') {
                // Sort by combined APP + PUTT (the two skills that define recent competitive form)
                // High APP + PUTT = player is striking AND converting right now
                sorted = [...SCOUTING].sort((a,b) => (b.app + b.putt) - (a.app + a.putt)).slice(0,20);
            } else if (time === 'compcourse') {
                // Sort by approach + short game (the skills that transfer across course types)
                sorted = [...SCOUTING].sort((a,b) => (b.app + b.arg) - (a.app + a.arg)).slice(0,20);
            } else if (time === 'thisweek') {
                // Use the current tournament's radar players if available
                var currentKey = document.querySelector('.timeline-btn.active');
                var tKey = currentKey ? currentKey.dataset.t : 'masters';
                var t = TOURNAMENT_DATA[tKey];
                if (t && t.radarPlayers) {
                    var radarNames = Object.keys(t.radarPlayers);
                    sorted = SCOUTING.filter(p => radarNames.includes(p.name));
                    // Sort by radar overall fit
                    sorted.sort((a,b) => {
                        var aData = t.radarPlayers[a.name] || [];
                        var bData = t.radarPlayers[b.name] || [];
                        var aAvg = aData.length ? aData.reduce((s,v)=>s+v,0)/aData.length : 0;
                        var bAvg = bData.length ? bData.reduce((s,v)=>s+v,0)/bData.length : 0;
                        return bAvg - aAvg;
                    });
                } else {
                    sorted = [...SCOUTING].sort((a,b) => b.sg_tot - a.sg_tot).slice(0,20);
                }
            }
            if (sorted && sorted.length) renderScoutCardsFromList(sorted);
        } else if (tag.dataset.form) {
            document.getElementById('scout-tier-filter').value = '';
            const type = tag.dataset.form;
            let filtered;
            if (type === 'hot') {
                // Top SG:Total players — the objectively best golfers right now
                filtered = [...SCOUTING].sort((a,b) => b.sg_tot - a.sg_tot).slice(0,15);
            } else if (type === 'cold') {
                // Bottom SG:Total among profiled players — objectively struggling
                filtered = [...SCOUTING].filter(p => p.sg_tot < 0.4).sort((a,b) => a.sg_tot - b.sg_tot).slice(0,15);
            } else if (type === 'rising') {
                // Contenders and mid-fielders with positive signals
                filtered = SCOUTING.filter(p => (p.tier === 'Contender' || p.tier === 'Mid-field') && p.notes && p.notes.match(/composite|dark horse|protocol|surfa|trending|rising|momentum|validated/i)).slice(0,15);
            } else if (type === 'injured') {
                if (typeof PLAYER_STATUS !== 'undefined') {
                    const injuredNames = PLAYER_STATUS.filter(s => s.severity === 'warning' || s.severity === 'caution').map(s => s.player);
                    filtered = SCOUTING.filter(p => injuredNames.includes(p.name));
                } else {
                    filtered = SCOUTING.filter(p => p.notes && p.notes.match(/injur|back.*spasm|WD|withdrew|health/i));
                }
            }
            if (filtered && filtered.length) renderScoutCardsFromList(filtered);
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
        var sflag = getStatusFlag(p.name);
        grid.innerHTML += `<div class="scout-card"><div class="scout-header"><h4>${p.name}</h4><span class="tier-badge ${tc}">${p.tier}</span></div>${sflag}<div class="scout-sg-bars">${bars.map(b=>{const pct=Math.min(Math.max((b.v/b.m)*50+50,5),100);const cls=b.v>0.2?'sg-positive':b.v>0?'sg-neutral':'sg-negative';return `<div class="sg-bar-row"><span class="sg-bar-label">${b.l}</span><div class="sg-bar-track"><div class="sg-bar-fill ${cls}" style="width:${pct}%"></div></div><span class="sg-bar-val ${b.v>=0?'pos':'neg'}">${b.v>=0?'+':''}${b.v.toFixed(2)}</span></div>`;}).join('')}</div><div class="scout-meta"><span>TOT ${p.sg_tot>=0?'+':''}${p.sg_tot.toFixed(2)}${makeSparkline(p.name,'sg_tot')}</span><span>DD ${p.dd>=0?'+':''}${p.dd.toFixed(1)}</span><span>${p.shape}</span><span>${p.surface}</span></div>${surfaceHtml}<div class="scout-section"><strong class="pos">Strengths:</strong> ${p.strengths}</div><div class="scout-section"><strong class="neg">Weaknesses:</strong> ${p.weaknesses}</div><div class="scout-section scout-notes">${p.notes}</div></div>`;
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
// ═══ LIVE ODDS ═══

function renderLiveOdds(key) {
    var t = TOURNAMENT_DATA[key];
    var tb = document.getElementById('live-odds-body');
    var valuePicks = document.getElementById('value-picks');
    var fadePicks = document.getElementById('fade-picks');
    if (!tb) return;
    tb.innerHTML = '';
    if (valuePicks) valuePicks.innerHTML = '';
    if (fadePicks) fadePicks.innerHTML = '';

    if (!t || !t.oddsBoard || !t.oddsBoard.length) {
        tb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--cream-500);font-style:italic;padding:1.5rem">Odds data populates when tournament odds are captured. Check back closer to the event.</td></tr>';
        return;
    }

    var values = [];
    var fades = [];

    t.oddsBoard.forEach(function(o) {
        // Status flag check
        var statusIcon = '';
        if (typeof PLAYER_STATUS !== 'undefined') {
            var ps = PLAYER_STATUS.find(function(s){return s.player===o.name});
            if (ps) statusIcon = (ps.severity==='warning'||ps.severity==='caution') ? '&#9888; ' : '';
        }
        var note = o.note || '';
        var formCls = sigCls(o.form);
        if (o.form === 'caution') formCls = 'form-cool';

        tb.innerHTML += '<tr><td>' + o.rank + '</td><td><strong>' + o.name + '</strong></td><td style="font-family:var(--font-mono)">' + (o.best||'') + '</td><td style="font-family:var(--font-mono)">' + (o.b365||'') + '</td><td class="' + formCls + '">' + o.form + '</td><td style="font-size:0.72rem">' + statusIcon + note + '</td></tr>';

        if (o.form === 'TAILWIND') values.push(o);
        if (o.form === 'cool' || o.form === 'caution') fades.push(o);
    });

    if (valuePicks) {
        valuePicks.innerHTML = values.length ? '<p class="card-subtitle">Surging form heading into the tournament.</p>' + values.map(function(o) {
            return '<div class="note-item"><span class="note-badge pos">&#9650; ' + o.form + '</span><strong>' + o.name + '</strong> <span class="note-text">' + (o.best||'') + '. ' + (o.note||'') + '</span></div>';
        }).join('') : '<p class="narrative-text" style="font-style:italic">No players with TAILWIND form signal.</p>';
    }

    if (fadePicks) {
        fadePicks.innerHTML = fades.length ? '<p class="card-subtitle">Declining form or health concerns to monitor.</p>' + fades.map(function(o) {
            return '<div class="note-item"><span class="note-badge neg">&#9660; ' + o.form + '</span><strong>' + o.name + '</strong> <span class="note-text">' + (o.best||'') + '. ' + (o.note||'') + '</span></div>';
        }).join('') : '<p class="narrative-text" style="font-style:italic">No players with concerning form or health flags.</p>';
    }
}

document.getElementById('odds-tourney').addEventListener('change', function(e) { renderLiveOdds(e.target.value); });
renderLiveOdds('masters');

renderPlayers(PLAYERS.active,'active-players');
renderPlayers(PLAYERS.onNotice,'soft-players');
renderPlayers(PLAYERS.benched,'hard-players');

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
        const res = d.result || '';
        const sc = res==='Won'?'pos':res==='Lost'?'neg':d.status==='Lost'?'neg':d.status==='Open'?'':d.status.indexOf('T')===0||d.status.indexOf('-')>=0?'form-warm':'pos';
        let betType = d.market || 'Outright';
        if (d.terms && d.terms !== 'Win') betType += ' ' + d.terms;
        const bk = d.book || book || 'bet365';
        const placed = d.placed || '';
        tb.innerHTML += `<tr><td><strong>${d.player}</strong></td><td>${betType}</td><td>${bk}</td><td>${d.odds}</td><td>$${d.stake.toFixed(2)}</td><td style="font-family:var(--font-mono);font-size:0.65rem;color:var(--cream-500)">${placed}</td><td class="${sc}">${d.status}</td></tr>`;
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
