/* ═══════════════════════════════════════════════════════════════
   EFFETS VISUELS : tampons, bulles, confettis, podium,
   scènes animées (course de fusées, combat contre le prof, classement)
═══════════════════════════════════════════════════════════════ */
var FX_COLORS=["#D9606A","#F6C453","#2E9E7E","#4A86CF","#8A6CC9","#C95B82","#FFE59A"];
/* anciennes couleurs vives → couleurs de feutres v3.4 */
var SOFTC={"#2E9E7E":"#2E9E7E","#4A86CF":"#4A86CF","#D9606A":"#D9606A","#D59A2E":"#D59A2E","#8A6CC9":"#8A6CC9","#5B55C4":"#5B55C4","#C95B82":"#C95B82"};
function softc(c){return SOFTC[c]||c;}
function fxLayer(){var l=$("fx-layer");if(!l){l=document.createElement("div");l.id="fx-layer";l.className="fx-layer";document.body.appendChild(l);}return l;}
function fxReduced(){try{return window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;}catch(e){return false;}}
/* grand tampon au centre : « Bravo ! », « Éclair ! »… */
function fxStamp(text,bg,icon,dur){
  var l=fxLayer(),d=document.createElement("div");
  d.className="fx-stamp";d.style.background=softc(bg)||"var(--violet)";
  d.innerHTML=(icon?ICO[icon]||"":"")+"<span>"+esc(text)+"</span>";
  l.appendChild(d);setTimeout(function(){d.remove();},dur||1600);
}
/* petite bulle qui monte (événements en direct sur l’écran du prof) */
var FX_BUB=0;
function fxBubble(text,bg,icon,side){
  var l=fxLayer(),d=document.createElement("div"),small=window.innerWidth<760||document.body.classList.contains("v-mob");
  bg=softc(bg);if(small){Array.prototype.forEach.call(l.querySelectorAll(".fx-bubble"),function(x){x.remove();});d.className="fx-bubble sm";d.style.background=bg||"var(--violet)";d.innerHTML=(icon?ICO[icon]||"":"")+"<span>"+esc(text)+"</span>";l.appendChild(d);setTimeout(function(){d.remove();},2400);return;}
  d.className="fx-bubble";d.style.background=bg||"var(--violet)";
  var slot=(FX_BUB++)%5;
  d.style.bottom=(8+slot*9)+"%";
  if(side==="left")d.style.left=(2+Math.random()*10)+"%";else d.style.right=(2+Math.random()*10)+"%";
  d.innerHTML=(icon?ICO[icon]||"":"")+"<span>"+esc(text)+"</span>";
  l.appendChild(d);setTimeout(function(){d.remove();},2700);
}
function fxFlash(color){var l=fxLayer(),d=document.createElement("div");d.className="fx-flash";d.style.background=color;l.appendChild(d);setTimeout(function(){d.remove();},750);}
function fxPts(text,x,y,color){var l=fxLayer(),d=document.createElement("div");d.className="fx-pts";d.textContent=text;d.style.left=x+"px";d.style.top=y+"px";if(color)d.style.color=color;l.appendChild(d);setTimeout(function(){d.remove();},1450);}

/* confettis : burst depuis un point, ou pluie */
var CONF={c:null,p:[],raf:0};
function confetti(opt){
  if(fxReduced())return;
  opt=opt||{};
  if(!CONF.c){CONF.c=document.createElement("canvas");CONF.c.className="fx-confetti";document.body.appendChild(CONF.c);}
  var cv=CONF.c,W=cv.width=window.innerWidth,H=cv.height=window.innerHeight,n=opt.n||140;
  for(var i=0;i<n;i++){
    var rain=opt.rain,x=rain?Math.random()*W:(opt.x!==undefined?opt.x:W/2),y=rain?-20-Math.random()*H*0.5:(opt.y!==undefined?opt.y:H*0.45);
    var a=Math.random()*Math.PI*2,s=rain?1+Math.random()*2:4+Math.random()*9;
    CONF.p.push({x:x,y:y,vx:rain?(Math.random()-0.5)*2:Math.cos(a)*s,vy:rain?2+Math.random()*3:Math.sin(a)*s-6,r:4+Math.random()*6,c:(opt.colors||FX_COLORS)[i%(opt.colors||FX_COLORS).length],rot:Math.random()*6,vr:(Math.random()-0.5)*0.3,life:rain?260:150+Math.random()*60,shape:i%3});
  }
  if(!CONF.raf)CONF.raf=requestAnimationFrame(confStep);
}
function confStep(){
  var cv=CONF.c,g=cv.getContext("2d");g.clearRect(0,0,cv.width,cv.height);
  CONF.p=CONF.p.filter(function(p){return p.life>0&&p.y<cv.height+30;});
  CONF.p.forEach(function(p){
    p.vy+=0.18;p.vx*=0.99;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;p.life--;
    g.save();g.translate(p.x,p.y);g.rotate(p.rot);g.fillStyle=p.c;g.globalAlpha=Math.min(1,p.life/40);
    if(p.shape===0)g.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);
    else if(p.shape===1){g.beginPath();g.arc(0,0,p.r/2.4,0,6.3);g.fill();}
    else{g.beginPath();g.moveTo(0,-p.r/2);g.lineTo(p.r/2,p.r/2);g.lineTo(-p.r/2,p.r/2);g.fill();}
    g.restore();
  });
  if(CONF.p.length)CONF.raf=requestAnimationFrame(confStep);else{CONF.raf=0;g.clearRect(0,0,cv.width,cv.height);}
}

/* ─── Fin de partie : guirlande d’ampoules (3ᵉ, puis 2ᵉ, puis 1ᵉʳ s’allument) ───
   entries = [{name, sub, color, ini}] (ordre : 1er, 2e, 3e) */
function podiumHtml(entries){
  var order=[1,0,2],h='<div class="podium" role="list"><span class="wire" aria-hidden="true"></span>';
  order.forEach(function(i){
    var e=entries[i];
    h+='<div class="pod p'+(i+1)+(e?"":" empty")+'" data-r="'+(i+1)+'" role="listitem"><span class="cord"></span><span class="bulb" aria-hidden="true"><span class="cap"></span><span class="glass">'+(i+1)+"</span></span>"+
      (e?'<div class="who">'+(i===0?'<div class="crown">'+ICO.crown+"</div>":"")+'<div class="av" style="background:'+esc(e.color||"#5B55C4")+'">'+esc(e.ini||"?")+'</div><div class="nm">'+esc(e.name)+'</div><div class="sc">'+esc(e.sub||"")+"</div></div>":'<div class="who"></div>')+"</div>";
  });
  return h+"</div>";
}
function playPodium(root,onDone,silent){
  var p3=root.querySelector(".pod.p3"),p2=root.querySelector(".pod.p2"),p1=root.querySelector(".pod.p1");
  if(!silent)SND.drum(14);
  setTimeout(function(){if(p3){p3.classList.add("show");if(!silent)SND.pop();}},400);
  setTimeout(function(){if(p2){p2.classList.add("show");if(!silent)SND.pop();}},1500);
  setTimeout(function(){
    if(p1)p1.classList.add("show");
    if(!silent)SND.fanfare();
    var r=p1?p1.getBoundingClientRect():null;
    confetti({n:180,x:r?r.left+r.width/2:undefined,y:r?r.top:undefined});
    setTimeout(function(){confetti({rain:true,n:160});},700);
    if(onDone)setTimeout(onDone,1400);
  },2700);
}
function initials(s){var w=String(s||"?").replace(/^Les\s+/i,"").trim().split(/\s+/);return ((w[0]||"?").charAt(0)+(w[1]?w[1].charAt(0):"")).toUpperCase();}

/* ═══ Scène « Duel » : course de fusées ═══ */
function rocketSvg(color){
  return '<svg viewBox="0 0 80 40" class="rk"><g class="flm"><path d="M14 20c-6-6-12-5-14 0 2 5 8 6 14 0z" fill="#EFB443"/><path d="M14 20c-4-3-8-3-9 0 1 3 5 3 9 0z" fill="#FFF3B0"/></g>'+
    '<path d="M16 12h34c10 0 20 4 26 8-6 4-16 8-26 8H16z" fill="'+color+'"/><path d="M16 12l-6-8h12l10 8zM16 28l-6 8h12l10-8z" fill="'+color+'" opacity=".75"/>'+
    '<circle cx="54" cy="20" r="6" fill="#fff"/><circle cx="54" cy="20" r="3.6" fill="#BFE3FF"/><path d="M30 14h4v12h-4z" fill="#fff" opacity=".35"/></svg>';
}
function raceHtml(teams){
  var h='<div class="race">';
  teams.forEach(function(t,i){
    h+='<div class="lane" data-t="'+i+'"><div class="ln-name" style="color:'+t.d+'">'+esc(t.n)+'</div><div class="track"><div class="finish">'+ICO.flag+'</div>'+
      '<div class="rocket" style="left:4%">'+rocketSvg(t.c)+'<b class="rk-sc">0</b></div></div></div>';
  });
  return h+"</div>";
}
/* scores : tableau ; progress : 0..1 avancement de la partie */
function raceUpdate(root,scores,progress,boost){
  var mx=Math.max.apply(null,scores.concat([1])),lead=8+80*clamp(progress,0,1);
  $$(".lane",root).forEach(function(l){
    var i=+l.getAttribute("data-t"),r=l.querySelector(".rocket"),s=scores[i]||0;
    r.style.left=(4+(lead-4)*(s/mx))+"%";
    r.querySelector(".rk-sc").textContent=fmtInt(s);
    if(boost&&boost[i]>0){r.classList.remove("boost");void r.offsetWidth;r.classList.add("boost");}
    l.classList.toggle("lead",s===mx&&s>0);
  });
}

/* ═══ Scène « Classe VS Prof » ═══ */
function bossSvg(){
  return '<svg viewBox="0 0 160 170" class="boss-svg"><ellipse cx="80" cy="162" rx="52" ry="7" fill="rgba(0,0,0,.12)"/>'+
  '<path d="M30 70c0-30 22-50 50-50s50 20 50 50v58c0 16-12 28-28 28H58c-16 0-28-12-28-28z" fill="#8A6CC9"/>'+
  '<path d="M44 108c10 12 62 12 72 0" fill="none" stroke="#5E2FC2" stroke-width="5" stroke-linecap="round" class="mouth"/>'+
  '<g class="eyes"><circle cx="60" cy="72" r="15" fill="#fff"/><circle cx="100" cy="72" r="15" fill="#fff"/><circle cx="63" cy="74" r="6.5" fill="#262A4F"/><circle cx="97" cy="74" r="6.5" fill="#262A4F"/>'+
  '<circle cx="60" cy="72" r="17" fill="none" stroke="#262A4F" stroke-width="4"/><circle cx="100" cy="72" r="17" fill="none" stroke="#262A4F" stroke-width="4"/><path d="M77 72h6" stroke="#262A4F" stroke-width="4"/></g>'+
  '<path d="M42 50l26 8M118 50l-26 8" stroke="#3B2F8F" stroke-width="6" stroke-linecap="round" class="brows"/>'+
  '<path d="M24 26 80 6l56 20-56 20z" fill="#262A4F"/><path d="M52 34v14c18 8 38 8 56 0V34" fill="#262A4F"/><path d="M136 26v26" stroke="#EFB443" stroke-width="4"/><circle cx="136" cy="54" r="5" fill="#EFB443"/>'+
  '<path d="M30 112c-12 2-20 10-22 20" stroke="#8A6CC9" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M130 112c12 2 18-6 20-16" stroke="#8A6CC9" stroke-width="10" stroke-linecap="round" fill="none"/>'+
  '<rect x="144" y="74" width="8" height="26" rx="3" fill="#fff" transform="rotate(20 148 87)"/>'+
  '<g class="boss-ko hidden"><path d="M50 64l20 16M70 64 50 80M90 64l20 16M110 64 90 80" stroke="#262A4F" stroke-width="5" stroke-linecap="round"/></g></svg>';
}
function classSvg(){
  var cs=["#D9606A","#4A86CF","#E2A847","#2E9E7E","#C95B82"],h='<svg viewBox="0 0 200 120" class="class-svg"><ellipse cx="100" cy="114" rx="88" ry="6" fill="rgba(0,0,0,.1)"/>';
  [[30,70,24],[70,62,28],[112,66,26],[152,72,22],[92,90,20]].forEach(function(b,i){
    var x=b[0],y=b[1],r=b[2];
    h+='<g class="kid" style="animation-delay:'+(i*0.15)+'s"><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+cs[i]+'"/><circle cx="'+(x-r*0.33)+'" cy="'+(y-r*0.12)+'" r="'+r*0.2+'" fill="#fff"/><circle cx="'+(x+r*0.33)+'" cy="'+(y-r*0.12)+'" r="'+r*0.2+'" fill="#fff"/>'+
      '<circle cx="'+(x-r*0.3)+'" cy="'+(y-r*0.08)+'" r="'+r*0.1+'" fill="#262A4F"/><circle cx="'+(x+r*0.36)+'" cy="'+(y-r*0.08)+'" r="'+r*0.1+'" fill="#262A4F"/><path d="M'+(x-r*0.3)+' '+(y+r*0.3)+'q'+r*0.3+' '+r*0.3+' '+r*0.6+' 0" stroke="#262A4F" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
  });
  return h+"</svg>";
}
function bossHtml(){
  return '<div class="arena"><div class="fighter f-class"><div class="hpw"><b>La Classe</b><div class="hp"><i class="hp-c" style="width:100%"></i></div><span class="hp-n hp-cn">100</span></div>'+classSvg()+'</div>'+
    '<div class="vs">VS</div><div class="fighter f-boss"><div class="hpw"><b>Le Prof</b><div class="hp boss"><i class="hp-p" style="width:100%"></i></div><span class="hp-n hp-pn">100</span></div>'+bossSvg()+'</div><div class="shots"></div></div>';
}
/* st = {pc,pp,mc,mp} ; dmg = {toProf, toClass} */
function bossUpdate(root,st,dmg){
  var pc=Math.max(0,st.pc),pp=Math.max(0,st.pp);
  var c=root.querySelector(".hp-c"),p=root.querySelector(".hp-p");
  if(!c||!p)return;
  c.style.width=(100*pc/st.mc)+"%";p.style.width=(100*pp/st.mp)+"%";
  root.querySelector(".hp-cn").textContent=Math.round(pc);root.querySelector(".hp-pn").textContent=Math.round(pp);
  root.querySelector(".boss-ko").classList.toggle("hidden",pp>0);
  var boss=root.querySelector(".f-boss"),cls=root.querySelector(".f-class"),shots=root.querySelector(".shots");
  if(!dmg)return;
  if(dmg.toProf>0){
    for(var i=0;i<Math.min(6,1+Math.round(dmg.toProf/6));i++){
      (function(k){setTimeout(function(){var s=document.createElement("div");s.className="shot star";s.innerHTML=ICO.star;s.style.top=(30+Math.random()*30)+"%";shots.appendChild(s);setTimeout(function(){s.remove();},800);},k*110);})(i);
    }
    setTimeout(function(){boss.classList.remove("hit");void boss.offsetWidth;boss.classList.add("hit");SND.hit();dmgNum(boss,"−"+Math.round(dmg.toProf),"#D9606A");},650);
  }
  if(dmg.toClass>0){
    setTimeout(function(){
      var s=document.createElement("div");s.className="shot zap";s.innerHTML=ICO.bolt;s.style.top=(35+Math.random()*20)+"%";shots.appendChild(s);setTimeout(function(){s.remove();},800);
      setTimeout(function(){cls.classList.remove("hit");void cls.offsetWidth;cls.classList.add("hit");dmgNum(cls,"−"+Math.round(dmg.toClass),"#8A6CC9");},600);
    },dmg.toProf>0?900:100);
  }
}
function dmgNum(el,txt,color){var d=document.createElement("div");d.className="dmg";d.textContent=txt;d.style.color=softc(color);el.appendChild(d);setTimeout(function(){d.remove();},1300);}

/* ═══ Scène « Un contre tous » : top 5 animé ═══ */
function leaderHtml(){return '<div class="leader"></div>';}
function leaderUpdate(root,list,prevRanks){
  /* list = [{id,p,s,dl}] trié ; prevRanks = {id:rang précédent} */
  var box=root.querySelector(".leader");if(!box)return;
  var top=list.slice(0,5),mx=Math.max.apply(null,top.map(function(x){return x.s;}).concat([1]));
  box.innerHTML=top.map(function(x,i){
    var pr=prevRanks&&prevRanks[x.id]!==undefined?prevRanks[x.id]:i,mv=pr-i;
    return '<div class="lrow'+(i===0?" first":"")+'" style="animation-delay:'+(i*0.08)+'s"><span class="lrk">'+(i+1)+'</span><span class="lnm">'+esc(x.p)+'</span>'+
      (mv>0?'<span class="lmv up">▲'+mv+'</span>':mv<0?'<span class="lmv dn">▼'+(-mv)+'</span>':'<span class="lmv"></span>')+
      '<span class="lbar"><i style="width:'+Math.max(4,100*x.s/mx)+'%"></i></span><span class="lsc">'+fmtInt(x.s)+(x.dl?'<small>+'+fmtInt(x.dl)+'</small>':"")+'</span></div>';
  }).join("")||'<div class="muted" style="text-align:center;padding:1rem">Le classement apparaîtra après la première question.</div>';
}
