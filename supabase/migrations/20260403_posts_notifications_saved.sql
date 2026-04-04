-- Sout El Falah - Schema Extension v2
-- Adds: posts, notifications, saved_items

begin;

-- =========================================================
-- Enums (extend)
-- =========================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'post_type') then
    create type public.post_type as enum ('question', 'discussion', 'tip');
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type public.notification_type as enum ('message', 'match', 'reply', 'interest', 'account', 'system', 'reminder', 'recommendation');
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_priority') then
    create type public.notification_priority as enum ('high', 'medium', 'low');
  end if;

  if not exists (select 1 from pg_type where typname = 'saved_item_type') then
    create type public.saved_item_type as enum ('listing', 'purchase_request', 'post');
  end if;
end
$$;

-- =========================================================
-- Posts (Community Feed: questions, discussions, tips)
-- =========================================================

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type public.post_type not null default 'discussion',
  title text not null,
  content text,
  category text,
  images text[] not null default '{}',
  governorate_id uuid references public.governorates(id),
  region text,
  status public.item_status not null default 'active',
  views_count integer not null default 0,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_title_not_blank check (char_length(trim(title)) > 0)
);

create index if not exists idx_posts_author_id on public.posts(author_id);
create index if not exists idx_posts_category on public.posts(category);
create index if not exists idx_posts_governorate_id on public.posts(governorate_id);
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_created_at on public.posts(created_at desc);

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

-- =========================================================
-- Post Comments
-- =========================================================

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  likes_count integer not null default 0,
  created_at timestamptz not null default now(),
  constraint post_comments_content_not_blank check (char_length(trim(content)) > 0)
);

create index if not exists idx_post_comments_post_id on public.post_comments(post_id);
create index if not exists idx_post_comments_author_id on public.post_comments(author_id);
create index if not exists idx_post_comments_created_at on public.post_comments(created_at asc);

-- Helper: increment comments_count on post
create or replace function public.increment_post_comment_count()
returns trigger language plpgsql as $$
begin
  update public.posts set comments_count = comments_count + 1 where id = new.post_id;
  return new;
end;
$$;

drop trigger if exists trg_post_comments_count on public.post_comments;
create trigger trg_post_comments_count
after insert on public.post_comments
for each row execute function public.increment_post_comment_count();

-- =========================================================
-- Notifications
-- =========================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null default 'system',
  priority public.notification_priority not null default 'medium',
  title text not null,
  message text,
  is_read boolean not null default false,
  context_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_is_read on public.notifications(is_read);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);

-- =========================================================
-- Saved Items (Bookmarks/Favorites)
-- =========================================================

create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_type public.saved_item_type not null,
  item_id uuid not null,
  created_at timestamptz not null default now(),
  constraint saved_items_unique_per_user unique (user_id, item_type, item_id)
);

create index if not exists idx_saved_items_user_id on public.saved_items(user_id);
create index if not exists idx_saved_items_item_type on public.saved_items(item_type);

commit;
