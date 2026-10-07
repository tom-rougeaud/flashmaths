/* ═══════════════════════════════════════════════════════════════
   BANQUE ENRICHIE (v3.2) — 1/3 : calcul, proportionnalité
   Chaque notion propose plusieurs « angles » : calcul direct, calcul inverse,
   choix de l’opération, piège classique, tuiles à associer, remise en ordre,
   estimation au curseur, étape fausse à trouver, lecture de figure.
   Les mauvaises réponses sont des erreurs types (codes ERR, voir bank_core.js).
═══════════════════════════════════════════════════════════════ */
var C_MET="Problèmes des métiers (plusieurs étapes)",C_ALGO="Algorithmique et tableur";
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){var t=a%b;a=b;b=t;}return a||1;}
function frL(n,d){return "\\dfrac{"+n+"}{"+d+"}";}
function frM(n,d){return M(frL(n,d));}
function pickN(r,arr,n){return shuffle(r,arr).slice(0,n);}
function cap1(s){return s.charAt(0).toUpperCase()+s.slice(1);}

/* ═════════ CALCUL MENTAL ET AUTOMATISMES ═════════ */
reg("tables",["3pm","cap"],C_CALC,"Tables de multiplication et divisions de tête",["tables","multiplication","division","calcul mental"],1,function(r){
  var t=rnd(r,0,3);
  if(t===0){var a=rnd(r,6,12),b=rnd(r,6,12),ok=a*b;
    return Q(r,"Calculer "+M(a+" \\times "+b),ok,[[a*(b-1),"calc"],[a*(b+1),"calc"],[(a-1)*b,"calc"],[ok+10,"calc"],[a+b,"addp"]],{d:0,pos:true},
      M(a+" \\times "+b+" = "+ok)+(b===9?" (astuce : "+M(a+" \\times 10 - "+a)+")":b===11?" (astuce : "+M(a+" \\times 10 + "+a)+")":"")+".");}
  if(t===1){var ps=[],seen={};while(ps.length<4){var x=rnd(r,3,12),y=rnd(r,3,12);if(seen[x*y])continue;seen[x*y]=1;ps.push([M(x+" \\times "+y),String(x*y)]);}
    return QA(r,"Associe chaque produit à son résultat.",ps,"Tables de multiplication : à connaître par cœur, elles servent partout.");}
  if(t===2){var d=rnd(r,3,9),q=rnd(r,4,12),n=d*q;
    return Q(r,"Combien de fois "+d+" dans "+n+" ?",q,[[q+1,"calc"],[q-1,"calc"],[n-d,"addp"],[d,"conf"]],{d:0,pos:true},M(n+" \\div "+d+" = "+q)+" car "+M(d+" \\times "+q+" = "+n)+".");}
  var a2=rnd(r,3,9),b2=rnd(r,3,9),c2=rnd(r,2,9),ok2=a2*b2*c2;
  return Q(r,"Calculer "+M(a2+" \\times "+b2+" \\times "+c2),ok2,[[a2*b2+c2,"ordre"],[a2+b2*c2,"ordre"],[a2*b2*(c2+1),"calc"],[ok2-a2*b2,"calc"]],{d:0},M(a2+" \\times "+b2+" = "+a2*b2)+", puis "+M(a2*b2+" \\times "+c2+" = "+ok2)+".");
});
reg("estim_calc",["3pm","cap","2nde"],C_CALC,"Ordre de grandeur d’un calcul (estimation)",["ordre de grandeur","estimation","arrondir","curseur"],2,function(r){
  var t=rnd(r,0,3);
  if(t===0){var a=rnd(r,21,98),b=rnd(r,21,98),A=Math.round(a/10)*10,B=Math.round(b/10)*10,ok=a*b;
    return QE(r,"Estimer "+M(a+" \\times "+b),ok,{},"Ordre de grandeur : "+M(A+" \\times "+B+" = "+fm(A*B))+". Valeur exacte : "+f(ok)+".");}
  if(t===1){var b2=rnd(r,12,48),qq=rnd(r,11,60),a2=b2*qq+rnd(r,0,b2-1),ok2=a2/b2,B2=Math.round(b2/10)*10;
    return QE(r,"Estimer "+M(a2+" \\div "+b2),ok2,{},"On arrondit : "+M(fm(a2)+" \\div "+B2+" \\approx "+fm(rd(a2/B2,1)))+". Valeur exacte : "+f(ok2,2)+".");}
  if(t===2){var x=rnd(r,31,89)/10,y=rnd(r,21,99);if(x===Math.round(x)||y%10===0)return null;var ok3=x*y,X=Math.round(x),Y=Math.round(y/10)*10;
    return QE(r,"Estimer "+M(fm(x)+" \\times "+y),ok3,{},"On arrondit : "+M(X+" \\times "+Y+" = "+X*Y)+". Valeur exacte : "+f(ok3)+".");}
  var p=rnd(r,31,79)+rnd(r,1,9)/10,q2=rnd(r,11,39)+rnd(r,1,9)/10,P=Math.round(p/10)*10,Qr=Math.round(q2/10)*10,okq=P*Qr;
  return Q(r,"Quel est le meilleur ordre de grandeur de "+M(fm(p)+" \\times "+fm(q2))+" ?",okq,[[okq*10,"unit"],[okq/10,"unit"],[P+Qr,"addp"],[P*Qr*2,"calc"]],{d:0,far:2},
    "On arrondit à la dizaine : "+M(P+" \\times "+Qr+" = "+fm(okq))+" (valeur exacte "+f(p*q2)+").");
});
reg("ranger_dec",["3pm","cap"],C_CALC,"Comparer et ranger des nombres décimaux",["comparer","ranger","décimaux","ordre croissant","virgule"],1,function(r){
  var base=rnd(r,0,9),pool=pickN(r,[0.5,0.15,0.05,0.4,0.45,0.125,0.09,0.3,0.25,0.505,0.7],4).map(function(d){return rd(base+d,3);}),t=rnd(r,0,2);
  var pad=function(v){return f(v,3).indexOf(",")<0?f(v,3)+",000":f(v,3)+"000".slice(0,3-f(v,3).split(",")[1].length);};
  var ex="On compare la partie entière, puis les dixièmes, les centièmes… En complétant avec des zéros : "+pool.slice().sort(function(a,b){return a-b;}).map(pad).join(" < ")+".";
  if(t<2){var asc=t===0,s=pool.slice().sort(function(a,b){return asc?a-b:b-a;});
    return QO(r,"Range ces nombres "+(asc?"du plus petit au plus grand.":"du plus grand au plus petit."),s.map(function(v){return f(v,3);}),ex,{how:asc?"du plus petit au plus grand":"du plus grand au plus petit",sep:asc?" < ":" > "});}
  var mx=Math.max.apply(null,pool);
  return Q(r,"Quel est le plus grand de ces nombres ?",f(mx,3),pool.filter(function(v){return v!==mx;}).map(function(v){return [f(v,3),"conf"];}),{},ex+" Un nombre n’est pas plus grand parce qu’il a plus de chiffres après la virgule.");
});
var FEQ=[[1,2,"0,5",50],[1,4,"0,25",25],[3,4,"0,75",75],[1,5,"0,2",20],[2,5,"0,4",40],[1,10,"0,1",10],[3,10,"0,3",30],[1,20,"0,05",5],[3,2,"1,5",150],[1,8,"0,125",12.5],[7,10,"0,7",70],[3,5,"0,6",60]];
reg("frac_dec_pct",["3pm","cap","2nde"],C_CALC,"Fractions, décimaux et pourcentages : écritures égales",["fraction","décimal","pourcentage","équivalence","tuiles"],1,function(r){
  var t=rnd(r,0,3),s=pickN(r,FEQ,4);
  if(t===0)return QA(r,"Associe chaque fraction à son écriture décimale.",s.map(function(e){return [frM(e[0],e[1]),e[2]];}),"Pour passer d’une fraction au décimal, on divise le numérateur par le dénominateur.");
  if(t===1)return QA(r,"Associe chaque nombre décimal à son pourcentage.",s.map(function(e){return [e[2],f(e[3])+" %"];}),"Pourcentage = décimal × 100 : 0,05 = 5 %, 0,5 = 50 %.");
  var e=s[0],okp=f(e[3])+" %";
  if(t===2)return Q(r,"Écrire "+frM(e[0],e[1])+" en pourcentage.",okp,[[e[0]+""+e[1]+" %","conf"],[e[2]+" %","pct0"],[f(e[3]/10)+" %","unit"],[f(e[1]/e[0]*100)+" %","inv"]],{},
    frM(e[0],e[1])+" = "+M(fm(e[0]/e[1],3))+" = "+okp+". Ce n’est pas « "+e[0]+""+e[1]+" % » !");
  var near=FEQ.filter(function(x){return x!==e;}).sort(function(a,b){return Math.abs(a[3]-e[3])-Math.abs(b[3]-e[3]);}).slice(0,3);
  return Q(r,"Quelle fraction est égale à "+e[2]+" ?",frM(e[0],e[1]),near.map(function(x){return [frM(x[0],x[1]),"conf"];}),{},e[2]+" = "+frM(e[0],e[1])+" car "+M(e[0]+" \\div "+e[1]+" = "+fm(e[0]/e[1],3))+".");
});
reg("frac_ops",["cap","2nde"],C_CALC,"Additionner et multiplier des fractions",["fraction","addition","multiplication","dénominateur commun"],2,function(r){
  var t=rnd(r,0,3),F=function(n,d){return frM(n,d);},fo={F:function(v){return typeof v==="string"?v:"";}};
  if(t===0){var b=pick(r,[5,7,9,11]),a=rnd(r,1,b-2),c=rnd(r,1,b-a-1);if(gcd(a+c,b)!==1)return null;
    var q=Q(r,"Calculer "+M(frL(a,b)+" + "+frL(c,b)),F(a+c,b),[[F(a+c,2*b),"formule"],[F(a*c,b),"addp"],[F(a+c,b*b),"formule"],[F(a+c+1,b),"calc"]],{},
      "Même dénominateur : on additionne les numérateurs, on garde le dénominateur. "+M(frL(a,b)+" + "+frL(c,b)+" = "+frL(a+c,b))+".");
    q.num=(a+c)/b;q.unit="";q.dec=3;return q;}
  if(t===1){var a1=rnd(r,1,5),b1=rnd(r,2,7),c1=rnd(r,1,5),d1=rnd(r,2,7);if(a1>=b1||c1>=d1||gcd(a1*c1,b1*d1)!==1)return null;
    var q1=Q(r,"Calculer "+M(frL(a1,b1)+" \\times "+frL(c1,d1)),F(a1*c1,b1*d1),[[F(a1*d1,b1*c1),"inv"],[F(a1+c1,b1+d1),"formule"],[F(a1*c1,b1+d1),"addp"],[F(a1+c1,b1*d1),"addp"]],{},
      "On multiplie les numérateurs entre eux et les dénominateurs entre eux : "+M(frL(a1+" \\times "+c1,b1+" \\times "+d1)+" = "+frL(a1*c1,b1*d1))+".");
    q1.num=a1*c1/(b1*d1);q1.unit="";q1.dec=3;return q1;}
  if(t===2){var p=pick(r,[[1,2,1,3],[1,2,1,4],[1,3,1,4],[2,3,1,4],[1,2,1,5],[3,4,1,8],[1,4,1,6],[2,5,1,2]]),N=p[0]*p[3]+p[2]*p[1],D=p[1]*p[3],g=gcd(N,D);
    var q2=Q(r,"Calculer "+M(frL(p[0],p[1])+" + "+frL(p[2],p[3])),F(N/g,D/g),[[F(p[0]+p[2],p[1]+p[3]),"formule"],[F(p[0]+p[2],D),"formule"],[F(p[0]*p[2],D),"addp"],[F(N/g+1,D/g),"calc"]],{},
      "On met au même dénominateur "+D+" : "+M(frL(p[0]*p[3],D)+" + "+frL(p[2]*p[1],D)+" = "+frL(N,D)+(g>1?" = "+frL(N/g,D/g):""))+". On n’additionne jamais les dénominateurs.");
    q2.num=N/D;q2.unit="";q2.dec=3;return q2;}
  var a3=rnd(r,1,3),b3=pick(r,[2,3,4]),c3=rnd(r,1,3),d3=b3*2;if(a3>=b3||c3>=d3)return null;
  var N3=a3*2+c3,bad=rnd(r,0,2),st=[M("= "+frL(a3+" \\times 2",b3+" \\times 2")+" + "+frL(c3,d3)),M("= "+frL(2*a3,d3)+" + "+frL(c3,d3)),M("= "+frL(N3,d3))];
  if(bad===0)st[0]=M("= "+frL(a3+" + 2",b3+" + 2")+" + "+frL(c3,d3));
  if(bad===1)st[1]=M("= "+frL(2*a3+c3,d3+d3));
  if(bad===2)st[2]=M("= "+frL(N3+1,d3));
  return QX(r,"Sami calcule "+M(frL(a3,b3)+" + "+frL(c3,d3))+". Où est son erreur ?",st,bad,
    "Bon calcul : "+M(frL(a3,b3)+" + "+frL(c3,d3)+" = "+frL(2*a3,d3)+" + "+frL(c3,d3)+" = "+frL(N3,d3))+". On multiplie le numérateur ET le dénominateur par le même nombre, puis on additionne seulement les numérateurs.");
});
reg("frac_comp",["cap","2nde"],C_CALC,"Comparer et ranger des fractions",["fraction","comparer","ranger"],2,function(r){
  var pool=pickN(r,[[1,2],[1,3],[2,3],[3,4],[1,4],[2,5],[3,5],[5,6],[1,6],[3,8],[5,8],[7,10],[1,5],[4,5]],8),vals={},sel=[];
  pool.forEach(function(p){var v=rd(p[0]/p[1],6);if(!vals[v]&&sel.length<4){vals[v]=1;sel.push(p);}});
  var srt=sel.slice().sort(function(a,b){return a[0]/a[1]-b[0]/b[1];});
  var ex="En écriture décimale : "+srt.map(function(p){return frM(p[0],p[1])+" ≈ "+f(p[0]/p[1],2);}).join(" ; ")+".";
  if(r()<0.6)return QO(r,"Range ces fractions du plus petit au plus grand.",srt.map(function(p){return frM(p[0],p[1]);}),ex,{how:"du plus petit au plus grand",sep:" < "});
  var mx=srt[3];
  return Q(r,"Quelle est la plus grande fraction ?",frM(mx[0],mx[1]),srt.slice(0,3).map(function(p){return [frM(p[0],p[1]),"conf"];}),{},ex+" Un grand dénominateur ne veut pas dire une grande fraction.");
});
reg("carres12",["3pm","cap"],C_CALC,"Carrés de 1 à 12 et racines carrées",["carré","racine carrée","estimation"],1,function(r){
  var t=rnd(r,0,3);
  if(t===0){var ns=pickN(r,[2,3,4,5,6,7,8,9,10,11,12],4);return QA(r,"Associe chaque nombre à son carré.",ns.map(function(n){return [M(n+"^2"),String(n*n)];}),"Le carré de n, c’est n × n (et non 2 × n).");}
  if(t===1){var N=pick(r,[10,20,30,40,50,60,70,80,90,110,120,130,140]),s=Math.sqrt(N),a=Math.floor(s);
    return Q(r,"Entre quels entiers consécutifs se trouve "+M("\\sqrt{"+N+"}")+" ?","entre "+a+" et "+(a+1),[["entre "+Math.floor(N/2)+" et "+(Math.floor(N/2)+1),"demi"],["entre "+(a-1)+" et "+a,"calc"],["entre "+(a+1)+" et "+(a+2),"calc"]],{},
      M(a+"^2 = "+a*a)+" et "+M((a+1)+"^2 = "+(a+1)*(a+1))+", donc "+M("\\sqrt{"+N+"}")+" est entre "+a+" et "+(a+1)+".");}
  if(t===2){var N2=pick(r,[8,15,24,30,45,50,62,75,90,110,130]);
    return QE(r,"Estime "+M("\\sqrt{"+N2+"}")+" avec le curseur.",Math.sqrt(N2),{min:0,max:pick(r,[12,15]),tol:0.3},M("\\sqrt{"+N2+"} \\approx "+fm(Math.sqrt(N2),2))+" : on cherche le carré le plus proche.");}
  var n=rnd(r,4,12);
  return Q(r,"Calculer "+M(n+"^2"),n*n,[[2*n,"demi"],[n*n+n,"calc"],[(n-1)*n,"calc"],[n+2,"addp"]],{d:0},M(n+"^2 = "+n+" \\times "+n+" = "+n*n)+".");
});
reg("axe_gradue",["3pm","cap"],C_CALC,"Lire une abscisse sur une droite graduée",["droite graduée","abscisse","relatifs","décimaux","lecture"],1,function(r){
  var t=rnd(r,0,2),fig,ok,wr,ex;
  if(t===0){var mn=rnd(r,0,5),k=pick(r,[1,2,3,4,6,7,8,9]),st=0.2;ok=rd(mn+k*st,2);
    fig={k:"axe",min:mn,max:mn+2,step:st,every:5,labels:[0,5,10],pts:[[ok,"A"]]};
    wr=[[rd(mn+k*0.1,2),"lect"],[mn+k,"lect"],[rd(ok+st,2),"lect"],[rd(ok-st,2),"lect"]];ex="Entre "+mn+" et "+(mn+1)+" il y a 5 intervalles : un intervalle vaut "+M("1 \\div 5 = 0{,}2")+". A est à "+k+" intervalles de "+mn+" : "+f(ok)+".";}
  else if(t===1){var k2=rnd(r,1,7);ok=-k2;fig={k:"axe",min:-8,max:4,step:1,every:1,labels:[8,9],pts:[[ok,"B"]]};
    wr=[[k2,"signe"],[-(k2+1),"lect"],[-(k2-1),"lect"],[k2-8,"lect"]];ex="On compte les graduations à gauche de 0 : B est à "+k2+" unités, donc son abscisse est "+f(ok)+".";}
  else{var k3=pick(r,[1,3,5,6,7]);ok=k3/4;fig={k:"axe",min:0,max:2,step:0.25,every:4,labels:[0,4,8],pts:[[ok,"C"]]};
    wr=[[k3/10,"lect"],[k3,"lect"],[k3/5,"lect"],[ok+0.25,"lect"]];ex="L’unité est partagée en 4 : chaque graduation vaut "+M("\\dfrac{1}{4} = 0{,}25")+". C est à "+k3+" graduations : "+M(frL(k3,4)+" = "+fm(ok))+".";}
  var q=Q(r,"Quelle est l’abscisse du point "+fig.pts[0][1]+" ?",ok,wr,{d:2,fig:fig},ex);
  return q;
});
reg("prio_err",["cap","2nde"],C_CALC,"Trouver l’erreur dans un calcul (priorités, signes)",["priorités","erreur","signes","étapes"],2,function(r){
  var t=rnd(r,0,3);
  if(t===0){var a=rnd(r,20,40),b=rnd(r,2,5),c=rnd(r,2,6),d=rnd(r,2,6),s=c+d;
    return QX(r,"Inès calcule "+M(a+" - "+b+" \\times ("+c+" + "+d+")")+". Où est son erreur ?",[M("= "+a+" - "+b+" \\times "+s),M("= "+(a-b)+" \\times "+s),M("= "+(a-b)*s)],1,
      "La multiplication passe avant la soustraction : "+M(a+" - "+b+" \\times "+s+" = "+a+" - "+b*s+" = "+(a-b*s))+".");}
  if(t===1){var x=rnd(r,2,6),m=rnd(r,2,5),n=rnd(r,2,6);
    return QX(r,"Tom calcule "+M("(-"+x+")^2 + "+m+" \\times "+n)+". Où est son erreur ?",[M("= -"+x*x+" + "+m+" \\times "+n),M("= -"+x*x+" + "+m*n),M("= "+(m*n-x*x))],0,
      "Un carré est positif : "+M("(-"+x+")^2 = "+x*x)+". Donc "+M(x*x+" + "+m*n+" = "+(x*x+m*n))+".");}
  if(t===2){var a2=rnd(r,2,9),b2=rnd(r,3,9),c2=rnd(r,2,5);
    return QX(r,"Lina calcule "+M(a2+" + "+b2+" \\times "+c2+" - 1")+". Où est son erreur ?",[M("= "+a2+" + "+b2*c2+" - 1"),M("= "+(a2+b2*c2)+" - 1"),M("= "+(a2+b2*c2+1))],2,
      "Les deux premières étapes sont justes ; la dernière est une erreur de calcul : "+M((a2+b2*c2)+" - 1 = "+(a2+b2*c2-1))+".");}
  var p=rnd(r,2,6),q=rnd(r,2,6),w=rnd(r,10,30);
  return QX(r,"Noé calcule "+M(w+" - (-"+p+") \\times "+q)+". Où est son erreur ?",[M("= "+w+" - (-"+p*q+")"),M("= "+w+" - "+p*q),M("= "+(w-p*q))],1,
    "Soustraire un nombre négatif revient à ajouter son opposé : "+M(w+" - (-"+p*q+") = "+w+" + "+p*q+" = "+(w+p*q))+".");
});
reg("sci_ordre",["cap","2nde"],C_CALC,"Notation scientifique : comparer, convertir",["notation scientifique","puissances de 10","ranger","tuiles"],2,function(r){
  var t=rnd(r,0,2);
  if(t===0){var used={},it=[];while(it.length<4){var m=pick(r,[1.2,2.5,3,4.8,5,7.5,9]),e=rnd(r,2,6),v=m*Math.pow(10,e);if(used[v])continue;used[v]=1;it.push({m:m,e:e,v:v});}
    it.sort(function(a,b){return a.v-b.v;});
    return QO(r,"Range ces nombres du plus petit au plus grand.",it.map(function(x){return M(fm(x.m)+" \\times 10^{"+x.e+"}");}),"On compare d’abord les puissances de 10, puis les nombres devant si les puissances sont égales.",{how:"du plus petit au plus grand",sep:" < "});}
  if(t===1){var ps=[],us={};while(ps.length<4){var m2=pick(r,[1.5,2,3.4,4,5.6,6,8]),e2=pick(r,[-3,-2,-1,2,3,4]),k=m2+"|"+e2;if(us[k])continue;us[k]=1;ps.push([M(fm(m2)+" \\times 10^{"+e2+"}"),f(m2*Math.pow(10,e2),5)]);}
    var dl={};if(ps.some(function(p){if(dl[p[1]])return true;dl[p[1]]=1;return false;}))return null;
    return QA(r,"Associe chaque écriture scientifique à son écriture décimale.",ps,"Exposant positif : la virgule va vers la droite ; exposant négatif : vers la gauche.");}
  var m3=pick(r,[4.5,3.2,7,1.8,6.25]),e3=pick(r,[-4,-3,-2,3,4,5]),x=m3*Math.pow(10,e3),S=function(mm,ee){return M(fm(mm)+" \\times 10^{"+ee+"}");};
  return Q(r,"Quelle est l’écriture scientifique de "+f(x,6)+" ?",S(m3,e3),[[S(m3,-e3),"signe"],[S(m3*10,e3-1),"conf"],[S(m3,e3+(e3>0?-1:1)),"calc"]],{},
    "Un seul chiffre non nul avant la virgule : "+f(x,6)+" = "+S(m3,e3)+".");
});
reg("mult_dec",["3pm","cap"],C_CALC,"Multiplier des nombres décimaux",["décimaux","multiplication","virgule"],1,function(r){
  var a=rnd(r,2,9),b=rnd(r,2,9),da=pick(r,[1,1,2]),db=pick(r,[0,1]),x=a/Math.pow(10,da),y=b/Math.pow(10,db),ok=x*y;
  return Q(r,"Calculer "+M(fm(x,3)+" \\times "+fm(y,3)),ok,[[a*b/Math.pow(10,Math.max(da,db)),"unit"],[x+y,"addp"],[ok*10,"unit"],[ok/10,"unit"]],{d:4,far:2},
    "On calcule "+M(a+" \\times "+b+" = "+a*b)+", puis on place la virgule : "+(da+db)+" chiffre"+(da+db>1?"s":"")+" après la virgule au total, d’où "+f(ok,4)+".");
});

/* ═════════ PROPORTIONNALITÉ ET POURCENTAGES ═════════ */
var PTAB=[["Masse (kg)","Prix (€)"],["Durée (h)","Distance (km)"],["Nombre de pots","Surface peinte (m²)"],["Volume (L)","Masse (kg)"],["Nombre d’articles","Prix (€)"],["Temps (min)","Volume (L)"]];
reg("prop_tableau",["3pm","cap","2nde"],C_PROP,"Tableau de proportionnalité : reconnaître, compléter",["proportionnalité","tableau","coefficient","quatrième proportionnelle"],1,function(r){
  var lab=pick(r,PTAB),k=pick(r,[1.5,2,2.5,3,4,5,6,8,12]),xs=pickN(r,[2,3,4,5,6,8,10,12],3).sort(function(a,b){return a-b;}),ys=xs.map(function(x){return x*k;}),t=rnd(r,0,2);
  if(t===0){var hole=rnd(r,1,2),ok=ys[hole],row=ys.map(function(y,i){return i===hole?"?":f(y);});
    var fig={k:"tab",hc:1,rows:[[lab[0]].concat(xs.map(String)),[lab[1]].concat(row)]};
    return Q(r,"Ce tableau est un tableau de proportionnalité. Quelle est la valeur manquante ?",ok,[[ys[0]+(xs[hole]-xs[0]),"addp"],[xs[hole]/k,"inv"],[ok+k,"calc"],[ok-k,"calc"]],{d:2,fig:fig},
      "Coefficient : "+M(fm(ys[0])+" \\div "+xs[0]+" = "+fm(k))+", donc "+M(xs[hole]+" \\times "+fm(k)+" = "+fm(ok))+".");}
  if(t===1){var prop=r()<0.5,add=rnd(r,2,9),ys2=prop?ys:xs.map(function(x){return x*k+add;});
    var q=VF(r,"Ce tableau est-il un tableau de proportionnalité ?",prop,prop?"Oui : on passe de la 1re ligne à la 2e en multipliant toujours par "+f(k)+".":"Non : les quotients ne sont pas égaux ("+xs.map(function(x,i){return f(ys2[i])+" ÷ "+x+" ≈ "+f(ys2[i]/x,2);}).join(" ; ")+").");
    q.fig={k:"tab",hc:1,rows:[[lab[0]].concat(xs.map(String)),[lab[1]].concat(ys2.map(function(y){return f(y);}))]};
    q.choices=[{t:"Oui",err:prop?null:"conf"},{t:"Non",err:prop?"conf":null}];return q;}
  var fig2={k:"tab",hc:1,rows:[[lab[0]].concat(xs.map(String)),[lab[1]].concat(ys.map(function(y){return f(y);}))]};
  return Q(r,"Par quel nombre multiplie-t-on la 1re ligne pour obtenir la 2e ?",k,[[1/k,"inv"],[ys[0]-xs[0],"addp"],[ys[0],"conf"],[k+1,"calc"]],{d:3,fig:fig2},
    "Coefficient de proportionnalité : "+M(fm(ys[0])+" \\div "+xs[0]+" = "+fm(k))+".");
});
reg("prop_graph",["cap","2nde"],C_PROP,"Proportionnalité et graphique",["proportionnalité","graphique","droite","origine","lecture"],2,function(r){
  var t=rnd(r,0,1),k=pick(r,[1,2,3]);
  if(t===0){var x0=rnd(r,2,5),ok=k*x0,fig={k:"graph",xr:[0,6],yr:[0,6*k],sy:k,ey:k>1?2:1,pts:[[0,0],[6,6*k]],xn:"masse (kg)",yn:"prix (€)",dots:[]};
    return Q(r,"Le graphique donne le prix payé selon la masse achetée. Quel est le prix de "+x0+" kg ?",ok,[[x0/k,"inv"],[ok+k,"lect"],[ok-k,"lect"],[x0,"conf"],[ok+2*k,"lect"],[ok/2,"calc"]],{u:"€",d:2,fig:fig},
      "On part de "+x0+" sur l’axe horizontal, on monte jusqu’à la droite, puis on lit sur l’axe vertical : "+f(ok)+" €.");}
  var c=rnd(r,0,2),fg;
  if(c===0)fg={k:"graph",xr:[0,6],yr:[0,6],pts:[[0,0],[6,6*k/k]]};
  else if(c===1){var b=rnd(r,1,3);fg={k:"graph",xr:[0,6],yr:[0,8],pts:[[0,b],[6,b+6*0.8]]};}
  else fg={k:"graph",xr:[0,6],yr:[0,7],pts:[[0,0],[1,0.2],[2,0.8],[3,1.8],[4,3.2],[5,5],[5.9,7]]};
  var q=VF(r,"Ce graphique représente-t-il une situation de proportionnalité ?",c===0,c===0?"Oui : c’est une droite qui passe par l’origine.":c===1?"Non : c’est une droite, mais elle ne passe pas par l’origine.":"Non : la courbe passe par l’origine mais ce n’est pas une droite.");
  q.fig=fg;q.choices=[{t:"Oui",err:c===0?null:"conf"},{t:"Non",err:c===0?"conf":null}];return q;
});
reg("pct_inverse",["cap","2nde","1re"],C_PROP,"Pourcentages : valeur initiale, taux d’évolution",["pourcentage","prix initial","remise","taux d’évolution","calcul inverse"],3,function(r){
  var t=rnd(r,0,2);
  if(t===0){var p=pick(r,[10,20,25,40,50]),P=pick(r,[40,60,80,120,150,200,250]),F=P*(1-p/100);
    return Q(r,"Après une remise de "+p+" %, un article coûte "+f(F)+" €. Quel était son prix avant la remise ?",P,[[F*(1+p/100),"inv"],[F+p,"addp"],[F/(p/100),"pct0"],[F*(1-p/100),"signe"]],{u:"€",d:2},
      "Prix réduit = prix initial × "+fm(1-p/100)+", donc prix initial = "+M(fm(F)+" \\div "+fm(1-p/100)+" = "+fm(P))+" €. Ajouter "+p+" % au prix réduit ne redonne PAS le prix initial.");}
  if(t===1){var v1=pick(r,[20,40,50,80,120,200,250]),pp=pick(r,[5,10,15,20,25,30,40,60]),up=r()<0.6,v2=v1*(up?1+pp/100:1-pp/100),ok=up?pp:-pp;
    return Q(r,"Un prix passe de "+f(v1)+" € à "+f(v2)+" €. Quel est le taux d’évolution ?",ok,[[rd(v2-v1,2),"conf"],[rd((v2-v1)/v2*100,2),"inv"],[rd(v2/v1*100,2),"conf"],[-ok,"signe"]],{F:sgp,nu:"%",d:2},
      "Taux = "+M("\\dfrac{V_2 - V_1}{V_1} = \\dfrac{"+fm(v2)+" - "+fm(v1)+"}{"+fm(v1)+"} = "+fm(ok/100))+", soit "+sgp(ok)+".");}
  var p2=pick(r,[10,20,25,50]),P2=pick(r,[40,80,120,200]),F2=P2*(1-p2/100);
  return QX(r,"Un article soldé −"+p2+" % coûte "+f(F2)+" €. Jade cherche le prix initial. Où est son erreur ?",
    ["Remise de "+p2+" % : on paie "+(100-p2)+" % du prix.",M("\\text{prix initial} \\times "+fm(1-p2/100)+" = "+fm(F2)),M("\\text{prix initial} = "+fm(F2)+" \\times "+fm(1+p2/100)+" = "+fm(F2*(1+p2/100)))],2,
    "Il faut diviser : "+M(fm(F2)+" \\div "+fm(1-p2/100)+" = "+fm(P2))+" €. Multiplier par "+fm(1+p2/100)+" ne compense pas la baisse.");
});
reg("choix_op",["3pm","cap","2nde"],C_PROP,"Quel calcul faut-il faire ? (choisir l’opération)",["choisir l’opération","problème","modéliser","sens des opérations"],2,function(r){
  var t=rnd(r,0,5);
  if(t===0){var X=pick(r,[40,60,80,120,150]),p=pick(r,[15,20,25,30,35]);
    return Q(r,"Un article à "+X+" € est soldé à −"+p+" %. Quel calcul donne le nouveau prix ?",M(X+" \\times "+fm(1-p/100)),[[M(X+" - "+p),"addp"],[M(X+" \\times "+fm(p/100)),"compl"],[M(X+" \\times "+fm(1+p/100)),"signe"]],{},
      "Baisser de "+p+" %, c’est garder "+(100-p)+" % : on multiplie par "+fm(1-p/100)+". "+M(X+" \\times "+fm(p/100))+" donne le montant de la remise, pas le nouveau prix.");}
  if(t===1){var L=pick(r,[12,18,24,30,36]),n=pick(r,[4,5,6,8]);
    return Q(r,"On coupe un câble de "+L+" m en "+n+" morceaux de même longueur. Quel calcul donne la longueur d’un morceau ?",M(L+" \\div "+n),[[M(L+" \\times "+n),"addp"],[M(n+" \\div "+L),"inv"],[M(L+" - "+n),"addp"]],{},"Partager en parts égales : on divise.");}
  if(t===2){var pr=pick(r,[6,9,12,15]),m=pick(r,[2,3,4]);
    return Q(r,"On paie "+pr+" € pour "+m+" kg de pommes. Quel calcul donne le prix d’un kilogramme ?",M(pr+" \\div "+m),[[M(m+" \\div "+pr),"inv"],[M(pr+" \\times "+m),"addp"],[M(pr+" - "+m),"addp"]],{},"Prix au kg = prix payé ÷ masse.");}
  if(t===3){var v=pick(r,[50,60,80,90]),h=pick(r,[2,3,1.5]);
    return Q(r,"Un camion roule "+fm(h).replace("{,}",",")+" h à "+v+" km/h. Quel calcul donne la distance parcourue ?",M(v+" \\times "+fm(h)),[[M(v+" \\div "+fm(h)),"inv"],[M(fm(h)+" \\div "+v),"inv"],[M(v+" + "+fm(h)),"addp"]],{},"Distance = vitesse × durée.");}
  if(t===4){var C=pick(r,[40,60,80,120]);
    return Q(r,"Un réservoir de "+C+" L est rempli aux "+frM(3,4)+". Quel calcul donne le volume d’essence ?",M(C+" \\div 4 \\times 3"),[[M(C+" \\div 3 \\times 4"),"inv"],[M(C+" - "+frL(3,4)),"addp"],[M(C+" \\div 4"),"demi"]],{},"Prendre les trois quarts : on divise par 4 puis on multiplie par 3.");}
  var N=pick(r,[24,30,36]),P=pick(r,[450,600,750]),n2=pick(r,[6,10,12]);
  return Q(r,"Une recette pour "+n2+" personnes demande "+P+" g de farine. Quel calcul donne la farine pour "+N+" personnes ?",M(P+" \\div "+n2+" \\times "+N),[[M(P+" \\times "+n2+" \\div "+N),"inv"],[M(P+" + "+(N-n2)),"addp"],[M(P+" \\times "+N),"conf"]],{},"On calcule pour 1 personne (÷ "+n2+"), puis pour "+N+" (× "+N+").");
});
var CMP=[["hausse de 20 %","× 1,2"],["baisse de 20 %","× 0,8"],["hausse de 2 %","× 1,02"],["baisse de 2 %","× 0,98"],["hausse de 5 %","× 1,05"],["baisse de 5 %","× 0,95"],["hausse de 50 %","× 1,5"],["baisse de 50 %","× 0,5"],["hausse de 100 %","× 2"],["baisse de 25 %","× 0,75"],["hausse de 25 %","× 1,25"],["baisse de 10 %","× 0,9"],["hausse de 10 %","× 1,1"],["hausse de 1 %","× 1,01"]];
reg("pct_cm_tuiles",["cap","2nde","1re"],C_PROP,"Évolutions et coefficients multiplicateurs (tuiles)",["coefficient multiplicateur","hausse","baisse","tuiles"],2,function(r){
  var p=pick(r,[[0,1,2,3],[4,5,0,3],[2,3,12,11],[6,7,9,10],[11,12,4,5],[8,7,1,13]]);
  if(r()<0.25){var e=CMP[p[0]];return Q(r,"Une "+e[0]+" correspond à un coefficient multiplicateur…",e[1],p.slice(1).map(function(i){return [CMP[i][1],"conf"];}),{},"Hausse de t % : × (1 + t/100) ; baisse de t % : × (1 − t/100).");}
  return QA(r,"Associe chaque évolution à son coefficient multiplicateur.",p.map(function(i){return CMP[i];}),"Hausse de t % : × (1 + t/100). Baisse de t % : × (1 − t/100). Attention : + 2 % donne × 1,02 et non × 1,2.");
});
reg("pct_estim",["cap","2nde"],C_PROP,"Estimer un pourcentage (curseur)",["pourcentage","estimation","ordre de grandeur","curseur"],2,function(r){
  var p=pick(r,[9,11,19,21,24,26,31,49,51,74]),v=rnd(r,18,92)*10+rnd(r,1,9),ok=v*p/100,P=Math.round(p/5)*5,V=Math.round(v/50)*50;
  return QE(r,"Estime "+p+" % de "+f(v)+" €.",ok,{u:"€"},"On arrondit : "+P+" % de "+f(V)+" = "+f(V*P/100)+" €. Valeur exacte : "+f(ok)+" €.");
});
reg("heures_dec",["3pm","cap","2nde"],C_PROP,"Heures décimales, durées et vitesses (m/s, km/h)",["durée","heure décimale","base 60","km/h","m/s"],2,function(r){
  var t=rnd(r,0,3),H=function(h,m){return h+" h "+(m<10?"0":"")+m+" min";};
  if(t===0){var x=pick(r,[0.25,0.5,0.75,0.2,0.1,1.5,1.75,2.25,0.4,2.6,1.2,3.25]),h=Math.floor(x),m=Math.round((x-h)*60),dec=Math.round((x-h)*100);
    return Q(r,"Convertir "+f(x)+" h en heures et minutes.",H(h,m),[[H(h,dec),"base"],[H(h,Math.round((x-h)*10)),"base"],[H(h,(m+15)%60),"calc"]],{},
      f(x-h)+" h = "+M(fm(x-h)+" \\times 60 = "+m)+" min, donc "+f(x)+" h = "+H(h,m)+".");}
  if(t===1){var h2=rnd(r,1,3),m2=pick(r,[15,30,45,12,6,24,36,48]),ok=h2+m2/60;
    return Q(r,"Convertir "+H(h2,m2)+" en heures décimales.",ok,[[h2+m2/100,"base"],[h2+m2/10,"base"],[h2+60/m2/10,"inv"],[ok+0.1,"calc"]],{u:"h",d:2},
      m2+" min = "+M("\\dfrac{"+m2+"}{60} = "+fm(m2/60))+" h, donc "+f(ok)+" h.");}
  if(t===2){var v=pick(r,[36,54,72,90,108,18]),ok2=v/3.6;
    return Q(r,"Convertir "+v+" km/h en m/s.",ok2,[[v*3.6,"inv"],[v/60,"base"],[v/10,"unit"],[v/36,"unit"]],{u:"m/s",d:2},
      M(v+" \\text{ km/h} = \\dfrac{"+v+"\\,000 \\text{ m}}{3\\,600 \\text{ s}} = "+fm(ok2))+" m/s (on divise par 3,6).");}
  var d=pick(r,[[14,45,1,35],[8,50,2,20],[9,40,1,45],[16,35,2,40],[11,25,3,50]]),tot=d[0]*60+d[1]+d[2]*60+d[3];
  return Q(r,"Un trajet commence à "+d[0]+" h "+d[1]+" et dure "+d[2]+" h "+d[3]+" min. À quelle heure arrive-t-on ?",Math.floor(tot/60)+" h "+(tot%60<10?"0":"")+tot%60,
    [[(d[0]+d[2])+" h "+(d[1]+d[3]),"base"],[(d[0]+d[2])+" h "+(tot%60<10?"0":"")+tot%60,"calc"],[Math.floor(tot/60)+" h "+((tot%60+40)%60<10?"0":"")+(tot%60+40)%60,"calc"]],{},
    d[1]+" min + "+d[3]+" min = "+(d[1]+d[3])+" min = 1 h "+((d[1]+d[3])-60)+" min. On arrive à "+Math.floor(tot/60)+" h "+(tot%60<10?"0":"")+tot%60+".");
});

/* ═════════ GRANDEURS, MESURES ET VOLUMES ═════════ */
reg("conv_aire_vol",["cap","2nde"],C_GRAN,"Conversions d’aires, de volumes et de contenances",["conversion","aire","volume","m²","m³","litre"],2,function(r){
  var t=rnd(r,0,3);
  if(t===0){var c=pick(r,[{f:"m²",t:"cm²",k:10000,V:[0.5,1.2,2,3.5]},{f:"m²",t:"dm²",k:100,V:[0.4,1.5,2.5,12]},{f:"cm²",t:"m²",k:0.0001,V:[2500,5000,15000,800]},{f:"km²",t:"ha",k:100,V:[0.5,2,3.2]},{f:"ha",t:"m²",k:10000,V:[0.5,1.5,2,3]}]),v=pick(r,c.V),ok=v*c.k;
    var tab=c.k>=1?Math.sqrt(c.k):1/Math.sqrt(1/c.k);
    return Q(r,"Convertir "+f(v,4)+" "+c.f+" en "+c.t+".",ok,[[v*tab,"unit"],[v*c.k*10,"unit"],[v*c.k/10,"unit"],[v/c.k,"inv"]],{u:c.t,d:6,far:4},
      "Pour les aires, chaque unité vaut 100 fois la suivante : 1 "+c.f+" = "+f(c.k,6)+" "+c.t+", donc "+f(v,4)+" "+c.f+" = "+f(ok,6)+" "+c.t+".");}
  if(t===1){var c2=pick(r,[{f:"m³",t:"L",k:1000,V:[0.5,1.2,2.5,0.75,3]},{f:"dm³",t:"L",k:1,V:[2.5,12,0.8,45]},{f:"cm³",t:"L",k:0.001,V:[350,750,1500,250]},{f:"cm³",t:"mL",k:1,V:[33,250,500,75]},{f:"L",t:"m³",k:0.001,V:[500,1500,250,12000]}]),v2=pick(r,c2.V),ok2=v2*c2.k;
    return Q(r,"Convertir "+f(v2,4)+" "+c2.f+" en "+c2.t+".",ok2,[[ok2*10,"unit"],[ok2/10,"unit"],[ok2*100,"unit"],[ok2/100,"unit"]],{u:c2.t,d:6,far:4},
      "À retenir : 1 dm³ = 1 L, 1 cm³ = 1 mL, 1 m³ = 1 000 L. Donc "+f(v2,4)+" "+c2.f+" = "+f(ok2,6)+" "+c2.t+".");}
  if(t===2)return QA(r,"Associe les mesures égales.",pickN(r,[["1 L","1 dm³"],["1 mL","1 cm³"],["1 m³","1 000 L"],["1 hL","100 L"],["1 cL","10 mL"],["1 m²","10 000 cm²"],["1 ha","10 000 m²"],["1 dm²","100 cm²"]],4),
    "Contenances : 1 L = 1 dm³ ; 1 mL = 1 cm³ ; 1 m³ = 1 000 L. Aires : 1 m² = 100 dm² = 10 000 cm².");
  var it=[["25 cL",0.25],["0,3 L",0.3],["350 mL",0.35],["0,04 m³",40],["1,5 dm³",1.5]],s=pickN(r,it,4).sort(function(a,b){return a[1]-b[1];});
  return QO(r,"Range ces contenances de la plus petite à la plus grande.",s.map(function(x){return x[0];}),"En litres : "+s.map(function(x){return x[0]+" = "+f(x[1],3)+" L";}).join(" ; ")+".",{how:"de la plus petite à la plus grande",sep:" < "});
});
var REAL=[["la masse d’une voiture","1,2 t",["1,2 kg","120 g","12 t"]],["la hauteur d’une porte","2 m",["2 cm","20 m","2 km"]],["la contenance d’une bouteille d’eau","1,5 L",["1,5 mL","15 L","150 L"]],["l’aire d’une chambre","12 m²",["12 cm²","1 200 m²","12 km²"]],["la masse d’un smartphone","180 g",["180 kg","18 mg","1,8 kg"]],["l’épaisseur d’une pièce de 1 €","2 mm",["2 cm","2 m","20 cm"]],["la contenance d’une baignoire","200 L",["200 mL","20 L","2 m³"]],["la distance Dijon – Paris","310 km",["310 m","3 100 km","31 km"]],["la masse d’un sac de ciment","35 kg",["35 g","350 kg","3,5 t"]],["la longueur d’un stylo","14 cm",["14 mm","1,4 m","14 m"]],["la durée d’un cours","55 min",["55 s","5,5 h","550 min"]],["l’aire d’un terrain de foot","7 000 m²",["70 m²","7 000 cm²","7 km²"]]];
reg("unite_adaptee",["3pm","cap"],C_GRAN,"Unité adaptée et ordre de grandeur (vraisemblance)",["unité","ordre de grandeur","vraisemblance","cohérence"],1,function(r){
  var e=pick(r,REAL);
  if(r()<0.7)return Q(r,"Quelle est la valeur la plus vraisemblable pour "+e[0]+" ?",e[1],e[2].map(function(w){return [w,"unit"];}),{},"Ordre de grandeur réaliste : "+e[0]+" ≈ "+e[1]+". Vérifier que le résultat est cohérent avec la réalité !");
  var w=pick(r,e[2]),bon=r()<0.4;
  var q=VF(r,"Un élève trouve que "+e[0]+" vaut "+(bon?e[1]:w)+". Ce résultat est-il vraisemblable ?",bon,(bon?"Oui":"Non")+" : "+e[0]+" vaut environ "+e[1]+".");
  q.choices=[{t:"Oui",err:bon?null:"grand"},{t:"Non",err:bon?"grand":null}];return q;
});
reg("perim_cercle",["3pm","cap","2nde"],C_GRAN,"Périmètre d’un cercle, aire d’un disque (figure)",["cercle","périmètre","disque","π","figure"],2,function(r){
  var t=rnd(r,0,2),R=pick(r,[2,3,4,5,6,10]);
  if(t===0){var ok=2*3.14*R;return Q(r,"Quel est le périmètre de ce cercle ? ("+M("\\pi \\approx 3{,}14")+")",ok,[[3.14*R,"demi"],[3.14*R*R,"formule"],[2*3.14*2*R,"conf"],[2*R*3,"arr"],[2*R+3.14,"addp"]],{u:"cm",d:2,fig:{k:"disc",r:R+" cm"}},
    M("\\mathcal{P} = 2 \\pi r = 2 \\times 3{,}14 \\times "+R+" = "+fm(ok))+" cm.");}
  if(t===1){var D=2*R,ok2=3.14*R*R;return Q(r,"Quelle est l’aire de ce disque ? ("+M("\\pi \\approx 3{,}14")+")",ok2,[[3.14*D*D,"demi"],[3.14*D,"formule"],[2*3.14*R,"formule"],[3.14*R*2,"formule"]],{u:"cm²",d:2,fig:{k:"disc",d:D+" cm"}},
    "Le rayon vaut "+D+" ÷ 2 = "+R+" cm. "+M("\\mathcal{A} = \\pi r^2 = 3{,}14 \\times "+R+"^2 = "+fm(ok2))+" cm².");}
  return QA(r,"Associe chaque formule à ce qu’elle calcule.",pickN(r,[[M("2 \\pi r"),"périmètre du cercle"],[M("\\pi r^2"),"aire du disque"],[M("L \\times \\ell"),"aire du rectangle"],[M("2(L + \\ell)"),"périmètre du rectangle"],[M("\\dfrac{b \\times h}{2}"),"aire du triangle"],[M("c^2"),"aire du carré"],[M("4c"),"périmètre du carré"]],4),"Périmètre : une longueur (en cm). Aire : une surface (en cm²).");
});
reg("vol_estim",["cap","2nde","1re"],C_GRAN,"Volumes et contenances en situation (estimation)",["volume","contenance","litre","pavé","cylindre","estimation"],3,function(r){
  var t=rnd(r,0,2);
  if(t===0){var L=pick(r,[1.2,1.5,2,0.8]),l=pick(r,[0.5,0.6,0.8,1]),h=pick(r,[0.4,0.5,0.6]),ok=L*l*h*1000;
    return QE(r,"Une cuve mesure "+f(L)+" m × "+f(l)+" m × "+f(h)+" m. Estime sa contenance en litres.",ok,{u:"L",fig:{k:"pave",L:f(L)+" m",l:f(l)+" m",h:f(h)+" m"}},
      M("V = "+fm(L)+" \\times "+fm(l)+" \\times "+fm(h)+" = "+fm(L*l*h,3))+" m³, et 1 m³ = 1 000 L : "+f(ok)+" L.");}
  if(t===1){var R=pick(r,[3,4,5,6]),H=pick(r,[10,12,15,20]),ok2=3.14*R*R*H/1000;
    return QE(r,"Une boîte cylindrique a un rayon de "+R+" cm et une hauteur de "+H+" cm. Estime sa contenance en litres.",ok2,{u:"L",fig:{k:"cyl",r:R+" cm",h:H+" cm"}},
      M("V = \\pi r^2 h \\approx 3{,}14 \\times "+R+"^2 \\times "+H+" \\approx "+fm(ok2*1000,0))+" cm³, soit environ "+f(ok2,2)+" L (1 L = 1 000 cm³).");}
  var c=pick(r,[60,80,100,120]),d=pick(r,[40,50,60]),e=pick(r,[30,40,50]),ok3=c*d*e/1000;
  return Q(r,"Un aquarium mesure "+c+" cm × "+d+" cm × "+e+" cm. Quelle est sa contenance ?",ok3,[[c*d*e,"unit"],[ok3*10,"unit"],[ok3/10,"unit"],[(c+d+e)/10,"addp"]],{u:"L",d:2,fig:{k:"pave",L:c+" cm",l:d+" cm",h:e+" cm"},far:2},
    M("V = "+c+" \\times "+d+" \\times "+e+" = "+fm(c*d*e))+" cm³ = "+f(ok3)+" L (1 L = 1 000 cm³).");
});
reg("grandeurs_comp",["cap","2nde"],C_GRAN,"Grandeurs composées : consommation, débit, rendement",["consommation","débit","rendement","L/100 km","grandeur quotient"],2,function(r){
  var t=rnd(r,0,2);
  if(t===0){var c=pick(r,[5,6,6.5,7,8]),d=pick(r,[150,250,340,400,520]),ok=c*d/100;
    return Q(r,"Une voiture consomme "+f(c)+" L aux 100 km. Combien consomme-t-elle pour "+d+" km ?",ok,[[c*d,"unit"],[d/c,"inv"],[c*d/10,"unit"],[c+d/100,"addp"]],{u:"L",d:2},
      M(fm(c)+" \\times \\dfrac{"+d+"}{100} = "+fm(ok))+" L.");}
  if(t===1){var V=pick(r,[120,180,240,300,600]),deb=pick(r,[12,15,20,30]),ok2=V/deb;
    return Q(r,"Un robinet débite "+deb+" L par minute. Combien de temps faut-il pour remplir une cuve de "+V+" L ?",ok2,[[V*deb,"inv"],[deb/V,"inv"],[V-deb,"addp"],[ok2*60,"base"]],{u:"min",d:2,far:2},
      "Durée = volume ÷ débit : "+M(V+" \\div "+deb+" = "+fm(ok2))+" min.");}
  var S=pick(r,[24,36,45,60,80]),rd2=pick(r,[8,10,12]),n=2,ok3=S*n/rd2;
  return Q(r,"Une peinture couvre "+rd2+" m² par litre. On passe "+n+" couches sur un mur de "+S+" m². Quelle quantité de peinture faut-il ?",ok3,[[S/rd2,"demi"],[S*rd2*n,"inv"],[S*n,"conf"],[rd2*n,"conf"]],{u:"L",d:2},
    "Surface à peindre : "+M(S+" \\times "+n+" = "+S*n)+" m². Peinture : "+M(S*n+" \\div "+rd2+" = "+fm(ok3))+" L.");
});

/* ═════════ GÉOMÉTRIE ═════════ */
var NOMS=[["B","A","C"],["E","D","F"],["S","R","T"],["N","M","P"],["J","I","K"],["H","G","L"]];
reg("pyth_fig",["3pm","cap","2nde"],C_GEO,"Pythagore avec une figure : égalité, calcul, estimation",["pythagore","hypoténuse","figure","égalité","estimation"],2,function(r){
  var n=pick(r,NOMS),R=n[0],A=n[1],C=n[2],t=rnd(r,0,3);   /* angle droit en n[0], sommet du haut n[1], sommet de droite n[2] */
  var tri=function(a,b,c){return {k:"tri",a:a,b:b,c:c,n:n};};
  if(t===0){var S=function(x){return x.split("").sort().join("");};var AC=S(A+C),AR=S(A+R),RC=S(R+C);
    return Q(r,"Le triangle "+A+R+C+" est rectangle en "+R+". Quelle égalité est vraie ?",M(AC+"^2 = "+AR+"^2 + "+RC+"^2"),[[M(AR+"^2 = "+AC+"^2 + "+RC+"^2"),"conf"],[M(RC+"^2 = "+AR+"^2 + "+AC+"^2"),"conf"],[M(AC+" = "+AR+" + "+RC),"formule"]],{fig:tri("","","")},
      "L’hypoténuse est le côté opposé à l’angle droit : ["+AC+"]. Donc "+M(AC+"^2 = "+AR+"^2 + "+RC+"^2")+".");}
  var tp=pick(r,TRIP);
  if(t===1){var a=tp[0],b=tp[1],c=tp[2];
    return Q(r,"Calculer la longueur de l’hypoténuse.",c,[[a+b,"formule"],[a*a+b*b,"formule"],[Math.round(Math.sqrt(b*b-a*a)*10)/10,"signe"],[c+1,"calc"]],{u:"cm",d:1,fig:tri(a+" cm",b+" cm","?")},
      M("c^2 = "+a+"^2 + "+b+"^2 = "+(a*a+b*b))+", donc "+M("c = \\sqrt{"+(a*a+b*b)+"} = "+c)+" cm.");}
  if(t===2){var a2=tp[0],c2=tp[2],b2=tp[1];
    return Q(r,"Calculer la longueur marquée « ? ».",b2,[[Math.round(Math.sqrt(a2*a2+c2*c2)*10)/10,"signe"],[c2-a2,"formule"],[c2*c2-a2*a2,"formule"],[c2+a2,"formule"]],{u:"cm",d:1,fig:tri(a2+" cm","?",c2+" cm")},
      "On connaît l’hypoténuse : on soustrait. "+M("? ^2 = "+c2+"^2 - "+a2+"^2 = "+(c2*c2-a2*a2))+", donc "+M("? = "+b2)+" cm.");}
  var x=rnd(r,3,9),y=rnd(r,4,12),h=Math.sqrt(x*x+y*y);if(Math.abs(h-Math.round(h))<0.05)return null;
  return QE(r,"Estime la longueur de l’hypoténuse avec le curseur.",h,{u:"cm",min:0,max:Math.ceil((x+y+2)/5)*5,tol:Math.max(0.3,(Math.ceil((x+y+2)/5)*5)*0.03),fig:tri(x+" cm",y+" cm","?")},
    M("\\sqrt{"+x+"^2 + "+y+"^2} = \\sqrt{"+(x*x+y*y)+"} \\approx "+fm(h,2))+" cm. Repère : l’hypoténuse est plus longue que "+Math.max(x,y)+" cm mais plus courte que "+(x+y)+" cm.");
});
reg("pyth_recip",["cap","2nde"],C_GEO,"Le triangle est-il rectangle ? (réciproque)",["pythagore","réciproque","triangle rectangle","vérifier"],2,function(r){
  var ok=r()<0.5,tp=ok?pick(r,TRIP):pick(r,[[4,5,7],[5,6,8],[6,7,9],[3,5,6],[7,8,11],[5,9,10],[6,8,11]]),a=tp[0],b=tp[1],c=tp[2];
  if(r()<0.35)return Q(r,"Un triangle a pour côtés "+a+" cm, "+b+" cm et "+c+" cm. Que faut-il comparer pour savoir s’il est rectangle ?",M(c+"^2")+" et "+M(a+"^2 + "+b+"^2"),[[M(c)+" et "+M(a+" + "+b),"formule"],[M(a+"^2")+" et "+M(b+"^2 + "+c+"^2"),"conf"],[M(c+"^2")+" et "+M("("+a+" + "+b+")^2"),"formule"]],{},
    "On compare le carré du plus grand côté avec la somme des carrés des deux autres.");
  var q=VF(r,"Un triangle a pour côtés "+a+" cm, "+b+" cm et "+c+" cm. Est-il rectangle ?",ok,M(c+"^2 = "+c*c)+" et "+M(a+"^2 + "+b+"^2 = "+(a*a+b*b))+" : "+(ok?"égalité, donc il est rectangle (réciproque de Pythagore).":"pas d’égalité, donc il n’est pas rectangle."));
  q.choices=[{t:"Oui",err:ok?null:"calc"},{t:"Non",err:ok?"calc":null}];return q;
});
reg("angles_tri",["3pm","cap"],C_GEO,"Somme des angles d’un triangle",["angles","triangle","180°","isocèle","figure"],1,function(r){
  var t=rnd(r,0,1);
  if(t===0){var a=rnd(r,3,9)*10,b=rnd(r,2,8)*10;if(a+b>=170)return null;var ok=180-a-b;
    return Q(r,"Quelle est la mesure de l’angle marqué « ? » ?",ok,[[360-a-b,"conf"],[a+b,"calc"],[90-Math.abs(a-b),"conf"],[ok+10,"calc"]],{u:"°",d:0,pos:true,fig:{k:"angtri",a:a+"°",b:b+"°",c:"?"}},
      "La somme des angles d’un triangle vaut 180° : "+M("180 - "+a+" - "+b+" = "+ok)+"°.");}
  var s=pick(r,[20,30,40,50,80,100]),base=(180-s)/2;
  return Q(r,"Un triangle isocèle a un angle au sommet de "+s+"°. Combien mesure chacun des deux autres angles ?",base,[[180-s,"demi"],[s,"conf"],[90-s/2+10,"calc"],[(360-s)/2,"conf"]],{u:"°",d:1,pos:true},
    "Les deux angles à la base sont égaux : "+M("(180 - "+s+") \\div 2 = "+fm(base))+"°.");
});
reg("thales",["cap","2nde"],C_GEO,"Thalès : calculer une longueur (figure)",["thalès","parallèles","proportionnalité","longueur"],3,function(r){
  var k=pick(r,[[2,3],[3,5],[1,2],[2,5],[3,4],[1,3]]),AB=k[1]*rnd(r,2,4),AM=AB*k[0]/k[1],MB=AB-AM,BC=k[1]*rnd(r,2,5),MN=BC*AM/AB;
  if(r()<0.7)return Q(r,"Les droites (MN) et (BC) sont parallèles. Calculer MN.",MN,[[BC*AM/MB,"conf"],[BC*AB/AM,"inv"],[BC-MB,"addp"],[MN+1,"calc"]],{u:"cm",d:2,fig:{k:"thales",L:{AM:f(AM)+" cm",MB:f(MB)+" cm",BC:f(BC)+" cm",MN:"?"}}},
    "Thalès : "+M("\\dfrac{AM}{AB} = \\dfrac{MN}{BC}")+" avec AB = "+f(AM)+" + "+f(MB)+" = "+f(AB)+" cm. Donc "+M("MN = "+fm(BC)+" \\times \\dfrac{"+fm(AM)+"}{"+fm(AB)+"} = "+fm(MN))+" cm. Attention : on utilise AB, pas MB !");
  return Q(r,"Les droites (MN) et (BC) sont parallèles. Quelle égalité est vraie ?",M("\\dfrac{AM}{AB} = \\dfrac{MN}{BC}"),[[M("\\dfrac{AM}{MB} = \\dfrac{MN}{BC}"),"conf"],[M("\\dfrac{AM}{AB} = \\dfrac{BC}{MN}"),"inv"],[M("\\dfrac{AB}{AM} = \\dfrac{MN}{BC}"),"inv"]],{fig:{k:"thales",L:{}}},
    "On compare les longueurs du petit triangle AMN à celles du grand triangle ABC, dans le même ordre : "+M("\\dfrac{AM}{AB} = \\dfrac{AN}{AC} = \\dfrac{MN}{BC}")+".");
});
reg("trigo_fig",["2nde","1re"],C_GEO,"Trigonométrie avec une figure : quelle relation ? quelle longueur ?",["cosinus","sinus","tangente","figure","angle"],2,function(r){
  var cas=pick(r,[{kn:"c",un:"b",ok:"cos"},{kn:"c",un:"a",ok:"sin"},{kn:"b",un:"a",ok:"tan"},{kn:"b",un:"c",ok:"cos"},{kn:"a",un:"c",ok:"sin"},{kn:"a",un:"b",ok:"tan"}]);
  var val=rnd(r,4,15),fg={k:"tri",ang:"α",a:"",b:"",c:""};fg[cas.kn]=val+" cm";fg[cas.un]="?";
  var S={cos:M("\\cos\\alpha = \\dfrac{\\text{adjacent}}{\\text{hypoténuse}}"),sin:M("\\sin\\alpha = \\dfrac{\\text{opposé}}{\\text{hypoténuse}}"),tan:M("\\tan\\alpha = \\dfrac{\\text{opposé}}{\\text{adjacent}}")};
  if(r()<0.6){var oth=["cos","sin","tan"].filter(function(x){return x!==cas.ok;});
    return Q(r,"On connaît l’angle α et la longueur indiquée. Quelle relation permet de calculer « ? » ?",S[cas.ok],[[S[oth[0]],"conf"],[S[oth[1]],"conf"],[M("a^2 + b^2 = c^2"),"formule"]],{fig:fg},
      "Par rapport à α : le côté vertical est opposé, le côté horizontal est adjacent, le plus long est l’hypoténuse. "+S[cas.ok]+".");}
  var hyp=pick(r,[10,12,20,8]),ang=pick(r,[30,60]),opp=hyp*(ang===30?0.5:0.866),fg2={k:"tri",ang:ang+"°",a:"?",b:"",c:hyp+" cm"};
  return Q(r,"Calculer la longueur « ? » (arrondie au dixième). On donne "+M("\\sin "+ang+"^\\circ \\approx "+(ang===30?"0{,}5":"0{,}866")),rd(opp,1),[[rd(hyp/(ang===30?0.5:0.866),1),"inv"],[rd(hyp*(ang===30?0.866:0.5),1),"conf"],[rd(hyp-(ang===30?0.5:0.866),1),"addp"]],{u:"cm",d:1,fig:fg2},
    M("\\sin "+ang+"^\\circ = \\dfrac{?}{"+hyp+"}")+", donc "+M("? = "+hyp+" \\times \\sin "+ang+"^\\circ \\approx "+fm(rd(opp,1)))+" cm.");
});
reg("repere",["3pm","cap","2nde"],C_GEO,"Lire les coordonnées d’un point dans un repère",["repère","coordonnées","abscisse","ordonnée","lecture"],1,function(r){
  var pts=[],us={},names=["A","B","C"];
  while(pts.length<3){var x=rnd(r,-4,4),y=rnd(r,-3,3);if(us[x+"|"+y]||x===y||x===0&&y===0)continue;us[x+"|"+y]=1;pts.push([x,y,names[pts.length]]);}
  var i=rnd(r,0,2),p=pts[i],C=function(a,b){return M("("+fm(a,0)+"\\,;\\,"+fm(b,0)+")");};
  var fig={k:"graph",xr:[-5,5],yr:[-4,4],dots:pts};
  return Q(r,"Quelles sont les coordonnées du point "+p[2]+" ?",C(p[0],p[1]),[[C(p[1],p[0]),"inv"],[C(-p[0],p[1]),"signe"],[C(p[0],-p[1]),"signe"],[C(p[0]+1,p[1]),"lect"]],{fig:fig},
    "On lit d’abord l’abscisse (axe horizontal), puis l’ordonnée (axe vertical) : "+p[2]+C(p[0],p[1])+".");
});

/* ═════════ STATISTIQUES ═════════ */
var DIAG=[{t:"ventes de croissants",x:["lun","mar","mer","jeu","ven"],g:10,u:"croissants"},{t:"colis livrés",x:["S1","S2","S3","S4","S5"],g:20,u:"colis"},{t:"clients du salon",x:["mar","mer","jeu","ven","sam"],g:5,u:"clients"},{t:"interventions",x:["jan","fév","mar","avr","mai"],g:2,u:"interventions"},{t:"élèves présents",x:["L","M","Me","J","V"],g:4,u:"élèves"}];
reg("lecture_diag",["3pm","cap","2nde"],C_STAT,"Lire et exploiter un diagramme en barres",["diagramme","lecture graphique","effectif","étendue","maximum"],1,function(r){
  var d=pick(r,DIAG),ys=d.x.map(function(){return d.g*rnd(r,2,9);}),fig={k:"bars",x:d.x,y:ys,u:d.u},t=rnd(r,0,2),i=rnd(r,0,4),mx=Math.max.apply(null,ys),mn=Math.min.apply(null,ys);
  if(t===0)return Q(r,"Combien y a-t-il eu de "+d.u+" pour « "+d.x[i]+" » ?",ys[i],[[ys[(i+1)%5],"lect"],[ys[i]+d.g,"lect"],[ys[i]-d.g,"lect"],[ys[i]/d.g,"lect"]],{d:0,fig:fig,pos:true},
    "On lit le haut de la barre « "+d.x[i]+" » sur l’axe vertical (une graduation = "+d.g+") : "+ys[i]+".");
  if(t===1){if(ys.filter(function(y){return y===mx;}).length>1)return null;var im=ys.indexOf(mx);
    return Q(r,"Pour quelle catégorie y a-t-il eu le plus de "+d.u+" ?","« "+d.x[im]+" »",d.x.filter(function(x,j){return j!==im;}).slice(0,3).map(function(x){return ["« "+x+" »","lect"];}),{fig:fig},"La barre la plus haute est « "+d.x[im]+" » ("+mx+").");}
  if(mx===mn)return null;
  return Q(r,"Quelle est l’étendue de cette série ?",mx-mn,[[mx,"conf"],[mx+mn,"signe"],[(mx-mn)/d.g,"lect"],[mx-mn+d.g,"lect"]],{d:0,fig:fig,pos:true},"Étendue = plus grande valeur − plus petite = "+M(mx+" - "+mn+" = "+(mx-mn))+".");
});
reg("stats_tab",["cap","2nde","1re"],C_STAT,"Effectifs et fréquences dans un tableau",["tableau","effectif","fréquence","moyenne pondérée","total"],2,function(r){
  var t=rnd(r,0,2);
  if(t<2){var cat=pick(r,[["Bus","Voiture","Vélo","À pied"],["CAP","2nde","1re","Tle"],["0 h","1 h","2 h","3 h"]]),n=cat.map(function(){return rnd(r,1,9)*2;}),N=n.reduce(function(a,b){return a+b;},0),i=rnd(r,0,3);
    if(N%5)n[3]+=5-N%5;N=n.reduce(function(a,b){return a+b;},0);
    var fig={k:"tab",hc:1,rows:[["Catégorie"].concat(cat),["Effectif"].concat(n.map(String))]};
    if(t===0)return Q(r,"Quel est l’effectif total ?",N,[[n.reduce(function(a,b){return Math.max(a,b);},0),"conf"],[N/4,"conf"],[N-n[3],"calc"],[N+n[0],"calc"]],{d:0,fig:fig},"On additionne les effectifs : "+n.join(" + ")+" = "+N+".");
    var ok=n[i]/N*100;
    return Q(r,"Quelle est la fréquence de « "+cat[i]+" » (en %) ?",ok,[[n[i],"conf"],[n[i]/N,"pct0"],[N/n[i],"inv"],[(N-n[i])/N*100,"compl"]],{u:"%",d:2,fig:fig},"Fréquence = effectif ÷ effectif total = "+M(n[i]+" \\div "+N+" = "+fm(n[i]/N,4))+", soit "+f(ok)+" %.");}
  var vals=[0,1,2,3],eff=vals.map(function(){return rnd(r,1,8);}),Ne=eff.reduce(function(a,b){return a+b;},0),S=vals.reduce(function(s,v,i){return s+v*eff[i];},0),moy=S/Ne;
  var fig2={k:"tab",hc:1,rows:[["Nombre d’enfants"].concat(vals.map(String)),["Effectif"].concat(eff.map(String))]};
  return Q(r,"Quelle est la moyenne du nombre d’enfants (arrondie au centième) ?",rd(moy,2),[[1.5,"conf"],[rd(S/4,2),"formule"],[rd(Ne/4,2),"conf"],[rd(S/(Ne+1),2),"calc"]],{d:2,fig:fig2},
    "Moyenne pondérée : "+M("\\dfrac{"+vals.map(function(v,i){return v+" \\times "+eff[i];}).join(" + ")+"}{"+Ne+"} = \\dfrac{"+S+"}{"+Ne+"} \\approx "+fm(moy,2))+".");
});
reg("moy_ponderee",["cap","2nde"],C_STAT,"Moyenne pondérée (coefficients)",["moyenne pondérée","coefficient","notes"],2,function(r){
  var n=[rnd(r,6,18),rnd(r,6,18),rnd(r,6,18)],c=pickN(r,[1,2,3,4],3),S=n[0]*c[0]+n[1]*c[1]+n[2]*c[2],C=c[0]+c[1]+c[2],ok=S/C,simple=(n[0]+n[1]+n[2])/3;
  if(Math.abs(ok-simple)<0.2)return null;
  return Q(r,"Notes : "+n[0]+" (coef. "+c[0]+"), "+n[1]+" (coef. "+c[1]+"), "+n[2]+" (coef. "+c[2]+"). Quelle est la moyenne (arrondie au dixième) ?",rd(ok,1),[[rd(simple,1),"conf"],[rd(S/3,1),"formule"],[rd(S/(C+1),1),"calc"],[rd((n[0]+n[1]+n[2])/C,1),"formule"]],{d:1},
    M("\\dfrac{"+n[0]+" \\times "+c[0]+" + "+n[1]+" \\times "+c[1]+" + "+n[2]+" \\times "+c[2]+"}{"+c[0]+" + "+c[1]+" + "+c[2]+"} = \\dfrac{"+S+"}{"+C+"} \\approx "+fm(ok,1))+". On divise par la somme des coefficients.");
});

/* ═════════ ÉQUATIONS ET CALCUL LITTÉRAL ═════════ */
reg("eq_traduire",["cap","2nde"],C_EQ,"Traduire un énoncé par une équation",["équation","mettre en équation","modéliser","problème"],2,function(r){
  var t=rnd(r,0,3),a=rnd(r,2,5),b=rnd(r,2,9),x=rnd(r,3,12);
  if(t===0){var c=a*x+b,nm=["le double","le triple","le quadruple","le quintuple"][a-2];
    return Q(r,"On multiplie un nombre "+M("x")+" par "+a+", puis on ajoute "+b+" : on obtient "+c+". Quelle équation traduit cette phrase ?",M(a+"x + "+b+" = "+c),[[M(a+"(x + "+b+") = "+c),"ordre"],[M("x + "+a+" + "+b+" = "+c),"addp"],[M(a+"x = "+c+" + "+b),"signe"]],{},
      "« multiplier par "+a+" » : "+M(a+"x")+" ; « puis ajouter "+b+" » : "+M(a+"x + "+b)+". Cela s’appelle aussi "+nm+" de x augmenté de "+b+".");}
  if(t===1){var c2=a*(x+b);
    return Q(r,"On ajoute "+b+" à un nombre "+M("x")+", puis on multiplie le résultat par "+a+" : on obtient "+c2+". Quelle équation traduit cette phrase ?",M(a+"(x + "+b+") = "+c2),[[M(a+"x + "+b+" = "+c2),"ordre"],[M("x + "+b+" \\times "+a+" = "+c2),"ordre"],[M(a+" + x + "+b+" = "+c2),"addp"]],{},
      "On ajoute d’abord : "+M("x + "+b)+", puis on multiplie TOUT par "+a+" : parenthèses obligatoires.");}
  if(t===2){var F=pick(r,[10,15,20,25]),h=pick(r,[3,4,5,6]),tot=F+h*x;
    return Q(r,"Une location coûte "+F+" € de frais fixes, plus "+h+" € par heure. On a payé "+tot+" €. Quelle équation permet de trouver la durée "+M("x")+" (en heures) ?",M(h+"x + "+F+" = "+tot),[[M(F+"x + "+h+" = "+tot),"inv"],[M(h+"(x + "+F+") = "+tot),"ordre"],[M(h+"x = "+tot+" + "+F),"signe"]],{},
      "Prix payé = frais fixes + prix par heure × nombre d’heures : "+M(F+" + "+h+"x = "+tot)+".");}
  var p=pick(r,[2,3]),age=rnd(r,8,14),sum=age+p*age;
  return Q(r,"Léo a "+M("x")+" ans. Sa mère a "+p+" fois son âge. Ensemble, ils ont "+sum+" ans. Quelle équation traduit la situation ?",M("x + "+p+"x = "+sum),[[M("x + "+p+" = "+sum),"addp"],[M(p+"x = "+sum),"demi"],[M("x \\times "+p+"x = "+sum),"addp"]],{},
    "Âge de Léo : "+M("x")+" ; âge de sa mère : "+M(p+"x")+" ; somme : "+M("x + "+p+"x = "+sum)+".");
});
reg("eq_err",["cap","2nde"],C_EQ,"Trouver l’erreur dans la résolution d’une équation",["équation","erreur","étapes","résoudre"],2,function(r){
  var a=rnd(r,2,6),b=rnd(r,2,15),x=rnd(r,2,9),c=a*x+b,bad=rnd(r,0,2);
  var st=[M(a+"x = "+c+" - "+b),M(a+"x = "+(c-b)),M("x = \\dfrac{"+(c-b)+"}{"+a+"} = "+x)];
  if(bad===0){st[0]=M(a+"x = "+c+" + "+b);st[1]=M(a+"x = "+(c+b));st[2]=M("x = \\dfrac{"+(c+b)+"}{"+a+"} \\approx "+fm(rd((c+b)/a,2)));}
  if(bad===1){var v1=c-b+(r()<0.5?1:-1)*rnd(r,1,3);st[1]=M(a+"x = "+v1);st[2]=M("x = \\dfrac{"+v1+"}{"+a+"}");}
  if(bad===2){st[2]=M("x = "+(c-b)+" - "+a+" = "+(c-b-a));}
  return QX(r,"Résolution de "+M(a+"x + "+b+" = "+c)+". Où est l’erreur ?",st,bad,
    "On retire "+b+" des deux côtés : "+M(a+"x = "+(c-b))+", puis on DIVISE par "+a+" : "+M("x = "+x)+".");
});
var FORMS=[{f:"U = R \\times I",x:"R",ok:"R = \\dfrac{U}{I}",w:["R = U \\times I","R = \\dfrac{I}{U}","R = U - I"]},{f:"d = v \\times t",x:"v",ok:"v = \\dfrac{d}{t}",w:["v = d \\times t","v = \\dfrac{t}{d}","v = d - t"]},{f:"P = U \\times I",x:"I",ok:"I = \\dfrac{P}{U}",w:["I = P \\times U","I = \\dfrac{U}{P}","I = P - U"]},{f:"\\rho = \\dfrac{m}{V}",x:"V",ok:"V = \\dfrac{m}{\\rho}",w:["V = m \\times \\rho","V = \\dfrac{\\rho}{m}","V = m - \\rho"]},{f:"V = L \\times \\ell \\times h",x:"h",ok:"h = \\dfrac{V}{L \\times \\ell}",w:["h = V \\times L \\times \\ell","h = \\dfrac{L \\times \\ell}{V}","h = V - L - \\ell"]},{f:"C = 2 \\pi r",x:"r",ok:"r = \\dfrac{C}{2\\pi}",w:["r = C \\times 2\\pi","r = \\dfrac{2\\pi}{C}","r = \\dfrac{C}{\\pi}"]},{f:"P = m \\times g",x:"m",ok:"m = \\dfrac{P}{g}",w:["m = P \\times g","m = \\dfrac{g}{P}","m = P - g"]},{f:"E = P \\times t",x:"t",ok:"t = \\dfrac{E}{P}",w:["t = E \\times P","t = \\dfrac{P}{E}","t = E - P"]}];
reg("formules_isoler",["cap","2nde","1re"],C_EQ,"Isoler une grandeur dans une formule",["formule","isoler","transformer une formule","U=RI"],2,function(r){
  var F=pick(r,FORMS);
  if(r()<0.25){var G=pickN(r,FORMS,4);return QA(r,"Associe chaque formule à la grandeur isolée correspondante.",G.map(function(g){return [M(g.f),M(g.ok)];}),"Pour isoler une grandeur qui multiplie, on divise par les autres facteurs.");}
  return Q(r,"À partir de "+M(F.f)+", comment exprimer "+M(F.x)+" ?",M(F.ok),F.w.map(function(w,i){return [M(w),i===2?"addp":"inv"];}),{},
    "Si "+M(F.f)+", on divise par ce qui multiplie "+M(F.x)+" : "+M(F.ok)+".");
});
var LITP=[["2(x + 3)","2x + 6"],["x + x","2x"],["x \\times x","x^2"],["3(x - 2)","3x - 6"],["2x + 3x","5x"],["x^2 + x^2","2x^2"],["4x - x","3x"],["(x + 1) + (x + 2)","2x + 3"],["2 \\times 3x","6x"],["-(x - 4)","-x + 4"],["x(x + 2)","x^2 + 2x"],["5x - 2x + 1","3x + 1"],["x \\times 4","4x"],["2x \\times 3x","6x^2"]];
reg("lit_tuiles",["cap","2nde"],C_EQ,"Expressions littérales égales (tuiles et pièges)",["calcul littéral","réduire","développer","x²","tuiles"],2,function(r){
  if(r()<0.6)return QA(r,"Associe chaque expression à l’expression égale.",pickN(r,LITP,4).map(function(p){return [M(p[0]),M(p[1])];}),"x + x = 2x (on additionne) ; x × x = x² (on multiplie).");
  var t=rnd(r,0,2),a=rnd(r,2,6),b=rnd(r,2,6);
  if(t===0)return Q(r,"Réduire "+M(a+"x + "+b+"x"),M((a+b)+"x"),[[M((a+b)+"x^2"),"conf"],[M((a*b)+"x"),"addp"],[M(a*b+"x^2"),"conf"]],{lit:(a+b)+"*x",form:"red"},M(a+"x + "+b+"x = ("+a+" + "+b+")x = "+(a+b)+"x")+". Pas de carré : on additionne des « x ».");
  if(t===1)return Q(r,"Réduire "+M(a+"x \\times "+b+"x"),M((a*b)+"x^2"),[[M((a*b)+"x"),"conf"],[M((a+b)+"x^2"),"addp"],[M((a+b)+"x"),"addp"]],{lit:(a*b)+"*x^2",form:"red"},M(a+"x \\times "+b+"x = "+a+" \\times "+b+" \\times x \\times x = "+(a*b)+"x^2")+".");
  return Q(r,"Réduire "+M(a+"x + "+b),M(a+"x + "+b),[[M((a+b)+"x"),"conf"],[M(String(a+b)),"conf"],[M((a*b)+"x"),"addp"]],{},"On ne peut pas additionner des « x » et des nombres seuls : "+M(a+"x + "+b)+" est déjà réduite.");
});
reg("double_dist",["2nde","1re"],C_EQ,"Développer un produit (double distributivité)",["développer","double distributivité","calcul littéral"],3,function(r){
  var a=rnd(r,1,7)*(r()<0.3?-1:1),b=rnd(r,1,7)*(r()<0.3?-1:1),s=a+b,p=a*b,P=function(c1,c0){return M(quadL(1,c1,c0).replace(/^1x/,"x"));};
  if(s===0)return null;
  var A=function(v){return (v<0?"- ":"+ ")+Math.abs(v);};
  return Q(r,"Développer et réduire "+M("(x "+A(a)+")(x "+A(b)+")"),P(s,p),[[P(0,p),"demi"],[P(s,s),"addp"],[P(p,s),"inv"],[P(s,-p),"signe"]],{lit:"x^2+("+s+")*x+("+p+")",form:"dev"},
    "Chaque terme du 1er facteur multiplie chaque terme du 2e : "+M("x^2 "+A(b)+"x "+A(a)+"x "+A(p)+" = "+quadL(1,s,p).replace(/^1x/,"x"))+".");
});

/* ═════════ FONCTIONS ═════════ */
function polyInc(r){var y=[rnd(r,-2,1)],i;for(i=1;i<=6;i++)y.push(y[i-1]+rnd(r,0,2));if(y[6]-y[0]<4)return null;return y;}
reg("lect_image",["cap","2nde","1re"],C_FONC,"Lire une image, un antécédent sur un graphique",["image","antécédent","lecture graphique","courbe","f(x)"],2,function(r){
  var y=polyInc(r);if(!y)return null;
  var pts=y.map(function(v,i){return [i,v];}),ymin=Math.min.apply(null,y)-1,ymax=Math.max.apply(null,y)+1,fig={k:"graph",xr:[-1,7],yr:[ymin,ymax],pts:pts,names:[[6.6,y[6]-0.6,"𝒞f",0]]},t=rnd(r,0,2);
  var i=rnd(r,1,5);
  if(t===0){var wr=[[y[i+1],"lect"],[y[i-1],"lect"],[i,"conf"],[y[i]+1,"lect"],[y[i]-1,"lect"]];var inv=y.indexOf(i);if(inv>=0&&inv!==i)wr.unshift([inv,"inv"]);
    return Q(r,"Lire l’image de "+i+" par la fonction "+M("f")+".",y[i],wr,{d:0,fig:fig},"On part de "+i+" sur l’axe des abscisses, on monte jusqu’à la courbe, on lit l’ordonnée : "+M("f("+i+") = "+y[i])+".");}
  var target=y[i];if(y.filter(function(v){return v===target;}).length>1)return null;
  if(t===1)return Q(r,"Lire l’antécédent de "+target+" par la fonction "+M("f")+".",i,[[y[target]!==undefined&&target>=0&&target<=6?y[target]:target+1,"inv"],[i+1,"lect"],[i-1,"lect"],[target,"conf"]],{d:0,fig:fig},"On part de "+target+" sur l’axe des ordonnées, on va jusqu’à la courbe, on lit l’abscisse : "+i+".");
  return Q(r,"Résoudre graphiquement "+M("f(x) = "+target)+".",M("x = "+i),[[M("x = "+(y[target]!==undefined&&target>=0&&target<=6&&y[target]!==i?y[target]:i+2)),"inv"],[M("x = "+(i+1)),"lect"],[M("x = "+target),"conf"]],{fig:fig},"On cherche le(s) point(s) de la courbe d’ordonnée "+target+" : abscisse "+i+".");
});
reg("fn_types",["2nde"],C_FONC,"Fonction linéaire, affine, constante (tuiles)",["fonction linéaire","fonction affine","constante","reconnaître"],1,function(r){
  var a=pick(r,[2,3,-4,0.5,5]),b=pick(r,[1,-3,4,7]),c=pick(r,[3,-2,6]);
  return QA(r,"Associe chaque fonction à sa nature.",[[M("f(x) = "+linL(a,0)),"linéaire"],[M("g(x) = "+linL(pick(r,[2,-3,4]),b)),"affine (non linéaire)"],[M("h(x) = "+c),"constante"],[M("k(x) = x^2 "+(b<0?"- ":"+ ")+Math.abs(b)),"ni affine, ni linéaire"]],
    "Linéaire : f(x) = ax. Affine : f(x) = ax + b. Constante : f(x) = b. Avec x², ce n’est plus une fonction affine.");
});
reg("droite_eq",["2nde","1re"],C_FONC,"Lire l’équation d’une droite sur un graphique",["droite","coefficient directeur","ordonnée à l’origine","équation réduite","lecture graphique"],2,function(r){
  var a=pick(r,[-2,-1,1,2,0.5,3]),b=rnd(r,-2,3);if(a===b)return null;
  var x1=a>0?-2:-1,x2=a===3?1:a===2?2:4,fig={k:"graph",xr:[-3,5],yr:[-4,6],pts:[[-3,-3*a+b],[5,5*a+b]].map(function(p){return p;}),dots:[[0,b,""],[1,a+b,""]]};
  var Y=function(p,q){return M("y = "+linL(p,q));};
  if(r()<0.6)return Q(r,"Quelle est l’équation de cette droite ?",Y(a,b),[[Y(b===0?a+1:b,a),"inv"],[Y(a,-b===b?b+1:-b),"signe"],[Y(-a,b),"signe"],[Y(a,b+1),"lect"],[Y(a+1,b),"lect"]],{fig:fig},
    "La droite coupe l’axe des ordonnées en "+b+" (ordonnée à l’origine). Quand x augmente de 1, y "+(a>0?"augmente":"diminue")+" de "+f(Math.abs(a))+" : coefficient directeur "+f(a)+". Donc "+Y(a,b)+".");
  return Q(r,"Quelle est l’ordonnée à l’origine de cette droite ?",b,[[a,"conf"],[rd(-b/a,2),"conf"],[b+1,"lect"]],{d:2,fig:fig},"C’est l’ordonnée du point où la droite coupe l’axe vertical : "+b+".");
});
reg("parabole_lect",["1re","term"],C_FN,"Fonction du 2nd degré : lire une parabole",["parabole","second degré","sommet","coefficient a","solutions"],2,function(r){
  var a=pick(r,[1,-1,0.5,-0.5]),h=rnd(r,-2,3),k=rnd(r,-3,3),pts=[];for(var x=-3;x<=5.01;x+=0.25)pts.push([x,a*(x-h)*(x-h)+k]);
  pts=pts.filter(function(p){return p[1]>=-6&&p[1]<=6;});
  var fig={k:"graph",xr:[-3,5],yr:[-5,5],pts:pts},t=rnd(r,0,2),C=function(p,q){return M("("+fm(p,0)+"\\,;\\,"+fm(q,0)+")");};
  if(t===0)return Q(r,"Quelles sont les coordonnées du sommet de la parabole ?",C(h,k),[[C(k,h),"inv"],[C(-h,k),"signe"],[C(h,-k),"signe"]].filter(function(w){return w[0]!==C(h,k);}),{fig:fig},"Le sommet est le point le plus "+(a>0?"bas":"haut")+" de la parabole : "+C(h,k)+".");
  if(t===1)return Q(r,"Que peut-on dire du coefficient "+M("a")+" de "+M("f(x) = ax^2 + bx + c")+" ?",a>0?"a est positif":"a est négatif",[[a>0?"a est négatif":"a est positif","signe"],["a est nul","conf"],["on ne peut pas savoir","conf"]],{fig:fig},
    "Parabole tournée vers le "+(a>0?"haut (en U) : a > 0.":"bas (en ∩) : a < 0."));
  var n=k===0?1:(a>0)===(k<0)?2:0;
  return Q(r,"Combien de solutions l’équation "+M("f(x) = 0")+" a-t-elle ?",String(n),[[String((n+1)%3),"lect"],[String((n+2)%3),"lect"],["une infinité","conf"]],{fig:fig},"On compte les points où la parabole coupe l’axe des abscisses : "+n+".");
});

/* ═════════ 1re et Tle ═════════ */
reg("evol_pieges",["1re"],C_EVOL,"Évolutions : pièges classiques (étape fausse, estimation)",["évolutions successives","coefficient","piège","estimation"],3,function(r){
  var t=rnd(r,0,2),p=pick(r,[10,20,25,50]);
  if(t===0)return QX(r,"Un prix augmente de "+p+" % puis baisse de "+p+" %. Malik écrit :",[M("\\text{CM global} = "+fm(1+p/100)+" \\times "+fm(1-p/100)),M("= "+fm((1+p/100)*(1-p/100),4)),"donc le prix revient à sa valeur de départ."],2,
    "Le coefficient global vaut "+f((1+p/100)*(1-p/100),4)+" < 1 : le prix BAISSE de "+f(p*p/100)+" %. Une hausse puis une baisse de même taux ne se compensent pas.");
  if(t===1){var C=pick(r,[1000,1500,2000,5000]),tx=pick(r,[2,3,4,5]),n=pick(r,[5,8,10]),ok=C*Math.pow(1+tx/100,n);
    return QE(r,"On place "+f(C)+" € à "+tx+" % par an (intérêts composés). Estime le capital au bout de "+n+" ans.",ok,{u:"€",lo:0},M(fm(C)+" \\times "+fm(1+tx/100)+"^{"+n+"} \\approx "+fm(ok,0))+" €. Les intérêts simples donneraient "+f(C*(1+n*tx/100))+" €.");}
  var p1=pick(r,[10,20,30]),p2=pick(r,[10,20,50]),cg=(1+p1/100)*(1+p2/100);
  return QA(r,"Associe chaque situation à son coefficient multiplicateur global.",[["+"+p1+" % puis +"+p2+" %","× "+f(cg,4)],["+"+p1+" % puis −"+p2+" %","× "+f((1+p1/100)*(1-p2/100),4)],["−"+p1+" % puis −"+p2+" %","× "+f((1-p1/100)*(1-p2/100),4)],["+"+(p1+p2)+" %","× "+f(1+(p1+p2)/100,4)]],
    "Évolutions successives : on MULTIPLIE les coefficients. « +"+p1+" % puis +"+p2+" % » n’est pas « +"+(p1+p2)+" % ».");
});
reg("proba_tab",["1re","term"],C_SP,"Probabilités à partir d’un tableau croisé",["probabilité","tableau croisé","intersection","conditionnelle"],2,function(r){
  var a=rnd(r,4,15),b=rnd(r,4,15),c=rnd(r,4,15),d=rnd(r,4,15),N=a+b+c+d,t=rnd(r,0,2);
  var fig={k:"tab",hc:1,rows:[["","Fille","Garçon","Total"],["Interne",String(a),String(b),String(a+b)],["Externe",String(c),String(d),String(c+d)],["Total",String(a+c),String(b+d),String(N)]]};
  var P=function(n,dd){return M(frL(n,dd));};
  if(t===0)return Q(r,"On choisit un élève au hasard. Probabilité qu’il soit interne ?",P(a+b,N),[[P(a+b,c+d),"formule"],[P(a,N),"conf"],[P(a+b,a+c),"conf"]],{fig:fig},"Internes : "+(a+b)+" sur "+N+" élèves : "+P(a+b,N)+".");
  if(t===1)return Q(r,"On choisit un élève au hasard. Probabilité que ce soit une fille interne ?",P(a,N),[[P(a,a+b),"conf"],[P(a,a+c),"conf"],[P(a+b+a+c,N),"addp"]],{fig:fig},"Filles ET internes : "+a+" élèves sur "+N+" : "+P(a,N)+".");
  return Q(r,"On choisit une fille au hasard. Probabilité qu’elle soit interne ?",P(a,a+c),[[P(a,N),"conf"],[P(a,a+b),"inv"],[P(a+c,N),"conf"]],{fig:fig},"On se limite aux "+(a+c)+" filles : "+a+" sont internes, d’où "+P(a,a+c)+" (probabilité conditionnelle).");
});
reg("deriv_tuiles",["term"],C_DER,"Dérivées usuelles (tuiles)",["dérivée","formules","tuiles","f’(x)"],2,function(r){
  var pool=[["x^2","2x"],["x^3","3x^2"],["5x","5"],["7","0"],["\\dfrac{1}{x}","-\\dfrac{1}{x^2}"],["3x^2","6x"],["x^2 + 4x","2x + 4"],["-2x + 1","-2"],["4x^3","12x^2"]];
  if(r()<0.7)return QA(r,"Associe chaque fonction "+M("f(x)")+" à sa dérivée "+M("f'(x)")+".",pickN(r,pool,4).map(function(p){return [M(p[0]),M(p[1])];}),"(xⁿ)’ = n xⁿ⁻¹ ; (ax)’ = a ; (constante)’ = 0.");
  var n=rnd(r,2,4),a=rnd(r,2,6);
  return Q(r,"Dériver "+M("f(x) = "+a+"x^{"+n+"}"),M((a*n)+"x^{"+(n-1)+"}"),[[M((a*n)+"x^{"+n+"}"),"demi"],[M(a+"x^{"+(n-1)+"}"),"demi"],[M((a+n)+"x^{"+(n-1)+"}"),"addp"]],{},M("(ax^n)' = a \\times n \\times x^{n-1} = "+(a*n)+"x^{"+(n-1)+"}")+".");
});
reg("suites_plus",["term"],C_SUI,"Suites : reconnaître, ranger, estimer",["suite","arithmétique","géométrique","estimation","tuiles"],2,function(r){
  var t=rnd(r,0,2);
  if(t===0){var u=pick(r,[2,3,5]),d=pick(r,[2,3,4]),q=pick(r,[2,3]);
    return QA(r,"Associe chaque suite à sa nature.",[[[u,u+d,u+2*d,u+3*d].join(" ; ")+" ; …","arithmétique de raison "+d],[[u,u*q,u*q*q,u*q*q*q].join(" ; ")+" ; …","géométrique de raison "+q],[[u+20,u+20-d,u+20-2*d,u+20-3*d].join(" ; ")+" ; …","arithmétique de raison −"+d],[[1,4,9,16].join(" ; ")+" ; …","ni arithmétique, ni géométrique"]],
      "Arithmétique : on ajoute toujours le même nombre. Géométrique : on multiplie toujours par le même nombre.");}
  if(t===1){var u0=pick(r,[1000,1500,2000]),qq=pick(r,[1.03,1.05,0.95,0.9]),n=pick(r,[8,10,12]),ok=u0*Math.pow(qq,n);
    return QE(r,"Suite géométrique : "+M("u_0 = "+fm(u0))+", raison "+M(fm(qq))+". Estime "+M("u_{"+n+"}")+".",ok,{lo:0},M("u_{"+n+"} = "+fm(u0)+" \\times "+fm(qq)+"^{"+n+"} \\approx "+fm(ok,0))+".");}
  var a=pick(r,[3,5,7]),rr=pick(r,[-2,4,3]);
  return QO(r,"Remets dans l’ordre les étapes pour calculer "+M("u_{10}")+" (suite arithmétique, "+M("u_0 = "+a)+", raison "+rr+").",["On écrit la formule "+M("u_n = u_0 + n r"),"On remplace : "+M("u_{10} = "+a+" + 10 \\times "+par(rr)),"On calcule : "+M("u_{10} = "+(a+10*rr))],"Formule, remplacement, calcul.",{how:"dans l’ordre",sep:" → "});
});

/* ═════════ PROBLÈMES DES MÉTIERS (plusieurs étapes) ═════════ */
reg("pb_commerce",["3pm","cap","2nde"],C_MET,"Commerce : remise, TVA, prix de vente",["commerce","remise","TVA","prix","problème"],3,function(r){
  var t=rnd(r,0,2);
  if(t===0){var HT=pick(r,[80,100,120,150,200,250]),p=pick(r,[10,20,25]),ok=HT*(1-p/100)*1.2;
    return Q(r,"Un article coûte "+HT+" € HT. On accorde une remise de "+p+" % sur le prix HT, puis on ajoute la TVA à 20 %. Quel est le prix TTC à payer ?",ok,[[HT*(1-p/100),"demi"],[HT*(1+0.2-p/100),"addp"],[HT*1.2-p,"addp"],[HT*1.2,"demi"]],{u:"€",d:2},
      "Remise : "+M(HT+" \\times "+fm(1-p/100)+" = "+fm(HT*(1-p/100)))+" € HT. TVA : "+M(fm(HT*(1-p/100))+" \\times 1{,}2 = "+fm(ok))+" € TTC.");}
  if(t===1){var A=pick(r,[12,15,20,24,30]),m=pick(r,[25,40,50,60]),ok2=A*(1+m/100);
    return Q(r,"Un commerçant achète un produit "+A+" € et applique un coefficient de marge de "+m+" %. Quel est son prix de vente ?",ok2,[[A+m,"addp"],[A*m/100,"compl"],[A/(1-m/100),"inv"],[A*m,"pct0"]],{u:"€",d:2},M(A+" \\times "+fm(1+m/100)+" = "+fm(ok2))+" €.");}
  var pu=pick(r,[2.4,3.5,4.2,1.85]),n=pick(r,[12,18,24,36]);
  return QE(r,"Estime le prix de "+n+" articles à "+f(pu)+" € l’unité.",pu*n,{u:"€"},"Ordre de grandeur : "+M(Math.round(pu)+" \\times "+n+" = "+Math.round(pu)*n)+" €. Exact : "+f(pu*n)+" €.");
});
reg("pb_batiment",["cap","2nde"],C_MET,"Bâtiment : surfaces, peinture, carrelage",["bâtiment","surface","peinture","carrelage","pots","problème"],3,function(r){
  var t=rnd(r,0,2);
  if(t===0){var L=pick(r,[4,5,6]),l=pick(r,[3,4]),H=2.5,S=2*(L+l)*H,cov=pick(r,[10,12]),pot=2.5,lit=S/cov,np=Math.ceil(lit/pot);
    return Q(r,"Une pièce mesure "+L+" m × "+l+" m, hauteur "+f(H)+" m. On peint les 4 murs (une couche). La peinture couvre "+cov+" m²/L et se vend en pots de 2,5 L. Combien de pots faut-il ?",np,[[Math.max(1,Math.floor(lit/pot)),"arr"],[Math.ceil(L*l/cov/pot),"formule"],[Math.ceil(lit),"conf"],[np+1,"calc"]].filter(function(w){return w[0]!==np;}),{d:0},
      "Murs : "+M("2 \\times ("+L+" + "+l+") \\times "+fm(H)+" = "+fm(S))+" m². Peinture : "+M(fm(S)+" \\div "+cov+" \\approx "+fm(lit,2))+" L. Pots : "+M(fm(lit,2)+" \\div 2{,}5 \\approx "+fm(lit/pot,2))+", donc "+np+" pots (on arrondit au-dessus).");}
  if(t===1){var a=pick(r,[3,4,5]),b=pick(r,[2,3,4]),c=pick(r,[20,25,30,40]),ok=a*100/c*(b*100/c);
    return Q(r,"Combien de carreaux carrés de "+c+" cm de côté faut-il pour couvrir une surface de "+a+" m × "+b+" m (sans perte) ?",ok,[[a*b*100/c,"unit"],[a*b/(c*c),"unit"],[(a+b)*100/c,"addp"],[ok*2,"calc"]],{d:0,far:2},
      "Sur la longueur : "+M(a*100+" \\div "+c+" = "+a*100/c)+" ; sur la largeur : "+M(b*100+" \\div "+c+" = "+b*100/c)+". Total : "+M(a*100/c+" \\times "+b*100/c+" = "+ok)+" carreaux.");}
  var pente=pick(r,[2,3,4,5]),Lh=pick(r,[2,3,4,5]),dh=pente*Lh;
  return Q(r,"Une rampe d’accès a une pente de "+pente+" %. Quelle hauteur monte-t-elle sur "+Lh+" m de longueur horizontale ?",dh,[[pente*Lh*10,"unit"],[pente+Lh,"addp"],[dh/10,"unit"],[Lh*100/pente,"inv"]],{u:"cm",d:1},
    "Pente de "+pente+" % : on monte "+pente+" cm pour 100 cm. Sur "+Lh+" m = "+Lh*100+" cm : "+M(fm(pente/100)+" \\times "+Lh*100+" = "+dh)+" cm.");
});
reg("pb_cuisine",["3pm","cap"],C_MET,"Cuisine : recettes, coût d’une portion",["cuisine","recette","proportionnalité","coût","portion"],2,function(r){
  var t=rnd(r,0,1);
  if(t===0){var n=pick(r,[4,6,8]),q=pick(r,[150,200,250,300]),N=pick(r,[10,15,20,30]),ok=q*N/n/1000;
    return Q(r,"Une recette pour "+n+" personnes demande "+q+" g de beurre. Combien de kilogrammes faut-il pour "+N+" personnes ?",ok,[[q*N/n,"unit"],[q*n/N/1000,"inv"],[(q+N-n)/1000,"addp"],[ok*10,"unit"]],{u:"kg",d:3},
      "Pour 1 personne : "+M(q+" \\div "+n+" = "+fm(q/n))+" g. Pour "+N+" : "+M(fm(q/n)+" \\times "+N+" = "+fm(q*N/n))+" g = "+f(ok,3)+" kg.");}
  var c=pick(r,[18,24,30,36]),p=pick(r,[8,10,12]),ok2=c/p;
  return Q(r,"Un plat de "+p+" portions coûte "+c+" € en matières premières. Avec un coefficient multiplicateur de 3,5, quel est le prix de vente d’une portion ?",ok2*3.5,[[c*3.5,"demi"],[ok2,"demi"],[ok2+3.5,"addp"],[c/3.5/p,"inv"]],{u:"€",d:2},
    "Coût d’une portion : "+M(c+" \\div "+p+" = "+fm(ok2))+" €. Prix de vente : "+M(fm(ok2)+" \\times 3{,}5 = "+fm(ok2*3.5))+" €.");
});
reg("pb_auto",["cap","2nde"],C_MET,"Maintenance auto · Transport : carburant, vitesse moyenne",["auto","consommation","carburant","vitesse moyenne","problème"],2,function(r){
  var t=rnd(r,0,1);
  if(t===0){var c=pick(r,[5,6,7,8]),d=pick(r,[150,200,250,300]),px=pick(r,[1.8,1.9,1.75]),ok=c*d/100*px;
    return Q(r,"Un véhicule consomme "+c+" L aux 100 km. Le carburant coûte "+f(px)+" €/L. Quel est le coût d’un trajet de "+d+" km ?",ok,[[c*d/100,"demi"],[c*d*px,"unit"],[c*px,"demi"],[d/c*px,"inv"]],{u:"€",d:2},
      "Carburant : "+M(c+" \\times \\dfrac{"+d+"}{100} = "+fm(c*d/100))+" L. Coût : "+M(fm(c*d/100)+" \\times "+fm(px)+" = "+fm(ok))+" €.");}
  var d1=pick(r,[60,90,120]),h=pick(r,[[1,30],[2,0],[1,15],[2,30]]),T=h[0]+h[1]/60,ok2=d1/T;
  return Q(r,"Un livreur parcourt "+d1+" km en "+h[0]+" h "+(h[1]<10?"0":"")+h[1]+". Quelle est sa vitesse moyenne ?",ok2,[[d1/(h[0]+h[1]/100),"base"],[d1/h[0],"demi"],[d1/(h[0]+1),"calc"],[d1*T,"inv"],[ok2+10,"calc"]],{u:"km/h",d:2},
    h[0]+" h "+h[1]+" = "+f(T)+" h. "+M("v = \\dfrac{d}{t} = \\dfrac{"+d1+"}{"+fm(T)+"} = "+fm(ok2))+" km/h.");
});
reg("pb_logistique",["cap","2nde"],C_MET,"Logistique : palettes, cartons, chargement",["logistique","palette","colis","rangement","problème"],3,function(r){
  var t=rnd(r,0,1);
  if(t===0){var P=[120,80],c=pick(r,[[40,20],[30,20],[40,40],[60,40]]),couches=pick(r,[3,4,5]),parC=(P[0]/c[0])*(P[1]/c[1]),ok=parC*couches;
    return Q(r,"Sur une palette de 120 cm × 80 cm, on pose des cartons de "+c[0]+" cm × "+c[1]+" cm sur "+couches+" couches. Combien de cartons au maximum ?",ok,[[parC,"demi"],[(P[0]+P[1])/(c[0]+c[1])*couches,"addp"],[ok+couches,"calc"],[parC*(couches+1),"calc"]],{d:0},
      "Par couche : "+M("(120 \\div "+c[0]+") \\times (80 \\div "+c[1]+") = "+(P[0]/c[0])+" \\times "+(P[1]/c[1])+" = "+parC)+". Avec "+couches+" couches : "+ok+" cartons.");}
  var m=pick(r,[12,15,18,25]),n=pick(r,[20,30,40]),max=pick(r,[400,500,600]),ok2=Math.floor(max/m);
  return Q(r,"Un chariot supporte "+max+" kg. Chaque colis pèse "+m+" kg. Combien de colis au maximum peut-on charger ?",ok2,[[Math.ceil(max/m)===ok2?ok2+2:Math.ceil(max/m),"arr"],[max*m,"inv"],[max-m,"addp"],[ok2-1,"calc"]],{d:0,far:2},
    M(max+" \\div "+m+" \\approx "+fm(rd(max/m,2)))+" : on garde l’entier INFÉRIEUR, donc "+ok2+" colis (un de plus dépasserait "+max+" kg).");
});
reg("pb_sante",["cap","2nde"],C_MET,"Santé · Social : doses, débits, dilutions",["santé","dose","débit","dilution","problème"],3,function(r){
  var t=rnd(r,0,2);
  if(t===0){var dpk=pick(r,[10,15,20]),kg=pick(r,[12,18,25,30]),ok=dpk*kg;
    return Q(r,"La dose prescrite est de "+dpk+" mg par kg. Quelle dose pour un enfant de "+kg+" kg ?",ok,[[dpk+kg,"addp"],[kg/dpk,"inv"],[ok/10,"unit"],[ok*2,"calc"]],{u:"mg",d:0},M(dpk+" \\times "+kg+" = "+ok)+" mg.");}
  if(t===1){var V=pick(r,[250,500,1000]),h=pick(r,[2,4,5,8]),ok2=V/h;
    return Q(r,"Une perfusion de "+V+" mL doit passer en "+h+" h. Quel est le débit en mL/h ?",ok2,[[V*h,"inv"],[V/(h*60),"base"],[h/V,"inv"],[ok2/2,"calc"]],{u:"mL/h",d:2,far:2},M(V+" \\div "+h+" = "+fm(ok2))+" mL/h.");}
  var pr=pick(r,[1,2]),eau=pick(r,[4,9,19]),tot=pick(r,[500,1000,2000]),ok3=tot*pr/(pr+eau);
  return Q(r,"Un produit se dilue à raison de "+pr+" volume de produit pour "+eau+" volumes d’eau. Quelle quantité de produit pour préparer "+tot+" mL de solution ?",ok3,[[tot*pr/eau,"conf"],[tot/eau,"conf"],[tot*pr/(pr+eau)*2,"calc"],[tot-tot*pr/(pr+eau),"compl"]],{u:"mL",d:1},
    "La solution compte "+(pr+eau)+" volumes, dont "+pr+" de produit : "+M(tot+" \\times \\dfrac{"+pr+"}{"+(pr+eau)+"} \\approx "+fm(rd(ok3,1)))+" mL.");
});
reg("pb_coiffure",["3pm","cap"],C_MET,"Coiffure · Esthétique : mélanges, temps de pose, tarifs",["coiffure","mélange","durée","tarif","problème"],2,function(r){
  var t=rnd(r,0,1);
  if(t===0){var col=pick(r,[30,40,50,60]),k=pick(r,[1.5,2,3]),ok=col*(1+k);
    return Q(r,"Un mélange se prépare avec "+col+" mL de coloration et "+f(k)+" fois plus d’oxydant. Quel volume total obtient-on ?",ok,[[col*k,"demi"],[col+k,"addp"],[col*k*2,"calc"],[col*2,"conf"]],{u:"mL",d:1},
      "Oxydant : "+M(col+" \\times "+fm(k)+" = "+fm(col*k))+" mL. Total : "+M(col+" + "+fm(col*k)+" = "+fm(ok))+" mL.");}
  var h=pick(r,[[9,40],[10,15],[14,50],[15,35]]),pose=pick(r,[25,35,40,45]),tt=h[0]*60+h[1]+pose,H=Math.floor(tt/60),Mn=tt%60;
  return Q(r,"Une couleur est posée à "+h[0]+" h "+h[1]+". Le temps de pose est de "+pose+" min. À quelle heure faut-il rincer ?",H+" h "+(Mn<10?"0":"")+Mn,[[h[0]+" h "+(h[1]+pose),"base"],[(H+1)+" h "+(Mn<10?"0":"")+Mn,"calc"],[H+" h "+((Mn+20)%60<10?"0":"")+(Mn+20)%60,"calc"]],{},
    h[1]+" + "+pose+" = "+(h[1]+pose)+" min = 1 h "+(h[1]+pose-60)+" min : on rince à "+H+" h "+(Mn<10?"0":"")+Mn+".");
});
reg("pb_elec",["cap","2nde","1re"],C_MET,"Électricité · Énergie : puissance, énergie, coût",["électricité","puissance","énergie","kWh","coût","problème"],3,function(r){
  var t=rnd(r,0,1);
  if(t===0){var P=pick(r,[1000,1500,2000,2500]),h=pick(r,[2,3,4,5]),px=pick(r,[0.2,0.25]),E=P*h/1000,ok=E*px;
    return Q(r,"Un radiateur de "+P+" W fonctionne "+h+" h. Le kWh coûte "+f(px)+" €. Quel est le coût ?",ok,[[P*h*px,"unit"],[E,"demi"],[P/h*px/1000,"inv"],[ok*10,"unit"]],{u:"€",d:2,far:2},
      "Énergie : "+M("E = P \\times t = "+fm(P/1000)+" \\text{ kW} \\times "+h+" \\text{ h} = "+fm(E))+" kWh. Coût : "+M(fm(E)+" \\times "+fm(px)+" = "+fm(ok))+" €.");}
  var U=230,I=pick(r,[2,4,5,8,10]),ok2=U*I;
  return Q(r,"Un appareil branché sur 230 V est traversé par un courant de "+I+" A. Quelle est sa puissance ?",ok2,[[U/I,"inv"],[U+I,"addp"],[ok2/1000,"unit"],[ok2*2,"calc"]],{u:"W",d:2,far:2},M("P = U \\times I = 230 \\times "+I+" = "+ok2)+" W.");
});

/* ═════════ ALGORITHMIQUE ET TABLEUR ═════════ */
reg("algo_var",["3pm","cap","2nde"],C_ALGO,"Lire un programme (variables, boucles, tests)",["algorithmique","python","variable","boucle","programme"],2,function(r){
  var t=rnd(r,0,3);
  if(t===0){var x0=rnd(r,2,7),a=rnd(r,2,4),b=rnd(r,1,9),c=rnd(r,1,6),x1=a*x0+b,ok=x1-c;
    return Q(r,"Que vaut x à la fin de ce programme ?",ok,[[x0,"conf"],[x1,"demi"],[a*(x0+b)-c,"ordre"],[ok+c+c,"signe"]],{d:0,fig:{k:"code",lines:["x = "+x0,"x = "+a+" * x + "+b,"x = x - "+c]}},
      "x vaut "+x0+", puis "+a+" × "+x0+" + "+b+" = "+x1+", puis "+x1+" − "+c+" = "+ok+". Chaque ligne remplace l’ancienne valeur.");}
  if(t===1){var n=rnd(r,3,6),s=0,i;for(i=0;i<n;i++)s+=i;
    return Q(r,"Que vaut s à la fin de ce programme ?",s,[[s+n,"calc"],[n,"conf"],[s-(n-1),"calc"],[n*(n+1)/2+n,"calc"]],{d:0,fig:{k:"code",lines:["s = 0","for i in range("+n+"):","    s = s + i"]}},
      "range("+n+") donne i = 0, 1, …, "+(n-1)+" (et pas "+n+") : s = "+Array.apply(null,{length:n}).map(function(_,k){return k;}).join(" + ")+" = "+s+".");}
  if(t===2){var v=rnd(r,5,20),seuil=rnd(r,8,14),res=v>=seuil?"Admis":"Refusé";
    return Q(r,"Qu’affiche ce programme ?",res,[[res==="Admis"?"Refusé":"Admis","conf"],["seuil","conf"],[String(v),"conf"]],{fig:{k:"code",lines:["note = "+v,"if note >= "+seuil+":","    print(\"Admis\")","else:","    print(\"Refusé\")"]}},
      v+(v>=seuil?" ≥ ":" < ")+seuil+" : le programme affiche « "+res+" ».");}
  var A1=rnd(r,2,9),A2=rnd(r,2,9),k=rnd(r,2,5),ok2=k*A1+A2;
  return Q(r,"Dans un tableur, A1 contient "+A1+" et A2 contient "+A2+". Qu’affiche la cellule B1 ?",ok2,[[k*(A1+A2),"ordre"],[k+A1+A2,"addp"],[k*A1,"demi"],[ok2+1,"calc"]],{d:0,fig:{k:"code",lines:["B1  =  ="+k+"*A1+A2"]}},
    "Le tableur respecte les priorités : "+M(k+" \\times "+A1+" + "+A2+" = "+ok2)+".");
});
