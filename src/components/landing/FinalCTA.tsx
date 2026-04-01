import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-32 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto hero-gradient rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_48px_80px_-16px_rgba(21,66,18,0.3)] border-b-8 border-primary-container">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-container/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>
        
        <div className="relative z-10 space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-bold text-on-primary font-serif leading-[1.1]">
              مستقبل فلاحتك <br />
              <span className="text-secondary-fixed italic">يبدأ من هنا</span>
            </h2>
            <p className="text-xl md:text-3xl text-on-primary-container max-w-3xl mx-auto leading-relaxed font-medium">
              انضم لأكبر عائلة فلاحية رقمية في تونس. <br className="hidden md:block" />
              سجل مجاناً وتوّكل على ربي في خطوة جديدة لمشروعك.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <Link 
              href="/signup" 
              className="px-16 py-7 rounded-2xl bg-secondary-fixed text-on-secondary-fixed text-2xl font-black hover:scale-110 hover:shadow-[0_20px_40px_-10px_rgba(200,241,122,0.4)] hover:-translate-y-1 transition-all duration-300 inline-block shadow-xl active:scale-95"
            >
              أنشئ حسابك الآن - مجاناً
            </Link>
            <p className="text-on-primary/60 text-sm font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary-fixed" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              أكثر من منصة، هي عائلتك الجديدة
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
