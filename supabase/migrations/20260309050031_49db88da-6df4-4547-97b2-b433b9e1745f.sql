
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title_fr text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  content_fr text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '',
  excerpt_fr text NOT NULL DEFAULT '',
  excerpt_en text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  tags text[] NOT NULL DEFAULT '{}',
  cover_image_url text,
  meta_title_fr text NOT NULL DEFAULT '',
  meta_title_en text NOT NULL DEFAULT '',
  meta_description_fr text NOT NULL DEFAULT '',
  meta_description_en text NOT NULL DEFAULT '',
  author_name text NOT NULL DEFAULT 'KPB Team',
  reading_time_minutes integer NOT NULL DEFAULT 5,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
  FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
