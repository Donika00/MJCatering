import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.brand}>
      <img src="/logo.png" alt="MJ Catering" className={styles.logo} />
    </div>

    <div className={styles.cols}>
      <div className={styles.col}>
        <h4>Browse</h4>
        <ul>
          <li><Link to="/category/cakes">Cakes</Link></li>
        </ul>
      </div>

      <div className={styles.col}>
        <h4>Contacts</h4>
        <ul className={styles.contacts}>
          <li>+359 884 809 029</li>
          <li>office@mjcatering.net</li>
          <li>Sofia city, Iliantsi Blvd 12&ndash;14</li>
        </ul>
      </div>
    </div>

    <div className={styles.copy}>
      &copy; 2026 MJ Catering. All rights reserved.
    </div>
  </footer>
);

export default Footer;
