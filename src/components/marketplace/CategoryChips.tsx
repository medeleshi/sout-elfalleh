'use client';

import React from 'react';
import { Leaf, Grape, Beef, Milk, Sprout, Filter } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'الكل', icon: Filter },
  { id: 'vegetables', label: 'خضروات', icon: Leaf },
  { id: 'fruits', label: 'فواكه', icon: Grape },
  { id: 'livestock', label: 'مواشي', icon: Beef },
  { id: 'dairy', label: 'ألبان', icon: Milk },
  { id: 'grains', label: 'حبوب', icon: Sprout },
];

export function CategoryChips() {
  const [active, setActive] = React.useState('all');

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = active === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-sm transition-all whitespace-nowrap border-2 ${
              isActive 
                ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/20' 
                : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary/50'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-on-primary' : 'text-primary'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
