import { lazy, Suspense, useEffect, useState } from 'react';
import { LEARNING_MODULES, WEEK_1_MODULE } from '../data/modules';
import Quiz from '../components/Quiz';
import { useAppStore } from '../store';
import { useAuth } from '../auth/AuthProvider';

const AssessmentWorkspace = lazy(() => import('../components/AssessmentWorkspace'));

const availableQuizzes = LEARNING_MODULES.flatMap((module) =>
  module.lessons.flatMap((lesson) =>
    lesson.quiz
      ? [{
          quizId: lesson.quiz.id,
          moduleId: module.id,
          moduleTitle: module.title,
          lessonTitle: lesson.title,
          questions: lesson.quiz.questions,
        }]
      : [],
  ),
);

export default function AssessmentsPage() {
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const studentProgress = useAppStore((state) => state.studentProgress);
  const { role } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const activeQuiz = availableQuizzes.find((quiz) => quiz.quizId === activeQuizId);

  const handleQuizComplete = (moduleId: string, quizId: string, score: number) => {
    useAppStore.setState((state) => ({
      studentProgress: {
        ...state.studentProgress,
        moduleScores: {
          ...state.studentProgress.moduleScores,
          [moduleId]: score,
        },
        quizScores: {
          ...state.studentProgress.quizScores,
          [quizId]: score,
        },
        quizzesCompleted: state.studentProgress.quizzesCompleted + 1,
      },
    }));
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <header>
          <h1 className="heading-title">Assessments</h1>
          <p className="text-light-gray mt-2">
            Knowledge-check quizzes, formative assessment references, and course activities.
          </p>
        </header>

        {role && (
          <Suspense fallback={<p role="status" className="text-cyan">Loading assessment workspace...</p>}>
            <AssessmentWorkspace role={role} />
          </Suspense>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Assessment overview">
          <div className="card">
            <p className="text-light-gray text-sm">Existing quizzes</p>
            <p className="text-3xl font-bold glow-text">{availableQuizzes.length}</p>
          </div>
          <div className="card">
            <p className="text-light-gray text-sm">Quiz attempts this session</p>
            <p className="text-3xl font-bold glow-text">{studentProgress.quizzesCompleted}</p>
          </div>
          <div className="card">
            <p className="text-light-gray text-sm">Formative assessment references</p>
            <p className="text-3xl font-bold glow-text">
              {WEEK_1_MODULE.assessments?.length ?? 0}
            </p>
          </div>
        </section>

        <section className="glass-panel p-6 sm:p-8">
          <h2 className="heading-section mb-5">Knowledge-check quizzes</h2>
          <p className="text-light-gray text-sm mb-5">
            Quiz scores and attempts are held in the current browser session and are not saved to Supabase.
          </p>
          {activeQuiz && (
            <div className="card mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="heading-subsection">{activeQuiz.lessonTitle}</h3>
                  <p className="text-light-gray text-sm">{activeQuiz.moduleTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveQuizId(null)}
                  className="button-secondary"
                >
                  Close quiz
                </button>
              </div>
              <Quiz
                key={activeQuiz.quizId}
                questions={activeQuiz.questions}
                onComplete={(score) =>
                  handleQuizComplete(activeQuiz.moduleId, activeQuiz.quizId, score)
                }
              />
            </div>
          )}

          <div className="space-y-3">
            {availableQuizzes.map((quiz) => {
              const score = studentProgress.quizScores[quiz.quizId];
              return (
                <article
                  key={quiz.quizId}
                  className="p-4 bg-steel-gray border border-cyan/30 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-cyan">{quiz.lessonTitle}</h3>
                    <p className="text-sm text-light-gray">{quiz.moduleTitle}</p>
                    <p className="text-xs text-cyan/70 mt-1">
                      {quiz.questions.length} question{quiz.questions.length === 1 ? '' : 's'}
                      {score !== undefined && (
                        <span className="text-green-300"> · Latest session score: {score}%</span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveQuizId(quiz.quizId)}
                    className={score !== undefined ? 'button-secondary' : 'button-primary'}
                  >
                    {score !== undefined ? 'Retake' : 'Start'}
                  </button>
                </article>
              );
            })}
            {availableQuizzes.length === 0 && (
              <p className="text-light-gray py-6">No knowledge-check quizzes are available.</p>
            )}
          </div>
        </section>

        <section className="glass-panel p-6 sm:p-8">
          <h2 className="heading-section mb-2">Week 1 formative assessments</h2>
          <p className="text-light-gray text-sm mb-5">
            Original instructions and submission references from the Week 1 module data.
          </p>
          <div className="space-y-4">
            {WEEK_1_MODULE.assessments?.map((assessment) => (
              <article
                key={assessment.id}
                className="bg-white/5 p-5 rounded-lg space-y-2 border border-cyan/20"
              >
                <h3 className="font-semibold text-cyan">{assessment.title}</h3>
                <p className="text-light-gray whitespace-pre-line">{assessment.instruction}</p>
                {assessment.rubric && <p className="text-light-gray">{assessment.rubric}</p>}
                {assessment.platform && (
                  <p className="text-light-gray">
                    <span className="font-semibold text-cyan">Platform:</span> {assessment.platform}
                  </p>
                )}
                {assessment.cbt && <p className="text-light-gray">{assessment.cbt}</p>}
                {assessment.practicalAssessment && (
                  <p className="text-light-gray">{assessment.practicalAssessment}</p>
                )}
                <p className="text-light-gray">
                  <span className="font-semibold text-cyan">Required submission details:</span>{' '}
                  {assessment.requiredSubmissionDetails}
                </p>
                <p className="text-light-gray">
                  <span className="font-semibold text-cyan">Example filename:</span>{' '}
                  {assessment.exampleFilename}
                </p>
                {assessment.exampleDetails && (
                  <p className="text-light-gray">{assessment.exampleDetails}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
