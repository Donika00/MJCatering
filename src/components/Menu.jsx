import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Menu.module.css';

const CATEGORIES = [
  { label: 'Cakes',           to: '/category/cakes', disabled: false },
  { label: 'French Macarons', to: null,              disabled: true  },
  { label: 'Desserts',        to: null,              disabled: true  },
  { label: 'Eclairs',         to: null,              disabled: true  },
];

const SECONDARY = [
  { label: 'Home',     to: '/',  disabled: false },
  { label: 'About',    to: null, disabled: true  },
  { label: 'Contact',  to: null, disabled: true  },
  { label: 'Language', to: null, disabled: true  },
];

const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const Row = ({ item, onClose }) => {
  if (item.disabled) {
    return (
      <button className={`${styles.row} ${styles.disabled}`} disabled>
        <span>{item.label}</span>
        <Chevron />
      </button>
    );
  }
  return (
    <Link to={item.to} className={styles.row} onClick={onClose}>
      <span>{item.label}</span>
      <Chevron />
    </Link>
  );
};

const Menu = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.logoWrap}>
          <img src="/logo.png" alt="MJ Catering" className={styles.logo} />
        </div>

        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Menu</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className={styles.list}>
          {CATEGORIES.map(item => (
            <Row key={item.label} item={item} onClose={onClose} />
          ))}
        </nav>

        <div className={styles.divider} />

        <nav className={styles.list}>
          {SECONDARY.map(item => (
            <Row key={item.label} item={item} onClose={onClose} />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Menu;
