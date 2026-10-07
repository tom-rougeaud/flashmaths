/* ═══════════════════════════════════════════════════════════════
   MOTEUR DE LA BANQUE : questions de cours, tirage, arborescence
═══════════════════════════════════════════════════════════════ */
/* Questions de cours : chargées depuis le bloc JSON « fm-cours » de la page */
function loadCours(obj){
  if(!obj||!obj.items)return;
  obj.items.forEach(function(it){
    reg(it.id,it.niv,it.chap,it.titre,it.tags||[],it.d||1,function(r){
      var v=pick(r,it.qs);
      return coursQuestion(r,v);
    },{cours:true,nvar:it.qs.length});
  });
}
/* une entrée de cours.json → question (QCM, Vrai/Faux, tuiles, ordre, estimation, étape fausse) */
function coursQuestion(r,v){
  var o=v.fig?{fig:v.fig}:{};
  if(v.vf!==undefined){var q=VF(r,v.q,!!v.vf,v.x);if(v.fig)q.fig=v.fig;return q;}
  if(v.as)return QA(r,v.q,shuffle(r,v.as).slice(0,4),v.x,o);
  if(v.or)return QO(r,v.q,v.or,v.x,{how:v.how,sep:v.sep,fig:v.fig});
  if(v.es)return QE(r,v.q,v.es.v,{u:v.es.u,min:v.es.min,max:v.es.max,tol:v.es.tol,fig:v.fig},v.x);
  if(v.st)return QX(r,v.q,v.st,v.bad,v.x,o);
  o.keep=!!v.keep;
  return Q(r,v.q,v.ok,v.wr.map(function(w){return Array.isArray(w)?w:[w,"conf"];}),o,v.x);
}
(function(){
  try{
    if(typeof document!=="undefined"){var el=document.getElementById("fm-cours");if(el)loadCours(JSON.parse(el.textContent));}
    else if(typeof require!=="undefined"){loadCours(JSON.parse(require("fs").readFileSync(require("path").join(__dirname,"cours.json"),"utf8")));}
  }catch(e){if(typeof console!=="undefined")console.error("Questions de cours illisibles",e);}
})();

var ITEM_BY_ID={};
/* notions dont les calculs se prêtent à l’estimation au curseur (ordre de grandeur) */
var EST_OK={};["pct_de","coef_evol","ttc_ht","regle3","vitesse","aire_disque","volume_cyl","volume_pave","vol_pyramide","vol_sphere","moyenne","interets_composes","suite_geo","pyth_hyp","pyth_cote","echelle","grandeurs_comp","pb_commerce","pb_auto","pb_elec","pb_cuisine","perim_cercle","frac_de","indices","evol_succ","pct_inverse","seuil_rentab","esperance","moy_ponderee","stats_tab","conv_aire_vol","interets_simples","marge","cout_marginal","emprunt","fluctuation"].forEach(function(k){EST_OK[k]=1;});
function indexBank(){ITEM_BY_ID={};BANK.forEach(function(it){ITEM_BY_ID[it.id]=it;});}
indexBank();

function makeQuestion(itemId,seed,ctx){
  var it=ITEM_BY_ID[itemId];if(!it)return null;
  for(var tries=0;tries<12;tries++){
    var r=mulberry32((seed+tries*7919)>>>0),q=null;
    try{q=it.gen(r,ctx||{});}catch(e){q=null;}
    if(q&&validQ(q)){
      q.id=it.id;q.d=it.d;q.titre=it.titre;q.chap=it.chap;
      if(EST_OK[it.id]&&!q.kind&&q.num!==undefined&&Math.abs(q.num)>=2)q.est=1;
      return q;
    }
  }
  return null;
}
function validQ(q){
  var k=q.kind||"qcm";
  if(k==="assoc")return q.L&&q.L.length>=2&&q.L.length<=5&&q.R.length===q.L.length;
  if(k==="ordre")return q.D&&q.D.length>=3&&q.D.length<=6;
  if(k==="slider")return q.sl&&q.sl.max>q.sl.min&&q.sl.ans>=q.sl.min&&q.sl.ans<=q.sl.max;
  return q.choices&&q.choices.length<=4&&(q.choices.length>=2||(q.only==="libre"&&q.choices.length===1));
}
/* « forme » d’une question : l’énoncé sans ses nombres (deux questions de même forme
   ne diffèrent que par les valeurs : c’est ce que les élèves perçoivent comme une répétition) */
function qShape(q){
  if(!q)return "";
  var t=String(q.q||"").replace(/\$[^$]*\$/g,function(m){return m.replace(/-?\d+(?:[.,{}]*\d+)*/g,"#");})
    .replace(/-?\d+(?:[ ,.  ]\d+)*/g,"#").replace(/«[^»]*»/g,"«»").replace(/\s+/g," ");
  return qKind(q)+"|"+(q.qx?"x|":"")+(q.fig&&q.fig.k?q.fig.k+"|":"")+t.slice(0,160);
}
/* historique : {t:{texte:rang}, s:{forme:rang}, i:{notion:rang}} (rang élevé = joué récemment) ;
   l’ancien format {texte:1} reste accepté */
function normHist(h){
  h=h||{};
  if(h.t||h.s||h.i)return {t:h.t||{},s:h.s||{},i:h.i||{},n:h.n||1};
  return {t:h,s:{},i:{},n:1};
}
/* n questions tirées dans la sélection :
   - les notions les moins jouées récemment passent en premier, puis on tourne entre elles ;
   - pour chaque place, plusieurs tirages sont notés et le meilleur est gardé :
     énoncé déjà joué (très pénalisé) > même forme dans la partie > forme jouée récemment > même format 3 fois de suite. */
function drawQuestions(itemIds,n,ctx,seed,avoid){
  if(!itemIds.length)return [];
  var H=normHist(avoid),r=mulberry32(seed>>>0),out=[],seenT={},usedS={},kinds=[],guard=0,lastId=null;
  var lru=function(list){return shuffle(r,list).sort(function(a,b){return (H.i[a]||0)-(H.i[b]||0);});};
  var pool=lru(itemIds),skipped=0;
  while(out.length<n&&guard++<n*30){
    if(!pool.length){pool=shuffle(r,itemIds);skipped=0;}
    var idx=0;if(pool.length>1&&pool[0]===lastId)idx=1;
    var id=pool.splice(idx,1)[0],it=ITEM_BY_ID[id];if(!it)continue;
    var tries=Math.max(14,Math.min(60,(it.nvar||0)*3)),best=null,bestS=1e9;
    for(var k=0;k<tries;k++){
      var c=makeQuestion(id,(seed+out.length*104729+k*7919+guard*31)>>>0,ctx);
      if(!c||seenT[c.q])continue;
      var sc=0,sh=qShape(c);
      if(ctx&&ctx.plain&&c.kind)sc+=5000;
      if(H.t[c.q])sc+=1000+H.t[c.q]/H.n*500;
      if(usedS[sh])sc+=320*usedS[sh];
      if(H.s[sh])sc+=60+180*H.s[sh]/H.n;
      var kd=qKind(c);if(kinds.length>=2&&kinds[kinds.length-1]===kd&&kinds[kinds.length-2]===kd&&kd!=="qcm")sc+=40;
      if(sc<bestS){best=c;bestS=sc;if(sc===0&&k>=3)break;}
    }
    if(!best)continue;
    /* forme déjà utilisée dans cette partie : on laisse d’abord sa chance aux autres notions */
    if(bestS>=320&&bestS<5000&&pool.length&&skipped<itemIds.length){pool.push(id);skipped++;continue;}
    seenT[best.q]=1;var s2=qShape(best);usedS[s2]=(usedS[s2]||0)+1;kinds.push(qKind(best));out.push(best);lastId=id;skipped=0;
  }
  return out;
}
/* durée : temps propre à la notion > réglage global > automatique (difficulté, saisie libre plus longue) */
function dureeQuestion(q,mode,libre){
  if(q.dur>0)return q.dur;
  if(TIMES[q.id]>0)return TIMES[q.id];
  if(mode&&mode>0)return mode;
  var base=q.d===1?15:q.d===3?30:20,k=q.kind;
  if(k==="assoc")return base+(q.L&&q.L.length>3?20:15);
  if(k==="ordre")return base+15;
  if(k==="slider")return base+5;
  if(q.qx||q.fig)base+=10;
  return libre?base+15:base;
}
/* arborescence niveau › chapitre › sous-chapitre › notions (programme officiel, voir bank_curriculum.js).
   Chaque chapitre garde aussi la liste à plat de ses notions (items) pour la compatibilité. */
function curriculumLevels(){
  var out={};if(typeof CURRICULUM==="undefined")return out;
  Object.keys(CURRICULUM).forEach(function(lv){CURRICULUM[lv].forEach(function(ch){ch[1].forEach(function(sc){sc[1].forEach(function(id){(out[id]=out[id]||{})[lv]=1;});});});});
  return out;
}
/* les niveaux d’une notion intègrent ceux où le programme la place */
(function(){var cl=curriculumLevels();BANK.forEach(function(it){var m=cl[it.id];if(!m)return;Object.keys(m).forEach(function(lv){if(it.niv.indexOf(lv)<0)it.niv=it.niv.concat([lv]);});});})();
function buildTree(){
  var tree=[],CU=typeof CURRICULUM!=="undefined"?CURRICULUM:{};
  NIVEAUX.forEach(function(nv){
    var chaps=[],placed={},byName={};
    (CU[nv.id]||[]).forEach(function(ch){
      var C={nom:ch[0],items:[],subs:[]};
      ch[1].forEach(function(sc){
        var S={nom:sc[0],items:[]};
        sc[1].forEach(function(id){var it=ITEM_BY_ID[id];if(!it||HIDDEN[id]||placed[id])return;placed[id]=1;S.items.push(it);C.items.push(it);});
        if(S.items.length)C.subs.push(S);
      });
      if(C.items.length){chaps.push(C);byName[C.nom]=C;}
    });
    /* notions hors programme de ce niveau (questions perso, notions ajoutées) : dans leur chapitre d’origine */
    BANK.forEach(function(it){
      if(it.niv.indexOf(nv.id)<0||HIDDEN[it.id]||placed[it.id])return;
      placed[it.id]=1;
      var C=byName[it.chap];
      if(!C){C={nom:it.chap,items:[],subs:[]};chaps.push(C);byName[it.chap]=C;}
      var lab=it.custom?"Mes questions":"Autres notions",S=null;
      C.subs.forEach(function(x){if(x.nom===lab)S=x;});
      if(!S){S={nom:lab,items:[]};C.subs.push(S);}
      S.items.push(it);C.items.push(it);
    });
    tree.push({niv:nv,chaps:chaps});
  });
  return tree;
}

/* ═══════════════════════════════════════════════════════════════
   VÉRIFICATION DES RÉPONSES SAISIES (saisie libre)
   4,5 = 4,50 = 4.5000 = 450 % = 9/2 ; « 25 » ou « 25 % » ou « 0,25 » pour 25 % ;
   expressions en x comparées en plusieurs points (3x + 2 = 2 + 3x).
═══════════════════════════════════════════════════════════════ */
function normIn(s){
  return String(s===null||s===undefined?"":s)
    .replace(/[\s  ]/g,"").replace(/[−–—]/g,"-").replace(/,/g,".")
    .replace(/[×·]/g,"*").replace(/÷/g,"/").replace(/²/g,"^2").replace(/³/g,"^3").replace(/X/g,"x");
}
function parseNumber(s){
  s=normIn(s).replace(/^\*/,"");if(!s)return null;
  var pct=false;
  if(/%$/.test(s)){pct=true;s=s.slice(0,-1);}
  var m=s.match(/^([+-]?(?:\d+\.?\d*|\.\d+))(?:\/(\d+(?:\.\d+)?))?(.*)$/);
  if(!m)return null;
  var rest=m[3];
  if(/%$/.test(rest)){pct=true;rest=rest.slice(0,-1);}
  if(rest&&!/^[a-zA-Zàâäéèêëîïôöùûüç€$°µΩ][a-zA-Zàâäéèêëîïôöùûüç€$°µΩ\/^23]*$/.test(rest))return null;
  if(/x/.test(rest)&&rest.length===1)return null;
  var v=m[2]?parseFloat(m[1])/parseFloat(m[2]):parseFloat(m[1]);
  if(!isFinite(v))return null;
  return {v:v,pct:pct};
}
/* ─ petit analyseur d’expressions en x (sans eval) ─ */
function lexExpr(s){
  s=normIn(s).replace(/\\left|\\right|\\,|\$/g,"").replace(/\{,\}/g,".").replace(/\\times|\\cdot/g,"*").replace(/[{}]/g,function(c){return c==="{"?"(":")";});
  var t=[],i=0;
  while(i<s.length){
    var c=s.charAt(i);
    if(/[0-9.]/.test(c)){var j=i;while(j<s.length&&/[0-9.]/.test(s.charAt(j)))j++;var num=s.slice(i,j);if((num.match(/\./g)||[]).length>1||num===".")return null;t.push({k:"n",v:parseFloat(num)});i=j;continue;}
    if(c==="x"){t.push({k:"x"});i++;continue;}
    if("+-*/^()".indexOf(c)>=0){t.push({k:c});i++;continue;}
    return null;
  }
  return t;
}
function parseExpr(s){
  var t=lexExpr(s);if(!t||!t.length)return null;
  var p=0;
  function peek(){return t[p];}
  function expr(){
    var n=term();if(!n)return null;
    while(peek()&&(peek().k==="+"||peek().k==="-")){var op=t[p++].k,m=term();if(!m)return null;n={k:op,a:n,b:m};}
    return n;
  }
  function term(){
    var n=unary();if(!n)return null;
    while(peek()){
      var k=peek().k;
      if(k==="*"||k==="/"){p++;var m=unary();if(!m)return null;n={k:k,a:n,b:m};}
      else if(k==="n"||k==="x"||k==="("){var m2=power();if(!m2)return null;n={k:"*",a:n,b:m2,imp:true};}
      else break;
    }
    return n;
  }
  function unary(){
    if(peek()&&peek().k==="-"){p++;var n=unary();return n?{k:"neg",a:n}:null;}
    if(peek()&&peek().k==="+"){p++;return unary();}
    return power();
  }
  function power(){
    var b=atom();if(!b)return null;
    if(peek()&&peek().k==="^"){p++;var e=unary();if(!e)return null;return {k:"^",a:b,b:e};}
    return b;
  }
  function atom(){
    var tk=t[p];if(!tk)return null;
    if(tk.k==="n"){p++;return {k:"n",v:tk.v};}
    if(tk.k==="x"){p++;return {k:"x"};}
    if(tk.k==="("){p++;var n=expr();if(!n||!peek()||peek().k!==")")return null;p++;return {k:"g",a:n};}
    return null;
  }
  var root=expr();
  if(!root||p!==t.length)return null;
  return root;
}
function evalExpr(n,x){
  switch(n.k){
    case "n":return n.v;case "x":return x;case "g":return evalExpr(n.a,x);case "neg":return -evalExpr(n.a,x);
    case "+":return evalExpr(n.a,x)+evalExpr(n.b,x);case "-":return evalExpr(n.a,x)-evalExpr(n.b,x);
    case "*":return evalExpr(n.a,x)*evalExpr(n.b,x);case "/":return evalExpr(n.a,x)/evalExpr(n.b,x);
    case "^":return Math.pow(evalExpr(n.a,x),evalExpr(n.b,x));
  }
  return NaN;
}
function hasGroup(n){if(!n||typeof n!=="object")return false;if(n.k==="g")return true;return hasGroup(n.a)||hasGroup(n.b);}
function xTerms(n){ /* nombre de termes contenant x dans une somme */
  if(!n)return 0;
  if(n.k==="+"||n.k==="-")return xTerms(n.a)+xTerms(n.b);
  if(n.k==="neg")return xTerms(n.a);
  return JSON.stringify(n).indexOf('"x"')>=0?1:0;
}
function sameExpr(a,b){
  var X=[-2.3,-1.1,0.7,1.9,3.4],ok=0;
  for(var i=0;i<X.length;i++){
    var va=evalExpr(a,X[i]),vb=evalExpr(b,X[i]);
    if(!isFinite(va)||!isFinite(vb))continue;
    if(Math.abs(va-vb)>1e-7*Math.max(1,Math.abs(vb)))return false;
    ok++;
  }
  return ok>=3;
}
function isFree(q){return !!q&&(q.num!==undefined||!!q.lit);}
function checkLit(q,s){
  var a=parseExpr(s),e=parseExpr(q.lit);
  if(!a||!e)return {valid:false};
  if(!sameExpr(a,e))return {valid:true,ok:false};
  if(q.form==="dev"||q.form==="red"){
    if(hasGroup(a))return {valid:true,ok:false,why:"form"};
    var target=xTerms(e.k==="g"?e.a:e)||1;
    if(xTerms(a)>target)return {valid:true,ok:false,why:"form"};
  }
  if(q.form==="fact"){
    var top=a;
    if(!(top.k==="*"&&(hasGroup(top.a)||hasGroup(top.b))))return {valid:true,ok:false,why:"form"};
  }
  return {valid:true,ok:true};
}
function numTol(q){
  var tol=1e-9*Math.max(1,Math.abs(q.num));
  var dec=q.dec===undefined?2:q.dec;
  if(Math.abs(rd(q.num,dec)-q.num)>1e-12)tol=Math.max(tol,0.5*Math.pow(10,-dec)+1e-12);
  return tol;
}
function matchNum(q,p){
  if(!p)return false;
  var tol=numTol(q);
  if(q.unit==="%"){
    var E=q.num/100,T=p.pct?[p.v/100]:[p.v/100,p.v];
    return T.some(function(t){return Math.abs(t-E)<=tol/100+1e-12;});
  }
  var t=p.pct?p.v/100:p.v;
  return Math.abs(t-q.num)<=tol;
}
/* → {valid, ok, k : index du distracteur reconnu (pour les statistiques) ou -2} */
function checkTyped(q,str){
  if(!q)return {valid:false};
  var s=String(str||"").trim();
  if(!s)return {valid:false};
  if(q.lit){
    var res=checkLit(q,s);
    if(!res.valid)return res;
    if(res.ok)return {valid:true,ok:true,k:q.ans};
    var a=parseExpr(s);
    for(var i=0;i<q.choices.length;i++){if(i===q.ans)continue;var c=parseExpr(q.choices[i].t);if(a&&c&&sameExpr(a,c))return {valid:true,ok:false,k:i};}
    return {valid:true,ok:false,k:-2,why:res.why};
  }
  if(q.num===undefined)return {valid:false};
  var p=parseNumber(s);
  if(!p)return {valid:false};
  if(matchNum(q,p))return {valid:true,ok:true,k:q.ans};
  for(var j=0;j<q.choices.length;j++){
    if(j===q.ans)continue;
    var d=parseNumber(String(q.choices[j].t).replace(/\$/g,""));
    if(d&&Math.abs((d.pct&&q.unit!=="%"?d.v/100:d.v)-(p.pct&&q.unit!=="%"?p.v/100:p.v))<=numTol(q))return {valid:true,ok:false,k:j};
  }
  return {valid:true,ok:false,k:-2};
}

/* ═══════════════════════════════════════════════════════════════
   FORMATS : nature, réponse officielle, données envoyées aux élèves, correction
═══════════════════════════════════════════════════════════════ */
function qKind(q){if(!q)return "qcm";if(q.kind)return q.kind;return q.libre?"libre":q.vf?"vf":"qcm";}
var KIND_TAG={libre:["Saisie libre · ×1,5","t-sky"],vf:["Vrai ou faux ?","t-sun"],assoc:["Associe les tuiles","t-pink"],ordre:["Remets dans l’ordre","t-mint"],slider:["Estime avec le curseur","t-sun"]};
function kindTagHtml(q){
  var k=qKind(q),t=KIND_TAG[k],h=t?'<span class="tag '+t[1]+'">'+t[0]+"</span>":"";
  if(q.qx)h+='<span class="tag t-coral">Trouve l’erreur</span>';
  return h;
}
function sliderText(sl,v){return f(v,sl.d)+(sl.u?" "+sl.u:"");}
function answerText(q){
  var k=qKind(q);
  if(k==="assoc"){var o=[];for(var j=0;j<q.R.length;j++)o[q.rk[j]]=q.L[q.rk[j]]+" → "+q.R[j];return o.join("\n");}
  if(k==="ordre"){var it=[];for(var i=0;i<q.D.length;i++)it[q.op[i]]=q.D[i];return it.join(q.sep||" ; ");}
  if(k==="slider")return "≈ "+f(q.sl.ans,Math.max(q.sl.d,Math.min(3,decOf(q.sl.ans))))+(q.sl.u?" "+q.sl.u:"");
  if(k==="libre"){
    if(q.lit)return q.choices[q.ans]?q.choices[q.ans].t:q.lit;
    if(q.num!==undefined)return f(q.num,q.dec===undefined?2:Math.max(q.dec,0))+(q.unit?" "+q.unit:"");
  }
  return q.choices&&q.choices[q.ans]?q.choices[q.ans].t:"";
}
/* données transmises aux élèves (jamais la réponse) */
function qPublic(q){
  var k=qKind(q),o={q:q.q,kd:k};
  if(q.id&&ITEM_BY_ID[q.id]&&!ITEM_BY_ID[q.id].custom)o.id=q.id;
  if(q.fig)o.fig=q.fig;
  if(q.qx)o.qx=1;
  if(k==="libre"){o.fr=1;o.kb=q.lit?"lit":"num";o.u=q.unit||"";}
  else if(k==="assoc"){o.L=q.L;o.R=q.R;}
  else if(k==="ordre"){o.D=q.D;o.how=q.how||"";o.sep=q.sep||"";}
  else if(k==="slider"){o.sl={min:q.sl.min,max:q.sl.max,step:q.sl.step,u:q.sl.u,d:q.sl.d};}
  else{o.ch=q.choices.map(function(c){return c.t;});if(q.vf)o.vf=1;}
  return o;
}
/* correction d’une réponse élève a = {k, v}
   → {ok, part (0 à 1 : part des points), k (distracteur reconnu), err (code d’erreur type), c (nb d’éléments justes)} */
function judge(q,a){
  var k=qKind(q),v=a?a.v:undefined,res={ok:false,part:0,k:-1,err:""};
  if(!a)return res;
  if(k==="libre"){
    var c=checkTyped(q,String(v===undefined?"":v).slice(0,40));
    res.k=c.valid?c.k:-3;res.ok=!!c.ok;
    if(!res.ok&&res.k>=0&&q.choices[res.k])res.err=q.choices[res.k].err||"";
    if(!res.ok&&c.why==="form")res.err="form";
  }else if(k==="assoc"||k==="ordre"){
    var n=k==="assoc"?q.L.length:q.D.length,perm=k==="assoc"?q.rk:q.op,good=0;
    if(Array.isArray(v)&&v.length===n){
      for(var i=0;i<n;i++){var j=v[i]|0;if(k==="assoc"?perm[j]===i:perm[j]===i)good++;}
    }
    res.c=good;res.ok=good===n;res.part=res.ok?1:Math.round(50*good/n)/100;
    if(!res.ok)res.err=k==="assoc"?"assoc":"ordre2";
  }else if(k==="slider"){
    var x=+v;
    if(isFinite(x)){
      var dd=Math.abs(x-q.sl.ans);
      res.ok=dd<=q.sl.tol+1e-9;res.part=res.ok?1:dd<=2.5*q.sl.tol+1e-9?0.5:0;
      res.close=!res.ok&&res.part>0;
      if(!res.ok)res.err=dd>Math.max(Math.abs(q.sl.ans)*2,1e-9)||(q.sl.ans&&x&&(x/q.sl.ans>3||x/q.sl.ans<1/3))?"grand":"";
    }
  }else{
    var kk=a.k|0;res.k=kk;res.ok=kk===q.ans;
    if(!res.ok&&q.choices[kk])res.err=q.choices[kk].err||"";
  }
  if(res.ok)res.part=1;
  return res;
}
/* multiplicateur de points selon le format */
function kindMult(q){return qKind(q)==="libre"?1.5:1;}
/* correction envoyée aux élèves pour qu’ils voient où ils se sont trompés */
function qCorr(q){
  var k=qKind(q);
  if(k==="assoc"){var c=[];for(var j=0;j<q.rk.length;j++)c[q.rk[j]]=j;return c;}
  if(k==="ordre"){var o=[];for(var i=0;i<q.op.length;i++)o[q.op[i]]=i;return o;}
  if(k==="slider")return {a:q.sl.ans,t:q.sl.tol};
  return null;
}

if(typeof module!=="undefined")module.exports={qShape:qShape,normHist:normHist,judge:judge,isFree:isFree,answerText:answerText,qPublic:qPublic,qKind:qKind,qCorr:qCorr,toSlider:toSlider,figHtml:figHtml,QE:QE,mulberry32:mulberry32,BANK:BANK,NIVEAUX:NIVEAUX,METIERS:METIERS,ERR:ERR,makeQuestion:makeQuestion,drawQuestions:drawQuestions,buildTree:buildTree,ITEM_BY_ID:ITEM_BY_ID,f:f,checkTyped:checkTyped,parseNumber:parseNumber,parseExpr:parseExpr,isFree:isFree,dureeQuestion:dureeQuestion};
