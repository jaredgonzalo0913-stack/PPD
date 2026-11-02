import { useEffect } from 'react';
import { BookOpen, ClipboardCheck, Cog, Network } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { LEARNING_MODULES, WEEK_1_MODULE } from '../data/modules';
import { useAppStore } from '../store';
import { Page } from '../types';

const quizCount = LEARNING_MODULES.reduce(
  (count, module) => count + module.lessons.filter((lesson) => lesson.quiz).length,
  0,
);

export default function HomePage() {
  const { profile } = useAuth();
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const progress = useAppStore((state) => state.studentProgress);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openPage = (page: Page) => setCurrentPage(page);
  const displayName = profile?.display_name?.trim() || 'Learner';

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <header className="glass-panel p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan">
            Power Plant Diesel · Learning Dashboard
          </p>
          <h1 className="heading-title mt-2">Welcome, {displayName}</h1>
          <p className="text-light-gray mt-2">
            Continue your Week 1 course or open an engine learning tool.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="glass-panel p-6 sm:p-8 lg:col-span-2">
            <p className="text-sm text-cyan font-semibold">CURRENT COURSE</p>
            <h2 className="heading-section mt-2">{WEEK_1_MODULE.title}</h2>
            <p className="text-light-gray mt-3">{WEEK_1_MODULE.description}</p>
            <p className="text-sm text-light-gray mt-4">
              {WEEK_1_MODULE.lessons.length} lessons available
            </p>
            <button
              type="button"
              onClick={() => openPage('modules')}
              className="button-primary mt-6"
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Open Week 1 lessons
              </span>
            </button>
          </article>

          <aside className="card">
            <h2 className="heading-subsection">Your learning this session</h2>
            <div className="space-y-4 mt-5">
              <div>
                <p className="text-light-gray text-sm">Quiz attempts</p>
                <p className="text-3xl font-bold glow-text">{progress.quizzesCompleted}</p>
              </div>
              <div>
                <p className="text-light-gray text-sm">Components explored</p>
                <p className="text-3xl font-bold glow-text">{progress.componentsExplored.length}</p>
              </div>
            </div>
            <p className="text-light-gray/70 text-xs mt-5">
              These progress indicators are temporary and reset when you sign out or refresh.
            </p>
          </aside>
        </section>

        <section>
          <h2 className="heading-section mb-4">Learning tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => openPage('assessments')}
              className="card text-left hover:border-cyan/50 transition-colors"
            >
              <ClipboardCheck className="w-6 h-6 text-cyan mb-3" />
              <span className="block font-semibold text-cyan">Assessments</span>
              <span className="block text-sm text-light-gray mt-1">
                {quizCount} existing quizzes and Week 1 assessment references
              </span>
            </button>
            <button
              type="button"
              onClick={() => openPage('engine-lab')}
              className="card text-left hover:border-cyan/50 transition-colors"
            >
              <Cog className="w-6 h-6 text-cyan mb-3" />
              <span className="block font-semibold text-cyan">3D Engine Lab</span>
              <span className="block text-sm text-light-gray mt-1">
                Explore the interactive engine
              </span>
            </button>
            <button
              type="button"
              onClick={() => openPage('components')}
              className="card text-left hover:border-cyan/50 transition-colors"
            >
              <BookOpen className="w-6 h-6 text-cyan mb-3" />
              <span className="block font-semibold text-cyan">Components</span>
              <span className="block text-sm text-light-gray mt-1">
                Browse engine component information
              </span>
            </button>
            <button
              type="button"
              onClick={() => openPage('system-explorer')}
              className="card text-left hover:border-cyan/50 transition-colors"
            >
              <Network className="w-6 h-6 text-cyan mb-3" />
              <span className="block font-semibold text-cyan">System Explorer</span>
              <span className="block text-sm text-light-gray mt-1">
                Follow how engine systems interact
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
