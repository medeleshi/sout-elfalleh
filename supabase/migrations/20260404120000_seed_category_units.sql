-- Seed Category-Units Mapping
-- Date: 2026-04-04

delete from public.category_units;

do $$
declare
    v_cat_veg uuid := (select id from public.categories where slug = 'vegetables');
    v_cat_fruit uuid := (select id from public.categories where slug = 'fruits');
    v_cat_grain uuid := (select id from public.categories where slug = 'cereals_grains');
    v_cat_legume uuid := (select id from public.categories where slug = 'legumes');
    v_cat_oil uuid := (select id from public.categories where slug = 'oils_fats');
    v_cat_livestock uuid := (select id from public.categories where slug = 'livestock');
    v_cat_poultry uuid := (select id from public.categories where slug = 'poultry');
    v_cat_dairy uuid := (select id from public.categories where slug = 'dairy_eggs');
    v_cat_honey uuid := (select id from public.categories where slug = 'honey_beekeeping');

    v_unit_kg uuid := (select id from public.units where slug = 'kg');
    v_unit_ton uuid := (select id from public.units where slug = 'ton');
    v_unit_liter uuid := (select id from public.units where slug = 'liter');
    v_unit_piece uuid := (select id from public.units where slug = 'piece');
    v_unit_box uuid := (select id from public.units where slug = 'box');
    v_unit_tray uuid := (select id from public.units where slug = 'tray');
    v_unit_bottle uuid := (select id from public.units where slug = 'bottle');
    v_unit_sack uuid := (select id from public.units where slug = 'sack');
    v_unit_head uuid := (select id from public.units where slug = 'head');
    v_unit_crate uuid := (select id from public.units where slug = 'crate');
    v_unit_bag uuid := (select id from public.units where slug = 'bag');
begin
    -- Vegetables
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_veg, v_unit_kg, true), (v_cat_veg, v_unit_box, false), (v_cat_veg, v_unit_ton, false), (v_cat_veg, v_unit_crate, false), (v_cat_veg, v_unit_bag, false);
    
    -- Fruits
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_fruit, v_unit_kg, true), (v_cat_fruit, v_unit_box, false), (v_cat_fruit, v_unit_ton, false), (v_cat_fruit, v_unit_crate, false);
    
    -- Grains & Legumes
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_grain, v_unit_kg, false), (v_cat_grain, v_unit_ton, true), (v_cat_grain, v_unit_sack, false);
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_legume, v_unit_kg, true), (v_cat_legume, v_unit_ton, false), (v_cat_legume, v_unit_sack, false);
    
    -- Oils & Fats
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_oil, v_unit_liter, true), (v_cat_oil, v_unit_bottle, false);
    
    -- Livestock & Poultry
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_livestock, v_unit_head, true), (v_cat_livestock, v_unit_piece, false);
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_poultry, v_unit_piece, true), (v_cat_poultry, v_unit_head, false);
    
    -- Dairy & Eggs
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_dairy, v_unit_liter, true), (v_cat_dairy, v_unit_piece, false), (v_cat_dairy, v_unit_tray, false), (v_cat_dairy, v_unit_box, false);
    
    -- Honey
    insert into public.category_units (category_id, unit_id, is_default) values (v_cat_honey, v_unit_kg, true), (v_cat_honey, v_unit_piece, false), (v_cat_honey, v_unit_box, false);
end $$;
