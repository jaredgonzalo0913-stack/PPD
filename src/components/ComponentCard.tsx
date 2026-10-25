import { Component } from '../types';
import { useAppStore } from '../store';

export default function ComponentCard({ component }: { component: Component }) {
  const { setSelectedComponent } = useAppStore();

  const categoryColors = {
    sensor: 'from-blue-500/30 to-blue-600/30 border-blue-400/30',
    actuator: 'from-cyan-500/30 to-cyan-600/30 border-cyan-400/30',
    electronic: 'from-purple-500/30 to-purple-600/30 border-purple-400/30',
    hydraulic: 'from-red-500/30 to-red-600/30 border-red-400/30',
    mechanical: 'from-amber-500/30 to-amber-600/30 border-amber-400/30',
  };

  return (
    <div
      onClick={() => setSelectedComponent(component)}
      className={`card cursor-pointer bg-gradient-to-br ${categoryColors[component.category]} hover:shadow-lg hover:shadow-cyan/20 transform hover:scale-105 transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-cyan">{component.name}</h3>
        <span className="px-2 py-1 bg-cyan/20 text-cyan text-xs font-semibold rounded">
          {component.category}
        </span>
      </div>
      <p className="text-light-gray text-sm mb-3">{component.shortDescription}</p>
      <div className="flex gap-2 flex-wrap">
        {component.relatedComponents.slice(0, 2).map((rel) => (
          <span key={rel} className="text-xs bg-cyan/10 text-cyan px-2 py-1 rounded">
            {rel}
          </span>
        ))}
        {component.relatedComponents.length > 2 && (
          <span className="text-xs text-cyan/70">+{component.relatedComponents.length - 2} more</span>
        )}
      </div>
    </div>
  );
}
