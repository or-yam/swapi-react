import { getPlanetsByNames } from '../services/api';
import { saveResultsToLocalStorage, getResultsFromLocalStorage } from '../services/localStorage';

const PLANETS_FOR_CHART = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor'];

const getPlanetsData = async () => {
  const localStoragePlanets = getResultsFromLocalStorage('planets');
  if (localStoragePlanets) {
    return localStoragePlanets;
  }
  const planets = await getPlanetsByNames(PLANETS_FOR_CHART);
  saveResultsToLocalStorage(planets, 'planets');
  return planets;
};

export default getPlanetsData;
