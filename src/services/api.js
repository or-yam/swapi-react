import axios from 'axios';

const API_BASE_URL = 'https://swapi.py4e.com/api/';
const NUMBER_OF_RESULTS_PAGES = 4;

const fetchData = async (endpoint = '') => (await axios.get(endpoint)).data;

export const getVehicles = async () => {
  const vehicles = [];
  const pagesUrls = new Array(NUMBER_OF_RESULTS_PAGES).fill().map((_, index) => `vehicles/?page=${index + 1}`);

  (await Promise.all(pagesUrls.map(pageUrl => fetchData(`${API_BASE_URL}${pageUrl}`)))).forEach(page => {
    // pushing all objects from the page to the vehicles array
    Array.prototype.push.apply(vehicles, page.results);
  });

  const vehiclesWithPilots = vehicles.filter(vehicle => vehicle.pilots.length > 0);
  return vehiclesWithPilots;
};

export const getPilotsByVehicles = async vehicles => {
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
  return pilots;
};

export const getPlanetsByPilots = async pilots => {
  const planetsUrls = [];
  pilots.forEach(pilot => {
    const isPlanetExist = planetsUrls.find(url => url === pilot.homeworld);
    if (!isPlanetExist) {
      planetsUrls.push(pilot.homeworld);
    }
  });

  const planets = await Promise.all(planetsUrls.map(url => fetchData(url)));
  return planets;
};

export const getPlanetsByNames = async list => {
  const urls = list.map(name => `${API_BASE_URL}planets/?search=${name}`);

  const planets = (await Promise.all(urls.map(url => fetchData(url)))).map(({ results }) => {
    const { name, population } = results[0];
    return { name, population };
  });

  return planets;
};
