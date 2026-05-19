import { Link } from 'react-router-dom';
import styles from './CategoryCard.module.css';

const CategoryCard = ({ slug, label, image, disabled = false }) => {
  const content = (
    <>
      <img src={image} alt={label} loading="lazy" />
      <div className={styles.overlay}>
        <span>{label}</span>
      </div>
    </>
  );

  if (disabled) {
    return (
      <div className={`${styles.card} ${styles.disabled}`} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link to={`/category/${slug}`} className={styles.card}>
      {content}
    </Link>
  );
};

export default CategoryCard;
