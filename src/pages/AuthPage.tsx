import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { useAppStore } from '../store';
import useUnsavedChangesGuard from '../hooks/useUnsavedChangesGuard';
import { clearDeepLink } from '../utils/deepLinks';
import CadetDetailsFields from '../components/CadetDetailsFields';
import {
  CADET_REGISTRATION_FIELDS,
  CadetDetailErrors,
  CadetDetailField,
  CadetDetails,
  emptyCadetDetails,
  normalizeCadetDetails,
  normalizeRegistrationDisplayName,
  toRegistrationMetadata,
  validateCadetDetails,
  validateRegistrationDisplayName,
} from '../utils/cadetProfile';

type AuthMode = 'sign-in' | 'register';
const MIN_PASSWORD_LENGTH = 8;

export default function AuthPage() {
  const { error: sessionError, clearError } = useAuth();
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [details, setDetails] = useState<CadetDetails>(emptyCadetDetails);
  const [fieldErrors, setFieldErrors] = useState<CadetDetailErrors>({});
  const hasUnsavedRegistration = Object.values(details).some((value) => value.trim().length > 0);
  useUnsavedChangesGuard(
    'registration-form',
    hasUnsavedRegistration,
    'You have unsaved registration details. Leave this page and discard them?',
  );

  const updateDetail = (field: CadetDetailField, value: string) => {
    setDetails((current) => ({
      ...current,
      [field]: field === 'displayName' ? value.toUpperCase() : value,
    }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let cadetDetails: CadetDetails | null = null;
    if (mode === 'register') {
      const normalizedEmail = email.trim();
      cadetDetails = {
        ...normalizeCadetDetails(details),
        displayName: normalizeRegistrationDisplayName(details.displayName),
      };
      const errors = validateCadetDetails(cadetDetails, CADET_REGISTRATION_FIELDS, []);
      if (!errors.displayName) {
        const displayNameError = validateRegistrationDisplayName(cadetDetails.displayName);
        if (displayNameError) errors.displayName = displayNameError;
      }
      setDetails(cadetDetails);
      if (!normalizedEmail || Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError(
          !normalizedEmail
            ? 'Email is required.'
            : errors.displayName
              ?? errors.cadetNumber
              ?? 'Complete all required cadet information before registering.',
        );
        setMessage(null);
        return;
      }
      setEmail(normalizedEmail);
    }
    if (mode === 'register' && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      setMessage(null);
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    clearError();

    try {
      if (mode === 'sign-in') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: toRegistrationMetadata(cadetDetails ?? emptyCadetDetails()) },
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          setMessage('Registration received. Check your email to confirm your account.');
        }
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
    setMessage(null);
    setFieldErrors({});
    clearError();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <section className={`glass-panel min-w-0 w-full ${mode === 'register' ? 'max-w-2xl p-5 sm:p-8' : 'max-w-md p-8'}`}>
        <div className={`text-center ${mode === 'register' ? 'mb-6' : 'mb-8'}`}>
          <div className="text-4xl font-bold glow-text mb-2">PPD</div>
          <h1 className="heading-section">
            {mode === 'sign-in' ? 'Welcome back' : 'Create a Cadet account'}
          </h1>
          <p className="text-light-gray">
            Power Plant Diesel Learning Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate={mode === 'register'} className="space-y-4">
          {mode === 'register' && (
            <fieldset className="min-w-0 space-y-3 rounded-lg border border-cyan/20 p-3 sm:p-4">
              <legend className="px-2 text-sm font-semibold text-cyan">Cadet information</legend>
              <CadetDetailsFields
                idPrefix="register"
                fields={CADET_REGISTRATION_FIELDS}
                values={details}
                errors={fieldErrors}
                requiredFields={CADET_REGISTRATION_FIELDS}
                showDisplayNameFormat
                disabled={busy}
                onChange={updateDetail}
              />
            </fieldset>
          )}
          <div className="min-w-0">
            <label htmlFor="email" className="block text-sm font-semibold text-cyan mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full min-w-0 p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="password" className="block text-sm font-semibold text-cyan mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? MIN_PASSWORD_LENGTH : undefined}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full min-w-0 p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
            />
          </div>

          {(error || sessionError) && (
            <p role="alert" className="text-red-300 text-sm">
              {error || sessionError}
            </p>
          )}
          {message && (
            <p role="status" className="text-cyan text-sm">
              {message}
            </p>
          )}

          <button type="submit" disabled={busy} className="button-primary w-full disabled:opacity-60">
            {busy
              ? 'Please wait...'
              : mode === 'sign-in'
                ? 'Sign In'
                : 'Register as Cadet'}
          </button>
        </form>

        <p className="text-center text-light-gray text-sm mt-5">
          {mode === 'sign-in' ? "Don't have an account?" : 'Already registered?'}{' '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'sign-in' ? 'register' : 'sign-in')}
            className="text-cyan hover:underline font-semibold"
          >
            {mode === 'sign-in' ? 'Register as a Cadet' : 'Sign in'}
          </button>
        </p>
        {mode === 'sign-in' && (
          <button
            type="button"
            onClick={() => {
              clearDeepLink();
              setCurrentPage('password-recovery');
            }}
            className="block mx-auto mt-4 text-cyan hover:underline text-sm font-semibold"
          >
            Forgot Password?
          </button>
        )}
      </section>
    </main>
  );
}
