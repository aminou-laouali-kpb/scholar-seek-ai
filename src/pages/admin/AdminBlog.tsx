import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, Pencil, Eye, EyeOff, Download, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BlogPostForm, { type BlogPost } from "@/components/admin/BlogPostForm";
import { exportToCsv, parseCsv } from "@/lib/csv";

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (data) setPosts(data as BlogPost[]);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Article supprimé" });
    fetchData();
  };

  const togglePublish = async (p: BlogPost) => {
    await supabase.from("blog_posts").update({
      is_published: !p.is_published,
      published_at: !p.is_published ? new Date().toISOString() : null,
    }).eq("id", p.id);
    fetchData();
  };

  const handleExport = () => {
    exportToCsv("blog_posts.csv", filtered);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    const { error } = await supabase.from("blog_posts").insert(rows.map((r: Record<string, unknown>) => ({
      slug: r.slug || "", title_fr: r.title_fr || "", title_en: r.title_en || "",
      content_fr: r.content_fr || "", content_en: r.content_en || "",
      excerpt_fr: r.excerpt_fr || "", excerpt_en: r.excerpt_en || "",
      category: r.category || "general", tags: Array.isArray(r.tags) ? r.tags : [],
      author_name: r.author_name || "KPB Team",
    })));
    if (error) toast({ title: "Erreur import", description: error.message, variant: "destructive" });
    else { toast({ title: "Import réussi" }); fetchData(); }
    e.target.value = "";
  };

  const filtered = posts.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.title_fr.toLowerCase().includes(q) || p.title_en.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Blog</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-1" />Export</Button>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer"><Upload className="w-4 h-4 mr-1" />Import<input type="file" accept=".csv" className="hidden" onChange={handleImport} /></label>
          </Button>
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}><Plus className="w-4 h-4 mr-1" />Nouvel article</Button>
        </div>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Rechercher..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title_fr || p.title_en}</TableCell>
                <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                <TableCell>
                  <Badge variant={p.is_published ? "default" : "outline"}>
                    {p.is_published ? "Publié" : "Brouillon"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(p.published_at || p.created_at).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => togglePublish(p)} title={p.is_published ? "Dépublier" : "Publier"}>
                    {p.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => { setEditing(p); setFormOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucun article</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <BlogPostForm open={formOpen} onOpenChange={setFormOpen} post={editing} onSaved={fetchData} />
    </div>
  );
};

export default AdminBlog;
