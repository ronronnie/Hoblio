import type { SupabaseClient } from "@supabase/supabase-js";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type TrackerStatus = "available" | "coming_soon";
export type WorkspaceMemberRole = "owner" | "admin" | "member" | "viewer";
export type UserTrackerActivationStatus = "active" | "inactive";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trackers: {
        Row: {
          id: string;
          slug: "cricket" | "sneakers";
          name: string;
          description: string | null;
          category: string | null;
          status: TrackerStatus;
          is_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: "cricket" | "sneakers";
          name: string;
          description?: string | null;
          category?: string | null;
          status: TrackerStatus;
          is_paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: "cricket" | "sneakers";
          name?: string;
          description?: string | null;
          category?: string | null;
          status?: TrackerStatus;
          is_paid?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      workspaces: {
        Row: {
          id: string;
          tracker_slug: "cricket" | "sneakers";
          owner_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tracker_slug: "cricket" | "sneakers";
          owner_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tracker_slug?: "cricket" | "sneakers";
          owner_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspaces_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workspaces_tracker_slug_fkey";
            columns: ["tracker_slug"];
            isOneToOne: false;
            referencedRelation: "trackers";
            referencedColumns: ["slug"];
          }
        ];
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: WorkspaceMemberRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role: WorkspaceMemberRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          user_id?: string;
          role?: WorkspaceMemberRole;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workspace_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      user_tracker_activations: {
        Row: {
          id: string;
          user_id: string;
          tracker_slug: "cricket" | "sneakers";
          workspace_id: string;
          status: UserTrackerActivationStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tracker_slug: "cricket" | "sneakers";
          workspace_id: string;
          status?: UserTrackerActivationStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tracker_slug?: "cricket" | "sneakers";
          workspace_id?: string;
          status?: UserTrackerActivationStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_tracker_activations_tracker_slug_fkey";
            columns: ["tracker_slug"];
            isOneToOne: false;
            referencedRelation: "trackers";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "user_tracker_activations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_tracker_activations_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: string;
          status?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          status?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      ai_usage_logs: {
        Row: {
          id: string;
          user_id: string;
          workspace_id: string | null;
          tracker_slug: "cricket" | "sneakers" | null;
          usage_type: string | null;
          input_tokens: number;
          output_tokens: number;
          audio_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workspace_id?: string | null;
          tracker_slug?: "cricket" | "sneakers" | null;
          usage_type?: string | null;
          input_tokens?: number;
          output_tokens?: number;
          audio_seconds?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workspace_id?: string | null;
          tracker_slug?: "cricket" | "sneakers" | null;
          usage_type?: string | null;
          input_tokens?: number;
          output_tokens?: number;
          audio_seconds?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_tracker_slug_fkey";
            columns: ["tracker_slug"];
            isOneToOne: false;
            referencedRelation: "trackers";
            referencedColumns: ["slug"];
          },
          {
            foreignKeyName: "ai_usage_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_usage_logs_workspace_id_fkey";
            columns: ["workspace_id"];
            isOneToOne: false;
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      can_manage_workspace: {
        Args: { target_workspace_id: string };
        Returns: boolean;
      };
      is_tracker_available: {
        Args: { target_tracker_slug: string };
        Returns: boolean;
      };
      is_workspace_member: {
        Args: { target_workspace_id: string };
        Returns: boolean;
      };
      is_workspace_owner: {
        Args: { target_workspace_id: string };
        Returns: boolean;
      };
      shares_workspace_with_user: {
        Args: { target_user_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type TypedSupabaseClient = SupabaseClient<Database, "public", "public", Database["public"]>;
