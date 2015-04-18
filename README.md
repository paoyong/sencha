# Pyramus
## About
Reddit clone using React components and PostgresQL database.

*Special thanks to the `#postgresql` irc group for the immense help in my SQL!*

## Non-NPM Requirements
* PostgresQL
* iojs

## Installation
1. `npm update`
2. `psql -U postgres -a -f server/psql_scripts.sql` to build PostgresQL schema
3. `npm run build` to build \*.bundle.js files.
4. `npm start`

## Todo

* Caching queries to improve website load times.
* Reducing size of webpack bundles.
