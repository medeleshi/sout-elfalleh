import React from 'react';
import { CreateListingForm } from '@/components/listings/CreateListingForm';
import { getCurrentUser } from '@/lib/auth/actions';
import { redirect } from 'next/navigation';
import { getCategories, getUnits, getGovernorates, getCategoryUnits } from '@/lib/data/lookups';

export default async function CreateListingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Lookups from central data Layer
  const [categories, units, governorates, categoryUnits] = await Promise.all([
    getCategories(),
    getUnits(),
    getGovernorates(),
    getCategoryUnits(),
  ]);

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8" dir="rtl">
      <CreateListingForm 
        categories={categories}
        units={units}
        governorates={governorates} 
        categoryUnits={categoryUnits}
      />
    </div>
  );

}
