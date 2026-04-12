'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface MobileContactBarProps {
  ownerId: string;
}

export function MobileContactBar({ ownerId }: MobileContactBarProps) {
  const router = useRouter();

  const goToMessages = () => router.push(`/messages?recipientId=${ownerId}`);

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-outline-variant/20 z-[60] lg:hidden flex gap-4 shadow-[0_-8px_30px_rgb(0,0,0,0.08)]">
      <Button
        className="flex-1 h-16 rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
        onClick={goToMessages}
      >
        <MessageCircle className="w-5 h-5 rotate-180" />
        <span>تواصل مع الفلاح</span>
      </Button>
      <Button
        variant="outline"
        className="w-16 h-16 rounded-2xl border-2 border-primary/20 p-0 flex items-center justify-center bg-white"
        onClick={goToMessages}
      >
        <Phone className="w-6 h-6 text-primary" />
      </Button>
    </div>
  );
}
