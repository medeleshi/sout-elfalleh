export function UserTypes() {
  const types = [
    {
      title: "للفلاح",
      subtitle: "بِع محصولك بأفضل سعر",
      description: "لا وسطاء بعد اليوم. وصّل محصولك من الأرض للتاجر مباشرة وزيد في أرباحك السنوية بضمان صفقات عادلة.",
      cta: "ابدأ البيع الآن",
      bg: "bg-primary text-on-primary",
      accent: "text-secondary-fixed",
      image: "/home/medeleshi/.gemini/antigravity/brain/8a18e89d-bdcb-47ef-b012-8f4275c7de2b/farmer_using_phone_tunisia_1774909396098.png",
      overlay: "from-primary",
      tagBg: "bg-secondary-container text-on-secondary-container",
    },
    {
      title: "للتاجر والمشتري",
      subtitle: "جودة مضمونة ومصدر موثوق",
      description: "تصفح آلاف العروض اليومية، قارن الأسعار، واشري الأجود لحرفائك مباشرة من السانية بكل شفافية.",
      cta: "استكشف المنتجات",
      bg: "bg-tertiary-container text-on-primary",
      accent: "text-tertiary-fixed",
      image: "/home/medeleshi/.gemini/antigravity/brain/8a18e89d-bdcb-47ef-b012-8f4275c7de2b/trader_market_tunisia_1774909563939.png",
      overlay: "from-tertiary-container",
      tagBg: "bg-tertiary-fixed text-on-tertiary-fixed",
    },
    {
      title: "لمزوّد الخدمات",
      subtitle: "وسّع قاعدة حرفائك",
      description: "سواء كنت توفر النقل، الأسمدة، أو الاستشارات، صوت الفلاح هو بوابتك للوصول لآلاف المزارعين.",
      cta: "سجل كخبير",
      bg: "bg-surface-container-highest text-primary",
      accent: "text-primary",
      image: "/home/medeleshi/.gemini/antigravity/brain/8a18e89d-bdcb-47ef-b012-8f4275c7de2b/shipping_truck_agriculture_1774909608470.png",
      overlay: "from-surface-container-highest",
      tagBg: "bg-primary text-on-primary",
    },
  ];

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary font-serif italic">منصّة للجميع</h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            صوت الفلاح يجمع كل المتدخلين في القطاع الفلاحي في فضاء رقمي واحد يتسم بالثقة والفعالية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {types.map((type, i) => (
            <div 
              key={i} 
              className={`group relative overflow-hidden rounded-[2.5rem] ${type.bg} p-10 min-h-[480px] lg:h-[550px] flex flex-col justify-end transition-all duration-700 hover:shadow-[0_32px_64px_-16px_rgba(21,66,18,0.15)] hover:-translate-y-2 ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <img 
                src={type.image} 
                alt={type.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${type.overlay} via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 space-y-5">
                <span className={`inline-block px-5 py-1.5 ${type.tagBg} rounded-full text-sm font-black uppercase tracking-wider`}>
                  {type.title}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold font-serif leading-tight">{type.subtitle}</h3>
                <p className="opacity-80 leading-relaxed text-lg font-medium">{type.description}</p>
                <button className={`flex items-center gap-3 ${type.accent} font-black text-lg hover:gap-5 transition-all group/btn pt-2`}>
                  <span>{type.cta}</span>
                  <svg className="w-6 h-6 transform rotate-180 group-hover/btn:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
