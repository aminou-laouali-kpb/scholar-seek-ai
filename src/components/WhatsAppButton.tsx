import React from "react";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLocation } from "react-router-dom";
import { track } from "@/lib/analytics";

const WA_NUMBER = "33768674292";

const getContextMessage = (pathname: string, isEn: boolean): string => {
  if (pathname === "/" || pathname === "") {
    return isEn ? "Hi, I'd like to learn about studying abroad with KPB Education." : "Bonjour, j'aimerais en savoir plus sur les études à l'étranger avec KPB Éducation.";
  }
  if (pathname.startsWith("/scholarships")) {
    return isEn ? "Hi, I'm interested in scholarship opportunities." : "Bonjour, je suis intéressé(e) par les opportunités de bourses.";
  }
  if (pathname.startsWith("/destinations") || pathname.startsWith("/tools/")) {
    return isEn ? "Hi, I'd like guidance on studying in a specific country." : "Bonjour, j'aimerais être guidé(e) pour étudier dans un pays spécifique.";
  }
  if (pathname.startsWith("/partners")) {
    return isEn ? "Hi, I'm interested in your partner school programs." : "Bonjour, je suis intéressé(e) par vos programmes d'écoles partenaires.";
  }
  if (pathname.startsWith("/dashboard")) {
    return isEn ? "Hi, I need guidance on my application." : "Bonjour, j'ai besoin d'aide pour ma candidature.";
  }
  if (pathname.startsWith("/services")) {
    return isEn ? "Hi, I'd like to know more about your services." : "Bonjour, j'aimerais en savoir plus sur vos services.";
  }
  return isEn ? "Hi, I have a question about KPB Education." : "Bonjour, j'ai une question à propos de KPB Éducation.";
};

const WhatsAppButton = React.forwardRef<HTMLAnchorElement>((_, ref) => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const isEn = language === "en";
  const message = getContextMessage(location.pathname, isEn);
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      ref={ref}
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      title={t("whatsappTooltip")}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-success hover:bg-success/90 text-success-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
});

WhatsAppButton.displayName = "WhatsAppButton";

export default WhatsAppButton;
