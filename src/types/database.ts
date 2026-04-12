export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'farmer' | 'merchant' | 'buyer'
          avatar_url: string | null
          bio: string | null
          governorate_id: string | null
          region: string | null
          activity_type_id: string | null
          is_onboarding_completed: boolean
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'farmer' | 'merchant' | 'buyer'
          avatar_url?: string | null
          bio?: string | null
          governorate_id?: string | null
          region?: string | null
          activity_type_id?: string | null
          is_onboarding_completed?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'farmer' | 'merchant' | 'buyer'
          avatar_url?: string | null
          bio?: string | null
          governorate_id?: string | null
          region?: string | null
          activity_type_id?: string | null
          is_onboarding_completed?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      governorates: {
        Row: {
          id: string
          code: string
          name_en: string
          name_ar: string
          is_active: boolean
          sort_order: number
        }
      }
      activity_types: {
        Row: {
          id: string
          slug: string
          name_en: string
          name_ar: string
          is_active: boolean
          sort_order: number
        }
      }
      categories: {
        Row: {
           id: string
           slug: string
           name_en: string
           name_ar: string
           is_active: boolean
           sort_order: number
        }
      }
      units: {
        Row: {
           id: string
           name_en: string
           name_ar: string
           is_active: boolean
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category_id: string
          quantity: number
          unit_id: string
          price: number | null
          governorate_id: string
          status: 'active' | 'inactive' | 'archived' | 'sold' | 'hidden' | 'draft'
          is_verified: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
      }
      purchase_requests: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          category_id: string
          quantity: number
          unit_id: string
          budget: number | null
          governorate_id: string
          status: 'active' | 'inactive' | 'archived' | 'sold' | 'hidden' | 'draft' | 'fulfilled'
          urgency: string | null
          created_at: string
          updated_at: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          type: 'question' | 'discussion'
          category_id: string | null
          status: 'active' | 'inactive' | 'archived' | 'hidden' | 'draft'
          view_count: number
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type UserRole = 'farmer' | 'merchant' | 'buyer';
