import { supabase } from '../lib/supabase';
import { CadetIdentity, cleanText, emptyCadetIdentity } from './cadets';

const BASE_COLUMNS = 'id, display_name';
const EXTENDED_COLUMNS = 'id, display_name, full_name, cadet_number, year_level, section';

// null = not probed yet. The extended columns only exist after the cadet-profile migration is approved and applied.
let extendedColumnsAvailable: boolean | null = null;

const isMissingColumn = (error: { code?: string; message?: string }) =>
  error.code === '42703' || /column .* does not exist/i.test(error.message ?? '');

export const areExtendedCadetColumnsAvailable = () => extendedColumnsAvailable;

export const markExtendedCadetColumnsUnavailable = () => {
  extendedColumnsAvailable = false;
};

export const isMissingColumnError = isMissingColumn;

export interface CadetDirectoryResult {
  identities: Map<string, CadetIdentity>;
  /** Account ids that were requested but not returned (for example, hidden by row-level security). */
  missingIds: string[];
  error: string | null;
}

/**
 * Mirrors the cadet details into the profile columns so instructors can see them.
 * Until the cadet-profile migration is approved and applied the columns do not exist, and this is a harmless no-op.
 */
export async function saveExtendedCadetColumns(
  userId: string,
  details: { fullName: string; cadetNumber: string; yearLevel: string; section: string },
): Promise<{ saved: boolean; error: string | null }> {
  if (extendedColumnsAvailable === false) return { saved: false, error: null };
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: details.fullName,
      cadet_number: details.cadetNumber || null,
      year_level: details.yearLevel,
      section: details.section,
    })
    .eq('id', userId);
  if (error && isMissingColumn(error)) {
    extendedColumnsAvailable = false;
    return { saved: false, error: null };
  }
  if (error) return { saved: false, error: error.message };
  extendedColumnsAvailable = true;
  return { saved: true, error: null };
}

export async function fetchCadetIdentities(ids: readonly string[]): Promise<CadetDirectoryResult> {
  const uniqueIds = [...new Set(ids)];
  const identities = new Map<string, CadetIdentity>();
  if (uniqueIds.length === 0) return { identities, missingIds: [], error: null };

  const run = (columns: string) => supabase.from('profiles').select(columns).in('id', uniqueIds);
  let result = await run(extendedColumnsAvailable === false ? BASE_COLUMNS : EXTENDED_COLUMNS);
  if (result.error && extendedColumnsAvailable !== false && isMissingColumn(result.error)) {
    extendedColumnsAvailable = false;
    result = await run(BASE_COLUMNS);
  } else if (!result.error && extendedColumnsAvailable === null) {
    extendedColumnsAvailable = true;
  }

  if (result.error) {
    return { identities, missingIds: uniqueIds, error: result.error.message };
  }

  for (const row of (result.data ?? []) as unknown as Array<Record<string, unknown>>) {
    const id = typeof row.id === 'string' ? row.id : null;
    if (!id) continue;
    identities.set(id, {
      ...emptyCadetIdentity(id),
      displayName: cleanText(row.display_name),
      fullName: cleanText(row.full_name),
      cadetNumber: cleanText(row.cadet_number),
      yearLevel: cleanText(row.year_level),
      section: cleanText(row.section),
    });
  }

  return {
    identities,
    missingIds: uniqueIds.filter((id) => !identities.has(id)),
    error: null,
  };
}
