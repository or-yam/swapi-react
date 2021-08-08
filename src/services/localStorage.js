const STORAGE_NAME = 'swapi_react_results';

export const saveResultsToLocalStorage = (results, key) => {
  localStorage.setItem(`${STORAGE_NAME}_${key}`, JSON.stringify(results));
};

export const getResultsFromLocalStorage = key => {
  const results = localStorage.getItem(`${STORAGE_NAME}_${key}`);
  console.log(`${key} restored from local storage`);
  return results ? JSON.parse(results) : false;
};
