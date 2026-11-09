/* Rank Arena synthesized sound effects. No external audio downloads. */
'use strict';
(()=>{
 let audio=null,master=null,noiseBuffer=null;
 let muted=false;
 try{muted=localStorage.getItem('rank_arena_sound_muted')==='1';}catch(e){}
 const lastPlayed=new Map();
 function unlock(){
  if(!audio){
   const AudioEngine=window.AudioContext||window.webkitAudioContext;
   if(!AudioEngine)return;
   try{
    audio=new AudioEngine();
    master=audio.createGain();
    master.gain.value=.33;
    master.connect(audio.destination);
    noiseBuffer=audio.createBuffer(1,Math.round(audio.sampleRate*.36),audio.sampleRate);
    const channel=noiseBuffer.getChannelData(0);
    for(let i=0;i<channel.length;i++)channel[i]=Math.random()*2-1;
   }catch(e){audio=null;return;}
  }
  if(audio.state==='suspended')audio.resume().catch(()=>{});
 }
 function tone(f1,f2,d,vol,wave='sine',delay=0){
  if(!audio||!master)return;
  const t=audio.currentTime+delay;
  const osc=audio.createOscillator(),gain=audio.createGain();
  osc.type=wave;
  osc.frequency.setValueAtTime(Math.max(40,f1),t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40,f2),t+d);
  gain.gain.setValueAtTime(.0001,t);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0003,vol),t+.008);
  gain.gain.exponentialRampToValueAtTime(.0001,t+d);
  osc.connect(gain);gain.connect(master);osc.start(t);osc.stop(t+d+.02);
 }
 function noise(d,vol,frequency=1000,delay=0){
  if(!audio||!noiseBuffer)return;
  const t=audio.currentTime+delay;
  const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();
  src.buffer=noiseBuffer;
  filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.65;
  gain.gain.setValueAtTime(.0001,t);
  gain.gain.exponentialRampToValueAtTime(vol,t+.01);
  gain.gain.exponentialRampToValueAtTime(.0001,t+d);
  src.connect(filter);filter.connect(gain);gain.connect(master);
  src.start(t);src.stop(t+d+.01);
 }
 function play(kind,opts={}){
  if(muted||!audio||audio.state!=='running')return;
  const now=audio.currentTime,who=opts.owner??'p';
  const key=kind+':'+who;
  const cooldown=kind==='shot'?(who==='p'?.09:.24):kind==='hit'?.10:kind==='gadget'?.18:kind==='click'?.045:kind==='ko'?.32:.12;
  if(now-(lastPlayed.get(key)??-100)<cooldown)return;
  lastPlayed.set(key,now);
  const v=opts.quiet?.34:1,variant=opts.variant||'normal';
  switch(kind){
   case 'click':tone(490,740,.065,.15);tone(750,930,.05,.055,'triangle',.023);break;
   case 'shot':
    if(variant==='laser'||variant==='rapid'){tone(1020,360,.12,.18*v,'square');tone(650,390,.11,.065*v,'sine');}
    else if(variant==='rocket'||variant==='heavy'){tone(190,75,.23,.32*v,'sawtooth');noise(.13,.08*v,520);}
    else if(variant==='lob'){tone(410,185,.17,.18*v,'triangle');noise(.09,.05*v,780);}
    else{tone(670,155,.11,.19*v,'sawtooth');noise(.06,.07*v,1550);}
    break;
   case 'hit':tone(190,85,.115,.15*v,'triangle');noise(.062,.045*v,650);break;
   case 'hurt':tone(215,110,.17,.25,'sawtooth');noise(.10,.07,540);break;
   case 'super':
    tone(325,510,.17,.25*v,'sawtooth');
    tone(480,910,.26,.22*v,'triangle',.09);
    noise(.20,.055*v,1400,.045);break;
   case 'gadget':tone(580,820,.095,.19,'sine');tone(850,1230,.15,.12,'triangle',.055);break;
   case 'ko':tone(390,145,.31,.3,'sawtooth');noise(.2,.13,580);break;
   case 'start':tone(390,560,.11,.19,'triangle');tone(580,840,.19,.22,'triangle',.12);break;
   case 'win':tone(390,390,.17,.18,'triangle');tone(490,490,.19,.18,'triangle',.17);tone(625,625,.32,.26,'triangle',.34);break;
   case 'lose':tone(450,310,.21,.23,'sine');tone(310,160,.35,.26,'triangle',.20);break;
  }
 }
 function toggle(){
  muted=!muted;
  try{localStorage.setItem('rank_arena_sound_muted',muted?'1':'0');}catch(e){}
  if(!muted){unlock();play('click');}
 }
 const oldShoot=shoot;
 shoot=function(a,...args){
  const fired=oldShoot(a,...args);
  if(fired){
   const h=heroes[a.type],shot=h.shotKind;
   const variant=shot==='rapid'||shot==='pierce'||h.cls==='СТРЕЛОК'?'rapid':
     shot==='rocket'||shot==='heavy'||h.cls==='ТАНК'?'heavy':
     shot==='lob'||h.cls==='МЕТАТЕЛЬ'?'lob':'normal';
   play('shot',{owner:a.id===0?'p':'bot',quiet:a.id!==0,variant});
  }
  return fired;
 };
 const oldSuper=superPower;
 superPower=function(a,...args){
  const ready=a&&a.alive&&a.sup>=100&&a.stun<=0;
  const result=oldSuper(a,...args);
  if(ready)play('super',{owner:a.id===0?'p':'bot',quiet:a.id!==0});
  return result;
 };
 const oldDamage=damage;
 damage=function(b,amount,attacker){
  const wasAlive=b&&b.alive,wasHp=b?.hp;
  const result=oldDamage(b,amount,attacker);
  if(wasAlive&&b.hp<wasHp){
   if(b.id===0)play('hurt',{owner:'p'});
   else if(attacker?.id===0)play('hit',{owner:'p'});
   if(!b.alive&&b.id===0)play('ko',{owner:'player'});
   else if(!b.alive&&attacker?.id===0)play('ko',{owner:'enemy'});
  }
  return result;
 };
 const oldStartMatch=startMatch;
 startMatch=function(...args){
  const previous=screen;
  const result=oldStartMatch(...args);
  if(previous!=='battle'&&screen==='battle')play('start');
  return result;
 };
 const oldFinish=finish;
 finish=function(winner,...args){
  const previous=match?.phase;
  const result=oldFinish(winner,...args);
  if(previous!==match?.phase&&(match?.phase==='series'||match?.phase==='done')){
   play(winner===0?'win':winner===1?'lose':'start');
  }
  return result;
 };
 const oldAdvance=advance;
 advance=function(dt){
  const phase=match?.phase;
  const result=oldAdvance(dt);
  if(phase==='round'&&match?.phase==='play')play('start');
  return result;
 };
 const oldMenu=menuDraw;
 menuDraw=function(){
  oldMenu();
  button(695,635,124,56,muted?'ЗВУК: ВЫКЛ':'ЗВУК: ВКЛ',toggle,muted?'#7896a9':'#7af2cf',14);
 };
 // Sound is disabled / enabled independently of any in-game settings.
 const soundToggle={x:1102,y:148,w:151,h:42};
 const oldCombat=drawCombat;
 drawCombat=function(){
  oldCombat();
  const b=soundToggle;
  rr(b.x,b.y,b.w,b.h,10,muted?'#2c3d57e6':'#123a55e6',muted?'#8291a9':'#71e6cc',2);
  text(muted?'♪ ЗВУК ВЫКЛ':'♫ ЗВУК ВКЛ',b.x+b.w/2,b.y+b.h/2,15,muted?'#b9c5d4':'#b9fff0','center',900);
 };
 cv.addEventListener('pointerdown',e=>{
  unlock();
  const p=pointerPos(e);
  if(screen==='battle'){
   const b=soundToggle;
   if(p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h){
    e.preventDefault();e.stopImmediatePropagation();toggle();
   }
  }else if(buttonRects.some(b=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h)){
   play('click');
  }
 },true);
 window.addEventListener('keydown',e=>{
  unlock();
  if(e.key?.toLowerCase()==='m'&&!e.repeat){toggle();e.preventDefault();}
 },true);
 window.RANK_AUDIO={play,unlock,toggle,get muted(){return muted},get available(){return Boolean(audio)}};
})();
