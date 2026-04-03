import React from 'react';
import { 
  Layers, 
  MessageSquare, 
  Heart, 
  Zap, 
  UserCheck, 
  Clock 
} from 'lucide-react';

interface ProfileStatsProps {
  role: string | null;
}

export default function ProfileStats({ role }: ProfileStatsProps) {
  // Mock data representing meaningful, impact-driven metrics based on PRD requirements
  const isFarmer = role === 'farmer' || !role;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 w-full" dir="rtl">
      
      {/* 1. Published Activity Count */}
      <div className="bg-surface border border-outline-variant/10 p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
          <Layers className="w-5 h-5" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-on-surface mb-0.5">
          {isFarmer ? '18' : '5'}
        </p>
        <span className="text-xs sm:text-sm font-bold text-on-surface-variant block mb-1">
          المحتوى المنشور
        </span>
        <span className="text-[10px] text-on-surface-variant/60 block leading-tight">
          إعلانات، طلبات ومنشورات
        </span>
      </div>

      {/* 2. Conversations / Messages */}
      <div className="bg-surface border border-outline-variant/10 p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
        <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center mb-3">
          <MessageSquare className="w-5 h-5" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-on-surface mb-0.5">
          42
        </p>
        <span className="text-xs sm:text-sm font-bold text-on-surface-variant block mb-1">
          قيد التواصل
        </span>
        <span className="text-[10px] text-on-surface-variant/60 block leading-tight">
          مراسلات نشطة وفعالة
        </span>
      </div>

      {/* 3. Saves Count */}
      <div className="bg-surface border border-outline-variant/10 p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
        <div className="w-10 h-10 bg-pink-500/10 text-pink-600 rounded-xl flex items-center justify-center mb-3">
          <Heart className="w-5 h-5" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-on-surface mb-0.5">
          89
        </p>
        <span className="text-xs sm:text-sm font-bold text-on-surface-variant block mb-1">
          محفوظات محتواك
        </span>
        <span className="text-[10px] text-on-surface-variant/60 block leading-tight">
          مرات حفظ الآخرين لإنتاجك
        </span>
      </div>

      {/* 4. Responsiveness */}
      <div className="bg-surface border border-outline-variant/10 p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden transition-transform hover:-translate-y-1">
        <div className="w-10 h-10 bg-warning/10 text-warning-dark rounded-xl flex items-center justify-center mb-3 relative z-10">
          <Zap className="w-5 h-5" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-on-surface mb-0.5 relative z-10">
          98%
        </p>
        <span className="text-xs sm:text-sm font-bold text-on-surface-variant block mb-1 relative z-10">
          نسبة الرد
        </span>
        <span className="text-[10px] text-on-surface-variant/60 block leading-tight relative z-10">
          متوسط الرد خلال ساعة
        </span>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-warning to-warning/50" />
      </div>

      {/* 5. Profile Completeness */}
      <div className="bg-surface border border-outline-variant/10 p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
        <div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center mb-3">
          <UserCheck className="w-5 h-5" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-green-600 mb-0.5">
          85%
        </p>
        <span className="text-xs sm:text-sm font-bold text-on-surface-variant block mb-1">
          اكتمال الملف
        </span>
        
        {/* Progress Bar inside Stats */}
        <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-1.5 overflow-hidden">
          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
        </div>
      </div>

      {/* 6. Recent Activity */}
      <div className="bg-surface border border-outline-variant/10 p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-1">
        <div className="w-10 h-10 bg-teal-500/10 text-teal-600 rounded-xl flex items-center justify-center mb-3">
          <Clock className="w-5 h-5" />
        </div>
        <p className="text-base sm:text-lg font-black text-teal-600 mb-1 leading-snug">
          متصل اليوم
        </p>
        <span className="text-xs sm:text-sm font-bold text-on-surface-variant block mb-1">
          النشاط
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-teal-600 font-bold mt-1">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
          مستخدم نشط
        </span>
      </div>

    </div>
  );
}
