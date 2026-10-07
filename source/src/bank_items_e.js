/* ═══════════════════════════════════════════════════════════════
   BANQUE v3.4 — 2/3 : nouveaux angles (géométrie, statistiques,
   calcul littéral, fonctions, suites, probabilités, problèmes métiers).
   Chaque angle = une autre façon d’interroger la même notion :
   calcul inverse, contexte professionnel, lecture de figure, tuiles,
   remise en ordre, estimation au curseur, étape fausse, vrai / faux.
═══════════════════════════════════════════════════════════════ */
function hhmm(h,m){h=((h%24)+24)%24;return h+" h "+(m<10?"0":"")+m;}
function oui(r,q,ok,expl){var v=VF(r,q,ok,expl);v.choices=[{t:"Oui",err:ok?null:"calc"},{t:"Non",err:ok?"calc":null}];return v;}
function cpl(v){return M("("+fm(v[0],0)+"\\,;\\,"+fm(v[1],0)+")");}
var PI="("+M("\\pi \\approx 3{,}14")+")";

/* ─── Grandeurs ─── */
addAngles("volume_cyl",[
  function(r){var R=pick(r,[2,3,5,10]),h=pick(r,[4,5,8,10,12]),V=rd(3.14*R*R*h,2);
    return Q(r,"Un cylindre de rayon "+R+" cm a un volume de "+f(V)+" cm³. Quelle est sa hauteur ? "+PI,h,[[rd(V/(3.14*R),2),"demi"],[rd(V/(R*R),2),"formule"],[rd(V/(3.14*2*R),2),"conf"],[rd(V*3.14*R*R,0),"inv"]],{u:"cm",d:2,far:2},
      M("h = \\dfrac{V}{\\pi r^2} = \\dfrac{"+fm(V)+"}{3{,}14 \\times "+R+"^2} = "+h)+" cm.");},
  function(r){var D=pick(r,[6,8,10,12,20]),h=pick(r,[5,10,11,15]),R=D/2,ok=rd(3.14*R*R*h,2);
    return Q(r,"Une boîte de conserve a un diamètre de "+D+" cm et une hauteur de "+h+" cm. Quel est son volume ? "+PI,ok,[[rd(3.14*D*D*h,2),"conf"],[rd(3.14*D*h,2),"formule"],[rd(3.14*R*h,2),"demi"],[rd(ok/3,2),"demi"]],{u:"cm³",d:2},
      "Attention : le rayon est la MOITIÉ du diamètre, r = "+R+" cm. "+M("V = 3{,}14 \\times "+R+"^2 \\times "+h+" = "+fm(ok))+" cm³.");},
  function(r){var R=rnd(r,3,9),h=rnd(r,8,25),ok=3.14*R*R*h;
    return QE(r,"Estime le volume de ce cylindre (en cm³).",ok,{u:"cm³",fig:{k:"cyl",r:"r = "+R+" cm",h:"h = "+h+" cm"}},"Ordre de grandeur : "+M("3 \\times "+R+"^2 \\times "+h+" = "+(3*R*R*h))+". Exact : "+f(ok,1)+" cm³.");},
  function(r){var L=[[2,10],[3,5],[1,40],[4,4],[5,2],[2,20],[3,8]],c=pickN(r,L,4),vs={},ok=true;
    c.forEach(function(x){var v=x[0]*x[0]*x[1];if(vs[v])ok=false;vs[v]=1;});if(!ok)return null;
    var s=c.slice().sort(function(a,b){return a[0]*a[0]*a[1]-b[0]*b[0]*b[1];});
    return QO(r,"Range ces cylindres du plus petit au plus grand volume.",s.map(function(x){return "r = "+x[0]+" cm ; h = "+x[1]+" cm";}),
      "On compare "+M("r^2 \\times h")+" (π est commun) : "+s.map(function(x){return x[0]*x[0]*x[1];}).join(" < ")+". Le rayon compte « au carré » !",{how:"du plus petit au plus grand volume"});},
  function(r){var R=pick(r,[3,4,5,6]),h=pick(r,[10,12,20]),ok=rd(3.14*R*R*h,2);
    return QX(r,"Léo calcule le volume d’un cylindre de rayon "+R+" cm et de hauteur "+h+" cm :",[M("V = \\pi \\times r^2 \\times h"),M("V = 3{,}14 \\times "+R+" \\times 2 \\times "+h),M("V = "+fm(rd(3.14*R*2*h,2))+" \\text{ cm}^3")],1,
      M(R+"^2 = "+R+" \\times "+R+" = "+R*R)+" et non "+M(R+" \\times 2")+". Le bon résultat : "+M("3{,}14 \\times "+R*R+" \\times "+h+" = "+fm(ok))+" cm³.");}
]);
addAngles("durees",[
  function(r){var h1=rnd(r,8,20),m1=pick(r,[15,20,30,40,45,50]),d=rnd(r,70,170),t=h1*60+m1+d,H=Math.floor(t/60),Mi=t%60,dh=Math.floor(d/60),dm=d%60;
    return Q(r,"Un film commence à "+hhmm(h1,m1)+" et se termine à "+hhmm(H,Mi)+". Combien de temps dure-t-il ?",hm(dh,dm),[[hm(H-h1,Math.abs(Mi-m1)),"base"],[hm(dh,(dm+40)%60),"calc"],[hm(dh+1,dm),"calc"]].filter(function(w){return w[0]!==hm(dh,dm);}),{},
      "On compte de "+hhmm(h1,m1)+" à "+hhmm(h1+1,0)+" ("+(60-m1)+" min), puis jusqu’à "+hhmm(H,Mi)+" : en tout "+d+" min = "+hm(dh,dm)+".");},
  function(r){var m=pick(r,[75,90,105,135,150,165,195,210,250]),h=Math.floor(m/60),mm=m%60;
    return Q(r,"Convertir "+m+" min en heures et minutes.",hm(h,mm),[[hm(Math.floor(m/100),m%100),"base"],[hm(h,Math.round((m/60-h)*100)),"base"],[hm(h+1,mm),"calc"]].filter(function(w){return w[0]!==hm(h,mm);}),{},
      M(m+" = "+h+" \\times 60 + "+mm)+", donc "+hm(h,mm)+". (1 h = 60 min, pas 100 !)");},
  function(r){var ps=[],us={},tries=0;
    while(ps.length<4&&tries++<30){var h=rnd(r,7,17),m=pick(r,[10,25,35,40,45,50,55]),d=pick(r,[20,25,35,40,45,50]),t=h*60+m+d;if(us[t])continue;us[t]=1;ps.push([hhmm(h,m)+" + "+d+" min",hhmm(Math.floor(t/60),t%60)]);}
    return QA(r,"Associe chaque départ + durée à l’heure d’arrivée.",ps,"Quand les minutes dépassent 60, on retire 60 min et on ajoute 1 h.");},
  function(r){var h=23,m=pick(r,[35,40,45,50]),d=pick(r,[30,40,45,50]),t=(h*60+m+d)%1440;
    return Q(r,"Il est "+hhmm(h,m)+". Quelle heure sera-t-il dans "+d+" min ?",hhmm(Math.floor(t/60),t%60),[["24 h "+(t%60<10?"0":"")+(t%60),"base"],[hhmm(h,m+d-40),"calc"],[hhmm(Math.floor(t/60)+1,t%60),"calc"]],{},
      "Après 23 h 59 vient 0 h 00 (minuit) : il sera "+hhmm(Math.floor(t/60),t%60)+".");},
  function(r){var L=[["1 h 30 min",90],["1,25 h",75],["100 min",100],["1 h 05 min",65],["0,75 h",45],["1,5 h",90],["50 min",50],["2 h",120],["1 h 50 min",110]],c=pickN(r,L,4),vs={},ok=true;
    c.forEach(function(x){if(vs[x[1]])ok=false;vs[x[1]]=1;});if(!ok)return null;
    var s=c.slice().sort(function(a,b){return a[1]-b[1];});
    return QO(r,"Range ces durées de la plus courte à la plus longue.",s.map(function(x){return x[0];}),"En minutes : "+s.map(function(x){return x[0]+" = "+x[1]+" min";}).join(" ; ")+".",{how:"de la plus courte à la plus longue"});}
]);
addAngles("perim_aire",[
  function(r){var l=rnd(r,3,9),L=rnd(r,l+1,15),A=L*l;
    return Q(r,"Un rectangle a une aire de "+A+" cm² et une largeur de "+l+" cm. Quelle est sa longueur ?",L,[[A-l,"addp"],[A*l,"inv"],[A/2-l,"conf"],[L+1,"calc"]],{u:"cm",d:0,pos:true},
      M("L = \\dfrac{\\mathcal{A}}{\\ell} = \\dfrac{"+A+"}{"+l+"} = "+L)+" cm.");},
  function(r){var c=rnd(r,3,15),P=4*c,A=c*c;
    return Q(r,"Un carré a un périmètre de "+P+" cm. Quelle est son aire ?",A,[[P,"conf"],[c,"demi"],[P*P/4,"formule"],[2*c,"formule"]],{u:"cm²",d:0,pos:true},
      "Côté : "+M(P+" \\div 4 = "+c)+" cm. Aire : "+M(c+" \\times "+c+" = "+A)+" cm².");},
  function(r){var L=rnd(r,6,18),l=rnd(r,3,L-1),aire=r()<0.5;
    var fg={k:"rect",L:L+" m",l:l+" m",fill:aire,in:aire?"aire ?":"périmètre ?"};
    return aire?Q(r,"Quelle est l’aire de cette pièce ?",L*l,[[2*(L+l),"conf"],[L+l,"conf"],[L*l*2,"demi"]],{u:"m²",d:0,fig:fg},M(L+" \\times "+l+" = "+L*l)+" m².")
               :Q(r,"Quelle longueur de plinthe faut-il pour faire le tour de cette pièce ?",2*(L+l),[[L*l,"conf"],[L+l,"demi"],[2*L+l,"demi"]],{u:"m",d:0,fig:fg},M("2 \\times ("+L+" + "+l+") = "+2*(L+l))+" m.");},
  function(r){var L=rnd(r,30,60)/10,l=rnd(r,25,L*10-1)/10,p=pick(r,[0.8,0.9]),ok=rd(2*(L+l)-p,2);
    return Q(r,"Une pièce rectangulaire mesure "+f(L)+" m sur "+f(l)+" m. On pose une plinthe tout autour, sauf devant la porte ("+f(p)+" m). Quelle longueur de plinthe ?",ok,[[rd(2*(L+l),2),"demi"],[rd(L+l-p,2),"demi"],[rd(L*l-p,2),"conf"],[rd(2*(L+l)+p,2),"signe"]],{u:"m",d:2},
      "Périmètre : "+M("2 \\times ("+fm(L)+" + "+fm(l)+") = "+fm(rd(2*(L+l),2)))+" m, moins la porte : "+M(fm(rd(2*(L+l),2))+" - "+fm(p)+" = "+fm(ok))+" m.");},
  function(r){var k=pick(r,[2,3]);
    return VF(r,"Si on multiplie la longueur ET la largeur d’un rectangle par "+k+", son aire est multipliée par "+k+".",false,"Faux : l’aire est multipliée par "+M(k+" \\times "+k+" = "+k*k)+". Exemple : un rectangle 2 × 3 (aire 6) devient "+2*k+" × "+3*k+" (aire "+6*k*k+").");}
]);

/* ─── Géométrie ─── */
addAngles("aire_triangle",[
  function(r){var t=pick(r,[[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20]]),a=t[0],b=t[1],c=t[2],ok=a*b/2;
    return Q(r,"Quelle est l’aire de ce triangle rectangle ?",ok,[[a*c/2,"conf"],[a*b,"demi"],[a+b+c,"conf"],[b*c/2,"conf"]],{u:"cm²",d:2,fig:{k:"tri",a:a+" cm",b:b+" cm",c:c+" cm"}},
      "Dans un triangle rectangle, les deux côtés de l’angle droit sont base et hauteur : "+M("\\dfrac{"+a+" \\times "+b+"}{2} = "+fm(ok))+" cm². L’hypoténuse ne sert pas.");},
  function(r){var b=rnd(r,4,16),h=rnd(r,3,12),A=b*h/2;
    return Q(r,"Un triangle a une aire de "+f(A)+" cm² et une base de "+b+" cm. Quelle est sa hauteur ?",h,[[rd(A/b,2),"demi"],[rd(A-b,2),"addp"],[rd(A*2*b,2),"inv"],[h+1,"calc"]],{u:"cm",d:2,pos:true},
      M("h = \\dfrac{2 \\times \\mathcal{A}}{b} = \\dfrac{2 \\times "+fm(A)+"}{"+b+"} = "+h)+" cm.");},
  function(r){var b=rnd(r,6,14),h=2*rnd(r,2,6);
    return QX(r,"Inès calcule l’aire d’un triangle de base "+b+" cm et de hauteur "+h+" cm :",[M("\\mathcal{A} = \\dfrac{b \\times h}{2}"),M("\\mathcal{A} = \\dfrac{"+b+" + "+h+"}{2}"),M("\\mathcal{A} = "+fm((b+h)/2)+" \\text{ cm}^2")],1,
      "On MULTIPLIE base et hauteur : "+M("\\dfrac{"+b+" \\times "+h+"}{2} = "+fm(b*h/2))+" cm².");},
  function(r){var all=[["rectangle",M("L \\times \\ell")],["triangle",M("\\dfrac{b \\times h}{2}")],["disque",M("\\pi \\times r^2")],["carré",M("c \\times c")],["parallélogramme",M("b \\times h")]];
    return QA(r,"Associe chaque figure à la formule de son aire.",pickN(r,all,4),"Le triangle est la moitié d’un rectangle (ou d’un parallélogramme) de même base et même hauteur.");}
]);
addAngles("pyth_hyp",[
  function(r){var a=rnd(r,3,11),b=rnd(r,4,12);if(a===b)return null;var c=Math.sqrt(a*a+b*b);if(Math.abs(c-Math.round(c))<1e-9)return null;var ok=rd(c,1);
    return Q(r,"Calculer la longueur « ? » (arrondie au dixième).",ok,[[a+b,"formule"],[a*a+b*b,"formule"],[rd(Math.sqrt(Math.abs(b*b-a*a)),1),"signe"],[rd(c,0)===ok?rd(ok+1,1):rd(c,0),"arr"]],{u:"cm",d:1,fig:{k:"tri",a:a+" cm",b:b+" cm",c:"?",hl:"c"}},
      M("?^2 = "+a+"^2 + "+b+"^2 = "+(a*a+b*b))+", donc "+M("? = \\sqrt{"+(a*a+b*b)+"} \\approx "+fm(ok,1))+" cm.");},
  function(r){var t=pick(r,[[1.5,2,2.5],[0.6,0.8,1],[1.2,1.6,2],[0.9,1.2,1.5],[2.4,3.2,4]]);
    return Q(r,"Un rectangle mesure "+f(t[1])+" m sur "+f(t[0])+" m. Quelle est la longueur de sa diagonale ?",t[2],[[rd(t[0]+t[1],2),"formule"],[rd(t[0]*t[0]+t[1]*t[1],2),"formule"],[rd(2*(t[0]+t[1]),2),"conf"],[rd(t[2]+0.5,2),"calc"]],{u:"m",d:2},
      "La diagonale est l’hypoténuse d’un triangle rectangle : "+M("d^2 = "+fm(t[1])+"^2 + "+fm(t[0])+"^2 = "+fm(rd(t[2]*t[2],2)))+", "+M("d = "+fm(t[2]))+" m.");},
  function(r){var a=rnd(r,4,12),b=rnd(r,5,15),c=Math.sqrt(a*a+b*b);
    return QE(r,"Les côtés de l’angle droit d’un triangle rectangle mesurent "+a+" cm et "+b+" cm. Estime l’hypoténuse.",c,{u:"cm",lo:0},
      "L’hypoténuse est plus longue que "+Math.max(a,b)+" cm mais plus courte que "+(a+b)+" cm. "+M("\\sqrt{"+(a*a+b*b)+"} \\approx "+fm(c,1))+" cm.");},
  function(r){var t=pick(r,TRIP.slice(0,9)),a=t[0],b=t[1],s=a*a+b*b;
    return QX(r,"Sami calcule l’hypoténuse BC d’un triangle rectangle en A, avec AB = "+a+" cm et AC = "+b+" cm :",[M("BC^2 = AB^2 + AC^2"),M("BC^2 = "+a+"^2 + "+b+"^2 = "+s),M("BC = "+s+" \\div 2 = "+fm(s/2))],2,
      "La dernière étape est fausse : on prend la RACINE CARRÉE, "+M("BC = \\sqrt{"+s+"} = "+t[2])+" cm.");}
]);
addAngles("pyth_cote",[
  function(r){var t=pick(r,TRIP.slice(0,10)),c=t[2],a=t[0],b=t[1];
    return Q(r,"Calculer la longueur « ? ».",b,[[rd(Math.sqrt(c*c+a*a),2),"signe"],[c-a,"formule"],[c*c-a*a,"formule"],[c+a,"formule"]],{u:"cm",d:2,fig:{k:"tri",a:a+" cm",b:"?",c:c+" cm",hl:"b"}},
      "« ? » est un côté de l’angle droit : on SOUSTRAIT. "+M("?^2 = "+c+"^2 - "+a+"^2 = "+(c*c-a*a))+", "+M("? = "+b)+" cm.");},
  function(r){var t=pick(r,[[3,4,5],[1.2,1.6,2],[1.8,2.4,3],[2.4,3.2,4],[3,4,5],[1.5,2,2.5]]);
    return Q(r,"Une échelle de "+f(t[2])+" m est appuyée contre un mur. Son pied est à "+f(t[0])+" m du mur. À quelle hauteur arrive-t-elle ?",t[1],[[rd(Math.sqrt(t[2]*t[2]+t[0]*t[0]),2),"signe"],[rd(t[2]-t[0],2),"formule"],[rd(t[2]*t[2]-t[0]*t[0],2),"formule"]],{u:"m",d:2},
      "L’échelle est l’hypoténuse : "+M("h^2 = "+fm(t[2])+"^2 - "+fm(t[0])+"^2 = "+fm(rd(t[1]*t[1],2)))+", "+M("h = "+fm(t[1]))+" m.");},
  function(r){var t=pick(r,TRIP.slice(0,9)),c=t[2],a=t[0],s=c*c+a*a;
    return QX(r,"Le triangle ABC est rectangle en A, BC = "+c+" cm et AB = "+a+" cm. Nina calcule AC :",[M("AB^2 + AC^2 = BC^2"),M("AC^2 = "+c+"^2 + "+a+"^2 = "+s),M("AC = \\sqrt{"+s+"} \\approx "+fm(Math.sqrt(s),1))],1,
      "Il faut SOUSTRAIRE : "+M("AC^2 = "+c+"^2 - "+a+"^2 = "+(c*c-a*a))+", donc AC = "+t[1]+" cm. Un côté de l’angle droit est plus court que l’hypoténuse.");},
  function(r){return VF(r,"Dans un triangle rectangle, l’hypoténuse est toujours le plus grand des trois côtés.",true,"Vrai : elle est en face de l’angle droit, le plus grand angle du triangle.");}
]);
addAngles("trigo_calc",[
  function(r){var c=pick(r,[{t:"\\cos",v:"0{,}5",a:60,w:[30,45]},{t:"\\sin",v:"0{,}5",a:30,w:[60,45]},{t:"\\tan",v:"1",a:45,w:[30,60]}]);
    return Q(r,"Dans un triangle rectangle, "+M(c.t+"\\,\\alpha = "+c.v)+". Que mesure l’angle α ?",c.a+"°",[[c.w[0]+"°","conf"],[c.w[1]+"°","conf"],[c.v.replace("{,}",",")+"°","formule"]],{},
      "Valeurs à connaître : cos 60° = sin 30° = 0,5 et tan 45° = 1. La calculatrice donne α avec la touche "+M(c.t+"^{-1}")+".");},
  function(r){var hyp=pick(r,[6,8,10,12,15]),a=pick(r,[20,25,35,40,50,55]),s=Math.sin(a*Math.PI/180),cs=Math.cos(a*Math.PI/180),ok=rd(hyp*s,1);
    return Q(r,"Triangle rectangle : hypoténuse "+hyp+" cm, angle α = "+a+"°. Longueur du côté opposé à α, au dixième ? ("+M("\\sin "+a+"^\\circ \\approx "+fm(rd(s,3),3))+", "+M("\\cos "+a+"^\\circ \\approx "+fm(rd(cs,3),3))+")",ok,
      [[rd(hyp*cs,1),"conf"],[rd(hyp/s,1),"inv"],[rd(hyp*Math.tan(a*Math.PI/180),1),"conf"]],{u:"cm",d:1},
      "Opposé et hypoténuse : sinus. "+M("\\text{opp.} = "+hyp+" \\times \\sin "+a+"^\\circ \\approx "+fm(ok,1))+" cm.");},
  function(r){var L=pick(r,[4,5,6,8,10,12]),a=pick(r,[4,5,6]),t=Math.tan(a*Math.PI/180),ok=rd(L*t,2);
    return Q(r,"Une rampe d’accès s’étend sur "+L+" m à l’horizontale et fait un angle de "+a+"° avec le sol. Quelle hauteur franchit-elle ? ("+M("\\tan "+a+"^\\circ \\approx "+fm(rd(t,3),3))+")",ok,
      [[rd(L/t,2),"inv"],[rd(L*Math.cos(a*Math.PI/180),2),"conf"],[rd(L*a/100,2),"conf"],[rd(ok*10,2),"unit"]],{u:"m",d:2,far:2},
      "Opposé (hauteur) et adjacent (horizontale) : tangente. "+M("h = "+L+" \\times \\tan "+a+"^\\circ \\approx "+fm(ok))+" m.");},
  function(r){var d=pick(r,[15,20,25,30]),a=pick(r,[30,35,40,50]),ok=d*Math.tan(a*Math.PI/180);
    return QE(r,"On se place à "+d+" m du pied d’un arbre et on vise son sommet sous un angle de "+a+"° (depuis le sol). Estime la hauteur de l’arbre. ("+M("\\tan "+a+"^\\circ \\approx "+fm(rd(Math.tan(a*Math.PI/180),2),2))+")",ok,{u:"m",lo:0},
      M("h = "+d+" \\times \\tan "+a+"^\\circ \\approx "+fm(ok,1))+" m.");}
]);
addAngles("angles_tri",[
  function(r){var a=rnd(r,15,75);
    return Q(r,"Un triangle rectangle a un angle aigu de "+a+"°. Combien mesure l’autre angle aigu ?",90-a,[[180-a,"demi"],[a,"conf"],[180-90+a,"signe"],[90-a+10,"calc"]],{u:"°",d:0,pos:true},
      "Les deux angles aigus d’un triangle rectangle font 90° à eux deux : "+M("90 - "+a+" = "+(90-a))+"°.");},
  function(r){var s=pick(r,[20,30,40,50,70,80,100,110]),b=(180-s)/2;
    return Q(r,"Ce triangle est isocèle : les deux angles « ? » sont égaux. Combien mesure chacun ?",b,[[180-s,"demi"],[s,"conf"],[(360-s)/2,"conf"]],{u:"°",d:1,pos:true,fig:{k:"angtri",a:"?",b:"?",c:s+"°"}},
      M("(180 - "+s+") \\div 2 = "+fm(b))+"°.");},
  function(r){var all=[["60° ; 60° ; 60°","équilatéral"],["90° ; 45° ; 45°","rectangle et isocèle"],["30° ; 60° ; 90°","rectangle (non isocèle)"],["40° ; 40° ; 100°","isocèle (non rectangle)"],["50° ; 60° ; 70°","quelconque"]];
    return QA(r,"Associe chaque triangle (ses trois angles) à sa nature.",pickN(r,all,4),"Deux angles égaux : isocèle. Un angle de 90° : rectangle. Trois angles de 60° : équilatéral.");},
  function(r){return VF(r,"Un triangle peut avoir deux angles obtus (plus grands que 90°).",false,"Faux : deux angles de plus de 90° dépasseraient déjà 180°, la somme des trois angles.");}
]);
addAngles("thales",[
  function(r){var k=pick(r,[[2,3],[3,5],[1,2],[2,5],[3,4]]),u=rnd(r,1,3),AM=k[0]*u*2,MB=(k[1]-k[0])*u*2,v=rnd(r,1,3),AN=k[0]*v*3,NC=(k[1]-k[0])*v*3;
    return Q(r,"(MN) // (BC). Calculer AN.",AN,[[rd(NC*MB/AM,2),"inv"],[rd(AM*NC/(AM+MB),2),"conf"],[rd(NC-MB+AM,2),"addp"],[AN+1,"calc"]],{u:"cm",d:2,fig:{k:"thales",L:{AM:AM+" cm",MB:MB+" cm",NC:NC+" cm",AN:"?"}}},
      "Les points se correspondent : "+M("\\dfrac{AN}{NC} = \\dfrac{AM}{MB}")+" (petit morceau sur reste). "+M("AN = "+NC+" \\times \\dfrac{"+AM+"}{"+MB+"} = "+AN)+" cm.");},
  function(r){var b=pick(r,[1,1.5,2]),o=pick(r,[1.2,1.5,2,2.5]),O=pick(r,[6,9,12,15]),ok=rd(O*b/o,2);
    return Q(r,"Un bâton vertical de "+f(b)+" m fait une ombre de "+f(o)+" m. Au même moment, un arbre fait une ombre de "+O+" m. Quelle est la hauteur de l’arbre ?",ok,[[rd(O*o/b,2),"inv"],[rd(O+b-o,2),"addp"],[O,"conf"]],{u:"m",d:2},
      "Situation de Thalès (rayons du soleil parallèles) : "+M("\\dfrac{h}{"+fm(b)+"} = \\dfrac{"+O+"}{"+fm(o)+"}")+", "+M("h = "+fm(ok))+" m.");},
  function(r){var AM=rnd(r,2,5),k=pick(r,[2,3,4]),AB=AM*k,AN=rnd(r,2,6),par=r()<0.5,AC=par?AN*k:AN*k+pick(r,[1,-1]);
    return oui(r,"AM = "+AM+" cm, AB = "+AB+" cm, AN = "+AN+" cm et AC = "+AC+" cm (M sur [AB], N sur [AC]). Les droites (MN) et (BC) sont-elles parallèles ?",par,
      M("\\dfrac{AM}{AB} = \\dfrac{"+AM+"}{"+AB+"} = "+fm(rd(AM/AB,3),3))+" et "+M("\\dfrac{AN}{AC} = \\dfrac{"+AN+"}{"+AC+"} \\approx "+fm(rd(AN/AC,3),3))+(par?" : égalité, elles sont parallèles (réciproque de Thalès).":" : pas d’égalité, elles ne sont pas parallèles."));},
  function(r){var AM=pick(r,[2,3,4,6]),AB=AM*pick(r,[2,2.5,4,5]),k=rd(AM/AB,3);
    return Q(r,"(MN) // (BC), AM = "+AM+" cm et AB = "+f(AB)+" cm. Par quel coefficient passe-t-on du grand triangle ABC au petit triangle AMN ?",k,[[rd(AB/AM,3),"inv"],[rd(AM/(AB-AM),3),"conf"],[rd(AB-AM,3),"addp"]],{d:3},
      "Coefficient de réduction : "+M("k = \\dfrac{AM}{AB} = \\dfrac{"+AM+"}{"+fm(AB)+"} = "+fm(k,3))+". Toutes les longueurs de AMN = longueurs de ABC × k.");}
]);

/* ─── Statistiques ─── */
addAngles("freq_pct",[
  function(r){var e=[rnd(r,2,9),rnd(r,4,12),rnd(r,2,9)],N=e[0]+e[1]+e[2],i=rnd(r,0,2),ok=rd(e[i]/N*100,1),lab=["moins de 8","de 8 à 12","plus de 12"];
    return Q(r,"Notes d’une classe : quel pourcentage des élèves a eu "+lab[i]+" ?",ok,[[e[i],"conf"],[rd(e[i]/(N-e[i])*100,1),"formule"],[rd((N-e[i])/N*100,1),"compl"],[rd(e[i]/N,3),"pct0"]],{u:"%",d:1,fig:{k:"tab",rows:[["Note","< 8","8 à 12","> 12","Total"],["Effectif",e[0],e[1],e[2],N]],hc:1}},
      "Fréquence "+M("\\dfrac{"+e[i]+"}{"+N+"} \\approx "+fm(rd(e[i]/N,3),3))+", soit "+f(ok,1)+" %. On divise par l’effectif TOTAL.");},
  function(r){var all=[["9 sur 20","45 %"],["3 sur 4","75 %"],["7 sur 50","14 %"],["1 sur 8","12,5 %"],["6 sur 25","24 %"],["12 sur 40","30 %"],["1 sur 5","20 %"]];
    return QA(r,"Associe chaque proportion à son pourcentage.",pickN(r,all,4),"On divise, puis on multiplie par 100 : 9 ÷ 20 = 0,45 = 45 %.");},
  function(r){var a=pick(r,[15,20,25,30,35]),b=pick(r,[10,20,30,40]);if(a+b>=90)return null;var ok=100-a-b;
    return Q(r,"Dans une série, trois catégories ont pour fréquences "+a+" %, "+b+" % et x %. Que vaut x ?",ok,[[a+b,"compl"],[100-a,"demi"],[rd((a+b)/2,1),"conf"]],{u:"%",d:1},"La somme des fréquences vaut toujours 100 % : "+M("100 - "+a+" - "+b+" = "+ok)+" %.");},
  function(r){var n1=pick(r,[30,25,28]),k1=Math.round(n1*pick(r,[0.4,0.36])),n2=pick(r,[20,18,16]),k2=Math.round(n2*pick(r,[0.5,0.55]));if(k1<=k2)return null;var p1=k1/n1,p2=k2/n2;if(Math.abs(p1-p2)<0.05)return null;
    var best=p1>p2?"la classe A":"la classe B",other=p1>p2?"la classe B":"la classe A";
    return Q(r,"Classe A : "+k1+" filles sur "+n1+" élèves. Classe B : "+k2+" filles sur "+n2+" élèves. Où la proportion de filles est-elle la plus grande ?",best,[[other,"conf"],["c’est pareil","calc"],["on ne peut pas comparer","conf"]],{},
      "On compare les fréquences, pas les effectifs : A : "+f(p1*100,1)+" % ; B : "+f(p2*100,1)+" %.");}
]);
addAngles("moy_ponderee",[
  function(r){var v=pickN(r,[8,9,10,11,12,13,14,15],3).sort(function(a,b){return a-b;}),e=[rnd(r,1,6),rnd(r,2,8),rnd(r,1,6)],N=e[0]+e[1]+e[2],S=v[0]*e[0]+v[1]*e[1]+v[2]*e[2],ok=rd(S/N,2),simple=rd((v[0]+v[1]+v[2])/3,2);
    if(Math.abs(ok-simple)<0.1)return null;
    return Q(r,"Quelle est la moyenne de cette série (au centième) ?",ok,[[simple,"conf"],[rd(S/3,2),"formule"],[rd(S/(N+1),2),"calc"]],{d:2,fig:{k:"tab",rows:[["Valeur",v[0],v[1],v[2]],["Effectif",e[0],e[1],e[2]]],hc:1}},
      M("\\bar{x} = \\dfrac{"+v[0]+" \\times "+e[0]+" + "+v[1]+" \\times "+e[1]+" + "+v[2]+" \\times "+e[2]+"}{"+N+"} = \\dfrac{"+S+"}{"+N+"} \\approx "+fm(ok))+".");},
  function(r){var a=rnd(r,7,13),b=rnd(r,8,14),m=pick(r,[11,12,13]),c=pick(r,[2,3]),x=(m*(2+c)-a-b)/c;if(x>20||x<0||x!==Math.round(x))return null;
    return Q(r,"Notes : "+a+" et "+b+" (coefficient 1 chacune). Quelle note faut-il au contrôle suivant (coefficient "+c+") pour avoir "+m+" de moyenne ?",x,[[m,"conf"],[m*3-a-b,"formule"],[m*(2+c)-a-b,"demi"],[x+1,"calc"]],{d:2},
      "Total de points nécessaire : "+M(m+" \\times "+(2+c)+" = "+m*(2+c))+". Il manque "+M(m*(2+c)+" - "+a+" - "+b+" = "+(m*(2+c)-a-b))+" points, à diviser par le coefficient "+c+" : "+x+".");},
  function(r){var xs=[8,10,12,14,16],ys=xs.map(function(){return rnd(r,1,8);}),N=ys.reduce(function(s,y){return s+y;},0),S=xs.reduce(function(s,x,i){return s+x*ys[i];},0),ok=S/N;
    return QE(r,"Le diagramme donne les notes d’une classe (effectifs). Estime la moyenne.",ok,{min:8,max:16,tol:0.4,fig:{k:"bars",x:xs.map(String),y:ys}},
      "La moyenne penche du côté des barres les plus hautes. Calcul : "+M("\\dfrac{"+S+"}{"+N+"} \\approx "+fm(ok,1))+".");},
  function(r){var n=[rnd(r,8,16),rnd(r,8,16),rnd(r,8,16)],c=[2,1,3],S=n[0]*2+n[1]+n[2]*3;
    return QX(r,"Moyenne de "+n[0]+" (coef. 2), "+n[1]+" (coef. 1) et "+n[2]+" (coef. 3) :",["Somme des points : "+M(n[0]+" \\times 2 + "+n[1]+" \\times 1 + "+n[2]+" \\times 3 = "+S),"Somme des coefficients : "+M("2 + 1 + 3 = 6"),"Moyenne : "+M(S+" \\div 3 = "+fm(rd(S/3,2)))],2,
      "On divise par la somme des COEFFICIENTS (6), pas par le nombre de notes : "+M(S+" \\div 6 \\approx "+fm(rd(S/6,2)))+".");}
]);

/* ─── Calcul littéral ─── */
addAngles("lit_dev",[
  function(r){var a=rnd(r,2,9),pl=r()<0.5,L=function(p,q){return M(linL(p,q));};
    return Q(r,"Développer "+M("-(x "+(pl?"+ ":"- ")+a+")"),L(-1,pl?-a:a),[[L(-1,pl?a:-a),"signe"],[L(1,pl?-a:a),"signe"],[L(1,pl?a:-a),"signe"]],{lit:linE(-1,pl?-a:a),form:"dev"},
      "Un « moins » devant la parenthèse change TOUS les signes : "+M("-(x "+(pl?"+ ":"- ")+a+") = "+linL(-1,pl?-a:a))+".");},
  function(r){var ps=[],us={},t=0;while(ps.length<4&&t++<30){var k=pick(r,[2,3,4,5,-2,-3]),a=rnd(r,1,7)*(r()<0.4?-1:1),key=linL(k,k*a);if(us[key])continue;us[key]=1;ps.push([M(fm(k)+"(x "+(a<0?"- ":"+ ")+Math.abs(a)+")"),M(key)]);}
    return QA(r,"Associe chaque expression à sa forme développée.",ps,"k(x + a) = kx + ka : on multiplie CHAQUE terme de la parenthèse par k.");},
  function(r){var k=rnd(r,2,6),b=rnd(r,2,5),a=rnd(r,1,9);
    return QX(r,"Hugo développe "+M(k+"("+b+"x - "+a+")")+" :",[M(k+" \\times "+b+"x = "+(k*b)+"x"),M(k+" \\times (-"+a+") = "+(k*a)),M("\\text{Donc } "+(k*b)+"x + "+(k*a))],1,
      "Plus par moins donne moins : "+M(k+" \\times (-"+a+") = -"+(k*a))+". Résultat : "+M(linL(k*b,-k*a))+".");},
  function(r){var a=rnd(r,2,9),T=function(s){return M(s);};
    return Q(r,"Développer "+M("x(x + "+a+")"),T("x^2 + "+a+"x"),[[T("x^2 + "+a),"demi"],[T("2x + "+a+"x"),"conf"],[T("x + "+a+"x"),"conf"]],{},
      M("x \\times x = x^2")+" et "+M("x \\times "+a+" = "+a+"x")+" : "+M("x^2 + "+a+"x")+".");}
]);
addAngles("lit_fact",[
  function(r){var a=rnd(r,2,9),T=function(s){return M(s);};
    return Q(r,"Factoriser "+M("x^2 + "+a+"x"),T("x(x + "+a+")"),[[T(a+"x(x + 1)"),"conf"],[T("x(x + "+a+"x)"),"demi"],[T("x^2(1 + "+a+")"),"conf"]],{},"Le facteur commun est x : "+M("x \\times x + x \\times "+a+" = x(x + "+a+")")+".");},
  function(r){var ps=[],us={},t=0;while(ps.length<4&&t++<30){var k=pick(r,[2,3,4,5,6]),b=pick(r,[2,3,5]),a=rnd(r,1,7)*(r()<0.4?-1:1);if(gcd(b,Math.abs(a))!==1)continue;var key=linL(k*b,k*a);if(us[key])continue;us[key]=1;ps.push([M(key),M(k+"("+linL(b,a)+")")]);}
    return QA(r,"Associe chaque expression à sa forme factorisée.",ps,"On cherche le plus grand nombre qui divise les deux termes, puis on le met devant la parenthèse.");},
  function(r){var k=pick(r,[3,5,7]),b=pick(r,[2,4]),a=pick(r,[1,3]),P=function(p,q,c){return M(p+"("+linL(q,c)+")");};
    return Q(r,"Factoriser "+M(linL(k*b,-k*a)),P(k,b,-a),[[P(k*b,1,-k*a),"demi"],[P(k,b,-k*a),"demi"],[P(k,k*b,-k*a),"conf"]],{lit:k+"*("+b+"*x-"+a+")",form:"fact"},
      "Facteur commun "+k+" : "+M((k*b)+"x = "+k+" \\times "+b+"x")+" et "+M((k*a)+" = "+k+" \\times "+a)+", donc "+P(k,b,-a)+".");},
  function(r){var k=pick(r,[3,5,6,7]),b=pick(r,[2,4]),a=pick(r,[1,3,5]);if(gcd(b,a)!==1)return null;
    return QX(r,"Léa factorise "+M(linL(k*b,k*a))+" :",["Facteur commun : "+M(k),M(linL(k*b,k*a)+" = "+k+" \\times "+b+"x + "+k+" \\times "+a),M("= "+k+"("+b+"x + "+(k*a)+")")],2,
      "Dans la parenthèse, on garde ce qui reste après avoir « sorti » "+k+" : "+M(k+"("+b+"x + "+a+")")+". On vérifie en redéveloppant.");}
]);

/* ─── Fonctions ─── */
addAngles("coeff_dir",[
  function(r){var c=pick(r,[[2.5,1.2,"km","taxi"],[3,0.15,"min","forfait téléphonique"],[30,12,"h","dépannage"],[5,1.5,"kg","livraison"]]);
    return Q(r,"Le prix d’un "+c[3]+" : "+f(c[0])+" € fixes + "+f(c[1])+" € par "+c[2]+". On note "+M("y = ax + b")+". Que vaut a ?",c[1],[[c[0],"conf"],[rd(c[0]+c[1],2),"addp"],[rd(c[0]/c[1],2),"inv"]],{d:2},
      "a est ce qui est multiplié par x (le prix par "+c[2]+") : a = "+f(c[1])+". b = "+f(c[0])+" est la partie fixe (ordonnée à l’origine).");},
  function(r){var ps=[],us={},t=0;while(ps.length<4&&t++<40){var a=pick(r,[-3,-2,-1,1,2,3,0.5]),x1=rnd(r,0,3),y1=rnd(r,-2,4),dx=pick(r,[1,2]),y2=y1+a*dx;if(us[a]||y2!==Math.round(y2))continue;us[a]=1;
      ps.push(["A("+x1+" ; "+f(y1)+") et B("+(x1+dx)+" ; "+f(y2)+")","a = "+f(a)]);}
    return QA(r,"Associe chaque droite (AB) à son coefficient directeur.",ps,M("a = \\dfrac{y_B - y_A}{x_B - x_A}")+" : variation de y divisée par variation de x.");},
  function(r){var d=r()<0.5;
    return Q(r,"Une droite "+(d?"descend":"monte")+" quand on la parcourt de gauche à droite. Son coefficient directeur est…",d?"négatif":"positif",[[d?"positif":"négatif","signe"],["nul","conf"],["égal à l’ordonnée à l’origine","conf"]],{},
      "a > 0 : la droite monte (fonction croissante). a < 0 : elle descend. a = 0 : elle est horizontale.");},
  function(r){var x1=rnd(r,-2,2),y1=rnd(r,-3,3),dx=pick(r,[2,4]),a=pick(r,[2,3,-2,0.5]),y2=y1+a*dx;
    return QX(r,"Calcul du coefficient directeur de (AB) avec "+M("A("+x1+"\\,;\\,"+y1+")")+" et "+M("B("+(x1+dx)+"\\,;\\,"+fm(y2)+")")+" :",[M("a = \\dfrac{x_B - x_A}{y_B - y_A}"),M("a = \\dfrac{"+(x1+dx)+" - "+par(x1)+"}{"+fm(y2)+" - "+par(y1)+"}"),M("a = "+fm(rd(dx/(y2-y1),3),3))],0,
      "La formule est à l’envers : "+M("a = \\dfrac{y_B - y_A}{x_B - x_A} = \\dfrac{"+fm(y2-y1)+"}{"+dx+"} = "+fm(a))+".");}
]);
addAngles("fn_types",[
  function(r){var a=pick(r,[2,3,-4,0.5]),b=pick(r,[1,-3,4]),k=rnd(r,0,2),F=[M("f(x) = "+linL(a,0)),M("f(x) = "+linL(a,b)),M("f(x) = "+b)],nm=["linéaire","affine non linéaire","constante"];
    var wr=[[M("f(x) = x^2"),"conf"]];F.forEach(function(x,i){if(i!==k)wr.push([x,"conf"]);});
    return Q(r,"Quelle fonction est "+nm[k]+" ?",F[k],wr,{},"Linéaire : ax. Affine : ax + b. Constante : b (le nombre ne dépend pas de x).");},
  function(r){var a=pick(r,[2,3,-2,4]),b=pick(r,[0,0,1,-3,5]),xs=[0,1,2,3],ys=xs.map(function(x){return a*x+b;}),ok=b===0?"linéaire":"affine (non linéaire)";
    return Q(r,"Ce tableau de valeurs correspond à une fonction…",ok,[[b===0?"affine (non linéaire)":"linéaire","conf"],["constante","conf"],["ni affine ni linéaire","conf"]],{fig:{k:"tab",rows:[["x"].concat(xs),["f(x)"].concat(ys)],hc:1}},
      "Quand x augmente de 1, f(x) augmente toujours de "+a+" : fonction affine de coefficient "+a+". "+(b===0?"f(0) = 0 : elle est même linéaire (proportionnalité).":"f(0) = "+b+" ≠ 0 : elle n’est pas linéaire.")+"");},
  function(r){var b=rnd(r,1,3),a=pick(r,[1,0.5]),ki=rnd(r,0,2),T=["constante","linéaire","affine non linéaire"];
    var lines=[[[0,b+2],[6,b+2]],[[0,0],[6,6*a]],[[0,b],[6,b+6*a*0.6]]],sh=shuffle(r,[0,1,2]),cv=[],nm=[];
    sh.forEach(function(k,i){cv.push(lines[k]);var L=lines[k],x=1+i*2,y=L[0][1]+(L[1][1]-L[0][1])*x/6;nm.push([x,Math.min(7.5,y+0.6),"D"+(i+1),i===0?0:1+i%5]);});
    var good="D"+(sh.indexOf(ki)+1);
    return Q(r,"Quelle droite représente une fonction "+T[ki]+" ?",good,["D1","D2","D3"].filter(function(x){return x!==good;}).map(function(x){return [x,"conf"];}),{fig:{k:"graph",xr:[0,6],yr:[0,8],curves:cv,names:nm}},
      "Constante : droite horizontale. Linéaire : droite qui passe par l’origine. Affine non linéaire : droite qui ne passe pas par l’origine.");}
]);
addAngles("droite_eq",[
  function(r){var a=pick(r,[-2,-1,1,2,0.5]),b=rnd(r,-2,3),fig={k:"graph",xr:[-3,5],yr:[-4,6],pts:[[-3,-3*a+b],[5,5*a+b]],dots:[[0,b,""],[(2*a+b<=6&&2*a+b>=-4)?2:1,(2*a+b<=6&&2*a+b>=-4)?2*a+b:a+b,""]]};
    return Q(r,"Quel est le coefficient directeur de cette droite ?",a,[[-a,"signe"],[b===a?a+1:b,"conf"],[rd(1/a,2),"inv"]],{d:2,fig:fig},
      "Quand x augmente de 1, y "+(a>0?"augmente":"diminue")+" de "+f(Math.abs(a))+" : a = "+f(a)+".");},
  function(r){var all=[[M("y = 2x"),"passe par l’origine"],[M("y = 3"),"horizontale"],[M("y = -x + 4"),"décroissante"],[M("y = 0{,}5x + 2"),"coupe l’axe (Oy) en 2"]];
    return QA(r,"Associe chaque droite à une de ses propriétés.",all,"y = ax + b : b est l’ordonnée à l’origine, le signe de a donne le sens. Si a = 0, la droite est horizontale.");},
  function(r){var a=pick(r,[2,3,-2,-1]),b=rnd(r,-4,5),x=rnd(r,-2,4),y=a*x+b,P=function(u,v){return M("("+fm(u)+"\\,;\\,"+fm(v)+")");};
    return Q(r,"Quel point appartient à la droite d’équation "+M("y = "+linL(a,b))+" ?",P(x,y),[[P(x,y+1),"calc"],[P(y,x),"inv"],[P(x,a+x+b),"addp"]].filter(function(w){return w[0]!==P(x,y);}),{},
      "On remplace x par "+x+" : "+M("y = "+a+" \\times "+par(x)+" "+(b<0?"- ":"+ ")+Math.abs(b)+" = "+fm(y))+". Le point "+P(x,y)+" est sur la droite.");}
]);

/* ─── Statistiques à deux variables, probabilités (1re) ─── */
addAngles("ajustement",[
  function(r){var a=pick(r,[2,3,4,5]),b=pick(r,[10,15,20,30]),x=rnd(r,5,20),y=a*x+b;
    return Q(r,"Une droite d’ajustement a pour équation "+M("y = "+a+"x + "+b)+". Pour quelle valeur de x prévoit-on "+M("y = "+y)+" ?",x,[[a*y+b,"inv"],[rd((y+b)/a,2),"signe"],[rd(y/a,2),"demi"]],{d:2},
      "On résout "+M(a+"x + "+b+" = "+y)+" : "+M(a+"x = "+(y-b))+", donc "+M("x = "+x)+".");},
  function(r){var a=pick(r,[0.5,0.8,1.2,1.5]),b=rnd(r,1,3),xs=[1,2,3,4,5,6,7],dots=xs.map(function(x){return [x,rd(a*x+b+(r()-0.5)*1.2,2),""];}),X=pick(r,[8,9]),ok=a*X+b;
    return QE(r,"Le nuage de points et sa droite d’ajustement sont tracés. Estime y pour x = "+X+".",ok,{min:0,max:Math.ceil(a*10+b+2),tol:0.5,fig:{k:"graph",xr:[0,10],yr:[0,Math.ceil(a*10+b+2)],sy:Math.ceil(a*10+b+2)>12?2:1,ey:1,pts:[[0,b],[10,10*a+b]],dots:dots}},
      "On prolonge la droite jusqu’à x = "+X+" : y ≈ "+f(ok,1)+" (équation "+M("y = "+fm(a)+"x + "+b)+").");},
  function(r){var a=pick(r,[3.2,2.5,0.8,12]),b=pick(r,[150,200,80,500]);
    return Q(r,"Le coût de production (en €) de x pièces est modélisé par "+M("y = "+fm(a)+"x + "+b)+". De combien augmente le coût pour une pièce de plus ?",f(a,2)+" €",[[f(b)+" €","conf"],[f(a+b,2)+" €","addp"],[f(a,2)+" %","pct0"]],{},
      "Quand x augmente de 1, y augmente de a = "+f(a)+" € : c’est le coût de chaque pièce supplémentaire. b = "+b+" € est la partie fixe.");},
  function(r){var R=pick(r,[0.12,0.25,0.31]);
    return VF(r,"Un coefficient de détermination "+M("R^2 = "+fm(R))+" indique que l’ajustement affine est très bon.",false,"Faux : plus "+M("R^2")+" est proche de 1, meilleur est l’ajustement. Avec "+f(R)+", les points sont très dispersés autour de la droite.");}
]);
addAngles("proba_simple",[
  function(r){var N=pick(r,[10,20,25,40]),v=rnd(r,2,N/2),ok=rd((N-v)/N,3);
    return Q(r,"Un sac contient "+N+" jetons dont "+v+" verts. On en tire un au hasard. Quelle est la probabilité qu’il NE soit PAS vert ?",ok,[[rd(v/N,3),"compl"],[N-v,"formule"],[rd(v/(N-v),3),"formule"]],{d:3},
      "Événement contraire : "+M("1 - \\dfrac{"+v+"}{"+N+"} = \\dfrac{"+(N-v)+"}{"+N+"} = "+fm(ok,3))+".");},
  function(r){var all=[["obtenir 6",frM(1,6)],["obtenir un nombre pair",frM(1,2)],["obtenir au moins 5",frM(1,3)],["obtenir 7","0"],["obtenir moins de 7","1"],["obtenir 1, 2, 3 ou 4",frM(2,3)]];
    return QA(r,"On lance un dé équilibré à 6 faces. Associe chaque événement à sa probabilité.",pickN(r,all,4),"Probabilité = nombre de faces favorables ÷ 6. Impossible : 0. Certain : 1.");},
  function(r){var c=pick(r,[["un roi",4,32],["un cœur",8,32],["une figure (valet, dame, roi)",12,32],["un as rouge",2,32]]),ok=rd(c[1]/c[2],4);
    return Q(r,"On tire une carte au hasard dans un jeu de 32 cartes. Probabilité d’obtenir "+c[0]+" ?",ok,[[rd(1/32,4),"conf"],[rd(c[1]/(32-c[1]),4),"formule"],[rd(1/c[1],4),"inv"]],{d:4},
      "Il y a "+c[1]+" cas favorables sur 32 : "+M("\\dfrac{"+c[1]+"}{32} = "+fm(ok,4))+".");},
  function(r){var n=shuffle(r,[2,5,8,12]),cols=["rouges","vertes","bleues","jaunes"],it=cols.map(function(c,i){return [c,n[i]];}).sort(function(a,b){return a[1]-b[1];});
    return QO(r,"Un sac contient "+cols.map(function(c,i){return n[i]+" boules "+c;}).join(", ")+". Range les couleurs de la moins probable à la plus probable.",it.map(function(x){return "boule "+x[0].replace(/s$/,"").replace(/e$/,"e");}),
      "Plus il y a de boules d’une couleur, plus elle est probable : "+it.map(function(x){return x[1]+"/27";}).join(" < ")+".",{how:"de la moins probable à la plus probable"});}
]);

/* ─── Vecteurs, repère (1re) ─── */
addAngles("vecteur_coord",[
  function(r){var xa=rnd(r,-4,4),ya=rnd(r,-4,4),a=rnd(r,-4,5),b=rnd(r,-4,5);if(!a||!b)return null;var ok=[xa+a,ya+b];
    return Q(r,M("A"+cpl([xa,ya]).slice(1,-1))+" et "+M("\\vec{u}"+cpl([a,b]).slice(1,-1))+". Quelles sont les coordonnées du point B tel que "+M("\\overrightarrow{AB} = \\vec{u}")+" ?",ok,[[[xa-a,ya-b],"signe"],[[a-xa,b-ya],"signe"],[[xa*a,ya*b],"addp"],[[a,b],"conf"]],{F:cpl},
      M("x_B = x_A + x_{\\vec{u}} = "+fm(ok[0],0))+" et "+M("y_B = y_A + y_{\\vec{u}} = "+fm(ok[1],0))+".");},
  function(r){var xa=rnd(r,0,3),ya=rnd(r,0,2),xb=rnd(r,1,6),yb=rnd(r,1,5);if(xa===xb||ya===yb)return null;var ok=[xb-xa,yb-ya];
    return Q(r,"Lire les coordonnées du vecteur "+M("\\overrightarrow{AB}")+".",ok,[[[xa-xb,ya-yb],"signe"],[[xb,yb],"conf"],[[yb-ya,xb-xa],"conf"],[[xb+xa,yb+ya],"addp"]],{F:cpl,fig:{k:"graph",xr:[-1,7],yr:[-1,6],dots:[[xa,ya,"A"],[xb,yb,"B"]]}},
      "De A à B : on se déplace de "+ok[0]+" horizontalement et de "+ok[1]+" verticalement : "+cpl(ok)+".");},
  function(r){var u=[rnd(r,-4,5),rnd(r,-4,5)],v=[rnd(r,-4,5),rnd(r,-4,5)],op=rnd(r,0,2),k=pick(r,[2,3,-2]),ok,wr,txt;
    if(op===0){ok=[u[0]+v[0],u[1]+v[1]];txt=M("\\vec{u} + \\vec{v}");wr=[[[u[0]*v[0],u[1]*v[1]],"addp"],[[u[0]-v[0],u[1]-v[1]],"signe"],[[u[0]+v[1],u[1]+v[0]],"conf"]];}
    else if(op===1){ok=[u[0]-v[0],u[1]-v[1]];txt=M("\\vec{u} - \\vec{v}");wr=[[[u[0]+v[0],u[1]+v[1]],"signe"],[[v[0]-u[0],v[1]-u[1]],"signe"],[[u[0]-v[1],u[1]-v[0]],"conf"]];}
    else{ok=[k*u[0],k*u[1]];txt=M(k+"\\vec{u}");wr=[[[k*u[0],u[1]],"demi"],[[u[0]+k,u[1]+k],"addp"],[[-k*u[0],-k*u[1]],"signe"]];}
    return Q(r,M("\\vec{u}"+cpl(u).slice(1,-1))+" et "+M("\\vec{v}"+cpl(v).slice(1,-1))+". Coordonnées de "+txt+" ?",ok,wr,{F:cpl},"On calcule abscisse avec abscisse, ordonnée avec ordonnée : "+cpl(ok)+".");},
  function(r){var u=[pick(r,[1,2,3]),pick(r,[2,3,-1,-2])],k=pick(r,[2,3,-2]),col=r()<0.5,v=col?[k*u[0],k*u[1]]:[k*u[0],k*u[1]+pick(r,[1,-1])];
    return VF(r,"Les vecteurs "+M("\\vec{u}"+cpl(u).slice(1,-1))+" et "+M("\\vec{v}"+cpl(v).slice(1,-1))+" sont colinéaires.",col,
      col?"Vrai : "+M("\\vec{v} = "+k+"\\vec{u}")+" (les deux coordonnées sont multipliées par "+k+").":"Faux : "+M(v[0]+" = "+k+" \\times "+u[0])+" mais "+M(v[1]+" \\neq "+k+" \\times "+par(u[1]))+".");}
]);
addAngles("norme_vecteur",[
  function(r){var t=pick(r,TRIP.slice(0,6)),xa=rnd(r,-3,3),ya=rnd(r,-3,3),sa=r()<0.5?-1:1,xb=xa+sa*t[0],yb=ya+t[1];
    return Q(r,M("A"+cpl([xa,ya]).slice(1,-1))+" et "+M("B"+cpl([xb,yb]).slice(1,-1))+". Quelle est la longueur AB ?",t[2],[[t[0]+t[1],"formule"],[t[2]*t[2],"formule"],[rd(Math.sqrt(Math.abs((xb+xa)*(xb+xa)+(yb+ya)*(yb+ya))),2),"signe"],[t[2]+1,"calc"]],{d:2},
      M("AB = \\sqrt{("+fm(xb,0)+" - "+par(xa,0)+")^2 + ("+fm(yb,0)+" - "+par(ya,0)+")^2} = \\sqrt{"+(t[0]*t[0]+t[1]*t[1])+"} = "+t[2])+".");},
  function(r){var a=rnd(r,2,8),b=rnd(r,3,9),n=Math.sqrt(a*a+b*b);
    return QE(r,"Estime la norme du vecteur "+M("\\vec{u}("+a+"\\,;\\,"+b+")")+".",n,{lo:0},M("\\|\\vec{u}\\| = \\sqrt{"+a+"^2 + "+b+"^2} = \\sqrt{"+(a*a+b*b)+"} \\approx "+fm(n,2))+". Elle est comprise entre "+Math.max(a,b)+" et "+(a+b)+".");},
  function(r){var t=pick(r,[[3,4,5],[6,8,10],[5,12,13]]),a=t[0],b=t[1];
    return QX(r,"Calcul de la norme de "+M("\\vec{u}(-"+a+"\\,;\\,"+b+")")+" :",[M("\\|\\vec{u}\\|^2 = x^2 + y^2"),M("\\|\\vec{u}\\|^2 = (-"+a+")^2 + "+b+"^2 = -"+(a*a)+" + "+(b*b)+" = "+(b*b-a*a)),M("\\|\\vec{u}\\| = \\sqrt{"+(b*b-a*a)+"}")],1,
      "Un carré n’est jamais négatif : "+M("(-"+a+")^2 = "+(a*a))+". Donc "+M("\\|\\vec{u}\\| = \\sqrt{"+(a*a+b*b)+"} = "+t[2])+".");},
  function(r){var V=[["u(3 ; 4)",5],["v(1 ; 1)",Math.SQRT2],["w(−6 ; 0)",6],["t(5 ; −12)",13],["s(0 ; −2)",2],["p(6 ; 8)",10]],c=pickN(r,V,4).sort(function(a,b){return a[1]-b[1];});
    return QO(r,"Range ces vecteurs de la plus petite à la plus grande norme.",c.map(function(x){return x[0];}),"Normes : "+c.map(function(x){return x[0].charAt(0)+" : "+f(x[1],2);}).join(" ; ")+".",{how:"de la plus petite à la plus grande norme"});}
]);
addAngles("milieu",[
  function(r){var xa=rnd(r,-4,4),ya=rnd(r,-4,4),xm=rnd(r,-3,5),ym=rnd(r,-3,5),ok=[2*xm-xa,2*ym-ya];if(xa===xm&&ya===ym)return null;
    return Q(r,"M est le milieu de [AB], avec "+M("A"+cpl([xa,ya]).slice(1,-1))+" et "+M("M"+cpl([xm,ym]).slice(1,-1))+". Coordonnées de B ?",ok,[[[(xa+xm)/2,(ya+ym)/2],"conf"],[[xm-xa,ym-ya],"conf"],[[2*xa-xm,2*ya-ym],"inv"]],{F:function(v){return M("("+fm(v[0])+"\\,;\\,"+fm(v[1])+")");}},
      M("x_B = 2x_M - x_A = "+fm(ok[0],0))+" et "+M("y_B = 2y_M - y_A = "+fm(ok[1],0))+".");},
  function(r){var xa=2*rnd(r,0,1),ya=2*rnd(r,0,1),xb=2*rnd(r,2,3),yb=2*rnd(r,1,2),ok=[(xa+xb)/2,(ya+yb)/2];
    return Q(r,"Lire les coordonnées des points puis donner celles du milieu de [AB].",ok,[[[xa+xb,ya+yb],"demi"],[[(xb-xa)/2,(yb-ya)/2],"signe"],[[(ya+yb)/2,(xa+xb)/2],"conf"]],{F:cpl,fig:{k:"graph",xr:[-1,7],yr:[-1,5],dots:[[xa,ya,"A"],[xb,yb,"B"]]}},
      "A"+cpl([xa,ya])+" et B"+cpl([xb,yb])+" : milieu "+cpl(ok)+" (moyenne des abscisses, moyenne des ordonnées).");},
  function(r){var xa=2*rnd(r,0,4),ya=2*rnd(r,0,3),xb=2*rnd(r,1,6),yb=2*rnd(r,1,5),ok=[(xa+xb)/2,(ya+yb)/2];if(xa===xb&&ya===yb)return null;
    return Q(r,"Sur le plan d’un jardin (unité : le mètre), deux arbres sont plantés en A"+cpl([xa,ya])+" et B"+cpl([xb,yb])+". Où planter un troisième arbre exactement au milieu ?",ok,[[[xa+xb,ya+yb],"demi"],[[Math.abs(xb-xa)/2,Math.abs(yb-ya)/2],"conf"],[[(ya+yb)/2,(xa+xb)/2],"conf"]],{F:cpl},
      "Milieu : "+M("\\left(\\dfrac{"+xa+" + "+xb+"}{2}\\,;\\,\\dfrac{"+ya+" + "+yb+"}{2}\\right) = ("+ok[0]+"\\,;\\,"+ok[1]+")")+".");},
  function(r){var xa=rnd(r,-4,4),ya=rnd(r,-4,4),xb=xa+2*rnd(r,1,4),yb=ya+2*rnd(r,-3,3),m=[(xa+xb)/2,(ya+yb)/2],ok=r()<0.5,M2=ok?m:[m[0]+pick(r,[1,-1]),m[1]];
    return oui(r,M("A"+cpl([xa,ya]).slice(1,-1))+", "+M("B"+cpl([xb,yb]).slice(1,-1))+" et "+M("I"+cpl(M2).slice(1,-1))+". Le point I est-il le milieu de [AB] ?",ok,"Le milieu de [AB] est "+cpl(m)+(ok?" : oui.":" : non."));}
]);

/* ─── Suites ─── */
addAngles("suite_arith",[
  function(r){var u0=rnd(r,2,20),rr=pick(r,[2,3,4,5,-3]),p=rnd(r,1,4),q=p+pick(r,[3,4,5]),up=u0+p*rr,uq=u0+q*rr;
    return Q(r,M("(u_n)")+" est arithmétique avec "+M("u_{"+p+"} = "+up)+" et "+M("u_{"+q+"} = "+uq)+". Quelle est sa raison ?",rr,[[uq-up,"demi"],[rd(uq/up,2),"conf"],[rd((uq-up)/(q-p+1),2),"calc"]],{d:2},
      "Entre "+M("u_{"+p+"}")+" et "+M("u_{"+q+"}")+", on ajoute "+(q-p)+" fois la raison : "+M("r = \\dfrac{"+uq+" - "+up+"}{"+(q-p)+"} = "+rr)+".");},
  function(r){var u0=rnd(r,1,15),a=pick(r,[2,3,4,5,7]),n=pick(r,[3,4,5]),ok=u0+n*a;
    return Q(r,M("u_0 = "+u0)+" et, pour tout n, "+M("u_{n+1} = u_n + "+a)+". Calculer "+M("u_{"+n+"}")+".",ok,[[u0+a,"demi"],[u0*Math.pow(a,n),"conf"],[u0+(n+1)*a,"calc"],[u0+(n-1)*a,"calc"]],{d:0},
      "On ajoute "+a+" à chaque étape : "+M("u_{"+n+"} = "+u0+" + "+n+" \\times "+a+" = "+ok)+".");},
  function(r){var L=pick(r,[480,520,600,650]),a=pick(r,[10,12,15,20]),n=pick(r,[3,4,5,6]),ok=L+n*a;
    return Q(r,"Un loyer de "+L+" € augmente de "+a+" € chaque année. Quel sera le loyer dans "+n+" ans ?",ok,[[L+a,"demi"],[L+(n+1)*a,"calc"],[rd(L*Math.pow(1+a/100,n),2),"conf"]],{u:"€",d:2},
      "Suite arithmétique de raison "+a+" : "+M(L+" + "+n+" \\times "+a+" = "+ok)+" €.");},
  function(r){var u0=rnd(r,5,30),a=pick(r,[4,6,7,8]),S=pick(r,[100,120,150,200]),n=Math.floor((S-u0)/a)+1;
    return Q(r,M("u_n = "+u0+" + "+a+"n")+". À partir de quel rang n a-t-on "+M("u_n > "+S)+" ?",n,[[n-1,"arr"],[rd((S-u0)/a,2),"arr"],[n+1,"calc"]],{d:2},
      M("u_{"+(n-1)+"} = "+(u0+(n-1)*a))+" ≤ "+S+" et "+M("u_{"+n+"} = "+(u0+n*a))+" > "+S+" : c’est à partir du rang "+n+".");},
  function(r){var ps=[],us={},t=0;while(ps.length<4&&t++<30){var u=rnd(r,1,9),d=pick(r,[2,3,4,5,-2,-3]);if(us[u+"|"+d])continue;us[u+"|"+d]=1;ps.push([M("u_0 = "+u+",\\ r = "+d),M("u_n = "+u+(d<0?" - ":" + ")+Math.abs(d)+"n")]);}
    return QA(r,"Associe chaque suite arithmétique à son terme général.",ps,M("u_n = u_0 + n \\times r")+".");}
]);
addAngles("suite_geo",[
  function(r){var N=pick(r,[100,500,2000]),k=pick(r,[2,3]),h=pick(r,[3,4,5]),ok=N*Math.pow(k,h);
    return Q(r,"Une culture de "+f(N)+" bactéries est multipliée par "+k+" chaque heure. Combien y en a-t-il au bout de "+h+" h ?",ok,[[N*k*h,"conf"],[N+k*h,"addp"],[N*Math.pow(k,h-1),"calc"],[N*Math.pow(k,h+1),"calc"]],{d:0},
      "Suite géométrique de raison "+k+" : "+M(fm(N)+" \\times "+k+"^"+h+" = "+fm(ok))+".");},
  function(r){var u0=pick(r,[2,3,4,5]),q=pick(r,[2,3,4,0.5]),u1=u0*q;
    return Q(r,M("(u_n)")+" est géométrique, "+M("u_0 = "+u0)+" et "+M("u_1 = "+fm(u1))+". Quelle est sa raison q ?",q,[[rd(u1-u0,2),"conf"],[rd(u0/u1,3),"inv"],[rd(u1*u0,2),"addp"]],{d:3},
      M("q = \\dfrac{u_1}{u_0} = \\dfrac{"+fm(u1)+"}{"+u0+"} = "+fm(q))+" (on divise, on ne soustrait pas).");},
  function(r){var V=pick(r,[12000,15000,20000,25000]),p=pick(r,[10,15,20]),n=pick(r,[2,3]),ok=rd(V*Math.pow(1-p/100,n),2);
    return Q(r,"Une voiture de "+f(V)+" € perd "+p+" % de sa valeur chaque année. Quelle est sa valeur au bout de "+n+" ans ?",ok,[[rd(V*(1-n*p/100),2),"addp"],[rd(V*(1-p/100),2),"demi"],[rd(V*Math.pow(1+p/100,n),2),"signe"]],{u:"€",d:2},
      "Coefficient "+M(fm(1-p/100))+" chaque année : "+M(fm(V)+" \\times "+fm(1-p/100)+"^"+n+" = "+fm(ok))+" €.");},
  function(r){var u0=pick(r,[500,800,1000]),q=pick(r,[1.05,1.08,1.1,0.9]),n=pick(r,[8,10,12]),ok=u0*Math.pow(q,n);
    return QE(r,"Suite géométrique : "+M("u_0 = "+u0)+" et "+M("q = "+fm(q))+". Estime "+M("u_{"+n+"}")+".",ok,{lo:0},M("u_{"+n+"} = "+u0+" \\times "+fm(q)+"^{"+n+"} \\approx "+fm(ok,0))+".");},
  function(r){var q=pick(r,[0.9,0.5,0.8]);return VF(r,"Une suite géométrique de premier terme positif et de raison "+f(q)+" est croissante.",false,"Faux : multiplier par un nombre entre 0 et 1 fait DIMINUER. La suite est décroissante.");}
]);
addAngles("suite_somme",[
  function(r){var n=pick(r,[10,12,15,20,25]),ok=n*(n+1)/2;
    return Q(r,"On empile des boîtes en pyramide : 1 au sommet, 2 en dessous, 3… et "+n+" à la base. Combien de boîtes en tout ?",ok,[[n*n,"conf"],[n*(n+1),"demi"],[n*n/2,"calc"]],{d:0},
      M("1 + 2 + \\ldots + "+n+" = \\dfrac{"+n+" \\times (1 + "+n+")}{2} = "+ok)+".");},
  function(r){var a=pick(r,[5,10,20]),d=pick(r,[2,5]),n=pick(r,[8,10,12]),un=a+(n-1)*d,ok=n*(a+un)/2;
    return Q(r,"Je mets "+a+" € de côté la première semaine, puis "+d+" € de plus chaque semaine. Combien ai-je économisé en "+n+" semaines ?",ok,[[n*un,"formule"],[n*(a+un),"demi"],[a*n+d,"calc"]],{u:"€",d:2},
      "Dernière semaine : "+M(a+" + "+(n-1)+" \\times "+d+" = "+un)+" €. Total "+M("= \\dfrac{"+n+" \\times ("+a+" + "+un+")}{2} = "+fm(ok))+" €.");},
  function(r){var a=pick(r,[2,3,5]),d=pick(r,[2,3,4]),n=pick(r,[6,8,10]),un=a+(n-1)*d;
    return QX(r,"Somme des "+n+" premiers termes d’une suite arithmétique ("+M("u_1 = "+a)+", raison "+d+") :",["Dernier terme : "+M("u_{"+n+"} = "+a+" + "+(n-1)+" \\times "+d+" = "+un),"Somme : "+M("S = "+n+" \\times ("+a+" + "+un+")"),M("S = "+(n*(a+un)))],1,
      "Il manque la division par 2 : "+M("S = \\dfrac{"+n+" \\times ("+a+" + "+un+")}{2} = "+(n*(a+un)/2))+".");}
]);
addAngles("interets_composes",[
  function(r){var t=pick(r,[2,3,4,5]),n=pick(r,[2,3,4]),ok=rd(Math.pow(1+t/100,n),4);
    return Q(r,"Placement à "+t+" % par an, intérêts composés. Par quel coefficient le capital est-il multiplié en "+n+" ans ?",ok,[[rd(1+n*t/100,4),"addp"],[rd(n*(1+t/100),4),"conf"],[rd(Math.pow(t/100,n),6),"pct0"]],{d:4},
      M(fm(1+t/100)+"^"+n+" \\approx "+fm(ok,4))+". Avec des intérêts simples, ce serait "+f(1+n*t/100,4)+".");},
  function(r){var c=pick(r,[[8,1.5],[10,1.5],[5,1.2],[6,1.3],[10,2],[4,1.2]]),t=c[0]/100,F=c[1],n=1;while(Math.pow(1+t,n)<=F)n++;var s=Math.ceil((F-1)/t-1e-9);if(s===(F-1)/t)s++;
    return Q(r,"Un capital est placé à "+c[0]+" % par an (intérêts composés). Au bout de combien d’années aura-t-il été multiplié par plus de "+f(F)+" ?",n,[[s===n?n+2:s,"addp"],[n-1,"arr"],[n+1,"calc"]],{d:0,u:"ans"},
      M(fm(1+t)+"^{"+(n-1)+"} \\approx "+fm(rd(Math.pow(1+t,n-1),3),3))+" et "+M(fm(1+t)+"^{"+n+"} \\approx "+fm(rd(Math.pow(1+t,n),3),3))+" : il faut "+n+" ans.");},
  function(r){var C=pick(r,[1000,2000,5000]),t=pick(r,[3,4,5]),n=pick(r,[8,10,15]),ok=C*Math.pow(1+t/100,n);
    return QE(r,"On place "+f(C)+" € à "+t+" % par an (intérêts composés) pendant "+n+" ans. Estime le capital final.",ok,{u:"€",lo:0},M(fm(C)+" \\times "+fm(1+t/100)+"^{"+n+"} \\approx "+fm(ok,0))+" €.");},
  function(r){var C=pick(r,[1000,2000]),t=pick(r,[4,5]),n=3;
    return QX(r,"Valeur acquise par "+f(C)+" € placés à "+t+" % (intérêts composés) pendant "+n+" ans :",["Coefficient annuel : "+M(fm(1+t/100)),"Coefficient sur "+n+" ans : "+M(fm(1+t/100)+" \\times "+n+" = "+fm(rd((1+t/100)*n,2))),"Capital : "+M(fm(C)+" \\times "+fm(rd((1+t/100)*n,2))+" = "+fm(rd(C*(1+t/100)*n,2)))+" €"],1,
      "On multiplie "+n+" fois par le coefficient : "+M(fm(1+t/100)+"^"+n+" \\approx "+fm(rd(Math.pow(1+t/100,n),4),4))+", soit "+f(C*Math.pow(1+t/100,n))+" €.");}
]);
addAngles("reconnaitre_suite",[
  function(r){var a=pick(r,[2,3,5]),b=pick(r,[2,3,4]),geo=r()<0.5,F=geo?M("u_n = "+a+" \\times "+b+"^n"):M("u_n = "+a+" + "+b+"n");
    var o=geo?"géométrique de raison "+b:"arithmétique de raison "+b;
    return Q(r,F+" définit une suite…",o,[[geo?"arithmétique de raison "+b:"géométrique de raison "+b,"conf"],[geo?"géométrique de raison "+a:"arithmétique de raison "+a,"conf"],["ni l’une ni l’autre","conf"]],{},
      "Arithmétique : "+M("u_n = u_0 + nr")+". Géométrique : "+M("u_n = u_0 \\times q^n")+".");},
  function(r){var u=pick(r,[1,2,3]),d=pick(r,[3,4,5]);
    return QA(r,"Associe chaque suite à sa nature.",[[[u,u+d,u+2*d,u+3*d].join(" ; ")+" ; …","arithmétique, r = "+d],[[u,2*u,4*u,8*u].join(" ; ")+" ; …","géométrique, q = 2"],[[1,4,9,16].join(" ; ")+" ; …","ni l’une ni l’autre"],[[64,32,16,8].join(" ; ")+" ; …","géométrique, q = 0,5"]],
      "On regarde les écarts (constants : arithmétique) puis les quotients (constants : géométrique).");},
  function(r){var all=[["+ 2 % par an","géométrique, q = 1,02"],["+ 3 € par mois","arithmétique, r = 3"],["− 10 % par an","géométrique, q = 0,9"],["− 5 € par mois","arithmétique, r = −5"],["doublé chaque jour","géométrique, q = 2"]];
    return QA(r,"Associe chaque évolution à la suite qui la modélise.",pickN(r,all,4),"Un pourcentage constant : géométrique (on multiplie). Une quantité constante : arithmétique (on ajoute).");}
]);

/* ─── Probabilités (Tle) ─── */
addAngles("proba_cond",[
  function(r){var a=rnd(r,6,12),b=rnd(r,4,10),c=rnd(r,5,12),d=rnd(r,3,9),F=a+b,N=a+b+c+d,ok=rd(a/F,3);
    return Q(r,"On choisit au hasard une FILLE du lycée. Quelle est la probabilité qu’elle soit demi-pensionnaire ?",ok,[[rd(a/N,3),"conf"],[rd(a/(a+c),3),"inv"],[rd(F/N,3),"conf"]],{d:3,fig:{k:"tab",rows:[["","Demi-pension.","Externe","Total"],["Filles",a,b,F],["Garçons",c,d,c+d],["Total",a+c,b+d,N]],hc:1}},
      "On se limite aux "+F+" filles : "+M("P_F(D) = \\dfrac{"+a+"}{"+F+"} \\approx "+fm(ok,3))+".");},
  function(r){var pa=pick(r,[0.3,0.4,0.6,0.2]),p1=pick(r,[0.5,0.8,0.9,0.7]),p2=pick(r,[0.1,0.2,0.3,0.4]),ok=rd(pa*p1+(1-pa)*p2,4);
    return Q(r,"D’après l’arbre, quelle est la probabilité de B ?",ok,[[rd(pa*p1,4),"demi"],[rd(p1+p2,4),"addp"],[rd((p1+p2)/2,4),"conf"]],{d:4,fig:{k:"tree",p:[f(pa),f(1-pa)],c:[[f(p1),f(1-p1)],[f(p2),f(1-p2)]]}},
      "B est au bout de deux chemins : "+M(fm(pa)+" \\times "+fm(p1)+" + "+fm(1-pa)+" \\times "+fm(p2)+" = "+fm(ok,4))+".");},
  function(r){var pa=pick(r,[0.3,0.4,0.6,0.25]),p1=pick(r,[0.2,0.3,0.6,0.85]),ok=rd(pa*(1-p1),4);
    return Q(r,"D’après l’arbre, que vaut "+M("P(A \\cap \\bar{B})")+" ?",ok,[[rd(1-p1,4),"conf"],[rd(pa*p1,4),"conf"],[rd(pa+1-p1,4),"addp"]],{d:4,fig:{k:"tree",p:[f(pa),f(1-pa)],c:[[f(p1),f(1-p1)],["",""]]}},
      "On suit la branche A puis "+M("\\bar{B}")+" : "+M(fm(pa)+" \\times "+fm(1-p1)+" = "+fm(ok,4))+".");},
  function(r){return VF(r,"Pour deux événements A et B quelconques, "+M("P_A(B) = P_B(A)")+".",false,"Faux : "+M("P_A(B) = \\dfrac{P(A \\cap B)}{P(A)}")+" et "+M("P_B(A) = \\dfrac{P(A \\cap B)}{P(B)}")+" : on ne divise pas par la même chose.");}
]);
addAngles("independance",[
  function(r){var pa=pick(r,[0.2,0.4,0.5]),pb=pick(r,[0.3,0.5,0.6]),ind=r()<0.5,pab=ind?rd(pa*pb,3):rd(pa*pb+pick(r,[0.05,-0.04]),3);
    return oui(r,M("P(A) = "+fm(pa))+", "+M("P(B) = "+fm(pb))+" et "+M("P(A \\cap B) = "+fm(pab,3))+". A et B sont-ils indépendants ?",ind,
      M("P(A) \\times P(B) = "+fm(rd(pa*pb,3),3))+(ind?" = P(A ∩ B) : indépendants.":" ≠ P(A ∩ B) : pas indépendants."));},
  function(r){var c=pick(r,[["deux 6",1,36],["deux nombres pairs",9,36],["un 1 puis un 2",1,36]]),ok=rd(c[1]/c[2],4);
    return Q(r,"On lance deux dés équilibrés (lancers indépendants). Probabilité d’obtenir "+c[0]+" ?",ok,[[rd(c[1]===9?0.5:1/6,4),"conf"],[rd(c[1]===9?1:2/6,4),"addp"],[rd(c[1]===9?0.25+0.1:1/12,4),"calc"]],{d:4},
      "Lancers indépendants : on multiplie, "+(c[1]===9?M("\\dfrac{1}{2} \\times \\dfrac{1}{2} = \\dfrac{1}{4}"):M("\\dfrac{1}{6} \\times \\dfrac{1}{6} = \\dfrac{1}{36}"))+".");},
  function(r){var pa=pick(r,[0.3,0.4,0.7]),pb=pick(r,[0.6,0.2,0.5]);
    return Q(r,"A et B sont indépendants, "+M("P(A) = "+fm(pa))+" et "+M("P(B) = "+fm(pb))+". Dans l’arbre, quelle probabilité porte la branche « ? » ?",pb,[[rd(pa*pb,3),"conf"],[pa,"conf"],[rd(1-pb,3),"compl"]],{d:3,fig:{k:"tree",p:[f(pa),f(1-pa)],c:[["?",""],["",""]]}},
      "Indépendance : savoir que A est réalisé ne change rien, "+M("P_A(B) = P(B) = "+fm(pb))+".");},
  function(r){var pa=pick(r,[0.2,0.3,0.5]),pb=pick(r,[0.4,0.6]),ok=rd(pa+pb-pa*pb,3);
    return Q(r,"A et B sont indépendants, "+M("P(A) = "+fm(pa))+" et "+M("P(B) = "+fm(pb))+". Que vaut "+M("P(A \\cup B)")+" ?",ok,[[rd(pa+pb,3),"addp"],[rd(pa*pb,3),"conf"],[rd(1-pa*pb,3),"compl"]],{d:3},
      M("P(A \\cup B) = P(A) + P(B) - P(A)P(B) = "+fm(pa)+" + "+fm(pb)+" - "+fm(rd(pa*pb,3))+" = "+fm(ok,3))+".");}
]);

/* ─── Espace (Tle) ─── */
addAngles("vol_pyramide",[
  function(r){var R=pick(r,[3,5,6]),h=pick(r,[6,9,10,12]),ok=rd(3.14*R*R*h/3,2);
    return Q(r,"Un cône a un rayon de "+R+" cm et une hauteur de "+h+" cm. Quel est son volume ? "+PI,ok,[[rd(3.14*R*R*h,2),"demi"],[rd(3.14*R*h/3,2),"formule"],[rd(3.14*4*R*R*h/3,2),"conf"]],{u:"cm³",d:2},
      M("V = \\dfrac{\\pi r^2 h}{3} = \\dfrac{3{,}14 \\times "+R+"^2 \\times "+h+"}{3} = "+fm(ok))+" cm³.");},
  function(r){var B=pick(r,[12,20,24,30,45]),h=pick(r,[5,6,9,10]),V=B*h/3;
    return Q(r,"Une pyramide de volume "+f(V)+" cm³ a une base d’aire "+B+" cm². Quelle est sa hauteur ?",h,[[rd(V/B,2),"demi"],[rd(V*3*B,0),"inv"],[rd(3*B/V,2),"inv"]],{u:"cm",d:2,far:2},
      M("h = \\dfrac{3V}{\\mathcal{B}} = \\dfrac{3 \\times "+fm(V)+"}{"+B+"} = "+h)+" cm.");},
  function(r){var V=pick(r,[90,120,150,240,360]);
    return Q(r,"Un pavé droit et une pyramide ont la même base et la même hauteur. Le pavé a un volume de "+V+" cm³. Volume de la pyramide ?",V/3,[[V/2,"demi"],[V*3,"inv"],[V,"conf"]],{u:"cm³",d:2},"Une pyramide a le TIERS du volume du prisme (ou pavé) de même base et même hauteur : "+M(V+" \\div 3 = "+(V/3))+" cm³.");},
  function(r){var all=[["cube",M("c^3")],["pavé droit",M("L \\times \\ell \\times h")],["cylindre",M("\\pi r^2 h")],["cône",M("\\dfrac{\\pi r^2 h}{3}")],["boule",M("\\dfrac{4}{3}\\pi r^3")],["pyramide",M("\\dfrac{\\mathcal{B} \\times h}{3}")]];
    return QA(r,"Associe chaque solide à la formule de son volume.",pickN(r,all,4),"Prismes et cylindres : base × hauteur. Pyramides et cônes : le tiers.");}
]);
addAngles("vol_sphere",[
  function(r){var D=pick(r,[6,10,12,20]),R=D/2,ok=rd(4/3*3.14*R*R*R,2);
    return Q(r,"Une balle a un diamètre de "+D+" cm. Quel est son volume ? "+PI,ok,[[rd(4/3*3.14*D*D*D,2),"conf"],[rd(4*3.14*R*R,2),"formule"],[rd(3.14*R*R*R,2),"demi"]],{u:"cm³",d:2},
      "Rayon "+R+" cm (moitié du diamètre) : "+M("V = \\dfrac{4}{3} \\times 3{,}14 \\times "+R+"^3 \\approx "+fm(ok))+" cm³.");},
  function(r){var k=pick(r,[2,3]),ok=k*k*k;
    return Q(r,"Si on multiplie le rayon d’une boule par "+k+", son volume est multiplié par…",ok,[[k,"conf"],[k*k,"demi"],[3*k,"addp"]],{d:0},"Le volume dépend de "+M("r^3")+" : "+M(k+"^3 = "+ok)+".");},
  function(r){var R=pick(r,[6,9,10,12]),ok=rd(2/3*3.14*R*R*R,2);
    return Q(r,"Un bol a la forme d’une demi-boule de rayon intérieur "+R+" cm. Quelle est sa contenance (en cm³) ? "+PI,ok,[[rd(4/3*3.14*R*R*R,2),"demi"],[rd(2*3.14*R*R,2),"formule"],[rd(ok/1000,4),"unit"]],{u:"cm³",d:2,far:2},
      "La moitié d’une boule : "+M("\\dfrac{1}{2} \\times \\dfrac{4}{3}\\pi r^3 = \\dfrac{2}{3} \\times 3{,}14 \\times "+R+"^3 \\approx "+fm(ok))+" cm³, soit "+f(ok/1000,2)+" L.");}
]);

/* ─── Évolutions (1re) ─── */
addAngles("evol_succ",[
  function(r){var P=pick(r,[40,80,120,250]),p1=pick(r,[10,20,25]),p2=pick(r,[5,10,20]),ok=rd(P*(1+p1/100)*(1+p2/100),2);
    return Q(r,"Un article à "+P+" € augmente de "+p1+" %, puis de "+p2+" %. Quel est son nouveau prix ?",ok,[[rd(P*(1+(p1+p2)/100),2),"addp"],[rd(P*(1+p1/100),2),"demi"],[rd(P+p1+p2,2),"pct0"]],{u:"€",d:2},
      M(P+" \\times "+fm(1+p1/100)+" \\times "+fm(1+p2/100)+" = "+fm(ok))+" €. La 2ᵉ hausse s’applique au nouveau prix.");},
  function(r){var all=[["+10 % puis +10 %","+21 %"],["+20 % puis −20 %","−4 %"],["−50 % puis +100 %","0 %"],["+50 % puis −50 %","−25 %"],["+10 % puis −10 %","−1 %"],["−20 % puis −20 %","−36 %"]];
    return QA(r,"Associe chaque enchaînement d’évolutions à l’évolution globale.",pickN(r,all,4),"On multiplie les coefficients : +20 % puis −20 % donne 1,2 × 0,8 = 0,96, soit −4 %.");},
  function(r){var p1=pick(r,[10,20,30]),p2=pick(r,[10,20]),c1=1+p1/100,c2=1-p2/100;
    return QX(r,"Évolution globale d’une hausse de "+p1+" % suivie d’une baisse de "+p2+" % :",["Coefficients : "+M(fm(c1))+" et "+M(fm(c2)),"Coefficient global : "+M(fm(c1)+" + "+fm(c2)+" = "+fm(rd(c1+c2,2))),"Évolution globale : "+sgp(rd((c1+c2-1)*100,2))],1,
      "Les coefficients se MULTIPLIENT : "+M(fm(c1)+" \\times "+fm(c2)+" = "+fm(rd(c1*c2,4)))+", soit "+sgp(rd((c1*c2-1)*100,2))+".");}
]);
addAngles("taux_moyen",[
  function(r){var c=pick(r,[[200,242,2,10],[500,605,2,10],[1000,1331,3,10],[400,441,2,5],[100,144,2,20]]),g=rd((c[1]/c[0]-1)*100,2);
    return Q(r,"Un prix passe de "+c[0]+" € à "+c[1]+" € en "+c[2]+" ans. Quel est le taux d’évolution annuel moyen ?",c[3],[[g,"conf"],[rd(g/c[2],2),"addp"],[rd(c[3]+g/c[2],2),"calc"]],{F:sgp,nu:"%",d:2},
      "Coefficient global "+M(fm(c[1]/c[0],3))+". "+M("q = \\sqrt["+c[2]+"]{"+fm(c[1]/c[0],3)+"} = "+fm(1+c[3]/100))+" : "+sgp(c[3])+" par an.");},
  function(r){var c=pick(r,[[1.331,3,1.1],[1.21,2,1.1],[1.1025,2,1.05],[1.44,2,1.2],[0.81,2,0.9]]);
    return Q(r,"Coefficient multiplicateur global sur "+c[1]+" ans : "+f(c[0],4)+". Quel est le coefficient annuel moyen ?",c[2],[[rd(c[0]/c[1],3),"addp"],[rd(1+(c[0]-1)/c[1],3),"addp"],[rd(c[0]*c[1],3),"inv"]],{d:3},
      M("q^"+c[1]+" = "+fm(c[0],4))+", donc "+M("q = "+fm(c[0],4)+"^{1/"+c[1]+"} = "+fm(c[2]))+".");},
  function(r){var g=pick(r,[30,50,60,80]),n=pick(r,[3,4,5]),ok=(Math.pow(1+g/100,1/n)-1)*100;
    return QE(r,"Une valeur a augmenté de "+g+" % en "+n+" ans. Estime le taux annuel moyen.",ok,{u:"%",min:0,max:Math.ceil(g/n/5)*5+5,tol:0.6},
      "Il est un peu plus petit que "+f(g/n,1)+" % (les hausses se cumulent) : "+M("("+fm(1+g/100)+")^{1/"+n+"} - 1 \\approx "+fm(rd(ok/100,4),4))+", soit "+f(ok,2)+" %.");},
  function(r){var t=pick(r,[5,10,20]);return VF(r,"Une hausse de "+t+" % par an pendant 2 ans correspond à une hausse globale de "+2*t+" %.",false,"Faux : "+M(fm(1+t/100)+"^2 = "+fm(rd(Math.pow(1+t/100,2),4),4))+", soit "+sgp(rd((Math.pow(1+t/100,2)-1)*100,2))+".");}
]);
addAngles("evol_reciproque",[
  function(r){var c=pick(r,[[25,150],[20,96],[50,90],[10,55],[25,100]]),P0=c[1]/(1+c[0]/100);
    return Q(r,"Après une hausse de "+c[0]+" %, un article coûte "+c[1]+" €. Quel était son prix avant la hausse ?",P0,[[rd(c[1]*(1-c[0]/100),2),"conf"],[c[1]-c[0],"pct0"],[rd(c[1]*(1+c[0]/100),2),"signe"]],{u:"€",d:2},
      "On DIVISE par le coefficient : "+M(c[1]+" \\div "+fm(1+c[0]/100)+" = "+fm(P0))+" €. Enlever "+c[0]+" % au nouveau prix est faux.");},
  function(r){var all=[["+25 %","−20 %"],["+100 %","−50 %"],["+300 %","−75 %"],["−20 %","+25 %"],["−50 %","+100 %"],["+50 %","−33,33 %"]];
    var p=pickN(r,all,4),L={},R={};if(p.some(function(x){if(L[x[0]]||R[x[1]])return true;L[x[0]]=1;R[x[1]]=1;return false;}))return null;
    return QA(r,"Associe chaque évolution à l’évolution réciproque (qui ramène à la valeur de départ).",p,"Coefficient réciproque = 1 ÷ coefficient. Exemple : +25 % → × 1,25 ; 1 ÷ 1,25 = 0,8, soit −20 %.");},
  function(r){var t=pick(r,[10,20,30]);return VF(r,"Une hausse de "+t+" % est exactement compensée par une baisse de "+t+" %.",false,"Faux : "+M(fm(1+t/100)+" \\times "+fm(1-t/100)+" = "+fm(rd((1+t/100)*(1-t/100),4)))+" : on ne revient pas à 1.");}
]);
addAngles("proba_arbre",[
  function(r){var pa=pick(r,[0.3,0.4,0.6]),p1=pick(r,[0.6,0.7,0.25,0.15]);
    return Q(r,"Quelle probabilité porte la branche « ? » ?",rd(1-p1,2),[[p1,"conf"],[rd(1-pa,2),"conf"],[rd(pa*p1,3),"formule"]],{d:3,fig:{k:"tree",p:[f(pa),f(1-pa)],c:[[f(p1),"?"],["",""]]}},
      "Les branches issues d’un même nœud ont une somme égale à 1 : "+M("1 - "+fm(p1)+" = "+fm(rd(1-p1,2)))+".");},
  function(r){var pa=pick(r,[0.2,0.4,0.5]),p1=pick(r,[0.3,0.9,0.6]),p2=pick(r,[0.1,0.2,0.5]),ok=rd(pa*p1+(1-pa)*p2,4);
    return Q(r,"D’après l’arbre, quelle est la probabilité de B (formule des probabilités totales) ?",ok,[[rd(pa*p1,4),"demi"],[rd(p1+p2,4),"addp"],[rd(1-ok,4),"compl"]],{d:4,fig:{k:"tree",p:[f(pa),f(1-pa)],c:[[f(p1),f(1-p1)],[f(p2),f(1-p2)]]}},
      M("P(B) = "+fm(pa)+" \\times "+fm(p1)+" + "+fm(1-pa)+" \\times "+fm(p2)+" = "+fm(ok,4))+".");}
]);
addAngles("racine_inverse",[
  function(r){var inv=r()<0.5;
    return Q(r,"Sur "+M("]0\\,;\\,+\\infty[")+", la fonction "+(inv?"inverse "+M("x \\mapsto \\dfrac{1}{x}"):"racine carrée "+M("x \\mapsto \\sqrt{x}"))+" est…",inv?"décroissante":"croissante",[[inv?"croissante":"décroissante","signe"],["constante","conf"],["croissante puis décroissante","conf"]],{},
      inv?"Plus x est grand, plus 1/x est petit : la fonction inverse est décroissante.":"Plus x est grand, plus √x est grand : la fonction racine carrée est croissante.");},
  function(r){var n=rnd(r,4,12),ok=n*n;
    return Q(r,"Résoudre "+M("\\sqrt{x} = "+n)+".",ok,[[n/2,"demi"],[2*n,"conf"],[rd(Math.sqrt(n),3),"inv"]],{d:3},"On élève au carré : "+M("x = "+n+"^2 = "+ok)+".");},
  function(r){var a=pick(r,[3,4,5,8]),b=pick(r,[6,7,9,10]);
    return Q(r,"Sans calculatrice, comparer "+frM(1,a)+" et "+frM(1,b)+".",M(frL(1,a)+" > "+frL(1,b)),[[M(frL(1,a)+" < "+frL(1,b)),"conf"],[M(frL(1,a)+" = "+frL(1,b)),"conf"]],{},
      "La fonction inverse est décroissante : "+a+" < "+b+" donc "+M(frL(1,a)+" > "+frL(1,b))+". (Partager entre plus de personnes donne une plus petite part !)");}
]);
addAngles("pyth_recip",[
  function(r){var t=pick(r,[[60,80,100],[30,40,50],[90,120,150],[120,160,200]]),ok=r()<0.5,c=ok?t[2]:t[2]+pick(r,[-3,2,4]);
    return oui(r,"Pour vérifier un angle droit, un maçon mesure "+t[0]+" cm et "+t[1]+" cm sur les deux murs, puis "+c+" cm entre les deux repères. L’angle est-il droit ?",ok,
      M(t[0]+"^2 + "+t[1]+"^2 = "+(t[0]*t[0]+t[1]*t[1]))+" et "+M(c+"^2 = "+c*c)+(ok?" : égalité, l’angle est droit (règle du 3-4-5).":" : pas d’égalité, l’angle n’est pas droit."));},
  function(r){var t=pick(r,TRIP.slice(0,8)),wr=shuffle(r,[[4,5,7],[5,6,8],[6,7,9],[7,8,11],[5,9,10],[6,8,11],[8,10,13]]).slice(0,3);
    return Q(r,"Lequel de ces triangles (longueurs en cm) est rectangle ?",t.join(" ; "),wr.map(function(w){return [w.join(" ; "),"calc"];}),{},M(t[2]+"^2 = "+t[2]*t[2])+" et "+M(t[0]+"^2 + "+t[1]+"^2 = "+(t[0]*t[0]+t[1]*t[1]))+" : égalité.");}
]);
addAngles("trigo_fig",[
  function(r){var N=pick(r,NOMS2),k=rnd(r,0,2),side=[["opposé","["+N[0]+N[1]+"]"],["adjacent","["+N[0]+N[2]+"]"],["l’hypoténuse","["+N[1]+N[2]+"]"]],asked=side[k];
    return Q(r,"Par rapport à l’angle α, quel côté est "+(k===2?"":"le côté ")+asked[0]+" ?",asked[1],side.filter(function(s,i){return i!==k;}).map(function(s){return [s[1],"conf"];}),{fig:{k:"tri",ang:"α",a:"",b:"",c:"",n:N}},
      "L’hypoténuse est en face de l’angle droit ("+side[2][1]+"). Le côté opposé est en face de α ("+side[0][1]+"), l’adjacent touche α ("+side[1][1]+").");},
  function(r){var o=rnd(r,3,9),a=rnd(r,5,14);if(o>=a)return null;var ok=Math.round(Math.atan(o/a)*180/Math.PI);
    return Q(r,"Calculer l’angle α (arrondi au degré).",ok+"°",[[Math.round(Math.atan(a/o)*180/Math.PI)+"°","inv"],[Math.round(Math.acos(Math.min(1,o/a))*180/Math.PI)+"°","conf"],[(ok+5)+"°","calc"]],{fig:{k:"tri",ang:"α",a:o+" cm",b:a+" cm",c:""}},
      "On connaît l’opposé ("+o+" cm) et l’adjacent ("+a+" cm) : "+M("\\tan\\alpha = \\dfrac{"+o+"}{"+a+"}")+", donc "+M("\\alpha = \\tan^{-1}\\left(\\dfrac{"+o+"}{"+a+"}\\right) \\approx "+ok+"^\\circ")+".");}
]);

/* ─── Problèmes des métiers ─── */
addAngles("pb_logistique",[
  function(r){var cap=pick(r,[26,33]),n=pick(r,[100,120,150,180,200]),ok=Math.ceil(n/cap);if(n%cap===0)return null;
    return Q(r,"Un camion transporte au maximum "+cap+" palettes. Il faut livrer "+n+" palettes. Combien de voyages faut-il prévoir ?",ok,[[Math.floor(n/cap),"arr"],[rd(n/cap,2),"arr"],[ok+1,"calc"]],{d:2},
      M(n+" \\div "+cap+" \\approx "+fm(rd(n/cap,2)))+" : "+Math.floor(n/cap)+" voyages ne suffisent pas, il en faut "+ok+" (arrondi SUPÉRIEUR).");},
  function(r){var c=pick(r,[[12,2.4,2.6],[6,2.4,2.6],[13.6,2.45,2.7]]),ok=rd(c[0]*c[1]*c[2],2);
    return Q(r,"Une remorque a pour dimensions intérieures "+f(c[0])+" m × "+f(c[1])+" m × "+f(c[2])+" m. Quel est son volume utile ?",ok,[[rd(c[0]+c[1]+c[2],2),"addp"],[rd(c[0]*c[1],2),"demi"],[rd(ok*1000,0),"unit"]],{u:"m³",d:2,far:2},
      M(fm(c[0])+" \\times "+fm(c[1])+" \\times "+fm(c[2])+" \\approx "+fm(ok))+" m³.");},
  function(r){var s=pick(r,[480,600,750]),c=pick(r,[35,40,45]),j=pick(r,[5,6]),ok=Math.floor(s/(c*j));
    return Q(r,"Un entrepôt a "+s+" cartons en stock. On en expédie "+c+" par jour, "+j+" jours par semaine. Combien de semaines COMPLÈTES le stock permet-il de tenir ?",ok,[[Math.ceil(s/(c*j))===ok?ok+1:Math.ceil(s/(c*j)),"arr"],[Math.floor(s/c),"demi"],[rd(s/(c*j),2),"arr"]],{d:2},
      "Par semaine : "+M(c+" \\times "+j+" = "+c*j)+" cartons. "+M(s+" \\div "+c*j+" \\approx "+fm(rd(s/(c*j),2)))+" : "+ok+" semaines complètes.");}
]);
addAngles("pb_coiffure",[
  function(r){var p=pick(r,[28,32,36,45]),t=pick(r,[10,15,20]),ok=rd(p*(1-t/100),2);
    return Q(r,"Un forfait coupe coûte "+p+" €. Les étudiants ont une remise de "+t+" %. Combien paient-ils ?",ok,[[rd(p*t/100,2),"compl"],[p-t,"pct0"],[rd(p*(1+t/100),2),"signe"]],{u:"€",d:2},
      "Remise : "+M(p+" \\times "+fm(t/100)+" = "+fm(rd(p*t/100,2)))+" €. Prix : "+M(p+" - "+fm(rd(p*t/100,2))+" = "+fm(ok))+" € (ou "+M(p+" \\times "+fm(1-t/100))+").");},
  function(r){var V=pick(r,[500,750,1000]),d=pick(r,[12,15,20,25]),ok=Math.floor(V/d);if(V%d===0)return null;
    return Q(r,"Un flacon contient "+V+" mL de shampoing. On en utilise "+d+" mL par client. Combien de clients peut-on servir ?",ok,[[ok+1,"arr"],[V*d,"inv"],[rd(V/d,2),"arr"]],{d:2},
      M(V+" \\div "+d+" \\approx "+fm(rd(V/d,2)))+" : on peut servir "+ok+" clients (le dernier n’aurait pas assez).");}
]);
addAngles("pb_elec",[
  function(r){var a=pick(r,[60,75,100]),b=pick(r,[8,10,12]),h=pick(r,[1000,2000,500]),ok=(a-b)*h/1000;
    return Q(r,"On remplace une ampoule de "+a+" W par une LED de "+b+" W. Quelle énergie économise-t-on en "+f(h)+" h d’éclairage ?",ok,[[(a-b)*h,"unit"],[(a+b)*h/1000,"signe"],[a*h/1000,"demi"],[rd(ok/10,2),"unit"]],{u:"kWh",d:2,far:2},
      "Économie de puissance : "+(a-b)+" W = "+f((a-b)/1000,3)+" kW. "+M(fm((a-b)/1000,3)+" \\times "+fm(h)+" = "+fm(ok))+" kWh.");},
  function(r){var P=pick(r,[2000,2500,3000]),U=230,ok=rd(P/U,1),fz=pick(r,[10,16]);
    return Q(r,"Un four de "+P+" W est branché sur 230 V. Quelle intensité le traverse (au dixième) ? Un fusible de "+fz+" A suffit-il ?",f(ok,1)+" A : "+(ok<fz?"oui":"non"),[[f(P*U,0)+" A : non","inv"],[f(ok,1)+" A : "+(ok<fz?"non":"oui"),"conf"],[f(rd(U/P,3),3)+" A : oui","inv"]],{},
      M("I = \\dfrac{P}{U} = \\dfrac{"+P+"}{230} \\approx "+fm(ok,1))+" A, "+(ok<fz?"inférieure":"supérieure")+" à "+fz+" A.");}
]);
addAngles("pb_cuisine",[
  function(r){var c=pick(r,[[1.5,25],[3,25],[2.4,20],[1.6,20]]),ok=rd(c[0]/(1-c[1]/100),2);
    return Q(r,"La viande perd "+c[1]+" % de sa masse à la cuisson. Combien de viande crue faut-il pour obtenir "+f(c[0])+" kg de viande cuite ?",ok,[[rd(c[0]*(1+c[1]/100),3),"conf"],[rd(c[0]*(1-c[1]/100),3),"signe"],[rd(c[0]+c[1]/100,3),"pct0"]],{u:"kg",d:3},
      "Masse cuite = masse crue × "+f(1-c[1]/100)+". Donc masse crue = "+M(fm(c[0])+" \\div "+fm(1-c[1]/100)+" = "+fm(ok))+" kg. Ajouter "+c[1]+" % ne suffit pas !");},
  function(r){var p=pick(r,[3.5,4,4.5]),ca=pick(r,[2.4,3,1.8,3.6]),ok=rd(ca*p,2);
    return Q(r,"Le coût matière d’un dessert est de "+f(ca)+" €. Le restaurant applique un coefficient multiplicateur de "+f(p)+". Quel est le prix de vente ?",ok,[[rd(ca+p,2),"addp"],[rd(ca/p,2),"inv"],[rd(ca*(1+p/100),2),"pct0"]],{u:"€",d:2},M(fm(ca)+" \\times "+fm(p)+" = "+fm(ok))+" €.");}
]);
addAngles("pb_auto",[
  function(r){var L=pick(r,[4,4.5,5]),p=pick(r,[9.8,12.5,11]),mo=pick(r,[25,30,40]),ht=rd(L*p+mo,2),ok=rd(ht*1.2,2);
    return Q(r,"Vidange : "+f(L)+" L d’huile à "+f(p)+" € HT le litre et "+mo+" € HT de main-d’œuvre. TVA 20 %. Montant TTC ?",ok,[[ht,"demi"],[rd(L*p*1.2+mo,2),"demi"],[rd(ht+20,2),"pct0"]],{u:"€",d:2},
      "HT : "+M(fm(L)+" \\times "+fm(p)+" + "+mo+" = "+fm(ht))+" €. TTC : "+M(fm(ht)+" \\times 1{,}2 = "+fm(ok))+" €.");},
  function(r){var d=pick(r,[0.6,0.65,0.7]),n=pick(r,[1000,500,800]),ok=rd(3.14*d*n/1000,2);
    return Q(r,"Une roue a un diamètre de "+f(d)+" m. Quelle distance parcourt-elle en "+n+" tours (en km) ?",ok,[[rd(3.14*d/2*n/1000,3),"demi"],[rd(3.14*d*n,0),"unit"],[rd(d*n/1000,3),"formule"]],{u:"km",d:3,far:2},
      "Un tour = périmètre "+M("\\pi \\times d \\approx "+fm(rd(3.14*d,3)))+" m. "+n+" tours : "+f(3.14*d*n)+" m = "+f(ok,3)+" km.");}
]);
addAngles("pct_cm_tuiles",[
  function(r){var all=[["× 0,8",0.8],["× 1,05",1.05],["× 0,95",0.95],["× 1,2",1.2],["× 0,5",0.5],["× 1,02",1.02],["× 0,98",0.98]],c=pickN(r,all,4).sort(function(a,b){return a[1]-b[1];});
    return QO(r,"Range ces évolutions de la plus forte baisse à la plus forte hausse.",c.map(function(x){return x[0];}),"Coefficient < 1 : baisse (d’autant plus forte qu’il est petit). Coefficient > 1 : hausse.",{how:"de la plus forte baisse à la plus forte hausse"});}
]);
addAngles("deriv_tuiles",[
  function(r){var a=rnd(r,2,5),b=rnd(r,2,9),c=rnd(r,1,9);
    return QX(r,"Pierre dérive "+M("f(x) = "+a+"x^2 - "+b+"x + "+c)+" :",[M("("+a+"x^2)' = "+(2*a)+"x"),M("(-"+b+"x)' = -"+b),M("("+c+")' = "+c),M("f'(x) = "+(2*a)+"x - "+b+" + "+c)],2,
      "La dérivée d’une constante est 0. Donc "+M("f'(x) = "+(2*a)+"x - "+b)+".");}
]);
