import BottomSheet from './BottomSheet';
import Pill from './Pill';
import styles from './FilterModal.module.css';

export const DIETS = [
  { key: 'vegetarian',  label: 'Vegetarian' },
  { key: 'vegan',       label: 'Vegan' },
  { key: 'gluten_free', label: 'Gluten free' },
];

export const ALLERGENS = [
  'almonds', 'cashews', 'eggs',
  'hazelnuts', 'milk', 'nuts',
  'peanuts', 'pecans',
  'pistachios', 'walnuts',
];

const PRICE_TIERS = [
  { val: 1, label: '$' },
  { val: 2, label: '$$' },
  { val: 3, label: '$$$' },
  { val: 4, label: '$$$$' },
];

const toggle = (arr, val) =>
  arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const FilterModal = ({ open, onClose, filters, onChange, onReset, resultCount }) => {
  const { priceTiers, diets, excludeAllergens } = filters;

  const appliedCount =
    priceTiers.length + diets.length + excludeAllergens.length;

  const setPrice = (v) => onChange({ ...filters, priceTiers: toggle(priceTiers, v) });
  const setAllOptions = () => onChange({ ...filters, diets: [] });
  const setDiet = (key) => onChange({ ...filters, diets: toggle(diets, key) });
  const setAllergen = (a) => onChange({ ...filters, excludeAllergens: toggle(excludeAllergens, a) });

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className={styles.header}>
        <div className={styles.title}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="6" cy="7" r="2" />
            <path d="M6 9v9M6 3v2" />
            <circle cx="18" cy="17" r="2" />
            <path d="M18 3v12M18 19v2" />
          </svg>
          <h2>Filter</h2>
        </div>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={styles.summary}>
        <span><strong>{appliedCount}</strong> Filters applied</span>
        <span><strong>{resultCount}</strong> Results</span>
        <button className={styles.reset} onClick={onReset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
          Reset filter
        </button>
      </div>

      <section className={styles.section}>
        <h3>Price</h3>
        <div className={styles.row}>
          {PRICE_TIERS.map(p => (
            <Pill key={p.val} active={priceTiers.includes(p.val)} onClick={() => setPrice(p.val)}>
              {p.label}
            </Pill>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3>Show me:</h3>
        <div className={styles.row}>
          <Pill active={diets.length === 0} onClick={setAllOptions}>All options</Pill>
          {DIETS.map(d => (
            <Pill key={d.key} active={diets.includes(d.key)} onClick={() => setDiet(d.key)}>
              {d.label}
            </Pill>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3>Don&rsquo;t show me goodies with:</h3>
        <div className={styles.row}>
          {ALLERGENS.map(a => {
            const active = excludeAllergens.includes(a);
            return (
              <Pill key={a} active={active} onClick={() => setAllergen(a)}>
                <span className={styles.allergenIcon}>
                  {active ? '×' : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                    </svg>
                  )}
                </span>
                {cap(a)}
              </Pill>
            );
          })}
        </div>
      </section>
    </BottomSheet>
  );
};

export default FilterModal;
