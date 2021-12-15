import { getLogMaxHeightFromNumsList, toPercentage } from '../../helpers/index';
import ChartColumn from '../ChartColumn/ChartColumn';
import styles from './ChartContainer.module.css';

export default function ChartContainer({ planets }) {
  // Using logarithmic scale to normalize data
  const maxHeight = getLogMaxHeightFromNumsList(planets.map(({ population }) => population));
  const toPercentage = (value, maxValue) => (Math.log(value) / maxValue) * 100;

  /*
 Use the math magic in the state to save the calculations there
 Maybe use useMemo to save the calculations
 or use callback functions to save the calculations 
 */

  return (
    <div className={styles.chartContainer}>
      {planets.map(({ population, name }, index) => (
        <ChartColumn key={index} name={name} height={toPercentage(population)} population={population} />
      ))}
    </div>
  );
}
