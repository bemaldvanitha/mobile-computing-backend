const SHRINES = new Set([
  'galle',
  'kandy',
  'dambulla',
  'mihintale',
  'anuradhapura',
  'polonnaruwa',
  'koneswaram',
  'jaffna',
]);

const JEEPS = new Set(['yala', 'udawalawe', 'minneriya']);

export function suggestedChecks(trip) {
  const ids = new Set(trip.stops.map((stop) => stop.placeId));
  const items = [
    { id: 'bus', label: 'Bus or train is booked' },
    { id: 'cash', label: 'Cash is drawn for tickets and meals' },
    { id: 'alarm', label: 'Alarm is set for the leave time above' },
  ];

  if (trip.days > 1) {
    items.push({ id: 'bed', label: 'A bed is booked for the night away' });
  }
  if ([...ids].some((id) => JEEPS.has(id))) {
    items.push({ id: 'jeep', label: 'Jeep is booked, and you know the gate time' });
  }
  if (ids.has('sinharaja')) {
    items.push({ id: 'guide', label: 'Sinharaja guide is booked. They will not let you in alone' });
  }
  if (ids.has('sigiriya') || ids.has('pidurangala')) {
    items.push({ id: 'water', label: 'Water is packed. The climb has almost no shade' });
  }
  if (ids.has('kalpitiya')) {
    items.push({ id: 'boat', label: 'Dolphin boat is agreed at the jetty, including what happens if none are out' });
  }
  if (ids.has('kitulgala')) {
    items.push({ id: 'raft', label: 'Rafting slot is booked, and phones are in a dry bag' });
  }
  if ([...ids].some((id) => SHRINES.has(id))) {
    items.push({ id: 'dress', label: 'Shoulders and knees are covered for the shrine' });
  }
  if (ids.has('horton') || ids.has('lipton') || ids.has('nuwaraeliya') || ids.has('sripada')) {
    items.push({ id: 'layer', label: 'A warm layer is packed. The hill start is cold' });
  }

  return items.map((item) => ({ ...item, custom: false }));
}

export function visibleChecks(trip) {
  const saved = Array.isArray(trip.checks) ? trip.checks : [];
  const suggested = suggestedChecks(trip).map((item) => ({
    ...item,
    done: Boolean(saved.find((entry) => entry.id === item.id)?.done),
  }));
  const custom = saved.filter((entry) => entry.custom);
  return [...suggested, ...custom];
}
