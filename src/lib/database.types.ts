
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
          username: string | null
          profile_image: string | null
          points: number
          posts_shared: number
          reposts_received: number
          reposts_made: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          profile_image?: string | null
          points?: number
          posts_shared?: number
          reposts_received?: number
          reposts_made?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          profile_image?: string | null
          points?: number
          posts_shared?: number
          reposts_received?: number
          reposts_made?: number
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          tweet_url: string
          tweet_id: string
          content: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tweet_url: string
          tweet_id: string
          content?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tweet_url?: string
          tweet_id?: string
          content?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      reposts: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      point_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          description: string
          created_at: string
          reference_id: string | null
          transaction_type: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          description: string
          created_at?: string
          reference_id?: string | null
          transaction_type: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          description?: string
          created_at?: string
          reference_id?: string | null
          transaction_type?: string
        }
      }
      redemptions: {
        Row: {
          id: string
          user_id: string
          points_amount: number
          money_amount: number
          payment_email: string
          status: string
          payment_method: string
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          points_amount: number
          money_amount: number
          payment_email: string
          status?: string
          payment_method: string
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          points_amount?: number
          money_amount?: number
          payment_email?: string
          status?: string
          payment_method?: string
          created_at?: string
          processed_at?: string | null
        }
      }
    }
  }
}
