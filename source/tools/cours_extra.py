# -*- coding: utf-8 -*-
# Ajoute des questions de cours (QCM, Vrai/Faux, tuiles, ordre, étape fausse) à src/cours.json
import json,io,os
here=os.path.dirname(os.path.abspath(__file__))
P=os.path.join(here,'..','src','cours.json')
d=json.load(io.open(P,encoding='utf-8'))
by={it['id']:it for it in d['items']}
def Q(q,ok,wr,x=""): return {"q":q,"ok":ok,"wr":wr,"x":x}
def V(q,v,x=""): return {"q":q,"vf":v,"x":x}
def A(q,pairs,x=""): return {"q":q,"as":pairs,"x":x}
def O(q,items,x="",how="",sep=" ; "): return {"q":q,"or":items,"x":x,"how":how,"sep":sep}
def X(q,steps,bad,x=""): return {"q":q,"st":steps,"bad":bad,"x":x}
E={}
E['cc_signes']=[
 V("Le produit de quatre nombres négatifs est positif.",True,"Nombre pair de facteurs négatifs : le produit est positif."),
 Q("$-5 - 3 = ?$","$-8$",[["$-2$","signe"],["$8$","signe"],["$2$","signe"]],"On part de −5 et on recule de 3 : −8."),
 Q("Le signe de $(-2)^3$ est :","négatif",["positif","nul","on ne peut pas savoir"],"$(-2)^3 = (-2) \\times (-2) \\times (-2) = -8$ : trois facteurs négatifs."),
 A("Associe chaque calcul à son résultat.",[["$(-2) \\times (-5)$","$10$"],["$(-2) + (-5)$","$-7$"],["$(-2) - (-5)$","$3$"],["$(-10) \\div 5$","$-2$"],["$5 - 7$","$-2{,}0$"]],"× et ÷ : règle des signes. + et − : on regarde les distances à zéro."),
 O("Range ces nombres du plus petit au plus grand.",["$-7$","$-2{,}5$","$-1$","$0{,}5$","$3$"],"Sur une droite graduée, plus un nombre est à gauche, plus il est petit : −7 < −2,5.","du plus petit au plus grand"," < "),
 V("$-3 > -1$",False,"−3 est à gauche de −1 sur la droite graduée : −3 < −1."),
 Q("L’opposé de $-6$ est :","$6$",[["$-6$","signe"],["$\\dfrac{1}{6}$","conf"],["$-\\dfrac{1}{6}$","conf"]],"L’opposé change le signe. L’inverse, c’est autre chose : 1/6."),
 X("Calcul de $-3 - (-7)$ :",["Soustraire $-7$, c’est ajouter $7$.","$= -3 + 7$","$= -10$"],2,"$-3 + 7 = 4$ (et non −10)."),
 Q("$(-4) \\times 0$ vaut :","$0$",[["$-4$","conf"],["$4$","signe"],["$-0{,}4$","conf"]],"Tout nombre multiplié par 0 donne 0."),
]
E['cc_operations']=[
 Q("Multiplier un nombre par 0,5 revient à :","le diviser par 2",[["le multiplier par 2","inv"],["lui retirer 0,5","addp"],["lui ajouter sa moitié","conf"]],"$\\times 0{,}5 = \\times \\dfrac{1}{2}$ : c’est prendre la moitié."),
 V("Multiplier par un nombre plus petit que 1 donne toujours un résultat plus grand.",False,"Contre-exemple : $10 \\times 0{,}5 = 5$, plus petit que 10 (pour un nombre positif)."),
 V("Diviser par 0,1 revient à multiplier par 10.",True,"$\\div 0{,}1 = \\div \\dfrac{1}{10} = \\times 10$."),
 A("Associe chaque mot à son opération.",[["somme","résultat d’une addition"],["différence","résultat d’une soustraction"],["produit","résultat d’une multiplication"],["quotient","résultat d’une division"]],"Somme (+), différence (−), produit (×), quotient (÷)."),
 Q("Dans $a \\times b = c$, si on double $a$, alors $c$ est :","doublé",[["inchangé","conf"],["augmenté de 2","addp"],["divisé par 2","inv"]],"$(2a) \\times b = 2 \\times (a \\times b) = 2c$."),
 Q("$37 \\times 99$ est égal à :","$37 \\times 100 - 37$",[["$37 \\times 100 - 1$","calc"],["$37 \\times 100 + 37$","signe"],["$37 \\times 100 - 99$","conf"]],"$37 \\times 99 = 37 \\times (100 - 1) = 3\\,700 - 37 = 3\\,663$."),
 O("Range ces résultats du plus petit au plus grand.",["$10 \\times 0{,}5$","$10 - 0{,}5$","$10 + 0{,}5$","$10 \\div 0{,}5$"],"5 < 9,5 < 10,5 < 20 : diviser par 0,5 revient à multiplier par 2.","du plus petit au plus grand"," < "),
 Q("Le double de 0,6 est :","1,2",[["0,12","unit"],["0,36","conf"],["2,6","addp"]],"$2 \\times 0{,}6 = 1{,}2$."),
 Q("Diviser par 4 revient à :","prendre le quart",[["multiplier par 0,4","conf"],["retirer 4","addp"],["prendre 4 %","pct0"]],"$\\div 4 = \\times \\dfrac{1}{4} = \\times 0{,}25$."),
]
E['cc_puissances']=[
 Q("$10^{-2}$ est égal à :","0,01",[["−100","signe"],["−20","formule"],["0,001","calc"]],"$10^{-2} = \\dfrac{1}{10^2} = \\dfrac{1}{100} = 0{,}01$."),
 V("$2^3 = 6$",False,"$2^3 = 2 \\times 2 \\times 2 = 8$ (et non $2 \\times 3$)."),
 Q("$10^0$ vaut :","1",[["0","conf"],["10","conf"],["n’existe pas","conf"]],"Par convention, tout nombre non nul à la puissance 0 vaut 1."),
 A("Associe chaque puissance de 10 à son écriture décimale.",[["$10^3$","1 000"],["$10^{-1}$","0,1"],["$10^{-3}$","0,001"],["$10^6$","1 000 000"],["$10^0$","1"]],"Exposant positif : autant de zéros ; exposant négatif : autant de chiffres après la virgule."),
 Q("$a^2 \\times a^3 = ?$","$a^5$",[["$a^6$","formule"],["$2a^5$","conf"],["$a^1$","signe"]],"On additionne les exposants : $a^{2+3} = a^5$."),
 Q("$\\sqrt{9 + 16}$ vaut :","5",[["7","formule"],["25","demi"],["12,5","demi"]],"$\\sqrt{9 + 16} = \\sqrt{25} = 5$. Attention : $\\sqrt{9} + \\sqrt{16} = 7$, ce n’est pas pareil !"),
 O("Range ces nombres du plus petit au plus grand.",["$10^1$","$5^2$","$3^3$","$2^5$"],"10 < 25 < 27 < 32.","du plus petit au plus grand"," < "),
 Q("L’écriture scientifique de 3 500 est :","$3{,}5 \\times 10^3$",[["$35 \\times 10^2$","conf"],["$3{,}5 \\times 10^{-3}$","signe"],["$3{,}5 \\times 10^4$","calc"]],"Un seul chiffre non nul avant la virgule : $3{,}5 \\times 10^3$."),
]
E['cc_prop']=[
 V("Le prix payé à la pompe est proportionnel au nombre de litres (prix au litre fixe).",True,"Prix = prix au litre × nombre de litres : c’est une situation de proportionnalité."),
 V("La taille d’une personne est proportionnelle à son âge.",False,"On ne grandit pas toujours au même rythme : pas de proportionnalité."),
 Q("Un graphique traduit une situation de proportionnalité quand :","c’est une droite qui passe par l’origine",[["c’est une droite","demi"],["les points montent","conf"],["la courbe passe par l’origine","demi"]],"Les deux conditions sont nécessaires : droite ET origine."),
 Q("3 objets coûtent 12 €. Combien coûtent 6 objets ?","24 €",[["15 €","addp"],["18 €","calc"],["72 €","conf"]],"Deux fois plus d’objets : deux fois plus cher."),
 Q("Dans un tableau de proportionnalité, on passe d’une ligne à l’autre en :","multipliant par un même nombre",[["ajoutant un même nombre","addp"],["multipliant par des nombres différents","conf"],["soustrayant un même nombre","addp"]],"Le nombre qui multiplie s’appelle le coefficient de proportionnalité."),
 X("4 kg coûtent 10 €. Prix de 6 kg ?",["Prix d’1 kg : $10 \\div 4 = 2{,}5$ €","Prix de 6 kg : $2{,}5 + 6$","$= 8{,}5$ €"],1,"Pour 6 kg on multiplie : $2{,}5 \\times 6 = 15$ €."),
 Q("Une vitesse constante de 60 km/h correspond à :","1 km par minute",[["60 km par minute","base"],["1 km par seconde","base"],["6 km par minute","unit"]],"60 km en 60 min : 1 km par minute."),
 Q("Avec 2 L de peinture, on couvre 24 m². Avec 5 L, on couvre :","60 m²",[["27 m²","addp"],["48 m²","calc"],["120 m²","conf"]],"1 L couvre 12 m², donc 5 L couvrent $5 \\times 12 = 60$ m²."),
]
E['cc_pct']=[
 Q("Prendre 25 %, c’est prendre :","le quart",[["le vingt-cinquième","conf"],["le tiers","conf"],["la moitié","conf"]],"25 % = 25/100 = 1/4."),
 Q("10 % de 350 = ?","35",[["3,5","unit"],["3 500","pct0"],["340","addp"]],"10 % : on divise par 10."),
 V("Augmenter un prix de 100 %, c’est le doubler.",True,"+100 % : × 2."),
 V("Une baisse de 50 % suivie d’une hausse de 50 % redonne le prix de départ.",False,"$0{,}5 \\times 1{,}5 = 0{,}75$ : le prix a baissé de 25 %."),
 A("Associe chaque pourcentage à la fraction de la quantité.",[["50 %","la moitié"],["25 %","le quart"],["75 %","les trois quarts"],["10 %","le dixième"],["20 %","le cinquième"],["200 %","le double"]],"p % = p/100."),
 Q("Une remise de 30 % sur 80 € fait économiser :","24 €",[["56 €","compl"],["30 €","conf"],["50 €","addp"]],"$80 \\times 0{,}3 = 24$ € d’économie ; on paie 56 €."),
 O("Range ces quantités de la plus petite à la plus grande.",["20 % de 50","10 % de 120","50 % de 30","25 % de 80"],"10 < 12 < 15 < 20.","de la plus petite à la plus grande"," < "),
 Q("Quel calcul donne 15 % de 40 ?","$40 \\times 0{,}15$",[["$40 \\times 15$","pct0"],["$40 \\div 15$","inv"],["$40 - 15$","addp"]],"15 % = 0,15 : on multiplie par 0,15."),
 Q("Le prix TTC (TVA 20 %) s’obtient à partir du prix HT en :","multipliant par 1,2",[["ajoutant 20 €","addp"],["multipliant par 0,2","compl"],["divisant par 1,2","inv"]],"TTC = HT × (1 + 20/100) = HT × 1,2."),
]
E['cc_unites']=[
 Q("1 h 30 min = ?","1,5 h",[["1,3 h","base"],["130 min","base"],["1,03 h","base"]],"30 min = la moitié d’une heure = 0,5 h."),
 Q("Combien de mL dans 1 L ?","1 000",[["100","unit"],["10","unit"],["10 000","unit"]],"1 L = 1 000 mL (milli = millième)."),
 V("1 m² = 100 cm²",False,"1 m² = 100 cm × 100 cm = 10 000 cm²."),
 A("Associe chaque unité à la grandeur mesurée.",[["km/h","vitesse"],["m²","aire"],["m³","volume"],["kg","masse"],["s","durée"],["°C","température"],["W","puissance"]],"Toujours vérifier que l’unité du résultat correspond à la grandeur demandée."),
 O("Range ces longueurs de la plus petite à la plus grande.",["5 000 mm","4 800 cm","450 m","0,5 km"],"En mètres : 5 m < 48 m < 450 m < 500 m.","de la plus petite à la plus grande"," < "),
 Q("Quelle unité convient pour la contenance d’une seringue ?","mL",[["hL","unit"],["m³","unit"],["t","conf"]],"Une seringue contient quelques millilitres."),
 Q("Une vitesse de 1 m/s correspond à :","3,6 km/h",[["1 km/h","unit"],["60 km/h","base"],["36 km/h","unit"]],"1 m/s = 3 600 m/h = 3,6 km/h."),
 X("Conversion de 2,5 m² en cm² :",["1 m² = 100 cm × 100 cm","1 m² = 10 000 cm²","2,5 m² = 250 cm²"],2,"$2{,}5 \\times 10\\,000 = 25\\,000$ cm²."),
 Q("Combien de secondes dans 1 h ?","3 600",[["60","base"],["360","calc"],["6 000","base"]],"1 h = 60 min = 60 × 60 s = 3 600 s."),
]
E['cc_formules']=[
 Q("Aire d’un triangle de base $b$ et de hauteur $h$ :","$\\dfrac{b \\times h}{2}$",[["$b \\times h$","demi"],["$\\dfrac{b + h}{2}$","addp"],["$2(b + h)$","conf"]],"Un triangle, c’est la moitié d’un rectangle."),
 Q("Volume d’un cylindre de rayon $r$ et de hauteur $h$ :","$\\pi r^2 h$",[["$2 \\pi r h$","conf"],["$\\pi r h$","demi"],["$\\dfrac{\\pi r^2 h}{3}$","conf"]],"Aire de la base (disque) × hauteur."),
 Q("Volume d’une pyramide ou d’un cône :","$\\dfrac{\\mathcal{B} \\times h}{3}$",[["$\\mathcal{B} \\times h$","demi"],["$\\dfrac{\\mathcal{B} \\times h}{2}$","conf"],["$3 \\mathcal{B} h$","inv"]],"Le tiers du volume du prisme (ou du cylindre) de même base et même hauteur."),
 V("Si on double le côté d’un carré, son aire double.",False,"L’aire est multipliée par $2^2 = 4$."),
 Q("Une aire s’exprime en :","cm², m², …",[["cm, m, …","conf"],["cm³, m³, …","conf"],["L, mL, …","conf"]],"Aire : unité « au carré »."),
 Q("Le périmètre d’un carré de côté $c$ est :","$4c$",[["$c^2$","conf"],["$2c$","demi"],["$c + 4$","addp"]],"4 côtés égaux : $c + c + c + c = 4c$."),
 V("Le périmètre d’un cercle de rayon $r$ est $\\pi r^2$.",False,"Périmètre : $2\\pi r$. $\\pi r^2$ est l’aire du disque."),
 A("Associe chaque solide à la formule de son volume.",[["cube d’arête $a$","$a^3$"],["pavé droit","$L \\times \\ell \\times h$"],["cylindre","$\\pi r^2 h$"],["cône","$\\dfrac{\\pi r^2 h}{3}$"],["boule","$\\dfrac{4}{3}\\pi r^3$"]],"Prismes et cylindres : base × hauteur ; cônes et pyramides : le tiers."),
]
E['cc_pythagore']=[
 Q("Dans un triangle rectangle, l’hypoténuse est :","le côté opposé à l’angle droit",[["le plus petit côté","conf"],["un côté de l’angle droit","conf"],["la hauteur","conf"]],"C’est aussi le plus grand côté."),
 V("Le théorème de Pythagore s’applique à tous les triangles.",False,"Seulement aux triangles rectangles."),
 V("L’hypoténuse est le plus grand côté d’un triangle rectangle.",True,"Son carré est la somme des deux autres carrés."),
 Q("Pour calculer un côté de l’angle droit, on :","soustrait les carrés",[["additionne les carrés","signe"],["soustrait les longueurs","formule"],["multiplie les longueurs","formule"]],"$a^2 = c^2 - b^2$ quand $c$ est l’hypoténuse."),
 X("Triangle ABC rectangle en A, AB = 3 cm, AC = 4 cm. Calcul de BC :",["$BC^2 = AB^2 + AC^2$","$BC^2 = 3 + 4 = 7$","$BC = \\sqrt{7}$ cm"],1,"$BC^2 = 3^2 + 4^2 = 9 + 16 = 25$, donc BC = 5 cm."),
 Q("La réciproque du théorème de Pythagore sert à :","prouver qu’un triangle est rectangle",[["calculer un angle","conf"],["calculer une aire","conf"],["prouver que deux droites sont parallèles","conf"]],"Si $c^2 = a^2 + b^2$, le triangle est rectangle."),
 O("Remets dans l’ordre les étapes d’un calcul avec Pythagore.",["On repère l’angle droit et l’hypoténuse","On écrit l’égalité de Pythagore","On remplace par les longueurs","On calcule, puis on prend la racine carrée"],"Toujours commencer par repérer l’hypoténuse.","dans l’ordre"," → "),
 Q("Un triangle de côtés 6 cm, 8 cm et 10 cm est :","rectangle",[["isocèle","conf"],["équilatéral","conf"],["quelconque","calc"]],"$6^2 + 8^2 = 36 + 64 = 100 = 10^2$."),
]
E['cc_geo']=[
 Q("La somme des angles d’un triangle vaut :","180°",[["360°","conf"],["90°","conf"],["100°","conf"]],"Toujours 180°, quel que soit le triangle."),
 Q("Chaque angle d’un triangle équilatéral mesure :","60°",[["90°","conf"],["45°","calc"],["180°","conf"]],"180° ÷ 3 = 60°."),
 Q("Le théorème de Thalès nécessite :","deux droites parallèles",[["un angle droit","conf"],["deux droites perpendiculaires","conf"],["un triangle isocèle","conf"]],"Configuration de Thalès : deux droites sécantes coupées par deux parallèles."),
 A("Associe chaque figure à sa propriété.",[["triangle isocèle","deux côtés égaux"],["triangle équilatéral","trois côtés égaux"],["triangle rectangle","un angle droit"],["carré","4 côtés égaux et 4 angles droits"],["rectangle","4 angles droits"]],"Vocabulaire de base à connaître par cœur."),
 V("Deux angles opposés par le sommet ont la même mesure.",True,"Ils sont symétriques par rapport au sommet."),
 V("Un angle obtus mesure moins de 90°.",False,"Un angle obtus mesure entre 90° et 180°."),
 O("Range ces angles du plus petit au plus grand.",["angle aigu","angle droit","angle obtus","angle plat"],"Aigu < 90° = droit < obtus < 180° = plat.","du plus petit au plus grand"," < "),
 Q("Un angle de 90° est un angle :","droit",[["aigu","conf"],["obtus","conf"],["plat","conf"]],"90° : angle droit."),
]
E['cc_stats']=[
 Q("La médiane d’une série :","partage la série rangée en deux groupes de même effectif",[["est la valeur la plus fréquente","conf"],["est la moyenne des valeurs extrêmes","conf"],["est toujours égale à la moyenne","conf"]],"Il y a autant de valeurs au-dessous qu’au-dessus."),
 V("La moyenne est toujours une valeur de la série.",False,"Exemple : la moyenne de 1 et 2 est 1,5."),
 V("L’étendue renseigne sur la dispersion d’une série.",True,"Plus l’étendue est grande, plus les valeurs sont dispersées."),
 Q("Une fréquence écrite sous forme décimale est comprise entre :","0 et 1",[["0 et 100","pct0"],["1 et 100","pct0"],["−1 et 1","signe"]],"Effectif ÷ effectif total : entre 0 et 1 (entre 0 et 100 en %)."),
 A("Associe chaque indicateur à sa définition.",[["moyenne","somme des valeurs ÷ effectif total"],["médiane","valeur du milieu de la série rangée"],["étendue","plus grande valeur − plus petite"],["fréquence","effectif ÷ effectif total"],["effectif total","nombre de valeurs"]],"Vocabulaire des statistiques."),
 X("Série : 4 ; 9 ; 2 ; 7 ; 5. Calcul de la médiane :",["Il y a 5 valeurs.","La valeur du milieu est la 3e.","La médiane est donc 2."],2,"Il faut d’abord RANGER : 2 ; 4 ; 5 ; 7 ; 9. La médiane est 5."),
 Q("Pour 8 valeurs rangées, la médiane est :","la moyenne des 4e et 5e valeurs",[["la 4e valeur","calc"],["la 8e valeur","conf"],["la moyenne de toutes les valeurs","conf"]],"Effectif pair : on prend la moyenne des deux valeurs du milieu."),
 Q("On ajoute une valeur très grande à une série. Quel indicateur change le plus ?","la moyenne",[["la médiane","conf"],["l’effectif de chaque valeur","conf"],["rien ne change","conf"]],"La moyenne est sensible aux valeurs extrêmes, la médiane beaucoup moins."),
]
E['cc_equations']=[
 Q("Résoudre une équation, c’est :","trouver les valeurs de $x$ qui la rendent vraie",[["calculer $x^2$","conf"],["simplifier l’expression","conf"],["remplacer $x$ par 0","conf"]],"On cherche les solutions."),
 V("$x = 3$ est solution de $2x + 1 = 7$.",True,"$2 \\times 3 + 1 = 7$."),
 V("$x = 2$ est solution de $3x - 1 = 7$.",False,"$3 \\times 2 - 1 = 5 \\neq 7$."),
 Q("Dans $3x = 12$, pour trouver $x$ on :","divise par 3",[["soustrait 3","formule"],["multiplie par 3","inv"],["ajoute 3","formule"]],"$x = 12 \\div 3 = 4$."),
 A("Associe chaque équation à sa solution.",[["$x + 5 = 12$","$x = 7$"],["$3x = 12$","$x = 4$"],["$x - 4 = 2$","$x = 6$"],["$\\dfrac{x}{2} = 5$","$x = 10$"],["$2x + 1 = 7$","$x = 3$"]],"On vérifie en remplaçant x par la valeur trouvée."),
 O("Remets dans l’ordre la résolution de $4x - 3 = 9$.",["$4x - 3 = 9$","$4x = 9 + 3$","$4x = 12$","$x = 3$"],"On isole $4x$, puis on divise par 4.","dans l’ordre"," → "),
 Q("Développer $-2(x - 3)$ :","$-2x + 6$",[["$-2x - 6$","signe"],["$-2x - 3$","demi"],["$2x + 6$","signe"]],"$-2 \\times (-3) = +6$."),
]
E['cc_fonctions']=[
 Q("Si $f(3) = 7$, alors :","7 est l’image de 3",[["3 est l’image de 7","inv"],["7 est un antécédent de 3","inv"],["$f$ vaut 3 en 7","inv"]],"$f(\\text{antécédent}) = \\text{image}$."),
 V("Une fonction linéaire est représentée par une droite qui passe par l’origine.",True,"$f(x) = ax$ : $f(0) = 0$."),
 V("La droite d’équation $y = -2x + 3$ monte de gauche à droite.",False,"Coefficient directeur −2 < 0 : la droite descend."),
 Q("Dans $f(x) = 4x - 1$, le coefficient directeur est :","4",[["−1","conf"],["3","calc"],["$4x$","conf"]],"C’est le nombre qui multiplie x."),
 Q("L’ordonnée à l’origine de $y = 2x + 5$ est :","5",[["2","conf"],["−5","signe"],["$-\\dfrac{5}{2}$","conf"]],"Pour x = 0, y = 5."),
 A("Associe chaque équation à la droite qu’elle représente.",[["$y = 3x$","droite qui passe par l’origine"],["$y = 4$","droite horizontale"],["$y = -x + 2$","droite qui descend"],["$y = 2x + 1$","droite qui monte et coupe l’axe en 1"]],"Le coefficient directeur donne la pente ; le terme constant donne l’ordonnée à l’origine."),
 Q("Le point A(2 ; 5) est sur la droite $y = 3x - 1$ car :","$3 \\times 2 - 1 = 5$",[["$3 \\times 5 - 1 = 14$","inv"],["$2 + 5 = 7$","addp"],["$3 - 1 = 2$","conf"]],"On remplace x par l’abscisse et on retrouve l’ordonnée."),
]
E['cc_evol']=[
 Q("Une hausse de 3 % correspond au coefficient multiplicateur :","1,03",[["1,3","pct0"],["0,03","compl"],["3","pct0"]],"$1 + \\dfrac{3}{100} = 1{,}03$."),
 V("Deux hausses successives de 10 % font une hausse de 20 %.",False,"$1{,}1 \\times 1{,}1 = 1{,}21$ : hausse de 21 %."),
 Q("Un indice de 85 (base 100) signifie :","une baisse de 15 % depuis la base",[["une hausse de 85 %","conf"],["une baisse de 85 %","conf"],["une hausse de 15 %","signe"]],"85 = 100 − 15."),
 Q("Le coefficient global de deux évolutions successives s’obtient en :","multipliant les coefficients",[["additionnant les taux","addp"],["additionnant les coefficients","addp"],["faisant la moyenne des taux","conf"]],"$CM_{global} = CM_1 \\times CM_2$."),
 X("Un prix passe de 50 € à 60 €. Taux d’évolution :",["Écart : $60 - 50 = 10$ €","Taux $= 10 \\div 60$","$\\approx 16{,}7$ %"],1,"On divise par la valeur de DÉPART : $10 \\div 50 = 0{,}2$, soit +20 %."),
 A("Associe chaque coefficient multiplicateur à l’évolution.",[["× 1,15","+15 %"],["× 0,85","−15 %"],["× 1,5","+50 %"],["× 0,5","−50 %"],["× 2","+100 %"],["× 1,05","+5 %"]],"CM > 1 : hausse ; CM < 1 : baisse."),
 Q("Pour revenir au prix initial après une baisse de 20 %, il faut une hausse de :","25 %",[["20 %","conf"],["80 %","compl"],["120 %","conf"]],"$\\dfrac{1}{0{,}8} = 1{,}25$."),
]
E['cc_proba1']=[
 Q("Une probabilité est toujours comprise entre :","0 et 1",[["0 et 100","pct0"],["−1 et 1","signe"],["1 et 10","conf"]],"0 : impossible ; 1 : certain."),
 V("Un événement impossible a une probabilité égale à 0.",True,"Il ne se réalise jamais."),
 Q("On lance un dé équilibré à 6 faces. Probabilité d’obtenir un nombre pair ?","$\\dfrac{1}{2}$",[["$\\dfrac{1}{6}$","conf"],["$\\dfrac{2}{6}$","calc"],["$\\dfrac{3}{5}$","formule"]],"3 issues favorables (2, 4, 6) sur 6."),
 Q("$P(A) = 0{,}3$. Alors $P(\\bar{A}) = ?$","0,7",[["0,3","conf"],["−0,3","signe"],["1,3","signe"]],"$P(\\bar{A}) = 1 - P(A)$."),
 A("Associe chaque mot à sa signification.",[["événement certain","probabilité 1"],["événement impossible","probabilité 0"],["événements contraires","probabilités de somme 1"],["équiprobabilité","issues de même probabilité"]],"Vocabulaire des probabilités."),
 Q("On tire une carte dans un jeu de 32 cartes. Probabilité de tirer un as ?","$\\dfrac{1}{8}$",[["$\\dfrac{1}{32}$","conf"],["$\\dfrac{1}{4}$","conf"],["$\\dfrac{4}{28}$","formule"]],"4 as sur 32 cartes : $\\dfrac{4}{32} = \\dfrac{1}{8}$."),
 V("En lançant une pièce 10 fois, on obtient forcément 5 fois « pile ».",False,"La probabilité 1/2 décrit ce qui se passe « en moyenne » sur un très grand nombre de lancers."),
]
E['cc_fn1']=[
 Q("La fonction carré est :","décroissante puis croissante",[["toujours croissante","conf"],["toujours décroissante","conf"],["croissante puis décroissante","signe"]],"Décroissante sur ]−∞ ; 0], croissante sur [0 ; +∞[."),
 V("$(-3)^2 = -9$",False,"$(-3)^2 = 9$ : un carré est positif."),
 Q("La fonction inverse $f(x) = \\dfrac{1}{x}$ n’est pas définie en :","0",[["1","conf"],["−1","conf"],["elle est définie partout","conf"]],"On ne divise jamais par 0."),
 A("Associe chaque fonction à sa courbe.",[["$x^2$","parabole"],["$\\dfrac{1}{x}$","hyperbole"],["$2x + 1$","droite"],["$\\sqrt{x}$","demi-parabole couchée"]],"Courbes des fonctions de référence."),
 Q("L’image de 9 par la fonction racine carrée est :","3",[["81","conf"],["4,5","demi"],["−3","signe"]],"$\\sqrt{9} = 3$."),
 Q("Le minimum de $f(x) = x^2$ est atteint en :","$x = 0$",[["$x = 1$","conf"],["$x = -1$","conf"],["il n’y en a pas","conf"]],"$x^2 \\geq 0$ et $0^2 = 0$."),
 V("La fonction racine carrée est définie pour $x \\geq 0$.",True,"On ne prend pas la racine carrée d’un nombre négatif."),
]
E['cc_vect']=[
 Q("Deux vecteurs sont égaux s’ils ont :","même direction, même sens et même norme",[["même norme seulement","demi"],["même origine","conf"],["même direction seulement","demi"]],"Les trois conditions sont nécessaires."),
 V("$\\overrightarrow{AB} = \\overrightarrow{BA}$",False,"Ils sont opposés : $\\overrightarrow{BA} = -\\overrightarrow{AB}$."),
 Q("$\\vec{u}(3\\,;\\,-2)$. Coordonnées de $2\\vec{u}$ ?","$(6\\,;\\,-4)$",[["$(5\\,;\\,0)$","addp"],["$(6\\,;\\,-2)$","demi"],["$(3\\,;\\,-4)$","demi"]],"On multiplie chaque coordonnée par 2."),
 Q("$\\overrightarrow{AB} + \\overrightarrow{BC} = ?$","$\\overrightarrow{AC}$",[["$\\overrightarrow{CA}$","signe"],["$\\overrightarrow{BB}$","conf"],["$\\overrightarrow{AB}$","conf"]],"Relation de Chasles."),
 A("A(1 ; 2) et B(4 ; 6). Associe.",[["$\\overrightarrow{AB}$","$(3\\,;\\,4)$"],["$\\overrightarrow{BA}$","$(-3\\,;\\,-4)$"],["$2\\overrightarrow{AB}$","$(6\\,;\\,8)$"],["milieu de [AB]","$(2{,}5\\,;\\,4)$"]],"$\\overrightarrow{AB}(x_B - x_A\\,;\\,y_B - y_A)$."),
 Q("La norme de $\\vec{u}(3\\,;\\,4)$ vaut :","5",[["7","formule"],["25","demi"],["1","signe"]],"$\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$."),
]
E['cc_deriv']=[
 Q("La dérivée d’une constante est :","0",[["la constante","conf"],["1","conf"],["$x$","conf"]],"Une constante ne varie pas."),
 V("Si $f'(x) > 0$ sur un intervalle, $f$ est croissante sur cet intervalle.",True,"Le signe de la dérivée donne le sens de variation."),
 Q("Le nombre dérivé $f'(a)$ est :","le coefficient directeur de la tangente en $a$",[["l’image de $a$","conf"],["l’ordonnée à l’origine de la tangente","conf"],["la valeur maximale de $f$","conf"]],"C’est la pente de la tangente."),
 Q("$f'(2) = 0$ et $f'$ change de signe en 2 : en 2, $f$ admet…","un extremum",[["une valeur nulle","conf"],["une asymptote","conf"],["une racine","conf"]],"Maximum ou minimum local."),
 O("Remets dans l’ordre les étapes de l’étude d’une fonction.",["Calculer $f'(x)$","Étudier le signe de $f'(x)$","Dresser le tableau de variations","En déduire le maximum ou le minimum"],"Dérivée → signe → variations → extremum.","dans l’ordre"," → "),
 Q("$(5x^2)' = ?$","$10x$",[["$5x$","demi"],["$10x^2$","demi"],["$2x$","demi"]],"$5 \\times 2x = 10x$."),
]
E['cc_suites']=[
 Q("Une suite arithmétique de raison $r$ vérifie :","$u_{n+1} = u_n + r$",[["$u_{n+1} = u_n \\times r$","conf"],["$u_{n+1} = r^n$","conf"],["$u_n = u_0 \\times r$","conf"]],"On ajoute toujours r."),
 V("Une suite géométrique de raison 0,5 et de premier terme positif est décroissante.",True,"On multiplie par 0,5 : chaque terme est la moitié du précédent."),
 Q("Un capital placé à intérêts composés suit une suite :","géométrique",[["arithmétique","conf"],["constante","conf"],["ni l’une ni l’autre","conf"]],"On multiplie chaque année par (1 + t)."),
 Q("$u_0 = 2$ et $u_{n+1} = u_n + 3$. Que vaut $u_3$ ?","11",[["8","calc"],["54","conf"],["14","calc"]],"$u_1 = 5$, $u_2 = 8$, $u_3 = 11$."),
 A("Associe chaque suite à son terme général.",[["arithmétique, $u_0 = 5$, $r = 2$","$u_n = 5 + 2n$"],["géométrique, $u_0 = 5$, $q = 2$","$u_n = 5 \\times 2^n$"],["arithmétique, $u_0 = 2$, $r = 5$","$u_n = 2 + 5n$"],["géométrique, $u_0 = 2$, $q = 5$","$u_n = 2 \\times 5^n$"]],"Arithmétique : $u_0 + nr$ ; géométrique : $u_0 \\times q^n$."),
 Q("Un loyer augmente de 15 € chaque année. Les loyers successifs forment une suite :","arithmétique",[["géométrique","conf"],["constante","conf"],["décroissante","signe"]],"On ajoute 15 € à chaque fois."),
]
E['cc_proba2']=[
 Q("$P_A(B)$ se lit :","probabilité de B sachant A",[["probabilité de A sachant B","inv"],["probabilité de A et B","conf"],["probabilité de A ou B","conf"]],"On se place dans la situation où A est réalisé."),
 V("Si A et B sont indépendants, $P(A \\cap B) = P(A) \\times P(B)$.",True,"C’est la définition de l’indépendance."),
 Q("Dans un arbre, la somme des probabilités des branches issues d’un même nœud vaut :","1",[["0","conf"],["100","pct0"],["ça dépend","conf"]],"On répartit toute la probabilité."),
 Q("Formule des probabilités totales : $P(B) = ?$","$P(A \\cap B) + P(\\bar{A} \\cap B)$",[["$P(A) + P(B)$","addp"],["$P(A) \\times P(B)$","conf"],["$P_A(B) + P_{\\bar{A}}(B)$","conf"]],"On additionne les chemins qui mènent à B."),
 A("Associe chaque notation à sa lecture.",[["$P(A \\cap B)$","A et B"],["$P(A \\cup B)$","A ou B"],["$P(\\bar{A})$","contraire de A"],["$P_A(B)$","B sachant A"]],"Notations des probabilités."),
 X("$P(A) = 0{,}4$ et $P_A(B) = 0{,}5$. Calcul de $P(A \\cap B)$ :",["On suit la branche A puis la branche B.","On multiplie : $0{,}4 \\times 0{,}5$","$= 0{,}9$"],2,"$0{,}4 \\times 0{,}5 = 0{,}2$."),
]
E['cc_espace']=[
 Q("Un cube a :","6 faces, 12 arêtes, 8 sommets",[["6 faces, 8 arêtes, 12 sommets","inv"],["4 faces, 6 arêtes, 4 sommets","conf"],["8 faces, 12 arêtes, 6 sommets","inv"]],"À vérifier sur un dé !"),
 V("Le volume d’une pyramide est le tiers de celui du prisme de même base et de même hauteur.",True,"$V = \\dfrac{\\mathcal{B} \\times h}{3}$."),
 Q("On multiplie toutes les longueurs d’un solide par 2. Son volume est multiplié par :","8",[["2","conf"],["4","demi"],["6","formule"]],"$2^3 = 8$."),
 A("Associe chaque solide à la formule de son volume.",[["cube d’arête $a$","$a^3$"],["boule de rayon $r$","$\\dfrac{4}{3}\\pi r^3$"],["cylindre","$\\pi r^2 h$"],["cône","$\\dfrac{1}{3}\\pi r^2 h$"],["pavé droit","$L \\times \\ell \\times h$"]],"Formulaire à connaître."),
 Q("Le patron d’un cylindre est formé de :","2 disques et 1 rectangle",[["2 disques et 2 rectangles","conf"],["1 disque et 1 triangle","conf"],["3 rectangles","conf"]],"La surface latérale déroulée est un rectangle."),
 Q("1 m³ = ? L","1 000",[["100","unit"],["10","unit"],["1 000 000","unit"]],"1 m³ = 1 000 dm³ = 1 000 L."),
]
NEW=[
 {"id":"cc_fractions","niv":["3pm","cap","2nde"],"chap":"Calcul mental et automatismes","titre":"Fractions (cours)","d":1,"tags":["fraction","simplifier","cours"],"qs":[
  Q("Simplifier $\\dfrac{6}{8}$","$\\dfrac{3}{4}$",[["$\\dfrac{6}{4}$","demi"],["$\\dfrac{2}{3}$","calc"],["$\\dfrac{1}{2}$","calc"]],"On divise le numérateur et le dénominateur par 2."),
  V("$\\dfrac{2}{4} = \\dfrac{1}{2}$",True,"On divise le haut et le bas par 2."),
  Q("Pour additionner deux fractions, il faut d’abord :","les mettre au même dénominateur",[["additionner les dénominateurs","formule"],["multiplier les numérateurs","addp"],["les simplifier","conf"]],"$\\dfrac{1}{4} + \\dfrac{2}{4} = \\dfrac{3}{4}$."),
  A("Associe chaque fraction à sa forme simplifiée.",[["$\\dfrac{6}{8}$","$\\dfrac{3}{4}$"],["$\\dfrac{10}{15}$","$\\dfrac{2}{3}$"],["$\\dfrac{4}{20}$","$\\dfrac{1}{5}$"],["$\\dfrac{12}{8}$","$\\dfrac{3}{2}$"],["$\\dfrac{7}{14}$","$\\dfrac{1}{2}$"]],"On divise par un diviseur commun."),
  Q("Le tiers de 27 est :","9",[["24","addp"],["81","inv"],["3","conf"]],"$27 \\div 3 = 9$."),
  V("$\\dfrac{1}{3} + \\dfrac{1}{3} = \\dfrac{2}{6}$",False,"$\\dfrac{1}{3} + \\dfrac{1}{3} = \\dfrac{2}{3}$ : on garde le dénominateur."),
  Q("Une fraction est égale à 1 quand :","le numérateur est égal au dénominateur",[["le numérateur vaut 1","conf"],["le dénominateur vaut 1","conf"],["elle est simplifiée","conf"]],"$\\dfrac{5}{5} = 1$."),
  O("Range ces nombres du plus petit au plus grand.",["$\\dfrac{1}{4}$","$\\dfrac{1}{3}$","$\\dfrac{1}{2}$","$\\dfrac{3}{4}$"],"0,25 < 0,33 < 0,5 < 0,75.","du plus petit au plus grand"," < "),
  Q("$\\dfrac{3}{4}$ de 20 € = ?","15 €",[["5 €","demi"],["26,67 €","inv"],["17 €","addp"]],"$20 \\div 4 \\times 3 = 15$."),
 ]},
 {"id":"cc_trigo","niv":["2nde","1re"],"chap":"Géométrie et trigonométrie","titre":"Trigonométrie (cours)","d":2,"tags":["cosinus","sinus","tangente","cours"],"qs":[
  Q("$\\cos \\alpha = ?$","$\\dfrac{\\text{adjacent}}{\\text{hypoténuse}}$",[["$\\dfrac{\\text{opposé}}{\\text{hypoténuse}}$","conf"],["$\\dfrac{\\text{opposé}}{\\text{adjacent}}$","conf"],["$\\dfrac{\\text{hypoténuse}}{\\text{adjacent}}$","inv"]],"CAH : Cosinus = Adjacent / Hypoténuse."),
  V("Le cosinus d’un angle aigu est toujours compris entre 0 et 1.",True,"L’adjacent est plus petit que l’hypoténuse."),
  A("Associe chaque rapport à sa formule.",[["$\\cos\\alpha$","adjacent ÷ hypoténuse"],["$\\sin\\alpha$","opposé ÷ hypoténuse"],["$\\tan\\alpha$","opposé ÷ adjacent"]],"SOH CAH TOA."),
  Q("$\\cos 60^\\circ = ?$","0,5",[["0,866","conf"],["60","conf"],["1","conf"]],"Valeur remarquable : $\\cos 60^\\circ = \\sin 30^\\circ = 0{,}5$."),
  Q("La trigonométrie s’utilise dans :","un triangle rectangle",[["n’importe quel triangle","conf"],["un triangle isocèle","conf"],["un cercle seulement","conf"]],"Les rapports sont définis dans un triangle rectangle."),
  Q("Pour trouver un angle à partir de son cosinus, on utilise la touche :","$\\cos^{-1}$ (ou Arccos)",[["$\\cos$","inv"],["$x^{-1}$","conf"],["$\\sqrt{\\ }$","conf"]],"La calculatrice doit être en mode degrés."),
  V("$\\tan 45^\\circ = 1$",True,"Dans un triangle rectangle isocèle, l’opposé égale l’adjacent."),
  O("Remets dans l’ordre la recherche d’une longueur avec le cosinus.",["Repérer l’hypoténuse et le côté adjacent","Écrire $\\cos\\alpha = \\dfrac{\\text{adj.}}{\\text{hyp.}}$","Remplacer par les valeurs connues","Calculer la longueur cherchée"],"Toujours se placer par rapport à l’angle connu.","dans l’ordre"," → "),
 ]},
 {"id":"cc_algo","niv":["3pm","cap","2nde"],"chap":"Algorithmique et tableur","titre":"Algorithmique et tableur (cours)","d":1,"tags":["algorithmique","python","tableur","cours"],"qs":[
  A("Associe chaque instruction Python à son rôle.",[["print()","afficher"],["input()","demander une valeur"],["for","répéter un nombre de fois connu"],["if","tester une condition"],["while","répéter tant qu’une condition est vraie"]],"Les instructions de base de Python."),
  Q("En Python, range(5) donne les valeurs :","0, 1, 2, 3, 4",[["1, 2, 3, 4, 5","calc"],["0, 1, 2, 3, 4, 5","calc"],["5 seulement","conf"]],"range(n) commence à 0 et s’arrête AVANT n."),
  Q("Dans un tableur, une formule commence par :","=",[["+","conf"],["#","conf"],["f(x)","conf"]],"Exemple : =2*A1+3."),
  V("En Python, x = x + 1 augmente la valeur de x de 1.",True,"On calcule x + 1 puis on range le résultat dans x."),
  Q("Le symbole == en Python sert à :","tester une égalité",[["donner une valeur à une variable","conf"],["additionner","conf"],["afficher","conf"]],"= affecte une valeur ; == compare deux valeurs."),
  Q("Une variable, c’est :","une case mémoire nommée contenant une valeur",[["un nombre qui ne change jamais","conf"],["une ligne du programme","conf"],["une erreur de programmation","conf"]],"Sa valeur peut changer pendant le programme."),
  Q("Dans un tableur, la formule =SOMME(A1:A4) calcule :","A1 + A2 + A3 + A4",[["A1 + A4","demi"],["A1 × A4","addp"],["la moyenne de A1 à A4","conf"]],"A1:A4 désigne les cellules de A1 à A4."),
 ]},
]
for k,v in E.items():
    by[k]['qs']+=v
for n in NEW:
    if n['id'] in by: by[n['id']]['qs']=n['qs']
    else: d['items'].append(n)
d['version']=3
io.open(P,'w',encoding='utf-8').write(json.dumps(d,ensure_ascii=False,indent=1))
print(sum(len(i['qs']) for i in d['items']),'questions de cours,',len(d['items']),'notions')
