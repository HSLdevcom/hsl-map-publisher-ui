const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

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

function getStops() {
  return getJson('stops');
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
  return deleteJson(`builds/${name}`);
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
