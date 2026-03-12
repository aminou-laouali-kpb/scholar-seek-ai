import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageContext";
import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { CardSkeleton } from "@/components/ui/CardSkeleton";
import { BookOpen, Search, Clock, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/components/admin/BlogPostForm";

const POSTS_PER_PAGE = 9;

const Blog = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false });
      setPosts((data || []) as BlogPost[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = [...new Set(posts.map((p) => p.category))];

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (isEn ? (p.title_en || p.title_fr) : p.title_fr).toLowerCase().includes(q) ||
      (isEn ? (p.excerpt_en || p.excerpt_fr) : p.excerpt_fr).toLowerCase().includes(q);
    const matchCat = !category || p.category === category;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search, category]);

  return (
    <div className="min-h-screen">
      <SEOHead
        title={isEn ? "Blog — KPB Education" : "Blog — KPB Éducation"}
        description={isEn ? "Articles, guides and tips for studying abroad" : "Articles, guides et conseils pour étudier à l'étranger"}
      />

      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">
            {isEn ? "Our Blog" : "Notre Blog"}
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            {isEn ? "Articles, guides and tips for studying abroad" : "Articles, guides et conseils pour étudier à l'étranger"}
          </p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory(null)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${!category ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                {isEn ? "All" : "Tous"}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={isEn ? "Search..." : "Rechercher..."} className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
          ) : paginated.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">{isEn ? "No articles found" : "Aucun article trouvé"}</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {paginated.map((post, i) => {
                const title = isEn ? (post.title_en || post.title_fr) : post.title_fr;
                const excerpt = isEn ? (post.excerpt_en || post.excerpt_fr) : post.excerpt_fr;
                return (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }}>
                    <Link to={`/blog/${post.slug}`} className="bg-card rounded-xl overflow-hidden shadow-card border border-border hover:shadow-card-hover transition-all block group">
                      {post.cover_image_url ? (
                        <img src={post.cover_image_url} alt={title} className="h-36 w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="h-36 gradient-hero flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-primary-foreground/20" />
                        </div>
                      )}
                      <div className="p-5">
                        <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                        <h3 className="font-heading font-bold text-foreground mt-1 mb-2 group-hover:text-accent transition-colors line-clamp-2">{title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{excerpt}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.published_at || post.created_at).toLocaleDateString(isEn ? "en-US" : "fr-FR")}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time_minutes} min</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
