#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is required." >&2
  exit 1
fi

mkdir -p /app/public/uploads
chown -R nextjs:nodejs /app/public/uploads

echo "Running Prisma migrations..."
su-exec nextjs npx prisma migrate deploy

echo "Starting Next.js on ${HOSTNAME}:${PORT}..."
exec su-exec nextjs npx next start -H "${HOSTNAME:-0.0.0.0}" -p "${PORT:-3000}"
