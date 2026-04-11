'use server';

import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/constants/routes';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth/get-current-user';

// Re-export so existing imports from '@/lib/auth/actions' keep working.
export { getCurrentUser };

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUpAction(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' };
  }

  if (password.length < 8) {
    return { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' };
  }

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

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signInAction(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Translate common Supabase errors to Arabic.
    if (error.message === 'Invalid login credentials') {
      return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' };
    }
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return { error: 'لم يتم تأكيد البريد الإلكتروني بعد. يرجى التحقق من صندوق بريدك.' };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(ROUTES.HOME);
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect(ROUTES.LOGIN);
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

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
    return { error: 'يرجى تسجيل الدخول للمتابعة.' };
  }

  const fullName    = (formData.get('fullName') as string)?.trim();
  const role        = formData.get('role') as 'farmer' | 'buyer' | 'merchant';
  const phone       = (formData.get('phone') as string)?.trim() || null;
  const governorateId  = formData.get('governorateId') as string;
  const region      = (formData.get('region') as string)?.trim() || null;
  const activityTypeId = formData.get('activityTypeId') as string || null;
  const bio         = (formData.get('bio') as string)?.trim() || null;
  const avatarUrl   = (formData.get('avatarUrl') as string)?.trim() || null;

  if (!fullName || fullName.length < 2) {
    return { error: 'يرجى إدخال الاسم الكامل (حرفان على الأقل).' };
  }
  if (!role || !['farmer', 'buyer', 'merchant'].includes(role)) {
    return { error: 'يرجى اختيار نوع الحساب.' };
  }
  if (!governorateId) {
    return { error: 'يرجى اختيار الولاية.' };
  }

  try {
    // upsert with explicit onConflict to avoid duplicating rows.
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name: fullName,
          role,
          governorate_id: governorateId,
          region,
          avatar_url: avatarUrl,
          activity_type_id: activityTypeId,
          bio,
          is_onboarding_completed: true,
        },
        { onConflict: 'id' }
      );

    if (profileError) throw profileError;

    const { error: privateError } = await supabase
      .from('profile_private_details')
      .upsert(
        { user_id: user.id, phone },
        { onConflict: 'user_id' }
      );

    if (privateError) throw privateError;

    revalidatePath('/', 'layout');
    return { success: true, message: 'اكتمل التسجيل بنجاح!' };
  } catch (err: any) {
    console.error('[ONBOARDING_ERROR]', err);
    return { error: err.message || 'حدث خطأ أثناء حفظ البيانات.' };
  }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const email = (formData.get('email') as string)?.trim();

  if (!email) {
    return { error: 'يرجى إدخال البريد الإلكتروني.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.AUTH_CALLBACK}?next=${ROUTES.UPDATE_PASSWORD}`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'تم إرسال رابط استعادة كلمة السر إلى بريدك.' };
}

// ─── Update Password ──────────────────────────────────────────────────────────

export async function updatePasswordAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean; message?: string }> {
  const password = formData.get('password') as string;

  if (!password || password.length < 8) {
    return { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(ROUTES.HOME);
}

// ─── Update Profile ───────────────────────────────────────────────────────────

export async function updateProfileAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean; message?: string }> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: 'يرجى تسجيل الدخول للمتابعة.' };
  }

  const fullName       = (formData.get('fullName') as string)?.trim();
  const role           = formData.get('role') as string;
  const bio            = (formData.get('bio') as string)?.trim() || null;
  const governorateId  = formData.get('governorateId') as string || null;
  const activityTypeId = formData.get('activityTypeId') as string || null;
  const avatarUrl      = (formData.get('avatarUrl') as string)?.trim() || null;
  const phone          = (formData.get('phone') as string)?.trim() || null;

  if (!fullName || fullName.length < 2) {
    return { error: 'الاسم الكامل مطلوب (حرفان على الأقل).' };
  }

  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name: fullName,
          role: role || undefined,
          bio,
          governorate_id: governorateId,
          activity_type_id: activityTypeId,
          avatar_url: avatarUrl,
        },
        { onConflict: 'id' }
      );

    if (profileError) throw profileError;

    const { error: privateError } = await supabase
      .from('profile_private_details')
      .upsert(
        { user_id: user.id, phone },
        { onConflict: 'user_id' }
      );

    if (privateError) throw privateError;

    revalidatePath('/', 'layout');
    return { success: true, message: 'تم تحديث الملف الشخصي بنجاح!' };
  } catch (err: any) {
    console.error('[UPDATE_PROFILE_ERROR]', err);
    return { error: err.message || 'حدث خطأ أثناء تحديث البيانات.' };
  }
}
