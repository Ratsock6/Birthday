#!/bin/bash
set -e

echo "🚀 Déploiement birthday-app..."

cd $HOME/apps/birthday

git pull origin main

cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart birthday-backend

cd ../frontend
npm install
npm run build

echo "✅ Déploiement terminé !"
