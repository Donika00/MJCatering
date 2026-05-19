import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryCard from '../components/CategoryCard';
import CakeCard from '../components/CakeCard';
import { getBestsellers } from '../services/supabase';
import styles from './Landing.module.css';

const CATEGORIES = [
  { slug: 'cakes',    label: 'Cakes',           image: '/cakes/cake-2.png',           disabled: false },
  { slug: 'macarons', label: 'French Macarons', image: '/macarons/macaroons-2.png',   disabled: true },
  { slug: 'eclairs',  label: 'Eclairs',         image: '/eclairs/eclair-2.png',       disabled: true },
  { slug: 'desserts', label: 'Desserts',        image: '/desserts/dessert-2.png',     disabled: true },
];

const TESTIMONIAL = {
  stars: 5,
  text: 'Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything.',
  name: 'Sabo Masties',
  role: 'Founder @ Rolex',
};

const BestsellerCarousel = ({ items }) => {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    const slide = track.children[clamped];
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
      setIndex(clamped);
    }
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let bestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const childCenter = child.offsetLeft - track.offsetLeft + child.clientWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) { bestDist = dist; nearest = i; }
    });
    if (nearest !== index) setIndex(nearest);
  };

  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>Bestsellers</h2>

      {items.length === 0 ? (
        <div className={styles.empty}>No bestsellers yet.</div>
      ) : (
        <div className={styles.carousel}>
          <button
            className={`${styles.navBtn} ${styles.navPrev}`}
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className={styles.scroller} ref={trackRef} onScroll={onScroll}>
            {items.map(c => (
              <div className={styles.scrollItem} key={c.id}>
                <CakeCard cake={c} compact />
              </div>
            ))}
          </div>

          <button
            className={`${styles.navBtn} ${styles.navNext}`}
            onClick={() => goTo(index + 1)}
            disabled={index === items.length - 1}
            aria-label="Next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className={styles.dots}>
            {items.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const Landing = () => {
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    getBestsellers().then(setBestsellers);
  }, []);

  return (
    <>
      <Header />

      <section className={styles.hero}>
        <img
          src="/cakes/cake-3.png"
          alt=""
          className={styles.heroImg}
        />
        <div className={styles.heroOverlay}>
          <h1>MJ Catering</h1>
          <Link to="/category/cakes" className={styles.aboutBtn}>Browse Cakes</Link>
        </div>
      </section>

      <section className={styles.categories}>
        {CATEGORIES.map(c => (
          <CategoryCard key={c.slug} {...c} />
        ))}
      </section>

      <BestsellerCarousel items={bestsellers} />

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>What our clients say</h2>
        <div className={styles.testimonial}>
          <div className={styles.stars}>
            {'★★★★★'.slice(0, TESTIMONIAL.stars)}
          </div>
          <p>{TESTIMONIAL.text}</p>
          <div className={styles.author}>
            <div className={styles.name}>{TESTIMONIAL.name}</div>
            <div className={styles.role}>{TESTIMONIAL.role}</div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Landing;
