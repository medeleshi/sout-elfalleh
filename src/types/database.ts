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
          avatar_url: string | null
          role: string | null
          bio: string | null
          governorate_id: string | null
          governorate_name_ar: string | null
          activity_type_id: string | null
          is_onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          bio?: string | null
          governorate_id?: string | null
          governorate_name_ar?: string | null
          activity_type_id?: string | null
          is_onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          bio?: string | null
          governorate_id?: string | null
          governorate_name_ar?: string | null
          activity_type_id?: string | null
          is_onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      governorates: {
        Row: {
          id: string
          name_ar: string
        }
      }
      activity_types: {
        Row: {
          id: string
          name_ar: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: string
          category_id: string | null
          price: number | null
          created_at: string
        }
      }
      purchase_requests: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          status: string
          category_id: string | null
          budget: number | null
          created_at: string
        }
      }
      posts: {
         Row: {
           id: string
           author_id: string
           title: string
           content: string
           type: string
           created_at: string
         }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type UserRole = 'farmer' | 'merchant' | 'buyer' | 'guest';
