import { useEffect, useState } from 'react';
import ChartContainer from '../components/ChartContainer/ChartContainer';
import ErrorPage from '../components/ErrorPage/ErrorPage';
import Loading from '../components/LoadingPage/Loading';
import getPlanetsData from './planets';
import getPopulationResults from './vehiclePopulation';
import './App.css';

export default function App() {
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      getPopulationResults();
      const planetsData = await getPlanetsData(); // TODO catching and handling errors
      planetsData ? setPlanets(planetsData) : setIsError(true);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <Loading />;
  if (isError) return <ErrorPage />; // Maybe use React.ErrorBoundaries

  return (
    <div className="App">
      <ChartContainer planets={planets} />
    </div>
  );
}
