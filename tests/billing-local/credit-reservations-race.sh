#!/usr/bin/env bash
# Concurrent same-key reserve: the second caller must wait on the per-user
# lock, then return 'ok' without a second hold. Local Docker Postgres only.
set -euo pipefail
C="-X -h 127.0.0.1 -p 55440 -U postgres -d postgres -v ON_ERROR_STOP=1 -tA"
export PGPASSWORD=local
docker run --rm -d --name kl-billing-race -e POSTGRES_PASSWORD=local -p 127.0.0.1:55440:5432 postgres:16 >/dev/null
trap 'docker rm -f kl-billing-race >/dev/null 2>&1' EXIT
for _ in $(seq 1 30); do psql $C -c "select 1" >/dev/null 2>&1 && break; sleep 2; done
psql $C -q -f tests/billing-local/credit-reservations.sql >/dev/null
U=00000000-0000-4000-8000-000000000002
psql $C -c "insert into auth.users values ('$U'); insert into user_credits(user_id,balance) values ('$U',5);" >/dev/null
psql $C -c "begin; select reserve_credits('$U','race',3); select pg_sleep(3); commit;" >/dev/null &
sleep 1
second=$(psql $C -c "select reserve_credits('$U','race',3);")
wait
balance=$(psql $C -c "select balance from user_credits where user_id='$U';")
holds=$(psql $C -c "select count(*) from credit_txns where user_id='$U' and action='reserve';")
echo "second=$second balance=$balance holds=$holds"
[ "$second" = ok ] && [ "$balance" = 2 ] && [ "$holds" = 1 ] && echo PASS || { echo FAIL; exit 1; }
