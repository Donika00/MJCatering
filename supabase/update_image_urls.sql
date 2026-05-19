-- One-off cleanup for the live Supabase DB.
-- Run once in the Supabase SQL editor.
--
-- 1) Repoint image_url on cakes + the one dessert we keep.
-- 2) Delete all macarons, eclairs, and the unused dessert rows.
-- 3) Ensure only Peach big cake + Mixed dessert tasting plate are bestsellers.

-- Repoint image_url ------------------------------------------------------

update cakes set image_url = '/cakes/cake-1.png'        where name = 'Peach big cake with fruits and chocolate';
update cakes set image_url = '/cakes/cake-2.png'        where name = 'Chocolate dream layer cake';
update cakes set image_url = '/cakes/cake-3.png'        where name = 'Vegan berry sponge';
update cakes set image_url = '/cakes/cake-1.png'        where name = 'Gluten-free almond celebration cake';
update cakes set image_url = '/cakes/cake-2.png'        where name = 'Tiered wedding showpiece';
update cakes set image_url = '/desserts/dessert-1.png'  where name = 'Mixed dessert tasting plate';

-- Drop non-cake categories (except the bestseller dessert) ---------------

delete from cakes where category in ('macarons', 'eclairs');
delete from cakes where category = 'desserts' and name <> 'Mixed dessert tasting plate';

-- Reset bestseller flags so only the two carousel items are flagged ------

update cakes set is_bestseller = false;
update cakes set is_bestseller = true
  where name in ('Peach big cake with fruits and chocolate', 'Mixed dessert tasting plate');

-- Sanity check: should return zero rows.
select id, name, category, image_url
from cakes
where image_url like 'https://images.unsplash.com/%'
   or category not in ('cakes', 'desserts');
