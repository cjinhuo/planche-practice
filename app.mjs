import {STAGES,EXERCISES,SETTINGS,LABELS,normaliseSettings,getSession,startSession,dayKind} from './plan.mjs';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const assetPath=name=>window.__PLANCHE_ASSETS__?.[name]||'assets/'+name;
const KEY='planche-thirty-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
let settings=normaliseSettings(saved.settings||SETTINGS),journal=saved.journal&&typeof saved.journal==='object'?saved.journal:{};
let selectedDay=Number.isInteger(saved.selectedDay)&&saved.selectedDay>=1&&saved.selectedDay<=30?saved.selectedDay:1;
let view='today',filter='all',toastHandle,saveHandle;
let timer={duration:150,remaining:150,running:false,end:0,label:'组间休息'},timerHandle;

function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastHandle);toastHandle=setTimeout(()=>$('#toast').classList.remove('visible'),3500)}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({settings,journal,selectedDay}));$('#save-hint').textContent='已保存在此浏览器'}catch{$('#save-hint').textContent='浏览器无法保存，请导出记录备份'}}
function selectedSession(){return journal[selectedDay]?.session||getSession(selectedDay,settings)}
function ensureStarted(){journal=startSession(journal,selectedDay,settings);return journal[selectedDay]}
function countDone(){return Object.values(journal).filter(x=>x.complete).length}
function updateProgress(){const n=countDone();$('#sidebar-count').textContent=`${n} / 30`;$('#sidebar-progress').style.width=`${n/30*100}%`;$('#completed-stat').innerHTML=`${String(n).padStart(2,'0')}<small>/ 30</small>`}
function renderDayStrip(){
 $('#day-strip').innerHTML=Array.from({length:30},(_,i)=>{const d=i+1,k=journal[d]?.session?.kind||dayKind(d);return `<button class="day-pill ${d===selectedDay?'selected':''} ${journal[d]?.complete?'done':''}" data-day="${d}" aria-label="第${d}天 ${LABELS[k]}" ${d===selectedDay?'aria-current="date"':''}><small>DAY</small><strong>${String(d).padStart(2,'0')}</strong><span>${k==='A'?'A · 专项':k==='B'?'B · 力量':k==='C'?'C · 腿核心':k==='D'?'D · 轻辅助':LABELS[k]}</span></button>`}).join('');
}
function dose(ex){return `<div class="dose"><strong>${ex.sets}</strong><small>组</small><span class="multiply">×</span><strong>${ex.target}</strong><small>${ex.unit}</small></div>`}
function renderExercise(ex,index){
 const records=journal[selectedDay]?.sets?.[ex.id]||{};
 const rest=['C','D','prep'].includes(selectedSession().kind)||ex.id==='scap'?60:150;
 const sets=Array.from({length:ex.sets},(_,i)=>{const record=records[i];return `<div class="set-box ${record?.done?'complete':''}"><button class="set-toggle" data-check="${ex.id}" data-index="${i}" aria-pressed="${!!record?.done}" aria-label="${esc(ex.name)} 第${i+1}组 ${record?.done?'已完成':'标记完成'}"><span>第${i+1}组</span><i>${record?.done?'✓':'○'}</i></button><div class="set-value"><input inputmode="numeric" type="number" min="0" max="999" value="${record?.actual??''}" placeholder="${ex.target}" data-actual="${ex.id}" data-index="${i}" aria-label="${esc(ex.name)} 第${i+1}组实际${ex.unit}"><small>${ex.unit}</small></div></div>`}).join('');
 return `<article class="exercise-card" data-exercise="${ex.id}"><button class="exercise-image" data-detail="${ex.id}" aria-label="查看${esc(ex.name)}动作图解"><img src="${assetPath(ex.image+'.svg')}" alt="${esc(ex.name)}动作图解：${esc(ex.cues.join(''))}"><span class="image-hint">动作示意 · 点击放大 ↗</span></button><div class="card-content"><div class="card-topline"><span class="exercise-category">${esc(ex.category)}</span><span class="card-number">${String(index+1).padStart(2,'0')}</span></div><h3 class="card-title">${esc(ex.name)}</h3><span class="card-en">${ex.en}</span><div class="dose-line">${dose(ex)}<button class="timer-button" data-timer="${ex.unit==='秒'?ex.target:ex.unit==='分钟'?ex.target*60:rest}" data-timer-label="${ex.unit==='次'?'组间休息':esc(ex.name)}">◷ ${ex.unit==='次'?rest+'秒休息':'动作计时'}</button></div><p class="card-cues">${esc(ex.cues[0])}</p>${ex.note?`<p class="exercise-note">${esc(ex.note)}</p>`:''}<div class="set-grid" style="grid-template-columns:repeat(${Math.min(ex.sets,4)},minmax(0,1fr))">${sets}</div><div class="card-bottom"><span>输入实际完成量，再勾选记录</span><button class="details-button" data-detail="${ex.id}">动作要点 ↗</button></div></div></article>`;
}
function allSetsDone(){const s=selectedSession();return s.exercises.every(ex=>Array.from({length:ex.sets},(_,i)=>journal[selectedDay]?.sets?.[ex.id]?.[i]?.done).every(Boolean))}
function updateFinish(){const complete=journal[selectedDay]?.complete;$('#finish-day').disabled=!complete&&!allSetsDone();$('#finish-day').innerHTML=complete?'已完成 · 点击撤销 <span>↶</span>':'完成今天的计划 <span>✓</span>'}
function renderToday(){
 const s=selectedSession(),kind=s.kind;
 renderDayStrip();
 const sets=s.exercises.reduce((n,x)=>n+x.sets,0),light=['C','D','prep'].includes(kind),active=['A','B','review','deload','C','D','prep'].includes(kind);
 const stage=STAGES[s.settings.stage];
 $('#session-banner').innerHTML=`<div><h3>DAY ${String(selectedDay).padStart(2,'0')} · ${s.title}<span class="tag">${kind==='A'||kind==='review'?stage.name:kind==='B'?'留约2次余力':light?'轻练 · 留约3次余力':kind==='rest'?'安心休息':'恢复也是训练'}</span></h3><p>${journal[selectedDay]?.session?'已记录日期保留原训练量，未开始的日期按新版5练2休执行。':kind==='A'?'先练专项，再练推力；达标后可提前升级。':kind==='rest'?'今天不安排规定动作，也不需要补练。':kind==='review'?'按当前难度记录合格秒数，拍侧面录像，不额外加练。':light?'徒手下肢、核心与背部控制；不加练冲肩、俄挺或俯卧撑。':'按当天安排完成，保持动作质量。'}</p></div><div class="session-meta"><div><b>${s.exercises.length}</b><span>个动作</span></div><div><b>${sets}</b><span>个工作组</span></div></div>`;
 $('#first-day-note').hidden=selectedDay!==1;
 $('#warmup').hidden=!active;
 $('#warmup-grid').innerHTML=s.warmup.map(ex=>`<button class="warmup-card" data-detail="${ex.id}"><img src="${assetPath(ex.image+'.svg')}" alt="${esc(ex.name)}热身示意"><b>${esc(ex.name)}</b><span>${ex.note||`${ex.sets}组 × ${ex.target}${ex.unit}`}</span></button>`).join('');
 $('#exercise-grid').innerHTML=s.exercises.map(renderExercise).join('');
 $('#day-footer').innerHTML=kind==='rest'?`<div class="rest-panel"><img src="${assetPath('rest.svg')}" alt="休息与恢复示意"><div class="rest-copy"><div class="eyebrow muted">REST IS PART OF THE PLAN</div><h3>留一天给恢复。</h3><p>规定训练量：0组。<br>今天不做俄挺、俯卧撑或上肢负重补练。</p></div></div>`:kind==='A'?`<div class="note-box"><span>↗</span><p><b>当前阶段的升级条件</b>　${esc(stage.gate)}<br>专项全组完成且每组仍有约2秒余力，下次可加1秒；时间、次数、前倾幅度一次只增加一项。升级不会自动执行。</p></div>`:kind==='deload'?`<div class="note-box"><span>↘</span><p>今天固定减量，仅做表内两项。跳过常规肩胛与核心辅助动作，保留恢复空间。</p></div>`:'';
 $('#daily-note').value=journal[selectedDay]?.note||'';
 updateFinish();updateProgress();
}
function selectDay(day){selectedDay=day;persist();setView('today');renderToday();$('#day-strip').querySelector('.selected')?.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'})}
function renderCalendar(){
 $('#calendar-grid').innerHTML=Array.from({length:30},(_,i)=>{const day=i+1,s=journal[day]?.session||getSession(day,settings);return `<button class="calendar-day kind-${s.kind} ${journal[day]?.complete?'complete':''}" data-day="${day}" aria-label="第${day}天 ${s.title}"><span class="cal-num">${String(day).padStart(2,'0')}</span><span class="cal-label">${['A','B','C','D'].includes(s.kind)?s.kind+' · ':''}${s.title}</span><span class="cal-dose">${s.kind==='A'?`${STAGES[s.settings.stage].name}<br>4组专项 + 3组推力`:s.kind==='B'?`俯卧撑 3×${s.settings.push}<br>轻冲肩 + 肩胛与核心`:s.kind==='C'?'深蹲 / 臀桥3×12<br>死虫式 + 背部控制':s.kind==='D'?'箭步蹲每侧2×8<br>背部控制 / 核心 / 散步':s.kind==='prep'?'轻量臀桥 / 死虫式<br>为次日复测留余力':s.kind==='rest'?'规定训练量 0组':s.kind==='recovery'?'散步20分钟<br>肩 / 腕活动':s.kind==='deload'?'轻冲肩2×8秒<br>俯卧撑2×8次':'当前专项4组<br>记录 + 录像'}</span></button>`}).join('');
}
function renderLibrary(){
 $('#library-grid').innerHTML=Object.entries(EXERCISES).filter(([id,ex])=>id!=='rest').filter(([id,ex])=>filter==='all'||(filter==='专项'&&(ex.category.includes('专项')||id==='advanced'))||(filter==='力量'&&['ppp','pushup'].includes(id))||(filter==='辅助'&&['scap','hollow','deadbug','pronew'].includes(id))||(filter==='下肢'&&['squat','bridge','lunge'].includes(id))||(filter==='活动'&&['walk','wrist','shoulder','rock'].includes(id))).map(([id,ex])=>`<button class="library-card" data-detail="${id}"><img src="${assetPath(ex.image+'.svg')}" alt="${esc(ex.name)}姿势示意"><span class="library-info"><strong>${ex.name}</strong><small>${ex.en}</small><p>${ex.category} <span style="float:right">查看图解 ↗</span></p></span></button>`).join('');
}
function renderProgression(){
 $('#stage-route').innerHTML=Object.entries(STAGES).map(([key,s])=>`<article class="stage-card ${settings.stage===Number(key)?'current':''}"><img src="${assetPath(s.id+'.svg')}" alt="${s.name}动作示意"><div class="stage-body"><span class="level-num">LEVEL 0${key}${settings.stage===Number(key)?' · 当前阶段':''}</span><h3>${s.name}</h3><div class="stage-dose">4 × ${s.min}–${s.max}<small> 秒</small></div><p>${s.gate}</p><button class="button outline small" data-stage="${key}">${settings.stage===Number(key)?'查看当前设置':'已达条件，选择此阶段'} <span>↗</span></button></div></article>`).join('');
}
function setView(next){
 view=['today','calendar','library','progression'].includes(next)?next:'today';
 $$('.view').forEach(x=>x.classList.toggle('active',x.id===`${view}-view`));
 $$('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
 $('#hero').hidden=view!=='today';$('.stat-strip').hidden=view!=='today';
 if(view==='calendar')renderCalendar();if(view==='library')renderLibrary();if(view==='progression')renderProgression();
 if(location.hash!==`#${view}`)history.replaceState(null,'',`#${view}`);
}
function showDetail(id){
 const ex=EXERCISES[id];if(!ex)return;
 const current=selectedSession().exercises.find(x=>x.id===id)||selectedSession().warmup.find(x=>x.id===id);
 $('#exercise-detail').innerHTML=`<div class="eyebrow muted">MOVEMENT NOTES</div><h2 class="detail-title">${ex.name}</h2><span class="detail-en">${ex.en}</span><img class="detail-illustration" src="${assetPath(ex.image+'.svg')}" alt="${esc(ex.name)}完整动作示意">${current?`<div class="dose-line">${dose(current)}<span class="subtle">第${selectedDay}天安排</span></div>`:'<p class="subtle">动作图鉴 · 具体组数以所选训练日为准</p>'}<div class="detail-grid"><div><h4>动作要点</h4><p>${ex.cues.map(esc).join('<br>')}</p></div><div><h4>容易忽略的地方</h4><p>${esc(ex.avoid)}</p></div><div><h4>如何降低难度</h4><p>${esc(ex.regress)}</p></div><div><h4>怎样记录</h4><p>只记录动作合格的次数或时间。实际完成量可以低于目标；不为了勾满训练量而硬撑。</p></div></div>${ex.photo?`<details class="detail-ref"><summary>原视频动作参考 · 点击展开</summary><img src="${assetPath(ex.photo)}" alt="原视频中${esc(ex.name)}的实拍参考帧"><p>来源：努力的小易_ · <a href="https://www.bilibili.com/video/BV1Y1Je6uE9i?t=${ex.time}" target="_blank" rel="noreferrer">约${ex.time}秒处 ↗</a>。图解用于提示姿势，视频截图用于辅助核对。</p></details>`:''}`;
 $('#exercise-dialog').showModal();
}
function configureStageInput(stage,hold){const s=STAGES[stage];$('#stage-select').value=stage;$('#hold-input').min=s.min;$('#hold-input').max=s.max;$('#hold-input').value=hold??s.min;$('#hold-range').textContent=`${s.min}–${s.max}秒`;$('#settings-gate').textContent=`进入下一阶段：${s.gate}`}
function openSettings(stage=settings.stage){configureStageInput(stage,stage===settings.stage?settings.hold:undefined);$('#settings-form').elements.ppp.value=settings.ppp;$('#settings-form').elements.push.value=settings.push;$('#settings-dialog').showModal()}
function updateTimer(){const m=Math.floor(timer.remaining/60),s=timer.remaining%60;$('#timer-display').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;$('#timer-play').textContent=timer.running?'Ⅱ':'▶';$('#timer-play').setAttribute('aria-label',timer.running?'暂停计时':'开始计时');$('#timer-label').textContent=timer.label;$('#timer-dock').classList.toggle('finished',timer.remaining===0)}
function stopTick(){clearInterval(timerHandle);timerHandle=undefined}
function startTick(){timer.end=Date.now()+timer.remaining*1000;timer.running=true;stopTick();timerHandle=setInterval(()=>{timer.remaining=Math.max(0,Math.ceil((timer.end-Date.now())/1000));if(timer.remaining===0){timer.running=false;stopTick();toast('计时结束。确认动作质量后，再记录这一组。')}updateTimer()},200);updateTimer()}
function setTimer(seconds,label,autostart=false){stopTick();timer={duration:seconds,remaining:seconds,running:false,end:0,label};$('#timer-dock').classList.remove('collapsed');updateTimer();if(autostart)startTick()}

document.addEventListener('click',event=>{
 const target=event.target.closest('button,a');if(!target)return;
 if(target.dataset.day){selectDay(Number(target.dataset.day));return}
 if(target.dataset.view){event.preventDefault();setView(target.dataset.view);return}
 if(target.dataset.detail){showDetail(target.dataset.detail);return}
 if(target.dataset.stage){openSettings(Number(target.dataset.stage));return}
 if(target.dataset.timer){setTimer(Number(target.dataset.timer),target.dataset.timerLabel,true);return}
 if(target.dataset.close!==undefined){target.closest('dialog').close();return}
 if(target.dataset.check){
   const ex=selectedSession().exercises.find(x=>x.id===target.dataset.check),i=Number(target.dataset.index);
   const entry=ensureStarted();entry.sets[ex.id]??={};const previous=entry.sets[ex.id][i];
   const input=document.querySelector(`[data-actual="${ex.id}"][data-index="${i}"]`),value=input.value===''?ex.target:Number(input.value);
   if(!Number.isFinite(value)||value<0||value>999){toast('请输入0–999之间的实际完成量');return}
   entry.sets[ex.id][i]={actual:value,done:!previous?.done};entry.complete=false;persist();renderToday();return;
 }
});
document.addEventListener('change',event=>{
 const input=event.target;if(!input.matches('[data-actual]'))return;
 const value=input.value===''?null:Number(input.value);if(value!==null&&(!Number.isFinite(value)||value<0||value>999)){toast('请输入0–999之间的实际完成量');return}
 const entry=ensureStarted(),id=input.dataset.actual,i=Number(input.dataset.index);entry.sets[id]??={};entry.sets[id][i]={actual:value,done:false};entry.complete=false;persist();renderToday();
});
$('#daily-note').addEventListener('input',event=>{const entry=ensureStarted();entry.note=event.target.value;clearTimeout(saveHandle);$('#save-hint').textContent='正在保存…';saveHandle=setTimeout(persist,250)});
$('#finish-day').addEventListener('click',()=>{const entry=ensureStarted();if(!entry.complete&&!allSetsDone())return;entry.complete=!entry.complete;persist();renderToday();toast(entry.complete?'第'+selectedDay+'天已记录，给恢复留一点空间。':'已撤销当天完成标记，训练记录保留。')});
$('#hero-start').addEventListener('click',()=>{setView('today');$('#session-heading').scrollIntoView({behavior:'smooth',block:'start'})});
$('#settings-btn').addEventListener('click',()=>openSettings());$('#profile-btn').addEventListener('click',()=>openSettings());
$('#stage-select').addEventListener('change',event=>configureStageInput(Number(event.target.value)));
$('#settings-form').addEventListener('submit',event=>{event.preventDefault();settings=normaliseSettings(Object.fromEntries(new FormData(event.target)));persist();$('#settings-dialog').close();renderToday();if(view==='progression')renderProgression();if(view==='calendar')renderCalendar();toast('设置已更新。已开始的训练日保留原目标量。')});
$('#library-filters').addEventListener('click',event=>{const b=event.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;$$('#library-filters button').forEach(x=>x.classList.toggle('active',x===b));renderLibrary()});
$('#timer-toggle').addEventListener('click',()=>$('#timer-dock').classList.toggle('collapsed'));
$('#timer-play').addEventListener('click',()=>{if(timer.running){timer.remaining=Math.max(0,Math.ceil((timer.end-Date.now())/1000));timer.running=false;stopTick();updateTimer()}else{if(timer.remaining===0)timer.remaining=timer.duration;startTick()}});
$('#timer-reset').addEventListener('click',()=>setTimer(timer.duration,timer.label));
$('#rest-duration').addEventListener('change',event=>setTimer(Number(event.target.value),'组间休息'));
$('#settings-export').addEventListener('click',()=>$('#export-btn').click());
$('#export-btn').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({title:'悬空之前 · 30天训练记录',exportedAt:new Date().toISOString(),settings,journal},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='俄挺训练记录.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('训练记录已导出')});
$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}}));
window.addEventListener('hashchange',()=>setView(location.hash.slice(1)));
renderToday();setView(location.hash.slice(1)||'today');updateTimer();
