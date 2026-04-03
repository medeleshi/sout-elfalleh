'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ShoppingBag, 
  MessageSquare, 
  Activity,
  User 
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'الرئيسية', icon: Home, href: ROUTES.HOME },
    { label: 'السوق', icon: ShoppingBag, href: ROUTES.MARKETPLACE },
    { label: 'نشاطاتي', icon: Activity, href: ROUTES.MY_ACTIVITY },
    { label: 'الرسائل', icon: MessageSquare, href: ROUTES.MESSAGES },
    { label: 'حسابي', icon: User, href: ROUTES.PROFILE },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/10 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== ROUTES.HOME && pathname?.startsWith(item.href));
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-on-surface-variant/50 hover:text-on-surface-variant'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary/10' : 'bg-transparent'}`}>
                <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : 'scale-100'}`} />
                {item.label === 'الرسائل' && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full ring-2 ring-surface" />
                )}
              </div>
              <span className={`text-[10px] font-black transition-all ${isActive ? 'opacity-100 translate-y-0' : 'opacity-70'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
