import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPost as BlogPostType } from "@/components/admin/BlogPostForm";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const isEn = language === "en";
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [related, setRelated] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      setPost(data as BlogPostType | null);
      if (data) {
        const { data: rel } = await supabase.from("blog_posts").select("*").eq("is_published", true).eq("category", data.category).neq("id", data.id).limit(3);
        setRelated((rel || []) as BlogPostType[]);
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen">
      <div className="w-full h-64 md:h-80 bg-muted animate-pulse" />
      <div className="container-narrow mx-auto section-padding space-y-4">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
        <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-3 mt-8">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${85 + Math.random() * 15}%` }} />)}
        </div>
      </div>
    </div>
  );
  if (!post) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><p className="text-muted-foreground">Article introuvable</p><Link to="/blog" className="text-primary underline">← Retour au blog</Link></div>;

  const title = isEn ? (post.title_en || post.title_fr) : post.title_fr;
  const content = isEn ? (post.content_en || post.content_fr) : post.content_fr;
  const excerpt = isEn ? (post.excerpt_en || post.excerpt_fr) : post.excerpt_fr;
  const metaTitle = isEn ? (post.meta_title_en || title) : (post.meta_title_fr || title);
  const metaDesc = isEn ? (post.meta_description_en || excerpt) : (post.meta_description_fr || excerpt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    author: { "@type": "Person", name: post.author_name },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image_url || undefined,
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      const { toast } = await import("sonner");
      toast.success(isEn ? "Link copied!" : "Lien copié !");
    }
  };

  // Simple markdown rendering (bold, italic, headings, paragraphs, links, lists)
  const renderMarkdown = (md: string) => {
    const lines = md.split("\n");
    const elements: JSX.Element[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("### ")) {
        elements.push(<h3 key={i} className="font-heading font-bold text-xl text-foreground mt-6 mb-2">{line.slice(4)}</h3>);
      } else if (line.startsWith("## ")) {
        elements.push(<h2 key={i} className="font-heading font-bold text-2xl text-foreground mt-8 mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith("# ")) {
        elements.push(<h2 key={i} className="font-heading font-bold text-2xl text-foreground mt-8 mb-3">{line.slice(2)}</h2>);
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(<li key={i} className="text-muted-foreground ml-6 list-disc">{formatInline(line.slice(2))}</li>);
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-3" />);
      } else {
        elements.push(<p key={i} className="text-muted-foreground leading-relaxed">{formatInline(line)}</p>);
      }
      i++;
    }
    return elements;
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline" target="_blank" rel="noopener">$1</a>');
  };

  return (
    <div className="min-h-screen">
      <SEOHead title={metaTitle} description={metaDesc} ogImage={post.cover_image_url || undefined} ogType="article" jsonLd={jsonLd} />

      {post.cover_image_url && (
        <div className="w-full h-64 md:h-80 bg-muted">
          <img src={post.cover_image_url} alt={title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      )}

      <article className="container-narrow mx-auto section-padding">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> {isEn ? "Back to blog" : "Retour au blog"}
        </Link>

        <Badge variant="secondary" className="mb-3">{post.category}</Badge>
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-4">{title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(post.published_at || post.created_at).toLocaleDateString(isEn ? "en-US" : "fr-FR", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.reading_time_minutes} min</span>
          <span>{post.author_name}</span>
          <Button variant="ghost" size="sm" onClick={share}><Share2 className="w-4 h-4 mr-1" />{isEn ? "Share" : "Partager"}</Button>
        </div>

        <div className="prose max-w-none">
          {renderMarkdown(content)}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="section-padding bg-secondary/30">
          <div className="container-narrow mx-auto">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-6">{isEn ? "Related articles" : "Articles similaires"}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-card-hover transition-all">
                  {r.cover_image_url && <img src={r.cover_image_url} alt="" className="h-36 w-full object-cover" loading="lazy" />}
                  <div className="p-5">
                    <Badge variant="secondary" className="mb-2">{r.category}</Badge>
                    <h3 className="font-heading font-bold text-foreground">{isEn ? (r.title_en || r.title_fr) : r.title_fr}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
