import styles from './SearchBar.module.css';

const SearchBar = ({ value, onChange, onOpenFilter, filterCount = 0 }) => (
  <div className={styles.wrap}>
    <label className={styles.search}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>

    <button className={styles.filterBtn} onClick={onOpenFilter}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="6" cy="7" r="2" />
        <path d="M6 9v9M6 3v2" />
        <circle cx="18" cy="17" r="2" />
        <path d="M18 3v12M18 19v2" />
      </svg>
      Filter
      {filterCount > 0 && <span className={styles.count}>{filterCount}</span>}
    </button>
  </div>
);

export default SearchBar;
