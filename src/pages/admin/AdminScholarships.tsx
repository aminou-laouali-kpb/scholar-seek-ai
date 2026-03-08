import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import ScholarshipForm from "@/components/admin/ScholarshipForm";
import { useToast } from "@/hooks/use-toast";

export interface AdminScholarship {
  id: string;
  name: string;
  country: string;
  country_flag: string;
  programs: string[];
  levels: string[];
  description_en: string;
  description_fr: string;
  eligibility_en: string;
  eligibility_fr: string;
  deadline: string;
  funding_type: string;
  budget_friendly: boolean;
  status: string;
  is_featured: boolean;
  is_published: boolean;
  external_link: string | null;
  admin_notes: string | null;
  relevance_tags: string[];
  created_at: string;
  updated_at: string;
}

const AdminScholarships = () => {
  const [items, setItems] = useState<AdminScholarship[]>([]);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminScholarship | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase
      .from("admin_scholarships")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as AdminScholarship[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this scholarship?")) return;
    await supabase.from("admin_scholarships").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchData();
  };

  const togglePublish = async (item: AdminScholarship) => {
    await supabase.from("admin_scholarships").update({ is_published: !item.is_published }).eq("id", item.id);
    fetchData();
  };

  const filtered = items.filter((i) => {
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCountry && i.country !== filterCountry) return false;
    if (filterStatus && i.status !== filterStatus) return false;
    return true;
  });

  const countries = [...new Set(items.map((i) => i.country))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Scholarships</h1>
        <Button variant="accent" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4" /> Add Scholarship
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Country</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Levels</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Published</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-3">{item.country_flag} {item.country}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {item.levels.map((l) => <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.status === "open" ? "default" : "secondary"}>{item.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {item.is_published ? <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Live</Badge> : <Badge variant="secondary">Draft</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(item)} title={item.is_published ? "Unpublish" : "Publish"}>
                        {item.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(item); setFormOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No scholarships found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ScholarshipForm open={formOpen} onOpenChange={setFormOpen} scholarship={editing} onSaved={fetchData} />
    </div>
  );
};

export default AdminScholarships;
