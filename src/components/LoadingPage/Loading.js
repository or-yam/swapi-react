import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <h1>Loading Data</h1>
      <div className={styles.ldsHourglass}></div>
    </div>
  );
}
