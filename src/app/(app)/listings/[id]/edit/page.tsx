import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/actions';
import { redirect, notFound } from 'next/navigation';
import { EditListingForm } from '@/components/listings/EditListingForm';

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Listing
  const { data: listing, error: listingError } = await (supabase
    .from('listings') as any)
    .select('*, listing_images(storage_path)')
    .eq('id', id)
    .single();

  if (listingError || !listing) {
    console.error('Error fetching listing:', listingError);
    notFound();
  }

  // Security Check: Only owner can edit
  if (listing.user_id !== user.id) {
    redirect('/activity');
  }

  // Fetch Governorates
  const { data: governorates } = await (supabase
    .from('governorates') as any)
    .select('id, name_ar');

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8" dir="rtl">
      <EditListingForm 
        listing={listing} 
        governorates={governorates || []} 
      />
    </div>
  );
}
