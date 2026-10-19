#!/bin/sh

set -eu

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY is required. Generate it in the project .env before starting Docker." >&2
    exit 1
fi

if [ -z "${APP_URL:-}" ]; then
    echo "APP_URL is required. Set the production URL in the project .env before starting Docker." >&2
    exit 1
fi

if [ "${APP_ENV:-production}" != "production" ] || [ "${APP_DEBUG:-false}" != "false" ]; then
    echo "Docker production requires APP_ENV=production and APP_DEBUG=false." >&2
    exit 1
fi

mkdir -p \
    bootstrap/cache \
    database/sqlite \
    storage/app/public \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs

if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    sqlite_database="${DB_DATABASE:-/var/www/html/database/sqlite/database.sqlite}"

    case "$sqlite_database" in
        /*) ;;
        *) sqlite_database="/var/www/html/$sqlite_database" ;;
    esac

    mkdir -p "$(dirname "$sqlite_database")"
    touch "$sqlite_database"
    export DB_DATABASE="$sqlite_database"
fi

chown -R www-data:www-data bootstrap/cache database/sqlite storage
chmod -R u=rwX,g=rwX,o= bootstrap/cache database/sqlite storage
chmod -R o=rX storage/app/public

if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    chmod 660 "$DB_DATABASE"
fi

if [ ! -e public/storage ] && [ ! -L public/storage ]; then
    gosu www-data php artisan storage:link --no-interaction
fi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    gosu www-data php artisan migrate --force --no-interaction
fi

if [ "${RUN_USER_SEEDER:-false}" = "true" ]; then
    gosu www-data php artisan db:seed --class=UserSeeder --force --no-interaction
fi

if [ "${RUN_OPTIMIZE:-false}" = "true" ]; then
    gosu www-data php artisan optimize --no-interaction
fi

# The official PHP image drops FPM pool workers to www-data. Keep only the FPM
# master as root so it can open /proc/self/fd/2 and manage worker processes.
exec "$@"
