import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Globe, LogOut, Shield, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import kpbLogo from "@/assets/kpb-logo.png";

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminRole();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/recours-gracieux", label: language === "en" ? "Appeal Tool" : "Recours Gracieux", badge: language === "en" ? "Free" : "Gratuit" },
    { path: "/destinations", label: t("nav.destinations") },
    { path: "/services", label: t("nav.services") },
    { path: "/blog", label: t("nav.blog") },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const handleSignOut = async () => {
    await signOut();
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center shrink-0">
            <img src={kpbLogo} alt="KPB Education" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive(link.path) ? "text-accent-foreground bg-accent/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
                {"badge" in link && link.badge && (
                  <Badge className="bg-accent/20 text-accent-foreground text-[10px] px-1.5 py-0 font-semibold border-0">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setLanguage(language === "en" ? "fr" : "en")}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "en" ? "FR" : "EN"}</span>
            </button>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="hidden md:block">
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard" className="hidden md:block">
                  <Button variant="accent" size="sm">{t("nav.dashboard")}</Button>
                </Link>
                <button onClick={handleSignOut} className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  <Button variant="ghost" size="sm">{t("nav.login")}</Button>
                </Link>
                <Link to="/student-platform" className="hidden md:block">
                  <Button variant="accent" size="sm">{t("nav.studentSpace")}</Button>
                </Link>
              </>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isActive(link.path) ? "text-accent-foreground bg-accent/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                  {"badge" in link && link.badge && (
                    <Badge className="bg-accent/20 text-accent-foreground text-[10px] px-1.5 py-0 font-semibold border-0">
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 px-4">
                {user ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full"><Shield className="w-4 h-4" /> Admin</Button>
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="accent" size="sm" className="w-full">{t("nav.dashboard")}</Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleSignOut}><LogOut className="w-4 h-4" /></Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">{t("nav.login")}</Button>
                    </Link>
                    <Link to="/student-platform" onClick={() => setMobileOpen(false)} className="flex-1">
                      <Button variant="accent" size="sm" className="w-full">{t("nav.studentSpace")}</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
