#!/bin/sh

set -e

# use sh version of wait-for-it
# https://gist.github.com/yahyaergun/597d787c6aeffd495e9eaa8b3fdd8e96
sh ./wait-for-it.sh "$DB_HOST:$DB_PORT"

# run migration
./node_modules/.bin/typeorm -d ./dist/typeorm.config.js migration:run

# execute command
exec "$@"
