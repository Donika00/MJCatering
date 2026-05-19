import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../services/cart';
import styles from './CakeCard.module.css';

const Stars = ({ value = 0 }) => {
  const filled = Math.round(value);
  return (
    <div className={styles.stars} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 24 24" width="12" height="12"
             fill={i <= filled ? 'var(--star)' : '#E5DCD0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

const CakeCard = ({ cake, compact = false }) => {
  const [liked, setLiked] = useState(false);

  const onAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      cakeId: cake.id,
      name: cake.name,
      price: cake.price,
      image_url: cake.image_url,
      qty: 1,
    });
  };

  const onLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(v => !v);
  };

  return (
    <Link to={`/cake/${cake.id}`} className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.imageWrap}>
        {cake.image_url ? (
          <img src={cake.image_url} alt={cake.name} loading="lazy" />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100" y2="100" stroke="#D8CFC2" strokeWidth="0.5" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="#D8CFC2" strokeWidth="0.5" />
            </svg>
          </div>
        )}

        <button
          className={`${styles.heart} ${liked ? styles.heartOn : ''}`}
          onClick={onLike}
          aria-label="Favorite"
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
               fill={liked ? 'var(--brand)' : 'none'}
               stroke={liked ? 'var(--brand)' : 'var(--text)'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        <button className={styles.addBtn} onClick={onAdd}>
          Add to Cart
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <div className={styles.name}>{cake.name}</div>
          <div className={styles.price}>${cake.price}</div>
        </div>
        <Stars value={cake.rating} />
      </div>
    </Link>
  );
};

export default CakeCard;
