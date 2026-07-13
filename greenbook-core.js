/* ===================================================================
   GREENBOOK CORE — shared logic for the Golf Intelligence Center.
   Load AFTER data.js, tournament-data.js, settled-data.js, tools-data.js,
   player-kb.js (all optional/guarded). Chart.js optional.
   Exposes a single global: GB.
   Design contract (golf-intel-center skill): plain-language labels first,
   honest rounding, consistent color meaning, verdict-first, depth layered.
   =================================================================== */
const GB = (function(){
  const U = 20; // $ per unit
  const has = n => typeof window[n] !== 'undefined';
  const SCOUT = has('SCOUTING') ? SCOUTING : [];
  const scrub = s => (s||'').replace(/�/g,'—').replace(/�/g,'—');

  /* ---------- number & odds formatting (house rules) ---------- */
  const pctW   = p => p==null ? '—' : (p<1 && p>0 ? '<1%' : Math.round(p)+'%');
  const sg     = v => v==null ? '—' : (v>=0?'+':'') + (+v).toFixed(2);            // signed strokes gained
  const signed = (v,d=2) => v==null ? '—' : (v>=0?'+':'') + (+v).toFixed(d);
  const units  = n => (n<0?'−':'+') + (Math.abs(n)/U).toFixed(1) + 'u';
  const units0 = n => (Math.abs(n)/U).toFixed(1) + 'u';
  const ustk   = n => (+(n/U).toFixed(2)) + 'u';
  const clsOf  = n => n>0?'pos':(n<0?'neg':'muted');
  function americanToProb(odds){ const o = typeof odds==='string' ? parseInt(odds.replace(/[^-+\d]/g,''),10) : odds;
    if(!o && o!==0) return null; return o>0 ? 100/(o+100) : (-o)/((-o)+100); }
  const impliedPct = odds => { const p=americanToProb(odds); return p==null?null:Math.round(p*100); };

  /* ---------- plain-language glossary (tooltip source) ---------- */
  const GLOSSARY = {
    sg_tot:"How many shots better or worse than an average tour pro, per round, all parts of the game combined. The best one-number summary of how well someone is playing.",
    app:"How much a player gains or loses on shots into the green (SG: Approach). Usually the biggest separator between good and great.",
    ott:"How much a player gains or loses off the tee — driving distance and accuracy combined (SG: Off the Tee).",
    arg:"Chipping and shots from just off the green (SG: Around the Green).",
    putt:"How much a player gains or loses with the putter (SG: Putting).",
    t2g:"Everything except putting, combined — a clean measure of ball-striking (SG: Tee to Green).",
    edge:"The gap between how likely the model thinks something is and what the odds pay. A positive edge means the price is too generous for the real chance (EV).",
    implied:"What the odds say the chance is, as a percent. Compare it to the model's percent to see value.",
    clv:"Whether the price got shorter after you bet — the market later agreeing with you (Closing Line Value). Consistent CLV means you're beating the market.",
    fit:"How well a player's strengths match what this specific course rewards. Established before player narratives.",
    dna:"The category a course falls into based on what it rewards — used to judge fit across the whole field consistently (Course DNA / archetype).",
    form:"How well a player has been playing recently, weighted so recent events count more than old ones.",
    variance:"How streaky a player is. High-variance players are riskier single bets but useful as longshots or DFS leverage.",
    win:"The model's estimate of the chance a player wins the tournament outright.",
    cut:"The chance a player survives the halfway cut and plays the weekend.",
    unit:"A standard bet size. Talking in units keeps staking consistent regardless of bankroll. Here 1 unit = $"+U+".",
    ew:"Each-way: half the stake on the win, half on a top finish (e.g. top 5). Pays even if the player only places."
  };
  const LABELS = {
    sg_tot:{plain:"Overall level", tech:"SG: Total", g:"sg_tot"},
    app:{plain:"Approach", tech:"SG: APP", g:"app"},
    ott:{plain:"Off the tee", tech:"SG: OTT", g:"ott"},
    arg:{plain:"Short game", tech:"SG: ARG", g:"arg"},
    putt:{plain:"Putting", tech:"SG: PUTT", g:"putt"},
    dd:{plain:"Driving distance", tech:"vs field", g:"dd"}
  };
  function info(key){ const d=GLOSSARY[key]; return d ? `<i class="info" data-def="${d.replace(/"/g,'&quot;')}">i</i>` : ''; }
  function label(key,{tech=true}={}){ const L=LABELS[key]; if(!L) return key;
    return `<span class="lab">${L.plain}${tech?` <span class="tech">${L.tech}</span>`:''} ${info(L.g||key)}</span>`; }

  /* ---------- field-statistics engine (percentiles vs the tracked field) ---------- */
  const FIELD = (function(){
    if(!SCOUT.length) return null;
    const keys=['sg_tot','app','ott','arg','putt','dd','putt_bermuda','putt_bent','putt_poa'];
    const S={};
    keys.forEach(k=>{ const vals=SCOUT.map(p=>p[k]).filter(v=>v!=null).sort((a,b)=>a-b);
      if(!vals.length){S[k]=null;return;} const n=vals.length, mean=vals.reduce((s,v)=>s+v,0)/n;
      const sd=Math.sqrt(vals.reduce((s,v)=>s+(v-mean)*(v-mean),0)/n)||1; S[k]={vals,n,mean,sd}; });
    const pct=(k,v)=>{ if(v==null||!S[k])return null; let lo=0; for(const x of S[k].vals) if(x<v) lo++; return Math.round(lo/S[k].vals.length*100); };
    const rank=(k,v)=>{ if(v==null||!S[k])return null; let b=1; for(const x of S[k].vals) if(x>v) b++; return b; };
    const z=(k,v)=>{ if(v==null||!S[k])return null; return (v-S[k].mean)/S[k].sd; };
    return {S,pct,rank,z,n:SCOUT.length};
  })();
  const pctPill = p => { const c=p==null?'':p>=70?'hi':p>=40?'mid':'lo'; return `<span class="pctpill ${c}">${p==null?'—':p+' pct'}</span>`; };
  const findPlayer = name => SCOUT.find(p=>p.name===name) ||
    SCOUT.find(p=>p.name.toLowerCase()===(name||'').toLowerCase()) ||
    SCOUT.find(p=>{ const a=p.name.toLowerCase().split(' ').pop(), b=(name||'').toLowerCase().split(' ').pop(); return a===b && p.name.toLowerCase().includes((name||'').toLowerCase().split(' ')[0]); });

  /* ---------- course-fit model (fingerprint-weighted, general) ---------- */
  // Map a fingerprint stat name -> the SCOUTING SG key it draws on, plus whether it's an accuracy demand.
  function statToKey(statName){ const t=(statName||'').toLowerCase();
    if(/approach|app|iron|long-iron|second/.test(t)) return {k:'app'};
    if(/around|arg|short game|scrambl|chip/.test(t)) return {k:'arg'};
    if(/putt/.test(t)) return {k:'putt'};
    if(/driving acc|accuracy|fairway|precision|positional/.test(t)) return {k:'app', acc:true};
    if(/ott|off the tee|driving dist|distance|bomber|carry|par 5/.test(t)) return {k:'ott', dist:true};
    if(/bogey|avoid|survival/.test(t)) return {k:'sg_tot', frac:0.4};
    if(/wind|links|history|craft|experience/.test(t)) return {k:'links'};
    return null;
  }
  // links pedigree bonus from player-kb learnings
  function linksBonus(name){ if(!has('PLAYER_KB')) return 0; const kb=PLAYER_KB[name]; if(!kb||!kb.learnings) return 0;
    const hit=kb.learnings.some(l=>/link|open|wind|seaside|firm|fast/i.test(l.claim||'')); return hit?0.10:0; }
  // Returns {score, parts:[{key,label,val,contrib,acc}], flags:{bomberMisfit}}
  function fitByFingerprint(g, fingerprint){
    let score=0, parts=[], flags={}; const totalW=(fingerprint||[]).reduce((s,f)=>s+(f.weight||0),0)||1;
    (fingerprint||[]).forEach(f=>{ const m=statToKey(f.stat); if(!m) return; const w=(f.weight||0)/totalW;
      if(m.k==='links'){ const lb=linksBonus(g.name); score+=w*lb*10; if(lb>0) parts.push({key:'links',label:'Links pedigree',val:null,contrib:w*lb*10}); return; }
      let v = g[m.k]; if(v==null) return; if(m.frac) v*=m.frac;
      let contrib = w*v;
      if(m.acc){ // accuracy demand: reward accurate iron players, penalize wild bombers
        if((g.dd||0)>8 && (g.app||0)<0.3){ contrib -= w*0.5; flags.bomberMisfit=true; } }
      if(m.dist && /* non-bomber course cue: distance weight small */ w<0.24){ /* keep */ }
      score += contrib;
      parts.push({key:m.k, label:(LABELS[m.k]||{plain:f.stat}).plain, val:v, contrib, acc:m.acc, dist:m.dist});
    });
    // small overall-talent anchor so elite players aren't buried by one weak category
    score += (g.sg_tot||0)*0.12;
    return {score, parts, flags};
  }
  // Rank the whole tracked field for an event key, with fit percentile within the field.
  function eventFitField(evKey){
    const t = has('TOURNAMENT_DATA') ? TOURNAMENT_DATA[evKey] : null;
    const fp = t && t.fingerprint ? t.fingerprint : null; if(!fp) return [];
    const scored = SCOUT.filter(g=>g.sg_tot!=null).map(g=>({g, ...fitByFingerprint(g,fp)}))
      .sort((a,b)=>b.score-a.score);
    const scores = scored.map(s=>s.score).sort((a,b)=>a-b);
    const fpct = s=>{ let lo=0; for(const x of scores) if(x<s) lo++; return Math.round(lo/scores.length*100); };
    scored.forEach((s,i)=>{ s.rank=i+1; s.fitPct=fpct(s.score); });
    return scored;
  }
  // Verdict tier from fit percentile within the field (words + color). Spread so it differentiates.
  function verdict(pct){
    if(pct==null) return {label:'—', cls:'neutral'};
    if(pct>=95) return {label:'Top Fit', cls:'top'};
    if(pct>=85) return {label:'Strong Fit', cls:'strong'};
    if(pct>=65) return {label:'Solid Fit', cls:'solid'};
    if(pct>=40) return {label:'Neutral', cls:'neutral'};
    return {label:'Misfit', cls:'misfit'};
  }
  // Plain-language reasons from the fit decomposition (top ~3 drivers), deduped by skill,
  // no raw numbers in the headline (those live in the depth layer).
  function reasons(entry){
    const out=[], seen=new Set();
    const parts=entry.parts.slice().sort((a,b)=>Math.abs(b.contrib)-Math.abs(a.contrib));
    const push=(t,s,tag)=>{ if(seen.has(tag)) return; seen.add(tag); out.push({t,s}); };
    if(entry.flags.bomberMisfit) push('bad','Wild off the tee — the fescue punishes it','tee');
    for(const p of parts){
      if(out.length>=3) break;
      if(p.key==='links'){ push('good','Proven links pedigree','links'); continue; }
      if(p.acc) continue; // accuracy demand handled by bomberMisfit flag above
      const pc = FIELD ? FIELD.pct(p.key,p.val) : null; if(pc==null) continue;
      const name=(LABELS[p.key]||{plain:p.key}).plain.toLowerCase();
      if(pc>=78) push('good',`Elite ${name}`,p.key);
      else if(pc<=32) push('bad',`${name.charAt(0).toUpperCase()+name.slice(1)} a drag`,p.key);
      else push('neutral',`Solid ${name}`,p.key);
    }
    if(entry.flags.bomberMisfit && out.length<3 && !seen.has('len')) push('neutral','Length is neutral here — not a bomber’s course','len');
    return out.slice(0,3);
  }

  /* ---------- betting-card lookups ---------- */
  function openCardFor(name){ if(!has('OPEN_CARD')) return null; return OPEN_CARD.find(b=>b.player===name || (b.player||'').toLowerCase()===(name||'').toLowerCase()); }

  /* ---------- shared components ---------- */
  function chip(label,cls){ return `<span class="chip ${cls}">${label}</span>`; }
  function mbar(labelHtml, pct, valHtml, {diverging=false,z=null}={}){
    if(diverging){ const mag=z==null?0:Math.min(Math.abs(z)/2.5,1)*50; const right=(z||0)>=0;
      const side=right?`left:50%;width:${mag.toFixed(1)}%`:`right:50%;width:${mag.toFixed(1)}%`;
      return `<div class="mbar dbar"><span class="ml">${labelHtml}</span><div class="mt"><div class="mid"></div><div class="df ${right?'pos':'neg'}" style="${side}"></div></div><span class="mv">${valHtml}</span></div>`; }
    const col = pct==null?'var(--cream-400)':pct>=70?'var(--green-500)':pct>=40?'var(--green-300)':'var(--scarlet)';
    return `<div class="mbar"><span class="ml">${labelHtml}</span><div class="mt"><div class="mf" style="width:${Math.max(3,pct||0)}%;background:${col}"></div></div><span class="mv">${valHtml}</span></div>`; }

  /* ---------- shared masthead + page nav ---------- */
  function mountChrome(active){
    const S = has('SEASON') ? SEASON : null;
    const meta = S ? `Season <b class="${S.pl>=0?'pos':'neg'}">${units(S.pl)}</b> · ${S.roi}% ROI · ${S.winners} winners` : '';
    const pages = [
      ['index.html','Board','board'],
      ['players.html','Players','players'],
      ['events.html','Events','events'],
      ['record.html','The Record','record'],
    ];
    const head = document.getElementById('gb-head');
    if(head) head.innerHTML = `<div class="masthead"><div class="wrap">
        <div><a class="wordmark" href="index.html">GREEN<strong>BOOK</strong></a>
          <div class="mast-tag">Golf Intelligence Center · 2026</div></div>
        <div class="mast-meta">${meta}</div>
      </div></div>
      <nav class="pagenav"><div class="wrap">
        ${pages.map(([h,l,k])=>`<a href="${h}" class="${k===active?'active':''}">${l}</a>`).join('')}
      </div></nav>`;
    const foot = document.getElementById('gb-foot');
    if(foot) foot.innerHTML = `<footer class="gb"><div class="wrap">
        <span>GREENBOOK · Data-first golf intelligence · every number rounded honest, every term one hover from plain English.</span>
        <span>${S?`Settled ${units(S.pl)} · ${S.roi}% ROI`:''} · <a href="record.html">the record ▸</a></span>
      </div></footer>`;
  }

  return { U, has, scrub, pctW, sg, signed, units, units0, ustk, clsOf, impliedPct, americanToProb,
    GLOSSARY, LABELS, info, label, FIELD, pctPill, findPlayer,
    fitByFingerprint, eventFitField, verdict, reasons, openCardFor,
    chip, mbar, mountChrome };
})();
