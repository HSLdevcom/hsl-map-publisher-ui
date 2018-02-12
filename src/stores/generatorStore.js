import { observable, observe } from 'mobx';
import moment from 'moment';

import { stopsToRows, stopsToGroupRows } from '../util/stops';

import commonStore from './commonStore';

const componentsByLabel = {
  Pysäkkijuliste: 'StopPoster',
  Aikataulu: 'Timetable',
};

const rowTypesByLabel = {
  Pysäkit: 'stop',
  Ajolistat: 'group',
};

const store = observable({
  rows: [],
  componentsByLabel,
  rowTypesByLabel,
  component: 'StopPoster',
  rowType: 'stop',
  date: new Date(),
  dateBegin: null,
  dateEnd: null,
  isSummerTimetable: false,
  buildId: null,
  timetableAsA4Format: true,
  timetableAsGreyscale: false,
});

store.setComponent = value => {
  store.component = value;
};

store.setTimetableA4Format = value => {
  store.timetableAsA4Format = value;
};

store.setTimetableGreyscale = value => {
  store.timetableAsGreyscale = value;
};

store.setRowType = value => {
  store.rowType = value;
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

store.setChecked = (rows, isChecked) => {
  rows.forEach(row => {
    if (store.rows.includes(row)) {
      row.isChecked = isChecked; // eslint-disable-line no-param-reassign
    }
  });
};

store.resetRows = () => {
  if (store.rowType === 'stop') {
    store.rows = stopsToRows(commonStore.stops);
  } else {
    store.rows = stopsToGroupRows(commonStore.stops);
  }
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
      printTimetablesAsA4:
        store.timetableAsA4Format &&
        store.component === componentsByLabel.Aikataulu,
      printTimetablesAsGreyscale:
        store.timetableAsGreyscale &&
        store.component === componentsByLabel.Aikataulu,
    }));
  store.resetRows();
  commonStore.addPosters(store.buildId, store.component, props);
};

observe(commonStore, 'stops', () => store.resetRows());
observe(store, 'rowType', () => store.resetRows());

export default store;
