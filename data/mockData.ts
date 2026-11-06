import { Product, Brand, Domain, DeliveryOption, OrderRequest, ProblemReport } from '@/types';


export const INITIAL_DOMAINS: Domain[] = [
  {
    id: 'dom-1',
    name: 'Biochimie',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=85',
  },
  {
    id: 'dom-2',
    name: 'Hématologie',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=85',
  },
  {
    id: 'dom-3',
    name: 'Immunologie',
    image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=85',
  },
  {
    id: 'dom-4',
    name: 'Microbiologie',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=85',
  },
  {
    id: 'dom-5',
    name: 'Urinalyse',
    image: 'https://images.unsplash.com/photo-1583912267550-d6c2f1f8b9c7?w=800&q=85',
  },
];


export const INITIAL_BRANDS: Brand[] = [
  { id: 'brand-1', name: 'Mindray' },
  { id: 'brand-2', name: 'Medconn' },
  { id: 'brand-3', name: 'Sysmex' },
  { id: 'brand-4', name: 'Roche Diagnostics' },
  { id: 'brand-5', name: 'Abbott Laboratories' },
];

export const INITIAL_DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'del-1',
    name: 'Expert Diagnostic - Livraison Directe',
    type: 'own',
    estimatedDays: '24 - 48 heures',
    coveredWilayas: ['Alger', 'Blida', 'Boumerdès', 'Tipaza', 'Tizi Ouzou'],
    active: true,
  },
  {
    id: 'del-2',
    name: 'Yalidine Express (Partenaire)',
    type: 'partner',
    estimatedDays: '48 - 72 heures',
    coveredWilayas: ['Alger', 'Oran', 'Constantine', 'Annaba', 'Sétif', 'Tlemcen', 'Batna', 'Blida'],
    active: true,
  },
  {
    id: 'del-3',
    name: 'Guepex Logistique (Partenaire)',
    type: 'partner',
    estimatedDays: '3 à 5 jours ouvrés',
    coveredWilayas: ['Toutes les Wilayas (National)'],
    active: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    reference: 'MIN-BS240',
    name: 'Analyseur de Biochimie Automatisé BS-240',
    type: 'equipment',
    brand: 'Mindray',
    domain: 'Biochimie',
    description: 'Analyseur biochimique compact à accès aléatoire avec un débit constant de 200 tests par heure (jusqu\'à 400 tests avec ISE). Idéal pour les laboratoires de taille moyenne.',
    features: [
      'Débit de 200 tests/heure, jusqu\'à 400 avec ISE',
      '80 positions de réactifs et 80 positions d\'échantillons',
      'Système optique à réseau inversé avec 8 longueurs d\'onde',
      'Lavette de cuvettes automatique avec station de lavage préchauffée',
      'Consommation d\'eau ultra-faible (< 5L/heure)'
    ],
    image: 'https://5.imimg.com/data5/OD/IQ/MY-5636256/bs-240-fully-automated-biochemistry-analyser-1000x1000.jpg',
    status: 'available',
    visible: true,
    priceEstimate: 'Sur Demande de Devis'
  },
  {
    id: 'prod-2',
    reference: 'SYS-XN550',
    name: 'Compteur Hématologique XN-550',
    type: 'equipment',
    brand: 'Sysmex',
    domain: 'Hématologie',
    description: 'Système d\'analyse hématologique compact doté d\'une technologie de fluorescence laser avancée pour la formule leucocytaire à 5 populations (DIFF) et les réticulocytes.',
    features: [
      'Technologie de cytométrie en flux par fluorescence',
      'Cadence de 60 tests par heure',
      'Volume d\'échantillon réduit (88 µL en mode sang total)',
      'Écran tactile couleur intuitif intégré avec logiciel multilingue',
      'Validation automatique intégrée'
    ],
    image: 'https://www.blockscientific.com/web/image/product.image/2625/image_1024/Sysmex%20XN%20550%20Automated%20Hematology%20Analyzer?unique=15f4b27',
    status: 'available',
    visible: true,
    priceEstimate: 'Sur Demande de Devis'
  },
  {
    id: 'prod-3',
    reference: 'MIND-GLU-R1',
    name: 'Coffret Réactifs Glucose GOD-PAP (4x250ml)',
    type: 'reagent',
    brand: 'Mindray',
    domain: 'Biochimie',
    description: 'Réactif enzymatique colorimétrique pour la détermination quantitative in vitro du glucose dans le sérum et le plasma humain.',
    features: [
      'Linéarité jusqu\'à 5.0 g/L (275 mmol/L)',
      'Stabilité à bord de 60 jours à 2-8°C',
      'Excellente corrélation avec les méthodes de référence',
      'Prêt à l\'emploi pour analyseurs BS series'
    ],
    image: 'https://www.biotec-co.com/wp-content/uploads/2023/05/05-scaled-1.jpg',
    status: 'available',
    visible: true,
    priceEstimate: '45 000 DZD'
  },
  {
    id: 'prod-4',
    reference: 'ROCH-COV-AG',
    name: 'Trousse de Dépistage Immuno-enzymatique SARS-CoV-2 Ag',
    type: 'reagent',
    brand: 'Roche Diagnostics',
    domain: 'Immunologie',
    description: 'Test rapide professionnel pour la détection qualitative des antigènes spécifiques du SARS-CoV-2 dans les échantillons nasopharyngés.',
    features: [
      'Sensibilité clinique élevée (96.52%)',
      'Spécificité clinique de 99.68%',
      'Résultats clairs en 15 minutes',
      'Conditionnement de 25 tests par coffret avec écouvillons stériles'
    ],
    image: 'https://image.chukouplus.com/themes/simplebootx/Upload/W_22/upload/5e119fe4b555c.jpg?x-oss-process=image/format,webp,image/resize,m_pad,h_800,w_800,color_FFFFFF&1',
    status: 'unavailable',
    expectedReturnDate: '28/03/2026',
    note: 'Rupture fournisseur temporaire - Réapprovisionnement en cours',
    visible: true,
    priceEstimate: '18 500 DZD'
  },
  {
    id: 'prod-5',
    reference: 'ABB-CUV-1000',
    name: 'Cuvettes de Réaction Stériles pour Architect c4000',
    type: 'consumable',
    brand: 'Abbott Laboratories',
    domain: 'Biochimie',
    description: 'Cuvettes optiques jetables haute précision garantissant l\'intégrité des mesures photométriques pour la gamme Abbott Architect.',
    features: [
      'Fabriquées en polymère optique de grade supérieur',
      'Exemptes de fluorescence de fond et d\'impuretés',
      'Paquet de 1000 unités emballées hermétiquement'
    ],
    image: 'https://image.made-in-china.com/202f0j00AnTcFLSGGNkj/Laboratory-Disposables-Reaction-Cuvettes-Plastic-Cuvette-Sample-Cup.webp',
    status: 'available',
    visible: true,
    priceEstimate: '32 000 DZD'
  },
  {
    id: 'prod-6',
    reference: 'MED-URIN-100',
    name: 'Bandes Réactives Urinaires 10 Paramètres (Boîte de 100)',
    type: 'consumable',
    brand: 'Medconn',
    domain: 'Urinalyse',
    description: 'Bandes réactives pour analyse d\'urine semi-quantitative, mesurant le pH, les protéines, le glucose, les corps cétoniques, la bilirubine et le sang.',
    features: [
      'Résistance accrue aux interférences de l\'acide ascorbique (vitamine C)',
      'Lecture visuelle facile ou compatible avec lecteur optique Medconn',
      'Excellente conservation grâce au flacon dessicateur étanche'
    ],
    image: 'https://www.girodmedical.com/media/catalog/product/cache/b5d2e21c4b986f4977159f4c0d3488ae/1/1/11239.webp',
    status: 'available',
    visible: true,
    priceEstimate: '6 500 DZD'
  },
  {
    id: 'prod-7',
    reference: 'SYS-HGB-DIL',
    name: 'Diluant Lyse Specifique Cellpack DCL (20L)',
    type: 'reagent',
    brand: 'Sysmex',
    domain: 'Hématologie',
    description: 'Solution tampon isotonique pour la dilution des échantillons de sang et la lyse des globules rouges sur compteurs Sysmex série XN/XT.',
    features: [
      'Volume de 20 litres en bidon sécurisé anti-goutte',
      'Pureté analytique garantie sans microcristaux',
      'Compatible avec les systèmes de raccordement automatique'
    ],
    image: 'https://qtc.a2a-logistics.com/wp-content/uploads/2022/03/881393.jpg',
    status: 'available',
    visible: true,
    priceEstimate: '24 000 DZD'
  },
  {
    id: 'prod-8',
    reference: 'MIN-MIC-CL10',
    name: 'Incubateur Microbiologique à Régulation Numérique',
    type: 'equipment',
    brand: 'Mindray',
    domain: 'Microbiologie',
    description: 'Incubateur de laboratoire à convection naturelle pour la culture bactériologique et l\'incubation de milieux gélosés avec précision de température de ±0.2°C.',
    features: [
      'Plage de température de ambiante +5°C à 80°C',
      'Double porte avec hublot en verre trempé d\'observation',
      'Étagères réglables en acier inoxydable anti-corrosion',
      'Système d\'alarme sonore et visuelle de surchauffe'
    ],
    image: 'https://m.media-amazon.com/images/I/61qJBatvFEL.jpg',
    status: 'available',
    visible: true,
    priceEstimate: 'Sur Demande de Devis'
  }
];

export const INITIAL_ORDERS: OrderRequest[] = [
  {
    id: 'ord-1',
    reference: 'REQ-2026-001',
    customerId: 'cust-1',
    customerName: 'Dr. Amine Kaci',
    laboratoryName: 'Laboratoire d\'Analyses Médicales Pasteur Alger',
    email: 'contact@labpasteur-alger.dz',
    phone: '+213 23 11 22 33',
    wilaya: 'Alger',
    commune: 'Hydra',
    address: '14 Boulevard des Martyrs',
    deliveryOptionId: 'del-1',
    deliveryOptionName: 'Expert Diagnostic - Livraison Directe',
    comment: 'Merci de livrer le matin avant 11h.',
    items: [
      { productId: 'prod-3', productName: 'Coffret Réactifs Glucose GOD-PAP (4x250ml)', reference: 'MIND-GLU-R1', quantity: 3 },
      { productId: 'prod-5', productName: 'Cuvettes de Réaction Stériles pour Architect c4000', reference: 'ABB-CUV-1000', quantity: 2 }
    ],
    status: 'Confirmed',
    source: 'website',
    createdAt: '2026-11-08 10:30'
  },
  {
    id: 'ord-2',
    reference: 'REQ-2026-002',
    customerId: 'cust-1',
    customerName: 'Dr. Amine Kaci',
    laboratoryName: 'Laboratoire d\'Analyses Médicales Pasteur Alger',
    email: 'contact@labpasteur-alger.dz',
    phone: '+213 23 11 22 33',
    wilaya: 'Alger',
    commune: 'Hydra',
    address: '14 Boulevard des Martyrs',
    deliveryOptionId: 'del-2',
    deliveryOptionName: 'Yalidine Express (Partenaire)',
    comment: 'Urgent pour réassort semaine.',
    items: [
      { productId: 'prod-7', productName: 'Diluant Lyse Specifique Cellpack DCL (20L)', reference: 'SYS-HGB-DIL', quantity: 5 }
    ],
    status: 'Delivered',
    source: 'website',
    createdAt: '2026-11-02 14:15'
  }
];

export const INITIAL_PROBLEMS: ProblemReport[] = [
  {
    id: 'prob-1',
    reference: 'SAV-2026-010',
    customerId: 'cust-1',
    customerName: 'Dr. Amine Kaci',
    laboratoryName: 'Laboratoire d\'Analyses Médicales Pasteur Alger',
    equipmentId: 'prod-1',
    equipmentName: 'Analyseur de Biochimie Automatisé BS-240',
    serialNumber: 'SN-BS240-88941',
    problemType: 'error_message',
    description: 'Code erreur E-402 affiché lors du cycle de lavage automatique des cuvettes photométriques.',
    urgency: 'urgent',
    photos: [],
    status: 'In progress',
    plannedInterventionDate: '2026-11-13 09:30',
    messageToCustomer: 'Un technicien SAV Expert Diagnostic s\'est vu assigner votre dossier. Intervention sur site prévue le 13 novembre.',
    internalNote: 'Vérifier la pompe à vide et les tubulures de la station de lavage.',
    createdAt: '2026-11-09 08:45'
  }
];
