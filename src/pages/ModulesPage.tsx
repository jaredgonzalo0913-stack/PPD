import { useState, useEffect } from 'react';
import { LEARNING_MODULES } from '../data/modules';
import { LearningModule, Lesson } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Quiz from '../components/Quiz';
import { useAppStore } from '../store';

export default function ModulesPage() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const { updateProgress, studentProgress } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuizComplete = (score: number, moduleId: string) => {
    const newScores = { ...studentProgress.moduleScores, [moduleId]: score };
    updateProgress({ moduleScores: newScores });
  };

  const selectiveLesson = activeLesson ? 
    LEARNING_MODULES.find(m => m.id === expandedModule)?.lessons.find(l => l.id === activeLesson) 
    : null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="heading-title text-center mb-12">🎓 Learning Modules</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Module List */}
          <div className="lg:col-span-2 space-y-4">
            {LEARNING_MODULES.map((module) => (
              <div key={module.id} className="glass-panel">
                <button
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-cyan mb-2">{module.title}</h2>
                    <p className="text-light-gray text-sm mb-3">{module.description}</p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-cyan/70">
                        📚 {module.lessons.length} lessons
                      </span>
                      <span className={`font-semibold ${module.completed ? 'text-green-400' : 'text-cyan/70'}`}>
                        {module.progress}% complete
                      </span>
                    </div>
                  </div>
                  {expandedModule === module.id ? (
                    <ChevronUp className="w-6 h-6 text-cyan flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-cyan flex-shrink-0" />
                  )}
                </button>

                {expandedModule === module.id && (
                  <div className="border-t border-cyan/20 p-6 space-y-4">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="space-y-3">
                        <button
                          onClick={() => setActiveLesson(activeLesson?.id === lesson.id ? null : lesson.id)}
                          className="w-full text-left p-3 bg-steel-gray hover:bg-steel-gray/80 rounded-lg transition-colors flex items-center justify-between"
                        >
                          <span className="font-semibold text-cyan">{lesson.title}</span>
                          {activeLesson?.id === lesson.id ? (
                            <ChevronUp className="w-5 h-5 text-cyan" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-cyan" />
                          )}
                        </button>

                        {activeLesson?.id === lesson.id && (
                          <div className="bg-white/5 p-4 rounded-lg space-y-4 border border-cyan/20">
                            <p className="text-light-gray">{lesson.content}</p>
                            
                            {lesson.components.length > 0 && (
                              <div>
                                <p className="text-cyan font-semibold mb-2">📌 Related Components:</p>
                                <div className="flex flex-wrap gap-2">
                                  {lesson.components.map((comp) => (
                                    <span key={comp} className="px-2 py-1 bg-cyan/10 text-cyan text-sm rounded border border-cyan/30">
                                      {comp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {lesson.quiz && (
                              <div className="mt-6 pt-6 border-t border-cyan/20">
                                <p className="text-cyan font-semibold mb-4">📝 Knowledge Check</p>
                                <Quiz 
                                  questions={lesson.quiz.questions} 
                                  onComplete={(score) => handleQuizComplete(score, module.id)}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="heading-subsection text-center">📊 Your Progress</h3>
              <div className="space-y-4 pt-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-cyan text-sm">Modules Completed</span>
                    <span className="font-bold text-cyan">
                      {Object.keys(studentProgress.moduleScores).length}/8
                    </span>
                  </div>
                  <div className="h-2 bg-steel-gray rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan to-cyan-dark"
                      style={{ width: `${(Object.keys(studentProgress.moduleScores).length / 8) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-cyan text-sm">Total XP Earned</span>
                    <span className="font-bold text-cyan">{studentProgress.totalXP}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-cyan text-sm">Quiz Attempts</span>
                    <span className="font-bold text-cyan">{studentProgress.quizzesCompleted}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-cyan text-sm">Lessons Done</span>
                    <span className="font-bold text-cyan">{studentProgress.lessonsCompleted}/24</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="heading-subsection text-center">💡 Tip</h3>
              <p className="text-light-gray text-sm">
                Complete the lessons in order. Each module builds on previous knowledge to give you a comprehensive understanding of ME-C engine control systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
