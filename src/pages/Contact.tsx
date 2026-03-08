import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Phone } from "lucide-react";

const Contact = () => {
  const { t } = useLanguage();
  const categories = t("contactPage.form.categories") as string[];

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
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-8 shadow-card border border-border space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contactPage.form.name")}</label>
                    <Input />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contactPage.form.email")}</label>
                    <Input type="email" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contactPage.form.category")}</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder={t("contactPage.form.category")} /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{t("contactPage.form.message")}</label>
                  <Textarea rows={5} />
                </div>
                <Button variant="accent" size="lg" className="w-full">{t("contactPage.form.submit")}</Button>
              </motion.form>
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
