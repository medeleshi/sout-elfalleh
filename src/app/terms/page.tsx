import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-12 text-right">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-primary">الشروط والأحكام</h1>
          <div className="prose prose-lg prose-primary max-w-none text-on-surface-variant font-medium leading-relaxed space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">1. قبول الشروط</h2>
              <p>باستخدامك لمنصة صوت الفلاح، فإنك توافق على الالتزام بشروط الاستخدام الموضحة هنا.</p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">2. مسؤولية المستخدم</h2>
              <p>يتحمل المستخدم كامل المسؤولية عن صحة المعلومات المنشورة في حسابه وعن تعاملاته التجارية مع الأطراف الأخرى.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">3. التعديلات</h2>
              <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطار المستخدمين بأي تغييرات جوهرية.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
