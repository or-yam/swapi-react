import { getVehicles, getPilotsByVehicles, getPlanetsByPilots, getPlanetsByNames } from '../services/api';

const PLANETS_LIST = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor'];

export const getPlanets = async planetsFetched => {
  console.info('Fetching additional planets...');
  const planetsToDisplay = planetsFetched ? planetsFetched.filter(({ name }) => PLANETS_LIST.includes(name)) : [];
  const planetsToFetch = PLANETS_LIST.filter(name => !planetsToDisplay.map(({ name }) => name).includes(name));
  const planets = await getPlanetsByNames(planetsToFetch);

  if (!planets && !planetsToDisplay.length) {
    return null;
  }

  if (!planets) {
    console.warn('Could not fetch additional planets');
    return planetsToDisplay;
  }

  return [...planetsToDisplay, ...planets];
};

export const findMostPopulatedVehicle = async () => {
  console.info('Finding the most populated vehicle...');

  const results = {
    vehicle: { populationSum: 0 },
    planets: [],
    pilotsNames: []
  };

  const vehicles = await getVehicles();
  const pilots = vehicles && (await getPilotsByVehicles(vehicles));
  const planets = pilots && (await getPlanetsByPilots(pilots));

  if (!vehicles || !pilots || !planets) return null;

  vehicles.forEach(vehicle => {
    const vehiclePilots = pilots.filter(pilot => vehicle.pilots.includes(pilot.url));
    if (!vehiclePilots.length) return;

    const vehiclePlanets = planets.filter(planet => vehiclePilots.some(pilot => pilot.homeworld === planet.url));
    if (!vehiclePlanets.length) return;

    const vehiclePopulation = vehiclePlanets.reduce((acc, { population }) => acc + Number(population), 0);
    if (vehiclePopulation > results.vehicle.populationSum) {
      results.vehicle = { name: vehicle.name, populationSum: vehiclePopulation };
      results.planets = vehiclePlanets;
      results.pilotsNames = vehiclePilots.map(pilot => pilot.name);
    }
  });

  const vehiclesPlanets = planets.map(({ name, population }) => ({ name, population }));

  return { results, vehiclesPlanets };
};
