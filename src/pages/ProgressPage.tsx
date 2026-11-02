import { useEffect } from 'react';
import { useAppStore } from '../store';
import { LEARNING_MODULES } from '../data/modules';
import { ACHIEVEMENTS } from '../data/achievements';
import AchievementBadge from '../components/AchievementBadge';
import ProgressBar from '../components/ProgressBar';
import { TrendingUp, Award, BookOpen, Zap } from 'lucide-react';

export default function ProgressPage() {
  const { studentProgress } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const averageScore = Object.values(studentProgress.moduleScores).length > 0
    ? Math.round(Object.values(studentProgress.moduleScores).reduce((a, b) => a + b, 0) / Object.values(studentProgress.moduleScores).length)
    : 0;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="heading-title mb-3">Your Learning Progress</h1>
        <p className="text-light-gray mb-8">
          These indicators reflect activity in the current browser session only. They are not saved to Supabase.
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-cyan" />
              <span className="text-light-gray">Average quiz-group score</span>
            </div>
            <div className="text-4xl font-bold glow-text">{averageScore}%</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-cyan" />
              <span className="text-light-gray">Quiz groups with scores</span>
            </div>
            <div className="text-4xl font-bold glow-text">
              {Object.keys(studentProgress.moduleScores).length}/8
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-cyan" />
              <span className="text-light-gray">Quiz attempts</span>
            </div>
            <div className="text-4xl font-bold glow-text">{studentProgress.quizzesCompleted}</div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-cyan" />
              <span className="text-light-gray">Achievements</span>
            </div>
            <div className="text-4xl font-bold glow-text">{studentProgress.achievements.length}</div>
          </div>
        </div>

        {/* Module Scores */}
        <div className="glass-panel p-8 mb-12">
          <h2 className="heading-section mb-2">Quiz performance by original module group</h2>
          <p className="text-light-gray text-sm mb-6">
            These quiz groups remain available in Assessments even though only Week 1 lessons appear in Modules.
          </p>
          <div className="space-y-6">
            {LEARNING_MODULES.map((module) => {
              const score = studentProgress.moduleScores[module.id] || 0;
              const hasScore = module.id in studentProgress.moduleScores;

              return (
                <div key={module.id}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-cyan">{module.title}</span>
                    <span className={`font-bold ${hasScore ? 'text-cyan' : 'text-light-gray/50'}`}>
                      {hasScore ? `${score}%` : 'Not started'}
                    </span>
                  </div>
                  <div className="h-3 bg-steel-gray rounded-full overflow-hidden border border-cyan/20">
                    <div
                      className={`h-full transition-all ${
                        hasScore
                          ? 'bg-gradient-to-r from-cyan to-cyan-dark shadow-lg shadow-cyan/50'
                          : 'bg-steel-gray/50'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Components Explored */}
        <div className="glass-panel p-8 mb-12">
          <h2 className="heading-section mb-6">Component Exploration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-4xl font-bold glow-text mb-2">
                {studentProgress.componentsExplored.length}/14
              </div>
              <p className="text-light-gray">Components explored</p>
            </div>
            <div>
              <div className="flex-1">
                <ProgressBar 
                  value={studentProgress.componentsExplored.length} 
                  max={14} 
                  label="Exploration Progress"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="heading-section mb-6">🏆 Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ACHIEVEMENTS.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={{
                  ...achievement,
                  unlocked: studentProgress.achievements.includes(achievement.id),
                }}
              />
            ))}
          </div>
        </div>

        <div className="glass-panel p-8">
          <h2 className="heading-section mb-3">Progress tracking limitation</h2>
          <p className="text-light-gray">
            Lesson completion and assignment submissions are not currently persisted or tracked here.
            Quiz attempts, scores, and component exploration reset on sign-out or browser refresh.
          </p>
        </div>
      </div>
    </div>
  );
}
