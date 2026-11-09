/* Retro Ranked 2025: 24 unique character gadgets. Loaded after the main game script. */
'use strict';
(() => {
  if (typeof heroes === 'undefined' || heroes.length !== 24 || typeof makeActor !== 'function') return;
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
      default:return false;
    }
    a.gadgetUses--;
    a.gadgetCooldown=GADGETS[a.type].cd;
    a.gadgetFlash=.35;
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
