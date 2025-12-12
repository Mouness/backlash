import type { Country } from '../services/countryService';

export const MOCK_COUNTRIES: Omit<Country, 'id'>[] = [
  {
    code: 'CAN',
    name: {
      en: 'Canada',
      fr: 'Canada',
      de: 'Kanada',
    },
    summary: {
      en: 'Focus on federalism and indigenous rights. Analyzing the impact of recent supreme court decisions.',
      fr: "Focus sur le fédéralisme et les droits autochtones. Analyse de l'impact des récentes décisions de la cour suprême.",
      de: 'Fokus auf Föderalismus und Rechte der Ureinwohner. Analyse der Auswirkungen jüngster Entscheidungen des Obersten Gerichtshofs.',
    },
    content: {
      en: 'Detailed comparative analysis of Canadian federalism...',
      fr: 'Analyse comparative détaillée du fédéralisme canadien...',
      de: 'Detaillierte vergleichende Analyse des kanadischen Föderalismus...',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800&auto=format&fit=crop', // Toronto
    score: 85,
  },
  {
    code: 'CHE',
    name: {
      en: 'Switzerland',
      fr: 'Suisse',
      de: 'Schweiz',
    },
    summary: {
      en: 'Direct democracy and cantonal sovereignty. The challenge of populism in a consensus democracy.',
      fr: 'Démocratie directe et souveraineté cantonale. Le défi du populisme dans une démocratie de consensus.',
      de: 'Direkte Demokratie und kantonale Souveränität. Die Herausforderung des Populismus in einer Konkordanzdemokratie.',
    },
    content: {
      en: 'Switzerland presents a unique case of backlash...',
      fr: 'La Suisse présente un cas unique de réaction...',
      de: 'Die Schweiz stellt einen einzigartigen Fall von Backlash dar...',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop', // Alps/Nature
    score: 90,
  },
  {
    code: 'DEU',
    name: {
      en: 'Germany',
      fr: 'Allemagne',
      de: 'Deutschland',
    },
    summary: {
      en: 'Constitutional court and federal state relations. Protecting democratic order against extremism.',
      fr: "Cour constitutionnelle et relations fédérales. Protection de l'ordre démocratique contre l'extrémisme.",
      de: 'Verfassungsgericht und Beziehungen der Bundesländer. Schutz der demokratischen Grundordnung gegen Extremismus.',
    },
    content: {
      en: "Germany's militant democracy concept is being tested...",
      fr: "Le concept de démocratie militante de l'Allemagne est mis à l'épreuve...",
      de: 'Deutschlands Konzept der wehrhaften Demokratie wird auf die Probe gestellt...',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop', // Berlin/City
    score: 88,
  },
  {
    code: 'BRA',
    name: {
      en: 'Brazil',
      fr: 'Brésil',
      de: 'Brasilien',
    },
    summary: {
      en: 'Federalism under pressure and judicial backlash. The tug-of-war between executive and judiciary.',
      fr: 'Fédéralisme sous pression et retour de bâton judiciaire. Le bras de fer entre exécutif et judiciaire.',
      de: 'Föderalismus unter Druck und justizieller Rückschlag. Das Tauziehen zwischen Exekutive und Judikative.',
    },
    content: {
      en: 'In Brazil, federalism acted as a shield during the pandemic...',
      fr: 'Au Brésil, le fédéralisme a servi de bouclier pendant la pandémie...',
      de: 'In Brasilien fungierte der Föderalismus während der Pandemie als Schutzschild...',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop', // Rio
    score: 65,
  },
  {
    code: 'USA',
    name: {
      en: 'United States',
      fr: 'États-Unis',
      de: 'Vereinigte Staaten',
    },
    summary: {
      en: 'Polarization and state-level rights regression. Abortion, voting rights, and the laboratory of autocracy.',
      fr: "Polarisation et régression des droits au niveau des états. Avortement, droit de vote et laboratoire de l'autocratie.",
      de: 'Polarisierung und Rückgang der Rechte auf staatlicher Ebene. Abtreibung, Wahlrecht und das Labor der Autokratie.',
    },
    content: {
      en: 'The US displays significant variance in democratic quality across states...',
      fr: 'Les États-Unis montrent une variance significative de la qualité démocratique selon les états...',
      de: 'Die USA zeigen eine signifikante Varianz in der demokratischen Qualität zwischen den Staaten...',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop', // Generic US/Coffee/City? Changed to generic
    score: 75,
  },
  {
    code: 'IND',
    name: {
      en: 'India',
      fr: 'Inde',
      de: 'Indien',
    },
    summary: {
      en: 'Centralization trends and state autonomy. Religious nationalism and the erosion of secular federalism.',
      fr: 'Tendances à la centralisation et autonomie des états. Nationalisme religieux et érosion du fédéralisme laïc.',
      de: 'Zentralisierungstendenzen und staatliche Autonomie. Religiöser Nationalismus und die Erosion des säkularen Föderalismus.',
    },
    content: {
      en: "India's cooperative federalism is under strain...",
      fr: "Le fédéralisme coopératif de l'Inde est sous tension...",
      de: 'Indiens kooperativer Föderalismus steht unter Druck...',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop', // India/Taj
    score: 60,
  },
];
