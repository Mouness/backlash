import type { TeamMember } from '../types/models';

export const MOCK_TEAM: Omit<TeamMember, 'id'>[] = [
  {
    name: 'Nesa Zimmermann',
    gender: 'female',
    order: 1,
    role: {
      en: 'Assistant Professor, UNINE',
      fr: 'Professeure Assistante, UNINE',
      de: 'Assistenzprofessorin, UNINE',
    },
    bio: {
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Nesa Zimmermann is an Assistant Professor at the University of Neuchâtel. Her research focuses on comparative constitutional law and human rights, with a particular interest in federalism and democratic resilience.',
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
                text: "Nesa Zimmermann est professeure assistante à l'Université de Neuchâtel. Ses recherches portent sur le droit constitutionnel comparé et les droits de l'homme, avec un intérêt particulier pour le fédéralisme et la résilience démocratique.",
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
                text: 'Nesa Zimmermann ist Assistenzprofessorin an der Universität Neuenburg. Ihre Forschungsschwerpunkte sind vergleichendes Verfassungsrecht und Menschenrechte, insbesondere Föderalismus und demokratische Resilienz.',
              },
            ],
          },
        ],
      },
    },
    email: 'nesa.zimmermann@unine.ch',
  },
  {
    name: 'Marie-Clare Hoque',
    gender: 'female',
    order: 2,
    role: {
      en: 'Postdoctoral Researcher, UNINE',
      fr: 'Postdoctorante UNINE',
      de: 'Postdoktorandin, UNINE',
    },
    bio: {
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Marie-Clare Hoque specializes in public law and legal theory. She is currently working on the intersection of migration law and federalism.',
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
                text: "Marie-Clare Hoque est spécialisée en droit public et en théorie du droit. Elle travaille actuellement sur l'intersection du droit des migrations et du fédéralisme.",
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
                text: 'Marie-Clare Hoque ist spezialisiert auf öffentliches Recht und Rechtstheorie. Sie arbeitet derzeit an der Schnittstelle von Migrationsrecht und Föderalismus.',
              },
            ],
          },
        ],
      },
    },
    email: 'marie-clare.hoque@unine.ch',
  },
  {
    name: 'Karen Pounchis',
    gender: 'female',
    order: 3,
    role: {
      en: 'Postdoctoral Researcher, UNINE & UOttawa',
      fr: 'Postdoctorante UNINE et UOttawa',
      de: 'Postdoktorandin, UNINE und UOttawa',
    },
    bio: {
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Karen Pounchis conducts research between Switzerland and Canada, focusing on comparative federalism and indigenous rights.',
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
                text: 'Karen Pounchis mène des recherches entre la Suisse et le Canada, se concentrant sur le fédéralisme comparé et les droits des autochtones.',
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
                text: 'Karen Pounchis forscht zwischen der Schweiz und Kanada und konzentriert sich auf vergleichenden Föderalismus und Rechte der Ureinwohner.',
              },
            ],
          },
        ],
      },
    },
    email: 'karen.pounchis@unine.ch',
  },
  {
    name: 'Nicolò Alessi',
    gender: 'male',
    order: 4,
    role: {
      en: 'Postdoctoral Researcher, UNINE & UniDistance',
      fr: 'Postdoctorant UNINE et UniDistance',
      de: 'Postdoktorand, UNINE und UniDistance',
    },
    bio: {
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: "Nicolò Alessi's work explores the role of subnational entities in international law and environmental protection.",
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
                text: "Les travaux de Nicolò Alessi explorent le rôle des entités infranationales dans le droit international et la protection de l'environnement.",
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
                text: 'Nicolò Alessis Arbeit untersucht die Rolle subnationaler Einheiten im Völkerrecht und im Umweltschutz.',
              },
            ],
          },
        ],
      },
    },
    email: 'nicolo.alessi@unine.ch',
  },
  {
    name: 'Maïna Siclari',
    gender: 'female',
    order: 5,
    role: {
      en: 'PhD Student, UNINE',
      fr: 'Doctorante UNINE',
      de: 'Doktorandin, UNINE',
    },
    bio: {
      en: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Maïna Siclari is pursuing her PhD on the impact of populism on constitutional courts in federal systems.',
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
                text: "Maïna Siclari poursuit son doctorat sur l'impact du populisme sur les cours constitutionnelles dans les systèmes fédéraux.",
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
                text: 'Maïna Siclari promoviert über die Auswirkungen des Populismus auf Verfassungsgerichte in föderalen Systemen.',
              },
            ],
          },
        ],
      },
    },
    email: 'maina.siclari@unine.ch',
  },
];
