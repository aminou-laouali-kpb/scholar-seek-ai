import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Mail, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  category: z.string().min(1, "Please select a category"),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const categories = t("contactPage.form.categories") as string[];
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_requests" as any).insert([parsed.data] as any);
    if (error) {
      toast.error(isEn ? "Failed to send. Please try again." : "Échec de l'envoi. Veuillez réessayer.");
    } else {
      setSubmitted(true);
      toast.success(isEn ? "Message sent successfully!" : "Message envoyé avec succès !");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">{t("contactPage.title")}</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">{t("contactPage.subtitle")}</p>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl p-8 shadow-card border border-border text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent" />
                  </div>
                  <h2 className="font-heading font-bold text-xl text-foreground mb-2">
                    {isEn ? "Thank you!" : "Merci !"}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {isEn ? "We've received your message and will get back to you shortly." : "Nous avons reçu votre message et vous répondrons rapidement."}
                  </p>
                  <Button variant="accent" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", category: "", message: "" }); }}>
                    {isEn ? "Send Another Message" : "Envoyer un autre message"}
                  </Button>
                </motion.div>
              ) : (
                <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-8 shadow-card border border-border space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contactPage.form.name")}</label>
                      <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contactPage.form.email")}</label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contactPage.form.category")}</label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue placeholder={t("contactPage.form.category")} /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contactPage.form.message")}</label>
                    <Textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <Button variant="accent" size="lg" className="w-full" disabled={loading}>
                    {loading ? "..." : t("contactPage.form.submit")}
                  </Button>
                </motion.form>
              )}
            </div>
            <div className="space-y-4">
              <a href="https://wa.me/33768674292" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-success/10 p-4 rounded-xl border border-success/20 hover:bg-success/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-success" />
                <span className="font-semibold text-foreground text-sm">{t("contactPage.whatsapp")}</span>
              </a>
              <a href="mailto:info@kpbeducation.com" className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border hover:bg-secondary transition-colors">
                <Mail className="w-6 h-6 text-accent" />
                <span className="font-semibold text-foreground text-sm">{t("contactPage.email")}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
