# Spotify Next

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development

```bash
yarn dev
```

Open [http://localhost:8080](http://localhost:8080)

### Prisma

- Prisma Client workflow: https://res.cloudinary.com/prismaio/image/upload/v1628764839/docs/aRJmVFY_osasel.png
- Prototyping/deving schema: https://www.prisma.io/docs/guides/database/prototyping-schema-db-push
- Migrate: https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-node-mysql

### Auth

- https://nextjs.org/docs/authentication#bring-your-own-database
- https://github.com/vvo/iron-session#usage-nextjs
- https://github.com/vercel/next.js/tree/canary/examples/with-iron-session
- https://github.com/vvo/iron-session#coding-best-practices

### Queries

#### Recently Played Tracks

```sql
SELECT "Track".name, "Play"."playedAt" FROM "Track"
JOIN "Play" ON "Track".id="Play"."trackId"
WHERE "Play"."userId"=1
ORDER BY "Play"."playedAt" DESC;
```

### TODOs

- Address style warning nextjs is showing
- PGAdmin says the play.playedAt field is a "timestamp without time zone"?
- Logger
- API request logging
- Indexes for queries
- Implement SWR
- Error handling (both on the server and client-side pages/notifications/states)
- Review [nextjs production docs](https://nextjs.org/docs/going-to-production)
- K8s at some point
  - Clues for curling to a service: https://stackoverflow.com/questions/64222131/kubernetes-cronjob-to-call-rest-api-using-curl-with-headers-is-failing-with-curl

### Dev Sync

Since crontab permissions were such a bitch, its easiest to use a 'hacky cron' via a script that sleeps:

```bash
# Run the sync command every 15 minutes
# Source: https://askubuntu.com/questions/430382/repeat-a-command-every-x-interval-of-time-in-terminal
while true; do ./src/jobs/sync-spotify-plays.sh; sleep 900; done;
```

Notes on Syncing:

- Syncing every 15 minutes seems very frequent on first glance,
  given that most runs report new plays in the single digits
- HOWEVER, ive also seen spotify throw {statusCode: 503, error: temporarily_unavailable} errors on some syncs, so maybe more often is better to counteract this. Could also consider implementing retries at some point...
