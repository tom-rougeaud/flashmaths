/* ═══════════════════════════════════════════════════════════════
   BANQUE DE QUESTIONS — items (3ᵉ PM · CAP · 2nde · 1re · Tle Bac Pro)
   Chaque item = une famille de questions à paramètres aléatoires
   avec des distracteurs qui correspondent chacun à une erreur type.
   Les formules s’écrivent entre $…$ (rendu KaTeX).
═══════════════════════════════════════════════════════════════ */
var NIVEAUX=[
  {id:"3pm", label:"3ᵉ Prépa-Métiers", court:"3ᵉ PM", color:"#D9606A"},
  {id:"cap", label:"CAP",              court:"CAP",   color:"#DE8743"},
  {id:"2nde",label:"2nde Bac Pro",     court:"2nde",  color:"#4A86CF"},
  {id:"1re", label:"1ʳᵉ Bac Pro",      court:"1ʳᵉ",   color:"#2E9E7E"},
  {id:"term",label:"Terminale Bac Pro",court:"Tle",   color:"#8A6CC9"}
];
var BANK=[];
function reg(id,niv,chap,titre,tags,d,gen,extra){var it={id:id,niv:niv,chap:chap,titre:titre,tags:tags,d:d,gen:gen};if(extra)for(var k in extra)it[k]=extra[k];BANK.push(it);}
var C_CALC="Calcul mental et automatismes",C_PROP="Proportionnalité et pourcentages",C_GRAN="Grandeurs, mesures et volumes",
    C_GEO="Géométrie et trigonométrie",C_STAT="Statistiques",C_EQ="Équations et calcul littéral",C_FONC="Fonctions affines et linéaires";

/* ═════════ CALCUL MENTAL ET AUTOMATISMES ═════════ */
reg("add_dec",["3pm","cap"],C_CALC,"Additions et soustractions de décimaux",["décimaux","addition","soustraction","virgule"],1,function(r){
  var a=rnd(r,11,299)/10,b=rnd(r,101,999)/100,plus=r()<0.6,x=a,y=b;
  if(!plus){x=Math.max(a,b);y=Math.min(a,b);}
  var ok=plus?x+y:x-y;
  return Q(r,"Calculer "+M(fm(x)+(plus?" + ":" - ")+fm(y)),ok,
    [[ok*10,"unit"],[ok/10,"unit"],[ok+0.1,"calc"],[ok-0.1,"calc"]],{d:2},
    "On aligne les virgules : "+M(fm(x)+(plus?" + ":" - ")+fm(y)+" = "+fm(ok))+".");
});
reg("mult10",["3pm","cap"],C_CALC,"Multiplier et diviser par 10, 100, 0,1…",["puissances de 10","virgule","décalage"],1,function(r){
  var ops=[["\\times 10",10],["\\times 100",100],["\\times 0{,}1",0.1],["\\times 0{,}01",0.01],["\\div 10",0.1],["\\div 100",0.01],["\\times 1\\,000",1000]];
  var o=pick(r,ops),x=pick(r,[rnd(r,12,99)/10,rnd(r,3,95),rnd(r,101,999)/100]),ok=x*o[1];
  return Q(r,"Calculer "+M(fm(x,3)+" "+o[0]),ok,
    [[ok*10,"unit"],[ok/10,"unit"],[x/o[1],"conf"],[ok*100,"unit"]],{d:4,far:3},
    "On décale la virgule : "+M(fm(x,3)+" "+o[0]+" = "+fm(ok,4))+".");
});
reg("frac_de",["3pm","cap","2nde"],C_CALC,"Prendre une fraction d’une quantité",["fraction","3/4 de","quantité"],2,function(r){
  var den=pick(r,[2,3,4,5,10]),n=den===2?1:rnd(r,1,den-1),v=den*rnd(r,3,12),ok=n*v/den;
  return Q(r,"Calculer "+M("\\dfrac{"+n+"}{"+den+"}")+" de "+f(v),ok,
    [[v*den/n,"inv"],[v/den,"demi"],[v-ok,"compl"],[v-den,"conf"],[v/n,"inv"],[ok*2,"calc"],[v*n,"conf"]],{d:2,pos:true},
    "On divise par "+den+" puis on multiplie par "+n+" : "+M(fm(v)+" \\div "+den+" \\times "+n+" = "+fm(ok))+".");
});
reg("prio",["3pm","cap","2nde"],C_CALC,"Priorités de calcul",["priorités","parenthèses","ordre des opérations"],2,function(r){
  var t=rnd(r,0,2),a,b,c,ok,e,wr,ex;
  if(t===0){a=rnd(r,2,15);b=rnd(r,2,9);c=rnd(r,2,9);ok=a+b*c;e=a+" + "+b+" \\times "+c;wr=[[(a+b)*c,"ordre"],[a*b+c,"calc"],[a+b+c,"ordre"]];ex="La multiplication passe avant l’addition : "+M(b+" \\times "+c+" = "+b*c)+", puis "+M(a+" + "+b*c+" = "+ok)+".";}
  else if(t===1){a=rnd(r,2,15);b=rnd(r,2,9);c=rnd(r,2,9);ok=(a+b)*c;e="("+a+" + "+b+") \\times "+c;wr=[[a+b*c,"ordre"],[a*c+b,"calc"],[a+b+c,"ordre"]];ex="On calcule d’abord la parenthèse : "+(a+b)+", puis "+M("\\times "+c)+" : "+ok+".";}
  else{c=pick(r,[2,3,4,5]);b=c*rnd(r,2,9);a=rnd(r,20,60);ok=a-b/c;e=a+" - "+b+" \\div "+c;wr=[[(a-b)/c,"ordre"],[a-b*c,"ordre"],[ok+1,"calc"]];ex="La division passe avant la soustraction : "+M(b+" \\div "+c+" = "+b/c)+", puis "+M(a+" - "+b/c+" = "+ok)+".";}
  return Q(r,"Calculer "+M(e),ok,wr,{d:2},ex);
});
reg("puissances",["cap","2nde"],C_CALC,"Puissances et notation scientifique",["puissance","10^n","notation scientifique","exposant"],2,function(r){
  var t=rnd(r,0,2);
  if(t===0){
    var m=pick(r,[1.5,2.4,3.2,4.7,5,6.25,8,12]),e=pick(r,[2,3,4,-1,-2,-3]),ok=m*Math.pow(10,e);
    return Q(r,"Écrire "+M(fm(m)+" \\times 10^{"+e+"}")+" en écriture décimale",ok,
      [[ok*10,"unit"],[ok/10,"unit"],[m*Math.pow(10,-e),"signe"],[m*e,"formule"],[m+e,"addp"]],{d:5,far:3},
      "On décale la virgule de "+Math.abs(e)+" rang"+(Math.abs(e)>1?"s":"")+" vers "+(e>0?"la droite":"la gauche")+" : "+M(fm(ok,5))+".");
  }
  if(t===1){
    var a=rnd(r,2,5),b=rnd(r,3,6),P=function(v){return M(v);};
    return Q(r,"Simplifier "+M("10^{"+a+"} \\times 10^{"+b+"}"),P("10^{"+(a+b)+"}"),
      [[P("10^{"+(a*b)+"}"),"formule"],[P("100^{"+(a+b)+"}"),"conf"],[P("10^{"+Math.abs(b-a)+"}"),"conf"]],{},
      "Produit de puissances de même base : on additionne les exposants, "+M(a+" + "+b+" = "+(a+b))+".");
  }
  var base=pick(r,[2,3,5,10]),n=rnd(r,2,4),ok2=Math.pow(base,n);
  return Q(r,"Calculer "+M(base+"^{"+n+"}"),ok2,[[base*n,"formule"],[Math.pow(n,base),"inv"],[Math.pow(base,n-1),"calc"],[Math.pow(base,n+1),"calc"],[base+n,"addp"]],{d:0},
    M(base+"^{"+n+"} = "+Array(n).fill(base).join(" \\times ")+" = "+ok2)+".");
});
reg("carres_racines",["cap","2nde"],C_CALC,"Carrés et racines carrées",["carré","racine carrée","√"],2,function(r){
  var t=rnd(r,0,2),n;
  if(t===0){n=rnd(r,11,20);return Q(r,"Calculer "+M(n+"^2"),n*n,[[2*n,"demi"],[n*n+n,"calc"],[n*n-n,"calc"],[n*n+10,"calc"]],{d:0},M(n+"^2 = "+n+" \\times "+n+" = "+n*n)+".");}
  if(t===1){n=rnd(r,6,15);return Q(r,"Calculer "+M("\\sqrt{"+n*n+"}"),n,[[n*n/2,"demi"],[n+1,"calc"],[n-1,"calc"],[n*n/4,"demi"]],{d:2},M("\\sqrt{"+n*n+"} = "+n)+" car "+M(n+"^2 = "+n*n)+".");}
  n=rnd(r,3,9);return Q(r,"Calculer "+M("(-"+n+")^2"),n*n,[[-n*n,"signe"],[-2*n,"signe"],[2*n,"demi"]],{d:0},"Un carré est toujours positif : "+M("(-"+n+")^2 = (-"+n+") \\times (-"+n+") = "+n*n)+".");
});
reg("relatifs",["cap","2nde"],C_CALC,"Calculs avec des nombres relatifs",["relatifs","signes","négatifs"],2,function(r){
  var t=rnd(r,0,3),a,b,ok,e,wr,ex;
  if(t===0){a=rnd(r,-15,-2);b=rnd(r,3,15);ok=a+b;e="("+fm(a)+") + "+b;wr=[[Math.abs(a)+b,"signe"],[a-b,"signe"],[-(a+b),"signe"],[b,"calc"]];ex="On cherche la différence des distances à zéro : "+M(e+" = "+fm(ok))+".";}
  else if(t===1){a=rnd(r,-10,10);b=rnd(r,2,9);ok=a+b;e=fm(a)+" - ("+fm(-b)+")";wr=[[a-b,"signe"],[-(a+b),"signe"],[b-a,"signe"]];ex="Soustraire un négatif revient à ajouter : "+M(fm(a)+" + "+b+" = "+fm(ok))+".";}
  else if(t===2){a=rnd(r,2,9);b=rnd(r,2,9);ok=a*b;e="(-"+a+") \\times (-"+b+")";wr=[[-a*b,"signe"],[a+b,"addp"],[-(a+b),"signe"]];ex="Deux négatifs : produit positif, "+M(a+" \\times "+b+" = "+ok)+".";}
  else{b=rnd(r,2,6);a=b*rnd(r,2,9);ok=-a/b;e="(-"+a+") \\div "+b;wr=[[a/b,"signe"],[-a*b,"inv"],[-(a-b),"calc"]];ex="Un négatif divisé par un positif est négatif : "+M(e+" = "+fm(ok))+".";}
  return Q(r,"Calculer "+M(e),ok,wr,{d:2},ex);
});
reg("arrondi",["3pm","cap"],C_CALC,"Arrondir un nombre",["arrondi","troncature","dixième","centième"],1,function(r){
  var x=rnd(r,1000,99999)/10000,p=rnd(r,0,2),noms=["à l’unité","au dixième","au centième"];
  var ok=rd(x,p),tr=Math.floor(x*Math.pow(10,p))/Math.pow(10,p);
  if(tr===ok)tr=rd(ok-Math.pow(10,-p),p);
  return Q(r,"Arrondir "+f(x,4)+" "+noms[p],ok,[[tr,"arr"],[rd(x,p+1),"arr"],[rd(ok+Math.pow(10,-p),p),"arr"],[rd(x,p+2),"arr"],[p===0?ok+1:rd(x,p-1),"arr"]],{d:4},
    "On regarde le chiffre suivant : "+f(x,4)+" arrondi "+noms[p]+" donne "+f(ok,p)+".");
});

/* ═════════ PROPORTIONNALITÉ ET POURCENTAGES ═════════ */
reg("regle3",["3pm","cap","2nde"],C_PROP,"Proportionnalité : règle de trois, produit en croix",["proportionnalité","règle de trois","produit en croix","tableau"],2,function(r,c){
  var m=cm(r,c),s=PROP[m],a=pick(r,s.A),k=pick(r,s.K),b=a*k,a2=pick(r,s.A2);if(a2===a)a2=a+10;
  var ok=a2*k,t=s.t.replace("{a}",a).replace("{b}",f(b)).replace("{a2}",a2);
  return Q(r,t,ok,[[b*a/a2,"inv"],[b+a2-a,"addp"],[ok/2,"calc"],[b*a2,"conf"],[ok*10,"unit"]],{u:s.u,d:2},
    "Pour 1 : "+M(fm(b)+" \\div "+a+" = "+fm(k))+" "+s.u+". Pour "+a2+" : "+M(fm(k)+" \\times "+a2+" = "+fm(ok))+" "+s.u+".");
});
reg("pct_de",["3pm","cap","2nde"],C_PROP,"Calculer un pourcentage d’une quantité",["pourcentage","p % de","part"],2,function(r,c){
  var m=cm(r,c),s=PCTC[m],v=pick(r,s.V),p=pick(r,[5,10,15,20,25,30,40,60,75]),ok=v*p/100;
  return Q(r,s.t(v)+" Combien représentent "+p+" % ?",ok,
    [[v-ok,"compl"],[v*(1+p/100),"addp"],[v/p,"conf"],[v*p,"pct0"],[v*100/p,"inv"],[ok*2,"calc"]],{u:s.u,d:2},
    M(p+"\\,\\% \\text{ de } "+fm(v)+" = "+fm(v)+" \\times \\dfrac{"+p+"}{100} = "+fm(ok))+" "+s.u+".");
});
reg("pct_mental",["3pm","cap"],C_PROP,"Pourcentages simples de tête (10 %, 25 %, 50 %…)",["pourcentage","mental","automatisme","moitié","quart"],1,function(r){
  var p=pick(r,[10,20,25,50,75]),v=pick(r,[40,60,80,120,160,200,240,360,400,520]),ok=v*p/100;
  return Q(r,"Calculer "+p+" % de "+f(v),ok,[[v/p,"conf"],[v-ok,"compl"],[ok/10,"unit"],[v*p,"pct0"],[v*100/p,"inv"],[v/10,"conf"]],{d:2},
    p+" % de "+f(v)+" = "+f(ok)+(p===50?" (la moitié)":p===25?" (le quart)":p===10?" (on divise par 10)":"")+".");
});
reg("coef_evol",["cap","2nde"],C_PROP,"Augmenter ou diminuer de p % (coefficient multiplicateur)",["coefficient multiplicateur","hausse","baisse","remise","évolution"],2,function(r,c){
  var m=cm(r,c),s=PCTC[m],v=pick(r,s.V),p=pick(r,[5,10,15,20,25,30]),up=r()<0.5,form=rnd(r,0,2),ok,wr,ex,t;
  if(form===0){
    ok=up?v*(1+p/100):v*(1-p/100);
    t=s.t(v)+" Cette valeur "+(up?"augmente":"diminue")+" de "+p+" %. Quelle est la nouvelle valeur ?";
    wr=[[up?v+p:v-p,"addp"],[v*p/100,"conf"],[up?v*(1-p/100):v*(1+p/100),"signe"],[ok*10,"unit"]];
    ex="Coefficient multiplicateur "+f(up?1+p/100:1-p/100)+" : "+M(fm(v)+" \\times "+fm(up?1+p/100:1-p/100)+" = "+fm(ok))+" "+s.u+".";
    return Q(r,t,ok,wr,{u:s.u,d:2},ex);
  }
  if(form===1){
    ok=up?1+p/100:1-p/100;
    t="Quel coefficient multiplicateur correspond à "+(up?"une hausse":"une baisse")+" de "+p+" % ?";
    wr=[[p/100,"conf"],[up?1-p/100:1+p/100,"signe"],[up?1+p:1-p,"pct0"],[p,"pct0"]];
    return Q(r,t,ok,wr,{d:2},M((up?"1 + ":"1 - ")+fm(p/100)+" = "+fm(ok))+".");
  }
  var cf=pick(r,[0.6,0.7,0.75,0.8,0.85,0.9,1.05,1.1,1.2,1.25,1.5]),pc=rd((cf-1)*100,2),
      okT=(pc>0?"hausse de ":"baisse de ")+f(Math.abs(pc))+" %";
  return Q(r,"Un coefficient multiplicateur de "+f(cf)+" correspond à…",okT,
    [[(pc>0?"baisse de ":"hausse de ")+f(Math.abs(pc))+" %","signe"],[(pc>0?"hausse de ":"baisse de ")+f(cf*100)+" %","pct0"],[(pc>0?"hausse de ":"baisse de ")+f(Math.abs(rd(cf*10,2)))+" %","pct0"]],{},
    M(fm(cf)+" = 1 "+(pc>0?"+ ":"- ")+fm(Math.abs(pc)/100))+" : "+okT+".");
});
reg("ttc_ht",["cap","2nde"],C_PROP,"Prix HT, TVA et prix TTC",["TVA","HT","TTC","taxe","commerce"],2,function(r){
  var t=pick(r,[20,20,10,5.5]),ht=pick(r,[50,80,100,150,200,250,400]),ttc=ht*(1+t/100),rev=r()<0.5;
  if(!rev)return Q(r,"Un produit coûte "+f(ht)+" € HT. La TVA est de "+f(t)+" %. Quel est le prix TTC ?",ttc,
    [[ht+t,"addp"],[ht*t/100,"conf"],[ht/(1+t/100),"inv"],[ht*(1-t/100),"signe"]],{u:"€",d:2},
    "TTC = HT "+M("\\times "+fm(1+t/100))+" : "+M(fm(ht)+" \\times "+fm(1+t/100)+" = "+fm(ttc))+" €.");
  return Q(r,"Un produit coûte "+f(ttc)+" € TTC (TVA "+f(t)+" %). Quel est son prix HT ?",ht,
    [[ttc*(1-t/100),"conf"],[ttc-t,"addp"],[ttc*(1+t/100),"inv"],[ttc*t/100,"conf"]],{u:"€",d:2},
    "HT = TTC "+M("\\div "+fm(1+t/100))+" : "+M(fm(ttc)+" \\div "+fm(1+t/100)+" = "+fm(ht))+" €. Retirer "+f(t)+" % du TTC ne marche pas : le % porte sur le HT.");
});
reg("echelle",["3pm","cap"],C_PROP,"Échelle d’un plan",["échelle","plan","maquette","longueur réelle"],2,function(r){
  var E=pick(r,[20,25,50,100,200]),L=rnd(r,2,12),ok=L*E/100;
  return Q(r,"Sur un plan à l’échelle "+M("\\frac{1}{"+E+"}")+", une longueur mesure "+L+" cm. Quelle est la longueur réelle en mètres ?",ok,
    [[ok*10,"unit"],[ok/10,"unit"],[L*E,"unit"],[L/E,"inv"]],{u:"m",d:2,far:3},
    M(L+" \\times "+E+" = "+fm(L*E))+" cm, soit "+f(ok)+" m.");
});
reg("vitesse",["3pm","cap"],C_PROP,"Vitesse, distance et durée",["vitesse","distance","durée","km/h"],2,function(r){
  var v=pick(r,[30,45,60,90,120]),t=pick(r,[10,15,20,30,40,45]),ok=v*t/60;
  return Q(r,"Un véhicule roule à "+v+" km/h pendant "+t+" min. Quelle distance parcourt-il ?",ok,
    [[v*t/100,"base"],[v*t,"base"],[t/v*60,"inv"],[ok*2,"calc"],[ok/2,"calc"]],{u:"km",d:2},
    t+" min = "+M("\\frac{"+t+"}{60}")+" h, donc "+M("d = "+v+" \\times \\frac{"+t+"}{60} = "+fm(ok))+" km.");
});

/* ═════════ GRANDEURS, MESURES ET VOLUMES ═════════ */
function uL(u){return u.replace("²","^2").replace("³","^3");}
reg("conv",["3pm","cap","2nde"],C_GRAN,"Conversions d’unités",["conversion","unités","kg","litre","mètre"],1,function(r,c){
  var m=cm(r,c),cv=pick(r,CONV[m]),v=pick(r,cv.V),ok=v*cv.k;
  return Q(r,"Convertir "+f(v)+" "+cv.f+(cv.o||"")+" en "+cv.t,ok,
    [[ok*10,"unit"],[ok/10,"unit"],[ok*100,"unit"],[ok/100,"unit"]],{u:cv.t,d:5,far:4},
    "1 "+cv.f+" = "+f(cv.k,5)+" "+cv.t+", donc "+f(v)+" "+cv.f+" = "+f(ok,5)+" "+cv.t+".");
});
reg("perim_aire",["3pm","cap"],C_GRAN,"Périmètre et aire d’un rectangle",["périmètre","aire","rectangle"],1,function(r){
  var L=rnd(r,5,20),l=rnd(r,2,L-1),aire=r()<0.5;
  return aire?Q(r,"Un rectangle mesure "+L+" cm sur "+l+" cm. Quelle est son aire ?",L*l,[[2*(L+l),"conf"],[L+l,"conf"],[L*l*2,"demi"],[L*l/2,"demi"]],{u:"cm²",d:0},M("\\mathcal{A} = L \\times \\ell = "+L+" \\times "+l+" = "+L*l)+" cm².")
       :Q(r,"Un rectangle mesure "+L+" cm sur "+l+" cm. Quel est son périmètre ?",2*(L+l),[[L*l,"conf"],[L+l,"demi"],[4*L,"conf"],[2*L+l,"demi"]],{u:"cm",d:0},M("\\mathcal{P} = 2 \\times (L + \\ell) = 2 \\times ("+L+" + "+l+") = "+2*(L+l))+" cm.");
});
reg("aire_disque",["cap","2nde"],C_GRAN,"Aire d’un disque",["disque","cercle","π","aire"],2,function(r){
  var t=rnd(r,0,3);
  if(t===1){var R1=pick(r,[1.5,2.5,3,3.5,4,5,6,7,9,11]),ok1=3.14*R1*R1;
    return Q(r,"Quelle est l’aire d’un disque de rayon "+f(R1)+" m ? ("+M("\\pi \\approx 3{,}14")+")",ok1,[[3.14*2*R1,"formule"],[3.14*R1*2,"demi"],[3.14*(2*R1)*(2*R1),"demi"],[3.14*R1,"formule"]],{u:"m²",d:2},M("\\mathcal{A} = \\pi r^2 = 3{,}14 \\times "+fm(R1)+"^2 = "+fm(ok1))+" m².");}
  if(t===2){var R2=pick(r,[2,3,4,5,10]),A2=3.14*R2*R2;
    return Q(r,"Un disque a une aire de "+f(A2)+" cm² ("+M("\\pi \\approx 3{,}14")+"). Quel est son rayon ?",R2,[[A2/3.14,"demi"],[A2/(2*3.14),"formule"],[2*R2,"conf"],[R2*R2,"demi"]],{u:"cm",d:2},M("r^2 = "+fm(A2)+" \\div 3{,}14 = "+R2*R2)+", donc "+M("r = \\sqrt{"+R2*R2+"} = "+R2)+" cm.");}
  if(t===3){var D3=rnd(r,7,29),ok3=3.14*D3*D3/4;
    return QE(r,"Estime l’aire d’un disque de diamètre "+D3+" cm.",ok3,{u:"cm²",fig:{k:"disc",d:D3+" cm"}},"Rayon "+f(D3/2)+" cm ; "+M("\\pi r^2 \\approx 3 \\times "+fm(D3/2)+"^2 \\approx "+fm(3*D3*D3/4,0))+" ; exact : "+f(ok3)+" cm².");}
  var d=pick(r,[4,6,8,10,12,14,20,16,18,30,24]),R=d/2,ok=3.14*R*R;
  return Q(r,"Quelle est l’aire d’un disque de diamètre "+d+" cm ? ("+M("\\pi \\approx 3{,}14")+")",ok,
    [[3.14*d*d,"demi"],[3.14*d,"formule"],[3.14*R,"formule"],[2*3.14*R*R,"demi"]],{u:"cm²",d:2},
    "Rayon "+R+" cm. "+M("\\mathcal{A} = \\pi r^2 = 3{,}14 \\times "+R+"^2 = "+fm(ok))+" cm².");
});
reg("volume_pave",["cap","2nde"],C_GRAN,"Volume d’un pavé et capacité en litres",["volume","pavé","litre","dm³","capacité"],2,function(r,c){
  var m=cm(r,c),L=rnd(r,3,8),l=rnd(r,2,6),h=rnd(r,2,5),ok=L*l*h;
  var nom=BAC[m].charAt(0).toUpperCase()+BAC[m].slice(1);
  return Q(r,nom+" mesure "+L+" dm × "+l+" dm × "+h+" dm. Quelle est sa capacité en litres ?",ok,
    [[L*l,"formule"],[ok/10,"unit"],[ok*10,"unit"],[2*(L*l+l*h+L*h),"conf"]],{u:"L",d:0},
    M("V = "+L+" \\times "+l+" \\times "+h+" = "+ok)+" dm³, et 1 dm³ = 1 L, donc "+ok+" L.");
});
reg("volume_cyl",["2nde","term"],C_GRAN,"Volume d’un cylindre",["cylindre","volume","π","boîte"],2,function(r){
  var R=pick(r,[2,3,4,5,1.5,6,2.5,10]),h=pick(r,[5,10,12,20,8,15,30,4]),ok=3.14*R*R*h;
  return Q(r,"Un cylindre a un rayon de "+f(R)+" cm et une hauteur de "+h+" cm. Quel est son volume ? ("+M("\\pi \\approx 3{,}14")+")",ok,
    [[3.14*R*h,"demi"],[3.14*(2*R)*(2*R)*h,"conf"],[ok/3,"demi"],[2*3.14*R*h,"formule"]],{u:"cm³",d:2},
    M("V = \\pi r^2 h = 3{,}14 \\times "+fm(R)+"^2 \\times "+h+" = "+fm(ok))+" cm³.");
});
reg("durees",["3pm","cap"],C_GRAN,"Additionner des durées (heures et minutes)",["durée","heures","minutes","base 60"],2,function(r){
  var h1=rnd(r,1,4),h2=rnd(r,1,4),m1=rnd(r,25,55),m2=rnd(r,60-m1+1,59),tot=h1*60+m1+h2*60+m2,H=Math.floor(tot/60),M2=tot%60;
  var T=function(h,m){return h+" h "+m+" min";};
  return Q(r,"Calculer "+T(h1,m1)+" + "+T(h2,m2),T(H,M2),
    [[T(h1+h2,m1+m2),"base"],[T(H+1,M2),"calc"],[T(H,(M2+30)%60),"calc"]],{},
    m1+" + "+m2+" = "+(m1+m2)+" min = 1 h "+M2+" min, donc le total est "+T(H,M2)+".");
});

/* ═════════ GÉOMÉTRIE ET TRIGONOMÉTRIE ═════════ */
var NOMS2=[["B","A","C"],["E","D","F"],["S","R","T"],["N","M","P"],["J","I","K"]];
var TRIP=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25],[12,16,20],[20,21,29],[9,40,41],[15,20,25],[1.5,2,2.5],[4.5,6,7.5],[10,24,26],[12,35,37],[0.6,0.8,1],[2.4,3.2,4],[15,36,39],[18,24,30],[30,40,50],[21,28,35]];
reg("pyth_hyp",["3pm","cap","2nde"],C_GEO,"Pythagore : calculer l’hypoténuse",["pythagore","hypoténuse","triangle rectangle"],2,function(r){
  var t=pick(r,TRIP),a=t[0],b=t[1],c=t[2];
  return Q(r,"Un triangle est rectangle ; les côtés de l’angle droit mesurent "+a+" cm et "+b+" cm. Combien mesure l’hypoténuse ?",c,
    [[a+b,"formule"],[a*a+b*b,"formule"],[b-a,"conf"],[c+1,"calc"]],{u:"cm",d:0},
    M("c^2 = "+a+"^2 + "+b+"^2 = "+(a*a+b*b))+", donc "+M("c = \\sqrt{"+(a*a+b*b)+"} = "+c)+" cm.");
});
reg("pyth_cote",["cap","2nde"],C_GEO,"Pythagore : calculer un côté de l’angle droit",["pythagore","côté","triangle rectangle"],3,function(r){
  var t=pick(r,TRIP),c=t[2],a=t[0],b=t[1];
  return Q(r,"Un triangle est rectangle ; l’hypoténuse mesure "+c+" cm et un côté de l’angle droit mesure "+a+" cm. Combien mesure l’autre côté ?",b,
    [[Math.sqrt(c*c+a*a),"signe"],[c-a,"formule"],[c*c-a*a,"formule"],[c+a,"formule"]],{u:"cm",d:2},
    M("b^2 = "+c+"^2 - "+a+"^2 = "+(c*c-a*a))+", donc "+M("b = \\sqrt{"+(c*c-a*a)+"} = "+b)+" cm. On soustrait : l’hypoténuse est le plus grand côté.");
});
reg("aire_triangle",["3pm","cap"],C_GEO,"Aire d’un triangle",["triangle","aire","base","hauteur"],1,function(r){
  var b=rnd(r,4,20),h=2*rnd(r,2,9),ok=b*h/2;
  return Q(r,"Quelle est l’aire d’un triangle de base "+b+" cm et de hauteur "+h+" cm ?",ok,
    [[b*h,"demi"],[b+h,"conf"],[b*h/4,"demi"],[b*h/3,"formule"],[2*(b+h),"conf"]],{u:"cm²",d:2},
    M("\\mathcal{A} = \\dfrac{b \\times h}{2} = \\dfrac{"+b+" \\times "+h+"}{2} = "+fm(ok))+" cm².");
});
reg("trigo_choix",["2nde"],C_GEO,"Trigonométrie : choisir la bonne relation",["sinus","cosinus","tangente","SOH CAH TOA","triangle rectangle"],2,function(r){
  var cas=pick(r,[
    {k:"l’hypoténuse",w:"le côté adjacent",ok:"cos"},{k:"l’hypoténuse",w:"le côté opposé",ok:"sin"},{k:"le côté adjacent",w:"le côté opposé",ok:"tan"}]);
  var S={cos:M("\\cos\\alpha = \\dfrac{\\text{adj.}}{\\text{hyp.}}"),sin:M("\\sin\\alpha = \\dfrac{\\text{opp.}}{\\text{hyp.}}"),tan:M("\\tan\\alpha = \\dfrac{\\text{opp.}}{\\text{adj.}}")};
  var others=["cos","sin","tan"].filter(function(x){return x!==cas.ok;});
  var nm=pick(r,NOMS2),ctx=pick(r,["","Pour une rampe, ","Pour une échelle contre un mur, ","Pour un toit, "]);
  if(r()<0.5)return Q(r,ctx+"le triangle "+nm.join("")+" est rectangle en "+nm[0]+". On connaît l’angle "+M("\\widehat{"+nm[2]+"}")+" et "+cas.k+". On cherche "+cas.w+". Quelle relation utiliser ?",S[cas.ok],
    [[S[others[0]],"conf"],[S[others[1]],"conf"],[M("a^2 + b^2 = c^2"),"formule"]],{fig:{k:"tri",ang:"α",n:nm}},"On repère les côtés par rapport à l’angle : "+S[cas.ok]+".");
  return Q(r,ctx+"triangle rectangle : on connaît l’angle "+M("\\alpha")+" et "+cas.k+". On cherche "+cas.w+". Quelle relation utiliser ?",S[cas.ok],
    [[S[others[0]],"conf"],[S[others[1]],"conf"],[M("a^2 + b^2 = c^2"),"formule"]],{},
    "On repère les côtés par rapport à "+M("\\alpha")+" : "+S[cas.ok]+".");
});
reg("trigo_calc",["2nde"],C_GEO,"Trigonométrie : calculer une longueur",["sinus","cosinus","tangente","longueur","angle"],3,function(r){
  var hyp=pick(r,[8,10,12,16,20,5,7,9,14,18,22,25,3.6,4.2]),opp=r()<0.5,ok=hyp*0.5;
  return Q(r,"Triangle rectangle : hypoténuse "+hyp+" cm, angle de "+(opp?"30°":"60°")+". Longueur du côté "+(opp?"opposé":"adjacent")+" à cet angle ? ("+M("\\sin 30^\\circ = \\cos 60^\\circ = 0{,}5")+")",ok,
    [[hyp*0.87,"conf"],[hyp/0.5,"inv"],[hyp-0.5,"addp"],[hyp*0.5+1,"calc"]],{u:"cm",d:2},
    M(opp?"\\sin 30^\\circ = \\dfrac{\\text{opp.}}{\\text{hyp.}}":"\\cos 60^\\circ = \\dfrac{\\text{adj.}}{\\text{hyp.}}")+", donc "+M(hyp+" \\times 0{,}5 = "+fm(ok))+" cm.");
});

/* ═════════ STATISTIQUES ═════════ */
function serie(r,c,n){
  var m=cm(r,c),s=STATC[m],v=[],i,sum=0;
  for(i=0;i<n;i++){v.push(rnd(r,s.lo,s.hi));}
  for(i=0;i<n;i++)sum+=v[i];
  var adj=((sum%n)+n)%n;v[n-1]=v[n-1]-adj;
  if(v[n-1]<s.lo-5)v[n-1]+=n;
  return {v:v,n:s.n};
}
reg("moyenne",["3pm","cap","2nde"],C_STAT,"Calculer une moyenne",["moyenne","série statistique","indicateur"],1,function(r,c){
  var n=pick(r,[4,5]),sr=serie(r,c,n),v=sr.v,sum=v.reduce(function(a,b){return a+b;},0),ok=sum/n,s=v.slice().sort(function(a,b){return a-b;});
  return Q(r,"Relevé de "+sr.n+" : "+v.join(" ; ")+". Quelle est la moyenne ?",ok,
    [[s[Math.floor(n/2)],"conf"],[sum/(n-1),"calc"],[sum/(n+1),"calc"],[(s[0]+s[n-1])/2,"conf"],[sum,"formule"],[s[n-1]-s[0],"conf"]],{d:2},
    "Somme "+sum+", effectif "+n+" : "+M("\\bar{x} = \\dfrac{"+sum+"}{"+n+"} = "+fm(ok))+".");
});
reg("mediane",["cap","2nde"],C_STAT,"Calculer une médiane",["médiane","série","ordre croissant"],2,function(r,c){
  var n=pick(r,[5,7]),sr=serie(r,c,n),v=sr.v,s=v.slice().sort(function(a,b){return a-b;}),ok=s[(n-1)/2],mean=v.reduce(function(a,b){return a+b;},0)/n;
  return Q(r,"Relevé de "+sr.n+" : "+v.join(" ; ")+". Quelle est la médiane ?",ok,
    [[v[(n-1)/2],"ordre"],[(n+1)/2,"conf"],[mean,"conf"],[(s[0]+s[n-1])/2,"conf"],[s[(n-1)/2+1],"calc"],[s[(n-1)/2-1],"calc"]],{d:2},
    "On range par ordre croissant : "+s.join(" ; ")+". La valeur du milieu est "+ok+".");
});
reg("etendue",["cap","2nde"],C_STAT,"Calculer une étendue",["étendue","dispersion","max","min"],1,function(r,c){
  var n=pick(r,[5,6]),sr=serie(r,c,n),v=sr.v,mx=Math.max.apply(null,v),mn=Math.min.apply(null,v),ok=mx-mn;
  if(ok===0)return null;
  return Q(r,"Relevé de "+sr.n+" : "+v.join(" ; ")+". Quelle est l’étendue ?",ok,
    [[mx,"conf"],[mx+mn,"signe"],[ok/2,"demi"],[mn,"conf"]],{d:2},
    "Étendue = plus grande valeur − plus petite = "+M(mx+" - "+mn+" = "+ok)+".");
});
reg("freq_pct",["3pm","cap","2nde"],C_STAT,"Fréquence et pourcentage",["fréquence","effectif","pourcentage","proportion"],2,function(r){
  var N=pick(r,[20,25,40,50,80]),k=pick(r,[3,7,9,12,14,16,18]),ok=k/N*100;
  if(k>=N)return null;
  return Q(r,"Sur "+N+" pièces contrôlées, "+k+" sont défectueuses. Quel pourcentage cela représente-t-il ?",ok,
    [[(N-k)/N*100,"compl"],[k,"conf"],[k/(N-k)*100,"formule"],[k/N,"pct0"],[N/k*100,"inv"]],{u:"%",d:2},
    "Fréquence "+M("\\dfrac{"+k+"}{"+N+"} = "+fm(k/N,3))+", soit "+f(ok)+" %.");
});

/* ═════════ ÉQUATIONS ET CALCUL LITTÉRAL ═════════ */
reg("eq1",["cap","2nde"],C_EQ,"Résoudre une équation du 1er degré",["équation","inconnue","x","1er degré"],2,function(r){
  var t=rnd(r,0,2),x=rnd(r,2,15),a,b,c,q,wr,ex;
  if(t===0){a=rnd(r,3,25);c=x+a;q="x + "+a+" = "+c;wr=[[c+a,"signe"],[a-c,"signe"],[c/a,"formule"],[c-a+1,"calc"]];ex="On retire "+a+" aux deux membres : "+M("x = "+c+" - "+a+" = "+x)+".";}
  else if(t===1){a=rnd(r,2,9);c=a*x;q=a+"x = "+c;wr=[[c-a,"formule"],[c*a,"inv"],[a/c,"inv"],[x+1,"calc"]];ex="On divise par "+a+" : "+M("x = \\dfrac{"+c+"}{"+a+"} = "+x)+".";}
  else{a=rnd(r,2,9);b=rnd(r,1,15);c=a*x+b;q=a+"x + "+b+" = "+c;wr=[[(c+b)/a,"signe"],[c/a-b,"ordre"],[c-b,"demi"],[(c-b)*a,"inv"]];ex="On retire "+b+" : "+M(a+"x = "+(c-b))+", puis on divise par "+a+" : "+M("x = "+x)+".";}
  return Q(r,"Résoudre "+M(q),x,wr,{d:2},ex);
});
reg("eval_expr",["cap","2nde"],C_EQ,"Calculer la valeur d’une expression",["expression littérale","remplacer x","valeur"],2,function(r){
  var sq=r()<0.4;
  if(!sq){var a=rnd(r,2,9),b=rnd(r,-9,12),x=rnd(r,-4,6),ok=a*x+b;
    return Q(r,"Calculer "+M(linL(a,b))+" pour "+M("x = "+fm(x)),ok,[[a*(x+b),"ordre"],[a+x+b,"addp"],[a*x-b,"signe"],[-a*x+b,"signe"],[a*x,"calc"],[Number(String(a)+String(Math.abs(x)))*(x<0?-1:1)+b,"conf"]],{d:0},
      "On remplace x : "+M(a+" \\times "+par(x)+(b<0?" - ":" + ")+Math.abs(b)+" = "+fm(ok))+".");}
  var a2=rnd(r,2,5),x2=rnd(r,-4,5),b2=rnd(r,1,9),ok2=a2*x2*x2+b2;
  return Q(r,"Calculer "+M(a2+"x^2 + "+b2)+" pour "+M("x = "+fm(x2)),ok2,[[(a2*x2)*(a2*x2)+b2,"ordre"],[-a2*x2*x2+b2,"signe"],[a2*2*x2+b2,"demi"],[a2*x2+b2,"demi"],[a2*x2*x2-b2,"signe"],[a2*x2*x2,"calc"]],{d:0},
    "Le carré passe avant la multiplication : "+M(a2+" \\times "+par(x2)+"^2 + "+b2+" = "+a2+" \\times "+x2*x2+" + "+b2+" = "+fm(ok2))+".");
});
reg("formules",["cap","2nde"],C_EQ,"Utiliser une formule (loi d’Ohm, vitesse…)",["formule","isoler","U=RI","d=vt"],2,function(r){
  var t=rnd(r,0,2),a=rnd(r,2,12),b=rnd(r,2,10),p=a*b;
  if(t===0)return Q(r,M("U = R \\times I")+". Calculer "+M("I")+" pour "+M("U = "+p)+" V et "+M("R = "+a)+" Ω.",b,[[p*a,"inv"],[p+a,"addp"],[p-a,"addp"]],{far:2,u:"A",d:2},M("I = \\dfrac{U}{R} = \\dfrac{"+p+"}{"+a+"} = "+b)+" A.");
  if(t===1)return Q(r,M("d = v \\times t")+". Calculer "+M("t")+" pour "+M("d = "+p)+" km et "+M("v = "+a)+" km/h.",b,[[p*a,"inv"],[p+a,"addp"],[p-a,"addp"]],{far:2,u:"h",d:2},M("t = \\dfrac{d}{v} = \\dfrac{"+p+"}{"+a+"} = "+b)+" h.");
  return Q(r,M("P = U \\times I")+". Calculer "+M("U")+" pour "+M("P = "+p)+" W et "+M("I = "+a)+" A.",b,[[p*a,"inv"],[p+a,"addp"],[p-a,"addp"]],{far:2,u:"V",d:2},M("U = \\dfrac{P}{I} = \\dfrac{"+p+"}{"+a+"} = "+b)+" V.");
});
/* calcul littéral : réponses en x (saisie libre avec la touche x) */
reg("lit_reduire",["3pm","cap","2nde"],C_EQ,"Réduire une expression littérale",["réduire","termes semblables","calcul littéral"],1,function(r){
  var a=rnd(r,2,9),b=rnd(r,1,9),c=rnd(r,1,8)*(r()<0.3?-1:1),dd=rnd(r,1,9)*(r()<0.4?-1:1),A=a+c,B=b+dd;
  if(A===0||B===0)return null;
  var E=M(a+"x + "+b+(c<0?" - ":" + ")+(Math.abs(c)===1?"":Math.abs(c))+"x"+(dd<0?" - ":" + ")+Math.abs(dd)),L=function(p,q){return M(linL(p,q));};
  return Q(r,"Réduire "+E,L(A,B),[[L(A+B,0),"conf"],[L(a*c,b+dd),"addp"],[L(A,b-dd),"signe"],[M(fm(A+B)),"conf"]],{lit:linE(A,B),form:"red"},
    "On regroupe les x d’un côté et les nombres de l’autre : "+M(linL(A,B))+".");
});
reg("lit_dev",["cap","2nde"],C_EQ,"Développer (simple distributivité)",["développer","distributivité","calcul littéral"],2,function(r){
  var k=pick(r,[2,3,4,5,6,-2,-3]),a=rnd(r,1,9)*(r()<0.35?-1:1),L=function(p,q){return M(linL(p,q));};
  return Q(r,"Développer "+M(fm(k)+"(x "+(a<0?"- ":"+ ")+Math.abs(a)+")"),L(k,k*a),[[L(k,a),"demi"],[L(1,k*a),"demi"],[L(k,k+a),"addp"],[L(k,-k*a),"signe"]],{lit:linE(k,k*a),form:"dev"},
    "On multiplie chaque terme par "+fm(k)+" : "+M(fm(k)+" \\times x "+(k*a<0?"- ":"+ ")+Math.abs(k*a)+" = "+linL(k,k*a))+".");
});
reg("lit_fact",["2nde"],C_EQ,"Factoriser (facteur commun)",["factoriser","facteur commun","calcul littéral"],2,function(r){
  var k=pick(r,[2,3,4,5,6,7]),a=rnd(r,1,9)*(r()<0.3?-1:1),P=function(p,q){return M(p+"(x "+(q<0?"- ":"+ ")+Math.abs(q)+")");};
  return Q(r,"Factoriser "+M(linL(k,k*a)),P(k,a),[[P(k,k*a),"demi"],[M(k+"x("+(k*a)+")"),"conf"],[P(k,-a),"signe"],[P(k*a,k),"inv"]],{lit:k+"*(x+("+a+"))",form:"fact"},
    "Le facteur commun est "+k+" : "+M(linL(k,k*a)+" = "+k+" \\times x "+(k*a<0?"- ":"+ ")+k+" \\times "+Math.abs(a)+" = "+k+"(x "+(a<0?"- ":"+ ")+Math.abs(a)+")")+".");
});

/* ═════════ FONCTIONS AFFINES ET LINÉAIRES ═════════ */
reg("image_affine",["2nde"],C_FONC,"Image d’un nombre par une fonction affine",["fonction affine","image","f(x)"],2,function(r){
  var a=rnd(r,-5,6),b=rnd(r,-8,10),x=rnd(r,-3,7);if(a===0)a=3;
  var ok=a*x+b;
  return Q(r,M("f(x) = "+linL(a,b))+". Calculer "+M("f("+fm(x)+")")+".",ok,[[a*(x+b),"ordre"],[a+x+b,"addp"],[a*x-b,"signe"],[-a*x+b,"signe"],[a*x,"calc"],[(x-b)/a,"inv"]],{d:0},
    M("f("+fm(x)+") = "+fm(a)+" \\times "+par(x)+(b<0?" - ":" + ")+Math.abs(b)+" = "+fm(ok))+".");
});
reg("antecedent_affine",["2nde"],C_FONC,"Antécédent par une fonction affine",["antécédent","fonction affine","équation"],3,function(r){
  var a=pick(r,[2,3,4,5,-2,-3]),b=rnd(r,-8,12),x=rnd(r,-4,8),c=a*x+b;
  return Q(r,M("f(x) = "+linL(a,b))+". Quel est l’antécédent de "+M(fm(c))+" ?",x,[[a*c+b,"conf"],[(c+b)/a,"signe"],[c-b,"demi"],[c/a-b,"ordre"],[-x,"signe"],[(c-b)*a,"inv"]],{d:2},
    "On résout "+M(linL(a,b)+" = "+fm(c))+" : "+M(fm(a)+"x = "+fm(c-b))+", donc "+M("x = "+fm(x))+".");
});
reg("coeff_dir",["2nde"],C_FONC,"Coefficient directeur d’une droite",["coefficient directeur","pente","deux points","droite"],3,function(r){
  var a=pick(r,[-3,-2,-1,2,3,4,0.5]),x1=rnd(r,-3,3),dx=pick(r,[2,4]),x2=x1+dx,y1=rnd(r,-5,8),y2=y1+a*dx;
  return Q(r,"Une droite passe par "+M("A("+fm(x1)+"\\,;\\,"+fm(y1)+")")+" et "+M("B("+fm(x2)+"\\,;\\,"+fm(y2)+")")+". Quel est son coefficient directeur ?",a,
    [[dx/(y2-y1),"inv"],[(y1-y2)/dx,"signe"],[y2-y1,"demi"],[(y2+y1)/(x2+x1===0?1:x2+x1),"addp"],[y1-a*x1,"conf"]],{d:2},
    M("a = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{"+fm(y2)+" - "+par(y1)+"}{"+fm(x2)+" - "+par(x1)+"} = "+fm(a))+".");
});
reg("sens_variation",["2nde"],C_FONC,"Sens de variation d’une fonction affine",["croissante","décroissante","coefficient directeur"],1,function(r){
  var a=pick(r,[-5,-3,-2,2,3,4,5,6]),b=rnd(r,-9,9),inc=a>0;
  return Q(r,"La fonction "+M("f(x) = "+linL(a,b))+" est…",inc?"croissante":"décroissante",
    [[inc?"décroissante":"croissante","signe"],[b>0?"toujours positive":"toujours négative","conf"],["constante","conf"]],{},
    "Le coefficient directeur est "+M(fm(a)+(inc?" > 0":" < 0"))+" : la fonction est "+(inc?"croissante":"décroissante")+".");
});
