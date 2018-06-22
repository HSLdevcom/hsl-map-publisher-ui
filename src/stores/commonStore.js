import { observable } from 'mobx';
import {
  getStops,
  getBuilds,
  getBuild,
  addBuild,
  updateBuild,
  removeBuild,
  addPosters,
  removePoster,
  getTemplates,
  addTemplate,
  saveTemplate,
  removeTemplate,
  getImages,
  removeImage,
} from '../util/api';
import get from 'lodash/get';

const store = observable({
  confirm: null,
  prompt: null,
  stops: [],
  builds: [],
  selectedBuild: null,
  templates: [],
  images: [],
  selectedTemplate: null,
  get currentTemplate() {
    const { selectedTemplate, templates } = store;
    const currentTemplate = templates.find(template => template.id === selectedTemplate);

    return currentTemplate || templates[0];
  },
});

store.showConfirm = (message, callback = null) => {
  const confirmCallback = ({ isCancelled }) => {
    store.confirm = null;
    if (!isCancelled && callback) callback();
  };
  store.confirm = {
    message,
    callback: confirmCallback,
    allowCancel: !!callback,
  };
};

store.showPrompt = (message, callback, defaultValue = '') => {
  const promptCallback = ({ isCancelled, value }) => {
    store.prompt = null;
    if (!isCancelled && value) callback(value);
  };
  store.prompt = {
    message,
    callback: promptCallback,
    defaultValue,
  };
};

store.showBuild = async id => {
  try {
    store.selectedBuild = await getBuild({ id });
  } catch (error) {
    store.showConfirm(`Tietojen lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.refreshBuild = async () => {
  if (!store.selectedBuild) return;
  try {
    store.selectedBuild = await getBuild({ id: store.selectedBuild.id });
  } catch (error) {
    store.selectedBuild = null;
    store.showConfirm(`Tietojen lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.clearBuild = () => {
  store.selectedBuild = null;
};

store.getStops = async () => {
  try {
    store.stops = await getStops();
  } catch (error) {
    store.showConfirm(`Pysäkkien lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.getBuilds = async () => {
  try {
    store.builds = await getBuilds();
  } catch (error) {
    store.showConfirm(`Tietojen lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.addBuild = async () => {
  const callback = async title => {
    try {
      const { id } = await addBuild({ title });
      store.selectedBuildId = id;
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      store.showConfirm(`Listan lisääminen epäonnistui: ${error.message}`);
    }
    store.getBuilds();
  };
  store.showPrompt('Anna nimi tulostelistalle', callback);
};

store.updateBuild = async ({ id, status }) => {
  try {
    await updateBuild({ id, status });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    store.showConfirm(`Listan päivitys epäonnistui: ${error.message}`);
  }
  store.getBuilds();
};

store.removeBuild = async id => {
  const callback = async () => {
    try {
      await removeBuild({ id });
      if (store.selectedBuildId === id) {
        store.selectedBuildId = null;
      }
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      store.showConfirm(`Listan poistaminen epäonnistui: ${error.message}`);
    }
    store.getBuilds();
  };
  store.showConfirm('Haluatko varmasti poistaa listan?', callback);
};

store.removeImage = async name => {
  const callback = async () => {
    try {
      await removeImage({ name });
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      store.showConfirm(`Kuvan poistaminen epäonnistui: ${error.message}`);
    }
    store.getImages();
  };
  store.showConfirm('Haluatko varmasti poistaa kuvaa?', callback);
};

store.removeTemplate = async id => {
  const callback = async () => {
    try {
      await removeTemplate({ id });

      if (store.selectedTemplate === id) {
        store.selectedTemplate = get(store, 'templates[0].id', null);
      }
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      store.showConfirm(`Sommittelun poistaminen epäonnistui: ${error.message}`);
    }
    store.getTemplates();
  };
  store.showConfirm('Haluatko varmasti poistaa sommittelua?', callback);
};

store.getTemplates = async () => {
  try {
    store.templates = await getTemplates();
  } catch (error) {
    store.showConfirm(`Tietojen lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.addTemplate = async () => {
  const callback = async label => {
    try {
      const { id } = await addTemplate({ label });
      store.selectedTemplate = id;
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      store.showConfirm(`Sommittelun lisääminen epäonnistui: ${error.message}`);
    }
    store.getTemplates();
  };
  store.showPrompt('Anna nimi sommittelulle', callback);
};

store.selectTemplate = id => {
  store.selectedTemplate = id;
};

store.saveTemplate = async template => {
  try {
    await saveTemplate(template);
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    store.showConfirm(`Sommittelun tallennus epäonnistui: ${error.message}`);
  }

  store.getTemplates();
  store.getImages();
};

store.getImages = async () => {
  try {
    store.images = await getImages();
  } catch (error) {
    store.showConfirm(`Tietojen lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.addPosters = async (buildId, component, props) => {
  try {
    await addPosters({
      buildId,
      component,
      props,
      template: get(store, 'currentTemplate.id', 'default_footer'),
    });
  } catch (error) {
    store.showConfirm(`Julisteen lisääminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
  store.getBuilds();
};

store.removePoster = async id => {
  const callback = async () => {
    try {
      await removePoster({ id });
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      store.showConfirm(`Julisteen poistaminen epäonnistui: ${error.message}`);
    }
    store.refreshBuild();
  };
  store.showConfirm('Haluatko varmasti poistaa julisteen?', callback);
};

export default store;
