import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { places } from '../data/places';

const PlacesContext = createContext(null);

function blankChecks() {
  return { bus: false, cash: false, time: false, bed: false };
}

export function PlacesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [category, setCategory] = useState('All');
  const [region, setRegion] = useState('All');
  const [trips, setTrips] = useState([]);
  const [banner, setBanner] = useState(null);
  const appState = useRef(AppState.currentState);
  const snapshot = useRef({ tripName: null, stopCount: 0, favoriteCount: 0 });

  useEffect(() => {
    snapshot.current = {
      tripName: trips[0]?.name ?? null,
      stopCount: trips[0]?.stops.length ?? 0,
      favoriteCount: favoriteIds.length,
    };
  }, [trips, favoriteIds]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previous = appState.current;
      if (previous && /inactive|background/.test(previous) && nextState === 'active') {
        const current = snapshot.current;
        if (current.tripName) {
          const placesLabel = current.stopCount === 1 ? '1 place' : `${current.stopCount} places`;
          setBanner(`Welcome back. ${current.tripName} is still in Trips, with ${placesLabel}.`);
        } else if (current.favoriteCount > 0) {
          const savedLabel =
            current.favoriteCount === 1 ? '1 place is' : `${current.favoriteCount} places are`;
          setBanner(`Welcome back. ${savedLabel} still on your shortlist.`);
        } else {
          setBanner('Welcome back. Anything you plan in this session is still here.');
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  const value = useMemo(() => {
    const isFavorite = (id) => favoriteIds.includes(id);

    return {
      places,
      favoriteIds,
      favorites: places.filter((place) => favoriteIds.includes(place.id)),
      category,
      region,
      setCategory,
      setRegion,
      clearFilters: () => {
        setCategory('All');
        setRegion('All');
      },
      isFavorite,
      addFavorite: (id) => {
        setFavoriteIds((current) => (current.includes(id) ? current : [...current, id]));
      },
      removeFavorite: (id) => {
        setFavoriteIds((current) => current.filter((item) => item !== id));
      },
      trips,
      getTrip: (id) => trips.find((trip) => trip.id === id) ?? null,
      tripsForPlace: (placeId) => trips.filter((trip) => trip.stops.some((stop) => stop.placeId === placeId)),
      createTrip: ({ name, startDate, days, note, placeId }) => {
        const trip = {
          id: `trip-${Date.now()}`,
          name: name.trim(),
          startDate,
          days,
          note: note.trim(),
          stops: placeId ? [{ placeId, day: 1 }] : [],
          checks: blankChecks(),
        };
        if (placeId) {
          setFavoriteIds((current) => (current.includes(placeId) ? current : [...current, placeId]));
        }
        setTrips((current) => [trip, ...current]);
        return trip;
      },
      deleteTrip: (id) => {
        setTrips((current) => current.filter((trip) => trip.id !== id));
      },
      setTripNote: (id, note) => {
        setTrips((current) => current.map((trip) => (trip.id === id ? { ...trip, note } : trip)));
      },
      setTripDays: (id, days) => {
        setTrips((current) =>
          current.map((trip) => {
            if (trip.id !== id) {
              return trip;
            }
            return {
              ...trip,
              days,
              stops: trip.stops.map((stop) => ({ ...stop, day: Math.min(stop.day, days) })),
            };
          })
        );
      },
      addStop: (tripId, placeId, day) => {
        setFavoriteIds((current) => (current.includes(placeId) ? current : [...current, placeId]));
        setTrips((current) =>
          current.map((trip) => {
            if (trip.id !== tripId || trip.stops.some((stop) => stop.placeId === placeId)) {
              return trip;
            }
            return {
              ...trip,
              stops: [...trip.stops, { placeId, day: Math.min(day, trip.days) }],
            };
          })
        );
      },
      removeStop: (tripId, placeId) => {
        setTrips((current) =>
          current.map((trip) =>
            trip.id === tripId
              ? { ...trip, stops: trip.stops.filter((stop) => stop.placeId !== placeId) }
              : trip
          )
        );
      },
      setStopDay: (tripId, placeId, day) => {
        setTrips((current) =>
          current.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  stops: trip.stops.map((stop) =>
                    stop.placeId === placeId
                      ? { ...stop, day: Math.min(Math.max(day, 1), trip.days) }
                      : stop
                  ),
                }
              : trip
          )
        );
      },
      toggleCheck: (tripId, key) => {
        setTrips((current) =>
          current.map((trip) =>
            trip.id === tripId
              ? { ...trip, checks: { ...trip.checks, [key]: !trip.checks[key] } }
              : trip
          )
        );
      },
      banner,
      dismissBanner: () => setBanner(null),
    };
  }, [favoriteIds, category, region, trips, banner]);

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces() {
  const value = useContext(PlacesContext);
  if (!value) {
    throw new Error('usePlaces must be used inside PlacesProvider');
  }
  return value;
}
