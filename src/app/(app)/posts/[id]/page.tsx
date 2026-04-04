import React from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Share2, 
  MessageCircle, 
  AlertCircle,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Users,
  Send,
  ThumbsUp,
  Bookmark,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export default async function PostDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const profileData = await getCurrentProfile();

  // 1. Fetch Post
  const { data: postData, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id(id, full_name, avatar_url, role, region)
    `)
    .eq('id', id)
    .single();

  if (error || !postData) return notFound();
  const post = postData as any;

  // 2. Fetch Comments
  const { data: comments } = await supabase
    .from('post_comments')
    .select(`
      id, content, likes_count, created_at,
      profiles:author_id(full_name, role)
    `)
    .eq('post_id', id)
    .order('created_at', { ascending: true });

  // 3. Fetch Related Listings (same category)
  const { data: relatedListings } = await supabase
    .from('listings')
    .select('id, title, price, unit, region')
    .eq('status', 'active')
    .ilike('category', `%${post.category || ''}%`)
    .neq('id', id)
    .limit(3);

  const isOwner = profileData?.user?.id === post.author_id;

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8 space-y-12" dir="rtl">
      {/* 0. Breadcrumbs */}
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black text-on-surface-variant/40 uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
          <Link href={ROUTES.HOME} className="hover:text-primary transition-colors flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>المجتمع</span>
          </Link>
          <ChevronRight className="w-3 h-3 rotate-180" />
          <span className="text-on-surface-variant/60">{post.category || 'نقاش'}</span>
          <ChevronRight className="w-3 h-3 rotate-180" />
          <span className="text-on-surface truncate max-w-[150px]">{post.title}</span>
        </div>
        <Link href={ROUTES.HOME} className="lg:hidden p-2 text-on-surface-variant hover:text-primary transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT COLUMN: Post + Comments */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* 1. Post Body Card */}
          <article className="bg-white border-2 border-outline-variant/30 rounded-[3rem] overflow-hidden shadow-sm">
            <div className="p-8 lg:p-10 border-b border-outline-variant/10 bg-surface-container-lowest/50 relative">
              {isOwner && (
                <div className="absolute top-8 left-8 flex items-center gap-2">
                  <Link href={ROUTES.POST_EDIT(post.id)}>
                    <Button variant="outline" className="h-10 px-4 rounded-xl border-outline-variant/60 text-on-surface-variant font-black text-xs">
                      تعديل المنشور
                    </Button>
                  </Link>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  post.type === 'question' ? 'bg-error text-on-error shadow-lg shadow-error/20' : 'bg-tertiary text-on-tertiary shadow-lg shadow-tertiary/20'
                }`}>
                  {post.type === 'question' ? <HelpCircle className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                  <span>{post.type === 'question' ? 'سؤال تقني' : post.type === 'tip' ? 'نصيحة' : 'نقاش مجتمعي'}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                  <span>{post.views_count} مشاهدة</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString('ar-TN')}</span>
                </div>
              </div>
              <h1 className="text-2xl lg:text-4xl font-black text-on-surface font-serif italic leading-tight">
                {post.title}
              </h1>
            </div>

            <div className="p-8 lg:p-10 space-y-8">
              <div className="text-lg font-medium text-on-surface-variant leading-relaxed whitespace-pre-line italic pr-6 border-r-4 border-primary/10 text-right">
                {post.content}
              </div>

              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(post.images as string[]).map((img, i) => (
                    <div key={i} className="aspect-[4/3] rounded-[2rem] overflow-hidden border-2 border-outline-variant/10">
                      <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={`صورة ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-8 lg:px-10 py-6 bg-surface-container-lowest border-t border-outline-variant/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="h-12 px-6 rounded-2xl gap-3 text-primary font-black hover:bg-primary/5">
                  <ThumbsUp className="w-5 h-5" />
                  <span>{post.likes_count} إعجاب</span>
                </Button>
                <Button variant="ghost" className="h-12 px-6 rounded-2xl gap-3 text-on-surface-variant/60 font-black hover:bg-surface-container-low">
                  <MessageCircle className="w-5 h-5 rotate-180" />
                  <span>{comments?.length || 0} تعليقات</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl text-on-surface-variant/40 hover:text-primary hover:bg-primary/5">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl text-on-surface-variant/40 hover:text-primary hover:bg-primary/5">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </article>

          {/* 2. Comments Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-primary rounded-full" />
              <h2 className="text-2xl font-black text-on-surface italic font-serif">النقاش ({comments?.length || 0})</h2>
            </div>

            <div className="bg-surface-container-low rounded-[2.5rem] p-6 flex items-start gap-4 border border-outline-variant/10">
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

            <div className="space-y-6">
              {(comments || []).map((comment: any) => (
                <div key={comment.id} className="bg-white p-7 rounded-[2.5rem] border-2 border-outline-variant/30 space-y-5 group hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-on-surface">{comment.profiles?.full_name || 'مستخدم'}</h4>
                        <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">{comment.profiles?.role || 'عضو'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-widest">
                      {new Date(comment.created_at).toLocaleDateString('ar-TN')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-on-surface-variant leading-relaxed italic pr-4 border-r-2 border-outline-variant/10 text-right">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-6 pt-2">
                    <button className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant/40 hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{comment.likes_count} إعجابات</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Author & Related */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          
          {/* Author Card */}
          <section className="bg-white p-8 rounded-[3.5rem] border-2 border-outline-variant/30 space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-surface-container-low rounded-[2rem] border-2 border-primary/10 overflow-hidden flex items-center justify-center">
                {post.profiles?.avatar_url
                  ? <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                  : <Users className="w-10 h-10 text-primary/40" />
                }
              </div>
              <div className="space-y-1 text-right">
                <h4 className="text-xl font-black text-on-surface font-serif italic">{post.profiles?.full_name || 'فلاح'}</h4>
                <p className="text-xs font-black text-on-surface-variant/40 uppercase tracking-widest italic">{post.profiles?.role || 'عضو'}</p>
              </div>
            </div>

            {post.profiles?.region && (
              <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant/60 justify-end">
                <span>{post.profiles.region}</span>
                <MapPin className="w-4 h-4 text-secondary" />
              </div>
            )}

            <div className="space-y-3">
              <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                <Send className="w-5 h-5 rotate-180" />
                <span>مراسلة خاصة</span>
              </Button>
            </div>
          </section>

          {/* Related Listings */}
          {relatedListings && relatedListings.length > 0 && (
            <section className="bg-secondary/5 p-8 rounded-[3rem] border-2 border-secondary/10 space-y-6">
              <div className="flex items-center gap-3 text-secondary">
                <ShoppingBag className="w-6 h-6" />
                <h3 className="text-xl font-black font-serif italic">فرص سوقية ذات صلة</h3>
              </div>
              <div className="space-y-4">
                {relatedListings.map((listing: any) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`} className="flex gap-4 p-4 bg-white/60 hover:bg-white rounded-2xl border border-outline-variant/10 transition-all group">
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-on-surface leading-snug line-clamp-2 text-right">{listing.title}</h4>
                      {listing.price && (
                        <div className="flex items-baseline gap-1 justify-end mt-1">
                          <span className="text-sm font-black text-primary">{listing.price}</span>
                          <span className="text-[9px] font-bold text-on-surface-variant/60">د.ت / {listing.unit}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/marketplace">
                <Button variant="outline" className="w-full h-11 rounded-xl border-secondary/20 text-secondary hover:bg-secondary/5 font-black text-xs">
                  تصفح السوق بالكامل
                </Button>
              </Link>
            </section>
          )}
        </div>
      </div>

      {/* Mobile Persistent Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 z-[60] lg:hidden flex gap-3 shadow-[0_-12px_40px_rgba(0,0,0,0.08)]">
        <Button className="flex-[2] h-14 rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3">
          <Send className="w-5 h-5 rotate-180" />
          <span>مراسلة صاحب {post.type === 'question' ? 'السؤال' : 'المنشور'}</span>
        </Button>
        <Button variant="outline" className="flex-1 h-14 rounded-2xl px-5 border-2 border-primary/20 text-primary font-black text-xs">
          إضافة رد
        </Button>
      </div>
    </div>
  );
}
