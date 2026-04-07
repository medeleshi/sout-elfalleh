import React from 'react';
import { CreateRequestForm } from '@/components/marketplace/CreateRequestForm';
import { getCategories, getUnits, getGovernorates } from '@/lib/data/lookups';

export default async function CreatePurchaseRequestPage() {
  const [categories, units, governorates] = await Promise.all([
    getCategories(),
    getUnits(),
    getGovernorates()
  ]);

  return (
    <CreateRequestForm 
      categories={categories} 
      units={units} 
      governorates={governorates} 
    />
  );
}
