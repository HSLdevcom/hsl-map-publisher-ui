#!/bin/bash

set -e

ORG=${ORG:-hsldevcom}

read -p "Tag: " TAG

DOCKER_TAG=${TAG:-production}
DOCKER_IMAGE=$ORG/hsl-map-publisher-ui:${DOCKER_TAG}
DOCKER_IMAGE_CYPRESS=$ORG/publisher-ui-e2e:dev

docker build --build-arg BUILD_ENV=${TAG:-production} -t $DOCKER_IMAGE .
docker push $DOCKER_IMAGE

if [[ $DOCKER_TAG == "dev" ]]; then
  docker build --build-arg BUILD_ENV=dev -t $DOCKER_IMAGE_CYPRESS -f e2e.dockerfile .
  docker push $DOCKER_IMAGE_CYPRESS
fi
