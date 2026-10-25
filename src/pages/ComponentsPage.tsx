import { useEffect, useState } from 'react';
import { MEC_COMPONENTS, COMPONENT_CATEGORIES } from '../data/components';
import ComponentCard from '../components/ComponentCard';
import ComponentPanel from '../components/ComponentPanel';
import { useAppStore } from '../store';

export default function ComponentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { studentProgress, updateProgress } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredComponents = selectedCategory === 'all' 
    ? MEC_COMPONENTS 
    : MEC_COMPONENTS.filter(c => c.category === selectedCategory);

  const handleComponentSelect = (componentId: string) => {
    if (!studentProgress.componentsExplored.includes(componentId)) {
      updateProgress({
        componentsExplored: [...studentProgress.componentsExplored, componentId],
      });
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="heading-title text-center mb-12">📋 ME-C Component Library</h1>

        {/* Category Filter */}
        <div className="mb-8 glass-panel p-6">
          <h2 className="heading-subsection mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan text-navy'
                  : 'bg-steel-gray text-cyan hover:bg-steel-gray/80 border border-cyan/30'
              }`}
            >
              All Components
            </button>
            {Object.entries(COMPONENT_CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === key
                    ? 'bg-cyan text-navy'
                    : 'bg-steel-gray text-cyan hover:bg-steel-gray/80 border border-cyan/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold glow-text">{MEC_COMPONENTS.length}</div>
            <p className="text-light-gray">Total Components</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold glow-text">{studentProgress.componentsExplored.length}</div>
            <p className="text-light-gray">Explored</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold glow-text">
              {Math.round((studentProgress.componentsExplored.length / MEC_COMPONENTS.length) * 100)}%
            </div>
            <p className="text-light-gray">Completion</p>
          </div>
        </div>

        {/* Component Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredComponents.map((component) => (
            <div
              key={component.id}
              onClick={() => handleComponentSelect(component.id)}
            >
              <ComponentCard component={component} />
            </div>
          ))}
        </div>

        {/* Component Panel */}
        <ComponentPanel />
      </div>
    </div>
  );
}
