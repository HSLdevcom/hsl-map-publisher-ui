import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import get from 'lodash/get';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const JORE_API_URL =
  process.env.REACT_APP_JORE_API_URL || 'http://0.0.0.0:5000/jore/graphql';

async function createRequest(path, method = 'GET', body) {
  const options =
    method === 'GET'
      ? {}
      : {
          method,
          body: JSON.stringify(body),
        };

  const response = await fetch(`${API_URL}/${path}`, options);

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }

  return response.json();
}

async function getJson(path) {
  return createRequest(path);
}

async function postJson(path, body) {
  return createRequest(path, 'POST', body);
}

async function putJson(path, body) {
  return createRequest(path, 'PUT', body);
}

async function deleteJson(path) {
  return createRequest(path, 'DELETE');
}

async function getStops() {
  // This is so far the only place that uses graphql.
  const link = new HttpLink({ uri: JORE_API_URL });

  const operation = {
    query: gql`
      {
        allStops {
          nodes {
            stopId
            shortId
            nameFi
            posterCount
            drivebyTimetable
            stopType
            distributionArea
            distributionOrder
            stopZone
            stopTariff
          }
        }
      }
    `,
  };

  let stopData;

  try {
    stopData = await makePromise(execute(link, operation));
  } catch (err) {
    throw new Error(err.message);
  }

  return get(stopData, 'data.allStops.nodes', []);
}

function getBuilds() {
  return getJson('builds');
}

function getTemplates() {
  return getJson('templates');
}

function addTemplate({ label }) {
  return postJson('templates', { label });
}

function saveTemplate(template) {
  return putJson('templates', template);
}

function removeTemplate({ id }) {
  return deleteJson(`templates/${id}`);
}

function getImages() {
  return getJson('images');
}

function removeImage({ name }) {
  return deleteJson(`images/${name}`);
}

function getBuild({ id }) {
  return getJson(`builds/${id}`);
}

function addBuild({ title }) {
  return postJson('builds', { title });
}

function updateBuild({ id, status }) {
  return putJson(`builds/${id}`, { status });
}

function removeBuild({ id }) {
  return deleteJson(`builds/${id}`);
}

function addPosters({ buildId, component, template, props }) {
  return postJson('posters', { buildId, props, template, component });
}

function removePoster({ id }) {
  return deleteJson(`posters/${id}`);
}

function downloadPoster({ id }) {
  window.open(`${API_URL}/downloadPoster/${id}`, '_blank');
}

function downloadBuild({ id }) {
  window.open(`${API_URL}/downloadBuild/${id}`, '_blank');
}

export {
  getStops,
  getBuilds,
  getImages,
  removeImage,
  getTemplates,
  addTemplate,
  saveTemplate,
  removeTemplate,
  getBuild,
  addBuild,
  updateBuild,
  removeBuild,
  addPosters,
  removePoster,
  downloadPoster,
  downloadBuild,
};
