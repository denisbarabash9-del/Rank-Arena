/* Rank Arena: responsive smoothing for touch movement and aim.
   No changes to combat mechanics or fighter base speeds. */
'use strict';
(()=>{
 if(typeof moveA!=='function'||typeof heroes==='undefined')return;
 const originalMoveA=moveA;
 const damp=(from,to,rate,dt)=>from+(to-from)*(1-Math.exp(-rate*Math.min(dt,.05)));
 // Player-only analog acceleration and braking, with wall sliding retained.
 moveA=function(a,dx,dy,dt){
  if(a.bot)return originalMoveA(a,dx,dy,dt);
  let len=Math.hypot(dx,dy);
  const power=Math.min(1,len);
  const desiredX=len>.001?dx/len*power:0,desiredY=len>.001?dy/len*power:0;
  if(!a.smoothMove)a.smoothMove={x:0,y:0};
  const rate=power>.07?17:23;
  const nextX=damp(a.smoothMove.x,desiredX,rate,dt);
  const nextY=damp(a.smoothMove.y,desiredY,rate,dt);
  a.smoothMove.x=Math.abs(nextX)<.012&&power<.07?0:nextX;
  a.smoothMove.y=Math.abs(nextY)<.012&&power<.07?0:nextY;
  // Preserve native collision/sliding and speed scaling.
  if(Math.hypot(a.smoothMove.x,a.smoothMove.y)<.015){
   a.vx=0;a.vy=0;a.movePower=0;return;
  }
  return originalMoveA(a,a.smoothMove.x,a.smoothMove.y,dt);
 };
 // Soft visual stick follows actual finger input and springs back.
 if(typeof drawControls==='function'){
  const oldDrawControls=drawControls;
  let smx=0,smy=0,previousTime=0;
  drawControls=function(player){
   const dt=Math.max(.005,Math.min(.04,renderDt||.016));
   smx=damp(smx,controls.move.x,23,dt);
   smy=damp(smy,controls.move.y,23,dt);
   // Temporarily smooth only the illustrated joystick; game receives raw input.
   const saved=controls.move;
   controls.move={x:smx,y:smy};
   try{oldDrawControls(player)}finally{controls.move=saved}
  };
 }
})();

/* Right-stick precision: filter quick finger jitter while keeping shots responsive. */
(()=>{
 if(typeof controlUpdate!=='function'||typeof advance!=='function')return;
 const originalControlUpdate=controlUpdate;
 const originalAdvance=advance;
 const axes={fire:{current:null,target:null,distance:null,targetDistance:null},super:{current:null,target:null,distance:null,targetDistance:null}};
 const lerp=(a,b,k)=>a+(b-a)*k;
 const normalized=(v)=>{const l=Math.hypot(v.x,v.y)||1;return{x:v.x/l,y:v.y/l}};
 const angleStep=(a,b,k)=>{
   let a0=Math.atan2(a.y,a.x),a1=Math.atan2(b.y,b.x);
   let diff=Math.atan2(Math.sin(a1-a0),Math.cos(a1-a0));
   return{x:Math.cos(a0+diff*k),y:Math.sin(a0+diff*k)};
 };
 const tickAim=(key,delta)=>{
   const v=axes[key];
   if(!v.current||!v.target)return;
   const k=1-Math.exp(-16*Math.max(0,Math.min(.05,delta)));
   v.current=angleStep(v.current,v.target,k);
   const distK=1-Math.exp(-19*Math.max(0,Math.min(.05,delta)));
   if(v.targetDistance!==null&&v.distance!==null)v.distance=lerp(v.distance,v.targetDistance,distK);
   if(key==='fire'){
     controls.fire=normalized(v.current);
     if(v.distance!==null)controls.fireDistance=v.distance;
   }else{
     controls.superAim=normalized(v.current);
     if(v.distance!==null)controls.superDistance=v.distance;
   }
 };
 controlUpdate=function(id,p){
   const kind=id===controls.fireId?'fire':id===controls.superId?'super':null;
   originalControlUpdate(id,p);
   if(!kind)return;
   const manual=kind==='fire'?controls.fireMoved:controls.superMoved;
   const v=axes[kind];
   if(!manual){
     v.current=null;v.target=null;v.distance=null;v.targetDistance=null;
     return; // quick tap keeps the instant auto-aim
   }
   const raw=kind==='fire'?controls.fire:controls.superAim;
   const dist=kind==='fire'?controls.fireDistance:controls.superDistance;
   if(!v.current){
     // First meaningful drag follows the finger immediately.
     v.current=normalized(raw);v.target=normalized(raw);v.distance=dist;v.targetDistance=dist;
   }else{
     v.target=normalized(raw);v.targetDistance=dist;
     tickAim(kind,.009); // smooth even when pointer events are faster than frames
   }
   if(kind==='fire'){controls.fire={...v.current};controls.fireDistance=v.distance;}
   else{controls.superAim={...v.current};controls.superDistance=v.distance;}
 };
 advance=function(dt){
   for(const kind of ['fire','super']){
     const active=kind==='fire'?controls.fireId!==null&&controls.fireMoved:controls.superId!==null&&controls.superMoved;
     if(active)tickAim(kind,dt);
     else {
       const v=axes[kind];
       v.current=null;v.target=null;v.distance=null;v.targetDistance=null;
     }
   }
   return originalAdvance(dt);
 };
})();
