export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "حلّ كونطك",
      description: "سجل في ثوانٍ برقم تليقونك، واختار صفتك: فلاح، تاجر، أو مزوّد خدمات.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "هبط عرضك",
      description: "صور سلعتك، حدد الكونتيتي، البلاصة، والسعر اللي يخلصك. وسوقك ولات توا بين يديك.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "بيع واشري",
      description: "تكلم ديراكت مع المهتمين بيك، وسكر قضيتك في وقت قياسي وبأقل تعب.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-surface-container relative overflow-hidden">
      {/* Dashed divider for desktop */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-3/4 h-px border-t-2 border-dashed border-primary/10 hidden md:block z-0"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary font-serif">كيفاش تبدأ؟</h2>
          <p className="text-xl text-on-surface-variant max-w-xl mx-auto font-medium">خطوات بسيطة باش تدخل لعالم التجارة الفلاحية الرقمية</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="relative flex flex-col items-center text-center group"
            >
              <div className="relative mb-10">
                <div className="w-24 h-24 bg-surface rounded-[2rem] flex items-center justify-center shadow-xl shadow-primary/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 z-10 relative">
                  <div className="text-primary group-hover:text-secondary transition-colors duration-500">
                    {step.icon}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-4 border-surface-container">
                  {step.number}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary font-serif">{step.title}</h3>
                <p className="text-on-surface-variant leading-relaxed text-lg font-medium opacity-80">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
