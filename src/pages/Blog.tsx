import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Blog = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const categories = t("blogPage.categories") as string[];
  const articles = t("blogPreview.articles") as Array<{ title: string; category: string; date: string }>;

  // Repeat articles for demo
  const allArticles = [...articles, ...articles, ...articles];

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("blogPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("blogPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, i) => (
                <button key={i} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder={t("blogPage.search")} className="pl-9" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {allArticles.map((article, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }} className="bg-card rounded-xl overflow-hidden shadow-card border border-border hover:shadow-card-hover transition-all cursor-pointer group">
                <div className="h-36 gradient-hero flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-primary-foreground/20" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.category}</span>
                  <h3 className="font-heading font-bold text-foreground mt-2 mb-2 group-hover:text-accent transition-colors">{article.title}</h3>
                  <p className="text-muted-foreground text-xs">{article.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
