
-- Schema for Band Bajaate Raho application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table to extend Supabase auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  profile_image TEXT,
  points INTEGER DEFAULT 0 NOT NULL,
  posts_shared INTEGER DEFAULT 0 NOT NULL,
  reposts_received INTEGER DEFAULT 0 NOT NULL,
  reposts_made INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tweet_url TEXT NOT NULL,
  tweet_id TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reposts table to track which users have reposted which posts
CREATE TABLE IF NOT EXISTS reposts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Prevent duplicate reposts
);

-- Create point_transactions table to track point activity
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reference_id UUID, -- Optional reference to related post/repost
  transaction_type TEXT NOT NULL -- 'REPOST_EARNED', 'REPOST_RECEIVED', 'REDEMPTION', etc.
);

-- Create redemptions table to track point redemptions
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points_amount INTEGER NOT NULL,
  money_amount DECIMAL(10, 2) NOT NULL,
  payment_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'processed', 'failed'
  payment_method TEXT NOT NULL, -- 'paypal', 'bank_transfer', 'gift_card'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create RLS policies for posts
CREATE POLICY "Posts are viewable by everyone" 
  ON posts FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own posts" 
  ON posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
  ON posts FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for reposts
CREATE POLICY "Reposts are viewable by everyone" 
  ON reposts FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own reposts" 
  ON reposts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for point_transactions
CREATE POLICY "Users can view their own point transactions" 
  ON point_transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- Create RLS policies for redemptions
CREATE POLICY "Users can view their own redemptions" 
  ON redemptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions" 
  ON redemptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create triggers to handle automated tasks

-- Function to create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, points)
  VALUES (new.id, new.email, 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update post counts when a new post is created
CREATE OR REPLACE FUNCTION public.handle_new_post()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET posts_shared = posts_shared + 1
  WHERE id = new.user_id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update post counts
CREATE TRIGGER on_post_created
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_post();

-- Function to handle new reposts
CREATE OR REPLACE FUNCTION public.handle_new_repost()
RETURNS TRIGGER AS $$
DECLARE
  post_user_id UUID;
BEGIN
  -- Get the user_id of the post being reposted
  SELECT user_id INTO post_user_id FROM public.posts WHERE id = new.post_id;
  
  -- Update repost counts and add points
  UPDATE public.profiles
  SET reposts_made = reposts_made + 1, points = points + 1
  WHERE id = new.user_id;
  
  -- Add to repost count for the original poster
  UPDATE public.profiles
  SET reposts_received = reposts_received + 1
  WHERE id = post_user_id;
  
  -- Record point transaction
  INSERT INTO public.point_transactions
    (user_id, amount, description, reference_id, transaction_type)
  VALUES
    (new.user_id, 1, 'Earned point for reposting', new.post_id, 'REPOST_EARNED');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle repost actions
CREATE TRIGGER on_repost_created
  AFTER INSERT ON public.reposts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_repost();
