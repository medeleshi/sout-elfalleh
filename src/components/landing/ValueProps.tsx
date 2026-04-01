export function ValueProps() {
  const benefits = [
    {
      title: "سوق مفتوحة 24/7",
      description: "لا تنتظر أيام السوق الأسبوعية. انشر عروضك وطلباتك في أي وقت ومن أي مكان في تونس.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-primary",
      bg: "bg-primary/5",
      border: "border-primary/10",
    },
    {
      title: "تواصل مباشر بلا وسيط",
      description: "تحدث مباشرة مع الفلاح أو التاجر. صفقات أسرع، هوامش ربح أعلى، وشفافية كاملة في التعامل.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      color: "text-secondary",
      bg: "bg-secondary/5",
      border: "border-secondary/20",
    },
    {
      title: "لوحة تحكم ذكية",
      description: "تابع أسعار السوق، أدر عروضك، وشاهد إحصائيات نشاطك التجاري بكل سهولة واحترافية.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "text-tertiary",
      bg: "bg-tertiary/5",
      border: "border-tertiary/10",
    },
  ];

  return (
    <section className="py-32 bg-surface-container-lowest relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-3xl mb-20 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary font-serif leading-tight">
            علاش تختار <span className="text-primary-container italic">صوت الفلاح؟</span>
          </h2>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            منصتنا موش مجرد موقع إعلانات، هي شريكك الرقمي اللي يسهلك حياتك ويطورلك مشروعك الفلاحي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <div 
              key={i} 
              className={`group p-10 rounded-[2.5rem] border ${benefit.border} ${benefit.bg} transition-all duration-500 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] hover:-translate-y-2`}
            >
              <div className={`w-20 h-20 rounded-3xl ${benefit.color} bg-white flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold text-primary mb-5 font-serif">{benefit.title}</h3>
              <p className="text-on-surface-variant leading-relaxed text-lg font-medium opacity-80">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
    </section>
  );
}
