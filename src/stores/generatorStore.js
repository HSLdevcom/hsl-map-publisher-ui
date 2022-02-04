import { observable } from 'mobx';
import moment from 'moment';

import { stopsToRows, stopsToGroupRows, stopsToTerminalRows, getVisibleRows } from '../util/stops';

import commonStore from './commonStore';

const componentsByLabel = {
  Pysäkkijuliste: 'StopPoster',
  Aikataulu: 'Timetable',
  PysäkkijulisteA3: 'A3StopPoster',
  Terminaalijuliste: 'TerminalPoster',
};

export const componentsWithMapOptions = ['StopPoster', 'TerminalPoster'];

const rowTypesByLabel = {
  Pysäkit: 'stop',
  Ajolistat: 'group',
  Terminaalit: 'terminal',
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
  salesPoint: true,
  minimapZones: true,
  minimapZoneSymbols: true,
  get rows() {
    let rows = [];
    switch (store.rowType) {
      case 'stop':
        rows = stopsToRows(commonStore.stops);
        break;
      case 'group':
        rows = stopsToGroupRows(commonStore.stops);
        break;
      case 'terminal':
        rows = stopsToTerminalRows(commonStore.stops);
        break;
      default:
    }

    return getVisibleRows(rows, commonStore.stopFilter);
  },
});

store.setComponent = value => {
  store.component = value;
  if (value === 'TerminalPoster') {
    store.rowType = 'terminal';
  }
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

store.setSalesPoint = () => {
  store.salesPoint = !store.salesPoint;
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
    .reduce(
      (prev, { rowId, stopIds }) =>
        store.component !== 'TerminalPoster' ? [...prev, ...stopIds] : [...prev, rowId],
      [],
    )
    .map(stopId => ({
      stopId: store.component !== 'TerminalPoster' ? stopId : null,
      terminalId: store.component === 'TerminalPoster' ? stopId : null, // Stop id is terminal id if terminalcomponent will be rendered.
      date: format(store.date),
      isSummerTimetable: store.isSummerTimetable,
      dateBegin: store.dateBegin ? format(store.dateBegin) : null,
      dateEnd: store.dateEnd ? format(store.dateEnd) : null,
      printTimetablesAsA4:
        store.timetableAsA4Format && store.component === componentsByLabel.Aikataulu,
      printTimetablesAsGreyscale:
        store.timetableAsGreyscale && store.component === componentsByLabel.Aikataulu,
      template: commonStore.currentTemplate.id,
      selectedRuleTemplates: store.selectedRuleTemplates,
      mapZones: componentsWithMapOptions.includes(store.component) ? store.mapZones : null,
      mapZoneSymbols: componentsWithMapOptions.includes(store.component)
        ? store.mapZoneSymbols
        : null,
      salesPoint: componentsWithMapOptions.includes(store.component) ? store.salesPoint : null,
      minimapZones: componentsWithMapOptions.includes(store.component) ? store.minimapZones : null,
      minimapZoneSymbols: componentsWithMapOptions.includes(store.component)
        ? store.minimapZoneSymbols
        : null,
      user,
      routeFilter,
    }));

  store.resetChecked();
  commonStore.addPosters(store.buildId, store.component, props);
};

export default store;
