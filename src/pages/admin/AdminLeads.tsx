import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Flame, Search, Download, ChevronDown, ChevronUp, Bookmark, MessageSquare,
  FileText, Clock, MapPin, GraduationCap, Globe, Phone,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { exportToCsv } from "@/lib/csv";

interface LeadRow {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  whatsapp: string | null;
  country_of_residence: string | null;
  study_level: string | null;
  desired_program: string | null;
  preferred_destinations: string[] | null;
  scholarship_interest: boolean | null;
  profile_completed: boolean | null;
  created_at: string;
  // Lead score fields
  heat_level: string;
  admin_status: string;
  admin_notes: string;
  actions_count: number;
  strong_signals: number;
  last_action: string | null;
  last_action_at: string | null;
  // Counts
  saved_count: number;
  request_count: number;
  intent_count: number;
}

const HEAT_CONFIG: Record<string, { label: string; className: string }> = {
  hot: { label: "🔥 Hot", className: "bg-destructive/15 text-destructive border-destructive/30" },
  warm: { label: "🟠 Warm", className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700" },
  low: { label: "⚪ Low", className: "bg-muted text-muted-foreground border-border" },
};

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "needs_follow_up", label: "Needs Follow-up" },
  { value: "application_started", label: "Application Started" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
  { value: "not_qualified", label: "Not Qualified" },
];

const ACTION_LABELS: Record<string, string> = {
  onboarding_completed: "Onboarding completed",
  profile_completed: "Profile completed",
  orientation_completed: "Orientation completed",
  orientation_started: "Orientation started",
  application_started: "Application started",
  support_requested: "Support requested",
  consultation_requested: "Consultation requested",
  whatsapp_clicked: "WhatsApp clicked",
  recommendation_clicked: "Recommendation clicked",
  item_saved: "Item saved",
  item_unsaved: "Item unsaved",
  destination_tool_opened: "Destination tool opened",
  login: "Logged in",
};

const AdminLeads = () => {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [heatFilter, setHeatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedNotes, setExpandedNotes] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ userId: string; notes: string } | null>(null);
  const [sortBy, setSortBy] = useState<"heat" | "activity" | "created">("activity");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const fetchLeads = useCallback(async () => {
    setLoading(true);

    // Fetch profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!profiles) { setLoading(false); return; }

    // Fetch lead scores
    const { data: scores } = await (supabase as any)
      .from("lead_scores")
      .select("*");

    // Fetch saved items counts
    const { data: savedCounts } = await supabase
      .from("saved_items")
      .select("user_id");

    // Fetch request counts
    const { data: requests } = await supabase
      .from("consultation_requests")
      .select("user_id");

    // Fetch intent counts
    const { data: intents } = await supabase
      .from("application_intents")
      .select("user_id");

    const scoreMap: Record<string, any> = {};
    (scores ?? []).forEach((s: any) => { scoreMap[s.user_id] = s; });

    const countByUser = (arr: any[] | null) => {
      const map: Record<string, number> = {};
      (arr ?? []).forEach((r: any) => { map[r.user_id] = (map[r.user_id] || 0) + 1; });
      return map;
    };

    const savedMap = countByUser(savedCounts);
    const requestMap = countByUser(requests);
    const intentMap = countByUser(intents);

    const merged: LeadRow[] = profiles.map((p) => {
      const score = scoreMap[p.user_id] || {};
      return {
        user_id: p.user_id,
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email,
        whatsapp: p.whatsapp,
        country_of_residence: p.country_of_residence,
        study_level: p.study_level,
        desired_program: p.desired_program,
        preferred_destinations: p.preferred_destinations,
        scholarship_interest: p.scholarship_interest,
        profile_completed: p.profile_completed,
        created_at: p.created_at,
        heat_level: score.heat_level ?? "low",
        admin_status: score.admin_status ?? "new",
        admin_notes: score.admin_notes ?? "",
        actions_count: score.actions_count ?? 0,
        strong_signals: score.strong_signals ?? 0,
        last_action: score.last_action ?? null,
        last_action_at: score.last_action_at ?? null,
        saved_count: savedMap[p.user_id] ?? 0,
        request_count: requestMap[p.user_id] ?? 0,
        intent_count: intentMap[p.user_id] ?? 0,
      };
    });

    setLeads(merged);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleStatusChange = async (userId: string, newStatus: string) => {
    await (supabase as any)
      .from("lead_scores")
      .upsert({ user_id: userId, admin_status: newStatus }, { onConflict: "user_id" });
    setLeads((prev) => prev.map((l) => l.user_id === userId ? { ...l, admin_status: newStatus } : l));
  };

  const handleNoteSave = async () => {
    if (!editingNotes) return;
    await (supabase as any)
      .from("lead_scores")
      .upsert({ user_id: editingNotes.userId, admin_notes: editingNotes.notes }, { onConflict: "user_id" });
    setLeads((prev) => prev.map((l) => l.user_id === editingNotes.userId ? { ...l, admin_notes: editingNotes.notes } : l));
    setEditingNotes(null);
  };

  const fullName = (l: LeadRow) =>
    [l.first_name, l.last_name].filter(Boolean).join(" ") || "—";

  // Filter
  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      l.email?.toLowerCase().includes(q) ||
      l.first_name?.toLowerCase().includes(q) ||
      l.last_name?.toLowerCase().includes(q) ||
      l.country_of_residence?.toLowerCase().includes(q);
    const matchesHeat = heatFilter === "all" || l.heat_level === heatFilter;
    const matchesStatus = statusFilter === "all" || l.admin_status === statusFilter;
    return matchesSearch && matchesHeat && matchesStatus;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortDir === "desc" ? -1 : 1;
    if (sortBy === "heat") {
      const heatOrder: Record<string, number> = { hot: 3, warm: 2, low: 1 };
      return ((heatOrder[a.heat_level] ?? 0) - (heatOrder[b.heat_level] ?? 0)) * dir;
    }
    if (sortBy === "activity") {
      const aTime = a.last_action_at ? new Date(a.last_action_at).getTime() : 0;
      const bTime = b.last_action_at ? new Date(b.last_action_at).getTime() : 0;
      return (aTime - bTime) * dir;
    }
    return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir;
  });

  const toggleSort = (field: "heat" | "activity" | "created") => {
    if (sortBy === field) {
      setSortDir((d) => d === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: "heat" | "activity" | "created" }) =>
    sortBy === field ? (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : null;

  const handleExport = () => {
    exportToCsv(
      `kpb-leads-${format(new Date(), "yyyy-MM-dd")}.csv`,
      sorted.map((l) => ({
        name: fullName(l),
        email: l.email,
        whatsapp: l.whatsapp,
        country: l.country_of_residence,
        destinations: l.preferred_destinations?.join(", "),
        field: l.desired_program,
        level: l.study_level,
        scholarship_interest: l.scholarship_interest ? "Yes" : "No",
        saved_count: l.saved_count,
        requests: l.request_count,
        intents: l.intent_count,
        heat_level: l.heat_level,
        admin_status: l.admin_status,
        last_action: l.last_action ? (ACTION_LABELS[l.last_action] ?? l.last_action) : "",
        last_activity: l.last_action_at ? format(new Date(l.last_action_at), "yyyy-MM-dd HH:mm") : "",
        joined: format(new Date(l.created_at), "yyyy-MM-dd"),
        admin_notes: l.admin_notes,
      }))
    );
  };

  // Stats
  const hotCount = leads.filter((l) => l.heat_level === "hot").length;
  const warmCount = leads.filter((l) => l.heat_level === "warm").length;
  const newCount = leads.filter((l) => l.admin_status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
            <Flame className="w-6 h-6 text-destructive" />
            Student Leads
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {leads.length} total leads · {hotCount} hot · {warmCount} warm · {newCount} new
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Hot Leads", value: hotCount, icon: Flame, color: "text-destructive" },
          { label: "Warm Leads", value: warmCount, icon: Flame, color: "text-amber-500" },
          { label: "Applications", value: leads.reduce((s, l) => s + l.intent_count, 0), icon: FileText, color: "text-primary" },
          { label: "Support Requests", value: leads.reduce((s, l) => s + l.request_count, 0), icon: MessageSquare, color: "text-accent" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={heatFilter} onValueChange={setHeatFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Heat level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Heat</SelectItem>
            <SelectItem value="hot">🔥 Hot</SelectItem>
            <SelectItem value="warm">🟠 Warm</SelectItem>
            <SelectItem value="low">⚪ Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading leads…</div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm gap-2">
            <Flame className="w-8 h-8 opacity-30" />
            <p>No leads match your filters.</p>
            <p className="text-xs">Try adjusting your search or filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("heat")}>
                    <span className="flex items-center gap-1">Heat <SortIcon field="heat" /></span>
                  </TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("activity")}>
                    <span className="flex items-center gap-1">Last Activity <SortIcon field="activity" /></span>
                  </TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((lead) => {
                  const heat = HEAT_CONFIG[lead.heat_level] ?? HEAT_CONFIG.low;
                  return (
                    <TableRow key={lead.user_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{fullName(lead)}</p>
                          <p className="text-xs text-muted-foreground">{lead.email ?? "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          {lead.whatsapp && (
                            <p className="text-xs flex items-center gap-1 text-muted-foreground">
                              <Phone className="w-3 h-3" /> {lead.whatsapp}
                            </p>
                          )}
                          {lead.country_of_residence && (
                            <p className="text-xs flex items-center gap-1 text-muted-foreground">
                              <MapPin className="w-3 h-3" /> {lead.country_of_residence}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                          {lead.study_level && (
                            <p className="flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {lead.study_level}</p>
                          )}
                          {lead.desired_program && (
                            <p className="flex items-center gap-1"><Globe className="w-3 h-3" /> {lead.desired_program}</p>
                          )}
                          {lead.preferred_destinations && lead.preferred_destinations.length > 0 && (
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {lead.preferred_destinations.slice(0, 2).join(", ")}
                              {lead.preferred_destinations.length > 2 && ` +${lead.preferred_destinations.length - 2}`}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={heat.className}>{heat.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5" title="Saved items">
                            <Bookmark className="w-3 h-3" /> {lead.saved_count}
                          </span>
                          <span className="flex items-center gap-0.5" title="Support requests">
                            <MessageSquare className="w-3 h-3" /> {lead.request_count}
                          </span>
                          <span className="flex items-center gap-0.5" title="Application intents">
                            <FileText className="w-3 h-3" /> {lead.intent_count}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.admin_status}
                          onValueChange={(v) => handleStatusChange(lead.user_id, v)}
                        >
                          <SelectTrigger className="h-7 text-xs w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {lead.last_action_at ? (
                          <div className="text-xs text-muted-foreground">
                            <p className="font-medium">{ACTION_LABELS[lead.last_action ?? ""] ?? lead.last_action ?? "—"}</p>
                            <p className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(lead.last_action_at), { addSuffix: true })}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => setEditingNotes({ userId: lead.user_id, notes: lead.admin_notes })}
                        >
                          {lead.admin_notes ? "Edit" : "Add"} Notes
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Notes dialog */}
      <Dialog open={!!editingNotes} onOpenChange={() => setEditingNotes(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Notes</DialogTitle>
            <DialogDescription>
              Internal notes for this lead. Not visible to the student.
            </DialogDescription>
          </DialogHeader>
          {editingNotes && (
            <div className="space-y-3">
              <Textarea
                value={editingNotes.notes}
                onChange={(e) => setEditingNotes({ ...editingNotes, notes: e.target.value })}
                placeholder="Add internal notes about this lead…"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingNotes(null)}>Cancel</Button>
                <Button size="sm" onClick={handleNoteSave}>Save Notes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeads;
