import { useLanguage } from "@/i18n/LanguageContext";
import SEOHead from "@/components/SEOHead";

const Privacy = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="min-h-screen">
      <SEOHead
        title={isEn ? "Privacy Policy — KPB Education" : "Politique de Confidentialité — KPB Éducation"}
        description={isEn ? "Learn how KPB Education collects, uses and protects your personal data." : "Découvrez comment KPB Éducation collecte, utilise et protège vos données personnelles."}
      />
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">
            {isEn ? "Privacy Policy" : "Politique de Confidentialité"}
          </h1>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-3xl prose prose-sm">
          <p className="text-muted-foreground text-sm mb-2">{isEn ? "Last updated: March 2026" : "Dernière mise à jour : Mars 2026"}</p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "1. Data We Collect" : "1. Données collectées"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "We collect information you provide when creating an account (name, email, phone number, country, study level, desired program) and data generated through your use of our platform (saved items, quiz responses, page views)."
              : "Nous collectons les informations que vous fournissez lors de la création de votre compte (nom, email, téléphone, pays, niveau d'études, programme souhaité) et les données générées par votre utilisation de la plateforme (éléments sauvegardés, réponses aux questionnaires, pages visitées)."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "2. How We Use Your Data" : "2. Utilisation de vos données"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "Your data is used to: personalize scholarship and university recommendations, improve our tools, communicate with you about your application, and provide customer support via WhatsApp or email."
              : "Vos données sont utilisées pour : personnaliser les recommandations de bourses et d'universités, améliorer nos outils, communiquer avec vous concernant votre candidature, et fournir un support client via WhatsApp ou email."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "3. Data Protection" : "3. Protection des données"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "We implement industry-standard security measures including encrypted connections (HTTPS), secure database storage with row-level security, and access controls. We do not sell your personal data to third parties."
              : "Nous mettons en œuvre des mesures de sécurité standard incluant des connexions chiffrées (HTTPS), un stockage sécurisé avec des contrôles d'accès au niveau des lignes, et des contrôles d'accès. Nous ne vendons pas vos données personnelles à des tiers."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "4. Third-Party Services" : "4. Services tiers"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "We use Google OAuth for authentication. When you sign in with Google, we receive your name and email. We also use WhatsApp for direct communication at your request."
              : "Nous utilisons Google OAuth pour l'authentification. Lorsque vous vous connectez avec Google, nous recevons votre nom et votre email. Nous utilisons également WhatsApp pour la communication directe à votre demande."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "5. Your Rights" : "5. Vos droits"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "You have the right to access, modify, or delete your personal data at any time. To exercise these rights, contact us at info@kpbeducation.com."
              : "Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles à tout moment. Pour exercer ces droits, contactez-nous à info@kpbeducation.com."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "6. Contact" : "6. Contact"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "For any questions about this privacy policy, please contact us at info@kpbeducation.com or via WhatsApp at +33 7 68 67 42 92."
              : "Pour toute question concernant cette politique de confidentialité, contactez-nous à info@kpbeducation.com ou via WhatsApp au +33 7 68 67 42 92."}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
