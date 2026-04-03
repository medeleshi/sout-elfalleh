import { Leaf, Grape, Beef, Milk, Sprout, Filter } from 'lucide-react';

export const CATEGORIES = [
  { id: 'vegetables', label: 'خضروات', icon: Leaf },
  { id: 'fruits', label: 'فواكه', icon: Grape },
  { id: 'livestock', label: 'مواشي', icon: Beef },
  { id: 'dairy', label: 'ألبان', icon: Milk },
  { id: 'grains', label: 'حبوب', icon: Sprout },
  { id: 'oils', label: 'زيوت', icon: Leaf }, // Reuse icon or add more
];

export const UNITS = [
  { id: 'kg', label: 'كيلوغرام (كغ)' },
  { id: 'ton', label: 'طن' },
  { id: 'liter', label: 'لتر' },
  { id: 'bag', label: 'كيس' },
  { id: 'box', label: 'صندوق' },
  { id: 'piece', label: 'قطعة' },
  { id: 'crate', label: 'قفص' },
];
