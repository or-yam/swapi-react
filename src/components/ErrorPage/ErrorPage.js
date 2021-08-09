import vader from '../../assets/vader.png';
import styles from './ErrorPage.module.css';

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <h1>Something went wrong...</h1>
      <img src={vader} alt="darth vader face" />
    </div>
  );
}
