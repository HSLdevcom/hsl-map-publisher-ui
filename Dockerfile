FROM node:8-alpine

ENV WORK /opt/publisher

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install app dependencies
COPY yarn.lock ${WORK}
COPY package.json ${WORK}
RUN yarn

# Bundle app source
COPY . ${WORK}
RUN yarn build

ARG BUILD_ENV=production
COPY .env.${BUILD_ENV} ${WORK}/.env

CMD yarn run serve
