/* ═══════════════════════════════════════════════════════════════
   BANQUE v3.4 — 1/3 : nouveaux « angles » pour les notions qui n’avaient
   qu’une ou deux formes d’énoncé (audit du 7 octobre 2026).
   addAngles(id, [g1, g2…]) : la notion tire désormais au hasard entre
   sa forme d’origine et les nouvelles formes (calcul inverse, contexte,
   tuiles, estimation, étape fausse, lecture de figure…).
═══════════════════════════════════════════════════════════════ */
function addAngles(id,gens){
  var it=null;for(var i=0;i<BANK.length;i++)if(BANK[i].id===id)it=BANK[i];
  if(!it)return;
  var base=it.gen,all=[base].concat(gens);
  it.gen=function(r,c){return all[Math.floor(r()*all.length)](r,c);};
  it.nvar=(it.nvar||0)+gens.length*4;
}
function hm(h,m){return h+" h "+(m<10?"0":"")+m+" min";}

/* ─── Calcul ─── */
addAngles("add_dec",[
  function(r){var a=rnd(r,11,89)/10,t=pick(r,[10,20,50]);if(a>=t)return null;var ok=rd(t-a,2);
    return Q(r,"Compléter : "+M(fm(a)+" + \\ldots = "+t),ok,[[rd(ok+1,2),"calc"],[rd(Math.floor(t-a)+(1-(a%1)),2),"calc"],[rd(t-a-1,2),"calc"],[ok*10,"unit"]],{d:2,pos:true},
      "Complément : "+M(t+" - "+fm(a)+" = "+fm(ok))+". Vérification : "+M(fm(a)+" + "+fm(ok)+" = "+t)+".");},
  function(r){var p=rnd(r,105,1890)/100,g=pick(r,[20,50]);if(p>=g)p=rd(p/3,2);var ok=rd(g-p,2);
    return Q(r,"Un achat coûte "+f(p)+" €. On paie avec un billet de "+g+" €. Combien rend-on ?",ok,[[rd(ok+1,2),"calc"],[rd(g+p,2),"addp"],[rd(ok-0.1,2),"calc"],[rd(ok+0.1,2),"calc"]],{u:"€",d:2,pos:true},
      M(g+" - "+fm(p)+" = "+fm(ok))+" €. Astuce : on complète d’abord jusqu’à l’euro supérieur, puis jusqu’à "+g+" €.");},
  function(r){var ps=[],us={};while(ps.length<4){var a=rnd(r,11,99)/10,b=rnd(r,11,99)/100,s=rd(a+b,2);if(us[s])continue;us[s]=1;ps.push([M(fm(a)+" + "+fm(b)),f(s)]);}
    return QA(r,"Associe chaque somme à son résultat.",ps,"On aligne les virgules : dixièmes avec dixièmes, centièmes avec centièmes.");},
  function(r){var a=rnd(r,11,49)+5/10,b=rnd(r,1,9)+rnd(r,11,99)/100,A=Math.round(a*10),Bb=Math.round(b*100);
    return QX(r,"Hugo calcule "+M(fm(a)+" + "+fm(b))+" ainsi :",["Il aligne les deux nombres à droite.",M(A+" + "+Bb+" = "+(A+Bb)),"Résultat : "+M(fm((A+Bb)/100))],0,
      "Il faut aligner les VIRGULES (compléter avec un zéro) : "+M(fm(a)+" = "+fm(a,2).replace(",","{,}")+"0")+", puis "+M(fm(a)+" + "+fm(b)+" = "+fm(rd(a+b,2)))+".");}
]);
addAngles("mult10",[
  function(r){var x=pick(r,[4.5,0.37,12.8,2.06,0.9]),k=pick(r,[10,100,1000]),y=rd(x*k,4);
    return Q(r,"Par quel nombre faut-il multiplier "+f(x,3)+" pour obtenir "+f(y,3)+" ?",k,[[k/10,"unit"],[k*10,"unit"],[rd(y-x,3),"addp"],[1/k,"inv"]],{d:4,far:3},
      "La virgule se décale de "+String(k).length+" rang"+(k>10?"s":"")+" vers la droite : on multiplie par "+f(k)+".");},
  function(r){var x=pick(r,[3.7,45,0.6,128,2.5]),ops=[["\\times 10",10],["\\times 100",100],["\\div 10",0.1],["\\div 100",0.01],["\\times 0{,}1",0.1]],ps=[],us={};
    shuffle(r,ops).forEach(function(o){var v=rd(x*o[1],4);if(ps.length<4&&!us[v]){us[v]=1;ps.push([M(fm(x)+" "+o[0]),f(v,4)]);}});
    if(ps.length<3)return null;
    return QA(r,"Associe chaque calcul à son résultat.",ps,"Multiplier par 0,1, c’est diviser par 10.");}
]);
addAngles("frac_de",[
  function(r){var den=pick(r,[3,4,5]),n=rnd(r,1,den-1),T=den*rnd(r,4,15),part=T*n/den;
    return Q(r,"Les "+frM(n,den)+" d’une somme valent "+f(part)+" €. Quelle est cette somme ?",T,[[part*n/den,"inv"],[part*den,"demi"],[part/n,"demi"],[part+part/den,"calc"]],{u:"€",d:2,pos:true},
      "On cherche d’abord 1 part : "+M(fm(part)+" \\div "+n+" = "+fm(part/n))+" €, puis les "+den+" parts : "+M(fm(part/n)+" \\times "+den+" = "+fm(T))+" €.");},
  function(r){var T=pick(r,[20,24,30,40,60]),k=pick(r,[2,3,4,5,6]);if(T%k)return null;var p=T/k,F=function(a,b){return frM(a,b);};
    return Q(r,"Quelle fraction de "+T+" représente "+p+" ?",F(1,k),[[F(1,p),"inv"],[F(k,1),"inv"],[F(1,T-p),"compl"],[F(p,T-p),"conf"]].filter(function(w){return w[0]!==F(1,k);}),{},
      M(frL(p,T)+" = "+frL(1,k))+" : "+p+" représente "+F(1,k)+" de "+T+".");},
  function(r){var ps=[],us={};[[1,2],[1,3],[1,4],[3,4],[2,3],[1,5],[2,5],[1,10]].forEach(function(fr){var v=fr[1]*rnd(r,2,8);});
    var L=shuffle(r,[[1,2],[1,3],[1,4],[3,4],[2,3],[1,5],[2,5],[1,10]]);
    for(var i=0;i<L.length&&ps.length<4;i++){var fr=L[i],v=fr[1]*rnd(r,2,9),res=v*fr[0]/fr[1];if(us[res])continue;us[res]=1;ps.push([frM(fr[0],fr[1])+" de "+v,String(res)]);}
    return QA(r,"Associe chaque calcul à son résultat.",ps,"On divise par le dénominateur, puis on multiplie par le numérateur.");}
]);
addAngles("prio",[
  function(r){var a=rnd(r,2,9),b=rnd(r,2,5),c=rnd(r,3,9),d=rnd(r,1,c-1);
    return Q(r,"Dans "+M(a+" + "+b+" \\times ("+c+" - "+d+")^2")+", quel calcul fait-on en premier ?",M(c+" - "+d),[[M(a+" + "+b),"ordre"],[M(b+" \\times "+c),"ordre"],[M(d+"^2"),"ordre"]],{},
      "Ordre : parenthèses, puis puissances, puis × et ÷, puis + et −. On commence par "+M(c+" - "+d)+".");},
  function(r){var ps=[],us={},T=[function(a,b,c){return [a+" + "+b+" \\times "+c,a+b*c];},function(a,b,c){return "("+a+" + "+b+") \\times "+c,0;},function(a,b,c){return [a+" \\times "+b+" - "+c,a*b-c];},function(a,b,c){return ["("+a+" - "+b+") \\times "+c,(a-b)*c];},function(a,b,c){return [a*c+" \\div "+c+" + "+b,a+b];}];
    T[1]=function(a,b,c){return ["("+a+" + "+b+") \\times "+c,(a+b)*c];};
    shuffle(r,T).forEach(function(t){if(ps.length>=4)return;var a=rnd(r,4,9),b=rnd(r,2,4),c=rnd(r,2,5),e=t(a,b,c);if(us[e[1]])return;us[e[1]]=1;ps.push([M(e[0]),String(e[1])]);});
    return QA(r,"Associe chaque calcul à son résultat (attention aux priorités).",ps,"Parenthèses d’abord, puis multiplications et divisions, puis additions et soustractions.");}
]);
addAngles("puissances",[
  function(r){var a=rnd(r,2,6),b=rnd(r,2,6),base=pick(r,[2,3,10]);
    return Q(r,"Compléter : "+M(base+"^{"+a+"} \\times "+base+"^{"+b+"} = "+base+"^{\\ldots}"),a+b,[[a*b,"formule"],[Math.abs(a-b)||a+b+1,"conf"],[a+b+1,"calc"]],{d:0},
      "Même base : on additionne les exposants, "+M(a+" + "+b+" = "+(a+b))+".");},
  function(r){var a=rnd(r,2,4),b=rnd(r,2,3);
    return Q(r,"Compléter : "+M("(10^{"+a+"})^{"+b+"} = 10^{\\ldots}"),a*b,[[a+b,"formule"],[Math.pow(a,b),"conf"],[a*b+1,"calc"]],{d:0},
      "Puissance d’une puissance : on multiplie les exposants, "+M(a+" \\times "+b+" = "+(a*b))+".");},
  function(r){var e=pick(r,[-1,-2,-3]),ok=Math.pow(10,e);
    return Q(r,"Que vaut "+M("10^{"+e+"}")+" ?",ok,[[-Math.pow(10,-e),"signe"],[10*e,"formule"],[ok/10,"unit"]],{d:4,far:3},M("10^{"+e+"} = \\dfrac{1}{10^{"+(-e)+"}} = "+fm(ok,4))+" : un exposant négatif ne rend pas le nombre négatif.");}
]);
addAngles("carres_racines",[
  function(r){var c=rnd(r,3,12),A=c*c;
    return Q(r,"Un carré a une aire de "+A+" cm². Combien mesure son côté ?",c,[[A/2,"demi"],[A/4,"conf"],[A,"conf"],[c+1,"calc"]],{u:"cm",d:2},M("c = \\sqrt{"+A+"} = "+c)+" cm car "+M(c+"^2 = "+A)+".");},
  function(r){var N=pick(r,[20,50,80,120,150,200,300]),s=Math.sqrt(N);
    return QE(r,"Estime "+M("\\sqrt{"+N+"}")+" avec le curseur.",s,{min:0,max:Math.ceil((s+5)/5)*5,tol:0.4},M("\\sqrt{"+N+"} \\approx "+fm(s,2))+". Repère : "+M(Math.floor(s)+"^2 = "+Math.floor(s)*Math.floor(s))+" et "+M(Math.ceil(s)+"^2 = "+Math.ceil(s)*Math.ceil(s))+".");}
]);
addAngles("arrondi",[
  function(r){var x=rnd(r,1001,9999)/1000,lo=Math.floor(x*10)/10;
    return Q(r,"Encadrer "+f(x,3)+" au dixième près.",M(fm(lo)+" < "+fm(x,3)+" < "+fm(rd(lo+0.1,1))),[[M(fm(rd(lo-0.1,1))+" < "+fm(x,3)+" < "+fm(lo)),"arr"],[M(fm(Math.floor(x))+" < "+fm(x,3)+" < "+fm(Math.floor(x)+1)),"arr"],[M(fm(rd(lo+0.1,1))+" < "+fm(x,3)+" < "+fm(rd(lo+0.2,1))),"arr"]],{},
      "Les dixièmes qui entourent "+f(x,3)+" sont "+f(lo)+" et "+f(rd(lo+0.1,1))+".");},
  function(r){var n=pick(r,[[2,3],[1,3],[5,6],[1,7],[4,7],[5,9]]),v=n[0]/n[1],p=pick(r,[1,2]);
    return Q(r,"La calculatrice affiche "+f(v,7)+" pour "+frM(n[0],n[1])+". Arrondir "+(p===1?"au dixième":"au centième")+".",rd(v,p),[[Math.floor(v*Math.pow(10,p))/Math.pow(10,p),"arr"],[rd(v,p+1),"arr"],[rd(v,p)+Math.pow(10,-p),"arr"]].filter(function(w){return w[0]!==rd(v,p);}),{d:4},
      "On regarde le chiffre suivant : "+(Math.floor(v*Math.pow(10,p+1))%10>=5?"5 ou plus, on arrondit au-dessus":"moins de 5, on garde")+" : "+f(rd(v,p),p)+".");},
  function(r){var p=rnd(r,1001,9999)/1000*10;
    return Q(r,"Un article coûte "+f(p,3)+" € après calcul. Quel prix affiche-t-on (au centime) ?",rd(p,2),[[Math.floor(p*100)/100===rd(p,2)?rd(p,2)+0.01:Math.floor(p*100)/100,"arr"],[rd(p,1),"arr"],[Math.round(p),"arr"]],{u:"€",d:2},"Au centime = au centième : "+f(rd(p,2),2)+" €.");}
]);
addAngles("axe_gradue",[
  function(r){var a=rnd(r,1,9)+rnd(r,1,8)/10,b=rd(a+0.1,1),ok=rd(a+0.05,2);
    return Q(r,"Quel nombre est compris entre "+f(a)+" et "+f(b)+" ?",ok,[[rd(a+0.5,2),"conf"],[rd(Math.floor(a)+0.05,2),"conf"],[rd(a-0.05,2),"calc"],[rd(b+0.05,2),"calc"]],{d:2},
      "Entre "+f(a)+" = "+f(a,2).replace(/(,\d)$/,"$10")+" et "+f(b)+" = "+f(b,2).replace(/(,\d)$/,"$10")+", il y a par exemple "+f(ok)+". Il y a toujours un nombre entre deux décimaux !");}
]);
addAngles("mult_dec",[
  function(r){var p=pick(r,[1.8,2.4,3.2,4.5,6.5]),m=pick(r,[1.5,2.5,0.5,3]),ok=rd(p*m,2);
    return Q(r,"Le kilo de pommes coûte "+f(p)+" €. Combien coûtent "+f(m)+" kg ?",ok,[[rd(p+m,2),"addp"],[rd(p*m*10,2),"unit"],[rd(p/m,2),"inv"],[rd(ok+0.5,2),"calc"]],{u:"€",d:2},M(fm(p)+" \\times "+fm(m)+" = "+fm(ok))+" €.");},
  function(r){var x=pick(r,[12,45,8,250]),k=pick(r,[0.5,0.25,0.1,0.2]),ok=x*k;
    var q=VF(r,"Multiplier "+x+" par "+f(k)+" donne un résultat plus grand que "+x+".",false,M(x+" \\times "+fm(k)+" = "+fm(ok))+" : multiplier par un nombre plus petit que 1 rend le résultat plus PETIT (pour un nombre positif).");return q;},
  function(r){var a=pick(r,[4,8,12,20,36]),k=pick(r,[0.25,0.5,0.75]),ok=a*k;
    return Q(r,"Calculer "+M(a+" \\times "+fm(k)),ok,[[a+k,"addp"],[a/k,"inv"],[ok*10,"unit"],[a*k*100,"unit"]],{d:2},M(fm(k)+" = "+(k===0.5?frL(1,2):k===0.25?frL(1,4):frL(3,4)))+" : "+M(a+" \\times "+fm(k)+" = "+fm(ok))+".");}
]);
addAngles("frac_comp",[
  function(r){var p=pick(r,[[2,3],[3,4],[1,6],[5,8],[3,5],[4,9]]),k=rnd(r,2,5),D=p[1]*k;
    return Q(r,"Compléter : "+M(frL(p[0],p[1])+" = "+frL("\\ldots",D)),p[0]*k,[[p[0]+(D-p[1]),"addp"],[D-p[0],"conf"],[p[0]*k+1,"calc"]],{d:0},
      "On a multiplié le dénominateur par "+k+" : on multiplie aussi le numérateur, "+M(p[0]+" \\times "+k+" = "+p[0]*k)+".");},
  function(r){var p=pick(r,[[3,4],[2,3],[4,5],[5,6],[3,8],[2,7]]),k=pick(r,[2,3,4,6]),n=p[0]*k,d=p[1]*k,h=k%2===0?2:3,F=function(a,b){return frM(a,b);};
    var mid=n/h===Math.round(n/h)&&d/h===Math.round(d/h)&&h!==k?F(n/h,d/h):F(n,d);
    return Q(r,"Écrire "+F(n,d)+" sous forme irréductible.",F(p[0],p[1]),[[mid===F(p[0],p[1])?F(p[1],p[0]):mid,"demi"],[F(n-1,d-1),"addp"],[F(p[1],p[0]),"inv"]],{},
      "On divise le numérateur et le dénominateur par "+k+" (leur plus grand diviseur commun) : "+F(p[0],p[1])+".");}
]);

/* ─── Proportionnalité, pourcentages ─── */
addAngles("pct_mental",[
  function(r){var T=pick(r,[20,40,60,80,200]),p=pick(r,[10,25,50,75,20]),k=T*p/100;
    return Q(r,"Combien de pour cent représente "+f(k)+" sur "+T+" ?",p,[[k,"conf"],[T/k,"inv"],[100-p,"compl"],[p/10,"unit"]],{u:"%",d:2},M(frL(k,T)+" = "+fm(k/T))+" = "+p+" %.");},
  function(r){var v=pick(r,[40,60,80,120,200]),p=pick(r,[10,20,25,50]),ok=v*(1-p/100);
    return Q(r,"Un article à "+v+" € est soldé à −"+p+" %. Quel prix paie-t-on ?",ok,[[v*p/100,"compl"],[v-p,"addp"],[v*(1+p/100),"signe"],[v/p,"conf"]],{u:"€",d:2},
      "Remise : "+p+" % de "+v+" = "+f(v*p/100)+" €. Prix payé : "+M(v+" - "+fm(v*p/100)+" = "+fm(ok))+" €.");},
  function(r){var ps=[],us={};shuffle(r,[[10,50],[25,80],[50,46],[75,40],[20,35],[10,250],[25,36],[50,90]]).forEach(function(x){var v=x[0]*x[1]/100;if(ps.length<4&&!us[v]){us[v]=1;ps.push([x[0]+" % de "+x[1],f(v)]);}});
    return QA(r,"Associe chaque pourcentage à sa valeur.",ps,"10 % : ÷ 10 ; 25 % : ÷ 4 ; 50 % : ÷ 2 ; 75 % : les trois quarts.");}
]);
addAngles("echelle",[
  function(r){var E=pick(r,[20,50,100,200]),R=pick(r,[2,3,4,5,6]),ok=R*100/E;
    return Q(r,"Plan à l’échelle "+M(frL(1,E))+". Un mur réel mesure "+R+" m. Combien mesure-t-il sur le plan ?",ok,[[R*E,"inv"],[ok*10,"unit"],[ok/10,"unit"],[R/E,"unit"]],{u:"cm",d:2,far:2},
      R+" m = "+R*100+" cm, puis "+M(R*100+" \\div "+E+" = "+fm(ok))+" cm.");},
  function(r){var p=pick(r,[1,2,4,5]),reel=pick(r,[1,2,5]),E=reel*100/p,F=function(e){return M(frL(1,e));};
    return Q(r,"Sur un plan, "+p+" cm représentent "+reel+" m dans la réalité. Quelle est l’échelle ?",F(E),[[F(reel*100*p),"inv"],[F(E/10),"unit"],[F(E*10),"unit"]],{},reel+" m = "+reel*100+" cm. "+M(frL(p,reel*100)+" = "+frL(1,E))+".");}
]);
addAngles("vitesse",[
  function(r){var v=pick(r,[40,60,80,90,120]),t=pick(r,[1.5,2.5,0.75,1.25,2.25]),d=v*t,h=Math.floor(t),m=Math.round((t-h)*60);
    return Q(r,"Combien de temps faut-il pour parcourir "+f(d)+" km à "+v+" km/h ?",hm(h,m),[[hm(h,Math.round((t-h)*100)),"base"],[hm(Math.floor(v/d),Math.round((v/d%1)*60)),"inv"],[hm(h+1,m),"calc"]].filter(function(w){return w[0]!==hm(h,m);}),{},
      "Durée = distance ÷ vitesse : "+M(fm(d)+" \\div "+v+" = "+fm(t))+" h, soit "+hm(h,m)+".");},
  function(r){var d=pick(r,[15,20,30,45,60]),m=pick(r,[10,15,20,30,40]),ok=d/(m/60);
    return Q(r,"Un scooter parcourt "+d+" km en "+m+" min. Quelle est sa vitesse moyenne ?",ok,[[d/m,"base"],[d*m/60,"inv"],[d/(m/100),"base"],[ok/2,"calc"]],{u:"km/h",d:2},
      m+" min = "+M(frL(m,60))+" h. "+M("v = "+d+" \\div "+fm(rd(m/60,4))+" = "+fm(ok))+" km/h.");},
  function(r){var v=rnd(r,61,98),t=pick(r,[[2,15],[1,45],[3,20],[2,40]]),T=t[0]+t[1]/60,ok=v*T;
    return QE(r,"Un camion roule "+hm(t[0],t[1])+" à "+v+" km/h. Estime la distance parcourue.",ok,{u:"km"},"Environ "+M(Math.round(v/10)*10+" \\times "+fm(rd(T,2))+" \\approx "+Math.round(Math.round(v/10)*10*T))+" km. Exact : "+f(ok,1)+" km.");}
]);
addAngles("ttc_ht",[
  function(r){var ht=pick(r,[50,80,120,150,240,300]),t=pick(r,[20,10,5.5]),ok=ht*t/100;
    return Q(r,"Un produit coûte "+f(ht)+" € HT. Quel est le montant de la TVA à "+f(t)+" % ?",ok,[[ht*(1+t/100),"conf"],[ht*t,"pct0"],[ht+t,"addp"],[ht/(1+t/100)*t/100,"inv"]],{u:"€",d:2},M(fm(ht)+" \\times "+fm(t/100)+" = "+fm(ok))+" € de TVA.");},
  function(r){var ht=pick(r,[40,60,80,100,150]),ttc=ht*1.2,ok=ttc-ht;
    return Q(r,"Un article coûte "+f(ttc)+" € TTC (TVA 20 %). Quel est le montant de la TVA ?",ok,[[rd(ttc*0.2,2),"conf"],[ht,"conf"],[rd(ttc*1.2-ttc,2),"conf"]],{u:"€",d:2},
      "HT = "+M(fm(ttc)+" \\div 1{,}2 = "+fm(ht))+" €, donc TVA = "+M(fm(ttc)+" - "+fm(ht)+" = "+fm(ok))+" €. Piège : 20 % du TTC ("+f(ttc*0.2)+" €) est FAUX, la TVA se calcule sur le HT.");}
]);
addAngles("pct_estim",[
  function(r){var p=pick(r,[19,21,24,26,9,11,49,51]),v=rnd(r,38,92)*10+rnd(r,1,9),P=Math.round(p/5)*5,V=Math.round(v/100)*100,ok=V*P/100;
    return Q(r,M(p+"\\,\\%")+" de "+f(v)+" € vaut environ…",ok,[[ok*10,"unit"],[ok/10,"unit"],[v-ok,"compl"],[ok*2,"calc"]],{u:"€",d:0,far:2},"On arrondit : "+P+" % de "+f(V)+" = "+f(ok)+" €. Valeur exacte : "+f(v*p/100)+" €.");}
]);
addAngles("prop_graph",[
  function(r){var a=pick(r,[1,2,0.5]),b=rnd(r,1,3),ok=pick(r,["D1","D2","D3"]),cv={},nm=["D1","D2","D3"];
    var lines=[[[0,b],[6,b+6*a]],[[0,0],[6,6*a]],[[0,0],[1,0.3],[2,1],[3,2.1],[4,3.6],[5,5.5]]];var sh=shuffle(r,[0,1,2]),curves=[],names=[];
    sh.forEach(function(k,i){curves.push(lines[k]);var last=lines[k][lines[k].length-1];names.push([Math.min(5.6,last[0]),Math.min(5.6*Math.max(1,a)+b,last[1])+0.5,nm[i],i===0?0:i]);});
    var good=nm[sh.indexOf(1)];
    return Q(r,"Quelle courbe représente une situation de proportionnalité ?",good,nm.filter(function(x){return x!==good;}).map(function(x){return [x,"conf"];}),{fig:{k:"graph",xr:[0,6],yr:[0,Math.ceil(6*Math.max(a,1)+b+1)],sy:Math.max(1,Math.round(a*2)),curves:curves,names:names}},
      "Proportionnalité : une DROITE qui passe par l’ORIGINE. C’est "+good+".");}
]);
