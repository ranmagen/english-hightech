import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; name: string; class: string; role: string; created_at: string };
        Insert: { id?: string; name: string; class: string; role?: string };
        Update: { name?: string; class?: string; role?: string };
      };
      scenarios: {
        Row: {
          id: string; title: string; level: string; agents: string[];
          goal: string; context_doc: string | null; hint: string;
          success_criteria: Record<string, unknown>; branches: unknown[];
          is_published: boolean; unlock_requires: string[];
        };
        Insert: Omit<Database['public']['Tables']['scenarios']['Row'], 'is_published'> & { is_published?: boolean };
        Update: Partial<Database['public']['Tables']['scenarios']['Row']>;
      };
      conversations: {
        Row: {
          id: string; user_id: string; scenario_id: string;
          messages: unknown; started_at: string; completed_at: string | null; goal_achieved: boolean | null;
        };
        Insert: { user_id: string; scenario_id: string; messages?: unknown; started_at?: string };
        Update: { messages?: unknown; completed_at?: string; goal_achieved?: boolean };
      };
      scores: {
        Row: {
          id: string; conversation_id: string; user_id: string; scenario_id: string;
          clarity: number; tone: string; vocabulary_count: number;
          tech_comprehension: number; stakeholder_awareness: number;
          presentation_quality: number | null; team_collaboration: number;
          scenario_completion: boolean; complexity_bonus: number;
          feedback_text: string; teacher_note: string | null; created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scores']['Row'], 'id' | 'created_at'>;
        Update: { teacher_note?: string };
      };
      glossary: {
        Row: { id: string; term: string; definition_he: string; category: string };
        Insert: { term: string; definition_he: string; category?: string };
        Update: { term?: string; definition_he?: string; category?: string };
      };
    };
  };
};
