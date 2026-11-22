export interface CadetIdentity {
  id: string;
  displayName: string | null;
  fullName: string | null;
  cadetNumber: string | null;
  yearLevel: string | null;
  section: string | null;
}

export type CadetSortable = { id: string } & Partial<Omit<CadetIdentity, 'id'>>;

const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

export const cleanText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized.length > 0 ? normalized : null;
};

export const emptyCadetIdentity = (id: string): CadetIdentity => ({
  id,
  displayName: null,
  fullName: null,
  cadetNumber: null,
  yearLevel: null,
  section: null,
});

export const shortAccountId = (id: string) => id.slice(0, 8);

const getSortName = (cadet: CadetSortable | null | undefined) =>
  cleanText(cadet?.displayName) ?? cleanText(cadet?.fullName);

export const getCadetPrimaryName = (
  cadet: CadetSortable | null | undefined,
  fallback = 'Display name unavailable',
) => getSortName(cadet) ?? fallback;

export const getCadetSecondaryLine = (cadet: CadetSortable): string => {
  const number = cleanText(cadet.cadetNumber);
  const yearLevel = cleanText(cadet.yearLevel);
  const section = cleanText(cadet.section);
  return [
    number ? `Cadet no. ${number}` : `Account ${shortAccountId(cadet.id)}`,
    yearLevel,
    section ? `Section ${section}` : null,
  ].filter(Boolean).join(' · ');
};

/** A–Z by display name; cadets without a usable name come last, then by cadet number and account id. */
export const compareCadets = (first: CadetSortable, second: CadetSortable): number => {
  const firstName = getSortName(first);
  const secondName = getSortName(second);
  if (firstName && !secondName) return -1;
  if (!firstName && secondName) return 1;
  if (firstName && secondName) {
    const byName = collator.compare(firstName, secondName);
    if (byName !== 0) return byName;
  }
  const byNumber = collator.compare(cleanText(first.cadetNumber) ?? '', cleanText(second.cadetNumber) ?? '');
  if (byNumber !== 0) return byNumber;
  return first.id < second.id ? -1 : first.id > second.id ? 1 : 0;
};

export const sortCadets = <T extends CadetSortable>(items: readonly T[]): T[] =>
  [...items].sort(compareCadets);
