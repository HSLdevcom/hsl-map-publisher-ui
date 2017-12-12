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

function getStops() {
  return getJson('stops');
}

function getBuilds() {
  return getJson('builds');
}

function addBuild({ title }) {
  return postJson('builds', { title });
}

function addPosters({ buildId, component, props }) {
  return postJson('posters', { buildId, props, component });
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
  addBuild,
  addPosters,
  downloadPoster,
  downloadBuild,
};
