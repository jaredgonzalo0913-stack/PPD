import { FormEvent, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { getRoleLabel } from '../utils/roleLabels';

export default function ProfileSettingsPage() {
  const { user, profile, role, updateDisplayName } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const saveDisplayName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateDisplayName(displayName);
      setSuccess('Display name updated.');
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save display name. Please try again.',
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
            Manage the profile information currently supported by your account.
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
          <h2 className="heading-section mb-2">Display name</h2>
          <p className="text-light-gray text-sm mb-5">
            This field exists in your current Supabase profile. Saving is subject to the existing database permissions.
          </p>
          <form onSubmit={saveDisplayName} className="space-y-4">
            <div>
              <label htmlFor="profile-display-name" className="block text-sm font-semibold text-cyan mb-2">
                Display name
              </label>
              <input
                id="profile-display-name"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>
            <button type="submit" disabled={saving} className="button-primary disabled:opacity-60">
              {saving ? 'Saving...' : 'Save display name'}
            </button>
          </form>
          {error && <p role="alert" className="text-red-300 text-sm mt-4">{error}</p>}
          {success && <p role="status" className="text-cyan text-sm mt-4">{success}</p>}
        </section>

        <section className="glass-panel p-6 sm:p-8">
          <h2 className="heading-section mb-2">Additional profile details</h2>
          <p role="status" className="text-amber-200 text-sm mb-5">
            These fields are temporary drafts only. The current profile schema does not include them, so they cannot be saved and will be lost when you leave this page or sign out.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="profile-bio" className="block text-sm font-semibold text-cyan mb-2">
                Short bio
              </label>
              <textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                rows={3}
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>
            <div>
              <label htmlFor="profile-interests" className="block text-sm font-semibold text-cyan mb-2">
                Hobbies and interests
              </label>
              <textarea
                id="profile-interests"
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
                rows={3}
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>
            <div>
              <label htmlFor="profile-contact-number" className="block text-sm font-semibold text-cyan mb-2">
                Contact number (optional)
              </label>
              <input
                id="profile-contact-number"
                type="tel"
                autoComplete="tel"
                value={contactNumber}
                onChange={(event) => setContactNumber(event.target.value)}
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>
          </div>
          <p className="text-light-gray/70 text-xs mt-5">
            Date of birth and emergency-contact fields are not collected because they are sensitive and the current backend has no corresponding fields or privacy controls.
          </p>
        </section>
      </div>
    </div>
  );
}
