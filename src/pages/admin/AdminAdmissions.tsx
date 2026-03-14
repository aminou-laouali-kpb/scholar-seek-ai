import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Download, Upload, Star } from "lucide-react";
import AdmissionForm from "@/components/admin/AdmissionForm";
import { useToast } from "@/hooks/use-toast";
import { exportToCsv, parseCsv } from "@/lib/csv";
import { track } from "@/lib/analytics";

export interface AdminAdmission {
  id: string;
  institution_name: string;
  country: string;
  country_flag: string;
  institution_type: string;
  programs: string[];
  levels: string[];
  intake: string;
  description_en: string;
  description_fr: string;
  why_fit_en: string;
  why_fit_fr: string;
  budget_level: string;
  status: string;
  is_featured: boolean;
  is_published: boolean;
  external_link: string | null;
  admin_notes: string | null;
  relevance_tags: string[];
  created_at: string;
  updated_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  open: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  rolling: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  opening_soon: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  closed: "bg-secondary text-muted-foreground",
  paused: "bg-secondary text-muted-foreground",
  to_confirm: "border border-amber-300 text-amber-700 dark:text-amber-400 bg-transparent",
};

const AdminAdmissions = () => {
  const [items, setItems] = useState<AdminAdmission[]>([]);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAdmission | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase
      .from("admin_admissions")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as AdminAdmission[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this admission?")) return;
    await supabase.from("admin_admissions").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchData();
  };

  const togglePublish = async (item: AdminAdmission) => {
    await supabase.from("admin_admissions").update({ is_published: !item.is_published }).eq("id", item.id);
    track(item.is_published ? "admin_unpublish" : "admin_publish", { type: "admission", id: item.id });
    fetchData();
  };

  const handleExport = () => {
    const dataToExport = filtered.map(({ created_at, updated_at, ...rest }) => rest);
    exportToCsv("admissions.csv", dataToExport);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target?.result as string;
        const parsedData = parseCsv(csvData);
        if (parsedData.length === 0) {
          toast({ title: "Error", description: "Empty or invalid CSV file.", variant: "destructive" });
          return;
        }
        const formattedData = parsedData.map(item => ({
          ...item,
          programs: Array.isArray(item.programs) ? item.programs : (item.programs ? [item.programs] : []),
          levels: Array.isArray(item.levels) ? item.levels : (item.levels ? [item.levels] : []),
          relevance_tags: Array.isArray(item.relevance_tags) ? item.relevance_tags : (item.relevance_tags ? [item.relevance_tags] : [])
        }));
        const { error } = await supabase.from("admin_admissions").upsert(formattedData);
        if (error) throw error;
        toast({ title: "Success", description: `Imported ${formattedData.length} records.` });
        fetchData();
      } catch (err: any) {
        console.error(err);
        toast({ title: "Import failed", description: err.message, variant: "destructive" });
      }
      if (e.target) e.target.value = '';
    };
    reader.readAsText(file);
  };

  const filtered = items.filter((i) => {
    if (search && !i.institution_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCountry && i.country !== filterCountry) return false;
    if (filterStatus && i.status !== filterStatus) return false;
    return true;
  });

  const countries = [...new Set(items.map((i) => i.country))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Admissions</h1>
        <div className="flex gap-2">
          <input type="file" id="csv-upload-admissions" accept=".csv" className="hidden" onChange={handleImport} />
          <Button variant="outline" onClick={() => document.getElementById('csv-upload-admissions')?.click()}>
            <Upload className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Import CSV</span>
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button variant="accent" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Add Admission</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by institution..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="rolling">Rolling</option>
          <option value="opening_soon">Opening Soon</option>
          <option value="closed">Closed</option>
          <option value="paused">Paused</option>
          <option value="to_confirm">To Confirm</option>
        </select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Institution</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Country</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Published</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <>
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        {item.is_featured && <Star className="w-3.5 h-3.5 text-accent fill-accent shrink-0" />}
                        {item.institution_name}
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.country_flag} {item.country}</td>
                    <td className="px-4 py-3 capitalize">{item.institution_type}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[item.status] || "bg-secondary text-muted-foreground"}`}>
                        {item.status.replace("_", " ")}
                      </span>
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
                  {item.admin_notes && (
                    <tr key={`${item.id}-notes`} className="border-b border-border last:border-0">
                      <td colSpan={6} className="px-4 pb-3 pt-0">
                        <p className="text-xs text-muted-foreground italic">📝 {item.admin_notes}</p>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No admissions yet. Add your first admission to start matching students.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdmissionForm open={formOpen} onOpenChange={setFormOpen} admission={editing} onSaved={fetchData} />
    </div>
  );
};

export default AdminAdmissions;
