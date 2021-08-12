# SWAPI with create-react-app

## Running the app locally

1. clone the repo
2. run `npm i`
3. run `npm start`
4. open `http://localhost:3000/` in your browser

The api doesn't expose an endpoint to get all vehicles without pagination and since there is no upcoming Star-wars movie, ~~I assumed that the number of results will stay constant: 39 vehicles in 4 pages.~~
Update - used `data.next` to fetch rest all the pages recursively. Apparently this method has better performance than `Promise.all` (1649.67 vs 635.12 ms).

After the first fetch the data will be stored in local-storage.

Planets population normalized by using log<sub>e</sub>(n) to improve data visualization.(Displayed numbers kept as original)

Just for fun, The bar-chart is displayed as lightsabers.

#### Alternative APIs in case the current will not work

- https://www.swapi.tech/api
- https://swapi.py4e.com/api/ (current one)
- https://swapi.dev/api/
