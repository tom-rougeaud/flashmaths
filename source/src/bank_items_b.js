/* ═════════ 1ʳᵉ BAC PRO ═════════ */
var C_EVOL="Évolutions et calcul économique",C_SP="Statistiques et probabilités",C_FN="Fonctions numériques",C_GP="Géométrie plane";
function sgp(v){return sg(v,2)+" %";}

reg("evol_succ",["1re"],C_EVOL,"Évolutions successives",["évolutions successives","coefficient global","pourcentages composés"],3,function(r){
  var p1=pick(r,[10,20,25,30,50]),p2=pick(r,[10,20,25,30,40]),up2=r()<0.5,cg=(1+p1/100)*(up2?1+p2/100:1-p2/100),ok=rd((cg-1)*100,2);
  return Q(r,"Une valeur augmente de "+p1+" % puis "+(up2?"augmente":"diminue")+" de "+p2+" %. Quelle est l’évolution globale ?",ok,
    [[up2?p1+p2:p1-p2,"addp"],[rd(((1+p1/100)*(up2?1-p2/100:1+p2/100)-1)*100,2),"signe"],[(p1+(up2?p2:-p2))/2,"conf"],[up2?p1*p2/100:-p1*p2/100,"conf"],[-ok,"signe"]],{F:sgp,nu:"%",d:2},
    "Coefficient global "+M(fm(1+p1/100)+" \\times "+fm(up2?1+p2/100:1-p2/100)+" = "+fm(cg,4))+", soit "+sgp(ok)+". Les taux ne s’additionnent pas.");
});
reg("taux_moyen",["1re"],C_EVOL,"Taux d’évolution moyen",["taux moyen","coefficient","racine","évolution globale"],3,function(r){
  var q=pick(r,[1.1,1.2,1.05,1.5,0.9,1.02,1.03,1.04,0.95,0.8,1.25]),n=pick(r,[2,3,4,5]),cg=Math.pow(q,n),glob=rd((cg-1)*100,2),ok=rd((q-1)*100,2);
  return Q(r,"Une valeur a évolué de "+sgp(glob)+" en "+n+" ans. Quel est le taux d’évolution annuel moyen ?",ok,
    [[rd(glob/n,2),"addp"],[glob,"conf"],[rd(ok*n,2),"addp"],[-ok,"signe"]],{F:sgp,nu:"%",d:2},
    "Coefficient global "+M(fm(cg,4)+" = q^{"+n+"}")+", donc "+M("q = "+fm(q,2))+" : taux annuel "+sgp(ok)+". Diviser le taux global par "+n+" est faux.");
});
reg("indices",["1re"],C_EVOL,"Indices en base 100",["indice","base 100","évolution","IPC"],2,function(r){
  var t=rnd(r,0,2);
  if(t===0){var I=pick(r,[80,90,110,115,125,140,150]),ok=I-100;
    return Q(r,"L’indice d’un prix passe de 100 (année de base) à "+I+". Quelle est l’évolution du prix depuis la base ?",ok,
      [[I,"conf"],[100-I,"signe"],[I/100,"pct0"],[ok/2,"calc"]],{F:sgp,nu:"%"},
      "Indice "+I+" signifie "+M("\\times "+fm(I/100))+", soit "+sgp(ok)+".");}
  if(t===1){var P=pick(r,[80,120,150,200,250]),I2=pick(r,[110,115,120,125,140]),ok2=P*I2/100;
    return Q(r,"Un produit coûte "+f(P)+" € en base 100. Quel est son prix quand l’indice vaut "+I2+" ?",ok2,
      [[P+I2-100,"addp"],[P/(I2/100),"inv"],[P*(I2-100)/100,"conf"],[P*I2,"pct0"]],{u:"€",d:2},
      "Prix "+M("= "+fm(P)+" \\times "+fm(I2/100)+" = "+fm(ok2))+" €.");}
  var v1=pick(r,[40,50,80,125,200]),k=pick(r,[1.2,1.5,0.8,1.25,0.6]),v2=v1*k,ok3=100*k;
  return Q(r,"Une valeur passe de "+f(v1)+" à "+f(v2)+". Quel est l’indice de "+f(v2)+" (base 100 pour "+f(v1)+") ?",ok3,
    [[v2-v1,"conf"],[v1/v2*100,"inv"],[(k-1)*100,"conf"],[100+v2-v1,"addp"]],{d:2},
    "Indice "+M("= \\dfrac{"+fm(v2)+"}{"+fm(v1)+"} \\times 100 = "+fm(ok3))+".");
});
reg("evol_reciproque",["1re"],C_EVOL,"Évolution réciproque",["réciproque","hausse puis baisse","coefficient inverse"],3,function(r){
  var pairs=[[25,20],[100,50],[150,60],[300,75],[400,80],[20,16.67],[50,33.33],[60,37.5],[10,9.09],[5,4.76],[40,28.57],[200,66.67],[11.11,10],[66.67,40]],pr=pick(r,pairs),up=r()<0.5;
  var given=up?pr[0]:pr[1],ok=up?pr[1]:pr[0],ok1=up?-ok:ok;
  return Q(r,"Une valeur "+(up?"augmente":"diminue")+" de "+f(given)+" %. Quelle évolution la ramène à sa valeur de départ ?",ok1,
    [[up?-given:given,"conf"],[up?ok:-ok,"signe"],[up?-(100-given):(100-given),"compl"],[up?-(given-5):(given+5),"calc"]],{F:sgp,nu:"%",d:2},
    "Coefficient aller "+f(up?1+given/100:1-given/100,3)+", donc retour "+M("\\times "+fm(up?1/(1+given/100):1/(1-given/100),3))+", soit "+sgp(ok1)+".");
});

reg("ajustement",["1re"],C_SP,"Droite d’ajustement et estimation",["nuage de points","droite d’ajustement","estimation","statistiques à deux variables"],2,function(r){
  var a=pick(r,[1.5,2,2.5,3,0.5,4]),b=rnd(r,5,40),x=rnd(r,4,15),ok=a*x+b;
  return Q(r,"Une droite d’ajustement a pour équation "+M("y = "+fm(a)+"x + "+b)+". Estimer "+M("y")+" pour "+M("x = "+x)+".",ok,
    [[a*x,"formule"],[a*(x+b),"ordre"],[b*x+a,"conf"],[a+x+b,"addp"]],{d:2},
    M("y = "+fm(a)+" \\times "+x+" + "+b+" = "+fm(ok))+".");
});
reg("proba_arbre",["1re"],C_SP,"Probabilités : arbre pondéré",["probabilité","arbre","complémentaire","intersection"],2,function(r){
  var t=rnd(r,0,2);
  if(t===0){var p=pick(r,[0.2,0.3,0.4,0.6,0.7]);
    return Q(r,M("P(A) = "+fm(p))+". Quelle est la probabilité de l’événement contraire "+M("\\bar{A}")+" ?",rd(1-p,2),[[p,"conf"],[rd(p-1,2),"signe"],[rd(1/p,3),"inv"],[rd(p/2,3),"demi"]],{d:3},M("P(\\bar{A}) = 1 - "+fm(p)+" = "+fm(1-p))+".");}
  var pa=pick(r,[0.2,0.4,0.5,0.6,0.8]),pb=pick(r,[0.25,0.5,0.75,0.4,0.2]),ok=rd(pa*pb,3);
  return Q(r,"Dans un arbre : "+M("P(A) = "+fm(pa))+" et "+M("P_A(B) = "+fm(pb))+". Que vaut "+M("P(A \\cap B)")+" ?",ok,
    [[rd(pa+pb,3),"addp"],[rd(pa/pb,3),"inv"],[pb,"conf"],[rd(pa*(1-pb),3),"conf"]],{d:3},
    "On multiplie le long des branches : "+M(fm(pa)+" \\times "+fm(pb)+" = "+fm(ok,3))+".");
});
reg("proba_simple",["1re","term"],C_SP,"Probabilité d’un événement (urne, tirage)",["probabilité","urne","tirage","événement"],1,function(r){
  var N=pick(r,[10,20,25,40]),v=rnd(r,2,N/2),ro=rnd(r,1,N-v-1),ok=v/N;
  return Q(r,"Un sac contient "+ro+" boules rouges, "+v+" vertes et "+(N-v-ro)+" bleues. On tire une boule au hasard. Probabilité qu’elle soit verte ?",ok,
    [[v/(N-v),"formule"],[ro/N,"conf"],[v/ro,"formule"],[v,"formule"]],{d:3},
    M("P = \\dfrac{\\text{cas favorables}}{\\text{cas possibles}} = \\dfrac{"+v+"}{"+N+"} = "+fm(ok,3))+".");
});

reg("carre_valeurs",["1re"],C_FN,"Fonction carré : calculer une image",["fonction carré","x²","image","signe"],2,function(r){
  var a=rnd(r,1,4),b=rnd(r,-6,8),x=rnd(r,-5,5);if(x===0)x=3;
  var ok=a*x*x+b;
  return Q(r,M("f(x) = "+(a===1?"":a)+"x^2"+(b===0?"":(b<0?" - ":" + ")+Math.abs(b)))+". Calculer "+M("f("+fm(x)+")")+".",ok,
    [[(a*x)*(a*x)+b,"ordre"],[-a*x*x+b,"signe"],[2*a*x+b,"demi"],[a*x+b,"demi"],[a*x*x-b,"signe"],[a*x*x,"calc"]],{d:0},
    M("f("+fm(x)+") = "+a+" \\times "+par(x)+"^2 "+(b<0?"- ":"+ ")+Math.abs(b)+" = "+fm(ok))+".");
});
reg("racine_inverse",["1re"],C_FN,"Fonctions racine carrée et inverse",["racine carrée","fonction inverse","1/x"],2,function(r){
  if(r()<0.5){var n=rnd(r,4,15);
    return Q(r,M("f(x) = \\sqrt{x}")+". Calculer "+M("f("+n*n+")")+".",n,[[n*n/2,"demi"],[n*n*n*n,"conf"],[n+1,"calc"],[n-1,"calc"]],{d:0},M("\\sqrt{"+n*n+"} = "+n)+".");}
  var x=pick(r,[2,4,5,8,10,20,25,0.5,0.25,0.2,40,50,100]),ok=1/x;
  return Q(r,M("f(x) = \\dfrac{1}{x}")+". Calculer "+M("f("+fm(x)+")")+".",ok,[[x,"inv"],[-ok,"signe"],[ok*10,"unit"],[1-ok,"conf"]],{d:3},
    M("f("+fm(x)+") = \\dfrac{1}{"+fm(x)+"} = "+fm(ok,3))+".");
});
reg("seuil_rentab",["1re"],C_FN,"Seuil de rentabilité (modèle affine)",["coût","recette","bénéfice","seuil de rentabilité","modélisation"],3,function(r,c){
  var m=cm(r,c),x0=pick(r,[10,20,25,40,50]),d=pick(r,[2,3,4,5]),a=pick(r,[3,4,6,8]),p=a+d,F=x0*d;
  return Q(r,"Pour fabriquer des "+RENT[m]+" : "+F+" € de coûts fixes et "+a+" € par unité. Chaque unité est vendue "+p+" €. Pour combien d’unités le bénéfice est-il nul ?",x0,
    [[F/p,"formule"],[F/a,"formule"],[F*d,"inv"],[F/(p+a),"signe"]],{d:2},
    M("C(x) = "+a+"x + "+F)+" et "+M("R(x) = "+p+"x")+". On résout "+M(p+"x = "+a+"x + "+F)+" : "+M(d+"x = "+F)+", donc "+M("x = "+x0)+".");
});

reg("vecteur_coord",["1re"],C_GP,"Coordonnées d’un vecteur",["vecteur","coordonnées","repère"],2,function(r){
  var xa=rnd(r,-5,5),ya=rnd(r,-5,5),xb=rnd(r,-5,6),yb=rnd(r,-5,6);
  var ok=[xb-xa,yb-ya];
  if(ok[0]===0&&ok[1]===0)return null;
  var wr=[[[xa-xb,ya-yb],"signe"],[[xb+xa,yb+ya],"addp"],[[yb-ya,xb-xa],"conf"],[[xb-xa,ya-yb],"signe"]];
  return Q(r,M("A("+fm(xa,0)+"\\,;\\,"+fm(ya,0)+")")+" et "+M("B("+fm(xb,0)+"\\,;\\,"+fm(yb,0)+")")+". Coordonnées du vecteur "+M("\\overrightarrow{AB}")+" ?",ok,wr,{F:function(v){return M("("+fm(v[0],0)+"\\,;\\,"+fm(v[1],0)+")");}},
    M("\\overrightarrow{AB}(x_B - x_A\\,;\\,y_B - y_A) = ("+fm(ok[0],0)+"\\,;\\,"+fm(ok[1],0)+")")+".");
});
reg("norme_vecteur",["1re"],C_GP,"Norme d’un vecteur",["norme","longueur","vecteur","distance"],3,function(r){
  var t=pick(r,TRIP),a=t[0],b=t[1],c=t[2],sa=r()<0.5?-1:1,sb=r()<0.5?-1:1;
  return Q(r,"Le vecteur "+M("\\vec{u}")+" a pour coordonnées "+M("("+fm(sa*a)+"\\,;\\,"+fm(sb*b)+")")+". Quelle est sa norme ?",c,
    [[a+b,"formule"],[a*a+b*b,"formule"],[sa*a+sb*b,"signe"],[c+1,"calc"]],{d:2},
    M("\\|\\vec{u}\\| = \\sqrt{"+a+"^2 + "+b+"^2} = \\sqrt{"+(a*a+b*b)+"} = "+c)+".");
});
reg("milieu",["1re"],C_GP,"Milieu d’un segment",["milieu","coordonnées","segment"],2,function(r){
  var xa=2*rnd(r,-4,4),xb=2*rnd(r,-4,4),ya=2*rnd(r,-4,4),yb=2*rnd(r,-4,4),ok=[(xa+xb)/2,(ya+yb)/2];
  var G=function(v){return M("("+fm(v[0],0)+"\\,;\\,"+fm(v[1],0)+")");};
  return Q(r,M("A("+fm(xa,0)+"\\,;\\,"+fm(ya,0)+")")+" et "+M("B("+fm(xb,0)+"\\,;\\,"+fm(yb,0)+")")+". Coordonnées du milieu de [AB] ?",ok,
    [[[xa+xb,ya+yb],"demi"],[[(xb-xa)/2,(yb-ya)/2],"signe"],[[(xa+xb)/2,(ya-yb)/2],"signe"],[[(ya+yb)/2,(xa+xb)/2],"conf"]],{F:G},
    M("M\\left(\\dfrac{x_A + x_B}{2}\\,;\\,\\dfrac{y_A + y_B}{2}\\right) = ("+fm(ok[0],0)+"\\,;\\,"+fm(ok[1],0)+")")+".");
});

/* ═════════ TERMINALE BAC PRO ═════════ */
var C_DER="Dérivation et optimisation",C_SUI="Suites numériques",C_PRO="Probabilités",C_ESP="Géométrie dans l’espace";

reg("deriv_poly",["term"],C_DER,"Dériver un polynôme du 2nd degré",["dérivée","f’(x)","polynôme","dérivation"],3,function(r){
  var a=rnd(r,1,5),b=rnd(r,-8,8),c=rnd(r,-9,9);if(c===0)c=4;if(b===0)b=3;
  var L=function(p,q){return M(linL(p,q));};
  return Q(r,M("f(x) = "+quadL(a,b,c))+". Que vaut "+M("f'(x)")+" ?",L(2*a,b),
    [[L(a,b),"demi"],[L(2*a,b+c),"conf"],[L(2*a,c),"conf"],[M(quadL(2*a,b,0)),"formule"]],{lit:linE(2*a,b),form:"red"},
    M("(ax^2)' = 2ax")+", "+M("(bx)' = b")+", la constante disparaît : "+M("f'(x) = "+linL(2*a,b))+".");
});
reg("deriv_point",["term"],C_DER,"Nombre dérivé en un point",["nombre dérivé","tangente","pente","dérivée"],3,function(r){
  var a=rnd(r,1,4),b=rnd(r,-6,6),c=rnd(r,-5,5),k=rnd(r,-3,4),ok=2*a*k+b,fk=a*k*k+b*k+c;
  return Q(r,M("f(x) = "+quadL(a,b,c))+". Calculer le nombre dérivé "+M("f'("+fm(k)+")")+".",ok,
    [[fk,"conf"],[a*k+b,"demi"],[2*a*k,"formule"],[2*a*k-b,"signe"],[a*k*k+b,"conf"],[2*a+b,"calc"]],{d:0},
    M("f'(x) = "+linL(2*a,b))+" donc "+M("f'("+fm(k)+") = "+fm(ok))+". Ne pas confondre avec "+M("f("+fm(k)+") = "+fm(fk))+".");
});
reg("variation_signe",["term"],C_DER,"Signe de la dérivée et variations",["variations","signe de f’","croissante","extremum"],2,function(r){
  var t=rnd(r,0,5);
  if(t>=4){var a=pick(r,[2,3,4,-2,-3]),b=rnd(r,1,6)*(a>0?-1:1)*a,z=-b/a,inc=a>0;
    if(t===4)return Q(r,M("f'(x) = "+linL(a,b))+". Sur quel intervalle "+M("f")+" est-elle croissante ?",inc?M("["+fm(z)+"\\,;\\,+\\infty[")+"":M("]-\\infty\\,;\\,"+fm(z)+"]"),
      [[inc?M("]-\\infty\\,;\\,"+fm(z)+"]"):M("["+fm(z)+"\\,;\\,+\\infty["),"signe"],[inc?M("["+fm(-z)+"\\,;\\,+\\infty["):M("]-\\infty\\,;\\,"+fm(-z)+"]"),"signe"],[M("[0\\,;\\,+\\infty["),"conf"]].filter(function(w){return z!==0||w[0]!==M("[0\\,;\\,+\\infty[");}),{},
      M("f'(x) = 0")+" pour "+M("x = "+fm(z))+" ; "+M("f'(x) > 0")+" "+(inc?"après":"avant")+" cette valeur (coefficient "+fm(a)+(inc?" > 0":" < 0")+").");
    return Q(r,M("f'(x) = "+linL(a,b))+". En quelle valeur "+M("f")+" admet-elle un extremum ?",z,[[-z,"signe"],[b,"conf"],[a,"conf"],[z+1,"calc"]],{d:2},"On résout "+M(linL(a,b)+" = 0")+" : "+M("x = "+fm(z))+". La dérivée change de signe en cette valeur.");}
  if(t===0)return Q(r,"Sur un intervalle, "+M("f'(x) > 0")+". La fonction "+M("f")+" est…","croissante",[["décroissante","signe"],["positive","conf"],["constante","conf"]],{},M("f' > 0")+" : "+M("f")+" est croissante.");
  if(t===1)return Q(r,"Sur un intervalle, "+M("f'(x) < 0")+". La fonction "+M("f")+" est…","décroissante",[["croissante","signe"],["négative","conf"],["constante","conf"]],{},M("f' < 0")+" : "+M("f")+" est décroissante.");
  if(t===2)return Q(r,M("f'")+" est négative puis positive, et s’annule en "+M("x = 3")+". En 3, "+M("f")+" admet…","un minimum",[["un maximum","signe"],["une valeur nulle","conf"],["une asymptote","conf"]],{},M("f")+" décroît puis croît : c’est un minimum.");
  return Q(r,M("f'")+" est positive puis négative, et s’annule en "+M("x = 2")+". En 2, "+M("f")+" admet…","un maximum",[["un minimum","signe"],["une valeur nulle","conf"],["une asymptote","conf"]],{},M("f")+" croît puis décroît : c’est un maximum.");
});
reg("minimum_parabole",["term"],C_DER,"Optimisation : minimum d’une parabole",["optimisation","minimum","parabole","coût minimal","extremum"],3,function(r){
  var a=pick(r,[1,2]),xm=rnd(r,2,8),b=-2*a*xm,c=rnd(r,1,20),fmin=a*xm*xm+b*xm+c,val=r()<0.5;
  if(val)return Q(r,"Le coût est "+M("C(x) = "+quadL(a,b,c))+". Pour quelle valeur de "+M("x")+" est-il minimal ?",xm,
    [[-b/a,"demi"],[b/(2*a),"signe"],[fmin,"conf"],[xm+1,"calc"]],{d:2},
    M("C'(x) = "+linL(2*a,b))+" s’annule en "+M("x = "+xm)+" ; la parabole est tournée vers le haut : c’est un minimum.");
  return Q(r,"Le coût "+M("C(x) = "+quadL(a,b,c))+" est minimal en "+M("x = "+xm)+". Quel est ce coût minimal ?",fmin,
    [[xm,"conf"],[c,"conf"],[a*xm*xm-b*xm+c,"signe"],[fmin+a,"calc"]],{d:2},
    M("C("+xm+") = "+a+" \\times "+xm*xm+" - "+Math.abs(b)+" \\times "+xm+" + "+c+" = "+fm(fmin))+".");
});

reg("suite_arith",["term"],C_SUI,"Suite arithmétique : terme général",["suite arithmétique","raison","terme général","u_n"],2,function(r){
  var u0=pick(r,[3,5,10,20]),rr=pick(r,[2,3,4,5,-2]),n=pick(r,[5,8,10,12]),ok=u0+n*rr;
  return Q(r,M("(u_n)")+" est arithmétique, "+M("u_0 = "+u0)+", raison "+M(fm(rr))+". Calculer "+M("u_{"+n+"}")+".",ok,
    [[u0+(n+1)*rr,"calc"],[u0*Math.pow(rr,n),"conf"],[u0+rr,"demi"],[n*rr,"formule"]],{d:0},
    M("u_n = u_0 + n \\times r = "+u0+" + "+n+" \\times "+par(rr)+" = "+fm(ok))+".");
});
reg("suite_geo",["term"],C_SUI,"Suite géométrique : terme général",["suite géométrique","raison","terme général","puissance"],3,function(r){
  var u0=pick(r,[2,3,5,10]),q=pick(r,[2,2,3]),n=q===2?rnd(r,3,6):rnd(r,2,4),ok=u0*Math.pow(q,n);
  return Q(r,M("(u_n)")+" est géométrique, "+M("u_0 = "+u0)+", raison "+M(q)+". Calculer "+M("u_{"+n+"}")+".",ok,
    [[u0*q*n,"conf"],[Math.pow(u0*q,n),"ordre"],[u0+n*q,"conf"],[u0*Math.pow(q,n+1),"calc"]],{d:0},
    M("u_n = u_0 \\times q^n = "+u0+" \\times "+q+"^{"+n+"} = "+u0+" \\times "+Math.pow(q,n)+" = "+ok)+".");
});
reg("suite_somme",["term"],C_SUI,"Somme des termes d’une suite arithmétique",["somme","suite arithmétique","n(a+b)/2"],3,function(r){
  var a=pick(r,[1,2,3,5]),rr=pick(r,[1,2,3,4]),n=pick(r,[4,6,8,10,12]),un=a+(n-1)*rr,ok=n*(a+un)/2;
  return Q(r,"Suite arithmétique : premier terme "+a+", raison "+rr+". Calculer la somme des "+n+" premiers termes.",ok,
    [[n*(a+un),"demi"],[(a+un)/2,"demi"],[n*un/2,"formule"],[n*(a+rr*n)/2,"calc"]],{d:2},
    "Dernier terme "+M(a+" + "+(n-1)+" \\times "+rr+" = "+un)+". Somme "+M("= \\dfrac{"+n+" \\times ("+a+" + "+un+")}{2} = "+fm(ok))+".");
});
reg("interets_composes",["term"],C_SUI,"Intérêts composés",["intérêts composés","placement","capital","taux","suite géométrique"],3,function(r){
  var C=pick(r,[500,1000,2000,4000]),t=pick(r,[2,5,10]),n=pick(r,[2,3]),ok=C*Math.pow(1+t/100,n);
  return Q(r,"On place "+f(C)+" € à "+t+" % par an, intérêts composés, pendant "+n+" ans. Quel capital obtient-on ?",ok,
    [[C*(1+n*t/100),"addp"],[C*(1+t/100)*n,"conf"],[C*(1+t/100),"demi"],[C*(1+t/100)*(n+1),"conf"]],{u:"€",d:2},
    M(fm(C)+" \\times "+fm(1+t/100)+"^{"+n+"} = "+fm(ok))+" €. Des intérêts simples donneraient "+f(C*(1+n*t/100))+" €.");
});
reg("reconnaitre_suite",["term"],C_SUI,"Reconnaître une suite arithmétique ou géométrique",["suite arithmétique","suite géométrique","raison"],2,function(r){
  var geo=r()<0.5;
  if(geo){var u=pick(r,[1,2,3,5]),q=pick(r,[2,3,10]);var s=[u,u*q,u*q*q,u*q*q*q];
    return Q(r,s.join(" ; ")+" ; … est une suite…","géométrique, "+M("q = "+q),[["arithmétique, "+M("r = "+q),"conf"],["arithmétique, "+M("r = "+(s[1]-s[0])),"conf"],["ni l’une ni l’autre","conf"]],{},"On passe d’un terme au suivant en multipliant par "+q+" : suite géométrique.");}
  var u2=pick(r,[3,5,7,10]),d=pick(r,[2,3,4,5]);var s2=[u2,u2+d,u2+2*d,u2+3*d];
  return Q(r,s2.join(" ; ")+" ; … est une suite…","arithmétique, "+M("r = "+d),[["géométrique, "+M("q = "+d),"conf"],["géométrique, "+M("q = "+fm(s2[1]/s2[0],2)),"conf"],["ni l’une ni l’autre","conf"]],{},"On passe d’un terme au suivant en ajoutant "+d+" : suite arithmétique.");
});

reg("proba_cond",["term"],C_PRO,"Probabilité conditionnelle",["probabilité conditionnelle","P_A(B)","arbre","sachant que"],3,function(r){
  var pa=pick(r,[0.4,0.5,0.6,0.8,0.3,0.25,0.9,0.7]),pb=pick(r,[0.25,0.5,0.75,0.2,0.4,0.6,0.1,0.3]),pab=rd(pa*pb,3);
  return Q(r,M("P(A) = "+fm(pa))+" et "+M("P(A \\cap B) = "+fm(pab,3))+". Calculer "+M("P_A(B)")+".",pb,
    [[rd(pa*pab,3),"formule"],[rd(pa+pab,3),"addp"],[rd(pa/pab,3),"inv"],[pab,"conf"]],{d:3},
    M("P_A(B) = \\dfrac{P(A \\cap B)}{P(A)} = \\dfrac{"+fm(pab,3)+"}{"+fm(pa)+"} = "+fm(pb))+".");
});
reg("esperance",["term"],C_PRO,"Espérance d’une variable aléatoire",["espérance","variable aléatoire","gain","jeu"],3,function(r){
  var P=pick(r,[[0.5,0.3,0.2],[0.4,0.4,0.2],[0.6,0.3,0.1],[0.25,0.5,0.25]]),xs=shuffle(r,[-5,-2,0,1,3,4,5,8,10]).slice(0,3).sort(function(a,b){return a-b;});
  var ok=P[0]*xs[0]+P[1]*xs[1]+P[2]*xs[2],mean=(xs[0]+xs[1]+xs[2])/3;
  return Q(r,"Un jeu rapporte "+f(xs[0])+" € avec la probabilité "+f(P[0])+", "+f(xs[1])+" € avec "+f(P[1])+" et "+f(xs[2])+" € avec "+f(P[2])+". Quelle est l’espérance du gain ?",ok,
    [[mean,"conf"],[xs[2],"conf"],[xs[0]+xs[1]+xs[2],"addp"],[P[0]+P[1]+P[2],"conf"]],{u:"€",d:2},
    M("E(X) = "+par(xs[0])+" \\times "+fm(P[0])+" + "+par(xs[1])+" \\times "+fm(P[1])+" + "+par(xs[2])+" \\times "+fm(P[2])+" = "+fm(ok))+" €.");
});
reg("independance",["term"],C_PRO,"Événements indépendants",["indépendants","P(A ∩ B)","produit"],2,function(r){
  var pa=pick(r,[0.2,0.3,0.5,0.6,0.25,0.7,0.9,0.15]),pb=pick(r,[0.4,0.5,0.8,0.1,0.3,0.6,0.35,0.2]),ok=rd(pa*pb,3);
  return Q(r,"A et B sont indépendants, "+M("P(A) = "+fm(pa))+" et "+M("P(B) = "+fm(pb))+". Que vaut "+M("P(A \\cap B)")+" ?",ok,
    [[rd(pa+pb,3),"addp"],[rd(Math.abs(pb-pa),3),"calc"],[rd(pa/pb,3),"inv"],[rd(pa+pb-pa*pb,3),"conf"]],{d:3},
    "Indépendance : "+M("P(A \\cap B) = P(A) \\times P(B) = "+fm(pa)+" \\times "+fm(pb)+" = "+fm(ok,3))+".");
});

reg("vol_pyramide",["term"],C_ESP,"Volume d’une pyramide ou d’un cône",["pyramide","cône","volume","1/3"],3,function(r){
  var c=pick(r,[3,6,9,12]),h=rnd(r,4,15),ok=c*c*h/3;
  return Q(r,"Une pyramide a pour base un carré de côté "+c+" cm et pour hauteur "+h+" cm. Quel est son volume ?",ok,
    [[c*c*h,"demi"],[c*c*h/2,"conf"],[c*h/3,"formule"],[c*c/3,"formule"]],{u:"cm³",d:2},
    M("V = \\dfrac{\\mathcal{B} \\times h}{3} = \\dfrac{"+c+"^2 \\times "+h+"}{3} = "+fm(ok))+" cm³.");
});
reg("reduction_agrandissement",["term"],C_ESP,"Réduction et agrandissement (aires, volumes)",["agrandissement","réduction","coefficient k","k²","k³"],3,function(r){
  if(r()<0.5){var k2=pick(r,[2,3,0.5,1.5,4]),A0=pick(r,[12,20,36,50,80]),V0=pick(r,[10,40,120,250]),av=r()<0.5,res=av?A0*k2*k2:V0*k2*k2*k2;
    return Q(r,"Une maquette est "+(k2>1?"agrandie":"réduite")+" à l’échelle "+M("k = "+fm(k2))+". "+(av?"Son aire était de "+A0+" cm². Quelle est la nouvelle aire ?":"Son volume était de "+V0+" cm³. Quel est le nouveau volume ?"),res,
      [[(av?A0:V0)*k2,"demi"],[(av?A0*k2*k2*k2:V0*k2*k2),"demi"],[(av?A0:V0)*2*k2,"formule"],[(av?A0:V0)+k2,"addp"]],{u:av?"cm²":"cm³",d:2},
      (av?"Aire × k² : "+M(A0+" \\times "+fm(k2)+"^2 = "+fm(res)):"Volume × k³ : "+M(V0+" \\times "+fm(k2)+"^3 = "+fm(res)))+".");}
  var k=pick(r,[2,3,0.5,4,1.5,10]),vol=r()<0.5,e=vol?3:2,ok=Math.pow(k,e);
  var F=function(v){return "× "+f(v,3);};
  return Q(r,"On "+(k>1?"agrandit":"réduit")+" un solide dans le rapport "+M("k = "+fm(k))+". Par combien "+(vol?"le volume est-il multiplié":"l’aire est-elle multipliée")+" ?",ok,
    [[k,"conf"],[Math.pow(k,vol?2:3),"demi"],[k*e,"formule"],[k+e,"addp"],[1/Math.pow(k,e),"inv"],[Math.pow(k,e)*k,"calc"]],{F:F,nu:"",d:3},
    "Longueurs "+M("\\times k")+", aires "+M("\\times k^2")+", volumes "+M("\\times k^3")+" : "+M("k^{"+e+"} = "+fm(ok,3))+".");
});
reg("vol_sphere",["term"],C_ESP,"Volume d’une boule",["sphère","boule","volume","4/3 π r³"],3,function(r){
  if(r()<0.35){var Re=rnd(r,2,9);return QE(r,"Estime le volume d’une boule de rayon "+Re+" cm.",4/3*3.14*Re*Re*Re,{u:"cm³"},M("V = \\dfrac{4}{3} \\pi r^3 \\approx 4 \\times "+Re+"^3 = "+4*Re*Re*Re)+" cm³ (ordre de grandeur, car "+M("\\dfrac{4}{3}\\pi \\approx 4{,}19")+").");}
  var R=pick(r,[3,6,1.5,9,12,0.3]),ok=4/3*3.14*R*R*R;
  return Q(r,"Quel est le volume d’une boule de rayon "+f(R)+" cm ? ("+M("\\pi \\approx 3{,}14")+")",ok,
    [[4*3.14*R*R,"formule"],[4/3*3.14*R*R,"demi"],[3.14*R*R*R,"demi"],[2/3*3.14*R*R*R,"conf"]],{u:"cm³",d:2},
    M("V = \\dfrac{4}{3} \\pi r^3 = \\dfrac{4}{3} \\times 3{,}14 \\times "+fm(R)+"^3 = "+fm(ok))+" cm³.");
});
