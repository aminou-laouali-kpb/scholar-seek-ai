import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";

const WA_LINK = "https://wa.me/33768674292";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: string;
  itemId: string;
  itemName: string;
}

const ApplicationModal = ({ open, onOpenChange, itemType, itemId, itemName }: ApplicationModalProps) => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const { user } = useAuth();
  const [step, setStep] = useState<"form" | "success">("form");
  const [requestType, setRequestType] = useState("application");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    if (requestType === "application") {
      await supabase.from("application_intents").insert({
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        item_name: itemName,
        status: "started",
      } as any);
      track("application_started", { itemType, itemId, itemName });
    }

    await supabase.from("consultation_requests").insert({
      user_id: user.id,
      request_type: requestType,
      item_type: itemType,
      item_id: itemId,
      item_name: itemName,
      message: message,
    } as any);

    if (requestType === "consultation") {
      track("consultation_requested", { itemType, itemId, itemName });
    } else if (requestType === "support") {
      track("support_requested", { itemType, itemId, itemName });
    }

    setStep("success");
    setLoading(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("form");
      setMessage("");
      setRequestType("application");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">
                {isEn ? "Start Your Application" : "Commencer votre candidature"}
              </DialogTitle>
              <DialogDescription>
                {itemName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {isEn ? "What would you like to do?" : "Que souhaitez-vous faire ?"}
                </label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="application">
                      {isEn ? "Start my application" : "Commencer ma candidature"}
                    </SelectItem>
                    <SelectItem value="consultation">
                      {isEn ? "Book a consultation" : "Réserver une consultation"}
                    </SelectItem>
                    <SelectItem value="support">
                      {isEn ? "Request support" : "Demander de l'aide"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {isEn ? "Additional message (optional)" : "Message additionnel (optionnel)"}
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isEn ? "Tell us more about your needs..." : "Dites-nous en plus sur vos besoins..."}
                  rows={3}
                />
              </div>

              <Button
                variant="accent"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? "..."
                  : isEn
                  ? "Submit Request"
                  : "Envoyer la demande"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-heading font-bold text-lg text-foreground mb-2">
              {isEn ? "Request Submitted!" : "Demande envoyée !"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {isEn
                ? "Our team will review your request and get back to you soon. You can also reach us directly on WhatsApp."
                : "Notre équipe examinera votre demande et vous recontactera bientôt. Vous pouvez aussi nous joindre directement sur WhatsApp."}
            </p>
            <div className="flex flex-col gap-2">
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <Button variant="accent" className="w-full">
                  <MessageCircle className="w-4 h-4" />
                  {isEn ? "Chat on WhatsApp" : "Discuter sur WhatsApp"}
                </Button>
              </a>
              <Button variant="outline" onClick={handleClose} className="w-full">
                {isEn ? "Back to Dashboard" : "Retour au tableau de bord"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
