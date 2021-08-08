import { numberWithCommas } from '../../helpers';
import hilt from '../../assets/hilt.png';
import styles from './ChartColumn.module.css';

export default function ChartColumn({ name, population, height }) {
  return (
    <div className={styles.chartBarWrapper}>
      <div className={styles.numberLabel}>{numberWithCommas(population)}</div>
      <div
        className={styles.bar}
        style={{
          height: `${height}%`
        }}
      ></div>
      <img className={styles.hilt} src={hilt} alt="light saber hilt" />
      <div className={styles.nameLabel}>{name}</div>
    </div>
  );
}
