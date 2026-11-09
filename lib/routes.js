import { findPlace } from '../data/places';
import { hoursFor } from './plan';

export const themes = [
  {
    id: 'south',
    title: 'South coast',
    line: 'Fort walls in the afternoon. The beach only if you stay.',
    coverId: 'galle',
  },
  {
    id: 'hills',
    title: 'Hill country',
    line: 'Kandy in a day. Ella only if you have the Monday.',
    coverId: 'ella',
  },
  {
    id: 'ancient',
    title: 'Ancient cities',
    line: 'On the rock at opening. The sacred city needs a second day.',
    coverId: 'sigiriya',
  },
  {
    id: 'wild',
    title: 'Yala',
    line: 'The jeep is at dawn. The drive is the day before.',
    coverId: 'yala',
  },
  {
    id: 'east',
    title: 'East coast',
    line: 'Nilaveli when the south coast is rough. Not a Saturday loop.',
    coverId: 'nilaveli',
  },
];

const catalog = {
  south: {
    1: {
      name: 'Galle Saturday',
      blurb: 'Expressway down, ramparts before sunset, Mirissa only if you are willing to keep moving.',
      stops: [
        { placeId: 'galle', day: 1 },
        { placeId: 'mirissa', day: 1 },
      ],
    },
    2: {
      name: 'Galle, then Mirissa',
      blurb: 'Fort on Saturday. Sunday is the bay, without turning the whale boat into a sprint.',
      stops: [
        { placeId: 'galle', day: 1 },
        { placeId: 'mirissa', day: 2 },
      ],
    },
    3: {
      name: 'South coast, unhurried',
      blurb: 'Saturday in the fort, two nights by the bay, Monday bus home.',
      stops: [
        { placeId: 'galle', day: 1 },
        { placeId: 'mirissa', day: 2 },
      ],
    },
  },
  hills: {
    1: {
      name: 'Kandy for the puja',
      blurb: 'Three hours up. The 6.30 p.m. puja is the reason to go, and you can still be home that night.',
      stops: [{ placeId: 'kandy', day: 1 }],
    },
    2: {
      name: 'A night in Kandy',
      blurb: 'Evening puja, morning by the lake. Ella is still a day of train past this.',
      stops: [{ placeId: 'kandy', day: 1 }],
    },
    3: {
      name: 'Kandy and Nine Arches',
      blurb: 'Saturday night in Kandy. Sunday and Monday are for the hill line and the bridge.',
      stops: [
        { placeId: 'kandy', day: 1 },
        { placeId: 'ella', day: 2 },
      ],
    },
  },
  ancient: {
    1: {
      name: 'Sigiriya at opening',
      blurb: 'Four hours each way. You climb and you come home. Anuradhapura does not fit after it.',
      stops: [{ placeId: 'sigiriya', day: 1 }],
    },
    2: {
      name: 'Rock, then the sacred city',
      blurb: 'Sigiriya on Saturday morning. Sunday is a bicycle between the stupas.',
      stops: [
        { placeId: 'sigiriya', day: 1 },
        { placeId: 'anuradhapura', day: 2 },
      ],
    },
    3: {
      name: 'Triangle, then Kandy',
      blurb: 'Two ancient cities, and the temple on the way back toward Colombo.',
      stops: [
        { placeId: 'sigiriya', day: 1 },
        { placeId: 'anuradhapura', day: 2 },
        { placeId: 'kandy', day: 3 },
      ],
    },
  },
  wild: {
    1: {
      name: 'Yala and back',
      blurb: 'Five hours each way. You miss the dawn drive, which is the reason the park opens at 6.',
      stops: [{ placeId: 'yala', day: 1 }],
    },
    2: {
      name: 'Dawn jeep',
      blurb: 'Saturday is the road to Tissamaharama. Sunday opens the park at 6.',
      stops: [{ placeId: 'yala', day: 2 }],
    },
    3: {
      name: 'Safari, then a daylight bus',
      blurb: 'Arrive Saturday, jeep at dawn on Sunday, Monday home without a night drive.',
      stops: [{ placeId: 'yala', day: 2 }],
    },
  },
  east: {
    1: {
      name: 'Nilaveli and back',
      blurb: 'Six hours each way. The beach becomes a stop in a car park.',
      stops: [{ placeId: 'nilaveli', day: 1 }],
    },
    2: {
      name: 'One night on the east',
      blurb: 'Saturday travel, Sunday morning boat to Pigeon Island, home after lunch.',
      stops: [{ placeId: 'nilaveli', day: 2 }],
    },
    3: {
      name: 'East coast properly',
      blurb: 'A full day of sea between the drive out and the drive back.',
      stops: [{ placeId: 'nilaveli', day: 2 }],
    },
  },
};

const pools = {
  south: ['galle', 'mirissa', 'unawatuna', 'hikkaduwa', 'bentota'],
  hills: ['kandy', 'ella', 'horton', 'sripada', 'nuwaraeliya', 'lipton', 'diyaluma', 'kitulgala'],
  ancient: ['sigiriya', 'anuradhapura', 'polonnaruwa', 'dambulla', 'mihintale', 'yapahuwa', 'pidurangala'],
  wild: ['yala', 'udawalawe', 'minneriya', 'sinharaja'],
  east: ['nilaveli', 'pasikuda', 'arugam', 'koneswaram'],
};

const themeByPlace = {
  galle: 'south',
  mirissa: 'south',
  unawatuna: 'south',
  hikkaduwa: 'south',
  bentota: 'south',
  kandy: 'hills',
  ella: 'hills',
  horton: 'hills',
  sripada: 'hills',
  nuwaraeliya: 'hills',
  lipton: 'hills',
  diyaluma: 'hills',
  kitulgala: 'hills',
  sigiriya: 'ancient',
  anuradhapura: 'ancient',
  polonnaruwa: 'ancient',
  dambulla: 'ancient',
  mihintale: 'ancient',
  yapahuwa: 'ancient',
  pidurangala: 'ancient',
  yala: 'wild',
  udawalawe: 'wild',
  minneriya: 'wild',
  sinharaja: 'wild',
  nilaveli: 'east',
  pasikuda: 'east',
  arugam: 'east',
  koneswaram: 'east',
  jaffna: 'east',
  kalpitiya: 'south',
};

export function themeForPlace(place) {
  return themeByPlace[place?.id] || 'south';
}

export function suggestedDays(place) {
  if (!place) {
    return 2;
  }
  const hours = hoursFor(place.id);
  if (hours >= 6) {
    return 3;
  }
  if (hours >= 4.5) {
    return 2;
  }
  return 1;
}

export function suggestRoute(themeId, days, seedId) {
  const base = catalog[themeId]?.[days] ?? catalog.south[1];
  let stops = base.stops.map((stop) => ({ ...stop }));
  if (seedId && !stops.some((stop) => stop.placeId === seedId)) {
    stops = [{ placeId: seedId, day: 1 }, ...stops];
  }
  return { name: base.name, blurb: base.blurb, stops };
}

export function buildFromShortlist(ids, days) {
  const sorted = [...ids].sort((a, b) => hoursFor(a) - hoursFor(b));
  if (sorted.length === 0) {
    return {
      name: 'From my shortlist',
      blurb: 'Save a place on Explore, then come back. This route is built from what you saved.',
      stops: [],
    };
  }

  const chosen = [];
  if (days === 1) {
    const near = sorted.filter((id) => hoursFor(id) <= 3.5);
    (near.length ? near : sorted.slice(0, 1)).slice(0, 2).forEach((placeId) => {
      chosen.push({ placeId, day: 1 });
    });
  } else {
    sorted.slice(0, days).forEach((placeId, index) => {
      chosen.push({ placeId, day: Math.min(days, index + 1) });
    });
  }

  const names = chosen.map((stop) => findPlace(stop.placeId)?.name).filter(Boolean);
  return {
    name: names.slice(0, 2).join(' and ') || 'Shortlist weekend',
    blurb:
      days === 1
        ? 'Nearest saved places only. Anything five hours away is left off a single Saturday.'
        : 'One saved place on each day, starting with the nearest.',
    stops: chosen,
  };
}

export function alternatesFor(themeId, stops) {
  const used = new Set(stops.map((stop) => stop.placeId));
  return (pools[themeId] ?? []).filter((id) => !used.has(id));
}

export function assessRoute(stops, days) {
  if (!stops.length) {
    return {
      level: 'bad',
      title: 'Nothing on the route yet',
      detail: 'Add a place. The leave time and the cost both come from what you put on the days.',
    };
  }

  const detailed = stops.map((stop) => ({
    ...stop,
    hours: hoursFor(stop.placeId),
    name: findPlace(stop.placeId)?.name ?? 'This place',
  }));
  const furthest = detailed.reduce((max, stop) => (stop.hours > max.hours ? stop : max), detailed[0]);
  const leave = leaveBy(detailed, days, furthest);
  const road = furthest.hours * (days === 1 ? 2 : 1);
  const used = road + detailed.length * 3;
  const room = days * 12;

  if (days === 1 && furthest.hours >= 5) {
    return {
      level: 'bad',
      title: `${furthest.name} is not a Saturday loop`,
      detail: `${trimHours(furthest.hours)} hours each way from Colombo. ${leave.sentence}`,
    };
  }
  if (leave.hour < 3.5) {
    return { level: 'bad', title: 'The leave time does not work', detail: leave.sentence };
  }
  if (used > room + 1) {
    return {
      level: 'bad',
      title: 'Too much road for these days',
      detail: `About ${trimHours(road)} on the bus, plus ${detailed.length} stops. Take one off, or add a day.`,
    };
  }
  if (leave.hour < 5.5 || used > room - 2) {
    return {
      level: 'tight',
      title: 'Possible if nobody sleeps in',
      detail: leave.sentence,
    };
  }
  return {
    level: 'good',
    title: 'This route fits',
    detail: leave.sentence,
  };
}

function leaveBy(detailed, days, furthest) {
  if (days > 1 && detailed.some((stop) => stop.placeId === 'yala')) {
    return {
      hour: 13,
      sentence: 'Leave Colombo by 1 p.m. on Saturday. The jeep is at 6 a.m. the next morning.',
    };
  }
  if (days > 1 && furthest.hours >= 6) {
    return {
      hour: 12,
      sentence: `Leave Colombo by noon. ${furthest.name} is ${trimHours(furthest.hours)} hours away, so Saturday is the journey.`,
    };
  }

  const arrive = arrivalHour(furthest.placeId);
  const hour = arrive - furthest.hours;
  if (hour < 3.5) {
    return {
      hour,
      sentence: `You would leave Colombo around ${clock(hour)} to be at ${furthest.name} by ${clock(arrive)}. That is a night bus.`,
    };
  }
  return {
    hour,
    sentence: `Leave Colombo by ${clock(hour)} and you are at ${furthest.name} around ${clock(arrive)}.`,
  };
}

function arrivalHour(placeId) {
  if (placeId === 'sigiriya' || placeId === 'horton' || placeId === 'pidurangala' || placeId === 'minneriya') {
    return 8;
  }
  if (placeId === 'kandy') {
    return 17.5;
  }
  return 10;
}

function clock(hour) {
  const normalized = ((hour % 24) + 24) % 24;
  const whole = Math.floor(normalized);
  const minutes = Math.round((normalized - whole) * 60);
  const date = new Date();
  date.setHours(whole, minutes === 60 ? 0 : minutes, 0, 0);
  return date.toLocaleTimeString('en-LK', { hour: 'numeric', minute: '2-digit' });
}

function trimHours(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
