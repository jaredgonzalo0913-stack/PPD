import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';
import {
  AdminAccountProfile,
  InstructorAccessRequest,
  InstructorRequestDecision,
  UserRole,
} from '../types';
import { getRoleLabel } from '../utils/roleLabels';
import { compareCadets } from '../utils/cadets';

type AssignableRole = Extract<UserRole, 'student' | 'instructor'>;

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
};

export default function AdminAccountManagementPage() {
  const { role, user } = useAuth();
  const [profiles, setProfiles] = useState<AdminAccountProfile[]>([]);
  const [requests, setRequests] = useState<InstructorAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const processingActionRef = useRef<string | null>(null);

  const loadData = useCallback(async () => {
    if (role !== 'admin') {
      setProfiles([]);
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setProfileError(null);
    setRequestError(null);

    try {
      const [profilesResult, requestsResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, display_name, role')
          .order('id'),
        supabase
          .from('instructor_access_requests')
          .select('id, user_id, status, submitted_at')
          .order('submitted_at', { ascending: false }),
      ]);

      if (profilesResult.error) {
        setProfileError(
          `Unable to load profiles. Check the current Supabase permissions. ${profilesResult.error.message}`,
        );
      } else {
        setProfiles(
          [...(profilesResult.data ?? [])].sort((first, second) =>
            compareCadets(
              { id: first.id, displayName: first.display_name },
              { id: second.id, displayName: second.display_name },
            )),
        );
      }

      if (requestsResult.error) {
        setRequestError(
          `Unable to load instructor-access requests. Check the current Supabase permissions. ${requestsResult.error.message}`,
        );
      } else {
        const accountNames = new Map(
          (profilesResult.data ?? []).map((profile) => [profile.id, profile.display_name]),
        );
        setRequests(
          (requestsResult.data ?? []).map((request) => ({
            ...request,
            applicant: {
              display_name: accountNames.get(request.user_id) ?? null,
            },
          })),
        );
      }
    } catch (loadError) {
      const detail = loadError instanceof Error ? ` ${loadError.message}` : '';
      setProfileError(`Unable to load account profiles.${detail}`);
      setRequestError(`Unable to load instructor-access requests.${detail}`);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const runAction = async (
    actionKey: string,
    action: () => PromiseLike<{ error: { message: string } | null }>,
    successMessage: string,
  ) => {
    if (role !== 'admin' || processingActionRef.current) return;

    processingActionRef.current = actionKey;
    setProcessingAction(actionKey);
    setActionError(null);
    setSuccess(null);

    try {
      const { error: rpcError } = await action();
      if (rpcError) {
        setActionError(rpcError.message);
        return;
      }

      setSuccess(successMessage);
      await loadData();
    } catch (actionError) {
      const detail = actionError instanceof Error ? actionError.message : 'Unexpected error.';
      setActionError(detail);
    } finally {
      processingActionRef.current = null;
      setProcessingAction(null);
    }
  };

  const assignRole = (profile: AdminAccountProfile, newRole: AssignableRole) => {
    if (profile.id === user?.id || profile.role === 'admin') return;

    const confirmed = window.confirm(
      `Change this account's role from ${getRoleLabel(profile.role)} to ${getRoleLabel(newRole)}?`,
    );
    if (!confirmed) return;

    void runAction(
      `role:${profile.id}`,
      () =>
        supabase.rpc('admin_set_user_role', {
          target_user_id: profile.id,
          new_role: newRole,
        }),
      `Account role changed to ${newRole}.`,
    );
  };

  const reviewRequest = (
    request: InstructorAccessRequest,
    decision: InstructorRequestDecision,
  ) => {
    void runAction(
      `request:${request.id}`,
      () =>
        supabase.rpc('review_instructor_access_request', {
          request_id: request.id,
          decision,
        }),
      `Instructor-access request ${decision}.`,
    );
  };

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

  const pendingRequests = requests.filter((request) => request.status === 'pending');
  const reviewedRequests = requests.filter((request) => request.status !== 'pending');

  const renderRequest = (request: InstructorAccessRequest, pending: boolean) => (
    <article key={request.id} className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <h3 className="font-semibold text-cyan">
            {request.applicant?.display_name?.trim() || 'Name not available'}
          </h3>
          <p className="text-sm text-light-gray">
            Submitted: {formatDate(request.submitted_at)}
          </p>
          <p className="text-sm text-light-gray">
            Status: <span className="capitalize">{request.status}</span>
          </p>
          <p className="text-xs text-light-gray/70 font-mono break-all">
            Account ID: {request.user_id}
          </p>
        </div>
        {pending && (
          <div className="flex gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => reviewRequest(request, 'approved')}
              disabled={processingAction !== null}
              className="button-primary disabled:opacity-60"
            >
              {processingAction === `request:${request.id}` ? 'Processing...' : 'Approve'}
            </button>
            <button
              type="button"
              onClick={() => reviewRequest(request, 'rejected')}
              disabled={processingAction !== null}
              className="button-secondary disabled:opacity-60"
            >
              {processingAction === `request:${request.id}` ? 'Processing...' : 'Reject'}
            </button>
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <header className="glass-panel p-8 mb-8">
          <h1 className="heading-title">Account Management</h1>
          <p className="text-light-gray">
            Review instructor-access requests and manage Cadet or Instructor access. Roles are changed through the secure Supabase function.
          </p>
        </header>

        {success && (
          <p role="status" className="text-cyan mb-4">{success}</p>
        )}
        {actionError && (
          <p role="alert" className="text-red-300 mb-4">{actionError}</p>
        )}

        <section className="glass-panel p-6 mb-8">
          <h2 className="heading-section">Pending instructor requests</h2>
          {loading && <p role="status" className="text-cyan">Loading account data...</p>}
          {!loading && requestError && (
            <div role="alert" className="space-y-2">
              <p className="text-red-300">{requestError}</p>
              <p className="text-light-gray text-sm">
                Requests are not shown unless Supabase returns them under the current RLS policies.
              </p>
            </div>
          )}
          {!loading && !requestError && pendingRequests.length === 0 && (
            <p className="text-light-gray">
              No pending requests are visible to this account. RLS may limit which requests are returned.
            </p>
          )}
          {!loading && !requestError && pendingRequests.length > 0 && (
            <div className="space-y-4">
              {pendingRequests.map((request) => renderRequest(request, true))}
            </div>
          )}
        </section>

        <section className="glass-panel p-6 mb-8">
          <h2 className="heading-section">Reviewed instructor requests</h2>
          {!loading && !requestError && reviewedRequests.length === 0 && (
            <p className="text-light-gray">No reviewed requests are visible.</p>
          )}
          {!loading && !requestError && reviewedRequests.length > 0 && (
            <div className="space-y-4">
              {reviewedRequests.map((request) => renderRequest(request, false))}
            </div>
          )}
        </section>

        <section className="glass-panel p-6">
          <h2 className="heading-section">Registered accounts</h2>
          {loading && <p role="status" className="text-cyan">Loading account profiles...</p>}
          {!loading && profileError && (
            <div role="alert" className="space-y-2">
              <p className="text-red-300">{profileError}</p>
              <p className="text-light-gray text-sm">
                Profiles are not shown unless Supabase returns them under the current RLS policies.
              </p>
            </div>
          )}
          {!loading && !profileError && profiles.length === 0 && (
            <p className="text-light-gray">
              No profiles are visible to this account. This does not confirm that no accounts exist;
              row-level security may limit which profiles are returned.
            </p>
          )}
          {!loading && !profileError && profiles.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cyan/30 text-cyan">
                    <th scope="col" className="p-3">Display name</th>
                    <th scope="col" className="p-3">Role</th>
                    <th scope="col" className="p-3">Account ID</th>
                    <th scope="col" className="p-3">Role actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((account) => {
                    const isCurrentAdmin = account.id === user?.id;
                    const isAdminAccount = account.role === 'admin';
                    const processing = processingAction === `role:${account.id}`;

                    return (
                      <tr key={account.id} className="border-b border-white/10">
                        <td className="p-3 text-light-gray">
                          {account.display_name?.trim() || 'Not provided'}
                        </td>
                        <td className="p-3 text-light-gray">{getRoleLabel(account.role)}</td>
                        <td className="p-3 text-light-gray font-mono text-sm break-all">
                          {account.id}
                        </td>
                        <td className="p-3">
                          {isAdminAccount ? (
                            <span className="text-light-gray/70">
                              {isCurrentAdmin ? 'Your admin role is protected' : 'Admin role protected'}
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => assignRole(account, 'instructor')}
                                disabled={processingAction !== null || account.role === 'instructor' || isCurrentAdmin}
                                className="button-primary disabled:opacity-50"
                              >
                                {processing && account.role === 'student' ? 'Updating...' : 'Make Instructor'}
                              </button>
                              <button
                                type="button"
                                onClick={() => assignRole(account, 'student')}
                                disabled={processingAction !== null || account.role === 'student' || isCurrentAdmin}
                                className="button-secondary disabled:opacity-50"
                              >
                                {processing && account.role === 'instructor' ? 'Updating...' : 'Set Cadet'}
                              </button>
                              {isCurrentAdmin && (
                                <span className="text-light-gray/70 text-sm self-center">
                                  Your account cannot be changed here
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-light-gray/70 text-sm mt-4">
                Authentication emails are not shown because no authorized email lookup is configured.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
