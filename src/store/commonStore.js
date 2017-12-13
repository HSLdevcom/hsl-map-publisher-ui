import { observable } from 'mobx';
import {
  getStops,
  getBuilds,
  addBuild,
  updateBuild,
  addPosters,
} from '../util/api';

const store = observable({
  confirm: null,
  prompt: null,
  stops: [],
  builds: [],
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
    store.showConfirm(`Tulosteiden lataaminen epäonnistui: ${error.message}`);
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

store.addPosters = async (buildId, component, props) => {
  try {
    await addPosters({ buildId, component, props });
  } catch (error) {
    store.showConfirm(`Lisääminen epäonnistui: ${error.message}`);
    console.error(error); // eslint-disable-line no-console
  }
  store.getBuilds();
};

export default store;
