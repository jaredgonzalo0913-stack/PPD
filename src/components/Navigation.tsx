import { useAppStore } from '../store';
import { ChevronDown, LogOut, Menu, UserCircle, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Page, UserRole } from '../types';
import { getRoleLabel } from '../utils/roleLabels';

const navItems: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'modules', label: 'Modules' },
  { id: 'engine-lab', label: '3D Engine Lab' },
  { id: 'components', label: 'Components' },
  { id: 'system-explorer', label: 'System Explorer' },
  { id: 'assessments', label: 'Assessments' },
  { id: 'progress', label: 'Progress' },
  { id: 'admin-dashboard', label: 'Admin Dashboard' },
  { id: 'admin-accounts', label: 'Account Management' },
];

export default function Navigation({
  allowedPages,
  role,
}: {
  allowedPages: Page[];
  role: UserRole;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { setCurrentPage, currentPage } = useAppStore();
  const { user, signOut } = useAuth();
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const visibleNavItems = navItems.filter((item) => allowedPages.includes(item.id));

  const handleNavClick = (pageId: Page) => {
    if (!allowedPages.includes(pageId)) return;
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  };

  const handleSignOut = async () => {
    setSignOutError(null);
    try {
      await signOut();
      setAccountMenuOpen(false);
      setMobileMenuOpen(false);
    } catch {
      setSignOutError('Unable to sign out. Please try again.');
    }
  };

  return (
    <nav className="glass-panel m-0 border-b border-cyan/20 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold glow-text" aria-hidden="true">⚙️</div>
            <div>
              <div className="text-xl font-bold glow-text">PPD</div>
              <div className="text-xs text-cyan/70">POWER PLANT DIESEL</div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <button
              type="button"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              aria-expanded={accountMenuOpen}
              className="button-ghost flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              <span className="max-w-48 truncate">{user?.email || 'Account'}</span>
              <span className="text-cyan/70">{getRoleLabel(role)}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-panel p-2 shadow-xl">
                <button
                  type="button"
                  onClick={() => handleNavClick('profile-settings')}
                  disabled={!allowedPages.includes('profile-settings')}
                  className={`block w-full text-left px-3 py-2 rounded-lg ${
                    currentPage === 'profile-settings'
                      ? 'bg-cyan text-navy'
                      : 'text-cyan hover:bg-cyan/10'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 text-left px-3 py-2 rounded-lg text-cyan hover:bg-cyan/10"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden p-2 hover:bg-cyan/10 rounded-lg"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-cyan" />
            ) : (
              <Menu className="w-6 h-6 text-cyan" />
            )}
          </button>
        </div>

        <div className="hidden lg:flex flex-wrap gap-2 border-t border-cyan/20 pt-3">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              aria-current={currentPage === item.id ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === item.id
                  ? 'bg-cyan text-navy'
                  : 'text-cyan hover:bg-cyan/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-cyan/20 space-y-2">
            <p className="px-4 text-sm text-light-gray truncate">
              {user?.email} · {getRoleLabel(role)}
            </p>
            <button
              type="button"
              onClick={() => handleNavClick('profile-settings')}
              disabled={!allowedPages.includes('profile-settings')}
              className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === 'profile-settings'
                  ? 'bg-cyan text-navy'
                  : 'text-cyan hover:bg-cyan/10'
              }`}
            >
              Profile Settings
            </button>
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={currentPage === item.id ? 'page' : undefined}
                className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                  currentPage === item.id
                    ? 'bg-cyan text-navy'
                    : 'text-cyan hover:bg-cyan/10'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 rounded-lg font-semibold text-cyan hover:bg-cyan/10"
            >
              Sign Out
            </button>
          </div>
        )}
        {signOutError && (
          <p role="alert" className="mt-3 text-right text-sm text-red-300">
            {signOutError}
          </p>
        )}
      </div>
    </nav>
  );
}
