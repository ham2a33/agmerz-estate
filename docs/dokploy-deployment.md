# AGMERZ ESTATE — Dokploy Deployment Guide

Production deployment for **VPS + Dokploy** using Docker Compose architecture:

```
GitHub (main)
    ↓
Dokploy
    ↓
Docker
    ├── app (Next.js)     → port 3000
    └── postgres:16       → internal port 5432
            ↓
    Persistent volumes
    ├── postgres_data     → /var/lib/postgresql/data
    └── uploads_data      → /app/public/uploads
```

---

## Architecture

| Service | Image / Build | Port | Persistence |
|---------|---------------|------|-------------|
| `app` | `Dockerfile` (Next.js 15.5) | **3000** (public via Dokploy proxy) | `uploads_data` → `/app/public/uploads` |
| `postgres` | `postgres:16-alpine` | **5432 internal only** | `postgres_data` → `/var/lib/postgresql/data` |

Next.js connects to PostgreSQL via Docker hostname:

```
postgres
```

Example `DATABASE_URL`:

```
postgresql://agmerz:<SECURE_PASSWORD>@postgres:5432/agmerz_estate?schema=public
```

**Never commit real passwords.** Use Dokploy environment variables or a `.env` file that is **not** in git.

---

## Environment variables

These are the **only** environment variables used by the project (verified from source code):

| Variable | Required | Used by | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | Prisma, Next.js | PostgreSQL connection string |
| `POSTGRES_USER` | Yes (postgres service) | PostgreSQL container | DB user |
| `POSTGRES_PASSWORD` | Yes (postgres service) | PostgreSQL container | DB password |
| `POSTGRES_DB` | Yes (postgres service) | PostgreSQL container | Database name |
| `ADMIN_EMAIL` | Recommended | Admin login bootstrap | Admin email |
| `ADMIN_PASSWORD` | Recommended | Admin login bootstrap | Admin password |
| `NODE_ENV` | Yes (production) | Next.js, cookies | Set to `production` |
| `HOSTNAME` | Optional | Next.js | Default `0.0.0.0` in Docker |
| `PORT` | Optional | Next.js | Default `3000` |

Copy `.env.example` and replace placeholders:

```env
POSTGRES_USER=agmerz
POSTGRES_PASSWORD=<SECURE_PASSWORD>
POSTGRES_DB=agmerz_estate
DATABASE_URL=postgresql://agmerz:<SECURE_PASSWORD>@postgres:5432/agmerz_estate?schema=public
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<SECURE_ADMIN_PASSWORD>
NODE_ENV=production
```

---

## STEP 1 — PostgreSQL service

### Option A: Docker Compose on Dokploy (recommended for this repo)

Deploy the included `docker-compose.yml` which defines both `postgres` and `app`.

PostgreSQL settings:

- Image: `postgres:16-alpine`
- Volume: `postgres_data:/var/lib/postgresql/data`
- **Do not** expose `5432:5432` publicly
- Healthcheck: `pg_isready`

### Option B: Separate Dokploy PostgreSQL service

If Dokploy provides a managed PostgreSQL app:

1. Create PostgreSQL 16 service in Dokploy.
2. Note internal hostname (often the service name).
3. Set `DATABASE_URL` to point to that hostname instead of `postgres`.

---

## STEP 2 — Next.js application from GitHub

1. Open Dokploy → **New Application**
2. Source: **GitHub**
3. Repository: `https://github.com/ham2a33/agmerz-estate`
4. Branch: `main`
5. Build type: **Dockerfile** (path: `Dockerfile`)

---

## STEP 3 — Docker build

The production `Dockerfile` uses a **multi-stage build**:

1. `deps` — `npm ci`
2. `builder` — `npm run build` (includes `prisma generate`)
3. `runner` — production `npm ci --omit=dev` + Prisma CLI for migrations

Build context excludes secrets and dev artifacts via `.dockerignore`.

`.env` is **not** copied into the image.

---

## STEP 4 — Port

Configure Dokploy to proxy HTTP traffic to:

```
3000
```

Next.js listens on `0.0.0.0:3000` inside the container.

---

## STEP 5 — Environment variables in Dokploy

Set all variables from the table above in Dokploy **Environment** settings.

Rules:

- Use strong unique passwords for `POSTGRES_PASSWORD` and `ADMIN_PASSWORD`
- `DATABASE_URL` password must match `POSTGRES_PASSWORD`
- Do not log or expose secrets in build output

---

## STEP 6 — Docker networking

Services in the same Docker Compose network resolve each other by **service name**.

The app container must use:

```
postgres
```

as the database hostname — **not** `localhost`.

`localhost` inside the app container refers to the app itself, not PostgreSQL.

---

## STEP 7 — Uploads persistent volume

CMS uploads are stored at:

```
/app/public/uploads
```

Docker Compose volume:

```yaml
uploads_data:/app/public/uploads
```

Public URLs remain:

```
/uploads/filename.jpg
```

This applies to:

- Media library (`/api/media`)
- Property images
- Category images
- Homepage / settings images (logo, favicon)

**Uploads must not be baked into the Docker image.** They live only on the volume.

---

## STEP 8 — PostgreSQL persistent volume

```yaml
postgres_data:/var/lib/postgresql/data
```

Data survives:

- `docker compose restart`
- App container recreation / redeploy
- Next.js image rebuild

A volume is **not** a backup. See [Backup](#backup) below.

---

## STEP 9 — Prisma migrations

On container start, `docker-entrypoint.sh` runs:

```bash
npx prisma migrate deploy
npm run start   # next start -H 0.0.0.0 -p 3000
```

Rules:

- ✅ Use `prisma migrate deploy` in production
- ❌ Do **not** use `prisma db push` in production
- ❌ Do **not** run `npm run db:seed` automatically on every start
- Migrations run **once** at startup, not on every healthcheck

### First deployment

After containers are up, run seed **once** manually if you need demo data:

```bash
docker compose exec app npx prisma db seed
```

Production sites should usually skip seed or run it only during initial setup.

### Before applying new migrations

1. Backup PostgreSQL (see [Backup](#backup))
2. Deploy new image
3. Entrypoint applies pending migrations automatically
4. Verify `/api/health` returns `database: connected`

---

## STEP 10 — Health check

Endpoint:

```
GET /api/health
```

| Status | Response |
|--------|----------|
| 200 | `{ "status": "ok", "database": "connected" }` |
| 503 | `{ "status": "degraded", "database": "disconnected" }` |

Docker Compose healthcheck (app service):

```yaml
fetch('http://127.0.0.1:3000/api/health')
```

Use this URL in Dokploy health checks after deployment.

---

## STEP 11 — Domain + HTTPS

1. Point DNS `A` record to VPS IP
2. In Dokploy → Application → **Domains**
3. Add your domain (e.g. `agmerz.ru`)
4. Enable **HTTPS** (Let's Encrypt)
5. Dokploy proxies `443 → app:3000`

Admin CMS remains at:

```
https://yourdomain.com/admin
```

No CMS controls appear on public pages.

---

## Backup

A Docker volume is persistent storage, **not** a backup.

See also: [docs/database-backup.md](./database-backup.md)

### PostgreSQL backup (`pg_dump`)

```bash
docker compose exec -T postgres pg_dump \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --format=custom \
  > "./backups/agmerz_estate-$(date +%Y%m%d-%H%M%S).backup"
```

Plain SQL:

```bash
docker compose exec -T postgres pg_dump \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  > "./backups/agmerz_estate-$(date +%Y%m%d-%H%M%S).sql"
```

### Restore

Custom format:

```bash
cat ./backups/your.backup | docker compose exec -T postgres pg_restore \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  --clean --if-exists
```

SQL format:

```bash
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < ./backups/your.sql
```

### Scheduled backup recommendation

- Daily `pg_dump` via cron on the VPS
- Store backups **off-server** (S3, another server, etc.)
- Test restore periodically

### Before migration

1. Full PostgreSQL backup
2. Note current git commit / image tag
3. Deploy
4. Verify `/api/health` and admin login

### Rollback considerations

- **App rollback:** redeploy previous Docker image tag
- **Migration rollback:** Prisma has no automatic down — restore DB from backup if migration fails
- **Uploads:** back up `uploads_data` volume separately if needed:

```bash
docker run --rm \
  -v agmerz-estate_uploads_data:/data \
  -v "$(pwd)/backups:/backup" \
  alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz -C /data .
```

---

## Persistence verification test

Run after deployment:

1. Start PostgreSQL and app (`docker compose up -d`)
2. Open `/admin/login` — log in
3. Create or verify property/category data in admin
4. Upload an image via Admin CMS (e.g. `/admin/categories/[id]`)
5. Confirm public URL works: `https://yourdomain.com/uploads/...`
6. `docker compose restart app` — image still accessible
7. `docker compose up -d --force-recreate app` — image still accessible
8. `docker compose restart postgres` — data still in admin
9. `GET /api/health` → `200`, `database: connected`

Expected: DB data and uploaded files survive all restarts.

---

## Local Docker verification (non-destructive)

```bash
# Validate compose file
docker compose config

# Build images (does not start services)
docker compose build

# Start (uses .env — do not commit real secrets)
cp .env.example .env
# Edit .env with local passwords
docker compose up -d

# Check health
curl -s http://localhost:3000/api/health | jq

# View logs
docker compose logs -f app
```

---

## Security checklist

- [ ] `.env` is in `.gitignore` and not in the Docker image
- [ ] Production passwords are not in `docker-compose.yml`, `Dockerfile`, or git
- [ ] `POSTGRES_PASSWORD` and `ADMIN_PASSWORD` are strong and unique
- [ ] PostgreSQL port 5432 is **not** exposed publicly
- [ ] HTTPS enabled via Dokploy
- [ ] Admin routes require authentication (`requireAdmin()`)
- [ ] Application logs do not print `DATABASE_URL`, cookies, or passwords

---

## What must work after deployment

| Area | Verify |
|------|--------|
| Public site | `/`, `/catalog`, `/property/[id]`, `/blog` |
| Admin CMS | `/admin/login`, all CRUD sections |
| Uploads | `/api/media`, category/property images → `/uploads/...` |
| Database | Prisma migrations applied, data persists |
| Health | `/api/health` returns 200 when DB is up |

---

## Troubleshooting

### App starts but health is 503

- Check `DATABASE_URL` hostname is `postgres` (not `localhost`)
- Ensure postgres service is healthy: `docker compose ps`
- Check logs: `docker compose logs postgres app`

### Uploads disappear after redeploy

- Confirm volume mount: `uploads_data:/app/public/uploads`
- In Dokploy, verify persistent volume is attached to the app service

### Prisma migration errors on startup

- Check postgres is reachable before app starts (`depends_on: service_healthy`)
- Run manually: `docker compose exec app npx prisma migrate status`
- Restore from backup if migration partially applied

### Permission errors on uploads

- Entrypoint runs `chown nextjs:nodejs` on `/app/public/uploads`
- Ensure volume is writable by UID 1001 (`nextjs`)
