/* Rank Arena lobby v2: bright character-focused game home screen. */
'use strict';
(()=>{
 if(typeof menuDraw!=='function'||typeof heroes==='undefined')return;
 function slimText(s,x,y,w,size=19,color='#fff'){
   c.save();c.font='900 '+size+'px system-ui';while(c.measureText(s).width>w&&size>12){size--;c.font='900 '+size+'px system-ui'}c.restore();
   text(s,x,y,size,color,'center',1000,true);
 }
 menuDraw=function(){
   backdrop();
   // Radial highlight and stadium-like backdrop.
   c.save();
   let halo=c.createRadialGradient(642,330,40,642,330,480);
   halo.addColorStop(0,'#8fe6ff88');halo.addColorStop(.65,'#3676d955');halo.addColorStop(1,'#00215600');
   c.fillStyle=halo;c.fillRect(175,90,950,540);
   c.globalAlpha=.13;c.fillStyle='#fff';
   for(let k=0;k<18;k++){c.save();c.translate(650,335);c.rotate(k*Math.PI/9);c.fillRect(-13,50,26,320);c.restore()}
   c.restore();
   // Top blue bar.
   rr(10,12,1260,99,20,'#102855e8','#6dc7ff',3);
   rr(20,23,269,76,14,'#173877','#9ecbff',2);
   iconFighter(64,61,28,heroIndex,0);
   text('RANK ARENA',105,48,23,'#ffe277','left',1000,true);
   text('РАНГОВЫЙ · 2025',105,78,13,'#cfecff','left',800);
   // Top progress currencies use existing real game values only.
   rr(307,32,192,56,13,'#111c47','#538bdb',2);
   star(338,58,16,'#ffdf55',5);
   text(rankPoints.toLocaleString('ru-RU'),404,59,25,'#fff','center',1000,true);
   rr(509,32,180,56,13,'#111c47','#538bdb',2);
   star(541,59,16,'#65f8df',6);
   text('XP '+proPassXP,614,59,20,'#fff','center',1000,true);
   rr(701,32,294,56,13,'#1a2e65','#6b9be0',2);
   text('БОЙЦЫ  '+heroes.length+' / '+heroes.length,844,58,22,'#ecf8ff','center',1000,true);
   button(1015,31,240,58,'PRO PASS',()=>{screen='pass'},'#a9f8ce',20);
   // Left-side menu cards.
   rr(23,131,230,462,18,'#112b62dd','#74acff',3);
   text('МЕНЮ',136,160,21,'#ffe17a','center',1000,true);
   button(39,191,197,66,'БОЙЦЫ',()=>{rosterPage=Math.floor(heroIndex/24);screen='roster'},'#8ad5ff',20);
   button(39,273,197,66,'РАНГИ',()=>{screen='ranks'},'#d4baff',20);
   button(39,356,197,66,'ПРО-ДРАФТ',()=>beginDraft(true),'#a7efc1',18);
   rr(38,447,199,128,14,'#15295b','#67a4f1',2);
   text('ПОБЕДЫ',59,470,15,'#bfe7ff','left',800);
   text(''+retroWins,214,471,20,'#ffe468','right',1000,true);
   text('ПОРАЖЕНИЯ',59,504,15,'#bfe7ff','left',800);
   text(''+retroLosses,213,504,20,'#ff9fb4','right',1000,true);
   text('СИЛА 11',137,544,18,'#fff','center',1000,true);
   // Character center platform and main hero.
   c.save();
   ellipse(648,540,235,52,'#06174577');
   ellipse(648,527,222,51,'#59d6ef');
   ellipse(648,520,201,40,'#b5f3ff');
   ellipse(648,514,170,27,'#5bbbd8');
   c.restore();
   // Animated fighter bobbing, drawn using existing recognizable portrait.
   const bob=Math.sin(tick*2.5)*4;
   c.save();c.translate(648,350+bob);
   c.shadowColor='#071a4e';c.shadowBlur=35;
   iconFighter(0,0,139,heroIndex,0);
   c.restore();
   rr(441,139,416,46,16,'#112452bb','#adf3ff',3);
   slimText(heroes[heroIndex].name,649,162,384,27,'#ffffff');
   rr(497,491,303,38,12,'#0b2458dd','#6cbdff',2);
   slimText(heroes[heroIndex].cls+'  ·  СИЛА 11',648,511,280,18,'#ffe47d');
   button(330,338,81,88,'◀',()=>{heroIndex=(heroIndex+heroes.length-1)%heroes.length},'#9fe6ff',37);
   button(890,338,81,88,'▶',()=>{heroIndex=(heroIndex+1)%heroes.length},'#9fe6ff',37);
   text('◀  ВЫБЕРИ БОЙЦА  ▶',651,573,19,'#ebf6ff','center',950,true);
   // Right rank panel.
   rr(1003,132,252,341,18,'#102b64ed','#83bcff',3);
   text('ТВОЙ РАНГ',1129,162,23,'#fff','center',1000,true);
   rankMedal(1127,254,61,rankIdx());
   slimText(rankDivision(),1128,336,229,23,'#ffe282');
   rr(1025,374,207,19,9,'#122047','#4c6c9c',2);
   rr(1028,377,Math.max(6,201*progress()),13,6,'#ffe253');
   text(rankPoints.toLocaleString('ru-RU')+' / 11 250',1129,414,18,'#fff','center',1000);
   text('РЕЙТИНГОВЫЙ ПУТЬ',1129,445,14,'#c2e9ff','center',900);
   // Mode card bottom, and a big prominent play button.
   rr(22,607,800,101,18,'#171f4ce8','#80b5f7',3);
   rr(35,620,94,75,12,'#6b55c2','#a7a5ff',3);
   star(81,657,27,'#ffe078',5);
   text('РАНГОВЫЙ БОЙ',151,642,24,'#fff','left',1000,true);
   text('3×3  ·  СЛУЧАЙНАЯ КАРТА  ·  БОТЫ',151,676,16,'#cdeaff','left',850);
   button(843,606,413,103,'ИГРАТЬ',()=>beginDraft(false),'#ffca31',35,rankIdx()>=3?'БАНЫ И ВЫБОР БОЙЦОВ':'ВЫБОР БОЙЦОВ');
 };
 window.rosterDraw=function(){
  backdrop();
  text('ВЫБОР БОЙЦА',640,41,37,'#ffe28a','center',1000,true);
  text('Всего бойцов: '+heroes.length+'  ·  Нажми на карточку, чтобы играть за персонажа',640,82,18,'#cdeaff','center',800);
  const pageSize=24,pages=Math.ceil(heroes.length/pageSize);
  rosterPage=Math.max(0,Math.min(rosterPage,pages-1));
  for(let j=0;j<pageSize;j++){
   const id=rosterPage*pageSize+j;if(id>=heroes.length)break;
   const h=heroes[id],col=j%6,row=Math.floor(j/6),x=36+col*203,y=112+row*132,w=193,hh=123;
   const chosen=id===heroIndex;
   rr(x,y,w,hh,12,chosen?'#314f83':'#21325b',chosen?'#ffe27b':'#6688bb',chosen?4:2);
   iconFighter(x+49,y+54,33,id,0);
   text(h.name,x+111,y+31,h.name.length>11?12:15,'#fff','center',1000,true);
   text(h.cls,x+110,y+59,12,classColors[h.cls],'center',900);
   text(chosen?'ВЫБРАН':'СИЛА 11',x+110,y+96,13,chosen?'#ffe17b':'#b8d8f8','center',900);
   buttonRects.push({x,y,w,h:hh,action:()=>{heroIndex=id;screen='menu'}});
  }
  button(402,658,125,49,'◀',()=>{rosterPage=(rosterPage+pages-1)%pages},'#acd4ff',22);
  text('СТРАНИЦА '+(rosterPage+1)+' / '+pages,637,683,18,'#fff','center',900);
  button(743,658,125,49,'▶',()=>{rosterPage=(rosterPage+1)%pages},'#f8dca2',22);
  button(1017,657,220,50,'НАЗАД',()=>{screen='menu'},'#ffc949',22);
 };

})();