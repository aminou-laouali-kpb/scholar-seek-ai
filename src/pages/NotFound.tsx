import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, Wrench, Globe } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const isEn = language === "en";

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const popularLinks = [
    { path: "/tools", label: isEn ? "Tools" : "Outils", icon: Wrench },
    { path: "/scholarships", label: isEn ? "Scholarships" : "Bourses", icon: GraduationCap },
    { path: "/destinations", label: isEn ? "Destinations" : "Destinations", icon: Globe },
    { path: "/blog", label: "Blog", icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading font-extrabold text-7xl text-primary mb-4">404</h1>
        <p className="text-xl text-foreground font-heading font-bold mb-2">
          {isEn ? "Page not found" : "Page introuvable"}
        </p>
        <p className="text-muted-foreground mb-8">
          {isEn
            ? "The page you're looking for doesn't exist or has been moved."
            : "La page que vous recherchez n'existe pas ou a été déplacée."}
        </p>
        <Link to="/">
          <Button variant="default" size="lg">
            {isEn ? "Back to Home" : "Retour à l'Accueil"} <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <div className="mt-10">
          <p className="text-sm text-muted-foreground mb-4">{isEn ? "Or explore:" : "Ou explorez :"}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {popularLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.path} to={link.path}>
                  <Button variant="outline" size="sm"><Icon className="w-4 h-4" />{link.label}</Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
