// src/components/notifications/NotificationsList.tsx
import React from 'react';
import { getCurrentProfile } from '@/lib/auth/get-current-profile';
import { createClient } from '@/lib/supabase/server';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import NotificationItem, { NotificationData } from './NotificationItem';
import { ROUTES } from '@/lib/constants/routes';

export default async function NotificationsList() {
  const profileData = await getCurrentProfile();

  let notifications: NotificationData[] = [];

  if (profileData?.user?.id) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('notifications')
      .select('id, type, priority, title, message, is_read, context_url, created_at')
      .eq('user_id', profileData.user.id)
      .order('priority', { ascending: true }) // high first
      .order('created_at', { ascending: false })
      .limit(30);

    notifications = (data || []).map((n: any) => ({
      id: n.id,
      type: n.type as NotificationData['type'],
      priority: n.priority as NotificationData['priority'],
      title: n.title,
      message: n.message,
      isRead: n.is_read,
      createdAt: new Date(n.created_at).toLocaleDateString('ar-TN'),
      contextUrl: n.context_url,
    }));
  }

  // Fallback: show welcome notification for new users with no DB notifications
  if (notifications.length === 0) {
    return (
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">إشعاراتك</h2>
          <Link href={ROUTES.SETTINGS || '/settings'} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Bell className="w-12 h-12 text-on-surface-variant/40" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">لا توجد إشعارات حالياً</h3>
          <p className="text-on-surface-variant max-w-sm text-sm">
            ستظهر هنا جميع التحديثات المهمة، الرسائل، والفرص المطابقة لاهتماماتك.
          </p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const highPriority = notifications.filter((n) => n.priority === 'high');
  const mediumPriority = notifications.filter((n) => n.priority === 'medium');
  const lowPriority = notifications.filter((n) => n.priority === 'low');

  return (
    <div className="space-y-6 lg:space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">إشعاراتك</h2>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold bg-error/10 text-error rounded-lg">
              {unreadCount} جديد
            </span>
          )}
        </div>
        <Link href={ROUTES.SETTINGS || '/settings'} className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-colors" title="إعدادات الإشعارات">
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      <div className="space-y-8">
        {highPriority.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-error flex items-center gap-2 mb-3 px-2">
              <span className="w-1.5 h-4 bg-error rounded-full" />
              أولوية قصوى
            </h3>
            <div className="flex flex-col gap-3">
              {highPriority.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={() => {}} />
              ))}
            </div>
          </section>
        )}

        {mediumPriority.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-on-surface-variant mb-3 px-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-on-surface-variant/40 rounded-full" />
              نشاطات ذات صلة
            </h3>
            <div className="flex flex-col gap-3">
              {mediumPriority.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={() => {}} />
              ))}
            </div>
          </section>
        )}

        {lowPriority.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-on-surface-variant/60 mb-3 px-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-on-surface-variant/20 rounded-full" />
              تحديثات النظام
            </h3>
            <div className="flex flex-col gap-2 bg-surface-container-low/30 rounded-3xl p-1.5">
              {lowPriority.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onMarkAsRead={() => {}} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
