'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';

export type ListingState = {
  success?: boolean;
  error?: string;
  message?: string;
  id?: string;
};

export async function createListingAction(
  formData: FormData
): Promise<ListingState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const quantity = formData.get("quantity") as string;
  const unit = formData.get("unit") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const governorateId = formData.get("governorate_id") as string;
  
  if (!title || !category || !quantity || !unit || !governorateId) {
    return { error: "يرجى ملء جميع الحقول الإلزامية." };
  }

  try {
    const { data, error } = await (supabase.from("listings") as any)
      .insert({
        user_id: user.id,
        title,
        category,
        quantity: quantity ? parseFloat(quantity) : null,
        unit: unit || null,
        price: price ? parseFloat(price) : null,
        description,
        governorate_id: governorateId || null,
        status: 'active',
      })
      .select('id')
      .single();

    if (error) throw error;

    // Handle Native File Uploads
    const imageFiles = formData.getAll("images") as File[];
    const validFiles = imageFiles.filter(f => f && f.size > 0 && f.type.startsWith('image/'));
    const uploadedPaths: string[] = [];

    for (const file of validFiles) {
      const ext = file.name.split('.').pop() || 'jpg';
      const uniqueName = `${data.id}/${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${ext}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listings')
        .upload(uniqueName, file);
      
      if (uploadError) {
        console.error(`[CREATE_LISTING] Storage upload error for file ${file.name}:`, uploadError);
        throw new Error(`تعذر رفع الصور إلى المخزن: ${uploadError.message}`);
      }
      if (uploadData?.path) {
        uploadedPaths.push(uploadData.path);
      }
    }

    if (uploadedPaths.length > 0) {
      const imagesToInsert = uploadedPaths.map((path, index) => ({
        listing_id: data.id,
        storage_path: path, 
        is_primary: index === 0,
        sort_order: index
      }));

      const { error: imageError } = await (supabase
        .from('listing_images') as any)
        .insert(imagesToInsert);

      if (imageError) throw imageError;
    }

    revalidatePath("/marketplace");
    revalidatePath("/activity");
    revalidatePath("/profile");
    
    return { success: true, message: "تمت إضافة العرض بنجاح!", id: data.id };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء إضافة العرض." };
  }
}

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
  const category = formData.get("category") as string;
  const quantity = formData.get("quantity") as string;
  const unit = formData.get("unit") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const governorateId = formData.get("governorate_id") as string;
  
  if (!title || !category) {
    return { error: "يرجى ملء جميع الحقول الإلزامية." };
  }

  try {
    const retainedRaw = formData.get("retained_images");
    const retained_images = JSON.parse((retainedRaw as string) || "[]");

    const { error } = await (supabase.from("listings") as any)
      .update({
        title,
        category,
        quantity: quantity ? parseFloat(quantity) : null,
        unit: unit || null,
        price: price ? parseFloat(price) : null,
        description,
        governorate_id: governorateId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .eq("user_id", user.id);

    if (error) throw error;

    // Handle new uploads alongside retained
    const imageFiles = formData.getAll("images") as File[];
    const validFiles = imageFiles.filter(f => f && f.size > 0 && f.type.startsWith('image/'));
    const newUploadedPaths: string[] = [];

    for (const file of validFiles) {
      const ext = file.name.split('.').pop() || 'jpg';
      const uniqueName = `${listingId}/${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${ext}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listings')
        .upload(uniqueName, file);
      
      if (uploadError) {
        console.error(`[UPDATE_LISTING] Storage upload error for file ${file.name}:`, uploadError);
        throw new Error(`تعذر رفع الصور الجديدة إلى المخزن: ${uploadError.message}`);
      }
      if (uploadData?.path) {
        newUploadedPaths.push(uploadData.path);
      }
    }

    const finalPaths = [...retained_images, ...newUploadedPaths];

    // Wipe old explicitly and insert full final array
    await (supabase.from('listing_images') as any).delete().eq('listing_id', listingId);
    
    if (finalPaths.length > 0) {
      const imagesToInsert = finalPaths.map((path: string, index: number) => ({
        listing_id: listingId,
        storage_path: path,
        is_primary: index === 0,
        sort_order: index
      }));
      
      await (supabase.from('listing_images') as any).insert(imagesToInsert);
    }

    revalidatePath("/activity");
    revalidatePath("/profile");
    revalidatePath(`/listings/${listingId}`);
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
    revalidatePath("/profile");
    revalidatePath(`/listings/${listingId}`);
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
    revalidatePath("/profile");
    return { success: true, message: "تم حذف العرض بنجاح!" };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء حذف العرض." };
  }
}
