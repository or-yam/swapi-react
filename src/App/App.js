import { useEffect, useState } from 'react';
import ChartContainer from '../components/ChartContainer/ChartContainer';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import Loading from '../components/LoadingPage/Loading';
import { findMostPopulatedVehicle, getPlanets } from './appLogic';
import './App.css';

export default function App() {
  const [planets, setPlanets] = useState([]);
  const [mostPopulatedVehicle, setMostPopulatedVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVehicleError, setIsVehicleError] = useState(false);
  const [isPlanetsError, setIsPlanetsError] = useState(false);

  const printMostPopulatedVehicle = () => {
    if (isVehicleError) console.warn('Could not fetch most populated vehicle');
    if (!mostPopulatedVehicle) return;
    console.table(mostPopulatedVehicle);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { results, vehiclesPlanets } = (await findMostPopulatedVehicle()) || {};
      const planetsData = await getPlanets(vehiclesPlanets);
      planetsData ? setPlanets(planetsData) : setIsPlanetsError(true);
      results ? setMostPopulatedVehicle(results) : setIsVehicleError(true);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <Loading />;
  if (isPlanetsError) return <ErrorPage />;

  return (
    <div className="App">
      {printMostPopulatedVehicle()}
      <ChartContainer planets={planets} />
    </div>
  );
}
