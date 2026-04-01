import React from "react";
import { 
  AlertCircle, 
  ArrowLeft,
  LucideIcon
} from "lucide-react";

interface ReminderCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  variant?: 'primary' | 'warning' | 'info';
}

export default function ReminderCard({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref,
  variant = 'info'
}: ReminderCardProps) {
  const variantStyles = {
    primary: "bg-primary/5 border-primary/10",
    warning: "bg-secondary/5 border-secondary/10",
    info: "bg-surface-container-low border-outline-variant/10"
  };

  const accentStyles = {
    primary: "text-primary",
    warning: "text-secondary",
    info: "text-primary/60"
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-[2.5rem] border ${variantStyles[variant]} transition-all hover:shadow-lg hover:shadow-primary/5 group`}>
      <div className={`p-4 rounded-2xl bg-white/50 ${accentStyles[variant]}`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-black text-on-surface mb-1">{title}</h4>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed opacity-80 decoration-none">
          {description}
        </p>
      </div>

      <a 
        href={actionHref}
        className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${
          variant === 'primary' 
            ? 'bg-primary text-on-primary shadow-md shadow-primary/10' 
            : 'bg-surface-container-highest text-on-surface px-4'
        }`}
      >
        <span>{actionLabel}</span>
        <ArrowLeft className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
