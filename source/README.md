# Flash Maths — code source

Les pages publiées à la racine du dépôt sont **générées** à partir de ce dossier.

## Assembler les pages

```bash
cd source
npm install          # KaTeX, client Supabase, QR code, police Nunito (intégrés dans les pages)
python3 build.py     # écrit les pages finales dans source/dist/
```

Copiez ensuite `dist/index.html`, `prof.html`, `eleve.html`, `contact.html` et `confidentialite.html` à la racine du dépôt. Ne remplacez pas `config.js` : celui de `src/` est un modèle vide.

## Organisation

| Dossier ou fichier | Contenu |
|---|---|
| `src/bank_core.js` | Outils de la banque : formats (QCM, tuiles, ordre, curseur, étape fausse), figures SVG, erreurs types |
| `src/bank_items_a.js` … `bank_items_f.js` | Les notions (générateurs à paramètres aléatoires) et leurs « angles » |
| `src/bank_curriculum.js` | Le programme : niveau › chapitre › sous-chapitre › notions |
| `src/bank_engine.js` | Tirage (mémoire des énoncés, des formes et des notions), correction, saisie libre |
| `src/cours.json` | Questions de cours |
| `src/prof_*.js`, `src/eleve.js` | Pages prof et élève |
| `src/*.css` | Thème « Cahier & ampoules » |
| `src/flash_maths.sql` | Base Supabase (version 4) |
| `tools/` | Scripts d’ajout de questions de cours |
| `test/` | Tests : banque (`node test/bank_test.js 300`), parcours complets avec Playwright (`test/e2e_*.py`, base PostgreSQL locale et serveur de test) |

## Règles de la banque

- Chaque mauvaise réponse correspond à une **erreur type** (code `ERR` dans `bank_core.js`), utilisée pour le diagnostic.
- Une notion doit proposer **plusieurs formes** d’énoncé (`addAngles`) : l’anti-répétition compare les formes (énoncé sans les nombres), pas seulement les textes.
- Les formules sont écrites entre `$…$` (KaTeX) ; `node test/bank_test.js 300` vérifie le rendu, la cohérence des corrections et l’absence de réponse acceptée par erreur.
