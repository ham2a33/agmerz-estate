# Database Backup & Restore

This document describes the production backup workflow for AGMERZ ESTATE PostgreSQL.

## Important

A Docker volume is **persistent storage**, not a backup. If the volume is deleted, corrupted, or the host fails, data is lost unless external backups exist.

## Where data lives

| Environment | Location |
|---|---|
| Local Docker | Docker volume `agmerzestate_postgres_data` |
| Production VPS | Managed PostgreSQL or Docker volume on the server |

## Backup (recommended)

Run backups **outside** the application container and store them off-server when possible.

### Docker Compose (local / VPS)

```bash
docker compose exec -T postgres pg_dump \
  -U agmerz \
  -d agmerz_estate \
  --format=custom \
  --file=/tmp/agmerz_estate.backup

docker compose cp postgres:/tmp/agmerz_estate.backup ./backups/agmerz_estate-$(date +%Y%m%d-%H%M%S).backup
```

Plain SQL backup:

```bash
docker compose exec -T postgres pg_dump \
  -U agmerz \
  -d agmerz_estate > ./backups/agmerz_estate-$(date +%Y%m%d-%H%M%S).sql
```

### Production cron example

```bash
0 3 * * * cd /path/to/agmerz-estate && docker compose exec -T postgres pg_dump -U agmerz USER agmerz_estate > /var/backups/agmerz/agmerz_estate-$(date +\%Y\%m\%d).sql
```

Rotate old backups according to your retention policy.

## Restore

### From custom backup

```bash
docker compose exec -T postgres pg_restore \
  -U agmerz \
  -d agmerz_estate \
  --clean \
  --if-exists \
  /tmp/agmerz_estate.backup
```

### From SQL dump

```bash
docker compose exec -T postgres psql -U agmerz -d agmerz_estate < ./backups/agmerz_estate-YYYYMMDD.sql
```

Always test restore on a staging database before restoring production.

## Migrations

Apply migrations in production with:

```bash
npx prisma migrate deploy
```

Do **not** use:

```bash
npx prisma migrate dev
npx prisma db push
```

## Rollback considerations

Prisma migrations are forward-only by default.

If a migration fails in production:

1. Fix the migration issue in a new migration
2. Restore from backup only if the database is in an inconsistent state
3. Never run destructive SQL manually without a verified backup

## First production deploy checklist

1. Create PostgreSQL instance
2. Set `DATABASE_URL` in production environment
3. Run `npx prisma migrate deploy`
4. Run `npm run db:seed` once (if starting from empty DB)
5. Verify `GET /api/health`
6. Configure scheduled backups

## Verification after restore

```bash
curl https://your-domain/api/health
npx prisma migrate status
```

Expected health response:

```json
{
  "status": "ok",
  "database": "connected"
}
```
