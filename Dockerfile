FROM node:12-alpine as builder

ENV WORK /opt/publisher

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install app dependencies
COPY package.json yarn.lock ${WORK}/
RUN yarn && yarn cache clean

# Bundle app source
COPY . ${WORK}

ARG BUILD_ENV=prod
COPY .env.${BUILD_ENV} ${WORK}/.env.production

RUN yarn build

FROM node:12-alpine

ENV WORK /opt/publisher

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install serve from app dependencies
COPY package.json yarn.lock ${WORK}/
RUN npm install serve --no-save

# Copy builded files from builder
COPY --from=builder /opt/publisher/build build/

CMD npm run serve
