import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-12 text-right">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-primary">سياسة الخصوصية</h1>
          <div className="prose prose-lg prose-primary max-w-none text-on-surface-variant font-medium leading-relaxed space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">1. جمع المعلومات</h2>
              <p>نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. يتم جمع المعلومات فقط لتوفير وتحسين خدمات منصة صوت الفلاح.</p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">2. استخدام البيانات</h2>
              <p>تستخدم البيانات المسجلة لتسهيل التواصل بين الفلاحين والتجار، وضمان أمان المعاملات داخل المنصة.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">3. حماية المعلومات</h2>
              <p>نعتمد معايير أمان عالية لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الإفصاح.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
