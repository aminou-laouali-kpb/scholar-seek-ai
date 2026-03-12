import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, CheckCircle, Eye } from "lucide-react";
import { toast } from "sonner";

type ContactRequest = {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  status: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  new: "destructive",
  read: "secondary",
  resolved: "default",
};

const AdminContactRequests = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data } = await supabase.from("contact_requests").select("*").order("created_at", { ascending: false });
    setRequests((data || []) as ContactRequest[]);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contact_requests").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Marked as ${status}`);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Contact Requests</h1>
          <p className="text-muted-foreground text-sm">{requests.length} total requests</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No contact requests yet.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="max-w-xs">Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell><a href={`mailto:${r.email}`} className="text-primary underline">{r.email}</a></TableCell>
                  <TableCell><Badge variant="outline">{r.category || "—"}</Badge></TableCell>
                  <TableCell className="max-w-xs truncate">{r.message}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                  <TableCell><Badge variant={statusColors[r.status] as any || "secondary"}>{r.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {r.status === "new" && (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(r.id, "read")}><Eye className="w-4 h-4" /></Button>
                      )}
                      {r.status !== "resolved" && (
                        <Button variant="ghost" size="sm" onClick={() => updateStatus(r.id, "resolved")}><CheckCircle className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminContactRequests;
