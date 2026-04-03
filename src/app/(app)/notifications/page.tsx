import { Metadata } from 'next';
import NotificationsList from '@/components/notifications/NotificationsList';

export const metadata: Metadata = {
  title: 'الإشعارات | صوت الفلاح',
  description: 'آخر الإشعارات والتحديثات والمراسلات من مجتمع الفلاحين والتجار',
};

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto w-full animate-fade-in" dir="rtl">
      <NotificationsList />
    </div>
  );
}
