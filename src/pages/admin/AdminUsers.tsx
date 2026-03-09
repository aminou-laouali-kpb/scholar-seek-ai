import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users, Search, ShieldCheck, ShieldOff, Eye, CheckCircle2, XCircle,
  MapPin, GraduationCap, Globe, Download,
} from "lucide-react";
import { format } from "date-fns";
import { exportToCsv } from "@/lib/csv";

interface UserRow {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  whatsapp: string | null;
  country_of_residence: string | null;
  country_of_birth: string | null;
  study_level: string | null;
  desired_program: string | null;
  orientation_result: string | null;
  preferred_destinations: string[] | null;
  budget_sensitivity: string | null;
  scholarship_interest: boolean | null;
  profile_completed: boolean | null;
  created_at: string;
  role: "admin" | "user" | "moderator";
}

const AdminUsers = () => {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserRow | null>(null);
  const [confirmAction, setConfirmAction] = useState<"promote" | "demote">("promote");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !profiles) {
      setLoading(false);
      return;
    }

    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    const roleMap: Record<string, "admin" | "user" | "moderator"> = {};
    (roles ?? []).forEach((r) => {
      // Keep highest role: admin > moderator > user
      const current = roleMap[r.user_id];
      const rank = { admin: 3, moderator: 2, user: 1 };
      if (!current || rank[r.role] > rank[current]) roleMap[r.user_id] = r.role;
    });

    const merged: UserRow[] = profiles.map((p) => ({
      ...p,
      role: roleMap[p.user_id] ?? "user",
    }));

    setUsers(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q) ||
      u.country_of_residence?.toLowerCase().includes(q)
    );
  });

  const handleRoleToggle = async () => {
    if (!confirmUser || !adminUser) return;
    setProcessing(confirmUser.user_id);

    if (confirmAction === "promote") {
      await supabase.from("user_roles").upsert(
        { user_id: confirmUser.user_id, role: "admin" },
        { onConflict: "user_id,role" }
      );
    } else {
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", confirmUser.user_id)
        .eq("role", "admin");
    }

    setConfirmUser(null);
    setProcessing(null);
    await fetchUsers();
  };

  const openRoleConfirm = (u: UserRow, action: "promote" | "demote") => {
    setConfirmUser(u);
    setConfirmAction(action);
  };

  const handleExport = () => {
    exportToCsv(
      `kpb-users-${format(new Date(), "yyyy-MM-dd")}.csv`,
      filtered.map(({ user_id: _uid, ...rest }) => rest)
    );
  };

  const fullName = (u: UserRow) =>
    [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";

  const roleBadge = (role: UserRow["role"]) => {
    if (role === "admin")
      return <Badge className="bg-primary/20 text-primary border-primary/30 font-medium">Admin</Badge>;
    if (role === "moderator")
      return <Badge variant="secondary">Moderator</Badge>;
    return <Badge variant="outline" className="text-muted-foreground">User</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: users.length, icon: Users },
          { label: "Admins", value: users.filter((u) => u.role === "admin").length, icon: ShieldCheck },
          {
            label: "Profile complete",
            value: users.filter((u) => u.profile_completed).length,
            icon: CheckCircle2,
          },
          {
            label: "Incomplete",
            value: users.filter((u) => !u.profile_completed).length,
            icon: XCircle,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            Loading users…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
            No users found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.user_id} className="group">
                  <TableCell className="font-medium">{fullName(u)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.email ?? "—"}</TableCell>
                  <TableCell>{roleBadge(u.role)}</TableCell>
                  <TableCell>
                    {u.profile_completed ? (
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <XCircle className="w-3.5 h-3.5" /> Incomplete
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {u.country_of_residence ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(u.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 gap-1 text-xs"
                        onClick={() => setSelectedUser(u)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Button>
                      {u.user_id !== adminUser?.id && (
                        u.role === "admin" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={processing === u.user_id}
                            onClick={() => openRoleConfirm(u, "demote")}
                          >
                            <ShieldOff className="w-3.5 h-3.5" />
                            Remove Admin
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10"
                            disabled={processing === u.user_id}
                            onClick={() => openRoleConfirm(u, "promote")}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Make Admin
                          </Button>
                        )
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Profile detail dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedUser ? fullName(selectedUser) : ""}</DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Role", value: selectedUser.role, icon: ShieldCheck },
                  {
                    label: "Profile",
                    value: selectedUser.profile_completed ? "Complete" : "Incomplete",
                    icon: CheckCircle2,
                  },
                  { label: "WhatsApp", value: selectedUser.whatsapp ?? "—", icon: Globe },
                  {
                    label: "Country of birth",
                    value: selectedUser.country_of_birth ?? "—",
                    icon: MapPin,
                  },
                  {
                    label: "Country of residence",
                    value: selectedUser.country_of_residence ?? "—",
                    icon: MapPin,
                  },
                  {
                    label: "Study level",
                    value: selectedUser.study_level ?? "—",
                    icon: GraduationCap,
                  },
                  {
                    label: "Desired program",
                    value: selectedUser.desired_program ?? "—",
                    icon: GraduationCap,
                  },
                  {
                    label: "Budget sensitivity",
                    value: selectedUser.budget_sensitivity ?? "—",
                    icon: Globe,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-muted/40 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </div>
                    <p className="text-sm font-medium text-foreground capitalize">{value}</p>
                  </div>
                ))}
              </div>

              {selectedUser.preferred_destinations && selectedUser.preferred_destinations.length > 0 && (
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Preferred destinations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedUser.preferred_destinations.map((d) => (
                      <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.orientation_result && (
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Orientation result</p>
                  <p className="text-sm font-medium text-foreground">{selectedUser.orientation_result}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-muted-foreground">
                  Scholarship interest:{" "}
                  <span className="font-medium text-foreground">
                    {selectedUser.scholarship_interest ? "Yes" : "No"}
                  </span>
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  Joined {format(new Date(selectedUser.created_at), "PPP")}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Role change confirmation */}
      <AlertDialog open={!!confirmUser} onOpenChange={() => setConfirmUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "promote" ? "Promote to admin?" : "Remove admin role?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "promote"
                ? `${confirmUser ? fullName(confirmUser) : "This user"} will gain full admin access to the dashboard.`
                : `${confirmUser ? fullName(confirmUser) : "This user"} will lose admin access immediately.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRoleToggle}
              className={confirmAction === "demote" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {confirmAction === "promote" ? "Promote" : "Remove Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
