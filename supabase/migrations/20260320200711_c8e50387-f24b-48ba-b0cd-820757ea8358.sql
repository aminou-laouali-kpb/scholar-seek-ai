
-- Fix 1: Drop overly permissive public SELECT on recours_submissions
DROP POLICY IF EXISTS "Public can read own recours submissions" ON public.recours_submissions;

-- Replace with scoped policy for authenticated users only
CREATE POLICY "Users can read own recours submissions"
  ON public.recours_submissions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Fix 2: Drop overly permissive public INSERT on recours_submissions (WITH CHECK true)
DROP POLICY IF EXISTS "Anyone can insert recours submissions" ON public.recours_submissions;

-- Replace with authenticated-only insert scoped to own user_id
CREATE POLICY "Users can insert own recours submissions"
  ON public.recours_submissions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix 3: Drop overly permissive storage read policy on refusal-documents
DROP POLICY IF EXISTS "Public can read own refusal documents" ON storage.objects;

-- Add scoped storage read policy using user_id folder prefix
CREATE POLICY "Users can read own refusal documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'refusal-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
