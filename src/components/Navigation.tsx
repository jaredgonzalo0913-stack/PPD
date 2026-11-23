import { useAppStore } from '../store';
import { CalendarDays, ChevronDown, LogOut, Menu, Search, UserCircle, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Component, Page, UserRole } from '../types';
import { getRoleLabel } from '../utils/roleLabels';
import { MEC_COMPONENTS } from '../data/components';
import { supabase } from '../lib/supabase';
import CourseCalendar, { CourseCalendarAssessment, toDateKey } from './CourseCalendar';
import { clearDeepLink } from '../utils/deepLinks';
import NotificationBell from './NotificationBell';

type ScheduleAssessment = CourseCalendarAssessment;
type HeaderPanel = 'search' | 'calendar' | 'notifications' | 'account';

const navItems: { id: Page; label: string }[] = [
  { id: 'home', label: 'Dashboard' },
  { id: 'modules', label: 'Modules' },
  { id: 'engine-lab', label: '3D Engine Lab' },
  { id: 'assessments', label: 'Assessments' },
  { id: 'progress', label: 'Progress' },
];

interface SearchResult {
  title: string;
  details: string;
  page: Page;
  component?: Component;
}

const searchIndex: SearchResult[] = MEC_COMPONENTS.map((component) => ({
  title: component.name,
  details: `${component.shortDescription} ${component.purpose} ${component.howItWorks}`,
  page: 'components' as Page,
  component,
}));

export default function Navigation({
  allowedPages,
  role,
}: {
  allowedPages: Page[];
  role: UserRole;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<HeaderPanel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [schedule, setSchedule] = useState<ScheduleAssessment[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [calendarSelectedDay, setCalendarSelectedDay] = useState(() => toDateKey(new Date()));
  const { setCurrentPage, currentPage, setSelectedComponent } = useAppStore();
  const { user, signOut } = useAuth();
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const visibleNavItems = navItems.filter((item) => allowedPages.includes(item.id));
  // Component Library and Engine Systems belong to the 3D Engine Lab section.
  const activeNavId: Page = currentPage === 'components' || currentPage === 'system-explorer'
    ? 'engine-lab'
    : currentPage;
  const searchOpen = openPanel === 'search';
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return [];
    return searchIndex
      .filter((item) => `${item.title} ${item.details}`.toLocaleLowerCase().includes(query))
      .slice(0, 6);
  }, [searchQuery]);

  const loadSchedule = useCallback(async () => {
    setScheduleLoading(true);
    setScheduleError(null);
    try {
      let query = supabase
        .from('assessments')
        .select('id, title, week_number, due_at')
        .eq('is_published', true)
        .not('due_at', 'is', null)
        .order('due_at', { ascending: true })
        .limit(200);
      const { data, error } = await query;

      if (error) {
        console.error('Unable to load assessment dates.', error);
        setScheduleError('Assessment dates are temporarily unavailable. Please try again later.');
      } else {
        setSchedule((data ?? []) as ScheduleAssessment[]);
      }
    } catch (error) {
      console.error('Unable to load assessment dates.', error);
      setScheduleError('Assessment dates are temporarily unavailable. Please try again later.');
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  useEffect(() => {
    if (openPanel === 'calendar') void loadSchedule();
  }, [loadSchedule, openPanel]);

  // Every temporary header element returns to its resting state whenever the LMS section changes,
  // regardless of whether the navigation came from the header or from a link inside a page.
  useEffect(() => {
    setOpenPanel(null);
    setMobileMenuOpen(false);
    setSearchQuery('');
  }, [currentPage]);

  // Dismiss open panels on Escape or on a pointer press outside every header panel.
  // Presses inside a panel (for example choosing a date) never dismiss it.
  useEffect(() => {
    if (!openPanel) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-header-panel]')) return;
      setOpenPanel(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenPanel(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openPanel]);

  // Escape closes the mobile menu; an open panel inside it closes first, one layer per keypress.
  useEffect(() => {
    if (!mobileMenuOpen || openPanel) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, openPanel]);

  const navigateTo = (pageId: Page) => {
    if (!allowedPages.includes(pageId)) return;
    clearDeepLink();
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setOpenPanel(null);
  };

  const handleNavClick = (pageId: Page) => navigateTo(pageId);

  const openSearchResult = (result: SearchResult) => {
    if ('component' in result) setSelectedComponent(result.component);
    handleNavClick(result.page);
    setSearchQuery('');
  };

  const handleSignOut = async () => {
    setSignOutError(null);
    try {
      await signOut();
      setOpenPanel(null);
      setMobileMenuOpen(false);
    } catch {
      setSignOutError('Unable to sign out. Please try again.');
    }
  };

  const openScheduledAssessment = () => navigateTo('assessments');

  const schedulePanel = (
    <div className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[90vw] rounded-lg border border-cyan/30 bg-navy p-4 shadow-xl">
      <h2 className="heading-subsection mb-3">Course calendar</h2>
      <CourseCalendar
        assessments={schedule}
        month={calendarMonth}
        selectedDay={calendarSelectedDay}
        onMonthChange={setCalendarMonth}
        onSelectedDayChange={setCalendarSelectedDay}
        loading={scheduleLoading}
        error={scheduleError}
        onSelectAssessment={openScheduledAssessment}
      />
    </div>
  );

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

          <div className="relative order-3 w-full lg:order-none lg:ml-auto lg:w-72" data-header-panel>
            <label htmlFor="global-learning-search" className="sr-only">Search engine components</label>
            <div className="flex items-center gap-2 rounded-lg border border-cyan/30 bg-steel-gray px-3">
              <Search className="h-4 w-4 flex-shrink-0 text-cyan/70" aria-hidden="true" />
              <input
                id="global-learning-search"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setOpenPanel('search');
                }}
                onFocus={() => setOpenPanel('search')}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setOpenPanel(null);
                  if (event.key === 'Enter' && searchResults[0]) openSearchResult(searchResults[0]);
                }}
                placeholder="Search engine components"
                className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder:text-light-gray/60"
              />
            </div>
            {searchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-lg border border-cyan/30 bg-navy p-2 shadow-xl">
                {searchResults.length ? searchResults.map((result, index) => (
                  <button
                    key={`${result.page}-${result.title}-${index}`}
                    type="button"
                    onClick={() => openSearchResult(result)}
                    className="block w-full rounded-md px-3 py-2 text-left hover:bg-cyan/10"
                  >
                    <span className="block font-semibold text-cyan">{result.title}</span>
                    <span className="block truncate text-xs text-light-gray">Component</span>
                  </button>
                )) : (
                    <p className="px-3 py-2 text-sm text-light-gray">No matching engine components.</p>
                )}
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <div className="relative" data-header-panel>
              <button
                type="button"
                onClick={() => setOpenPanel((current) => current === 'calendar' ? null : 'calendar')}
                aria-expanded={openPanel === 'calendar'}
                aria-label="Open course calendar"
                className="button-ghost"
              >
                <CalendarDays className="inline h-4 w-4" aria-hidden="true" />
                <span className="ml-1">Calendar</span>
              </button>
              {openPanel === 'calendar' && schedulePanel}
            </div>

            <NotificationBell
              open={openPanel === 'notifications'}
              onOpenChange={(open) => setOpenPanel(open ? 'notifications' : null)}
            />

            <div className="relative" data-header-panel>
              <button
                type="button"
                onClick={() => setOpenPanel((current) => current === 'account' ? null : 'account')}
                aria-expanded={openPanel === 'account'}
                className="button-ghost flex items-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                <span className="max-w-48 truncate">{user?.email || 'Account'}</span>
                <span className="text-cyan/70">{getRoleLabel(role)}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {openPanel === 'account' && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-cyan/30 bg-navy p-2 shadow-xl">
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
                  {allowedPages.includes('admin-dashboard') && (
                    <button
                      type="button"
                      onClick={() => handleNavClick('admin-dashboard')}
                      className="block w-full rounded-lg px-3 py-2 text-left text-cyan hover:bg-cyan/10"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  {allowedPages.includes('admin-accounts') && (
                    <button
                      type="button"
                      onClick={() => handleNavClick('admin-accounts')}
                      className="block w-full rounded-lg px-3 py-2 text-left text-cyan hover:bg-cyan/10"
                    >
                      Account Management
                    </button>
                  )}
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
          </div>

          <button
            type="button"
            className="lg:hidden p-2 hover:bg-cyan/10 rounded-lg"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => {
              setOpenPanel(null);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
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
              aria-current={activeNavId === item.id ? 'page' : undefined}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeNavId === item.id
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
            <div className="relative" data-header-panel>
              <button
                type="button"
                onClick={() => setOpenPanel((current) => current === 'calendar' ? null : 'calendar')}
                aria-expanded={openPanel === 'calendar'}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 font-semibold text-cyan hover:bg-cyan/10"
              >
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Course calendar
              </button>
              {openPanel === 'calendar' && schedulePanel}
            </div>
            <NotificationBell
              open={openPanel === 'notifications'}
              onOpenChange={(open) => setOpenPanel(open ? 'notifications' : null)}
            />
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
            {allowedPages.includes('admin-dashboard') && (
              <button
                type="button"
                onClick={() => handleNavClick('admin-dashboard')}
                className="block w-full rounded-lg px-4 py-2 text-left font-semibold text-cyan hover:bg-cyan/10"
              >
                Admin Dashboard
              </button>
            )}
            {allowedPages.includes('admin-accounts') && (
              <button
                type="button"
                onClick={() => handleNavClick('admin-accounts')}
                className="block w-full rounded-lg px-4 py-2 text-left font-semibold text-cyan hover:bg-cyan/10"
              >
                Account Management
              </button>
            )}
            {visibleNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={activeNavId === item.id ? 'page' : undefined}
                className={`block w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeNavId === item.id
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
