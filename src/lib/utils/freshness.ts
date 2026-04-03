import { differenceInDays } from "date-fns";

export type FreshnessState = 'fresh' | 'aging' | 'stale';

export interface FreshnessInfo {
  state: FreshnessState;
  daysOld: number;
  label: string;
  colorClass: string;
  shouldPromptUpdate: boolean;
}

export function getFreshnessInfo(createdAt: string | Date): FreshnessInfo {
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const daysOld = differenceInDays(new Date(), date);

  if (daysOld < 7) {
    return {
      state: 'fresh',
      daysOld,
      label: 'جديد جداً',
      colorClass: 'text-primary bg-primary/5',
      shouldPromptUpdate: false
    };
  }

  if (daysOld < 14) {
    return {
      state: 'aging',
      daysOld,
      label: 'محدث مؤخراً',
      colorClass: 'text-secondary bg-secondary/5',
      shouldPromptUpdate: false
    };
  }

  return {
    state: 'stale',
    daysOld,
    label: 'بحاجة لتحديث',
    colorClass: 'text-error bg-error/5',
    shouldPromptUpdate: true
  };
}
