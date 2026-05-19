import { Link, useNavigate } from 'react-router-dom';
import { useCartCount } from '../hooks/useCart';
import styles from './Header.module.css';

const Header = ({ showBack = false, title }) => {
  const count = useCartCount();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      {showBack ? (
        <button
          className={styles.iconBtn}
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <button className={styles.iconBtn} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      )}

      <Link to="/" className={styles.brand} aria-label={title || 'MJ Catering'}>
        <img src="/logo.png" alt={title || 'MJ Catering'} className={styles.logo} />
      </Link>

      <Link to="/" className={styles.iconBtn} aria-label="Cart">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
        </svg>
        {count > 0 && <span className={styles.badge}>{count}</span>}
      </Link>
    </header>
  );
};

export default Header;
