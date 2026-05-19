-- MJCatering Supabase schema
-- Run in the Supabase SQL editor for a fresh project.

create table if not exists cakes (
  id              bigserial primary key,
  name            text not null,
  description     text,
  category        text not null check (category in ('cakes','desserts')),
  price           numeric(10,2) not null,
  price_tier      smallint not null check (price_tier between 1 and 4),
  rating          numeric(2,1) default 4.5,
  image_url       text,
  is_bestseller   boolean default false,
  is_vegetarian   boolean default false,
  is_vegan        boolean default false,
  is_gluten_free  boolean default false,
  allergens       text[] default '{}',
  sizes           jsonb default '[]'::jsonb,
  extras          jsonb default '[]'::jsonb,
  created_at      timestamptz default now()
);

create index if not exists cakes_category_idx   on cakes(category);
create index if not exists cakes_price_tier_idx on cakes(price_tier);
create index if not exists cakes_allergens_idx  on cakes using gin (allergens);

alter table cakes enable row level security;

drop policy if exists "public read" on cakes;
create policy "public read" on cakes for select using (true);

-- Seed data --------------------------------------------------------------

insert into cakes
  (name, description, category, price, price_tier, rating, image_url, is_bestseller,
   is_vegetarian, is_vegan, is_gluten_free, allergens, sizes, extras)
values
  ('Peach big cake with fruits and chocolate',
   'A true masterpiece, featuring layers of moist peach-infused sponge cake generously filled with a medley of fresh, vibrant fruits and velvety chocolate.',
   'cakes', 17.00, 2, 4.5,
   '/cakes/cake-1.png',
   true, true, false, false,
   '{"eggs","milk","pecans","pistachios"}',
   '[{"label":"Small","price_delta":0},{"label":"Mediano","price_delta":4},{"label":"Grande","price_delta":8}]'::jsonb,
   '[{"label":"Mint Leaves","price_delta":1},{"label":"Edible Flowers","price_delta":2},{"label":"Caramel Drizzle","price_delta":1.5},{"label":"Whipped Cream","price_delta":1},{"label":"Toasted Coconut Flakes","price_delta":1.5}]'::jsonb),

  ('Chocolate dream layer cake',
   'Rich dark chocolate sponge layered with silky ganache and finished with chocolate curls.',
   'cakes', 22.00, 3, 4.8,
   '/cakes/cake-2.png',
   false, true, false, false,
   '{"eggs","milk","hazelnuts"}',
   '[{"label":"Small","price_delta":0},{"label":"Mediano","price_delta":5},{"label":"Grande","price_delta":10}]'::jsonb,
   '[{"label":"Edible Flowers","price_delta":2},{"label":"Whipped Cream","price_delta":1}]'::jsonb),

  ('Vegan berry sponge',
   'A light, plant-based vanilla sponge topped with fresh seasonal berries and coconut cream.',
   'cakes', 19.00, 2, 4.6,
   '/cakes/cake-3.png',
   false, true, true, false,
   '{}',
   '[{"label":"Small","price_delta":0},{"label":"Mediano","price_delta":4},{"label":"Grande","price_delta":8}]'::jsonb,
   '[{"label":"Edible Flowers","price_delta":2},{"label":"Coconut Cream","price_delta":1}]'::jsonb),

  ('Gluten-free almond celebration cake',
   'Tender almond sponge with citrus glaze — gluten-free without compromise.',
   'cakes', 24.00, 3, 4.4,
   '/cakes/cake-1.png',
   false, true, false, true,
   '{"almonds","eggs","milk"}',
   '[{"label":"Small","price_delta":0},{"label":"Mediano","price_delta":5},{"label":"Grande","price_delta":10}]'::jsonb,
   '[{"label":"Mint Leaves","price_delta":1},{"label":"Whipped Cream","price_delta":1}]'::jsonb),

  ('Tiered wedding showpiece',
   'Three-tier vanilla and raspberry cake with hand-piped buttercream florals.',
   'cakes', 95.00, 4, 5.0,
   '/cakes/cake-2.png',
   false, true, false, false,
   '{"eggs","milk","walnuts"}',
   '[{"label":"Mediano","price_delta":0},{"label":"Grande","price_delta":35}]'::jsonb,
   '[{"label":"Edible Flowers","price_delta":5}]'::jsonb),

  ('Mixed dessert tasting plate',
   'A curated plate of bite-sized desserts — perfect for sharing.',
   'desserts', 26.00, 3, 4.7,
   '/desserts/dessert-1.png',
   true, true, false, false,
   '{"eggs","milk","peanuts","walnuts"}',
   '[{"label":"For 2","price_delta":0},{"label":"For 4","price_delta":20}]'::jsonb,
   '[]'::jsonb);
