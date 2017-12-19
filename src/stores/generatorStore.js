import { observable, observe } from 'mobx';
import moment from 'moment';

import { stopsToRows, stopsToGroupRows } from '../util/stops';

import commonStore from './commonStore';

const componentsByType = {
  Pysäkkijuliste: {
    name: 'StopPoster',
    filter: stop => stop.hasShelter,
  },
  Aikataulu: {
    name: 'Timetable',
    filter: stop => !stop.hasShelter,
  },
};

const rowFactoriesByType = {
  Pysäkit: {
    factory: stops => stopsToRows(stops),
  },
  Ajolistat: {
    factory: stops => stopsToGroupRows(stops),
  },
};

const store = observable({
  rows: [],
  componentsByType,
  rowFactoriesByType,
  component: null,
  rowFactory: null,
  date: new Date(),
  dateBegin: null,
  dateEnd: null,
  isSummerTimetable: false,
  buildId: null,
});

store.setComponent = value => {
  store.component = value;
};

store.setRowFactory = value => {
  store.rowFactory = value;
};

store.setDate = value => {
  store.date = value;
};

store.setDateBegin = value => {
  store.dateBegin = value;
};

store.setDateEnd = value => {
  store.dateEnd = value;
};

store.setIsSummerTimetable = value => {
  store.isSummerTimetable = !!value;
};

store.setChecked = (row, isChecked) => {
  if (store.rows.includes(row)) {
    row.isChecked = isChecked; // eslint-disable-line no-param-reassign
  }
};

store.resetRows = () => {
  const visibleStops = commonStore.stops.filter(store.component.filter);
  store.rows = store.rowFactory.factory(visibleStops);
};

store.setBuildId = id => {
  store.buildId = id;
};

store.generate = () => {
  const format = date => moment(date).format('YYYY-MM-DD');
  const props = store.rows
    .filter(({ isChecked }) => isChecked)
    .reduce((prev, { stopIds }) => [...prev, ...stopIds], [])
    .map(stopId => ({
      stopId,
      date: format(store.date),
      isSummerTimetable: store.isSummerTimetable,
      dateBegin: store.dateBegin ? format(store.dateBegin) : null,
      dateEnd: store.dateEnd ? format(store.dateEnd) : null,
    }));
  store.resetRows();
  commonStore.addPosters(store.buildId, store.component.name, props);
};

store.setComponent(Object.values(store.componentsByType)[0]);
store.setRowFactory(Object.values(store.rowFactoriesByType)[0]);

observe(commonStore, 'stops', () => store.resetRows());
observe(store, 'component', () => store.resetRows());
observe(store, 'rowFactory', () => store.resetRows());

export default store;
