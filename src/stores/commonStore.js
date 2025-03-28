import { observable, toJS } from 'mobx';
import {
  getStops,
  getTerminals,
  getBuilds,
  getBuild,
  addBuild,
  updateBuild,
  removeBuild,
  addPosters,
  removePoster,
  cancelPoster,
  getTemplates,
  addTemplate,
  saveTemplate,
  removeTemplate,
  getImages,
  removeImage,
  getAllLines,
} from '../util/api';
import get from 'lodash/get';
import { filter, isEmpty, some } from 'lodash';
import reduce from 'lodash/reduce';
import generatorStore from './generatorStore';
import {
  compareLineNameOrder,
  shortenTrainParsedLineId,
  TRANSPORTATION_MODES,
} from '../util/lines';

const store = observable({
  confirm: null,
  prompt: null,
  stops: [],
  terminals: [],
  builds: [],
  selectedBuild: null,
  stopFilter: '',
  showOnlyCheckedStops: false,
  routeFilter: '',
  templates: [],
  images: [],
  selectedTemplate: null,
  prevSavedTemplate: null,
  lines: [],
  lineQuery: '',
  stopModeFilter: '',
  get currentTemplate() {
    const { selectedTemplate, templates } = store;
    const currentTemplate = templates.find(template => template.id === selectedTemplate);
    return currentTemplate || templates[0];
  },
  get ruleTemplates() {
    return store.templates.filter(t => !isEmpty(t.rules));
  },
  get templateIsDirty() {
    const { currentTemplate } = store;
    const serializedTemplate = store.serializeCurrentTemplate(currentTemplate);
    const isDirty = serializedTemplate !== store.prevSavedTemplate;
    return isDirty;
  },
});

store.serializeCurrentTemplate = (template = store.currentTemplate) => {
  const pickProps = ['id', 'label', 'areas', 'rules']; // We only want these props from
  // the template.

  const currentTemplatePlain = reduce(
    toJS(template),
    (picked, value, key) => {
      // Pick the prop if whitelisted above
      if (pickProps.includes(key)) {
        // eslint-disable-next-line no-param-reassign
        picked[key] = value;
      }

      // Also pick name and size props from slots.
      if (key === 'areas') {
        // eslint-disable-next-line no-param-reassign
        picked.areas = picked.areas.map(area =>
          area.slots.map(({ image, size }) => ({ image: get(image, 'name', null), size })),
        );
      }

      return picked;
    },
    {},
  );

  return JSON.stringify(currentTemplatePlain);
};

store.setStopFilter = value => {
  const shortIdRegexp = /([a-zA-Z]{1,2})\s*([0-9]{4})\s*,?\s+/g;
  store.stopFilter = value.replace(shortIdRegexp, '$1$2, ');
};

store.setShowOnlyCheckedStops = value => {
  store.showOnlyCheckedStops = value;
};

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
    const build = await getBuild({ id });
    store.sortPosters(build.posters);
    store.selectedBuild = build;
  } catch (error) {
    store.showConfirm(`Tietojen lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.refreshBuild = async () => {
  if (!store.selectedBuild) return;
  try {
    const build = await getBuild({ id: store.selectedBuild.id });
    store.sortPosters(build.posters);
    store.selectedBuild = build;
  } catch (error) {
    store.selectedBuild = null;
    store.showConfirm(`Tietojen lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.sortPosters = posters => {
  posters.sort((a, b) => (a.order > b.order ? 1 : -1));
};

store.clearBuild = () => {
  store.selectedBuild = null;
};

store.getStops = async () => {
  try {
    store.stops = (await getStops())
      // Users are used to shortIds without any space
      .map(stop => ({
        ...stop,
        shortId: stop.shortId.replace(' ', ''),
      }));
  } catch (error) {
    store.showConfirm(`Pysäkkien lataaminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
};

store.getTerminals = async () => {
  try {
    const terminals = await getTerminals();
    store.terminals = terminals.map(terminal => ({
      ...terminal,
      stops: terminal.stops.nodes.map(s => s.stopId),
    }));
  } catch (error) {
    store.showConfirm(`Terminaalien lataaminen epäonnistui: ${error.message}`);
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
  store.showConfirm('Haluatko varmasti poistaa kuvan?', callback);
};

store.removeTemplate = async id => {
  const callback = async () => {
    try {
      await removeTemplate({ id });

      if (store.selectedTemplate === id) {
        store.selectedTemplate = get(store, 'templates[0].id', null);
      }
      generatorStore.setSelectedRuleTemplates(
        generatorStore.selectedRuleTemplates.filter(r => r !== id),
      );
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      store.showConfirm(`Sommittelun poistaminen epäonnistui: ${error.message}`);
    }
    store.getTemplates();
  };
  store.showConfirm('Haluatko varmasti poistaa sommittelun?', callback);
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

store.setSavedTemplate = (serializedTemplate = store.serializeCurrentTemplate()) => {
  store.prevSavedTemplate = serializedTemplate;
};

store.saveTemplate = async template => {
  try {
    await saveTemplate(template);
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    store.showConfirm(`Sommittelun tallennus epäonnistui: ${error.message}`);
  }

  await store.getTemplates();
  await store.getImages();

  store.setSavedTemplate(store.serializeCurrentTemplate());
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

store.cancelPoster = async id => {
  try {
    await cancelPoster({ id });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
  store.refreshBuild();
};

store.setUser = user => {
  store.user = user;
};

store.getUser = () => store.user;

store.setRouteFilter = value => {
  store.routeFilter = value;
};

store.setLineQuery = async query => {
  store.lineQuery = query;
  const results = await store.getLines();
  store.lines = results;
};

store.getLines = async () => {
  const { data } = await getAllLines();
  const filteredLines = filter(
    data.allLines.nodes,
    line =>
      line.lineId.toLowerCase().includes(store.lineQuery.toLowerCase()) ||
      line.nameFi.toLowerCase().includes(store.lineQuery.toLowerCase()),
  );

  const checkedLines = filteredLines.map(line => {
    if (some(line.routes.nodes, route => route.mode === TRANSPORTATION_MODES.RAIL)) {
      return { ...line, lineIdParsed: shortenTrainParsedLineId(line.lineIdParsed) };
    }
    return line;
  });

  const sortedLines = checkedLines.sort(compareLineNameOrder);

  return sortedLines;
};

store.setStopModeFilter = newValue => {
  store.stopModeFilter = newValue;
};

export default store;
