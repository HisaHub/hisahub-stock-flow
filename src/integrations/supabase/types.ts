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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          code: string
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
          requirement_type: string
          requirement_value: number
          tier: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points?: number
          requirement_type: string
          requirement_value: number
          tier: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
          requirement_type?: string
          requirement_value?: number
          tier?: string
        }
        Relationships: []
      }
      broker_accounts: {
        Row: {
          account_number: string
          api_credentials: Json | null
          broker_name: Database["public"]["Enums"]["broker_name"]
          cds_account: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          user_id: string | null
        }
        Insert: {
          account_number: string
          api_credentials?: Json | null
          broker_name: Database["public"]["Enums"]["broker_name"]
          cds_account?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Update: {
          account_number?: string
          api_credentials?: Json | null
          broker_name?: Database["public"]["Enums"]["broker_name"]
          cds_account?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broker_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          context: Json | null
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      holdings: {
        Row: {
          average_price: number
          current_price: number | null
          id: string
          portfolio_id: string | null
          quantity: number
          stock_id: string | null
          unrealized_pnl: number | null
          updated_at: string | null
        }
        Insert: {
          average_price?: number
          current_price?: number | null
          id?: string
          portfolio_id?: string | null
          quantity?: number
          stock_id?: string | null
          unrealized_pnl?: number | null
          updated_at?: string | null
        }
        Update: {
          average_price?: number
          current_price?: number | null
          id?: string
          portfolio_id?: string | null
          quantity?: number
          stock_id?: string | null
          unrealized_pnl?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holdings_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          document_type: string
          document_url: string
          id: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["kyc_status"] | null
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          document_type: string
          document_url: string
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          document_type?: string
          document_url?: string
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["kyc_status"] | null
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data: {
        Row: {
          change_percent: number | null
          change_value: number | null
          id: string
          name: string
          symbol: string
          timestamp: string | null
          value: number
        }
        Insert: {
          change_percent?: number | null
          change_value?: number | null
          id?: string
          name: string
          symbol: string
          timestamp?: string | null
          value: number
        }
        Update: {
          change_percent?: number | null
          change_value?: number | null
          id?: string
          name?: string
          symbol?: string
          timestamp?: string | null
          value?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          average_fill_price: number | null
          broker_account_id: string | null
          broker_order_id: string | null
          created_at: string | null
          expires_at: string | null
          filled_quantity: number | null
          id: string
          order_type: Database["public"]["Enums"]["order_type"]
          portfolio_id: string | null
          price: number | null
          quantity: number
          side: Database["public"]["Enums"]["order_side"]
          status: Database["public"]["Enums"]["order_status"] | null
          stock_id: string | null
          stop_price: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          average_fill_price?: number | null
          broker_account_id?: string | null
          broker_order_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          filled_quantity?: number | null
          id?: string
          order_type: Database["public"]["Enums"]["order_type"]
          portfolio_id?: string | null
          price?: number | null
          quantity: number
          side: Database["public"]["Enums"]["order_side"]
          status?: Database["public"]["Enums"]["order_status"] | null
          stock_id?: string | null
          stop_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          average_fill_price?: number | null
          broker_account_id?: string | null
          broker_order_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          filled_quantity?: number | null
          id?: string
          order_type?: Database["public"]["Enums"]["order_type"]
          portfolio_id?: string | null
          price?: number | null
          quantity?: number
          side?: Database["public"]["Enums"]["order_side"]
          status?: Database["public"]["Enums"]["order_status"] | null
          stock_id?: string | null
          stop_price?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_broker_account_id_fkey"
            columns: ["broker_account_id"]
            isOneToOne: false
            referencedRelation: "broker_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          cash_balance: number | null
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          total_value: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cash_balance?: number | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          total_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cash_balance?: number | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          total_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_bookmarks: {
        Row: {
          collection_name: string | null
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          collection_name?: string | null
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          collection_name?: string | null
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          parent_comment_id: string | null
          post_id: string
          replies_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id: string
          replies_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id?: string
          replies_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reposts: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          original_post_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          original_post_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          original_post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reposts_original_post_id_fkey"
            columns: ["original_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_shares: {
        Row: {
          created_at: string
          id: string
          platform: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          ai_analyzed_at: string | null
          content: string
          created_at: string
          id: string
          likes_count: number
          replies_count: number
          repost_count: number
          sentiment_confidence: number | null
          sentiment_label: string | null
          sentiment_score: number | null
          share_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_analyzed_at?: string | null
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          replies_count?: number
          repost_count?: number
          sentiment_confidence?: number | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          share_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_analyzed_at?: string | null
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          replies_count?: number
          repost_count?: number
          sentiment_confidence?: number | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          share_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          condition: string
          created_at: string | null
          id: string
          is_active: boolean | null
          stock_id: string | null
          target_price: number
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          condition: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          stock_id?: string | null
          target_price: number
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          condition?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          stock_id?: string | null
          target_price?: number
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          biometric_enabled: boolean | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          national_id: string | null
          phone_number: string | null
          risk_tolerance: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          trading_pin_hash: string | null
          updated_at: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          biometric_enabled?: boolean | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          national_id?: string | null
          phone_number?: string | null
          risk_tolerance?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          trading_pin_hash?: string | null
          updated_at?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          biometric_enabled?: boolean | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          national_id?: string | null
          phone_number?: string | null
          risk_tolerance?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          trading_pin_hash?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      signal_followers: {
        Row: {
          created_at: string
          id: string
          signal_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          signal_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          signal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signal_followers_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "trading_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_prices: {
        Row: {
          close: number | null
          high: number | null
          id: string
          low: number | null
          open: number | null
          price: number
          stock_id: string | null
          timestamp: string | null
          volume: number | null
        }
        Insert: {
          close?: number | null
          high?: number | null
          id?: string
          low?: number | null
          open?: number | null
          price: number
          stock_id?: string | null
          timestamp?: string | null
          volume?: number | null
        }
        Update: {
          close?: number | null
          high?: number | null
          id?: string
          low?: number | null
          open?: number | null
          price?: number
          stock_id?: string | null
          timestamp?: string | null
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_prices_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      stocks: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          is_active: boolean | null
          listed_date: string | null
          market_cap: number | null
          name: string
          sector: string | null
          shares_outstanding: number | null
          symbol: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          listed_date?: string | null
          market_cap?: number | null
          name: string
          sector?: string | null
          shares_outstanding?: number | null
          symbol: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          listed_date?: string | null
          market_cap?: number | null
          name?: string
          sector?: string | null
          shares_outstanding?: number | null
          symbol?: string
        }
        Relationships: []
      }
      trading_signals: {
        Row: {
          accuracy_rating: number | null
          actual_close_price: number | null
          closed_at: string | null
          confidence_score: number | null
          created_at: string
          entry_price: number
          expires_at: string | null
          followers_count: number
          id: string
          post_id: string | null
          reasoning: string | null
          signal_type: string
          status: string
          stop_loss: number | null
          target_price: number | null
          ticker: string
          timeframe: string | null
          user_id: string
        }
        Insert: {
          accuracy_rating?: number | null
          actual_close_price?: number | null
          closed_at?: string | null
          confidence_score?: number | null
          created_at?: string
          entry_price: number
          expires_at?: string | null
          followers_count?: number
          id?: string
          post_id?: string | null
          reasoning?: string | null
          signal_type: string
          status?: string
          stop_loss?: number | null
          target_price?: number | null
          ticker: string
          timeframe?: string | null
          user_id: string
        }
        Update: {
          accuracy_rating?: number | null
          actual_close_price?: number | null
          closed_at?: string | null
          confidence_score?: number | null
          created_at?: string
          entry_price?: number
          expires_at?: string | null
          followers_count?: number
          id?: string
          post_id?: string | null
          reasoning?: string | null
          signal_type?: string
          status?: string
          stop_loss?: number | null
          target_price?: number | null
          ticker?: string
          timeframe?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_signals_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          fees: number | null
          id: string
          order_id: string | null
          portfolio_id: string | null
          price: number | null
          quantity: number | null
          settlement_date: string | null
          stock_id: string | null
          tax: number | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          fees?: number | null
          id?: string
          order_id?: string | null
          portfolio_id?: string | null
          price?: number | null
          quantity?: number | null
          settlement_date?: string | null
          stock_id?: string | null
          tax?: number | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          fees?: number | null
          id?: string
          order_id?: string | null
          portfolio_id?: string | null
          price?: number | null
          quantity?: number | null
          settlement_date?: string | null
          stock_id?: string | null
          tax?: number | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          progress: number | null
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          progress?: number | null
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          progress?: number | null
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          accurate_signals: number
          achievement_points: number
          current_streak: number
          last_active_date: string | null
          longest_streak: number
          profitable_trades: number
          reputation_score: number
          total_likes_received: number
          total_posts: number
          total_signals: number
          total_trades: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accurate_signals?: number
          achievement_points?: number
          current_streak?: number
          last_active_date?: string | null
          longest_streak?: number
          profitable_trades?: number
          reputation_score?: number
          total_likes_received?: number
          total_posts?: number
          total_signals?: number
          total_trades?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accurate_signals?: number
          achievement_points?: number
          current_streak?: number
          last_active_date?: string | null
          longest_streak?: number
          profitable_trades?: number
          reputation_score?: number
          total_likes_received?: number
          total_posts?: number
          total_signals?: number
          total_trades?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlist_items: {
        Row: {
          added_at: string | null
          id: string
          stock_id: string | null
          watchlist_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          stock_id?: string | null
          watchlist_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          stock_id?: string | null
          watchlist_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_items_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlist_items_watchlist_id_fkey"
            columns: ["watchlist_id"]
            isOneToOne: false
            referencedRelation: "watchlists"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      trading_leaderboard: {
        Row: {
          accurate_signals: number | null
          achievement_points: number | null
          badges_count: number | null
          first_name: string | null
          last_name: string | null
          profitable_trades: number | null
          reputation_score: number | null
          signal_accuracy: number | null
          total_signals: number | null
          total_trades: number | null
          user_id: string | null
          win_rate: number | null
        }
        Relationships: []
      }
      trending_hashtags: {
        Row: {
          hashtag: string | null
          last_used: string | null
          usage_count: number | null
        }
        Relationships: []
      }
      trending_tickers: {
        Row: {
          last_mentioned: string | null
          mention_count: number | null
          ticker: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_trading_accuracy: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_recommended_users: {
        Args: { for_user_id: string; limit_count?: number }
        Returns: {
          common_follows_count: number
          first_name: string
          last_name: string
          user_id: string
        }[]
      }
      search_posts: {
        Args: { search_query: string }
        Returns: {
          ai_analyzed_at: string | null
          content: string
          created_at: string
          id: string
          likes_count: number
          replies_count: number
          repost_count: number
          sentiment_confidence: number | null
          sentiment_label: string | null
          sentiment_score: number | null
          share_count: number
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "posts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      account_status: "active" | "suspended" | "pending_verification" | "closed"
      broker_name:
        | "genghis_capital"
        | "abc_capital"
        | "sterling_capital"
        | "dyer_blair"
      kyc_status: "pending" | "approved" | "rejected" | "expired"
      notification_type:
        | "price_alert"
        | "order_update"
        | "dividend"
        | "news"
        | "system"
      order_side: "buy" | "sell"
      order_status: "pending" | "partial" | "filled" | "cancelled" | "rejected"
      order_type: "market" | "limit" | "stop_loss" | "stop_limit"
      user_role: "admin" | "premium" | "standard"
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
      account_status: ["active", "suspended", "pending_verification", "closed"],
      broker_name: [
        "genghis_capital",
        "abc_capital",
        "sterling_capital",
        "dyer_blair",
      ],
      kyc_status: ["pending", "approved", "rejected", "expired"],
      notification_type: [
        "price_alert",
        "order_update",
        "dividend",
        "news",
        "system",
      ],
      order_side: ["buy", "sell"],
      order_status: ["pending", "partial", "filled", "cancelled", "rejected"],
      order_type: ["market", "limit", "stop_loss", "stop_limit"],
      user_role: ["admin", "premium", "standard"],
    },
  },
} as const
