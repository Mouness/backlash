import type { JSONContent } from '@tiptap/react';

export interface LocalizedText {
  en: string;
  fr: string;
  de: string;
}

export interface LocalizedRichContent {
  en: string | JSONContent;
  fr: string | JSONContent;
  de: string | JSONContent;
}

import type { Timestamp } from 'firebase/firestore';

export const DemocraticScore = {
  UNKNOWN: 'UNKNOWN',
  VERY_LOW: 'VERY_LOW',
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY_HIGH',
} as const;

export type DemocraticScore = (typeof DemocraticScore)[keyof typeof DemocraticScore];

export interface Country {
  id: string;
  code: string; // ISO code or ID used for map matching (e.g. CAN, CHE)
  name: LocalizedText;
  summary: LocalizedText;
  content: LocalizedRichContent; // Detailed analysis
  imageUrl?: string;
  documentUrl?: string; // URL to PDF/DOC analysis
  score?: DemocraticScore; // Enum indicating democratic resilience/backlash status
}

export interface TeamMember {
  id?: string;
  name: string;
  role: LocalizedText;
  bio?: LocalizedRichContent;
  email?: string;
  gender: 'female' | 'male';
  order: number;
  photoUrl?: string;
  isMock?: boolean;
}

export interface Publication {
  id?: string;
  title: string | LocalizedText;
  description: string | LocalizedRichContent;
  date: Timestamp;
  category: string; // 'news', 'event', 'article'
  link?: string;
  imageUrl?: string;
  documentUrl?: string; // URL to PDF/DOC
}
