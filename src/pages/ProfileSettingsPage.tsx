import { FormEvent, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';
import CadetDetailsFields from '../components/CadetDetailsFields';
import useUnsavedChangesGuard from '../hooks/useUnsavedChangesGuard';
import { saveExtendedCadetColumns } from '../utils/cadetDirectory';
import {
  CADET_DETAIL_FIELDS,
  CadetDetailErrors,
  CadetDetailField,
  CadetDetails,
  getCadetDetailsFromUser,
  normalizeCadetDetails,
  toAuthMetadata,
  validateCadetDetails,
} from '../utils/cadetProfile';
import { getRoleLabel } from '../utils/roleLabels';

export default function ProfileSettingsPage() {
  const { user, profile, role, updateDisplayName } = useAuth();
  const isCadet = role === 'student';
  const visibleFields: readonly CadetDetailField[] = isCadet ? CADET_DETAIL_FIELDS : ['displayName'];
  const [details, setDetails] = useState<CadetDetails>(() => getCadetDetailsFromUser(user, profile?.display_name));
  const savedDetails = useRef(details);
  const [fieldErrors, setFieldErrors] = useState<CadetDetailErrors>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const hasUnsavedChanges = visibleFields.some((field) => details[field] !== savedDetails.current[field]);
  useUnsavedChangesGuard(
    'profile-settings',
    hasUnsavedChanges,
    'You have unsaved profile changes. Leave this page and discard them?',
  );

  const updateDetail = (field: CadetDetailField, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const normalized = normalizeCadetDetails(details);
    const errors: CadetDetailErrors = {};
    for (const [field, message] of Object.entries(validateCadetDetails(normalized)) as Array<[CadetDetailField, string]>) {
      if (visibleFields.includes(field)) errors[field] = message;
    }
    setDetails(normalized);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Complete all required fields before saving.');
      return;
    }

    setSaving(true);
    try {
      await updateDisplayName(normalized.displayName);
      if (isCadet && user) {
        const { error: metadataError } = await supabase.auth.updateUser({ data: toAuthMetadata(normalized) });
        if (metadataError) {
          throw new Error(`Your display name was saved, but your other details could not be saved: ${metadataError.message}`);
        }
      }
      savedDetails.current = normalized;
      if (isCadet && user) {
        const mirrored = await saveExtendedCadetColumns(user.id, normalized);
        if (mirrored.error) {
          setSuccess(`Profile saved to your account. Instructors cannot see the extra details yet (${mirrored.error}).`);
          return;
        }
        if (!mirrored.saved) {
          setSuccess(
            'Profile saved to your account. Instructors cannot see full name, cadet number, year level, or section until the profile database update is applied.',
          );
          return;
        }
      }
      setSuccess('Profile saved.');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save your profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <header>
          <h1 className="heading-title">Profile Settings</h1>
          <p className="text-light-gray mt-2">
            {isCadet
              ? 'Keep your cadet information current. Instructors identify you by your display name.'
              : 'Manage the profile information supported by your account.'}
          </p>
        </header>

        <section className="glass-panel p-6 sm:p-8">
          <h2 className="heading-section mb-5">Account information</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-cyan">Email</dt>
              <dd className="text-light-gray break-all">{user?.email || 'Not available'}</dd>
            </div>
            <div>
              <dt className="text-sm text-cyan">Verified role</dt>
              <dd className="text-light-gray">
                {role ? getRoleLabel(role) : 'Not verified'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-cyan">Account ID</dt>
              <dd className="text-light-gray font-mono text-sm break-all">
                {user?.id || 'Not available'}
              </dd>
            </div>
          </dl>
        </section>

        <section className="glass-panel p-6 sm:p-8">
          <h2 className="heading-section mb-2">{isCadet ? 'Cadet information' : 'Display name'}</h2>
          <p className="text-light-gray text-sm mb-5">
            {isCadet
              ? 'Full name, display name, year level, and section are required. Cadet number is optional. Your display name is used in instructor assessment and grading lists.'
              : 'Your display name is shown in the LMS. Saving is subject to the existing database permissions.'}
          </p>
          <form onSubmit={saveProfile} noValidate className="space-y-4">
            <CadetDetailsFields
              idPrefix="profile"
              fields={visibleFields}
              values={details}
              errors={fieldErrors}
              disabled={saving}
              onChange={updateDetail}
            />
            <button type="submit" disabled={saving} className="button-primary disabled:opacity-60">
              {saving ? 'Saving...' : isCadet ? 'Save cadet information' : 'Save display name'}
            </button>
          </form>
          {error && <p role="alert" className="text-red-300 text-sm mt-4">{error}</p>}
          {success && <p role="status" className="text-cyan text-sm mt-4">{success}</p>}
        </section>

      </div>
    </div>
  );
}
