/* Rank Arena combat and visuals for 50 expansion fighters. */
'use strict';
(()=>{
 if(typeof heroes==='undefined'||heroes.length!==74)return;
 const oldShoot=shoot;
 shoot=function(a,aim,superShot=false,chosenDistance=null){
  if(a.type<24)return oldShoot(a,aim,superShot,chosenDistance);
  if(!a.alive||a.cd>0||a.stun>0||a.ammo<1)return false;
  const h=heroes[a.type],angle=Math.atan2(aim.y,aim.x),range=chosenDistance??h.range,shot=h.shotKind;
  const direction={x:Math.cos(angle),y:Math.sin(angle)};
  const options={distance:range,maxRange:range,rad:8};
  const fire=(offset,delay,mult,extra={})=>queueAngle(a,angle+offset,delay,mult,{...options,...extra});
  switch(shot){
   case 'rapid':for(let j=0;j<4;j++)fire((j%2?1:-1)*.026,j*.064,1,{rad:6});break;
   case 'scatter':for(let j=-2;j<=2;j++)fire(j*.12,0,1,{rad:8});break;
   case 'fan':for(let j=-1;j<=1;j++)fire(j*.15,0,1,{rad:9});break;
   case 'pierce':fire(0,0,1,{pierce:2,rad:8});break;
   case 'rocket':fire(0,0,1,{splash:65,rad:12,kind:'rocket'});break;
   case 'lob':fire(0,0,1,{lob:true,splash:84,rad:12,kind:'dynamite'});break;
   case 'poison':fire(0,0,1,{poison:3.2,rad:9});break;
   case 'slow':fire(0,0,1,{slow:2.1,rad:12});break;
   case 'chain':fire(0,0,1,{chain:true,rad:10});break;
   case 'heavy':fire(0,.14,1,{splash:38,rad:15});break;
   case 'dash':{
    const original={x:a.x,y:a.y},length=Math.min(130,range);
    for(let step=1;step<=13;step++){
     const xx=original.x+direction.x*length*step/13,yy=original.y+direction.y*length*step/13;
     if(validMove(a,xx,yy)){a.x=xx;a.y=yy;}else break;
    }
    for(const b of match.actors)if(b.alive&&b.side!==a.side&&dist(a,b)<84)damage(b,h.dmg*(a.bot?.78:1),a);
    burst(a.x,a.y,h.color,11);break;
   }
   default:fire(0,0,1);
  }
  a.ammo=Math.max(0,a.ammo-1);
  if(a.ammoTick<=0)a.ammoTick=h.reload;
  a.cd=(shot==='heavy'?.38:shot==='rapid'?.22:.27)*(a.bot?1.55:1);
  a.lastHit=0;a.attackFlash=.16;a.invis=0;
  burst(a.x+direction.x*25,a.y+direction.y*25,h.color,4);
  return true;
 };
 const oldSuper=superPower;
 superPower=function(a){
  if(a.type<24)return oldSuper(a);
  if(!a.alive||a.sup<100||a.stun>0)return;
  a.sup=0;
  const h=heroes[a.type],aim=a.aim||{x:0,y:a.side===0?-1:1},
   d=Math.min(a.chosenSuperDistance??h.range,380),
   x=cap(a.x+aim.x*d,FIELD.left+26,FIELD.right-26),
   y=cap(a.y+aim.y*d,FIELD.top+26,FIELD.bottom-26);
  switch(h.superKind){
   case 'blast':explode(x,y,122,h.dmg*2.35*(a.bot?.8:1),a.id,a.side);break;
   case 'barrage':for(let j=-3;j<=3;j++)queueAngle(a,Math.atan2(aim.y,aim.x)+j*.085,Math.abs(j)*.043,1.2,{distance:480,maxRange:480,pierce:1,rad:8});break;
   case 'dash':
   case 'jump':{
    const ox=a.x,oy=a.y,len=h.superKind==='jump'?250:225;
    for(let i=1;i<=18;i++){
      const xx=ox+aim.x*len*i/18,yy=oy+aim.y*len*i/18;
      if(validMove(a,xx,yy)){a.x=xx;a.y=yy;}else break;
    }
    explode(a.x,a.y,94,h.dmg*1.35*(a.bot?.77:1),a.id,a.side);
    a.shield=Math.max(a.shield,.9);break;
   }
   case 'heal':
     for(const b of match.actors)if(b.alive&&b.side===a.side&&dist(a,b)<350){b.hp=Math.min(b.max,b.hp+1500);burst(b.x,b.y,h.color,12);}
     break;
   case 'buff':
     for(const b of match.actors)if(b.alive&&b.side===a.side&&dist(a,b)<345){b.haste=Math.max(b.haste,4.4);b.power=Math.max(b.power,4.4);burst(b.x,b.y,h.color,8);}
     break;
   case 'shield':
     for(const b of match.actors)if(b.alive&&b.side===a.side&&dist(a,b)<265)b.shield=Math.max(b.shield,3.6);
     burst(a.x,a.y,h.color,16);break;
   case 'field':
     placeHazard(x,y,122,a.side,a.id,h.shotKind==='poison'?'thorns':'honey',5.2,145*(a.bot?.77:1));
     break;
   case 'stun':
   case 'push':
     for(const b of match.actors)if(b.alive&&b.side!==a.side&&dist(a,b)<245){
       damage(b,h.dmg*1.15*(a.bot?.8:1),a);b.stun=Math.max(b.stun,h.superKind==='stun'?1.35:.48);
       b.slow=Math.max(b.slow,2.5);
       if(h.superKind==='push'){const n=norm(b.x-a.x,b.y-a.y);if(validMove(b,b.x+n.x*100,b.y+n.y*100)){b.x+=n.x*100;b.y+=n.y*100;}}
     }
     burst(a.x,a.y,h.color,16);break;
   case 'pull':
     for(const b of match.actors)if(b.alive&&b.side!==a.side&&dist(b,{x,y})<165){
      damage(b,h.dmg*.8,a);b.slow=Math.max(b.slow,2.4);const n=norm(x-b.x,y-b.y);
      if(validMove(b,b.x+n.x*85,b.y+n.y*85)){b.x+=n.x*85;b.y+=n.y*85;}
     }
     burst(x,y,h.color,21);break;
   case 'invis':a.invis=Math.max(a.invis,6);a.haste=Math.max(a.haste,3.5);burst(a.x,a.y,h.color,14);break;
   case 'turret':
     match.turrets.push({x,y,side:a.side,owner:a.id,life:17,cd:.5,hp:1800,kind:'turret'});
     burst(x,y,h.color,12);break;
   default:explode(x,y,110,h.dmg*2,a.id,a.side);
  }
 };
 const oldIcon=iconFighter;
 iconFighter=function(x,y,r,type,side,alpha=1){
  if(type<24)return oldIcon(x,y,r,type,side,alpha);
  const h=heroes[type],style=h.avatar%12;
  c.save();c.globalAlpha*=alpha;
  ellipse(x+3,y+r*.87,r*.86,r*.29,'#071a3455');
  c.beginPath();c.arc(x,y,r+5,0,TAU);c.fillStyle=side===0?'#2371b5':'#b8365d';c.fill();
  c.beginPath();c.arc(x,y,r,0,TAU);c.fillStyle=h.accent;c.fill();c.strokeStyle='#fff5';c.lineWidth=2;c.stroke();
  c.beginPath();c.arc(x,y,r-2,0,TAU);c.clip();
  c.translate(x,y);c.scale(r/30,r/30);
  const oval=(xx,yy,rx,ry,col)=>ellipse(xx,yy,rx,ry,col);
  rr(-29,15,58,31,9,h.color);
  oval(0,0,22,23,style===1||style===7?'#87b3d0':style===4?'#9e7ec3':style===6?'#d1e6f0':'#e8c29f');
  switch(style){
   case 0:rr(-27,-25,54,16,7,h.color);rr(-12,-34,24,13,3,h.accent);break;
   case 1:rr(-24,-24,48,48,8,h.color);rr(-17,-14,34,18,6,'#173654');break;
   case 2:oval(0,-17,25,13,h.color);rr(-26,-19,52,7,3,h.accent);break;
   case 3:rr(-25,-28,50,22,12,h.color);oval(-15,-20,10,8,h.accent);oval(15,-20,10,8,h.accent);break;
   case 4:rr(-19,-32,38,17,7,h.color);rr(-26,-19,52,11,4,h.color);break;
   case 5:rr(-28,-29,56,36,9,h.color);rr(-23,-12,46,20,5,'#102c46');break;
   case 6:oval(0,-19,26,13,h.color);rr(-12,-31,24,17,4,h.accent);break;
   case 7:rr(-25,-27,50,31,7,h.color);rr(-24,-13,48,15,4,'#1f344f');break;
   case 8:oval(0,-15,26,14,h.color);rr(-26,-24,52,8,4,h.accent);break;
   case 9:rr(-21,-38,42,24,7,h.color);rr(-27,-16,54,9,4,h.accent);break;
   case 10:rr(-26,-26,52,15,4,h.color);rr(-15,-37,30,15,5,h.accent);break;
   case 11:rr(-25,-26,50,22,9,h.color);oval(0,-28,9,8,h.accent);break;
  }
  if(style===1||style===5||style===7){
    rr(-14,-8,28,14,4,'#cffcff');oval(-7,-1,3,4,'#264463');oval(7,-1,3,4,'#264463');
  }else{
    oval(-8,0,5,5,'#fff');oval(8,0,5,5,'#fff');
    oval(-8,0,2,3,'#282a43');oval(8,0,2,3,'#282a43');
  }
  if(style%3===0)rr(-10,11,20,4,2,'#723d56');
  else{c.beginPath();c.arc(0,7,8,.1,Math.PI-.1);c.strokeStyle='#5d4656';c.lineWidth=2.5;c.stroke();}
  oval(0,26,9,8,h.accent);
  c.fillStyle='#27344c';c.textAlign='center';c.textBaseline='middle';c.font='bold 12px system-ui';
  c.fillText(h.name.slice(0,1),0,26);
  c.restore();
 };
 const oldProjectile=drawProjectile;
 drawProjectile=function(b){
  if(b.type<24)return oldProjectile(b);
  const h=heroes[b.type],a=Math.atan2(b.vy,b.vx);
  const height=b.arc?Math.sin(Math.PI*Math.min(1,(b.age||0)/(b.flight||1)))*58:0;
  c.save();c.translate(b.x,b.y-height);c.rotate(a);c.shadowBlur=10;c.shadowColor=h.color;
  ellipse(0,0,Math.max(6,b.rad||8),Math.max(5,(b.rad||8)*.8),h.color);
  ellipse(2,-2,Math.max(2,(b.rad||8)*.52),Math.max(2,(b.rad||8)*.42),h.accent);
  if(['rapid','pierce','rocket'].includes(h.shotKind))rr(-14,-2,15,4,2,h.accent);
  c.restore();
 };
})();
