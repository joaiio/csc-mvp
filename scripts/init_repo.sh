#!/usr/bin/env bash
set -e

# 0) Vérifs
echo "➡️  Dossier courant : $(pwd)"
git --version

# 1) Init Git si besoin
if [ ! -d ".git" ]; then
  echo "➡️  Initialisation du dépôt Git…"
  git init
fi

# 2) Premier commit
echo "➡️  Ajout des fichiers et premier commit…"
git add .
git commit -m "feat: MVP V6 static site + design + CI Pages" || true
git branch -M main

# 3) Lier à GitHub
read -p "URL du repo (HTTPS ou SSH) : " ORIGIN
git remote remove origin 2>/dev/null || true
git remote add origin "$ORIGIN"

# 4) S'assurer que le workflow Pages existe (si absent on le crée)
if [ ! -f ".github/workflows/pages.yml" ]; then
  echo "➡️  Ajout du workflow GitHub Pages…"
  mkdir -p .github/workflows
  cat > .github/workflows/pages.yml <<'YAML'
name: Deploy GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
YAML
  git add .github/workflows/pages.yml
  git commit -m "ci: add GitHub Pages workflow" || true
fi

# 5) Pousser main
echo "➡️  Push de main…"
git push -u origin main

# 6) Branches utiles
for BR in content/media-kit feat/animations hotfix/demo feat/piste-b-nextjs; do
  echo "➡️  Création/push branche $BR…"
  git checkout -b "$BR" 2>/dev/null || git checkout "$BR"
  git push -u origin "$BR"
done

# 7) Retour sur main
git checkout main
echo "✅ Fini. Va sur GitHub → Settings → Pages (Build & deployment = GitHub Actions)."
