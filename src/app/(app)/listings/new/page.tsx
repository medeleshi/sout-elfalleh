import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { CreateListingForm } from '@/components/listings/CreateListingForm';
import { getCurrentUser } from '@/lib/auth/actions';
import { redirect } from 'next/navigation';

export default async function CreateListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Fetch Governorates
  const { data: governorates } = await (supabase
    .from('governorates') as any)
    .select('id, name_ar');

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8" dir="rtl">
      <CreateListingForm governorates={governorates || []} />
    </div>
  );
}
