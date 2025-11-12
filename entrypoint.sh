#!/bin/sh

if [ "$APP_ENV" = "production" ]; then
  echo "=== Production environment detected ==="
  echo "Kører migrationer..."
  npx prisma migrate deploy

  echo "Starter app i production mode..."
  exec npm run start
else
  echo "=== Development environment detected ==="
  echo "Kører migrationer (dev)..."
  npx prisma migrate dev

  echo "Kører seed..."
  npx prisma db seed

  echo "Starter app i dev mode..."
  exec npm run dev
fi
