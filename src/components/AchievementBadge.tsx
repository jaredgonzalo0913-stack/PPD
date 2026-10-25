import { Achievement } from '../types';
import { Lock } from 'lucide-react';

export default function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return (
    <div className="glass-panel p-4 text-center hover:border-cyan/50 transition-all hover:shadow-lg hover:shadow-cyan/20 group cursor-pointer">
      <div className={`text-5xl mb-2 ${!achievement.unlocked ? 'opacity-50 group-hover:opacity-75' : ''}`}>
        {achievement.icon}
      </div>
      <h3 className="font-bold text-cyan mb-1">{achievement.name}</h3>
      <p className="text-xs text-light-gray mb-3">{achievement.description}</p>
      {!achievement.unlocked && (
        <div className="flex items-center justify-center gap-1 text-xs text-cyan/70">
          <Lock className="w-3 h-3" />
          <span>Locked</span>
        </div>
      )}
      {achievement.unlocked && <div className="text-xs text-cyan font-semibold">✓ Unlocked</div>}
    </div>
  );
}
