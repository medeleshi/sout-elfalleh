# Project Tasks

| Task Name | Status | Files Created/Modified | Important Notes / Decisions | Next Step |
|-----------|--------|------------------------|-----------------------------|-----------|
| Initialize Foundation Structure | [x] Done | `src/*`, `middleware.ts` -> `proxy.ts`, `tsconfig.json` | Refactored to `proxy.ts` (Next.js 16.2.1). | Implement Auth UI |
| Supabase Integration | [x] Done | `src/lib/supabase/*` | Used `@supabase/ssr` with App Router cookie handling. | Implement Auth Logic |
| Auth Helpers | [x] Done | `src/lib/auth/*` | Implemented `getCurrentProfile`, `requireUser`, and `requireOnboarding`. | Implement Auth UI & Actions |
| Auth Guards | [x] Done | `src/lib/auth/require-user.ts`, `src/lib/auth/require-onboarding.ts` | Centralized redirection logic for protected routes. | Build Auth UI (Login/Signup) |

| Landing Page UI | [x] Done | `src/app/page.tsx`, `src/components/landing/*`, `src/app/globals.css`, `src/app/layout.tsx` | Implemented premium Arabic RTL landing page using Stitch design system. | Build Login/Signup UI |
| Landing Page Overhaul | [x] Done | `src/components/landing/*`, `src/app/globals.css`, `src/app/page.tsx` | Full quality pass: improved copy, visuals, stats, and conversion elements. | Navigation Audit |
| Navigation & Responsiveness Audit | [x] Done | `src/components/landing/Navbar.tsx`, `src/components/landing/Footer.tsx`, `src/app/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` | Fixed broken anchor links, created essential placeholder pages, and implemented a mobile-responsive Navbar. | Navbar Auth Upgrade |
| Navbar Auth Upgrade | [x] Done | `src/components/landing/Navbar.tsx` | Added distinct Login and Sign Up buttons on desktop and mobile. Enhanced responsive spacing and taps. | Visual Upgrade |
| Visual Upgrade | [x] Done | `src/components/landing/Hero.tsx`, `src/components/landing/UserTypes.tsx` | Replaced generic placeholders with realistic, Tunisian-themed agricultural imagery (farmers, produce, markets). | Premium Auth UI |
| Premium Auth UI | [x] Done | `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx` | Overhauled Login and Signup pages with premium split-screen layouts, marketing visuals, and streamlined forms. | Auth Stabilization & Design Refinement |
| Auth Stabilization & Design Refinement | [x] Done | `src/app/(auth)/*`, `src/lib/auth/*`, `src/components/ui/*`, `src/app/globals.css` | Functional Google OAuth, polished Forgot Password UX, and refined earthy state colors. | Implement Onboarding Flow |
| Implement Onboarding Flow | [x] Done | `src/app/onboarding/*`, `src/lib/auth/actions.ts`, `src/types/database.ts` | Multi-step flow with profile image support and lookup data integration. | Verify Avatar Upload |
| Avatar Upload & RLS Fix | [x] Done | `AvatarUpload.tsx`, `OnboardingForm.tsx`, `docs/fix_avatar_rls.sql` | Fixed RLS error by using user-specific folders and providing Storage policies. | Marketplace Core |
| Onboarding Design Refinement (M3) | [x] Done | `OnboardingForm.tsx`, `AvatarUpload.tsx`, `page.tsx`, `globals.css` | Applied Material 3 principles: refined hierarchy, typography, spacing, and button flow while preserving RTL identity. | Standardize Lookups |
| Standardize Arabic Lookups | [x] Done | `OnboardingForm.tsx` | Ensured `name_ar` is used for all lookup data (Governorates, Activity Types) in the UI. No English/mixed labels found in code. | Onboarding Finalization |
| Onboarding Comprehensive Finalization | [x] Done | `OnboardingForm.tsx`, `AvatarUpload.tsx`, `lib/auth/actions.ts` | **Enforced `name_ar` only** for Role, Activity Type & Governorate. **Added 6-step flow** with step-by-step validation. **Added Review Step (Step 5)** with "Edit" shortcuts. **Fixed redirect** to Home Page `/`. **Confirmed Supabase persistence**: `is_onboarding_completed = true`. | Icon System Refinement |
| Onboarding Icon System Refinement | [x] Done | `OnboardingForm.tsx` | Added step icon progress stepper, icon badges on step headings, unique activity icons, RTL chevron fix. Used material-symbols text spans (broken). | Lucide Icon Fix |
| Onboarding Icons — Lucide React | [x] Done | `OnboardingForm.tsx`, `AvatarUpload.tsx`, `package.json` | **Installed `lucide-react`**. Replaced ALL `material-symbols-outlined` text spans with proper SVG icon components. Full visual consistency achieved. | Activity Section Redesign |
| Activity Selection Redesign | [x] Done | `OnboardingForm.tsx` | **Replaced 2-col card grid with premium vertical radio-list**. Each row: unique icon badge + Arabic name (bold) + description (`line-clamp-2`) + radio indicator (dot). Added **selection counter badge** ("تم الاختيار") + **available count**. **Helper tip** dismisses on selection. `name_ar` only displayed, Supabase integration preserved. | Fix Onboarding Save Error |
| Fix Onboarding Save Error | [x] Done | `lib/auth/actions.ts`, `supabase/migrations/20240331000000_add_auth_trigger.sql` | **Fixed FK violation error** by adding a database trigger to create `profiles` on signup and using `.upsert()` in the server action. | Home Page Header |
| Build Main Personalized Feed | [x] Done | `src/lib/data/get-feed-items.ts`, `src/components/dashboard/*` | **Implemented core content feed** combining real listings and purchase requests from Supabase with full type safety. | Side Widgets |
| Build Right-side Support Area | [x] Done | `src/components/dashboard/*`, `src/app/(app)/dashboard/page.tsx` | **Implemented layout shift** (Sidebar on the Right) and added `PracticalAdvice` widget alongside stats, weather, and traders. | Side Widgets |
| Build Right-side Support Area | [x] Done | `src/components/dashboard/*`, `src/app/(app)/dashboard/page.tsx` | **Implemented layout shift** (Sidebar on the Right) and added `PracticalAdvice` widget alongside stats, weather, and traders. | Side Widgets |
| Build Suggested People Section | [x] Done | `src/components/dashboard/SuggestedPeople.tsx`, `src/app/(app)/dashboard/page.tsx` | **Implemented intelligent discovery section** prioritizing opposite roles and geographic proximity. | Reminders |
| Build Personalized Reminders | [x] Done | `src/components/dashboard/DashboardReminders.tsx`, `src/components/dashboard/ReminderCard.tsx`, `src/app/(app)/dashboard/page.tsx` | **Implemented actionable working surface** using real data signals (profile gaps, drafts) to guide user progress. | Polish & Cleanup |
| Build Welcome Header & CTA | [x] Done | `src/components/dashboard/WelcomeHeader.tsx`, `src/app/(app)/dashboard/page.tsx` | **Personalized greeting and role-aware CTA**. Connected real name, role, and governorate data. Added new routes. | Feed Filters |
| Build Feed Filters Section | [x] Done | `src/components/dashboard/FeedFilters.tsx`, `src/app/(app)/dashboard/page.tsx` | **Implemented premium chip-based UI** with horizontal scroll, active state indicators, and RTL support. Prepared for MVP content types. | Main Personalized Feed |

### Notes:
- `updateSession` in middleware now correctly syncs cookies between request and response.
- `getCurrentUser` is implemented as a centralized server-side helper.
- `signInWithGoogle` (client-side) implemented in `src/lib/auth/client-utils.ts`.
- **Forgot Password**: Improved UX clarity with professional Arabic copy and a full reset-to-login cycle.
- **Visual Identity**: Replaced generic state colors with an earthy palette (Success Green, Terracotta Red, Ochre Amber, Slate Blue).
- **Onboarding**: Upgraded to a 6-step flow (Info → Location → Activity → Profile → Review → Success).
- **Avatar Upload Fix**:
  - **Root Cause**: Missing Storage RLS policies and generic upload path.
  - **App-side Fix**: Restructured path to `avatars/{user_id}/{filename}` and passed `userId` prop to uploader.
  - **Supabase Fix**: Provided `docs/fix_avatar_rls.sql` to create bucket and set secure RLS rules.
- **Onboarding Data Save**: `saveOnboardingAction` in `actions.ts` writes to both `profiles` (full profile + `is_onboarding_completed: true`) and `profile_private_details` (phone).
- **Onboarding Save Error Fix**:
  - **Root Cause**: Application was calling `.update()` on a `profiles` row that didn't exist yet (missing trigger), causing FK violation when saving `profile_private_details`.
  - **Fix 1 (DB)**: Added `on_auth_user_created` trigger in `supabase/migrations` to auto-create `profiles`.
  - **Fix 2 (App)**: Changed `.update()` to `.upsert()` for `profiles` in `saveOnboardingAction` as a defensive measure.
- **Home Page Header**:
  - **Design**: Premium RTL-first header with Leaf logo, "glass" blur background, and responsive search.
  - **Integration**: Connected to `getCurrentProfile()` for live name, avatar, and role (Arabic labels).
  - **Shell**: Updated `AppShell` and created `(app)/layout.tsx` for global persistence in authenticated routes.
- **Welcome Header & Dynamic CTA**:
  - **Personalization**: Grabs first name and governorate name (via SQL join) for a tailored greeting.
  - **Role-Awareness**: Farmers/Merchants get an "Add Listing" CTA (Green), while Buyers get a "Create Request" CTA (Amber).
  - **Security**: Server-side data fetching ensures privacy and auth correctness.
- **Next Recommended Step**: Build the Marketplace Core starting with the posting creation flow.
