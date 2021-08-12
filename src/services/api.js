import axios from 'axios';

const API_BASE_URL = 'https://swapi.py4e.com/api/';

const fetchData = async (endpoint = '') => (await axios.get(endpoint)).data;

// Old way of fetching data  performance measure-> 1649.67
// export const getVehicles = async () => {
//   window.performance.mark('vehicles_start');
//   const vehicles = [];
//   const pagesUrls = new Array(NUMBER_OF_RESULTS_PAGES).fill().map((_, index) => `vehicles/?page=${index + 1}`);

//   (await Promise.all(pagesUrls.map(pageUrl => fetchData(`${API_BASE_URL}${pageUrl}`)))).forEach(page => {
//     // pushing all objects from the page to the vehicles array
//     Array.prototype.push.apply(vehicles, page.results);
//   });

//   const vehiclesWithPilots = vehicles.filter(vehicle => vehicle.pilots.length > 0);
//   window.performance.mark('vehicles_end');
//   window.performance.measure('vehicles_duration', 'vehicles_start', 'vehicles_end');
//   console.log(window.performance.getEntriesByName('vehicles_duration')[0].duration);
//   return vehiclesWithPilots;
// };

// new way of fetching data performance measure->  635.12
const getDataRecursively = async (page = 1, results = []) => {
  const data = await fetchData(`${API_BASE_URL}vehicles/?page=${page}`);
  if (data.next) {
    results.push(...data.results);
    return await getDataRecursively(page + 1, results);
  }
  return results;
};

export const getVehicles = async () => {
  // window.performance.mark('vehicles_start');
  const vehiclesWithPilots = await getDataRecursively();
  // window.performance.mark('vehicles_end');
  // window.performance.measure('vehicles_duration', 'vehicles_start', 'vehicles_end');
  // console.log(window.performance.getEntriesByName('vehicles_duration')[0].duration);
  return vehiclesWithPilots;
};

// Old way of fetching pilots performance measure-> 430.7
// export const getPilotsByVehicles = async vehicles => {
//   window.performance.mark('pilots_start');

//   const pilotsUrls = [];
//   vehicles.forEach(vehicle => {
//     vehicle.pilots.forEach(pilotUrl => {
//       const isPilotExist = pilotsUrls.find(url => url === pilotUrl);
//       if (!isPilotExist) {
//         pilotsUrls.push(pilotUrl);
//       }
//     });
//   });

//   const pilots = await Promise.all(pilotsUrls.map(url => fetchData(url)));
//   window.performance.mark('pilots_end');
//   window.performance.measure('pilots_duration', 'pilots_start', 'pilots_end');
//   console.log(window.performance.getEntriesByName('pilots_duration')[0].duration);
//   return pilots;
// };

// new way of fetching pilots performance measure->  101.12
export const getPilotsByVehicles = async vehicles => {
  // window.performance.mark('pilots_start');
  const pilotsUrls = [];
  vehicles.forEach(({ pilots }) => {
    pilotsUrls.push(...pilots);
  });
  const unique = [...new Set(pilotsUrls)];
  const pilots = await Promise.all(unique.map(url => fetchData(url)));
  // window.performance.mark('pilots_end');
  // window.performance.measure('pilots_duration', 'pilots_start', 'pilots_end');
  // console.log(window.performance.getEntriesByName('pilots_duration')[0].duration);
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
