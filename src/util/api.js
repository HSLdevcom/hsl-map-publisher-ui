import { execute, makePromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import get from 'lodash/get';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

async function getJson(path) {
  const response = await fetch(`${API_URL}/${path}`);
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
}

async function postJson(path, body) {
  const options = { method: 'POST', body: JSON.stringify(body) };
  const response = await fetch(`${API_URL}/${path}`, options);
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
}

async function putJson(path, body) {
  const options = { method: 'PUT', body: JSON.stringify(body) };
  const response = await fetch(`${API_URL}/${path}`, options);
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
}

async function deleteJson(path) {
  const options = { method: 'DELETE' };
  const response = await fetch(`${API_URL}/${path}`, options);
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
}

async function getStops() {
  const joreGraphqlUrl = 'http://0.0.0.0:5000/jore/graphql'; // 'http://0.0.0.0:5000/jore/graphql';
  const link = new HttpLink({ uri: joreGraphqlUrl });

  const operation = {
    query: gql`
      {
        allStops {
          nodes {
            stopId
            shortId
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
    console.log(err);
    stopData = [];
  }

  return get(stopData, 'data.allStops.nodes', []);
}

function getBuilds() {
  return getJson('builds');
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

function addPosters({ buildId, component, props }) {
  return postJson('posters', { buildId, props, component });
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
  getBuild,
  addBuild,
  updateBuild,
  removeBuild,
  addPosters,
  removePoster,
  downloadPoster,
  downloadBuild,
};
