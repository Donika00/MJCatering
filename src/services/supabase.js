import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  supabaseUrl && supabaseAnonKey &&
  supabaseUrl.startsWith('http') && supabaseAnonKey.length > 20;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Demo data shown when Supabase isn't configured so the UI is still usable.
const DEMO_CAKES = [
  {
    id: 1, name: 'Peach big cake with fruits and chocolate', category: 'cakes',
    price: 17, price_tier: 2, rating: 4.5, is_bestseller: true,
    is_vegetarian: true, is_vegan: false, is_gluten_free: false,
    allergens: ['eggs', 'milk', 'pecans', 'pistachios'],
    image_url: '/cakes/cake-1.png',
    description:
      'A true masterpiece, featuring layers of moist peach-infused sponge cake generously filled with a medley of fresh, vibrant fruits and velvety chocolate.',
    sizes: [
      { label: 'Small', price_delta: 0 },
      { label: 'Medium', price_delta: 4 },
      { label: 'Large', price_delta: 8 },
    ],
    extras: [
      { label: 'Mint Leaves', price_delta: 1 },
      { label: 'Edible Flowers', price_delta: 2 },
      { label: 'Caramel Drizzle', price_delta: 1.5 },
      { label: 'Whipped Cream', price_delta: 1 },
      { label: 'Toasted Coconut Flakes', price_delta: 1.5 },
    ],
  },
  {
    id: 2, name: 'Chocolate dream layer cake', category: 'cakes',
    price: 22, price_tier: 3, rating: 4.8, is_bestseller: false,
    is_vegetarian: true, is_vegan: false, is_gluten_free: false,
    allergens: ['eggs', 'milk', 'hazelnuts'],
    image_url: '/cakes/cake-2.png',
    description: 'Rich dark chocolate sponge layered with silky ganache and finished with chocolate curls.',
    sizes: [
      { label: 'Small', price_delta: 0 },
      { label: 'Medium', price_delta: 5 },
      { label: 'Large', price_delta: 10 },
    ],
    extras: [
      { label: 'Edible Flowers', price_delta: 2 },
      { label: 'Whipped Cream', price_delta: 1 },
    ],
  },
  {
    id: 3, name: 'Vegan berry sponge', category: 'cakes',
    price: 19, price_tier: 2, rating: 4.6, is_bestseller: false,
    is_vegetarian: true, is_vegan: true, is_gluten_free: false,
    allergens: [],
    image_url: '/cakes/cake-3.png',
    description: 'A light, plant-based vanilla sponge topped with fresh seasonal berries and coconut cream.',
    sizes: [{ label: 'Small', price_delta: 0 }, { label: 'Medium', price_delta: 4 }, { label: 'Large', price_delta: 8 }],
    extras: [{ label: 'Edible Flowers', price_delta: 2 }, { label: 'Coconut Cream', price_delta: 1 }],
  },
  {
    id: 4, name: 'Gluten-free almond celebration cake', category: 'cakes',
    price: 24, price_tier: 3, rating: 4.4, is_bestseller: false,
    is_vegetarian: true, is_vegan: false, is_gluten_free: true,
    allergens: ['almonds', 'eggs', 'milk'],
    image_url: '/cakes/cake-1.png',
    description: 'Tender almond sponge with citrus glaze — gluten-free without compromise.',
    sizes: [{ label: 'Small', price_delta: 0 }, { label: 'Medium', price_delta: 5 }, { label: 'Large', price_delta: 10 }],
    extras: [{ label: 'Mint Leaves', price_delta: 1 }, { label: 'Whipped Cream', price_delta: 1 }],
  },
  {
    id: 5, name: 'Tiered wedding showpiece', category: 'cakes',
    price: 95, price_tier: 4, rating: 5.0, is_bestseller: false,
    is_vegetarian: true, is_vegan: false, is_gluten_free: false,
    allergens: ['eggs', 'milk', 'walnuts'],
    image_url: '/cakes/cake-2.png',
    description: 'Three-tier vanilla and raspberry cake with hand-piped buttercream florals.',
    sizes: [{ label: 'Medium', price_delta: 0 }, { label: 'Large', price_delta: 35 }],
    extras: [{ label: 'Edible Flowers', price_delta: 5 }],
  },
  {
    id: 10, name: 'Mixed dessert tasting plate', category: 'desserts',
    price: 26, price_tier: 3, rating: 4.7, is_bestseller: true,
    is_vegetarian: true, is_vegan: false, is_gluten_free: false,
    allergens: ['eggs', 'milk', 'peanuts', 'walnuts'],
    image_url: '/desserts/dessert-1.png',
    description: 'A curated plate of bite-sized desserts — perfect for sharing.',
    sizes: [{ label: 'For 2', price_delta: 0 }, { label: 'For 4', price_delta: 20 }],
    extras: [],
  },
];

const overlaps = (a, b) => a.some(x => b.includes(x));

const applyFiltersLocal = (rows, { search, priceTiers, diets, excludeAllergens }) => {
  return rows.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (priceTiers?.length && !priceTiers.includes(c.price_tier)) return false;
    if (diets?.includes('vegetarian')  && !c.is_vegetarian)  return false;
    if (diets?.includes('vegan')       && !c.is_vegan)       return false;
    if (diets?.includes('gluten_free') && !c.is_gluten_free) return false;
    if (excludeAllergens?.length && overlaps(c.allergens || [], excludeAllergens)) return false;
    return true;
  });
};

const DEFAULT_FILTERS = { search: '', priceTiers: [], diets: [], excludeAllergens: [] };

export const getCakes = async (category, filters = DEFAULT_FILTERS) => {
  const f = { ...DEFAULT_FILTERS, ...filters };

  if (!supabase) {
    const rows = DEMO_CAKES.filter(c => c.category === category);
    return applyFiltersLocal(rows, f);
  }

  try {
    let q = supabase.from('cakes').select('*').eq('category', category);

    if (f.search) q = q.ilike('name', `%${f.search}%`);
    if (f.priceTiers.length) q = q.in('price_tier', f.priceTiers);
    if (f.diets.includes('vegetarian'))  q = q.eq('is_vegetarian', true);
    if (f.diets.includes('vegan'))       q = q.eq('is_vegan', true);
    if (f.diets.includes('gluten_free')) q = q.eq('is_gluten_free', true);
    if (f.excludeAllergens.length) {
      q = q.not('allergens', 'ov', `{${f.excludeAllergens.join(',')}}`);
    }

    const { data, error } = await q.order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getCakes error:', err);
    return [];
  }
};

export const getCakeById = async (id) => {
  const numId = Number(id);

  if (!supabase) {
    return DEMO_CAKES.find(c => c.id === numId) || null;
  }

  try {
    const { data, error } = await supabase
      .from('cakes')
      .select('*')
      .eq('id', numId)
      .maybeSingle();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('getCakeById error:', err);
    return null;
  }
};

export const getBestsellers = async () => {
  if (!supabase) {
    return DEMO_CAKES.filter(c => c.is_bestseller);
  }

  try {
    const { data, error } = await supabase
      .from('cakes')
      .select('*')
      .eq('is_bestseller', true)
      .order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('getBestsellers error:', err);
    return [];
  }
};
