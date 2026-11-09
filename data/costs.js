export const LODGING_PER_NIGHT = 6500;

export const costs = {
  sigiriya: {
    ticketLkr: 100,
    extrasLkr: 0,
    busLkr: 1800,
    hours: 4,
    extrasLabel: 'Local adult ticket. The climb itself has no separate fee.',
  },
  galle: {
    ticketLkr: 0,
    extrasLkr: 0,
    busLkr: 1400,
    hours: 2.5,
    extrasLabel: 'Walking the ramparts is free. The museum inside is extra if you want it.',
  },
  ella: {
    ticketLkr: 0,
    extrasLkr: 0,
    busLkr: 2800,
    hours: 8,
    extrasLabel: 'The bridge is free. This bus figure is Colombo to Ella, not a day return.',
  },
  yala: {
    ticketLkr: 150,
    extrasLkr: 2500,
    busLkr: 3200,
    hours: 5,
    extrasLabel: 'Local park ticket plus a one-person share of a jeep split four ways.',
  },
  mirissa: {
    ticketLkr: 0,
    extrasLkr: 0,
    busLkr: 1600,
    hours: 2.5,
    extrasLabel: 'The beach is free. A whale boat is about Rs 8,000 extra if you book one.',
  },
  kandy: {
    ticketLkr: 0,
    extrasLkr: 0,
    busLkr: 900,
    hours: 3,
    extrasLabel: 'Worship is free. A camera ticket is charged separately at the entrance.',
  },
  horton: {
    ticketLkr: 100,
    extrasLkr: 0,
    busLkr: 2200,
    hours: 6,
    extrasLabel: 'Local park ticket. Add a Nuwara Eliya night if you are leaving at 5.30 a.m.',
  },
  nilaveli: {
    ticketLkr: 0,
    extrasLkr: 1500,
    busLkr: 3500,
    hours: 6,
    extrasLabel: 'Beach is free. Pigeon Island ticket and the boat are the extra.',
  },
  anuradhapura: {
    ticketLkr: 100,
    extrasLkr: 500,
    busLkr: 1600,
    hours: 4,
    extrasLabel: 'Local site ticket plus a bicycle for the day.',
  },
  sripada: {
    ticketLkr: 0,
    extrasLkr: 0,
    busLkr: 1500,
    hours: 5,
    extrasLabel: 'The climb is free. The bus figure is Kelaniya to Hatton.',
  },
};

export function costFor(placeId) {
  return costs[placeId];
}
