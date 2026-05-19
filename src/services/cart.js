const KEY = 'mjcatering.cart.v1';
const EVT = 'mjcatering:cart-changed';

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (items) => {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
};

export const CART_EVENT = EVT;

export const cartCount = () =>
  read().reduce((sum, item) => sum + (item.qty || 1), 0);

export const addToCart = (entry) => {
  const items = read();
  items.push({ ...entry, addedAt: Date.now() });
  write(items);
};
