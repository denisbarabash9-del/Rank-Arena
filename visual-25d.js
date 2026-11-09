/* Rank Arena 2.5D visual pass: pseudo-3D lighting, raised walls, character depth.
   The collision map and game rules stay 2D for smooth mobile controls. */
'use strict';
(()=>{
 if(typeof arena!=='function'||typeof iconFighter!=='function'||typeof drawProjectile!=='function')return;
 const baseIcon=iconFighter,baseProjectile=drawProjectile,baseCombat=drawCombat;
 const baseArena=arena;
 const isCombat=()=>screen==='battle'&&!!match;
 const face=(points,color)=>{c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fillStyle=color;c.fill()};
 const SHADE=23;
 function raisedWall(w){
  const x=w.x,y=w.y,ww=w.w,hh=w.h,d=SHADE;
  // Lower front face: collision area unchanged, height purely visual.
  rr(x+8,y+10,ww,hh+12,10,'#0b284b66');
  face([[x,y+hh-3],[x+ww,y+hh-3],[x+ww,y+hh+d],[x,y+hh+d]],'#30568a');
  face([[x+ww-2,y],[x+ww+d*.55,y-d*.34],[x+ww+d*.55,y+hh+d*.7],[x+ww-2,y+hh+d]],'#27456d');
  face([[x,y],[x+ww,y],[x+ww+d*.55,y-d*.34],[x+d*.55,y-d*.34]],'#a1d2ff');
  rr(x+d*.55,y-d*.34,ww,hh,9,'#598dd0','#d4e6ff',3);
  rr(x+d*.55+5,y-d*.34+5,ww-10,Math.max(8,hh*.24),6,'#9fcfff77');
  // Brick seams and subtle speculars.
  c.save();c.beginPath();c.rect(x+d*.55+4,y-d*.34+5,ww-8,hh-10);c.clip();
  c.strokeStyle='#2e67a35b';c.lineWidth=2;
  for(let by=y+hh*.33;by<y+hh;by+=hh*.35){
    c.beginPath();c.moveTo(x+8,by-d*.34);c.lineTo(x+ww+d*.55-8,by-d*.34);c.stroke();
  }
  for(let bx=x+30;bx<x+ww;bx+=47){
    c.beginPath();c.moveTo(bx+d*.55,y+hh*.33);c.lineTo(bx+d*.55,y+hh*.7);c.stroke();
  }
  c.restore();
 }
 function shrub(b){
  rr(b.x+2,b.y+7,b.w,b.h,13,'#173d3d77');
  rr(b.x,b.y,b.w,b.h,12,'#266b44','#174c3b',3);
  const n=Math.max(3,Math.ceil(b.w/31)),rows=Math.max(2,Math.ceil(b.h/33));
  for(let r=0;r<rows;r++)for(let j=0;j<n;j++){
   const bx=b.x+10+(j+.5)*(b.w-20)/n+(r%2?6:0);
   const by=b.y+10+(r+.5)*(b.h-20)/rows;
   const rad=11+((j+r)%3)*2;
   ellipse(bx+3,by+6,rad*.95,rad*.62,'#154e3b');
   ellipse(bx,by-4,rad,rad*.75,'#368a4f');
   ellipse(bx-3,by-8,rad*.66,rad*.42,'#73dc79');
   ellipse(bx-6,by-10,rad*.19,rad*.13,'#b7fcb1');
  }
 }
 arena=function(){
  if(!isCombat())return baseArena();
  const a={x:FIELD.left,y:FIELD.top,w:FIELD.right-FIELD.left,h:FIELD.bottom-FIELD.top};
  rr(a.x-17,a.y-17,a.w+34,a.h+34,19,'#10284b','#8ad2ec',4);
  rr(a.x,a.y,a.w,a.h,13,'#7bd0c0','#e1fbff',3);
  c.save();c.beginPath();c.rect(a.x,a.y,a.w,a.h);c.clip();
  // Offset layered diamonds give the ground a subtly tilted/3D texture.
  for(let y=a.y;y<a.y+a.h;y+=44){
   for(let x=a.x;x<a.x+a.w;x+=44){
    const alt=(Math.floor(x/44)+Math.floor(y/44))%2;
    c.fillStyle=alt?'#73ccba':'#84d8c6';c.fillRect(x,y,44,44);
    c.strokeStyle='#dcfff91a';c.lineWidth=1;
    c.beginPath();c.moveTo(x,y+44);c.lineTo(x+44,y);c.stroke();
    if((Math.floor(x/44)*3+Math.floor(y/44))%9===0){
     ellipse(x+20,y+26,3,1.7,'#e5f4c899');
     ellipse(x+25,y+30,2,1.2,'#396d5a33');
    }
   }
  }
  rr(356,34,568,164,18,'#53b2ff3d','#b1e4ff66',2);
  rr(356,1119,568,164,18,'#ff7d8d39','#ffe6ee66',2);
  c.setLineDash([14,11]);c.strokeStyle='#edffff66';c.lineWidth=3;
  c.beginPath();c.moveTo(340,660);c.lineTo(940,660);c.stroke();c.setLineDash([]);
  // Shadows under bushes, raised stone objects.
  for(const b of bushes)shrub(b);
  for(const w of walls)raisedWall(w);
  c.restore();
 };
 // Fighters: keep the original distinctive portraits, give them a floating body and cast shadow.
 iconFighter=function(x,y,r,type,team,alpha=1){
  if(!isCombat()||r>32)return baseIcon(x,y,r,type,team,alpha);
  const h=heroes[type],moving=match.actors.some(a=>a.alive&&a.type===type&&Math.abs(a.x-x)<3&&Math.abs(a.y-y)<9&&a.movePower>.1);
  const bounce=moving?Math.sin(tick*12)*1.8:Math.sin(tick*2+type)*.75;
  c.save();c.globalAlpha*=alpha;
  ellipse(x+7,y+r*.9,r*.97,r*.33,'#0c274f6e');
  ellipse(x+3,y+r*.84,r*.68,r*.22,'#183d6380');
  // Raised feet + colorful torso below the portrait.
  rr(x-r*.48,y+r*.22, r*.38,r*.75,5,'#24365e','#13213c',2);
  rr(x+r*.09,y+r*.22,r*.38,r*.75,5,'#253b68','#13213c',2);
  ellipse(x,y+r*.12,r*.76,r*.8,h.color);
  c.beginPath();c.ellipse(x,y+r*.06,r*.6,r*.45,0,Math.PI,Math.PI*2);
  c.fillStyle='#ffffff48';c.fill();
  c.restore();
  baseIcon(x,y-r*.29+bounce,r,type,team,alpha);
  c.save();c.globalAlpha=alpha*.78;
  c.beginPath();c.arc(x-r*.24,y-r*.47+bounce,r*.23,Math.PI*1.12,Math.PI*1.85);
  c.lineWidth=2;c.strokeStyle='#ffffffa0';c.stroke();
  c.restore();
 };
 // Give bullets a shadow and bloom at their simulated height.
 drawProjectile=function(b){
  if(!isCombat())return baseProjectile(b);
  c.save();c.globalAlpha=.32;ellipse(b.x+8,b.y+9,Math.max(5,b.rad||7)*1.15,Math.max(3,(b.rad||7)*.48),'#133252');c.restore();
  c.save();c.shadowBlur=15;c.shadowColor=b.color||'#fff6ac';
  baseProjectile(b);c.restore();
 };
 // Use main draw path unchanged: game logic, controls, gadgets, hazards remain active.
 drawCombat=function(){
  baseCombat();
  if(!match||!match.actors||!match.actors[0])return;
  rr(25,119,190,33,10,'#142d62c9','#80d4ed66',2);
  text('2.5D  ·  ОБЪЁМНАЯ АРЕНА',120,136,12,'#e0f9ff','center',900);
 };
})();