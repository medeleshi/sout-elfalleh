import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  MapPin, 
  Scale, 
  Clock, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Phone,
  FileText,
  Calendar,
  AlertCircle,
  TrendingDown,
  Info,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function RequestDetailsPage({ params }: { params: { id: string } }) {
  // Mock Data for Detail View
  const request = {
    id: params.id,
    title: 'مطلوب كمية كبيرة من الطماطم الفصلية',
    category: 'خضروات',
    quantity: 2000,
    unit: 'كغ',
    budget: 800,
    location: 'نابل، تونس',
    description: 'كشركة تصدير للمنتجات الفلاحية، نبحث عن مزارعين لتوفير كمية 2 طن من الطماطم الفصلية ذات الجودة العالية المعدة للتحويل والتصدير. نفضل التعامل المباشر مع الفلاحين في ولاية نابل والمناطق المجاورة. الجودة يجب أن تكون مطابقة للمواصفات التونسية للتصدير.',
    publisher: {
      name: 'شركة تصدير الشمال',
      role: 'مشتري معتمد',
      governorate: 'تونس العاصمة',
      isVerified: true,
      joinedAt: 'منذ سنتين',
      transactions: 24,
    },
    createdAt: 'منذ يوم واحد',
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-32 pt-4 px-4 lg:px-8" dir="rtl">
      {/* Back Button */}
      <div className="flex items-center gap-4 py-6">
        <Link href="/marketplace" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-black group">
          <ChevronRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>العودة للسوق</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Main Content (Col 1-8) */}
        <div className="lg:col-span-8 space-y-10">
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                   {request.category}
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant/40 font-bold text-[10px]">
                   <Calendar className="w-4 h-4" />
                   <span>نُشرت {request.createdAt}</span>
                </div>
             </div>

             <h1 className="text-4xl lg:text-6xl font-black text-on-surface leading-tight font-serif italic text-balance">
                {request.title}
             </h1>

             <div className="flex flex-col sm:flex-row gap-6 p-8 lg:p-10 rounded-[3rem] bg-primary/5 border-2 border-primary/10 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex-1 space-y-2 relative z-10">
                   <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] block">الميزانية التقديرية للمشروع</span>
                   <div className="flex items-end gap-3 font-serif">
                      <span className="text-5xl lg:text-6xl font-black text-primary">
                        {request.budget ? `${request.budget} د.ت` : 'حسب الاتفاق'}
                      </span>
                      {request.budget && <span className="text-base font-bold text-primary opacity-60 mb-2">لكل {request.unit}</span>}
                   </div>
                </div>
                <div className="flex items-center gap-3 text-primary font-black bg-white px-6 py-4 rounded-2xl shadow-lg self-center sm:self-auto group-hover:scale-105 transition-transform">
                   <TrendingDown className="w-6 h-6" />
                   <span>سعر تنافسي</span>
                </div>
             </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-[3rem] bg-white border-2 border-outline-variant space-y-4 shadow-sm hover:border-primary/20 transition-all group">
               <div className="p-4 w-fit rounded-2xl bg-orange-100 text-orange-600 group-hover:scale-110 transition-transform">
                  <Scale className="w-7 h-7" />
               </div>
               <div className="space-y-1">
                  <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest block">الكمية الإجمالية المطلوبة</span>
                  <p className="text-3xl font-black text-on-surface">{request.quantity} {request.unit}</p>
               </div>
            </div>
            <div className="p-8 rounded-[3rem] bg-white border-2 border-outline-variant space-y-4 shadow-sm hover:border-primary/20 transition-all group">
               <div className="p-4 w-fit rounded-2xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7" />
               </div>
               <div className="space-y-1">
                  <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest block">مكان التسلم المفضل</span>
                  <p className="text-3xl font-black text-on-surface">{request.location}</p>
               </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-6">
             <div className="flex items-center gap-4 px-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <h2 className="text-2xl font-black text-on-surface">تفاصيل طلب الشراء</h2>
             </div>
             <div className="p-10 rounded-[3rem] bg-surface-container-lowest border border-outline-variant/30 leading-[1.8] text-xl font-medium text-on-surface-variant text-balance">
                {request.description}
             </div>
          </div>
        </div>

        {/* Sidebar / Info Panel (Col 9-12) */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          {/* Publisher Card */}
          <div className="bg-white border-2 border-outline-variant p-8 rounded-[3rem] shadow-sm space-y-8">
             <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 bg-secondary-container text-on-secondary-container rounded-[2rem] flex items-center justify-center relative shadow-xl">
                   <FileText className="w-12 h-12" />
                   <div className="absolute -bottom-1 -right-1 p-2 bg-primary text-on-primary rounded-full border-4 border-white shadow-lg">
                      <ShieldCheck className="w-5 h-5" />
                   </div>
                </div>
                <div className="space-y-1">
                   <h3 className="text-2xl font-black text-on-surface leading-tight">{request.publisher.name}</h3>
                   <div className="flex items-center justify-center gap-2 text-primary text-xs font-black uppercase tracking-widest opacity-60">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>مشتري حكومي موثوق</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/30">
                <div className="text-center space-y-1">
                   <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">تاريخ البدء</span>
                   <p className="font-black text-sm">{request.publisher.joinedAt}</p>
                </div>
                <div className="text-center space-y-1">
                   <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">المعاملات</span>
                   <p className="font-black text-sm">{request.publisher.transactions} معاملة</p>
                </div>
             </div>

             <div className="space-y-3">
                <Button className="w-full h-16 rounded-2xl font-black text-xl gap-3 shadow-2xl shadow-primary/20">
                   <MessageSquare className="w-6 h-6" />
                   <span>تواصل الآن</span>
                </Button>
                <button className="w-full h-16 bg-white border-2 border-outline-variant rounded-2xl flex items-center justify-center gap-3 text-on-surface font-black text-lg hover:border-primary hover:text-primary transition-all">
                   <Phone className="w-6 h-6" />
                   <span>اتصال هاتفي</span>
                </button>
             </div>
          </div>

          {/* Quick Help / Safety */}
          <div className="p-8 rounded-[3rem] bg-orange-50 border border-orange-100 space-y-4">
             <div className="flex items-center gap-3 text-orange-600 font-black">
                <Info className="w-6 h-6" />
                <h4 className="text-lg">كيف تربح هذا العقد؟</h4>
             </div>
             <ul className="space-y-3">
                {[
                  'تأكد من مطابقة كمية الحصاد للمطلوب',
                  'قدم شهادة المنشأ والجودة إن وجدت',
                  'كن صريحاً حول موعد جاهزية الإنتاج',
                  'التزم بمكان التسليم المتفق عليه'
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold text-orange-800/70 italic leading-snug">
                     <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                     <span>{step}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
