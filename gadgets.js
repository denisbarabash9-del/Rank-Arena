/* Retro Ranked 2025: 24 unique character gadgets. Loaded after the main game script. */
'use strict';
(() => {
  if (typeof heroes === 'undefined' || heroes.length < 24 || typeof makeActor !== 'function') return;
  const GADGETS = [
    {name:'БЫСТРЫЙ ШАГ',desc:'Шелли совершает рывок вперёд',cd:5},
    {name:'ЗАПАСНЫЕ ПАТРОНЫ',desc:'Кольт мгновенно восполняет 2 патрона',cd:6},
    {name:'ТОПТУН',desc:'Булл оглушает и замедляет врагов рядом',cd:7},
    {name:'РАКЕТНЫЙ ПРЫЖОК',desc:'Брок отпрыгивает, оставляя взрыв',cd:6},
    {name:'ЭЛЕКТРОИМПУЛЬС',desc:'Турель Джесси выпускает электрическую волну',cd:7},
    {name:'МЕДВЕЖИЙ РЁВ',desc:'Медведь Ниты оглушает врагов вокруг',cd:7},
    {name:'ЛЕЧЕБНЫЙ РИТМ',desc:'Поко лечит ближайших союзников',cd:7},
    {name:'СИЛОВОЙ БРОСОК',desc:'Эль Примо отбрасывает ближайшего врага',cd:6},
    {name:'ЛИПКИЙ СИРОП',desc:'Барли разливает замедляющую лужу',cd:7},
    {name:'ДИНАМИТНЫЙ ТАНЕЦ',desc:'Динамайк бросает три шашки вокруг себя',cd:7},
    {name:'ЗАПАСНАЯ ЛОПАТА',desc:'Мортис восстанавливает патрон и ускоряется',cd:6},
    {name:'ВЗРЫВ ШИПОВ',desc:'Спайк выпускает шипы во все стороны',cd:6},
    {name:'МИРАЖ',desc:'Леон ненадолго становится невидимым',cd:8},
    {name:'ЗАЩИТНЫЕ ПЕРЬЯ',desc:'Ворон получает защитный щит',cd:8},
    {name:'КАРТОЧНЫЙ ШТОРМ',desc:'Тара разбрасывает усиленные карты вокруг',cd:7},
    {name:'ОТТАЛКИВАНИЕ',desc:'Джин отталкивает врагов и лечится',cd:7},
    {name:'СОЛЁНАЯ БОЧКА',desc:'Пенни ставит бочку, принимающую выстрелы',cd:7},
    {name:'ЧИТ-КОД',desc:'8-Бит перемещается к усилителю или получает силу',cd:8},
    {name:'МЕДОВАЯ ЛОВУШКА',desc:'Беа создаёт поле, замедляющее противников',cd:7},
    {name:'ФАЗОВЫЙ РЫВОК',desc:'Макс совершает рывок с кратким щитом',cd:6},
    {name:'СОННЫЙ ПЕСОК',desc:'Сэнди усыпляет ближайших врагов',cd:8},
    {name:'ЖИВУЧИЕ ЛИАНЫ',desc:'Роза лечится сильнее внутри кустов',cd:7},
    {name:'АКТИВНАЯ ЗАЩИТА',desc:'Фрэнк снимает оглушение и включает щит',cd:8},
    {name:'АВТОПРИЦЕЛ',desc:'Пайпер делает выстрел с отбрасыванием',cd:7}
  ];
  GADGETS.push(...heroes.slice(24).map(h=>({name:h.gadgetName,desc:h.desc,cd:6.5})));
  const BTN={x:1034,y:425,r:43};
  const originalMakeActor=makeActor;
  makeActor=function(...args){
    const a=originalMakeActor(...args);
    a.gadgetUses=3;
    a.gadgetCooldown=0;
    a.gadgetFlash=0;
    return a;
  };
  function dash(a,dir,length){
    const n=norm(dir.x,dir.y),start={x:a.x,y:a.y};
    const steps=Math.ceil(length/9);
    for(let i=1;i<=steps;i++){
      const x=start.x+n.x*length*i/steps,y=start.y+n.y*length*i/steps;
      if(validMove(a,x,y)){a.x=x;a.y=y;}else break;
    }
    burst(a.x,a.y,heroes[a.type].color,12);
  }
  function nearby(a,r){
    return match.actors.filter(b=>b.alive&&b.side!==a.side&&dist(a,b)<=r);
  }
  function pulse(a,center,r,dmg=0,stun=0,slow=0,knock=0){
    burst(center.x,center.y,'#b8f5cb',19);
    for(const b of match.actors){
      if(!b.alive||b.side===a.side||dist(b,center)>r)continue;
      if(dmg)damage(b,dmg*(a.bot?.77:1),a);
      if(stun)b.stun=Math.max(b.stun,stun);
      if(slow)b.slow=Math.max(b.slow,slow);
      if(knock){const n=norm(b.x-center.x,b.y-center.y);
        const tx=b.x+n.x*knock,ty=b.y+n.y*knock;
        if(validMove(b,tx,ty)){b.x=tx;b.y=ty;}}
    }
  }
  function useGadget(a){
    if(!match||match.phase!=='play'||!a||!a.alive||(a.stun>0&&a.type!==22)||a.gadgetUses<=0||a.gadgetCooldown>0)return false;
    const h=heroes[a.type],aim=a.aim||{x:0,y:a.side===0?-1:1};
    switch(a.type){
      case 0: dash(a,aim,145);break;
      case 1: a.ammo=Math.min(a.ammoMax||3,a.ammo+2);a.ammoTick=0;a.cd=0;a.haste=Math.max(a.haste,1.1);break;
      case 2: pulse(a,a,155,330,.35,2.0,38);break;
      case 3: {const pos={x:a.x,y:a.y};dash(a,{x:-aim.x,y:-aim.y},145);pulse(a,pos,96,400,0,.9,30);break;}
      case 4: {const ts=match.turrets.filter(t=>t.owner===a.id&&t.kind==='turret');if(ts.length)for(const t of ts)pulse(a,t,165,540,.55,1.5);else pulse(a,a,120,350,.4,1);break;}
      case 5: {const bears=match.turrets.filter(t=>t.owner===a.id&&t.kind==='bear');if(bears.length)for(const t of bears){pulse(a,t,150,290,1.6,1.8);t.hp=Math.min(4400,t.hp+650);}else pulse(a,a,120,260,.9,1.1);break;}
      case 6: for(const b of match.actors)if(b.alive&&b.side===a.side&&dist(a,b)<330){b.hp=Math.min(b.max,b.hp+1150);burst(b.x,b.y,'#fff6a9',12);}break;
      case 7: {const target=nearby(a,155).sort((x,y)=>dist(a,x)-dist(a,y))[0];if(target){const n=norm(target.x-a.x,target.y-a.y),tx=target.x+n.x*145,ty=target.y+n.y*145;if(validMove(target,tx,ty)){target.x=tx;target.y=ty;}target.stun=Math.max(target.stun,.9);damage(target,400*(a.bot?.77:1),a);}else{a.shield=Math.max(a.shield,1.6);a.haste=Math.max(a.haste,1.8);}break;}
      case 8: placeHazard(a.x+aim.x*140,a.y+aim.y*140,110,a.side,a.id,'honey',4.0,60);break;
      case 9: for(let i=0;i<3;i++){const angle=i*TAU/3+tick;match.mines.push({x:cap(a.x+Math.cos(angle)*115,FIELD.left+25,FIELD.right-25),y:cap(a.y+Math.sin(angle)*115,FIELD.top+25,FIELD.bottom-25),owner:a.id,side:a.side,life:.6+i*.13,rad:75,dmg:570*(a.bot?.77:1)});}a.haste=Math.max(a.haste,1.2);break;
      case 10: a.ammo=Math.min(a.ammoMax||3,a.ammo+1);a.ammoTick=0;a.haste=Math.max(a.haste,2.5);a.cd=0;break;
      case 11: for(let i=0;i<10;i++){const angle=TAU*i/10;addBullet(a,{x:Math.cos(angle),y:Math.sin(angle)},.66,{kind:'spike',rad:6,maxRange:200,distance:200,split:false,speed:480});}break;
      case 12: a.invis=Math.max(a.invis,3.0);a.haste=Math.max(a.haste,1.5);break;
      case 13: a.shield=Math.max(a.shield,3.0);break;
      case 14: for(let i=0;i<7;i++){const angle=TAU*i/7;addBullet(a,{x:Math.cos(angle),y:Math.sin(angle)},.9,{kind:'card',rad:8,pierce:2,maxRange:225,distance:225,speed:520});}break;
      case 15: pulse(a,a,155,220,.4,1.0,135);a.hp=Math.min(a.max,a.hp+440);break;
      case 16: {const x=cap(a.x+aim.x*72,FIELD.left+35,FIELD.right-35),y=cap(a.y+aim.y*72,FIELD.top+35,FIELD.bottom-35);match.turrets.push({x,y,side:a.side,owner:a.id,life:10,cd:999,hp:1650,kind:'barrel'});burst(x,y,'#ffda8d',10);break;}
      case 17: {const booster=match.turrets.filter(t=>t.owner===a.id&&t.kind==='booster').sort((x,y)=>dist(a,x)-dist(a,y))[0];if(booster&&validMove(a,booster.x+29,booster.y+29)){a.x=booster.x+29;a.y=booster.y+29;a.shield=Math.max(a.shield,1.2);}else{a.power=Math.max(a.power,3);a.haste=Math.max(a.haste,2);}break;}
      case 18: placeHazard(a.x+aim.x*105,a.y+aim.y*105,128,a.side,a.id,'honey',4.0,40);break;
      case 19: dash(a,aim,180);a.shield=Math.max(a.shield,1.35);break;
      case 20: pulse(a,a,185,0,1.1,2.9);break;
      case 21: a.hp=Math.min(a.max,a.hp+(inBush(a)?1700:790));a.shield=Math.max(a.shield,1.5);break;
      case 22: a.stun=0;a.root=0;a.shield=Math.max(a.shield,3.3);break;
      case 23: {const target=nearby(a,365).filter(b=>lineClear(a,b)).sort((x,y)=>dist(a,x)-dist(a,y))[0];if(target){const dir=norm(target.x-a.x,target.y-a.y);const bullet=addBullet(a,dir,.70,{kind:'autoaim',rad:10,knockback:115,maxRange:380,distance:380,speed:775});bullet.color='#f8b9de';}else{a.haste=Math.max(a.haste,2);a.shield=Math.max(a.shield,1.1);}break;}
      default:{
        if(a.type<24)return false;
        switch(h.gadgetKind){
          case 'dash':dash(a,aim,155);a.shield=Math.max(a.shield,.8);break;
          case 'heal':a.hp=Math.min(a.max,a.hp+1200);for(const b of match.actors)if(b.alive&&b.side===a.side&&dist(a,b)<145)b.hp=Math.min(b.max,b.hp+500);break;
          case 'shield':a.shield=Math.max(a.shield,3.0);a.hp=Math.min(a.max,a.hp+350);break;
          case 'pulse':pulse(a,a,145,420,.45,1.6,45);break;
          case 'ammo':a.ammo=Math.min(a.ammoMax,a.ammo+2);a.ammoTick=0;a.cd=0;a.power=Math.max(a.power,1.8);break;
          case 'cloud':placeHazard(a.x+aim.x*125,a.y+aim.y*125,103,a.side,a.id,'honey',4.0,65);break;
          case 'speed':a.haste=Math.max(a.haste,3.3);a.power=Math.max(a.power,1.8);break;
          default:a.shield=Math.max(a.shield,1.5);
        }
        break;
      }
    }
    a.gadgetUses--;
    a.gadgetCooldown=GADGETS[a.type].cd;
    a.gadgetFlash=.35;
    if(typeof window.RANK_AUDIO?.play==='function')window.RANK_AUDIO.play('gadget',{owner:a.id===0?'p':'bot',quiet:a.id!==0});
    burst(a.x,a.y,'#65ffab',14);
    return true;
  }
  const originalUpdateBattle=updateBattle;
  updateBattle=function(dt){
    const before=match?.actors?.map(a=>({charges:a.gadgetUses??3,cd:a.gadgetCooldown??0,alive:a.alive}));
    originalUpdateBattle(dt);
    if(!match||match.phase!=='play')return;
    for(const a of match.actors){
      const old=before?.[a.id];
      if(old&&!old.alive&&a.alive){a.gadgetUses=old.charges;a.gadgetCooldown=old.cd;}
      a.gadgetCooldown=Math.max(0,(a.gadgetCooldown||0)-dt);
      a.gadgetFlash=Math.max(0,(a.gadgetFlash||0)-dt);
      if(a.bot&&a.alive&&a.gadgetUses>0&&a.gadgetCooldown===0){
        const enemy=nearby(a,215)[0];
        if(enemy&&(a.hp/a.max<.64||dist(a,enemy)<130)&&Math.random()<dt*.33)useGadget(a);
      }
    }
  };
  const originalDrawControls=drawControls;
  drawControls=function(p){
    originalDrawControls(p);
    const ready=p.alive&&p.gadgetUses>0&&p.gadgetCooldown<=0;
    ellipse(BTN.x,BTN.y,BTN.r+5,BTN.r+5,'#122a38dd');
    ellipse(BTN.x,BTN.y,BTN.r,BTN.r,ready?'#42db86':'#3b5260');
    c.beginPath();c.arc(BTN.x,BTN.y,BTN.r,0,TAU);c.strokeStyle=ready?'#c5ffdb':'#7a99a7';c.lineWidth=4;c.stroke();
    text('✦',BTN.x,BTN.y-4,37,ready?'#10452d':'#9bb6b4','center',1000);
    text(String(p.gadgetUses??3),BTN.x+35,BTN.y+33,18,'#fff','center',950,true);
    if(!ready&&p.gadgetCooldown>0){
      c.beginPath();c.arc(BTN.x,BTN.y,BTN.r-6,-Math.PI/2,-Math.PI/2+TAU*cap(p.gadgetCooldown/GADGETS[p.type].cd,0,1));c.strokeStyle='#bddbd3';c.lineWidth=5;c.stroke();
      text(Math.ceil(p.gadgetCooldown)+'с',BTN.x,BTN.y+16,13,'#fff','center',900);
    }
    if(p.gadgetFlash>0)text('ГОТОВО!',BTN.x,BTN.y-59,13,'#9effbd','center',900,true);
  };
  const originalDrawCombat=drawCombat;
  drawCombat=function(){
    originalDrawCombat();
    if(match&&match.actors[0]){
      const p=match.actors[0];
      text('ГАДЖЕТ: '+GADGETS[p.type].name,820,696,12,'#a4ffc8','left',850);
    }
  };
  cv.addEventListener('pointerdown',e=>{
    if(screen!=='battle'||!match||match.phase!=='play')return;
    const p=pointerPos(e);
    if(Math.hypot(p.x-BTN.x,p.y-BTN.y)<=BTN.r+9){
      e.preventDefault();e.stopImmediatePropagation();
      useGadget(match.actors[0]);
    }
  },true);
  window.addEventListener('keydown',e=>{
    if(e.key.toLowerCase()==='g'&&!e.repeat&&screen==='battle'&&match?.phase==='play'){
      e.preventDefault();useGadget(match.actors[0]);
    }
  });
  window.RETRO_GADGETS={items:GADGETS,use:useGadget};
})();


/* Visual style pass: make graphics feel closer to Brawl Stars (not an exact copy). */
(() => {
  if (typeof rr === 'undefined' || typeof heroes === 'undefined') return;

  // Brighter class colors and map palettes.
  if (typeof colors !== 'undefined') {
    colors.bg = '#102552';
    colors.card = '#173772';
    colors.light = '#3f63b5';
    colors.yellow = '#ffd247';
    colors.blue = '#48c2ff';
    colors.red = '#ff5f78';
    colors.mint = '#56f1b8';
  }
  if (typeof classColors !== 'undefined') {
    classColors['ТАНК'] = '#ffb14d';
    classColors['МЕТАТЕЛЬ'] = '#ff87b0';
    classColors['ПОДДЕРЖКА'] = '#5df0b9';
    classColors['СТРЕЛОК'] = '#ff8dea';
    classColors['УБИЙЦА'] = '#a88cff';
    classColors['КОНТРОЛЬ'] = '#6fdcff';
    classColors['УРОН'] = '#ff9d66';
  }
  if (typeof MAPS !== 'undefined') {
    const nicerThemes = [
      ['#5ec2b2','#72d8c8','#e6be6b'],
      ['#5dbd74','#78d98f','#d3b16b'],
      ['#77b0d5','#5d93bc','#deb06a'],
      ['#8db7ff','#7297ed','#d8ca7a'],
      ['#58cc8e','#79e0a4','#dbc37f'],
      ['#64d0d0','#85e3e3','#e9c979'],
      ['#76c5df','#95ddf4','#d7bc7b'],
      ['#7bc182','#95da9b','#e4c773']
    ];
    MAPS.forEach((m,i)=>{
      m.theme = nicerThemes[i % nicerThemes.length];
    });
  }

  const oldButton = button;
  button = function(x,y,w,h,label,action,col='#ffd247',fz=23,sub=''){
    buttonRects.push({x,y,w,h,action});
    let over = hover===buttonRects.length-1;
    rr(x,y+8,w,h,15,'#00000055');
    rr(x,y+3,w,h,15,'#7a4e11');
    rr(x,y,w,h,15,over ? '#fff2a7' : col,'#fff4cf',4);
    rr(x+5,y+5,w-10,h*0.42,11,'#ffffff2c');
    text(label,x+w/2,y+h/2-(sub?9:0),fz,'#2b2148','center',1000,true);
    if(sub)text(sub,x+w/2,y+h/2+17,12,'#533a1b','center',800);
  };

  header = function(title,sub){
    text('★  RANK ARENA',74,49,24,'#ffe067','left',1000,true);
    text(title,80,109,45,'#ffffff','left',1000,true);
    if(sub)text(sub,82,152,19,'#d6ecff','left',700,true);
  };

  backdrop = function(){
    c.fillStyle = gradient(0,0,W,H,['#2d7fe7','#16306d']);
    c.fillRect(0,0,W,H);
    c.save();
    c.globalAlpha=.18;
    for(let i=0;i<16;i++){
      const x=(i*97)%W, y=(i*61)%H;
      c.beginPath(); c.arc(x,y,70+(i%4)*20,0,TAU); c.fillStyle='#ffffff'; c.fill();
    }
    c.globalAlpha=.10;
    for(let x=-60;x<W+80;x+=120){
      for(let y=-40;y<H+80;y+=120){
        star(x + (y%240)*0.18, y, 10, '#d8ebff', 4);
      }
    }
    c.restore();
    c.fillStyle='#0b174f55'; c.beginPath(); c.ellipse(1120,120,220,120,0,0,TAU); c.fill();
    c.fillStyle='#ffffff22'; c.beginPath(); c.ellipse(1035,88,120,42,0,0,TAU); c.fill();
    c.beginPath(); c.ellipse(1160,80,84,34,0,0,TAU); c.fill();
  };

  const oldRankMedal = rankMedal;
  rankMedal = function(x,y,r,idx){
    c.save();
    ellipse(x,y+5,r+11,r+11,'#0000003d');
    c.beginPath(); c.arc(x,y,r+7,0,TAU); c.fillStyle='#233876'; c.fill();
    c.beginPath(); c.arc(x,y,r,0,TAU); c.fillStyle=['#c78142','#d9dfeb','#f0c847','#54baff','#c07dff','#ff6ea3','#6ef6d1','#ffe06c'][idx]; c.fill();
    c.lineWidth=5; c.strokeStyle='#fff7'; c.stroke();
    c.beginPath(); c.arc(x,y-r*0.12,r*0.72,0,Math.PI); c.strokeStyle='#fff5'; c.lineWidth=3; c.stroke();
    star(x,y,r*.62,'#fff8',5);
    text(['B','S','G','D','M','L','★','P'][idx],x,y+2,r*.66,'#2e2340','center',1000,true);
    c.restore();
  };

  // Make portraits punchier with a stronger outline and a team ring.
  const oldIconFighter = iconFighter;
  iconFighter = function(x,y,r,type,team,alpha=1){
    c.save();
    c.globalAlpha = alpha;
    ellipse(x,y+r*.9,r*1.02,r*.30,'#0005');
    c.beginPath(); c.arc(x,y,r+6,0,TAU); c.fillStyle = team===0 ? '#2ea7ff' : '#ff5b70'; c.fill();
    c.beginPath(); c.arc(x,y,r+2.5,0,TAU); c.fillStyle = '#15214a'; c.fill();
    c.restore();
    oldIconFighter(x,y,r,type,team,alpha);
    c.save();
    c.globalAlpha = alpha;
    c.beginPath(); c.arc(x,y,r+1,0,TAU); c.strokeStyle='#fff8'; c.lineWidth=2.2; c.stroke();
    c.beginPath(); c.arc(x-r*.25,y-r*.24,r*.14,0,TAU); c.fillStyle='#ffffff20'; c.fill();
    c.restore();
  };

  arena = function(){
    const a={x:FIELD.left,y:FIELD.top,w:FIELD.right-FIELD.left,h:FIELD.bottom-FIELD.top};
    rr(a.x-14,a.y-14,a.w+28,a.h+28,20,'#0d2450','#7fd7ff',5);
    rr(a.x,a.y,a.w,a.h,14,'#7ed0c1','#daf4f2',3);
    c.save(); c.beginPath(); c.rect(a.x,a.y,a.w,a.h); c.clip();

    // Ground tiles: softer and more like a bright Brawl arena.
    for(let x=a.x;x<a.x+a.w;x+=44){
      for(let y=a.y;y<a.y+a.h;y+=44){
        const alt=((x+y)/44|0)%2;
        c.fillStyle = alt ? '#85d7c9' : '#75cbbd';
        c.fillRect(x,y,44,44);
        c.fillStyle = '#ffffff12';
        c.fillRect(x+5,y+5,14,6);
      }
    }

    // Spawn zones.
    rr(356,34,568,164,18,'#4db2ff2e','#d6f3ff77',3);
    rr(356,1119,568,164,18,'#ff76882e','#ffe0e677',3);
    c.setLineDash([16,12]); c.strokeStyle='#ffffff55'; c.lineWidth=4;
    c.beginPath(); c.moveTo(340,660); c.lineTo(940,660); c.stroke(); c.setLineDash([]);

    // Bushes.
    for(let b of bushes){
      rr(b.x,b.y,b.w,b.h,12,'#3fb15c','#20693f',4);
      for(let i=0;i<10;i++){
        const px=b.x+12+(i*31)%(Math.max(18,b.w-22));
        const py=b.y+12+(i*19)%(Math.max(18,b.h-22));
        ellipse(px,py,10,7,'#7cf184aa');
        ellipse(px+3,py-2,8,5,'#4ec95faa');
      }
    }

    // Walls.
    for(let w of walls){
      rr(w.x+4,w.y+8,w.w,w.h,10,'#00000033');
      rr(w.x,w.y,w.w,w.h,10,'#4c77c6','#d2e8ff',4);
      rr(w.x+4,w.y+4,w.w-8,Math.max(12,w.h*0.34),8,'#7fb9ff55');
      for(let xx=w.x+8;xx<w.x+w.w-8;xx+=28){
        for(let yy=w.y+8;yy<w.y+w.h-8;yy+=28){
          rr(xx,yy,20,20,4,((xx+yy)/28|0)%2?'#5f8ce2':'#567fd1');
        }
      }
    }

    c.restore();
  };

  // Extra combat cosmetics: ammo pips, stronger panels and cleaner labels.
  const oldDrawCombat = drawCombat;
  drawCombat = function(){
    oldDrawCombat();
    if(screen!=='battle' || !match || !match.actors || !match.actors[0]) return;
    const p = match.actors[0];
    const h = heroes[p.type];
    rr(522,660,236,44,13,'#132b57dd','#88dcff66',2);
    text(h.name+' · '+h.cls,540,682,15,'#ffffff','left',1000,true);
    for(let i=0;i<p.ammoMax;i++){
      const filled = i < p.ammo;
      rr(542+i*24,694,16,8,4,filled?'#ffd657':'#ffffff22',filled?'#fff2aa':'#ffffff33',1.5);
    }
    if(typeof RETRO_GADGETS!=='undefined' && RETRO_GADGETS.items && RETRO_GADGETS.items[p.type]){
      text('ГАДЖЕТ: '+RETRO_GADGETS.items[p.type].name,780,682,13,'#98ffba','left',900,true);
    }
  };
})();
