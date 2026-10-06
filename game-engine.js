(function (root) {
  'use strict';
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const money = n => `${n < 0 ? '-' : ''}$${Math.abs(Math.round(n)).toLocaleString('en-US')}`;
  const statNames = ['Systems', 'Product', 'AI / Data', 'Quant', 'Hardware', 'Leadership', 'Resilience'];
  const programs = [
    {id:'cs',code:'CS',name:'Computer Science',school:'Natural Sciences',median:93,stats:[35,27,34,25,12,12,18],detail:'Software, systems, and AI.'},
    {id:'turing',code:'TURING',name:'Turing Scholars',school:'CS Honors',median:98,stats:[42,24,48,35,14,18,20],detail:'A research-intensive CS honors path.'},
    {id:'csb',code:'CSB',name:'Texas CSB',school:'CS + Business Honors',median:97,stats:[39,44,38,31,12,22,19],detail:'Computer science meets business honors.'},
    {id:'ece',code:'ECE',name:'Electrical & Computer Engineering',school:'Cockrell',median:94,stats:[37,22,30,20,45,14,19],detail:'Circuits, embedded software, and systems.'},
    {id:'math',code:'MATH',name:'Mathematics',school:'Natural Sciences',median:92,stats:[22,18,31,43,10,11,21],detail:'Proof, probability, and optimization.'},
    {id:'stats',code:'SDS',name:'Statistics & Data Science',school:'Natural Sciences',median:93,stats:[25,19,46,38,9,12,22],detail:'Inference, models, and data.'},
    {id:'business',code:'BHP',name:'Canfield Business Honors',school:'McCombs',median:95,stats:[17,45,22,43,8,28,20],detail:'Finance, strategy, and a strong network.'},
    {id:'eng',code:'COE',name:'Computational Engineering',school:'Cockrell',median:92,stats:[34,20,39,32,28,12,22],detail:'Simulation and scientific computing.'}
  ];
  const employers = typeof module!=='undefined'&&module.exports?require('./company-data.js'):root.LonghornCompanies;
  const clubs = [
    {id:'fri',name:'Freshman Research Initiative',detail:'Faculty-guided research and a mentor.',boost:[2,0,5,1,0,1,2],chance:.57},
    {id:'convergent',name:'Texas Convergent',detail:'Product teams that ship for real users.',boost:[2,6,2,0,0,3,1],chance:.62},
    {id:'rocketry',name:'Longhorn Rocketry',detail:'Hardware, controls, and simulation.',boost:[5,2,1,0,6,2,1],chance:.52},
    {id:'qfc',name:'Quantitative Finance Club',detail:'Markets, probability, and interview prep.',boost:[2,0,1,7,0,1,1],chance:.42},
    {id:'blazers',name:'Texas Blazers',detail:'Leadership, service, and campus connections.',boost:[0,3,0,0,0,7,4],chance:.68},
    {id:'ieee',name:'IEEE at UT',detail:'Engineering projects and technical peers.',boost:[4,3,2,1,4,2,1],chance:.80}
  ];
  const focuses = [
    {id:'research',name:'Research + FRI',detail:'Follow an interesting question into a lab.',boost:[2,0,8,1,0,2,2]},
    {id:'product',name:'Product + projects',detail:'Make things that people actually use.',boost:[4,7,2,0,0,2,1]},
    {id:'quant',name:'Algorithms + markets',detail:'Go deep on algorithms and probability.',boost:[4,0,1,8,0,1,2]},
    {id:'grades',name:'Protect the transcript',detail:'Keep the academics and your energy steady.',boost:[0,0,1,1,0,1,7]}
  ];
  const events = [
    {label:'A normal week',short:'NORMAL WEEK',detail:'No drama. A little breathing room goes a long way.',weight:28,tone:'neutral',boost:[0,0,0,0,0,0,1],cash:0},
    {label:'Great study group',short:'STUDY GROUP',detail:'You find people who make the hardest class bearable.',weight:13,tone:'good',boost:[0,0,0,0,0,1,5],cash:0},
    {label:'Hackathon weekend',short:'HACKATHON',detail:'You ship a messy prototype and have something to show for it.',weight:9,tone:'good',boost:[3,4,3,0,0,0,0],cash:-80},
    {label:'Research door opens',short:'RESEARCH',detail:'A professor invites you onto a project.',weight:7,tone:'good',boost:[2,0,5,1,0,1,1],cash:0},
    {label:'Austin rent jumps',short:'RENT JUMP',detail:'Your housing budget takes an unexpected hit.',weight:9,tone:'bad',boost:[0,0,0,0,0,0,-1],cash:-900},
    {label:'You overcommit',short:'OVERCOMMITTED',detail:'Three deadlines. Two club meetings. One exhausted Longhorn.',weight:9,tone:'bad',boost:[0,0,0,0,0,-2,-4],cash:0},
    {label:'Integrity violation',short:'INTEGRITY',detail:'An academic integrity violation costs one integrity point.',weight:3,tone:'bad',boost:[0,0,0,0,0,0,-8],cash:0,integrity:-1},
    {label:'Longhorn luck',short:'LONGHORN LUCK',detail:'An unexpected connection and a small award come through.',weight:5,tone:'gold',boost:[1,1,1,1,1,1,4],cash:500}
  ];
  const workEvents = [
    {label:'Shipped a feature',short:'SHIPPED IT',weight:26,tone:'good',detail:'Your work makes it into the release.',boost:[2,2,1,0,0,1,0],evaluation:1},
    {label:'Found a great mentor',short:'GREAT MENTOR',weight:18,tone:'good',detail:'Someone takes the time to teach you properly.',boost:[1,0,3,1,0,2,2],evaluation:1},
    {label:'Production incident',short:'INCIDENT',weight:15,tone:'gold',detail:'You learn an unforgettable lesson about deploying on Friday.',boost:[2,0,0,0,0,0,3],evaluation:-1},
    {label:'Forgotten by your manager',short:'NO MANAGER',weight:12,tone:'bad',detail:'You spend too much of the summer waiting for a task.',boost:[0,0,0,0,0,0,-2],evaluation:-1},
    {label:'Team ships on time',short:'TEAM WIN',weight:22,tone:'good',detail:'A good team makes your work better.',boost:[0,2,0,0,0,3,1],evaluation:1},
    {label:'Laid off in a reorg',short:'REORG',weight:7,tone:'bad',detail:'The team is cut. You keep the experience, but lose the return-offer route.',boost:[-1,0,0,0,0,0,-5],evaluation:-2,laidOff:true}
  ];
  const scholarships = [
    {label:'No scholarship',weight:58,tone:'neutral',cash:0,boost:0},
    {label:'Department award',weight:22,tone:'good',cash:4500,boost:1},
    {label:'Texas Excellence award',weight:12,tone:'good',cash:11000,boost:2},
    {label:'Forty Acres finalist',weight:2,tone:'gold',cash:30000,boost:5}
  ];
  const evaluations = [
    {label:'Outstanding',weight:8,tone:'gold',boost:8}, {label:'Excellent',weight:20,tone:'good',boost:5},
    {label:'Very good',weight:31,tone:'good',boost:3}, {label:'Good',weight:27,tone:'neutral',boost:1},
    {label:'Needs work',weight:11,tone:'bad',boost:-3}, {label:'Unsatisfactory',weight:3,tone:'bad',boost:-7}
  ];
  const terms = [
    {label:'Fall 1',code:'F1',kind:'study'}, {label:'Spring 1',code:'S1',kind:'study'}, {label:'Summer 1',code:'I1',kind:'work'},
    {label:'Fall 2',code:'F2',kind:'study'}, {label:'Spring 2',code:'S2',kind:'study'}, {label:'Summer 2',code:'I2',kind:'work'},
    {label:'Fall 3',code:'F3',kind:'study'}, {label:'Spring 3',code:'S3',kind:'study'}, {label:'Summer 3',code:'I3',kind:'work'},
    {label:'Fall 4',code:'F4',kind:'study'}, {label:'Spring 4',code:'S4',kind:'study'}
  ];
  const endingTitles = {admission:'A different route to Austin.',academic:'The transcript catches up.',return:'A job with your name on it.',grad:'One more big question.',startup:'You built your own next step.','startup-fail':'The pitch needs another draft.',open:'Graduated. Open to what comes next.'};
  function create(seed) {
    return {version:4,seed:seed>>>0,rng:seed>>>0,stage:'intro',hs:0,applications:[],admissions:[],admissionIndex:0,
      program:null,focus:null,scholarship:null,term:0,summer:0,academicTerms:0,termAverage:0,gpa:0,integrity:3,cash:0,
      stats:Array(7).fill(0),clubs:[],clubAttempts:0,attemptedClubs:[],target:null,attemptedEmployers:[],interviews:0,totalInterviews:0,
      offers:[],jobs:[],returnOffers:[],job:null,workEvent:null,evaluation:null,result:null,lastResult:null,log:[],choices:[],finished:false,ending:null};
  }
  function rand(s) { s.rng = (Math.imul(s.rng,1664525)+1013904223)>>>0; return s.rng/4294967296; }
  function sample(s, items) { let r=rand(s)*items.reduce((n,x)=>n+x.weight,0);for(let i=0;i<items.length;i++){r-=items[i].weight;if(r<0)return i}return items.length-1; }
  function addStats(s, d) { s.stats=s.stats.map((v,i)=>clamp(v+(d[i]||0),0,100)); }
  function log(s, title, detail) {const phase=!s.program?'Admission':['focus','scholarship','club','club-result'].includes(s.stage)?'Before first year':terms[s.term]?.label||'Graduation';s.log.push({term:phase,title,detail});}
  function admissionChance(s,p) { return clamp(.16+(s.hs-p.median)*.075,.08,.88); }
  function roleFit(s,e) {const weights=e.axes.map((_,i)=>i===0?2:1);return e.axes.reduce((n,a,i)=>n+s.stats[a]*weights[i],0)/weights.reduce((n,w)=>n+w,0);}
  function employerWeight(s,e) {return (1.2-e.prestige*.055)*(1+roleFit(s,e)/180)*(/, TX$/.test(e.city)?1.10:1);}
  function interviewChance(s,e) {return clamp(.78-e.difficulty*.065+(roleFit(s,e)-35)*.003+(s.gpa-3)*.04+s.jobs.length*.035,.04,.92);}
  function binary(chance, yes='Offer', no='No offer') {return [{label:yes,short:yes.toUpperCase(),weight:chance,tone:'good',success:true},{label:no,short:no.toUpperCase(),weight:1-chance,tone:'bad',success:false}];}
  function currentProgram(s) { return programs.find(p=>p.id===s.program); }
  function spinOptions(s) {
    if(s.result)return s.result.items;
    switch(s.stage) {
      case 'profile': return Array.from({length:13},(_,i)=>({label:`${i+88}%`,value:i+88,weight:Math.exp(-Math.pow((i+88-95)/3.4,2)/2),tone:'neutral'}));
      case 'admissions': return binary(admissionChance(s,programs.find(p=>p.id===s.applications[s.admissionIndex])));
      case 'scholarship': return scholarships;
      case 'club-result': {const c=clubs.find(x=>x.id===s.target);return binary(clamp(c.chance+s.stats[5]*.003,.18,.93),'Accepted','Not selected');}
      case 'study-grade': return Array.from({length:21},(_,i)=>{const value=(20+i)/10,center=s.focus==='grades'?3.55:3.35;return {label:value.toFixed(2),caption:value<2.5?'A rough term':value<3.2?'Held it together':value<3.7?'Solid work':'Dean’s list energy',value,weight:Math.exp(-Math.pow((value-center)/.48,2)/2),tone:value<2.5?'bad':value>=3.7?'good':'neutral'};});
      case 'study-event': return events;
      case 'recruit-count': {const center=clamp(.5+s.stats[0]/25+s.stats[5]/32+s.jobs.length*.5+(s.gpa-3)*.5,0,4.5);return Array.from({length:6},(_,i)=>({label:String(i),caption:i===1?'Interview':'Interviews',value:i,weight:Math.exp(-Math.pow((i-center)/1.2,2)/2),tone:i?'neutral':'bad'}));}
      case 'recruit-employer': return employers.filter(e=>!s.attemptedEmployers.includes(e.id)).map(e=>({id:e.id,label:e.name,caption:e.role,short:e.name,weight:employerWeight(s,e),tone:e.prestige>=9?'gold':e.prestige>=6?'good':e.survival?'neutral':'bad'}));
      case 'interview': return binary(interviewChance(s,employers.find(e=>e.id===s.target)));
      case 'work-event': return workEvents;
      case 'evaluation': return evaluations.map((x,i)=>({...x,weight:x.weight*Math.exp((s.workEvent?.evaluation||0)*(2.5-i)*.16)}));
      case 'return-offer': return binary(clamp(.25+s.evaluation.boost*.035+s.jobs.length*.045,.12,.85),'Return offer','No return offer');
      case 'summer-alt': return [
        {label:'Research assistant',short:'RESEARCH',weight:22,tone:'good',detail:'A professor has a small project you can help with.',cash:3200,boost:[1,0,4,1,0,1,1]},
        {label:'Campus summer job',short:'CAMPUS JOB',weight:25,tone:'neutral',detail:'Not the job you imagined, but the paycheck helps.',cash:5400,boost:[0,1,0,0,0,2,2]},
        {label:'Build a side project',short:'SIDE PROJECT',weight:28,tone:'gold',detail:'You make something worth talking about in the next interview.',cash:0,boost:[3,4,2,0,0,1,2]},
        {label:'A summer to reset',short:'RESET',weight:25,tone:'neutral',detail:'You rest, regroup, and get ready for another year.',cash:-800,boost:[0,0,0,0,0,0,6]}
      ];
      case 'grad-spin': return binary(clamp(.12+s.gpa*.13+s.stats[2]*.003,.08,.86),'Admitted','No admission');
      case 'startup-spin': return binary(clamp(.08+s.stats[1]*.004+s.stats[5]*.003,.08,.62),'Funded','Not funded');
      default: return [];
    }
  }
  function advance(s) {
    const term=s.term+1;
    if(term>=terms.length)return {next:'graduation',after:{term:terms.length}};
    if(terms[term].kind==='work')return {next:'recruit-count',after:{term,summer:s.summer+1,offers:[],job:null,workEvent:null,evaluation:null,attemptedEmployers:[],interviews:0}};
    return {next:'study-grade',after:{term,job:null,offers:[]}};
  }
  function result(s, items, index, title, detail, tone, next, after={}) {
    s.result={items,index,title,detail,tone,next,after};s.lastResult={title,detail,tone};log(s,title,detail);return s;
  }
  function finish(s,kind) {s.ending=kind;s.finished=true;s.stage='ending';log(s,endingTitles[kind],'Run complete.');return s;}
  function spin(s) {
    const items=spinOptions(s);if(!items.length)return s;
    const i=sample(s,items),item=items[i];let next,after={};
    switch(s.stage) {
      case 'profile': s.hs=item.value;return result(s,items,i,`${s.hs}% high-school average`,'Your starting profile is set. Choose your UT paths.',item.tone,'applications');
      case 'admissions': {const p=programs.find(x=>x.id===s.applications[s.admissionIndex]);s.admissions.push({id:p.id,offered:item.success});s.admissionIndex++;next=s.admissionIndex<s.applications.length?'admissions':s.admissions.some(x=>x.offered)?'program':'ending';return result(s,items,i,`${p.code}: ${item.label}`,item.success?`${p.name} made you an offer.`:`${p.name} did not make an offer this cycle.`,item.tone,next,next==='ending'?{finished:true,ending:'admission'}:{});}
      case 'scholarship': s.scholarship=item.label;s.cash+=item.cash;addStats(s,Array(7).fill(item.boost));return result(s,items,i,item.label,item.cash?`${money(item.cash)} added to your savings.`:'No entrance award this time.',item.tone,'club');
      case 'club-result': {const c=clubs.find(x=>x.id===s.target);s.clubAttempts++;s.attemptedClubs.push(c.id);if(item.success){s.clubs.push(c.id);addStats(s,c.boost);}return result(s,items,i,`${c.name}: ${item.label}`,item.success?c.detail:'You can try another organization or move on.',item.tone,item.success||s.clubAttempts>=2?'study-grade':'club');}
      case 'study-grade': s.termAverage=item.value;s.gpa=(s.gpa*s.academicTerms+item.value)/(s.academicTerms+1);s.academicTerms++;s.cash-=5200;addStats(s,[item.value>=3.5?1:0,0,item.value>=3.7?2:0,item.value>=3.7?1:0,0,0,item.value<2.5?-3:2]);return result(s,items,i,`${item.label} semester GPA`,`${item.caption} · Cumulative ${s.gpa.toFixed(2)} · ${money(5200)} tuition.`,item.tone,'study-event');
      case 'study-event': addStats(s,item.boost);s.cash+=item.cash;s.integrity+=item.integrity||0;({next,after}=s.integrity<=0?{next:'ending',after:{finished:true,ending:'academic'}}:advance(s));return result(s,items,i,item.label,item.detail+(item.cash?` Savings ${item.cash>0?'+':''}${money(item.cash)}.`:''),item.tone,next,after);
      case 'recruit-count': s.interviews=item.value;s.totalInterviews=item.value;return result(s,items,i,`${item.value} ${item.value===1?'interview':'interviews'}`,item.value?'Spin the employer wheel to see who calls.':'The search was quiet. The summer still has possibilities.',item.tone,item.value?'recruit-employer':'summer-alt');
      case 'recruit-employer': {const e=employers.find(x=>x.id===item.id);s.target=e.id;s.attemptedEmployers.push(e.id);return result(s,items,i,e.name,`${e.role} · ${e.city} · ${money(e.pay)}/hour`,item.tone,'interview');}
      case 'interview': {const e=employers.find(x=>x.id===s.target);s.interviews--;if(item.success)s.offers.push(e.id);next=s.interviews?'recruit-employer':s.offers.length?'offer':'summer-alt';return result(s,items,i,`${e.name}: ${item.label}`,item.success?`${e.role} · ${money(e.pay)}/hour · ${e.city}`:`${s.interviews} ${s.interviews===1?'interview remains':'interviews remain'}.`,item.tone,next);}
      case 'work-event': s.workEvent=item;addStats(s,item.boost);return result(s,items,i,item.label,item.detail,item.tone,'evaluation');
      case 'evaluation': s.evaluation=item;addStats(s,Array(7).fill(item.boost));s.jobs[s.jobs.length-1].evaluation=item.label;({next,after}=item.boost>0&&!s.workEvent?.laidOff?{next:'return-offer',after:{}}:advance(s));return result(s,items,i,item.label,s.workEvent?.laidOff?'The reorg closes the return-offer route.':item.boost>0?'A good evaluation opens a return-offer chance.':'You take the experience into the next year.',item.tone,next,after);
      case 'return-offer': if(item.success&&!s.returnOffers.includes(s.job))s.returnOffers.push(s.job);({next,after}=advance(s));return result(s,items,i,item.label,item.success?'Keep this offer in your pocket until graduation.':'The experience still strengthens your next application.',item.tone,next,after);
      case 'summer-alt': s.cash+=item.cash;addStats(s,item.boost);({next,after}=advance(s));return result(s,items,i,item.label,item.detail,item.tone,next,after);
      case 'grad-spin': return result(s,items,i,item.label,item.success?'A graduate program is your next chapter.':'You leave UT with a degree and a new search ahead.',item.tone,'ending',{finished:true,ending:item.success?'grad':'open'});
      case 'startup-spin': if(item.success)s.cash+=25000;return result(s,items,i,item.label,item.success?'Your Austin project earns its first funding.':'The pitch didn’t land. You still own the work.',item.tone,'ending',{finished:true,ending:item.success?'startup':'startup-fail'});
      default: return s;
    }
  }
  function step(previous, action) {
    const s=JSON.parse(JSON.stringify(previous));
    if(action.type==='continue'&&s.result){const r=s.result;s.result=null;Object.assign(s,r.after);s.stage=r.next;return s;}
    if(s.result||s.finished)return s;
    if(action.type==='spin')return spin(s);
    const record=()=>s.choices.push({...action});
    switch(action.type) {
      case 'begin': if(s.stage==='intro')s.stage='profile';break;
      case 'toggle-application': if(s.stage==='applications'&&programs.some(p=>p.id===action.id)){if(s.applications.includes(action.id)){record();s.applications=s.applications.filter(x=>x!==action.id);}else if(s.applications.length<3){record();s.applications.push(action.id);}}break;
      case 'submit-applications': if(s.stage==='applications'&&s.applications.length){record();s.stage='admissions';}break;
      case 'choose-program': if(s.stage==='program'&&s.admissions.some(x=>x.id===action.id&&x.offered)){record();s.program=action.id;s.stats=[...currentProgram(s).stats];s.stage='focus';log(s,'Program accepted',currentProgram(s).name);}break;
      case 'choose-focus': {const f=focuses.find(x=>x.id===action.id);if(s.stage==='focus'&&f){record();s.focus=f.id;addStats(s,f.boost);s.stage='scholarship';log(s,'First-year direction',f.name);}break;}
      case 'choose-club': if(s.stage==='club'&&clubs.some(x=>x.id===action.id)&&!s.attemptedClubs.includes(action.id)){record();s.target=action.id;s.stage='club-result';}break;
      case 'skip-club': if(s.stage==='club'){record();s.stage='study-grade';}break;
      case 'accept-job': if(s.stage==='offer'&&s.offers.includes(action.id)&&employers.some(x=>x.id===action.id)){record();const e=employers.find(x=>x.id===action.id);s.job=e.id;s.offers=[];s.jobs.push({id:e.id,summer:s.summer,pay:e.pay,earnings:e.pay*480,evaluation:null});s.cash+=e.pay*480;addStats(s,e.boost);s.stage='work-event';log(s,'Internship accepted',`${e.name} · ${money(e.pay*480)} over 12 weeks.`);}break;
      case 'choose-ending': if(s.stage==='graduation'){record();if(action.id==='return'&&s.returnOffers.length)finish(s,'return');else if(action.id==='grad')s.stage='grad-spin';else if(action.id==='startup')s.stage='startup-spin';else if(action.id==='open')finish(s,'open');}break;
    }
    return s;
  }
  function autoPlay(seed) {
    let s=create(seed),guard=0;s=step(s,{type:'begin'});
    while(!s.finished&&guard++<220){let a;
      if(s.result)a={type:'continue'};
      else if(spinOptions(s).length)a={type:'spin'};
      else switch(s.stage){
        case 'applications': for(const id of ['cs','ece','math'])s=step(s,{type:'toggle-application',id});a={type:'submit-applications'};break;
        case 'program': a={type:'choose-program',id:s.admissions.find(x=>x.offered).id};break;
        case 'focus': a={type:'choose-focus',id:'product'};break;
        case 'club': a={type:'skip-club'};break;
        case 'offer': a={type:'accept-job',id:[...s.offers].sort((a,b)=>employers.find(e=>e.id===b).pay-employers.find(e=>e.id===a).pay)[0]};break;
        case 'graduation': a={type:'choose-ending',id:s.returnOffers.length?'return':'grad'};break;
        default: throw new Error(`Unreachable stage: ${s.stage}`);
      }
      s=step(s,a);
    }
    if(!s.finished)throw new Error('Run did not finish');return s;
  }
  function isValidState(s,checkResult=true) {
    try {
      const stages=['intro','profile','applications','admissions','program','focus','scholarship','club','club-result','study-grade','study-event','recruit-count','recruit-employer','interview','offer','work-event','evaluation','return-offer','summer-alt','graduation','grad-spin','startup-spin','ending'];
      if(!s||s.version!==4||!stages.includes(s.stage)||typeof s.finished!=='boolean'||s.finished!==(s.stage==='ending'))return false;
      if(Object.keys(create(0)).some(k=>!Object.hasOwn(s,k)))return false;
      const finite=['seed','rng','hs','term','summer','academicTerms','termAverage','gpa','integrity','cash','clubAttempts','interviews','totalInterviews','admissionIndex'];
      if(finite.some(k=>!Number.isFinite(s[k])))return false;
      if(!Number.isInteger(s.seed)||s.seed<0||s.seed>4294967295||!Number.isInteger(s.rng)||s.rng<0||s.rng>4294967295)return false;
      if(!Number.isInteger(s.term)||s.term<0||s.term>terms.length||s.academicTerms<0||s.academicTerms>8||s.summer<0||s.summer>3||s.gpa<0||s.gpa>4||s.integrity<0||s.integrity>3||s.interviews<0||s.interviews>5)return false;
      if(!Array.isArray(s.stats)||s.stats.length!==7||!s.stats.every(v=>Number.isFinite(v)&&v>=0&&v<=100))return false;
      const ids=(list,table)=>Array.isArray(list)&&list.every(id=>table.some(x=>x.id===id));
      if(!ids(s.applications,programs)||s.applications.length>3||!ids(s.clubs,clubs)||!ids(s.attemptedClubs,clubs)||!ids(s.offers,employers)||!ids(s.returnOffers,employers)||!ids(s.attemptedEmployers,employers))return false;
      if(s.program!==null&&!programs.some(p=>p.id===s.program)||s.job!==null&&!employers.some(e=>e.id===s.job))return false;
      if(s.focus!==null&&!focuses.some(f=>f.id===s.focus))return false;
      if(!Array.isArray(s.admissions)||!s.admissions.every(a=>programs.some(p=>p.id===a.id)&&typeof a.offered==='boolean')||s.admissionIndex<0||s.admissionIndex>s.applications.length)return false;
      if(!Array.isArray(s.jobs)||!s.jobs.every(j=>employers.some(e=>e.id===j.id)&&Number.isInteger(j.summer)&&j.summer>=1&&j.summer<=3&&Number.isFinite(j.pay)&&Number.isFinite(j.earnings)))return false;
      if(!Array.isArray(s.choices)||!s.choices.every(a=>a&&typeof a.type==='string')||!Array.isArray(s.log)||!s.log.every(l=>l&&typeof l.title==='string'&&typeof l.detail==='string'&&typeof l.term==='string'))return false;
      if(s.finished&&!Object.hasOwn(endingTitles,s.ending))return false;
      const tones=['good','bad','gold','neutral'];
      if(s.lastResult&&(typeof s.lastResult.title!=='string'||typeof s.lastResult.detail!=='string'||!tones.includes(s.lastResult.tone)))return false;
      if(!['intro','profile','applications','admissions','program','ending'].includes(s.stage)&&!s.program)return false;
      if(s.stage==='program'&&!s.admissions.some(a=>a.offered))return false;
      if(['club-result'].includes(s.stage)&&!clubs.some(c=>c.id===s.target)||s.stage==='interview'&&!employers.some(e=>e.id===s.target))return false;
      if(['work-event','evaluation','return-offer'].includes(s.stage)&&!s.job)return false;
      if(s.stage==='return-offer'&&(!s.evaluation||!Number.isFinite(s.evaluation.boost)))return false;
      if(s.stage==='admissions'&&!s.result&&s.admissionIndex>=s.applications.length)return false;
      if(s.result&&checkResult){const r=s.result;if(!Array.isArray(r.items)||!r.items.length||!r.items.every(i=>typeof i.label==='string'&&Number.isFinite(i.weight)&&i.weight>0&&tones.includes(i.tone))||!Number.isInteger(r.index)||r.index<0||r.index>=r.items.length||typeof r.title!=='string'||typeof r.detail!=='string'||!tones.includes(r.tone)||!stages.includes(r.next)||!r.after||typeof r.after!=='object')return false;const allowed=['term','summer','offers','job','workEvent','evaluation','attemptedEmployers','interviews','finished','ending'];if(Object.keys(r.after).some(k=>!allowed.includes(k)))return false;return isValidState({...s,...r.after,result:null,stage:r.next},false);}
      return true;
    } catch {return false;}
  }
  const Game={create,step,spinOptions,autoPlay,isValidState,admissionChance,employerWeight,roleFit,interviewChance,currentProgram,money,endingTitles,data:{programs,employers,clubs,focuses,events,workEvents,scholarships,evaluations,terms,statNames}};
  if(typeof module!=='undefined'&&module.exports)module.exports=Game;
  root.LonghornGame=Game;
})(typeof window==='undefined'?globalThis:window);
