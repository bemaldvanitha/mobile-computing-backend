import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { places } from '../data/places';
import { formatClock, formatStamp } from '../lib/time';

const PlacesContext = createContext(null);

export function PlacesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [category, setCategory] = useState('All');
  const [region, setRegion] = useState('All');
  const [banner, setBanner] = useState(null);
  const [resumeLog, setResumeLog] = useState([]);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previous = appState.current;
      if (
        previous &&
        /inactive|background/.test(previous) &&
        nextState === 'active'
      ) {
        const at = new Date();
        setBanner(
          `Welcome back. Ceylon Trails resumed at ${formatClock(at)}. Your shortlist is still here.`
        );
        setResumeLog((log) =>
          [{ id: String(at.getTime()), label: formatStamp(at) }, ...log].slice(0, 8)
        );
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
      banner,
      dismissBanner: () => setBanner(null),
      resumeLog,
    };
  }, [favoriteIds, category, region, banner, resumeLog]);

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces() {
  const value = useContext(PlacesContext);
  if (!value) {
    throw new Error('usePlaces must be used inside PlacesProvider');
  }
  return value;
}
