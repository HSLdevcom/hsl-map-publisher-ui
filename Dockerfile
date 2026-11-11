FROM hsldevcom/infodevops-docker-base-images:1.1.0-24-node AS builder

ENV WORK=/opt/publisher
# Cypress is only used for local/e2e testing; skip its binary download in image builds.
ENV CYPRESS_INSTALL_BINARY=0

WORKDIR ${WORK}

# Install app dependencies
COPY package.json package-lock.json ${WORK}/
RUN npm ci

# Bundle app source
COPY . ${WORK}

ARG BUILD_ENV=prod
RUN find ${WORK} -maxdepth 1 -name ".env*" -delete
COPY .env.${BUILD_ENV} ${WORK}/.env.production

RUN npm run build

# Serve the built static files with nginx
FROM nginx:1-alpine AS production
COPY --from=builder /opt/publisher/build /usr/share/nginx/html
