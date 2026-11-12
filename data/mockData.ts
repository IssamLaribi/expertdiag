import { Product, Brand, Domain, DeliveryOption, OrderRequest, ProblemReport } from '@/types';
import seedProducts from './products.json';


export const INITIAL_DOMAINS: Domain[] = [
  {
    id: 'dom-1',
    name: 'Biochimie',
    image: 'https://media.istockphoto.com/id/450853983/de/foto/dna-molek%C3%BClen.jpg?s=612x612&w=0&k=20&c=xZRTTB1tAANqBh4YwejHuY7SkLgsJH3zLymWFCIs5HE=',
  },
  {
    id: 'dom-2',
    name: 'Hématologie',
    image: 'https://cdn.pixabay.com/photo/2024/05/27/12/20/red-blood-cell-8791098_640.jpg',
  },
  {
    id: 'dom-3',
    name: 'Immunologie',
    image: 'https://media.istockphoto.com/id/1263176450/fr/photo/lymphocytes-t-du-syst%C3%A8me-immunitaire-attaquant-les-cellules-canc%C3%A9reuses-en-croissance.jpg?s=612x612&w=0&k=20&c=hVjZHJJWqWbgFjrHkiLxtiRXFry5Lk6m12uluXYfVsM=',
  },
  {
    id: 'dom-4',
    name: 'Microbiologie',
    image: 'https://img.magnific.com/premium-photo/diverse-array-colorful-bacteria-cultures-petri-dishes-microbial-samples-various-forms-concept-microbiology-laboratory-research-scientific-studies-biological-diversity_981050-16093.jpg?semt=ais_hybrid&w=740&q=80',
  },
  {
    id: 'dom-5',
    name: 'Urinalyse',
    image: 'https://t4.ftcdn.net/jpg/06/66/02/23/360_F_666022351_Ml6KqBWJtJHBSYE9VZ1s7H5gjzPusqYS.jpg',
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

export const INITIAL_PRODUCTS = seedProducts as Product[];

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
