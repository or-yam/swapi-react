// couldn't find a way to get all vehicles without pagination
// Assume to be a constant results number of 39 in 4 pages
// Assuming the data remain the same

// Alternative APIs
// https://www.swapi.tech/api
// https://swapi.py4e.com/api/
// https://swapi.dev/api/

import axios from 'axios';

const API_BASE_URL = 'https://swapi.py4e.com/api/';
const NUMBER_OF_RESULTS_PAGES = 4;
const PLANETS_FOR_CHART = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor'];

const fetchData = async (endpoint = '') => (await axios.get(endpoint)).data;
const isApiAlive = async () => (await axios.get(API_BASE_URL)).status === 200;

const getVehicles = async () => {
  if (!(await isApiAlive())) {
    console.warn('API is dead');
    return;
  }

  const vehicles = [];
  const pagesUrls = new Array(NUMBER_OF_RESULTS_PAGES).fill().map((_, index) => `vehicles/?page=${index + 1}`);

  (await Promise.all(pagesUrls.map(pageUrl => fetchData(`${API_BASE_URL}${pageUrl}`)))).forEach(page => {
    Array.prototype.push.apply(vehicles, page.results); // pushing all objects from the page to the vehicles array
  });

  const vehiclesWithPilots = vehicles.filter(vehicle => vehicle.pilots.length > 0);
  return vehiclesWithPilots;
};

const getPilots = async vehicles => {
  const pilotsUrls = [];
  vehicles.forEach(vehicle => {
    vehicle.pilots.forEach(pilotUrl => {
      const isPilotExist = pilotsUrls.find(url => url === pilotUrl);
      if (!isPilotExist) {
        pilotsUrls.push(pilotUrl);
      }
    });
  });

  const pilots = await Promise.all(pilotsUrls.map(url => fetchData(url)));
  //   .map(({ name, homeworld, url }) => ({
  //     name,
  //     url,
  //     planetUrl: homeworld
  //   }));
  return pilots;
};

const getPlanets = async pilots => {
  const planetsUrls = [];
  pilots.forEach(pilot => {
    const isPlanetExist = planetsUrls.find(url => url === pilot.homeworld);
    if (!isPlanetExist) {
      planetsUrls.push(pilot.homeworld);
    }
  });

  const planets = await Promise.all(planetsUrls.map(url => fetchData(url)));
  //   .map(({ name, population, url }) => ({
  //     name,
  //     population,
  //     url
  //   }));

  return planets;
};

const mappedData = async vehicles => {
  const pilots = await getPilots(vehicles);
  const planets = await getPlanets(pilots);
  const mapped = vehicles.map(vehicle => ({
    name: vehicle.name,
    pilots: vehicle.pilots.map(pilotUrl => {
      const pilot = pilots.find(p => p.url === pilotUrl);
      pilot.homePlanet = planets.find(planet => planet.url === pilot.homeworld);
      return pilot;
    })
  }));

  return mapped;
};

export const findVehicleByHigestPilotsHomePlanePopulation = async () => {
  const results = {
    topVehicle: { sum: 0 },
    planets: [],
    pilots: []
  };

  const vehicles = await getVehicles();
  const data = await mappedData(vehicles);

  data.forEach(vehicle => {
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

  console.table({
    'Vehicle name with the largest sum': results.topVehicle.name,
    'Related home planets and their respective population': results.planets,
    'Related pilot names': results.pilots
  });

  return results;
};

export const getPlanetsForChart = async () => {
  const urls = PLANETS_FOR_CHART.map(name => `${API_BASE_URL}planets/?search=${name}`);
  const planets = (await Promise.all(urls.map(url => fetchData(url)))).map(({ results }) => {
    const { name, population } = results[0];
    return { name, population };
  });

  return planets;
};
