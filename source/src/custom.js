/* ═══════════════════════════════════════════════════════════════
   MES QUESTIONS : import texte (« * » devant la bonne réponse),
   édition, suppression, temps par notion, notions masquées.
   Tout reste dans le navigateur ; export / import JSON pour changer d’ordinateur.
═══════════════════════════════════════════════════════════════ */
var CUSTOM=[];
var IMPORT_HELP_EXAMPLE=[
  "# Calcul mental",
  "Combien font $7 \\times 8$ ?",
  "* 56",
  "54",
  "15",
  "78",
  "",
  "Le produit de deux nombres négatifs est :",
  "* positif",
  "négatif",
  "nul",
  "> Moins par moins donne plus.",
  "",
  "Quel est 10 % de 250 € ?",
  "= 25 €",
  "@ 30",
  "",
  "Développer $3(x + 4)$",
  "= 3x + 12",
  "",
  "Associe chaque calcul à son résultat.",
  "$6 \\times 7$ => 42",
  "$8 \\times 9$ => 72",
  "$7 \\times 7$ => 49",
  "",
  "Range du plus petit au plus grand.",
  "1. 0,05",
  "2. 0,5",
  "3. 0,55",
  "4. 5",
  "",
  "Estime $48 \\times 21$.",
  "~ 1008 [0 ; 2000]"
].join("\n");

/* modèles {a} {a*b} quand des variables sont définies (a=2..9 ou p=5..50/5) */
function evalTpl(s,v){
  if(!v||!Object.keys(v).length)return String(s||"");
  var names=Object.keys(v).concat(["sqrt","round","abs"]),math={sqrt:Math.sqrt,round:Math.round,abs:Math.abs};
  return String(s||"").replace(/\{([^{}]+)\}/g,function(m,ex){
    var bad=false,clean=ex.replace(/[a-z_][a-z0-9_]*/gi,function(id){if(!(id in v)&&!(id in math))bad=true;return "0";});
    if(bad||!/^[0-9+\-*\/().,\s^%]*$/.test(clean))return m;
    try{
      var args=names.map(function(k){return k in v?v[k]:math[k];});
      var x=Function.apply(null,names.concat(["return ("+ex.replace(/\^/g,"**")+");"])).apply(null,args);
      return (typeof x==="number"&&isFinite(x))?f(x,4):String(x);
    }catch(e){return m;}
  });
}
function parseVars(txt){
  var out=[];
  String(txt||"").split(/\n/).forEach(function(l){
    var m=l.trim().match(/^([a-z]\w*)\s*=\s*(-?[\d.,]+)\s*\.\.\s*(-?[\d.,]+)(?:\s*\/\s*([\d.,]+))?$/i);
    if(!m)return;
    var n=function(x){return parseFloat(String(x).replace(",","."));};
    var st=m[4]?n(m[4]):1;if(!(st>0))st=1;
    if(n(m[3])>=n(m[2]))out.push({n:m[1],min:n(m[2]),max:n(m[3]),st:st});
  });
  return out;
}
function varsText(vars){return (vars||[]).map(function(x){return x.n+"="+String(x.min).replace(".",",")+".."+String(x.max).replace(".",",")+(x.st!==1?"/"+String(x.st).replace(".",","):"");}).join("\n");}

/* réponse libre « = … » : nombre (avec unité) ou expression en x */
function parseFreeAnswer(raw){
  var s=String(raw||"").trim();if(!s)return null;
  if(/x/i.test(s.replace(/[a-wyzA-WYZ]+x|x[a-wyzA-WYZ]+/g,""))&&parseExpr(s))return {lit:normIn(s),t:s};
  var m=normIn(s).match(/^([+-]?(?:\d+\.?\d*|\.\d+))(?:\/(\d+(?:\.\d+)?))?(.*)$/);
  if(!m)return null;
  var v=m[2]?parseFloat(m[1])/parseFloat(m[2]):parseFloat(m[1]);if(!isFinite(v))return null;
  var unit=s.replace(/^[\s+−\-–]*[\d\s .,]+(\/\s*\d+(?:[.,]\d+)?)?/,"").trim();
  var dec=(m[1].split(".")[1]||"").length;
  return {num:v,unit:unit.slice(0,8),dec:Math.max(dec,m[2]?3:0),t:s};
}
/* « 120 kg [0 ; 500] ± 10 » → {v, u, min, max, tol} */
function parseEstim(s){
  var N="([+\\-−]?\\d[\\d\\s]*(?:[.,]\\d+)?)",m=String(s).trim().match(new RegExp("^"+N+"\\s*([^\\[±]*?)\\s*(?:\\[\\s*"+N+"\\s*[;]\\s*"+N+"\\s*\\])?\\s*(?:±\\s*"+N+")?\\s*$"));
  if(!m)return null;
  var n=function(x){return x===undefined?undefined:parseFloat(String(x).replace(/[\s]/g,"").replace("−","-").replace(",","."));};
  var o={v:n(m[1]),u:(m[2]||"").trim().slice(0,8)};
  if(!isFinite(o.v))return null;
  if(m[3]!==undefined){o.min=n(m[3]);o.max=n(m[4]);if(!(o.min<o.v&&o.v<o.max))return null;}
  if(m[5]!==undefined){o.tol=n(m[5]);if(!(o.tol>0))return null;}
  return o;
}
/* ─ texte → questions ─ */
function parseImportText(txt){
  var lines=String(txt||"").replace(/\r/g,"").split("\n"),groups=[],cur=null,q=null,errors=[],count=0;
  function grp(title){cur={titre:title||"",qs:[]};groups.push(cur);}
  function flush(){
    if(!q)return;
    if(q.ord.length&&(q.ok!==null||q.fa)){q.wr=q.wr.concat(q.ord.map(function(x){return x[1];}));q.ord=[];}
    var ok=q.ok,wr=q.wr,line=q.line,fa=q.fa;
    if(q.q&&(q.pairs.length||q.ord.length||q.es)){
      var o2={q:q.q.slice(0,600)};
      if(q.pairs.length){if(q.pairs.length<2||q.pairs.length>5)errors.push({line:line,msg:"tuiles : il faut entre 2 et 5 lignes « gauche => droite »"});else o2.as=q.pairs;}
      else if(q.ord.length){if(q.ord.length<3||q.ord.length>6)errors.push({line:line,msg:"ordre : il faut entre 3 et 6 lignes numérotées « 1. … »"});else o2.or=q.ord.sort(function(a,b){return a[0]-b[0];}).map(function(x){return x[1];});}
      else o2.es=q.es;
      if(o2.as||o2.or||o2.es){if(q.x)o2.x=q.x.slice(0,600);if(q.t)o2.t=q.t;if(!cur)grp("");cur.qs.push(o2);count++;}
      q=null;return;
    }
    if(!q.q)errors.push({line:line,msg:"énoncé manquant"});
    else if(ok===null&&!fa)errors.push({line:line,msg:"aucune bonne réponse : mettez « * » devant la bonne proposition, ou « = valeur » pour une saisie libre"});
    else if(ok!==null&&!wr.length&&!fa)errors.push({line:line,msg:"il faut au moins une mauvaise réponse"});
    else if(q.many)errors.push({line:line,msg:"une seule bonne réponse (« * ») par question"});
    else{
      var o={q:q.q.slice(0,600)};
      if(ok!==null){o.ok=ok.slice(0,120);o.wr=wr.slice(0,3).map(function(w){return w.slice(0,120);});if(wr.length>3)errors.push({line:line,msg:"plus de 3 mauvaises réponses : seules les 3 premières sont gardées",soft:true});}
      if(fa){for(var k in fa)if(k!=="t")o[k]=fa[k];o.ft=fa.t;if(ok===null)o.ok=fa.t;}
      if(q.x)o.x=q.x.slice(0,600);
      if(q.t)o.t=q.t;
      if(!cur)grp("");
      cur.qs.push(o);count++;
    }
    q=null;
  }
  lines.forEach(function(raw,i){
    var l=raw.trim(),n=i+1;
    if(!l){flush();return;}
    if(/^#/.test(l)){flush();grp(l.replace(/^#+\s*/,"").slice(0,90));return;}
    if(!q){q={q:l,ok:null,wr:[],line:n,fa:null,x:"",t:0,many:false,pairs:[],ord:[],es:null};return;}
    var om=l.match(/^(\d)[.)]\s+(.+)$/);
    if(om){q.ord.push([+om[1],om[2].slice(0,60)]);return;}
    var pm=l.split(/\s+(?:=>|⟷|↔|<->)\s+/);
    if(pm.length===2&&pm[0]&&pm[1]&&!/^[*=>@~]/.test(l)){q.pairs.push([pm[0].slice(0,60),pm[1].slice(0,60)]);return;}
    if(/^~/.test(l)){var es=parseEstim(l.replace(/^~\s*/,""));if(!es)errors.push({line:n,msg:"estimation illisible : écrivez par ex. « ~ 120 » ou « ~ 120 [0 ; 500] » ou « ~ 120 kg [0 ; 500] ± 10 »"});else q.es=es;return;}
    var a=l.replace(/^(?:[-•–]\s+|[A-Da-d][).]\s+)/,"");
    if(/^\*/.test(a)){var t=a.replace(/^\*\s*/,"");if(q.ok!==null)q.many=true;q.ok=t;return;}
    if(/^=/.test(a)){var fa=parseFreeAnswer(a.replace(/^=\s*/,""));if(!fa){errors.push({line:n,msg:"réponse libre illisible : écrivez un nombre (4,5 ; 25 % ; 3/4) ou une expression en x"});}else q.fa=fa;return;}
    if(/^>/.test(a)){q.x+=(q.x?" ":"")+a.replace(/^>\s*/,"");return;}
    if(/^@/.test(a)){var s=parseInt(a.replace(/[^\d]/g,""),10);if(s>0)q.t=Math.min(1800,s);else errors.push({line:n,msg:"temps illisible (ex. « @ 45 » pour 45 s)"});return;}
    q.wr.push(a);
  });
  flush();
  groups=groups.filter(function(g){return g.qs.length;});
  return {groups:groups,errors:errors,count:count};
}
function itemToText(c){
  return (c.qs||[]).map(function(o){
    var L=[o.q];
    if(o.as){o.as.forEach(function(p){L.push(p[0]+" => "+p[1]);});}
    if(o.or){o.or.forEach(function(t,i){L.push((i+1)+". "+t);});}
    if(o.es){var e=o.es,F=function(v){return String(v).replace(".",",");};L.push("~ "+F(e.v)+(e.u?" "+e.u:"")+(e.min!==undefined?" ["+F(e.min)+" ; "+F(e.max)+"]":"")+(e.tol!==undefined?" ± "+F(e.tol):""));}
    if(o.wr&&o.wr.length){L.push("* "+o.ok);o.wr.forEach(function(w){L.push(w);});}
    if(o.num!==undefined||o.lit)L.push("= "+(o.ft||o.ok));
    if(o.x)L.push("> "+o.x);
    if(o.t)L.push("@ "+o.t);
    return L.join("\n");
  }).join("\n\n");
}

/* ─ générateur d’une notion personnelle ─ */
function customGen(c){
  return function(r){
    var v={};
    (c.vars||[]).forEach(function(x){var k=Math.floor((x.max-x.min)/x.st+1e-9)+1;v[x.n]=Math.round((x.min+x.st*Math.floor(r()*k))*1e6)/1e6;});
    var o=pick(r,c.qs),E=function(s){return evalTpl(s,v);},q;
    if(o.as||o.or||o.es){
      q=coursQuestion(r,{q:E(o.q),x:E(o.x||""),as:o.as&&o.as.map(function(p){return [E(p[0]),E(p[1])];}),or:o.or&&o.or.map(E),how:o.how,sep:o.sep,es:o.es});
      if(q&&o.t)q.dur=o.t;
      return q;
    }
    var fa=null;
    if(o.num!==undefined){var vn=c.vars&&c.vars.length&&o.ft?parseFreeAnswer(E(o.ft)):null;fa=vn||{num:o.num,unit:o.unit||"",dec:o.dec||0};}
    if(o.wr&&o.wr.length){
      q=Q(r,E(o.q),E(o.ok),o.wr.map(function(w){return [E(w),"autre"];}),{keep:!!o.keep},E(o.x||""));
      if(fa){q.num=fa.num;q.unit=fa.unit;q.dec=fa.dec;}
      if(o.lit)q.lit=o.lit;
    }else if(fa){
      var u=fa.unit,d=fa.dec,N=fa.num;
      q=Q(r,E(o.q),N,[[N*10,"unit"],[N/10,"unit"],[N+Math.pow(10,-d),"calc"],[N-Math.pow(10,-d),"calc"],[N*2,"calc"]],{u:u,d:Math.max(d,0)},E(o.x||""));
    }else if(o.lit){
      q={q:E(o.q),choices:[{t:o.ft||o.ok,err:null}],ans:0,expl:E(o.x||""),lit:o.lit,only:"libre"};
    }
    if(q&&o.t)q.dur=o.t;
    return q;
  };
}
function registerCustom(c){
  unregister(c.id);
  BANK.push({id:c.id,niv:c.niv,chap:c.chap||"Mes questions",titre:c.titre,tags:["perso","mes questions"],d:c.d||2,gen:customGen(c),custom:true,nvar:c.qs.length});
  indexBank();
}
function unregister(id){for(var i=BANK.length-1;i>=0;i--)if(BANK[i].id===id)BANK.splice(i,1);indexBank();}
function cleanItem(o){
  var S=function(x,n){return String(x===undefined||x===null?"":x).replace(/[<>]/g,"").slice(0,n||400);};
  if(!o||typeof o!=="object")return null;
  var c={id:/^c_[a-z0-9]{3,14}$/.test(o.id||"")?o.id:"c_"+genId(),titre:S(o.titre,90)||"Mes questions",chap:S(o.chap,90)||"Mes questions",
    niv:(Array.isArray(o.niv)?o.niv:[]).filter(function(n){return NIVEAUX.some(function(x){return x.id===n;});}),
    d:[1,2,3].indexOf(+o.d)>=0?+o.d:2,
    vars:(Array.isArray(o.vars)?o.vars:[]).slice(0,6).filter(function(x){return x&&/^[a-z]\w{0,5}$/i.test(x.n)&&isFinite(x.min)&&isFinite(x.max)&&x.max>=x.min&&x.st>0;}).map(function(x){return {n:x.n,min:+x.min,max:+x.max,st:+x.st};}),
    qs:[]};
  var src=Array.isArray(o.qs)?o.qs:(o.q?[{q:o.q,ok:o.ok,wr:(o.wr||[]).map(function(w){return typeof w==="string"?w:(w&&w.t);}),x:o.expl}]:[]);
  src.slice(0,200).forEach(function(x){
    if(!x||!x.q)return;
    var y={q:S(x.q,600)},T=function(t){return S(t,60);};
    if(Array.isArray(x.as)){var ps=x.as.slice(0,5).filter(function(p){return Array.isArray(p)&&p[0]&&p[1];}).map(function(p){return [T(p[0]),T(p[1])];});if(ps.length>=2)y.as=ps;}
    else if(Array.isArray(x.or)){var it=x.or.slice(0,6).map(T).filter(function(t){return t;});if(it.length>=3){y.or=it;y.how=S(x.how,60);y.sep=S(x.sep,5);}}
    else if(x.es&&isFinite(+x.es.v)){var es={v:+x.es.v,u:S(x.es.u,8)};if(isFinite(+x.es.min)&&isFinite(+x.es.max)&&+x.es.min<es.v&&es.v<+x.es.max){es.min=+x.es.min;es.max=+x.es.max;}if(+x.es.tol>0)es.tol=+x.es.tol;y.es=es;}
    if(y.as||y.or||y.es){if(x.x)y.x=S(x.x,600);if(+x.t>0)y.t=Math.min(1800,Math.round(+x.t));c.qs.push(y);return;}
    if(x.keep)y.keep=1;
    if(x.wr&&x.wr.length){y.ok=S(x.ok,120);y.wr=x.wr.slice(0,3).map(function(w){return S(w,120);}).filter(function(w){return w;});if(!y.ok||!y.wr.length)return;}
    if(x.num!==undefined&&isFinite(+x.num)){y.num=+x.num;y.unit=S(x.unit,8);y.dec=Math.min(6,Math.max(0,+x.dec||0));y.ft=S(x.ft||x.ok,40);if(!y.ok)y.ok=y.ft;}
    if(x.lit&&parseExpr(x.lit)){y.lit=S(x.lit,80);y.ft=S(x.ft||x.ok,60);if(!y.ok)y.ok=y.ft;}
    if(!y.wr&&y.num===undefined&&!y.lit)return;
    if(x.x)y.x=S(x.x,600);
    if(+x.t>0)y.t=Math.min(1800,Math.round(+x.t));
    c.qs.push(y);
  });
  if(!c.niv.length)c.niv=NIVEAUX.map(function(n){return n.id;});
  if(!c.qs.length)return null;
  return c;
}
function loadCustom(){
  CUSTOM=store.get("custom",null);
  if(!Array.isArray(CUSTOM)){
    CUSTOM=[];
    /* reprise des questions de la version précédente (Flash Automatismes) */
    try{var old=JSON.parse(store.raw("flash_custom")||"null");if(Array.isArray(old))old.forEach(function(o){var c=cleanItem(o);if(c)CUSTOM.push(c);});}catch(e){}
    store.set("custom",CUSTOM);
  }
  var h=store.get("hidden",{}),t=store.get("times",{});
  HIDDEN={};for(var k in h)HIDDEN[k]=true;
  TIMES={};for(var k2 in t)if(t[k2]>0)TIMES[k2]=t[k2];
  CUSTOM=CUSTOM.map(cleanItem).filter(function(c){return c;});
  CUSTOM.forEach(function(c){try{registerCustom(c);}catch(e){}});
}
function persistCustom(){store.set("custom",CUSTOM);store.set("hidden",HIDDEN);store.set("times",TIMES);}
function saveCustomItem(c){
  var i=-1;CUSTOM.forEach(function(x,k){if(x.id===c.id)i=k;});
  if(i>=0)CUSTOM[i]=c;else CUSTOM.push(c);
  registerCustom(c);persistCustom();
}
function deleteCustomItem(id){CUSTOM=CUSTOM.filter(function(c){return c.id!==id;});unregister(id);delete TIMES[id];persistCustom();}
function customById(id){for(var i=0;i<CUSTOM.length;i++)if(CUSTOM[i].id===id)return CUSTOM[i];return null;}
function hideBuiltin(id){HIDDEN[id]=true;persistCustom();}
function restoreHidden(){HIDDEN={};persistCustom();}
function setTime(id,sec){if(sec>0)TIMES[id]=Math.min(1800,Math.round(sec));else delete TIMES[id];persistCustom();}
function hiddenCount(){return Object.keys(HIDDEN).length;}
/* test : la notion produit-elle des questions correctes ? */
function testCustom(c){
  var g=customGen(c),bad=0;
  for(var i=0;i<30;i++){var q=null;try{q=g(mulberry32(1000+i*17));}catch(e){q=null;}if(!q||!validQ(q))bad++;}
  return bad;
}
function exportCustomJson(){
  download("flash_maths_mes_questions.json",JSON.stringify({app:"flash-maths",v:3,items:CUSTOM,times:TIMES,hidden:Object.keys(HIDDEN)},null,1));
}
function importCustomJson(text){
  var o=JSON.parse(text),n=0;
  (o.items||[]).forEach(function(x){var c=cleanItem(x);if(!c)return;if(ITEM_BY_ID[c.id]&&!ITEM_BY_ID[c.id].custom)c.id="c_"+genId();saveCustomItem(c);n++;});
  var t=o.times||{};for(var k in t)if(ITEM_BY_ID[k]&&t[k]>0)TIMES[k]=Math.min(1800,Math.round(t[k]));
  (o.hidden||[]).forEach(function(id){if(ITEM_BY_ID[id]&&!ITEM_BY_ID[id].custom)HIDDEN[id]=true;});
  persistCustom();
  return n;
}
loadCustom();
