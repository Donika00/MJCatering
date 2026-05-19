import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import CakeCard from '../components/CakeCard';
import FilterModal from '../components/FilterModal';
import { getCakes } from '../services/supabase';
import styles from './CakesList.module.css';

const CATEGORY = 'cakes';
const CATEGORY_TITLE = 'Cakes';
const CATEGORY_BANNER = '/cakes/cake-1.png';

// URL ⇆ filter state encoding ----------------------------------------------

const parseFiltersFromUrl = (params) => ({
  search: params.get('q') || '',
  priceTiers: (params.get('price') || '')
    .split(',').filter(Boolean).map(Number).filter(n => n >= 1 && n <= 4),
  diets: (params.get('diet') || '').split(',').filter(Boolean),
  excludeAllergens: (params.get('ex') || '').split(',').filter(Boolean),
});

const writeFiltersToUrl = (filters) => {
  const p = new URLSearchParams();
  if (filters.search) p.set('q', filters.search);
  if (filters.priceTiers.length) p.set('price', filters.priceTiers.join(','));
  if (filters.diets.length) p.set('diet', filters.diets.join(','));
  if (filters.excludeAllergens.length) p.set('ex', filters.excludeAllergens.join(','));
  return p;
};

const EMPTY_FILTERS = { search: '', priceTiers: [], diets: [], excludeAllergens: [] };

const CakesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = useMemo(() => parseFiltersFromUrl(searchParams), [searchParams]);

  const setFilters = (next) => {
    setSearchParams(writeFiltersToUrl(next), { replace: true });
  };

  // Debounced fetch ---------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      getCakes(CATEGORY, filters)
        .then(data => setCakes(data))
        .finally(() => setLoading(false));
    }, 180);
    return () => clearTimeout(t);
  }, [filters.search, filters.priceTiers.join(','), filters.diets.join(','), filters.excludeAllergens.join(',')]);

  const appliedCount =
    filters.priceTiers.length + filters.diets.length + filters.excludeAllergens.length;

  const reset = () => setFilters(EMPTY_FILTERS);

  return (
    <>
      <Header showBack title="MJ Catering" />

      <section className={styles.banner}>
        <img src={CATEGORY_BANNER} alt={CATEGORY_TITLE} />
        <div className={styles.bannerLabel}>{CATEGORY_TITLE}</div>
      </section>

      <SearchBar
        value={filters.search}
        onChange={(v) => setFilters({ ...filters, search: v })}
        onOpenFilter={() => setFilterOpen(true)}
        filterCount={appliedCount}
      />

      {loading ? (
        <div className={styles.state}>Loading&hellip;</div>
      ) : cakes.length === 0 ? (
        <div className={styles.state}>
          <p>No items match your filters.</p>
          {appliedCount > 0 && (
            <button className={styles.resetBtn} onClick={reset}>Reset filters</button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {cakes.map(c => (
            <CakeCard key={c.id} cake={c} />
          ))}
        </div>
      )}

      <Footer />

      <FilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={reset}
        resultCount={cakes.length}
      />
    </>
  );
};

export default CakesList;
