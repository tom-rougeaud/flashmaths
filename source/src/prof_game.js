/* ═══════════════════════════════════════════════════════════════
   PAGE PROF — 4. Le jeu : questions, chrono, correction, scènes
═══════════════════════════════════════════════════════════════ */
function qPayload(q,i){
  var o=qPublic(q);o.t="q";o.i=i;o.N=G.qs.length;o.dur=G.dur;
  if(G.rd)o.rd=G.rd;if(G.pts==="juste")o.sm="juste";
  return o;
}
function wideKind(q){var k=qKind(q);return k==="assoc"||k==="ordre"||k==="slider";}
function showGameScreen(){
  show("s-game");
  var sc=$("g-scene");
  if(G.mode==="duel"){sc.innerHTML='<h3>La course des équipes</h3>'+raceHtml(G.teams.map(function(t,k){var T=TEAMS[k];return {n:t.n,c:T.c,d:T.d};}));raceUpdate(sc,G.tscore,(G.i+1)/G.qs.length);}
  else if(G.mode==="boss"){sc.innerHTML=bossHtml();bossUpdate(sc,G.boss);}
  else{sc.innerHTML='<h3>Top 5</h3>'+leaderHtml();leaderUpdate(sc,rankList(),null);}
}
function startGame(){
  if(!G)return;
  if(G.phase!=="lobby"){showGameScreen();return;}
  if(!online().length){toast("Aucun élève connecté.");return;}
  if(G.mode==="duel"){plist().forEach(function(p){if(p.team<0||p.team>=G.teams.length)p.team=smallestTeam();});G.lk=true;}
  G.qs=QS.map(function(q){return JSON.parse(JSON.stringify(q));});
  rememberPlayed(G.qs);
  G.i=-1;G.hist=[];G.tscore=G.teams.map(function(){return 0;});
  G.boss={pc:100,pp:100,mc:100,mp:100};
  /* mode automatique : activé d’office en « Classe VS Prof », sinon selon le réglage ; modifiable en jeu */
  G.auto=G.mode==="boss"?true:!!P.auto;autoBtn();
  G.pts=P.pts==="juste"?"juste":"vite";G.read=Math.max(0,Math.min(10,+P.read||0));
  plist().forEach(function(p){p.score=0;p.ok=0;p.na=0;p.streak=0;p.best=0;p.free=0;p.wire=0;p.fast=0;p.ans={};});
  G.phase="cd";pushLobby();hostPing(false);
  showGameScreen();
  showRules(function(){countdown(function(){nextQuestion();});});
}
/* départ : les trois ampoules s’allument une à une */
function countdown(cb){
  var cd=$("g-cd"),n=3,g=G,bs=$$("#g-cdb i");cd.classList.remove("hidden");
  bs.forEach(function(b){b.classList.remove("on");});
  send({t:"cd",n:3,N:G.qs.length});
  function step(){
    if(!G||G!==g||G.phase!=="cd"){cd.classList.add("hidden");return;}   /* partie écourtée ou fermée pendant le compte à rebours */
    if(n>0){if(bs[3-n])bs[3-n].classList.add("on");$("g-cdt").textContent=n===3?"Prêts ?":n===2?"On se concentre…":"C’est parti !";SND.tock();n--;setTimeout(step,850);}
    else{cd.classList.add("hidden");SND.go();cb();}
  }
  step();
}
/* ─── colonne en direct : les prénoms s’empilent à mesure que les réponses arrivent ─── */
function liveReset(){$("gl-list").innerHTML="";$("g-live").classList.remove("lit","two");liveCount();}
function liveCount(){
  if(!G)return;
  var n=Object.keys(G.ans||{}).length,on=online().length;
  $("gl-n").textContent=n;$("gl-t").textContent=(n>1?"réponses":"réponse")+" sur "+on;
  $("g-live").classList.toggle("lit",n>0);$("g-live").classList.toggle("two",n>14);
}
function liveAdd(p){
  var T=G.mode==="duel"&&p.team>=0&&p.team<TEAMS.length?TEAMS[p.team]:null,li=document.createElement("li");
  li.setAttribute("data-id",p.id);
  if(T){li.style.setProperty("--tc",T.d);li.style.setProperty("--tl",T.l);}
  li.innerHTML="<i></i><span>"+esc(p.p)+"</span>";
  $("gl-list").appendChild(li);liveCount();
  var box=$("g-live");if(box.scrollHeight>box.clientHeight)box.scrollTop=box.scrollHeight;
}
function liveReveal(){
  if(P.names===false)return;
  $$("#gl-list li").forEach(function(li){var a=G.ans[li.getAttribute("data-id")];if(!a)return;li.classList.add(a.ok?"ok":a.part>0?"pa":"ko");});
}
function nextQuestion(){
  if(!G||G.phase==="end"||G.phase==="lobby")return;
  clearInterval(G.autoT);clearTimeout(G.autoT);
  G.i++;
  if(G.i>=G.qs.length){endGame(false);return;}
  var q=G.qs[G.i];
  G.rd=(G.read||0)*1000;
  G.phase="q";G.cur=true;G.ans={};G.hostAns=null;G.qStart=Date.now()+G.rd;G.dur=qDur(q)*1000;G.extra=0;G.bub=0;G.lowS=-1;
  liveReset();
  $("g-qn").textContent="Question "+(G.i+1)+" / "+G.qs.length;
  $("g-meta").innerHTML=kindTagHtml(q)+'<span class="tag">'+esc(q.titre||"")+"</span>";
  $("g-q").innerHTML=rt(q.q)+figBlock(q.fig);
  var kd=qKind(q);
  if(q.libre)$("g-choices").innerHTML='<div class="g-hidden" style="grid-column:1/-1">'+ICO.keyb+"Répondez sur votre téléphone avec le clavier</div>";
  else if(wideKind(q))$("g-choices").innerHTML='<div class="g-wide">'+(kd==="slider"?scaleHtml(q.sl,{big:true}):P.hide?'<div class="g-hidden">'+ICO.eyeoff+"Les tuiles sont sur vos téléphones</div>":kd==="assoc"?assocHtml(q):ordreHtml(q))+'<div class="g-how">'+(kd==="slider"?"Estimez avec le curseur sur votre téléphone":kd==="assoc"?"Associez les tuiles deux par deux":"Remettez les tuiles dans l’ordre"+(q.how?" : "+esc(q.how):""))+"</div></div>";
  else if(P.hide)$("g-choices").innerHTML='<div class="g-hidden" style="grid-column:1/-1">'+ICO.eyeoff+"Les propositions sont sur vos téléphones</div>";
  else $("g-choices").innerHTML=q.choices.map(function(c,k){return '<div class="gch a'+k+'"><span class="sh">'+SHAPES[k]+"</span><span>"+rt(c.t)+"</span></div>";}).join("");
  $("g-choices").style.gridTemplateColumns=(!q.libre&&!wideKind(q)&&!P.hide&&q.choices.length===2)?"1fr 1fr":"";
  $("g-rev").classList.add("hidden");$("g-rev").innerHTML="";$("g-qbox").classList.remove("rv");
  $("g-timer").classList.remove("hidden","low");
  $("g-next").innerHTML=ICO.check+"Corriger maintenant";$("g-plus").disabled=false;
  $("g-scene").classList.add("small");
  $("g-choices").classList.toggle("veil",G.rd>0);$("g-timer").classList.toggle("read",G.rd>0);
  updateAnswered();
  send(qPayload(q,G.i));snapshot();
  clearInterval(G.tick);G.tick=setInterval(tick,200);tick();
}
function remaining(){return G.dur+G.extra-(Date.now()-G.qStart);}
function tick(){
  if(!G||G.phase!=="q")return;
  var rem=remaining(),tot=G.dur+G.extra,s=Math.max(0,Math.ceil(rem/1000));
  /* temps de lecture : énoncé seul, propositions voilées, chrono plein */
  if(rem>tot){$("g-sec").textContent=Math.ceil((rem-tot)/1000);$("g-ring").style.strokeDashoffset="0";$("g-timer").classList.add("read");return;}
  if($("g-timer").classList.contains("read")){$("g-timer").classList.remove("read");$("g-choices").classList.remove("veil");SND.pop();}
  $("g-sec").textContent=s;
  $("g-ring").style.strokeDashoffset=String(276.5*(1-Math.max(0,rem)/tot));
  var low=rem<=5000;$("g-timer").classList.toggle("low",low);
  if(low&&s!==G.lowS&&s>0){G.lowS=s;SND.tick();}
  if(rem<=0)reveal();
}
function updateAnswered(){
  hostIndicator();liveCount();
  if(G&&$("g-players"))$("g-players").innerHTML=ICO.users+"Joueurs ("+online().length+")";
  if(!G||(G.phase!=="q"&&G.phase!=="rv"))return;
  var on=online(),n=on.filter(function(p){return G.ans[p.id];}).length;
  var el=$("g-ans");el.textContent=n+" / "+on.length+" ont répondu";
  el.classList.remove("pulse");void el.offsetWidth;el.classList.add("pulse");
  if(G.phase==="q"&&P.early!==false&&on.length&&n>=on.length&&!G.earlyT)G.earlyT=setTimeout(function(){G.earlyT=null;if(G.phase==="q")reveal();},900);
}
function recvAnswer(p,m){
  if(G.phase!=="q"||m.i!==G.i||G.ans[p.id])return;
  var q=G.qs[G.i],el=Math.max(0,Date.now()-G.qStart),lim=G.dur+G.extra;
  if(el>lim+1500)return;
  var ms=+m.ms;if(!(ms>=0))ms=el;
  var t=clamp(Math.min(el,Math.max(ms,el-2500)),0,lim);
  var res=judgeMsg(q,m);
  res.t=t;res.rem=lim-el;
  G.ans[p.id]=res;
  /* effets en direct (sans dévoiler la justesse) */
  var T=G.mode==="duel"&&p.team>=0&&p.team<TEAMS.length?TEAMS[p.team]:null,col=T?T.c:"var(--violet)";
  liveAdd(p);
  if(G.pts==="juste")SND.pop();
  else if(t<Math.min(0.25*lim,6000)&&G.bub<4){G.bub++;fxBubble(p.p+" : réponse éclair !","#D59A2E","bolt",G.bub%2?"left":"right");SND.bolt();}
  else if(res.rem<=3000&&lim>=10000){fxBubble(p.p+" : sur le fil !",col==="var(--violet)"?"#D9606A":col,"clock",Math.random()<0.5?"left":"right");}
  else SND.pop();
  updateAnswered();
}
/* nettoie la réponse reçue (jamais confiance au réseau) puis la corrige */
function cleanV(q,v){
  var k=qKind(q);
  if(k==="libre")return String(v===undefined||v===null?"":v).slice(0,40);
  if(k==="assoc"||k==="ordre"){var n=k==="assoc"?q.L.length:q.D.length;return Array.isArray(v)?v.slice(0,n).map(function(x){x=x|0;return x>=0&&x<n?x:0;}):[];}
  if(k==="slider"){var x=+v;return isFinite(x)?Math.max(q.sl.min,Math.min(q.sl.max,x)):null;}
  return undefined;
}
function judgeMsg(q,m){
  var v=cleanV(q,m.v),j=judge(q,{k:m.k|0,v:v});
  return {k:j.k,ok:j.ok,part:j.part||0,err:j.err||"",v:v,c:j.c};
}
function vText(q,v){
  var k=qKind(q);
  if(k==="slider"&&typeof v==="number")return fmtSl(q.sl,v);
  if(k==="libre")return v||"";
  return "";
}
function extendTime(){if(!G||G.phase!=="q")return;G.extra+=30000;send({t:"tx",i:G.i,add:30000});toast("+30 secondes");}

/* ─── correction ─── */
function reveal(){
  if(!G||G.phase!=="q")return;
  clearInterval(G.tick);clearTimeout(G.earlyT);G.earlyT=null;
  G.phase="rv";G.cur=false;
  var q=G.qs[G.i],lim=G.dur+G.extra,dur=lim/1000,on=online(),N=q.choices.length;
  send({t:"lk",i:G.i});
  var kd=qKind(q),dist=q.choices.map(function(){return 0;}),typed={},nAns=0,nOk=0,nPart=0,fast=null,rs={},sv=[],pp=kd==="assoc"?q.L.map(function(){return 0;}):null,errC={};
  var tPts=G.teams.map(function(){return {s:0,n:0,all:true};});
  plist().forEach(function(p){
    var a=G.ans[p.id],pts=0,ok=false;
    if(a){
      nAns++;ok=a.ok;
      if((kd==="qcm"||kd==="vf")&&a.k>=0&&a.k<N)dist[a.k]++;
      if(q.libre){var key=String(a.v||"").trim()||"(vide)";typed[key]=typed[key]||{n:0,ok:a.ok};typed[key].n++;}
      if(kd==="slider"&&typeof a.v==="number")sv.push({v:a.v,c:a.ok?"ok":a.part>0?"pa":"ko"});
      if(pp&&Array.isArray(a.v))a.v.forEach(function(j,i){if(q.rk[j]===i)pp[i]++;});
      if(!ok&&a.err)errC[a.err]=(errC[a.err]||0)+1;
      if(!ok&&a.part>0){nPart++;pts=Math.round(ptsFor(a.t/1000,dur,0,G.pts)*kindMult(q)*a.part);}
      if(ok){
        p.streak++;nOk++;p.ok++;
        pts=Math.round(ptsFor(a.t/1000,dur,p.streak,G.pts)*kindMult(q));
        if(q.libre)p.free++;
        if(a.rem<=3000&&lim>=10000)p.wire++;
        if(a.t<Math.min(0.25*lim,6000))p.fast++;
        if(!fast||a.t<fast.t)fast={p:p.p,t:a.t,team:p.team};
      }else p.streak=0;
      p.best=Math.max(p.best,p.streak);
    }else if(p.on){p.streak=0;}
    if(a||p.on){p.na++;}
    p.score+=pts;
    p.ans[G.i]={k:a?a.k:-1,v:a?a.v:undefined,ok:ok,t:a?a.t:null,pts:pts,an:a?1:0,pa:a&&!ok&&a.part>0?1:0,e:a&&!ok?a.err:""};
    if(G.mode==="duel"&&p.team>=0&&p.team<tPts.length&&(a||p.on)){var tp=tPts[p.team];tp.s+=pts;tp.n++;if(!ok)tp.all=false;}
  });
  var rate=nAns?nOk/Math.max(nAns,on.length):0;
  var boost=null,dmg=null;
  if(G.mode==="duel"){
    boost=tPts.map(function(tp,k){var g=tp.n?Math.round(tp.s/tp.n)+(tp.all&&tp.n>=2?200:0):0;G.tscore[k]+=g;return g;});
  }
  if(G.mode==="boss"){
    var n=G.qs.length,b=G.boss,D=100/(n*0.75);
    /* équilibre : à réussite égale, le prof perd 1,5 fois plus de vie que la classe
       (bonne réponse de la classe = D × 1,5 au prof ; erreur = D à la classe) */
    var toProf=D*rate*1.5*(rate===1?1.5:1),toClass=D*(1-rate);
    /* téléphone du prof : juste = il inflige des dégâts à la jauge de la classe ; faux ou silence = sa jauge baisse (×1,5) */
    var ha=G.hostAns,hostOn=G.host&&G.host.on;
    if(ha&&ha.ok){var sp=clamp(1-ha.t/lim,0,1);toClass+=D*0.35*(0.6+0.4*sp);}
    else if(hostOn||ha){toProf+=D*0.35*1.5;}
    toProf=Math.round(toProf*10)/10;toClass=Math.round(toClass*10)/10;
    if(b.pp<=0)toProf=0;if(b.pc<=0)toClass=0;
    b.pp=Math.max(0,b.pp-toProf);b.pc=Math.max(0,b.pc-toClass);
    dmg={toProf:toProf,toClass:toClass,host:ha?(ha.ok?1:0):-1};
  }
  var ranks={};rankList().forEach(function(x,i){ranks[x.id]=i+1;});
  var stOf=function(a){return !a.an?-1:a.ok?1:a.pa?2:0;};
  plist().forEach(function(p){var a=p.ans[G.i];rs[p.id]=[stOf(a),a.pts,p.score,p.streak,ranks[p.id],a.e||""];});
  if(G.host)rs[G.host.id]=[G.hostAns?(G.hostAns.ok?1:0):-1,0,0,0,0];
  var who=plist().map(function(p){var a=p.ans[G.i];return [p.p,stOf(a),p.team,vText(q,a.v)];});
  var nA=Math.max(nAns,1);
  var h={who:who,host:G.host?(G.hostAns?(G.hostAns.ok?1:0):-1):null,i:G.i,q:q.q,titre:q.titre,id:q.id||"",kd:kd,ans:answerText(q),libre:!!q.libre,rate:rate,nAns:nAns,nOn:on.length,nPart:nPart,dist:dist,typed:typed,fast:fast,choices:q.choices.map(function(c){return c.t;}),ansIdx:q.ans,expl:q.expl||"",errs:errC,
    sv:sv,pp:pp?pp.map(function(c){return Math.round(100*c/nA);}):null};
  G.hist[G.i]=h;
  var rv={t:"rv",i:G.i,ans:q.ans,at:h.ans,ex:q.expl||"",rate:Math.round(rate*100),rs:rs,fr:q.libre?1:0,cor:qCorr(q)};
  if(G.mode==="duel"){rv.tm=G.tscore.slice();rv.tn=G.teams.map(function(t){return t.n;});}
  if(G.mode==="boss")rv.boss={pc:Math.round(G.boss.pc),pp:Math.round(G.boss.pp),dc:dmg.toClass,dp:dmg.toProf,h:dmg.host};
  if(G.mode==="solo")rv.top=rankList().slice(0,3).map(function(x){return [x.p,x.s];});
  G.lastRv=rv;send(rv);
  renderReveal(h,boost,dmg);liveReveal();
  snapshot();
}
function rankList(){
  if(!G)return [];
  return plist().map(function(p){var a=p.ans&&p.ans[G.i];return {id:p.id,p:p.p,s:p.score,dl:a?a.pts:0,ok:p.ok};}).sort(function(a,b){return b.s-a.s||b.ok-a.ok||a.p.localeCompare(b.p);});
}
function renderReveal(h,boost,dmg){
  var q=G.qs[h.i];
  $("g-timer").classList.add("hidden");$("g-choices").classList.remove("veil");
  var kd=qKind(q);
  if(wideKind(q)){
    var cor=qCorr(q);
    $("g-choices").innerHTML='<div class="g-wide">'+(kd==="slider"?scaleHtml(q.sl,{big:true,zone:{a:q.sl.ans,t:q.sl.tol},ans:q.sl.ans,dots:h.sv||[]}):kd==="assoc"?assocHtml(q,cor,h.pp):ordreHtml(q,cor,q.sep))+"</div>";
    $("g-choices").style.gridTemplateColumns="";
  }else if(!q.libre){
    var na=Math.max(1,h.nAns);
    $("g-choices").innerHTML=q.choices.map(function(c,k){return '<div class="gch a'+k+(k===q.ans?" good":" dim")+'" style="--p:'+Math.round(100*h.dist[k]/na)+'%"><span class="sh">'+SHAPES[k]+"</span><span>"+rt(c.t)+'</span><span class="bar">'+h.dist[k]+"</span></div>";}).join("");
    $("g-choices").style.gridTemplateColumns=q.choices.length===2?"1fr 1fr":"";
  }else $("g-choices").innerHTML="";
  var pct=Math.round(h.rate*100),r='<div class="rv-grid"><div class="rv-rate" style="--p:'+pct+'">'+pct+'%<small>de réussite</small></div><div>'+
    (kd==="assoc"||kd==="ordre"?"":'<div class="rv-ans"><span class="lbl2">Bonne réponse</span><span class="val">'+rt(h.ans)+"</span></div>")+
    (h.nPart?'<div class="rv-part">'+ICO.star+h.nPart+" réponse"+(h.nPart>1?"s":"")+" presque juste"+(h.nPart>1?"s":"")+" (points partiels)</div>":"")+
    (kd==="slider"&&h.sv&&h.sv.length?'<div class="rv-part">Estimation médiane de la classe : <b>'+esc(fmtSl(q.sl,medianOf(h.sv.map(function(d){return d.v;}))))+"</b></div>":"")+errTopHtml(h.errs,h.nAns);
  if(q.libre){
    var ks=Object.keys(h.typed).sort(function(a,b){return h.typed[b].n-h.typed[a].n;}).slice(0,12);
    if(ks.length)r+='<div class="rv-typed">'+ks.map(function(k){return '<span'+(h.typed[k].ok?' class="ok"':"")+">"+esc(k)+"<b>×"+h.typed[k].n+"</b></span>";}).join("")+"</div>";
  }
  if(h.expl)r+='<div class="rv-x">'+rt(h.expl)+"</div>";
  if(P.names!==false)r+=whoHtml(h);
  r+='<div class="rv-btns"><button type="button" class="btn btn-sm btn-soft" id="g-ansall">'+ICO.users+"Voir la réponse de chaque joueur"+(G.mode==="duel"?" (par équipe)":"")+"</button></div>";
  if(h.fast)r+='<div class="rv-fast"><span class="chip" style="background:var(--sun-l);color:#8A5A00">'+ICO.bolt+"Le plus rapide : "+esc(h.fast.p)+" ("+f(h.fast.t/1000,1)+" s)</span></div>";
  r+="</div></div>";
  $("g-rev").innerHTML=r;$("g-rev").classList.remove("hidden");$("g-qbox").classList.add("rv");
  $("g-scene").classList.remove("small");
  /* effets de la correction */
  if(h.nAns){
    if(pct>=80){fxStamp(pct===100?"Parfait !":"Bravo la classe !","#2E9E7E","star");confetti({n:120});SND.good();}
    else if(pct>=50){fxStamp(pct+" % de réussite","#4A86CF","check",1300);SND.pop();}
    else{fxStamp("Aïe… on revoit ça","#D9606A","cross",1400);SND.bad();}
  }
  var sc=$("g-scene");
  if(G.mode==="duel")raceUpdate(sc,G.tscore,(h.i+1)/G.qs.length,boost);
  else if(G.mode==="boss"){bossUpdate(sc,G.boss,dmg);if(G.boss.pp<=0&&dmg&&dmg.toProf>0)setTimeout(function(){fxStamp("K.O. !","#8A6CC9","star");confetti({rain:true,n:140});},1300);}
  else{leaderUpdate(sc,rankList(),G.prevRanks);var pr={};rankList().forEach(function(x,i){pr[x.id]=i;});G.prevRanks=pr;}
  var last=h.i+1>=G.qs.length;
  $("g-next").innerHTML=ICO.next+(last?"Voir le podium":"Question suivante");$("g-plus").disabled=true;
  updateAnswered();
  if(G.auto)startAuto();
}
function startAuto(){
  clearInterval(G.autoT);
  if(!G||G.phase!=="rv")return;
  var last=G.i+1>=G.qs.length,s=10;$("g-next").innerHTML=ICO.next+(last?"Podium":"Suivante")+" ("+s+")";
  G.autoT=setInterval(function(){s--;if(!G||G.phase!=="rv"||!G.auto){clearInterval(G&&G.autoT);return;}if(s<=0){clearInterval(G.autoT);nextQuestion();}else $("g-next").innerHTML=ICO.next+(last?"Podium":"Suivante")+" ("+s+")";},1000);
}
function autoBtn(){var b=$("g-auto");if(!b||!G)return;b.classList.toggle("on",!!G.auto);b.innerHTML=(G.auto?ICO.play:ICO.pause||ICO.clock)+"Auto : "+(G.auto?"oui":"non");}
$("g-auto").addEventListener("click",function(){
  if(!G)return;G.auto=!G.auto;autoBtn();
  if(G.phase==="rv"){if(G.auto)startAuto();else{clearInterval(G.autoT);var last=G.i+1>=G.qs.length;$("g-next").innerHTML=ICO.next+(last?"Voir le podium":"Question suivante");}}
  toast(G.auto?"Enchaînement automatique activé (10 s après chaque correction).":"Enchaînement automatique désactivé : vous passez à la suite quand vous voulez.");
});
/* fenêtre : réponse de chaque joueur (individuel, ou groupé par équipe en duel) */
function ansText(q,a){
  var k=qKind(q);
  if(!a||!a.an)return "—";
  if(k==="libre")return a.v||"";
  if(k==="slider")return typeof a.v==="number"?"≈ "+fmtSl(q.sl,a.v):"";
  if(k==="assoc"){var n=q.L.length,c=0;(a.v||[]).forEach(function(j,i){if(q.rk[j]===i)c++;});return c+" paire"+(c>1?"s":"")+" juste"+(c>1?"s":"")+" sur "+n;}
  if(k==="ordre"){var m=q.D.length,c2=0;(a.v||[]).forEach(function(j,i){if(q.op[j]===i)c2++;});return c2+" place"+(c2>1?"s":"")+" juste"+(c2>1?"s":"")+" sur "+m;}
  return q.choices[a.k]?q.choices[a.k].t:"—";
}
function openAnswers(i){
  if(!G)return;i=i===undefined?G.i:i;
  var q=G.qs[i],h=G.hist[i];if(!q||!h)return;
  $("ma-h").textContent="Réponses — question "+(i+1)+" / "+G.qs.length;
  $("ma-q").innerHTML=rt(q.q)+'<div class="small muted" style="margin-top:.3rem">Bonne réponse : '+rt(h.ans)+"</div>";
  var row=function(p){var a=p.ans&&p.ans[i],st=!a||!a.an?"na":a.ok?"ok":a.pa?"pa":"ko",lab={ok:"✓ juste",ko:"✗ faux",pa:"★ presque",na:"— pas de réponse"}[st];
    return '<tr class="'+st+'"><td><b>'+esc(p.p)+'</b></td><td>'+rt(ansText(q,a))+(a&&a.e&&ERR[a.e]&&a.e!=="autre"&&st!=="ok"?'<div class="ma-e">'+esc(ERR[a.e].l)+"</div>":"")+'</td><td class="st">'+lab+'</td><td class="pt">'+(a&&a.t!==null&&a.an?f(a.t/1000,1)+" s":"")+'</td><td class="pt">'+(a&&a.pts?"+"+fmtInt(a.pts):"0")+"</td></tr>";};
  var head='<table class="ma-t"><tr><th>Joueur</th><th>Réponse</th><th>Résultat</th><th>Temps</th><th>Points</th></tr>';
  var ps=plist().sort(function(a,b){var x=a.ans&&a.ans[i],y=b.ans&&b.ans[i];return ((y&&y.pts)||0)-((x&&x.pts)||0)||a.p.localeCompare(b.p,"fr");});
  var html="";
  if(G.mode==="duel"){
    G.teams.forEach(function(t,k){var mem=ps.filter(function(p){return p.team===k;});if(!mem.length)return;var ok=mem.filter(function(p){return p.ans[i]&&p.ans[i].ok;}).length;
      html+='<div class="ma-team"><h3><i style="background:'+TEAMS[k].c+'"></i>'+esc(t.n)+' <small class="muted">'+ok+" / "+mem.length+" justes</small></h3>"+head+mem.map(row).join("")+"</table></div>";});
    var none=ps.filter(function(p){return p.team<0||p.team>=G.teams.length;});if(none.length)html+='<div class="ma-team"><h3>Sans équipe</h3>'+head+none.map(row).join("")+"</table></div>";
  }else html=head+ps.map(row).join("")+"</table>";
  if(G.host&&h.host!==null&&h.host!==undefined)html+='<p class="small muted" style="margin-top:.6rem">Téléphone du prof : '+(h.host===1?"juste":h.host===0?"faux":"pas de réponse")+".</p>";
  $("ma-list").innerHTML=html||'<p class="muted">Aucun joueur.</p>';
  openModal("m-ans");
}
$("g-rev").addEventListener("click",function(e){if(e.target.closest("#g-ansall"))openAnswers();});
function renderRevealFromHist(i){var h=G.hist[i];if(!h)return;showGameScreen();$("g-qn").textContent="Question "+(i+1)+" / "+G.qs.length;$("g-q").innerHTML=rt(G.qs[i].q)+figBlock(G.qs[i].fig);$("g-meta").innerHTML="";renderReveal(h,null,null);}
function medianOf(a){var s=a.slice().sort(function(x,y){return x-y;}),n=s.length;return n?(n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2):0;}
/* erreur type la plus fréquente sur cette question (diagnostic pour le prof) */
function errTopHtml(errs,nAns){
  var ks=Object.keys(errs||{}).filter(function(k){return ERR[k]&&k!=="autre";}).sort(function(a,b){return errs[b]-errs[a];});
  if(!ks.length)return "";
  var k=ks[0];if(errs[k]<2&&nAns>4)return "";
  return '<div class="rv-diag">'+ICO.bolt+"<span><b>Erreur la plus fréquente</b> ("+errs[k]+" élève"+(errs[k]>1?"s":"")+") : "+esc(ERR[k].l)+"</span></div>";
}
$("g-plus").addEventListener("click",extendTime);
$("g-next").addEventListener("click",function(){
  if(!G)return;
  if(G.phase==="q"){reveal();return;}
  if(G.phase==="rv"){clearInterval(G.autoT);nextQuestion();}
});
var SHORT_T=null;
$("g-short").addEventListener("click",function(){
  var b=this;
  if(b.getAttribute("data-arm")!=="1"){
    b.setAttribute("data-arm","1");b.classList.add("armed");b.textContent="Confirmer : terminer";
    clearTimeout(SHORT_T);SHORT_T=setTimeout(function(){b.removeAttribute("data-arm");b.classList.remove("armed");b.textContent="Écourter";},5000);return;
  }
  clearTimeout(SHORT_T);b.removeAttribute("data-arm");b.classList.remove("armed");b.textContent="Écourter";
  shorten();
});
function shorten(){
  if(!G||G.phase==="end"||G.phase==="lobby")return;
  clearInterval(G.tick);clearInterval(G.autoT);clearTimeout(G.autoT);clearTimeout(G.earlyT);G.earlyT=null;
  $("g-cd").classList.add("hidden");$("g-rules").classList.add("hidden");
  if(G.phase==="q"){G.i--;G.cur=false;send({t:"lk",i:G.i+1});}   /* la question en cours ne compte pas */
  G.phase="rv";
  if(!G.hist.filter(function(h){return h;}).length){   /* rien n’a été joué : retour à la salle */
    G.phase="lobby";G.lk=false;G.i=-1;pushLobby();renderLobby();show("s-lobby");toast("Partie arrêtée avant la première correction : retour à la salle.");return;
  }
  endGame(true);
}

/* ─── qui a bien / mal répondu (après chaque question) ─── */
function whoHtml(h){
  var ok=[],ko=[],na=[],pa=[];
  (h.who||[]).forEach(function(w){var T=G.mode==="duel"&&w[2]>=0&&G.teams[w[2]]?TEAMS[w[2]]:null,c='<span class="wchip'+(w[1]===1?" ok":w[1]===2?" pa":w[1]===0?" ko":" na")+'"'+(T?' style="border-color:'+T.c+'"':"")+">"+esc(w[0])+(w[3]&&h.kd==="slider"?' <small>'+esc(w[3])+"</small>":"")+"</span>";(w[1]===1?ok:w[1]===2?pa:w[1]===0?ko:na).push(c);});
  var hs="";
  if(h.host!==null&&h.host!==undefined)hs='<span class="wchip host '+(h.host===1?"ok":h.host===0?"ko":"na")+'">Le Prof</span>';
  return '<div class="who"><div class="wl"><b class="wt ok">'+ICO.check+"Juste ("+ok.length+")</b>"+(ok.join("")||'<span class="muted small">personne</span>')+'</div><div class="wl"><b class="wt ko">'+ICO.cross+"Faux ("+ko.length+")</b>"+(ko.join("")||'<span class="muted small">personne</span>')+"</div>"+
    (pa.length?'<div class="wl"><b class="wt pa">'+ICO.star+"Presque ("+pa.length+")</b>"+pa.join("")+"</div>":"")+
    (na.length?'<div class="wl"><b class="wt na">'+ICO.clock+"Sans réponse ("+na.length+")</b>"+na.join("")+"</div>":"")+(hs?'<div class="wl"><b class="wt">Téléphone du prof</b>'+hs+"</div>":"")+"</div>";
}
/* ─── écran des règles avant la partie ─── */
function showRules(cb){
  var box=$("rules-box");
  $("g-qn").textContent="Question 1 / "+G.qs.length;$("g-q").innerHTML="";$("g-choices").innerHTML="";$("g-meta").innerHTML="";$("g-rev").classList.add("hidden");
  $("g-timer").classList.add("hidden");$("g-next").innerHTML=ICO.play+"Démarrer";$("g-ans").textContent="";
  box.innerHTML=rulesHtml(G.mode,{sm:G.pts,rd:G.read})+'<div class="rules-act"><button type="button" class="btn btn-ghost" id="ru-back">Retour à la salle</button><button type="button" class="btn btn-go btn-xl" id="ru-go">'+ICO.play+"C’est parti !</button></div>";
  $("g-rules").classList.remove("hidden");
  send({t:"ru",m:G.mode,sm:G.pts,rd:G.read});
  $("ru-go").onclick=function(){$("g-rules").classList.add("hidden");cb();};
  $("ru-back").onclick=function(){$("g-rules").classList.add("hidden");G.phase="lobby";G.lk=false;pushLobby();renderLobby();show("s-lobby");};
}
