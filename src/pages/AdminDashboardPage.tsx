import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { getRoleLabel } from '../utils/roleLabels';

interface AccountOverview {
  student: number;
  instructor: number;
  admin: number;
}

const ACCOUNT_ROLES: UserRole[] = ['student', 'instructor', 'admin'];

export default function AdminDashboardPage() {
  const { profile, role } = useAuth();
  const [overview, setOverview] = useState<AccountOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (role !== 'admin') {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);
    setOverview(null);

    const countForRole = async (accountRole: UserRole) => {
        const { count, error: queryError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', accountRole);

        if (queryError) throw queryError;
        if (count === null) {
          throw new Error(`The ${getRoleLabel(accountRole)} profile count was not returned.`);
        }

        return count;
      };

    Promise.all(ACCOUNT_ROLES.map(countForRole))
      .then(([student, instructor, admin]) => {
        if (!active) return;
        setOverview({ student, instructor, admin });
      })
      .catch((queryError: unknown) => {
        if (!active) return;
        const detail = queryError instanceof Error ? ` ${queryError.message}` : '';
        setError(
          `Unable to load account counts. Supabase permissions may not allow this account to count profiles.${detail}`,
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [role]);

  if (role !== 'admin') {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <section className="glass-panel p-8 text-center">
            <h1 className="heading-section">Admin access required</h1>
            <p className="text-light-gray">
              This page is available only to accounts with a verified admin profile.
            </p>
          </section>
        </div>
      </div>
    );
  }

  const displayName = profile?.display_name?.trim() || 'Administrator';

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="glass-panel p-8 mb-8">
          <h1 className="heading-title">Admin Dashboard</h1>
          <p className="text-light-gray">
            Welcome, {displayName}. View the account overview available to your admin account.
          </p>
        </header>

        <section className="glass-panel p-8">
          <h2 className="heading-section mb-6">Account Overview</h2>

          {loading && (
            <p role="status" className="text-cyan">
              Loading account counts...
            </p>
          )}

          {!loading && error && (
            <div role="alert" className="space-y-2">
              <p className="text-red-300">{error}</p>
              <p className="text-light-gray text-sm">
                Account data is not displayed when Supabase does not return an authorized result.
              </p>
            </div>
          )}

          {!loading && !error && overview && (
            <>
              {overview.student + overview.instructor + overview.admin === 0 ? (
                <p className="text-light-gray">
                  No account profiles are visible to this admin account. This may mean there are no
                  profiles, or row-level security does not allow this query to see them.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card">
                    <p className="text-light-gray">Visible profiles</p>
                    <p className="text-3xl font-bold glow-text">
                      {overview.student + overview.instructor + overview.admin}
                    </p>
                  </div>
                  <div className="card">
                    <p className="text-light-gray">Cadets</p>
                    <p className="text-3xl font-bold glow-text">{overview.student}</p>
                  </div>
                  <div className="card">
                    <p className="text-light-gray">Instructors</p>
                    <p className="text-3xl font-bold glow-text">{overview.instructor}</p>
                  </div>
                  <div className="card">
                    <p className="text-light-gray">Admins</p>
                    <p className="text-3xl font-bold glow-text">{overview.admin}</p>
                  </div>
                </div>
              )}
              <p className="text-light-gray/70 text-sm mt-4">
                Counts include only profiles visible under the current Supabase row-level security policies.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
