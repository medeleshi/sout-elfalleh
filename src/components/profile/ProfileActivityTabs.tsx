'use client';

import React, { useState } from 'react';
import { LayoutGrid, MessageCircle, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

interface ProfileActivityTabsProps {
  role: string | null;
  isOwnProfile?: boolean;
}

type TabValue = 'listings' | 'posts' | 'requests';

export default function ProfileActivityTabs({ role, isOwnProfile = true }: ProfileActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('listings');

  // PRD refinement: Universally show all main activity types 
  // to reflect complete user activity on the platform.
  const tabs = [
    { id: 'listings', label: isOwnProfile ? 'إعلاناتي' : 'الإعلانات', icon: LayoutGrid },
    { id: 'posts', label: isOwnProfile ? 'منشوراتي' : 'الأسئلة والمنشورات', icon: MessageCircle },
    { id: 'requests', label: isOwnProfile ? 'طلباتي للشراء' : 'طلبات الشراء', icon: FileText }
  ];

  return (
    <div className="bg-surface border border-outline-variant/20 rounded-3xl overflow-hidden shadow-sm flex flex-col" dir="rtl">
      
      {/* Tabs Header */}
      <div className="flex items-center gap-2 sm:gap-6 border-b border-outline-variant/10 px-4 sm:px-6 overflow-x-auto hide-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabValue)}
              className={`flex items-center gap-2 py-4 px-2 sm:px-4 relative whitespace-nowrap transition-colors ${
                isActive 
                  ? 'text-primary font-bold' 
                  : 'text-on-surface-variant hover:text-on-surface font-medium hover:bg-surface-container-low/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant/70'}`} />
              {tab.label}
              
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_8px_rgba(var(--color-primary),0.6)] animate-in fade-in slide-in-from-bottom-1" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tabs Content */}
      <div className="p-6 md:p-8 min-h-[300px] bg-surface-container-lowest">
        
        {/* Placeholder Content for Mock Activities */}
        {activeTab === 'listings' && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center animate-fade-in">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4 text-primary shadow-inner">
              <LayoutGrid className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">لا توجد إعلانات</h3>
            <p className="text-on-surface-variant text-sm max-w-sm mb-6">
              {isOwnProfile 
                ? 'قم بنشر إعلانك الأول للوصول لآلاف المشترين المحتملين.' 
                : 'لا توجد إعلانات معروضة من قبل هذا المستخدم حالياً.'}
            </p>
            {isOwnProfile && (
              <Link 
                href={ROUTES.LISTINGS_NEW || '/listings/new'} 
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-on-primary font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                إضافة إعلان جديد
              </Link>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center animate-fade-in">
            <div className="w-20 h-20 bg-surface-container-highest rounded-full flex items-center justify-center mb-4 text-on-surface-variant shadow-inner">
              <MessageCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">لا توجد مشاركات</h3>
            <p className="text-on-surface-variant text-sm max-w-sm mb-6">
              {isOwnProfile 
                ? 'شارك خبراتك أو اطرح أسئلة على المجتمع الزراعي.'
                : 'لم يقم هذا المستخدم بنشر أي مشاركات في المجتمع بعد.'}
            </p>
            {isOwnProfile && (
              <Link 
                href="/posts/new" 
                className="inline-flex items-center justify-center px-6 py-3 bg-surface-container-high text-on-surface hover:bg-surface-container-highest font-bold rounded-xl transition-colors"
              >
                كتابة منشور
              </Link>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-600 shadow-inner">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">لا توجد طلبات شراء</h3>
            <p className="text-on-surface-variant text-sm max-w-sm mb-6">
              {isOwnProfile 
                ? 'أخبر الفلاحين والتجار بما تحتاجه للحصول على عروض مطابقة.'
                : 'لم يقم هذا المستخدم بتقديم أي طلبات شراء مؤخراً.'}
            </p>
            {isOwnProfile && (
              <Link 
                href="/purchase-requests/new" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                إضافة طلب شراء
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
