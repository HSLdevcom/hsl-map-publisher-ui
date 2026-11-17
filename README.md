# HSL Map Publisher UI

React UI for `hsl-map-publisher`

## Development

Requires Node 24 (see `.nvmrc`).

Install dependencies:

```sh
npm install
```

Start development server:

```sh
npm start
```

Open [http://localhost:3000/](http://localhost:3000/)

Lint, run unit tests and build (the same command CI runs):

```sh
npm run check-and-build
```

## Running in Docker

```sh
docker build --target production -t hsl-map-publisher-ui .
docker run -d -p 80:80 -e APP_ENV=dev hsl-map-publisher-ui
```

One image serves every environment. At container start,
`docker/generate-config.sh` writes `config.js` (`window.PublisherUiConfig`, read by
`src/config.js`):

- `APP_ENV=dev|prod` loads the `REACT_APP_*` values of `.env.<APP_ENV>`.
- Any `REACT_APP_*` environment variable overrides a single value.
- Values left unset fall back to the ones baked in at build time (`.env.prod`).

## Releases

CI (`.github/workflows/ci-cd.yml`) publishes `hsldevcom/hsl-map-publisher-ui:edge` from `main`
and version tags from `v*` git tags. To release, run `npm version <x.y.z>` and
`git push --follow-tags`.
