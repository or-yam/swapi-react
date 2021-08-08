import ChartColumn from '../ChartColumn/ChartColumn';
import styles from './ChartContainer.module.css';

export default function ChartContainer({ planets }) {
  const maxHeight = Math.max(...planets.map(({ population }) => Math.log(population)));
  const toPercentage = value => (Math.log(value) / maxHeight) * 100;

  return (
    <div className={styles.chartContainer}>
      {planets.map(({ population, name }, index) => (
        <ChartColumn key={index} name={name} height={toPercentage(population)} population={population} />
      ))}
    </div>
  );
}
