/* ═══════════════════════════════════════════════════════════════
   v4.0 — NOUVEAUX FORMATS POUR DES NOTIONS EXISTANTES
   Intrus, texte à trous, qui suis-je, plusieurs bonnes réponses.
   Chaque forme est tirée au sort avec la probabilité indiquée, à côté des formes d’origine.
   Les nombres sont tirés au hasard et les réponses calculées : rien n’est écrit « en dur ».
═══════════════════════════════════════════════════════════════ */
function addForms(id,p,gen){
  for(var i=0;i<BANK.length;i++)if(BANK[i].id===id){
    var it=BANK[i],old=it.gen;
    it.gen=function(r,ctx){if(r()<p){var q=gen(r,ctx);if(q)return q;}return old(r,ctx);};
    it.nvar=(it.nvar||0)+4;it.v4=1;return;
  }
}
function sgnM(n){return n<0?"("+fm(n)+")":fm(n);}
function uniq(a){var s={},o=[];a.forEach(function(x){var k=String(x);if(!s[k]){s[k]=1;o.push(x);}});return o;}

/* Fractions, décimaux, pourcentages : intrus et écritures égales */
addForms("frac_dec_pct",0.4,function(r){
  var e=pick(r,FEQ),k=rnd(r,2,5),near=FEQ.filter(function(x){return x!==e;}).sort(function(a,b){return Math.abs(a[3]-e[3])-Math.abs(b[3]-e[3]);}),x=near[rnd(r,0,2)];
  if(r()<0.5){
    var forms=[frM(e[0],e[1]),e[2],f(e[3])+" %",frM(e[0]*k,e[1]*k)],intr=pick(r,[frM(x[0],x[1]),x[2],f(x[3])+" %"]);
    return QI(r,"Trouve l’intrus : trois de ces écritures sont égales.",intr,pickN(r,forms,3),
      "Les trois écritures égales valent "+e[2]+" ; l’intrus vaut "+x[2]+".");
  }
  var oks=[frM(e[0],e[1]),f(e[3])+" %",frM(e[0]*k,e[1]*k)],nos=[[frM(x[0],x[1]),"conf"],[e[0]+""+e[1]+" %","conf"]];
  if(e[0]!==e[1])nos.push([frM(e[1],e[0]),"inv"]);
  return QM(r,"Coche toutes les écritures égales à "+e[2]+".",oks,nos,
    e[2]+" = "+frM(e[0],e[1])+" = "+frM(e[0]*k,e[1]*k)+" = "+f(e[3])+" %. Attention : "+frM(e[0],e[1])+" ne s’écrit pas « "+e[0]+""+e[1]+" % ».");
});

/* Nombres relatifs : signe d’un résultat */
addForms("relatifs",0.35,function(r){
  var ops=[],guard=0;
  while(ops.length<5&&guard++<60){
    var a=rnd(r,-9,9),b=rnd(r,-9,9),t=rnd(r,0,2);if(!a||!b)continue;
    var v=t===0?a*b:t===1?a+b:a-b;if(!v)continue;
    var s=t===0?sgnM(a)+" \\times "+sgnM(b):t===1?fm(a)+" + "+sgnM(b):fm(a)+" - "+sgnM(b);
    if(ops.some(function(o){return o.s===s;}))continue;
    ops.push({s:M(s),v:v});
  }
  var neg=ops.filter(function(o){return o.v<0;}),pos=ops.filter(function(o){return o.v>0;});
  if(neg.length<2||pos.length<1)return null;
  return QM(r,"Coche tous les calculs dont le résultat est négatif.",neg.map(function(o){return o.s;}),pos.map(function(o){return [o.s,"signe"];}),
    ops.map(function(o){return o.s+" = "+M(fm(o.v));}).join(" ; ")+".");
});

/* Pourcentage d’une quantité : texte à trous (pourcentage manquant) */
addForms("pct_de",0.3,function(r){
  var p=pick(r,[10,20,25,50,75,5,30,40]),N=pick(r,[40,60,80,120,200,240,300,400]),V=p*N/100;
  if(V!==Math.round(V))return null;
  return QT(r,"Complète : ____ de "+f(N)+" = "+f(V)+".",f(p)+" %",[[f(V/N)+" %","pct0"],[f(N/V)+" %","inv"],[f(V)+" %","conf"]],
    f(V)+" ÷ "+f(N)+" = "+f(V/N,4)+" = "+f(p)+" %.");
});

/* Équations du premier degré : plusieurs équations de même solution */
addForms("eq1",0.3,function(r){
  var s=rnd(r,-5,8),list=[],guard=0;
  function eq(sol){var a=pick(r,[2,3,4,5,-2,-3]),b=rnd(r,-9,9);return {t:M(fm(a)+"x"+(b<0?" - "+fm(-b):b>0?" + "+fm(b):"")+" = "+fm(a*sol+b)),ok:sol===s};}
  while(list.length<3&&guard++<40){var e=eq(s);if(!list.some(function(x){return x.t===e.t;}))list.push(e);}
  var o1=s+rnd(r,1,3),o2=-s||2;if(o2===s)o2=s+4;
  var bad=[eq(o1),eq(o2)];
  return QM(r,"Coche toutes les équations qui ont pour solution "+M("x = "+fm(s))+".",list.map(function(e){return e.t;}),bad.map(function(e){return [e.t,"calc"];}),
    "On remplace "+M("x")+" par "+M(fm(s))+" dans chaque équation et on vérifie l’égalité.");
});

/* Développer : expressions égales à k(x + a) */
addForms("lit_dev",0.3,function(r){
  var k=rnd(r,2,7),a=rnd(r,1,9);
  var oks=[M(k+"x + "+k*a),M(k*a+" + "+k+"x"),M(k+" \\times x + "+k+" \\times "+a)];
  var nos=[[M(k+"x + "+a),"demi"],[M((k+a)+"x"),"addp"],[M(k+"x + "+(k+a)),"addp"]];
  return QM(r,"Coche toutes les expressions égales à "+M(k+"(x + "+a+")")+".",oks,nos,
    "On distribue "+M(k)+" sur chaque terme : "+M(k+"(x + "+a+") = "+k+"x + "+k*a)+". L’ordre des termes ne change rien.");
});

/* Médiane : qui suis-je ? */
addForms("mediane",0.3,function(r){
  var n=pick(r,[5,7]),v=[];for(var i=0;i<n;i++)v.push(rnd(r,2,19));
  v.sort(function(a,b){return a-b;});var med=v[(n-1)/2],sum=v.reduce(function(s,x){return s+x;},0),moy=sum/n,et=v[n-1]-v[0];
  if(moy===med||et===med)return null;
  var shown=shuffle(r,v.slice());if(shown[(n-1)/2]===med)return null;
  return QW(r,"Série : "+shown.join(" ; ")+". Je partage cette série rangée dans l’ordre croissant en deux groupes de même effectif. Qui suis-je ?",
    "la médiane : "+med,[["la moyenne : "+f(moy,2),"conf"],["l’étendue : "+et,"conf"],["la valeur du milieu de la liste non rangée : "+shown[(n-1)/2],"ordre2"]],
    "Rangée : "+v.join(" ; ")+". La médiane est la "+((n+1)/2)+"ᵉ valeur : "+med+".");
});

/* Angles d’un triangle : intrus */
addForms("angles_tri",0.3,function(r){
  var ok=[],guard=0;
  while(ok.length<3&&guard++<50){var a=rnd(r,3,12)*5,b=rnd(r,3,12)*5,c=180-a-b;if(c<15)continue;var t=[a,b,c].sort(function(x,y){return y-x;}).map(function(x){return x+"°";}).join(" ; ");if(ok.indexOf(t)<0)ok.push(t);}
  if(ok.length<3)return null;
  var a2=rnd(r,4,11)*5,b2=rnd(r,4,11)*5,c2=180-a2-b2+pick(r,[-20,-10,10,20]);if(c2<10)return null;
  var bad=[a2,b2,c2].sort(function(x,y){return y-x;}).map(function(x){return x+"°";}).join(" ; ");
  return QI(r,"Trouve l’intrus : trois de ces triangles peuvent exister (mesures de leurs trois angles).",bad,ok,
    "La somme des angles d’un triangle vaut 180°. Pour l’intrus : "+(a2+b2+c2)+"°.");
});

/* Réciproque de Pythagore : intrus */
addForms("pyth_recip",0.3,function(r){
  var T=[[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15],[12,16,20]],s=pickN(r,T,4),k=pick(r,[1,2]);
  var ok=s.slice(0,3).map(function(t){return t.map(function(x){return f(x*k)+" cm";}).join(" ; ");});
  var b=s[3].slice();b[2]+=1;
  var bad=b.map(function(x){return f(x*k)+" cm";}).join(" ; ");
  return QI(r,"Trouve l’intrus : trois de ces triangles sont rectangles (longueurs des côtés).",bad,ok,
    "On compare le carré du plus grand côté à la somme des carrés des deux autres : "+M(fm(b[0]*k)+"^2 + "+fm(b[1]*k)+"^2 = "+fm((b[0]*b[0]+b[1]*b[1])*k*k))+" mais "+M(fm(b[2]*k)+"^2 = "+fm(b[2]*b[2]*k*k))+".");
});

/* Conversions de longueurs : intrus */
addForms("conv",0.3,function(r){
  var m=pick(r,[1.5,2.4,3.75,0.8,12.5,0.35]),U=[["km",0.001],["m",1],["cm",100],["mm",1000]],us=pickN(r,U,3);
  var ok=us.map(function(u){return f(m*u[1],4)+" "+u[0];});
  var u4=pick(r,U.filter(function(u){return us.indexOf(u)<0;})),fac=pick(r,[10,0.1]);
  var bad=f(m*u4[1]*fac,5)+" "+u4[0];
  if(ok.indexOf(bad)>=0)return null;
  return QI(r,"Trouve l’intrus : trois de ces longueurs sont égales.",bad,ok,
    "Les trois longueurs égales valent "+f(m,3)+" m ; l’intrus vaut "+f(m*fac,4)+" m (virgule décalée d’un rang).",{});
});

/* Sens de variation d’une fonction affine : plusieurs bonnes réponses */
addForms("sens_variation",0.3,function(r){
  var fs=[],guard=0;
  while(fs.length<5&&guard++<40){var a=pick(r,[-4,-3,-2,-1,-0.5,0.5,1,2,3,5]),b=rnd(r,-6,6);var t=M("f(x) = "+(a===1?"":a===-1?"-":fm(a))+"x"+(b<0?" - "+fm(-b):b>0?" + "+fm(b):""));if(!fs.some(function(x){return x.t===t;}))fs.push({t:t,a:a});}
  var up=fs.filter(function(x){return x.a>0;}),dn=fs.filter(function(x){return x.a<0;});
  if(up.length<2||dn.length<1)return null;
  return QM(r,"Coche toutes les fonctions croissantes.",up.map(function(x){return x.t;}),dn.map(function(x){return [x.t,"signe"];}),
    "Une fonction affine "+M("f(x) = ax + b")+" est croissante quand son coefficient directeur "+M("a")+" est positif, décroissante quand il est négatif.");
});

/* Suites : intrus (arithmétique / géométrique) */
addForms("reconnaitre_suite",0.3,function(r){
  var ok=[],guard=0;
  while(ok.length<3&&guard++<40){var u=rnd(r,1,20),q=pick(r,[2,3,4,5,-3,-2,7]);var t=[u,u+q,u+2*q,u+3*q].map(function(x){return fm(x);}).join(" ; ");if(ok.indexOf(t)<0)ok.push(t);}
  var u0=rnd(r,1,4),g=pick(r,[2,3]),bad=[u0,u0*g,u0*g*g,u0*g*g*g].map(function(x){return fm(x);}).join(" ; ");
  return QI(r,"Trouve l’intrus : trois de ces suites sont arithmétiques.",bad,ok,
    "Dans une suite arithmétique, on ajoute toujours le même nombre. L’intrus est géométrique : on multiplie par "+g+".");
});

/* Carrés et racines : intrus */
addForms("carres_racines",0.3,function(r){
  var n=rnd(r,2,9),N=n*n;
  var ok=[M(fm(n)+"^2"),M("(-"+fm(n)+")^2"),M("\\sqrt{"+fm(N*N)+"}"),M(fm(2*N)+" \\div 2")];
  var bad=pick(r,[M("-"+fm(n)+"^2"),M(fm(n)+" \\times 2"),M("\\sqrt{"+fm(N)+"}")]);
  return QI(r,"Trouve l’intrus : trois de ces écritures valent "+M(fm(N))+".",bad,pickN(r,ok,3),
    M(fm(n)+"^2 = (-"+fm(n)+")^2 = "+fm(N))+". Attention : "+M("-"+fm(n)+"^2 = -"+fm(N))+", "+M(fm(n)+" \\times 2 = "+fm(2*n))+" et "+M("\\sqrt{"+fm(N)+"} = "+fm(n))+".");
});

/* Équation de droite : qui suis-je ? */
addForms("droite_eq",0.3,function(r){
  var a=pick(r,[-3,-2,-1,2,3,4,0.5]),b=rnd(r,-5,6);if(!b||a===b)return null;
  var L=function(a1,b1){return M("y = "+(a1===1?"":a1===-1?"-":fm(a1))+"x"+(b1<0?" - "+fm(-b1):b1>0?" + "+fm(b1):""));};
  return QW(r,"Je suis une droite de coefficient directeur "+M(fm(a))+" qui coupe l’axe des ordonnées au point "+M("(0 ; "+fm(b)+")")+". Qui suis-je ?",L(a,b),
    [[L(b,a),"inv"],[L(a,-b),"signe"],[L(-a,b),"signe"]],
    "Équation réduite "+M("y = ax + b")+" : "+M("a")+" est le coefficient directeur, "+M("b")+" l’ordonnée à l’origine.");
});
