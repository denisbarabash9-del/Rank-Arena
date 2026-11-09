/* Illustrated rank icons: Bronze, Silver, Gold, Diamond, Mythic, Legend, Master, Pro */
'use strict';
(()=>{
 const themes=[
 ['#713e24','#e78d48','#ffe3a1','#ac6036'],
 ['#485777','#b8d6ff','#ffffff','#7c93ca'],
 ['#975015','#ffb92e','#fff6b2','#f18e1e'],
 ['#1f4ca7','#37ccff','#e8faff','#8571ec'],
 ['#59209d','#df4dff','#ffe9ff','#ffaed9'],
 ['#a21e36','#ff5366','#fff1a8','#f3af39'],
 ['#5817a2','#ac5bff','#fff1ff','#e4ae43'],
 ['#007baf','#37ecff','#ffffff','#ffc94c']
 ];
 const images=themes.map((p,i)=>{
 const d=p[0],b=p[1],l=p[2],e=p[3],crown=i>=4;
 const svg=['<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 180 180">',
 '<defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+l+'"/><stop offset=".4" stop-color="'+b+'"/><stop offset="1" stop-color="'+d+'"/></linearGradient>',
 '<radialGradient id="g"><stop stop-color="'+l+'"/><stop offset=".45" stop-color="'+b+'"/><stop offset="1" stop-color="'+d+'"/></radialGradient></defs>',
 '<g stroke-linejoin="round">',
 '<path d="M65 72Q24 35 8 45L25 77 5 77Q20 111 68 112Z M115 72Q156 35 172 45L155 77 175 77Q160 111 112 112Z" fill="url(#m)" stroke="'+d+'" stroke-width="4"/>',
 '<path d="M56 82L19 58 36 93 65 102 M124 82L161 58 144 93 115 102" fill="'+l+'" opacity=".55"/>',
 '<path d="M52 116L28 146 59 140 90 172 121 140 152 146 128 116Z" fill="'+e+'" stroke="'+d+'" stroke-width="5"/>',
 crown?'<path d="M49 61L34 27 63 40 90 10 117 40 146 27 131 61Z" fill="url(#m)" stroke="'+d+'" stroke-width="4"/><path d="M90 13L100 28 90 43 80 28Z" fill="url(#g)" stroke="'+l+'" stroke-width="2"/>':'',
 '<path d="M90 28L141 46 152 91 132 135 90 162 48 135 28 91 39 46Z" fill="url(#m)" stroke="'+d+'" stroke-width="9"/>',
 '<path d="M90 42L128 57 137 90 119 124 90 143 61 124 43 90 52 57Z" fill="'+d+'" stroke="'+l+'" stroke-width="3"/>',
 '<path d="M90 45L128 58 135 90 120 122 90 139Z" fill="'+b+'" opacity=".25"/>',
 i>=3?'<path d="M90 44L101 60 90 75 79 60Z M90 125L102 140 90 157 78 140Z" fill="url(#g)" stroke="'+l+'" stroke-width="2"/>':'',
 '<path d="M90 64L100 82 122 87 105 101 110 122 90 111 70 122 75 101 58 87 80 82Z" fill="url(#g)" stroke="'+l+'" stroke-width="4"/>',
 '<path d="M90 64L90 110 70 120 75 101 60 87 80 82Z" fill="'+l+'" opacity=".45"/>',
 i>=5?'<path d="M61 117Q47 99 52 81 M119 117Q133 99 128 81" stroke="'+e+'" stroke-width="4" fill="none"/>':'',
 '<path d="M52 56L74 47" stroke="'+l+'" stroke-width="4" opacity=".85"/>',
 i>=2?'<path d="M57 61L59 68 66 70 59 72 57 79 55 72 48 70 55 68Z" fill="'+l+'"/>':'',
 i>=6?'<path d="M137 61L139 68 146 70 139 72 137 79 135 72 128 70 135 68Z" fill="'+l+'"/>':'',
 '</g></svg>'].join('');
 const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);return im;
 });
 const previous=rankMedal;
 rankMedal=function(x,y,r,rank){
 const idx=Math.max(0,Math.min(7,rank|0)),im=images[idx];
 if(!im.complete||!im.naturalWidth){previous(x,y,r,idx);return;}
 const sz=r*2.55;c.save();c.shadowColor=themes[idx][1];c.shadowBlur=idx>3?12:6;c.drawImage(im,x-sz/2,y-sz/2,sz,sz);c.restore();
 };
 window.rankGalleryDraw=function(){
 backdrop();text('РАНГИ RANK ARENA',640,46,42,'#ffe6a8','center',1000,true);
 text('ПУТЬ ОТ БРОНЗЫ ДО ПРО',640,93,20,'#bce2ff','center',900);
 for(let i=0;i<8;i++){
 const x=22+i%4*316,y=122+Math.floor(i/4)*254;
 rr(x,y,296,239,18,i===rankIdx()?'#26396f':'#19224b',i===rankIdx()?'#ffdb64':'#5d83c2',i===rankIdx()?4:2);
 rankMedal(x+148,y+94,68,i);
 text(rankNames[i],x+148,y+186,i===4?20:23,'#fff','center',1000,true);
 text(rankThresholds[i].toLocaleString('ru-RU')+' ОЧКОВ',x+148,y+216,15,'#c2dbf8','center',900);
 }
 text('ТВОЙ РАНГ: '+rankDivision()+'  ·  '+rankPoints.toLocaleString('ru-RU')+' ОЧКОВ',640,643,19,'#ffe19d','center',900);
 button(489,658,300,48,'НАЗАД',()=>{screen='menu'},'#ffd15c',21);
 };
})();
