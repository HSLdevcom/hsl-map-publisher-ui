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

# Per-environment runtime config for docker/generate-config.sh: only the REACT_APP_* keys
# (the .env.* files also carry empty Cypress test credential names).
RUN mkdir -p /opt/runtime-env && \
  for f in .env.dev .env.prod; do grep '^REACT_APP_' "${WORK}/${f}" > "/opt/runtime-env/${f}"; done

ARG BUILD_ENV=prod
RUN find ${WORK} -maxdepth 1 -name ".env*" -delete
COPY .env.${BUILD_ENV} ${WORK}/.env.production

RUN npm run build

# Serve the built static files with nginx. It stays on the stock root master process
# because k8s (map-publisher-ui.yaml) expects port 80; nginx workers drop to the nginx user.
FROM nginx:1-alpine AS production
# checkov:skip=CKV_DOCKER_3: stock nginx image must bind port 80 as root; workers run as nginx
COPY --from=builder /opt/publisher/build /usr/share/nginx/html
# The stock nginx entrypoint runs /docker-entrypoint.d/*.sh at start: this one writes
# config.js from APP_ENV (dev|prod) and REACT_APP_* env vars, so one image serves every env.
COPY --from=builder /opt/runtime-env /etc/publisher-ui
COPY --chmod=755 docker/generate-config.sh /docker-entrypoint.d/40-publisher-ui-config.sh
