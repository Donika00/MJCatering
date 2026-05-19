import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pill from '../components/Pill';
import { getCakeById } from '../services/supabase';
import { addToCart } from '../services/cart';
import styles from './CakeDetail.module.css';

const Stars = ({ value = 0 }) => {
  const filled = Math.round(value);
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 24 24" width="14" height="14"
             fill={i <= filled ? 'var(--star)' : '#E5DCD0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const CakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cake, setCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const [sizeIdx, setSizeIdx] = useState(0);
  const [extraIdx, setExtraIdx] = useState([]);
  const [messageOnCake, setMessageOnCake] = useState('');
  const [extraNotes, setExtraNotes] = useState('');

  useEffect(() => {
    getCakeById(id).then(c => {
      setCake(c);
      setLoading(false);
    });
  }, [id]);

  const totalPrice = useMemo(() => {
    if (!cake) return 0;
    const sizeDelta = cake.sizes?.[sizeIdx]?.price_delta || 0;
    const extrasDelta = extraIdx.reduce(
      (sum, i) => sum + (cake.extras?.[i]?.price_delta || 0), 0
    );
    return Number(cake.price) + sizeDelta + extrasDelta;
  }, [cake, sizeIdx, extraIdx]);

  if (loading) {
    return (
      <>
        <Header showBack />
        <div className={styles.state}>Loading&hellip;</div>
      </>
    );
  }

  if (!cake) {
    return (
      <>
        <Header showBack />
        <div className={styles.state}>
          <p>Cake not found.</p>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>Go back</button>
        </div>
      </>
    );
  }

  const toggleExtra = (i) =>
    setExtraIdx(arr => arr.includes(i) ? arr.filter(x => x !== i) : [...arr, i]);

  const onAdd = () => {
    addToCart({
      cakeId: cake.id,
      name: cake.name,
      price: totalPrice,
      image_url: cake.image_url,
      size: cake.sizes?.[sizeIdx]?.label,
      extras: extraIdx.map(i => cake.extras[i].label),
      messageOnCake,
      extraNotes,
      qty: 1,
    });
    navigate(-1);
  };

  return (
    <>
      <Header showBack />

      <div className={styles.image}>
        <img src={cake.image_url} alt={cake.name} />
        <button
          className={`${styles.heart} ${liked ? styles.heartOn : ''}`}
          onClick={() => setLiked(v => !v)}
          aria-label="Favorite"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
               fill={liked ? 'var(--brand)' : 'none'}
               stroke={liked ? 'var(--brand)' : 'var(--text)'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.headRow}>
          <h1 className={styles.name}>{cake.name}</h1>
          <div className={styles.price}>${cake.price}</div>
        </div>
        <Stars value={cake.rating} />

        <p className={styles.desc}>{cake.description}</p>

        {cake.allergens?.length > 0 && (
          <div className={styles.allergens}>
            <strong>Allergens:</strong>
            <br />
            {cake.allergens.map(cap).join(', ')}.
          </div>
        )}

        <div className={styles.dietRow}>
          <DietTag active={cake.is_vegetarian} label="Vegetarian" />
          <DietTag active={cake.is_vegan} label="Vegan" />
          <DietTag active={cake.is_gluten_free} label="Gluten Free" />
        </div>

        {cake.sizes?.length > 0 && (
          <section className={styles.section}>
            <h3>Size</h3>
            <div className={styles.row}>
              {cake.sizes.map((s, i) => (
                <Pill key={s.label} active={sizeIdx === i} onClick={() => setSizeIdx(i)}>
                  {s.label}
                </Pill>
              ))}
            </div>
          </section>
        )}

        {cake.extras?.length > 0 && (
          <section className={styles.section}>
            <h3>Add Extras</h3>
            <div className={styles.row}>
              {cake.extras.map((ex, i) => {
                const active = extraIdx.includes(i);
                return (
                  <Pill key={ex.label} active={active} onClick={() => toggleExtra(i)}>
                    <span className={styles.box}>
                      {active ? '✓' : ''}
                    </span>
                    {ex.label}
                  </Pill>
                );
              })}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h3>Custom Message</h3>
          <div className={styles.fieldWrap}>
            <input
              className={styles.field}
              type="text"
              placeholder="Write a message on the cake"
              value={messageOnCake}
              onChange={(e) => setMessageOnCake(e.target.value)}
            />
            <svg className={styles.fieldIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>

          <input
            className={styles.field}
            type="text"
            placeholder="Anything else?"
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
          />
        </section>
      </div>

      <div className={styles.cta}>
        <button className={styles.ctaBtn} onClick={onAdd}>
          Add to Cart — ${totalPrice.toFixed(2)}
        </button>
      </div>

      <Footer />
    </>
  );
};

const DietTag = ({ active, label }) => (
  <span className={`${styles.diet} ${active ? styles.dietOn : ''}`}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 18 0 9 9 0 0 0-9-9 9 9 0 0 0-9 9" />
    </svg>
    {label}
  </span>
);

export default CakeDetail;
