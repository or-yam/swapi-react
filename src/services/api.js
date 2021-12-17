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

// const getBy = async (get, by) => {
//   const urls = [];
//   by.forEach(({ get }) => urls.push(...get));
//   const uniqueUrls = [...new Set(urls)];
//   try {
//     const data = await Promise.all(uniqueUrls.map(url => fetchData(url)));
//     return data;
//   } catch (error) {
//     console.warn(`Could not fetch ${get}`, error);
//     return [];
//   }
// };

export const getVehicles = async () => {
  try {
    const vehicles = await fetchAllPagesRecursively('vehicles', 1, []);
    return vehicles;
  } catch (error) {
    console.warn('Could not fetch vehicles', error);
    return [];
  }
};

export const getPilotsByVehicles = async vehicles => {
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

export const getPilotsByVehicle = async vehicle => {
  const pilotsUrls = vehicle.pilots;
  const uniqueUrls = [...new Set(pilotsUrls)]; // might not be necessary
  try {
    const pilots = await Promise.all(uniqueUrls.map(url => fetchData(url)));
    return pilots;
  } catch (error) {
    console.warn('Could not fetch pilots', error);
    return [];
  }
};

export const getPlanetsByPilots = async pilots => {
  const planetsUrls = [];
  pilots.forEach(({ homeworld }) => {
    planetsUrls.push(homeworld);
  });
  const uniqueUrls = [...new Set(planetsUrls)];
  try {
    const planets = await Promise.all(uniqueUrls.map(url => fetchData(url)));
    const planetsWithPopulation = planets.filter(({ population }) => population !== 'unknown');
    return planetsWithPopulation.map(({ name, population }) => ({ name, population }));
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

export const findVehiclesWithHighestPopulation = async () => {
  const results = {
    vehicle: { populationSum: 0 },
    planets: [],
    pilotsNames: []
  };
  const vehicles = await getVehicles();
  // using promise all instead of forEach because of async nature of getPilotsByVehicle
  // https://stackoverflow.com/a/51738717/13516210
  await Promise.all(
    vehicles.map(async vehicle => {
      // might have duplication fetching data
      const pilots = await getPilotsByVehicle(vehicle);
      if (pilots.length === 0) return;
      const planets = await getPlanetsByPilots(pilots);
      if (planets.length === 0) return;
      const population = planets.reduce((acc, { population }) => acc + Number(population), 0);
      if (population > results.vehicle.populationSum) {
        results.vehicle = { vehicleName: vehicle.name, populationSum: population };
        results.planets = planets;
        results.pilotsNames = pilots.map(({ name }) => name);
      }
    })
  );

  return results;
};
