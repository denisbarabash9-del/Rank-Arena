/* Rank Arena — ranked draft redesign, inspired by the reference layout. */
'use strict';
(() => {
 if(typeof draftDraw!=='function'||typeof heroes==='undefined')return;
 const oldDraftDraw=draftDraw;
 draftDraw=function(){
  if(!draft){oldDraftDraw();return}
  const ban=draft.phase==='ban',myTurn=ban?draft.banStep===2:draft.step===5;
  const available=draftAvailable();
  // Dark maroon and blue panels, bright card portraits, two-team draft.
  c.fillStyle='#170d19';c.fillRect(0,0,W,H);
  c.fillStyle=gradient(0,0,W,100,['#bd171c','#520909']);c.fillRect(0,0,455,89);
  c.fillStyle=gradient(455,0,825,100,['#d85bcb','#8034b8']);c.fillRect(455,0,825,89);
  text(ban?'ЗАПРЕТ БОЙЦА':'ВЫБОР БОЙЦА',18,31,31,'#ffe45e','left',1000,true);
  text(myTurn?'ТВОЙ ХОД':'ХОД СОПЕРНИКОВ',18,68,18,'#fff','left',950,true);
  rr(369,17,72,54,12,'#ffca42','#fff3a6',3);
  text(''+Math.max(0,Math.ceil(17-(draft.elapsed||0)))+'с',405,45,27,'#60220e','center',1000);
  text(MODE_DATA[draft.mode].name,485,27,28,'#fff','left',1000,true);
  text(MAPS[draft.map].name,486,62,18,'#fce7ff','left',900,true);
  button(1130,18,126,49,'В МЕНЮ',()=>{screen='menu'},'#ffd16c',15);
  // Team column.
  rr(0,92,457,288,0,'#0c45cf','#63adff',3);
  rr(0,386,457,329,0,'#a00c11','#f0625f',3);
  const drawSlot=(i,x,y,side)=>{
   const pick=draft.picks[i],chosen=pick>=0;
   rr(x,y,446,88,4,side===0?'#145cf0':'#b81b20','#ffffffcc',3);
   rr(x+7,y+8,72,70,9,side===0?'#00378e':'#6d1116','#ffffff44',2);
   if(chosen)iconFighter(x+44,y+43,30,pick,side);
   else{text('?',x+44,y+44,45,'#7da9ff','center',1000,true)}
   const name=i===0?'ТЫ':i<3?'СОЮЗНИК '+i:'ПРОТИВНИК '+(i-2);
   text(name,x+95,y+31,20,'#fff','left',1000,true);
   if(chosen)text(heroes[pick].name,x+95,y+62,19,'#ffe57d','left',1000,true);
   else text(ban?'ОЖИДАНИЕ ЗАПРЕТОВ':(myTurn&&i===0?'ВЫБИРАЙ БОЙЦА':'ОЖИДАНИЕ'),x+95,y+62,14,'#d9e9ff','left',850);
   text(''+(i+1),423,y+44,26,'#fff','center',1000,true);
  };
  for(let i=0;i<3;i++)drawSlot(i,5,101+i*91,0);
  text('VS',226,383,43,'#ffffff','center',1000,true);
  for(let i=3;i<6;i++)drawSlot(i,5,399+(i-3)*91,1);
  // Grid: 24 fighters, all visible at once. 6 columns × 4 rows.
  const gx=474,gy=104,cw=126,ch=119,space=4;
  for(let i=0;i<heroes.length;i++){
   const h=heroes[i],col=i%6,row=(i/6)|0;
   const x=gx+col*(cw+space),y=gy+row*(ch+space);
   const blocked=draft.bans.includes(i)||draft.picks.includes(i),selected=myTurn&&draft.selected===i;
   rr(x+2,y+5,cw,ch,3,'#0008');
   rr(x,y,cw,ch,3,blocked?'#3a2231':selected?'#ffe16a':h.color,selected?'#fff7b4':'#fff',selected?5:3);
   // Large circular portraits with a lively colorful backing.
   c.save();c.beginPath();c.rect(x+4,y+4,cw-8,ch-8);c.clip();
   c.fillStyle=h.color;c.fillRect(x+4,y+4,cw-8,ch-8);
   c.fillStyle='#ffffff28';c.beginPath();c.arc(x+95,y+19,55,0,TAU);c.fill();
   c.fillStyle='#00000018';c.beginPath();c.arc(x+18,y+105,60,0,TAU);c.fill();
   iconFighter(x+cw/2,y+49,41,i,i%2,blocked?.4:1);
   c.restore();
   rr(x+3,y+89,cw-6,26,2,blocked?'#18121bcc':'#19162cdd');
   text(h.name,x+cw/2,y+103,h.name.length>10?11:14,'#fff','center',1000,true);
   if(blocked){rr(x+90,y+5,31,27,5,'#df232c','#fff',2);text('⊘',x+106,y+18,24,'#fff','center',1000)}
   if(selected){rr(x+4,y+4,38,27,5,'#ffe56a','#fff',2);text('✓',x+23,y+18,22,'#533316','center',1000)}
   if(myTurn&&!blocked)buttonRects.push({x,y,w:cw,h:ch,action:()=>chooseDraft(i)});
  }
  // Bottom bar and confirmation.
  rr(470,602,792,110,12,'#1a1531','#5e486f',3);
  text(ban?'BAN A BRAWLER':'PICK A BRAWLER',490,626,22,'#ffde68','left',1000,true);
  const bannedNames=draft.bans.map(i=>heroes[i].name).join(', ')||'НЕТ';
  text('БАНЫ: '+bannedNames,490,654,13,'#ffd3dc','left',800);
  text('РАНГ: '+(draft.practice?'ТРЕНИРОВКА':rankDivision()),490,682,14,'#bcd9ff','left',850);
  if(myTurn&&draft.selected>=0&&available.includes(draft.selected)){
   button(924,626,317,64,ban?'ЗАПРЕТИТЬ':'ВЫБРАТЬ '+heroes[draft.selected].name,confirmDraft,'#ffce3c',21);
  }else{
   rr(928,627,308,60,10,'#33354b','#666c89',2);
   text(myTurn?'НАЖМИ НА БОЙЦА':'ОЖИДАНИЕ...',1082,657,19,'#fff','center',900);
  }
 };
})();