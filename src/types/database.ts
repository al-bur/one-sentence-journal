export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      journal_answers: {
        Row: {
          content: string
          created_at: string | null
          daily_question_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          daily_question_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          daily_question_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_answers_daily_question_id_fkey"
            columns: ["daily_question_id"]
            isOneToOne: false
            referencedRelation: "journal_daily_questions"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_daily_questions: {
        Row: {
          created_at: string | null
          id: string
          question_date: string
          question_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_date?: string
          question_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_date?: string
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_daily_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "journal_questions"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_group_members: {
        Row: {
          avatar_url: string | null
          group_id: string | null
          id: string
          joined_at: string | null
          nickname: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          group_id?: string | null
          id?: string
          joined_at?: string | null
          nickname?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          group_id?: string | null
          id?: string
          joined_at?: string | null
          nickname?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "journal_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          invite_code: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invite_code?: string
          name?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          invite_code?: string
          name?: string
        }
        Relationships: []
      }
      journal_questions: {
        Row: {
          category: string | null
          content: string
          id: string
        }
        Insert: {
          category?: string | null
          content: string
          id?: string
        }
        Update: {
          category?: string | null
          content?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_group_by_invite_code: {
        Args: { code: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      get_user_group_ids: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type JournalGroup = Database['public']['Tables']['journal_groups']['Row']
export type JournalGroupMember = Database['public']['Tables']['journal_group_members']['Row']
export type JournalQuestion = Database['public']['Tables']['journal_questions']['Row']
export type JournalDailyQuestion = Database['public']['Tables']['journal_daily_questions']['Row']
export type JournalAnswer = Database['public']['Tables']['journal_answers']['Row']

export type DailyQuestionWithQuestion = JournalDailyQuestion & {
  journal_questions: JournalQuestion | null
}

export type AnswerWithMember = JournalAnswer & {
  journal_group_members: JournalGroupMember | null
}
