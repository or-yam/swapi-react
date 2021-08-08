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

const fetchData = async (endpoint = '') => (await axios.get(endpoint)).data;

export const getVehicles = async () => {
  const vehicles = [];
  const pagesUrls = new Array(NUMBER_OF_RESULTS_PAGES).fill().map((_, index) => `vehicles/?page=${index + 1}`);
  try {
    (await Promise.all(pagesUrls.map(pageUrl => fetchData(`${API_BASE_URL}${pageUrl}`)))).forEach(page => {
      Array.prototype.push.apply(vehicles, page.results); // pushing all objects from the page to the vehicles array
    });
  } catch (error) {
    console.log(error);
  }

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
  try {
    const pilots = await Promise.all(pilotsUrls.map(url => fetchData(url)));
    return pilots;
  } catch (error) {
    console.log(error);
  }
};

export const getPlanetsByPilots = async pilots => {
  const planetsUrls = [];
  pilots.forEach(pilot => {
    const isPlanetExist = planetsUrls.find(url => url === pilot.homeworld);
    if (!isPlanetExist) {
      planetsUrls.push(pilot.homeworld);
    }
  });
  try {
    const planets = await Promise.all(planetsUrls.map(url => fetchData(url)));
    return planets;
  } catch (error) {
    console.log(error);
  }
};

export const getPlanetsByNames = async list => {
  const urls = list.map(name => `${API_BASE_URL}planets/?search=${name}`);
  try {
    const planets = (await Promise.all(urls.map(url => fetchData(url)))).map(({ results }) => {
      const { name, population } = results[0];
      return { name, population };
    });

    return planets;
  } catch (error) {
    console.log(error);
  }
};
