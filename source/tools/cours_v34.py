# -*- coding: utf-8 -*-
# v3.4 : enrichit les questions de cours (src/cours.json), retire les doublons,
# ajoute des notions de cours pour les nouveaux chapitres.
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
E['cc_pythagore']=[
 Q("Dans un triangle MNP rectangle en N, l’hypoténuse est :","[MP]",["[MN]","[NP]","le côté le plus court"],"L’hypoténuse est en face de l’angle droit, donc en face de N : [MP]."),
 V("Si $AB^2 + AC^2 \\neq BC^2$ (avec [BC] le plus grand côté), le triangle n’est pas rectangle.",True,"C’est la contraposée du théorème : sans égalité, pas d’angle droit."),
 Q("Pour vérifier qu’un angle est droit sur un chantier, on peut mesurer :","60 cm, 80 cm et 1 m",["50 cm, 50 cm et 1 m","1 m, 1 m et 1 m","30 cm, 50 cm et 60 cm"],"$60^2 + 80^2 = 3\\,600 + 6\\,400 = 10\\,000 = 100^2$ : c’est la règle du 3-4-5."),
 X("Triangle rectangle en A, BC = 13 cm, AB = 5 cm. Calcul de AC :",["$AC^2 = BC^2 - AB^2$","$AC^2 = 13^2 - 5^2 = 169 - 25 = 144$","$AC = 144 \\div 2 = 72$ cm"],2,"On prend la racine carrée : $AC = \\sqrt{144} = 12$ cm."),
 A("Associe chaque situation au calcul à faire.",[["on cherche l’hypoténuse","on additionne les carrés"],["on cherche un côté de l’angle droit","on soustrait les carrés"],["on veut savoir si c’est rectangle","on compare $c^2$ et $a^2 + b^2$"]],"Le plus grand côté est toujours seul de son côté de l’égalité."),
 Q("La diagonale d’un écran 16 cm × 12 cm mesure :","20 cm",["28 cm","14 cm","400 cm"],"$\\sqrt{16^2 + 12^2} = \\sqrt{400} = 20$ cm."),
]
E['cc_deriv']=[
 A("Associe chaque fonction à sa dérivée.",[["$x^3$","$3x^2$"],["$4x$","$4$"],["$x^2 + 1$","$2x$"],["$\\dfrac{1}{x}$","$-\\dfrac{1}{x^2}$"]],"$(x^n)' = nx^{n-1}$ ; la dérivée d’une constante est 0."),
 V("Si $f'(x) < 0$ sur un intervalle, $f$ est décroissante sur cet intervalle.",True,"Le signe de la dérivée donne le sens de variation."),
 Q("L’équation de la tangente en a est :","$y = f'(a)(x - a) + f(a)$",["$y = f(a)(x - a) + f'(a)$","$y = f'(a)x + a$","$y = f'(x)(x - a)$"],"Coefficient directeur f’(a), et la tangente passe par le point (a ; f(a))."),
 Q("Un maximum de $f$ en $a$ se repère dans le tableau de variations par :","↗ puis ↘",["↘ puis ↗","↗ puis ↗","une valeur nulle de f"],"La fonction monte, atteint son maximum, puis redescend : f’ passe de + à −."),
 X("Dérivée de $f(x) = 2x^2 - 3x + 7$ :",["$(2x^2)' = 4x$","$(-3x)' = -3$","$(7)' = 7$","$f'(x) = 4x + 4$"],2,"La dérivée d’une constante est 0 : $f'(x) = 4x - 3$."),
 V("$(x^2 + x)' = 2x + 1$",True,"On dérive terme à terme : $(x^2)' = 2x$ et $(x)' = 1$."),
]
E['cc_trigo']=[
 Q("$\\sin \\alpha = ?$","$\\dfrac{\\text{côté opposé}}{\\text{hypoténuse}}$",["$\\dfrac{\\text{côté adjacent}}{\\text{hypoténuse}}$","$\\dfrac{\\text{côté opposé}}{\\text{côté adjacent}}$","$\\dfrac{\\text{hypoténuse}}{\\text{côté opposé}}$"],"SOH : Sinus = Opposé / Hypoténuse."),
 Q("$\\tan \\alpha = ?$","$\\dfrac{\\text{côté opposé}}{\\text{côté adjacent}}$",["$\\dfrac{\\text{côté adjacent}}{\\text{côté opposé}}$","$\\dfrac{\\text{côté opposé}}{\\text{hypoténuse}}$","$\\dfrac{\\text{hypoténuse}}{\\text{côté adjacent}}$"],"TOA : Tangente = Opposé / Adjacent."),
 V("Le sinus d’un angle aigu peut valoir 1,5.",False,"Dans un triangle rectangle, le côté opposé est plus court que l’hypoténuse : le sinus est entre 0 et 1."),
 Q("La calculatrice doit être réglée en :","degrés",["radians","grades","pourcentages"],"En triangle rectangle, les angles sont en degrés : vérifier le mode « Deg »."),
 X("On cherche l’adjacent : hypoténuse 10 cm, angle 60°.",["$\\cos 60^\\circ = \\dfrac{\\text{adj.}}{10}$","$\\text{adj.} = \\dfrac{10}{\\cos 60^\\circ}$","$\\text{adj.} = 20$ cm"],1,"On multiplie : $\\text{adj.} = 10 \\times \\cos 60^\\circ = 5$ cm."),
 V("Dans un triangle rectangle, les deux angles aigus ont pour somme 90°.",True,"180° − 90° = 90° pour les deux autres angles."),
 Q("SOH CAH TOA sert à retenir :","les trois rapports trigonométriques",["les formules d’aire","le théorème de Pythagore","les unités d’angle"],"Sinus = Opposé/Hypoténuse, Cosinus = Adjacent/Hypoténuse, Tangente = Opposé/Adjacent."),
]
E['cc_prop']=[
 V("Dans une situation de proportionnalité, 0 donne toujours 0.",True,"Le graphique passe par l’origine : y = ax avec x = 0 donne y = 0."),
 Q("Le prix de 3 croissants est 3,60 €. Le « passage à l’unité » donne :","1,20 € le croissant",["3,60 € le croissant","10,80 € le croissant","0,83 € le croissant"],"$3{,}60 \\div 3 = 1{,}20$ €."),
 Q("Un graphique de proportionnalité est :","une droite passant par l’origine",["une droite quelconque","une courbe","une droite horizontale"],"Proportionnalité ⇔ y = ax : une droite qui passe par (0 ; 0)."),
 A("Associe chaque méthode à son principe.",[["coefficient","on multiplie toujours par le même nombre"],["passage à l’unité","on cherche la valeur pour 1"],["produit en croix","$a \\times d = b \\times c$"],["linéarité","on ajoute ou multiplie les colonnes"]],"Toutes donnent le même résultat : on choisit la plus simple."),
 X("4 kg coûtent 10 €. Prix de 6 kg ?",["Pour 1 kg : $10 \\div 4 = 2{,}5$ €","Pour 6 kg : $2{,}5 + 6 = 8{,}5$ €","Réponse : 8,50 €"],1,"On multiplie : $2{,}5 \\times 6 = 15$ €."),
 V("La vitesse moyenne se calcule avec un rapport de proportionnalité : $v = \\dfrac{d}{t}$.",True,"À vitesse constante, la distance est proportionnelle à la durée."),
]
E['cc_algo']=[
 Q("En Python, que fait print(3 * 4) ?","affiche 12",["affiche 3 * 4","affiche 34","affiche 7"],"print affiche le résultat du calcul."),
 Q("Dans un tableur, la cellule C2 est :","colonne C, ligne 2",["ligne C, colonne 2","la 2ᵉ feuille","la colonne 2"],"Lettre = colonne, nombre = ligne."),
 V("Une boucle for permet de répéter des instructions un nombre de fois connu.",True,"for i in range(10): répète 10 fois."),
 Q("Une instruction « if … else » sert à :","faire un test",["répéter des instructions","afficher un texte","créer un tableau"],"Si la condition est vraie, on exécute le bloc if, sinon le bloc else."),
 Q("Dans un tableur, recopier vers le bas =A1*2 en B1 donne en B2 :","=A2*2",["=A1*2","=B1*2","=A2*3"],"Les références relatives s’adaptent à la ligne."),
 O("Remets dans l’ordre ce programme qui calcule un prix TTC.",["ht = 50","ttc = ht * 1.2","print(ttc)"],"On définit la variable, on calcule, puis on affiche.","dans l’ordre d’exécution"," → "),
 Q("Que vaut x à la fin ? x = 5 puis x = x * 2 puis x = x - 3","7",["10","5","2"],"5 × 2 = 10, puis 10 − 3 = 7."),
 V("En Python, le symbole = compare deux valeurs.",False,"= affecte une valeur ; == compare deux valeurs."),
]
E['cc_fractions']=[
 Q("$\\dfrac{2}{3} + \\dfrac{1}{3} = ?$","$1$",[["$\\dfrac{3}{6}$","addp"],["$\\dfrac{2}{9}$","conf"],["$\\dfrac{3}{3} + 1$","calc"]],"Même dénominateur : on additionne les numérateurs, $\\dfrac{3}{3} = 1$."),
 V("$\\dfrac{3}{4} = 0{,}75$",True,"$3 \\div 4 = 0{,}75$."),
 Q("Pour additionner $\\dfrac{1}{2}$ et $\\dfrac{1}{4}$, on écrit d’abord :","$\\dfrac{1}{2} = \\dfrac{2}{4}$",["$\\dfrac{1}{2} = \\dfrac{1}{4}$","$\\dfrac{1}{2} + \\dfrac{1}{4} = \\dfrac{2}{6}$","$\\dfrac{1}{4} = \\dfrac{2}{4}$"],"On met au même dénominateur : $\\dfrac{2}{4} + \\dfrac{1}{4} = \\dfrac{3}{4}$."),
 O("Range du plus petit au plus grand.",["$\\dfrac{1}{4}$","$\\dfrac{1}{3}$","$\\dfrac{1}{2}$","$\\dfrac{2}{3}$","$\\dfrac{3}{4}$"],"0,25 < 0,33 < 0,5 < 0,67 < 0,75.","du plus petit au plus grand"),
 V("$\\dfrac{2}{5}$ est plus grand que $\\dfrac{2}{3}$.",False,"Même numérateur : plus le dénominateur est grand, plus les parts sont petites."),
 Q("Simplifier $\\dfrac{12}{18}$ :","$\\dfrac{2}{3}$",["$\\dfrac{6}{9}$","$\\dfrac{4}{6}$","$\\dfrac{3}{2}$"],"On divise par 6 (le plus grand diviseur commun). 6/9 et 4/6 sont égales mais pas irréductibles."),
]
E['cc_vect']=[
 Q("Deux vecteurs égaux ont :","même direction, même sens, même longueur",["seulement la même longueur","la même origine","des coordonnées opposées"],"Égaux : ils se superposent par translation."),
 V("Si $\\vec{v} = -2\\vec{u}$, alors $\\vec{u}$ et $\\vec{v}$ sont colinéaires.",True,"Ils ont la même direction (sens contraires)."),
 Q("$\\overrightarrow{AB} + \\overrightarrow{BC} = ?$","$\\overrightarrow{AC}$",["$\\overrightarrow{CA}$","$\\overrightarrow{BB}$","$\\overrightarrow{AB} \\times 2$"],"Relation de Chasles : on « enchaîne » les vecteurs."),
 Q("La norme du vecteur $\\vec{u}(x\\,;\\,y)$ est :","$\\sqrt{x^2 + y^2}$",["$x + y$","$x^2 + y^2$","$\\sqrt{x + y}$"],"C’est Pythagore dans le repère orthonormé."),
 A("Associe chaque notion à sa formule.",[["coordonnées de $\\overrightarrow{AB}$","$(x_B - x_A\\,;\\,y_B - y_A)$"],["milieu de [AB]","$\\left(\\dfrac{x_A + x_B}{2}\\,;\\,\\dfrac{y_A + y_B}{2}\\right)$"],["norme de $\\vec{u}(x\\,;\\,y)$","$\\sqrt{x^2 + y^2}$"]],"Pour un vecteur : arrivée − départ."),
 V("$\\overrightarrow{AB} = \\overrightarrow{BA}$",False,"Ils ont la même longueur mais des sens contraires : $\\overrightarrow{BA} = -\\overrightarrow{AB}$."),
]
E['cc_proba2']=[
 Q("Dans un arbre pondéré, la somme des probabilités issues d’un même nœud vaut :","1",["0","100","la probabilité du nœud"],"Les branches d’un nœud décrivent tous les cas possibles."),
 Q("$P_A(B)$ se lit :","probabilité de B sachant A",["probabilité de A sachant B","probabilité de A et B","probabilité de A ou B"],"L’événement en indice est celui qu’on sait réalisé."),
 V("Si A et B sont indépendants, $P_A(B) = P(B)$.",True,"Savoir que A est réalisé ne change pas la probabilité de B."),
 Q("La probabilité d’un chemin dans un arbre s’obtient en :","multipliant les probabilités des branches",["additionnant les branches","prenant la plus grande branche","divisant par le nombre de branches"],"Exemple : $P(A \\cap B) = P(A) \\times P_A(B)$."),
 A("Associe chaque écriture à sa signification.",[["$P(A \\cap B)$","A et B"],["$P(A \\cup B)$","A ou B"],["$P(\\bar{A})$","contraire de A"],["$P_A(B)$","B sachant A"]],"∩ : « et » ; ∪ : « ou » ; la barre : « non »."),
 V("L’espérance d’un jeu est toujours un des gains possibles.",False,"C’est une moyenne : elle peut tomber entre deux gains possibles."),
]
E['cc_evol']=[
 Q("Une hausse de t % correspond à une multiplication par :","$1 + \\dfrac{t}{100}$",["$\\dfrac{t}{100}$","$1 - \\dfrac{t}{100}$","$t + 100$"],"Exemple : +8 % → × 1,08."),
 V("Deux hausses successives de 10 % font une hausse de 20 %.",False,"$1{,}1 \\times 1{,}1 = 1{,}21$ : +21 %."),
 Q("Un indice 112 (base 100) signifie :","une hausse de 12 % depuis la base",["une hausse de 112 %","une baisse de 12 %","un prix de 112 €"],"Indice − 100 = évolution en % depuis l’année de base."),
 A("Associe chaque évolution à son coefficient multiplicateur.",[["+ 15 %","× 1,15"],["− 15 %","× 0,85"],["+ 150 %","× 2,5"],["− 1,5 %","× 0,985"]],"Hausse : 1 + t/100 ; baisse : 1 − t/100."),
 Q("Pour retrouver un prix avant une hausse de 25 %, on :","divise par 1,25",["multiplie par 0,75","retire 25 %","divise par 0,75"],"Prix final = prix initial × 1,25, donc prix initial = prix final ÷ 1,25."),
]
E['cc_fn1']=[
 Q("La courbe d’une fonction du second degré s’appelle :","une parabole",["une droite","une hyperbole","un cercle"],"$f(x) = ax^2 + bx + c$ : une parabole."),
 V("Si $a > 0$, la parabole de $f(x) = ax^2 + bx + c$ est tournée vers le haut.",True,"Elle a alors un minimum (son sommet)."),
 Q("La courbe de la fonction inverse $x \\mapsto \\dfrac{1}{x}$ s’appelle :","une hyperbole",["une parabole","une droite","une sinusoïde"],"Elle a deux branches, de part et d’autre de 0."),
 Q("Résoudre graphiquement $f(x) = 2$, c’est lire :","les abscisses des points de la courbe d’ordonnée 2",["l’image de 2","l’ordonnée du point d’abscisse 2","le sommet de la courbe"],"On trace la droite y = 2 et on lit les x des points d’intersection."),
 A("Associe chaque fonction à l’allure de sa courbe.",[["$f(x) = 2x + 1$","droite"],["$f(x) = x^2$","parabole"],["$f(x) = \\dfrac{1}{x}$","hyperbole"],["$f(x) = \\sqrt{x}$","demi-parabole couchée"]],"Chaque famille de fonctions a sa courbe caractéristique."),
]
E['cc_suites']=[
 Q("Une suite arithmétique de raison r vérifie :","$u_{n+1} = u_n + r$",["$u_{n+1} = u_n \\times r$","$u_{n+1} = r^n$","$u_n = u_0 \\times r^n$"],"On ajoute toujours r."),
 Q("Une suite géométrique de raison q vérifie :","$u_{n+1} = u_n \\times q$",["$u_{n+1} = u_n + q$","$u_n = u_0 + nq$","$u_{n+1} = q^2$"],"On multiplie toujours par q."),
 V("Une suite arithmétique de raison −3 est décroissante.",True,"On retire 3 à chaque étape."),
 A("Associe chaque suite à son terme général.",[["arithmétique, $u_0$, raison r","$u_n = u_0 + nr$"],["géométrique, $u_0$, raison q","$u_n = u_0 \\times q^n$"],["arithmétique, $u_1$, raison r","$u_n = u_1 + (n-1)r$"]],"Attention au premier indice (0 ou 1)."),
 Q("Un placement à intérêts composés suit une suite :","géométrique",["arithmétique","constante","ni l’une ni l’autre"],"Chaque année le capital est multiplié par $1 + t$."),
]
E['cc_espace']=[
 Q("Le volume d’un cône de rayon r et de hauteur h est :","$\\dfrac{\\pi r^2 h}{3}$",["$\\pi r^2 h$","$\\dfrac{4}{3}\\pi r^3$","$2\\pi r h$"],"Comme une pyramide : le tiers du cylindre."),
 V("Si on double toutes les longueurs d’un solide, son volume double.",False,"Il est multiplié par $2^3 = 8$."),
 Q("La section d’une sphère par un plan est :","un cercle",["un carré","une ellipse","un triangle"],"Plus le plan est loin du centre, plus le cercle est petit."),
 A("Associe chaque agrandissement à son effet.",[["longueurs × k","× k"],["aires × ?","× $k^2$"],["volumes × ?","× $k^3$"]],"Une aire a deux dimensions, un volume en a trois."),
]
E['cc_proba1']=[
 V("Deux événements incompatibles ne peuvent pas se produire en même temps.",True,"Leur intersection est vide : $P(A \\cap B) = 0$."),
 Q("$P(A \\cup B) = ?$","$P(A) + P(B) - P(A \\cap B)$",["$P(A) + P(B)$","$P(A) \\times P(B)$","$1 - P(A \\cap B)$"],"On retire l’intersection, comptée deux fois."),
 Q("$P(\\bar{A}) = ?$","$1 - P(A)$",["$P(A) - 1$","$\\dfrac{1}{P(A)}$","$-P(A)$"],"A et son contraire se partagent toutes les issues."),
 Q("Le coefficient de détermination $R^2$ proche de 1 indique :","un bon ajustement affine",["aucun lien","une erreur de calcul","une probabilité forte"],"Les points sont proches de la droite d’ajustement."),
]
E['cc_stats']=[
 Q("Le premier quartile Q1 est :","au moins 25 % des valeurs sont ≤ Q1",["Q1 est la moyenne du premier quart","Q1 est la 25ᵉ valeur","Q1 est la moitié de la médiane"],"On le trouve au rang $\\dfrac{n}{4}$ arrondi à l’entier supérieur."),
 V("L’écart interquartile mesure la dispersion de la moitié centrale des valeurs.",True,"$Q_3 - Q_1$ : il n’est pas influencé par les valeurs extrêmes."),
 V("La moyenne est toujours une des valeurs de la série.",False,"La moyenne de 8 et 13 est 10,5, qui n’est pas dans la série."),
]
# nouvelles notions de cours
N=[]
N.append({"id":"cc_transfo","niv":["3pm"],"chap":"Géométrie et trigonométrie","titre":"Questions de cours : transformations","tags":["cours","symétrie","translation","rotation","homothétie"],"d":1,"qs":[
 Q("Une symétrie axiale est définie par :","une droite (l’axe)",["un point","un vecteur","un angle"],"Chaque point est envoyé de l’autre côté de l’axe, à la même distance."),
 Q("Une translation est définie par :","une direction, un sens et une longueur",["un point","une droite","un angle"],"Elle fait glisser la figure."),
 Q("Une rotation est définie par :","un centre et un angle",["un axe","une longueur","deux droites"],"Exemple : rotation de centre O d’angle 90°."),
 V("Une symétrie centrale est une rotation de 180°.",True,"Le symétrique de A par rapport à O est l’image de A par la rotation de centre O d’angle 180°."),
 V("Une homothétie de rapport 3 multiplie les longueurs par 3.",True,"Et les aires par 9."),
 A("Associe chaque transformation à ce qui la définit.",[["symétrie axiale","un axe"],["symétrie centrale","un centre"],["translation","un vecteur"],["rotation","un centre et un angle"]],"Ce sont les « paramètres » de chaque transformation."),
 V("Une translation peut changer la forme d’une figure.",False,"Elle conserve les longueurs, les angles et les aires."),
 Q("L’image d’un segment par une symétrie est :","un segment de même longueur",["un segment deux fois plus long","un cercle","une droite"],"Les symétries conservent les longueurs."),
]})
N.append({"id":"cc_finance","niv":["cap","2nde","1re"],"chap":"Calculs commerciaux et financiers","titre":"Questions de cours : calculs commerciaux","tags":["cours","marge","TVA","intérêts simples","coût"],"d":1,"qs":[
 Q("Prix de vente HT − prix d’achat HT = ?","la marge brute",["la TVA","le prix TTC","le coût fixe"],"C’est ce que gagne le commerçant avant ses frais."),
 Q("Prix TTC = ?","prix HT × (1 + taux de TVA)",["prix HT − TVA","prix HT ÷ 1,2","prix d’achat + marge"],"TTC = toutes taxes comprises : on AJOUTE la TVA."),
 Q("Les intérêts simples se calculent avec :","$I = C \\times t \\times n$",["$I = C \\times (1 + t)^n$","$I = C + t + n$","$I = \\dfrac{C}{t \\times n}$"],"C : capital ; t : taux annuel ; n : durée en années."),
 V("Avec des intérêts simples, les intérêts sont les mêmes chaque année.",True,"Ils sont toujours calculés sur le capital de départ (contrairement aux intérêts composés)."),
 Q("Le coût moyen unitaire est :","le coût total divisé par la quantité",["le coût de la dernière unité","le coût fixe","la recette divisée par la quantité"],"$C_M(q) = \\dfrac{C(q)}{q}$."),
 Q("Le coût marginal est :","le coût d’une unité supplémentaire",["le coût moyen","le coût fixe","la marge"],"$C(q + 1) - C(q)$."),
 A("Associe chaque terme à sa définition.",[["recette","prix de vente × quantité vendue"],["résultat","recette − coût total"],["coût fixe","indépendant de la quantité"],["coût variable","augmente avec la quantité"]],"Résultat positif : bénéfice ; négatif : perte."),
 V("Un coefficient multiplicateur de 1,8 sur le prix d’achat correspond à une marge de 80 % du prix d’achat.",True,"$PV = 1{,}8 \\times PA$ donc $PV - PA = 0{,}8 \\times PA$."),
]})
N.append({"id":"cc_poly2","niv":["1re"],"chap":"Fonctions numériques","titre":"Questions de cours : second degré","tags":["cours","second degré","discriminant","parabole","racines"],"d":2,"qs":[
 Q("Le discriminant de $ax^2 + bx + c$ est :","$\\Delta = b^2 - 4ac$",["$\\Delta = b^2 + 4ac$","$\\Delta = b - 4ac$","$\\Delta = 4ac - b^2$"],"Son signe donne le nombre de racines."),
 Q("Si $\\Delta < 0$, l’équation $ax^2 + bx + c = 0$ a :","aucune solution réelle",["une solution","deux solutions","une infinité de solutions"],"La parabole ne coupe pas l’axe des abscisses."),
 Q("L’abscisse du sommet de la parabole est :","$-\\dfrac{b}{2a}$",["$\\dfrac{b}{2a}$","$-\\dfrac{b}{a}$","$\\dfrac{\\Delta}{4a}$"],"C’est aussi l’axe de symétrie : $x = -\\dfrac{b}{2a}$."),
 V("Si $f(x) = a(x - x_1)(x - x_2)$, alors $x_1$ et $x_2$ sont les racines de $f$.",True,"Un produit est nul si l’un des facteurs est nul."),
 V("$ax^2 + bx + c$ est du signe de $a$ entre les racines.",False,"Il est du signe de a À L’EXTÉRIEUR des racines, du signe contraire entre elles."),
 A("Associe chaque discriminant au nombre de solutions.",[["$\\Delta > 0$","2 solutions"],["$\\Delta = 0$","1 solution"],["$\\Delta < 0$","aucune solution"]],"Δ > 0 : la parabole coupe l’axe deux fois."),
]})
N.append({"id":"cc_explog","niv":["term"],"chap":"Fonctions numériques","titre":"Questions de cours : exponentielles et logarithme","tags":["cours","exponentielle","logarithme","log"],"d":2,"qs":[
 Q("$\\log(10^n) = ?$","$n$",["$10n$","$10^n$","$\\dfrac{n}{10}$"],"Le logarithme décimal est l’exposant de 10."),
 Q("$\\log 1 = ?$","$0$",["$1$","$10$","n’existe pas"],"$10^0 = 1$."),
 V("La fonction $x \\mapsto 1{,}5^x$ est croissante.",True,"Base supérieure à 1 : croissance exponentielle."),
 V("$\\log(a + b) = \\log a + \\log b$",False,"C’est le PRODUIT qui devient une somme : $\\log(ab) = \\log a + \\log b$."),
 Q("Pour résoudre $q^x = k$ (avec q > 0, k > 0), on calcule :","$x = \\dfrac{\\log k}{\\log q}$",["$x = \\dfrac{k}{q}$","$x = \\log(k - q)$","$x = k^q$"],"On applique log : $x \\log q = \\log k$."),
 A("Associe chaque situation au modèle adapté.",[["+ 4 % par an","exponentiel"],["+ 50 € par mois","affine"],["prix proportionnel à la masse","linéaire"]],"Pourcentage constant : on multiplie (exponentiel). Quantité constante : on ajoute (affine)."),
]})
N.append({"id":"cc_logique","niv":["2nde","1re","term"],"chap":"Vocabulaire ensembliste et logique","titre":"Questions de cours : ensembles et logique","tags":["cours","intervalle","ensemble","logique","contre-exemple"],"d":1,"qs":[
 Q("$x \\in [2\\,;\\,5[$ signifie :","$2 \\leq x < 5$",["$2 < x \\leq 5$","$2 \\leq x \\leq 5$","$2 < x < 5$"],"Crochet fermé en 2 (compris), ouvert en 5 (exclu)."),
 Q("Pour prouver qu’une affirmation générale est fausse, il suffit :","d’un contre-exemple",["de trois exemples","d’un exemple qui marche","d’un calcul approché"],"Un seul cas où elle est fausse suffit."),
 Q("$A \\cap B$ désigne :","les éléments communs à A et à B",["tous les éléments de A et de B","les éléments de A qui ne sont pas dans B","le contraire de A"],"∩ se lit « inter » : « et »."),
 V("$\\mathbb{N} \\subset \\mathbb{Z}$ : tout entier naturel est un entier relatif.",True,"$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$."),
 V("L’intervalle $]-\\infty\\,;\\,3]$ contient 3.",True,"Le crochet est tourné vers 3 : 3 est compris."),
 A("Associe chaque symbole à sa lecture.",[["$\\in$","appartient à"],["$\\cup$","union (ou)"],["$\\cap$","intersection (et)"],["$\\subset$","est inclus dans"]],"Vocabulaire ensembliste du programme de la voie professionnelle."),
]})
for k,v in E.items():
    it=by[k];seen={q['q'] for q in it['qs']}
    for q in v:
        if q['q'] not in seen: it['qs'].append(q);seen.add(q['q'])
# retire les doublons exacts déjà présents
for it in d['items']:
    out=[];seen=set()
    for q in it['qs']:
        key=json.dumps(q,ensure_ascii=False,sort_keys=True)
        if key in seen: continue
        seen.add(key);out.append(q)
    it['qs']=out
for n in N:
    if n['id'] not in by: d['items'].append(n)
io.open(P,'w',encoding='utf-8').write(json.dumps(d,ensure_ascii=False,indent=0))
print('notions',len(d['items']),'questions',sum(len(i['qs']) for i in d['items']))
