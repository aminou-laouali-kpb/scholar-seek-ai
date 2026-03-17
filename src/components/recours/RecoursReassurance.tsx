import { Heart } from "lucide-react";

const RecoursReassurance = () => (
  <section className="py-10 px-4 bg-primary text-primary-foreground">
    <div className="max-w-3xl mx-auto text-center space-y-3">
      <Heart className="w-6 h-6 mx-auto opacity-80" />
      <p className="font-heading font-semibold text-lg">
        Tu n'es pas seul(e) dans cette situation.
      </p>
      <p className="text-primary-foreground/70 text-sm max-w-xl mx-auto">
        Des milliers d'étudiants reçoivent des refus chaque année sur Études en France.
        L'important, c'est d'agir vite et de prendre la bonne décision.
        KPB Éducation est là pour t'aider.
      </p>
    </div>
  </section>
);

export default RecoursReassurance;
