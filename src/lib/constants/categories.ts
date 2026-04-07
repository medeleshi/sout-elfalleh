import { 
  Leaf, 
  Grape, 
  Beef, 
  Milk, 
  Sprout, 
  Wheat, 
  Carrot, 
  Flower, 
  Trees, 
  Bean, 
  Droplets, 
  Droplet, 
  Package, 
  Bird, 
  Layers, 
  Utensils, 
  MoreHorizontal 
} from 'lucide-react';

/**
 * Mapping of Category Slugs to Lucide Icons.
 * Used for dynamic resolution of database-backed categories.
 */
export const CATEGORY_ICONS: Record<string, any> = {
  'vegetables': Leaf,
  'fruits': Grape,
  'cereals_grains': Wheat,
  'legumes': Bean,
  'roots_tubers': Carrot,
  'herbs_spices': Sprout,
  'seeds_seedlings': Sprout,
  'industrial_oil_crops': Droplets,
  'oils_fats': Droplet,
  'fodder_feed': Trees,
  'fibers_hides': Layers,
  'flowers_horticulture': Flower,
  'honey_beekeeping': Package,
  'livestock': Beef,
  'poultry': Bird,
  'dairy_eggs': Milk,
  'processed_farm_products': Utensils,
  'other': MoreHorizontal,
};
