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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      access_logs: {
        Row: {
          action: string
          booking_id: string | null
          created_at: string
          id: string
          method: string
          notes: string | null
          room_id: string
        }
        Insert: {
          action: string
          booking_id?: string | null
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          room_id: string
        }
        Update: {
          action?: string
          booking_id?: string | null
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_logs_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_by: string | null
          created_at: string
          id: string
          message: string
          room_id: string | null
          severity: string
          type: string
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_by?: string | null
          created_at?: string
          id?: string
          message: string
          room_id?: string | null
          severity?: string
          type: string
        }
        Update: {
          acknowledged?: boolean
          acknowledged_by?: string | null
          created_at?: string
          id?: string
          message?: string
          room_id?: string | null
          severity?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          access_code: string
          check_in: string
          check_out: string
          created_at: string
          guest_id: string | null
          id: string
          nights: number
          payment_status: Database["public"]["Enums"]["payment_status"]
          room_id: string
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_code: string
          check_in: string
          check_out: string
          created_at?: string
          guest_id?: string | null
          id?: string
          nights: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          room_id: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_code?: string
          check_in?: string
          check_out?: string
          created_at?: string
          guest_id?: string | null
          id?: string
          nights?: number
          payment_status?: Database["public"]["Enums"]["payment_status"]
          room_id?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_house_settings: {
        Row: {
          created_at: string
          id: string
          payment_account_name: string
          payment_account_number: string
          payment_provider: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          payment_account_name?: string
          payment_account_number: string
          payment_provider?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          payment_account_name?: string
          payment_account_number?: string
          payment_provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      guests: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          id_number: string | null
          last_name: string
          nationality: string | null
          phone: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          id_number?: string | null
          last_name: string
          nationality?: string | null
          phone: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          id_number?: string | null
          last_name?: string
          nationality?: string | null
          phone?: string
        }
        Relationships: []
      }
      payment_notifications: {
        Row: {
          amount: number
          booking_id: string
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          guest_name: string
          id: string
          is_confirmed: boolean
          phone_number: string
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          guest_name: string
          id?: string
          is_confirmed?: boolean
          phone_number: string
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          guest_name?: string
          id?: string
          is_confirmed?: boolean
          phone_number?: string
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string
          description: string | null
          floor: number
          id: string
          images: string[] | null
          name: string
          price_per_night: number
          status: Database["public"]["Enums"]["room_status"]
          type: Database["public"]["Enums"]["room_type"]
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          floor?: number
          id?: string
          images?: string[] | null
          name: string
          price_per_night: number
          status?: Database["public"]["Enums"]["room_status"]
          type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          floor?: number
          id?: string
          images?: string[] | null
          name?: string
          price_per_night?: number
          status?: Database["public"]["Enums"]["room_status"]
          type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "guest" | "receptionist" | "owner"
      booking_status:
        | "pending"
        | "confirmed"
        | "checked_in"
        | "checked_out"
        | "cancelled"
      payment_status: "pending" | "confirmed" | "refunded"
      room_status: "available" | "occupied" | "reserved" | "cleaning"
      room_type: "single" | "double" | "suite" | "deluxe"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["guest", "receptionist", "owner"],
      booking_status: [
        "pending",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
      ],
      payment_status: ["pending", "confirmed", "refunded"],
      room_status: ["available", "occupied", "reserved", "cleaning"],
      room_type: ["single", "double", "suite", "deluxe"],
    },
  },
} as const
