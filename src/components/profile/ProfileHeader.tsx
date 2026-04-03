import React from 'react';
import { type Tables } from '@/types/database';
import { MapPin, ShieldCheck, Edit3, MessageSquare, User, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

type Profile = Tables<'profiles'>;

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
}

const ROLE_LABELS: Record<string, string> = {
  farmer: 'فلاح',
  merchant: 'تاجر',
  buyer: 'مشتري',
  expert: 'خبير زراعي',
};

export default function ProfileHeader({ profile, isOwnProfile = true }: ProfileHeaderProps) {
  const roleLabel = profile.role ? ROLE_LABELS[profile.role] || 'مستخدم' : 'أكمل البيانات';

  return (
    <div className="bg-surface border border-outline-variant/20 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 relative overflow-hidden" dir="rtl">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      {/* Avatar Section */}
      <div className="flex-shrink-0 relative">
        {profile.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt={profile.full_name || 'صورة الحساب'} 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-surface shadow-md relative z-10"
          />
        ) : (
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant relative z-10 shadow-inner">
            <User className="w-12 h-12" />
          </div>
        )}
        
        {/* Verification Badge */}
        <div 
          className="absolute -bottom-3 -right-3 bg-surface rounded-xl p-1.5 shadow-sm z-20"
          title="حساب موثق"
        >
          <div className="bg-green-100 text-green-600 rounded-lg p-1.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-1">
              {profile.full_name || 'مستخدم مجهول'}
            </h1>
            
            <div className="flex items-center gap-3 text-sm font-medium text-primary/80 mb-3">
              <span className="px-2.5 py-1 bg-primary/10 rounded-lg">
                {roleLabel}
              </span>
              
              {profile.governorate_id && (
                <div className="flex items-center gap-1.5 text-on-surface-variant/80">
                  <MapPin className="w-4 h-4" />
                  <span>{(profile as any).governorate_name_ar || 'تونس'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-2 sm:mt-0">
            {isOwnProfile ? (
              <Link 
                href={ROUTES.PROFILE_EDIT} 
                className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-sm rounded-xl transition-colors shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                تعديل الملف الشخصي
              </Link>
            ) : (
              <button className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <MessageSquare className="w-4 h-4" />
                مراسلة
              </button>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-2xl mt-2 line-clamp-2 italic">
            {profile.bio}
          </p>
        )}

        {/* Trust & Ownership Signals */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
            <CalendarDays className="w-4 h-4 text-primary/60" />
            <span>عضو منذ عام واحد</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
            <ShieldCheck className="w-4 h-4 text-green-500/80" />
            <span>هوية مؤكدة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
