export const STAGES = {
  1: {name:'直臂冲肩',en:'PLANCHE LEAN',id:'lean',min:8,max:12,gate:'同一前倾距离，连续两次 A 日完成 4×12 秒；训练及次日关节无不适，再尝试脚尖辅助团身。'},
  2: {name:'脚尖辅助团身',en:'ASSISTED TUCK',id:'assisted',min:6,max:10,gate:'连续两次 A 日完成 4×10 秒，并能逐渐减轻脚尖支撑，下次前两组尝试离地 1–3 秒。'},
  3: {name:'团身俄挺',en:'TUCK PLANCHE',id:'tuck',min:3,max:8,gate:'连续两次 A 日完成 4×8 秒，再尝试小幅打开髋的进阶团身 2×2–3 秒。'}
};
export const EXERCISES = {
 lean:{name:'直臂冲肩',en:'PLANCHE LEAN',category:'专项 · 直臂力量',image:'lean',photo:'reference-lean.jpg',time:43,cues:['手臂伸直，主动推地，上背稍圆。','肩缓慢移到手腕前方，双脚始终着地。'],avoid:'屈肘、塌腰或踮脚硬凑前倾，都不计入合格时间。',regress:'减小前倾幅度，必要时退回直臂平板。',unit:'秒',loaded:true},
 assisted:{name:'脚尖辅助团身',en:'ASSISTED TUCK',category:'专项 · 重心控制',image:'assisted',cues:['屈膝收腿，肘伸直，肩缓慢向前移。','脚尖保留支撑；膝盖不架在手臂上。'],avoid:'不跳起，不用屈肘换取双脚离地。',regress:'让脚尖承担更多体重，或退回冲肩。',unit:'秒',loaded:true},
 tuck:{name:'团身俄挺',en:'TUCK PLANCHE',category:'专项 · 双脚离地',image:'tuck',photo:'reference-tuck.jpg',time:72,cues:['收膝靠近胸部，主动推地，手臂伸直。','双脚缓慢离地，膝盖不压在手臂上。'],avoid:'不跳起；失去控制时立即让双脚落地。',regress:'脚尖落地，改为辅助团身完成剩余组数。',unit:'秒',loaded:true},
 advanced:{name:'进阶团身',en:'ADVANCED TUCK',category:'下一阶段 · 仅供了解',image:'advanced',photo:'reference-advanced.jpg',time:93,cues:['在稳定团身基础上，小幅打开髋。','膝盖稍向后移，维持直臂与推地姿势。'],avoid:'尚未稳定完成团身训练时，不直接跳到此动作。',regress:'重新收膝，退回团身。',unit:'秒',loaded:true},
 ppp:{name:'小幅冲肩俯卧撑',en:'PSEUDO PLANCHE PUSH-UP',category:'力量 · 专项推力',image:'ppp',photo:'reference-ppp.jpg',time:54,cues:['肩略超过手腕，在轻微前倾位置下放、推起。','下放约 2 秒，推起约 1 秒，保持身体成线。'],avoid:'不追求双手放到腰侧；每组保留约 2 次余力。',regress:'减小前倾；仍做不到则改标准俯卧撑 3×10。',unit:'次',loaded:true},
 pushup:{name:'标准俯卧撑',en:'PUSH-UP',category:'力量 · 基础推力',image:'pushup',photo:'reference-pushup.jpg',time:24,cues:['头、躯干、腿保持一条线，下降幅度一致。','下放约 2 秒，推起约 1 秒，每组留约 2 次余力。'],avoid:'塌腰、抬臀、只做半程的次数不计入。',regress:'减少次数，或手撑牢固台面降低难度。',unit:'次',loaded:true},
 scap:{name:'肩胛俯卧撑',en:'SCAPULAR PUSH-UP',category:'辅助 · 肩胛控制',image:'scap',cues:['手肘保持伸直，只让肩胛缓慢回收。','然后主动推地，把上背顶起。'],avoid:'动作来自肩胛，不靠弯肘完成。',regress:'膝盖着地，以跪姿完成相同次数。',unit:'次',loaded:true},
 hollow:{name:'屈膝仰卧收腹保持',en:'TUCKED HOLLOW HOLD',category:'辅助 · 核心',image:'hollow',cues:['屈髋屈膝、双脚离地，腰背贴地。','保持自然呼吸，双手可放身体两侧。'],avoid:'腰背离地或颈部不适时，停止这一组。',regress:'脚跟轻触地，减小动作难度。',unit:'秒',loaded:false},
 squat:{name:'徒手深蹲',en:'BODYWEIGHT SQUAT',category:'辅助 · 下肢',image:'squat',cues:['双脚约肩宽，脚掌踩稳，髋膝一起弯曲。','在舒适深度下蹲，再平稳站起；保留约3次余力。'],avoid:'不追求蹲到最深，不让膝盖明显内扣。',regress:'缩小下蹲幅度，或轻扶牢固支撑保持平衡。',unit:'次',loaded:false},
 bridge:{name:'臀桥',en:'GLUTE BRIDGE',category:'辅助 · 臀腿',image:'bridge',cues:['仰卧屈膝，双脚踩地，手臂自然放在两侧。','收紧臀部抬髋，肩、髋、膝接近一直线，再缓慢落下。'],avoid:'不通过过度拱腰抬得更高，不用头颈顶地。',regress:'减小抬髋幅度，保持腰背舒适。',unit:'次',loaded:false},
 deadbug:{name:'死虫式交替伸展',en:'DEAD BUG',category:'辅助 · 核心',image:'deadbug',cues:['仰卧抬起双臂与屈膝双腿，腰背轻贴地。','缓慢伸展一侧手臂和对侧腿，收回后换边。'],avoid:'单侧伸展并返回算1次；腰背离地就缩小幅度。',regress:'先只交替移动双腿，双手保持不动。',unit:'次',loaded:false},
 lunge:{name:'反向箭步蹲',en:'REVERSE LUNGE',category:'辅助 · 下肢',image:'lunge',cues:['站稳后，一条腿向后迈步，双膝缓慢弯曲。','前脚踩稳，平稳回到站姿；同一侧做完后换边。'],avoid:'每侧各2组，每组8次；不赶速度，不让前膝内扣。',regress:'缩小步幅和下降深度，可轻扶牢固支撑。',unit:'次',loaded:false},
 pronew:{name:'俯卧W抬臂',en:'PRONE W RAISE',category:'辅助 · 背部控制',image:'pronew',cues:['俯卧，前额轻放毛巾，屈肘让双臂形成W形。','肩胛轻缓向后下方移动，双臂微抬，再放回。'],avoid:'不耸肩、不抬头拱腰；这是轻量背部控制练习。',regress:'缩小抬臂幅度，只练肩胛轻缓回收。',unit:'次',loaded:false},
 walk:{name:'散步 / 原地快走',en:'EASY WALK',category:'恢复 · 轻活动',image:'walk',cues:['保持能正常说话的轻松速度。','恢复日不额外补做上肢负重训练。'],avoid:'无需走到气喘或追求配速。',regress:'根据当日状态放慢速度。',unit:'分钟',loaded:false},
 shoulder:{name:'肩绕环',en:'SHOULDER CIRCLES',category:'活动 · 肩部',image:'shoulder',cues:['站稳，肩部缓慢向前、向后绕圈。','用舒适活动范围，不强拉肩关节。'],avoid:'不耸肩硬转，不追求大幅度。',regress:'缩小绕环范围。',unit:'次',loaded:false},
 wrist:{name:'手腕绕环',en:'WRIST CIRCLES',category:'活动 · 手腕',image:'wrist',cues:['前臂放松，手腕向两个方向缓慢画圈。','每个方向各做规定次数。'],avoid:'保持无痛范围，不用另一只手强压。',regress:'缩小活动幅度。',unit:'次',loaded:false},
 rock:{name:'四点跪姿移重心',en:'WRIST ROCKS',category:'热身 · 支撑适应',image:'rock',cues:['双手、双膝着地，手臂伸直。','身体轻缓前后移动，感受手腕逐步承重。'],avoid:'不猛压手腕，不在痛点停留。',regress:'身体更多向后，减轻双手负荷。',unit:'次',loaded:true},
 rest:{name:'完全休息',en:'REST & RECOVER',category:'恢复 · 完全休息',image:'rest',cues:['今天没有规定训练量。','不需要补做前几天漏掉的动作。'],avoid:'把恢复也当作训练计划的一部分。',regress:'',unit:'组',loaded:false}
};
const A=[1,5,8,12,15,19,26], B=[3,10,17,24], C=[2,9,16,23], D=[6,13,20,27], REST=[4,7,11,14,18,21,25,28];
export const SETTINGS={stage:1,hold:8,ppp:5,push:10};
export function normaliseSettings(raw={}) {
 const stage=[1,2,3].includes(Number(raw.stage))?Number(raw.stage):1,s=STAGES[stage];
 const clamp=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Math.round(Number(v)))):fallback;
 return {stage,hold:clamp(raw.hold,s.min,s.max,s.min),ppp:clamp(raw.ppp,5,8,5),push:clamp(raw.push,10,14,10)};
}
export function dayKind(day) {
 if(!Number.isInteger(day)||day<1||day>30)throw new RangeError('Day must be between 1 and 30');
 return A.includes(day)?'A':B.includes(day)?'B':C.includes(day)?'C':D.includes(day)?'D':day===22?'deload':day===29?'prep':day===30?'review':REST.includes(day)?'rest':'recovery';
}
export const LABELS={A:'专项训练',B:'基础力量',C:'下肢与核心',D:'背部与轻腿',deload:'主动减量',prep:'复测前轻练',review:'周期复测',rest:'恢复 / 休息',recovery:'轻松恢复'};
export function getSession(day,raw={}) {
 const settings=normaliseSettings(raw),kind=dayKind(day);
 const ex=(id,sets,target,extra={})=>({id,sets,target,...EXERCISES[id],...extra});
 let exercises=[];
 if(kind==='A')exercises=[ex(STAGES[settings.stage].id,4,settings.hold,{skill:true}),ex('ppp',3,settings.ppp),ex('scap',2,10),ex('hollow',3,20)];
 if(kind==='B')exercises=[ex('lean',2,10,{note:'轻量：前倾小于 A 日'}),ex('pushup',3,settings.push),ex('scap',2,12),ex('hollow',3,20)];
 if(kind==='C')exercises=[ex('squat',3,12),ex('bridge',3,12),ex('deadbug',2,16,{note:'左右交替各8次，合计16次为1组'}),ex('pronew',2,10)];
 if(kind==='D')exercises=[ex('lunge',4,8,{note:'第1、3组左侧，第2、4组右侧；每侧各2组'}),ex('pronew',2,10),ex('hollow',2,20),ex('walk',1,10,{note:'轻松散步收尾，不额外补练上肢'})];
 if(kind==='prep')exercises=[ex('bridge',2,10),ex('deadbug',2,12,{note:'左右交替各6次，合计12次为1组；保持轻松'}),ex('walk',1,10)];
 if(kind==='deload')exercises=[ex('lean',2,8,{note:'轻量：减小前倾幅度'}),ex('pushup',2,8)];
 if(kind==='review')exercises=[ex(STAGES[settings.stage].id,4,settings.hold,{skill:true,note:'保持当前难度，记录实际合格秒数并拍侧面录像；不额外加练。'})];
 if(kind==='recovery')exercises=[ex('walk',1,20),ex('shoulder',2,10,{note:'前、后各 1 组'}),ex('wrist',2,10,{note:'两个方向各 1 组'})];
 const upper=['A','B','deload','review'].includes(kind);
 const warmup=upper||['C','D','prep'].includes(kind)?[ex('walk',1,2),ex('shoulder',2,10,{note:'前后各 10 次'}),ex('wrist',2,10,{note:'每方向各 10 次'}),...(upper?[ex('rock',1,10)]:[])]:[];
 return {day,kind,title:LABELS[kind],settings,warmup,exercises};
}
export function startSession(journal,day,settings) {
 if(journal[day]?.session)return journal;
 return {...journal,[day]:{session:getSession(day,settings),sets:{},note:'',complete:false}};
}
