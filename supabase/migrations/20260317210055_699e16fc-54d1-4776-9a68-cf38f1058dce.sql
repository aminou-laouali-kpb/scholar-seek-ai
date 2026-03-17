
-- Create recours_submissions table
CREATE TABLE public.recours_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  country_of_residence text NOT NULL DEFAULT '',
  nationality text NOT NULL DEFAULT '',
  current_level text NOT NULL DEFAULT '',
  target_level text NOT NULL DEFAULT '',
  field_of_study text NOT NULL DEFAULT '',
  institutions_applied text NOT NULL DEFAULT '',
  program_applied text NOT NULL DEFAULT '',
  num_refusals integer NOT NULL DEFAULT 1,
  refusal_date text DEFAULT '',
  refusal_reason text DEFAULT '',
  situation_description text DEFAULT '',
  why_contestable text DEFAULT '',
  has_pending_applications boolean DEFAULT false,
  open_to_private boolean DEFAULT false,
  budget_range text DEFAULT '',
  preferred_cities text DEFAULT '',
  urgency_level text DEFAULT 'normal',
  result_category text DEFAULT NULL,
  result_details jsonb DEFAULT '{}'::jsonb,
  refusal_document_url text DEFAULT NULL,
  admin_status text NOT NULL DEFAULT 'new',
  admin_notes text DEFAULT '',
  admin_tags text[] DEFAULT '{}'::text[],
  user_id uuid DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recours_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert recours submissions"
  ON public.recours_submissions FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Public can read own recours submissions"
  ON public.recours_submissions FOR SELECT TO public
  USING (true);

CREATE POLICY "Admins full access recours submissions"
  ON public.recours_submissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_recours_updated_at
  BEFORE UPDATE ON public.recours_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for refusal documents
INSERT INTO storage.buckets (id, name, public) VALUES ('refusal-documents', 'refusal-documents', false);

CREATE POLICY "Anyone can upload refusal documents"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'refusal-documents');

CREATE POLICY "Admins can read refusal documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'refusal-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read own refusal documents"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'refusal-documents');
