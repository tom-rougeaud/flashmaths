/* ═══════════════════════════════════════════════════════════════
   BANQUE DE QUESTIONS — noyau (outils, erreurs types, métiers)
   Les textes français utilisent l’apostrophe typographique ’
   pour ne jamais casser une chaîne JavaScript.
═══════════════════════════════════════════════════════════════ */
"use strict";

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function rnd(r,a,b){return a+Math.floor(r()*(b-a+1));}
function pick(r,arr){return arr[Math.floor(r()*arr.length)];}
function shuffle(r,arr){var a=arr.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function rd(x,d){var m=Math.pow(10,d);return Math.round(x*m+(x>=0?1e-7:-1e-7))/m;}

/* Nombre au format français : virgule, espace fine pour les milliers, vrai signe moins */
function f(x,d){
  if(d===undefined)d=2;
  var v=rd(x,d); if(v===0)v=0;
  var s=Math.abs(v).toFixed(d);
  if(s.indexOf(".")>=0)s=s.replace(/0+$/,"").replace(/\.$/,"");
  var p=s.split("."),i=p[0].replace(/\B(?=(\d{3})+(?!\d))/g," ");
  s=p[1]?i+","+p[1]:i;
  return (v<0?"−":"")+s;
}
function sg(x,d){var s=f(x,d===undefined?2:d);return (x>0?"+":"")+s;}
var SUPS={"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻"};
function sup(n){return String(n).split("").map(function(c){return SUPS[c]||c;}).join("");}
/* polynôme / expression affine rendus proprement : ax + b */
function lin(a,b,v){
  v=v||"x";var s="";
  if(a!==0){s=(a===1?"":a===-1?"−":f(a))+v;}
  if(b!==0){s+= s===""?f(b):(b<0?" − ":" + ")+f(Math.abs(b));}
  return s===""?"0":s;
}
function quad(a,b,c){
  var s=(a===1?"":a===-1?"−":f(a))+"x²";
  if(b!==0)s+=(b<0?" − ":" + ")+(Math.abs(b)===1?"":f(Math.abs(b)))+"x";
  if(c!==0)s+=(c<0?" − ":" + ")+f(Math.abs(c));
  return s;
}

/* ─── Erreurs types (« distracteurs diagnostiques ») ─── */
var HIDDEN={},TIMES={};   /* questions masquées / temps personnalisés (remplis par custom.js) */
var ERR={
  inv:   {e:"⇄",l:"inversion (produit en croix, quotient, coefficient)",s:"Tu as sans doute inversé : le quotient, le produit en croix ou le coefficient est à l’envers."},
  pct0:  {e:"%",l:"oubli de diviser par 100 (ou division en trop)",s:"Attention au « pour cent » : p % = p ÷ 100."},
  addp:  {e:"+×",l:"addition à la place d’une multiplication (ou l’inverse)",s:"Tu as ajouté là où il fallait multiplier (ou l’inverse)."},
  unit:  {e:"u",l:"virgule décalée, unités confondues",s:"La virgule est décalée : vérifie les unités et les puissances de 10."},
  ordre: {e:"①",l:"priorités de calcul non respectées",s:"Les priorités : parenthèses, puis × et ÷, puis + et −."},
  signe: {e:"±",l:"erreur de signe",s:"C’est une erreur de signe : vérifie les « moins »."},
  formule:{e:"f(x)",l:"mauvaise formule ou mauvaise notion",s:"Ce n’est pas la bonne formule : revois la formule de cette notion."},
  demi:  {e:"½",l:"oubli d’un facteur (½, ⅓, un carré…)",s:"Il manque un facteur dans ton calcul (une moitié, un carré, un tiers…)."},
  conf:  {e:"≠",l:"confusion entre deux notions voisines",s:"Tu as confondu deux notions voisines."},
  calc:  {e:"=",l:"erreur de calcul",s:"La méthode est bonne, mais il y a une erreur de calcul."},
  arr:   {e:"≈",l:"arrondi ou troncature",s:"Attention à l’arrondi : regarde le chiffre suivant."},
  base:  {e:"60",l:"base 60 / base 100 mal gérée",s:"Les durées se comptent en base 60 : 1 h = 60 min, pas 100."},
  compl: {e:"1−",l:"confusion avec le complément",s:"Tu as donné le complément (ce qui reste) au lieu de la valeur demandée."},
  lect:  {e:"👁",l:"mauvaise lecture du graphique ou du tableau",s:"Relis le graphique : axe, graduation, colonne ou ligne."},
  grand: {e:"10ⁿ",l:"ordre de grandeur faux",s:"L’ordre de grandeur est loin : arrondis les nombres et calcule de tête."},
  assoc: {e:"⇆",l:"tuiles mal associées",s:"Certaines tuiles sont mal associées : regarde la correction."},
  ordre2:{e:"↕",l:"ordre faux",s:"L’ordre n’est pas le bon : compare les nombres deux à deux."},
  form:  {e:"✎",l:"résultat juste mais pas sous la forme demandée",s:"Ton expression est juste, mais pas sous la forme demandée (développée, réduite ou factorisée)."},
  autre: {e:"?",l:"autre réponse",s:""}
};

/* ─── Écriture mathématique (KaTeX) ───
   Dans un énoncé ou une réponse, tout ce qui est entre $…$ est affiché en LaTeX. */
function fm(x,d){return f(x,d).replace(/−/g,"-").replace(/,/g,"{,}").replace(/[ \u00a0\u202f]/g,"\\,");}
function M(s){return "$"+s+"$";}
function par(x,d){return x<0?"("+fm(x,d)+")":fm(x,d);}
function linL(a,b,v){
  v=v||"x";var s="";
  if(a!==0){s=(a===1?"":a===-1?"-":fm(a))+v;}
  if(b!==0){s+= s===""?fm(b):(b<0?" - ":" + ")+fm(Math.abs(b));}
  return s===""?"0":s;
}
function quadL(a,b,c){
  var s=(a===1?"":a===-1?"-":fm(a))+"x^2";
  if(b!==0)s+=(b<0?" - ":" + ")+(Math.abs(b)===1?"":fm(Math.abs(b)))+"x";
  if(c!==0)s+=(c<0?" - ":" + ")+fm(Math.abs(c));
  return s;
}
/* forme « calculable » d’une expression en x (pour la saisie libre) */
function linE(a,b){return "("+a+")*x+("+b+")";}

/* ─── Fabrique de question à choix (2 à 4 propositions) ───
   ok : bonne réponse (nombre ou texte) ; wr : [[valeur, codeErreur], …] dans l’ordre d’importance
   o  : {u:unité, d:décimales, F:formateur perso, nu:unité de la saisie libre si F perso,
         lit:expression attendue en x (saisie libre littérale), form:"dev"|"red"|"fact", n:nombre de choix}
   Une réponse numérique (ou littérale) rend la question jouable en « saisie libre ».          */
/* Un distracteur « loin » (plus de 8 fois plus grand ou plus petit que la bonne réponse) s’élimine
   d’un coup d’œil : on en garde au plus un (o.far), les autres erreurs types restent du même ordre de grandeur. */
function isFar(v,ok){
  if(typeof v!=="number"||typeof ok!=="number"||!ok||!v)return false;
  if((v<0)!==(ok<0))return false;
  var q=Math.abs(v/ok);return q>=8||q<=0.125;
}
/* plus petite « marche » du nombre : 45 → 1 ; 12,5 → 0,1 ; 0,25 → 0,01 */
function lastStep(x,d){var s=String(rd(Math.abs(x),d)),i=s.indexOf(".");return i<0?(Math.abs(x)>=100&&Math.abs(x)%10===0?10:1):Math.pow(10,-(s.length-i-1));}
function mk(r,ok,wr,o){
  o=o||{};
  var u=o.u?" "+o.u:"",d=o.d===undefined?2:o.d,want=o.n||Math.min(4,1+wr.length);
  if(typeof ok==="number")want=o.n||4;
  var F=o.F||function(v){return typeof v==="string"?v:f(v,d)+u;};
  var seen={},list=[],far=[],farMax=o.far===undefined?1:o.far,nFar=0;
  var okt=F(ok);seen[okt]=1;list.push({t:okt,err:null,ok:true});
  for(var i=0;i<wr.length&&list.length<want;i++){
    var v=wr[i][0],e=wr[i][1],t;
    if(typeof v==="number"&&!isFinite(v))continue;
    if(typeof v==="number"&&o.pos&&v<=0)continue;
    t=F(v);
    if(!t||seen[t]||/NaN|Infinity|undefined/.test(t))continue;
    if(isFar(v,ok)){if(nFar>=farMax){far.push({t:t,err:e});continue;}nFar++;}
    seen[t]=1;list.push({t:t,err:e});
  }
  /* pas assez d’erreurs « proches » : on reprend les éloignées plutôt qu’inventer */
  for(var j=0;j<far.length&&list.length<want;j++){if(!seen[far[j].t]){seen[far[j].t]=1;list.push(far[j]);}}
  if(typeof ok==="number"){
    /* dernier recours : erreurs de calcul plausibles (un chiffre de trop ou de moins, la retenue oubliée) */
    var st=lastStep(ok,d),cand=[ok+st,ok-st,ok+10*st,ok-10*st,ok+2*st,ok-2*st,ok+5*st,ok-5*st],tries=0;
    cand=shuffle(r,cand.slice(0,4)).concat(shuffle(r,cand.slice(4)));
    while(list.length<want&&tries<cand.length){
      var v2=cand[tries++];
      if(o.pos&&v2<=0)continue;
      var t2=F(v2);
      if(seen[t2]||/NaN|Infinity/.test(t2))continue;
      seen[t2]=1;list.push({t:t2,err:"calc",fb:1});
    }
  }
  if(list.length<2||(typeof ok==="number"&&list.length<4))throw new Error("mk : pas assez de distracteurs pour "+okt);
  var sh=o.keep?list:shuffle(r,list),ans=0;
  for(var k=0;k<sh.length;k++)if(sh[k].ok)ans=k;
  return {choices:sh.map(function(c){return {t:c.t,err:c.err};}),ans:ans,nfb:list.filter(function(c){return c.fb;}).length};
}
function Q(r,q,ok,wr,o,expl){
  o=o||{};
  var m=mk(r,ok,wr,o),res={q:q,choices:m.choices,ans:m.ans,expl:expl||""};
  if(m.nfb)res.nfb=m.nfb;
  if(o.fig)res.fig=o.fig;
  if(o.est)res.est=1;
  if(typeof ok==="number"&&isFinite(ok)&&(!o.F||o.nu!==undefined)){
    res.num=ok;res.unit=o.F?o.nu:(o.u||"");res.dec=o.d===undefined?2:o.d;
  }
  if(o.lit){res.lit=o.lit;if(o.form)res.form=o.form;}
  return res;
}
/* Vrai / Faux */
function VF(r,q,vrai,expl){return {q:q,choices:[{t:"Vrai",err:vrai?null:"conf"},{t:"Faux",err:vrai?"conf":null}],ans:vrai?0:1,expl:expl||"",vf:true};}

/* ─── Métiers (habillage des énoncés) ─── */
var METIERS={
  general:   {label:"Général",                       emoji:""},
  cuisine:   {label:"Cuisine · Restauration",        emoji:""},
  batiment:  {label:"Bâtiment · Travaux publics",    emoji:""},
  commerce:  {label:"Commerce · Vente · Accueil",    emoji:""},
  coiffure:  {label:"Coiffure · Esthétique",         emoji:""},
  auto:      {label:"Maintenance auto · Mécanique",  emoji:""},
  logistique:{label:"Logistique · Transport",        emoji:""},
  sante:     {label:"Santé · Social (ASSP)",         emoji:""}
};
function cm(r,c){var l=(c&&c.metiers&&c.metiers.length)?c.metiers:["general"];return l.length===1?l[0]:pick(r,l);}

var PROP={
  general:   {t:"Un robinet débite {b} L en {a} minutes. Quel volume en {a2} minutes ?",u:"L",A:[3,4,5,6,8],K:[6,8,10,12,15],A2:[10,12,15,20,25]},
  cuisine:   {t:"Une recette pour {a} personnes demande {b} g de farine. Quelle quantité pour {a2} personnes ?",u:"g",A:[4,6,8],K:[50,75,100,125],A2:[10,12,15,20]},
  batiment:  {t:"Pour {a} m² de carrelage, il faut {b} kg de colle. Combien pour {a2} m² ?",u:"kg",A:[4,5,6,8,10],K:[3,4,5,6],A2:[12,15,20,25,30]},
  commerce:  {t:"{a} articles identiques coûtent {b} €. Quel prix pour {a2} articles ?",u:"€",A:[3,4,5,6],K:[4,6,8,12,15],A2:[10,12,15,20]},
  coiffure:  {t:"Pour {a} colorations, il faut {b} mL de colorant. Combien pour {a2} colorations ?",u:"mL",A:[2,3,4,5],K:[40,50,60],A2:[8,10,12,15]},
  auto:      {t:"Pour {a} vidanges, il faut {b} L d’huile moteur. Combien pour {a2} vidanges ?",u:"L",A:[2,3,4,5],K:[4,5,6],A2:[8,10,12,15]},
  logistique:{t:"{a} palettes identiques pèsent {b} kg. Quelle masse pour {a2} palettes ?",u:"kg",A:[2,3,4,5],K:[300,400,450,500],A2:[8,10,12,15]},
  sante:     {t:"Pour un enfant de {a} kg, la dose prescrite est de {b} mg. Quelle dose pour un enfant de {a2} kg ?",u:"mg",A:[10,12,15,20],K:[5,10,15],A2:[24,25,30,40]}
};
var PCTC={
  general:   {t:function(v){return "Un objet coûte "+f(v)+" €.";},u:"€",V:[40,60,80,120,150,200,250]},
  cuisine:   {t:function(v){return "Une caisse de légumes coûte "+f(v)+" €.";},u:"€",V:[40,60,80,120,150,200,250]},
  batiment:  {t:function(v){return "Un devis s’élève à "+f(v)+" €.";},u:"€",V:[200,400,600,800,1000,1200,2000]},
  commerce:  {t:function(v){return "Un article est affiché "+f(v)+" €.";},u:"€",V:[40,60,80,120,150,200,250]},
  coiffure:  {t:function(v){return "Un soin coûte "+f(v)+" €.";},u:"€",V:[20,40,60,80,100,120]},
  auto:      {t:function(v){return "Une facture de pièces s’élève à "+f(v)+" €.";},u:"€",V:[120,160,240,300,400,500]},
  logistique:{t:function(v){return "Un entrepôt stocke "+f(v)+" colis.";},u:"colis",V:[200,400,500,800,1000]},
  sante:     {t:function(v){return "Une dose est de "+f(v)+" mg.";},u:"mg",V:[50,80,120,200,250,400]}
};
var CONV={
  general:   [{f:"m",t:"cm",k:100,V:[0.5,1.5,2.5,3.2,0.75]},{f:"g",t:"kg",k:0.001,V:[250,450,1200,2500,3600]},{f:"mL",t:"L",k:0.001,V:[250,500,1500,2500]},{f:"mm",t:"cm",k:0.1,V:[35,120,250,48]}],
  cuisine:   [{f:"g",t:"kg",k:0.001,V:[250,450,1200,2500,3600],o:" de farine"},{f:"cL",t:"L",k:0.01,V:[25,50,75,150,250],o:" de crème"},{f:"kg",t:"g",k:1000,V:[0.5,1.5,2.5,0.25,0.75],o:" de sucre"},{f:"mL",t:"cL",k:0.1,V:[50,250,330,750]}],
  batiment:  [{f:"cm",t:"m",k:0.01,V:[250,45,120,180,75],o:" de plinthe"},{f:"m",t:"cm",k:100,V:[0.5,1.5,2.5,3.2,0.75]},{f:"mm",t:"cm",k:0.1,V:[35,120,250,48]},{f:"m²",t:"cm²",k:10000,V:[0.5,2,3.5,0.25]}],
  commerce:  [{f:"g",t:"kg",k:0.001,V:[250,500,1200,2500]},{f:"kg",t:"g",k:1000,V:[0.5,1.5,2.5,0.25]},{f:"cL",t:"L",k:0.01,V:[25,50,75,150]},{f:"m",t:"cm",k:100,V:[0.5,1.5,2.5,0.75]}],
  coiffure:  [{f:"mL",t:"L",k:0.001,V:[250,500,1500,2500],o:" de shampooing"},{f:"cL",t:"mL",k:10,V:[3,7.5,12,25]},{f:"L",t:"mL",k:1000,V:[0.25,0.5,1.5,2]},{f:"g",t:"kg",k:0.001,V:[250,450,1200]}],
  auto:      [{f:"mL",t:"L",k:0.001,V:[500,750,1500,4500],o:" d’huile"},{f:"L",t:"mL",k:1000,V:[0.5,1.5,2.5,4.5],o:" d’huile"},{f:"mm",t:"cm",k:0.1,V:[35,120,250,48]},{f:"cm",t:"mm",k:10,V:[3.5,12,2.5,0.8]}],
  logistique:[{f:"kg",t:"t",k:0.001,V:[500,1200,2500,12000]},{f:"t",t:"kg",k:1000,V:[0.5,1.2,2.5,0.75]},{f:"m³",t:"L",k:1000,V:[0.5,1.2,2.5,0.75]},{f:"cm",t:"m",k:0.01,V:[250,45,120,180]}],
  sante:     [{f:"mg",t:"g",k:0.001,V:[250,500,1500,2500],o:" de principe actif"},{f:"g",t:"mg",k:1000,V:[0.25,0.5,1.5,0.75],o:" de principe actif"},{f:"mL",t:"L",k:0.001,V:[250,500,1500,2500]},{f:"L",t:"mL",k:1000,V:[0.25,0.5,1.5,2]}]
};
var BAC={
  general:"un réservoir",cuisine:"un bac de plonge",batiment:"une cuve à eau",commerce:"un bac de présentation",
  coiffure:"un bac à shampooing",auto:"un bac de vidange",logistique:"un carton",sante:"un bac à instruments"
};
var STATC={
  general:   {n:"notes sur 20",lo:8,hi:18},
  cuisine:   {n:"temps de cuisson (en min)",lo:8,hi:40},
  batiment:  {n:"longueurs de planches (en cm)",lo:80,hi:250},
  commerce:  {n:"ventes par jour (en articles)",lo:20,hi:80},
  coiffure:  {n:"durées de prestation (en min)",lo:20,hi:90},
  auto:      {n:"temps de diagnostic (en min)",lo:15,hi:60},
  logistique:{n:"colis chargés par camion",lo:40,hi:120},
  sante:     {n:"pulsations par minute",lo:60,hi:95}
};
var RENT={
  general:   "pièces",cuisine:"plateaux repas",batiment:"cadres de fenêtre",commerce:"articles",
  coiffure:"forfaits soin",auto:"forfaits vidange",logistique:"livraisons",sante:"kits de soins"
};

/* ═══════════════════════════════════════════════════════════════
   NOUVEAUX FORMATS DE QUESTIONS
   QA : associer des tuiles (calcul ↔ résultat…)
   QO : remettre dans l’ordre
   QE : estimer avec un curseur (ordre de grandeur)
   QX : trouver l’étape fausse d’un calcul rédigé
═══════════════════════════════════════════════════════════════ */
function permNotId(r,n){
  var base=[];for(var i=0;i<n;i++)base.push(i);
  for(var t=0;t<12;t++){var p=shuffle(r,base);if(p.some(function(v,k){return v!==k;}))return p;}
  return base.slice(1).concat([0]);
}
/* pairs : [[gauche, droite], …] (3 ou 4 paires, textes tous différents) */
function QA(r,q,pairs,expl,o){
  o=o||{};
  var L=pairs.map(function(p){return String(p[0]);}),R0=pairs.map(function(p){return String(p[1]);});
  var dl={},dr={};
  if(L.some(function(t){if(dl[t])return true;dl[t]=1;return false;})||R0.some(function(t){if(dr[t])return true;dr[t]=1;return false;}))return null;
  var perm=permNotId(r,pairs.length);
  var res={kind:"assoc",q:q,L:L,R:perm.map(function(i){return R0[i];}),rk:perm,expl:expl||"",ans:0,
    choices:[{t:pairs.map(function(p){return p[0]+" → "+p[1];}).join("\n"),err:null}]};
  if(o.fig)res.fig=o.fig;
  return res;
}
/* items : dans le BON ordre ; how : « du plus petit au plus grand »… */
function QO(r,q,items,expl,o){
  o=o||{};
  var it=items.map(String),dd={};
  if(it.some(function(t){if(dd[t])return true;dd[t]=1;return false;}))return null;
  var perm=permNotId(r,it.length);
  var res={kind:"ordre",q:q,D:perm.map(function(i){return it[i];}),op:perm,how:o.how||"",sep:o.sep||" ; ",expl:expl||"",ans:0,
    choices:[{t:it.join(o.sep||" ; "),err:null}]};
  if(o.fig)res.fig=o.fig;
  return res;
}
/* nombres « ronds » pour les graduations */
function niceUp(x){if(!(x>0))return 1;var e=Math.pow(10,Math.floor(Math.log(x)/Math.LN10)),m=x/e;return (m<=1.0001?1:m<=2.0001?2:m<=2.5001?2.5:m<=5.0001?5:10)*e;}
function niceDown(x){if(!(x>0))return 1;var e=Math.pow(10,Math.floor(Math.log(x)/Math.LN10)),m=x/e;return (m>=9.999?10:m>=4.999?5:m>=2.499?2.5:m>=1.999?2:1)*e;}
function decOf(x){var s=String(+(+x).toPrecision(10));var i=s.indexOf(".");return i<0?0:s.length-i-1;}
/* Estimation au curseur. o : {u, min, max, tol, spread, lo, tr}
   - le curseur va de min à max (graduations « rondes ») ; la réponse n’est jamais au milieu ni au bord ;
   - zone juste : ± tol (par défaut 4 % de la largeur) ; zone « presque » : ± 2,5 tol (moitié des points). */
function QE(r,q,ans,o,expl){
  o=o||{};
  var min,max,a=Math.abs(ans)||1;
  if(o.min!==undefined&&o.max!==undefined){min=o.min;max=o.max;}
  else{
    var sp=a*(o.spread||pick(r,[1.6,2,2.4,3])),g=niceUp(sp/5),span=Math.ceil(sp/g)*g,pos=0.22+0.56*r();
    min=Math.floor((ans-pos*span)/g)*g;
    var lo=o.lo!==undefined?o.lo:(ans>=0?0:undefined);
    if(lo!==undefined&&min<lo)min=lo;
    max=min+span;
    if(ans>max-0.12*span)max=Math.ceil((ans+0.2*span)/g)*g;
    min=rd(min,6);max=rd(max,6);
  }
  if(!(max>min))return null;
  var W=max-min,tol=o.tol!==undefined?o.tol:W*(o.tr||0.04),step=niceDown(Math.min(W/100,tol/2));
  if(step<=0)step=W/100;
  var d=Math.min(4,Math.max(decOf(step),decOf(min),decOf(max)));
  var u=o.u||"";
  return {kind:"slider",q:q,sl:{min:min,max:max,step:rd(step,8),ans:ans,tol:rd(tol,8),u:u,d:d},expl:expl||"",ans:0,est:1,
    choices:[{t:"≈ "+f(ans,Math.max(d,decOf(ans)>4?4:decOf(ans)))+(u?" "+u:""),err:null}],fig:o.fig};
}
/* transforme une question numérique (q.num) en estimation au curseur */
function toSlider(q,seed){
  if(!q||q.num===undefined||!isFinite(q.num)||q.unit==="%"&&Math.abs(q.num)>1000)return null;
  var txt=String(q.q).replace(/^Calculer /,"Estimer ").replace(/^Combien /,"Environ combien ");
  if(txt===q.q&&!/^Estimer|^Environ/.test(txt))txt="Estimation : "+txt;
  var s=QE(mulberry32((seed||7)>>>0),txt,q.num,{u:q.unit||"",lo:q.num>=0?0:undefined},q.expl);
  if(!s)return null;
  ["id","d","titre","chap","seed","uid","dur","fig"].forEach(function(k){if(q[k]!==undefined)s[k]=q[k];});
  s.from=1;
  return s;
}
var CIRC=["①","②","③","④","⑤","⑥"];
/* steps : étapes d’un calcul rédigé, bad : index de l’étape fausse */
function QX(r,intro,steps,bad,expl,o){
  o=o||{};
  var txt=intro+"\n"+steps.map(function(s,i){return CIRC[i]+" "+s;}).join("\n");
  var ch=steps.map(function(s,i){return {t:"Étape "+CIRC[i],err:i===bad?null:"conf"};});
  var res={q:txt,choices:ch,ans:bad,expl:expl||"",qx:1};
  if(o.fig)res.fig=o.fig;
  return res;
}

/* ═══════════════════════════════════════════════════════════════
   FIGURES (SVG produit ici, à partir de nombres et de courtes étiquettes échappées :
   aucune balise n’est transmise sur le réseau, seulement la description de la figure)
═══════════════════════════════════════════════════════════════ */
var FIGC={v:"#5B55C4",c:"#D9606A",s:"#D59A2E",m:"#2E9E7E",k:"#4A86CF",ink:"#262A4F",g:"#E4E1F7",l:"#EEEBFF"};
var FIG_N=0;
var FIG_PAL=["#5B55C4","#D9606A","#D59A2E","#2E9E7E","#4A86CF","#C95B82"];
function xe(s){return String(s===undefined||s===null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").slice(0,40);}
function fnum(v){return typeof v==="number"&&isFinite(v)?v:0;}
function figT(x,y,s,o){o=o||{};return '<text x="'+rd(fnum(x),1)+'" y="'+rd(fnum(y),1)+'" font-size="'+(o.fs||15)+'" font-weight="'+(o.fw||800)+'" fill="'+(o.c||FIGC.ink)+'" text-anchor="'+(o.a||"middle")+'" dominant-baseline="middle"'+(o.halo?' stroke="#fff" stroke-width="3.5" stroke-linejoin="round" paint-order="stroke"':"")+(o.rot?' transform="rotate('+o.rot+" "+rd(x,1)+" "+rd(y,1)+')"':"")+">"+xe(s)+"</text>";}
function figLab(x,y,s,c){if(s===undefined||s===null||s==="")return "";var w=Math.max(22,String(s).length*8.6+10);return '<rect x="'+rd(x-w/2,1)+'" y="'+rd(y-12,1)+'" width="'+rd(w,1)+'" height="24" rx="12" fill="#fff" stroke="'+(c||FIGC.v)+'" stroke-width="2"/>'+figT(x,y+0.5,s,{fs:14,c:c&&c!==FIGC.v?c:FIGC.ink});}
function svgWrap(w,h,body,cls){return '<svg class="figsvg'+(cls?" "+cls:"")+'" viewBox="0 0 '+w+" "+h+'" role="img" aria-label="figure" xmlns="http://www.w3.org/2000/svg">'+body+"</svg>";}
function figHtml(fig){
  if(!fig||typeof fig!=="object")return "";
  try{
    var k=fig.k,b="";
    if(k==="tri"){   /* triangle rectangle : a = côté vertical, b = côté horizontal, c = hypoténuse */
      var P0=[60,170],P1=[60,34],P2=[290,170];
      b+='<polygon points="'+[P0,P1,P2].map(function(p){return p.join(",");}).join(" ")+'" fill="'+FIGC.l+'" stroke="'+FIGC.v+'" stroke-width="4" stroke-linejoin="round"/>';
      b+='<path d="M60 152h18v18" fill="none" stroke="'+FIGC.v+'" stroke-width="3"/>';
      if(fig.ang)b+='<path d="M252 170A38 38 0 0 0 258 151" fill="none" stroke="'+FIGC.c+'" stroke-width="4"/>'+figT(236,158,fig.ang,{c:FIGC.c,fs:15});
      if(fig.ang2)b+='<path d="M60 64A30 30 0 0 0 76 58" fill="none" stroke="'+FIGC.c+'" stroke-width="4"/>'+figT(80,76,fig.ang2,{c:FIGC.c,fs:14});
      b+=figLab(34,102,fig.a,fig.hl==="a"?FIGC.c:0)+figLab(175,192,fig.b,fig.hl==="b"?FIGC.c:0)+figLab(196,88,fig.c,fig.hl==="c"?FIGC.c:0);
      if(fig.n){b+=figT(48,182,fig.n[0],{fs:15})+figT(48,22,fig.n[1],{fs:15})+figT(302,182,fig.n[2],{fs:15});}
      return svgWrap(330,206,b);
    }
    if(k==="rect"){
      b+='<rect x="70" y="36" width="200" height="110" rx="4" fill="'+(fig.fill?FIGC.l:"#fff")+'" stroke="'+FIGC.k+'" stroke-width="4"/>';
      b+=figLab(170,166,fig.L)+figLab(42,91,fig.l);
      if(fig.in)b+=figT(170,91,fig.in,{fs:16,c:FIGC.v});
      return svgWrap(330,186,b);
    }
    if(k==="disc"){
      b+='<circle cx="165" cy="98" r="76" fill="'+FIGC.l+'" stroke="'+FIGC.m+'" stroke-width="4"/><circle cx="165" cy="98" r="4" fill="'+FIGC.ink+'"/>';
      if(fig.d){b+='<line x1="89" y1="98" x2="241" y2="98" stroke="'+FIGC.c+'" stroke-width="3" stroke-dasharray="7 5"/>'+figLab(165,122,fig.d,FIGC.c);}
      else{b+='<line x1="165" y1="98" x2="241" y2="98" stroke="'+FIGC.c+'" stroke-width="3"/>'+figLab(203,78,fig.r,FIGC.c);}
      return svgWrap(330,196,b);
    }
    if(k==="pave"){
      var x=70,y=70,w=170,h=90,dx=46,dy=-36;
      b+='<polygon points="'+x+","+y+" "+(x+dx)+","+(y+dy)+" "+(x+w+dx)+","+(y+dy)+" "+(x+w)+","+y+'" fill="#DCD7FF" stroke="'+FIGC.v+'" stroke-width="3"/>';
      b+='<polygon points="'+(x+w)+","+y+" "+(x+w+dx)+","+(y+dy)+" "+(x+w+dx)+","+(y+h+dy)+" "+(x+w)+","+(y+h)+'" fill="#C9C2FF" stroke="'+FIGC.v+'" stroke-width="3"/>';
      b+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+FIGC.l+'" stroke="'+FIGC.v+'" stroke-width="3"/>';
      b+='<path d="M'+x+" "+(y+h)+"L"+(x+dx)+" "+(y+h+dy)+"L"+(x+w+dx)+" "+(y+h+dy)+"M"+(x+dx)+" "+(y+h+dy)+"V"+(y+dy)+'" fill="none" stroke="'+FIGC.v+'" stroke-width="2" stroke-dasharray="6 5" opacity=".6"/>';
      b+=figLab(x+w/2,y+h+20,fig.L)+figLab(x-28,y+h/2,fig.h)+figLab(x+w+dx/2+30,y+h+dy/2+28,fig.l);
      return svgWrap(330,196,b);
    }
    if(k==="cyl"){
      b+='<path d="M95 50v110a70 20 0 0 0 140 0V50" fill="'+FIGC.l+'" stroke="'+FIGC.m+'" stroke-width="3"/><ellipse cx="165" cy="50" rx="70" ry="20" fill="#CDEFE4" stroke="'+FIGC.m+'" stroke-width="3"/>';
      b+='<path d="M95 160a70 20 0 0 1 140 0" fill="none" stroke="'+FIGC.m+'" stroke-width="2" stroke-dasharray="6 5"/><line x1="165" y1="50" x2="235" y2="50" stroke="'+FIGC.c+'" stroke-width="3"/>';
      b+=figLab(200,30,fig.r,FIGC.c)+figLab(262,105,fig.h);
      return svgWrap(330,196,b);
    }
    if(k==="angtri"){
      var A=[40,170],B=[290,170],C=[120,36];
      b+='<polygon points="'+[A,B,C].map(function(p){return p.join(",");}).join(" ")+'" fill="'+FIGC.l+'" stroke="'+FIGC.v+'" stroke-width="4" stroke-linejoin="round"/>';
      b+=figT(78,154,fig.a,{c:FIGC.c})+figT(246,156,fig.b,{c:FIGC.k})+figT(123,72,fig.c,{c:FIGC.m});
      if(fig.n)b+=figT(28,182,fig.n[0])+figT(302,182,fig.n[1])+figT(120,20,fig.n[2]);
      return svgWrap(330,196,b);
    }
    if(k==="thales"){ /* A en haut, M sur [AB], N sur [AC], (MN) // (BC) */
      var pA=[165,22],pB=[40,182],pC=[300,182],t=0.45,pM=[pA[0]+t*(pB[0]-pA[0]),pA[1]+t*(pB[1]-pA[1])],pN=[pA[0]+t*(pC[0]-pA[0]),pA[1]+t*(pC[1]-pA[1])];
      b+='<polygon points="'+[pA,pB,pC].map(function(p){return p.join(",");}).join(" ")+'" fill="'+FIGC.l+'" stroke="'+FIGC.v+'" stroke-width="3.5" stroke-linejoin="round"/>';
      b+='<line x1="'+pM[0]+'" y1="'+pM[1]+'" x2="'+pN[0]+'" y2="'+pN[1]+'" stroke="'+FIGC.c+'" stroke-width="3.5"/>';
      b+=figT(165,10,"A")+figT(28,190,"B")+figT(312,190,"C")+figT(pM[0]-14,pM[1],"M")+figT(pN[0]+14,pN[1],"N");
      var L=fig.L||{};
      b+=figLab((pA[0]+pM[0])/2-26,(pA[1]+pM[1])/2,L.AM)+figLab((pM[0]+pB[0])/2-26,(pM[1]+pB[1])/2,L.MB)+figLab((pA[0]+pN[0])/2+26,(pA[1]+pN[1])/2,L.AN)+figLab((pN[0]+pC[0])/2+26,(pN[1]+pC[1])/2,L.NC)+figLab(165,pM[1]-14,L.MN,FIGC.c)+figLab(165,200,L.BC);
      return svgWrap(330,214,b);
    }
    if(k==="bars"){
      var xs=fig.x||[],ys=(fig.y||[]).map(fnum),n=ys.length;if(!n)return "";
      var ymax=Math.max.apply(null,ys.concat([1])),g=niceUp(ymax/5),top=Math.ceil(ymax/g)*g;if(top===ymax)top+=g;
      var X0=48,Y0=170,H=140,W=270,bw=W/n*0.62;
      for(var v=0;v<=top+1e-9;v+=g){var yy=Y0-H*v/top;b+='<line x1="'+X0+'" y1="'+rd(yy,1)+'" x2="'+(X0+W)+'" y2="'+rd(yy,1)+'" stroke="'+FIGC.g+'" stroke-width="1.5"/>'+figT(X0-8,yy,f(v,3),{fs:12,fw:700,a:"end"});}
      ys.forEach(function(v,i){var bx=X0+W/n*(i+0.5)-bw/2,bh=H*v/top;b+='<rect x="'+rd(bx,1)+'" y="'+rd(Y0-bh,1)+'" width="'+rd(bw,1)+'" height="'+rd(bh,1)+'" rx="5" fill="'+FIG_PAL[i%FIG_PAL.length]+'"/>'+figT(bx+bw/2,Y0+14,xs[i],{fs:12,fw:800});});
      b+='<line x1="'+X0+'" y1="'+Y0+'" x2="'+(X0+W)+'" y2="'+Y0+'" stroke="'+FIGC.ink+'" stroke-width="2"/>';
      if(fig.u)b+=figT(X0-6,16,fig.u,{fs:12,a:"start",c:FIGC.v});
      return svgWrap(330,196,b);
    }
    if(k==="graph"){ /* repère quadrillé ; pts = courbe (ligne brisée) ; dots = points nommés */
      var xr=fig.xr||[-1,6],yr=fig.yr||[-1,6],ox=xr[0]>=0?40:24,GW=314-ox,GH=190,oy=10,sx=GW/(xr[1]-xr[0]),sy=GH/(yr[1]-yr[0]);
      var gx=function(x){return ox+(x-xr[0])*sx;},gy=function(y){return oy+(yr[1]-y)*sy;};
      var stx=fig.sx||1,sty=fig.sy||1;
      for(var i=Math.ceil(xr[0]/stx)*stx;i<=xr[1]+1e-9;i+=stx)b+='<line x1="'+rd(gx(i),1)+'" y1="'+oy+'" x2="'+rd(gx(i),1)+'" y2="'+(oy+GH)+'" stroke="'+FIGC.g+'" stroke-width="1"/>';
      for(var j=Math.ceil(yr[0]/sty)*sty;j<=yr[1]+1e-9;j+=sty)b+='<line x1="'+ox+'" y1="'+rd(gy(j),1)+'" x2="'+(ox+GW)+'" y2="'+rd(gy(j),1)+'" stroke="'+FIGC.g+'" stroke-width="1"/>';
      if(xr[0]<=0&&xr[1]>=0)b+='<line x1="'+rd(gx(0),1)+'" y1="'+oy+'" x2="'+rd(gx(0),1)+'" y2="'+(oy+GH)+'" stroke="'+FIGC.ink+'" stroke-width="2"/>';
      if(yr[0]<=0&&yr[1]>=0)b+='<line x1="'+ox+'" y1="'+rd(gy(0),1)+'" x2="'+(ox+GW)+'" y2="'+rd(gy(0),1)+'" stroke="'+FIGC.ink+'" stroke-width="2"/>';
      var x0=xr[0]<=0&&xr[1]>=0?0:xr[0],y0=yr[0]<=0&&yr[1]>=0?0:yr[0];var bl=b.length;
      for(var a2=Math.ceil(xr[0]/stx)*stx;a2<=xr[1]+1e-9;a2+=stx){if(Math.abs(a2-x0)<1e-9&&x0===0)continue;if(x0===0&&y0===0&&Math.abs(a2+stx)<1e-9&&stx*sx<30)continue;if(fig.lx===false)break;if(Math.round(a2/stx)%(fig.ex||1)===0)b+=figT(gx(a2),Math.min(oy+GH+12,gy(y0)+12),f(a2,2),{fs:11,fw:700,halo:1});}
      for(var b2=Math.ceil(yr[0]/sty)*sty;b2<=yr[1]+1e-9;b2+=sty){if(Math.abs(b2-y0)<1e-9&&y0===0)continue;if(x0===0&&y0===0&&Math.abs(b2+sty)<1e-9&&sty*sy<24)continue;if(fig.ly===false)break;if(Math.round(b2/sty)%(fig.ey||1)===0)b+=figT(gx(x0)-7,gy(b2),f(b2,2),{fs:11,fw:700,a:"end",halo:1});}
      if(x0===0&&y0===0)b+=figT(gx(0)-8,Math.min(oy+GH+12,gy(0)+11),"0",{fs:11,fw:700,halo:1});var labs=b.slice(bl);b=b.slice(0,bl);
      var cid="fgc"+(++FIG_N);   /* identifiant unique : plusieurs repères peuvent cohabiter dans la page */
      b+='<clipPath id="'+cid+'"><rect x="'+(ox-2)+'" y="'+(oy-2)+'" width="'+(GW+4)+'" height="'+(GH+4)+'"/></clipPath><g clip-path="url(#'+cid+')">';
      (fig.curves||(fig.pts?[fig.pts]:[])).forEach(function(cv,ci){
        var d=cv.map(function(p,pi){return (pi?"L":"M")+rd(gx(p[0]),1)+" "+rd(gy(p[1]),1);}).join("");
        b+='<path d="'+d+'" fill="none" stroke="'+FIG_PAL[ci===0?0:1+ci%5]+'" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>';
      });
      b+="</g>"+labs;
      (fig.names||[]).forEach(function(nm){b+=figT(Math.min(ox+GW-8,Math.max(ox+8,gx(nm[0]))),Math.min(oy+GH-8,Math.max(oy+8,gy(nm[1]))),nm[2],{fs:14,c:FIG_PAL[(nm[3]||0)%6],halo:1});});
      (fig.dots||[]).forEach(function(p,pi){b+='<circle cx="'+rd(gx(p[0]),1)+'" cy="'+rd(gy(p[1]),1)+'" r="5" fill="'+FIGC.c+'" stroke="#fff" stroke-width="2"/>'+(p[2]?figT(gx(p[0])+11,gy(p[1])-11,p[2],{fs:14,c:FIGC.c,halo:1}):"");});
      if(fig.xn)b+=figT(ox+GW-4,Math.min(oy+GH-8,gy(y0)-10),fig.xn,{fs:12,a:"end",c:FIGC.v,halo:1});
      if(fig.yn)b+=figT(gx(x0)+6,oy+8,fig.yn,{fs:12,a:"start",c:FIGC.v,halo:1});
      return svgWrap(330,226,b);
    }
    if(k==="axe"){ /* droite graduée ; pts = [[valeur, nom]] */
      var mn=fig.min,mx=fig.max,stp=fig.step||1,X1=24,X2=306,Y=70,sc=(X2-X1)/(mx-mn),px=function(v){return X1+(v-mn)*sc;};
      b+='<line x1="'+(X1-8)+'" y1="'+Y+'" x2="'+(X2+12)+'" y2="'+Y+'" stroke="'+FIGC.ink+'" stroke-width="3"/><path d="M'+(X2+14)+" "+Y+"l-10 -6v12z\" fill=\""+FIGC.ink+'"/>';
      var nt=Math.round((mx-mn)/stp);
      for(var q2=0;q2<=nt;q2++){var vv=rd(mn+q2*stp,6),big=fig.every?q2%fig.every===0:true;b+='<line x1="'+rd(px(vv),1)+'" y1="'+(Y-(big?10:6))+'" x2="'+rd(px(vv),1)+'" y2="'+(Y+(big?10:6))+'" stroke="'+FIGC.ink+'" stroke-width="'+(big?2.5:1.5)+'"/>';if(big&&(fig.labels===undefined||fig.labels.indexOf(q2)>=0))b+=figT(px(vv),Y+26,f(vv,3),{fs:13,fw:700});}
      var srt=(fig.pts||[]).map(function(p,i){return [px(p[0]),i];}).sort(function(a,c){return a[0]-c[0];}),lvl={},lastX=-1e9,lastL=0;
      srt.forEach(function(e){var nl=String((fig.pts[e[1]]||[])[1]||"").length*10+8;lastL=(e[0]-lastX<nl)?1-lastL:0;lvl[e[1]]=lastL;lastX=e[0];});
      (fig.pts||[]).forEach(function(p,i){b+='<circle cx="'+rd(px(p[0]),1)+'" cy="'+Y+'" r="6.5" fill="'+FIG_PAL[(i+1)%6]+'" stroke="#fff" stroke-width="2"/>'+figT(px(p[0]),Y-24-(lvl[i]?20:0),p[1],{fs:16,c:FIG_PAL[(i+1)%6],halo:1});});
      return svgWrap(330,112,b);
    }
    if(k==="tree"){ /* arbre pondéré à deux niveaux ; p = [p(A), p(Ā)] ; c = [[pA(B), pA(B̄)], [pĀ(B), pĀ(B̄)]] (étiquettes) */
      var ev=fig.ev||["A","Ā"],e2=fig.e2||["B","B̄"],R0=[22,110],L1=[[130,52],[130,168]],L2=[[262,22],[262,82],[262,138],[262,198]];
      var line=function(p,q){return '<line x1="'+(p[0]+10)+'" y1="'+p[1]+'" x2="'+(q[0]-14)+'" y2="'+q[1]+'" stroke="'+FIGC.v+'" stroke-width="3"/>';};
      b+=line(R0,L1[0])+line(R0,L1[1]);for(var t2=0;t2<4;t2++)b+=line(L1[t2>>1],L2[t2]);
      b+=figT(L1[0][0],L1[0][1],ev[0],{fs:17})+figT(L1[1][0],L1[1][1],ev[1],{fs:17});
      for(var t3=0;t3<4;t3++)b+=figT(L2[t3][0]+4,L2[t3][1],e2[t3%2],{fs:16});
      var pl=fig.p||["",""],cl=fig.c||[["",""],["",""]];
      b+=figLab(70,66,pl[0])+figLab(70,156,pl[1]);
      b+=figLab(196,30,cl[0][0])+figLab(196,76,cl[0][1])+figLab(196,144,cl[1][0])+figLab(196,190,cl[1][1]);
      return svgWrap(300,220,b);
    }
    if(k==="code"){ /* programme Python ou instructions : texte brut échappé, une ligne par instruction */
      return '<pre class="figcode">'+(fig.lines||[]).slice(0,12).map(function(l){return String(l).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").slice(0,60);}).join("\n")+"</pre>";
    }
    if(k==="tab"){ /* tableau : rows = [[…],[…]] (1re ligne = en-têtes) */
      var rows=(fig.rows||[]).slice(0,6);
      return '<table class="figtab">'+rows.map(function(rw,i){return "<tr>"+rw.slice(0,9).map(function(c,j){var tg=(i===0||(fig.hc&&j===0))?"th":"td";return "<"+tg+">"+xe(c)+"</"+tg+">";}).join("")+"</tr>";}).join("")+"</table>";
    }
  }catch(e){}
  return "";
}
