import { observable } from 'mobx';
import { getStops, getBuilds, addBuild, addPosters } from '../util/api';

const store = observable({
  message: null,
  stops: [],
  builds: [],
});

store.getStops = async () => {
  try {
    store.stops = await getStops();
  } catch (error) {
    store.message = `Pysäkkien lataaminen epäonnistui: ${error.message}`;
    console.error(error); // eslint-disable-line no-console
  }
};

store.getBuilds = async () => {
  try {
    store.builds = await getBuilds();
  } catch (error) {
    store.message = `Tulosteiden lataaminen epäonnistui: ${error.message}`;
    console.error(error); // eslint-disable-line no-console
  }
};

store.addBuild = async () => {
  const title = prompt('Anna nimi tulostelistalle'); // eslint-disable-line
  if (!title) return;

  try {
    const { id } = await addBuild({ title });
    store.selectedBuildId = id;
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
    store.message = `Listan lisääminen epäonnistui: ${error.message}`;
  }
  store.getBuilds();
};

store.addPosters = async (buildId, component, props) => {
  try {
    await addPosters({ buildId, component, props });
  } catch (error) {
    store.message = `Lisääminen epäonnistui: ${error.message}`;
    console.error(error); // eslint-disable-line no-console
  }
};

store.getStops();
store.getBuilds();

export default store;
