/* ═══════════════════════════════════════════════════════════════
   BANQUE v3.4 — 3/3 : derniers angles + NOUVELLES NOTIONS manquantes
   au regard des programmes (BO 2019-2021 de la voie professionnelle
   et cycle 4 pour la 3ᵉ Prépa-Métiers) :
   fluctuation, quartiles, intérêts simples, ensembles et logique,
   inéquations, marges commerciales, solides et sections, diviseurs,
   transformations, réunion d’événements, résolution graphique,
   second degré, coûts, cercle trigonométrique, fonctions sinusoïdales,
   degré 3, exponentielles et logarithme décimal, emprunts.
═══════════════════════════════════════════════════════════════ */
var C_COM="Calculs commerciaux et financiers",C_LOG="Vocabulaire ensembliste et logique",C_TRI="Trigonométrie (cercle, sinus, cosinus)";
function itv(a,b,oa,ob){return M((oa?"]":"[")+(a===-Infinity?"-\\infty":fm(a))+"\\,;\\,"+(b===Infinity?"+\\infty":fm(b))+(ob?"[":"]"));}
function gr(d){return Math.round(d);}

/* ═════════ Derniers angles ═════════ */
addAngles("pct_estim",[
  function(r){var p=pick(r,[10,25,50,75,20]),N=rnd(r,15,40)*10,k=Math.round(N*p/100)+pick(r,[-2,-1,1,2]),ok=p;
    return Q(r,k+" élèves sur "+N+" pratiquent un sport. Cela représente environ…",ok+" %",[[(p===50?25:50)+" %","grand"],[(p===10?20:10)+" %","grand"],[f(k/10,0)+" %","pct0"]].filter(function(w){return w[0]!==ok+" %";}),{},
      M(fm(k)+" \\div "+N+" \\approx "+fm(rd(k/N,3),3))+" : environ "+p+" %. Repère : 10 % = un dixième, 25 % = un quart, 50 % = la moitié.");},
  function(r){var N=rnd(r,120,480),k=rnd(r,Math.round(N*0.12),Math.round(N*0.7)),ok=k/N*100;
    return QE(r,"Estime le pourcentage que représente "+k+" sur "+N+".",ok,{u:"%",min:0,max:100,tol:3},M(k+" \\div "+N+" \\approx "+fm(rd(k/N,3),3))+", soit environ "+f(ok,1)+" %.");}
]);
addAngles("echelle",[
  function(r){var all=[["1 cm pour 1 m",M(frL(1,100))],["1 cm pour 50 m",M(frL(1,"5\\,000"))],["2 cm pour 1 m",M(frL(1,50))],["1 cm pour 1 km",M(frL(1,"100\\,000"))],["1 cm pour 10 cm",M(frL(1,10))],["5 cm pour 1 cm",M(frL(5,1))]];
    return QA(r,"Associe chaque correspondance à l’échelle du plan.",pickN(r,all,4),"Échelle = longueur sur le plan ÷ longueur réelle, dans la MÊME unité : 1 cm pour 1 m = 1 cm pour 100 cm, soit 1/100.");},
  function(r){return VF(r,"Un plan à l’échelle "+M(frL(1,50))+" est plus grand (plus détaillé) que le même plan à l’échelle "+M(frL(1,100))+".",true,"Vrai : au 1/50, 1 m réel mesure 2 cm sur le plan, contre 1 cm au 1/100.");}
]);
addAngles("eq1",[
  function(r){var f0=pick(r,[10,12,15,20]),u=pick(r,[2,3,4,5]),n=rnd(r,5,15),T=f0+u*n;
    return Q(r,"Un abonnement coûte "+f0+" € plus "+u+" € par séance. Léna a payé "+T+" €. Combien de séances a-t-elle faites ?",n,[[T/u,"formule"],[(T+f0)/u,"signe"],[T-f0,"demi"],[n+1,"calc"]],{d:2,pos:true},
      "On résout "+M(f0+" + "+u+"x = "+T)+" : "+M(u+"x = "+(T-f0))+", donc "+M("x = "+n)+".");},
  function(r){var a=rnd(r,2,6),x=rnd(r,1,8),b=rnd(r,1,12),c=a*x+b,ok=r()<0.5,t=ok?x:x+pick(r,[1,-1,2]);
    return oui(r,M("x = "+t)+" est-il solution de l’équation "+M(a+"x + "+b+" = "+c)+" ?",ok,"On remplace : "+M(a+" \\times "+t+" + "+b+" = "+(a*t+b))+(ok?" = "+c+" : oui.":" ≠ "+c+" : non (la solution est "+x+")."));},
  function(r){var ps=[],us={},t=0;while(ps.length<4&&t++<40){var a=rnd(r,2,6),x=rnd(r,-4,9),b=rnd(r,-9,9);if(us[x]||!b)continue;us[x]=1;ps.push([M(linL(a,b)+" = "+(a*x+b)),M("x = "+x)]);}
    return QA(r,"Associe chaque équation à sa solution.",ps,"On isole x : on retire (ou ajoute) le terme constant, puis on divise par le coefficient de x.");}
]);
addAngles("formules",[
  function(r){var all=[["vitesse","km/h"],["puissance","W"],["énergie","kWh"],["intensité","A"],["tension","V"],["résistance","Ω"],["masse volumique","kg/m³"],["débit","L/min"]];
    return QA(r,"Associe chaque grandeur à une unité qui lui correspond.",pickN(r,all,4),"Les unités aident à vérifier une formule : km/h = km ÷ h, kWh = kW × h…");},
  function(r){var c=pick(r,[["v = \\dfrac{d}{t}","t","t = v \\times d","t = \\dfrac{d}{v}"],["U = R \\times I","I","I = U \\times R","I = \\dfrac{U}{R}"],["P = U \\times I","U","U = P \\times I","U = \\dfrac{P}{I}"]]);
    return QX(r,"Alex isole "+c[1]+" dans la formule "+M(c[0])+" :",["On veut "+c[1]+" seul d’un côté.",M(c[2]),"On remplace par les valeurs."],1,"L’étape ② est fausse : "+M(c[3])+". On vérifie avec des nombres simples.");}
]);
addAngles("antecedent_affine",[
  function(r){var u=pick(r,[2,3,4,5]),b=pick(r,[3,5,8,10]),x=rnd(r,4,15),y=u*x+b;
    return Q(r,"Le prix (en €) de x articles est "+M("p(x) = "+u+"x + "+b)+" (frais de port compris). On a payé "+y+" €. Combien d’articles ?",x,[[u*y+b,"inv"],[rd((y+b)/u,2),"signe"],[rd(y/u,2),"demi"]],{d:2},
      "On cherche l’antécédent de "+y+" : "+M(u+"x + "+b+" = "+y)+", "+M("x = \\dfrac{"+y+" - "+b+"}{"+u+"} = "+x)+".");},
  function(r){var a=pick(r,[2,3,-2,-3]),b=rnd(r,-6,8),y=rnd(r,-5,10),num=y-b;if(num%a!==0)return null;var x=num/a;
    return QX(r,"Antécédent de "+y+" par "+M("f(x) = "+linL(a,b))+" :",[M(linL(a,b)+" = "+y),M(a+"x = "+y+" + "+par(b)+" = "+(y+b)),M("x = "+fm(rd((y+b)/a,2)))],1,
      "On SOUSTRAIT "+fm(b)+" des deux côtés : "+M(a+"x = "+y+" - "+par(b)+" = "+num)+", donc "+M("x = "+fm(x))+".");}
]);
addAngles("sens_variation",[
  function(r){var a=pick(r,[2,3,-2,-3,0]),b=rnd(r,1,9),xs=[0,1,2,3],ys=xs.map(function(x){return a*x+b;}),ok=a>0?"croissante":a<0?"décroissante":"constante";
    return Q(r,"D’après ce tableau de valeurs, la fonction affine f est…",ok,["croissante","décroissante","constante"].filter(function(x){return x!==ok;}).map(function(x){return [x,"signe"];}),{fig:{k:"tab",rows:[["x"].concat(xs),["f(x)"].concat(ys)],hc:1}},
      "Quand x augmente, f(x) "+(a>0?"augmente":a<0?"diminue":"ne change pas")+" : f est "+ok+" (coefficient "+a+").");},
  function(r){var a=pick(r,[2,3,5]),b=pick(r,[-2,-4,-1]);
    return QA(r,"Associe chaque fonction à son sens de variation.",[[M("f(x) = "+linL(a,pick(r,[1,-3,7]))),"croissante"],[M("g(x) = "+linL(b,pick(r,[4,6,-2]))),"décroissante"],[M("h(x) = "+pick(r,[5,-3,8])),"constante"]],
      "Le signe du coefficient de x décide : positif → croissante, négatif → décroissante, nul → constante.");}
]);
addAngles("indices",[
  function(r){var a=pick(r,[120,125,140,150]),b=pick(r,[150,160,175,180]);if(b<=a)return null;var ok=rd((b/a-1)*100,2);
    return Q(r,"L’indice d’un prix passe de "+a+" à "+b+" (base 100 en 2015). Quelle est l’évolution du prix entre ces deux dates ?",ok,[[b-a,"conf"],[rd((b-a)/100*100,2)===ok?ok+1:rd(b-a,2),"conf"],[rd((a/b-1)*100,2),"inv"]],{F:sgp,nu:"%",d:2},
      "Ce n’est pas la différence des indices ! "+M("\\dfrac{"+b+"}{"+a+"} = "+fm(rd(b/a,4),4))+", soit "+sgp(ok)+".");},
  function(r){var I=pick(r,[112,125,140,95]);
    return QX(r,"L’indice des loyers vaut "+I+" (base 100). Tom conclut :",["L’indice de base vaut 100.","L’indice vaut aujourd’hui "+I+".","Les loyers ont augmenté de "+I+" %."],2,
      "L’évolution est de "+M(I+" - 100 = "+(I-100))+", soit "+sgp(I-100)+" (et non "+I+" %).");}
]);
addAngles("esperance",[
  function(r){var p=pick(r,[0.2,0.25,0.1]),g=pick(r,[5,8,10,20]),m=rd(g*p,2),eq=r()<0.5,mise=eq?m:rd(m+pick(r,[0.5,1]),2),E=rd(g*p-mise,2);
    return oui(r,"On mise "+f(mise)+" € pour gagner "+g+" € avec la probabilité "+f(p)+" (sinon on ne gagne rien). Le jeu est-il équitable ?",eq,
      "Gain moyen : "+M(g+" \\times "+fm(p)+" = "+fm(m))+" €, moins la mise : "+M("E = "+fm(E))+" €. "+(eq?"E = 0 : le jeu est équitable.":"E < 0 : le jeu est défavorable au joueur."));},
  function(r){var E=pick(r,[-0.5,-1.2,0.8,-2]);
    return Q(r,"L’espérance du gain d’un jeu vaut "+f(E)+" €. Que signifie ce résultat ?",(E<0?"en moyenne, on perd ":"en moyenne, on gagne ")+f(Math.abs(E),2)+" € par partie",[[(E<0?"on perd ":"on gagne ")+f(Math.abs(E),2)+" € à chaque partie","conf"],[(E<0?"en moyenne, on gagne ":"en moyenne, on perd ")+f(Math.abs(E),2)+" €","signe"],["on ne peut pas jouer","conf"]],{},
      "L’espérance est une MOYENNE sur un grand nombre de parties : chaque partie peut rapporter plus ou moins.");}
]);
addAngles("estim_calc",[
  function(r){var a=pick(r,[9.8,4.9,19.6,2.4]),b=pick(r,[0.49,0.51,0.24,0.26]),ok=a/b;
    return QE(r,"Estime "+M(fm(a)+" \\div "+fm(b)),ok,{lo:0},"Diviser par un nombre plus petit que 1 AGRANDIT : "+M(fm(a)+" \\div "+fm(b)+" \\approx "+fm(Math.round(a))+" \\div "+fm(Math.round(b*4)/4)+" \\approx "+fm(rd(ok,1)))+".");},
  function(r){var a=pick(r,[0.48,0.52,0.24,0.26,0.098]),b=pick(r,[2019,1987,402,5030]),ok=a*b,A=a<0.1?0.1:a<0.3?0.25:0.5,B=Math.round(b/100)*100,app=A*B,good=r()<0.5,prop=good?app:app*10;
    return VF(r,M(fm(a)+" \\times "+fm(b)+" \\approx "+fm(prop)),good,"On arrondit : "+M(fm(A)+" \\times "+fm(B)+" = "+fm(app))+" (valeur exacte "+f(ok,1)+").");}
]);
addAngles("ranger_dec",[
  function(r){var a=rnd(r,1,8),b=rnd(r,1,9),c=rnd(r,2,9),x=a+b/10,y=a+c/100*11;
    return VF(r,f(a+0.15,2)+" > "+f(a+0.9,1)+" car 15 > 9.",false,"Faux : on compare chiffre par chiffre : "+f(a+0.15,2)+" = "+f(a,0)+",15 et "+f(a+0.9,1)+" = "+f(a,0)+",90. 15 centièmes < 90 centièmes.");},
  function(r){var a=rnd(r,10,40)/10,b=a+rnd(r,15,45)/10,ok=Math.floor(b)-Math.ceil(a)+1;if(a===Math.round(a)||b===Math.round(b))return null;
    return Q(r,"Combien y a-t-il de nombres entiers compris entre "+f(a)+" et "+f(rd(b,1))+" ?",ok,[[ok+1,"calc"],[ok-1,"calc"],[rd(b-a,1),"conf"]],{d:1},
      "Ce sont "+(function(){var o=[];for(var i=Math.ceil(a);i<=Math.floor(b);i++)o.push(i);return o.join(", ");})()+" : "+ok+" entiers.");}
]);
addAngles("sci_ordre",[
  function(r){var a=pick(r,[2,3,4,1.5]),b=pick(r,[2,3,4]),m=rnd(r,2,5),n=rnd(r,2,6),p=a*b,e=m+n,ok=p>=10?f(p/10)+" \\times 10^{"+(e+1)+"}":f(p)+" \\times 10^{"+e+"}";
    var T=function(s){return M(s.replace(/,/g,"{,}"));};
    return Q(r,"Calculer "+M(fm(a)+" \\times 10^{"+m+"} \\times "+b+" \\times 10^{"+n+"}"),T(ok),[[T(f(p)+" \\times 10^{"+(m*n)+"}"),"formule"],[T(f(a+b)+" \\times 10^{"+e+"}"),"addp"],[T(f(p)+" \\times 10^{"+(e+(p>=10?0:1))+"}"),"calc"]].filter(function(w){return w[0]!==T(ok);}),{},
      "On multiplie les nombres ("+f(p)+") et on ADDITIONNE les exposants ("+m+" + "+n+" = "+e+")"+(p>=10?" ; puis "+f(p)+" = "+f(p/10)+" × 10":"")+".");},
  function(r){var c=pick(r,[["La distance Terre–Soleil est d’environ 150 000 000 km.","1{,}5 \\times 10^{8}",["15 \\times 10^{7}","1{,}5 \\times 10^{7}","1{,}5 \\times 10^{9}"]],["Un globule rouge mesure environ 0,000 007 m.","7 \\times 10^{-6}",["7 \\times 10^{6}","7 \\times 10^{-5}","0{,}7 \\times 10^{-5}"]],["La France compte environ 68 000 000 habitants.","6{,}8 \\times 10^{7}",["68 \\times 10^{6}","6{,}8 \\times 10^{6}","6{,}8 \\times 10^{8}"]]]);
    return Q(r,c[0]+" Écriture scientifique ?",M(c[1]),c[2].map(function(w,i){return [M(w),i===0?"form":"unit"];}),{},"Écriture scientifique : un seul chiffre non nul avant la virgule, puis une puissance de 10 : "+M(c[1])+".");}
]);
addAngles("prop_tableau",[
  function(r){var all=["prix payé et nombre de baguettes","distance et durée (vitesse constante)","périmètre d’un carré et son côté"],no=["âge et taille d’un enfant","prix d’un taxi (prise en charge) et distance","aire d’un carré et son côté","note obtenue et temps de révision"];
    return Q(r,"Laquelle de ces situations est une situation de proportionnalité ?",pick(r,all),pickN(r,no,3).map(function(x){return [x,"conf"];}),{},
      "Proportionnalité : quand une grandeur est multipliée par 2, l’autre aussi (et 0 donne 0). Une partie fixe ou un carré cassent la proportionnalité.");},
  function(r){var k=pick(r,[1.5,2.5,4,0.8]),a=pick(r,[2,4,6]),b=pick(r,[3,5,10]),ya=a*k,yb=b*k,s=a+b,ys=ya+yb;
    return QX(r,"Tableau de proportionnalité : "+a+" → "+f(ya)+" et "+b+" → "+f(yb)+". Zoé cherche l’image de "+(a*b)+" :",["Coefficient : "+M(fm(ya)+" \\div "+a+" = "+fm(k)),"Pour "+(a*b)+" : "+M(fm(ya)+" \\times "+fm(yb)+" = "+fm(ya*yb)),"Réponse : "+f(ya*yb)],1,
      "On ne multiplie pas les images entre elles ! "+M((a*b)+" \\times "+fm(k)+" = "+fm(a*b*k))+".");}
]);
addAngles("prop_graph",[
  function(r){var p=pick(r,[1.5,2,2.5,3]),q=pick(r,[3,4,5]),ok=p*q;
    return Q(r,"Le graphique donne le prix (en €) selon la masse (en kg). Quel est le prix de "+q+" kg ?",ok,[[q,"lect"],[p,"conf"],[ok+p,"lect"],[rd(q/p,2),"inv"]],{u:"€",d:2,fig:{k:"graph",xr:[0,6],yr:[0,Math.ceil(6*p)+1],sy:p>2?2:1,ey:1,pts:[[0,0],[6,6*p]],dots:[[1,p,""]],xn:"kg",yn:"€"}},
      "1 kg coûte "+f(p)+" € (point marqué) : "+M(q+" \\times "+fm(p)+" = "+fm(ok))+" €.");},
  function(r){return VF(r,"Une droite qui ne passe pas par l’origine du repère représente une situation de proportionnalité.",false,"Faux : il faut une droite qui passe par l’ORIGINE (0 donne 0).");}
]);
addAngles("pct_inverse",[
  function(r){var p=pick(r,[20,25,30,40]),P0=rnd(r,30,120),F=rd(P0*(1-p/100),2);
    return QE(r,"Un article soldé −"+p+" % coûte "+f(F)+" €. Estime son prix avant la remise.",P0,{u:"€",lo:0},"On divise par le coefficient : "+M(fm(F)+" \\div "+fm(1-p/100)+" = "+fm(P0))+" €.");}
]);
addAngles("perim_cercle",[
  function(r){var R=pick(r,[2,3,5,10,4]),P=rd(2*3.14*R,2);
    return Q(r,"Un cercle a un périmètre de "+f(P)+" cm. Quel est son rayon ? "+PI,R,[[2*R,"demi"],[rd(P/3.14,2)===2*R?rd(P/2,2):rd(P/3.14,2),"demi"],[rd(Math.sqrt(P/3.14),2),"formule"]],{u:"cm",d:2},
      M("r = \\dfrac{\\mathcal{P}}{2\\pi} = \\dfrac{"+fm(P)+"}{6{,}28} = "+R)+" cm. Diviser seulement par π donne le diamètre.");},
  function(r){var R=pick(r,[3,4,5,6]);
    return QX(r,"Calcul du périmètre d’un cercle de rayon "+R+" cm :",[M("\\mathcal{P} = \\pi \\times r^2"),M("\\mathcal{P} = 3{,}14 \\times "+(R*R)),M("\\mathcal{P} = "+fm(rd(3.14*R*R,2))+" \\text{ cm}")],0,
      "C’est la formule de l’AIRE. Périmètre : "+M("2 \\times \\pi \\times r = 2 \\times 3{,}14 \\times "+R+" = "+fm(rd(6.28*R,2)))+" cm.");}
]);
addAngles("vol_estim",[
  function(r){var all=[["un verre (20 cL)",0.2],["une bouteille (1,5 L)",1.5],["un seau (10 dm³)",10],["une baignoire (0,2 m³)",200],["une tasse (250 mL)",0.25],["un arrosoir (8 000 cm³)",8]];
    var c=pickN(r,all,4),vs={},ok=true;c.forEach(function(x){if(vs[x[1]])ok=false;vs[x[1]]=1;});if(!ok)return null;var s=c.slice().sort(function(a,b){return a[1]-b[1];});
    return QO(r,"Range ces contenants du plus petit au plus grand volume.",s.map(function(x){return x[0];}),"En litres : "+s.map(function(x){return f(x[1],2)+" L";}).join(" < ")+". Rappel : 1 dm³ = 1 L, 1 m³ = 1 000 L.",{how:"du plus petit au plus grand"});}
]);
addAngles("grandeurs_comp",[
  function(r){var d=pick(r,[8,12,15,20]),h=pick(r,[[1,30],[2,30],[2,0],[3,15]]),t=h[0]*60+h[1],ok=rd(d*t/1000,3);
    return Q(r,"Une pompe débite "+d+" L/min. Quel volume (en m³) pompe-t-elle en "+h[0]+" h "+(h[1]<10?"0":"")+h[1]+" min ?",ok,[[d*t,"unit"],[rd(d*(h[0]+h[1]/100)*60/1000,3),"base"],[rd(d*t/100,2),"unit"]],{u:"m³",d:3,far:2},
      t+" min × "+d+" L/min = "+f(d*t)+" L = "+f(ok,3)+" m³.");}
]);
addAngles("repere",[
  function(r){var x=rnd(r,1,5),y=rnd(r,1,4);if(x===y||y>4||x>5)return null;var cx=rnd(r,0,5),cy=rnd(r,0,4);if((cx===x&&cy===y)||(cx===y&&cy===x))return null;
    var pts=shuffle(r,[[x,y,"ok"],[y,x,"inv"],[cx,cy,"lect"]]),nm=["A","B","C"],dots=pts.map(function(p,i){return [p[0],p[1],nm[i]];}),good=nm[pts.findIndex(function(p){return p[2]==="ok";})];
    return Q(r,"Quel point a pour coordonnées "+M("("+x+"\\,;\\,"+y+")")+" ?",good,pts.filter(function(p){return p[2]!=="ok";}).map(function(p){return [nm[pts.indexOf(p)],p[2]];}),{fig:{k:"graph",xr:[-1,6],yr:[-1,5],dots:dots}},
      "On lit d’abord l’abscisse (horizontale, "+x+"), puis l’ordonnée (verticale, "+y+") : c’est le point "+good+".");}
]);
addAngles("stats_tab",[
  function(r){var cat=pickN(r,["Bus","Vélo","Voiture","À pied","Train"],4),e=cat.map(function(){return rnd(r,2,14);}),mx=Math.max.apply(null,e);if(e.filter(function(v){return v===mx;}).length>1)return null;var ok=cat[e.indexOf(mx)];
    return Q(r,"Moyen de transport des élèves : quel est le mode le plus fréquent ?",ok,cat.filter(function(c){return c!==ok;}).map(function(c){return [c,"lect"];}),{fig:{k:"bars",x:cat,y:e}},
      "La barre la plus haute est « "+ok+" » ("+mx+" élèves) : c’est le mode de la série.");}
]);
addAngles("eq_err",[
  function(r){var a=pick(r,[2,3,4,5]),x=rnd(r,2,9),c=a*x,neg=r()<0.5;
    if(neg){var A=-a,C=A*x;return QX(r,"Résolution de "+M(A+"x = "+C)+" :",[M("x = \\dfrac{"+C+"}{"+A+"}"),M("x = "+(-x))],1,"Moins divisé par moins donne PLUS : "+M("x = "+x)+".");}
    return QX(r,"Résolution de "+M(a+"x = "+c)+" :",[M("x = "+c+" - "+a),M("x = "+(c-a))],0,"Dans "+M(a+"x")+", "+a+" MULTIPLIE x : on divise, "+M("x = "+c+" \\div "+a+" = "+x)+".");}
]);
addAngles("parabole_lect",[
  function(r){var h=rnd(r,-1,3),k=rnd(r,-3,2),a=pick(r,[1,-1,0.5]),pts=[];for(var x=-3;x<=5.01;x+=0.25)pts.push([x,a*(x-h)*(x-h)+k]);
    return Q(r,"Quelle est l’équation de l’axe de symétrie de cette parabole ?",M("x = "+h),[[M("y = "+h),"conf"],[M("x = "+k),"lect"],[M("y = "+k),"conf"]].filter(function(w){return w[0]!==M("x = "+h);}),{fig:{k:"graph",xr:[-3,5],yr:[-5,6],pts:pts.filter(function(p){return p[1]>-5.5&&p[1]<6.5;})}},
      "L’axe de symétrie est la droite verticale qui passe par le sommet ("+h+" ; "+k+") : "+M("x = "+h)+".");},
  function(r){var h=rnd(r,-1,3),k=rnd(r,-3,2),a=pick(r,[1,-1]),pts=[];for(var x=-3;x<=5.01;x+=0.25)pts.push([x,a*(x-h)*(x-h)+k]);
    var up=a>0,ok=up?itv(h,Infinity,false,true):itv(-Infinity,h,true,false),wr=up?itv(-Infinity,h,true,false):itv(h,Infinity,false,true);
    return Q(r,"Sur quel intervalle la fonction représentée est-elle croissante ?",ok,[[wr,"signe"],[up?itv(k,Infinity,false,true):itv(-Infinity,k,true,false),"lect"],[itv(-3,5,false,false),"conf"]],{fig:{k:"graph",xr:[-3,5],yr:[-5,6],pts:pts.filter(function(p){return p[1]>-5.5&&p[1]<6.5;})}},
      "On lit le sens de la courbe de gauche à droite : elle "+(up?"descend jusqu’au sommet (x = "+h+") puis monte.":"monte jusqu’au sommet (x = "+h+") puis descend."));}
]);
addAngles("proba_tab",[
  function(r){var a=rnd(r,4,12),b=rnd(r,8,16),c=rnd(r,3,10),d=rnd(r,8,18),N=a+b+c+d,ok=rd((a+b+c)/N,3);
    return Q(r,"On choisit un élève au hasard. Probabilité que ce soit une fille OU un interne ?",ok,[[rd((a+b+a+c)/N,3),"addp"],[rd(a/N,3),"conf"],[rd(d/N,3),"compl"]],{d:3,fig:{k:"tab",rows:[["","Interne","Externe","Total"],["Fille",a,b,a+b],["Garçon",c,d,c+d],["Total",a+c,b+d,N]],hc:1}},
      "Filles ou internes : "+M(a+" + "+b+" + "+c+" = "+(a+b+c))+" élèves (on ne compte pas deux fois les filles internes). "+M("\\dfrac{"+(a+b+c)+"}{"+N+"} \\approx "+fm(ok,3))+".");}
]);
addAngles("pb_commerce",[
  function(r){var P=pick(r,[80,120,150,200]),p1=pick(r,[20,30]),p2=pick(r,[10,20]),ok=rd(P*(1-p1/100)*(1-p2/100),2);
    return Q(r,"Un article à "+P+" € bénéficie d’une remise de "+p1+" %, puis d’une remise supplémentaire de "+p2+" % en caisse. Prix payé ?",ok,[[rd(P*(1-(p1+p2)/100),2),"addp"],[rd(P*(1-p1/100),2),"demi"],[rd(P*p1/100*p2/100,2),"compl"]],{u:"€",d:2},
      M(P+" \\times "+fm(1-p1/100)+" \\times "+fm(1-p2/100)+" = "+fm(ok))+" €. Les remises successives ne s’additionnent pas.");}
]);
addAngles("pb_batiment",[
  function(r){var L=pick(r,[4,5,6]),l=pick(r,[3,3.5,4]),e=pick(r,[0.1,0.12,0.15]),ok=rd(L*l*e,3);
    return Q(r,"On coule une dalle de béton de "+L+" m × "+f(l)+" m sur "+f(e*100)+" cm d’épaisseur. Volume de béton ?",ok,[[rd(L*l*e*100,2),"unit"],[rd(L*l,2),"demi"],[rd(L+l+e,2),"addp"]],{u:"m³",d:3,far:2},
      f(e*100)+" cm = "+f(e)+" m. "+M(L+" \\times "+fm(l)+" \\times "+fm(e)+" = "+fm(ok,3))+" m³.");}
]);
addAngles("pb_sante",[
  function(r){var V=pick(r,[500,1000,250]),h=pick(r,[4,8,2]),g=20,ok=Math.round(V*g/(h*60));
    return Q(r,"Une perfusion de "+V+" mL doit passer en "+h+" h (1 mL = 20 gouttes). Débit en gouttes par minute (arrondi à l’unité) ?",ok,[[Math.round(V/(h*60)),"demi"],[Math.round(V*g/h),"base"],[Math.round(V*g/(h*100)),"base"]],{d:0,u:"gouttes/min"},
      M(V+" \\times 20 = "+(V*20))+" gouttes en "+h*60+" min : "+M((V*20)+" \\div "+(h*60)+" \\approx "+ok)+" gouttes/min.");}
]);

addAngles("algo_var",[
  function(r){var p=pick(r,[12,25,40,60]),q=pick(r,[3,4,5,10]),t=pick(r,[0.2,0.1]),ht=p*q,ok=rd(ht*(1+t),2);
    return Q(r,"Dans ce tableur, quelle valeur affiche la cellule B4 ?",ok,[[ht,"demi"],[rd(ht*t,2),"compl"],[rd(p*(1+t),2),"demi"]],{d:2,fig:{k:"tab",rows:[["","A","B"],["1","Prix unitaire",p],["2","Quantité",q],["3","Total HT","=B1*B2"],["4","Total TTC","=B3*"+f(1+t)]],hc:1}},
      "B3 = "+p+" × "+q+" = "+ht+", puis B4 = "+ht+" × "+f(1+t)+" = "+f(ok)+".");},
  function(r){var k=pick(r,[2,3]),L=pick(r,[50,100,30]),x=1,n=0;while(x<L){x*=k;n++;}
    return Q(r,"Quelle valeur de x ce programme affiche-t-il ?",x,[[x/k,"calc"],[L,"conf"],[x*k,"calc"]],{d:0,fig:{k:"code",lines:["x = 1","while x < "+L+" :","    x = x * "+k,"print(x)"]}},
      "x prend les valeurs 1, "+(function(){var o=[],y=1;while(y<L){y*=k;o.push(y);}return o.join(", ");})()+" : la boucle s’arrête dès que x ≥ "+L+", donc x = "+x+".");},
  function(r){var a=pick(r,[2,3,5]),b=pick(r,[1,-4,7]),v=pick(r,[4,6,10]),ok=a*v+b;
    return Q(r,"Qu’affiche ce programme ?",ok,[[a*v,"demi"],[a+v+b,"addp"],[a*(v+b),"ordre"]],{d:0,fig:{k:"code",lines:["def f(x) :","    return "+a+" * x "+(b<0?"- ":"+ ")+Math.abs(b),"print(f("+v+"))"]}},
      "f("+v+") = "+a+" × "+v+" "+(b<0?"− ":"+ ")+Math.abs(b)+" = "+ok+".");}
]);

/* ═════════ NOUVELLES NOTIONS ═════════ */
/* — Statistiques et probabilités — */
reg("fluctuation",["2nde"],C_STAT,"Fluctuation d’échantillonnage, fréquence et probabilité",["fluctuation","échantillon","fréquence","probabilité","simulation"],2,function(r){
  var t=rnd(r,0,5);
  if(t===0){var n=pick(r,[20,40,50,80,100]),k=Math.round(n*pick(r,[0.42,0.47,0.53,0.58,0.62])),ok=rd(k/n,3);
    return Q(r,"Sur "+n+" lancers d’une pièce, on obtient "+k+" fois « pile ». Quelle est la fréquence de « pile » ?",ok,[[k,"conf"],[0.5,"conf"],[rd(k/100,3)===ok?rd(n/k,3):rd(k/100,3),"formule"]],{d:3},
      "Fréquence observée = "+M("\\dfrac{"+k+"}{"+n+"} = "+fm(ok,3))+". Elle fluctue autour de la probabilité 0,5.");}
  if(t===1){var v=r()<0.5;
    return VF(r,v?"Plus l’échantillon est grand, plus la fréquence observée a tendance à se rapprocher de la probabilité.":"Sur 10 lancers d’une pièce équilibrée, on obtient forcément 5 fois « pile ».",v,
      v?"Vrai : c’est la loi des grands nombres, la fréquence se stabilise.":"Faux : sur un petit échantillon, la fréquence fluctue beaucoup (3, 6, 7 piles… sont possibles).");}
  if(t===2){var p=pick(r,[0.33,0.25,0.4,0.15]),fr=[rd(p+pick(r,[0.25,-0.12,0.3]),2),rd(p+pick(r,[0.06,-0.07]),2),rd(p+pick(r,[0.02,-0.015]),3),rd(p+pick(r,[0.004,-0.003]),3)];
    return Q(r,"On simule une expérience aléatoire sur des échantillons de plus en plus grands. Quelle est la meilleure estimation de la probabilité ?","environ "+f(p,2),[["environ "+f(fr[0],2),"conf"],["environ 0,5","conf"],["on ne peut rien dire","conf"]],{fig:{k:"tab",rows:[["Taille","10","100","1 000","10 000"],["Fréquence",f(fr[0],2),f(fr[1],2),f(fr[2],3),f(fr[3],3)]],hc:1}},
      "On se fie au plus grand échantillon : la fréquence s’y stabilise autour de "+f(p,2)+".");}
  if(t===3){var pr=pick(r,[0.3,0.2,0.25,0.4]),n=pick(r,[100,200,400,500]),ok=pr*n;
    return Q(r,"Une urne contient "+f(pr*100)+" % de boules rouges. On fait "+n+" tirages avec remise. Combien de rouges peut-on s’attendre à obtenir, environ ?",ok,[[pr*100,"conf"],[n*(1-pr),"compl"],[n/2,"conf"],[ok/10,"unit"]],{d:0},
      M(fm(pr)+" \\times "+n+" = "+ok)+" environ (le résultat réel fluctue autour de cette valeur).");}
  if(t===4){var n2=pick(r,[300,600,1200,900]);
    return QE(r,"On lance un dé équilibré "+f(n2)+" fois. Estime le nombre de « 6 » obtenus.",n2/6,{lo:0,min:0,max:n2/2,tol:n2/50},"Probabilité "+M(frL(1,6))+" : environ "+M(fm(n2)+" \\div 6 = "+n2/6)+".");}
  var a=pick(r,[[7,10],[52,100],[488,1000]]),b=pick(r,[[3,10],[46,100],[502,1000]]);
  return Q(r,"Deux élèves lancent une pièce : Ali obtient "+a[0]+" piles sur "+a[1]+" lancers, Bea "+b[0]+" sur "+b[1]+". Lequel des deux résultats est le plus fiable pour estimer la probabilité ?",a[1]>b[1]?"celui d’Ali":a[1]<b[1]?"celui de Bea":"les deux se valent",
    [[a[1]>b[1]?"celui de Bea":"celui d’Ali","conf"],["celui qui est le plus proche de 50 %","conf"],[a[1]===b[1]?"celui d’Ali":"les deux se valent","conf"]],{},"C’est l’échantillon le plus GRAND qui donne l’estimation la plus fiable.");
});
reg("quartiles",["2nde"],C_STAT,"Quartiles et écart interquartile",["quartile","Q1","Q3","écart interquartile","dispersion"],2,function(r){
  var t=rnd(r,0,4);
  if(t<=1){var n=pick(r,[8,10,12]),v=[],x=rnd(r,4,8);for(var i=0;i<n;i++){x+=rnd(r,0,3);v.push(x);}
    var q1=v[Math.ceil(n/4)-1],q3=v[Math.ceil(3*n/4)-1],med=(v[n/2-1]+v[n/2])/2,ask3=t===1,ok=ask3?q3:q1;
    return Q(r,"Série rangée : "+v.join(" ; ")+". Quel est le "+(ask3?"3ᵉ":"1ᵉʳ")+" quartile "+(ask3?"Q3":"Q1")+" ?",ok,[[med,"conf"],[ask3?q1:q3,"conf"],[ask3?v[Math.ceil(3*n/4)]:v[Math.ceil(n/4)],"calc"],[rd((v[0]+v[n-1])/2,1),"formule"]],{d:1},
      (ask3?"Q3":"Q1")+" est la "+(ask3?Math.ceil(3*n/4):Math.ceil(n/4))+"ᵉ valeur ("+(ask3?"3n/4":"n/4")+" = "+f((ask3?3:1)*n/4,2)+", arrondi à l’entier supérieur) : "+ok+".");}
  if(t===2){var mn=rnd(r,2,6),q1b=mn+rnd(r,2,5),me=q1b+rnd(r,1,4),q3b=me+rnd(r,1,5),mx=q3b+rnd(r,2,6),eiq=q3b-q1b,et=mx-mn,ask=r()<0.6;
    return Q(r,"Résumé d’une série de notes. Quel est "+(ask?"l’écart interquartile":"l’étendue")+" ?",ask?eiq:et,ask?[[et,"conf"],[q3b+q1b,"addp"],[me-q1b,"calc"]]:[[eiq,"conf"],[mx+mn,"addp"],[mx-me,"calc"]],{d:1,fig:{k:"tab",rows:[["Min","Q1","Médiane","Q3","Max"],[mn,q1b,me,q3b,mx]]}},
      ask?"Écart interquartile = Q3 − Q1 = "+q3b+" − "+q1b+" = "+eiq+" : la moitié centrale des notes s’étale sur "+eiq+" points.":"Étendue = max − min = "+mx+" − "+mn+" = "+et+".");}
  if(t===3){var q3c=pick(r,[13,14,15,16]);
    return Q(r,"Pour les notes d’un devoir, "+M("Q_3 = "+q3c)+". Que peut-on affirmer ?","au moins 75 % des notes sont ≤ "+q3c,[["exactement 3 élèves ont "+q3c,"conf"],["au moins 75 % des notes sont ≥ "+q3c,"inv"],["la moyenne vaut "+q3c,"conf"]],{},
      "Q3 : au moins les trois quarts des valeurs lui sont inférieures ou égales.");}
  return QA(r,"Associe chaque indicateur à sa définition.",[["médiane","partage la série en deux moitiés"],["Q1","au moins un quart des valeurs ≤ Q1"],["étendue","maximum − minimum"],["écart interquartile","Q3 − Q1"]],
    "Médiane et quartiles sont des indicateurs de POSITION ; étendue et écart interquartile mesurent la DISPERSION.");
});
reg("proba_union",["1re"],C_SP,"Réunion, intersection, événements incompatibles",["probabilité","réunion","intersection","incompatibles","contraire"],2,function(r){
  var t=rnd(r,0,4);
  if(t===0){var pa=pick(r,[0.3,0.4,0.5,0.6]),pb=pick(r,[0.2,0.3,0.45]),pab=pick(r,[0.1,0.15]),ok=rd(pa+pb-pab,3);
    return Q(r,M("P(A) = "+fm(pa))+", "+M("P(B) = "+fm(pb))+" et "+M("P(A \\cap B) = "+fm(pab))+". Calculer "+M("P(A \\cup B)")+".",ok,[[rd(pa+pb,3),"addp"],[rd(pa*pb,3),"conf"],[rd(pa+pb+pab,3),"signe"]],{d:3},
      M("P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = "+fm(pa)+" + "+fm(pb)+" - "+fm(pab)+" = "+fm(ok,3))+".");}
  if(t===1){var pa2=pick(r,[0.15,0.25,0.35]),pb2=pick(r,[0.2,0.4,0.5]),ok2=rd(pa2+pb2,3);
    return Q(r,"A et B sont incompatibles, "+M("P(A) = "+fm(pa2))+" et "+M("P(B) = "+fm(pb2))+". Calculer "+M("P(A \\cup B)")+".",ok2,[[rd(pa2*pb2,3),"conf"],[rd(pa2+pb2-pa2*pb2,3),"conf"],[rd(1-ok2,3),"compl"]],{d:3},
      "Incompatibles : "+M("P(A \\cap B) = 0")+", donc "+M("P(A \\cup B) = "+fm(pa2)+" + "+fm(pb2)+" = "+fm(ok2,3))+".");}
  if(t===2){var ev=pick(r,[["pair",[2,4,6]],["impair",[1,3,5]]]),ev2=pick(r,[["≥ 5",[5,6]],["≤ 2",[1,2]],["multiple de 3",[3,6]]]),u={};ev[1].concat(ev2[1]).forEach(function(x){u[x]=1;});var nu=Object.keys(u).length,ni=ev[1].filter(function(x){return ev2[1].indexOf(x)>=0;}).length,S=ev[1].length+ev2[1].length;
    var F=function(n){return n===6?"1":n===0?"0":frM(n/gcd(n,6),6/gcd(n,6));};
    return Q(r,"On lance un dé. A : « le résultat est "+ev[0]+" », B : « il est "+ev2[0]+" ». Que vaut "+M("P(A \\cup B)")+" ?",F(nu),[[F(S),"addp"],[F(ni===0?nu-1:ni),"conf"],[F(6-nu),"compl"]].filter(function(w){return w[0]!==F(nu);}),{},
      "A ∪ B = {"+Object.keys(u).join(" ; ")+"} : "+nu+" faces sur 6"+(ni?" (on ne compte pas deux fois "+ev[1].filter(function(x){return ev2[1].indexOf(x)>=0;}).join(" et ")+")":"")+".");}
  if(t===3){var v=r()<0.5;return VF(r,v?"Si A et B sont incompatibles, alors "+M("P(A \\cap B) = 0")+".":"Pour tous événements A et B, "+M("P(A \\cup B) = P(A) + P(B)")+".",v,v?"Vrai : incompatibles signifie qu’ils ne peuvent pas se produire en même temps.":"Faux : il faut retirer "+M("P(A \\cap B)")+", sinon on compte deux fois l’intersection.");}
  var pu=pick(r,[0.7,0.8,0.65]),pa3=pick(r,[0.4,0.5]),pb3=pick(r,[0.45,0.5]),ok3=rd(pa3+pb3-pu,3);if(ok3<=0)return null;
  return Q(r,M("P(A \\cup B) = "+fm(pu))+", "+M("P(A) = "+fm(pa3))+" et "+M("P(B) = "+fm(pb3))+". Que vaut "+M("P(A \\cap B)")+" ?",ok3,[[rd(pa3*pb3,3),"conf"],[rd(pu-pa3,3),"demi"],[rd(pa3+pb3+pu,3),"signe"]],{d:3},
    "On isole l’intersection : "+M("P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = "+fm(ok3,3))+".");
});

/* — Calculs commerciaux et financiers — */
reg("interets_simples",["2nde","1re"],C_COM,"Intérêts simples, valeur acquise, taux",["intérêts simples","placement","valeur acquise","taux","capital"],2,function(r){
  var t=rnd(r,0,4),C=pick(r,[800,1200,2000,2500,5000]),tx=pick(r,[1.5,2,2.5,3,4]),n=pick(r,[2,3,4,5]);
  if(t===0){var I=rd(C*tx/100*n,2);
    return Q(r,f(C)+" € sont placés à "+f(tx)+" % par an pendant "+n+" ans (intérêts simples). Montant des intérêts ?",I,[[rd(C+I,2),"conf"],[rd(C*tx/100,2),"demi"],[rd(C*tx*n,2),"pct0"]],{u:"€",d:2,far:2},
      M("I = C \\times t \\times n = "+fm(C)+" \\times "+fm(tx/100,3)+" \\times "+n+" = "+fm(I))+" €.");}
  if(t===1){var V=rd(C*(1+tx/100*n),2);
    return Q(r,"Quelle est la valeur acquise par "+f(C)+" € placés "+n+" ans à "+f(tx)+" % (intérêts simples) ?",V,[[rd(C*tx/100*n,2),"demi"],[rd(C*Math.pow(1+tx/100,n),2),"conf"],[rd(C+tx*n,2),"pct0"]],{u:"€",d:2},
      "Intérêts : "+f(C*tx/100*n)+" €. Valeur acquise : "+M(fm(C)+" + "+fm(rd(C*tx/100*n,2))+" = "+fm(V))+" €.");}
  if(t===2){var m=pick(r,[3,6,9,10]),I2=rd(C*tx/100*m/12,2);
    return Q(r,f(C)+" € placés "+m+" mois à "+f(tx)+" % par an (intérêts simples). Intérêts ?",I2,[[rd(C*tx/100*m,2),"base"],[rd(C*tx/100,2),"conf"],[rd(C*tx/100*m/100,2),"base"]],{u:"€",d:2,far:2},
      "Le taux est ANNUEL : "+m+" mois = "+M(frL(m,12))+" an. "+M(fm(C)+" \\times "+fm(tx/100,3)+" \\times "+frL(m,12)+" = "+fm(I2))+" €.");}
  if(t===3){var I3=rd(C*tx/100*n,2);
    return Q(r,"Un capital de "+f(C)+" € a rapporté "+f(I3)+" € d’intérêts simples en "+n+" ans. Quel est le taux annuel ?",tx,[[rd(tx*n,2),"demi"],[rd(I3/C,4),"pct0"],[rd(C/I3,2),"inv"]],{u:"%",d:3},
      "Intérêts d’un an : "+M(fm(I3)+" \\div "+n+" = "+fm(rd(I3/n,2)))+" €. Taux : "+M(fm(rd(I3/n,2))+" \\div "+fm(C)+" = "+fm(tx/100,4))+", soit "+f(tx)+" %.");}
  var C4=pick(r,[600,800,1200]),t4=pick(r,[3,4,5]),m4=pick(r,[3,6,9]);
  return QX(r,"Intérêts de "+f(C4)+" € placés "+m4+" mois à "+t4+" % par an :",[M("I = C \\times t \\times n"),M("I = "+fm(C4)+" \\times 0{,}0"+t4+" \\times "+m4),M("I = "+fm(rd(C4*t4/100*m4,2)))+" €"],1,
    "La durée doit être en ANNÉES : n = "+M(frL(m4,12))+". "+M("I = "+fm(C4)+" \\times 0{,}0"+t4+" \\times "+frL(m4,12)+" = "+fm(rd(C4*t4/100*m4/12,2)))+" €.");
});
reg("marge",["cap","2nde"],C_COM,"Prix d’achat, marge, coefficient multiplicateur",["marge","prix d’achat","prix de vente","coefficient multiplicateur","commerce"],2,function(r){
  var t=rnd(r,0,4),PA=pick(r,[20,24,30,36,45,60]),k=pick(r,[1.5,1.8,2,2.5]),PV=rd(PA*k,2),Mb=rd(PV-PA,2);
  if(t===0)return Q(r,"Un article est acheté "+f(PA)+" € HT et revendu "+f(PV)+" € HT. Quelle est la marge brute ?",Mb,[[rd(PV+PA,2),"addp"],[k,"conf"],[rd(Mb/PA*100,2),"conf"]],{u:"€",d:2},"Marge brute = prix de vente HT − prix d’achat HT = "+M(fm(PV)+" - "+fm(PA)+" = "+fm(Mb))+" €.");
  if(t===1)return Q(r,"Prix d’achat HT : "+f(PA)+" € ; prix de vente HT : "+f(PV)+" €. Quel est le coefficient multiplicateur ?",k,[[rd(PA/PV,3),"inv"],[Mb,"conf"],[rd(k*100,0),"pct0"]],{d:3},M("k = \\dfrac{PV}{PA} = \\dfrac{"+fm(PV)+"}{"+fm(PA)+"} = "+fm(k))+".");
  if(t===2){var tm=rd(Mb/PA*100,2);return Q(r,"Un article acheté "+f(PA)+" € HT est revendu "+f(PV)+" € HT. Taux de marge (marge ÷ prix d’achat) ?",tm,[[rd(Mb/PV*100,2),"conf"],[Mb,"pct0"],[rd(PV/PA*100,2),"conf"]],{u:"%",d:2},
    "Marge : "+f(Mb)+" €. "+M(frL(fm(Mb),fm(PA))+" = "+fm(tm/100,4))+", soit "+f(tm)+" % (rapporté au prix d’ACHAT).");}
  if(t===3)return QO(r,"Remets dans l’ordre les étapes pour passer du prix d’achat au prix affiché.",["prix d’achat HT","+ marge brute","= prix de vente HT","+ TVA","= prix de vente TTC"],"On ajoute d’abord la marge (prix HT), puis la TVA (prix TTC, celui que paie le client).",{how:"du prix d’achat au prix payé",sep:" → "});
  return QA(r,"Associe chaque notion à son calcul.",[["marge brute","PV HT − PA HT"],["coefficient multiplicateur","PV HT ÷ PA HT"],["taux de marge","marge ÷ PA HT"],["prix TTC (TVA 20 %)","PV HT × 1,2"]],"PA : prix d’achat ; PV : prix de vente ; HT : hors taxes ; TTC : toutes taxes comprises.");
});
reg("cout_marginal",["1re"],C_COM,"Coût total, coût moyen, coût marginal, résultat",["coût","coût moyen","coût marginal","recette","bénéfice"],3,function(r){
  var t=rnd(r,0,4);
  if(t===0){var q=pick(r,[50,100,200,250]),u=pick(r,[8,12,15,18]),CT=q*u;
    return Q(r,"Le coût total de fabrication de "+q+" objets est de "+f(CT)+" €. Quel est le coût moyen unitaire ?",u,[[CT*q,"inv"],[CT-q,"addp"],[rd(q/CT,3),"inv"]],{u:"€",d:2,far:2},M("C_M = \\dfrac{"+fm(CT)+"}{"+q+"} = "+u)+" € par objet.");}
  if(t===1){var a=pick(r,[0.5,0.2,1]),b=pick(r,[10,8,20]),F=pick(r,[200,500]),q1=pick(r,[20,30,40]),C=function(x){return a*x*x+b*x+F;},ok=rd(C(q1+1)-C(q1),2);
    return Q(r,M("C(q) = "+fm(a)+"q^2 + "+b+"q + "+F)+". Quel est le coût marginal de la "+(q1+1)+"ᵉ unité, "+M("C("+(q1+1)+") - C("+q1+")")+" ?",ok,[[rd(C(q1)/q1,2),"conf"],[rd(C(q1+1),2),"demi"],[rd(2*a*q1,2),"demi"]],{u:"€",d:2,far:2},
      M("C("+(q1+1)+") = "+fm(C(q1+1))+"")+" et "+M("C("+q1+") = "+fm(C(q1)))+" : la "+(q1+1)+"ᵉ unité coûte "+f(ok)+" €.");}
  if(t===2){var p=pick(r,[25,30,40]),cv=pick(r,[10,12,15]),F2=pick(r,[400,600,900]),q2=pick(r,[40,50,80]),R=p*q2,Ct=cv*q2+F2,ok2=R-Ct;
    return Q(r,"Chaque article est vendu "+p+" €. Coût de production : "+M("C(q) = "+cv+"q + "+F2)+". Quel est le résultat pour "+q2+" articles vendus ?",ok2,[[R,"conf"],[R-cv*q2,"demi"],[Ct-R,"signe"]],{u:"€",d:2,far:2},
      "Recette "+M(p+" \\times "+q2+" = "+R)+" € ; coût "+M(cv+" \\times "+q2+" + "+F2+" = "+Ct)+" €. Résultat "+M("= "+R+" - "+Ct+" = "+ok2)+" € ("+(ok2>=0?"bénéfice":"perte")+").");}
  if(t===3)return Q(r,"Pour un atelier, lequel de ces coûts est un coût FIXE (indépendant de la quantité produite) ?",pick(r,["le loyer de l’atelier","l’assurance des locaux","l’abonnement internet"]),[["les matières premières","conf"],["l’emballage de chaque produit","conf"],["l’énergie des machines en marche","conf"]],{},
    "Coût fixe : on le paie même si on ne produit rien. Coût variable : il augmente avec la quantité produite.");
  var F3=pick(r,[300,600]),cv3=pick(r,[4,6]),q3=pick(r,[50,100,150]),cm=rd((F3+cv3*q3)/q3,2);
  return QE(r,M("C(q) = "+cv3+"q + "+F3)+". Estime le coût moyen unitaire pour "+q3+" unités.",cm,{u:"€",lo:0},M("\\dfrac{C("+q3+")}{"+q3+"} = \\dfrac{"+(F3+cv3*q3)+"}{"+q3+"} = "+fm(cm))+" €. Plus on produit, plus les frais fixes sont « dilués ».");
});
reg("emprunt",["term"],C_COM,"Emprunts : taux équivalents, coût d’un crédit, amortissement",["emprunt","crédit","taux mensuel","taux équivalent","mensualité"],3,function(r){
  var t=rnd(r,0,4);
  if(t===0){var ta=pick(r,[3,4,6,12]),ok=rd((Math.pow(1+ta/100,1/12)-1)*100,3);
    return Q(r,"Un taux annuel de "+ta+" % correspond à quel taux mensuel équivalent (au millième de %) ?",ok,[[rd(ta/12,3),"addp"],[rd(ta*12,3),"inv"],[rd((Math.pow(1+ta/100,12)-1)*100,3),"inv"]],{u:"%",d:3},
      M("(1 + t_m)^{12} = "+fm(1+ta/100))+", donc "+M("t_m = "+fm(1+ta/100)+"^{1/12} - 1 \\approx "+fm(ok/100,5))+", soit "+f(ok,3)+" %. Diviser par 12 donne un peu trop.");}
  if(t===1){var K=pick(r,[5000,8000,10000,15000]),n=pick(r,[24,36,48,60]),m=pick(r,[0.022,0.023,0.024])*K,mm=Math.round(m),cout=mm*n-K;
    return Q(r,"Un crédit de "+f(K)+" € est remboursé en "+n+" mensualités de "+f(mm)+" €. Quel est le coût du crédit ?",cout,[[mm*n,"conf"],[mm,"conf"],[K-mm*n<0?rd(cout/n,2):K,"demi"]],{u:"€",d:2,far:2},
      "On rembourse "+M(n+" \\times "+fm(mm)+" = "+fm(mm*n))+" €, soit "+M(fm(mm*n)+" - "+fm(K)+" = "+fm(cout))+" € de plus que la somme empruntée.");}
  if(t===2){var K2=pick(r,[12000,20000,8000]),n2=pick(r,[4,5]),i=pick(r,[3,4,5]),A=K2/n2,ok2=A+K2*i/100;
    return Q(r,"Emprunt de "+f(K2)+" € sur "+n2+" ans, à "+i+" %, remboursé par amortissements constants. Montant de la 1ʳᵉ annuité ?",ok2,[[A,"demi"],[K2*i/100,"demi"],[rd(K2*(1+i/100)/n2,2),"conf"]],{u:"€",d:2,far:2},
      "Amortissement : "+M(fm(K2)+" \\div "+n2+" = "+fm(A))+" €. Intérêts de la 1ʳᵉ année : "+M(fm(K2)+" \\times "+fm(i/100)+" = "+fm(K2*i/100))+" €. Annuité : "+f(ok2)+" €.");}
  if(t===3){var tm=pick(r,[0.5,1,0.8]),ok3=rd((Math.pow(1+tm/100,12)-1)*100,2);
    return Q(r,"Un taux mensuel de "+f(tm)+" % correspond à quel taux annuel équivalent ?",ok3,[[rd(tm*12,2),"addp"],[rd(tm*100/12,2),"inv"],[rd(Math.pow(1+tm/100,12),4),"pct0"]],{u:"%",d:2},
      M(fm(1+tm/100,3)+"^{12} \\approx "+fm(rd(Math.pow(1+tm/100,12),4),4))+", soit "+f(ok3)+" % (un peu plus que "+f(tm*12)+" % : les intérêts produisent des intérêts).");}
  return VF(r,"Un taux mensuel de 0,5 % équivaut exactement à un taux annuel de 6 %.",false,"Faux : "+M("1{,}005^{12} \\approx 1{,}0617")+", soit 6,17 % par an.");
});

/* — Logique, inéquations — */
reg("ensembles",["2nde","1re","term"],C_LOG,"Intervalles, appartenance, contre-exemple",["intervalle","ensemble","appartient","intersection","réunion","logique","contre-exemple"],2,function(r){
  var t=rnd(r,0,5),a=rnd(r,-5,2),b=a+rnd(r,3,8);
  if(t===0){var ps=[[itv(a,b),M(fm(a)+" \\leq x \\leq "+fm(b))],[itv(a,b,true,false),M(fm(a)+" < x \\leq "+fm(b))],[itv(a,Infinity,false,true),M("x \\geq "+fm(a))],[itv(-Infinity,b,true,true),M("x < "+fm(b))]];
    return QA(r,"Associe chaque intervalle à l’inégalité correspondante.",ps,"Crochet tourné vers le nombre : il est compris (≤, ≥). Crochet tourné vers l’extérieur : il est exclu (<, >). L’infini est toujours exclu.");}
  if(t===1){var o1=r()<0.5,o2=r()<0.5,x=pick(r,[a,b,a,b,a+1]),inc=x===a?!o1:x===b?!o2:true;
    return oui(r,"Le nombre "+f(x)+" appartient-il à l’intervalle "+itv(a,b,o1,o2)+" ?",inc,x!==a&&x!==b?"Oui : "+f(x)+" est strictement entre "+f(a)+" et "+f(b)+".":inc?"Oui : la borne "+f(x)+" est comprise (crochet tourné vers elle).":"Non : la borne "+f(x)+" est exclue (crochet tourné vers l’extérieur).");}
  if(t===2){var c=a+rnd(r,1,b-a-1),d=b+rnd(r,1,4),ok=itv(c,b),inter=r()<0.6;
    return Q(r,(inter?"Intersection : ":"Réunion : ")+itv(a,b)+(inter?" ∩ ":" ∪ ")+itv(c,d)+" = ?",inter?ok:itv(a,d),[[inter?itv(a,d):ok,"conf"],[itv(c,d),"conf"],[itv(a,c),"conf"]],{},
      inter?"L’intersection, ce sont les nombres communs aux deux intervalles : "+ok+".":"La réunion regroupe les nombres d’au moins un des deux intervalles : "+itv(a,d)+".");}
  if(t===3){var c3=pick(r,[["Si un nombre est pair, alors il est divisible par 4.",pick(r,[6,10,14,18]),[8,12,7,16]],["Si "+M("x^2 = 9")+", alors "+M("x = 3")+".",-3,[3,9,0]],["Si un nombre est divisible par 3, alors il est divisible par 9.",pick(r,[6,12,15,21]),[9,18,27]],["Si un quadrilatère a 4 côtés égaux, alors c’est un carré.","un losange non carré",["un carré","un rectangle non carré","un triangle"]]]);
    var ok3=typeof c3[1]==="number"?f(c3[1]):c3[1];
    return Q(r,"« "+c3[0]+" » Quel exemple montre que cette affirmation est fausse (contre-exemple) ?",ok3,pickN(r,c3[2],3).map(function(w){return [typeof w==="number"?f(w):w,"conf"];}),{},
      "Un contre-exemple vérifie la condition (le « si ») mais pas la conclusion (le « alors ») : "+ok3+".");}
  if(t===4){var v=r()<0.5;return VF(r,v?"La réciproque de « S’il pleut, alors le sol est mouillé » est « Si le sol est mouillé, alors il pleut ».":"Si une affirmation est vraie, sa réciproque est forcément vraie.",v,
    v?"Vrai : la réciproque échange la condition et la conclusion (elle peut être fausse : un arrosage mouille aussi le sol).":"Faux : « s’il pleut, le sol est mouillé » est vraie, mais sa réciproque est fausse.");}
  return Q(r,"Quel ensemble de nombres contient "+M("-\\dfrac{3}{4}")+" mais ne contient pas "+M("\\sqrt{2}")+" ?",M("\\mathbb{Q}")+" (rationnels)",[[M("\\mathbb{N}")+" (entiers naturels)","conf"],[M("\\mathbb{Z}")+" (entiers relatifs)","conf"],[M("\\mathbb{R}")+" (réels)","conf"]],{},
    M("-\\dfrac{3}{4}")+" est un quotient d’entiers (rationnel) ; "+M("\\sqrt{2}")+" n’en est pas un (irrationnel), il est seulement dans "+M("\\mathbb{R}")+".");
});
reg("ineq1",["2nde"],C_EQ,"Inéquations du premier degré",["inéquation","inégalité","intervalle","1er degré"],2,function(r){
  var t=rnd(r,0,4),a=rnd(r,2,6),x0=rnd(r,-4,8),b=rnd(r,-9,9),c=a*x0+b;
  if(t===0)return Q(r,"Résoudre "+M(linL(a,b)+" < "+c),M("x < "+x0),[[M("x > "+x0),"signe"],[M("x < "+fm(rd((c+b)/a,2))),"signe"],[M("x < "+(c-b)),"demi"]].filter(function(w){return w[0]!==M("x < "+x0);}),{},
    M(a+"x < "+c+" - "+par(b)+" = "+(c-b))+", puis on divise par "+a+" (positif, le sens ne change pas) : "+M("x < "+x0)+".");
  if(t===1){var A=-a,C=A*x0+b;
    return Q(r,"Résoudre "+M(linL(A,b)+" \\geq "+C),M("x \\leq "+x0),[[M("x \\geq "+x0),"signe"],[M("x \\leq "+(-x0)),"signe"],[M("x \\geq "+(-x0)),"signe"]].filter(function(w){return w[0]!==M("x \\leq "+x0);}),{},
      M(A+"x \\geq "+(C-b))+" ; on divise par "+A+" (NÉGATIF) : on CHANGE le sens, "+M("x \\leq "+x0)+".");}
  if(t===2)return Q(r,"Ensemble des solutions de "+M(linL(a,b)+" > "+c)+" ?",itv(x0,Infinity,true,true),[[itv(x0,Infinity,false,true),"conf"],[itv(-Infinity,x0,true,true),"signe"],[itv(-Infinity,x0,true,false),"signe"]],{},
    M("x > "+x0)+" : "+x0+" est EXCLU (inégalité stricte), d’où "+itv(x0,Infinity,true,true)+".");
  if(t===3){var F=pick(r,[15,20,30]),u=pick(r,[3,4,6]),B=F+u*rnd(r,5,12)+rnd(r,1,u-1),ok=Math.floor((B-F)/u);
    return Q(r,"Une salle de sport coûte "+F+" € d’inscription puis "+u+" € par séance. Avec "+B+" € au maximum, combien de séances peut-on faire au plus ?",ok,[[ok+1,"arr"],[Math.floor(B/u),"demi"],[rd((B-F)/u,2),"arr"]],{d:2},
      "On résout "+M(F+" + "+u+"x \\leq "+B)+" : "+M("x \\leq "+fm(rd((B-F)/u,2)))+". Au plus "+ok+" séances.");}
  var v=r()<0.5,x=v?x0+1:x0;
  return VF(r,M("x = "+x)+" est solution de "+M(linL(a,b)+" > "+c)+".",v,"On remplace : "+M(a+" \\times "+par(x)+" "+(b<0?"- ":"+ ")+Math.abs(b)+" = "+(a*x+b))+(v?" > "+c+" : vrai.":", qui n’est PAS strictement supérieur à "+c+" : faux."));
});

/* — Géométrie — */
var SOL=[["un cube",6,12,8],["un pavé droit",6,12,8],["une pyramide à base carrée",5,8,5],["un prisme droit à base triangulaire",5,9,6],["un tétraèdre",4,6,4],["un prisme droit à base hexagonale",8,18,12]];
reg("solides",["3pm","cap","2nde","1re"],C_ESP,"Solides : faces, arêtes, patrons, sections",["solide","faces","arêtes","sommets","patron","section","espace"],1,function(r){
  var t=rnd(r,0,4);
  if(t===0){var s=pick(r,SOL),w=rnd(r,0,2),nm=["faces","arêtes","sommets"],ok=s[1+w];
    return Q(r,"Combien de "+nm[w]+" a "+s[0]+" ?",ok,[[s[1+(w+1)%3],"conf"],[s[1+(w+2)%3],"conf"],[ok*2,"calc"]],{d:0},cap1(s[0])+" a "+s[1]+" faces, "+s[2]+" arêtes et "+s[3]+" sommets.");}
  if(t===1){var c=pick(r,[["un cylindre par un plan parallèle à sa base","un disque",["un rectangle","un triangle","un carré"]],["un cylindre par un plan parallèle à son axe","un rectangle",["un disque","un triangle","un cercle"]],["un cube par un plan parallèle à une face","un carré",["un triangle","un disque","un losange"]],["une boule par un plan","un disque",["un rectangle","un carré","un triangle"]],["un pavé droit par un plan parallèle à une face","un rectangle",["un disque","un triangle","un trapèze"]],["une pyramide par un plan parallèle à sa base","une réduction de la base",["un triangle quelconque","un disque","un agrandissement de la base"]]]);
    return Q(r,"On coupe "+c[0]+". Quelle est la forme de la section ?",c[1],c[2].map(function(w){return [w,"conf"];}),{},"Section de "+c[0]+" : "+c[1]+".");}
  if(t===2){var c2=pick(r,[["d’un cube","6 carrés"],["d’un cylindre","2 disques et 1 rectangle"],["d’une pyramide à base carrée","1 carré et 4 triangles"],["d’un pavé droit","6 rectangles"],["d’un cône","1 disque et 1 secteur de disque"]]),ws=["6 carrés","2 disques et 1 rectangle","1 carré et 4 triangles","6 rectangles","1 disque et 1 secteur de disque","3 rectangles"].filter(function(x){return x!==c2[1];});
    return Q(r,"Le patron "+c2[0]+" est formé de…",c2[1],pickN(r,ws,3).map(function(w){return [w,"conf"];}),{},"Un patron montre toutes les faces du solide « dépliées » à plat : "+c2[1]+".");}
  if(t===3){var p=pickN(r,[SOL[0],SOL[2],SOL[4],SOL[5],SOL[3]],4),u={},ok=true;p.forEach(function(s){if(u[s[1]])ok=false;u[s[1]]=1;});if(!ok)return null;
    return QA(r,"Associe chaque solide à son nombre de faces.",p.map(function(s){return [s[0],s[1]+" faces"];}),"Prisme à base à n côtés : n + 2 faces. Pyramide à base à n côtés : n + 1 faces.");}
  var s5=pick(r,SOL);
  return VF(r,"Pour "+s5[0]+" : faces + sommets − arêtes = 2.",true,"Vrai (relation d’Euler) : "+M(s5[1]+" + "+s5[3]+" - "+s5[2]+" = 2")+".");
});
reg("transfo",["3pm"],C_GEO,"Symétries, translations, rotations dans un repère",["symétrie","translation","rotation","transformation","repère"],2,function(r){
  var t=rnd(r,0,4),x=rnd(r,1,6)*pick(r,[1,-1]),y=rnd(r,1,5)*pick(r,[1,-1]),P=function(u,v){return M("("+fm(u,0)+"\\,;\\,"+fm(v,0)+")");};
  if(t===0){var ax=r()<0.5;
    return Q(r,"Quelles sont les coordonnées du symétrique de "+M("A")+P(x,y)+" par rapport à l’axe des "+(ax?"ordonnées":"abscisses")+" ?",ax?P(-x,y):P(x,-y),[[ax?P(x,-y):P(-x,y),"conf"],[P(-x,-y),"conf"],[P(y,x),"inv"]],{},
      "Symétrie par rapport à l’axe des "+(ax?"ordonnées (vertical) : on change le signe de l’abscisse.":"abscisses (horizontal) : on change le signe de l’ordonnée."));}
  if(t===1)return Q(r,"Quelles sont les coordonnées du symétrique de "+M("A")+P(x,y)+" par rapport à l’origine O ?",P(-x,-y),[[P(-x,y),"conf"],[P(x,-y),"conf"],[P(-y,-x),"inv"]],{},"Symétrie de centre O : on change les deux signes.");
  if(t===2){var dx=rnd(r,1,5)*pick(r,[1,-1]),dy=rnd(r,1,4)*pick(r,[1,-1]);
    return Q(r,"On translate "+M("A")+P(x,y)+" de "+Math.abs(dx)+" unité"+(Math.abs(dx)>1?"s":"")+" vers la "+(dx>0?"droite":"gauche")+" et de "+Math.abs(dy)+" vers le "+(dy>0?"haut":"bas")+". Coordonnées de l’image ?",P(x+dx,y+dy),[[P(x-dx,y-dy),"signe"],[P(x+dy,y+dx),"conf"],[P(dx,dy),"conf"]],{},
      "Translation : on ajoute "+fm(dx,0)+" à l’abscisse et "+fm(dy,0)+" à l’ordonnée : "+P(x+dx,y+dy)+".");}
  if(t===3)return QA(r,"Associe chaque transformation à son effet.",[["symétrie axiale","effet miroir par rapport à une droite"],["translation","fait glisser sans tourner"],["rotation","fait tourner autour d’un point"],["homothétie de rapport 2","agrandit la figure"]],"Symétries, translations et rotations conservent les longueurs et les angles ; une homothétie de rapport 2 double les longueurs.");
  var v=r()<0.5;
  return VF(r,v?"Une symétrie, une translation ou une rotation conserve les longueurs et les aires.":"Un agrandissement de rapport 2 multiplie les aires par 2.",v,v?"Vrai : la figure image est superposable à la figure de départ.":"Faux : les longueurs sont multipliées par 2, les aires par "+M("2^2 = 4")+".");
});
var ANG=[[30,"\\dfrac{\\pi}{6}"],[45,"\\dfrac{\\pi}{4}"],[60,"\\dfrac{\\pi}{3}"],[90,"\\dfrac{\\pi}{2}"],[180,"\\pi"],[120,"\\dfrac{2\\pi}{3}"],[360,"2\\pi"],[150,"\\dfrac{5\\pi}{6}"]];
reg("trigo_cercle",["1re"],C_TRI,"Cercle trigonométrique, radians, cosinus et sinus",["cercle trigonométrique","radian","cosinus","sinus","angle"],2,function(r){
  var t=rnd(r,0,5);
  if(t===0){var a=pick(r,ANG);return Q(r,"Convertir "+a[0]+"° en radians.",M(a[1]),pickN(r,ANG.filter(function(x){return x!==a;}),3).map(function(x){return [M(x[1]),"conf"];}),{},M("180^\\circ = \\pi")+" rad, donc "+M(a[0]+"^\\circ = "+a[0]+" \\times \\dfrac{\\pi}{180} = "+a[1])+" rad.");}
  if(t===1)return QA(r,"Associe chaque angle en degrés à sa mesure en radians.",pickN(r,ANG,4).map(function(x){return [x[0]+"°",M(x[1])];}),"On multiplie par "+M("\\dfrac{\\pi}{180}")+" : 90° = "+M("\\dfrac{\\pi}{2}")+", 180° = "+M("\\pi")+".");
  if(t===2){var c=pick(r,[["\\cos\\dfrac{\\pi}{3}","\\dfrac{1}{2}"],["\\sin\\dfrac{\\pi}{6}","\\dfrac{1}{2}"],["\\cos 0","1"],["\\sin\\dfrac{\\pi}{2}","1"],["\\cos\\pi","-1"],["\\sin\\pi","0"],["\\cos\\dfrac{\\pi}{2}","0"],["\\sin\\dfrac{\\pi}{3}","\\dfrac{\\sqrt{3}}{2}"]]),all=["\\dfrac{1}{2}","1","-1","0","\\dfrac{\\sqrt{3}}{2}","\\dfrac{\\sqrt{2}}{2}"].filter(function(x){return x!==c[1];});
    return Q(r,"Que vaut "+M(c[0])+" ?",M(c[1]),pickN(r,all,3).map(function(x){return [M(x),"conf"];}),{},"On lit sur le cercle trigonométrique : "+M(c[0]+" = "+c[1])+" (cos = abscisse du point, sin = ordonnée).");}
  if(t===3){var c4=pick(r,[["\\dfrac{\\pi}{2}","(0\\,;\\,1)"],["\\pi","(-1\\,;\\,0)"],["0","(1\\,;\\,0)"],["\\dfrac{3\\pi}{2}","(0\\,;\\,-1)"]]),all4=["(0\\,;\\,1)","(-1\\,;\\,0)","(1\\,;\\,0)","(0\\,;\\,-1)"].filter(function(x){return x!==c4[1];});
    return Q(r,"Sur le cercle trigonométrique, quelles sont les coordonnées du point associé au réel "+M(c4[0])+" ?",M(c4[1]),all4.map(function(x){return [M(x),"conf"];}),{},"Le point associé à x a pour coordonnées "+M("(\\cos x\\,;\\,\\sin x)")+".");}
  if(t===4){var c5=pick(r,[["\\dfrac{2\\pi}{3}",120],["\\dfrac{3\\pi}{4}",135],["\\dfrac{\\pi}{5}",36],["\\dfrac{5\\pi}{6}",150],["\\dfrac{\\pi}{9}",20]]);
    return Q(r,"Convertir "+M(c5[0])+" rad en degrés.",c5[1],[[rd(c5[1]/3.14,2),"conf"],[c5[1]*2,"demi"],[180-c5[1],"compl"]],{u:"°",d:2},"On remplace π par 180° : "+M(c5[0]+" = "+c5[1]+"^\\circ")+".");}
  var v=r()<0.5;return VF(r,v?"Pour tout réel x, "+M("\\cos^2 x + \\sin^2 x = 1")+".":"Il existe un réel x tel que "+M("\\cos x = 1{,}5")+".",v,v?"Vrai : c’est Pythagore dans le cercle de rayon 1.":"Faux : le cosinus est toujours compris entre −1 et 1.");
});
reg("sinus_fn",["1re","term"],C_TRI,"Fonctions sinusoïdales : amplitude, période, fréquence",["sinus","cosinus","période","fréquence","amplitude","signal"],3,function(r){
  var t=rnd(r,0,3);
  if(t===0){var A=pick(r,[2,3,5,230]),w=pick(r,[2,3,4]),ask=r()<0.5;
    return Q(r,M("f(t) = "+A+"\\sin("+w+"t)")+". Quelle est "+(ask?"son amplitude":"sa période")+" ?",ask?String(A):M("\\dfrac{2\\pi}{"+w+"}"),ask?[[String(w),"conf"],[String(2*A),"demi"],[M("\\dfrac{2\\pi}{"+w+"}"),"conf"]]:[[M("2\\pi"),"demi"],[M(String(w)),"conf"],[M("\\dfrac{"+w+"}{2\\pi}"),"inv"]],{},
      ask?"L’amplitude est le coefficient devant le sinus : "+A+".":"Période "+M("T = \\dfrac{2\\pi}{\\omega} = \\dfrac{2\\pi}{"+w+"}")+".");}
  if(t===1){var Um=pick(r,[325,311,12]),fq=pick(r,[50,100,25]),T=rd(1/fq,4);
    return Q(r,"Une tension s’écrit "+M("u(t) = "+Um+"\\sin(2\\pi \\times "+fq+"t)")+". Quelle est sa période ?",f(T,4)+" s",[[fq+" s","inv"],[f(rd(1/(2*fq),4),4)+" s","demi"],[Um+" s","conf"]],{},M("T = \\dfrac{1}{f} = \\dfrac{1}{"+fq+"} = "+fm(T,4))+" s.");}
  if(t===2){var A2=pick(r,[1,2,3]),T2=pick(r,[2,4]),pts=[];for(var x=0;x<=8.001;x+=0.1)pts.push([rd(x,2),rd(A2*Math.sin(2*Math.PI*x/T2),3)]);var ask2=r()<0.5;
    return Q(r,"Lire "+(ask2?"l’amplitude":"la période")+" de ce signal.",ask2?A2:T2,ask2?[[2*A2,"lect"],[T2,"conf"],[A2+1,"lect"]]:[[T2/2,"lect"],[A2,"conf"],[2*T2,"lect"]],{d:2,fig:{k:"graph",xr:[0,8],yr:[-4,4],pts:pts,xn:"t",yn:"f(t)"}},
      ask2?"L’amplitude est la hauteur maximale : "+A2+".":"La courbe se répète tous les "+T2+" : c’est la période.");}
  var v=r()<0.5;return VF(r,v?"Pour tout réel x, "+M("\\sin(x + 2\\pi) = \\sin x")+".":"La fonction sinus est croissante sur "+M("\\mathbb{R}")+".",v,v?"Vrai : sinus et cosinus sont périodiques de période "+M("2\\pi")+".":"Faux : elle oscille entre −1 et 1 (croissante puis décroissante, périodiquement).");
});

/* — Fonctions (1re, Tle) — */
function parab(a,h,k){var p=[];for(var x=-3;x<=5.001;x+=0.25){var y=a*(x-h)*(x-h)+k;if(y>-5.6&&y<6.6)p.push([x,rd(y,3)]);}return p;}
reg("resol_graph",["1re"],C_FN,"Résoudre graphiquement f(x) = k, f(x) ≤ k, f(x) = g(x)",["résolution graphique","équation","inéquation","courbe","lecture"],2,function(r){
  var t=rnd(r,0,3),h=rnd(r,0,2),d=pick(r,[1,2]),k0=rnd(r,-4,-1),k=k0+d*d,fig={k:"graph",xr:[-3,5],yr:[-5,6],curves:[parab(1,h,k0),[[-3,k],[5,k]]],names:[[h+0.6,-4.6,"Cf",0],[4.5,k+0.6,"y = "+k,2]]};
  var S=function(a,b){return M("x = "+a+"\\ \\text{ou}\\ x = "+b);};
  if(t===0)return Q(r,"Résoudre graphiquement "+M("f(x) = "+k)+".",S(h-d,h+d),[[M("x = "+k),"lect"],[M("x = "+h),"lect"],[S(k0,k),"lect"]].filter(function(w){return w[0]!==S(h-d,h+d);}),{fig:fig},
    "On cherche les abscisses des points d’intersection de la courbe avec la droite y = "+k+" : x = "+(h-d)+" et x = "+(h+d)+".");
  if(t===1){var le=r()<0.5;
    return Q(r,"Résoudre graphiquement "+M("f(x) "+(le?"\\leq":"\\geq")+" "+k)+".",le?itv(h-d,h+d):M("]-\\infty\\,;\\,"+(h-d)+"] \\cup ["+(h+d)+"\\,;\\,+\\infty["),
      [[le?M("]-\\infty\\,;\\,"+(h-d)+"] \\cup ["+(h+d)+"\\,;\\,+\\infty["):itv(h-d,h+d),"signe"],[le?itv(h-d,h+d,true,true):M("]-\\infty\\,;\\,"+(h-d)+"[ \\cup ]"+(h+d)+"\\,;\\,+\\infty["),"conf"],[itv(k0,k),"lect"]],{fig:fig},
      "On garde les x pour lesquels la courbe est "+(le?"EN DESSOUS":"AU-DESSUS")+" de la droite (bornes comprises car l’inégalité est large).");}
  var a1=pick(r,[1,2,-1]),b1=rnd(r,-2,2),a2=pick(r,[-1,0.5,-2]),x0=rnd(r,-1,3),b2=a1*x0+b1-a2*x0;if(a1===a2)return null;var y0=a1*x0+b1;if(y0<-4||y0>5)return null;
  var fg={k:"graph",xr:[-3,5],yr:[-5,6],curves:[[[-3,-3*a1+b1],[5,5*a1+b1]],[[-3,-3*a2+b2],[5,5*a2+b2]]],names:[[4.4,Math.max(-4.5,Math.min(5.5,4.4*a1+b1))+0.6,"Cf",0],[-2.4,Math.max(-4.5,Math.min(5.5,-2.4*a2+b2))+0.6,"Cg",2]]};
  if(t===2)return Q(r,"Résoudre graphiquement "+M("f(x) = g(x)")+".",M("x = "+x0),[[M("x = "+y0),"lect"],[M("y = "+y0),"conf"],[M("x = "+(x0+1)),"lect"]].filter(function(w){return w[0]!==M("x = "+x0);}),{fig:fg},
    "Les droites se coupent au point ("+x0+" ; "+y0+") : la solution est l’ABSCISSE, x = "+x0+".");
  var sup=a1>a2;
  return Q(r,"Résoudre graphiquement "+M("f(x) > g(x)")+".",sup?itv(x0,Infinity,true,true):itv(-Infinity,x0,true,true),[[sup?itv(-Infinity,x0,true,true):itv(x0,Infinity,true,true),"signe"],[sup?itv(x0,Infinity,false,true):itv(-Infinity,x0,true,false),"conf"],[itv(y0,Infinity,true,true),"lect"]],{fig:fg},
    "Cf est au-dessus de Cg "+(sup?"à droite":"à gauche")+" du point d’intersection (x = "+x0+"), qui est exclu (inégalité stricte).");
});
reg("poly2",["1re"],C_FN,"Second degré : racines, discriminant, sommet, signe",["second degré","racines","discriminant","Δ","sommet","signe"],3,function(r){
  var t=rnd(r,0,5),x1=rnd(r,-4,3),x2=x1+rnd(r,1,5),a=pick(r,[1,2,-1,3]),R=function(p,q){return M(fm(p)+"\\ \\text{et}\\ "+fm(q));},fac=function(a,p,q){var s=function(v){return v===0?"x":"(x "+(v<0?"+ ":"- ")+Math.abs(v)+")";};return (a===1?"":a===-1?"-":a)+s(p)+s(q);};
  if(t===0)return Q(r,"Quelles sont les racines de "+M("f(x) = "+fac(a,x1,x2))+" ?",R(x1,x2),[[R(-x1,-x2),"signe"],[R(a,x1),"conf"],[R(x1,-x2),"signe"]].filter(function(w){return w[0]!==R(x1,x2);}),{},
    "Un produit est nul si l’un de ses facteurs est nul : "+M("x - "+par(x1)+" = 0")+" ou "+M("x - "+par(x2)+" = 0")+", donc x = "+x1+" ou x = "+x2+".");
  var b=-(x1+x2),c=x1*x2;
  if(t===1){if(b===0||c===0)return null;var D=b*b-4*c;return Q(r,"Calculer le discriminant de "+M("x^2 "+(b<0?"- ":"+ ")+Math.abs(b)+"x "+(c<0?"- ":"+ ")+Math.abs(c))+".",D,[[b*b+4*c,"signe"],[b*b,"demi"],[b-4*c,"formule"]],{d:0},M("\\Delta = b^2 - 4ac = "+par(b)+"^2 - 4 \\times 1 \\times "+par(c)+" = "+D)+".");}
  if(t===2){var Dv=pick(r,[-8,-3,0,5,16]),n=Dv>0?2:Dv===0?1:0;return Q(r,"Le discriminant d’un polynôme du second degré vaut "+M("\\Delta = "+Dv)+". Combien l’équation "+M("f(x) = 0")+" a-t-elle de solutions ?",n,[0,1,2,3].filter(function(x){return x!==n;}).map(function(x){return [x,"conf"];}),{d:0},"Δ > 0 : deux solutions ; Δ = 0 : une solution ; Δ < 0 : aucune solution réelle.");}
  if(t===3){var h=rnd(r,-3,4),bb=-2*h*a,cc=rnd(r,-5,5);if(bb===0)return null;return Q(r,"Abscisse du sommet de la parabole de "+M("f(x) = "+(a===1?"":a===-1?"-":a)+"x^2 "+(bb<0?"- ":"+ ")+Math.abs(bb)+"x "+(cc<0?"- ":"+ ")+Math.abs(cc))+" ?",h,[[-h,"signe"],[rd(-bb/a,2),"demi"],[cc,"conf"]],{d:2},M("x_S = -\\dfrac{b}{2a} = -\\dfrac{"+bb+"}{2 \\times "+par(a)+"} = "+h)+".");}
  if(t===4){var neg=r()<0.5,A=neg?-1:1;return Q(r,M("f(x) = "+fac(A,x1,x2))+". Sur quel ensemble a-t-on "+M("f(x) > 0")+" ?",neg?itv(x1,x2,true,true):M("]-\\infty\\,;\\,"+x1+"[ \\cup ]"+x2+"\\,;\\,+\\infty["),[[neg?M("]-\\infty\\,;\\,"+x1+"[ \\cup ]"+x2+"\\,;\\,+\\infty["):itv(x1,x2,true,true),"signe"],[itv(x1,x2),"conf"],[itv(-x2,-x1,true,true),"signe"]],{},
    "f est du signe de a ("+(neg?"négatif":"positif")+") à l’extérieur des racines et du signe contraire entre elles.");}
  return QA(r,"Associe chaque cas à l’allure de la parabole.",[["a > 0 et Δ > 0","vers le haut, coupe l’axe 2 fois"],["a < 0 et Δ = 0","vers le bas, touche l’axe 1 fois"],["a > 0 et Δ < 0","vers le haut, ne coupe pas l’axe"],["a < 0 et Δ > 0","vers le bas, coupe l’axe 2 fois"]],"Le signe de a donne l’orientation ; le signe de Δ donne le nombre de points communs avec l’axe des abscisses.");
});
reg("poly3",["term"],C_FN,"Fonctions polynômes de degré 3",["degré 3","cube","racine cubique","dérivée","variations"],3,function(r){
  var t=rnd(r,0,4);
  if(t===0){var a=rnd(r,1,4),b=rnd(r,2,6),c=rnd(r,1,9),T=function(s){return M(s);};
    return Q(r,"Dériver "+M("f(x) = "+(a===1?"":a)+"x^3 - "+b+"x^2 + "+c),T("f'(x) = "+(3*a)+"x^2 - "+(2*b)+"x"),[[T("f'(x) = "+(3*a)+"x^2 - "+(2*b)+"x + "+c),"demi"],[T("f'(x) = "+(a===1?"":a)+"x^2 - "+b+"x"),"demi"],[T("f'(x) = "+(3*a)+"x^3 - "+(2*b)+"x^2"),"formule"]],{},
      M("(x^3)' = 3x^2")+", "+M("(x^2)' = 2x")+" et la dérivée d’une constante est 0.");}
  if(t===1){var n=pick(r,[2,3,4,5,10]),k=n*n*n;return Q(r,"Résoudre "+M("x^3 = "+k)+".",n,[[rd(k/3,2),"conf"],[rd(Math.sqrt(k),2),"conf"],[n*n,"demi"]],{d:2},"La solution est la racine cubique : "+M("x = \\sqrt[3]{"+k+"} = "+n)+" car "+M(n+"^3 = "+k)+".");}
  if(t===2){var c2=pick(r,[3,4,5,6]),V=c2*c2*c2;return Q(r,"Un cube a un volume de "+V+" cm³. Quelle est la longueur de son arête ?",c2,[[rd(V/3,2),"conf"],[rd(V/6,2),"conf"],[rd(Math.sqrt(V),2),"conf"]],{u:"cm",d:2},M("a^3 = "+V)+" donc "+M("a = \\sqrt[3]{"+V+"} = "+c2)+" cm.");}
  if(t===3){var p=pick(r,[1,2,3]),k3=3*p*p;return Q(r,M("f(x) = x^3 - "+k3+"x")+". Pour quelles valeurs de x a-t-on "+M("f'(x) = 0")+" ?",M("x = -"+p+"\\ \\text{ou}\\ x = "+p),[[M("x = "+p),"demi"],[M("x = -"+(p*p)+"\\ \\text{ou}\\ x = "+(p*p)),"conf"],[M("x = 0"),"conf"]],{},
    M("f'(x) = 3x^2 - "+k3+" = 0 \\iff x^2 = "+(p*p))+", donc "+M("x = -"+p)+" ou "+M("x = "+p)+" (là où f change de sens).");}
  var N=pick(r,[20,50,100,200,500]),ok=Math.cbrt(N);
  return QE(r,"Estime "+M("\\sqrt[3]{"+N+"}")+" avec le curseur.",ok,{min:0,max:Math.ceil(ok+2),tol:0.2},M("\\sqrt[3]{"+N+"} \\approx "+fm(ok,2))+" : "+M(Math.floor(ok)+"^3 = "+Math.pow(Math.floor(ok),3))+" et "+M(Math.ceil(ok)+"^3 = "+Math.pow(Math.ceil(ok),3))+".");
});
reg("exp_log",["term"],C_FN,"Exponentielles et logarithme décimal",["exponentielle","logarithme","log","puissance","croissance"],3,function(r){
  var t=rnd(r,0,6);
  if(t===0){var e=pick(r,[2,3,4,-1,-2,-3]),v=Math.pow(10,e);return Q(r,"Que vaut "+M("\\log("+fm(v,4)+")")+" ?",e,[[-e,"signe"],[v/10,"conf"],[e+1,"calc"]].filter(function(w){return w[0]!==e;}),{d:4},M("\\log(10^{"+e+"}) = "+e)+" : le log décimal « compte » les puissances de 10.");}
  if(t===1){var all=[["log 1","0"],["log 10","1"],["log 100","2"],["log 0,1","−1"],["log 1 000","3"],["log 0,01","−2"]];return QA(r,"Associe chaque logarithme décimal à sa valeur.",pickN(r,all,4),M("\\log(10^n) = n")+" : log 1 = 0 car "+M("10^0 = 1")+".");}
  if(t===2)return Q(r,"Pour a > 0 et b > 0, "+M("\\log(a \\times b)")+" est égal à…",M("\\log a + \\log b"),[[M("\\log a \\times \\log b"),"conf"],[M("\\log(a + b)"),"conf"],[M("\\log a - \\log b"),"signe"]],{},"Le logarithme transforme les produits en sommes. C’est ce qui en fait un outil pour les grandeurs très étendues (décibels, pH…).");
  if(t===3){var k=pick(r,[2,5,20,50,300]),ok=rd(Math.log(k)/Math.LN10,3);return Q(r,"Résoudre "+M("10^x = "+k)+" (au millième).",ok,[[rd(k/10,3),"conf"],[rd(Math.log(k),3),"conf"],[rd(Math.sqrt(k),3),"conf"]],{d:3},M("x = \\log "+k+" \\approx "+fm(ok,3))+" (touche log de la calculatrice).");}
  if(t===4){var c=pick(r,[2,3,5]),q=pick(r,[1.5,2,1.2]),x=pick(r,[2,3]),ok2=rd(c*Math.pow(q,x),3);return Q(r,M("f(x) = "+c+" \\times "+fm(q)+"^x")+". Calculer "+M("f("+x+")")+".",ok2,[[rd(Math.pow(c*q,x),3),"ordre"],[rd(c*q*x,3),"conf"],[rd(c+Math.pow(q,x),3),"addp"]],{d:3},M("f("+x+") = "+c+" \\times "+fm(q)+"^"+x+" = "+c+" \\times "+fm(rd(Math.pow(q,x),3))+" = "+fm(ok2,3))+". On calcule la puissance AVANT de multiplier.");}
  if(t===5){var g=pick(r,[3,5,8]),n=1;while(Math.pow(1+g/100,n)<2)n++;return Q(r,"Une population augmente de "+g+" % par an. Au bout de combien d’années (entières) aura-t-elle doublé ?",n,[[Math.ceil(100/g),"addp"],[n-1,"arr"],[2*n,"calc"]].filter(function(w){return w[0]!==n;}),{d:0,u:"ans"},
    "On résout "+M(fm(1+g/100)+"^n \\geq 2")+" : "+M("n \\geq \\dfrac{\\log 2}{\\log "+fm(1+g/100)+"} \\approx "+fm(rd(Math.log(2)/Math.log(1+g/100),2)))+", donc "+n+" ans.");}
  var q2=pick(r,[0.8,0.5,0.95]);return VF(r,"La fonction "+M("x \\mapsto "+fm(q2)+"^x")+" est croissante.",false,"Faux : avec une base entre 0 et 1, la fonction exponentielle est DÉCROISSANTE (décroissance, refroidissement, dépréciation…).");
});

/* — Nombres (3ᵉ PM, CAP) — */
reg("diviseurs",["3pm","cap"],C_CALC,"Multiples, diviseurs, nombres premiers",["diviseur","multiple","nombre premier","divisibilité","décomposition"],2,function(r){
  var t=rnd(r,0,5);
  if(t===0){var n=pick(r,[36,48,60,72,84,90,96]),ds=[],nd=[];for(var i=5;i<n;i++){if(n%i===0)ds.push(i);else nd.push(i);}var ok=pick(r,ds.filter(function(x){return x<n/2+1;}));
    return Q(r,"Lequel de ces nombres est un diviseur de "+n+" ?",ok,pickN(r,nd.filter(function(x){return x<n/2&&x>4;}),3).map(function(x){return [x,"calc"];}),{d:0},M(n+" = "+ok+" \\times "+(n/ok))+" : "+ok+" divise "+n+".");}
  if(t===1){var p=pick(r,[17,19,23,29,31,37,41,43]);return Q(r,"Lequel de ces nombres est premier ?",p,pickN(r,[21,27,33,39,49,51,57,91,15,35,77],3).map(function(x){return [x,"conf"];}),{d:0},
    p+" n’a que deux diviseurs : 1 et lui-même. Les autres se décomposent (ex. 51 = 3 × 17, 91 = 7 × 13).");}
  if(t===2){var d=pick(r,[3,9]),base=rnd(r,1000,9999),ok2=r()<0.5,n2=ok2?base-base%d:base-base%d+pick(r,[1,2]);var s=String(n2).split("").reduce(function(a,c){return a+(+c);},0);
    return VF(r,f(n2,0)+" est divisible par "+d+".",n2%d===0,"Somme des chiffres : "+String(n2).split("").join(" + ")+" = "+s+(s%d===0?", divisible par "+d+" : vrai.":", pas divisible par "+d+" : faux."));}
  if(t===3){var c=pick(r,[[60,"2^2 \\times 3 \\times 5",["4 \\times 15","2 \\times 30","2 \\times 3 \\times 10"]],[36,"2^2 \\times 3^2",["4 \\times 9","6 \\times 6","2 \\times 18"]],[84,"2^2 \\times 3 \\times 7",["4 \\times 21","2 \\times 42","12 \\times 7"]],[90,"2 \\times 3^2 \\times 5",["9 \\times 10","3 \\times 30","2 \\times 45"]]]);
    return Q(r,"Quelle est la décomposition de "+c[0]+" en produit de facteurs premiers ?",M(c[1]),c[2].map(function(x){return [M(x),"form"];}),{},"Tous les facteurs doivent être PREMIERS (2, 3, 5, 7…) : "+M(c[0]+" = "+c[1])+".");}
  if(t===4){var k=pick(r,[6,7,8,9]),N=pick(r,[50,60,100]),ok3=Math.floor(N/k);return Q(r,"Combien y a-t-il de multiples de "+k+" entre 1 et "+N+" ?",ok3,[[ok3+1,"calc"],[N-k,"addp"],[rd(N/k,2),"arr"]],{d:2},M(N+" \\div "+k+" \\approx "+fm(rd(N/k,2)))+" : "+k+", "+2*k+", …, "+ok3*k+", soit "+ok3+" multiples.");}
  var a=pick(r,[24,36,48]),b=pick(r,[18,30,42,60]),g=gcd(a,b);if(g<4)return null;
  return Q(r,"Un boulanger répartit "+a+" croissants et "+b+" pains au chocolat dans des sachets identiques, sans reste. Combien de sachets au maximum ?",g,[[a+b,"addp"],[gcd(a,b)/2,"demi"],[a*b/g,"conf"]],{d:0},
    "On cherche le plus grand diviseur commun à "+a+" et "+b+" : "+g+". Chaque sachet contient "+a/g+" croissants et "+b/g+" pains au chocolat.");
});
