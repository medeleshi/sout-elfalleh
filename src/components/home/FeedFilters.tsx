'use client';

import React, { useState, useRef, useEffect } from "react";
import { 
  LayoutGrid, 
  Tag, 
  ShoppingBag, 
  MapPin, 
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

type FilterId = 'all' | 'listings' | 'requests' | 'near_me' | 'questions';

interface FilterOption {
  id: FilterId;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const FILTERS: FilterOption[] = [
  { id: 'all', label: 'الكل', icon: LayoutGrid },
  { id: 'listings', label: 'العروض', icon: Tag },
  { id: 'requests', label: 'طلبات الشراء', icon: ShoppingBag },
  { id: 'near_me', label: 'القريب مني', icon: MapPin },
  { id: 'questions', label: 'الأسئلة', icon: HelpCircle, disabled: true },
];

export default function FeedFilters() {
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // In RTL, scrollLeft is negative or zero
      const isRtl = document.dir === 'rtl';
      
      if (isRtl) {
        setShowRightArrow(scrollLeft < 0);
        setShowLeftArrow(Math.abs(scrollLeft) < scrollWidth - clientWidth - 1);
      } else {
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const isRtl = document.dir === 'rtl';
      const multiplier = direction === 'left' ? -1 : 1;
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount * multiplier * (isRtl ? -1 : 1),
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mt-8 mb-6" dir="rtl">
      <div className="relative group/filters">
        {/* Navigation Arrows for Mobile/Overflow */}
        {showRightArrow && (
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-surface shadow-lg border border-outline-variant/10 text-primary md:hidden"
            aria-label="التمرير لليمين"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-surface shadow-lg border border-outline-variant/10 text-primary md:hidden"
            aria-label="التمرير لليسار"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Filters Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 px-1 translate-z-0"
        >
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <button
                key={filter.id}
                onClick={() => !filter.disabled && setActiveFilter(filter.id)}
                disabled={filter.disabled}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border
                  ${isActive 
                    ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                    : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container-high hover:border-outline-variant/20'
                  }
                  ${filter.disabled ? 'opacity-40 cursor-not-allowed filter grayscale' : 'cursor-pointer'}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-on-primary' : 'text-primary/70'}`} />
                <span className="text-sm font-bold tracking-tight">{filter.label}</span>
                
                {filter.disabled && (
                  <span className="text-[9px] bg-surface-container-highest px-1.5 py-0.5 rounded-md text-on-surface-variant border border-outline-variant/10 mr-1 font-black">
                    قريباً
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle Hint/Status below filters */}
      <div className="mt-4 flex items-center justify-between px-2">
        <p className="text-xs text-on-surface-variant/60 font-medium">
          {activeFilter === 'all' && 'تصفح كافة الأنشطة والتحديثات في السوق'}
          {activeFilter === 'listings' && 'عروض الفلاحين والتجار المتاحة حالياً'}
          {activeFilter === 'requests' && 'طلبات الشراء والاحتياجات الحالية'}
          {activeFilter === 'near_me' && 'نشاطات تجارية في محيطك الجغرافي'}
        </p>
        <div className="h-px flex-1 bg-gradient-to-l from-outline-variant/10 via-outline-variant/5 to-transparent mx-4" />
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
