import React from "react";
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  UserPlus,
  ArrowLeft,
  Star
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { type UserRole } from "@/types/database";

interface SuggestedPeopleProps {
  currentUserId: string;
  userRole: UserRole | null;
  governorateId: string | null;
}

export default async function SuggestedPeople({ 
  currentUserId, 
  userRole, 
  governorateId 
}: SuggestedPeopleProps) {
  const supabase = await createClient();

  // Suggestion Logic:
  // If Farmer/Merchant -> Suggest Buyers
  // If Buyer -> Suggest Farmers/Merchants
  const targetRoles: UserRole[] = userRole === 'buyer' 
    ? ['farmer', 'merchant'] 
    : ['buyer'];

  // Fetch suggested profiles
  const { data: suggestions, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      avatar_url,
      role,
      governorates:governorate_id(name_ar),
      activity_types:activity_type_id(name_ar)
    `)
    .neq('id', currentUserId)
    .in('role', targetRoles)
    .eq('is_onboarding_completed', true)
    .order('updated_at', { ascending: false })
    .limit(8) as { data: any[] | null; error: any };

  if (error || !suggestions || suggestions.length === 0) return null;

  // Sort by governorate proximity (Same governorate first)
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (a.governorate_id === governorateId && b.governorate_id !== governorateId) return -1;
    if (a.governorate_id !== governorateId && b.governorate_id === governorateId) return 1;
    return 0;
  });

  return (
    <section className="mt-16 sm:mt-24">
      <div className="flex items-end justify-between mb-8 px-4 sm:px-0">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Users className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">اكتشاف الشركاء</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-on-surface">أشخاص قد يهمك التعامل معهم</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">تواصل مع تجار ومشترين موثوقين في منطقتك</p>
        </div>
        
        <Link 
          href="/directory" 
          className="hidden sm:flex items-center gap-2 text-primary text-sm font-black hover:gap-3 transition-all"
        >
          <span>عرض الكل</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-6 sm:pb-0 px-4 sm:px-0 scrollbar-hide snap-x">
        {sortedSuggestions.map((person) => (
          <div 
            key={person.id} 
            className="min-w-[280px] sm:min-w-0 snap-center bg-surface rounded-[2.5rem] border border-outline-variant/10 p-6 hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col items-center text-center"
          >
            {/* Avatar & Role Badge */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-[2rem] bg-surface-container-highest overflow-hidden border-2 border-primary/10 group-hover:border-primary/30 transition-all duration-500">
                {person.avatar_url ? (
                  <img src={person.avatar_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <Users className="w-8 h-8 text-primary/30" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-primary text-on-primary shadow-lg">
                <Star className="w-3 h-3 fill-current" />
              </div>
            </div>

            {/* Info */}
            <h3 className="text-base font-black text-on-surface group-hover:text-primary transition-colors line-clamp-1">
              {person.full_name || 'مستخدم غير معروف'}
            </h3>
            
            <div className="flex items-center gap-1.5 mt-1 mb-4">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-[10px] font-black text-on-surface-variant uppercase">
                {person.role === 'farmer' ? 'فلاح' : person.role === 'merchant' ? 'تاجر' : 'مشتري'}
              </span>
              {person.governorates?.name_ar && (
                <>
                  <span className="w-1 h-1 bg-outline-variant/30 rounded-full" />
                  <div className="flex items-center gap-1 text-[10px] text-on-surface-variant font-bold">
                    <MapPin className="w-3 h-3 text-primary/50" />
                    <span>{person.governorates.name_ar}</span>
                  </div>
                </>
              )}
            </div>

            <div className="bg-surface-container-low/50 rounded-2xl p-3 w-full mb-6">
              <p className="text-[10px] text-on-surface-variant font-medium line-clamp-1">
                {person.activity_types?.name_ar || 'نشاط تجاري متنوع'}
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <button className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-on-primary text-xs font-black hover:bg-primary/90 transition-all shadow-md shadow-primary/10 active:scale-95">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>تواصل</span>
              </button>
              <Link 
                href={`/profile/${person.id}`}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-surface-container-highest text-on-surface text-xs font-black hover:bg-surface-container-high transition-all active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>الملف</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 px-4 sm:hidden">
        <Link 
          href="/directory" 
          className="flex items-center justify-center gap-2 py-4 rounded-3xl bg-surface-container-highest text-primary text-sm font-black w-full"
        >
          <span>عرض كافة الشركاء</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
