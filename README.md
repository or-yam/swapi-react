# SWAPI with create-react-app

The api doesn't expose an endpoint to get all vehicles without pagination.

Since there is no upcoming Star-wars movie, I assumed that the number of

results will stay constant: 39 vehicles in 4 pages.

After the first fetch the data will be stored in local-storage.

Planets population normalized by using log<sub>e</sub>(n) to improve data visualization.(Displayed numbers kept as original)

Just for fun, The bar-chart is displayed as lightsabers.

#### Alternative APIs in case the current will not work

- https://www.swapi.tech/api
- https://swapi.py4e.com/api/ (current one)
- https://swapi.dev/api/
