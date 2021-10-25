HSL Map Publisher UI
====================

React UI for `hsl-map-publisher`

### Development

Install dependencies:

```
yarn
```

Start development server:
```
yarn start
```

Open [http://localhost:3000/](http://localhost:3000/)

### Running in Docker

```
docker build --build-arg API_URL=$API_URL -t hsl-map-publisher-ui .
docker run -d -p 3000:3000 hsl-map-publisher-ui
```

where `$API_URL` is URL to publisher REST API.
 
Changes for test commit
