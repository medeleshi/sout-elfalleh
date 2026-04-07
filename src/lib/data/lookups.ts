import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

/**
 * Fetches all active agricultural categories from the database.
 */
export const getCategories = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('[LOOKUPS] Error fetching categories:', error);
    return [];
  }
  return data;
});

/**
 * Fetches all active measurement units from the database.
 */
export const getUnits = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[LOOKUPS] Error fetching units:', error);
    return [];
  }
  return data;
});

/**
 * Fetches all active Tunisian governorates.
 */
export const getGovernorates = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('governorates')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('[LOOKUPS] Error fetching governorates:', error);
    return [];
  }
  return data;
});

/**
 * Fetches all category-unit mappings from the database.
 */
export const getCategoryUnits = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('category_units')
    .select('*');

  if (error) {
    console.error('[LOOKUPS] Error fetching category units:', error);
    return [];
  }
  return data;
});

/**
 * Fetches all active activity types (roles like Livestock, Crop, etc.)
 */
export const getActivityTypes = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('activity_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('[LOOKUPS] Error fetching activity types:', error);
    return [];
  }
  return data;
});

