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

# Serve the built static files with nginx. It stays on the stock root master process
# because k8s (map-publisher-ui.yaml) expects port 80; nginx workers drop to the nginx user.
FROM nginx:1-alpine AS production
# checkov:skip=CKV_DOCKER_3: stock nginx image must bind port 80 as root; workers run as nginx
COPY --from=builder /opt/publisher/build /usr/share/nginx/html
