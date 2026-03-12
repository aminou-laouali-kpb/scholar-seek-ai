import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, GraduationCap, Building2, MessageSquare, Settings, ChevronLeft, Users, LogOut, FileText, BookOpen, Mail, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/scholarships", label: "Scholarships", icon: GraduationCap },
  { path: "/admin/admissions", label: "Admissions", icon: Building2 },
  { path: "/admin/partner-programs", label: "Partner Programs", icon: BookOpen },
  { path: "/admin/requests", label: "Requests", icon: MessageSquare },
  { path: "/admin/contact-requests", label: "Contact", icon: Mail },
  { path: "/admin/questionnaire", label: "Questionnaire", icon: ClipboardList },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/blog", label: "Blog", icon: FileText },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground hidden lg:flex flex-col shrink-0">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to site
          </Link>
          <h2 className="font-heading font-bold text-lg mt-2">KPB Admin</h2>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.end);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar text-sidebar-foreground px-4 py-3 flex items-center gap-3 overflow-x-auto">
        <Link to="/" className="shrink-0">
          <ChevronLeft className="w-4 h-4" />
        </Link>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.end);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14">
        <div className="p-6 lg:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
