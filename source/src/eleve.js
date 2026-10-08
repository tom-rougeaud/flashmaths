/* ═══════════════════════════════════════════════════════════════
   PAGE ÉLÈVE — rejoindre, jouer, s’entraîner, carnet
═══════════════════════════════════════════════════════════════ */
var S={code:"",pid:null,pseudo:"",ch:null,mode:null,phase:null,team:-1,score:0,lb:null,q:null,ans:null,ping:null,timer:null,train:null};
var SCREENS=["s-code","s-pseudo","s-lobby","s-cd","s-q","s-rv","s-end","s-train","s-carnet"];
function show(id){SCREENS.forEach(function(s){$(s).classList.toggle("hidden",s!==id);});var g=/^s-(q|rv|cd)$/.test(id);document.body.classList.toggle("ingame",g);window.scrollTo(0,0);S.screen=id;fitView();}
/* répartition de la place restante (après l’ajustement de la taille) */
FIT.unfill=function(){$$("#app .screen").forEach(function(e){e.style.paddingTop="";});["q-ans","kpad","q-wid"].forEach(function(id){var e=$(id);if(e)e.style.minHeight="";});};
FIT.fill=function(gap){
  var sc=S.screen&&$(S.screen);if(!sc)return;
  if(S.screen==="s-q"){
    var grow=["q-ans","kpad","q-wid"].map($).filter(function(e){return e&&visible(e)&&e.children.length&&!e.closest(".hidden");})[0];
    if(grow){grow.style.minHeight=(grow.getBoundingClientRect().height+Math.min(gap,window.innerHeight*0.4))+"px";return;}
  }
  sc.style.paddingTop=Math.round(gap*0.42)+"px";
};
/* tous les écrans s’ajustent à la fenêtre (sauf le carnet, une longue liste) ; les écrans de jeu peuvent rétrécir davantage */
function fitView(){if(typeof S==="undefined"||!S.screen)return;var id=S.screen,pc=document.body.classList.contains("v-pc"),g=/^s-(q|rv|cd)$/.test(id);fitScreen(id!=="s-carnet",g?{min:0.6,max:pc?2.1:1.8}:{min:id==="s-end"?0.6:0.7,max:pc?1.6:1.7});}
var PREF={view:"mob",sound:false};
function savePref(){store.set("eleve",PREF);}

/* ─── en-tête ─── */
function setView(v){PREF.view=v;savePref();document.body.classList.remove("v-mob","v-pc");document.body.classList.add("v-"+v);$$("#vsw button").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-v")===v);});fitView();}
$("vsw").addEventListener("click",function(e){var b=e.target.closest("button");if(b)setView(b.getAttribute("data-v"));});
$("b-menu").addEventListener("click",function(e){e.stopPropagation();$("menu").classList.toggle("hidden");});
document.addEventListener("click",function(e){if(!e.target.closest(".menu-w"))$("menu").classList.add("hidden");});
function soundLabel(){$("m-sound").textContent=PREF.sound?"Couper le son":"Activer le son";SND.setMute(!PREF.sound);}
$("menu").addEventListener("click",function(e){
  var b=e.target.closest("[data-m]");if(!b)return;$("menu").classList.add("hidden");
  var m=b.getAttribute("data-m");
  if(m==="sound"){PREF.sound=!PREF.sound;savePref();soundLabel();SND.unlock();SND.pop();}
  else if(m==="carnet")openCarnet();
  else if(m==="train")openTrain();
  else if(m==="leave")leaveRoom(true);
});

/* ═══ 1. CODE DE LA SALLE ═══ */
var CODE="";
function renderSlots(){
  $$("#slots span").forEach(function(s,i){s.textContent=CODE.charAt(i)||"";s.classList.toggle("cur",i===CODE.length);s.classList.toggle("f",i<CODE.length);});
}
(function(){
  var h="";"0123456789ABCDEF".split("").forEach(function(c){h+='<button type="button" data-c="'+c+'"'+(/[A-F]/.test(c)?' class="l"':"")+">"+c+"</button>";});
  $("hexpad").innerHTML=h+'<button type="button" class="del" data-c="del">⌫ Effacer</button>';
})();
function typeCode(c){
  $("code-err").classList.add("hidden");
  if(c==="del"){CODE=CODE.slice(0,-1);renderSlots();return;}
  if(CODE.length>=4)return;
  CODE+=c;renderSlots();SND.unlock();
  if(CODE.length===4)setTimeout(checkCode,200);
}
$("hexpad").addEventListener("click",function(e){var b=e.target.closest("button");if(b)typeCode(b.getAttribute("data-c"));});
document.addEventListener("keydown",function(e){
  if(S.screen==="s-code"){
    var k=e.key.toUpperCase(),dc=/^(?:Digit|Numpad)([0-9])$/.exec(e.code||"");
    if(dc&&!/^[A-F]$/.test(k))k=dc[1];
    else if(AZ[e.key])k=AZ[e.key];
    if(/^[0-9A-F]$/.test(k)){typeCode(k);e.preventDefault();}else if(e.key==="Backspace")typeCode("del");
  }
  else if(S.screen==="s-q"&&S.q&&S.q.fr&&!S.ans&&e.target!==$("f-in")&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
    /* le champ n’a pas le focus : on le lui donne et on transmet la touche */
    var inp=$("f-in");
    if(e.key==="Enter"){submitFree();e.preventDefault();return;}
    if(e.key==="Backspace"){pushKey("⌫");e.preventDefault();inp.focus();return;}
    if(e.key&&e.key.length===1){var c=mapKey(e.key);if(c){pushKey(c);}e.preventDefault();inp.focus();}
  }
});
/* le code tapé est vérifié : salle d’élèves, téléphone du prof (Classe VS Prof) ou inconnu */
function checkCode(){
  if(CODE.length!==4)return;
  var cfg=fmConfig();if(!cfg||cfg.bad){gotoPseudo();return;}
  var code=CODE;
  rpc("fm_check",{p_code:code},6000).then(function(r){
    if(code!==CODE)return;
    if(r&&r.kind==="host"){hostJoin(r.code);return;}
    if(r&&r.kind==="none"){codeErr(JOIN_ERR.not_found);return;}
    if(r&&r.kind==="ended"){codeErr(JOIN_ERR.ended);return;}
    gotoPseudo();
  }).catch(function(){gotoPseudo();});
}
function codeErr(t){var e=$("code-err");e.textContent=t;e.classList.remove("hidden");CODE="";renderSlots();var sl=$("slots");sl.classList.remove("shake");void sl.offsetWidth;sl.classList.add("shake");}
function gotoPseudo(){
  if(CODE.length!==4)return;
  $("ps-code").textContent=CODE;
  var last=store.get("pseudo","");
  $("ps-in").value=last||"";$("ps-err").classList.add("hidden");
  show("s-pseudo");
  setTimeout(function(){try{$("ps-in").focus();}catch(e){}},80);
}
$("ps-back").addEventListener("click",function(){CODE="";renderSlots();show("s-code");});
$("ps-dice").addEventListener("click",function(){$("ps-in").value=genPseudo();SND.pop();});
$("ps-in").addEventListener("keydown",function(e){if(e.key==="Enter")$("ps-go").click();});
function psErr(t){var e=$("ps-err");e.textContent=t;e.classList.remove("hidden");e.classList.remove("shake");void e.offsetWidth;e.classList.add("shake");}

/* ═══ 2. REJOINDRE (base + temps réel) ═══ */
$("ps-go").addEventListener("click",function(){
  var c=checkPseudo($("ps-in").value);
  if(!c.ok){psErr(c.why);return;}
  var cfg=fmConfig();if(!cfg||cfg.bad){psErr("Le jeu en salle n’est pas encore configuré par ton prof. Tu peux t’entraîner seul en attendant.");return;}
  var b=this;b.disabled=true;b.textContent="Connexion…";
  var sess=store.get("sess",null),pid=sess&&sess.code===CODE&&Date.now()-sess.at<3*3600e3?sess.pid:null;
  joinRoom(CODE,c.p,pid).catch(function(e){psErr(e.message);}).then(function(){b.disabled=false;b.textContent="Entrer dans la salle";});
});
var JOIN_ERR={not_found:"Salle introuvable : vérifie le code au tableau.",full:"La salle est complète (30 élèves au maximum).",pseudo_taken:"Ce prénom est déjà pris dans la salle : ajoute l’initiale de ton nom (ex. « Léa M ») ou prends un pseudo.",pseudo_invalid:"Prénom refusé : 2 à 16 caractères.",ended:"Cette partie est terminée."};
/* ─── téléphone du prof (mode Classe VS Prof) : pas de prénom, pas de place parmi les 30 ─── */
function hostJoin(code){
  S.host=true;S.code=code;S.pid="host-"+genId();S.pseudo="Le Prof";S.mode="boss";S.team=-1;S.score=0;
  if(S.ch){S.ch.close();S.ch=null;}
  openChannel(code,onMsg,onNet).then(function(ch){
    S.ch=ch;S.phase="lobby";$("m-leave").classList.remove("hidden");
    hello();renderLobby();show("s-lobby");
  }).catch(function(e){S.host=false;codeErr(netErrText(e));});
}
function joinRoom(code,pseudo,pid){
  return rpc("fm_join",{p_code:code,p_pseudo:pseudo,p_player:pid}).then(function(r){
    if(!r||!r.ok)throw new Error(JOIN_ERR[r&&r.err]||"Impossible d’entrer dans la salle.");
    S.host=false;S.code=code;S.pid=r.id;S.pseudo=r.pseudo;S.mode=r.mode;S.team=-1;S.score=0;
    store.set("pseudo",r.pseudo);store.set("sess",{code:code,pid:r.id,pseudo:r.pseudo,at:Date.now()});
    if(S.ch){S.ch.close();S.ch=null;}
    return openChannel(code,onMsg,onNet);
  },function(e){throw new Error(netErrText(e));}).then(function(ch){
    S.ch=ch;S.phase="lobby";
    $("m-leave").classList.remove("hidden");
    hello();renderLobby();show("s-lobby");
    clearInterval(S.ping);S.ping=setInterval(ping,40000);
  });
}
function hello(){if(S.ch)S.ch.send(S.host?{t:"hi",id:S.pid,p:S.pseudo,host:1}:{t:"hi",id:S.pid,p:S.pseudo});}
function onNet(st){if(st==="up")hello();}
function ping(){
  if(!S.pid||S.host)return;
  rpc("fm_player_ping",{p_player:S.pid}).then(function(r){
    if(r&&r.ok===false&&!S.kicked){ /* place expirée (téléphone en veille) : on la reprend */
      rpc("fm_join",{p_code:S.code,p_pseudo:S.pseudo,p_player:S.pid}).then(function(j){if(j&&j.ok)hello();});
    }
  }).catch(function(){});
}
function leaveRoom(manual){
  if(S.ch){S.ch.send({t:"bye",id:S.pid});var c=S.ch;setTimeout(function(){c.close();},300);}
  if(S.pid&&manual&&!S.host)rpc("fm_leave",{p_player:S.pid}).catch(function(){});
  S.host=false;
  clearInterval(S.ping);clearInterval(S.timer);
  S.ch=null;S.phase=null;if(manual){store.del("sess");S.pid=null;}
  $("m-leave").classList.add("hidden");
  CODE="";renderSlots();show("s-code");
}
function showRulesCard(mode,o){
  S.rules=true;show("s-lobby");
  $("lb-body").innerHTML='<div class="card rules-card">'+rulesHtml(mode,o)+'<div class="center muted" style="margin-top:1rem"><div class="dots"><span></span><span></span><span></span></div>La partie commence dans un instant…</div></div>';
}
/* l’élève quitte la page du jeu (autre onglet, autre appli…) : le prof est prévenu, sans savoir où */
document.addEventListener("visibilitychange",function(){
  if(!S.ch||!S.phase||S.phase==="end"||S.train)return;
  S.ch.send({t:"aw",id:S.pid,v:document.hidden?1:0});
  if(!document.hidden)hello();
});
function kicked(msg){
  S.kicked=true;leaveRoom(false);store.del("sess");
  var e=$("code-err");e.textContent=msg;e.classList.remove("hidden");
}
function sendAns(m){if(S.ch){m.id=S.pid;S.ch.send(m);}}

/* ─── messages du prof ─── */
function onMsg(m){
  if(!m||typeof m!=="object")return;
  if(!S.ch)return;   /* salle quittée : on ignore les derniers messages en route */
  if(m.to&&m.to!==S.pid)return;
  if(m.t==="q"||m.t==="rv"||m.t==="cd"||m.t==="en"||m.t==="ru")markActive();
  switch(m.t){
    case "lb":S.lb=m;S.mode=m.m;var me=(m.pl||[]).filter(function(x){return x[0]===S.pid;})[0];if(me)S.team=me[2];
      if(m.ph==="lobby"&&(S.phase==="q"||S.phase==="rv"||S.phase==="cd")){clearInterval(S.timer);S.rules=false;S.phase="lobby";show("s-lobby");}
      if(m.ph==="lobby"&&(S.phase==="end"||S.phase==="lobby"||!S.phase)){S.phase="lobby";if(S.screen!=="s-lobby"&&S.screen!=="s-carnet")show("s-lobby");}
      if(S.screen==="s-lobby"&&!S.rules)renderLobby();
      if(m.ph==="lobby"&&S.rules){S.rules=false;renderLobby();}
      break;
    case "wt":
      S.mode=m.m;S.score=m.sc||0;S.team=m.team;S.lb=m.lb||S.lb;
      if(m.ph==="q"&&m.q){showQuestion(m.q,m.done);}
      else if(m.ph==="rv"&&m.rv){showReveal(m.rv);}
      else if(m.ph==="end"&&m.en){showEnd(m.en);}
      else{S.phase=m.ph==="cd"?"lobby":m.ph;renderLobby();show("s-lobby");}
      break;
    case "cd":S.rules=false;S.phase="cd";S.score=0;S.round=(S.round||0)+1;countdown();break;
    case "q":showQuestion(m,false);break;
    case "tx":if(S.q&&m.i===S.q.i){S.q.end+=m.add||30000;}break;
    case "lk":if(S.q&&m.i===S.q.i)lockQ();break;
    case "rv":showReveal(m);break;
    case "en":showEnd(m);break;
    case "kick":kicked(m.why==="host"?"Un autre téléphone prof a pris la main.":"Le prof t’a retiré de la salle.");break;
    case "rn":S.pseudo=m.p;var ss=store.get("sess",null);if(ss){ss.pseudo=m.p;store.set("sess",ss);}store.set("pseudo",m.p);toast("Le prof a changé ton nom : « "+m.p+" ».");if(S.screen==="s-lobby")renderLobby();break;
    case "ru":S.phase="lobby";showRulesCard(m.m,{sm:m.sm,rd:m.rd,hd:m.hd,hpen:m.hpen,fk:m.fk});break;
    case "no":
      if(m.why==="full"){kicked(JOIN_ERR.full);}
      else if(m.why==="pseudo"){leaveRoom(true);gotoPseudo();psErr(JOIN_ERR.pseudo_taken);}
      else if(m.why==="hostmode")kicked("Ce code ne fonctionne qu’en mode « La Classe VS le Prof ».");
      else kicked(JOIN_ERR.ended);
      break;
    case "x":kicked("La salle a été fermée par le prof. Merci d’avoir joué !");break;
    case "rh":hello();break;
  }
}

/* ═══ 3. SALLE D’ATTENTE (glisser son jeton dans une équipe) ═══ */
var KID_SVG='<svg class="ill" viewBox="0 0 120 120"><circle cx="60" cy="64" r="44" fill="#5B55C4"/><circle cx="44" cy="56" r="10" fill="#fff"/><circle cx="76" cy="56" r="10" fill="#fff"/><circle cx="46" cy="58" r="5" fill="#262A4F"/><circle cx="78" cy="58" r="5" fill="#262A4F"/><path d="M44 80q16 14 32 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 26l10 12M90 26 80 38M60 12v14" stroke="#EFB443" stroke-width="5" stroke-linecap="round"/></svg>';
var LOBBY_T=null;
function renderLobby(){
  if(DRAGGING){clearTimeout(LOBBY_T);LOBBY_T=setTimeout(renderLobby,80);return;}
  var lb=S.lb,n=lb?(lb.pl||[]).length:0;
  $("lb-me").textContent=S.host?"Vous jouez en tant que prof":S.pseudo+" · salle "+S.code;
  $("lb-n").textContent=n+" / "+(lb?lb.mx:30)+" connectés";
  var h="";
  if(S.mode==="duel"&&lb){
    var tn=lb.tn||[],mine=S.team>=0&&S.team<tn.length?S.team:-1;
    if(lb.lk){
      h='<div class="card wait-card">'+KID_SVG+"<h2>"+(mine>=0?"Ton équipe : "+esc(tn[mine]):"Équipes fermées")+'</h2><p class="muted">La partie va commencer…</p><div class="dots"><span></span><span></span><span></span></div></div>';
    }else{
      h='<h1 class="big-t" style="font-size:1.35rem">'+(mine>=0?"Tu es chez <span style=\"color:"+TEAMS[mine].d+"\">"+esc(tn[mine])+"</span>":"Glisse ton jeton dans une équipe")+'</h1>'+
        '<div class="dock"><span class="token" id="token" style="'+(mine>=0?"background:"+TEAMS[mine].c+";box-shadow:0 6px 0 "+TEAMS[mine].d:"")+'">'+ICO.grip+esc(S.pseudo)+"</span></div>"+
        '<div class="tlist" id="tlist">'+tn.map(function(name,k){
          var T=TEAMS[k],mem=(lb.pl||[]).filter(function(x){return x[2]===k;}).map(function(x){return x[1];});
          return '<button type="button" class="tcard'+(k===mine?" mine":"")+'" data-k="'+k+'" style="--tc:'+T.c+";--tl:"+T.l+'"><span class="th"><span>'+T.s+" "+esc(name)+"</span><span>"+mem.length+'</span></span><span class="tb">'+(mem.length?mem.slice(0,8).map(function(p){return p===S.pseudo?"<b>"+esc(p)+"</b>":esc(p);}).join(", ")+(mem.length>8?"…":""):"Personne pour l’instant")+"</span></button>";
        }).join("")+'</div><p class="muted small center" style="margin-top:.8rem">Tu peux aussi toucher une équipe pour la rejoindre.</p>';
    }
  }else if(S.host){
    h='<div class="card wait-card"><div style="max-width:11rem;margin:0 auto">'+bossSvg()+'</div><h2>Vous êtes le Prof !</h2><p class="muted">Répondez vite et juste : chaque bonne réponse inflige des dégâts à la jauge de vie de la classe, chaque erreur fait baisser la vôtre.</p><div class="dots"><span></span><span></span><span></span></div></div>';
  }else if(S.mode==="boss"){
    h='<div class="card wait-card"><div style="max-width:11rem;margin:0 auto">'+bossSvg()+'</div><h2>Toute la classe contre le prof !</h2><p class="muted">Chaque bonne réponse fait perdre des points de vie au prof. Unissez-vous !</p><div class="dots"><span></span><span></span><span></span></div></div>';
  }else{
    h='<div class="card wait-card">'+KID_SVG+'<h2>Un contre tous</h2><p class="muted">Tu joues pour toi : sois précis pour allumer une ampoule de la guirlande !</p><div class="dots"><span></span><span></span><span></span></div></div>';
  }
  $("lb-body").innerHTML=h;
}
function pickTeam(k){
  if(!S.lb||S.lb.lk||S.mode!=="duel")return;
  S.team=k;sendAns({t:"tm",k:k});
  (S.lb.pl||[]).forEach(function(x){if(x[0]===S.pid)x[2]=k;});
  vibrate(30);SND.pop();renderLobby();
}
$("lb-body").addEventListener("click",function(e){var c=e.target.closest(".tcard");if(c&&!DRAGGING)pickTeam(+c.getAttribute("data-k"));});
dragDrop({root:$("lb-body"),item:".token",zone:".tcard",onDrop:function(it,zone){pickTeam(+zone.getAttribute("data-k"));}});

/* ═══ 4. COMPTE À REBOURS, QUESTION ═══ */
function countdown(){
  show("s-cd");var n=3,bs=$$("#cd-b i");bs.forEach(function(b){b.classList.remove("on");});
  (function step(){
    if(n>0){if(bs[3-n])bs[3-n].classList.add("on");$("cd-t").textContent=n===3?"Prêt ?":n===2?"Concentre-toi…":"C’est parti !";SND.tock();n--;setTimeout(step,850);}
  })();
}
/* q = {i,N,q,kd,ch|fr,kb,u|L,R|D,how|sl,fig,dur,rem?,vf,qx} ; done = réponse déjà envoyée */
function pubKind(q){return q.kd||(q.fr?"libre":q.vf?"vf":"qcm");}
function pubTag(q){var k=pubKind(q);return kindTagHtml({kind:(k==="assoc"||k==="ordre"||k==="slider")?k:undefined,libre:k==="libre",vf:k==="vf",qx:q.qx});}
function showQuestion(q,done){
  clearInterval(S.timer);
  S.phase="q";S.q=q;S.ans=done?{done:true}:null;S.typed="";
  /* rd : temps de lecture (ms) avant que les propositions s’ouvrent ; start peut donc être dans le futur */
  var rem=q.rem!==undefined?q.rem:q.dur+(q.rd||0),kd=pubKind(q);
  q.start=Date.now()-(q.dur-rem);q.end=q.start+q.dur;
  /* handicap du prof (Classe VS Prof) : la question s’ouvre plus tard sur son téléphone, sans temps supplémentaire */
  if(S.host&&q.hd>0)q.start=Math.min(q.end-1000,q.start+q.hd);
  $("q-n").textContent=(q.i+1)+" / "+q.N;
  $("q-sc").textContent=fmtInt(S.score)+" pts";
  $("q-tag").innerHTML=pubTag(q);
  $("q-txt").innerHTML='<div class="q-st">'+rt(q.q)+"</div>"+figBlock(q.fig);
  $("q-txt").classList.toggle("hasfig",!!q.fig&&!!figHtml(q.fig));
  $("q-sent").classList.add("hidden");$("q-sent").classList.remove("late");
  $("q-wid").classList.add("hidden");$("q-wid").classList.remove("off");
  if(kd==="assoc"||kd==="ordre"||kd==="slider"){
    $("q-ans").classList.add("hidden");$("q-free").classList.add("hidden");$("q-wid").classList.remove("hidden");
    buildWidget(q);
  }else if(q.fr){
    $("q-ans").classList.add("hidden");$("q-free").classList.remove("hidden");
    buildPad(q.kb);$("f-unit").textContent=q.u||"";$("f-in").value="";renderTyped();$("f-in").readOnly=false;if(!isTouch())setTimeout(function(){try{$("f-in").focus({preventScroll:true});}catch(x){$("f-in").focus();}},60);
  }else{
    $("q-free").classList.add("hidden");var a=$("q-ans");a.classList.remove("hidden","off");
    /* longueur visible : une formule compte pour ses symboles (sans les commandes LaTeX) */
    var vl=function(c){return String(c).replace(/\$([^$]*)\$/g,function(m,t){return t.replace(/\\[a-zA-Z]+/g,"x").replace(/[{}^_ ]/g,"");}).length;};
    var long=q.ch.some(function(c){return vl(c)>22;}),vlong=q.ch.some(function(c){return vl(c)>32;});
    a.className="answers"+(long?" long":"")+((q.ch.length===2&&long)||vlong||(long&&!document.body.classList.contains("v-pc"))?" one":"");
    a.innerHTML=q.ch.map(function(c,k){return '<button type="button" class="ab a'+k+'" data-k="'+k+'"><span class="sh">'+SHAPES[k]+"</span><span>"+rt(c)+"</span></button>";}).join("");
  }
  if(done){sentMsg("Réponse envoyée ✓ — attends la correction");$("q-ans").classList.add("off");$("q-free").classList.add("hidden");$("q-wid").classList.add("hidden");}
  setReading(!done&&Date.now()<q.start);
  show("s-q");
  S.timer=setInterval(tickQ,200);tickQ();
}
/* pendant le temps de lecture : énoncé seul, réponses verrouillées */
function reading(){return !!(S.q&&Date.now()<S.q.start);}
function setReading(on){
  var hw=on&&S.host&&S.q&&S.q.hd>0;
  $("q-read").classList.toggle("hidden",!on);
  $("q-read").lastElementChild.textContent=hw?"Handicap du prof : la question arrive dans un instant…":"Lis bien l’énoncé, les propositions arrivent…";
  document.querySelector("#s-q .q-card").classList.toggle("reading",!!hw);
  ["q-ans","q-free","q-wid"].forEach(function(id){$(id).classList.toggle("reading",on);});
  if(!on&&S.phase==="q"&&!S.ans&&!S.train&&$("f-in")&&!$("q-free").classList.contains("hidden")&&!isTouch()){try{$("f-in").focus({preventScroll:true});}catch(x){}}
}
function tickQ(){
  var q=S.q;if(!q)return;
  if(Date.now()<q.start){$("q-bar").style.transform="scaleX(1)";$("q-sec").textContent="lecture "+Math.ceil((q.start-Date.now())/1000)+" s";return;}
  if(!$("q-read").classList.contains("hidden"))setReading(false);
  var rem=q.end-Date.now(),tot=q.end-q.start,p=Math.max(0,rem/tot);
  var bar=$("q-bar");bar.style.transform="scaleX("+p+")";
  var tb=bar.parentNode;tb.classList.toggle("low",rem<=5000);tb.classList.toggle("mid",rem>5000&&p<0.5);
  $("q-sec").textContent=Math.max(0,Math.ceil(rem/1000))+" s";
  if(rem<=0){clearInterval(S.timer);if(!S.train)lockQ();else trainTimeout();}
}
function sentMsg(t,late){var s=$("q-sent");s.textContent=t;s.classList.remove("hidden");s.classList.toggle("late",!!late);}
function lockQ(){
  clearInterval(S.timer);
  if(!S.ans){S.ans={none:true};$("q-ans").classList.add("off");$("q-free").classList.add("hidden");$("q-wid").classList.add("hidden");sentMsg("Temps écoulé !",true);}
}
function answerFx(ms,rem,tot,silent){
  var t=S.q&&S.q.sm==="juste"?"":ms<Math.min(0.25*tot,6000)?"fast":(rem<=3000&&tot>=10000)?"wire":"";
  if(!silent)playAnsFx(t);
  return t;
}
function playAnsFx(t){
  if(t==="fast"){fxStamp("Éclair !","#D59A2E","bolt",1300);SND.bolt();vibrate(40);}
  else if(t==="wire"){fxStamp("Sur le fil !","#D9606A","clock",1300);SND.tock();vibrate([30,30,30]);}
  else{SND.pop();vibrate(25);}
}
$("q-ans").addEventListener("click",function(e){
  var b=e.target.closest(".ab");if(!b||S.ans||!S.q||reading())return;
  var k=+b.getAttribute("data-k"),q=S.q,now=Date.now(),ms=now-q.start,rem=q.end-now;
  if(rem<-500)return;
  S.ans={k:k,ms:ms};b.classList.add("pick");$("q-ans").classList.add("off");
  var fx=answerFx(ms,rem,q.end-q.start,!!S.train);S.ans.fx=fx;
  if(S.train)trainAnswer(k,null);
  else{sendAns({t:"an",i:q.i,k:k,ms:ms});sentMsg(fx==="fast"?"Réponse éclair envoyée ⚡":"Réponse envoyée ✓ — attends la correction");}
});

/* ─── saisie libre : clavier virtuel ─── */
var PADS={
  num:[["7"],["8"],["9"],["⌫","del"],["4"],["5"],["6"],["%","op"],["1"],["2"],["3"],["−","op"],["0"],[",","op"],["Valider","ok"]],
  lit:[["7"],["8"],["9"],["⌫","del"],["4"],["5"],["6"],["x","op x"],["1"],["2"],["3"],["x²","op"],["0"],[",","op"],["+","op"],["−","op"],["(","op"],[")","op"],["Valider","ok"]]
};
function buildPad(kind){
  $("kpad").innerHTML=(PADS[kind]||PADS.num).map(function(b){return '<button type="button" class="'+(b[1]||"")+'" data-key="'+esc(b[0])+'">'+esc(b[0])+"</button>";}).join("");
}
/* touches autorisées ; sur clavier AZERTY, les chiffres sans Maj (&é"'è_çà) sont acceptés */
var AZ={"&":"1","é":"2","\"":"3","'":"4","è":"7","_":"8","ç":"9","à":"0"};
function mapKey(c){
  var lit=S.q&&S.q.kb==="lit";
  if(AZ[c])return AZ[c];
  if(/[0-9]/.test(c))return c;
  if(c===","||c==="."||c===";")return ",";
  if(c==="-"||c==="−"||c==="–")return "−";
  if(c==="%")return "%";
  if(lit){
    if(c==="x"||c==="X")return "x";
    if(c==="+"||c==="(" ||c===")")return c;
    if(c==="²")return "²";
    if(c==="^")return "^";
    if(c==="*"||c==="×")return "×";
  }else if(c==="(")return "5";
  return "";
}
function cleanTyped(raw){
  var out="";String(raw||"").split("").forEach(function(c){var m=mapKey(c);if(m)out+=m;});
  return out.replace(/x²/g,"x²").slice(0,20);
}
function renderTyped(){
  var i=$("f-in"),v=S.typed||"";
  if(i.value!==v)i.value=v;
}
function pushKey(k){
  if(S.ans||!S.q)return;
  var v=S.typed||"";
  if(k==="⌫"){v=v.slice(0,-1);}
  else if(k==="Valider"){submitFree();return;}
  else if(v.length<20){v+=k;}
  S.typed=v;renderTyped();
}
$("kpad").addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;
  pushKey(b.getAttribute("data-key"));vibrate(8);
  if(!isTouch())$("f-in").focus();
});
$("f-in").addEventListener("input",function(){
  var c=cleanTyped(this.value);
  if(c!==this.value)this.value=c;
  S.typed=c;
});
$("f-in").addEventListener("keydown",function(e){
  if(e.key==="Enter"){e.preventDefault();submitFree();}
});
function isTouch(){try{return window.matchMedia("(pointer: coarse)").matches;}catch(e){return false;}}
function submitFree(){
  if(reading())return;
  var v=(S.typed||"").replace(/x²/g,"x^2").replace(/×/g,"*");
  if(!v.trim()){var b=$("f-box");b.classList.remove("shake");void b.offsetWidth;b.classList.add("shake");return;}
  var q=S.q,now=Date.now(),ms=now-q.start,rem=q.end-now;if(rem<-500)return;
  if(!S.train&&!/x/.test(v)&&!parseNumber(v)){toast("Écris un nombre (par exemple 4,5 ou 25 %).","ko");return;}
  S.ans={v:v,ms:ms};
  var fx=answerFx(ms,rem,q.end-q.start,!!S.train);S.ans.fx=fx;
  $("q-free").classList.add("hidden");
  if(S.train)trainAnswer(-1,v);
  else{sendAns({t:"an",i:q.i,k:-1,v:v,ms:ms});sentMsg("Ta réponse « "+S.typed+" » est envoyée ✓");}
}

/* ─── tuiles, ordre, curseur ─── */
var WG=null;
function buildWidget(q){
  var k=pubKind(q);WG={k:k,q:q};
  if(k==="assoc"){WG.v=q.L.map(function(){return -1;});WG.sl=-1;WG.sr=-1;}
  else if(k==="ordre"){WG.seq=[];}
  else{var sl=q.sl,mid=sl.min+(sl.max-sl.min)/2;WG.v=rd(sl.min+Math.round((mid-sl.min)/sl.step)*sl.step,6);WG.moved=false;}
  drawWidget();
}
function wValid(on,txt){return '<button type="button" class="btn btn-go btn-big btn-block w-ok" id="w-ok"'+(on?"":" disabled")+">"+ICO.check+(txt||"Valider")+"</button>";}
function drawWidget(){
  if(!WG)return;
  var q=WG.q,h="";
  if(WG.k==="assoc"){
    var rOwner=function(j){for(var i=0;i<WG.v.length;i++)if(WG.v[i]===j)return i;return -1;};
    var tile=function(side,i,t,own){var p=own>=0;return '<button type="button" class="wt'+(side==="R"?" r":"")+(p?" pd":"")+((side==="L"?WG.sl:WG.sr)===i?" sel":"")+'" data-s="'+side+'" data-i="'+i+'"'+(p?' style="--pc:'+PAIR_C[own%5]+'"':"")+">"+(p?'<b class="pn">'+(own+1)+"</b>":"")+"<span>"+rt(t)+"</span></button>";};
    h='<div class="wa"><div class="wcol">'+q.L.map(function(t,i){return tile("L",i,t,WG.v[i]>=0?i:-1);}).join("")+'</div><div class="wcol">'+q.R.map(function(t,j){return tile("R",j,t,rOwner(j));}).join("")+"</div></div>";
    var all=WG.v.every(function(x){return x>=0;});
    h+='<p class="whint">'+(all?"Tout est associé : vérifie, puis valide.":"Touche une tuile à gauche, puis sa partenaire à droite. Touche une paire pour la défaire.")+"</p>"+wValid(all);
  }else if(WG.k==="ordre"){
    var n=q.D.length,used={},sep=q.sep?String(q.sep).trim():"";WG.seq.forEach(function(j){used[j]=1;});
    h='<div class="whow">'+(q.how?"Range "+esc(q.how):"Touche les tuiles dans le bon ordre")+"</div><div class=\"wslots\">";
    for(var s2=0;s2<n;s2++){
      if(s2&&sep)h+='<span class="osep">'+esc(sep)+"</span>";
      h+=WG.seq[s2]!==undefined?'<button type="button" class="wt pd" data-o="out" data-k="'+s2+'" style="--pc:#5B55C4"><b class="pn">'+(s2+1)+"</b><span>"+rt(q.D[WG.seq[s2]])+"</span></button>":'<span class="wslot">'+(s2+1)+"</span>";
    }
    h+='</div><div class="wpool">'+q.D.map(function(t,j){return used[j]?"":'<button type="button" class="wt" data-o="in" data-j="'+j+'"><span>'+rt(t)+"</span></button>";}).join("")+"</div>";
    h+='<p class="whint">'+(WG.seq.length===n?"C’est complet : vérifie, puis valide.":"Touche une tuile placée pour la retirer.")+"</p>"+wValid(WG.seq.length===n);
  }else{
    var sl=q.sl;
    h='<div class="wsl"><div class="wsl-v" id="wsl-v">'+esc(fmtSl(sl,WG.v))+'</div><div class="wsl-r"><input type="range" id="wsl" min="'+sl.min+'" max="'+sl.max+'" step="'+sl.step+'" value="'+WG.v+'" aria-label="Ton estimation"></div>'+
      '<div class="sc-ticks">'+slTicks(sl).map(function(v,i){return '<span style="left:'+(i*25)+'%">'+esc(f(v,sl.d))+"</span>";}).join("")+"</div>"+
      '<div class="wsl-b"><button type="button" class="ibtn" data-sl="-1" aria-label="Diminuer">−</button><span class="small muted">Glisse le curseur sur ton estimation</span><button type="button" class="ibtn" data-sl="1" aria-label="Augmenter">+</button></div></div>'+wValid(true,"Valider mon estimation");
  }
  $("q-wid").innerHTML=h;
}
function nudge(dir){
  var sl=WG.q.sl,st=Math.max(sl.step,niceDown((sl.max-sl.min)/100));
  WG.v=rd(Math.max(sl.min,Math.min(sl.max,WG.v+dir*st)),6);WG.moved=true;
  var i=$("wsl");if(i)i.value=WG.v;$("wsl-v").textContent=fmtSl(sl,WG.v);
}
$("q-wid").addEventListener("click",function(e){
  if(!WG||S.ans)return;
  var b=e.target.closest("button");if(!b)return;
  if(b.id==="w-ok"){submitWidget();return;}
  if(b.hasAttribute("data-sl")){nudge(+b.getAttribute("data-sl"));vibrate(6);return;}
  if(WG.k==="assoc"&&b.hasAttribute("data-s")){
    var side=b.getAttribute("data-s"),i=+b.getAttribute("data-i");
    if(side==="L"){
      if(WG.v[i]>=0){WG.v[i]=-1;WG.sl=-1;}
      else{WG.sl=WG.sl===i?-1:i;}
    }else{
      var own=-1;for(var k=0;k<WG.v.length;k++)if(WG.v[k]===i)own=k;
      if(own>=0){WG.v[own]=-1;WG.sr=-1;}
      else{WG.sr=WG.sr===i?-1:i;}
    }
    if(WG.sl>=0&&WG.sr>=0){WG.v[WG.sl]=WG.sr;WG.sl=-1;WG.sr=-1;SND.pop();vibrate(15);}
    drawWidget();return;
  }
  if(WG.k==="ordre"&&b.hasAttribute("data-o")){
    if(b.getAttribute("data-o")==="in"){WG.seq.push(+b.getAttribute("data-j"));SND.pop();vibrate(10);}
    else WG.seq.splice(+b.getAttribute("data-k"),1);
    drawWidget();return;
  }
});
$("q-wid").addEventListener("input",function(e){
  if(e.target.id!=="wsl"||!WG)return;
  WG.v=rd(+e.target.value,6);WG.moved=true;$("wsl-v").textContent=fmtSl(WG.q.sl,WG.v);
});
$("q-wid").addEventListener("keydown",function(e){if(e.target.id==="wsl"&&e.key==="Enter"){e.preventDefault();submitWidget();}});
function submitWidget(){
  if(!WG||S.ans||!S.q||reading())return;
  var q=S.q,now=Date.now(),ms=now-q.start,rem=q.end-now;if(rem<-500)return;
  var v=WG.k==="assoc"?WG.v.slice():WG.k==="ordre"?WG.seq.slice():WG.v;
  if(WG.k==="assoc"&&v.some(function(x){return x<0;}))return;
  if(WG.k==="ordre"&&v.length!==q.D.length)return;
  S.ans={v:v,ms:ms};
  var fx=answerFx(ms,rem,q.end-q.start,!!S.train);S.ans.fx=fx;
  $("q-wid").classList.add("off");
  if(S.train)trainAnswer(-1,v);
  else{sendAns({t:"an",i:q.i,k:-1,v:v,ms:ms});sentMsg(fx==="fast"?"Réponse éclair envoyée ⚡":"Réponse envoyée ✓ — attends la correction");$("q-wid").classList.add("hidden");}
}
/* détail de la correction pour les tuiles, l’ordre et le curseur */
function revealDetail(m){
  var q=S.q,a=S.ans&&S.ans.v;
  if(!q||!m.cor||q.i!==m.i)return "";
  var k=pubKind(q),h="";
  if(k==="assoc"){
    h='<div class="card rv-info rv-det"><b class="lbl2">Les bonnes paires</b><div class="pairs">'+q.L.map(function(t,i){var mine=Array.isArray(a)?a[i]:-1,good=mine===m.cor[i];
      return '<div class="pair'+(Array.isArray(a)?(good?" okp":" kop"):"")+'" style="--pc:'+PAIR_C[i%5]+'"><span class="tile">'+rt(t)+'</span><span class="pa">⟷</span><span class="tile r">'+rt(q.R[m.cor[i]])+"</span><b>"+(Array.isArray(a)?(good?"✓":"✗"):"")+"</b></div>";}).join("")+"</div></div>";
  }else if(k==="ordre"){
    h='<div class="card rv-info rv-det"><b class="lbl2">Le bon ordre</b>'+ordreHtml(q,m.cor,q.sep)+(Array.isArray(a)&&a.join()!==m.cor.join()?'<b class="lbl2" style="margin-top:.6rem">Ton ordre</b><div class="orow">'+a.map(function(j,i){return '<span class="tile'+(j===m.cor[i]?" ok":" ko")+'">'+rt(q.D[j])+"</span>";}).join("")+"</div>":"")+"</div>";
  }else if(k==="slider"){
    h='<div class="card rv-info rv-det">'+scaleHtml(q.sl,{zone:{a:m.cor.a,t:m.cor.t},ans:m.cor.a,me:typeof a==="number"?a:undefined})+'<p class="small muted center">Zone verte : tous les points. Zone orange : la moitié des points.</p></div>';
  }
  return h;
}

/* ═══ 5. CORRECTION ═══ */
function showReveal(m){
  clearInterval(S.timer);
  S.phase="rv";
  var r=m.rs&&m.rs[S.train?"me":S.pid],st=r?r[0]:-1,pts=r?r[1]:0;
  /* carnet : notion jouée en direct (une seule fois par question) */
  if(!S.train&&!S.host&&S.q&&S.q.id&&S.q.i===m.i&&r){S.qlog=S.qlog||[];if(!S.qlog.some(function(x){return x[3]===S.round+"|"+m.i;}))S.qlog.push([S.q.id,st===1?1:0,1,S.round+"|"+m.i]);}
  if(r)S.score=r[2];
  var card=$("rv-card"),cls=st===1?"ok":st===2?"pa":st===0?"ko":"na",kd=S.q?pubKind(S.q):"qcm",det=revealDetail(m),ec=r&&r[5]&&ERR[r[5]]&&ERR[r[5]].s?r[5]:"";
  card.className="rv-card "+cls;
  card.innerHTML='<div class="ic">'+(st===1?ICO.check:st===2?ICO.star:st===0?ICO.cross:ICO.clock)+"</div><h2>"+(st===1?pick2(["Bravo !","Exact !","Bien joué !","Parfait !"]):st===2?pick2(["Presque !","Pas loin !","Tout près !"]):st===0?pick2(["Raté…","Pas cette fois","Presque…"]):"Pas de réponse")+"</h2>"+
    (S.host?'<div class="pts">'+(st===1?"Dégâts infligés à la jauge de la classe !":st===0||st===2?"Votre jauge de vie baisse…":"Pas de dégâts infligés")+"</div>":(st===1||st===2)&&pts>0?'<div class="pts">+'+fmtInt(pts)+" pts"+(m.fr?" (×1,5)":st===2?" (points partiels)":"")+"</div>":"")+
    (r&&r[3]>=2?'<div class="streak">'+ICO.flame+"Série de "+r[3]+"</div>":"")+
    (st!==1&&!(det&&(kd==="assoc"||kd==="ordre"))?'<div class="rv-good"><small>La bonne réponse</small><span class="v">'+rt(m.at)+"</span></div>":"")+
    (ec&&st!==1?'<div class="rv-err">'+ICO.bolt+"<span>"+esc(ERR[ec].s)+"</span></div>":"");
  var x=det;
  if(m.ex)x+='<details class="acc rv-info"><summary>Voir l’explication</summary><div class="acc-b">'+rt(m.ex)+"</div></details>";
  if(S.mode==="solo"&&r&&r[4])x+='<div class="card rv-info center"><b>Tu es '+r[4]+(r[4]===1?"ᵉʳ":"ᵉ")+"</b> · "+fmtInt(S.score)+" pts</div>";
  if(S.mode==="duel"&&m.tm){
    var ord=m.tm.map(function(s,k){return {k:k,s:s};}).sort(function(a,b){return b.s-a.s;});
    x+='<div class="mini-teams rv-info">'+ord.map(function(t,i){return '<div style="--tc:'+TEAMS[t.k].c+'"><span>'+(i+1)+". "+esc((m.tn||[])[t.k]||TEAMS[t.k].n)+(t.k===S.team?" (toi)":"")+"</span><b>"+fmtInt(t.s)+"</b></div>";}).join("")+"</div>";
  }
  if(S.mode==="boss"&&m.boss){
    x+='<div class="mini-boss rv-info"><span>Classe</span><div class="hp"><i style="width:'+m.boss.pc+'%"></i></div><b>'+m.boss.pc+'</b><span>Prof</span><div class="hp boss"><i style="width:'+m.boss.pp+'%"></i></div><b>'+m.boss.pp+"</b></div>";
  }
  x+='<div class="center muted small" style="margin-top:.6rem">'+(S.host?"":"Score : <b>"+fmtInt(S.score)+" pts</b> · ")+m.rate+" % de la classe a trouvé</div>";
  $("rv-extra").innerHTML=x;
  $("rv-wait").classList.remove("hidden");$("rv-next").classList.add("hidden");
  show("s-rv");
  revealFx(st,pts);
}
function pick2(a){return a[Math.floor(Math.random()*a.length)];}
function revealFx(st,pts){
  if(st===2){fxFlash("rgba(239,180,67,.35)");SND.pop();vibrate(40);return;}
  if(st===1){fxFlash("rgba(46,158,126,.35)");confetti({n:90,y:window.innerHeight*0.3});SND.good();vibrate(80);}
  else if(st===0){fxFlash("rgba(217,96,106,.35)");var c=$("rv-card");c.classList.add("shake");SND.bad();vibrate([60,40,60]);}
}

/* ═══ 6. FIN DE PARTIE ═══ */
function showEnd(m){
  clearInterval(S.timer);
  S.phase="end";
  var r=m.rk&&m.rk[S.pid];
  $("end-t").textContent=m.title||"Les gagnants";
  $("end-pod").innerHTML=podiumHtml(m.pod||[]);
  var me="";
  if(r){
    me='<div class="rk">'+r[0]+(r[0]===1?"ᵉʳ":"ᵉ")+"</div><div><b>"+fmtInt(r[1])+" pts</b> · "+r[2]+" / "+r[3]+" bonnes réponses</div>";
    if(m.m==="duel"&&m.ts){var best=m.ts.indexOf(Math.max.apply(null,m.ts));me+='<div class="muted" style="margin-top:.3rem">'+(best===S.team?"Ton équipe a gagné !":"Équipe gagnante : "+esc((m.tn||[])[best]||""))+"</div>";}
    if(m.m==="boss")me+='<div class="muted" style="margin-top:.3rem">'+(m.win==="class"?"La classe a gagné !":"Le prof a gagné cette fois.")+"</div>";
  }else me='<div class="muted">Partie terminée.</div>';
  $("end-me").innerHTML=me;
  $("end-prog").innerHTML="";
  $("end-wait").textContent="Reste ici : si le prof relance une partie, tu y entres directement.";
  show("s-end");
  playPodium($("end-pod"),null,!PREF.sound);
  if(r&&S.awarded!==(S.round||0)){
    S.awarded=S.round||0;
    var won=(m.m==="duel"&&m.ts&&m.ts.indexOf(Math.max.apply(null,m.ts))===S.team)||false;
    var items=(S.qlog||[]).filter(function(x){return String(x[3]).split("|")[0]===String(S.round);}).map(function(x){return [x[0],x[1],1];});S.qlog=[];
    var res=awardSession({pts:r[1],ok:r[2],na:r[3],nq:r[3],best:r[4]||0,tavg:null,expertOk:r[5]||0,wire:(r[6]||0)>0,teamWin:won,bossWin:m.m==="boss"&&m.win==="class",rank:m.m==="solo"?r[0]:0,nplayers:m.np||0,items:items});
    setTimeout(function(){$("end-prog").innerHTML=progBlockHtml(res);},3200);
  }
}
$("end-carnet").addEventListener("click",function(){openCarnet();});
$("end-home").addEventListener("click",function(){leaveRoom(true);});
$("lb-leave").addEventListener("click",function(){
  var b=this;if(b.getAttribute("data-arm")!=="1"){b.setAttribute("data-arm","1");b.textContent="Confirmer : quitter ?";setTimeout(function(){b.removeAttribute("data-arm");b.textContent="Quitter la salle";},4000);return;}
  b.removeAttribute("data-arm");b.textContent="Quitter la salle";leaveRoom(true);toast("Tu as quitté la salle. Tape un autre code pour rejoindre une partie.");
});
/* ─── déconnexion automatique après 20 min d’inactivité (aucun geste et aucune question reçue) ─── */
var IDLE_MS=20*60000,IDLE_LAST=Date.now();
function markActive(){IDLE_LAST=Date.now();}
["pointerdown","keydown","touchstart"].forEach(function(ev){document.addEventListener(ev,markActive,{passive:true});});
setInterval(function(){
  if(!S.ch||S.train)return;
  if(Date.now()-IDLE_LAST>IDLE_MS){leaveRoom(true);var e=$("code-err");e.textContent="Déconnecté après 20 minutes d’inactivité. Tape le code pour revenir.";e.classList.remove("hidden");}
},30000);

/* ═══ 7. ENTRAÎNEMENT AUTONOME (hors ligne) ═══ */
var TR={niv:null,chap:"",nq:10,fmt:"mix",prog:true};
function openTrain(){
  var t=store.get("train",null);if(t)for(var k in TR)if(t[k]!==undefined)TR[k]=t[k];
  if(!TR.niv)TR.niv="cap";
  renderTrain();show("s-train");
}
function renderTrain(){
  $("tr-niv").innerHTML=NIVEAUX.map(function(n){return '<button type="button" data-v="'+n.id+'"'+(TR.niv===n.id?' class="on"':"")+">"+esc(n.court)+"</button>";}).join("");
  var br=buildTree().filter(function(b){return b.niv.id===TR.niv;})[0],chs=br?br.chaps:[];
  var wk=weakNotions();if(TR.chap==="__rev"&&!wk.length)TR.chap="";
  $("tr-chap").innerHTML=(wk.length?'<option value="__rev"'+(TR.chap==="__rev"?" selected":"")+">★ À revoir : mes "+wk.length+" notion"+(wk.length>1?"s":"")+" fragile"+(wk.length>1?"s":"")+" (tous niveaux)</option>":"")+'<option value=""'+(TR.chap===""?" selected":"")+'>Tout le niveau</option>'+chs.map(function(c){return '<option'+(TR.chap===c.nom?" selected":"")+">"+esc(c.nom)+"</option>";}).join("");
  $("tr-nq").innerHTML=[5,10,20].map(function(n){return '<button type="button" data-v="'+n+'"'+(TR.nq===n?' class="on"':"")+">"+n+"</button>";}).join("");
  $("tr-fmt").innerHTML=[["qcm","QCM"],["mix","Mixte"],["libre","Saisie libre"]].map(function(x){return '<button type="button" data-v="'+x[0]+'"'+(TR.fmt===x[0]?' class="on"':"")+">"+x[1]+"</button>";}).join("");
  $("tr-prog").checked=TR.prog;
}
$("tr-niv").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;TR.niv=b.getAttribute("data-v");TR.chap="";renderTrain();});
$("tr-nq").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;TR.nq=+b.getAttribute("data-v");renderTrain();});
$("tr-fmt").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;TR.fmt=b.getAttribute("data-v");renderTrain();});
$("tr-chap").addEventListener("change",function(){TR.chap=this.value;});
$("tr-prog").addEventListener("change",function(){TR.prog=this.checked;});
$("tr-back").addEventListener("click",function(){show(S.ch?"s-lobby":"s-code");});
$("tr-go").addEventListener("click",function(){store.set("train",TR);SND.unlock();startTrain();});
function trainItems(){
  if(TR.chap==="__rev"){var w=weakNotions().slice(0,8).map(function(x){return ITEM_BY_ID[x.id];}).filter(function(it){return it&&!HIDDEN[it.id];});if(w.length)return w;}
  var br=buildTree().filter(function(b){return b.niv.id===TR.niv;})[0],out=[];
  if(br)br.chaps.forEach(function(c){if(!TR.chap||c.nom===TR.chap)out=out.concat(c.items);});
  return out;
}
function startTrain(){
  var items=trainItems();if(!items.length){toast("Aucune notion pour ce choix.","ko");return;}
  S.train={items:items,i:-1,N:TR.nq,lvl:1,up:0,dn:0,score:0,ok:0,streak:0,best:0,free:0,seen:{},hist:[],reached3:false,wire:false};
  S.score=0;S.mode="train";
  nextTrain();
}
function trainPickQuestion(){
  var T=S.train,items=T.items;
  if(TR.prog&&TR.chap!=="__rev"){var at=items.filter(function(it){return it.d===T.lvl;});if(!at.length)at=items.filter(function(it){return Math.abs(it.d-T.lvl)<=1;});if(at.length)items=at;}
  T.seenS=T.seenS||{};var fb=null;
  for(var k=0;k<40;k++){
    var it=items[Math.floor(Math.random()*items.length)],q=makeQuestion(it.id,(Math.random()*1e9)>>>0,{metiers:Object.keys(METIERS)});
    if(!q||T.seen[q.q])continue;
    var sh=qShape(q);
    if(!T.seenS[sh]||k>30){T.seen[q.q]=1;T.seenS[sh]=1;return q;}
    if(!fb)fb=q;
  }
  if(fb){T.seen[fb.q]=1;return fb;}
  return makeQuestion(items[0].id,(Math.random()*1e9)>>>0,{});
}
function nextTrain(){
  var T=S.train;T.i++;
  if(T.i>=T.N){endTrain();return;}
  var q=trainPickQuestion();if(!q){endTrain();return;}
  if(!q.kind){
    q.libre=q.only==="libre"||(isFree(q)&&(TR.fmt==="libre"||(TR.fmt==="mix"&&T.i%3===1)));
    if(!q.libre&&TR.fmt==="mix"&&q.est&&T.i%3===2){var s=toSlider(q,(Math.random()*1e9)>>>0);if(s)q=s;}
  }
  T.cur=q;
  var dur=dureeQuestion(q,0,q.libre)*1000*1.5,pub=qPublic(q);
  pub.i=T.i;pub.N=T.N;pub.dur=dur;
  showQuestion(pub,false);
  $("q-tag").innerHTML+=TR.prog?'<span class="tag t-mint">Niveau '+T.lvl+" / 3</span>":"";
}
function trainAnswer(k,v){
  var T=S.train,q=T.cur;
  clearInterval(S.timer);
  trainResult(judge(q,{k:k,v:v}),S.ans);
}
function trainTimeout(){if(S.ans)return;S.ans={none:true};trainResult(null,null);}
function trainResult(res,a){
  var T=S.train,q=T.cur,pts=0,dur=(S.q.end-S.q.start)/1000,ok=res?res.ok:null,part=res?res.part:0;
  if(ok){T.streak++;T.ok++;pts=Math.round(ptsFor(a.ms/1000,dur,T.streak)*kindMult(q));if(q.libre)T.free++;if(a.fx==="wire")T.wire=true;T.up++;T.dn=0;}
  else{T.streak=0;T.dn++;T.up=0;if(part>0&&a)pts=Math.round(ptsFor(a.ms/1000,dur,0)*kindMult(q)*part);}
  T.best=Math.max(T.best,T.streak);T.score+=pts;S.score=T.score;
  T.hist.push([q.id,ok?1:0,1]);
  var msg="";
  if(TR.prog){
    if(T.up>=2&&T.lvl<3){T.lvl++;T.up=0;msg="Niveau "+T.lvl+" débloqué !";if(T.lvl===3)T.reached3=true;}
    else if(T.dn>=2&&T.lvl>1){T.lvl--;T.dn=0;msg="On revient au niveau "+T.lvl+" pour consolider.";}
  }
  showReveal({i:T.i,rs:{me:[ok===null?-1:ok?1:part>0?2:0,pts,T.score,T.streak,0,res&&!ok?res.err:""]},at:answerText(q),ex:q.expl,fr:q.libre?1:0,rate:Math.round(100*T.ok/(T.i+1)),cor:qCorr(q)});
  $("rv-wait").classList.add("hidden");$("rv-next").classList.remove("hidden");
  $("tr-next").textContent=T.i+1>=T.N?"Voir mon bilan":"Question suivante";
  if(ok&&a&&a.fx)setTimeout(function(){playAnsFx(a.fx);},500);
  if(msg)setTimeout(function(){fxStamp(msg.indexOf("débloqué")>0?"Niveau "+T.lvl+" !":"Niveau "+T.lvl,"#5B55C4","star",1400);},1500);
  $("rv-extra").innerHTML=$("rv-extra").innerHTML.replace(/[0-9]+ % de la classe a trouvé/,T.ok+" / "+(T.i+1)+" réussies");
}
$("tr-next").addEventListener("click",function(){if(S.train)nextTrain();});
function endTrain(){
  var T=S.train,res=awardSession({pts:T.score,ok:T.ok,na:T.i,nq:T.i,best:T.best,tavg:null,expertOk:T.free,solo:true,reached3:T.reached3,wire:T.wire,items:T.hist});
  $("end-t").textContent=T.ok===T.i&&T.i>=5?"Sans faute !":"Entraînement terminé";
  $("end-pod").innerHTML="";
  $("end-me").innerHTML='<div class="rk">'+T.ok+" / "+T.i+"</div><div><b>"+fmtInt(T.score)+" pts</b> · meilleure série : "+T.best+"</div>";
  $("end-prog").innerHTML=progBlockHtml(res);
  $("end-wait").textContent="";
  S.train=null;show("s-end");
  if(T.ok>=T.i*0.8){confetti({rain:true,n:140});SND.fanfare();}
}

/* ═══ 8. CARNET ═══ */
function openCarnet(){$("carnet").innerHTML=carnetHtml();show("s-carnet");}
$("cn-back").addEventListener("click",function(){show(S.ch?(S.phase==="end"?"s-end":"s-lobby"):"s-code");if(S.ch&&S.phase==="lobby")renderLobby();});
$("cn-exp").addEventListener("click",function(){download("flash_maths_carnet.json",JSON.stringify(loadProg()));});
$("cn-imp").addEventListener("change",function(){var f=this.files[0];if(!f)return;readFileText(f,function(t){try{var o=JSON.parse(t);if(!o||typeof o.xp!=="number")throw 0;saveProg(o);openCarnet();toast("Carnet importé.","ok");}catch(e){toast("Fichier illisible.","ko");}});this.value="";});
$("cn-del").addEventListener("click",function(){
  var b=this;if(b.getAttribute("data-arm")!=="1"){b.setAttribute("data-arm","1");b.textContent="Confirmer l’effacement ?";setTimeout(function(){b.removeAttribute("data-arm");b.textContent="Effacer mes données";},3000);return;}
  store.clearAll();openCarnet();toast("Données effacées de cet appareil.","ok");
});
$("go-train").addEventListener("click",openTrain);
$("go-carnet").addEventListener("click",openCarnet);

/* ═══ DÉMARRAGE ═══ */
(function init(){
  $("brand").outerHTML=brandHtml("élève","index.html");
  $("foot").innerHTML=footHtml();
  $("b-menu").innerHTML=ICO.menu;
  $("ps-dice").innerHTML=ICO.dice+"Prendre un pseudo au hasard";
  $("go-train").innerHTML=ICO.rocket+"S’entraîner seul";
  $("go-carnet").innerHTML=ICO.star+"Mon carnet";
  initZoom("eleve",$("zoom"));fitWatch($("app"));
  var p=store.get("eleve",null);if(p)for(var k in PREF)if(p[k]!==undefined)PREF[k]=p[k];
  setView(PREF.view||"mob");soundLabel();
  renderSlots();show("s-code");
  /* lien direct (QR code) : eleve.html?c=4F2A */
  var m=location.search.match(/[?&]c=([0-9a-fA-F]{4})/);
  var sess=store.get("sess",null);
  if(m){CODE=m[1].toUpperCase();renderSlots();
    if(sess&&sess.code===CODE&&Date.now()-sess.at<3*3600e3){joinRoom(CODE,sess.pseudo,sess.pid).catch(function(){gotoPseudo();});}
    else checkCode();
  }else if(sess&&Date.now()-sess.at<3*3600e3&&fmConfig()&&!fmConfig().bad){
    CODE=sess.code;renderSlots();
    joinRoom(sess.code,sess.pseudo,sess.pid).catch(function(){store.del("sess");CODE="";renderSlots();});
  }
  window.addEventListener("pagehide",function(){if(S.ch)S.ch.send({t:"bye",id:S.pid});});
})();
