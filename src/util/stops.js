import groupBy from 'lodash/groupBy';
import flatMap from 'lodash/flatMap';

function shelterText(stopType) {
  switch (stopType) {
    case '01':
    case '08':
      return 'Lasikatos';
    case '02':
      return 'Teräskatos';
    case '03':
      return 'Terminaali';
    case '04':
      return 'Tolppa';
    case '05':
      return 'Urbankatos';
    case '06':
      return 'Betonikatos';
    case '07':
      return 'Puukatos';
    default:
      return 'Varustelutieto puuttuu';
  }
}

function stopsText(stops) {
  const shortIds = stops.map(({ shortId }) => shortId).sort();
  const shortIdDesc = `${shortIds[0]} - ${shortIds[shortIds.length - 1]}`;
  const shelterDesc = shelterText(stops[0].hasShelter);
  return `${shortIdDesc} (${stops.length} pysäkkiä) - ${shelterDesc}`;
}

function groupKey(shortId) {
  const keyLength =
    shortId.charAt(0) === 'V' || shortId.charAt(0) === 'E' ? 3 : 2;
  return shortId.substring(0, keyLength);
}

function removeDuplicates(stops) {
  const filteredStops = Object.values(
    groupBy(
      stops.filter(stop => stop.shortId.length > 0 && stop.group.length > 0),
      ({ shortId, group }) => `${shortId}_${group}`,
    ),
  ).map(s => s[0]);

  // Adding stops missing shortId or group
  return filteredStops.concat(
    stops.filter(stop => !(stop.shortId.length > 0 && stop.group.length > 0)),
  );
}

function groupStops(stops) {
  const filteredStops = removeDuplicates(stops);

  return {
    ...groupBy(
      filteredStops
        .filter(({ group }) => group.length > 0 && group !== ' ')
        .sort((a, b) => a.index - b.index),
      'group',
    ),
    ...groupBy(
      filteredStops
        .filter(({ group }) => !group.length || group === ' ')
        .sort((a, b) => a.shortId.localeCompare(b.shortId)),
      ({ shortId }) => groupKey(shortId),
    ),
  };
}

function stopsToRows(stops) {
  return stops.map(({ shortId, posterCount, nameFi, stopId, stopType }) => ({
    isChecked: false,
    title: `${shortId} ${nameFi}`,
    subtitle: `(${stopId}) - ${shelterText(stopType)}, ${
      posterCount
    } julistepaikka${posterCount !== 1 ? 'a' : ''}`,
    stopIds: [stopId],
  }));
}

function stopsToGroupRows(stops) {
  const stopsByGroup = groupStops(stops);
  return flatMap(Object.keys(stopsByGroup), groupName => {
    const stopsByShelterStatus = groupBy(stopsByGroup[groupName], 'hasShelter');
    return Object.values(stopsByShelterStatus).map(stopsInGroup => ({
      isChecked: false,
      title: groupName,
      subtitle: stopsText(stopsInGroup),
      stopIds: stopsInGroup.map(({ stopId }) => stopId),
    }));
  });
}

export { stopsToRows, stopsToGroupRows };
