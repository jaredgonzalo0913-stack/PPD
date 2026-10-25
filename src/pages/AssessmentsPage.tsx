import { useEffect } from 'react';
import { LEARNING_MODULES } from '../data/modules';
import { useAppStore } from '../store';
import { Zap } from 'lucide-react';

export default function AssessmentsPage() {
  const { studentProgress, updateProgress } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allQuizzes = LEARNING_MODULES.flatMap((module) =>
    module.lessons.map((lesson) => ({
      quizId: lesson.quiz?.id,
      moduleId: module.id,
      moduleTitle: module.title,
      lessonTitle: lesson.title,
      questions: lesson.quiz?.questions || [],
    }))
  ).filter(q => q.quizId);

  const handleQuizStart = (moduleId: string, lessonTitle: string) => {
    // Navigate to modules page and expand the specific module
    // This is a simplified version - full implementation would use routing
    alert(`Starting assessment: ${lessonTitle}\n\nGo to Learning Modules to take this quiz.`);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="heading-title text-center mb-12">✅ Assessments & Quizzes</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Stats */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <div className="text-3xl font-bold glow-text">{studentProgress.quizzesCompleted}</div>
                <p className="text-light-gray text-sm">Quizzes Completed</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold glow-text">{allQuizzes.length}</div>
                <p className="text-light-gray text-sm">Total Available</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold glow-text">
                  {allQuizzes.length > 0 
                    ? Math.round((studentProgress.quizzesCompleted / allQuizzes.length) * 100)
                    : 0}%
                </div>
                <p className="text-light-gray text-sm">Completion Rate</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold glow-text">{studentProgress.totalXP}</div>
                <p className="text-light-gray text-sm">Total XP Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass-panel p-6 border-2 border-blue-400/50">
            <h3 className="heading-subsection text-blue-400 mb-3">Multiple Choice</h3>
            <p className="text-light-gray mb-4">Test your understanding with multiple choice questions about ME-C concepts, components, and systems.</p>
            <button className="button-secondary">Learn More</button>
          </div>

          <div className="glass-panel p-6 border-2 border-cyan-400/50">
            <h3 className="heading-subsection text-cyan mb-3">Component Identification</h3>
            <p className="text-light-gray mb-4">Identify ME-C engine components from the 3D model and demonstrate your recognition skills.</p>
            <button className="button-secondary">Learn More</button>
          </div>

          <div className="glass-panel p-6 border-2 border-purple-400/50">
            <h3 className="heading-subsection text-purple-400 mb-3">System Flow</h3>
            <p className="text-light-gray mb-4">Demonstrate understanding of how ME-C control systems work together to manage engine operation.</p>
            <button className="button-secondary">Learn More</button>
          </div>

          <div className="glass-panel p-6 border-2 border-amber-400/50">
            <h3 className="heading-subsection text-amber-400 mb-3">Scenario-Based</h3>
            <p className="text-light-gray mb-4">Solve real-world scenarios that test your understanding of ME-C engine control and operation.</p>
            <button className="button-secondary">Learn More</button>
          </div>
        </div>

        {/* Available Assessments */}
        <div className="glass-panel p-8">
          <h2 className="heading-section mb-6">📋 Available Assessments</h2>

          <div className="space-y-3">
            {allQuizzes.map((quiz, idx) => (
              <div
                key={idx}
                className="p-4 bg-steel-gray hover:bg-steel-gray/80 border border-cyan/30 rounded-lg flex items-center justify-between transition-all group"
              >
                <div className="flex-1">
                  <div className="font-bold text-cyan mb-1">{quiz.lessonTitle}</div>
                  <div className="text-sm text-light-gray">{quiz.moduleTitle}</div>
                  <div className="text-xs text-cyan/70 mt-1">
                    📝 {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-cyan/70">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-semibold">+10 XP</span>
                  </div>

                  {studentProgress.moduleScores[quiz.moduleId] ? (
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-400">
                        {studentProgress.moduleScores[quiz.moduleId]}%
                      </div>
                      <div className="text-xs text-light-gray">Your Score</div>
                    </div>
                  ) : null}

                  <button
                    onClick={() => handleQuizStart(quiz.moduleId, quiz.lessonTitle)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      studentProgress.moduleScores[quiz.moduleId]
                        ? 'button-secondary'
                        : 'button-primary'
                    }`}
                  >
                    {studentProgress.moduleScores[quiz.moduleId] ? 'Retake' : 'Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {allQuizzes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-light-gray">No assessments available yet.</p>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-12 glass-panel p-8">
          <h2 className="heading-section mb-6">💡 Assessment Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-cyan mb-3">✓ Before Taking a Quiz</h3>
              <ul className="space-y-2 text-light-gray text-sm">
                <li>• Review the lesson content thoroughly</li>
                <li>• Use the 3D engine lab to visualize components</li>
                <li>• Check the component library for reference</li>
                <li>• Take notes on key concepts</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-cyan mb-3">✓ During the Quiz</h3>
              <ul className="space-y-2 text-light-gray text-sm">
                <li>• Read questions carefully</li>
                <li>• Think through each answer option</li>
                <li>• Don't rush - accuracy is more important</li>
                <li>• Use the explanations to learn from answers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
