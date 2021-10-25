FROM node:12-alpine

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

ARG BUILD_ENV=prod
COPY .env.${BUILD_ENV} ${WORK}/.env.prod

RUN yarn build

CMD yarn run serve
