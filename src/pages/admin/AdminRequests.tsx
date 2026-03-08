import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AppIntent {
  id: string;
  user_id: string;
  item_type: string;
  item_id: string;
  item_name: string | null;
  status: string;
  created_at: string;
}

interface ConsultRequest {
  id: string;
  user_id: string;
  request_type: string;
  item_type: string | null;
  item_id: string | null;
  item_name: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const AdminRequests = () => {
  const [intents, setIntents] = useState<AppIntent[]>([]);
  const [consults, setConsults] = useState<ConsultRequest[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const [i, c] = await Promise.all([
        supabase.from("application_intents").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("consultation_requests").select("*").order("created_at", { ascending: false }).limit(100),
      ]);
      setIntents((i.data as AppIntent[]) || []);
      setConsults((c.data as ConsultRequest[]) || []);
    };
    fetch();
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Student Requests</h1>

      <Tabs defaultValue="intents">
        <TabsList>
          <TabsTrigger value="intents">Application Intents ({intents.length})</TabsTrigger>
          <TabsTrigger value="consults">Consultation Requests ({consults.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="intents">
          <div className="bg-card rounded-xl border border-border overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Item</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {intents.map((i) => (
                    <tr key={i.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">{i.item_name || i.item_id}</td>
                      <td className="px-4 py-3"><Badge variant="secondary">{i.item_type}</Badge></td>
                      <td className="px-4 py-3"><Badge>{i.status}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(i.created_at)}</td>
                    </tr>
                  ))}
                  {intents.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No application intents yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="consults">
          <div className="bg-card rounded-xl border border-border overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Item</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Message</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {consults.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">{c.item_name || c.item_id || "—"}</td>
                      <td className="px-4 py-3"><Badge variant="secondary">{c.request_type}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{c.message || "—"}</td>
                      <td className="px-4 py-3"><Badge>{c.status}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                  {consults.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No consultation requests yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequests;
