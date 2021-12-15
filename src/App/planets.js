import { getPlanetsByNames } from '../services/api';
import { saveResultsToLocalStorage, getResultsFromLocalStorage } from '../services/localStorage';

const PLANETS_LIST = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor'];
const LOCAL_STORAGE_KEY = 'planets';

// Why is it here ? 
const getPlanetsData = async () => {
  const localStoragePlanets = getResultsFromLocalStorage(LOCAL_STORAGE_KEY);
  if (localStoragePlanets) {
    return localStoragePlanets;
  }

  try {
    const planets = await getPlanetsByNames(PLANETS_LIST);
    saveResultsToLocalStorage(planets, LOCAL_STORAGE_KEY);
    return planets;
  } catch (error) {
    return false;
  }
};

export default getPlanetsData;
