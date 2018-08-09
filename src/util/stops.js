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

function posterCountText(posterCount) {
  return `${posterCount} julistepaikka${posterCount !== 1 ? 'a' : ''}`;
}

function stopsText(stops) {
  const shortIds = stops.map(({ shortId }) => shortId).sort();
  const shortIdDesc = `${shortIds[0]} - ${shortIds[shortIds.length - 1]}`;
  const shelterDesc = posterCountText(stops[0].posterCount);
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
      stops.filter(
        stop =>
          stop.shortId.length > 0 &&
          stop.distributionArea &&
          stop.distributionArea.length > 0,
      ),
      ({ shortId, distributionArea }) => `${shortId}_${distributionArea}`,
    ),
  ).map(s => s[0]);

  // Adding stops missing shortId or group
  return filteredStops.concat(
    stops.filter(
      stop =>
        !(
          stop.shortId.length > 0 &&
          stop.distributionArea &&
          stop.distributionArea.length > 0
        ),
    ),
  );
}

function groupStops(stops) {
  const filteredStops = removeDuplicates(stops);

  return {
    ...groupBy(
      filteredStops
        .filter(
          ({ distributionArea }) =>
            distributionArea &&
            distributionArea.length > 0 &&
            distributionArea !== ' ',
        )
        .sort((a, b) => a.distributionOrder - b.distributionOrder),
      'distributionArea',
    ),
    ...groupBy(
      filteredStops
        .filter(
          ({ distributionArea }) =>
            !distributionArea ||
            !distributionArea.length ||
            distributionArea === ' ',
        )
        .sort((a, b) => a.shortId.localeCompare(b.shortId)),
      ({ shortId }) => groupKey(shortId),
    ),
  };
}

function stopsToRows(stops) {
  return stops.map(({ shortId, posterCount, nameFi, stopId, stopType }) => ({
    rowId: stopId,
    title: `${shortId} ${nameFi}`,
    subtitle: `(${stopId}) - ${shelterText(stopType)}, ${posterCountText(
      posterCount,
    )}`,
    stopIds: [stopId],
  }));
}

function stopsToGroupRows(stops) {
  const stopsByGroup = groupStops(stops);
  return flatMap(Object.keys(stopsByGroup), groupName => {
    const stopsByPosterCount = groupBy(stopsByGroup[groupName], 'posterCount');
    return Object.values(stopsByPosterCount).map(stopsInGroup => {
      const stopIds = stopsInGroup.map(({ stopId }) => stopId)
      
      return {
        rowId: groupName + stopIds[0],
        title: groupName,
        subtitle: stopsText(stopsInGroup),
        stopIds,
      }
    });
  });
}

function getFilterKeywords(filterValue = '') {
  return filterValue
    .split(',')
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0);
}

function getVisibleRows(rows, filterValue) {
  const keywords = getFilterKeywords(filterValue);

  if (keywords.length < 1) {
    return rows;
  }

  return keywords.reduce(
    (acc, keyword) =>
      acc.concat(
        rows.filter(({ title, subtitle }) =>
          `${title}${subtitle}`.toLowerCase().includes(keyword.toLowerCase()),
        ),
      ),
    [],
  );
}

export { stopsToRows, stopsToGroupRows, getVisibleRows, getFilterKeywords };
