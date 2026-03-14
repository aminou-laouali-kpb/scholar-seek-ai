import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Building2, MessageSquare, FileText, BookOpen, School, Users, Mail, ArrowRight, Clock } from "lucide-react";

interface Stats {
  partnerPrograms: number;
  users: number;
  scholarships: number;
  admissions: number;
  intents: number;
  consultations: number;
  blogPosts: number;
  contactRequests: number;
}

interface RecentActivity {
  id: string;
  type: string;
  label: string;
  date: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({ partnerPrograms: 0, users: 0, scholarships: 0, admissions: 0, intents: 0, consultations: 0, blogPosts: 0, contactRequests: 0 });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [pp, u, s, a, i, c, b, cr] = await Promise.all([
        supabase.from("partner_programs").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("admin_scholarships").select("id", { count: "exact", head: true }),
        supabase.from("admin_admissions").select("id", { count: "exact", head: true }),
        supabase.from("application_intents").select("id", { count: "exact", head: true }),
        supabase.from("consultation_requests").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("contact_requests").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        partnerPrograms: pp.count ?? 0,
        users: u.count ?? 0,
        scholarships: s.count ?? 0,
        admissions: a.count ?? 0,
        intents: i.count ?? 0,
        consultations: c.count ?? 0,
        blogPosts: b.count ?? 0,
        contactRequests: cr.count ?? 0,
      });
    };

    const fetchRecent = async () => {
      const [intents, consults] = await Promise.all([
        supabase.from("application_intents").select("id, item_name, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("consultation_requests").select("id, request_type, item_name, created_at").order("created_at", { ascending: false }).limit(3),
      ]);

      const items: RecentActivity[] = [];
      intents.data?.forEach((d: any) => items.push({ id: d.id, type: "intent", label: `Application: ${d.item_name || "—"}`, date: d.created_at }));
      consults.data?.forEach((d: any) => items.push({ id: d.id, type: "consult", label: `${d.request_type}: ${d.item_name || "—"}`, date: d.created_at }));
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivity(items.slice(0, 5));
    };

    fetchStats();
    fetchRecent();
  }, []);

  const cards = [
    { label: "Partner Programs", value: stats.partnerPrograms, icon: School, color: "text-primary", link: "/admin/partner-programs" },
    { label: "Registered Users", value: stats.users, icon: Users, color: "text-accent", link: "/admin/users" },
    { label: "Scholarships", value: stats.scholarships, icon: GraduationCap, color: "text-primary", link: "/admin/scholarships" },
    { label: "Admissions", value: stats.admissions, icon: Building2, color: "text-accent", link: "/admin/admissions" },
    { label: "Application Intents", value: stats.intents, icon: FileText, color: "text-primary", link: "/admin/requests" },
    { label: "Consultation Requests", value: stats.consultations, icon: MessageSquare, color: "text-accent", link: "/admin/requests" },
    { label: "Blog Posts", value: stats.blogPosts, icon: BookOpen, color: "text-primary", link: "/admin/blog" },
    { label: "Contact Requests", value: stats.contactRequests, icon: Mail, color: "text-accent", link: "/admin/contact-requests" },
  ];

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <h1 className="font-heading font-bold text-2xl text-foreground mb-6">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.link} className="block">
              <div className="bg-card rounded-xl p-5 border border-border shadow-card hover:shadow-card-hover transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{c.label}</span>
                  <Icon className={`w-5 h-5 ${c.color}`} />
                </div>
                <div className="flex items-end justify-between">
                  <p className="font-heading font-bold text-3xl text-foreground">{c.value}</p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Recent Activity
          </h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {recentActivity.map((item, i) => (
              <div key={item.id} className={`px-5 py-3 flex items-center justify-between ${i < recentActivity.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
