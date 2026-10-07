/* ═══════════════════════════════════════════════════════════════
   PROGRAMME : niveau › chapitre › sous-chapitre › notions
   Ordre et intitulés alignés sur les programmes de la voie professionnelle
   (2nde : BO spécial n° 5 du 11/04/2019 ; 1re et Tle : BO spécial n° 1 du
   06/02/2020) et sur le cycle 4 pour la 3ᵉ Prépa-Métiers.
   Une notion peut figurer à plusieurs niveaux (réactivation, automatismes).
   Les notions non classées (dont « Mes questions ») sont ajoutées à la fin,
   dans leur chapitre d’origine.
═══════════════════════════════════════════════════════════════ */
var CURRICULUM={
  "3pm":[
    ["Nombres et calculs",[
      ["Décimaux et calcul mental",["add_dec","mult10","mult_dec","tables","carres12","ranger_dec","axe_gradue","arrondi","estim_calc","cc_operations"]],
      ["Relatifs et priorités",["relatifs","prio","cc_signes"]],
      ["Fractions",["frac_de","frac_dec_pct","cc_fractions"]],
      ["Multiples, diviseurs, nombres premiers",["diviseurs"]]]],
    ["Proportionnalité et pourcentages",[
      ["Proportionnalité",["regle3","prop_tableau","choix_op","echelle","cc_prop"]],
      ["Pourcentages",["pct_de","pct_mental","cc_pct"]],
      ["Vitesses et durées",["vitesse","heures_dec","durees"]]]],
    ["Calcul littéral et équations",[
      ["Expressions et équations",["lit_reduire","eval_expr","eq1"]]]],
    ["Grandeurs et mesures",[
      ["Unités et conversions",["conv","unite_adaptee","cc_unites"]],
      ["Périmètres et aires",["perim_aire","perim_cercle","aire_triangle","cc_formules"]],
      ["Volumes et solides",["volume_pave","solides"]]]],
    ["Géométrie",[
      ["Triangles et angles",["angles_tri","cc_geo"]],
      ["Théorème de Pythagore",["pyth_hyp","pyth_fig","cc_pythagore"]],
      ["Repérage et transformations",["repere","transfo","cc_transfo"]]]],
    ["Statistiques",[
      ["Lire et résumer des données",["lecture_diag","moyenne","freq_pct","cc_stats"]]]],
    ["Algorithmique et tableur",[
      ["Programmes et tableur",["algo_var","cc_algo"]]]],
    ["Problèmes des métiers",[
      ["Situations professionnelles",["pb_commerce","pb_cuisine","pb_coiffure"]]]]
  ],
  "cap":[
    ["Automatismes et calcul",[
      ["Décimaux et ordres de grandeur",["add_dec","mult10","mult_dec","tables","carres12","ranger_dec","axe_gradue","arrondi","estim_calc","cc_operations"]],
      ["Relatifs, priorités, puissances",["relatifs","prio","prio_err","puissances","carres_racines","sci_ordre","cc_signes","cc_puissances"]],
      ["Fractions",["frac_de","frac_dec_pct","frac_ops","frac_comp","cc_fractions"]],
      ["Multiples et diviseurs",["diviseurs"]]]],
    ["Proportionnalité et pourcentages",[
      ["Proportionnalité",["regle3","prop_tableau","prop_graph","choix_op","echelle","cc_prop"]],
      ["Pourcentages et évolutions",["pct_de","pct_mental","pct_estim","pct_inverse","coef_evol","pct_cm_tuiles","cc_pct"]],
      ["Vitesses, durées, grandeurs composées",["vitesse","heures_dec","durees","grandeurs_comp"]]]],
    ["Calculs commerciaux",[
      ["Prix, TVA, marge",["ttc_ht","marge","cc_finance"]]]],
    ["Algèbre : calcul littéral, équations",[
      ["Calcul littéral et formules",["eval_expr","formules","formules_isoler","lit_reduire","lit_dev","lit_tuiles"]],
      ["Équations du premier degré",["eq1","eq_traduire","eq_err","cc_equations"]],
      ["Lecture graphique",["lect_image"]]]],
    ["Grandeurs et mesures",[
      ["Unités et conversions",["conv","conv_aire_vol","unite_adaptee","cc_unites"]],
      ["Périmètres et aires",["perim_aire","perim_cercle","aire_disque","aire_triangle","cc_formules"]],
      ["Volumes et solides",["volume_pave","vol_estim","solides"]]]],
    ["Géométrie",[
      ["Triangles et angles",["angles_tri","cc_geo"]],
      ["Théorème de Pythagore",["pyth_hyp","pyth_cote","pyth_fig","pyth_recip","cc_pythagore"]],
      ["Thalès et repérage",["thales","repere"]]]],
    ["Statistiques",[
      ["Statistique à une variable",["moyenne","moy_ponderee","mediane","etendue","freq_pct","lecture_diag","stats_tab","cc_stats"]]]],
    ["Algorithmique et tableur",[
      ["Programmes et tableur",["algo_var","cc_algo"]]]],
    ["Problèmes des métiers",[
      ["Situations professionnelles",["pb_commerce","pb_batiment","pb_cuisine","pb_auto","pb_logistique","pb_sante","pb_coiffure","pb_elec"]]]]
  ],
  "2nde":[
    ["Automatismes",[
      ["Calcul numérique",["relatifs","prio","prio_err","frac_de","frac_dec_pct","frac_ops","frac_comp","estim_calc","cc_signes","cc_fractions"]],
      ["Puissances et notation scientifique",["puissances","carres_racines","sci_ordre","cc_puissances"]],
      ["Proportionnalité",["regle3","prop_tableau","prop_graph","choix_op","cc_prop"]],
      ["Pourcentages",["pct_de","pct_inverse","coef_evol","pct_cm_tuiles","pct_estim","cc_pct"]],
      ["Grandeurs composées",["heures_dec","grandeurs_comp"]]]],
    ["Statistique et probabilités",[
      ["Statistique à une variable",["moyenne","moy_ponderee","mediane","etendue","quartiles","lecture_diag","stats_tab","freq_pct","cc_stats"]],
      ["Fluctuation d’une fréquence, probabilités",["fluctuation"]]]],
    ["Résolution d’un problème du premier degré",[
      ["Calcul littéral",["eval_expr","formules","formules_isoler","lit_reduire","lit_dev","lit_fact","lit_tuiles","double_dist"]],
      ["Équations",["eq1","eq_traduire","eq_err","cc_equations"]],
      ["Inéquations",["ineq1"]]]],
    ["Fonctions",[
      ["Généralités et lecture graphique",["lect_image","fn_types"]],
      ["Fonctions affines",["image_affine","antecedent_affine","coeff_dir","sens_variation","droite_eq","cc_fonctions"]]]],
    ["Calculs commerciaux et financiers",[
      ["Prix, TVA, marge",["ttc_ht","marge"]],
      ["Intérêts simples",["interets_simples","cc_finance"]]]],
    ["Géométrie",[
      ["Mesures et formules",["conv","conv_aire_vol","perim_cercle","aire_disque","cc_unites","cc_formules"]],
      ["Solides et volumes",["solides","volume_pave","volume_cyl","vol_estim"]],
      ["Pythagore et Thalès",["pyth_hyp","pyth_cote","pyth_fig","pyth_recip","thales","cc_pythagore"]],
      ["Trigonométrie dans le triangle rectangle",["trigo_choix","trigo_calc","trigo_fig","cc_trigo"]],
      ["Repérage",["repere","cc_geo"]]]],
    ["Vocabulaire ensembliste et logique",[
      ["Intervalles et raisonnement",["ensembles","cc_logique"]]]],
    ["Algorithmique et programmation",[
      ["Programmes et tableur",["algo_var","cc_algo"]]]],
    ["Problèmes des métiers",[
      ["Situations professionnelles",["pb_commerce","pb_batiment","pb_auto","pb_logistique","pb_sante","pb_elec"]]]]
  ],
  "1re":[
    ["Automatismes",[
      ["Calcul littéral et formules",["formules_isoler","double_dist"]]]],
    ["Statistique et probabilités",[
      ["Statistique à deux variables",["ajustement","stats_tab"]],
      ["Probabilités",["proba_simple","proba_union","proba_tab","proba_arbre","cc_proba1"]]]],
    ["Suites numériques",[
      ["Suites arithmétiques",["suite_arith","suite_somme"]]]],
    ["Fonctions",[
      ["Lecture et résolution graphique",["lect_image","resol_graph","droite_eq"]],
      ["Second degré",["carre_valeurs","parabole_lect","poly2","cc_poly2"]],
      ["Fonctions inverse et racine carrée",["racine_inverse"]],
      ["Nombre dérivé, fonction dérivée",["deriv_point","deriv_poly","variation_signe","cc_fn1"]]]],
    ["Calculs commerciaux et financiers",[
      ["Évolutions et indices",["evol_succ","taux_moyen","indices","evol_reciproque","evol_pieges","pct_inverse","pct_cm_tuiles","cc_evol"]],
      ["Intérêts, coûts, rentabilité",["interets_simples","cout_marginal","seuil_rentab","cc_finance"]]]],
    ["Géométrie",[
      ["Vecteurs du plan",["vecteur_coord","norme_vecteur","milieu","cc_vect"]],
      ["Cercle trigonométrique, sinus et cosinus",["trigo_cercle","sinus_fn","trigo_fig","cc_trigo"]],
      ["Géométrie dans l’espace",["solides","vol_estim"]]]],
    ["Vocabulaire ensembliste et logique",[
      ["Intervalles et raisonnement",["ensembles","cc_logique"]]]],
    ["Problèmes des métiers",[
      ["Situations professionnelles",["pb_elec"]]]]
  ],
  "term":[
    ["Statistique et probabilités",[
      ["Statistique à deux variables",["ajustement"]],
      ["Probabilités conditionnelles",["proba_simple","proba_tab","proba_cond","independance","cc_proba2"]],
      ["Variable aléatoire",["esperance"]]]],
    ["Suites numériques",[
      ["Suites arithmétiques et géométriques",["suite_arith","suite_somme","suite_geo","reconnaitre_suite","suites_plus","cc_suites"]]]],
    ["Fonctions",[
      ["Dérivation et variations",["deriv_poly","deriv_point","variation_signe","minimum_parabole","deriv_tuiles","cc_deriv"]],
      ["Polynômes de degré 2 et 3",["parabole_lect","poly3"]],
      ["Exponentielles et logarithme décimal",["exp_log","cc_explog"]]]],
    ["Calculs commerciaux et financiers",[
      ["Intérêts composés et emprunts",["interets_composes","emprunt"]]]],
    ["Géométrie",[
      ["Géométrie dans l’espace",["vol_pyramide","vol_sphere","volume_cyl","reduction_agrandissement","cc_espace"]],
      ["Fonctions sinusoïdales",["sinus_fn"]]]],
    ["Vocabulaire ensembliste et logique",[
      ["Intervalles et raisonnement",["ensembles","cc_logique"]]]]
  ]
};
