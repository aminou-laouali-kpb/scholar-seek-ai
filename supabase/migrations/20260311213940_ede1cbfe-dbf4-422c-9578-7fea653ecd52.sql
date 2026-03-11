
-- Create partner_programs table for the partner school catalog
CREATE TABLE public.partner_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  school_slug text NOT NULL,
  partner_status text NOT NULL DEFAULT 'partner',
  country text NOT NULL,
  city text NOT NULL DEFAULT '',
  campus_name text NOT NULL DEFAULT '',
  program_name text NOT NULL,
  program_family text NOT NULL DEFAULT '',
  degree_level text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  language_of_instruction text NOT NULL DEFAULT '',
  tuition_amount text NOT NULL DEFAULT '',
  tuition_currency text NOT NULL DEFAULT 'EUR',
  tuition_period text NOT NULL DEFAULT 'per year',
  application_intake text NOT NULL DEFAULT '',
  eligibility_academic text NOT NULL DEFAULT '',
  eligibility_language text NOT NULL DEFAULT '',
  required_documents text NOT NULL DEFAULT '',
  application_process text NOT NULL DEFAULT '',
  scholarship_available text NOT NULL DEFAULT 'Unknown',
  status text NOT NULL DEFAULT 'contact_us',
  source_url text NOT NULL DEFAULT '',
  notes_internal text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partner_programs ENABLE ROW LEVEL SECURITY;

-- Admins can manage everything
CREATE POLICY "Admins can manage partner programs"
  ON public.partner_programs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Anyone authenticated can read published programs
CREATE POLICY "Anyone can read published partner programs"
  ON public.partner_programs FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Public can also read published programs (for non-logged-in visitors)
CREATE POLICY "Public can read published partner programs"
  ON public.partner_programs FOR SELECT
  TO public
  USING (is_published = true);

-- Updated_at trigger
CREATE TRIGGER update_partner_programs_updated_at
  BEFORE UPDATE ON public.partner_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
