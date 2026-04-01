'use server';

import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants/routes';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function signUpAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.AUTH_CALLBACK}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'تحقق من بريدك الإلكتروني لتفعيل الحساب.' };
}

export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(ROUTES.DASHBOARD);
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(ROUTES.LOGIN);
}

export type OnboardingState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function saveOnboardingAction(
  prevState: OnboardingState | null,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "يرجى تسجيل الدخول للمتابعة." };
  }

  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as 'farmer' | 'buyer' | 'merchant';
  const phone = formData.get("phone") as string;
  const governorateId = formData.get("governorateId") as string;
  const region = formData.get("region") as string;
  const activityTypeId = formData.get("activityTypeId") as string;
  const bio = formData.get("bio") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  if (!fullName || !role || !governorateId) {
    return { error: "يرجى ملء جميع الحقول الإلزامية (الاسم، نوع الحساب، الولاية)." };
  }

  try {
    // 1. Update/Ensure Profiles exists
    const { error: profileError } = await (supabase.from("profiles") as any)
      .upsert({
        id: user.id, // Important for upsert
        full_name: fullName,
        role,
        governorate_id: governorateId,
        region,
        avatar_url: avatarUrl,
        activity_type_id: activityTypeId || null,
        bio,
        is_onboarding_completed: true,
      });

    if (profileError) throw profileError;

    // 2. Update/Insert Private Details
    const { error: privateError } = await (supabase.from("profile_private_details") as any)
      .upsert({
        user_id: user.id,
        phone: phone || null,
      });

    if (privateError) throw privateError;

    revalidatePath("/", "layout");
    return { success: true, message: "اكتمل التسجيل بنجاح!" };
  } catch (err: any) {
    return { error: err.message || "حدث خطأ أثناء حفظ البيانات." };
  }
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.AUTH_CALLBACK}?next=${ROUTES.UPDATE_PASSWORD}`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'تم إرسال رابط استعادة كلمة السر إلى بريدك.' };
}

export async function updatePasswordAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean; message?: string }> {
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(ROUTES.DASHBOARD);
}
