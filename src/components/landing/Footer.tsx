import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-surface-container py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-black text-primary font-serif leading-none">صوت الفلاح</h2>
            </Link>
            <p className="text-on-surface-variant leading-relaxed text-lg font-medium opacity-80">
              أول منصة رقمية تونسية تجمع كل المتدخلين في القطاع الفلاحي لتبادل الفرص والنمو معاً.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-6">المنصة</h3>
            <ul className="space-y-4">
              <li><Link href="#how-it-works" className="text-on-surface-variant hover:text-primary transition-colors font-medium">كيفية العمل</Link></li>
              <li><Link href="#market" className="text-on-surface-variant hover:text-primary transition-colors font-medium opacity-50 cursor-not-allowed">السوق (قريباً)</Link></li>
              <li><Link href="#stats" className="text-on-surface-variant hover:text-primary transition-colors font-medium">إحصائيات</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-6">الدعم</h3>
            <ul className="space-y-4">
              <li><Link href="#contact" className="text-on-surface-variant hover:text-primary transition-colors font-medium opacity-50 cursor-not-allowed">اتصل بنا (قريباً)</Link></li>
              <li><Link href="/privacy" className="text-on-surface-variant hover:text-primary transition-colors font-medium">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="text-on-surface-variant hover:text-primary transition-colors font-medium">الشروط والأحكام</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-6">ابقَ على اتصال</h3>
            <p className="text-on-surface-variant mb-4 font-medium italic">انضم إلى مجتمعنا على فيسبوك</p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 overflow-hidden">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.13v-3.622h3.13v-2.674c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-container flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
          <p className="text-sm font-medium">
            جميع الحقوق محفوظة © {new Date().getFullYear()} صوت الفلاح
          </p>
          <p className="text-xs font-bold uppercase tracking-widest">صنع بكل حب في تونس 🇹🇳</p>
        </div>
      </div>
    </footer>
  );
}
