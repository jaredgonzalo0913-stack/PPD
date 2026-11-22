import { FormEvent, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store';

const RECOVERY_REDIRECT = `${window.location.origin}/?flow=password-recovery`;
const MIN_PASSWORD_LENGTH = 8;

const recoveryUrlError = (): string | null => {
  const query = new URLSearchParams(window.location.search);
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const errorCode = query.get('error_code')
    ?? fragment.get('error_code')
    ?? query.get('error')
    ?? fragment.get('error');

  if (!errorCode && !query.has('error_description') && !fragment.has('error_description')) {
    return null;
  }

  if (errorCode === 'otp_expired' || errorCode === 'token_expired') {
    return 'This password recovery link has expired or has already been used. Request a new link below.';
  }
  if (errorCode === 'access_denied' || errorCode === 'unauthorized') {
    return 'This password recovery link is invalid or no longer authorized. Request a new link below.';
  }
  return 'This password recovery link is invalid or expired. Request a new link below.';
};

const isRecoverySessionError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false;

  const authError = error as { code?: unknown; status?: unknown };
  const code = typeof authError.code === 'string' ? authError.code.toLowerCase() : '';
  return (
    ['otp_expired', 'token_expired', 'session_not_found', 'refresh_token_not_found',
      'invalid_grant', 'invalid_token', 'bad_jwt', 'unauthorized', 'user_not_found']
      .includes(code) ||
    authError.status === 401 ||
    authError.status === 403
  );
};

export default function PasswordRecoveryPage() {
  const {
    session,
    recoverySession,
    clearRecoverySession,
    signOut,
  } = useAuth();
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const actionInProgress = useRef(false);
  const [recoveryLinkError] = useState(recoveryUrlError);
  const [showRecoveryRequest, setShowRecoveryRequest] = useState(Boolean(recoveryLinkError));
  const [error, setError] = useState<string | null>(recoveryLinkError);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const canUpdatePassword = Boolean(session && recoverySession && !recoveryLinkError);

  const handleRecoveryRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (actionInProgress.current) return;
    actionInProgress.current = true;
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const { error: requestError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: RECOVERY_REDIRECT,
      });

      if (requestError) {
        setError('We could not start the recovery request. Please try again later.');
        return;
      }

      setMessage(
        'If an account exists for that email, password recovery instructions will be sent. Check your inbox and spam folder.',
      );
    } catch {
      setError('We could not start the recovery request. Please try again later.');
    } finally {
      actionInProgress.current = false;
      setBusy(false);
    }
  };

  const handlePasswordUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!session || !recoverySession || recoveryLinkError) {
      setError('A verified recovery link is required before changing your password.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    if (actionInProgress.current) return;

    actionInProgress.current = true;
    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        if (isRecoverySessionError(updateError)) {
          clearRecoverySession();
          setShowRecoveryRequest(true);
          setEmail(session.user.email ?? '');
          try {
            await signOut();
            setError('This recovery link is no longer valid. Request a new recovery email below.');
          } catch {
            setError(
              'This recovery link is no longer valid. Sign out, then request a new recovery email below.',
            );
          }
        } else {
          setError(
            'Unable to update your password. Check the password requirements and try again, or request a new recovery email below.',
          );
        }
        return;
      }

      setPasswordUpdated(true);
      setMessage('Your password has been updated. Sign in again using your new password.');
      setPassword('');
      setConfirmPassword('');
    } catch (updateError) {
      if (isRecoverySessionError(updateError)) {
        clearRecoverySession();
        setShowRecoveryRequest(true);
        setEmail(session.user.email ?? '');
        try {
          await signOut();
          setError('This recovery link is no longer valid. Request a new recovery email below.');
        } catch {
          setError(
            'This recovery link is no longer valid. Sign out, then request a new recovery email below.',
          );
        }
      } else {
        setError(
          'Unable to update your password. Check the password requirements and try again, or request a new recovery email below.',
        );
      }
    } finally {
      actionInProgress.current = false;
      setBusy(false);
    }
  };

  const handleReturnToSignIn = async () => {
    if (actionInProgress.current) return;
    actionInProgress.current = true;
    setBusy(true);
    setError(null);
    try {
      if (session) {
        await signOut();
      }
      clearRecoverySession();
      window.history.replaceState({}, document.title, window.location.pathname);
      setCurrentPage('home');
    } catch {
      setError(
        passwordUpdated
          ? 'Your password was changed, but this session could not be ended. Sign out and sign in again.'
          : 'Unable to end this recovery session. Please try again.',
      );
    } finally {
      actionInProgress.current = false;
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <section className="glass-panel w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold glow-text mb-2">PPD</div>
          <h1 className="heading-section">
            {canUpdatePassword && !showRecoveryRequest && !passwordUpdated
              ? 'Choose a new password'
              : 'Password recovery'}
          </h1>
          <p className="text-light-gray">
            {canUpdatePassword && !showRecoveryRequest && !passwordUpdated
              ? 'Set a new password for your account.'
              : 'Recover access to your PPD LMS account.'}
          </p>
        </div>

        {error && (
          <p role="alert" className="text-red-300 text-sm mb-5">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="text-cyan text-sm mb-5">
            {message}
          </p>
        )}

        {canUpdatePassword && !passwordUpdated && !showRecoveryRequest ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div>
              <label htmlFor="new-password" className="block text-sm font-semibold text-cyan mb-2">
                New password
              </label>
              <div className="flex gap-2">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide new password' : 'Show new password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="button-secondary"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-light-gray/70 text-xs mt-1">
                Use at least {MIN_PASSWORD_LENGTH} characters.
              </p>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-cyan mb-2">
                Confirm new password
              </label>
              <div className="flex gap-2">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="min-w-0 flex-1 p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  className="button-secondary"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={busy} className="button-primary w-full disabled:opacity-60">
              {busy ? 'Updating password...' : 'Update password'}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMessage(null);
                setEmail(session?.user.email ?? '');
                setShowRecoveryRequest(true);
              }}
              disabled={busy}
              className="w-full text-cyan hover:underline text-sm font-semibold disabled:opacity-60"
            >
              Request a new recovery email
            </button>
          </form>
        ) : passwordUpdated ? (
          <button
            type="button"
            onClick={handleReturnToSignIn}
            disabled={busy}
            className="button-primary w-full disabled:opacity-60"
          >
            {busy ? 'Signing out...' : 'Continue to sign in'}
          </button>
        ) : (
          <form onSubmit={handleRecoveryRequest} className="space-y-5">
            <div>
              <label htmlFor="recovery-email" className="block text-sm font-semibold text-cyan mb-2">
                Email address
              </label>
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
              />
            </div>
            <button type="submit" disabled={busy} className="button-primary w-full disabled:opacity-60">
              {busy ? 'Sending...' : 'Send recovery link'}
            </button>
            {canUpdatePassword && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMessage(null);
                  setShowRecoveryRequest(false);
                }}
                disabled={busy}
                className="w-full text-cyan hover:underline text-sm font-semibold disabled:opacity-60"
              >
                Return to password entry
              </button>
            )}
          </form>
        )}

        {!passwordUpdated && (
          <button
            type="button"
            onClick={handleReturnToSignIn}
            disabled={busy}
            className="w-full mt-5 text-cyan hover:underline text-sm font-semibold disabled:opacity-60"
          >
            Back to sign in
          </button>
        )}
      </section>
    </main>
  );
}
