import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-surface">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="z-10 text-right space-y-10 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-bold">أكبر سوق فلاحي رقمي في تونس</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-display-lg text-primary font-serif leading-[1.2] lg:leading-[1.1]">
            وصّل محصولك <br />
            <span className="text-primary-container italic">للسوق الصحّيحة</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-on-surface-variant leading-relaxed max-w-2xl font-medium">
            من الأرض للمائدة، صوت الفلاح يربطك مباشرة بالشركاء الحقيقيين. <br className="hidden md:block" />
            انشر عروضك، اكتشف الطلبات، وضاعف أرباحك اليوم.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 pt-4">
            <Link 
              href="/signup" 
              className="px-12 py-6 rounded-2xl hero-gradient text-on-primary text-xl font-bold shadow-2xl shadow-primary/20 hover:scale-[1.05] hover:shadow-primary/30 transition-all duration-300 text-center active:scale-95"
            >
              ابدأ تجارتك الآن
            </Link>
            <Link 
              href="#how-it-works" 
              className="px-12 py-6 rounded-2xl bg-surface-container-highest text-primary text-xl font-bold hover:bg-surface-container-high transition-all duration-300 text-center border border-primary/10"
            >
              كيف يعمل البرنامج؟
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-4 text-on-surface-variant/60">
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-surface bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold">انضم إلى +10,000 فلاح وتـاجر</p>
          </div>
        </div>

        {/* Visual Section */}
        <div className="relative group lg:order-2">
          <div className="absolute -z-10 w-[110%] h-[110%] -top-[5%] -left-[5%] bg-gradient-radial from-secondary-container/30 to-transparent blur-3xl opacity-60"></div>
          
          <div className="relative aspect-[4/5] md:aspect-square w-full rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(21,66,18,0.2)] border-8 border-white/50">
            <img 
              src="/images/auth-hero.png" 
              alt="تجارة فلاحية في تونس" 
              className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
            
            {/* Real-time Stat Badge */}
            <div className="absolute top-8 left-8 glass p-5 rounded-2xl shadow-2xl border border-white/40 animate-float backdrop-blur-xl">
              <p className="text-xs font-bold text-primary opacity-60 mb-1">عروض نشطة الآن</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-primary">1,428</span>
                <span className="text-xs font-bold text-secondary-container bg-primary px-1.5 py-0.5 rounded">+12٪</span>
              </div>
            </div>

            {/* Bottom Badge */}
            <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex items-center gap-5 border border-white animate-float" style={{ animationDelay: '1s' }}>
              <div className="w-14 h-14 bg-secondary-container rounded-2xl flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-primary/60 font-bold">صفقات ناجحة</p>
                <p className="text-xl font-black text-primary tracking-tight">+850 اليوم</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
