import { Link } from 'react-router-dom';
import Header from '../components/Header';
import styles from './NotFound.module.css';

const NotFound = () => (
  <>
    <Header showBack />
    <div className={styles.wrap}>
      <h1>404</h1>
      <p>The page you were looking for isn&rsquo;t here.</p>
      <Link to="/" className={styles.home}>Back to home</Link>
    </div>
  </>
);

export default NotFound;
