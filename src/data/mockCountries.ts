import type { Country } from '../types/models';
import { DemocraticScore } from '../types/models';

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
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Canada is often viewed as a model of stability, yet it faces unique challenges regarding indigenous self-determination and the increasing use of the notwithstanding clause (Section 33 of the Charter).',
              },
            ],
          },
        ],
      },
      fr: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "Le Canada est souvent perçu comme un modèle de stabilité, mais il fait face à des défis uniques concernant l'autodétermination autochtone et l'utilisation croissante de la clause dérogatoire (Article 33 de la Charte).",
              },
            ],
          },
        ],
      },
      de: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Kanada wird oft als Modell für Stabilität angesehen, steht jedoch vor Herausforderungen in Bezug auf die Selbstbestimmung der Ureinwohner und die zunehmende Nutzung der Ausnahmeklausel (Artikel 33 der Charta).',
              },
            ],
          },
        ],
      },
    },
    imageUrl:
      'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800&auto=format&fit=crop', // Toronto
    score: DemocraticScore.VERY_HIGH,
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
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Switzerland\'s system of Direct Democracy and strong Cantonal Sovereignty is under pressure from populist movements that frame international law (e.g., ECHR) as a threat to national "self-determination".',
              },
            ],
          },
        ],
      },
      fr: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Le système de Démocratie Directe et la forte Souveraineté Cantonale de la Suisse sont sous pression face aux mouvements populistes qui présentent le droit international comme une menace.',
              },
            ],
          },
        ],
      },
      de: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Das Schweizer System der Direkten Demokratie steht unter Druck durch populistische Bewegungen, die internationales Recht als Bedrohung der nationalen Selbstbestimmung darstellen.',
              },
            ],
          },
        ],
      },
    },
    imageUrl:
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop', // Alps/Nature
    score: DemocraticScore.VERY_HIGH,
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
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Germany\'s "Militant Democracy" (Wehrhafte Demokratie) is being tested by the rise of the far-right AfD (Alternative für Deutschland), particularly in eastern federal states (Länder).',
              },
            ],
          },
        ],
      },
      fr: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "La \"Démocratie Militante\" allemande est mise à l'épreuve par la montée de l'AfD, particulièrement dans les Länder de l'est.",
              },
            ],
          },
        ],
      },
      de: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Deutschlands Wehrhafte Demokratie wird durch den Aufstieg der AfD, insbesondere in den östlichen Bundesländern, auf die Probe gestellt.',
              },
            ],
          },
        ],
      },
    },
    imageUrl:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop', // Berlin/City
    score: DemocraticScore.HIGH,
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
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Brazil offers a dramatic example of Federalism as a Shield. During the Bolsonaro administration, subnational governments (states) became the primary defenders of health policy and democratic norms against a central populist executive.',
              },
            ],
          },
        ],
      },
      fr: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Le Brésil offre un exemple dramatique du Fédéralisme comme Bouclier. Les gouvernements subnationaux sont devenus les principaux défenseurs des normes démocratiques sous Bolsonaro.',
              },
            ],
          },
        ],
      },
      de: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Brasilien zeigt den Föderalismus als Schutzschild. Unter Bolsonaro wurden die Bundesstaaten zu Verteidigern demokratischer Normen.',
              },
            ],
          },
        ],
      },
    },
    imageUrl:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop', // Rio
    score: DemocraticScore.MODERATE,
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
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'The United States is currently the "Laboratory of Autocracy" (David Pepper). Federalism is facilitating a Great Divergence where red and blue states are becoming effectively two different legal universes regarding fundamental rights.',
              },
            ],
          },
        ],
      },
      fr: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Les États-Unis sont le "Laboratoire de l\'Autocratie". Le fédéralisme facilite une Grande Divergence où les états rouges et bleus deviennent des univers juridiques distincts.',
              },
            ],
          },
        ],
      },
      de: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Die USA erleben eine Große Divergenz, in der rote und blaue Staaten zu unterschiedlichen Rechtsuniversen werden.',
              },
            ],
          },
        ],
      },
    },
    imageUrl:
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop', // Generic US/Coffee/City? Changed to generic
    score: DemocraticScore.HIGH,
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
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "India acts as a warning of how Asymmetric Federalism can be used for centralization. The BJP government has utilized the Governor's office and central agencies to erode the autonomy of opposition-led states.",
              },
            ],
          },
        ],
      },
      fr: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "L'Inde montre comment le Fédéralisme Asymétrique peut servir la centralisation. Le gouvernement BJP utilise le bureau du Gouverneur pour éroder l'autonomie des états d'opposition.",
              },
            ],
          },
        ],
      },
      de: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Indien zeigt, wie Asymmetrischer Föderalismus zur Zentralisierung genutzt werden kann.',
              },
            ],
          },
        ],
      },
    },
    imageUrl:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop', // India/Taj
    score: DemocraticScore.LOW,
  },
];
