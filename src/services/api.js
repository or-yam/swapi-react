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

export const getVehicles = async () => {
  console.info('Fetching all vehicles...');
  try {
    const vehicles = await fetchAllPagesRecursively('vehicles', 1, []);
    return vehicles;
  } catch (error) {
    console.warn('Could not fetch vehicles', error);
    return null;
  }
};

export const getPilotsByVehicles = async vehicles => {
  console.info('Fetching relevant pilots...');
  const pilotsUrls = [];
  vehicles.forEach(({ pilots }) => pilotsUrls.push(...pilots));
  const uniqueUrls = [...new Set(pilotsUrls)];
  try {
    // All or nothing
    const pilots = await Promise.all(uniqueUrls.map(url => fetchData(url)));
    return pilots;
  } catch (error) {
    console.warn('Could not fetch pilots', error);
    return null;
  }
};

export const getPlanetsByPilots = async pilots => {
  console.info('Fetching relevant planets...');
  const planetsUrls = [];
  pilots.forEach(({ homeworld }) => {
    planetsUrls.push(homeworld);
  });
  const uniqueUrls = [...new Set(planetsUrls)];
  try {
    // All or nothing
    const planets = await Promise.all(uniqueUrls.map(url => fetchData(url)));
    const planetsWithPopulation = planets.filter(({ population }) => population !== 'unknown');
    return planetsWithPopulation;
  } catch (error) {
    console.warn('Could not fetch planets', error);
    return null;
  }
};

export const getPlanetsByNames = async planetsNames => {
  console.info('Fetching planets list...', planetsNames);
  const urls = planetsNames.map(name => `${API_BASE_URL}planets/?search=${name}`);
  try {
    // All or nothing
    const planetsData = await Promise.all(urls.map(url => fetchData(url)));
    return planetsData.map(({ results }) => {
      if (!results) return null;
      const { name, population } = results[0];
      return { name, population };
    });
  } catch (error) {
    console.warn('Could not fetch planets', error);
    return null;
  }
};
