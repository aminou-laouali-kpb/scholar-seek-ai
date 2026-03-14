CREATE TABLE public.lead_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  heat_level text NOT NULL DEFAULT 'low',
  admin_status text NOT NULL DEFAULT 'new',
  admin_notes text DEFAULT '',
  actions_count int NOT NULL DEFAULT 0,
  strong_signals int NOT NULL DEFAULT 0,
  last_action text,
  last_action_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lead scores" ON public.lead_scores FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own lead score" ON public.lead_scores FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own lead score" ON public.lead_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lead score" ON public.lead_scores FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_lead_scores_updated_at BEFORE UPDATE ON public.lead_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();