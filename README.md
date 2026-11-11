HSL Map Publisher UI
====================

React UI for `hsl-map-publisher`

### Development

Requires Node 24 (see `.nvmrc`).

Install dependencies:

```
npm install
```

Start development server:
```
npm start
```

Open [http://localhost:3000/](http://localhost:3000/)

Lint, run unit tests and build (the same command CI runs):
```
npm run check-and-build
```

### Running in Docker

```
docker build --target production --build-arg BUILD_ENV=dev -t hsl-map-publisher-ui .
docker run -d -p 80:80 hsl-map-publisher-ui
```

`BUILD_ENV` selects which `.env.<BUILD_ENV>` file is baked into the bundle (default `prod`).

### Releases

CI (`.github/workflows/ci-cd.yml`) publishes `hsldevcom/hsl-map-publisher-ui:edge` from `main`
and version tags from `v*` git tags. To release, run `npm version <x.y.z>` and
`git push --follow-tags`.
