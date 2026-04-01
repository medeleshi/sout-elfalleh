# Sout El Falah - Foundation Implementation Plan

## Objective

Build a clean and reliable foundation for the project before starting marketplace features.

This phase should ensure that:

- the Next.js app is created and organized correctly
- Supabase is connected correctly
- the database and RLS are applied
- authentication works
- profile auto-creation works after sign-up
- onboarding flow works
- protected routing works
- the user can reach a basic dashboard after onboarding

---

## Foundation Success Criteria

The foundation is considered successful when the following full flow works:

1. user signs up
2. Supabase creates a row in `profiles`
3. Supabase creates a row in `profile_private_details`
4. user signs in
5. app detects session correctly
6. app checks onboarding status
7. user is redirected to `/onboarding` if onboarding is incomplete
8. user updates profile
9. onboarding is marked as completed
10. user is redirected to `/dashboard`

---

## Recommended Folder Structure

```text
src/
  app/
    (auth)/
      login/
        page.tsx
      signup/
        page.tsx
    (app)/
      onboarding/
        page.tsx
      dashboard/
        page.tsx
    layout.tsx
    page.tsx
  components/
    auth/
    onboarding/
    shared/
    ui/
  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts
    auth/
      get-current-user.ts
      require-user.ts
      require-onboarding.ts
  types/
    database.ts

docs/
  mvp-breakdown.md
  foundation-implementation-plan.md

supabase/
  migrations/
  seed.sql
```

---

## Phase 1 - Project Setup

### Goal

Create the Next.js project with the right defaults and install the required dependencies.

### Tasks

- create the project using Next.js
- enable TypeScript
- enable Tailwind CSS
- use App Router
- use `src/` directory
- configure import aliases
- install Supabase packages

### Required Packages

- `@supabase/supabase-js`
- `@supabase/ssr`

### Deliverables

- working Next.js app
- clean folder structure
- dependencies installed

---

## Phase 2 - Environment Configuration

### Goal

Connect the app to Supabase safely and consistently.

### Tasks

Create environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Notes

- never expose service role key in the client
- store environment variables in `.env.local`
- confirm connection using a small test query later

### Deliverables

- environment variables configured
- app can initialize Supabase clients

---

## Phase 3 - Database Initialization

### Goal

Apply the SQL files in the correct order and confirm the database is ready.

### Execution Order

1. `schema_v3.sql`
2. `seed.sql`
3. `rls_v2.sql`
4. `auth_setup.sql`

### Tasks

- run the schema file
- run the seed file
- run the RLS file
- run the auth setup file
- verify all tables exist
- verify RLS is enabled
- verify the trigger for new users exists

### Tables To Verify

- `governorates`
- `activity_types`
- `profiles`
- `profile_private_details`
- `listings`
- `listing_images`
- `purchase_requests`
- `conversations`
- `conversation_participants`
- `messages`

### Deliverables

- schema applied
- lookup data seeded
- RLS enabled
- auth trigger ready

---

## Phase 4 - Supabase Client Setup

### Goal

Create reusable Supabase clients for browser, server, and middleware usage.

### Files

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`

### Responsibilities

#### client.ts
Used in client components when browser-side interaction is needed.

#### server.ts
Used in server components, server actions, and route handlers.

#### middleware.ts
Used to refresh auth sessions and support protected routing.

### Deliverables

- browser client
- server client
- middleware helper

---

## Phase 5 - Middleware and Route Protection

### Goal

Protect authenticated app routes and handle redirection properly.

### Rules

- unauthenticated users cannot access `(app)` routes
- authenticated users should not access auth pages unnecessarily
- onboarding-incomplete users should be redirected to `/onboarding`
- onboarding-complete users should be redirected to `/dashboard`

### Suggested Route Behavior

#### Public
- `/`
- `/login`
- `/signup`

#### Protected
- `/onboarding`
- `/dashboard`

### Deliverables

- middleware working
- protected routing working
- redirection logic working

---

## Phase 6 - Authentication UI and Actions

### Goal

Build the minimum authentication interface and logic.

### Screens

- sign up page
- login page

### Actions

#### Sign Up
- collect email
- collect password
- optionally collect full name
- create user using Supabase Auth

#### Login
- collect email
- collect password
- sign in using Supabase Auth

#### Logout
- sign out current user
- redirect to login or home

### Important Note

The sign-up flow must rely on the database trigger to create:

- `profiles`
- `profile_private_details`

### Deliverables

- sign up page working
- login page working
- logout working
- session persists correctly

---

## Phase 7 - Auth Verification Testing

### Goal

Make sure the auth trigger and session flow are actually working.

### Test Scenario

1. create a new account
2. verify user exists in `auth.users`
3. verify matching row exists in `profiles`
4. verify matching row exists in `profile_private_details`
5. verify `is_onboarding_completed = false`

### Deliverables

- sign-up flow verified
- auto-profile creation verified

---

## Phase 8 - Current User Helpers

### Goal

Create reusable helpers to reduce duplication in protected pages.

### Suggested Helpers

- `getCurrentUser()`
- `getCurrentProfile()`
- `requireUser()`
- `requireOnboardingComplete()`

### Purpose

These helpers should make it easy to:

- fetch current authenticated user
- fetch current profile
- redirect if no session
- redirect if onboarding is not completed

### Deliverables

- reusable auth helpers
- less duplication across pages

---

## Phase 9 - Onboarding Page

### Goal

Allow a newly registered user to complete their profile.

### Required Fields

- `full_name`
- `role`
- `governorate_id`

### Optional Fields

- `region`
- `avatar_url`
- `activity_type_id`
- `bio`
- `phone`

### Onboarding Submit Behavior

When the form is submitted:

- update `profiles`
- update or insert `profile_private_details`
- set `is_onboarding_completed = true`
- redirect user to `/dashboard`

### Data Needed For Form

Load:
- governorates
- activity types

### Deliverables

- onboarding form working
- profile update working
- completion flag updated
- redirect to dashboard working

---

## Phase 10 - Basic Dashboard

### Goal

Create a minimal authenticated landing page after onboarding.

### Dashboard Should Show

- welcome message
- current user name
- current role
- current governorate
- simple navigation placeholders

### Suggested Placeholder Actions

- go to create listing
- go to browse listings
- go to create purchase request
- go to inbox

### Deliverables

- working protected dashboard
- current profile visible
- foundation ready for feature work

---

## Phase 11 - Error Handling and UX Basics

### Goal

Avoid weak foundation UX.

### Include

- loading states
- form validation
- submission disabled states
- error messages from Supabase
- empty states where needed

### Deliverables

- reliable auth UX
- reliable onboarding UX

---

## Phase 12 - Foundation QA Checklist

Use this checklist before moving to marketplace features.

### Database
- [ ] schema applied successfully
- [ ] seed applied successfully
- [ ] RLS applied successfully
- [ ] auth trigger exists
- [ ] governorates loaded
- [ ] activity types loaded

### Auth
- [ ] user can sign up
- [ ] user can sign in
- [ ] user can sign out
- [ ] session persists
- [ ] protected routes are blocked for guests

### Auto Profile Creation
- [ ] `profiles` row is auto-created
- [ ] `profile_private_details` row is auto-created

### Onboarding
- [ ] incomplete users go to onboarding
- [ ] onboarding loads lookup data
- [ ] onboarding saves profile fields
- [ ] onboarding marks completion correctly

### Dashboard
- [ ] completed users reach dashboard
- [ ] dashboard reads current profile correctly

---

## Recommended Order of Execution

1. create Next.js app
2. install dependencies
3. configure environment variables
4. apply database SQL files
5. create Supabase client/server/middleware files
6. add middleware and route protection
7. build sign-up and login pages
8. verify auto profile creation
9. build onboarding page
10. build dashboard
11. run QA checklist

---

## Important Implementation Notes

### 1. Keep foundation narrow
Do not start listings, messaging, or search before auth and onboarding are fully stable.

### 2. Keep protected logic centralized
Do not scatter auth checks randomly across pages if you can centralize them in helpers and middleware.

### 3. Keep private profile data separate
Any future sensitive fields should go into `profile_private_details` or another private table, not `profiles`.

### 4. Validate early
Do not rely only on database constraints. Add frontend validation too.

### 5. Test signup more than once
The most important foundation test is repeated sign-up and login testing with fresh accounts.

---

## Final Outcome

After this phase, the project should have:

- a stable app structure
- connected Supabase backend
- working authentication
- automatic profile creation
- onboarding flow
- protected dashboard

Only after this should feature development begin for:

- listings
- purchase requests
- messaging
- search and filters
