'use client';

import React, { useState } from 'react';
import NotificationItem, { NotificationData } from './NotificationItem';
import { Bell, CheckSquare, Settings, ChevronDown, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';

const MOCK_NOTIFICATIONS: NotificationData[] = [
  // HIGH PRIORITY
  {
    id: '1',
    type: 'message',
    priority: 'high',
    title: 'رسالة جديدة من محمد',
    message: 'هل الزيتونة مازالت متوفرة؟ أريد شراء كمية 50 لتر.',
    isRead: false,
    createdAt: 'منذ 5 دقائق',
    sender: { name: 'محمد علي' },
    contextUrl: '/messages/thread-1',
    action: { label: 'رد على الرسالة', href: '/messages/thread-1' }
  },
  {
    id: '2',
    type: 'match',
    priority: 'high',
    title: 'فرصة بيع مطابقة عاجلة!',
    message: 'يوجد طلب شراء جديد لـ "تمر دقلة نور" في ولاية قبلي يتطابق مع منتجاتك.',
    isRead: false,
    createdAt: 'منذ ساعتين',
    contextUrl: '/purchase-requests/req-123',
    action: { label: 'عرض الطلب', href: '/purchase-requests/req-123' }
  },
  {
    id: '3',
    type: 'reply',
    priority: 'high',
    title: 'رد جديد على منشورك',
    message: 'لقد واجهت نفس المشكلة مع التربة العام الماضي والحل هو...',
    isRead: false,
    createdAt: 'منذ 3 ساعات',
    sender: { name: 'فلاح خبير' },
    contextUrl: '/posts/post-456'
  },
  {
    id: '10',
    type: 'reminder',
    priority: 'high',
    title: 'سؤال غير مجاب عليه',
    message: 'لديك سؤال من مشترٍ لم ترد عليه منذ أكثر من 24 ساعة.',
    isRead: false,
    createdAt: 'منذ يوم',
    contextUrl: '/messages/thread-2',
    action: { label: 'عرض المحادثة', href: '/messages/thread-2' }
  },

  // MEDIUM PRIORITY
  {
    id: '4',
    type: 'interest',
    priority: 'medium',
    title: 'اهتمام بإعلانك (5 مشترين)', // Repeated-source limiting representation
    message: 'قام 5 مشترين بحفظ إعلانك "بطاطا للبيع" خلال هذا الأسبوع.',
    isRead: true,
    createdAt: 'أمس',
    contextUrl: '/my-activity/listings/list-789',
    action: { label: 'إدارة الإعلان', href: '/my-activity/listings/list-789' }
  },
  {
    id: '11',
    type: 'account',
    priority: 'medium',
    title: 'متابعون جدد',
    message: 'بدأ رضا بوعزيزي وتاجرين آخرين بمتابعة منتجاتك.',
    isRead: false,
    createdAt: 'أمس',
    contextUrl: '/profile/followers'
  },
  {
    id: '5',
    type: 'match',
    priority: 'medium',
    title: 'إعلان جديد ذو صلة',
    message: 'تم نشر إعلان زيت زيتون في سيدي بوزيد بالقرب منك.',
    isRead: true,
    createdAt: 'أمس',
    contextUrl: '/marketplace/list-101'
  },

  // LOW PRIORITY
  {
    id: '6',
    type: 'recommendation',
    priority: 'low',
    title: 'اقتراح ذو صلة',
    message: 'بناءً على اهتماماتك، تفقد الطلب المتزايد على التمور هذا الشهر.',
    isRead: true,
    createdAt: 'منذ يومين',
    contextUrl: '/marketplace?category=dates'
  },
  {
    id: '7',
    type: 'reminder',
    priority: 'low',
    title: 'تحديث إعلانك',
    message: 'إعلانك مضى عليه أكثر من 14 يوم. هل تم البيع؟',
    isRead: true,
    createdAt: 'منذ 3 أيام',
    contextUrl: '/my-activity/listings/list-789'
  },
  {
    id: '8',
    type: 'account',
    priority: 'low',
    title: 'تحديث الحساب',
    message: 'تم تأكيد هويتك بنجاح، ملفك الشخصي الآن يحمل شارة الثقة.',
    isRead: true,
    createdAt: 'منذ أسبوع',
    contextUrl: '/profile'
  },
  {
    id: '9',
    type: 'system',
    priority: 'low',
    title: 'مرحباً بك في المنصة',
    message: 'نطمح لأن تكون هذه المنصة رفيقك اليومي.',
    isRead: true,
    createdAt: 'منذ أسبوع',
    action: { label: 'إضافة إعلان', href: '/listings/new' }
  }
];

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<NotificationData[]>(MOCK_NOTIFICATIONS);
  const [showLowDigest, setShowLowDigest] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Anti-overload Behavior: Cap total highly visible items
  const VISIBLE_CAP = 15;
  const isOverloaded = notifications.length > VISIBLE_CAP;
  const displayedNotifications = isOverloaded ? notifications.slice(0, VISIBLE_CAP) : notifications;

  const highPriority = displayedNotifications.filter(n => n.priority === 'high');
  const mediumPriority = displayedNotifications.filter(n => n.priority === 'medium');
  const lowPriority = displayedNotifications.filter(n => n.priority === 'low');

  // Digest Logic for Low Priority
  const LOW_PRIORITY_PREVIEW_COUNT = 1;
  const hasDigest = lowPriority.length > LOW_PRIORITY_PREVIEW_COUNT;
  const visibleLowPriority = showLowDigest ? lowPriority : lowPriority.slice(0, LOW_PRIORITY_PREVIEW_COUNT);
  const digestHiddenCount = lowPriority.length - LOW_PRIORITY_PREVIEW_COUNT;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in px-4">
        <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Bell className="w-12 h-12 text-on-surface-variant/40" />
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">لا توجد إشعارات حالياً</h3>
        <p className="text-on-surface-variant max-w-sm text-sm">
          ستظهر هنا جميع التحديثات المهمة، الرسائل، والفرص المطابقة لاهتماماتك.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 pb-10">
      {/* List Header with Preference Awareness */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface">إشعاراتك</h2>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 text-xs font-bold bg-error/10 text-error rounded-lg">
              {unreadCount} جديد
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors shrink-0"
              title="تحديد الكل كمقروء"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">تحديد الكل</span>
            </button>
          )}
          {/* Notification Preference Awareness Link */}
          <Link 
            href={ROUTES.SETTINGS || '/settings'} 
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-xl transition-colors shrink-0"
            title="إعدادات الإشعارات"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Grouped Notifications */}
      <div className="space-y-8">
        
        {/* High Priority */}
        {highPriority.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-sm font-bold text-error flex items-center gap-2">
                <span className="w-1.5 h-4 bg-error rounded-full"></span>
                أولوية قصوى
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {highPriority.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          </section>
        )}

        {/* Medium Priority */}
        {mediumPriority.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-on-surface-variant mb-3 px-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-on-surface-variant/40 rounded-full"></span>
              نشاطات ذات صلة
            </h3>
            <div className="flex flex-col gap-3">
              {mediumPriority.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          </section>
        )}

        {/* Low Priority with Digest / Batching Readiness */}
        {lowPriority.length > 0 && (
          <section className="opacity-95">
            <h3 className="text-sm font-bold text-on-surface-variant/60 mb-3 px-2 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-on-surface-variant/20 rounded-full"></span>
              تحديثات النظام وتذكيرات
            </h3>
            <div className="flex flex-col gap-2 bg-surface-container-low/30 rounded-3xl p-1.5">
              {visibleLowPriority.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
              
              {/* Digest Expander */}
              {hasDigest && !showLowDigest && (
                <button 
                  onClick={() => setShowLowDigest(true)}
                  className="flex items-center justify-center gap-2 w-full py-4 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors bg-surface-container-highest/30 hover:bg-surface-container-highest/60 rounded-2xl mx-auto"
                >
                  <ListFilter className="w-4 h-4" />
                  عرض {digestHiddenCount} تحديثات أقدم
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Anti-overload Notice */}
        {isOverloaded && (
          <div className="text-center pt-4">
            <p className="text-xs text-on-surface-variant/50">
              تم إخفاء بعض الإشعارات القديمة لتوفير تجربة خالية من التشتيت.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
