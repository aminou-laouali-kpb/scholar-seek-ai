import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Star, StarOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PartnerProgramForm from "@/components/admin/PartnerProgramForm";

export interface PartnerProgram {
  id: string;
  school_name: string;
  school_slug: string;
  partner_status: string;
  country: string;
  city: string;
  campus_name: string;
  program_name: string;
  program_family: string;
  degree_level: string;
  duration: string;
  language_of_instruction: string;
  tuition_amount: string;
  tuition_currency: string;
  tuition_period: string;
  application_intake: string;
  eligibility_academic: string;
  eligibility_language: string;
  required_documents: string;
  application_process: string;
  scholarship_available: string;
  status: string;
  source_url: string;
  notes_internal: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminPartnerPrograms = () => {
  const [items, setItems] = useState<PartnerProgram[]>([]);
  const [search, setSearch] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PartnerProgram | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    const { data } = await supabase
      .from("partner_programs")
      .select("*")
      .order("school_name", { ascending: true });
    setItems((data as PartnerProgram[]) || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this program?")) return;
    await supabase.from("partner_programs").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchData();
  };

  const togglePublish = async (item: PartnerProgram) => {
    await supabase.from("partner_programs").update({ is_published: !item.is_published }).eq("id", item.id);
    fetchData();
  };

  const toggleFeatured = async (item: PartnerProgram) => {
    await supabase.from("partner_programs").update({ is_featured: !item.is_featured }).eq("id", item.id);
    fetchData();
  };

  const filtered = items.filter((i) => {
    if (search && !i.program_name.toLowerCase().includes(search.toLowerCase()) && !i.school_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSchool && i.school_slug !== filterSchool) return false;
    if (filterCountry && !i.country.toLowerCase().includes(filterCountry.toLowerCase())) return false;
    if (filterLevel && i.degree_level !== filterLevel) return false;
    if (filterStatus && i.status !== filterStatus) return false;
    return true;
  });

  const schools = [...new Set(items.map((i) => i.school_slug))].sort();
  const schoolNames: Record<string, string> = {};
  items.forEach(i => { schoolNames[i.school_slug] = i.school_name; });
  const countries = [...new Set(items.map((i) => i.country))].sort();
  const levels = [...new Set(items.map((i) => i.degree_level))].sort();

  const statusColor = (s: string) => {
    if (s === "open" || s === "rolling") return "default";
    if (s === "contact_us") return "secondary";
    return "outline";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Partner Programs</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {items.length} programs</p>
        </div>
        <Button variant="accent" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Add Program</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search programs or schools..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterSchool} onChange={(e) => setFilterSchool(e.target.value)}>
          <option value="">All Schools</option>
          {schools.map((s) => <option key={s} value={s}>{schoolNames[s]}</option>)}
        </select>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}>
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
          <option value="">All Levels</option>
          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="border border-input rounded-md px-3 py-2 text-sm bg-background" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="rolling">Rolling</option>
          <option value="contact_us">Contact Us</option>
          <option value="to_confirm">To Confirm</option>
        </select>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">School</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Program</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Country</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Level</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Tuition</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Published</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground max-w-[150px] truncate">{item.school_name}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate">{item.program_name}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">{item.city}, {item.country}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{item.degree_level}</td>
                  <td className="px-4 py-3 hidden xl:table-cell">{item.tuition_amount} {item.tuition_currency}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {item.is_published
                      ? <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Live</Badge>
                      : <Badge variant="secondary">Draft</Badge>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => toggleFeatured(item)} title={item.is_featured ? "Unfeature" : "Feature"}>
                        {item.is_featured ? <StarOff className="w-4 h-4 text-accent" /> : <Star className="w-4 h-4" />}
                      </Button>
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
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No programs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PartnerProgramForm open={formOpen} onOpenChange={setFormOpen} program={editing} onSaved={fetchData} />
    </div>
  );
};

export default AdminPartnerPrograms;
