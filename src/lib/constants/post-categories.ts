import { HelpCircle, MessageSquare, Sprout, Droplets, TrendingUp, AlertTriangle } from 'lucide-react';

export const POST_CATEGORIES = [
  { id: 'diseases', label: 'أمراض وحشرات', icon: AlertTriangle },
  { id: 'farming', label: 'طرق زراعة', icon: Sprout },
  { id: 'market', label: 'أسعار السوق', icon: TrendingUp },
  { id: 'irrigation', label: 'ري وتسميد', icon: Droplets },
];

export const POST_TYPES = [
  { id: 'question', label: 'سؤال تقني', icon: HelpCircle },
  { id: 'discussion', label: 'نقاش مجتمعي', icon: MessageSquare },
];
