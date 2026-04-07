import React from 'react';
import { getCurrentUser } from '@/lib/auth/actions';
import { redirect, notFound } from 'next/navigation';
import { EditRequestForm } from '@/components/marketplace/EditRequestForm';
import { getCategories, getUnits, getGovernorates } from '@/lib/data/lookups';
import { createClient } from '@/lib/supabase/server';

export default async function EditRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Request
  const { data: request, error: requestError } = await (supabase
    .from('purchase_requests') as any)
    .select('*')
    .eq('id', id)
    .single();

  if (requestError || !request) {
    console.error('Error fetching request:', requestError);
    notFound();
  }

  // Security Check: Only owner can edit
  if (request.user_id !== user.id) {
    redirect('/activity');
  }

  // Fetch Lookups
  const [categories, units, governorates] = await Promise.all([
    getCategories(),
    getUnits(),
    getGovernorates(),
  ]);

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8" dir="rtl">
      <EditRequestForm 
        request={request} 
        categories={categories}
        units={units}
        governorates={governorates} 
      />
    </div>
  );
}
