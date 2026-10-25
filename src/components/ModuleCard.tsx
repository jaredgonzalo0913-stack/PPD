import { LearningModule } from '../types';
import { useAppStore } from '../store';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function ModuleCard({ module }: { module: LearningModule }) {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="card space-y-4 hover:border-cyan/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-cyan mb-2">{module.title}</h3>
          <p className="text-light-gray text-sm mb-3">{module.description}</p>
        </div>
        {module.completed && (
          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 ml-2" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-cyan/70">Progress</span>
          <span className="font-semibold text-cyan">{module.progress}%</span>
        </div>
        <div className="h-2 bg-steel-gray rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan to-cyan-dark transition-all duration-500"
            style={{ width: `${module.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-light-gray">
        <BookOpen className="w-4 h-4" />
        <span>{module.lessons.length} lessons</span>
      </div>

      <button
        onClick={() => setCurrentPage('modules')}
        className="button-secondary w-full"
      >
        {module.completed ? 'Review' : 'Start Learning'}
      </button>
    </div>
  );
}
