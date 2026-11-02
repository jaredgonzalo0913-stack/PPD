import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  role: UserRole | null;
  profileLoading: boolean;
  profileRefreshing: boolean;
  profileError: string | null;
  retryProfile: () => void;
  updateDisplayName: (displayName: string) => Promise<void>;
  recoverySession: boolean;
  clearRecoverySession: () => void;
  error: string | null;
  clearError: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const isUserRole = (role: unknown): role is UserRole =>
  role === 'student' || role === 'instructor' || role === 'admin';

const isUserProfile = (value: unknown, userId: string): value is UserProfile => {
  if (!value || typeof value !== 'object') return false;

  const profile = value as Record<string, unknown>;
  return (
    profile.id === userId &&
    (typeof profile.display_name === 'string' || profile.display_name === null) &&
    isUserRole(profile.role)
  );
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileRefreshing, setProfileRefreshing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileRefreshToken, setProfileRefreshToken] = useState(0);
  const [silentRefreshToken, setSilentRefreshToken] = useState(0);
  const [recoverySession, setRecoverySession] = useState(false);
  const knownUserId = useRef<string | null>(null);

  useEffect(() => {
    let authEventReceived = false;
    let active = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      authEventReceived = true;
      const nextUserId = nextSession?.user.id ?? null;
      const userChanged = nextUserId !== knownUserId.current;
      knownUserId.current = nextUserId;
      setSession(nextSession);
      setError(null);
      setLoading(false);

      if (event === 'PASSWORD_RECOVERY') {
        setRecoverySession(true);
      } else if (event === 'SIGNED_OUT' || userChanged) {
        setRecoverySession(false);
      }

      if (userChanged) {
        setProfile(null);
        setProfileError(null);
        setProfileLoading(Boolean(nextSession));
        setProfileRefreshing(false);
      } else if (nextSession && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        setProfileRefreshToken((current) => current + 1);
      }
    });

    supabase.auth.getSession().then(
      ({ data, error: sessionError }) => {
        if (!active) return;

        if (sessionError) {
          setError(sessionError.message);
        } else if (!authEventReceived) {
          knownUserId.current = data.session?.user.id ?? null;
          setSession(data.session);
          if (!data.session) {
            setProfileLoading(false);
          }
        }

        setLoading(false);
      },
      (sessionError: unknown) => {
        if (!active) return;
        const detail = sessionError instanceof Error
          ? sessionError.message
          : 'Unable to restore the authentication session.';
        setError(detail);
        setProfileLoading(false);
        setLoading(false);
      },
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) return;

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        !profileLoading &&
        !profileRefreshing
      ) {
        setSilentRefreshToken((current) => current + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [profileLoading, profileRefreshing, session?.user.id]);

  useEffect(() => {
    const userId = session?.user.id;
    let active = true;

    if (!userId) {
      setProfile(null);
      setProfileError(null);
      setProfileLoading(false);
      setProfileRefreshing(false);
      return () => {
        active = false;
      };
    }

    const hasVerifiedProfile = profile?.id === userId;
    if (hasVerifiedProfile) {
      setProfileRefreshing(true);
    } else {
      setProfile(null);
      setProfileLoading(true);
    }
    setProfileError(null);

    supabase
      .from('profiles')
      .select('id, display_name, role')
      .eq('id', userId)
      .maybeSingle()
      .then(
        ({ data, error: queryError }) => {
          if (!active) return;

          if (queryError) {
            setProfileError(`Unable to load your account profile: ${queryError.message}`);
            setProfile(null);
          } else if (!data) {
            setProfileError('Your account profile is missing. Please contact an administrator.');
            setProfile(null);
          } else if (!isUserProfile(data, userId)) {
            setProfileError('Your account profile has an invalid role or format. Access is blocked.');
            setProfile(null);
          } else {
            setProfile(data);
            setProfileError(null);
          }

          setProfileLoading(false);
          setProfileRefreshing(false);
        },
        (queryError: unknown) => {
          if (!active) return;
          const detail = queryError instanceof Error ? ` ${queryError.message}` : '';
          setProfile(null);
          setProfileError(`Unable to load your account profile.${detail}`);
          setProfileLoading(false);
          setProfileRefreshing(false);
        },
      );

    return () => {
      active = false;
    };
  }, [profileRefreshToken, session?.user.id, silentRefreshToken]);

  const retryProfile = useCallback(() => {
    if (session?.user.id) {
      setProfileRefreshToken((current) => current + 1);
    }
  }, [session?.user.id]);

  const updateDisplayName = useCallback(async (displayName: string) => {
    const userId = session?.user.id;
    if (!userId || !profile || profile.id !== userId) {
      throw new Error('Your verified account profile is not available.');
    }

    const normalizedName = displayName.trim();
    if (!normalizedName) {
      throw new Error('Display name cannot be empty.');
    }

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ display_name: normalizedName })
      .eq('id', userId)
      .select('id, display_name, role')
      .maybeSingle();

    if (updateError) {
      throw new Error(`Unable to save display name: ${updateError.message}`);
    }
    if (!data || !isUserProfile(data, userId)) {
      throw new Error(
        'The profile was not updated. Supabase may not allow this account to edit its display name.',
      );
    }

    setProfile(data);
    setProfileError(null);
  }, [profile, session?.user.id]);

  const clearRecoverySession = useCallback(() => {
    setRecoverySession(false);
  }, []);

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      throw signOutError;
    }
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        profile,
        role: profile?.role ?? null,
        profileLoading,
        profileRefreshing,
        profileError,
        retryProfile,
        updateDisplayName,
        recoverySession,
        clearRecoverySession,
        error,
        clearError: () => setError(null),
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
