FROM node:8-alpine

ARG API_URL
ENV REACT_APP_API_URL ${API_URL}

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

EXPOSE 5000

CMD yarn serve
