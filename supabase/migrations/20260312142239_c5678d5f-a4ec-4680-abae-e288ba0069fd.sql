
-- Contact requests table
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  category text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact requests" ON public.contact_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can manage contact requests" ON public.contact_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Public read policies for scholarships and admissions
CREATE POLICY "Public can read published scholarships" ON public.admin_scholarships FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public can read published admissions" ON public.admin_admissions FOR SELECT TO public USING (is_published = true);

-- Update handle_new_user to pull more metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, whatsapp, phone_country, country_of_birth, country_of_residence, study_level, desired_program, dont_know_program, profile_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_country', 'CM'),
    COALESCE(NEW.raw_user_meta_data->>'country_of_birth', ''),
    COALESCE(NEW.raw_user_meta_data->>'country_of_residence', ''),
    COALESCE(NEW.raw_user_meta_data->>'study_level', ''),
    COALESCE(NEW.raw_user_meta_data->>'desired_program', ''),
    COALESCE((NEW.raw_user_meta_data->>'dont_know_program')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'profile_completed')::boolean, false)
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;
