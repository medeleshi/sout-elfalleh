# Sout El Falah - MVP Breakdown

## Goal of MVP

Build the smallest usable version of Sout El Falah that allows agricultural users to:

1. create an account
2. complete a basic profile
3. publish a listing
4. publish a purchase request
5. browse listings and requests
6. contact other users through messaging

The MVP should validate one core assumption:

> Can we create real supply-demand interactions between agricultural users in a focused market?

---

## MVP Scope

### Included in MVP

- Authentication
- User profiles
- Listings
- Purchase requests
- Basic marketplace browsing
- Search and filters
- Messaging
- Basic account settings

### Not included in MVP

- AI recommendations
- Advanced personalized feed
- Community posts
- Ratings and reviews
- Payments
- Delivery/logistics workflows
- Advanced moderation dashboards
- Follow system
- Saved items
- Advanced notifications engine

---

## Core User Types

### 1. Farmer
Can:
- create account
- manage profile
- publish listings
- message buyers
- browse purchase requests

### 2. Buyer / Merchant
Can:
- create account
- manage profile
- publish purchase requests
- browse listings
- message sellers

---

## Main Product Modules

## 1. Authentication

### Purpose
Allow users to securely sign up, sign in, sign out, and maintain sessions.

### MVP Requirements
- Sign up with email and password
- Sign in with email and password
- Sign out
- Protected routes
- Session persistence
- Redirect authenticated users to app area

### Out of Scope
- Social login
- Phone auth
- Magic links
- Multi-factor auth

---

## 2. Profiles + Onboarding

### Purpose
Create a basic identity for each user.

### MVP Requirements
Each user should have:
- full name
- role
- governorate / region
- phone number (optional or required based on decision)
- profile image (optional)
- business/activity type (optional in MVP)
- bio/about (optional)

### Onboarding Flow
After first sign-up:
1. account is created
2. profile row is created
3. user is redirected to onboarding
4. user completes role + region + basic info
5. user enters main app

---

## 3. Listings

### Purpose
Allow sellers/farmers to publish available agricultural products or services.

### MVP Requirements
User can:
- create listing
- edit listing
- delete listing
- mark listing active/inactive
- view own listings
- browse all listings
- open listing details

### Listing Fields
- title
- description
- category
- price (optional if negotiable)
- quantity
- unit
- region
- images
- status
- created_at

---

## 4. Purchase Requests

### Purpose
Allow buyers to publish what they need.

### MVP Requirements
User can:
- create request
- edit request
- delete request
- mark request active/inactive
- browse requests
- view request details
- manage own requests

### Request Fields
- title
- description
- category
- requested quantity
- unit
- desired region
- budget (optional)
- status
- created_at

---

## 5. Marketplace Browsing

### Purpose
Allow users to discover active supply and demand.

### MVP Requirements
- browse active listings
- browse active purchase requests
- open details page
- view publisher basic profile info

### MVP Display Logic
Show:
- newest first
- only active items
- optional region filtering
- optional category filtering

---

## 6. Search and Filters

### Purpose
Help users find relevant listings and requests.

### MVP Requirements
- keyword search
- filter by category
- filter by region
- sort by newest
- possibly filter by role-relevant content later

### Out of Scope
- recommendation engine
- personalized ranking
- semantic search

---

## 7. Messaging

### Purpose
Allow users to contact each other about a listing or request.

### MVP Requirements
- start conversation from listing or request
- send messages
- receive messages
- view conversation list
- unread indicator
- basic realtime updates if possible

### Out of Scope
- voice messages
- file attachments in first version
- message reactions
- delivery/read receipts beyond simple unread logic

---

## 8. Basic Settings

### Purpose
Allow user to update account information.

### MVP Requirements
- edit profile
- update avatar
- logout

---

## Recommended Build Order

### Phase 1 - Project Foundation
- Next.js setup
- Supabase setup
- environment variables
- app folder structure
- UI base components

### Phase 2 - Authentication
- sign up
- sign in
- protected routes
- session handling

### Phase 3 - Profiles
- create profile row after sign-up
- onboarding page
- edit profile page

### Phase 4 - Listings
- create listing
- listing details
- my listings
- edit/delete listing

### Phase 5 - Purchase Requests
- create request
- request details
- my requests
- edit/delete request

### Phase 6 - Marketplace
- listings page
- requests page
- search + filters

### Phase 7 - Messaging
- conversation model
- inbox page
- chat page
- basic realtime

### Phase 8 - Cleanup and MVP polish
- validation
- empty states
- loading states
- error handling
- basic moderation hooks

---

## Success Criteria for MVP

The MVP is successful if users can:

1. sign up and complete profile
2. publish listings or purchase requests
3. discover other users' supply/demand
4. start conversations
5. complete real marketplace interactions manually

---

## MVP Technical Principles

- keep schema simple
- avoid premature abstraction
- avoid advanced feed logic
- optimize for speed of launch
- build only what is necessary to validate marketplace activity