export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string
          id: string
          image_path: string
          is_pinned: boolean
          published: boolean
          sort_order: number | null
          title: string
          updated_at: string
          written_date: string | null
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          image_path: string
          is_pinned?: boolean
          published?: boolean
          sort_order?: number | null
          title: string
          updated_at?: string
          written_date?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          image_path?: string
          is_pinned?: boolean
          published?: boolean
          sort_order?: number | null
          title?: string
          updated_at?: string
          written_date?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          body: string | null
          category_id: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          published: boolean
          published_at: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          kind: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      company_history: {
        Row: {
          created_at: string
          description: string | null
          id: string
          month: number | null
          published: boolean
          sort_order: number
          title: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          month?: number | null
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          month?: number | null
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          admin_note: string | null
          area: string
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string
          organization: string | null
          phone: string | null
          position: string | null
          privacy_agreed: boolean
          service_detail: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          area: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message: string
          organization?: string | null
          phone?: string | null
          position?: string | null
          privacy_agreed?: boolean
          service_detail?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          area?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          organization?: string | null
          phone?: string | null
          position?: string | null
          privacy_agreed?: boolean
          service_detail?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      notice: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          published: boolean
          sort_order: number | null
          title: string
          updated_at: string
          written_date: string | null
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          published?: boolean
          sort_order?: number | null
          title: string
          updated_at?: string
          written_date?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          published?: boolean
          sort_order?: number | null
          title?: string
          updated_at?: string
          written_date?: string | null
        }
        Relationships: []
      }
      notices: {
        Row: {
          body: string | null
          created_at: string
          id: string
          pinned: boolean
          published: boolean
          published_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          pinned?: boolean
          published?: boolean
          published_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          pinned?: boolean
          published?: boolean
          published_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          author: string | null
          category: string
          content: string
          created_at: string
          id: string
          image_path: string
          is_pinned: boolean
          published: boolean
          sort_order: number | null
          title: string
          updated_at: string
          written_date: string | null
        }
        Insert: {
          author?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          image_path: string
          is_pinned?: boolean
          published?: boolean
          sort_order?: number | null
          title: string
          updated_at?: string
          written_date?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          image_path?: string
          is_pinned?: boolean
          published?: boolean
          sort_order?: number | null
          title?: string
          updated_at?: string
          written_date?: string | null
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          body: string | null
          category_id: string | null
          challenge: string | null
          client_name: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          outcome: string | null
          project_year: number | null
          published: boolean
          published_at: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string
          work_done: string | null
        }
        Insert: {
          body?: string | null
          category_id?: string | null
          challenge?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          outcome?: string | null
          project_year?: number | null
          published?: boolean
          published_at?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
          work_done?: string | null
        }
        Update: {
          body?: string | null
          category_id?: string | null
          challenge?: string | null
          client_name?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          outcome?: string | null
          project_year?: number | null
          published?: boolean
          published_at?: string | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
          work_done?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      press: {
        Row: {
          article_url: string
          created_at: string
          id: string
          is_pinned: boolean
          published: boolean
          published_date: string | null
          sort_order: number | null
          source: string
          title: string
          updated_at: string
        }
        Insert: {
          article_url: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          published?: boolean
          published_date?: string | null
          sort_order?: number | null
          source: string
          title: string
          updated_at?: string
        }
        Update: {
          article_url?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          published?: boolean
          published_date?: string | null
          sort_order?: number | null
          source?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          body: string | null
          created_at: string
          id: string
          outlet: string | null
          published: boolean
          published_at: string | null
          source_url: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          outlet?: string | null
          published?: boolean
          published_at?: string | null
          source_url?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          outlet?: string | null
          published?: boolean
          published_at?: string | null
          source_url?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      trust_metrics: {
        Row: {
          created_at: string
          id: string
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      inquiry_status: "new" | "in_progress" | "done"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      inquiry_status: ["new", "in_progress", "done"],
    },
  },
} as const
