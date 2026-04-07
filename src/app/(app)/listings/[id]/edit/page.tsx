import React from 'react';
import { getCurrentUser } from '@/lib/auth/actions';
import { redirect, notFound } from 'next/navigation';
import { EditListingForm } from '@/components/listings/EditListingForm';
import { getCategories, getUnits, getGovernorates, getCategoryUnits } from '@/lib/data/lookups';
import { createClient } from '@/lib/supabase/server';

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

  // Fetch Lookups
  const [categories, units, governorates, categoryUnits] = await Promise.all([
    getCategories(),
    getUnits(),
    getGovernorates(),
    getCategoryUnits(),
  ]);

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8" dir="rtl">
      <EditListingForm 
        listing={listing} 
        categories={categories}
        units={units}
        governorates={governorates} 
        categoryUnits={categoryUnits}
      />
    </div>
  );

}
