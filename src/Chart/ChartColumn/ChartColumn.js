import styles from './ChartColumn.module.css';

export default function ChartColumn({ name, population, height }) {
  return (
    <div className={styles.chartBarWrapper}>
      <div className={styles.numberLabel}>{population}</div>
      <div
        className={styles.bar}
        style={{
          height: `${height}%`
        }}
      ></div>
      <div className={styles.nameLabel}>{name}</div>
    </div>
  );
}
