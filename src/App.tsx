import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import { useAppStore } from './store';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ModulesPage from './pages/ModulesPage';
import EngineLabPage from './pages/EngineLabPage';
import ComponentsPage from './pages/ComponentsPage';
import SystemExplorerPage from './pages/SystemExplorerPage';
import AssessmentsPage from './pages/AssessmentsPage';
import ProgressPage from './pages/ProgressPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAccountManagementPage from './pages/AdminAccountManagementPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import { Page, UserRole } from './types';
import { useEffect, useState } from 'react';

const STUDENT_PAGES: Page[] = [
  'home',
  'modules',
  'engine-lab',
  'components',
  'system-explorer',
  'assessments',
  'progress',
  'profile-settings',
];

const INSTRUCTOR_PAGES: Page[] = [
  'home',
  'modules',
  'engine-lab',
  'components',
  'system-explorer',
  'assessments',
  'progress',
];

const ADMIN_PAGES: Page[] = [...STUDENT_PAGES, 'admin-dashboard', 'admin-accounts'];
const ADMIN_ONLY_PAGES: Page[] = ['admin-dashboard', 'admin-accounts'];

const pagesForRole = (role: UserRole): Page[] => {
  switch (role) {
    case 'admin':
      return ADMIN_PAGES;
    case 'instructor':
      return INSTRUCTOR_PAGES;
    case 'student':
      return STUDENT_PAGES;
  }
};

function AppContent() {
  const currentPage = useAppStore((state) => state.currentPage);
  const {
    session,
    loading,
    recoverySession,
    role,
    profileLoading,
    profileRefreshing,
    profileError,
    retryProfile,
    signOut,
  } = useAuth();
  const resetStudentProgress = useAppStore((state) => state.resetStudentProgress);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const userId = session?.user.id;

  useEffect(() => {
    resetStudentProgress();
  }, [resetStudentProgress, userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan">
        Checking your session...
      </div>
    );
  }

  const recoveryRedirect = new URLSearchParams(window.location.search).get('flow') === 'password-recovery';
  if (
    recoverySession ||
    currentPage === 'password-recovery' ||
    (!session && recoveryRedirect)
  ) {
    return <PasswordRecoveryPage />;
  }

  if (!session) {
    return <AuthPage />;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan">
        Loading your account profile...
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-white">
        <section className="glass-panel max-w-lg p-8 text-center space-y-4">
          <h1 className="heading-section">Account access unavailable</h1>
          <p role="alert" className="text-light-gray">
            {profileError || 'Your role could not be verified. Access is blocked.'}
          </p>
          <button onClick={retryProfile} className="button-secondary">
            Retry profile check
          </button>
          <button
            onClick={() => {
              setSignOutError(null);
              void signOut().catch(() => {
                setSignOutError('Unable to sign out. Please try again.');
              });
            }}
            className="button-primary"
          >
            Sign Out
          </button>
          {signOutError && (
            <p role="alert" className="text-red-300 text-sm">{signOutError}</p>
          )}
        </section>
      </div>
    );
  }

  const allowedPages = pagesForRole(role);
  const verifiedPages = profileRefreshing
    ? allowedPages.filter((page) => !ADMIN_ONLY_PAGES.includes(page))
    : allowedPages;

  if (profileRefreshing && ADMIN_ONLY_PAGES.includes(currentPage)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan">
        Verifying account permissions...
      </div>
    );
  }

  const accessiblePage = verifiedPages.includes(currentPage) ? currentPage : 'home';

  const renderPage = () => {
    switch (accessiblePage) {
      case 'home':
        return <HomePage />;
      case 'modules':
        return <ModulesPage />;
      case 'engine-lab':
        return <EngineLabPage />;
      case 'components':
        return <ComponentsPage />;
      case 'system-explorer':
        return <SystemExplorerPage />;
      case 'assessments':
        return <AssessmentsPage />;
      case 'progress':
        return <ProgressPage />;
      case 'profile-settings':
        return <ProfileSettingsPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-accounts':
        return <AdminAccountManagementPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-deep-blue to-navy text-white">
      <Navigation allowedPages={verifiedPages} role={role} />
      <main className="relative">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
