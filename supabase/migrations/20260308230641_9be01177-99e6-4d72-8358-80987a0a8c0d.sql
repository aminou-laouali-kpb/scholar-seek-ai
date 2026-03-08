
-- Admin Scholarships table
CREATE TABLE public.admin_scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  country_flag TEXT NOT NULL DEFAULT '',
  programs TEXT[] NOT NULL DEFAULT '{}',
  levels TEXT[] NOT NULL DEFAULT '{}',
  description_en TEXT NOT NULL DEFAULT '',
  description_fr TEXT NOT NULL DEFAULT '',
  eligibility_en TEXT NOT NULL DEFAULT '',
  eligibility_fr TEXT NOT NULL DEFAULT '',
  deadline TEXT NOT NULL DEFAULT '',
  funding_type TEXT NOT NULL DEFAULT 'partial',
  budget_friendly BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'open',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  external_link TEXT,
  admin_notes TEXT,
  relevance_tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin Admissions table
CREATE TABLE public.admin_admissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_name TEXT NOT NULL,
  country TEXT NOT NULL,
  country_flag TEXT NOT NULL DEFAULT '',
  institution_type TEXT NOT NULL DEFAULT 'university',
  programs TEXT[] NOT NULL DEFAULT '{}',
  levels TEXT[] NOT NULL DEFAULT '{}',
  intake TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_fr TEXT NOT NULL DEFAULT '',
  why_fit_en TEXT NOT NULL DEFAULT '',
  why_fit_fr TEXT NOT NULL DEFAULT '',
  budget_level TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  external_link TEXT,
  admin_notes TEXT,
  relevance_tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_admissions ENABLE ROW LEVEL SECURITY;

-- RLS: Authenticated users can read published items
CREATE POLICY "Anyone can read published scholarships"
  ON public.admin_scholarships FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Anyone can read published admissions"
  ON public.admin_admissions FOR SELECT
  TO authenticated
  USING (is_published = true);

-- RLS: Admins can do everything
CREATE POLICY "Admins can manage scholarships"
  ON public.admin_scholarships FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage admissions"
  ON public.admin_admissions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can also read application_intents and consultation_requests
CREATE POLICY "Admins can view all intents"
  ON public.application_intents FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all consultation requests"
  ON public.consultation_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all profiles (for request context)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at triggers
CREATE TRIGGER update_admin_scholarships_updated_at
  BEFORE UPDATE ON public.admin_scholarships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_admissions_updated_at
  BEFORE UPDATE ON public.admin_admissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed scholarships
INSERT INTO public.admin_scholarships (name, country, country_flag, programs, levels, description_en, description_fr, eligibility_en, eligibility_fr, deadline, funding_type, budget_friendly, status, is_published) VALUES
('Eiffel Excellence Scholarship', 'FR', '🇫🇷', '{"engineering","sciences","law","economics","business","politicalScience"}', '{"master","phd"}', 'Prestigious French government scholarship for outstanding international students pursuing Master''s or PhD programs in France.', 'Bourse prestigieuse du gouvernement français pour les étudiants internationaux exceptionnels poursuivant un Master ou un Doctorat en France.', 'Non-French nationals, under 25 (Master) or 30 (PhD), strong academic record required.', 'Non-français, moins de 25 ans (Master) ou 30 ans (PhD), excellent dossier académique requis.', 'January 2026', 'full', true, 'open', true),
('Campus France BGF Scholarship', 'FR', '🇫🇷', '{"businessAdmin","computerScience","civilEngineering","medicine","agriculture"}', '{"bachelor","master"}', 'French government scholarship managed by Campus France for students from partner countries in Africa.', 'Bourse du gouvernement français gérée par Campus France pour les étudiants des pays partenaires en Afrique.', 'Citizens of eligible African countries, enrolled in French higher education institutions.', 'Ressortissants de pays africains éligibles, inscrits dans des établissements d''enseignement supérieur français.', 'March 2026', 'partial', true, 'open', true),
('ARES Scholarship Belgium', 'BE', '🇧🇪', '{"agriculture","engineering","health","environmentalScience","education"}', '{"master","phd"}', 'Belgian development cooperation scholarship for students from developing countries pursuing studies in French-speaking Belgian universities.', 'Bourse de coopération belge pour les étudiants de pays en développement dans les universités francophones de Belgique.', 'Citizens of eligible developing countries, under 35 (Master) or 40 (PhD), relevant work experience preferred.', 'Ressortissants de pays en développement éligibles, moins de 35 ans (Master) ou 40 ans (PhD), expérience professionnelle pertinente souhaitée.', 'February 2026', 'full', true, 'open', true),
('VLIR-UOS Scholarship', 'BE', '🇧🇪', '{"computerScience","civilEngineering","biology","environmentalScience"}', '{"master"}', 'Scholarship from Flemish universities for students from developing countries to study English-taught Master''s programs in Belgium.', 'Bourse des universités flamandes pour les étudiants de pays en développement pour des programmes de Master en anglais en Belgique.', 'Citizens of VLIR-UOS partner countries, relevant Bachelor''s degree, maximum 35 years old.', 'Ressortissants de pays partenaires VLIR-UOS, licence pertinente, maximum 35 ans.', 'February 2026', 'full', true, 'open', true),
('Vanier Canada Graduate Scholarship', 'CA', '🇨🇦', '{"sciences","engineering","health","socialSciences"}', '{"phd"}', 'Canada''s most prestigious doctoral scholarship, worth $50,000/year for 3 years, open to international students.', 'La bourse doctorale la plus prestigieuse du Canada, d''une valeur de 50 000$/an pendant 3 ans, ouverte aux étudiants internationaux.', 'Nominated by a Canadian university, strong research record, leadership qualities.', 'Nominé par une université canadienne, solide dossier de recherche, qualités de leadership.', 'November 2025', 'full', true, 'open', true),
('CSC Chinese Government Scholarship', 'CN', '🇨🇳', '{"engineering","computerScience","medicine","economics","languages","agriculture"}', '{"bachelor","master","phd"}', 'Full scholarship from the Chinese government covering tuition, accommodation, living stipend, and health insurance.', 'Bourse complète du gouvernement chinois couvrant les frais de scolarité, l''hébergement, une allocation de vie et l''assurance maladie.', 'Non-Chinese citizens, good health, academic requirements vary by program level.', 'Non-chinois, bonne santé, les exigences académiques varient selon le niveau du programme.', 'April 2026', 'full', true, 'open', true),
('Confucius Institute Scholarship', 'CN', '🇨🇳', '{"languages","education","arts"}', '{"bachelor","master"}', 'Scholarship for students interested in Chinese language and culture studies at designated Chinese universities.', 'Bourse pour les étudiants intéressés par les études de langue et culture chinoises dans des universités chinoises désignées.', 'Non-Chinese nationals, HSK test results may be required, age limits vary by program.', 'Non-chinois, résultats HSK éventuellement requis, limites d''âge variables selon le programme.', 'May 2026', 'full', true, 'open', true),
('Fulbright Foreign Student Program', 'US', '🇺🇸', '{"sciences","arts","socialSciences","engineering","business"}', '{"master","phd"}', 'One of the world''s most prestigious scholarship programs, funding graduate study and research in the United States.', 'L''un des programmes de bourses les plus prestigieux au monde, finançant les études supérieures et la recherche aux États-Unis.', 'Applicants from eligible countries, Bachelor''s degree required, strong academic and leadership record.', 'Candidats de pays éligibles, licence requise, excellent dossier académique et de leadership.', 'October 2025', 'full', true, 'open', true),
('Lester B. Pearson International Scholarship', 'CA', '🇨🇦', '{"sciences","arts","business","engineering","health"}', '{"bachelor"}', 'University of Toronto''s most prestigious scholarship for exceptional international students, covering 4 years of tuition and living expenses.', 'La bourse la plus prestigieuse de l''Université de Toronto pour les étudiants internationaux exceptionnels, couvrant 4 ans de frais de scolarité et de subsistance.', 'Nominated by high school, outstanding academic achievement and leadership.', 'Nominé par le lycée, résultats académiques exceptionnels et leadership.', 'January 2026', 'full', true, 'open', true),
('Mastercard Foundation Scholars Program', 'CA', '🇨🇦', '{"business","engineering","health","agriculture","education"}', '{"bachelor","master"}', 'Full scholarship for talented yet economically disadvantaged students from Africa, at partner universities in Canada.', 'Bourse complète pour les étudiants talentueux mais économiquement défavorisés d''Afrique, dans des universités partenaires au Canada.', 'African citizens, demonstrated financial need, strong academic record, commitment to giving back.', 'Citoyens africains, besoin financier démontré, excellent dossier académique, engagement à redonner.', 'December 2025', 'full', true, 'open', true),
('Bourse Excellence-Major', 'FR', '🇫🇷', '{"sciences","engineering","business","arts","law"}', '{"bachelor","master"}', 'Scholarship for top students from French high schools abroad who wish to continue studies in France.', 'Bourse pour les meilleurs élèves des lycées français à l''étranger souhaitant poursuivre leurs études en France.', 'Non-French students from AEFE network schools, excellent baccalaureate results.', 'Étudiants non-français des établissements du réseau AEFE, excellents résultats au baccalauréat.', 'April 2026', 'full', true, 'open', true),
('WBI Excellence Scholarship', 'BE', '🇧🇪', '{"arts","sciences","engineering","agriculture"}', '{"master","phd"}', 'Wallonia-Brussels International scholarship for students from partner countries pursuing advanced studies in Wallonia or Brussels.', 'Bourse Wallonie-Bruxelles International pour les étudiants de pays partenaires poursuivant des études avancées en Wallonie ou à Bruxelles.', 'Citizens of eligible partner countries, strong academic record, relevant professional experience.', 'Ressortissants de pays partenaires éligibles, excellent dossier académique, expérience professionnelle pertinente.', 'March 2026', 'partial', true, 'open', true),
('Community Colleges for International Development', 'US', '🇺🇸', '{"business","computerScience","engineering","nursing","hospitalityTourism"}', '{"bachelor"}', 'Affordable pathway scholarships at US community colleges with guaranteed transfer to 4-year universities.', 'Bourses de parcours abordables dans les community colleges américains avec transfert garanti vers des universités de 4 ans.', 'International students, high school diploma, English proficiency (TOEFL/IELTS).', 'Étudiants internationaux, diplôme de fin d''études secondaires, maîtrise de l''anglais (TOEFL/IELTS).', 'Rolling admissions', 'partial', true, 'open', true),
('Chinese Provincial Government Scholarships', 'CN', '🇨🇳', '{"medicine","engineering","economics","computerScience","agriculture"}', '{"bachelor","master"}', 'Regional scholarships offered by Chinese provinces covering partial or full tuition for international students.', 'Bourses régionales offertes par les provinces chinoises couvrant partiellement ou totalement les frais de scolarité pour les étudiants internationaux.', 'Non-Chinese citizens, enrolled in a university in the sponsoring province.', 'Non-chinois, inscrits dans une université de la province sponsor.', 'June 2026', 'partial', true, 'open', true),
('Québec Merit Scholarship for Foreign Students', 'CA', '🇨🇦', '{"sciences","arts","engineering","business","health"}', '{"master","phd"}', 'Quebec government scholarship exempting international students from higher tuition fees and providing a living stipend.', 'Bourse du gouvernement du Québec exemptant les étudiants internationaux des frais de scolarité majorés et offrant une allocation de vie.', 'Admitted to a Quebec university, strong academic record, research project alignment.', 'Admis dans une université québécoise, excellent dossier académique, alignement du projet de recherche.', 'November 2025', 'partial', true, 'open', true),
('Emile Boutmy Scholarship – Sciences Po', 'FR', '🇫🇷', '{"politicalScience","internationalRelations","economics","law"}', '{"bachelor","master"}', 'Scholarship at Sciences Po Paris for talented international students from outside the EU, based on academic excellence.', 'Bourse à Sciences Po Paris pour les étudiants internationaux talentueux hors UE, basée sur l''excellence académique.', 'Non-EU students admitted to Sciences Po, demonstrated financial need, strong academic record.', 'Étudiants non-UE admis à Sciences Po, besoin financier démontré, excellent dossier académique.', 'May 2026', 'partial', true, 'open', true),
('Aga Khan Foundation International Scholarship', 'US', '🇺🇸', '{"health","education","agriculture","engineering","business"}', '{"master"}', 'Need-based scholarship for outstanding students from developing countries pursuing graduate studies.', 'Bourse basée sur le besoin pour les étudiants exceptionnels des pays en développement poursuivant des études supérieures.', 'Citizens of eligible developing countries, admitted to a reputable university, demonstrated financial need.', 'Ressortissants de pays en développement éligibles, admis dans une université réputée, besoin financier démontré.', 'March 2026', 'partial', true, 'open', true),
('KU Leuven Science & Technology Scholarship', 'BE', '🇧🇪', '{"sciences","engineering","computerScience","biology"}', '{"master"}', 'Merit-based scholarship at one of Belgium''s top universities for international students in STEM fields.', 'Bourse au mérite dans l''une des meilleures universités belges pour les étudiants internationaux en STEM.', 'International students admitted to a Science & Technology Master''s, strong academic record.', 'Étudiants internationaux admis en Master Sciences & Technologies, excellent dossier académique.', 'February 2026', 'partial', true, 'open', true);

-- Seed admissions
INSERT INTO public.admin_admissions (institution_name, country, country_flag, institution_type, programs, levels, intake, description_en, description_fr, why_fit_en, why_fit_fr, budget_level, status, is_published) VALUES
('UCLouvain', 'BE', '🇧🇪', 'university', '{"engineering","sciences","business","law","health"}', '{"bachelor","master"}', 'September 2026', 'One of Belgium''s leading French-speaking universities, UCLouvain offers a wide range of programs with strong international support.', 'L''une des principales universités francophones de Belgique, UCLouvain offre un large éventail de programmes avec un excellent soutien international.', 'Strong French-language programs, affordable tuition, welcoming to African students.', 'Programmes francophones solides, frais de scolarité abordables, accueil des étudiants africains.', 'medium', 'open', true),
('Université Libre de Bruxelles (ULB)', 'BE', '🇧🇪', 'university', '{"politicalScience","economics","engineering","medicine","arts"}', '{"bachelor","master","phd"}', 'September 2026', 'Located in the heart of Brussels, ULB is known for research excellence and a vibrant international campus.', 'Située au cœur de Bruxelles, l''ULB est réputée pour l''excellence de la recherche et un campus international dynamique.', 'Central European location, diverse student body, programs in French and English.', 'Emplacement central en Europe, corps étudiant diversifié, programmes en français et en anglais.', 'medium', 'open', true),
('Sorbonne Université', 'FR', '🇫🇷', 'university', '{"sciences","arts","medicine","languages","law"}', '{"bachelor","master","phd"}', 'September 2026', 'World-renowned Parisian university combining a rich academic tradition with cutting-edge research.', 'Université parisienne de renommée mondiale combinant une riche tradition académique et une recherche de pointe.', 'Prestigious degree, vibrant campus life in Paris, strong academic support.', 'Diplôme prestigieux, vie de campus dynamique à Paris, soutien académique solide.', 'medium', 'open', true),
('Université Jean Moulin Lyon 3', 'FR', '🇫🇷', 'university', '{"law","business","languages","politicalScience","internationalRelations"}', '{"bachelor","master"}', 'September 2026', 'A leading university in Lyon with strong programs in law, business, and humanities — popular with international students.', 'Une université de premier plan à Lyon avec de solides programmes en droit, commerce et sciences humaines — populaire auprès des étudiants internationaux.', 'Lower cost of living than Paris, strong international partnerships, quality education.', 'Coût de la vie plus bas qu''à Paris, solides partenariats internationaux, enseignement de qualité.', 'low', 'open', true),
('University of Ottawa', 'CA', '🇨🇦', 'university', '{"engineering","business","health","sciences","law"}', '{"bachelor","master"}', 'September 2026 / January 2027', 'Canada''s largest bilingual university, offering programs in both English and French with strong support for international students.', 'La plus grande université bilingue du Canada, offrant des programmes en anglais et en français avec un excellent soutien aux étudiants internationaux.', 'Bilingual (EN/FR), immigration-friendly, co-op programs for work experience.', 'Bilingue (EN/FR), favorable à l''immigration, programmes coopératifs pour l''expérience de travail.', 'high', 'open', true),
('Université Laval', 'CA', '🇨🇦', 'university', '{"agriculture","education","sciences","engineering","business"}', '{"bachelor","master","phd"}', 'September 2026', 'Major French-speaking university in Quebec City with affordable tuition for international students from francophone Africa.', 'Grande université francophone à Québec avec des frais de scolarité abordables pour les étudiants internationaux d''Afrique francophone.', 'French-language programs, lower tuition for Francophone students, immigration pathways.', 'Programmes en français, frais réduits pour les étudiants francophones, voies d''immigration.', 'medium', 'open', true),
('Zhejiang University', 'CN', '🇨🇳', 'university', '{"engineering","computerScience","medicine","economics","sciences"}', '{"bachelor","master","phd"}', 'September 2026', 'Top-ranked Chinese university offering English-taught programs and strong CSC scholarship eligibility.', 'Université chinoise de haut rang offrant des programmes enseignés en anglais et une forte éligibilité aux bourses CSC.', 'CSC scholarship eligible, English-taught programs, very low cost of living.', 'Éligible aux bourses CSC, programmes en anglais, coût de la vie très faible.', 'low', 'open', true),
('Beijing Normal University', 'CN', '🇨🇳', 'university', '{"education","languages","arts","sciences","psychology"}', '{"bachelor","master"}', 'September 2026', 'Leading Chinese university for education and humanities, with Chinese language programs and international student support.', 'Université chinoise de premier plan pour l''éducation et les sciences humaines, avec des programmes de langue chinoise et un soutien aux étudiants internationaux.', 'Ideal for education and language studies, scholarship opportunities, cultural immersion.', 'Idéal pour les études en éducation et langues, opportunités de bourses, immersion culturelle.', 'low', 'open', true),
('Arizona State University', 'US', '🇺🇸', 'university', '{"business","engineering","computerScience","communication","arts"}', '{"bachelor","master"}', 'Fall 2026 / Spring 2027', 'One of the most innovative universities in the US with strong international student support and merit scholarships.', 'L''une des universités les plus innovantes des États-Unis avec un excellent soutien aux étudiants internationaux et des bourses au mérite.', 'Innovation-driven, strong scholarships, excellent career services.', 'Axée sur l''innovation, excellentes bourses, services de carrière de qualité.', 'high', 'open', true),
('Santa Monica College', 'US', '🇺🇸', 'community-college', '{"business","computerScience","arts","communication","engineering"}', '{"bachelor"}', 'Fall 2026 / Spring 2027', 'Top-rated community college with the highest UCLA transfer rate, offering an affordable pathway to top US universities.', 'Community college très bien classé avec le meilleur taux de transfert vers UCLA, offrant un parcours abordable vers les meilleures universités américaines.', 'Affordable entry, guaranteed transfer agreements, support for international students.', 'Entrée abordable, accords de transfert garantis, soutien aux étudiants internationaux.', 'medium', 'open', true),
('ISEP Paris (Institut Supérieur d''Électronique de Paris)', 'FR', '🇫🇷', 'grande-ecole', '{"computerScience","engineering","telecommunications"}', '{"bachelor","master"}', 'September 2026', 'Prestigious French grande école specializing in digital technology, cybersecurity, and software engineering.', 'Grande école française prestigieuse spécialisée dans les technologies numériques, la cybersécurité et l''ingénierie logicielle.', 'Industry-connected curriculum, internship opportunities, Paris location.', 'Programme connecté à l''industrie, opportunités de stage, localisation à Paris.', 'high', 'open', true),
('Université de Mons (UMONS)', 'BE', '🇧🇪', 'university', '{"engineering","sciences","education","economics","psychology"}', '{"bachelor","master"}', 'September 2026', 'Dynamic Belgian university with lower living costs, strong engineering faculty, and welcoming international community.', 'Université belge dynamique avec un coût de la vie réduit, une forte faculté d''ingénierie et une communauté internationale accueillante.', 'Very affordable, strong support for international students, quality French-language education.', 'Très abordable, excellent soutien aux étudiants internationaux, enseignement de qualité en français.', 'low', 'open', true),
('Wuhan University', 'CN', '🇨🇳', 'university', '{"medicine","engineering","economics","computerScience","law"}', '{"bachelor","master","phd"}', 'September 2026', 'Historic top Chinese university offering English-taught programs in medicine, engineering, and business.', 'Université chinoise historique de premier rang offrant des programmes en anglais en médecine, ingénierie et commerce.', 'CSC eligible, English programs available, beautiful campus, extremely affordable.', 'Éligible CSC, programmes en anglais disponibles, campus magnifique, extrêmement abordable.', 'low', 'open', true);
