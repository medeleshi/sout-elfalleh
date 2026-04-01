export function Trust() {
  const stats = [
    { 
      value: "12,000+", 
      label: "فلاح مسجل",
      description: "من كافة ولايات الجمهورية",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      value: "4,500+", 
      label: "تاجر نشط",
      description: "عروض يومية متجددة",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      value: "250,000", 
      label: "طن من المحاصيل",
      description: "تم تداولها عبر المنصة",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-primary">
      {/* Abstract background shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-container/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-on-primary rounded-full border border-white/20 backdrop-blur-md">
              <span className="text-sm font-bold uppercase tracking-[0.2em]">تأثيرنا في الميدان</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-on-primary font-serif leading-tight">
              أرقام تحكي قصة <br />
              <span className="text-secondary-fixed italic">نجاح فلاحينا</span>
            </h2>
            <p className="text-xl text-on-primary/80 leading-relaxed font-medium">
              صوت الفلاح موش مجرد تطبيق، هو مجتمع حي يساهم كل يوم في تطوير الفلاحة التونسية وتقريب المسافات بين المنتج والمستهلك.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-6">
              {stats.slice(0, 2).map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors duration-500 group">
                  <div className="w-12 h-12 bg-secondary-fixed text-on-secondary-fixed rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-4xl font-black text-on-primary font-serif tracking-tight block">
                      {stat.value}
                    </span>
                    <span className="text-lg font-bold text-secondary-fixed block">
                      {stat.label}
                    </span>
                    <p className="text-on-primary/60 text-sm font-medium">
                      {stat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sm:pt-12">
              <div className="bg-secondary-fixed p-8 rounded-[2rem] border border-white/20 hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
                <div className="w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  {stats[2].icon}
                </div>
                <div className="space-y-1">
                  <span className="text-4xl font-black text-primary font-serif tracking-tight block">
                    {stats[2].value}
                  </span>
                  <span className="text-lg font-bold text-primary block">
                    {stats[2].label}
                  </span>
                  <p className="text-primary/60 text-sm font-black">
                    {stats[2].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
