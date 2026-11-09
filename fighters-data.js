/* Rank Arena: +50 fighters data */
'use strict';
(()=>{
 if(typeof heroes==='undefined'||heroes.length!==24)return;
 const rows=[["РИКО","СТРЕЛОК","rapid","barrage","#7eddf7","ЛАЗЕРНАЯ КАРУСЕЛЬ","УСКОРЕННЫЕ ШЕСТЕРНИ","ammo"],["ДЭРРИЛ","ТАНК","scatter","dash","#658fd6","СТАЛЬНОЙ КАТОК","БРОНЕПЛАСТИНЫ","shield"],["КАРЛ","УРОН","pierce","barrage","#e6b46c","ВОЗВРАТ БУМЕРАНГА","БЫСТРАЯ КИРКА","speed"],["ДЖЕКИ","ТАНК","heavy","stun","#e6a96c","ЗЕМЛЕТРЯСЕНИЕ","ЗАЩИТНЫЙ ШЛЕМ","shield"],["ПЭМ","ПОДДЕРЖКА","fan","heal","#e77894","ЛЕЧЕБНАЯ СТАНЦИЯ","ЗАПАСНЫЕ ДЕТАЛИ","heal"],["БИБИ","ТАНК","heavy","blast","#f196c8","ГИГАНТСКИЙ ПУЗЫРЬ","СИЛОВОЙ ЗАМАХ","pulse"],["ЭМЗ","КОНТРОЛЬ","poison","field","#bf7be9","ТОКСИЧНОЕ ОБЛАКО","ВИРУСНЫЙ СПРЕЙ","cloud"],["ГЭЙЛ","КОНТРОЛЬ","fan","push","#a4dff4","СНЕЖНЫЙ ШКВАЛ","МОРОЗНАЯ ПОЛОСА","cloud"],["СПРАУТ","МЕТАТЕЛЬ","lob","field","#98ca74","СЕМЕННОЙ БАРЬЕР","ПРЫЖОК РОСТКА","dash"],["НАНИ","СТРЕЛОК","pierce","blast","#a9e7fa","УПРАВЛЯЕМАЯ СФЕРА","БЛЕСТЯЩИЙ ЩИТ","shield"],["ВОЛЬТ","УРОН","chain","barrage","#66bafb","ЭНЕРГЕТИЧЕСКИЙ ШТОРМ","ПЕРЕЗАРЯДКА","ammo"],["КОЛЕТТ","УРОН","heavy","dash","#fa9fcb","СТРЕМИТЕЛЬНЫЙ РЫВОК","ЗАЩИТНЫЙ АЛЬБОМ","shield"],["ЭМБЕР","УРОН","rapid","field","#ffaf63","ОГНЕННОЕ МОРЕ","ГОРЯЧИЕ УГЛИ","cloud"],["ЛУ","КОНТРОЛЬ","slow","stun","#9ce5eb","ЛЕДЯНАЯ ГОРКА","МОРОЗНЫЙ ЩИТ","shield"],["РАФФС","ПОДДЕРЖКА","pierce","buff","#a28aca","ПОЛЕВОЕ УСИЛЕНИЕ","БОЕВОЙ ПРИКАЗ","speed"],["БАЙРОН","ПОДДЕРЖКА","poison","heal","#b68cda","ЦЕЛЕБНЫЙ ФЛАКОН","МИКСТУРА","heal"],["ЭДГАР","УБИЙЦА","dash","jump","#765aab","ТЁМНЫЙ ПРЫЖОК","БЫСТРЫЙ ШАРФ","speed"],["СТУ","УБИЙЦА","rapid","dash","#e6ab72","ТУРБО-РЫВОК","БЫСТРЫЙ СТАРТ","dash"],["БЕЛЛЬ","СТРЕЛОК","chain","barrage","#e6bb8b","ЭЛЕКТРИЧЕСКАЯ МЕТКА","ЗАРЯЖЕННАЯ ПУЛЯ","ammo"],["СКУИК","МЕТАТЕЛЬ","lob","field","#72b7e9","ЛИПКИЙ ВЗРЫВ","КЛЕЙКАЯ ЛОВУШКА","cloud"],["БАЗЗ","УБИЙЦА","heavy","pull","#f0cf69","СПАСАТЕЛЬНЫЙ КРЮК","СПАСАТЕЛЬНЫЙ РЫВОК","dash"],["ГРИФФ","УРОН","scatter","barrage","#f2b368","ДЕНЕЖНЫЙ ВИХРЬ","КОПИЛКА","ammo"],["ЭШ","ТАНК","heavy","shield","#aaa1a7","МУСОРНАЯ БРОНЯ","ПРОЧНЫЙ КОРПУС","shield"],["МЭГ","ТАНК","rapid","turret","#eaa0ab","БОЕВОЙ МЕХАНИЗМ","ТУРБО-МОДУЛЬ","speed"],["ЛОЛА","УРОН","fan","buff","#c18feb","ЗВЁЗДНОЕ ЭХО","ПОЗА ЗВЕЗДЫ","shield"],["ФЭНГ","УБИЙЦА","dash","jump","#f2be74","ЛЕТЯЩИЙ УДАР","БЫСТРЫЕ КРОССОВКИ","dash"],["ЕВА","МЕТАТЕЛЬ","poison","field","#98d699","КИСЛОТНЫЙ РОЙ","ДОПОЛНИТЕЛЬНЫЕ ЯЙЦА","cloud"],["ДЖАНЕТ","СТРЕЛОК","pierce","jump","#f09cbd","ВОЗДУШНЫЙ КОНЦЕРТ","ЗАПАСНОЕ ТОПЛИВО","speed"],["БОННИ","СТРЕЛОК","rocket","jump","#e89a68","ПУШЕЧНЫЙ ВЫЛЕТ","ТОЧНЫЙ ПРИЦЕЛ","ammo"],["ОТИС","КОНТРОЛЬ","slow","stun","#7cbdc6","ЧЕРНИЛЬНЫЙ УДАР","ЧЕРНИЛЬНАЯ ЛУЖА","cloud"],["СЭМ","ТАНК","heavy","dash","#c47b61","МОЩНЫЕ ПЕРЧАТКИ","ЖЕЛЕЗНЫЙ ХВАТ","pulse"],["ГУС","ПОДДЕРЖКА","pierce","heal","#b5a9de","ПРИЗРАЧНЫЙ ЩИТ","ДОБРЫЙ ПРИЗРАК","heal"],["БАСТЕР","ТАНК","scatter","shield","#c9ab6d","ОТРАЖАЮЩИЙ ЭКРАН","ЗАЩИТНЫЙ КАДР","shield"],["ЧЕСТЕР","УРОН","fan","blast","#eb7594","СЮРПРИЗ В КОРОБКЕ","НЕОЖИДАННЫЙ ФОКУС","pulse"],["МЭНДИ","СТРЕЛОК","pierce","barrage","#efb9de","САХАРНЫЙ ЛУЧ","КОНФЕТНЫЙ ЗАПАС","ammo"],["ГРЕЙ","ПОДДЕРЖКА","heavy","jump","#a0a1b3","СЕКРЕТНЫЙ ПОРТАЛ","БЕЗЗВУЧНЫЙ ШАГ","dash"],["Р-Т","КОНТРОЛЬ","chain","turret","#8ca9b7","ДВОЙНОЙ ДОЗОР","СКАНЕР","pulse"],["УИЛЛОУ","МЕТАТЕЛЬ","poison","field","#9fca7c","ЯДОВИТОЕ БОЛОТО","ВОЛШЕБНЫЙ ПРУД","cloud"],["МЭЙЗИ","СТРЕЛОК","rocket","push","#bd8dca","УДАРНАЯ ВОЛНА","КОРОТКИЙ РЫВОК","dash"],["ХЭНК","ТАНК","heavy","blast","#98b3c8","МОЩНЫЙ ПУЗЫРЬ","БРОНЯ АКВАНАВТА","shield"],["КОРДЕЛИУС","УБИЙЦА","poison","invis","#9364bb","МИР ТЕНЕЙ","ГРИБНОЙ УСКОРИТЕЛЬ","speed"],["ДАГ","ПОДДЕРЖКА","scatter","heal","#e59e78","ЛЕЧЕБНЫЙ ПИКНИК","ЗАПАСНОЙ ОБЕД","heal"],["ПЕРЛ","УРОН","rapid","blast","#d79c76","ПЕРЕГРЕВ","ГОРЯЧИЙ ЗАПАС","ammo"],["ЧАРЛИ","КОНТРОЛЬ","slow","pull","#b171a1","ПАУТИННЫЙ КОКОН","ПАУТИННЫЙ КАПКАН","cloud"],["МИКО","УБИЙЦА","dash","jump","#9c8bd2","АКРОБАТИЧЕСКИЙ ПРЫЖОК","ПРИПРЫЖКА","dash"],["КИТ","УБИЙЦА","rapid","invis","#ecc68d","КОШАЧИЙ СКАЧОК","ДЕВЯТЬ ЖИЗНЕЙ","heal"],["ЛАРРИ","МЕТАТЕЛЬ","lob","turret","#b8aacb","ПОЛИЦЕЙСКИЙ НАПАРНИК","ЗАПАСНОЙ ЖЕТОН","shield"],["АНДЖЕЛО","СТРЕЛОК","poison","jump","#a7d5c2","ЯДОВИТЫЙ ПОЛЁТ","МОШКАРА","speed"],["МЕЛОДИ","УБИЙЦА","fan","buff","#e792cd","МУЗЫКАЛЬНЫЙ РАЗГОН","НОВАЯ МЕЛОДИЯ","speed"],["ДРАКО","ТАНК","rocket","blast","#d37969","ДРАКОНИЙ ОГОНЬ","ОГНЕННАЯ БРОНЯ","shield"]];

 const bases={
 'ТАНК':[6350,71,530,1.52,205,415],'СТРЕЛОК':[3180,76,640,1.55,410,605],
 'УБИЙЦА':[3750,91,570,1.47,270,570],'МЕТАТЕЛЬ':[3090,72,620,1.76,345,400],
 'КОНТРОЛЬ':[3820,74,530,1.53,330,465],'ПОДДЕРЖКА':[3930,76,450,1.45,325,510],
 'УРОН':[4220,79,615,1.50,340,520]
 };
 const shotRoles={rapid:'СКОРОСТНАЯ ОЧЕРЕДЬ',scatter:'ДРОБОВИК',fan:'ВЕЕР СНАРЯДОВ',pierce:'ПРОБИВАЮЩИЙ ВЫСТРЕЛ',rocket:'РАКЕТНЫЙ УДАР',lob:'БРОСОК ЧЕРЕЗ СТЕНУ',poison:'ЯДОВИТЫЙ СНАРЯД',slow:'ЗАМЕДЛЯЮЩИЙ ВЫСТРЕЛ',chain:'ЭНЕРГЕТИЧЕСКАЯ ЦЕПЬ',heavy:'МОЩНЫЙ УДАР',dash:'БЛИЖНИЙ РЫВОК'};
 rows.forEach(([name,cls,shotKind,superKind,color,superName,gadgetName,gadgetKind],i)=>{
 const b=bases[cls];if(!b||!shotRoles[shotKind])throw Error('Wrong class or shot: '+name);
 const rangeMult=['rapid','pierce','rocket','chain'].includes(shotKind)?1.12:shotKind==='heavy'||shotKind==='dash'?.69:1;
 const dmgMult={rapid:.43,scatter:.49,fan:.54,dash:1.12,heavy:1.26,rocket:1.19,lob:.93,chain:.89}[shotKind]||1;
 heroes.push({
  name,en:name,cls,role:shotRoles[shotKind],hp:b[0]+((i*127)%580)-230,
  speed:Math.min(97,b[1]+(i%5)-2),dmg:Math.round(b[2]*dmgMult*(.92+(i%4)*.035)),
  reload:Math.round((b[3]+(i%4)*.055)*100)/100,
  range:Math.round(b[4]*rangeMult+(i%4)*9),proj:b[5]+(i%5)*20,
  color,accent:['#fff5d0','#e5f9ff','#ffdef2','#dcffdc'][i%4],
  super:superName,desc:'АТАКА: '+shotRoles[shotKind]+' · СУПЕР: '+superName,
  shotKind,superKind,gadgetName,gadgetKind,avatar:i,extra:true,
  counters:[],weak:[]
 });
 });
 const beats={
 'ТАНК':['УБИЙЦА','УРОН'],'СТРЕЛОК':['ТАНК','МЕТАТЕЛЬ'],
 'УБИЙЦА':['СТРЕЛОК','МЕТАТЕЛЬ'],'МЕТАТЕЛЬ':['ТАНК','КОНТРОЛЬ'],
 'КОНТРОЛЬ':['УБИЙЦА','ПОДДЕРЖКА'],'УРОН':['КОНТРОЛЬ','ПОДДЕРЖКА'],
 'ПОДДЕРЖКА':['УРОН','МЕТАТЕЛЬ']
 };
 const choose=(pool,n,seed)=>pool.sort((a,b)=>((a*41+seed*73)%127)-((b*41+seed*73)%127)).slice(0,n);
 for(let i=24;i<heroes.length;i++){
  const h=heroes[i],good=[],bad=[];
  for(let j=0;j<heroes.length;j++){
    if(j===i)continue;
    if(beats[h.cls].includes(heroes[j].cls))good.push(j);
    if((beats[heroes[j].cls]||[]).includes(h.cls))bad.push(j);
  }
  h.counters=choose(good,6,i);
  h.weak=choose(bad.filter(j=>!h.counters.includes(j)),6,i+14);
 }
 for(let i=0;i<24;i++){
  const h=heroes[i],good=[],bad=[];
  for(let j=24;j<heroes.length;j++){
   if((beats[h.cls]||[]).includes(heroes[j].cls))good.push(j);
   if((beats[heroes[j].cls]||[]).includes(h.cls))bad.push(j);
  }
  h.counters.push(...choose(good,4,i));
  h.weak.push(...choose(bad,4,i+30));
 }
 window.NEW_FIGHTERS_COUNT=rows.length;
})();