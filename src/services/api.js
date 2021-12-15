import axios from 'axios';

const API_BASE_URL = 'https://swapi.py4e.com/api/';

axios.defaults.baseURL = API_BASE_URL;

const fetchData = async endpoint => (await axios.get(endpoint)).data;

const getDataRecursively = async (endPoint, page, results) => {
  const data = await fetchData(`${endPoint}?page=${page}`);
  if (data.next) {
    results.push(...data.results);
    return getDataRecursively(endPoint, page + 1, results);
  }
  return results;
};

export const getVehicles = async () => {
  try {
    const vehiclesWithPilots = await getDataRecursively('vehicles/', 1, []);
    return vehiclesWithPilots;
  } catch (error) {
    console.log('Could not fetch vehicles ', error);
    return [];
  }
};

export const getPilotsByVehicles = async vehicles => {
  const pilotsUrls = [];
  vehicles.forEach(({ pilots }) => {
    pilotsUrls.push(...pilots);
  });
  const unique = [...new Set(pilotsUrls)];
  try {
    const pilots = await Promise.all(unique.map(url => fetchData(url)));
    return pilots;
  } catch (error) {
    console.log('Could not fetch pilots ', error);
    return [];
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
    console.log('Could not fetch planets ', error);
    return [];
  }
};

export const getPlanetsByNames = async list => {
  const urls = list.map(name => `planets/?search=${name}`);

  try {
    const planets = await Promise.all(urls.map(url => fetchData(url)));
    const planetsMapped = planets.map(({ results }) => {
      const { name, population } = results[0];
      return { name, population };
    });
    return planetsMapped;
  } catch (error) {
    console.log('Could not fetch planets ', error);
    return [];
  }
};
