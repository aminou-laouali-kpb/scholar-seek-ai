import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Eye, Users, BarChart3, TrendingUp, Globe } from "lucide-react";
import { exportToCsv } from "@/lib/csv";
import { format } from "date-fns";

const STATUS_OPTIONS = ["new", "analyzed", "hot lead", "recours likely", "pivot to private", "contacted", "converted"];

const categoryLabels: Record<string, string> = {
  A: "Recours recommandé",
  B: "Possible mais faible",
  C: "Peu pertinent",
  D: "Recours + plan B",
};

const categoryColors: Record<string, string> = {
  A: "bg-success/10 text-success border-success/20",
  B: "bg-accent/10 text-accent-foreground border-accent/20",
  C: "bg-destructive/10 text-destructive border-destructive/20",
  D: "bg-primary/10 text-primary border-primary/20",
};

const AdminRecours = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("recours_submissions")
      .select("*")
      .order("created_at", { ascending: false }) as any;
    setSubmissions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchSearch =
        !search ||
        s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.country_of_residence?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || s.admin_status === filterStatus;
      const matchCategory = filterCategory === "all" || s.result_category === filterCategory;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [submissions, search, filterStatus, filterCategory]);

  // Analytics
  const stats = useMemo(() => {
    const total = submissions.length;
    const byCategory: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    let openToPrivate = 0;
    submissions.forEach((s) => {
      if (s.result_category) byCategory[s.result_category] = (byCategory[s.result_category] || 0) + 1;
      if (s.country_of_residence) byCountry[s.country_of_residence] = (byCountry[s.country_of_residence] || 0) + 1;
      if (s.open_to_private) openToPrivate++;
    });
    const topCountry = Object.entries(byCountry).sort((a, b) => b[1] - a[1])[0];
    return { total, byCategory, topCountry, openToPrivatePercent: total ? Math.round((openToPrivate / total) * 100) : 0 };
  }, [submissions]);

  const handleSave = async () => {
    if (!selectedSub) return;
    await supabase
      .from("recours_submissions")
      .update({ admin_notes: editNotes, admin_status: editStatus } as any)
      .eq("id", selectedSub.id) as any;
    setSelectedSub(null);
    fetchData();
  };

  const handleExport = () => {
    exportToCsv("recours-submissions.csv", filtered.map((s) => ({
      nom: s.full_name,
      email: s.email,
      whatsapp: s.whatsapp,
      pays: s.country_of_residence,
      nationalité: s.nationality,
      niveau_actuel: s.current_level,
      niveau_visé: s.target_level,
      domaine: s.field_of_study,
      établissements: s.institutions_applied,
      formation: s.program_applied,
      nb_refus: s.num_refusals,
      catégorie: s.result_category,
      statut: s.admin_status,
      ouvert_privé: s.open_to_private,
      budget: s.budget_range,
      urgence: s.urgency_level,
      date: s.created_at,
    })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-heading text-2xl font-bold">Recours Gracieux</h1>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" /> Exporter CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Total</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Distribution</CardTitle></CardHeader><CardContent><div className="flex gap-1 flex-wrap">{Object.entries(stats.byCategory).map(([k, v]) => <Badge key={k} variant="outline" className="text-xs">{k}: {v}</Badge>)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Globe className="w-4 h-4" /> Top pays</CardTitle></CardHeader><CardContent><p className="text-sm font-medium">{stats.topCountry ? `${stats.topCountry[0]} (${stats.topCountry[1]})` : "—"}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Ouvert privé</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{stats.openToPrivatePercent}%</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher par nom, email, pays..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {["A", "B", "C", "D"].map((c) => <SelectItem key={c} value={c}>{c} – {categoryLabels[c]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Pays</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Chargement...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucune soumission</TableCell></TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.full_name}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{s.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm">{s.country_of_residence}</TableCell>
                  <TableCell>
                    {s.result_category && (
                      <Badge variant="outline" className={categoryColors[s.result_category] || ""}>
                        {s.result_category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{s.admin_status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {format(new Date(s.created_at), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => { setSelectedSub(s); setEditNotes(s.admin_notes || ""); setEditStatus(s.admin_status || "new"); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedSub} onOpenChange={(o) => !o && setSelectedSub(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSub?.full_name}</DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-muted-foreground">Email</Label><p>{selectedSub.email}</p></div>
                <div><Label className="text-muted-foreground">WhatsApp</Label><p>{selectedSub.whatsapp}</p></div>
                <div><Label className="text-muted-foreground">Pays</Label><p>{selectedSub.country_of_residence}</p></div>
                <div><Label className="text-muted-foreground">Nationalité</Label><p>{selectedSub.nationality}</p></div>
                <div><Label className="text-muted-foreground">Niveau actuel</Label><p>{selectedSub.current_level}</p></div>
                <div><Label className="text-muted-foreground">Niveau visé</Label><p>{selectedSub.target_level}</p></div>
                <div><Label className="text-muted-foreground">Domaine</Label><p>{selectedSub.field_of_study}</p></div>
                <div><Label className="text-muted-foreground">Établissements</Label><p>{selectedSub.institutions_applied}</p></div>
                <div><Label className="text-muted-foreground">Formation</Label><p>{selectedSub.program_applied}</p></div>
                <div><Label className="text-muted-foreground">Nb refus</Label><p>{selectedSub.num_refusals}</p></div>
                <div><Label className="text-muted-foreground">Budget</Label><p>{selectedSub.budget_range || "—"}</p></div>
                <div><Label className="text-muted-foreground">Urgence</Label><p>{selectedSub.urgency_level}</p></div>
                <div><Label className="text-muted-foreground">Ouvert privé</Label><p>{selectedSub.open_to_private ? "Oui" : "Non"}</p></div>
                <div><Label className="text-muted-foreground">Catégorie</Label>
                  {selectedSub.result_category && <Badge variant="outline" className={categoryColors[selectedSub.result_category]}>{selectedSub.result_category} – {categoryLabels[selectedSub.result_category]}</Badge>}
                </div>
              </div>

              {selectedSub.refusal_reason && (
                <div><Label className="text-muted-foreground">Motif de refus</Label><p className="whitespace-pre-wrap">{selectedSub.refusal_reason}</p></div>
              )}
              {selectedSub.situation_description && (
                <div><Label className="text-muted-foreground">Situation</Label><p className="whitespace-pre-wrap">{selectedSub.situation_description}</p></div>
              )}
              {selectedSub.why_contestable && (
                <div><Label className="text-muted-foreground">Pourquoi contestable</Label><p className="whitespace-pre-wrap">{selectedSub.why_contestable}</p></div>
              )}

              {selectedSub.refusal_document_url && (
                <div>
                  <Label className="text-muted-foreground">Document joint</Label>
                  <p className="text-primary">{selectedSub.refusal_document_url}</p>
                </div>
              )}

              <hr />

              <div className="space-y-3">
                <div>
                  <Label>Statut admin</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notes admin</Label>
                  <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Notes internes..." />
                </div>
                <Button onClick={handleSave} className="w-full">Sauvegarder</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRecours;
