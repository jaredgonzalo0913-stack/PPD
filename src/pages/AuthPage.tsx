import { FormEvent, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';
import { useAppStore } from '../store';

type AuthMode = 'sign-in' | 'register';

export default function AuthPage() {
  const { error: sessionError, clearError } = useAuth();
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
          email,
          password,
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
    clearError();
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <section className="glass-panel w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold glow-text mb-2">PPD</div>
          <h1 className="heading-section">
            {mode === 'sign-in' ? 'Welcome back' : 'Create a Cadet account'}
          </h1>
          <p className="text-light-gray">
            Power Plant Diesel Learning Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
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
              className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-cyan mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full p-3 bg-steel-gray border border-cyan/30 rounded-lg text-white"
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

        <p className="text-center text-light-gray text-sm mt-6">
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
            onClick={() => setCurrentPage('password-recovery')}
            className="block mx-auto mt-4 text-cyan hover:underline text-sm font-semibold"
          >
            Forgot Password?
          </button>
        )}
      </section>
    </main>
  );
}
