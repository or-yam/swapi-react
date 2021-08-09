import { getVehicles, getPilotsByVehicles, getPlanetsByPilots } from '../services/api';
import { saveResultsToLocalStorage, getResultsFromLocalStorage } from '../services/localStorage';

const LOCAL_STORAGE_KEY = 'results';

const mapData = async (vehicles, pilots, planets) =>
  vehicles.map(vehicle => ({
    name: vehicle.name,
    pilots: vehicle.pilots.map(pilotUrl => {
      const pilot = pilots.find(p => p.url === pilotUrl);
      pilot.homePlanet = planets.find(planet => planet.url === pilot.homeworld);
      return pilot;
    })
  }));

const printResults = results => {
  results &&
    console.table({
      'Vehicle name with the largest sum': results.topVehicle.name,
      'Related home planets and their respective population':
        results.planets.length === 1 ? results.planets[0] : results.planets,
      'Related pilots names': results.pilots
    });
  console.log({ 'Related home planets': results.planets });
};

const fetchAndMap = async () => {
  try {
    const vehicles = await getVehicles();
    const pilots = await getPilotsByVehicles(vehicles);
    const planets = await getPlanetsByPilots(pilots);
    const mappedData = await mapData(vehicles, pilots, planets);
    return mappedData;
  } catch (error) {
    console.warn(error);
    return error;
  }
};

const getVehicleByHighestPilotPlanePopulation = async () => {
  const results = {
    topVehicle: { sum: 0 },
    planets: [],
    pilots: []
  };

  const mappedData = await fetchAndMap();
  if (mappedData instanceof Error) {
    console.log(mappedData.message);
    return;
  }

  mappedData.forEach(vehicle => {
    let sum = 0;
    const tempPilots = [];

    vehicle.pilots.forEach(pilot => {
      tempPilots.push(pilot);
      if (pilot.homePlanet.population !== 'unknown') {
        sum += Number(pilot.homePlanet.population);
      }
    });

    if (sum > results.topVehicle.sum) {
      results.topVehicle = { sum, name: vehicle.name };
      results.pilots = tempPilots.map(({ name }) => name);
      results.planets = tempPilots.map(({ homePlanet }) => ({
        name: homePlanet.name,
        number: homePlanet.population
      }));
    }
  });

  printResults(results);
  saveResultsToLocalStorage(results, LOCAL_STORAGE_KEY);
};

const getPopulationResults = () => {
  const results = getResultsFromLocalStorage(LOCAL_STORAGE_KEY);
  if (results) {
    printResults(results);
    return;
  }
  getVehicleByHighestPilotPlanePopulation();
};

export default getPopulationResults;
