import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-heading font-bold text-xl mb-3">KPB Education</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">{t("footer.description")}</p>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/50">{t("footer.tools")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/tools/belgium" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("tools.belgium.title")}</Link></li>
              <li><Link to="/tools/france" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("tools.france.title")}</Link></li>
              <li><Link to="/tools/scholarship-test" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("tools.scholarship.title")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/50">{t("footer.company")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.about")}</Link></li>
              <li><Link to="/services" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.services")}</Link></li>
              <li><Link to="/blog" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.blog")}</Link></li>
              <li><Link to="/testimonials" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.testimonials")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/50">{t("footer.support")}</h4>
            <ul className="space-y-2.5">
              <li><Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.contact")}</Link></li>
              <li><Link to="/faq" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.faq")}</Link></li>
              <li><Link to="/student-platform" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.studentSpace")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">{t("footer.copyright")}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">{t("footer.privacy")}</Link>
            <Link to="/terms" className="text-sm text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
