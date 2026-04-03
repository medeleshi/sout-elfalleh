import React from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Share2, 
  MessageCircle, 
  AlertCircle,
  ChevronRight,
  Info,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Users,
  Send,
  MoreVertical,
  ThumbsUp,
  Bookmark,
  PlusCircle,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

// Mock Data for a single post
const MOCK_POST = {
  id: '1',
  type: 'question', // 'question' | 'post'
  title: 'مشكلة في اصفرار أوراق شجر الليمون بعد المطر الأخير',
  category: 'أمراض وحشرات',
  location: 'نابل - منزل بوزلفة',
  content: `السلام عليكم يا أهل الخبرة،
  
بعد الأمطار والرياح القوية التي شهدتها المنطقة الأسبوع الماضي، لاحظت بداية اصفرار على أوراق أشجار الليمون (القارص) خاصة في النموات الجديدة. هناك أيضاً التواء في بعض الأوراق.

هل هذا نقص في الحديد أم مرض فطري بسبب الرطوبة العالية؟ وما هي أفضل الأدوية أو الأسمدة التي تنصحون بها في هذه الفترة؟

علماً أن العمر التقريبي للأشجار هو 4 سنوات. شكراً مسبقاً على نصائحكم.`,
  images: [
    'https://images.unsplash.com/photo-1597333534154-a1997389a0ad?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1592433020351-4558276f0923?auto=format&fit=crop&q=80&w=800'
  ],
  author: {
    id: 'u1',
    name: 'شكري بن حمودة',
    role: 'فلاح منتج',
    location: 'منزل بوزلفة، نابل',
    avatar: null,
    isVerified: true,
    memberSince: '6 أشهر',
    points: 1250
  },
  createdAt: 'منذ 3 ساعات',
  stats: {
    views: 245,
    likes: 12,
    comments: 4
  },
  isOwner: true // Set to true for demonstration of owner actions
};

const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: { name: 'عادل الماجري', role: 'مهندس زراعي', isVerified: true },
    content: 'وعليكم السلام يا سي شكري. من خلال الوصف والصور، يبدو أن هناك نقصاً واضحاً في عنصر الزنك والحديد، خاصة أن الاصفرار في النموات الجديدة. أنصح بتقديم رشة ورقية غنية بالعناصر الصغرى في أقرب وقت.',
    createdAt: 'منذ ساعتين',
    likes: 5
  },
  {
    id: 'c2',
    author: { name: 'منير الورتاني', role: 'فلاح خبير', isVerified: false },
    content: 'كلام المهندس عادل صحيح، وزيد ثبت في صرف المياه (Drainage) بعد المطر، إذا بقا الماء راكد تحت الشجرة ينجم يعمل نفس النتائج.',
    createdAt: 'منذ ساعة واحدة',
    likes: 2
  }
];

const RELATED_POSTS = [
  { id: 'p2', type: 'post', title: 'نصائح لتسميد الحمضيات في فصل الشتاء', category: 'تسميد ورى', author: 'محسن الطرابلسي', createdAt: 'منذ يوم' },
  { id: 'p3', type: 'question', title: 'أفضل توقيت لتقليم شجر الزيتون في الشمال؟', category: 'طرق زراعة', author: 'كمال الرياحي', createdAt: 'منذ يومين' }
];

const RELATED_OPPORTUNITIES = [
  { id: 'l1', type: 'listing', title: 'أسمدة عناصر صغرى (حديد، زنك، منغنيز) - جودة عالية', price: 45, unit: 'لتر', location: 'تونس', image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=400' },
  { id: 'r1', type: 'request', title: 'مطلوب كمية كبيرة من ليمون الحصاد (فصل الربيع)', category: 'قوارص', location: 'نابل', publisher: 'شركة التصدير المتوسطية', createdAt: 'منذ يوم', quantity: '10 طن' }
];

export default async function PostDetailsPage({ params }: { params: { id: string } }) {
  const profileData = await getCurrentProfile();
  const post = MOCK_POST;

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8 space-y-12" dir="rtl">
      {/* 0. Breadcrumbs & Back */}
      <nav className="flex items-center gap-2 text-xs font-black text-on-surface-variant/40 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
         <Link href={ROUTES.HOME} className="hover:text-primary transition-colors flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>المجتمع</span>
         </Link>
         <ChevronRight className="w-3 h-3 rotate-180" />
         <span className="text-on-surface-variant/60">{post.category}</span>
         <ChevronRight className="w-3 h-3 rotate-180" />
         <span className="text-on-surface truncate max-w-[150px]">{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: Post Content & Comments (60%) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* 1. Post Body Card */}
          <article className="bg-white border-2 border-outline-variant/30 rounded-[3rem] overflow-hidden shadow-sm">
             {/* Header Info (Mobile Friendly) */}
             <div className="p-8 lg:p-10 border-b border-outline-variant/10 bg-surface-container-lowest/50 relative">
                {/* Owner Actions (Desktop Only) */}
                {post.isOwner && (
                  <div className="absolute top-8 left-8 lg:top-10 lg:left-10 flex items-center gap-2">
                     <Link href={ROUTES.POST_EDIT(post.id)}>
                        <Button variant="outline" className="h-10 px-4 rounded-xl border-outline-variant/60 text-on-surface-variant font-black text-xs hover:bg-surface-container-low transition-all">
                           تعديل المنشور
                        </Button>
                     </Link>
                     <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-error/20 text-error hover:bg-error/5 transition-all">
                        <AlertCircle className="w-4 h-4" />
                     </Button>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${post.type === 'question' ? 'bg-error text-on-error shadow-lg shadow-error/20' : 'bg-tertiary text-on-tertiary shadow-lg shadow-tertiary/20'}`}>
                      {post.type === 'question' ? <HelpCircle className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                      <span>{post.type === 'question' ? 'سؤال تقني' : 'نقاش مجتمعي'}</span>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                      <span>{post.stats.views} مشاهدة</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                   </div>
                </div>
                <h1 className="text-2xl lg:text-4xl font-black text-on-surface font-serif italic leading-tight">
                   {post.title}
                </h1>
             </div>

             <div className="p-8 lg:p-10 space-y-10">
                {/* Text Content */}
                <div className="text-lg font-medium text-on-surface-variant leading-relaxed whitespace-pre-line italic pr-6 border-r-4 border-primary/10">
                   {post.content}
                </div>

                {/* Images Gallery */}
                {post.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {post.images.map((img, i) => (
                        <div key={i} className="aspect-[4/3] rounded-[2rem] overflow-hidden border-2 border-outline-variant/10 group cursor-zoom-in">
                           <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={`Image ${i+1}`} />
                        </div>
                     ))}
                  </div>
                )}
             </div>

             {/* Actions Footer */}
             <div className="px-8 lg:px-10 py-6 bg-surface-container-lowest border-t border-outline-variant/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                   <Button variant="ghost" className="h-12 px-6 rounded-2xl gap-3 text-primary font-black hover:bg-primary/5 transition-all group">
                      <ThumbsUp className="w-5 h-5 group-active:scale-125 transition-transform" />
                      <span>{post.stats.likes} إعجاب</span>
                   </Button>
                   <Button variant="ghost" className="h-12 px-6 rounded-2xl gap-3 text-on-surface-variant/60 font-black hover:bg-surface-container-low transition-all">
                      <MessageCircle className="w-5 h-5 rotate-180" />
                      <span>{post.stats.comments} تعليقات</span>
                   </Button>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 group" title="حفظ">
                      <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   </Button>
                   <Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl text-on-surface-variant/40 hover:text-primary hover:bg-primary/5 group" title="مشاركة">
                      <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                   </Button>
                   <div className="w-px h-6 bg-outline-variant/20 mx-1" />
                   <Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl text-on-surface-variant/40 hover:text-error hover:bg-error/5 group" title="تبليغ عن محتوى غير لائق">
                      <AlertCircle className="w-5 h-5 group-hover:shake" />
                   </Button>
                </div>
             </div>
          </article>

          {/* 2. Comments Section */}
          <section className="space-y-8">
             <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-primary rounded-full" />
                <h2 className="text-2xl font-black text-on-surface italic font-serif">النقاش والمساعدات ({post.stats.comments})</h2>
             </div>

             {/* Add Comment Input */}
             <div className="bg-surface-container-low rounded-[2.5rem] p-6 lg:p-8 flex items-start gap-4 border border-outline-variant/10 group focus-within:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm shrink-0 flex items-center justify-center text-on-surface-variant/20">
                   <Users className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-4">
                   <textarea 
                    placeholder="أضف تعليقك أو نصيحتك هنا..." 
                    className="w-full bg-transparent border-none outline-none text-sm font-medium text-on-surface placeholder:text-on-surface-variant/30 resize-none pt-3"
                    rows={2}
                   />
                   <div className="flex justify-end">
                      <Button className="h-10 px-8 rounded-xl font-black text-xs shadow-lg shadow-primary/20">نشر التعليق</Button>
                   </div>
                </div>
             </div>

             {/* Comment List */}
             <div className="space-y-6">
                {MOCK_COMMENTS.map(comment => (
                  <div key={comment.id} className="bg-white p-7 rounded-[2.5rem] border-2 border-outline-variant/30 space-y-5 group hover:border-primary/20 transition-all">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                              <ShieldCheck className="w-7 h-7" />
                           </div>
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <h4 className="font-black text-on-surface">{comment.author.name}</h4>
                                 {comment.author.isVerified && <ShieldCheck className="w-3 h-3 text-primary" />}
                              </div>
                              <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">{comment.author.role}</p>
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest">{comment.createdAt}</span>
                     </div>
                     <p className="text-sm font-medium text-on-surface-variant leading-relaxed italic pr-4 border-r-2 border-outline-variant/10">
                        {comment.content}
                     </p>
                     <div className="flex items-center gap-6 pt-2">
                        <button className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40 hover:text-primary transition-colors">
                           <ThumbsUp className="w-4 h-4" />
                           <span>{comment.likes} إعجابات</span>
                        </button>
                        <button className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40 hover:text-primary transition-colors">
                           <MessageCircle className="w-4 h-4 rotate-180" />
                           <span>رد</span>
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Author & Sidebar (40%) */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          
          {/* 3. Author Section */}
          <section className="bg-white p-8 rounded-[3.5rem] border-2 border-outline-variant/30 space-y-8 group">
             <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-surface-container-low rounded-[2rem] border-2 border-primary/10 overflow-hidden group-hover:scale-[1.05] transition-transform">
                   <div className="w-full h-full flex items-center justify-center text-primary/40">
                      <Users className="w-10 h-10" />
                   </div>
                </div>
                <div className="space-y-1.5">
                   <div className="flex items-center gap-2">
                      <h4 className="text-2xl font-black text-on-surface font-serif italic italic">{post.author.name}</h4>
                      {post.author.isVerified && <ShieldCheck className="w-5 h-5 text-primary fill-primary/10" />}
                   </div>
                   <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest italic">{post.author.role}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 py-6 border-y border-outline-variant/10">
                <div className="space-y-1">
                   <span className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest">منطقة النشاط</span>
                   <p className="text-sm font-black text-on-surface flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-secondary" />
                      {post.author.location}
                   </p>
                </div>
                <div className="space-y-1">
                   <span className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest">نقاط المساهمة</span>
                   <p className="text-sm font-black text-primary flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {post.author.points}
                   </p>
                </div>
             </div>

             <div className="space-y-3">
                <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                   <Send className="w-5 h-5 rotate-180" />
                   <span>مراسلة خاصة</span>
                </Button>
                <Button variant="ghost" className="w-full h-11 rounded-xl text-on-surface-variant/40 font-black text-xs hover:bg-surface-container-low border border-outline-variant/10">
                   مشاهدة المنشورات السابقة
                </Button>
             </div>
          </section>

          {/* 4. Related Opportunities */}
          <section className="bg-secondary/5 p-8 rounded-[3rem] border-2 border-secondary/10 space-y-6">
             <div className="flex items-center gap-3 text-secondary">
                <ShoppingBag className="w-6 h-6" />
                <h3 className="text-xl font-black font-serif italic">فرص سوقية ذات صلة</h3>
             </div>
             <div className="space-y-4">
                {RELATED_OPPORTUNITIES.map(opp => (
                  <Link href={`/marketplace/listings/${opp.id}`} key={opp.id} className="flex gap-4 p-4 bg-white/60 hover:bg-white rounded-2xl border border-outline-variant/10 transition-all group">
                     <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-outline-variant/10">
                        <img src={opp.image || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={opp.title} />
                     </div>
                     <div className="flex-1 flex flex-col justify-between py-1">
                        <h4 className="text-xs font-black text-on-surface leading-snug line-clamp-2">{opp.title}</h4>
                        <div className="flex items-baseline gap-1">
                           <span className="text-sm font-black text-primary">{opp.price}</span>
                           <span className="text-[9px] font-bold text-on-surface-variant/60">د.ت / {opp.unit}</span>
                        </div>
                     </div>
                  </Link>
                ))}
             </div>
             <Button variant="outline" className="w-full h-11 rounded-xl border-secondary/20 text-secondary hover:bg-secondary/5 font-black text-xs">تصفح السوق بالكامل</Button>
          </section>

          {/* 5. Related Posts Callout */}
          <section className="bg-tertiary/5 p-8 rounded-[3rem] border-2 border-tertiary/10 space-y-6">
             <div className="flex items-center gap-3 text-tertiary">
                <MessageSquare className="w-6 h-6" />
                <h3 className="text-xl font-black font-serif italic">نقاشات مشابهة</h3>
             </div>
             <div className="space-y-4">
                {RELATED_POSTS.map(rel => (
                  <Link href={`/posts/${rel.id}`} key={rel.id} className="block group">
                     <div className="flex items-start gap-3">
                        <div className={`mt-1 p-1.5 rounded-lg ${rel.type === 'question' ? 'bg-error/10 text-error' : 'bg-tertiary/10 text-tertiary'}`}>
                           {rel.type === 'question' ? <HelpCircle className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                        </div>
                        <div className="space-y-1">
                           <h4 className="text-xs font-black text-on-surface group-hover:text-primary transition-colors leading-relaxed line-clamp-2">{rel.title}</h4>
                           <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest">{rel.createdAt}</span>
                        </div>
                     </div>
                  </Link>
                ))}
             </div>
          </section>
        </div>
      </div>

      {/* Mobile Persistent Action Bar (PRD: High Intent) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 z-[60] lg:hidden flex gap-3 shadow-[0_-12px_40px_rgba(0,0,0,0.08)]">
         <Button className="flex-[2] h-14 rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all bg-primary text-on-primary">
            <Send className="w-5 h-5 rotate-180" />
            <span>مراسلة صاحب {post.type === 'question' ? 'السؤال' : 'المنشور'}</span>
         </Button>
         <Button variant="outline" className="flex-1 h-14 rounded-2xl px-5 border-2 border-primary/20 text-primary bg-primary/5 active:scale-95 transition-all font-black text-xs">
            إضافة رد
         </Button>
         <Button variant="outline" className="w-14 h-14 p-0 rounded-2xl border-2 border-outline-variant/40 text-on-surface-variant active:scale-95 transition-all">
            <Bookmark className="w-6 h-6" />
         </Button>
      </div>
    </div>
  );
}
