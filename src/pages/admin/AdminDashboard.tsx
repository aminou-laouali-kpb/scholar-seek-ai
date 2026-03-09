import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Building2, MessageSquare, FileText, BookOpen } from "lucide-react";

interface Stats {
  scholarships: number;
  admissions: number;
  intents: number;
  consultations: number;
  blogPosts: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ scholarships: 0, admissions: 0, intents: 0, consultations: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [s, a, i, c] = await Promise.all([
        supabase.from("admin_scholarships").select("id", { count: "exact", head: true }),
        supabase.from("admin_admissions").select("id", { count: "exact", head: true }),
        supabase.from("application_intents").select("id", { count: "exact", head: true }),
        supabase.from("consultation_requests").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        scholarships: s.count ?? 0,
        admissions: a.count ?? 0,
        intents: i.count ?? 0,
        consultations: c.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Scholarships", value: stats.scholarships, icon: GraduationCap, color: "text-accent" },
    { label: "Admissions", value: stats.admissions, icon: Building2, color: "text-primary" },
    { label: "Application Intents", value: stats.intents, icon: FileText, color: "text-accent" },
    { label: "Consultation Requests", value: stats.consultations, icon: MessageSquare, color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card rounded-xl p-5 border border-border shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{c.label}</span>
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <p className="font-heading font-bold text-3xl text-foreground">{c.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
