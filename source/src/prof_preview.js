/* ═══════════════════════════════════════════════════════════════
   PAGE PROF — 2. « Générer » : aperçu des questions et édition
═══════════════════════════════════════════════════════════════ */
var QS=[];
var CTX={metiers:Object.keys(METIERS)};
function show(id){["s-pick","s-prev","s-lobby","s-game","s-end"].forEach(function(s){$(s).classList.toggle("hidden",s!==id);});document.body.classList.toggle("ingame",id==="s-game");window.scrollTo(0,0);fitScreen(id==="s-game",{min:0.55,max:document.body.classList.contains("v-mob")?1.7:2.3});}
function stripD(s){return String(s||"").replace(/\$/g,"").trim();}
function qType(q){return qKind(q);}
function stripQ(q){var o=JSON.parse(JSON.stringify(q));delete o.orig;return o;}
function qDur(q){return dureeQuestion(q,P.dur,q.libre);}
function applyFormat(list){
  var k=0,e=0;
  list.forEach(function(q){
    if(q.kind)return;
    if(q.only==="libre"){q.libre=true;return;}
    var el=isFree(q);
    if(P.fmt==="qcm")q.libre=false;
    else if(P.fmt==="libre")q.libre=el;
    else{q.libre=el&&(k%2===1);if(el)k++;}
  });
  /* calculs longs : une sur deux en estimation au curseur (sauf format « Saisie libre ») */
  if(P.est!==false&&P.fmt!=="libre")list=list.map(function(q){
    if(q.kind||q.libre||!q.est)return q;
    if(e++%2!==0)return q;
    var s=toSlider(q,q.seed||7);if(!s)return q;s.orig=stripQ(q);return s;
  });
  return list;
}
/* mémoire des questions déjà jouées : deux parties de suite sur le même thème ne se répètent pas */
function trimMap(o,keep){var k=Object.keys(o);if(k.length<=keep)return o;k.sort(function(a,b){return o[a]-o[b];});k.slice(0,k.length-keep).forEach(function(x){delete o[x];});return o;}
function recentSet(){
  var h=store.get("hist2",null);
  if(!h||typeof h!=="object"){h={n:1,t:{},s:{},i:{}};store.get("recent",[]).forEach(function(t,i){h.t[t]=1;});}
  return normHist(h);
}
/* mémoire des parties jouées : énoncés, formes d’énoncés et notions (rang = ordre d’apparition) */
function rememberPlayed(qs){
  var h=recentSet();
  qs.forEach(function(q){h.n++;h.t[q.q]=h.n;h.s[qShape(q)]=h.n;if(q.id)h.i[q.id]=h.n;});
  trimMap(h.t,1500);trimMap(h.s,700);trimMap(h.i,400);
  store.set("hist2",h);
}
function generate(){
  var seed=(Date.now()^Math.floor(Math.random()*1e9))>>>0;
  var avoid=recentSet();QS.forEach(function(q){avoid.n++;avoid.t[q.q]=avoid.n;avoid.s[qShape(q)]=avoid.n;if(q.id)avoid.i[q.id]=avoid.n;});
  CTX.plain=P.vary===false;
  var list=drawQuestions(P.sel,P.nq,CTX,seed,avoid);
  if(P.ord==="prog")list=list.map(function(q,i){return {q:q,i:i};}).sort(function(a,b){return (a.q.d-b.q.d)||(a.i-b.i);}).map(function(x){return x.q;});
  list.forEach(function(q,i){q.seed=seed+i;q.uid=genId();});
  QS=applyFormat(list);
  if(!QS.length){toast("Impossible de générer des questions avec cette sélection.","ko");return;}
  $("pv-show").checked=false;$("pv-list").classList.add("hideans");
  renderPreview();show("s-prev");SND.whoosh();
  var rep=QS.filter(function(q){return avoid.t[q.q];}).length;
  if(QS.length<P.nq)toast("Seulement "+QS.length+" questions différentes avec cette sélection : ajoutez des notions pour en avoir plus.");
  else if(rep)toast(rep+" question"+(rep>1?"s ont":" a")+" déjà été posée"+(rep>1?"s":"")+" récemment : la sélection est trop petite pour tout renouveler. Ajoutez une notion pour plus de variété.");
}
function previewCard(q,i){
  var t=qType(q),tag=t==="qcm"?'<span class="tag">QCM</span>'+kindTagHtml(q):kindTagHtml(q);
  var h='<div class="pq" data-i="'+i+'"><div class="grip" title="Glisser pour déplacer"><span class="num">'+(i+1)+"</span>"+ICO.grip+'</div><div>'+
    '<div class="meta">'+tag+'<span class="tag t-mint">'+fmtDur(qDur(q))+'</span><span class="src">'+esc(q.titre||"Question ajoutée")+" "+(q.d?"· "+"★★★".slice(0,q.d):"")+"</span></div>"+
    '<div class="qt" data-ed="q" title="Cliquer pour modifier">'+rt(q.q)+"</div>"+figBlock(q.fig);
  if(t==="assoc")h+='<div class="ansz" data-ed="c"><div class="ans-hide">'+assocHtml(q)+'</div><div class="ans-show">'+assocHtml(q,qCorr(q))+"</div></div>";
  else if(t==="ordre")h+='<div class="ansz" data-ed="c"><div class="ans-hide">'+ordreHtml(q)+'</div><div class="ans-show">'+ordreHtml(q,qCorr(q),q.sep)+"</div></div>";
  else if(t==="slider")h+='<div class="ansz" data-ed="c"><div class="ans-hide">'+scaleHtml(q.sl)+'</div><div class="ans-show">'+scaleHtml(q.sl,{zone:{a:q.sl.ans,t:q.sl.tol},ans:q.sl.ans})+"</div></div>";
  else if(t==="libre"){
    h+='<div class="free">'+ICO.keyb+'<span>Réponse attendue :</span><span class="fa">'+rt(freeAnsText(q))+'</span><span class="muted small">'+(q.lit?"clavier avec x":"clavier : chiffres, virgule, −, %")+"</span></div>";
  }else{
    h+='<div class="chs">'+q.choices.map(function(c,k){var et=k!==q.ans&&c.err&&ERR[c.err]&&c.err!=="autre"?ERR[c.err].l:"";return '<div class="ch a'+k+(k===q.ans?" ok":"")+'" data-ed="c" title="'+esc(et?"Erreur type : "+et:"Cliquer pour modifier")+'"><span class="sh">'+SHAPES[k]+"</span><span>"+rt(c.t)+"</span>"+(et?'<span class="ans-show err-chip">'+esc(ERR[c.err].e)+"</span>":"")+"</div>";}).join("")+"</div>";
  }
  h+='<div class="acts"><button type="button" class="btn btn-sm btn-soft" data-a="edit">'+ICO.edit+'Modifier</button>'+
    (q.id&&ITEM_BY_ID[q.id]?'<button type="button" class="btn btn-sm btn-soft" data-a="redraw">'+ICO.refresh+"Nouveau tirage</button>":"")+
    (!q.kind&&isFree(q)&&q.only!=="libre"?'<button type="button" class="btn btn-sm btn-soft tgl'+(q.libre?" on":"")+'" data-a="tgl">'+ICO.keyb+(q.libre?"Saisie libre":"Passer en saisie libre")+"</button>":"")+
    (q.kind==="slider"&&q.orig?'<button type="button" class="btn btn-sm btn-soft tgl on" data-a="est">'+ICO.target+"Estimation (revenir au QCM)</button>":(!q.kind&&!q.libre&&q.num!==undefined&&isFinite(q.num)?'<button type="button" class="btn btn-sm btn-soft tgl" data-a="est">'+ICO.target+"Passer en estimation</button>":""))+
    '<button type="button" class="btn btn-sm btn-ghost" data-a="keep" title="Enregistrer dans Mes questions">'+ICO.star+'Garder</button>'+
    '<button type="button" class="btn btn-sm btn-ghost del" data-a="del">'+ICO.trash+"Supprimer</button></div></div></div>";
  return h;
}
function freeAnsText(q){
  if(q.lit)return q.choices[q.ans]?q.choices[q.ans].t:q.lit;
  if(q.num!==undefined)return f(q.num,q.dec===undefined?2:Math.max(q.dec,0))+(q.unit?" "+q.unit:"");
  return q.choices[q.ans]?q.choices[q.ans].t:"";
}
function renderPreview(){
  $("pv-list").innerHTML=QS.map(previewCard).join("");
  var nl=QS.filter(function(q){return q.libre;}).length,tot=QS.reduce(function(s,q){return s+qDur(q);},0);
  $("pv-title").textContent=QS.length+" question"+(QS.length>1?"s":"")+" prête"+(QS.length>1?"s":"");
  $("pv-sub").textContent=MODES[P.mode].nom+" · "+(nl?nl+" en saisie libre · ":"")+"durée de jeu ≈ "+Math.max(1,Math.round((tot+QS.length*12)/60))+" min";
  $("pv-count").textContent=QS.length+" questions · "+MODES[P.mode].court;
  $("b-open").disabled=!QS.length;
}
$("pv-show").addEventListener("change",function(){$("pv-list").classList.toggle("hideans",!this.checked);});
$("pv-back").addEventListener("click",function(){show("s-pick");renderTree();});
$("pv-regen").addEventListener("click",generate);
$("b-gen").addEventListener("click",function(){SND.unlock();generate();});
$("pv-list").addEventListener("click",function(e){
  var card=e.target.closest(".pq");if(!card)return;
  var i=+card.getAttribute("data-i"),q=QS[i],b=e.target.closest("button[data-a]");
  if(!b){if(e.target.closest("[data-ed]"))openQEdit(i);return;}
  var a=b.getAttribute("data-a");
  if(a==="edit")openQEdit(i);
  else if(a==="redraw"){
    var nq=null,rec=recentSet(),shp={};QS.forEach(function(x,j){if(j!==i)shp[qShape(x)]=1;});
    for(var k=1;k<60&&!nq;k++){var c=makeQuestion(q.id,(q.seed+k*99991+Date.now())>>>0,CTX);if(c&&c.q!==q.q&&!QS.some(function(x){return x.q===c.q;})&&(k>40||(!rec.t[c.q]&&(k>20||(!shp[qShape(c)]&&qShape(c)!==qShape(q))))))nq=c;}
    if(!nq){toast("Pas d’autre version disponible pour cette notion.");return;}
    nq.seed=q.seed+7;nq.uid=q.uid;nq.libre=!nq.kind&&q.libre&&isFree(nq);if(nq.only==="libre")nq.libre=true;if(q.dur)nq.dur=q.dur;
    if(q.from&&!nq.kind&&nq.num!==undefined){var sn=toSlider(nq,nq.seed);if(sn){sn.orig=stripQ(nq);nq=sn;}}
    QS[i]=nq;renderPreview();SND.pop();
  }
  else if(a==="tgl"){q.libre=!q.libre;renderPreview();}
  else if(a==="est"){
    if(q.kind==="slider"&&q.orig){QS[i]=q.orig;}
    else{var s=toSlider(q,q.seed||Date.now());if(!s){toast("Cette question ne peut pas passer en estimation.");return;}s.orig=stripQ(q);QS[i]=s;}
    renderPreview();SND.pop();
  }
  else if(a==="keep"){keepQuestion(q);}
  else if(a==="del"){
    if(QS.length<=1){toast("Il faut garder au moins une question.");return;}
    if(b.getAttribute("data-arm")!=="1"){b.setAttribute("data-arm","1");b.innerHTML=ICO.trash+"Confirmer ?";setTimeout(function(){if(b.isConnected){b.removeAttribute("data-arm");b.innerHTML=ICO.trash+"Supprimer";}},3000);return;}
    QS.splice(i,1);renderPreview();
  }
});
dragDrop({root:$("pv-list"),item:".pq",handle:".grip",zone:"#pv-list",sort:true,onDrop:function(it,zone,before){
  var from=+it.getAttribute("data-i"),q=QS.splice(from,1)[0],to=before?+before.getAttribute("data-i"):QS.length+1;
  if(before&&to>from)to--;
  QS.splice(Math.min(to,QS.length),0,q);renderPreview();
}});
$("pv-add").addEventListener("click",function(){
  QS.push({q:"",choices:[{t:"",err:null},{t:"",err:"autre"},{t:"",err:"autre"},{t:"",err:"autre"}],ans:0,expl:"",titre:"Question ajoutée",d:2,uid:genId(),fresh:true});
  openQEdit(QS.length-1);
});
function keepQuestion(q){
  var c=null;CUSTOM.forEach(function(x){if(x.titre==="Questions gardées")c=x;});
  var o={q:q.q,x:q.expl},cor=qCorr(q);
  if(q.kind==="assoc")o.as=q.L.map(function(t,k){return [t,q.R[cor[k]]];});
  else if(q.kind==="ordre"){o.or=cor.map(function(j){return q.D[j];});o.how=q.how||"";o.sep=q.sep||"";}
  else if(q.kind==="slider")o.es={v:q.sl.ans,min:q.sl.min,max:q.sl.max,tol:q.sl.tol,u:q.sl.u||""};
  else if(!q.libre||q.choices.length>1){o.ok=q.choices[q.ans].t;o.wr=q.choices.filter(function(c2,i){return i!==q.ans;}).map(function(c2){return c2.t;});}
  if(q.num!==undefined){o.num=q.num;o.unit=q.unit;o.dec=q.dec;o.ft=freeAnsText(q);if(!o.ok)o.ok=o.ft;}
  if(q.lit){o.lit=q.lit;o.ft=stripD(freeAnsText(q));if(!o.ok)o.ok=o.ft;}
  if(q.dur)o.t=q.dur;
  if(q.qx)o.keep=1;
  var it=ITEM_BY_ID[q.id],niv=it?it.niv:(P.lvl!=="all"?[P.lvl]:NIVEAUX.map(function(n){return n.id;}));
  if(!c)c={id:"c_"+genId(),titre:"Questions gardées",chap:"Mes questions",niv:niv,d:2,qs:[],vars:[]};
  niv.forEach(function(n){if(c.niv.indexOf(n)<0)c.niv.push(n);});
  c.qs.push(o);
  var cl=cleanItem(c);if(!cl){toast("Question incomplète : impossible de la garder.","ko");return;}
  cl.id=c.id;saveCustomItem(cl);FREE_CACHE={};
  toast("Question gardée dans « Mes questions ».","ok");
}

/* ─── fenêtre d’édition d’une question (QCM, saisie libre, tuiles, ordre, estimation) ─── */
var MQ={i:-1,type:"qcm",ch:[],ans:0};
var MQ_DURS=[0,10,15,20,30,45,60,90,120,180,300];
var MQ_TYPES=[["qcm","QCM"],["libre","Saisie libre"],["assoc","Tuiles"],["ordre","Ordre"],["slider","Estimation"]];
function numIn(v){var p=parseNumber(String(v||""));return p?p.v:NaN;}
function fmtIn(v){return isFinite(v)?String(rd(v,6)).replace(".",","):"";}
function openQEdit(i){
  var q=QS[i];MQ.i=i;MQ.type=qKind(q);if(MQ.type==="vf")MQ.type="qcm";
  MQ.ch=q.choices?q.choices.map(function(c){return c.t;}):[];MQ.ans=q.ans||0;
  if(MQ.ch.length<2&&MQ.type==="qcm"){while(MQ.ch.length<4)MQ.ch.push("");}
  $("mq-n").textContent=(i+1);
  $("mq-q").value=q.q;$("mq-x").value=q.expl||"";
  $("mq-ans").value=isFree(q)?stripD(freeAnsText(q)):(q.choices&&q.choices[q.ans]?stripD(q.choices[q.ans].t):"");
  /* tuiles / ordre / curseur : pré-remplis depuis la question (ou depuis sa valeur numérique) */
  var cor=qCorr(q);
  $("mq-pairs").value=q.kind==="assoc"?q.L.map(function(t,k){return t+" => "+q.R[cor[k]];}).join("\n"):"";
  $("mq-items").value=q.kind==="ordre"?cor.map(function(j){return q.D[j];}).join("\n"):"";
  $("mq-how").value=q.kind==="ordre"?(q.how||""):"";$("mq-sep").value=q.kind==="ordre"&&q.sep?String(q.sep).trim():"";
  var sl=q.kind==="slider"?q.sl:(q.num!==undefined&&isFinite(q.num)?(toSlider(q,q.seed||5)||{}).sl:null);
  $("mq-sa").value=sl?fmtIn(sl.ans):"";$("mq-smin").value=sl?fmtIn(sl.min):"";$("mq-smax").value=sl?fmtIn(sl.max):"";$("mq-stol").value=sl?fmtIn(sl.tol):"";$("mq-su").value=sl?(sl.u||""):(q.unit||"");
  $("mq-dur").innerHTML=MQ_DURS.map(function(s2){return '<option value="'+s2+'"'+((q.dur||0)===s2?" selected":"")+">"+(s2?fmtDur(s2):"automatique ("+fmtDur(dureeQuestion({d:q.d,id:q.id,kind:q.kind,L:q.L},P.dur,MQ.type==="libre"))+")")+"</option>";}).join("");
  renderMQ();openModal("m-q");
  setTimeout(function(){$("mq-q").focus();},60);
}
function renderMQ(){
  $("mq-type").innerHTML=segHtml(MQ_TYPES,MQ.type);
  ["qcm","free","assoc","ordre","slider"].forEach(function(k){$("mq-"+k).classList.toggle("hidden",(k==="free"?"libre":k)!==MQ.type);});
  $("mq-ch").innerHTML=MQ.ch.map(function(t,k){return '<div class="mqc"><input type="radio" name="mq-ok" value="'+k+'"'+(k===MQ.ans?" checked":"")+' aria-label="Bonne réponse"><input class="inp" data-k="'+k+'" value="'+esc(t)+'" maxlength="120" placeholder="Proposition '+ANS[k].l+'">'+(MQ.ch.length>2?'<button type="button" data-rm="'+k+'" title="Retirer">✕</button>':"<span></span>")+"</div>";}).join("")+
    (MQ.ch.length<4?'<button type="button" class="btn btn-sm btn-soft" id="mq-addc">'+ICO.plus+"Ajouter une proposition</button>":"");
  mqPreview();
}
/* construit la question depuis la fenêtre → {q} ou {err} */
function mqBuild(){
  var q=QS[MQ.i],txt=$("mq-q").value.trim(),ex=$("mq-x").value.trim(),r=mulberry32(((q&&q.seed)||1)+101);
  if(MQ.type==="assoc"){
    var pairs=$("mq-pairs").value.split("\n").map(function(l){return l.trim();}).filter(function(l){return l;}).map(function(l){var m=l.split(/\s*(?:=>|⟷|↔|<->|→)\s*/);return m.length===2&&m[0]&&m[1]?[m[0].slice(0,60),m[1].slice(0,60)]:null;});
    if(pairs.some(function(p){return !p;}))return {err:"Écrivez une paire par ligne : gauche => droite"};
    if(pairs.length<2||pairs.length>5)return {err:"Il faut entre 2 et 5 paires."};
    var a=QA(r,txt,pairs,ex);return a?{q:a}:{err:"Deux tuiles sont identiques : chaque tuile doit être unique."};
  }
  if(MQ.type==="ordre"){
    var it=$("mq-items").value.split("\n").map(function(l){return l.trim().slice(0,60);}).filter(function(l){return l;});
    if(it.length<3||it.length>6)return {err:"Il faut entre 3 et 6 tuiles (une par ligne, dans le bon ordre)."};
    var sep=$("mq-sep").value.trim().slice(0,3),o=QO(r,txt,it,ex,{how:$("mq-how").value.trim().slice(0,60),sep:sep?" "+sep+" ":" ; "});
    return o?{q:o}:{err:"Deux tuiles sont identiques."};
  }
  if(MQ.type==="slider"){
    var A=numIn($("mq-sa").value),mn=numIn($("mq-smin").value),mx=numIn($("mq-smax").value),tl=numIn($("mq-stol").value),u=$("mq-su").value.trim().slice(0,8);
    if(!isFinite(A))return {err:"Indiquez la réponse (un nombre)."};
    if(isFinite(mn)!==isFinite(mx))return {err:"Indiquez le minimum ET le maximum (ou aucun des deux)."};
    if(isFinite(mn)&&!(mn<A&&A<mx))return {err:"La réponse doit être strictement entre le minimum et le maximum."};
    if(isFinite(tl)&&!(tl>0))return {err:"La tolérance doit être positive."};
    var o2={u:u};if(isFinite(mn)){o2.min=mn;o2.max=mx;}if(isFinite(tl))o2.tol=tl;
    var e=QE(r,txt,A,o2,ex);if(!e)return {err:"Curseur impossible avec ces valeurs."};
    if(e.sl.tol>(e.sl.max-e.sl.min)/4)return {err:"Tolérance trop large par rapport au curseur."};
    return {q:e};
  }
  return null;
}
function mqPreview(){
  var h='<div style="font-weight:800;font-size:1.1rem">'+rt($("mq-q").value||"…")+"</div>";
  if(MQ.type==="qcm")h+='<div class="chs" style="display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-top:.5rem">'+MQ.ch.map(function(t,k){return '<div class="ch a'+k+(k===MQ.ans?" ok":"")+'" style="display:flex;gap:.4rem;align-items:center;border-radius:10px;padding:.35rem .5rem;background:'+(k===MQ.ans?"var(--mint-l)":"#fff")+'"><span class="sh" style="width:1.3rem;height:1.3rem;border-radius:6px;background:var(--ac);color:var(--at);display:flex;align-items:center;justify-content:center">'+SHAPES[k].replace("<svg",'<svg style="width:.7rem;height:.7rem"')+"</span>"+rt(t||"…")+"</div>";}).join("")+"</div>";
  else if(MQ.type==="libre"){
    var fa=parseFreeAnswer($("mq-ans").value);
    $("mq-ans-st").innerHTML=fa?(fa.lit?"Expression en x reconnue : toute écriture équivalente sera acceptée.":"Nombre reconnu : "+esc(f(fa.num,Math.max(fa.dec,0)))+(fa.unit?" "+esc(fa.unit):"")+(fa.unit==="%"?" (25 et 25 % et 0,25 seront acceptés)":" (4,5 = 4,50 = 450 % acceptés)")):'<span style="color:var(--coral-d)">Écrivez un nombre (4,5 · 25 % · 3/4) ou une expression en x.</span>';
  }else{
    var b=mqBuild();
    if(b&&b.err)h+='<p class="small" style="color:var(--coral-d)">'+esc(b.err)+"</p>";
    else if(b&&b.q){var q=b.q;h+=q.kind==="assoc"?assocHtml(q,qCorr(q)):q.kind==="ordre"?ordreHtml(q,qCorr(q),q.sep):scaleHtml(q.sl,{zone:{a:q.sl.ans,t:q.sl.tol},ans:q.sl.ans});}
  }
  $("mq-pv").innerHTML=h;
}
$("mq-type").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;MQ.type=b.getAttribute("data-v");if(MQ.type==="qcm"&&MQ.ch.length<2){while(MQ.ch.length<4)MQ.ch.push("");}renderMQ();});
$("mq-ch").addEventListener("input",function(e){var k=e.target.getAttribute("data-k");if(k!==null){MQ.ch[+k]=e.target.value;mqPreview();}});
$("mq-ch").addEventListener("change",function(e){if(e.target.name==="mq-ok"){MQ.ans=+e.target.value;mqPreview();}});
$("mq-ch").addEventListener("click",function(e){
  var b=e.target.closest("button");if(!b)return;
  if(b.id==="mq-addc"){MQ.ch.push("");renderMQ();return;}
  var k=+b.getAttribute("data-rm");MQ.ch.splice(k,1);if(MQ.ans===k)MQ.ans=0;else if(MQ.ans>k)MQ.ans--;renderMQ();
});
["mq-q","mq-ans","mq-pairs","mq-items","mq-how","mq-sep","mq-sa","mq-smin","mq-smax","mq-stol","mq-su"].forEach(function(id){$(id).addEventListener("input",mqPreview);});
$("m-q").addEventListener("click",function(e){if(e.target.closest(".x,[data-close]")){var q=QS[MQ.i];if(q&&q.fresh){QS.splice(MQ.i,1);renderPreview();}}});
$("mq-save").addEventListener("click",function(){
  var q=QS[MQ.i],txt=$("mq-q").value.trim();
  if(!txt){toast("L’énoncé est vide.","ko");return;}
  if((txt.split("$").length-1)%2){toast("Un symbole $ n’est pas fermé dans l’énoncé.","ko");return;}
  var nq={};
  if(MQ.type==="assoc"||MQ.type==="ordre"||MQ.type==="slider"){
    var b=mqBuild();if(!b||b.err){toast(b?b.err:"Question incomplète.","ko");return;}
    nq=b.q;["id","d","titre","chap","seed","uid"].forEach(function(k){if(q[k]!==undefined)nq[k]=q[k];});
    nq.dur=+$("mq-dur").value||0;
    delete nq.fresh;nq.edited=true;QS[MQ.i]=nq;closeModal("m-q");renderPreview();return;
  }
  for(var k in q)nq[k]=q[k];
  ["kind","L","R","rk","D","op","how","sep","sl","est","from","orig"].forEach(function(k2){delete nq[k2];});
  nq.q=txt;nq.expl=$("mq-x").value.trim();nq.dur=+$("mq-dur").value||0;
  if(MQ.type==="qcm"){
    var ch=MQ.ch.map(function(t){return t.trim();});
    if(ch.length<2||ch.some(function(t){return !t;})){toast("Remplissez toutes les propositions (ou retirez-en).","ko");return;}
    var seen={};if(ch.some(function(t){if(seen[t])return true;seen[t]=1;return false;})){toast("Deux propositions sont identiques.","ko");return;}
    nq.choices=ch.map(function(t,k2){var old=q.choices&&q.choices[k2];return {t:t,err:k2===MQ.ans?null:(old&&old.err)||"autre"};});
    nq.ans=MQ.ans;nq.libre=false;delete nq.only;nq.vf=ch.length===2&&/^vrai$/i.test(ch[0])&&/^faux$/i.test(ch[1]);
    var fa=parseFreeAnswer(stripD(ch[MQ.ans]));
    delete nq.num;delete nq.lit;delete nq.form;
    if(fa&&fa.num!==undefined){nq.num=fa.num;nq.unit=fa.unit;nq.dec=fa.dec;}
    else if(fa&&fa.lit){nq.lit=fa.lit;}
  }else{
    var fa2=parseFreeAnswer($("mq-ans").value);
    if(!fa2){toast("Réponse attendue illisible.","ko");return;}
    delete nq.num;delete nq.lit;delete nq.form;
    if(fa2.lit){nq.lit=fa2.lit;}else{nq.num=fa2.num;nq.unit=fa2.unit;nq.dec=fa2.dec;}
    var shown=fa2.lit?"$"+stripD($("mq-ans").value)+"$":fa2.t;
    var ok=q.choices&&q.choices[q.ans]&&!q.fresh&&!q.kind&&(checkTyped(nq,stripD(q.choices[q.ans].t)).ok);
    if(!ok){nq.choices=[{t:shown,err:null}];nq.ans=0;nq.only="libre";}
    nq.libre=true;
  }
  delete nq.fresh;nq.edited=true;
  QS[MQ.i]=nq;closeModal("m-q");renderPreview();
});
