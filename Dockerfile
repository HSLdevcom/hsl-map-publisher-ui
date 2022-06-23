FROM node:16-alpine as builder

ENV WORK /opt/publisher

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install app dependencies
COPY package.json yarn.lock ${WORK}/
RUN yarn

# Bundle app source
COPY . ${WORK}

ARG BUILD_ENV=prod
COPY .env.${BUILD_ENV} ${WORK}/.env.production

RUN yarn build

# Copy builded files from builder to nginx
FROM nginx:1.21-alpine
COPY --from=builder /opt/publisher/build /usr/share/nginx/html
