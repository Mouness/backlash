import { Timestamp } from 'firebase/firestore';
import type { Publication } from '../services/publicationService';

// Original hardcoded mocks
const BASE_MOCKS: Publication[] = [
  {
    id: 'mock-1',
    title: {
      en: 'New Project Launch: Digital Rights in 2024',
      fr: 'Lancement du projet : Droits numériques en 2024',
      de: 'Projektstart: Digitale Rechte 2024',
    },
    description: {
      en: 'We are thrilled to announce the start of our new comprehensive study on digital rights across Europe.',
      fr: "Nous sommes ravis d'annoncer le début de notre nouvelle étude complète sur les droits numériques en Europe.",
      de: 'Wir freuen uns, den Start unserer neuen umfassenden Studie zu digitalen Rechten in Europa bekannt zu geben.',
    },
    date: Timestamp.now(),
    category: 'news',
    link: 'https://example.com/launch',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
  },
  {
    id: 'mock-2',
    title: {
      en: 'Annual Conference on Internet Law',
      fr: "Conférence annuelle sur le droit de l'Internet",
      de: 'Jahreskonferenz zum Internetrecht',
    },
    description: {
      en: 'Join us in Geneva for a 2-day workshop discussing the future of AI regulation.',
      fr: "Rejoignez-nous à Genève pour un atelier de 2 jours sur l'avenir de la régulation de l'IA.",
      de: 'Besuchen Sie uns in Genf für einen 2-tägigen Workshop zur Zukunft der KI-Regulierung.',
    },
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 5)), // 5 days ago
    category: 'event',
    link: 'https://example.com/conference',
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40',
  },
  {
    id: 'mock-3',
    title: {
      en: 'Publication: Data Privacy Paradox',
      fr: 'Publication : Le paradoxe de la confidentialité des données',
      de: 'Publikation: Das Datenschutz-Paradoxon',
    },
    description: {
      en: 'Our latest article explores consumer behavior regarding privacy settings vs actual usage.',
      fr: "Notre dernier article explore le comportement des consommateurs concernant les paramètres de confidentialité par rapport à l'utilisation réelle.",
      de: 'Unser neuester Artikel untersucht das Verbraucherverhalten in Bezug auf Datenschutzeinstellungen im Vergleich zur tatsächlichen Nutzung.',
    },
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 15)), // 15 days ago
    category: 'article',
    link: 'https://example.com/article',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'mock-4',
    title: {
      en: 'Book Review: The Age of Surveillance Capitalism',
      fr: "Critique de livre : L'âge du capitalisme de surveillance",
      de: 'Buchrezension: Das Zeitalter des Überwachungskapitalismus',
    },
    description: {
      en: "An in-depth look at Shoshana Zuboff's seminal work and its implications for modern society.",
      fr: "Un regard approfondi sur l'œuvre fondamentale de Shoshana Zuboff et ses implications pour la société moderne.",
      de: 'Ein eingehender Blick auf Shoshana Zuboffs wegweisendes Werk und seine Auswirkungen auf die moderne Gesellschaft.',
    },
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 25)), // 25 days ago
    category: 'book',
    link: 'https://example.com/book-review',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
  },
  {
    id: 'mock-5',
    title: {
      en: 'Policy Alert: New EU AI Act Draft',
      fr: "Alerte politique : Nouveau projet de loi sur l'IA de l'UE",
      de: 'Politik-Alarm: Neuer Entwurf des EU-KI-Gesetzes',
    },
    description: {
      en: 'Analysis of the latest amendments to the European Artificial Intelligence Act.',
      fr: "Analyse des derniers amendements à la loi européenne sur l'intelligence artificielle.",
      de: 'Analyse der neuesten Änderungen am europäischen Gesetz über künstliche Intelligenz.',
    },
    date: Timestamp.fromDate(new Date(Date.now() - 86400000 * 35)), // 35 days ago
    category: 'news',
    link: 'https://example.com/eu-ai-act',
    imageUrl: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d',
  },
];

export const MOCK_PUBLICATIONS: Publication[] = [...BASE_MOCKS];
