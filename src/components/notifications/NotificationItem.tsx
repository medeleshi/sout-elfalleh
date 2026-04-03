import React from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  CornerDownLeft, 
  Sparkles, 
  Clock, 
  Info,
  User,
  Eye,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export type NotificationType = 'message' | 'reply' | 'match' | 'reminder' | 'system' | 'interest' | 'recommendation' | 'account';
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface NotificationAction {
  label: string;
  href: string;
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  action?: NotificationAction;
  sender?: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  contextUrl?: string;
}

interface NotificationItemProps {
  notification: NotificationData;
  onMarkAsRead?: (id: string) => void;
}

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType, bgClass: string, textClass: string }> = {
  message: {
    icon: MessageSquare,
    bgClass: 'bg-primary/10',
    textClass: 'text-primary',
  },
  reply: {
    icon: CornerDownLeft,
    bgClass: 'bg-surface-container-highest',
    textClass: 'text-on-surface-variant',
  },
  match: {
    icon: Sparkles,
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-600',
  },
  reminder: {
    icon: Clock,
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-600',
  },
  system: {
    icon: Info,
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-600',
  },
  interest: {
    icon: Eye,
    bgClass: 'bg-pink-500/10',
    textClass: 'text-pink-600',
  },
  recommendation: {
    icon: TrendingUp,
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-600',
  },
  account: {
    icon: ShieldCheck,
    bgClass: 'bg-surface-container-highest',
    textClass: 'text-on-surface',
  }
};

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const Icon = config.icon;

  const content = (
    <div 
      className={`group flex items-start gap-4 p-4 rounded-3xl transition-all duration-300 relative overflow-hidden ${
        notification.isRead 
          ? 'bg-surface hover:bg-surface-container-low border border-transparent' 
          : 'bg-primary/5 hover:bg-primary/10 border border-primary/10'
      }`}
      onClick={() => {
        if (!notification.isRead && onMarkAsRead) {
          onMarkAsRead(notification.id);
        }
      }}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute left-4 top-[26px] w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.6)]" />
      )}

      {/* Avatar or Icon */}
      <div className="relative shrink-0">
        {notification.sender?.avatarUrl ? (
          <img 
            src={notification.sender.avatarUrl} 
            alt={notification.sender.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-surface shadow-sm"
          />
        ) : notification.sender ? (
          <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant ring-2 ring-surface shadow-sm">
            <User className="w-6 h-6" />
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-2 ring-surface shadow-sm ${config.bgClass} ${config.textClass}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        
        {/* Type Badge on Avatar */}
        {notification.sender && (
          <div className={`absolute -bottom-1 -left-1 w-5 h-5 rounded-lg flex items-center justify-center border-2 border-surface shadow-sm ${config.bgClass} ${config.textClass}`}>
            <Icon className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm md:text-base font-bold truncate ${notification.isRead ? 'text-on-surface' : 'text-primary'}`}>
            {notification.title}
          </p>
          <span className="text-[11px] md:text-xs text-on-surface-variant/60 whitespace-nowrap font-medium mt-0.5" dir="ltr">
            {notification.createdAt}
          </span>
        </div>
        
        <p className={`text-xs md:text-sm leading-relaxed line-clamp-2 ${notification.isRead ? 'text-on-surface-variant' : 'text-on-surface font-medium'}`}>
          {notification.message}
        </p>

        {/* Action Button (if any) */}
        {notification.action && (
          <div className="mt-3">
            {notification.contextUrl ? (
              <span className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface transition-colors cursor-pointer w-fit shadow-sm">
                {notification.action.label}
              </span>
            ) : (
              <button 
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors w-fit shadow-sm"
                onClick={(e) => {
                  e.preventDefault();
                  // Action handling
                }}
              >
                {notification.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (notification.contextUrl) {
    return (
      <Link href={notification.contextUrl} className="block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-3xl">
        {content}
      </Link>
    );
  }

  return (
    <div className="block" role="button" tabIndex={0}>
      {content}
    </div>
  );
}
