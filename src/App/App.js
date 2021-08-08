import { useEffect, useState } from 'react';
import ChartContainer from '../components/ChartContainer/ChartContainer';
import getPlanetsData from './planets';
import getPopulationResults from './vehiclePopulation';
import './App.css';

export default function App() {
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    getPopulationResults();
    (async () => {
      const planetsData = await getPlanetsData();
      setPlanets(planetsData);
    })();
  }, []);

  return (
    <div className="App">
      <ChartContainer planets={planets} />
    </div>
  );
}
