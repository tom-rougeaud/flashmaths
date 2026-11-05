# v4.0 : nouveaux formats ajoutés aux questions de cours (cours.json)
# it/ot = intrus · tr = texte à trous (ok, wr) · qui = qui suis-je (ok, wr) · mu/no = plusieurs bonnes réponses
# Rejouable : les questions déjà présentes (même énoncé) ne sont pas dupliquées.
import json,io,os,sys
HERE=os.path.dirname(os.path.abspath(__file__))
P=os.path.join(HERE,'../src/cours.json')
A={
'cc_signes':[
 {"q":"Trouve l’intrus : trois de ces résultats sont positifs, lequel ne l’est pas ?","it":"$(-2) \\times (-3) \\times (-1)$","ot":["$(-2) \\times (-3)$","$(-4)^2$","$(-10) \\div (-5)$"],"x":"Trois facteurs négatifs : le produit est négatif ($-6$). Les trois autres valent $6$, $16$ et $2$."},
 {"q":"Complète : le produit de deux nombres de signes contraires est toujours ____.","tr":1,"ok":"négatif","wr":["positif","nul","égal à 1"],"x":"Signes contraires : le produit est négatif, par exemple $3 \\times (-4) = -12$."},
 {"q":"Coche toutes les écritures égales à $-12$.","mu":["$3 \\times (-4)$","$(-24) \\div 2$","$-3 \\times 4$"],"no":["$(-3) \\times (-4)$","$(-6) - (-6)$"],"x":"$(-3) \\times (-4) = 12$ (positif) et $(-6) - (-6) = 0$."},
 {"q":"Je suis un nombre négatif. Si on me multiplie par moi-même, on obtient $49$. Qui suis-je ?","qui":1,"ok":"$-7$","wr":["$7$","$-49$","$-14$"],"x":"$(-7) \\times (-7) = 49$ et $-7$ est négatif."}],
'cc_operations':[
 {"q":"Trouve l’intrus : trois de ces opérations donnent le même résultat.","it":"$20 \\div 4$","ot":["$20 \\times 0{,}25 \\times 4$","$5 \\times 4$","$10 \\times 2$"],"x":"$20 \\div 4 = 5$ ; les trois autres valent $20$."},
 {"q":"Complète : le résultat d’une multiplication s’appelle le ____.","tr":1,"ok":"produit","wr":["quotient","somme","différence"],"x":"Multiplication → produit ; division → quotient ; addition → somme ; soustraction → différence."},
 {"q":"Coche toutes les opérations dont le résultat est plus petit que $8$.","mu":["$8 \\times 0{,}5$","$8 \\div 2$","$8 - 0{,}1$"],"no":["$8 \\div 0{,}5$","$8 \\times 1{,}5$"],"x":"Multiplier par un nombre plus petit que 1 diminue ; diviser par un nombre plus petit que 1 augmente : $8 \\div 0{,}5 = 16$."},
 {"q":"Je suis le résultat d’une division. Je m’appelle…","qui":1,"ok":"le quotient","wr":["le produit","le dividende","le reste"],"x":"Dans $a \\div b$, le résultat est le quotient ; $a$ est le dividende et $b$ le diviseur."}],
'cc_puissances':[
 {"q":"Trouve l’intrus : trois de ces écritures valent $16$.","it":"$2 \\times 8^2$","ot":["$2^4$","$4^2$","$\\sqrt{256}$"],"x":"$2 \\times 8^2 = 2 \\times 64 = 128$ ; les autres valent $16$."},
 {"q":"Complète : $10^{-3} =$ ____.","tr":1,"ok":"$0{,}001$","wr":["$-1\\,000$","$0{,}0001$","$-0{,}001$"],"x":"$10^{-3} = \\dfrac{1}{10^3} = 0{,}001$ : un exposant négatif ne donne pas un nombre négatif."},
 {"q":"Coche toutes les écritures égales à $1\\,000$.","mu":["$10^3$","$10 \\times 10 \\times 10$","$10^5 \\div 10^2$"],"no":["$10 \\times 3$","$3^{10}$"],"x":"$10^3 = 1\\,000$ et $10^5 \\div 10^2 = 10^3$. Attention : $10 \\times 3 = 30$."},
 {"q":"Je suis un nombre entier. Mon carré vaut $81$ et je suis positif. Qui suis-je ?","qui":1,"ok":"$9$","wr":["$-9$","$40{,}5$","$6\\,561$"],"x":"$9^2 = 81$ et $9$ est positif : $\\sqrt{81} = 9$."}],
'cc_prop':[
 {"q":"Trouve l’intrus : trois de ces tableaux sont des tableaux de proportionnalité.","it":"$2 \\to 5$ ; $4 \\to 9$","ot":["$2 \\to 5$ ; $4 \\to 10$","$3 \\to 6$ ; $5 \\to 10$","$1 \\to 2{,}5$ ; $6 \\to 15$"],"x":"$5 \\div 2 = 2{,}5$ mais $9 \\div 4 = 2{,}25$ : les quotients ne sont pas égaux."},
 {"q":"Complète : dans un tableau de proportionnalité, on passe d’une ligne à l’autre en multipliant par le ____.","tr":1,"ok":"coefficient de proportionnalité","wr":["pourcentage","quatrième nombre","produit en croix"],"x":"Le coefficient de proportionnalité est le nombre par lequel on multiplie la première ligne pour obtenir la seconde."},
 {"q":"Coche toutes les situations de proportionnalité.","mu":["Le prix payé et la masse de pommes achetées (prix au kg fixe)","Le périmètre d’un carré et la longueur de son côté","La distance parcourue et la durée, à vitesse constante"],"no":["L’âge d’un enfant et sa taille","L’aire d’un carré et la longueur de son côté"],"x":"Périmètre $= 4 \\times c$ est proportionnel à $c$, mais l’aire $c^2$ ne l’est pas."},
 {"q":"Je suis une droite qui passe par l’origine du repère. Je représente une situation de…","qui":1,"ok":"proportionnalité","wr":["non-proportionnalité","diminution","pourcentage"],"x":"Une situation de proportionnalité est représentée par des points alignés avec l’origine."}],
'cc_pct':[
 {"q":"Trouve l’intrus : trois de ces écritures sont égales.","it":"$0{,}5\\,\\%$","ot":["$50\\,\\%$","$\\dfrac{1}{2}$","$0{,}5$"],"x":"$0{,}5\\,\\% = 0{,}005$ ; les trois autres valent $0{,}5$."},
 {"q":"Complète : augmenter un prix de $20\\,\\%$, c’est le multiplier par ____.","tr":1,"ok":"$1{,}2$","wr":["$0{,}2$","$20$","$0{,}8$"],"x":"Coefficient multiplicateur d’une hausse de $t\\,\\%$ : $1 + \\dfrac{t}{100} = 1{,}2$."},
 {"q":"Coche toutes les façons de calculer $25\\,\\%$ de $80$.","mu":["$80 \\times 0{,}25$","$80 \\div 4$","$\\dfrac{25 \\times 80}{100}$"],"no":["$80 \\times 25$","$80 - 25$"],"x":"$25\\,\\% = \\dfrac{25}{100} = 0{,}25 = \\dfrac{1}{4}$ : on trouve $20$."},
 {"q":"Je suis le coefficient multiplicateur d’une baisse de $15\\,\\%$. Qui suis-je ?","qui":1,"ok":"$0{,}85$","wr":["$1{,}15$","$0{,}15$","$-0{,}15$"],"x":"Baisse de $t\\,\\%$ : coefficient $1 - \\dfrac{t}{100} = 0{,}85$."}],
'cc_unites':[
 {"q":"Trouve l’intrus : trois de ces longueurs sont égales.","it":"$0{,}25$ km","ot":["$2{,}5$ m","$250$ cm","$2\\,500$ mm"],"x":"$0{,}25$ km $= 250$ m ; les trois autres valent $2{,}5$ m."},
 {"q":"Complète : $1$ L $=$ ____.","tr":1,"ok":"$1$ dm³","wr":["$1$ m³","$1$ cm³","$10$ cm³"],"x":"Un litre est le volume d’un cube de $1$ dm de côté : $1$ L $= 1$ dm³ $= 1\\,000$ cm³."},
 {"q":"Coche toutes les unités d’aire.","mu":["m²","ha (hectare)","cm²"],"no":["m³","km"],"x":"Les unités d’aire sont « au carré » (m², cm²) ; l’hectare vaut $10\\,000$ m². Le m³ est une unité de volume."},
 {"q":"Je suis l’unité de volume qui vaut $1\\,000$ litres. Qui suis-je ?","qui":1,"ok":"le m³","wr":["le dm³","le hL","le cL"],"x":"$1$ m³ $= 1\\,000$ dm³ $= 1\\,000$ L."}],
'cc_formules':[
 {"q":"Trouve l’intrus : trois de ces formules donnent une aire.","it":"$\\pi \\times r^2 \\times h$","ot":["$\\pi \\times r^2$","$L \\times l$","$\\dfrac{b \\times h}{2}$"],"x":"$\\pi r^2 h$ est le volume d’un cylindre ; les autres sont des aires (disque, rectangle, triangle)."},
 {"q":"Complète : le périmètre d’un cercle de rayon $r$ est ____.","tr":1,"ok":"$2 \\times \\pi \\times r$","wr":["$\\pi \\times r^2$","$\\pi \\times r$","$4 \\times r$"],"x":"Périmètre du cercle : $2\\pi r$ (ou $\\pi \\times d$). $\\pi r^2$ est l’aire du disque."},
 {"q":"Coche toutes les formules de volume.","mu":["$c^3$","$L \\times l \\times h$","$\\dfrac{4}{3}\\pi r^3$"],"no":["$4 \\times c$","$2 \\times (L + l)$"],"x":"Cube, pavé et boule : volumes. $4c$ et $2(L+l)$ sont des périmètres."},
 {"q":"Je suis la formule de l’aire d’un triangle de base $b$ et de hauteur $h$. Qui suis-je ?","qui":1,"ok":"$\\dfrac{b \\times h}{2}$","wr":["$b \\times h$","$b + h$","$2 \\times b \\times h$"],"x":"Un triangle est la moitié du rectangle de côtés $b$ et $h$."}],
'cc_pythagore':[
 {"q":"Trouve l’intrus : trois de ces triangles sont rectangles (longueurs des côtés).","it":"$4$ ; $5$ ; $6$","ot":["$3$ ; $4$ ; $5$","$6$ ; $8$ ; $10$","$5$ ; $12$ ; $13$"],"x":"$4^2 + 5^2 = 41$ et $6^2 = 36$ : pas rectangle. Les autres vérifient $a^2 + b^2 = c^2$."},
 {"q":"Complète : dans un triangle rectangle, le côté opposé à l’angle droit s’appelle l’____.","tr":1,"ok":"hypoténuse","wr":["adjacent","opposé","médiane"],"x":"L’hypoténuse est le côté le plus long, en face de l’angle droit."},
 {"q":"Le triangle ABC est rectangle en A. Coche toutes les égalités justes.","mu":["$BC^2 = AB^2 + AC^2$","$AB^2 = BC^2 - AC^2$","$AC^2 = BC^2 - AB^2$"],"no":["$AB^2 = AC^2 + BC^2$","$BC = AB + AC$"],"x":"Rectangle en A : l’hypoténuse est $[BC]$, donc $BC^2 = AB^2 + AC^2$ et on peut isoler $AB^2$ ou $AC^2$."},
 {"q":"Je suis le plus long côté d’un triangle rectangle. Qui suis-je ?","qui":1,"ok":"l’hypoténuse","wr":["le côté adjacent","la hauteur","la médiane"],"x":"L’hypoténuse est toujours le plus long côté du triangle rectangle."}],
'cc_geo':[
 {"q":"Trouve l’intrus : trois de ces triangles peuvent exister (mesures des angles).","it":"$90°$ ; $60°$ ; $40°$","ot":["$90°$ ; $60°$ ; $30°$","$60°$ ; $60°$ ; $60°$","$100°$ ; $40°$ ; $40°$"],"x":"La somme des angles d’un triangle vaut $180°$ : $90 + 60 + 40 = 190°$."},
 {"q":"Complète : la somme des angles d’un triangle est égale à ____.","tr":1,"ok":"$180°$","wr":["$360°$","$90°$","$270°$"],"x":"Dans tout triangle : $\\hat{A} + \\hat{B} + \\hat{C} = 180°$."},
 {"q":"Coche toutes les propriétés d’un triangle équilatéral.","mu":["Ses trois côtés ont la même longueur","Ses trois angles mesurent $60°$","Il a trois axes de symétrie"],"no":["Il a un angle droit","Ses angles mesurent $90°$, $45°$ et $45°$"],"x":"Équilatéral : 3 côtés égaux, 3 angles de $60°$, 3 axes de symétrie."},
 {"q":"Je suis un triangle qui a deux côtés de même longueur. Qui suis-je ?","qui":1,"ok":"un triangle isocèle","wr":["un triangle rectangle","un triangle scalène","un triangle quelconque"],"x":"Isocèle : deux côtés égaux (et deux angles égaux à la base)."}],
'cc_stats':[
 {"q":"Trouve l’intrus : trois de ces indicateurs décrivent la position (le « centre ») d’une série.","it":"l’étendue","ot":["la moyenne","la médiane","le mode"],"x":"L’étendue (maximum − minimum) mesure la dispersion, pas la position."},
 {"q":"Complète : la ____ partage la série rangée dans l’ordre croissant en deux groupes de même effectif.","tr":1,"ok":"médiane","wr":["moyenne","étendue","fréquence"],"x":"Au moins la moitié des valeurs sont inférieures ou égales à la médiane, au moins la moitié supérieures ou égales."},
 {"q":"Série : $2$ ; $4$ ; $4$ ; $6$ ; $9$. Coche toutes les affirmations justes.","mu":["La médiane est $4$","L’étendue est $7$","La moyenne est $5$"],"no":["La moyenne est $4$","L’étendue est $9$"],"x":"Moyenne $= 25 \\div 5 = 5$ ; médiane : 3ᵉ valeur $= 4$ ; étendue $= 9 - 2 = 7$."},
 {"q":"Je suis la différence entre la plus grande et la plus petite valeur d’une série. Qui suis-je ?","qui":1,"ok":"l’étendue","wr":["la médiane","la moyenne","l’effectif"],"x":"Étendue $=$ valeur maximale $-$ valeur minimale."}],
'cc_equations':[
 {"q":"Trouve l’intrus : trois de ces équations ont pour solution $x = 3$.","it":"$x + 3 = 0$","ot":["$2x = 6$","$x - 1 = 2$","$5x - 3 = 12$"],"x":"$x + 3 = 0$ donne $x = -3$. Les autres donnent bien $3$ ($2 \\times 3 = 6$ ; $3 - 1 = 2$ ; $15 - 3 = 12$)."},
 {"q":"Complète : pour résoudre $4x = 20$, on ____ les deux membres par $4$.","tr":1,"ok":"divise","wr":["multiplie","soustrait","additionne"],"x":"$4x = 20 \\iff x = 20 \\div 4 = 5$."},
 {"q":"Coche toutes les expressions égales à $2(x + 3)$.","mu":["$2x + 6$","$6 + 2x$","$2 \\times x + 2 \\times 3$"],"no":["$2x + 3$","$2x + 5$"],"x":"On distribue le $2$ : $2(x + 3) = 2x + 6$. L’ordre des termes ne change rien."},
 {"q":"Je suis la valeur de $x$ qui rend l’égalité $3x - 4 = 11$ vraie. Qui suis-je ?","qui":1,"ok":"$5$","wr":["$\\dfrac{7}{3}$","$15$","$-5$"],"x":"$3x = 15$ donc $x = 5$ ; vérification : $3 \\times 5 - 4 = 11$."}],
'cc_fonctions':[
 {"q":"Trouve l’intrus : trois de ces fonctions sont affines (de la forme $ax + b$).","it":"$f(x) = x^2 + 1$","ot":["$f(x) = 3x - 2$","$f(x) = -x$","$f(x) = 5$"],"x":"$x^2 + 1$ contient un carré : ce n’est pas une fonction affine. $-x$ (avec $b = 0$) et $5$ (avec $a = 0$) sont affines."},
 {"q":"Complète : dans $f(x) = 2x + 7$, le nombre $7$ s’appelle l’____.","tr":1,"ok":"ordonnée à l’origine","wr":["coefficient directeur","antécédent","abscisse"],"x":"$f(x) = ax + b$ : $a$ est le coefficient directeur, $b$ l’ordonnée à l’origine ($f(0) = b$)."},
 {"q":"$f(x) = -2x + 4$. Coche toutes les affirmations justes.","mu":["$f(0) = 4$","$f$ est décroissante","$f(2) = 0$"],"no":["$f$ est croissante","$f(1) = 6$"],"x":"$a = -2 < 0$ : décroissante ; $f(0) = 4$ ; $f(2) = -4 + 4 = 0$ ; $f(1) = 2$."},
 {"q":"Je suis une droite qui passe par l’origine du repère. Je représente une fonction…","qui":1,"ok":"linéaire","wr":["constante","du second degré","décroissante"],"x":"Une fonction linéaire $f(x) = ax$ est représentée par une droite passant par l’origine."}],
'cc_evol':[
 {"q":"Trouve l’intrus : trois de ces évolutions sont des hausses.","it":"coefficient multiplicateur $0{,}97$","ot":["coefficient multiplicateur $1{,}03$","indice $112$ (base $100$)","taux d’évolution $+8\\,\\%$"],"x":"Un coefficient plus petit que $1$ correspond à une baisse ($-3\\,\\%$)."},
 {"q":"Complète : deux hausses successives de $10\\,\\%$ correspondent à une hausse globale de ____.","tr":1,"ok":"$21\\,\\%$","wr":["$20\\,\\%$","$11\\,\\%$","$100\\,\\%$"],"x":"$1{,}1 \\times 1{,}1 = 1{,}21$ : hausse globale de $21\\,\\%$, pas $20\\,\\%$."},
 {"q":"Un prix passe de $50$ € à $60$ €. Coche toutes les affirmations justes.","mu":["Le taux d’évolution est $+20\\,\\%$","Le coefficient multiplicateur est $1{,}2$","L’indice (base $100$ au départ) est $120$"],"no":["Le taux d’évolution est $+10\\,\\%$","Le coefficient multiplicateur est $0{,}2$"],"x":"$60 \\div 50 = 1{,}2$ : hausse de $20\\,\\%$, indice $120$."},
 {"q":"Je suis le nombre par lequel on multiplie une valeur pour appliquer une évolution. Qui suis-je ?","qui":1,"ok":"le coefficient multiplicateur","wr":["le taux d’évolution","l’indice de base","la variation absolue"],"x":"Valeur finale $=$ valeur initiale $\\times$ coefficient multiplicateur."}],
'cc_proba1':[
 {"q":"Trouve l’intrus : trois de ces nombres peuvent être une probabilité.","it":"$1{,}2$","ot":["$0{,}35$","$\\dfrac{3}{4}$","$1$"],"x":"Une probabilité est comprise entre $0$ et $1$ : $1{,}2$ est impossible."},
 {"q":"Complète : un événement qui se produit à coup sûr a une probabilité égale à ____.","tr":1,"ok":"$1$","wr":["$0$","$0{,}5$","$100$"],"x":"Événement certain : probabilité $1$ ; événement impossible : probabilité $0$."},
 {"q":"On lance un dé équilibré à six faces. Coche toutes les affirmations justes.","mu":["$P(\\text{obtenir } 6) = \\dfrac{1}{6}$","$P(\\text{nombre pair}) = \\dfrac{1}{2}$","$P(\\text{obtenir } 7) = 0$"],"no":["$P(\\text{obtenir } 6) = \\dfrac{1}{2}$","$P(\\text{nombre pair}) = \\dfrac{1}{3}$"],"x":"6 issues équiprobables ; les nombres pairs sont 2, 4, 6 : $\\dfrac{3}{6} = \\dfrac{1}{2}$ ; 7 est impossible."},
 {"q":"Je suis l’événement qui se réalise quand $A$ ne se réalise pas. Qui suis-je ?","qui":1,"ok":"l’événement contraire de $A$","wr":["l’événement impossible","l’événement certain","l’issue de $A$"],"x":"$P(\\bar{A}) = 1 - P(A)$."}],
'cc_fn1':[
 {"q":"Trouve l’intrus : trois de ces fonctions sont croissantes sur $[0 ; +\\infty[$.","it":"$x \\mapsto \\dfrac{1}{x}$ (sur $]0 ; +\\infty[$)","ot":["$x \\mapsto x^2$","$x \\mapsto \\sqrt{x}$","$x \\mapsto x^3$"],"x":"La fonction inverse est décroissante sur $]0 ; +\\infty[$."},
 {"q":"Complète : la courbe de la fonction carré s’appelle une ____.","tr":1,"ok":"parabole","wr":["hyperbole","droite","demi-droite"],"x":"$y = x^2$ : parabole ; $y = \\dfrac{1}{x}$ : hyperbole."},
 {"q":"Coche toutes les affirmations justes sur $f(x) = x^2$.","mu":["$f(-3) = 9$","$f$ admet un minimum égal à $0$","Sa courbe est symétrique par rapport à l’axe des ordonnées"],"no":["$f(-3) = -9$","$f$ est croissante sur $\\mathbb{R}$"],"x":"$(-3)^2 = 9$ ; minimum $0$ atteint en $0$ ; $f$ est décroissante sur $]-\\infty ; 0]$."},
 {"q":"Je suis la fonction dont la courbe est une hyperbole. Qui suis-je ?","qui":1,"ok":"la fonction inverse $x \\mapsto \\dfrac{1}{x}$","wr":["la fonction carré","la fonction cube","la fonction racine carrée"],"x":"La fonction inverse, définie pour $x \\neq 0$, est représentée par une hyperbole."}],
'cc_vect':[
 {"q":"$\\vec{u}(2 ; 3)$. Trouve l’intrus : trois de ces vecteurs sont colinéaires à $\\vec{u}$.","it":"$(3 ; 2)$","ot":["$(4 ; 6)$","$(-2 ; -3)$","$(1 ; 1{,}5)$"],"x":"$(3 ; 2)$ n’est pas proportionnel à $(2 ; 3)$ : $2 \\times 2 - 3 \\times 3 = -5 \\neq 0$."},
 {"q":"Complète : si $\\overrightarrow{AB} = \\overrightarrow{DC}$, alors $ABCD$ est un ____.","tr":1,"ok":"parallélogramme","wr":["trapèze quelconque","triangle","cercle"],"x":"Deux vecteurs égaux (même direction, même sens, même longueur) : $ABCD$ est un parallélogramme."},
 {"q":"$A(1 ; 2)$ et $B(4 ; 6)$. Coche toutes les affirmations justes.","mu":["$\\overrightarrow{AB}(3 ; 4)$","$AB = 5$","Le milieu de $[AB]$ est $(2{,}5 ; 4)$"],"no":["$\\overrightarrow{AB}(5 ; 8)$","$AB = 7$"],"x":"$\\overrightarrow{AB}(4 - 1 ; 6 - 2) = (3 ; 4)$ ; $AB = \\sqrt{9 + 16} = 5$ ; milieu $\\left(\\dfrac{5}{2} ; 4\\right)$."},
 {"q":"Je suis le vecteur qui a la même direction, la même longueur mais le sens opposé à $\\overrightarrow{AB}$. Qui suis-je ?","qui":1,"ok":"$\\overrightarrow{BA}$","wr":["$\\overrightarrow{AB}$","$2\\overrightarrow{AB}$","le vecteur nul"],"x":"$\\overrightarrow{BA} = -\\overrightarrow{AB}$."}],
'cc_deriv':[
 {"q":"Trouve l’intrus : trois de ces dérivées sont justes.","it":"$(x^3)' = 3x$","ot":["$(x^2)' = 2x$","$(5x)' = 5$","$(7)' = 0$"],"x":"$(x^3)' = 3x^2$. Les trois autres sont justes."},
 {"q":"Complète : si $f'(x) > 0$ sur un intervalle, alors $f$ est ____ sur cet intervalle.","tr":1,"ok":"croissante","wr":["décroissante","constante","nulle"],"x":"Le signe de la dérivée donne le sens de variation : $f' > 0$ ⇒ $f$ croissante."},
 {"q":"$f(x) = x^2 - 4x$. Coche toutes les affirmations justes.","mu":["$f'(x) = 2x - 4$","$f'(2) = 0$","$f$ admet un minimum en $x = 2$"],"no":["$f'(x) = 2x - 4x$","$f$ admet un maximum en $x = 2$"],"x":"$f'(x) = 2x - 4$ s’annule en $2$, négative avant, positive après : minimum $f(2) = -4$."},
 {"q":"Je suis le coefficient directeur de la tangente à la courbe de $f$ au point d’abscisse $a$. Qui suis-je ?","qui":1,"ok":"$f'(a)$","wr":["$f(a)$","$a$","$f(0)$"],"x":"Le nombre dérivé $f'(a)$ est la pente de la tangente au point d’abscisse $a$."}],
'cc_suites':[
 {"q":"Trouve l’intrus : trois de ces suites sont arithmétiques.","it":"$2$ ; $4$ ; $8$ ; $16$","ot":["$3$ ; $7$ ; $11$ ; $15$","$10$ ; $8$ ; $6$ ; $4$","$1{,}5$ ; $2$ ; $2{,}5$ ; $3$"],"x":"$2$ ; $4$ ; $8$ ; $16$ : on multiplie par $2$ (suite géométrique)."},
 {"q":"Complète : une suite géométrique de premier terme $u_0$ et de raison $q$ vérifie $u_n =$ ____.","tr":1,"ok":"$u_0 \\times q^n$","wr":["$u_0 + n \\times q$","$u_0 \\times n^q$","$q \\times n$"],"x":"Géométrique : $u_n = u_0 \\times q^n$ ; arithmétique : $u_n = u_0 + n \\times r$."},
 {"q":"$u_0 = 5$ et $u_{n+1} = u_n + 3$. Coche toutes les affirmations justes.","mu":["La suite est arithmétique de raison $3$","$u_2 = 11$","$u_n = 5 + 3n$"],"no":["La suite est géométrique de raison $3$","$u_2 = 45$"],"x":"On ajoute $3$ à chaque fois : $u_1 = 8$, $u_2 = 11$, $u_n = 5 + 3n$."},
 {"q":"Je suis le nombre qu’on ajoute à chaque terme d’une suite arithmétique pour obtenir le suivant. Qui suis-je ?","qui":1,"ok":"la raison","wr":["le premier terme","l’indice","la somme"],"x":"$u_{n+1} = u_n + r$ : $r$ est la raison."}],
'cc_proba2':[
 {"q":"Trouve l’intrus : trois de ces égalités sont toujours vraies.","it":"$P(A \\cap B) = P(A) + P(B)$","ot":["$P(\\bar{A}) = 1 - P(A)$","$P(A \\cap B) = P(A) \\times P_A(B)$","$P_A(B) + P_A(\\bar{B}) = 1$"],"x":"$P(A \\cap B) = P(A) \\times P_A(B)$ ; l’addition concerne la réunion, avec une correction."},
 {"q":"Complète : dans un arbre pondéré, la somme des probabilités des branches issues d’un même nœud vaut ____.","tr":1,"ok":"$1$","wr":["$0$","$0{,}5$","$100$"],"x":"Les branches issues d’un nœud décrivent toutes les issues possibles : leur somme vaut $1$."},
 {"q":"$P(A) = 0{,}4$ et $P_A(B) = 0{,}5$. Coche toutes les affirmations justes.","mu":["$P(A \\cap B) = 0{,}2$","$P(\\bar{A}) = 0{,}6$","$P_A(\\bar{B}) = 0{,}5$"],"no":["$P(A \\cap B) = 0{,}9$","$P(\\bar{A}) = 0{,}4$"],"x":"$0{,}4 \\times 0{,}5 = 0{,}2$ ; $1 - 0{,}4 = 0{,}6$ ; $1 - 0{,}5 = 0{,}5$."},
 {"q":"Je suis la probabilité que $B$ se réalise sachant que $A$ est réalisé. Qui suis-je ?","qui":1,"ok":"$P_A(B)$","wr":["$P(A \\cap B)$","$P(B)$","$P_B(A)$"],"x":"$P_A(B) = \\dfrac{P(A \\cap B)}{P(A)}$ : probabilité de $B$ sachant $A$."}],
'cc_espace':[
 {"q":"Trouve l’intrus : trois de ces solides sont des polyèdres (faces planes).","it":"le cylindre","ot":["le cube","la pyramide","le prisme droit"],"x":"Le cylindre a une surface courbe : ce n’est pas un polyèdre."},
 {"q":"Complète : le volume d’une pyramide est égal à ____.","tr":1,"ok":"$\\dfrac{1}{3} \\times \\mathcal{B} \\times h$","wr":["$\\mathcal{B} \\times h$","$\\dfrac{1}{2} \\times \\mathcal{B} \\times h$","$3 \\times \\mathcal{B} \\times h$"],"x":"Pyramide et cône : $V = \\dfrac{1}{3}\\mathcal{B}h$ ; prisme et cylindre : $V = \\mathcal{B}h$."},
 {"q":"Coche toutes les affirmations justes sur un cube.","mu":["Il a $6$ faces","Il a $12$ arêtes","Il a $8$ sommets"],"no":["Il a $8$ faces","Il a $6$ arêtes"],"x":"Cube : $6$ faces carrées, $12$ arêtes, $8$ sommets."},
 {"q":"Je suis un solide qui a un sommet et une base en forme de disque. Qui suis-je ?","qui":1,"ok":"le cône","wr":["le cylindre","la pyramide","la sphère"],"x":"Cône : une base circulaire et un sommet ; la pyramide a une base polygonale."}],
'cc_fractions':[
 {"q":"Trouve l’intrus : trois de ces écritures sont égales.","it":"$\\dfrac{3}{5}$","ot":["$\\dfrac{3}{4}$","$0{,}75$","$\\dfrac{6}{8}$"],"x":"$\\dfrac{3}{5} = 0{,}6$ ; les trois autres valent $0{,}75$."},
 {"q":"Complète : dans la fraction $\\dfrac{3}{7}$, le nombre $7$ s’appelle le ____.","tr":1,"ok":"dénominateur","wr":["numérateur","quotient","diviseur commun"],"x":"Numérateur en haut, dénominateur en bas."},
 {"q":"Coche toutes les fractions égales à $\\dfrac{1}{2}$.","mu":["$\\dfrac{2}{4}$","$\\dfrac{5}{10}$","$\\dfrac{50}{100}$"],"no":["$\\dfrac{2}{1}$","$\\dfrac{1}{4}$"],"x":"On multiplie numérateur et dénominateur par le même nombre : $\\dfrac{1}{2} = \\dfrac{2}{4} = \\dfrac{5}{10} = \\dfrac{50}{100}$."},
 {"q":"Je suis une fraction égale à $0{,}25$, avec un numérateur égal à $1$. Qui suis-je ?","qui":1,"ok":"$\\dfrac{1}{4}$","wr":["$\\dfrac{1}{25}$","$\\dfrac{2}{5}$","$\\dfrac{1}{2}$"],"x":"$1 \\div 4 = 0{,}25$."}],
'cc_trigo':[
 {"q":"Trouve l’intrus : trois de ces formules sont justes dans un triangle rectangle.","it":"$\\sin \\hat{A} = \\dfrac{\\text{adjacent}}{\\text{hypoténuse}}$","ot":["$\\cos \\hat{A} = \\dfrac{\\text{adjacent}}{\\text{hypoténuse}}$","$\\tan \\hat{A} = \\dfrac{\\text{opposé}}{\\text{adjacent}}$","$\\sin \\hat{A} = \\dfrac{\\text{opposé}}{\\text{hypoténuse}}$"],"x":"SOH CAH TOA : le sinus utilise le côté opposé, pas l’adjacent."},
 {"q":"Complète : pour tout angle aigu $x$, $\\cos^2 x + \\sin^2 x =$ ____.","tr":1,"ok":"$1$","wr":["$0$","$2$","$\\tan x$"],"x":"Relation fondamentale : $\\cos^2 x + \\sin^2 x = 1$."},
 {"q":"Coche toutes les valeurs justes.","mu":["$\\cos 60° = 0{,}5$","$\\sin 30° = 0{,}5$","$\\tan 45° = 1$"],"no":["$\\cos 0° = 0$","$\\sin 90° = 0$"],"x":"$\\cos 0° = 1$ et $\\sin 90° = 1$."},
 {"q":"Je suis le quotient du côté opposé par le côté adjacent à un angle aigu. Qui suis-je ?","qui":1,"ok":"la tangente","wr":["le sinus","le cosinus","l’hypoténuse"],"x":"$\\tan \\hat{A} = \\dfrac{\\text{opposé}}{\\text{adjacent}}$."}],
'cc_algo':[
 {"q":"Trouve l’intrus : trois de ces éléments sont des instructions de boucle ou de condition.","it":"une variable","ot":["Pour… allant de… à…","Tant que…","Si… alors… sinon…"],"x":"Une variable stocke une valeur ; les trois autres structurent le programme."},
 {"q":"Complète : dans un tableur, la formule « =B2*C2 » calcule le ____ des cellules B2 et C2.","tr":1,"ok":"produit","wr":["somme","quotient","moyenne"],"x":"L’astérisque * est le signe de la multiplication dans un tableur."},
 {"q":"Coche toutes les formules de tableur qui calculent la moyenne de A1, A2, A3.","mu":["=MOYENNE(A1:A3)","=(A1+A2+A3)/3","=SOMME(A1:A3)/3"],"no":["=A1+A2+A3/3","=SOMME(A1:A3)"],"x":"Attention aux priorités : =A1+A2+A3/3 ne divise que A3 par 3."},
 {"q":"Je suis la boucle qu’on utilise quand on ne connaît pas à l’avance le nombre de répétitions. Qui suis-je ?","qui":1,"ok":"la boucle « Tant que »","wr":["la boucle « Pour »","l’instruction « Si »","l’affectation"],"x":"« Tant que » répète tant qu’une condition est vraie ; « Pour » répète un nombre de fois connu."}],
'cc_transfo':[
 {"q":"Trouve l’intrus : trois de ces transformations conservent les longueurs.","it":"l’agrandissement de rapport $2$","ot":["la symétrie axiale","la translation","la rotation"],"x":"Un agrandissement de rapport $2$ double les longueurs."},
 {"q":"Complète : une symétrie centrale est une rotation d’angle ____.","tr":1,"ok":"$180°$","wr":["$90°$","$360°$","$45°$"],"x":"Le symétrique d’un point par rapport à $O$ s’obtient par un demi-tour autour de $O$."},
 {"q":"Coche toutes les transformations qui conservent les longueurs.","mu":["la symétrie centrale","la rotation d’angle $90°$","la translation"],"no":["l’agrandissement de rapport $3$","la réduction de rapport $0{,}5$"],"x":"Symétries, translations et rotations conservent les longueurs ; un agrandissement ou une réduction les multiplie par le rapport."},
 {"q":"Je fais glisser une figure sans la tourner, selon une direction, un sens et une longueur. Qui suis-je ?","qui":1,"ok":"une translation","wr":["une rotation","une symétrie axiale","une homothétie"],"x":"Translation : glissement défini par un vecteur."}],
'cc_finance':[
 {"q":"Trouve l’intrus : trois de ces égalités sont justes.","it":"Prix TTC $=$ Prix HT $-$ TVA","ot":["Prix TTC $=$ Prix HT $+$ TVA","Marge $=$ Prix de vente $-$ Prix d’achat","TVA à $20\\,\\%$ : Prix TTC $=$ Prix HT $\\times 1{,}2$"],"x":"La TVA s’ajoute au prix hors taxes : TTC $=$ HT $+$ TVA."},
 {"q":"Complète : le prix ____ est le prix avant application de la TVA.","tr":1,"ok":"hors taxes (HT)","wr":["toutes taxes comprises (TTC)","de revient","net à payer"],"x":"HT : hors taxes ; TTC : toutes taxes comprises."},
 {"q":"Un article coûte $100$ € HT, TVA à $20\\,\\%$. Coche toutes les affirmations justes.","mu":["La TVA vaut $20$ €","Le prix TTC est $120$ €","Prix TTC $= 100 \\times 1{,}2$"],"no":["Le prix TTC est $80$ €","La TVA vaut $120$ €"],"x":"TVA $= 100 \\times 0{,}2 = 20$ € ; TTC $= 120$ €."},
 {"q":"Je suis la différence entre le prix de vente et le prix d’achat. Qui suis-je ?","qui":1,"ok":"la marge","wr":["la TVA","la remise","le prix de revient"],"x":"Marge $=$ prix de vente $-$ prix d’achat (ou coût)."}],
'cc_poly2':[
 {"q":"Trouve l’intrus : trois de ces fonctions sont des polynômes du second degré.","it":"$f(x) = 3x + 1$","ot":["$f(x) = x^2 - 4$","$f(x) = -2x^2 + x$","$f(x) = (x - 1)(x + 2)$"],"x":"$3x + 1$ est du premier degré. $(x - 1)(x + 2) = x^2 + x - 2$ est bien du second degré."},
 {"q":"Complète : pour $ax^2 + bx + c$, le discriminant vaut $\\Delta =$ ____.","tr":1,"ok":"$b^2 - 4ac$","wr":["$b^2 + 4ac$","$4ac - b^2$","$b - 4ac$"],"x":"$\\Delta = b^2 - 4ac$ : son signe donne le nombre de racines."},
 {"q":"$f(x) = x^2 - 5x + 6$. Coche toutes les affirmations justes.","mu":["$\\Delta = 1$","$2$ est une racine","$3$ est une racine"],"no":["$\\Delta = 49$","$f$ n’a pas de racine"],"x":"$\\Delta = 25 - 24 = 1$ ; racines $\\dfrac{5 \\pm 1}{2}$, soit $2$ et $3$."},
 {"q":"Je suis la courbe représentative d’une fonction du second degré. Qui suis-je ?","qui":1,"ok":"une parabole","wr":["une droite","une hyperbole","un cercle"],"x":"Toute fonction $ax^2 + bx + c$ (avec $a \\neq 0$) est représentée par une parabole."}],
'cc_explog':[
 {"q":"Trouve l’intrus : trois de ces égalités sont justes.","it":"$\\ln(a + b) = \\ln a + \\ln b$","ot":["$\\ln(ab) = \\ln a + \\ln b$","$\\ln 1 = 0$","$e^0 = 1$"],"x":"Le logarithme transforme un produit en somme, pas une somme en somme."},
 {"q":"Complète : pour tout réel $x$, $e^x$ est toujours ____.","tr":1,"ok":"strictement positif","wr":["négatif","nul pour $x = 0$","plus grand que $x^2$"],"x":"La fonction exponentielle prend uniquement des valeurs strictement positives ($e^0 = 1$)."},
 {"q":"Coche toutes les affirmations justes.","mu":["$\\ln(e) = 1$","La fonction $\\ln$ est croissante sur $]0 ; +\\infty[$","$e^{\\ln 5} = 5$"],"no":["$\\ln(0) = 1$","$\\ln$ est définie pour $x = -1$"],"x":"$\\ln$ est définie sur $]0 ; +\\infty[$ seulement ; $\\ln$ et $\\exp$ sont réciproques."},
 {"q":"Je suis la fonction égale à sa propre dérivée et qui vaut $1$ en $0$. Qui suis-je ?","qui":1,"ok":"la fonction exponentielle","wr":["la fonction logarithme","la fonction carré","la fonction inverse"],"x":"$(e^x)' = e^x$ et $e^0 = 1$."}],
'cc_logique':[
 {"q":"Trouve l’intrus : trois de ces nombres appartiennent à $\\mathbb{N}$.","it":"$-3$","ot":["$0$","$7$","$\\dfrac{12}{4}$"],"x":"$\\mathbb{N}$ : entiers naturels $0, 1, 2…$ ; $\\dfrac{12}{4} = 3$ en fait partie, $-3$ non."},
 {"q":"Complète : l’ensemble des nombres décimaux se note ____.","tr":1,"ok":"$\\mathbb{D}$","wr":["$\\mathbb{N}$","$\\mathbb{Z}$","$\\mathbb{Q}$"],"x":"$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{D} \\subset \\mathbb{Q} \\subset \\mathbb{R}$."},
 {"q":"Coche toutes les affirmations justes.","mu":["$-5 \\in \\mathbb{Z}$","$0{,}5 \\in \\mathbb{D}$","$\\sqrt{2} \\notin \\mathbb{Q}$"],"no":["$\\dfrac{1}{3} \\in \\mathbb{D}$","$-5 \\in \\mathbb{N}$"],"x":"$\\dfrac{1}{3} = 0{,}333…$ n’est pas décimal ; $\\sqrt{2}$ est irrationnel."},
 {"q":"Je suis l’ensemble de tous les nombres entiers, positifs et négatifs. Qui suis-je ?","qui":1,"ok":"$\\mathbb{Z}$","wr":["$\\mathbb{N}$","$\\mathbb{D}$","$\\mathbb{R}$"],"x":"$\\mathbb{Z} = \\{…, -2, -1, 0, 1, 2, …\\}$."}],
}
d=json.load(io.open(P,encoding='utf-8'))
add=0
for it in d['items']:
    have={q['q'] for q in it['qs']}
    for q in A.get(it['id'],[]):
        if q['q'] not in have:it['qs'].append(q);add+=1
missing=[k for k in A if k not in {it['id'] for it in d['items']}]
assert not missing,missing
io.open(P,'w',encoding='utf-8').write(json.dumps(d,ensure_ascii=False,indent=1))
print('questions ajoutées :',add)
