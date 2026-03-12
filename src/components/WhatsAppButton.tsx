import React from "react";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const WA_LINK = "https://wa.me/33768674292";

const WhatsAppButton = React.forwardRef<HTMLAnchorElement>((_, ref) => {
  const { t } = useLanguage();

  return (
    <a
      ref={ref}
      href={WA_LINK}
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
