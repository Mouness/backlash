import { ENABLE_MOCKS } from '../config';
import { MOCK_COUNTRIES } from '../data/mockCountries';
import { MOCK_TEAM } from '../data/mockTeam';
import { MOCK_PUBLICATIONS } from '../data/mockPublications';
import type { Country } from '../types/models';
import type { TeamMember } from '../types/models';
import type { Publication } from '../types/models';

type DataType = 'country' | 'team' | 'publication';

import type { JSONContent } from '@tiptap/react';
import type { LocalizedText, LocalizedRichContent } from '../types/models';

export const getLocalizedContent = (
  content: string | LocalizedText | LocalizedRichContent | null | undefined,
  lang: string,
): string | JSONContent => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (content as any)[lang] || (content as any)['en'] || '';
};

export const getLocalizedText = (
  content: string | LocalizedText | null | undefined,
  lang: string,
): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (content as any)[lang] || (content as any)['en'] || '';
};

export const extractTextFromTiptap = (content: string | JSONContent | null | undefined): string => {
  if (!content) return '';
  if (typeof content === 'string') return content;

  let text = '';
  if (content.text) {
    text += content.text;
  }

  if (content.content) {
    content.content.forEach((child) => {
      text += ' ' + extractTextFromTiptap(child);
    });
  }

  return text.trim();
};

export const mergeDataByType = (dbData: unknown[], type: DataType): unknown[] => {
  if (!ENABLE_MOCKS) {
    return dbData;
  }

  switch (type) {
    case 'country':
      return mergeCountries(dbData as Country[], MOCK_COUNTRIES as Country[]);
    case 'team':
      return mergeTeam(dbData as TeamMember[], MOCK_TEAM as TeamMember[]);
    case 'publication':
      return mergePublications(dbData as Publication[], MOCK_PUBLICATIONS);
    default:
      return dbData;
  }
};

const mergeCountries = (dbData: Country[], mockData: Country[]) => {
  const merged = mockData.map((c) => ({ ...c, id: c.code })); // Ensure ID matches code for mocks
  const dbMap = new Map(dbData.map((d) => [d.code, d]));

  for (let i = 0; i < merged.length; i++) {
    const mockCode = merged[i].code;
    if (mockCode && dbMap.has(mockCode)) {
      merged[i] = dbMap.get(mockCode) as Country;
      dbMap.delete(mockCode);
    }
  }
  dbMap.forEach((val) => merged.push(val));
  return merged;
};

const mergeTeam = (dbData: TeamMember[], mockData: TeamMember[]) => {
  // Assign temporary IDs to mock items if they don't have one
  const merged: TeamMember[] = mockData.map((m) => ({
    ...m,
    id: m.id || m.email || m.name.toLowerCase().replace(/\s+/g, '-'),
    isMock: !m.id, // If it didn't have an ID, it's a mock we are filling in (or if it's from mockData list and we are iterating it)
  }));

  const dbMap = new Map(dbData.map((d) => [d.email, d]));

  for (let i = 0; i < merged.length; i++) {
    const mockEmail = merged[i].email;
    if (mockEmail && dbMap.has(mockEmail)) {
      merged[i] = dbMap.get(mockEmail) as TeamMember;
      dbMap.delete(mockEmail);
    }
  }
  dbMap.forEach((val) => merged.push(val));
  return merged;
};

const mergePublications = (dbData: Publication[], mockData: Publication[]) => {
  const merged = [...mockData];
  const dbMapById = new Map(dbData.map((d) => [d.id, d]));
  const dbMapByTitle = new Map(
    dbData.map((d) => {
      // Handle hybrid title types for mapping
      const titleKey = typeof d.title === 'string' ? d.title : d.title?.en;
      return [titleKey, d] as const;
    }),
  );

  const handledTitles = new Set<string>();

  for (let i = 0; i < merged.length; i++) {
    const mock = merged[i];
    let match: Publication | undefined;

    // Mock title is always object structure in our mock data
    const mockTitleEn = typeof mock.title === 'string' ? mock.title : mock.title?.en;

    if (mock.id && dbMapById.has(mock.id)) {
      match = dbMapById.get(mock.id);
    } else if (mockTitleEn && dbMapByTitle.has(mockTitleEn)) {
      match = dbMapByTitle.get(mockTitleEn);
    }

    if (match) {
      merged[i] = match;
      if (match.id) dbMapById.delete(match.id);

      const matchTitleEn = typeof match.title === 'string' ? match.title : match.title?.en;
      if (matchTitleEn) {
        dbMapByTitle.delete(matchTitleEn);
        handledTitles.add(matchTitleEn);
      }
      if (mockTitleEn) handledTitles.add(mockTitleEn);
    }
  }

  dbMapById.forEach((val) => {
    const valTitleEn = typeof val.title === 'string' ? val.title : val.title?.en;
    if (valTitleEn && handledTitles.has(valTitleEn)) return;
    merged.push(val);
  });

  return merged;
};
