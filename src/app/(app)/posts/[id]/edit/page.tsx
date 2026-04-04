import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/actions';
import { redirect, notFound } from 'next/navigation';
import { EditPostForm } from '@/components/posts/EditPostForm';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Post
  const { data: post, error: postError } = await (supabase
    .from('posts') as any)
    .select('*')
    .eq('id', id)
    .single();

  if (postError || !post) {
    console.error('Error fetching post:', postError);
    notFound();
  }

  // Security Check: Only author can edit
  if (post.author_id !== user.id) {
    redirect('/activity');
  }

  // Fetch Governorates
  const { data: governorates } = await (supabase
    .from('governorates') as any)
    .select('id, name_ar');

  return (
    <div className="w-full pb-32 pt-6 px-4 lg:px-8" dir="rtl">
      <EditPostForm 
        post={post} 
        governorates={governorates || []} 
      />
    </div>
  );
}
