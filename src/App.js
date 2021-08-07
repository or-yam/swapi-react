import { useEffect, useState } from 'react';
import ChartContainer from './Chart/ChartContainer/ChartContainer';
import { getPlanetsForChart, findVehicleByHigestPilotsHomePlanePopulation } from './api';
import './App.css';

export default function App() {
  const [planets, setPlanets] = useState([]);
  useEffect(() => {
    (async () => {
      await findVehicleByHigestPilotsHomePlanePopulation();
      setPlanets(await getPlanetsForChart());
    })();
  }, []);

  return (
    <div className="App">
      <ChartContainer planets={planets} />
    </div>
  );
}