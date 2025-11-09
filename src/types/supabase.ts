export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      level: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order: number;
        };
        Update: Partial<Database['public']['Tables']['level']['Row']>;
      };
      category: {
        Row: {
          id: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          sort_order: number;
        };
        Update: Partial<Database['public']['Tables']['category']['Row']>;
      };
      book: {
        Row: {
          id: string;
          title: string;
          level_id: string;
          category_id: string;
          units_count: number;
        };
        Insert: {
          id?: string;
          title: string;
          level_id: string;
          category_id: string;
          units_count?: number;
        };
        Update: Partial<Database['public']['Tables']['book']['Row']>;
      };
      unit: {
        Row: {
          id: string;
          unit_number: number;
          book_id: string;
        };
        Insert: {
          id?: string;
          unit_number: number;
          book_id: string;
        };
        Update: Partial<Database['public']['Tables']['unit']['Row']>;
      };
      question: {
        Row: {
          id: string;
          unit_id: string;
          question_number: number;
          answer_key: string | null;
        };
        Insert: {
          id?: string;
          unit_id: string;
          question_number: number;
          answer_key?: string | null;
        };
        Update: Partial<Database['public']['Tables']['question']['Row']>;
      };
      answer: {
        Row: {
          id: string;
          student_id: string;
          question_id: string;
          response_text: string | null;
          attempt_number: number | null;
          is_correct: boolean | null;
          submitted_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          question_id: string;
          response_text?: string | null;
          attempt_number?: number | null;
          is_correct?: boolean | null;
          submitted_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['answer']['Row']>;
      };
      student: {
        Row: {
          id: string;
          username: string;
          current_level_id: string | null;
        };
        Insert: {
          id: string;
          username: string;
          current_level_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['student']['Row']>;
      };
      parent_student_link: {
        Row: {
          parent_id: string;
          student_id: string;
          created_at: string | null;
        };
        Insert: {
          parent_id: string;
          student_id: string;
          created_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['parent_student_link']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
