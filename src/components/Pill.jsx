import styles from './Pill.module.css';

const Pill = ({ active = false, onClick, children, ...rest }) => (
  <button
    type="button"
    className={`${styles.pill} ${active ? styles.active : ''}`}
    onClick={onClick}
    {...rest}
  >
    {children}
  </button>
);

export default Pill;
