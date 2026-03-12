import { useLanguage } from "@/i18n/LanguageContext";
import SEOHead from "@/components/SEOHead";

const Terms = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className="min-h-screen">
      <SEOHead
        title={isEn ? "Terms of Service — KPB Education" : "Conditions d'Utilisation — KPB Éducation"}
        description={isEn ? "Terms and conditions for using the KPB Education platform." : "Conditions générales d'utilisation de la plateforme KPB Éducation."}
      />
      <section className="gradient-hero section-padding">
        <div className="container-narrow mx-auto text-center">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-primary-foreground">
            {isEn ? "Terms of Service" : "Conditions d'Utilisation"}
          </h1>
        </div>
      </section>
      <section className="section-padding bg-background">
        <div className="container-narrow mx-auto max-w-3xl prose prose-sm">
          <p className="text-muted-foreground text-sm mb-2">{isEn ? "Last updated: March 2026" : "Dernière mise à jour : Mars 2026"}</p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "1. Acceptance of Terms" : "1. Acceptation des conditions"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "By accessing or using KPB Education's platform, tools, and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services."
              : "En accédant ou en utilisant la plateforme, les outils et les services de KPB Éducation, vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser nos services."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "2. Services Provided" : "2. Services fournis"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "KPB Education provides university search tools, scholarship matching, application guidance, and advisory services for students seeking to study abroad. Our tools provide recommendations based on the information you provide but do not guarantee admission or scholarship awards."
              : "KPB Éducation fournit des outils de recherche d'universités, de mise en correspondance de bourses, d'accompagnement aux candidatures et de conseil pour les étudiants souhaitant étudier à l'étranger. Nos outils fournissent des recommandations basées sur les informations que vous fournissez mais ne garantissent pas l'admission ou l'obtention de bourses."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "3. User Accounts" : "3. Comptes utilisateurs"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when creating your account. We reserve the right to suspend accounts that violate these terms."
              : "Vous êtes responsable du maintien de la confidentialité de vos identifiants de compte. Vous devez fournir des informations exactes lors de la création de votre compte. Nous nous réservons le droit de suspendre les comptes qui enfreignent ces conditions."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "4. Intellectual Property" : "4. Propriété intellectuelle"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "All content, tools, and materials on the KPB Education platform are the property of KPB Education. You may not reproduce, distribute, or create derivative works without our written permission."
              : "Tout le contenu, les outils et les matériaux de la plateforme KPB Éducation sont la propriété de KPB Éducation. Vous ne pouvez pas reproduire, distribuer ou créer des œuvres dérivées sans notre autorisation écrite."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "5. Limitation of Liability" : "5. Limitation de responsabilité"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "KPB Education provides guidance and recommendations but is not responsible for admission decisions made by universities or scholarship providers. Our advisory services are provided on a best-effort basis."
              : "KPB Éducation fournit des conseils et recommandations mais n'est pas responsable des décisions d'admission prises par les universités ou les fournisseurs de bourses. Nos services de conseil sont fournis sur la base du meilleur effort."}
          </p>

          <h2 className="font-heading font-bold text-xl text-foreground mt-8 mb-3">{isEn ? "6. Contact" : "6. Contact"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {isEn
              ? "For questions about these terms, contact us at info@kpbeducation.com or via WhatsApp at +33 7 68 67 42 92."
              : "Pour toute question concernant ces conditions, contactez-nous à info@kpbeducation.com ou via WhatsApp au +33 7 68 67 42 92."}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Terms;
