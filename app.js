(function () {
  'use strict';
  const G=window.LonghornGame,D=G.data,$=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const SAVE='longhorn-launch-v4',RECORDS='longhorn-launch-records-v4';
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{/* Play remains available when storage is blocked. */}};
  const freshSeed=()=>{if(window.crypto?.getRandomValues)return crypto.getRandomValues(new Uint32Array(1))[0];return Math.floor(Math.random()*4294967296)};
  const params=new URLSearchParams(location.search),seedParam=params.get('seed'),explicitSeed=seedParam!==null&&/^-?\d+$/.test(seedParam)&&Number.isSafeInteger(Number(seedParam));
  const saved=read(SAVE,null);
  const validSave=s=>G.isValidState(s);
  let state=explicitSeed?(validSave(saved)&&saved.seed===(Number(seedParam)>>>0)?saved:G.create(Number(seedParam))):validSave(saved)?saved:G.create(freshSeed());
  let busy=false,spinGeneration=0,animations=[],autoAdvanceTimer=null,audio=null,muted=read('longhorn-launch-muted',true),previousStats=null;
  const reelStages=new Set(['profile','scholarship','study-grade','recruit-count','evaluation']);
  const colors={good:'#42866a',bad:'#c65340',gold:'#edc85b',neutral:'#c7c1af'};
  const stageTitles={intro:'High-school average',profile:'High-school average',applications:'Applications',admissions:'Admission result',program:'Choose a program',focus:'First-year direction',scholarship:'Entrance scholarship',club:'Campus organizations','club-result':'Organization result','study-grade':'Semester GPA','study-event':'Semester event','recruit-count':'Interview count','recruit-employer':'Employer',interview:'Interview result',offer:'Choose a job offer','work-event':'Summer event',evaluation:'Work evaluation','return-offer':'Return offer','summer-alt':'Summer without an internship',graduation:'Choose your next step','grad-spin':'Graduate admission','startup-spin':'Austin startup pitch',ending:'Your final card'};
  function context() {
    if(state.stage==='intro'||state.stage==='profile')return 'START';
    if(state.stage==='admissions')return `${state.hs}% · ${D.programs.find(p=>p.id===state.applications[Math.min(state.admissionIndex-(state.result?1:0),state.applications.length-1)])?.code||'UT'}`;
    if(['applications','program'].includes(state.stage))return `${state.hs}% · ADMISSION`;
    if(['focus','scholarship','club','club-result'].includes(state.stage))return G.currentProgram(state)?.code||'UT';
    if(state.stage==='interview')return `${D.terms[state.term]?.label} · ${D.employers.find(e=>e.id===state.target)?.name}`;
    if(state.stage==='recruit-employer')return `${D.terms[state.term]?.label} · INTERVIEW ${state.totalInterviews-state.interviews+1}/${state.totalInterviews}`;
    if(state.stage==='ending')return state.ending==='admission'?'APPLICATION CYCLE COMPLETE':state.ending==='academic'?'ACADEMIC ENDING':'GRADUATED';
    return D.terms[state.term]?.label||'GRADUATION';
  }
  function act(action,focus=true) {
    if(busy)return;
    clearTimeout(autoAdvanceTimer);const before=state.stage;state=G.step(state,action);save();render();
    if(focus&&before!==state.stage){const first=$('stage').querySelector('button:not(:disabled)');first?.focus({preventScroll:true});}
  }
  function save() {
    write(SAVE,state);
    if(state.finished){const stored=read(RECORDS,[]),records=Array.isArray(stored)?stored:[],id=`${state.seed}:${JSON.stringify(state.choices)}`;if(!records.some(r=>r?.id===id)){records.push({id,seed:state.seed,ending:state.ending,gpa:state.gpa,cash:state.cash,jobs:state.jobs.length});write(RECORDS,records.slice(-100));}}
  }
  function renderTimeline() {
    $('timeline').innerHTML=state.program?D.terms.map((t,i)=>`<div class="term ${t.kind==='work'?'work':''} ${i<state.term?'done':''} ${i===state.term?'current':''}" ${i===state.term?'aria-current="step"':''}><b>${t.label.toUpperCase()}</b><small>${t.kind==='work'?'SUMMER':'STUDY'}</small></div>`).join(''):'';
    const current=$('timeline').querySelector('.current');
    if(current)$('timeline').scrollLeft=Math.max(0,current.offsetLeft-$('timeline').clientWidth/2+current.clientWidth/2);
  }
  function radar() {
    const cx=145,cy=126,r=76,n=7,point=(i,radius)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [cx+Math.cos(a)*radius,cy+Math.sin(a)*radius]},poly=radius=>D.statNames.map((_,i)=>point(i,radius).join(',')).join(' ');
    const rings=[.25,.5,.75,1].map(k=>`<polygon points="${poly(r*k)}" fill="none" stroke="#ffffff33"/>`).join('');
    const spokes=D.statNames.map((_,i)=>{const [x,y]=point(i,r);return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#ffffff25"/>`}).join('');
    const labels=D.statNames.map((name,i)=>{const [x,y]=point(i,r+29);return `<text x="${x}" y="${y-3}">${esc(name.toUpperCase())}</text><text class="value" x="${x}" y="${y+10}">${state.stats[i]}</text>`}).join('');
    const profile=state.stats.map((v,i)=>point(i,r*Math.min(v/100,1)).join(',')).join(' ');
    return `<svg class="radar" viewBox="0 0 290 252" role="img" aria-label="${esc(D.statNames.map((n,i)=>`${n} ${state.stats[i]}`).join(', '))}">${rings}${spokes}<polygon points="${profile}" fill="#edc85b22" stroke="#edc85b" stroke-width="2.5"/>${labels}</svg>`;
  }
  function renderCharacter() {
    const p=G.currentProgram(state),values=[state.gpa?state.gpa.toFixed(2):state.hs?`${state.hs}%`:'—',`${state.integrity}/3`,G.money(state.cash),state.jobs.length];
    const currentJob=D.employers.find(e=>e.id===state.job),best=state.jobs.length?[...state.jobs].sort((a,b)=>b.pay-a.pay)[0]:null;
    $('character').innerHTML=`<div class="identity"><div class="identity-top"><b class="program-code">${p?.code||'—'}</b><span class="year-badge">${state.program?'UT AUSTIN':'START'}</span></div><p class="program-name">${p?esc(p.name):'No program yet'}</p></div>${radar()}<div class="stat-grid">${values.map((v,i)=>`<div class="stat"><small>${[state.gpa?'GPA / 4.00':'HS AVERAGE','INTEGRITY','SAVINGS','INTERNSHIPS'][i]}</small><b data-stat="${i}" class="${i===1?state.integrity>1?'integrity-good':'integrity-bad':''} ${previousStats&&previousStats[i]!==v?'flash':''}">${esc(v)}</b></div>`).join('')}</div><div class="character-detail"><small>ON CAMPUS</small>${state.clubs.length?state.clubs.map(id=>esc(D.clubs.find(c=>c.id===id).name)).join('<br>'):'Finding your people'}</div><div class="character-detail"><small>${currentJob?'CURRENT INTERNSHIP':'BEST INTERNSHIP'}</small>${currentJob?esc(currentJob.name):best?esc(D.employers.find(e=>e.id===best.id).name)+' · '+G.money(best.pay)+'/hr':'No work experience yet'}</div><div class="character-detail"><small>RETURN OFFERS</small>${state.returnOffers.length?state.returnOffers.map(id=>esc(D.employers.find(e=>e.id===id).name)).join('<br>'):'None yet'}</div><div class="character-foot">Fan-made career roulette.<br>Game odds, not admissions predictions.</div>`;
    previousStats=values;
  }
  function wheelMarkup(items,index=null) {
    const total=items.reduce((a,x)=>a+x.weight,0),employer=state.stage==='recruit-employer';let angle=0;
    const wedges=items.map((item,i)=>{const start=angle,end=angle+item.weight/total*360;angle=end;const polar=a=>[220+Math.sin(a*Math.PI/180)*201,220-Math.cos(a*Math.PI/180)*201];const a=polar(start),b=polar(end),mid=(start+end)/2,label=esc(item.short||item.label.toUpperCase());
      const path=end-start>=359.999?'<circle cx="220" cy="220" r="201"':`<path d="M220 220 L${a.join(' ')} A201 201 0 ${end-start>180?1:0} 1 ${b.join(' ')} Z"`;
      const textColor=item.tone==='gold'||item.tone==='neutral'?'#22231d':'#fff';
      return `${path} fill="${colors[item.tone]||colors.neutral}" stroke="#22231d" stroke-width="${employer?.2:1.2}"/><g transform="rotate(${mid} 220 220)"><text x="220" y="${employer?34:77}" ${employer?'transform="rotate(90 220 34)" text-anchor="start"':'text-anchor="middle"'} fill="${textColor}" style="font:800 ${employer?3.3:items.length>6?8:12}px ui-monospace,monospace;letter-spacing:.02em">${label}</text></g>`;
    }).join('');
    const rotation=index===null?0:landingAngle(items,index);
    return `<button id="spin-button" class="spinner wheel-spinner ${employer?'employer-spinner':''}" aria-label="Spin ${esc(stageTitles[state.stage])}" ${index!==null?'disabled':''}><span class="pointer" aria-hidden="true"></span><svg class="wheel-svg" viewBox="0 0 440 440" aria-hidden="true"><g class="wheel-disc" style="transform:rotate(${rotation}deg)"><circle cx="220" cy="220" r="215" fill="#edc85b" stroke="#22231d" stroke-width="6"/>${wedges}</g></svg><span class="wheel-hub">${index===null?'SPIN':'RESULT'}</span></button>`;
  }
  function landingAngle(items,index) {const total=items.reduce((a,x)=>a+x.weight,0),before=items.slice(0,index).reduce((a,x)=>a+x.weight,0);return (360-(before+items[index].weight/2)/total*360)%360;}
  function reelMarkup(items,index=null) {
    const initial=state.stage==='profile'?items.findIndex(x=>x.value===95):state.stage==='study-grade'?items.findIndex(x=>x.value===3.4):state.stage==='scholarship'?0:Math.min(2,items.length-1),row=index===null?items.length+initial:items.length*5+index;
    const rows=Array.from({length:items.length*7},(_,i)=>{const x=items[i%items.length];return `<span class="reel-row ${x.tone}" aria-hidden="true"><span>${esc(x.label)}</span>${x.caption?`<small>${esc(x.caption)}</small>`:''}</span>`}).join('');
    return `<button id="spin-button" class="spinner reel-spinner" aria-label="Roll ${esc(stageTitles[state.stage])}" data-row="${row}" ${index!==null?'disabled':''}><span class="reel-frame" style="display:block"><span class="reel-window" style="display:block"><span class="reel-track" style="display:block">${rows}</span><span class="reel-mask"></span><span class="reel-selection"></span></span></span><span class="reel-marker" aria-hidden="true"></span><span class="crank" aria-hidden="true"></span></button>`;
  }
  function positionReel() {const track=$('stage').querySelector('.reel-track');if(track){const height=track.querySelector('.reel-row').getBoundingClientRect().height;track.style.transform=`translateY(${(1-Number($('spin-button').dataset.row))*height}px)`;}}
  function card(id,name,detail,tag='CHOOSE',extras='') {return `<button class="choice-card" data-choice="${esc(id)}" ${extras}><span><strong>${esc(name)}</strong><small>${esc(detail)}</small></span><span class="tag">${tag}</span></button>`;}
  function choices(hint,content,actions='') {$('stage').innerHTML=`<div class="choices-stage"><p class="hint">${hint}</p>${content}${actions?`<div class="choice-actions">${actions}</div>`:''}</div>`;}
  function renderStage() {
    const items=state.stage==='intro'?G.spinOptions({...state,stage:'profile'}):G.spinOptions(state);
    if(items.length){const isReel=state.stage==='intro'||reelStages.has(state.stage),employer=state.stage==='recruit-employer';$('stage').innerHTML=`<div class="spin-stage ${employer?'employer-stage':''}">${employer?'<p class="employer-prompt">250 employers. Your stats give matching roles a little more weight.</p>':''}${isReel?reelMarkup(items,state.result?.index??null):wheelMarkup(items,state.result?.index??null)}</div>`;positionReel();$('spin-button').onclick=startSpin;return;}
    switch(state.stage){
      case 'applications': {
        const regular=D.programs.filter(p=>!['turing','csb','business'].includes(p.id)),honors=D.programs.filter(p=>['turing','csb','business'].includes(p.id));
        const group=(name,list)=>`<div class="group-title">${name}</div><div class="application-grid">${list.map(p=>card(p.id,p.code,p.name,state.applications.includes(p.id)?'SELECTED':'APPLY',`aria-pressed="${state.applications.includes(p.id)}" ${!state.applications.includes(p.id)&&state.applications.length===3?'disabled':''}`)).join('')}</div>`;
        choices('Pick up to three paths. In this game, honors paths receive a separate review.',group('MAJOR PATHS',regular)+group('HONORS PATHS',honors),`<button class="primary" id="submit-applications" ${state.applications.length?'':'disabled'}>SUBMIT ${state.applications.length}/3 APPLICATIONS →</button>`);
        $('stage').querySelectorAll('[data-choice]').forEach(b=>{if(state.applications.includes(b.dataset.choice))b.classList.add('selected');b.onclick=()=>act({type:'toggle-application',id:b.dataset.choice},false)});$('submit-applications').onclick=()=>act({type:'submit-applications'});break;
      }
      case 'program': {
        const chips=state.admissions.map(a=>`<span class="offer-chip ${a.offered?'':'bad'}">${D.programs.find(p=>p.id===a.id).code} · ${a.offered?'OFFER':'NO OFFER'}</span>`).join('');
        choices('Your offers are in. Pick the program you want to carry through the next four years.',`<div class="offer-chips">${chips}</div><div class="choice-grid">${state.admissions.filter(a=>a.offered).map(a=>{const p=D.programs.find(x=>x.id===a.id);return card(p.id,p.name,p.school,'ACCEPT')}).join('')}</div>`);bindChoices('choose-program');break;
      }
      case 'focus': choices('A little control over the trajectory. Choose what you want to build around.',`<div class="choice-grid">${D.focuses.map(f=>card(f.id,f.name,f.detail)).join('')}</div>`);bindChoices('choose-focus');break;
      case 'club': choices(`Find your first-year community. ${2-state.clubAttempts} ${state.clubAttempts?'retry':'applications'} available; an acceptance completes this step.`, `<div class="choice-grid">${D.clubs.filter(c=>!state.attemptedClubs.includes(c.id)).map(c=>card(c.id,c.name,c.detail,'APPLY')).join('')}</div>`,`<button class="secondary" id="skip-club">SKIP FOR NOW →</button>`);bindChoices('choose-club');$('skip-club').onclick=()=>act({type:'skip-club'});break;
      case 'offer': choices('Your interviews are complete. Compare the offers and choose the job you want.',`<div class="choice-grid">${state.offers.map(id=>{const e=D.employers.find(x=>x.id===id);return card(id,e.name,`${e.role} · ${e.city} · ${G.money(e.pay)}/hr`,'ACCEPT')}).join('')}</div>`);bindChoices('accept-job');break;
      case 'graduation': choices('Eight semesters later. Your next step is yours to choose.',`<div class="choice-grid">${card('return','Take a return offer',state.returnOffers.length?state.returnOffers.map(id=>D.employers.find(e=>e.id===id).name).join(', '):'No return offer in hand',state.returnOffers.length?'ACCEPT':'UNAVAILABLE',state.returnOffers.length?'':'disabled')}${card('grad','Graduate school','GPA and research shape the admission wheel.','APPLY')}${card('startup','Build something in Austin','Turn your product work and connections into a pitch.','PITCH')}${card('open','Open to work','Leave UT with a degree and keep the search going.','CHOOSE')}</div>`);bindChoices('choose-ending');break;
      case 'ending': renderEnding();break;
    }
  }
  function bindChoices(type){$('stage').querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>act({type,id:b.dataset.choice}));}
  function renderStrip() {
    const r=state.result||state.lastResult,strip=$('result-strip');strip.className='result-strip';
    if(state.stage==='ending'){strip.innerHTML='<div class="result-copy"><b>Run complete</b></div>';}
    else if(state.result){strip.classList.add(state.result.tone);strip.innerHTML=`<div class="result-copy"><b>${esc(r.title)}</b><small>${esc(r.detail)}</small></div><button id="continue-button" class="continue">CONTINUE →</button>`;$('continue-button').onclick=()=>act({type:'continue'});}
    else if(r){strip.classList.add(r.tone);strip.innerHTML=`<div class="result-copy"><b>${esc(r.title)}</b></div>`;}
    else strip.innerHTML=`<div class="result-copy"><b>${G.spinOptions(state).length||state.stage==='intro'?'Click above to spin':'Choose your path'}</b></div>`;
  }
  function render() {
    document.body.dataset.stage=state.stage;$('stage-title').textContent=stageTitles[state.stage]||'Longhorn Launch';$('stage-context').textContent=context();
    renderTimeline();renderCharacter();renderStage();renderStrip();$('stage').scrollTop=0;
    if(state.stage==='intro')showIntro();
  }
  function sound() {if(muted)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='triangle';oscillator.frequency.value=650;gain.gain.setValueAtTime(.025,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.035);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+.04)}catch{}}
  async function startSpin() {
    if(busy||state.result||state.stage==='intro')return;
    busy=true;const generation=++spinGeneration,pending=G.step(state,{type:'spin'}),r=pending.result;
    if(!r){busy=false;return;}
    const spinner=$('spin-button');spinner.disabled=true;spinner.setAttribute('aria-busy','true');
    $('result-strip').innerHTML='<div class="result-copy"><b>Rolling…</b></div>';const hub=spinner.querySelector('.wheel-hub');if(hub)hub.textContent='ROLLING';
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,isReel=reelStages.has(state.stage),duration=reduced?40:isReel?620:state.stage==='recruit-employer'?1800:2200,easing='cubic-bezier(.12,.68,.11,1)';
    sound();const tickTimer=setInterval(sound,isReel?120:250),ownAnimations=[];
    try {
      if(isReel){const track=spinner.querySelector('.reel-track'),height=track.querySelector('.reel-row').getBoundingClientRect().height,target=(1-(r.items.length*5+r.index))*height;ownAnimations.push(track.animate([{transform:track.style.transform},{transform:`translateY(${target}px)`}],{duration,easing,fill:'forwards'}));const crank=spinner.querySelector('.crank');ownAnimations.push(crank.animate([{transform:'rotate(0deg)'},{transform:'rotate(720deg)'}],{duration,easing,fill:'forwards'}));}
      else {const disc=spinner.querySelector('.wheel-disc');ownAnimations.push(disc.animate([{transform:'rotate(0deg)'},{transform:`rotate(${1800+landingAngle(r.items,r.index)}deg)`}],{duration,easing,fill:'forwards'}));}
      animations=ownAnimations;
      await Promise.all(ownAnimations.map(a=>a.finished.catch(()=>{})));
    } catch {/* An unavailable animation API still resolves the same selected result. */}
    finally {clearInterval(tickTimer);ownAnimations.forEach(a=>a.cancel());}
    if(generation!==spinGeneration)return;
    animations=[];busy=false;state=pending;save();render();$('announcement').textContent=r.title;$('continue-button')?.focus({preventScroll:true});
    autoAdvanceTimer=setTimeout(()=>{if(generation===spinGeneration&&state.result&&!$('dialog').open)act({type:'continue'});},reduced?400:1500);
  }
  function restart(seed) {clearTimeout(autoAdvanceTimer);spinGeneration++;animations.forEach(a=>a.cancel());animations=[];busy=false;if($('dialog').open)$('dialog').close();state=G.create(Number.isInteger(seed)?seed:freshSeed());state=G.step(state,{type:'begin'});try{const url=new URL(location.href);url.searchParams.set('seed',state.seed);history.replaceState(null,'',url);}catch{}previousStats=null;save();render();$('spin-button')?.focus({preventScroll:true});}
  function modal(title,body,extraClass='') {const dialog=$('dialog');dialog.className=extraClass;$('dialog-content').innerHTML=`<div class="dialog-heading"><h2 id="dialog-title">${esc(title)}</h2><button class="close" id="close-dialog" aria-label="Close dialog">×</button></div>${body}`;dialog.setAttribute('aria-labelledby','dialog-title');$('close-dialog').onclick=()=>dialog.close();if(!dialog.open)dialog.showModal();}
  function showIntro() {const dialog=$('dialog');dialog.className='intro-dialog';$('dialog-content').innerHTML='<span class="speaker">AUSTIN, TEXAS</span><h2>Four years.<br>Three summers.<br>One very unpredictable résumé.</h2><p>You’re headed to UT. The next four years could turn into a research paper, a dream job, a startup pitch, or an extremely good story.</p><p>Choose your path. Spin for everything you can’t control.</p><div class="choice-actions"><button class="primary" id="begin-button">BEGIN →</button></div>';dialog.setAttribute('aria-label','Welcome to Longhorn Launch');dialog.removeAttribute('aria-labelledby');dialog.oncancel=e=>{if(state.stage==='intro')e.preventDefault()};if(!dialog.open)dialog.showModal();$('begin-button').onclick=()=>{dialog.close();act({type:'begin'});};}
  function showLog(){modal('Your run so far',state.log.length?[...state.log].reverse().map(x=>`<div class="log-entry"><small>${esc(x.term)}</small><strong>${esc(x.title)}</strong><span>${esc(x.detail)}</span></div>`).join(''):'<p class="hint">Your story starts with the first spin.</p>');}
  function showHelp(){modal('How to play','<div class="help-copy"><p>Click the wheel or reel to spin. On a reel, the middle row between the red lines is the result. On a wheel, the red pointer marks the winning slice.</p><p>Wheel slices match the odds. A smaller green slice means a tougher offer. Your program and choices build the seven stats in the character sheet.</p><p>Pick up to three UT paths, then choose among your offers. Eight study semesters and three summers follow. Roll your interview count, then roll an employer from 250 companies and roles for each interview. Your stats gently favor roles that fit your profile. You choose among the job offers after all interviews finish.</p><p>GPA and research help graduate admission. Product work and leadership help a startup pitch. Good internship evaluations can earn return offers.</p><p>Each study semester charges $5,200 in game tuition. Internships pay for 12 weeks at 40 hours per week. Wages are simulated USD amounts. Integrity starts at three; losing all three ends the run.</p><p>Your progress saves automatically in this browser. NEW RUN gives you a fresh random seed. Copying a link shares the starting seed; the same choices reproduce the same outcomes. Space and Enter activate focused controls.</p></div>');}
  function showOutcomes(){
    const stored=read(RECORDS,[]),records=Array.isArray(stored)?stored:[];
    modal('Outcome statistics',`<p class="hint">${records.length} completed ${records.length===1?'run':'runs'} saved in this browser. Simulate the same rules with balanced applications, random employers, the highest-paying offer, then a return offer or graduate school.</p><button class="primary" id="simulate-button">SIMULATE 1,000 RUNS</button><div id="simulation-output"></div>`);
    $('simulate-button').onclick=async()=>{
      const button=$('simulate-button'),output=$('simulation-output'),counts={},seed=state.seed;let savings=0;
      button.disabled=true;
      for(let i=0;i<1000;i++){const r=G.autoPlay((seed+Math.imul(i+1,7919))>>>0);savings+=r.cash;counts[r.ending]=(counts[r.ending]||0)+1;if(i%20===0){button.textContent=`SIMULATING · ${i}/1,000`;await new Promise(resolve=>setTimeout(resolve,0));}}
      if(output.isConnected)output.innerHTML=`<div class="outcome-grid">${Object.entries(counts).map(([kind,count])=>`<div class="outcome-cell"><b>${(count/10).toFixed(1)}%</b><small>${esc(G.endingTitles[kind])}</small></div>`).join('')}</div><p class="hint">Average final savings: ${G.money(savings/1000)}. Your own choices can lead to different results.</p>`;
      button.textContent='SIMULATION COMPLETE';
    };
  }
  function renderEnding(){const p=G.currentProgram(state),ending=G.endingTitles[state.ending],detail={admission:'No offer this cycle. Another application mix may open a different door.',academic:'Your integrity points reached zero. The next run starts with a clean record.',return:'A team already knows your work and wants you back.',grad:'Your next chapter begins with a new research question.',startup:'Your Austin project found its first backers.','startup-fail':'Your first pitch didn’t land. You leave with a degree, a project, and a story.',open:'The degree is yours. The next opportunity is still out there.'}[state.ending];
    $('stage').innerHTML=`<div class="end-stage"><article id="end-card" class="end-card"><div class="eyebrow">${state.ending==='admission'?'APPLICATION CYCLE':state.ending==='academic'?'ACADEMIC ENDING':'GRADUATED'} · UT AUSTIN</div><h2>${esc(ending)}</h2><p>${esc(detail)}</p><div class="end-stats"><div><b>${state.gpa?state.gpa.toFixed(2):'—'}</b><small>FINAL GPA</small></div><div><b>${G.money(state.cash)}</b><small>SAVINGS</small></div><div><b>${state.jobs.length}</b><small>INTERNSHIPS</small></div><div><b>${state.integrity}/3</b><small>INTEGRITY</small></div></div><p>${esc(p?.name||'No program accepted')}<br>${esc(state.scholarship||'No scholarship')}</p><ul class="job-list">${state.jobs.map(j=>{const e=D.employers.find(x=>x.id===j.id);return `<li>SUMMER ${j.summer} · ${esc(e.name)} · ${G.money(j.pay)}/hr<br>${esc(j.evaluation||'')} · ${esc(e.city)}</li>`}).join('')||'<li>No internship placements this run.</li>'}</ul><div class="end-signature">Longhorn Launch<small>SEED ${state.seed} · ${state.academicTerms}/8 SEMESTERS</small></div></article><div class="end-actions"><button class="primary" id="new-run-button">NEW RUN</button><button class="secondary" id="export-button">SAVE RESULT IMAGE</button><button class="secondary" id="ending-outcomes-button">OUTCOMES</button></div></div>`;$('new-run-button').onclick=restart;$('export-button').onclick=exportResult;$('ending-outcomes-button').onclick=showOutcomes;
  }
  async function copyLink(){const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('seed',state.seed);try{await navigator.clipboard.writeText(url.href);$('copy-button').textContent='COPIED';setTimeout(()=>$('copy-button').textContent='COPY LINK',1500);}catch{modal('Your run link',`<p class="hint">Copy this link to share the starting seed.</p><input id="run-link" aria-label="Run link" readonly style="width:100%;padding:12px" value="${esc(url.href)}">`);$('run-link').select();}}
  function exportResult(){const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=650+state.jobs.length*82;const c=canvas.getContext('2d');c.fillStyle='#22231d';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='#bf5700';c.fillRect(0,0,canvas.width,12);c.fillStyle='#edc85b';c.font='bold 40px Arial';c.fillText('Longhorn Launch',50,73);c.font='bold 35px Arial';c.fillText(G.endingTitles[state.ending],50,155);c.fillStyle='#eee9dc';c.font='20px monospace';c.fillText(G.currentProgram(state)?.name||'No program accepted',50,205);c.fillText(`GPA ${state.gpa.toFixed(2)}  ·  Savings ${G.money(state.cash)}`,50,270);c.fillText(`${state.jobs.length} internships  ·  Integrity ${state.integrity}/3`,50,315);c.fillText(state.scholarship||'No scholarship',50,360);state.jobs.forEach((j,i)=>{const e=D.employers.find(x=>x.id===j.id);c.font='20px monospace';c.fillText(`Summer ${j.summer}: ${e.name} · ${G.money(j.pay)}/hr`,50,425+i*82);c.font='15px monospace';c.fillText(`${e.role} · ${e.city}`,50,451+i*82);});c.fillStyle='#aaa89e';c.font='16px monospace';c.fillText(`Seed ${state.seed} · ${state.academicTerms}/8 semesters`,50,canvas.height-55);canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);modal('Your result image',`<img src="${url}" alt="Your complete Longhorn Launch result card" style="display:block;width:100%;height:auto"><div class="choice-actions"><a class="image-download" href="${url}" download="longhorn-launch-${state.seed}.png">DOWNLOAD PNG</a></div><p class="hint" style="margin-top:12px">You can also save the image using your browser’s image menu.</p>`);$('dialog').addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});});}
  $('restart-button').onclick=restart;$('copy-button').onclick=copyLink;$('log-button').onclick=showLog;$('help-button').onclick=showHelp;$('outcomes-button').onclick=showOutcomes;
  $('mute-button').textContent=muted?'SOUND OFF':'SOUND ON';$('mute-button').setAttribute('aria-pressed',String(muted));$('mute-button').onclick=()=>{muted=!muted;write('longhorn-launch-muted',muted);$('mute-button').textContent=muted?'SOUND OFF':'SOUND ON';$('mute-button').setAttribute('aria-pressed',String(muted));sound();};
  document.querySelector('.wordmark').onclick=e=>{e.preventDefault();showHelp();};
  $('dialog').addEventListener('click',e=>{if(state.stage==='intro'||e.target!==$('dialog'))return;const r=$('dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('dialog').close();});
  window.addEventListener('resize',()=>{if(!busy)positionReel();});
  render();
})();
