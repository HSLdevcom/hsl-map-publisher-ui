const TRANSPORTATION_MODES = {
  BUS: 'BUS',
  FERRY: 'FERRY',
  RAIL: 'RAIL',
  SUBWAY: 'SUBWAY',
  TRAM: 'TRAM',
<<<<<<< HEAD
  L_RAIL: 'L_RAIL',
=======
>>>>>>> 070ed39 (AB#32085: Improve search UX, generate multiple line timetables at once (#113))
};

function compareLineNameOrder(a, b) {
  if (a.lineId.substring(1, 4) !== b.lineId.substring(1, 4)) {
    return a.lineId.substring(1, 4) > b.lineId.substring(1, 4) ? 1 : -1;
  } else if (a.lineId.substring(0, 1) !== b.lineId.substring(0, 1)) {
    return a.lineId.substring(0, 1) > b.lineId.substring(0, 1) ? 1 : -1;
  }
  return a.lineId.substring(4, 6) > b.lineId.substring(4, 6) ? 1 : -1;
}

function shortenTrainParsedLineId(lineId) {
  return lineId.replace(/^\d/, '');
}

export { TRANSPORTATION_MODES, compareLineNameOrder, shortenTrainParsedLineId };
