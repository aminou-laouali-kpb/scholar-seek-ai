CREATE TABLE public.questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  needs_advisor boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert questionnaire responses"
  ON public.questionnaire_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all questionnaire responses"
  ON public.questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own questionnaire responses"
  ON public.questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);