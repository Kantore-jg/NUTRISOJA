import { Product, BlogPost, AdBanner, ContactMessage } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Lait de Soja Nature NutriSoy',
    slug: 'lait-de-soja-nature-nutrisoy',
    category: 'boissons',
    shortDescription: 'Boisson 100% végétale onctueuse, riche en protéines et sans lactose.',
    fullDescription: 'Élaboré à partir de graines de soja jaune sélectionnées auprès de nos coopératives partenaires du Burundi. Naturellement sans lactose et sans cholestérol, le Lait de Soja Nature NutriSoy est pasteurisé pour garantir fraîcheur et sécurité alimentaire optimale. Idéal pour toute la famille, au petit-déjeuner ou en collation saine.',
    price: 1800,
    packageSize: 'Bouteille 500 ml',
    images: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80',
    ],
    composition: ['Eau pure filtrée', 'Graines de soja non OGM du Burundi (14%)', 'Pincée de sel iodé'],
    nutritionalValues: {
      calories: 54,
      proteins: 3.8,
      lipids: 2.1,
      carbohydrates: 4.2,
      fibers: 0.8,
      calcium: 120,
      iron: 1.4,
    },
    usageTips: [
      'À consommer bien frais après avoir agité la bouteille.',
      'Parfait pour accompagner vos céréales, bouillies ou dans votre café/thé.',
      'Conserver au réfrigérateur après ouverture et consommer dans les 4 jours.',
    ],
    available: true,
    isFeatured: true,
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'prod-2',
    name: 'Lait de Soja Douceur Vanille',
    slug: 'lait-de-soja-douceur-vanille',
    category: 'boissons',
    shortDescription: 'Boisson végétale gourmande délicatement parfumée aux gousses naturelles.',
    fullDescription: 'Une déclinaison gourmande adorée des enfants et des jeunes adultes. Notre lait de soja onctueux infusé à l’arôme naturel de vanille et légèrement sucré au sucre de canne local pur. Une source saine de vitalité pour démarrer la journée.',
    price: 2200,
    packageSize: 'Bouteille 500 ml',
    images: [
      'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    ],
    composition: ['Eau filtrée', 'Graines de soja burundaises (13%)', 'Sucre de canne naturel', 'Arôme naturel de vanille', 'Sel iodé'],
    nutritionalValues: {
      calories: 72,
      proteins: 3.5,
      lipids: 1.9,
      carbohydrates: 9.8,
      fibers: 0.6,
      calcium: 110,
      iron: 1.2,
    },
    usageTips: [
      'Servir frais comme goûter équilibré.',
      'Excellent comme base pour vos smoothies de fruits locaux (banane, avocat, ananas).',
      'Agiter énergiquement avant ouverture.',
    ],
    available: true,
    isFeatured: true,
    createdAt: '2026-02-01T09:30:00.000Z',
  },
  {
    id: 'prod-3',
    name: 'Farine de Soja Fortifiée TotoFort',
    slug: 'farine-de-soja-fortifiee-totofort',
    category: 'farines',
    shortDescription: 'Farine enrichie recommandée pour la croissance des nourrissons et enfants.',
    fullDescription: 'Formulée en concertation avec des nutritionnistes burundais pour soutenir la lutte contre la malnutrition protéino-énergétique. TotoFort combine le soja toasté débarrassé de ses facteurs antinutritionnels, du maïs et du sorgho germé avec un prémix vitaminé (Vitamine A, Fer, Zinc, Folates). Très digeste et appréciée des tout-petits.',
    price: 3500,
    packageSize: 'Sachet hermétique 1 kg',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    ],
    composition: ['Farine de soja toasté (40%)', 'Farine de maïs blanc sélectionné (35%)', 'Farine de sorgho germé (25%)', 'Complexe micronutriments (Fer, Zinc, Vitamines A, B, C)'],
    nutritionalValues: {
      calories: 385,
      proteins: 22.4,
      lipids: 8.6,
      carbohydrates: 54.0,
      fibers: 7.2,
      calcium: 180,
      iron: 8.5,
    },
    usageTips: [
      'Diluer 3 cuillères à soupe dans un peu d’eau tiède avant de cuire 10 minutes à feu doux.',
      'Peut être agrémenté de lait de soja ou d’un filet de miel burundais.',
      'Recommandé pour les enfants dès l’âge de 6 mois en diversification alimentaire.',
    ],
    available: true,
    isFeatured: true,
    createdAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'prod-4',
    name: 'Farine Pâtissière de Soja Pure',
    slug: 'farine-patissiere-de-soja-pure',
    category: 'farines',
    shortDescription: 'Farine fine de soja toasté à haute digestibilité pour pains et beignets.',
    fullDescription: 'Destinée aux boulangers, pâtissiers artisanaux et aux foyers désireux de rehausser la valeur nutritive de leurs préparations culinaires. Incorporée à 15-25% dans vos farines classiques, elle apporte du moelleux, améliore la conservation et décuple l’apport en protéines.',
    price: 3200,
    packageSize: 'Sachet kraft 1 kg',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    composition: ['100% graines de soja burundaises toastées et finement moulues.'],
    nutritionalValues: {
      calories: 420,
      proteins: 38.0,
      lipids: 18.5,
      carbohydrates: 25.0,
      fibers: 9.5,
      calcium: 210,
      iron: 9.0,
    },
    usageTips: [
      'Remplacer 20% de votre farine de blé habituelle dans les gâteaux, crêpes et beignets.',
      'Liant parfait pour épaissir soupes et sauces traditionnelles burundaises.',
    ],
    available: true,
    isFeatured: false,
    createdAt: '2026-01-20T14:00:00.000Z',
  },
  {
    id: 'prod-5',
    name: 'Tofu Frais Artisanal de Bujumbura',
    slug: 'tofu-frais-artisanal-de-bujumbura',
    category: 'derives',
    shortDescription: 'Bloc de tofu ferme et frais, prêt à griller ou mijoter dans vos sauces.',
    fullDescription: 'Le substitut végétal par excellence. Fabriqué chaque matin dans nos ateliers à Bujumbura selon les méthodes traditionnelles de caillage au chlorure de magnésium naturel (Nigari). Sa texture ferme s’imprègne merveilleusement de toutes les épices et marinades locales.',
    price: 2500,
    packageSize: 'Barquette sous-vide 400 g',
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    ],
    composition: ['Eau pure', 'Graines de soja locales sélectionnées', 'Coagulant naturel (Nigari)'],
    nutritionalValues: {
      calories: 115,
      proteins: 12.8,
      lipids: 6.2,
      carbohydrates: 2.1,
      fibers: 1.5,
      calcium: 320,
      iron: 4.2,
    },
    usageTips: [
      'Couper en dés, mariner avec de l’ail, du gingembre et de l’huile de soja avant de dorer à la poêle.',
      'Sublime dans les brochettes ou incorporé dans les ragoûts de légumes (isombe, haricots).',
      'Conserver dans de l’eau fraîche au réfrigérateur en changeant l’eau quotidiennement.',
    ],
    available: true,
    isFeatured: true,
    createdAt: '2026-02-10T11:00:00.000Z',
  },
  {
    id: 'prod-6',
    name: 'Tofu Fumé aux Épices Locales',
    slug: 'tofu-fume-aux-epices-locales',
    category: 'derives',
    shortDescription: 'Tofu mariné et fumé au bois naturel aux senteurs du terroir burundais.',
    fullDescription: 'Fumé artisanalement au bois de hêtre et d’arbres fruitiers non traités. Prêt à consommer froid en salade ou réchauffé à la poêle. Son goût subtilement boisé et sa richesse en protéines en font une alternative gourmande et nutritive aux viandes.',
    price: 3000,
    packageSize: 'Sachet sous-vide 350 g',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    ],
    composition: ['Tofu fermier (soja, eau, coagulant)', 'Fumage naturel au bois', 'Pili-pili doux, sel de mer, ail'],
    nutritionalValues: {
      calories: 138,
      proteins: 14.5,
      lipids: 7.8,
      carbohydrates: 2.4,
      fibers: 1.8,
      calcium: 340,
      iron: 4.6,
    },
    usageTips: [
      'Trancher finement dans vos sandwichs et salades composées.',
      'Sauter rapidement à la poêle 3 minutes avec des oignons caramélisés.',
    ],
    available: true,
    isFeatured: false,
    createdAt: '2026-02-18T15:00:00.000Z',
  },
  {
    id: 'prod-7',
    name: 'Huile Pure de Soja Première Pression',
    slug: 'huile-pure-de-soja-premiere-pression',
    category: 'derives',
    shortDescription: 'Huile végétale diététique pour assaisonnement et cuisson saine.',
    fullDescription: 'Extraite par pression mécanique sans solvants chimiques à partir de graines récoltées dans les provinces de Kirundo et Ngozi. Naturellement dorée et limpide, cette huile est une source remarquable d’acides gras essentiels Oméga-3 et Oméga-6 ainsi que de vitamine E antioxydante.',
    price: 6500,
    packageSize: 'Bouteille 1 Litre',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    ],
    composition: ['100% huile végétale pure de graines de soja pressées à froid.'],
    nutritionalValues: {
      calories: 884,
      proteins: 0,
      lipids: 100,
      carbohydrates: 0,
      fibers: 0,
    },
    usageTips: [
      'Idéale pour toutes vos fritures légères, assaisonnements et mayonnaises maison.',
      'Résiste très bien aux températures de cuisson courantes.',
    ],
    available: true,
    isFeatured: false,
    createdAt: '2026-02-25T16:30:00.000Z',
  },
];

export const INITIAL_ADS: AdBanner[] = [
  {
    id: 'ad-1',
    title: 'Campagne Nutrition & Vitalité 2026',
    subtitle: 'Rejoignez le mouvement du soja burundais : 100% végétal, 100% local, riche en protéines.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '/produits',
    ctaText: 'Découvrir nos produits',
    displayOrder: 1,
    isActive: true,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'ad-2',
    title: 'Programme Cantines & Écoles Solidaires',
    subtitle: 'Formules nutritionnelles adaptées aux ONG, écoles et centres de santé du Burundi.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '/contact',
    ctaText: 'Devenir partenaire',
    displayOrder: 2,
    isActive: true,
    startDate: '2026-01-15',
    endDate: '2026-12-31',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'ad-3',
    title: 'Nouveau : Farine Fortifiée TotoFort 1kg',
    subtitle: 'La bouillie complète qui fortifie les tout-petits dès 6 mois avec fer et zinc.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    linkUrl: '/produits/farine-de-soja-fortifiee-totofort',
    ctaText: 'En savoir plus',
    displayOrder: 3,
    isActive: true,
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    createdAt: '2026-02-01T00:00:00.000Z',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Le soja : un levier puissant contre la malnutrition infantile au Burundi',
    slug: 'le-soja-levier-contre-la-malnutrition-burundi',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Comment la farine enrichie à base de soja local transforme la prise en charge nutritionnelle dans les collines et centres de santé.',
    content: `Au Burundi, les premiers 1 000 jours de vie d’un enfant sont déterminants pour son développement cognitif et physique. Face aux défis de l'insécurité alimentaire et aux coûts élevés des protéines animales, le soja émerge comme une solution miracle accessible et durable.

### Une protéine végétale complète et équilibrée
Contrairement à la majorité des légumineuses, la graine de soja contient tous les 8 acides aminés essentiels dont le corps humain a besoin. Son profil protéique est comparable à celui du lait maternel ou de l'œuf.

Chez **NUTRI SOJA**, nous avons développé la farine **TotoFort**, un aliment de sevrage équilibré combinant le soja pré-cuit et désactivé (élimination des inhibiteurs de trypsine), le maïs local et le sorgho fortifié. Cette composition permet une digestibilité maximale pour les nourrissons à partir de 6 mois.

### L’impact mesurable auprès des centres de santé
En partenariat avec plusieurs ONG locales à Ngozi et Kirundo, l'introduction de bouillies enrichies en soja a permis :
1. Une réduction significative des cas de kwashiorkor et de marasme chez les tout-petits.
2. Une amélioration rapide de la courbe de croissance en moins de 6 semaines.
3. L'éducation des mères de famille aux recettes simples et nutritives préparées avec des produits du terroir.

En soutenant la filière locale, nous favorisons un cercle vertueux : les agriculteurs burundais trouvent un débouché garanti, et les enfants grandissent en bonne santé.`,
    author: {
      name: 'Dr. Chantal Nibizi',
      role: 'Conseillère Nutritionnelle & Santé Publique',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    category: 'Nutrition & Santé',
    tags: ['Nutrition', 'Enfance', 'Santé', 'Burundi'],
    status: 'published',
    readTimeMinutes: 5,
    publishedAt: '2026-02-15T10:00:00.000Z',
    createdAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'post-2',
    title: '5 recettes simples pour intégrer le tofu dans la cuisine burundaise',
    slug: '5-recettes-simples-tofu-cuisine-burundaise',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Mariné, grillé ou mijoté dans l’isombe : découvrez comment magnifier le tofu artisanal au goût de nos traditions culinaires.',
    content: `Trop souvent perçu comme fade ou étranger, le tofu est pourtant une toile blanche culinaire extraordinaire. Au Burundi, le tofu frais artisanal produit par **NUTRI SOJA** s'accorde merveilleusement avec nos sauces, épices et accompagnements du quotidien.

### 1. Le Tofu croustillant mariné à l'ail et pili-pili doux
Coupez le tofu en cubes de 2 cm. Laissez-le mariner 20 minutes avec 2 cuillères d'huile de soja Nutri Soja, 2 gousses d'ail écrasées, du gingembre râpé et une pincée de sel. Faites dorer à feu vif dans une poêle antiadhésive jusqu'à formation d'une croûte dorée. Servez avec des frites de bananes plantain !

### 2. Le ragoût de Tofu à l'isombe (feuilles de manioc)
Remplacez la viande ou le poisson séché par des cubes de tofu préalablement poêlés. Ajoutez-les dans votre marmite d'isombe mijotée à l'huile de palme ou à l'huile de soja durant les 15 dernières minutes de cuisson. Le tofu absorbera les arômes végétaux intenses pour un plat 100% végétarien.

### 3. Brochettes de Tofu fumé au barbecue
Notre tofu fumé se prête idéalement aux pique-niques sur les rives du lac Tanganyika. Enfilez sur des pics en bois des morceaux de tofu fumé alternés avec des quartiers d'oignons rouges, de tomates fraîches et de poivrons verts. Badigeonnez d'un filet de marinade et grillez 5 minutes de chaque côté.

### 4. Tofu brouillé du matin façon œufs fermiers
Écrasez à la fourchette 200g de tofu nature. Faites revenir avec des tomates hachées, du curcuma (pour la couleur dorée) et de la ciboulette fraîche. Un petit-déjeuner survitaminé pour attaquer la journée de travail !

### 5. Beignets doux de farine de soja
Mélangez 30% de farine de soja et 70% de farine de blé pour préparer vos beignets traditionnels (amandazi). Vous obtiendrez des beignets deux fois plus moelleux et qui rassasient durablement toute la famille.`,
    author: {
      name: 'Aimé Ndikumana',
      role: 'Chef Cuisinier & Développeur Produit',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    category: 'Recettes & Cuisine',
    tags: ['Recettes', 'Tofu', 'Gastronomie', 'FaitMaison'],
    status: 'published',
    readTimeMinutes: 4,
    publishedAt: '2026-02-22T14:30:00.000Z',
    createdAt: '2026-02-22T14:30:00.000Z',
  },
  {
    id: 'post-3',
    title: 'De la colline à l’usine : notre partenariat avec 350 producteurs burundais',
    slug: 'de-la-colline-a-usine-partenariat-producteurs-burundais',
    coverImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Plongée au cœur de notre modèle agricole équitable qui valorise le travail des coopératives paysannes à Kirundo, Kayanza et Gitega.',
    content: `Chez NUTRI SOJA, la qualité de nos produits commence bien avant nos cuves de transformation : elle prend racine dans la terre fertile des collines burundaises.

### Un prix d'achat garanti et prévisible
L'un des plus grands freins pour les petits exploitants agricoles est la volatilité des cours du marché. NUTRI SOJA a instauré des contrats pluriannuels avec 12 coopératives de femmes et de jeunes agriculteurs. Nous garantissons un prix d'achat supérieur de 20% aux cours du marché informel, ainsi qu'un paiement ponctuel et sécurisé.

### Formation aux techniques agro-écologiques
En collaboration avec les agronomes locaux, nos équipes animent des sessions pratiques sur :
- La rotation des cultures (le soja fixe naturellement l'azote dans le sol et enrichit les parcelles pour les cultures vivrières suivantes comme le maïs).
- Le compostage biologique pour éviter les engrais chimiques coûteux.
- Le tri post-récolte pour assurer une propreté irréprochable des graines.

### Une fierté partagée pour l’économie nationale
Transformer le soja directement à Bujumbura permet de réduire la dépendance du pays aux importations coûteuses de poudres de lait et de suppléments protéinés industriels. C'est la démonstration concrète que le Burundi possède les ressources et les compétences pour nourrir durablement sa population.`,
    author: {
      name: 'Pacifique Mugisha',
      role: 'Responsable Approvisionnement Agricole',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    category: 'Impact Local',
    tags: ['Agriculture', 'Équitable', 'Burundi', 'Coopératives'],
    status: 'published',
    readTimeMinutes: 6,
    publishedAt: '2026-03-01T08:00:00.000Z',
    createdAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'post-4',
    title: 'Pourquoi les sportifs et travailleurs adoptent le lait de soja NutriSoy',
    slug: 'pourquoi-sportifs-adoptent-lait-de-soja-nutrisoy',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    excerpt: 'Récupération musculaire, énergie sans lourdeur digestive : les atouts d’une boisson locale naturelle et revigorante.',
    content: `Que ce soit pour les coureurs des collines de Bujumbura, les footballeurs des clubs de la capitale ou les artisans engagés dans des journées intenses, la nutrition sportive ne requiert pas de coûteux compléments importés.

### Digestibilité et régénération musculaire
Le lait de soja NutriSoy apporte environ 19 grammes de protéines végétales complètes par bouteille de 500ml. Sa faible teneur en graisses saturées et l'absence totale de lactose permettent une assimilation rapide sans ballonnement ni somnolence post-repas.

### Les minéraux essentiels pour l'effort
Riche en potassium, magnésium et fer végétal, il compense les pertes minérales dues à la transpiration sous le climat burundais et aide à prévenir les crampes musculaires. À boire bien frais après chaque session d'entraînement !`,
    author: {
      name: 'Dr. Chantal Nibizi',
      role: 'Conseillère Nutritionnelle & Santé Publique',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    category: 'Nutrition & Santé',
    tags: ['Sport', 'Vitalité', 'Santé', 'LaitDeSoja'],
    status: 'published',
    readTimeMinutes: 3,
    publishedAt: '2026-03-04T11:00:00.000Z',
    createdAt: '2026-03-04T11:00:00.000Z',
  },
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Jean-Bosco Nkurunziza',
    email: 'jbosco.ong@nutritionburundi.org',
    phone: '+257 79 98 45 12',
    subject: 'Partenariat pour programme de cantines scolaires (Kirundo)',
    message: 'Bonjour l’équipe Nutri Soja. Notre ONG intervient dans 14 écoles primaires de la province de Kirundo. Nous souhaitons commander mensuellement 500 kg de farine TotoFort fortifiée ainsi que du lait de soja pour nos cantines. Pourriez-vous nous transmettre votre grille tarifaire institutionnelle ainsi que vos délais de livraison ? Cordialement.',
    isRead: false,
    createdAt: '2026-03-06T09:15:00.000Z',
  },
  {
    id: 'msg-2',
    name: 'Aline Hakizimana',
    email: 'direction@supermarche-buja.bi',
    phone: '+257 22 25 34 89',
    subject: 'Approvisionnement régulier en Tofu frais et Lait aromatisé',
    message: 'Bonjour. Nous gérons 3 supermarchés dans les quartiers Rohero, Kiriri et Kinindo à Bujumbura. Nos clients demandent régulièrement du tofu frais et du lait de soja vanille Nutri Soja. Nous aimerions mettre en place un réassort bi-hebdomadaire. Merci de nous contacter pour convenir d’un rendez-vous commercial.',
    isRead: false,
    createdAt: '2026-03-07T14:40:00.000Z',
  },
  {
    id: 'msg-3',
    name: 'Médiatrice Kaneza',
    email: 'mediatrice.kaneza@gmail.com',
    phone: '+257 71 45 67 89',
    subject: 'Félicitations pour TotoFort ! Mon bébé a retrouvé l’appétit',
    message: 'Un simple message du fond du cœur pour féliciter votre équipe. Sur conseil du pédiatre au Centre de Santé de Kamenge, j’ai introduit TotoFort pour mon fils de 8 mois. La bouillie est très onctueuse et il adore. Merci pour ce travail de qualité réalisé chez nous au Burundi.',
    isRead: true,
    createdAt: '2026-03-04T16:20:00.000Z',
  },
];
