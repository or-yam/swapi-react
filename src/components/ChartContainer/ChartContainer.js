import ChartColumn from '../ChartColumn/ChartColumn';
import { toLogPercentage } from '../../helpers';
import styles from './ChartContainer.module.css';

//* Using logarithmic scale to normalize data
export default function ChartContainer({ planets }) {
  const maxPopulation = Math.max(...planets.map(({ population }) => population));

  return (
    <div className={styles.chartContainer}>
      {planets.map(({ population, name }, index) => (
        <ChartColumn
          key={index}
          name={name}
          height={toLogPercentage(population, maxPopulation)}
          population={population}
        />
      ))}
    </div>
  );
}
