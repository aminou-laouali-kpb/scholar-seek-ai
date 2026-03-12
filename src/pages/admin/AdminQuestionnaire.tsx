import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList } from "lucide-react";

type QuestionnaireResponse = {
  id: string;
  answers: Record<string, any>;
  needs_advisor: boolean;
  user_id: string | null;
  created_at: string;
};

const AdminQuestionnaire = () => {
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("questionnaire_responses").select("*").order("created_at", { ascending: false });
      setResponses((data || []) as QuestionnaireResponse[]);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  const getAnswer = (answers: Record<string, any>, key: string) => {
    const val = answers[key];
    if (Array.isArray(val)) return val.join(", ");
    return val || "—";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Questionnaire Responses</h1>
          <p className="text-muted-foreground text-sm">{responses.length} total responses</p>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No questionnaire responses yet.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Study Level</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Destinations</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Needs Advisor</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {responses.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</TableCell>
                  <TableCell>{getAnswer(r.answers, "studyLevel")}</TableCell>
                  <TableCell>{getAnswer(r.answers, "desiredProgram")}</TableCell>
                  <TableCell>{getAnswer(r.answers, "preferredDestinations")}</TableCell>
                  <TableCell>{getAnswer(r.answers, "budgetSensitivity")}</TableCell>
                  <TableCell>{r.needs_advisor ? <Badge variant="destructive">Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.user_id ? r.user_id.slice(0, 8) + "…" : "Anonymous"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminQuestionnaire;
