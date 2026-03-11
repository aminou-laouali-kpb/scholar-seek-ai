import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Building2, MessageSquare, FileText, BookOpen, School, Users } from "lucide-react";

interface Stats {
  partnerPrograms: number;
  users: number;
  scholarships: number;
  admissions: number;
  intents: number;
  consultations: number;
  blogPosts: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ partnerPrograms: 0, users: 0, scholarships: 0, admissions: 0, intents: 0, consultations: 0, blogPosts: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [pp, u, s, a, i, c, b] = await Promise.all([
        supabase.from("partner_programs").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("admin_scholarships").select("id", { count: "exact", head: true }),
        supabase.from("admin_admissions").select("id", { count: "exact", head: true }),
        supabase.from("application_intents").select("id", { count: "exact", head: true }),
        supabase.from("consultation_requests").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        partnerPrograms: pp.count ?? 0,
        users: u.count ?? 0,
        scholarships: s.count ?? 0,
        admissions: a.count ?? 0,
        intents: i.count ?? 0,
        consultations: c.count ?? 0,
        blogPosts: b.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Partner Programs", value: stats.partnerPrograms, icon: School, color: "text-primary" },
    { label: "Registered Users", value: stats.users, icon: Users, color: "text-accent" },
    { label: "Scholarships", value: stats.scholarships, icon: GraduationCap, color: "text-primary" },
    { label: "Admissions", value: stats.admissions, icon: Building2, color: "text-accent" },
    { label: "Application Intents", value: stats.intents, icon: FileText, color: "text-primary" },
    { label: "Consultation Requests", value: stats.consultations, icon: MessageSquare, color: "text-accent" },
    { label: "Blog Posts", value: stats.blogPosts, icon: BookOpen, color: "text-primary" },
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
