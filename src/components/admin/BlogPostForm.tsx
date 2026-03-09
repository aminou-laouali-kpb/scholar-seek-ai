import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BlogPost {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  category: string;
  tags: string[];
  cover_image_url: string | null;
  meta_title_fr: string;
  meta_title_en: string;
  meta_description_fr: string;
  meta_description_en: string;
  author_name: string;
  reading_time_minutes: number;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
  onSaved: () => void;
}

const EMPTY = {
  slug: "", title_fr: "", title_en: "", content_fr: "", content_en: "",
  excerpt_fr: "", excerpt_en: "", category: "general", tags: [] as string[],
  cover_image_url: "", meta_title_fr: "", meta_title_en: "",
  meta_description_fr: "", meta_description_en: "", author_name: "KPB Team",
  reading_time_minutes: 5, is_published: false,
};

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const BlogPostForm = ({ open, onOpenChange, post, onSaved }: Props) => {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setForm({
        slug: post.slug, title_fr: post.title_fr, title_en: post.title_en,
        content_fr: post.content_fr, content_en: post.content_en,
        excerpt_fr: post.excerpt_fr, excerpt_en: post.excerpt_en,
        category: post.category, tags: post.tags,
        cover_image_url: post.cover_image_url || "",
        meta_title_fr: post.meta_title_fr, meta_title_en: post.meta_title_en,
        meta_description_fr: post.meta_description_fr, meta_description_en: post.meta_description_en,
        author_name: post.author_name, reading_time_minutes: post.reading_time_minutes,
        is_published: post.is_published,
      });
    } else {
      setForm(EMPTY);
    }
  }, [post, open]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleFrChange = (v: string) => {
    set("title_fr", v);
    if (!post) set("slug", slugify(v));
  };

  const handleSave = async () => {
    if (!form.title_fr && !form.title_en) {
      toast({ title: "Le titre est requis", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title_fr || form.title_en),
      tags: form.tags,
      cover_image_url: form.cover_image_url || null,
      published_at: form.is_published ? (post?.published_at || new Date().toISOString()) : null,
    };

    const { error } = post
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: post ? "Article mis à jour" : "Article créé" });
      onSaved();
      onOpenChange(false);
    }
  };

  const metaTitle = form.meta_title_fr || form.title_fr || "Titre de l'article";
  const metaDesc = form.meta_description_fr || form.excerpt_fr || "Description de l'article...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? "Modifier l'article" : "Nouvel article"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* SEO Preview */}
          <div className="bg-muted rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Aperçu Google</p>
            <p className="text-primary text-lg font-medium leading-tight truncate">{metaTitle}</p>
            <p className="text-green-700 text-sm">kpb-education.com/blog/{form.slug || "..."}</p>
            <p className="text-muted-foreground text-sm line-clamp-2">{metaDesc}</p>
          </div>

          {/* Slug */}
          <div>
            <Label>Slug (URL)</Label>
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="mon-article" />
          </div>

          {/* Titles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Titre FR *</Label>
              <Input value={form.title_fr} onChange={(e) => handleTitleFrChange(e.target.value)} />
            </div>
            <div>
              <Label>Titre EN</Label>
              <Input value={form.title_en} onChange={(e) => set("title_en", e.target.value)} />
            </div>
          </div>

          {/* Excerpts */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Résumé FR</Label>
              <Textarea rows={2} value={form.excerpt_fr} onChange={(e) => set("excerpt_fr", e.target.value)} />
            </div>
            <div>
              <Label>Résumé EN</Label>
              <Textarea rows={2} value={form.excerpt_en} onChange={(e) => set("excerpt_en", e.target.value)} />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contenu FR (Markdown)</Label>
              <Textarea rows={10} value={form.content_fr} onChange={(e) => set("content_fr", e.target.value)} className="font-mono text-sm" />
            </div>
            <div>
              <Label>Contenu EN (Markdown)</Label>
              <Textarea rows={10} value={form.content_en} onChange={(e) => set("content_en", e.target.value)} className="font-mono text-sm" />
            </div>
          </div>

          {/* Meta SEO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meta Title FR</Label>
              <Input value={form.meta_title_fr} onChange={(e) => set("meta_title_fr", e.target.value)} placeholder="≤60 caractères" />
              <span className="text-xs text-muted-foreground">{form.meta_title_fr.length}/60</span>
            </div>
            <div>
              <Label>Meta Title EN</Label>
              <Input value={form.meta_title_en} onChange={(e) => set("meta_title_en", e.target.value)} />
              <span className="text-xs text-muted-foreground">{form.meta_title_en.length}/60</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meta Description FR</Label>
              <Textarea rows={2} value={form.meta_description_fr} onChange={(e) => set("meta_description_fr", e.target.value)} placeholder="≤160 caractères" />
              <span className="text-xs text-muted-foreground">{form.meta_description_fr.length}/160</span>
            </div>
            <div>
              <Label>Meta Description EN</Label>
              <Textarea rows={2} value={form.meta_description_en} onChange={(e) => set("meta_description_en", e.target.value)} />
              <span className="text-xs text-muted-foreground">{form.meta_description_en.length}/160</span>
            </div>
          </div>

          {/* Category, tags, cover */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Catégorie</Label>
              <Input value={form.category} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div>
              <Label>Tags (virgule)</Label>
              <Input value={form.tags.join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))} />
            </div>
            <div>
              <Label>Temps lecture (min)</Label>
              <Input type="number" value={form.reading_time_minutes} onChange={(e) => set("reading_time_minutes", parseInt(e.target.value) || 1)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Image couverture (URL)</Label>
              <Input value={form.cover_image_url} onChange={(e) => set("cover_image_url", e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>Auteur</Label>
              <Input value={form.author_name} onChange={(e) => set("author_name", e.target.value)} />
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center gap-3">
            <Switch checked={form.is_published} onCheckedChange={(v) => set("is_published", v)} />
            <Label>Publier</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPostForm;
