
-- Create enum for saved item types
CREATE TYPE public.saved_item_type AS ENUM ('scholarship', 'admission', 'destination');

-- Create saved_items table
CREATE TABLE public.saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type saved_item_type NOT NULL,
  item_id TEXT NOT NULL,
  is_priority BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved items" ON public.saved_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved items" ON public.saved_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own saved items" ON public.saved_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved items" ON public.saved_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create consultation_requests table
CREATE TABLE public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL DEFAULT 'support',
  item_type TEXT,
  item_id TEXT,
  item_name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own requests" ON public.consultation_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own requests" ON public.consultation_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create application_intents table
CREATE TABLE public.application_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_name TEXT,
  status TEXT NOT NULL DEFAULT 'started',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.application_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own intents" ON public.application_intents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own intents" ON public.application_intents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own intents" ON public.application_intents FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Add new columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_destinations TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS budget_sensitivity TEXT DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS scholarship_interest BOOLEAN DEFAULT true;
