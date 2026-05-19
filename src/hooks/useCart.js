import { useEffect, useState } from 'react';
import { cartCount, CART_EVENT } from '../services/cart';

export const useCartCount = () => {
  const [count, setCount] = useState(cartCount());

  useEffect(() => {
    const update = () => setCount(cartCount());
    window.addEventListener(CART_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CART_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return count;
};
