export interface AdmissionOpportunity {
  id: string;
  country: string;
  countryFlag: string;
  institutionName: string;
  institutionType: string;
  programs: string[];
  levels: string[];
  intake: string;
  description: { en: string; fr: string };
  whyFit: { en: string; fr: string };
  budgetLevel: string;
}

export const admissions: AdmissionOpportunity[] = [
  {
    id: "ucl-belgium",
    country: "BE",
    countryFlag: "🇧🇪",
    institutionName: "UCLouvain",
    institutionType: "university",
    programs: ["engineering", "sciences", "business", "law", "health"],
    levels: ["bachelor", "master"],
    intake: "September 2026",
    description: {
      en: "One of Belgium's leading French-speaking universities, UCLouvain offers a wide range of programs with strong international support.",
      fr: "L'une des principales universités francophones de Belgique, UCLouvain offre un large éventail de programmes avec un excellent soutien international.",
    },
    whyFit: {
      en: "Strong French-language programs, affordable tuition, welcoming to African students.",
      fr: "Programmes francophones solides, frais de scolarité abordables, accueil des étudiants africains.",
    },
    budgetLevel: "medium",
  },
  {
    id: "ulb-belgium",
    country: "BE",
    countryFlag: "🇧🇪",
    institutionName: "Université Libre de Bruxelles (ULB)",
    institutionType: "university",
    programs: ["politicalScience", "economics", "engineering", "medicine", "arts"],
    levels: ["bachelor", "master", "phd"],
    intake: "September 2026",
    description: {
      en: "Located in the heart of Brussels, ULB is known for research excellence and a vibrant international campus.",
      fr: "Située au cœur de Bruxelles, l'ULB est réputée pour l'excellence de la recherche et un campus international dynamique.",
    },
    whyFit: {
      en: "Central European location, diverse student body, programs in French and English.",
      fr: "Emplacement central en Europe, corps étudiant diversifié, programmes en français et en anglais.",
    },
    budgetLevel: "medium",
  },
  {
    id: "sorbonne-france",
    country: "FR",
    countryFlag: "🇫🇷",
    institutionName: "Sorbonne Université",
    institutionType: "university",
    programs: ["sciences", "arts", "medicine", "languages", "law"],
    levels: ["bachelor", "master", "phd"],
    intake: "September 2026",
    description: {
      en: "World-renowned Parisian university combining a rich academic tradition with cutting-edge research.",
      fr: "Université parisienne de renommée mondiale combinant une riche tradition académique et une recherche de pointe.",
    },
    whyFit: {
      en: "Prestigious degree, vibrant campus life in Paris, strong academic support.",
      fr: "Diplôme prestigieux, vie de campus dynamique à Paris, soutien académique solide.",
    },
    budgetLevel: "medium",
  },
  {
    id: "lyon3-france",
    country: "FR",
    countryFlag: "🇫🇷",
    institutionName: "Université Jean Moulin Lyon 3",
    institutionType: "university",
    programs: ["law", "business", "languages", "politicalScience", "internationalRelations"],
    levels: ["bachelor", "master"],
    intake: "September 2026",
    description: {
      en: "A leading university in Lyon with strong programs in law, business, and humanities — popular with international students.",
      fr: "Une université de premier plan à Lyon avec de solides programmes en droit, commerce et sciences humaines — populaire auprès des étudiants internationaux.",
    },
    whyFit: {
      en: "Lower cost of living than Paris, strong international partnerships, quality education.",
      fr: "Coût de la vie plus bas qu'à Paris, solides partenariats internationaux, enseignement de qualité.",
    },
    budgetLevel: "low",
  },
  {
    id: "uottawa-canada",
    country: "CA",
    countryFlag: "🇨🇦",
    institutionName: "University of Ottawa",
    institutionType: "university",
    programs: ["engineering", "business", "health", "sciences", "law"],
    levels: ["bachelor", "master"],
    intake: "September 2026 / January 2027",
    description: {
      en: "Canada's largest bilingual university, offering programs in both English and French with strong support for international students.",
      fr: "La plus grande université bilingue du Canada, offrant des programmes en anglais et en français avec un excellent soutien aux étudiants internationaux.",
    },
    whyFit: {
      en: "Bilingual (EN/FR), immigration-friendly, co-op programs for work experience.",
      fr: "Bilingue (EN/FR), favorable à l'immigration, programmes coopératifs pour l'expérience de travail.",
    },
    budgetLevel: "high",
  },
  {
    id: "laval-canada",
    country: "CA",
    countryFlag: "🇨🇦",
    institutionName: "Université Laval",
    institutionType: "university",
    programs: ["agriculture", "education", "sciences", "engineering", "business"],
    levels: ["bachelor", "master", "phd"],
    intake: "September 2026",
    description: {
      en: "Major French-speaking university in Quebec City with affordable tuition for international students from francophone Africa.",
      fr: "Grande université francophone à Québec avec des frais de scolarité abordables pour les étudiants internationaux d'Afrique francophone.",
    },
    whyFit: {
      en: "French-language programs, lower tuition for Francophone students, immigration pathways.",
      fr: "Programmes en français, frais réduits pour les étudiants francophones, voies d'immigration.",
    },
    budgetLevel: "medium",
  },
  {
    id: "zhejiang-china",
    country: "CN",
    countryFlag: "🇨🇳",
    institutionName: "Zhejiang University",
    institutionType: "university",
    programs: ["engineering", "computerScience", "medicine", "economics", "sciences"],
    levels: ["bachelor", "master", "phd"],
    intake: "September 2026",
    description: {
      en: "Top-ranked Chinese university offering English-taught programs and strong CSC scholarship eligibility.",
      fr: "Université chinoise de haut rang offrant des programmes enseignés en anglais et une forte éligibilité aux bourses CSC.",
    },
    whyFit: {
      en: "CSC scholarship eligible, English-taught programs, very low cost of living.",
      fr: "Éligible aux bourses CSC, programmes en anglais, coût de la vie très faible.",
    },
    budgetLevel: "low",
  },
  {
    id: "beijing-normal-china",
    country: "CN",
    countryFlag: "🇨🇳",
    institutionName: "Beijing Normal University",
    institutionType: "university",
    programs: ["education", "languages", "arts", "sciences", "psychology"],
    levels: ["bachelor", "master"],
    intake: "September 2026",
    description: {
      en: "Leading Chinese university for education and humanities, with Chinese language programs and international student support.",
      fr: "Université chinoise de premier plan pour l'éducation et les sciences humaines, avec des programmes de langue chinoise et un soutien aux étudiants internationaux.",
    },
    whyFit: {
      en: "Ideal for education and language studies, scholarship opportunities, cultural immersion.",
      fr: "Idéal pour les études en éducation et langues, opportunités de bourses, immersion culturelle.",
    },
    budgetLevel: "low",
  },
  {
    id: "arizona-state-usa",
    country: "US",
    countryFlag: "🇺🇸",
    institutionName: "Arizona State University",
    institutionType: "university",
    programs: ["business", "engineering", "computerScience", "communication", "arts"],
    levels: ["bachelor", "master"],
    intake: "Fall 2026 / Spring 2027",
    description: {
      en: "One of the most innovative universities in the US with strong international student support and merit scholarships.",
      fr: "L'une des universités les plus innovantes des États-Unis avec un excellent soutien aux étudiants internationaux et des bourses au mérite.",
    },
    whyFit: {
      en: "Innovation-driven, strong scholarships, excellent career services.",
      fr: "Axée sur l'innovation, excellentes bourses, services de carrière de qualité.",
    },
    budgetLevel: "high",
  },
  {
    id: "santa-monica-cc",
    country: "US",
    countryFlag: "🇺🇸",
    institutionName: "Santa Monica College",
    institutionType: "community-college",
    programs: ["business", "computerScience", "arts", "communication", "engineering"],
    levels: ["bachelor"],
    intake: "Fall 2026 / Spring 2027",
    description: {
      en: "Top-rated community college with the highest UCLA transfer rate, offering an affordable pathway to top US universities.",
      fr: "Community college très bien classé avec le meilleur taux de transfert vers UCLA, offrant un parcours abordable vers les meilleures universités américaines.",
    },
    whyFit: {
      en: "Affordable entry, guaranteed transfer agreements, support for international students.",
      fr: "Entrée abordable, accords de transfert garantis, soutien aux étudiants internationaux.",
    },
    budgetLevel: "medium",
  },
  {
    id: "isep-france",
    country: "FR",
    countryFlag: "🇫🇷",
    institutionName: "ISEP Paris (Institut Supérieur d'Électronique de Paris)",
    institutionType: "grande-ecole",
    programs: ["computerScience", "engineering", "telecommunications"],
    levels: ["bachelor", "master"],
    intake: "September 2026",
    description: {
      en: "Prestigious French grande école specializing in digital technology, cybersecurity, and software engineering.",
      fr: "Grande école française prestigieuse spécialisée dans les technologies numériques, la cybersécurité et l'ingénierie logicielle.",
    },
    whyFit: {
      en: "Industry-connected curriculum, internship opportunities, Paris location.",
      fr: "Programme connecté à l'industrie, opportunités de stage, localisation à Paris.",
    },
    budgetLevel: "high",
  },
  {
    id: "umons-belgium",
    country: "BE",
    countryFlag: "🇧🇪",
    institutionName: "Université de Mons (UMONS)",
    institutionType: "university",
    programs: ["engineering", "sciences", "education", "economics", "psychology"],
    levels: ["bachelor", "master"],
    intake: "September 2026",
    description: {
      en: "Dynamic Belgian university with lower living costs, strong engineering faculty, and welcoming international community.",
      fr: "Université belge dynamique avec un coût de la vie réduit, une forte faculté d'ingénierie et une communauté internationale accueillante.",
    },
    whyFit: {
      en: "Very affordable, strong support for international students, quality French-language education.",
      fr: "Très abordable, excellent soutien aux étudiants internationaux, enseignement de qualité en français.",
    },
    budgetLevel: "low",
  },
  {
    id: "wuhan-china",
    country: "CN",
    countryFlag: "🇨🇳",
    institutionName: "Wuhan University",
    institutionType: "university",
    programs: ["medicine", "engineering", "economics", "computerScience", "law"],
    levels: ["bachelor", "master", "phd"],
    intake: "September 2026",
    description: {
      en: "Historic top Chinese university offering English-taught programs in medicine, engineering, and business.",
      fr: "Université chinoise historique de premier rang offrant des programmes en anglais en médecine, ingénierie et commerce.",
    },
    whyFit: {
      en: "CSC eligible, English programs available, beautiful campus, extremely affordable.",
      fr: "Éligible CSC, programmes en anglais disponibles, campus magnifique, extrêmement abordable.",
    },
    budgetLevel: "low",
  },
];
