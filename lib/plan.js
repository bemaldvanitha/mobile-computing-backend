import { costFor } from '../data/costs';

const ROOM_PER_NIGHT = 8000;
const EXTRA_PERSON_PER_NIGHT = 1500;
const YALA_JEEP = 10000;

export function groupSizeOf(trip) {
  const size = Number(trip?.groupSize);
  if (!size || size < 1) {
    return 2;
  }
  return Math.min(6, Math.round(size));
}

export function extrasFor(placeId, groupSize) {
  if (placeId === 'yala' || placeId === 'udawalawe' || placeId === 'minneriya') {
    return Math.round(YALA_JEEP / groupSize);
  }
  return costFor(placeId).extrasLkr;
}

export function lodgingPerPerson(nights, groupSize) {
  if (nights <= 0) {
    return 0;
  }
  const room = ROOM_PER_NIGHT + Math.max(0, groupSize - 2) * EXTRA_PERSON_PER_NIGHT;
  return Math.round((room * nights) / groupSize);
}

export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function upcomingWeekends(count = 6) {
  const dates = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  while (dates.length < count) {
    if (cursor.getDay() === 6) {
      dates.push(toIsoDate(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function formatIsoDate(iso) {
  return parseIsoDate(iso).toLocaleDateString('en-LK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatRange(startIso, days) {
  const start = formatIsoDate(startIso);
  if (days <= 1) {
    return start;
  }
  const end = parseIsoDate(startIso);
  end.setDate(end.getDate() + days - 1);
  return `${start} – ${formatIsoDate(toIsoDate(end))}`;
}

export function formatLkr(amount) {
  return `Rs ${Math.round(amount).toLocaleString('en-LK')}`;
}

export function budgetFor(trip) {
  const groupSize = groupSizeOf(trip);
  const lines = trip.stops.map((stop) => {
    const cost = costFor(stop.placeId);
    return {
      placeId: stop.placeId,
      day: stop.day,
      ticketLkr: cost.ticketLkr,
      extrasLkr: extrasFor(stop.placeId, groupSize),
      busLkr: cost.busLkr,
    };
  });
  const tickets = lines.reduce((sum, line) => sum + line.ticketLkr + line.extrasLkr, 0);
  const bus = lines.reduce((max, line) => Math.max(max, line.busLkr), 0);
  const nights = Math.max(0, trip.days - 1);
  const lodging = lodgingPerPerson(nights, groupSize);
  const total = tickets + bus + lodging;
  return {
    tickets,
    bus,
    lodging,
    nights,
    groupSize,
    total,
    groupTotal: total * groupSize,
  };
}

export function hoursFor(placeId) {
  return costFor(placeId).hours;
}
