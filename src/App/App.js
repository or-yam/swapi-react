import { useEffect, useState } from 'react';
import ChartContainer from '../components/ChartContainer/ChartContainer';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import Loading from '../components/LoadingPage/Loading';
import getPlanetsData from './planets';
import { findMostPopulatedVehicle } from '../services/api';
import './App.css';

export default function App() {
  const [planets, setPlanets] = useState([]);
  const [vehicles, setVehicles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const vehicleResults = await findMostPopulatedVehicle();
      const planetsData = await getPlanetsData();
      planetsData ? setPlanets(planetsData) : setIsError(true);
      vehicleResults ? setVehicles(vehicleResults) : setIsError(true);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorPage />;
  console.table(vehicles);
  return <div className="App">{<ChartContainer planets={planets} />}</div>;
}
