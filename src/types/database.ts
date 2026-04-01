export type UserRole = 'farmer' | 'buyer' | 'merchant';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole | null;
          governorate_id: string | null;
          region: string | null;
          avatar_url: string | null;
          activity_type_id: string | null;
          bio: string | null;
          is_onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole | null;
          governorate_id?: string | null;
          region?: string | null;
          avatar_url?: string | null;
          activity_type_id?: string | null;
          bio?: string | null;
          is_onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: UserRole | null;
          governorate_id?: string | null;
          region?: string | null;
          avatar_url?: string | null;
          activity_type_id?: string | null;
          bio?: string | null;
          is_onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      governorates: {
        Row: {
          id: string;
          code: string;
          name_en: string;
          name_ar: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name_en: string;
          name_ar?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name_en?: string;
          name_ar?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      activity_types: {
        Row: {
          id: string;
          slug: string;
          name_en: string;
          name_ar: string | null;
          description: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_en: string;
          name_ar?: string | null;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_en?: string;
          name_ar?: string | null;
          description?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      profile_private_details: {
        Row: {
          user_id: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          price: number | null;
          is_price_negotiable: boolean;
          quantity: number | null;
          unit: string | null;
          governorate_id: string;
          region: string | null;
          status: 'draft' | 'active' | 'inactive' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          price?: number | null;
          is_price_negotiable?: boolean;
          quantity?: number | null;
          unit?: string | null;
          governorate_id: string;
          region?: string | null;
          status?: 'draft' | 'active' | 'inactive' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          price?: number | null;
          is_price_negotiable?: boolean;
          quantity?: number | null;
          unit?: string | null;
          governorate_id?: string;
          region?: string | null;
          status?: 'draft' | 'active' | 'inactive' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      listing_images: {
        Row: {
          id: string;
          listing_id: string;
          storage_path: string;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          storage_path: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          storage_path?: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
      purchase_requests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          requested_quantity: number | null;
          unit: string | null;
          budget: number | null;
          desired_governorate_id: string;
          desired_region: string | null;
          status: 'draft' | 'active' | 'inactive' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          requested_quantity?: number | null;
          unit?: string | null;
          budget?: number | null;
          desired_governorate_id: string;
          desired_region?: string | null;
          status?: 'draft' | 'active' | 'inactive' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          requested_quantity?: number | null;
          unit?: string | null;
          budget?: number | null;
          desired_governorate_id?: string;
          desired_region?: string | null;
          status?: 'draft' | 'active' | 'inactive' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
