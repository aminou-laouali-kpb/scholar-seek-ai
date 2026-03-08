import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const WA_LINK = "https://wa.me/33768674292";

const WhatsAppButton = () => {
  const { t } = useLanguage();

  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      title={t("whatsappTooltip")}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;
