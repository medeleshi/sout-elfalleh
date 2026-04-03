import React from "react";
import { 
  Lightbulb, 
  ArrowLeft,
  Sparkles,
  Sprout
} from "lucide-react";
import Link from "next/link";

export default function PracticalAdvice() {
  // Mock data for a rotating tip
  const tip = {
    category: "نصيحة اليوم",
    title: "ريّ أشجار الزيتون",
    content: "يُفضل ريّ الأشجار في الصباح الباكر أو عند المساء لتقليل التبخر وضمان امتصاص جيد للمياه.",
    action: "اقرأ المزيد عن الري"
  };

  return (
    <section className="bg-surface rounded-[2rem] border border-outline-variant/10 overflow-hidden shadow-sm relative group">
      {/* Decorative top accent */}
      <div className="h-1.5 w-full bg-gradient-to-l from-primary to-primary/40" />

      <div className="p-6">
        <div className="flex items-center gap-2 text-primary mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <Lightbulb className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{tip.category}</span>
        </div>

        <h4 className="text-sm font-black text-on-surface mb-2 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-primary/60" />
          {tip.title}
        </h4>
        
        <p className="text-xs text-on-surface-variant leading-relaxed font-medium mb-6 opacity-80">
          {tip.content}
        </p>

        <Link 
          href="/blog/irrigation-tips"
          className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all group/btn border border-outline-variant/5"
        >
          <span className="text-[10px] font-black text-primary">{tip.action}</span>
          <ArrowLeft className="w-3.5 h-3.5 text-primary group-hover/btn:translate-x-[-4px] transition-transform" />
        </Link>
      </div>

      {/* Subtle background icon */}
      <Sparkles className="absolute -bottom-2 -right-2 w-12 h-12 text-primary/5 -rotate-12" />
    </section>
  );
}
