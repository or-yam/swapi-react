import axios from 'axios';

const API_BASE_URL = 'https://swapi.py4e.com/api/';

const fetchData = async endpoint => (await axios.get(endpoint)).data;

const fetchAllPagesRecursively = async (dataName, page = 1, results = []) => {
  const data = await fetchData(`${API_BASE_URL}${dataName}/?page=${page}`);
  results.push(...data.results);
  if (data.next) {
    return await fetchAllPagesRecursively(dataName, page + 1, results);
  }
  return results;
};

const getVehicles = async () => {
  console.info('Fetching all vehicles...');
  try {
    const vehicles = await fetchAllPagesRecursively('vehicles', 1, []);
    return vehicles;
  } catch (error) {
    console.warn('Could not fetch vehicles', error);
    return [];
  }
};

const getPilotsByVehicles = async vehicles => {
  console.info('Fetching relevant pilots...');
  const pilotsUrls = [];
  vehicles.forEach(({ pilots }) => pilotsUrls.push(...pilots));
  const uniqueUrls = [...new Set(pilotsUrls)];
  try {
    const pilots = await Promise.all(uniqueUrls.map(url => fetchData(url)));
    return pilots;
  } catch (error) {
    console.warn('Could not fetch pilots', error);
    return [];
  }
};

const getPlanetsByPilots = async pilots => {
  console.info('Fetching relevant planets...');
  const planetsUrls = [];
  pilots.forEach(({ homeworld }) => {
    planetsUrls.push(homeworld);
  });
  const uniqueUrls = [...new Set(planetsUrls)];
  try {
    const planets = await Promise.all(uniqueUrls.map(url => fetchData(url)));
    const planetsWithPopulation = planets.filter(({ population }) => population !== 'unknown');
    return planetsWithPopulation;
  } catch (error) {
    console.warn('Could not fetch planets', error);
    return [];
  }
};

export const getPlanetsByNames = async planetsNames => {
  const urls = planetsNames.map(name => `${API_BASE_URL}planets/?search=${name}`);
  try {
    const planetsData = await Promise.all(urls.map(url => fetchData(url)));
    return planetsData.map(({ results }) => {
      const { name, population } = results[0];
      return { name, population };
    });
  } catch (error) {
    console.warn('Could not fetch planets', error);
    return [];
  }
};

export const findMostPopulatedVehicle = async () => {
  console.info('Finding the most populated vehicle...');
  const results = {
    vehicle: { populationSum: 0 },
    planets: [],
    pilotsNames: []
  };

  const vehicles = await getVehicles();
  const pilots = await getPilotsByVehicles(vehicles);
  const planets = await getPlanetsByPilots(pilots);

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

  return results;
};
