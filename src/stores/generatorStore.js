import { observable } from 'mobx';
import moment from 'moment';

import { stopsToRows, stopsToGroupRows, getVisibleRows } from '../util/stops';

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
  checkedRows: [],
  selectedRuleTemplates: [],
  mapZones: true,
  mapZoneSymbols: true,
  minimapZones: true,
  minimapZoneSymbols: true,
  get rows() {
    let rows = [];

    if (store.rowType === 'stop') {
      rows = stopsToRows(commonStore.stops);
    } else {
      rows = stopsToGroupRows(commonStore.stops);
    }

    return getVisibleRows(rows, commonStore.stopFilter);
  },
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

store.setChecked = (rows = [], isChecked) => {
  const rowIds = rows.map(row => row.rowId);

  if (isChecked) {
    store.checkedRows = [...store.checkedRows.slice(), ...rowIds];
  } else {
    store.checkedRows = store.checkedRows.filter(rowId => !rowIds.includes(rowId));
  }
};

store.resetChecked = () => {
  store.checkedRows = [];
};

store.setSelectedRuleTemplates = value => {
  store.selectedRuleTemplates = value;
};

store.setBuildId = id => {
  store.buildId = id;
};

store.setMapZones = () => {
  store.mapZones = !store.mapZones;
};

store.setMapZoneSymbols = () => {
  store.mapZoneSymbols = !store.mapZoneSymbols;
};

store.setMinimapZones = () => {
  store.minimapZones = !store.minimapZones;
};

store.setMinimapZoneSymbols = () => {
  store.minimapZoneSymbols = !store.minimapZoneSymbols;
};

store.generate = () => {
  const user = commonStore.getUser();
  const routeFilter = commonStore.routeFilter;
  const format = date => moment(date).format('YYYY-MM-DD');
  const props = store.rows
    .filter(({ rowId }) => store.checkedRows.includes(rowId))
    .reduce((prev, { stopIds }) => [...prev, ...stopIds], [])
    .map(stopId => ({
      stopId,
      date: format(store.date),
      isSummerTimetable: store.isSummerTimetable,
      dateBegin: store.dateBegin ? format(store.dateBegin) : null,
      dateEnd: store.dateEnd ? format(store.dateEnd) : null,
      printTimetablesAsA4:
        store.timetableAsA4Format && store.component === componentsByLabel.Aikataulu,
      printTimetablesAsGreyscale:
        store.timetableAsGreyscale && store.component === componentsByLabel.Aikataulu,
      selectedRuleTemplates: store.selectedRuleTemplates,
      mapZones: store.component === 'StopPoster' ? store.mapZones : null,
      mapZoneSymbols: store.component === 'StopPoster' ? store.mapZoneSymbols : null,
      minimapZones: store.component === 'StopPoster' ? store.minimapZones : null,
      minimapZoneSymbols: store.component === 'StopPoster' ? store.minimapZoneSymbols : null,
      user,
      routeFilter,
    }));

  store.resetChecked();
  commonStore.addPosters(store.buildId, store.component, props);
};

export default store;
