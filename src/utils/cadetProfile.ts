import type { User } from '@supabase/supabase-js';
import { cleanText } from './cadets';

export type CadetDetailField = 'fullName' | 'displayName' | 'cadetNumber' | 'yearLevel' | 'section';
export type CadetDetails = Record<CadetDetailField, string>;
export type CadetDetailErrors = Partial<Record<CadetDetailField, string>>;

export const CADET_DETAIL_FIELDS: readonly CadetDetailField[] = [
  'fullName',
  'displayName',
  'cadetNumber',
  'yearLevel',
  'section',
];

export const CADET_REGISTRATION_FIELDS: readonly CadetDetailField[] = [
  'fullName',
  'displayName',
  'cadetNumber',
];

export const CADET_FIELD_LABELS: Record<CadetDetailField, string> = {
  fullName: 'Full name',
  displayName: 'Display name',
  cadetNumber: 'Cadet number',
  yearLevel: 'Year level',
  section: 'Section',
};

const FIELD_LIMITS: Record<CadetDetailField, { min: number; max: number }> = {
  fullName: { min: 2, max: 100 },
  displayName: { min: 2, max: 50 },
  cadetNumber: { min: 1, max: 30 },
  yearLevel: { min: 1, max: 30 },
  section: { min: 1, max: 30 },
};

export const emptyCadetDetails = (): CadetDetails => ({
  fullName: '',
  displayName: '',
  cadetNumber: '',
  yearLevel: '',
  section: '',
});

export const normalizeCadetDetails = (
  values: Partial<Record<CadetDetailField, unknown>>,
): CadetDetails => ({
  fullName: cleanText(values.fullName) ?? '',
  displayName: cleanText(values.displayName) ?? '',
  cadetNumber: cleanText(values.cadetNumber) ?? '',
  yearLevel: cleanText(values.yearLevel) ?? '',
  section: cleanText(values.section) ?? '',
});

export const normalizeRegistrationDisplayName = (value: unknown): string =>
  (cleanText(value) ?? '').replace(/\s*,\s*/g, ', ').toUpperCase();

export const validateRegistrationDisplayName = (displayName: string): string | null => {
  if (!displayName) return null;

  const separatorIndex = displayName.indexOf(', ');
  const hasSingleSeparator = separatorIndex > 0
    && displayName.indexOf(',', separatorIndex + 1) === -1;
  if (!hasSingleSeparator) {
    return 'Use the format SURNAME, INITIALS.';
  }

  const surname = displayName.slice(0, separatorIndex);
  const initials = displayName.slice(separatorIndex + 2);
  const validSurname = /^\p{L}[\p{L}\p{M}]*(?:[\s'-’]\p{L}[\p{L}\p{M}]*)*$/u.test(surname);
  const validInitials = /^\p{L}[\p{L}\p{M}]*(?:[.\s]+\p{L}[\p{L}\p{M}]*)*\.?$/u.test(initials);

  return validSurname && validInitials
    ? null
    : 'Use the format SURNAME, INITIALS.';
};

export const validateCadetDetails = (
  details: CadetDetails,
  fields: readonly CadetDetailField[] = CADET_DETAIL_FIELDS,
  optionalFields: readonly CadetDetailField[] = ['cadetNumber'],
): CadetDetailErrors => {
  const errors: CadetDetailErrors = {};
  for (const field of fields) {
    const value = details[field];
    const label = CADET_FIELD_LABELS[field];
    const { min, max } = FIELD_LIMITS[field];
    if (!value) {
      if (!optionalFields.includes(field)) errors[field] = `${label} is required.`;
    } else if (value.length < min) {
      errors[field] = `${label} must be at least ${min} characters.`;
    } else if (value.length > max) {
      errors[field] = `${label} must be ${max} characters or fewer.`;
    } else if (/[<>]/.test(value) || [...value].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
      errors[field] = `${label} contains unsupported characters.`;
    }
  }
  if (
    fields.includes('cadetNumber')
    && details.cadetNumber
    && !errors.cadetNumber
    && !/^[A-Za-z0-9][A-Za-z0-9 ._/-]*$/.test(details.cadetNumber)
  ) {
    errors.cadetNumber = 'Cadet number may only contain letters, numbers, spaces, and . _ / -';
  }
  return errors;
};

export const isCadetProfileComplete = (details: CadetDetails) =>
  Object.keys(validateCadetDetails(details)).length === 0;

/** The profile row is authoritative for the display name; the other fields come from the account metadata. */
export const getCadetDetailsFromUser = (
  user: User | null,
  profileDisplayName: string | null | undefined,
): CadetDetails => {
  const metadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
  return normalizeCadetDetails({
    displayName: cleanText(profileDisplayName) ?? metadata.display_name,
    fullName: metadata.full_name,
    cadetNumber: metadata.cadet_number,
    yearLevel: metadata.year_level,
    section: metadata.section,
  });
};

export const toAuthMetadata = (details: CadetDetails) => ({
  display_name: details.displayName,
  full_name: details.fullName,
  cadet_number: details.cadetNumber,
  year_level: details.yearLevel,
  section: details.section,
});

export const toRegistrationMetadata = (details: CadetDetails) => ({
  display_name: details.displayName,
  full_name: details.fullName,
  cadet_number: details.cadetNumber,
});
