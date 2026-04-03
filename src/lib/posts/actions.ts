'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/actions';

export type PostState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function updatePostAction(
  postId: string,
  formData: FormData
): Promise<PostState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as 'question' | 'discussion';
  const categoryId = formData.get("categoryId") as string;
  const governorateId = formData.get("governorateId") as string;
  // images handling can be added here if needed

  if (!title || !content || !type) {
    return { error: "يرجى ملء جميع الحقول الإلزامية." };
  }

  try {
    const { error } = await (supabase.from("posts") as any)
      .update({
        title,
        content,
        type,
        // category_id and governorate_id can be added to DB schema if they exist
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("author_id", user.id);

    if (error) throw error;

    revalidatePath("/activity");
    revalidatePath(`/posts/${postId}`);
    return { success: true, message: "تم تحديث المنشور بنجاح!" };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء تحديث المنشور." };
  }
}

export async function deletePostAction(postId: string): Promise<PostState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  try {
    const { error } = await (supabase.from("posts") as any)
      .delete()
      .eq("id", postId)
      .eq("author_id", user.id);

    if (error) throw error;

    revalidatePath("/activity");
    return { success: true, message: "تم حذف المنشور بنجاح!" };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء حذف المنشور." };
  }
}
