
# Charlott’ Street Club — MVP V6 (Segments & Contenus) + Piste A (client‑side)

**Demo Lundi 3 novembre 2025** · Europe/Paris  
Prototype **100% client‑side** (AUCUNE collecte). GitHub Pages pour l’hébergement.  
Design intégré : **bulle irisée + archère**, palette grenat/vert/beige/noir + accents iridescents.

## ✨ Live (après premier push)
- Pages : `index.html`, `app.html`, `segments.html`, `media-kit.html`, `partenaires.html`, `associations.html`
- Bouton flottant **Agora** sur toutes les pages.
- **Media Kit** avec bouton **Copier le texte** (clipboard).
- **Agora** locale (post/like/supprimer) via `localStorage`.

## 📁 Arborescence
```
/csc-mvp/
  index.html  app.html  segments.html  media-kit.html  partenaires.html  associations.html
  barometre-49-3.html  mythbusters.html  guichet.html  transparence.html  comparateur.html  carte.html  quiz.html
  blog.html  petitions.html  sondages.html  formations.html
  styles.css
  js/ (main.js, kit.js, segments.js)
  data/ (segments.json, channels.json, contents.json, progression_entreprises.json, calendar.json)
  assets/ (logo-hero.png, poster-*.png)
  .github/workflows/pages.yml
```

## 🚀 Démarrage rapide (5 étapes)
1. **Créer le repo** sur GitHub (nom conseillé : `csc-mvp`).  
2. En local :
   ```bash
   git clone <VOTRE_REPO_URL>
   cd csc-mvp
   # Copiez tout le contenu de ce dossier (ou dézippez le package fourni)
   git add .
   git commit -m "feat: MVP V6 static site + design + CI pages"
   git push origin main
   ```
3. Dans **Settings → Pages** : Source = **GitHub Actions** (workflow déjà présent).  
4. Attendez le déploiement → l’URL s’affiche dans l’onglet **Actions** puis dans **Pages**.  
5. **Dry‑run démo** : suivez le storyboard (README section plus bas).

## 🧭 Branches (proposées)
- `main` : site statique (Pages).  
- `feat/piste-b-nextjs` : Next.js + Prisma + Auth.js + Stripe (code‑only).  
- `content/media-kit` : mises à jour JSON et copies.  
- `feat/animations` : itérations UI/animations.  
- `hotfix/demo` : corrections de dernière minute avant la démo.

Création rapide :
```bash
git checkout -b feat/piste-b-nextjs && git push -u origin HEAD
git checkout -b content/media-kit && git push -u origin HEAD
git checkout -b feat/animations && git push -u origin HEAD
git checkout -b hotfix/demo && git push -u origin HEAD
git checkout main
```

## 🔐 Privacy / Accessibilité / Perf
- 0 cookies tiers, 0 collecte serveur, polices locales, < 60 KB JS.  
- `prefers-reduced-motion` respecté (animations désactivées).  
- Contrastes AA, focus visible, images ALT.

## 🧱 Piste B (après démo)
Créez un 2e repo `csc-code-only` **ou** branche `feat/piste-b-nextjs`. Base : Next.js (App Router) + Prisma + Auth.js + Stripe + Postgres + Plausible/Matomo (EU). Voir le guide “CSC — Code‑Only (V3 fusion)” pour le schéma Prisma, routes API, docker-compose, Caddy, etc.

## 🧪 Storyboard démo (5–7 min)
1. **Accueil** → slogan, valeurs, badge Prototype.  
2. **Segments** → choisir un public.  
3. **Media Kit** → copier un contenu.  
4. **Pétitions / Sondages** (placeholders) → montrer l’action rapide + export.  
5. **Partenaires** → Déclic → Engagement (carrousel LI).  
6. **Associations** → hashtag commun + calendrier S1→S2.  
7. **Agora** → publier un post, like, supprimer.  
8. Clôture : souveraineté EU, roadmap, gouvernance coop.

---

### Développer en local (optionnel)
Servez le dossier avec un serveur statique :
```bash
# Python
python -m http.server 8000
# puis ouvrez http://localhost:8000
```

### Licence
© Charlott’ Street Club — 2025. Prototype interne non commercial.
