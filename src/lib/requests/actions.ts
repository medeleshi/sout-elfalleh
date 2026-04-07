'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';

export type RequestState = {
  success?: boolean;
  error?: string;
  message?: string;
  id?: string;
};

export async function createRequestAction(
  formData: FormData
): Promise<RequestState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  const title = formData.get("title") as string;
  const categoryId = formData.get("category_id") as string;
  const quantity = formData.get("quantity") as string;
  const unitId = formData.get("unit_id") as string;
  const budget = formData.get("budget") as string;
  const description = formData.get("description") as string;
  const governorateId = formData.get("governorate_id") as string;
  const urgency = formData.get("urgency") as string;
  
  if (!title || !categoryId || !quantity || !unitId || !governorateId) {
    return { error: "يرجى ملء جميع الحقول الإلزامية." };
  }

  try {
    const { data, error } = await (supabase.from("purchase_requests") as any)
      .insert({
        user_id: user.id,
        title,
        category_id: categoryId,
        quantity: quantity ? parseFloat(quantity) : 0,
        unit_id: unitId,
        budget: budget ? parseFloat(budget) : null,
        description,
        governorate_id: governorateId,
        urgency,
        status: 'active',
      })
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath("/marketplace");
    revalidatePath("/activity");
    revalidatePath("/profile");
    
    return { success: true, message: "تمت إضافة طلب الشراء بنجاح!", id: data.id };
  } catch (err: any) {
    console.error('[CREATE_REQUEST_ERROR]', err);
    return { error: err.message || "حدث خطأ أثناء إضافة طلب الشراء." };
  }
}

export async function updateRequestAction(
  requestId: string,
  formData: FormData
): Promise<RequestState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  const title = formData.get("title") as string;
  const categoryId = formData.get("category_id") as string;
  const quantity = formData.get("quantity") as string;
  const unitId = formData.get("unit_id") as string;
  const budget = formData.get("budget") as string;
  const description = formData.get("description") as string;
  const governorateId = formData.get("governorate_id") as string;
  const urgency = formData.get("urgency") as string;
  
  if (!title || !categoryId) {
    return { error: "يرجى ملء جميع الحقول الإلزامية." };
  }

  try {
    const { error } = await (supabase.from("purchase_requests") as any)
      .update({
        title,
        category_id: categoryId,
        quantity: quantity ? parseFloat(quantity) : 0,
        unit_id: unitId,
        budget: budget ? parseFloat(budget) : null,
        description,
        governorate_id: governorateId,
        urgency,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/activity");
    revalidatePath("/profile");
    revalidatePath(`/marketplace/requests/${requestId}`);
    return { success: true, message: "تم تحديث طلب الشراء بنجاح!" };
  } catch (err: any) {
    console.error('[UPDATE_REQUEST_ERROR]', err);
    return { error: err.message || "حدث خطأ أثناء تحديث طلب الشراء." };
  }
}

export async function updateRequestStatusAction(
  requestId: string,
  status: 'active' | 'fulfilled' | 'hidden'
): Promise<RequestState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  try {
    const { error } = await (supabase.from("purchase_requests") as any)
      .update({ status: status as any, updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/activity");
    revalidatePath("/profile");
    revalidatePath(`/marketplace/requests/${requestId}`);
    return { success: true, message: "تم تحديث حالة طلب الشراء بنجاح!" };
  } catch (err: any) {
    console.error('[UPDATE_STATUS_ERROR]', err);
    return { error: err.message || "حدث خطأ أثناء تحديث الحالة." };
  }
}

export async function deleteRequestAction(requestId: string): Promise<RequestState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  try {
    const { error } = await (supabase.from("purchase_requests") as any)
      .delete()
      .eq("id", requestId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/activity");
    revalidatePath("/profile");
    return { success: true, message: "تم حذف طلب الشراء بنجاح!" };
  } catch (err: any) {
    console.error('[DELETE_REQUEST_ERROR]', err);
    return { error: err.message || "حدث خطأ أثناء حذف طلب الشراء." };
  }
}
