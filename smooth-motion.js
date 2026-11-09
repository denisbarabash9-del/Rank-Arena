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