'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';

export type ListingState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function updateListingAction(
  listingId: string,
  formData: FormData
): Promise<ListingState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  const title = formData.get("title") as string;
  const categoryId = formData.get("categoryId") as string;
  const quantity = formData.get("quantity") as string;
  const quantityUnit = formData.get("quantityUnit") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const governorateId = formData.get("governorateId") as string;
  const images = JSON.parse(formData.get("images") as string || "[]");

  if (!title || !categoryId) {
    return { error: "يرجى ملء جميع الحقول الإلزامية." };
  }

  try {
    const { error } = await (supabase.from("listings") as any)
      .update({
        title,
        category_id: categoryId,
        quantity: quantity ? parseFloat(quantity) : null,
        quantity_unit: quantityUnit || null,
        price: price ? parseFloat(price) : null,
        description,
        governorate_id: governorateId || null,
        images, // Assuming images is a JSONB column or similar
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/activity");
    revalidatePath(`/marketplace/listings/${listingId}`);
    return { success: true, message: "تم تحديث العرض بنجاح!" };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء تحديث العرض." };
  }
}

export async function updateListingStatusAction(
  listingId: string,
  status: 'active' | 'sold' | 'hidden'
): Promise<ListingState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  try {
    const { error } = await (supabase.from("listings") as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", listingId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/activity");
    revalidatePath(`/marketplace/listings/${listingId}`);
    return { success: true, message: "تم تحديث حالة العرض بنجاح!" };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء تحديث الحالة." };
  }
}

export async function deleteListingAction(listingId: string): Promise<ListingState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  try {
    const { error } = await (supabase.from("listings") as any)
      .delete()
      .eq("id", listingId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/activity");
    return { success: true, message: "تم حذف العرض بنجاح!" };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء حذف العرض." };
  }
}
