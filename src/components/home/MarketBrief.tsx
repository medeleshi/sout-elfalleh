'use client';

import React, { useState } from "react";
import { 
  CloudSun, 
  TrendingUp, 
  TrendingDown, 
  Info,
  Calendar,
  Thermometer,
  X,
  ChevronLeft
} from "lucide-react";

interface MarketBriefProps {
  governorate: string;
}

export default function MarketBrief({ governorate }: MarketBriefProps) {
  const [activeTab, setActiveTab] = useState<null | 'weather' | 'trends'>(null);

  const marketTrends = [
    { title: "سعر الزيتون", trend: "up", change: "+12%" },
    { title: "سعر القمح", trend: "down", change: "-3%" },
  ];

  const WeatherContent = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary/70 text-[10px] font-black uppercase tracking-tight mb-2">
        <Calendar className="w-3 h-3" />
        <span>توقعات الطقس في {governorate}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-black text-on-surface">24°</p>
          <p className="text-sm text-on-surface-variant font-bold">صافي ودافئ</p>
        </div>
        <CloudSun className="w-16 h-16 text-primary" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4">
        <div className="flex flex-col gap-1 p-3 rounded-2xl bg-surface-container-high border border-outline-variant/10">
          <div className="flex items-center gap-1.5 text-[10px] text-primary font-black uppercase">
            <Thermometer className="w-3 h-3" />
            <span>الحرارة</span>
          </div>
          <span className="text-sm font-bold">العظمى: 28°</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-2xl bg-surface-container-high border border-outline-variant/10 text-left dir-ltr">
          <div className="flex items-center gap-1.5 text-[10px] text-primary font-black uppercase justify-end">
            <span>HUMIDITY</span>
            <span className="w-3 h-3 rounded-full border border-primary/20" />
          </div>
          <span className="text-sm font-bold">الرطوبة: 45%</span>
        </div>
      </div>
      <p className="text-[10px] text-on-surface-variant/60 italic mt-4">
        * يتم تحديث بيانات الطقس كل 3 ساعات من المصدر المحلي.
      </p>
    </div>
  );

  const TrendsContent = () => (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest px-1">أسعار السوق اليوم</h4>
      <div className="grid grid-cols-1 gap-3">
        {marketTrends.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-high/40 border border-outline-variant/5">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.trend === 'up' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                {item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>
              <span className="text-sm font-bold text-on-surface">{item.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black ${item.trend === 'up' ? 'text-primary' : 'text-error'}`}>
                {item.change}
              </span>
              <ChevronLeft className="w-3 h-3 text-on-surface-variant/30" />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-on-surface-variant/60 text-center font-medium leading-relaxed mt-6">
        * هذه الأسعار استرشادية بناءً على آخر التداولات المحلية.
      </p>
    </div>
  );

  return (
    <section>
      {/* ── DESKTOP VIEW (Current sidebar card) ── */}
      <div className="hidden lg:block bg-surface rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-outline-variant/5 bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-black text-on-surface">نبض السوق والطقس</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/5">
            <WeatherContent />
          </div>
          <TrendsContent />
        </div>
      </div>

      {/* ── MOBILE VIEW (Icon Row) ── */}
      <div className="lg:hidden flex items-center gap-2 py-4">
        <button 
          onClick={() => setActiveTab('weather')}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border bg-card hover:bg-primary/5 transition-all active:scale-95"
        >
          <CloudSun className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold">الطقس</span>
        </button>
        <button 
          onClick={() => setActiveTab('trends')}
          className="flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border bg-card hover:bg-secondary/5 transition-all active:scale-95"
        >
          <TrendingUp className="w-5 h-5 text-secondary" />
          <span className="text-xs font-bold">الأسعار</span>
        </button>
        <button className="p-3 rounded-2xl border bg-card hover:bg-accent/10 transition-all">
          <Info className="w-5 h-5 text-on-surface-variant" />
        </button>
      </div>

      {/* ── MOBILE DIALOG OVERLAY ── */}
      {activeTab && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={() => setActiveTab(null)}
          />
          
          {/* Dialog Body */}
          <div className="relative w-full sm:max-w-md bg-surface rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-bottom-10 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-primary">
                {activeTab === 'weather' ? 'حالة الطقس' : 'أسعار السوق'}
              </h2>
              <button 
                onClick={() => setActiveTab(null)}
                className="p-2 rounded-full bg-surface-container-high text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {activeTab === 'weather' ? <WeatherContent /> : <TrendsContent />}

            {/* Footer Action */}
            <button 
              onClick={() => setActiveTab(null)}
              className="w-full mt-10 py-4 bg-primary text-on-primary rounded-2xl font-black text-sm"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
