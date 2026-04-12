'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';
import { validateUpload } from '@/lib/uploads/validate-files';

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
  const category_id = formData.get("category_id") as string;
  const quantityRaw = formData.get("quantity") as string;
  const unit_id = formData.get("unit_id") as string;
  const priceRaw = formData.get("price") as string;
  const description = formData.get("description") as string;
  const governorate_id = formData.get("governorate_id") as string;
  
  // Strict Validation for Rebuilt Schema Required Fields
  if (!title?.trim()) return { error: "يرجى إدخال عنوان الإعلان." };
  if (!category_id) return { error: "يرجى اختيار تصنيف المنتج." };
  if (!unit_id) return { error: "يرجى اختيار وحدة القياس." };
  if (!governorate_id) return { error: "يرجى اختيار الولاية." };
  
  const quantity = parseFloat(quantityRaw);
  if (isNaN(quantity) || quantity < 0) {
    return { error: "يرجى إدخال كمية صحيحة (0 أو أكثر)." };
  }

  const price = priceRaw ? parseFloat(priceRaw) : null;
  if (price !== null && (isNaN(price) || price < 0)) {
    return { error: "يرجى إدخال سعر صحيح." };
  }

  // Multi-Image Validation
  const rawImageFiles = formData.getAll("images") as File[];
  const imageValidation = validateUpload(rawImageFiles, "listing");
  if (!imageValidation.valid) {
    return { error: imageValidation.error };
  }
  const validFiles = imageValidation.files;

  try {
    // Insert Listing Row using Rebuilt Schema Fields
    const { data, error } = await (supabase.from("listings") as any)
      .insert({
        user_id: user.id,
        title: title.trim(),
        category_id,
        quantity,
        unit_id,
        price,
        description,
        governorate_id,
        status: 'active', // 'active' is a valid value for public.item_status enum
      })
      .select('id')
      .single();

    if (error) {
      console.error('[CREATE_LISTING] Database error:', error);
      throw new Error(`فشل في حفظ البيانات: ${error.message}`);
    }

    try {
      // Execute Storage Uploads using Validated Array
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
    } catch (uploadOrInsertError: any) {
      // ROLLBACK the listing creation to prevent orphaned item duplication
      await (supabase.from('listings') as any).delete().eq('id', data.id);
      throw uploadOrInsertError;
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
  const category_id = formData.get("category_id") as string;
  const quantityRaw = formData.get("quantity") as string;
  const unit_id = formData.get("unit_id") as string;
  const priceRaw = formData.get("price") as string;
  const description = formData.get("description") as string;
  const governorate_id = formData.get("governorate_id") as string;
  
  // Strict Validation for Rebuilt Schema Required Fields
  if (!title?.trim()) return { error: "الاسم الكامل للمنتج مطلوب." };
  if (!category_id) return { error: "يرجى اختيار تصنيف المنتج." };
  if (!unit_id) return { error: "يرجى اختيار وحدة القياس." };
  if (!governorate_id) return { error: "يرجى اختيار الولاية." };
  
  const quantity = parseFloat(quantityRaw);
  if (isNaN(quantity) || quantity < 0) {
    return { error: "يرجى إدخال كمية صحيحة (0 أو أكثر)." };
  }

  const price = priceRaw ? parseFloat(priceRaw) : null;
  if (price !== null && (isNaN(price) || price < 0)) {
    return { error: "يرجى إدخال سعر صحيح." };
  }

  // Multi-Image Validation for update
  const rawImageFiles = formData.getAll("images") as File[];
  const imageValidation = validateUpload(rawImageFiles, "listing");
  if (!imageValidation.valid) {
    return { error: imageValidation.error };
  }
  const validFiles = imageValidation.files;

  try {
    const retainedRaw = formData.get("retained_images");
    const retained_images: string[] = JSON.parse((retainedRaw as string) || "[]");

    // Fetch current image paths before mutating anything
    const { data: currentImages } = await (supabase.from('listing_images') as any)
      .select('storage_path')
      .eq('listing_id', listingId);
    const currentPaths: string[] = (currentImages || []).map((img: any) => img.storage_path);

    // Identify paths removed by the user (in DB but not in retained)
    const removedPaths = currentPaths.filter(p => !retained_images.includes(p));

    const { error } = await (supabase.from("listings") as any)
      .update({
        title: title.trim(),
        category_id,
        quantity,
        unit_id,
        price,
        description,
        governorate_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .eq("user_id", user.id);

    if (error) {
      console.error('[UPDATE_LISTING] Database error:', error);
      throw new Error(`فشل في تحديث البيانات: ${error.message}`);
    }

    // Upload new files then rebuild the listing_images table
    const newUploadedPaths: string[] = [];

    try {
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

      // Wipe old DB rows and reinsert the full final set
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

      // Only delete removed files from storage AFTER DB is committed successfully
      if (removedPaths.length > 0) {
        const { error: storageDeleteError } = await supabase.storage
          .from('listings')
          .remove(removedPaths);
        if (storageDeleteError) {
          // Non-fatal: log but do not fail the whole update
          console.warn('[UPDATE_LISTING] Storage cleanup partial failure:', storageDeleteError);
        }
      }

    } catch (uploadOrInsertError: any) {
      // ROLLBACK: restore listing_images to the pre-update snapshot
      await (supabase.from('listing_images') as any).delete().eq('listing_id', listingId);
      if (currentPaths.length > 0) {
        const restoredImages = currentPaths.map((path, index) => ({
          listing_id: listingId,
          storage_path: path,
          is_primary: index === 0,
          sort_order: index
        }));
        await (supabase.from('listing_images') as any).insert(restoredImages);
      }
      throw uploadOrInsertError;
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
