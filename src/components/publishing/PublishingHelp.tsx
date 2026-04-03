'use client';

import React, { useState } from 'react';
import { X, Lightbulb, Camera, PenTool, TrendingUp, ShieldCheck, Info, Package, MapPin, Clock, CheckCircle2, HelpCircle, MessageSquare, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublishingHelpProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'listing' | 'request' | 'post' | 'question';
}

export function PublishingHelp({ isOpen, onClose, defaultType = 'listing' }: PublishingHelpProps) {
  const [activeTab, setActiveTab] = useState<'listing' | 'request' | 'post' | 'question'>(defaultType as any || 'listing');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white lg:bg-black/40 lg:backdrop-blur-md flex items-center justify-center p-0 lg:p-12 transition-all duration-500 animate-in fade-in zoom-in-95">
      <div className="w-full h-full lg:max-w-5xl lg:h-auto lg:max-h-[92vh] bg-surface-container-lowest lg:rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden border border-outline-variant/10">
        {/* Superior Header */}
        <div className="relative p-6 lg:p-10 border-b border-outline-variant/10 bg-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[1.25rem] bg-primary/10 flex items-center justify-center shadow-inner">
                 <Lightbulb className="w-7 h-7 text-primary animate-pulse" />
              </div>
              <div>
                 <h2 className="text-2xl lg:text-3xl font-black text-on-surface italic font-serif leading-none">مساعد النشر الذكي</h2>
                 <p className="text-[10px] lg:text-xs font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mt-2">دليلك الكامل لعملية بيع وشراء ناجحة</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-4 rounded-full bg-surface-container-low hover:bg-surface-container-high transition-all active:scale-90 border border-outline-variant/10"
            >
              <X className="w-6 h-6 text-on-surface-variant" />
            </button>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex bg-surface-container-low p-2 rounded-3xl border border-outline-variant/10 max-w-2xl mx-auto shadow-inner overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('listing')}
              className={`flex-none lg:flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-xs lg:text-sm font-black transition-all whitespace-nowrap ${activeTab === 'listing' ? 'bg-primary text-on-primary shadow-xl shadow-primary/20 scale-[1.02]' : 'text-on-surface-variant/40 hover:text-primary'}`}
            >
              <Package className="w-5 h-5" />
              <span>عرض (بيع)</span>
            </button>
            <button 
              onClick={() => setActiveTab('request')}
              className={`flex-none lg:flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-xs lg:text-sm font-black transition-all whitespace-nowrap ${activeTab === 'request' ? 'bg-secondary text-on-secondary shadow-xl shadow-secondary/20 scale-[1.02]' : 'text-on-surface-variant/40 hover:text-secondary'}`}
            >
              <Clock className="w-5 h-5" />
              <span>طلب شراء</span>
            </button>
            <button 
              onClick={() => setActiveTab('post')}
              className={`flex-none lg:flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-xs lg:text-sm font-black transition-all whitespace-nowrap ${activeTab === 'post' ? 'bg-tertiary text-on-tertiary shadow-xl shadow-tertiary/20 scale-[1.02]' : 'text-on-surface-variant/40 hover:text-tertiary'}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>منشور</span>
            </button>
            <button 
              onClick={() => setActiveTab('question')}
              className={`flex-none lg:flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-xs lg:text-sm font-black transition-all whitespace-nowrap ${activeTab === 'question' ? 'bg-error text-on-error shadow-xl shadow-error/20 scale-[1.02]' : 'text-on-surface-variant/40 hover:text-error'}`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>سؤال</span>
            </button>
          </div>
        </div>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-12">
          {activeTab === 'listing' && <ListingGuide />}
          {activeTab === 'request' && <RequestGuide />}
          {activeTab === 'post' && <PostGuide />}
          {activeTab === 'question' && <QuestionGuide />}
        </div>

        {/* Persistent Footer */}
        <div className="p-6 lg:p-10 border-t border-outline-variant/10 bg-white flex items-center justify-between gap-6">
           <div className="hidden lg:flex items-center gap-3 text-on-surface-variant/40 italic text-sm">
              <CheckCircle2 className="w-5 h-5 text-primary/40" />
              <span>نصائحنا مبنية على أفضل ممارسات السوق التونسي</span>
           </div>
           <Button 
            className="w-full lg:w-auto h-16 px-12 rounded-3xl font-black text-lg shadow-2xl shadow-primary/30 transition-all active:scale-[0.98]"
            onClick={onClose}
           >
             بدأ تطبيق الدليل
           </Button>
        </div>
      </div>
    </div>
  );
}

function ListingGuide() {
  return (
    <div className="space-y-16 animate-in slide-in-from-right-4 duration-500">
      {/* Overview Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="w-2 h-10 bg-primary rounded-full" />
           <h3 className="text-2xl font-black text-on-surface italic font-serif">لماذا تضيف "عرضاً"؟</h3>
        </div>
        <p className="text-lg font-medium text-on-surface-variant leading-relaxed italic pr-6 border-r-4 border-primary/5 max-w-3xl">
           العرض هو فرصتك لإظهار محاصيلك للسوق. الفلاح الناجح هو من يعرض بضاعته بوضوح وصدق، مما يجذب تجاراً جادين ومستدامين.
        </p>
      </section>

      {/* Field Guidance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <GuideItem 
          icon={<PenTool className="text-primary" />}
          title="اسم المنتج والوصف"
          desc="تجنب الأسماء العامة مثل 'بطاطا'. الأفضل هو 'بطاطا سبونتا درجة أولى - جندوبة'. الوصف يجب أن يذكر طريقة الإنتاج (عضوي، سقي بئر) والجودة."
          example="مثال: زيت زيتون بكر ممتاز محصول 2024، معصور على البارد."
        />
        <GuideItem 
          icon={<TrendingUp className="text-primary" />}
          title="الكمية والسعر"
          desc="دقة الكمية (مثلاً 500 كغ) والوحدة المناسبة تمنع الارتباك. السعر الواقعي يسرع البيع، بينما 'السعر عند الاتفاق' قد يؤدي لأسئلة كثيرة."
          example="تأكد دائماً من اختيار الوحدة (طن، كغ، كيس) بشكل صحيح."
        />
        <GuideItem 
          icon={<Camera className="text-primary" />}
          title="صور تجذب المشتري"
          desc="الصور هي أول ما يراه التاجر. التقط صوراً في وضح النهار، تظهر المنتج داخل الصناديق أو في الميدان لتأكيد المصداقية."
          example="نصيحة: صورة واحدة للميدان وصورة مقربة لنفس المنتج كافية جداً."
        />
        <GuideItem 
          icon={<MapPin className="text-primary" />}
          title="الموقع الجغرافي"
          desc="التجار يحسبون تكاليف النقل بدقة. حدد الولاية والمنتدقة بدقة لتقليل زمن الاستفسارات الجانبية."
          example="إعلان في 'باجة' يختلف عن 'تونس العاصمة' بالنسبة للوجستيات."
        />
      </div>

      {/* Success Recipe */}
      <div className="p-8 lg:p-12 rounded-[3.5rem] bg-primary/5 border border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
        <h4 className="text-xl font-black text-primary mb-6 flex items-center gap-3 pr-4 border-r-4 border-primary">
          معادلة العرض الناجح:
        </h4>
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <li className="flex items-start gap-3 bg-white/50 p-6 rounded-3xl">
              <span className="text-2xl">📸</span>
              <span className="text-sm font-bold text-on-surface-variant">صور واقعية وغير معدلة</span>
           </li>
           <li className="flex items-start gap-3 bg-white/50 p-6 rounded-3xl">
              <span className="text-2xl">📦</span>
              <span className="text-sm font-bold text-on-surface-variant">كمية محددة مع وحدة قياس واضحة</span>
           </li>
           <li className="flex items-start gap-3 bg-white/50 p-6 rounded-3xl">
              <span className="text-2xl">🤝</span>
              <span className="text-sm font-bold text-on-surface-variant">سعر منافس وقابل للتفاوض البناء</span>
           </li>
        </ul>
      </div>
    </div>
  );
}

function QuestionGuide() {
  return (
    <div className="space-y-16 animate-in slide-in-from-left-4 duration-500">
      {/* Overview Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="w-2 h-10 bg-error rounded-full" />
           <h3 className="text-2xl font-black text-on-surface italic font-serif">متى تطرح "سؤالاً"؟</h3>
        </div>
        <p className="text-lg font-medium text-on-surface-variant leading-relaxed italic pr-6 border-r-4 border-error/20 max-w-3xl">
           اطرح سؤالاً عندما تواجه مشكلة تقنية، مرضاً في المحصول، أو تحتاج لنصيحة الخبراء. مجتمع "صوت الفلاح" هنا لمساعدتك بالخبرة الميدانية.
        </p>
      </section>

      {/* Field Guidance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <GuideItem 
          icon={<PenTool className="text-error" />}
          title="صياغة السؤال بذكاء"
          desc="اجعل عنوانك مباشراً وواضحاً. بدلاً من 'مساعدة'، اكتب 'اصفرار أوراق الطماطم في البيوت المكيفة'. الوضوح يجذب المختصين فوراً."
          example="مثال: كيف أعالج صدأ القمح بعد الأمطار الأخيرة في سليانة؟"
        />
        <GuideItem 
          icon={<Info className="text-error" />}
          title="شرح المشكلة بدقة"
          desc="صف الأعراض التي تراها، متى بدأت، وما هي الإجراءات التي اتخذتها بالفعل. اذكر نوع التربة أو البذور إذا كنت تظن أنها جزء من المشكلة."
          example="نصيحة: ابدأ بذكر السياق (المكان، نوع المحصول، العمر) ثم اشرح المشكلة."
        />
        <GuideItem 
          icon={<Camera className="text-error" />}
          title="التفاصيل والتدعيم بالصور"
          desc="الصورة تساوي ألف كلمة في الزراعة. التقط صوراً مقربة للمشكلة (أوراق، جذور، حشرات) وصوراً عامة للحقل لإعطاء نظرة كاملة."
          example="نصيحة: صور واضحة تحت ضوء النهار تساعد الخبراء على التشخيص الصحيح."
        />
        <GuideItem 
          icon={<PlusCircle className="text-error" />}
          title="تسهيل الإجابة وتفاعلك"
          desc="كن مهذباً ومنفتحاً على الأسئلة التوضيحية. عندما يجيبك أحدهم، تفاعل معه، واذكر إذا كانت نصيحته قد نجحت لتعم الفائدة."
          example="شكر صاحب الإجابة المفيدة يشجعه ويشجع الآخرين على مساعدتك مستقبلاً."
        />
      </div>

      {/* Success Recipe */}
      <div className="p-8 lg:p-12 rounded-[3.5rem] bg-error/5 border border-error/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-error/5 blur-3xl rounded-full" />
        <h4 className="text-xl font-black text-error mb-6 flex items-center gap-3 pr-4 border-r-4 border-error">
          كيف تحصل على إجابة سريعة ودقيقة؟
        </h4>
        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <li className="flex items-start gap-3 bg-white/50 p-6 rounded-3xl">
              <span className="text-2xl">📸</span>
              <span className="text-sm font-bold text-on-surface-variant">أرفق صوراً واضحة ومقربة للمشكلة</span>
           </li>
           <li className="flex items-start gap-3 bg-white/50 p-6 rounded-3xl">
              <span className="text-2xl">📝</span>
              <span className="text-sm font-bold text-on-surface-variant">اذكر التاريخ والإجراءات السابقة</span>
           </li>
           <li className="flex items-start gap-3 bg-white/50 p-6 rounded-3xl">
              <span className="text-2xl">📍</span>
              <span className="text-sm font-bold text-on-surface-variant">حدد المنطقة والظروف المناخية</span>
           </li>
        </ul>
      </div>
    </div>
  );
}

function PostGuide() {
  return (
    <div className="space-y-16 animate-in slide-in-from-right-4 duration-500">
      {/* Overview Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="w-2 h-10 bg-tertiary rounded-full" />
           <h3 className="text-2xl font-black text-on-surface italic font-serif">متى تختار "منشور"؟</h3>
        </div>
        <p className="text-lg font-medium text-on-surface-variant leading-relaxed italic pr-6 border-r-4 border-tertiary/20 max-w-3xl">
           المنشور هو طريقتك لمشاركة الأخبار، التجارب الناجحة، أو التوعية الزراعية. هنا تبحث عن النقاش وتبادل المعرفة وليس البيع أو الشراء.
        </p>
      </section>

      {/* Field Guidance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <GuideItem 
          icon={<PenTool className="text-tertiary" />}
          title="كيف تكتب منشوراً مفيداً؟"
          desc="اجعل هدفك واضحاً من السطر الأول. استخدم لغة بسيطة قريبة من الفلاحين. المنشورات القصيرة والمركزة تحصل على أعلى نسبة قراءة."
          example="مثال: تجربتي مع الري بالتنقيط في زراعة الأشجار المثمرة."
        />
        <GuideItem 
          icon={<MapPin className="text-tertiary" />}
          title="اختيار القسم والموقع"
          desc="تأكد من اختيار الفئة الصحيحة (أخبار المندوبية، نصائح، أسعار السوق). إذا كان الخبر يخص جهة معينة، لا تنسَ ذكر الولاية والمنطقة."
          example="نصيحة: المنشور المصنف جيداً يصل للجمهور المهتم بشكل أسرع."
        />
        <GuideItem 
          icon={<Camera className="text-tertiary" />}
          title="استخدام الصور للتوضيح"
          desc="استخدم الصور لتوثيق ما تقوله. إذا كنت تتحدث عن جودة شتلات، صورها. الصور تضفي مصداقية كبيرة على كلامك وتزيد التفاعل."
          example="نصيحة: صورة واحدة معبرة تغني عن فقرات طويلة من الوصف."
        />
        <GuideItem 
          icon={<TrendingUp className="text-tertiary" />}
          title="جعل المنشور أكثر فائدة"
          desc="استخدم نقاطاً (بوينت) لتنظيم أفكارك. اطرح سؤالاً في نهاية المنشور لفتح باب النقاش. الفائدة الحقيقية تأتي من تبادل الآراء."
          example="مثال: هل جربتم هذا النوع من الأسمدة؟ شاركونا نتائجكم."
        />
      </div>

      {/* Success Recipe */}
      <div className="p-8 lg:p-12 rounded-[3.5rem] bg-tertiary/5 border border-tertiary/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-tertiary/5 blur-3xl rounded-full" />
        <h4 className="text-xl font-black text-tertiary mb-6 flex items-center gap-3 pr-4 border-r-4 border-tertiary">
          أساسيات المنشور الناجح:
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="bg-white/50 p-6 rounded-3xl space-y-3">
              <span className="text-2xl">💡</span>
              <p className="text-sm font-bold text-on-surface-variant leading-relaxed">قدم معلومة جديدة أو تجربة واقعية</p>
           </div>
           <div className="bg-white/50 p-6 rounded-3xl space-y-3">
              <span className="text-2xl">🖼️</span>
              <p className="text-sm font-bold text-on-surface-variant leading-relaxed">استخدم وسائط مرئية عالية الجودة</p>
           </div>
           <div className="bg-white/50 p-6 rounded-3xl space-y-3">
              <span className="text-2xl">🤝</span>
              <p className="text-sm font-bold text-on-surface-variant leading-relaxed">تفاعل برقي مع التعليقات والاستفسارات</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function RequestGuide() {
  return (
    <div className="space-y-16 animate-in slide-in-from-left-4 duration-500">
      {/* Overview Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
           <div className="w-2 h-10 bg-secondary rounded-full" />
           <h3 className="text-2xl font-black text-on-surface italic font-serif">متى تطلب شراء؟</h3>
        </div>
        <p className="text-lg font-medium text-on-surface-variant leading-relaxed italic pr-6 border-r-4 border-secondary/20 max-w-3xl">
           طلب الشراء هو وسيلتك لإخبار الفلاحين باحتياجاتك المستقبلية. بدلاً من البحث، دع الفلاحين يقدمون إليك عروضهم بناءً على طلبك المحدد.
        </p>
      </section>

      {/* Field Guidance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <GuideItem 
          icon={<Info className="text-secondary" />}
          title="تحديد الطلب بدقة"
          desc="كلما كنت دقيقاً في النوع (مثل قمح صلب، زيت زيتون)، حصلت على عروض جادة. اذكر المواصفات الفنية إذا كانت ضرورية."
          example="مثال: مطلوب زيتون سيدي بوزيد للعصر، كمية كبيرة."
        />
        <GuideItem 
          icon={<Clock className="text-secondary" />}
          title="التوقيت واللوجستيات"
          desc="أهم ما يبحث عنه الفلاح هو متى تحتاج البضاعة. هل هي 'عاجلة' أم 'الموسم القادم'؟ هذا يساعده في تنظيم الجني."
          example="حدد بوضوح إذا كنت ستتكفل بالنقل أم تطلبه من الفلاح."
        />
        <GuideItem 
          icon={<ShieldCheck className="text-secondary" />}
          title="شروط القبول"
          desc="لا تتردد في ذكر شروطك: (مثلاً: لا نقبل حبات صغيرة، يشترط تعبئة في صناديق). الوضوح يمنع الخلافات لاحقاً."
          example="نصيحة: اذكر 'يشترط المعاينة قبل الاستلام' لزيادة المصداقية."
        />
        <GuideItem 
          icon={<TrendingUp className="text-secondary" />}
          title="الميزانية التقديرية"
          desc="تحديد ميزانية (حتى لو كانت تقريبية) يساعد الفلاحين في تقديم عروض تنافسية وضمان جودة تتناسب مع قدرتك."
          example="تحديد ميزانية واقعية يجذب أفضل المنتجين."
        />
      </div>

      {/* Success Recipe */}
      <div className="p-8 lg:p-12 rounded-[3.5rem] bg-secondary/5 border border-secondary/10 relative overflow-hidden text-right">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 blur-3xl rounded-full" />
        <h4 className="text-xl font-black text-secondary mb-6 flex items-center gap-3 pr-4 border-r-4 border-secondary">
          سر الحصول على أفضل العروض:
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="bg-white/50 p-6 rounded-3xl space-y-3">
              <span className="text-2xl">🎯</span>
              <p className="text-sm font-bold text-on-surface-variant leading-relaxed">كن دقيقاً جداً في النوع والمواصفات</p>
           </div>
           <div className="bg-white/50 p-6 rounded-3xl space-y-3">
              <span className="text-2xl">📅</span>
              <p className="text-sm font-bold text-on-surface-variant leading-relaxed">حدد موعداً زمنياً منطقياً للاستلام</p>
           </div>
           <div className="bg-white/50 p-6 rounded-3xl space-y-3">
              <span className="text-2xl">💬</span>
              <p className="text-sm font-bold text-on-surface-variant leading-relaxed">كن جاهزاً للتواصل والرد على الفلاحين</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function GuideItem({ icon, title, desc, example }: { icon: React.ReactNode, title: string, desc: string, example: string }) {
  return (
    <div className="space-y-4 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform text-primary">
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
        <h4 className="text-lg font-black text-on-surface">{title}</h4>
      </div>
      <p className="text-sm font-medium text-on-surface-variant leading-relaxed pr-2 italic border-r-2 border-outline-variant/10">
        {desc}
      </p>
      <div className="bg-white/60 p-4 rounded-2xl border border-dashed border-outline-variant/30">
         <p className="text-[11px] font-black text-primary/60 uppercase tracking-widest mb-1">النموذج الأمثل:</p>
         <p className="text-xs font-bold text-on-surface-variant italic leading-relaxed">{example}</p>
      </div>
    </div>
  );
}
