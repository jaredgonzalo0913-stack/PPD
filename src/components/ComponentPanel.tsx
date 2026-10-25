import { Component } from '../types';
import { X } from 'lucide-react';
import { useAppStore } from '../store';

export default function ComponentPanel() {
  const { selectedComponent, setSelectedComponent } = useAppStore();

  if (!selectedComponent) return null;

  return (
    <div className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-96 glass-panel m-0 border-l border-cyan/30 rounded-none overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold glow-text mb-1">{selectedComponent.name}</h2>
            <span className="px-3 py-1 bg-cyan/20 text-cyan text-sm font-semibold rounded inline-block">
              {selectedComponent.category.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setSelectedComponent(null)}
            className="p-1 hover:bg-cyan/20 rounded"
          >
            <X className="w-5 h-5 text-cyan" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="heading-subsection">What is it?</h3>
            <p className="text-light-gray">{selectedComponent.shortDescription}</p>
          </div>

          <div>
            <h3 className="heading-subsection">Purpose</h3>
            <p className="text-light-gray">{selectedComponent.purpose}</p>
          </div>

          <div>
            <h3 className="heading-subsection">Function</h3>
            <p className="text-light-gray">{selectedComponent.function}</p>
          </div>

          <div>
            <h3 className="heading-subsection">How it Works</h3>
            <p className="text-light-gray">{selectedComponent.howItWorks}</p>
          </div>

          <div>
            <h3 className="heading-subsection">Role in ME-C</h3>
            <p className="text-light-gray">{selectedComponent.roleInMEC}</p>
          </div>

          <div>
            <h3 className="heading-subsection">Related Components</h3>
            <div className="flex flex-wrap gap-2">
              {selectedComponent.relatedComponents.map((comp) => (
                <span key={comp} className="px-2 py-1 bg-cyan/10 text-cyan text-sm rounded border border-cyan/30">
                  {comp}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-cyan/10 border border-cyan/30 rounded p-4 mt-4">
            <h3 className="heading-subsection text-cyan">Key Learning Point</h3>
            <p className="text-cyan/90 italic">{selectedComponent.keyLearningPoint}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
