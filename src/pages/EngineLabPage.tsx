import { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { RotateCcw, Maximize2, Loader } from 'lucide-react';

export default function EngineLabPage() {
  const { engineLabMode, setEngineLabMode, auto360Rotation, setAuto360Rotation, guidedTourActive, setGuidedTourActive } = useAppStore();
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setCanvasReady(true);
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="heading-title text-center mb-6">⚙️ 3D ME-C Engine Lab</h1>
        <p className="text-center text-light-gray mb-12">
          Explore the MAN B&W ME-C electronically controlled marine engine in interactive 3D. Rotate, zoom, inspect components, and learn how they work together.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 3D Viewer Area */}
          <div className="lg:col-span-3">
            <div className="glass-panel p-6">
              {canvasReady ? (
                <div className="w-full aspect-video bg-gradient-to-br from-navy to-deep-blue rounded-lg border border-cyan/30 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-dark/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="relative z-10 text-center space-y-4">
                    <div className="text-6xl animate-float">⚙️</div>
                    <h2 className="text-2xl font-bold glow-text">3D Engine Viewer</h2>
                    <p className="text-light-gray">Advanced 3D visualization coming with Three.js integration</p>
                    <div className="flex gap-4 justify-center pt-4">
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">🖱️</span>
                        <span className="text-xs text-cyan mt-1">Drag to Rotate</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">🔍</span>
                        <span className="text-xs text-cyan mt-1">Scroll to Zoom</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl">👆</span>
                        <span className="text-xs text-cyan mt-1">Click Components</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-steel-gray rounded-lg flex items-center justify-center">
                  <Loader className="w-8 h-8 text-cyan animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            <div className="glass-panel p-6">
              <h2 className="heading-subsection mb-4">🎮 Controls</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-cyan block mb-2">View Mode</label>
                  <select
                    value={engineLabMode}
                    onChange={(e) => setEngineLabMode(e.target.value as any)}
                    className="w-full p-2 bg-steel-gray border border-cyan/30 rounded text-white font-semibold"
                  >
                    <option value="normal">Normal View</option>
                    <option value="exploded">Exploded View</option>
                    <option value="cutaway">Cutaway View</option>
                    <option value="component">Component Mode</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 bg-cyan/10 border border-cyan/30 rounded-lg cursor-pointer hover:bg-cyan/20 transition-colors"
                  onClick={() => setAuto360Rotation(!auto360Rotation)}>
                  <input 
                    type="checkbox" 
                    checked={auto360Rotation}
                    readOnly
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label className="text-sm font-semibold text-cyan cursor-pointer flex-1">
                    Auto 360° Rotation
                  </label>
                </div>

                <button
                  onClick={() => setGuidedTourActive(!guidedTourActive)}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                    guidedTourActive
                      ? 'bg-cyan text-navy'
                      : 'bg-steel-gray text-cyan hover:bg-steel-gray/80 border border-cyan/30'
                  }`}
                >
                  🗺️ {guidedTourActive ? 'Stop Tour' : 'Guided Tour'}
                </button>

                <button className="w-full py-2 px-4 bg-steel-gray text-cyan hover:bg-steel-gray/80 border border-cyan/30 rounded-lg font-semibold transition-all">
                  ↻ Reset View
                </button>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="heading-subsection mb-4">📌 Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full p-2 text-sm bg-cyan/20 text-cyan hover:bg-cyan/30 rounded border border-cyan/30 font-semibold transition-all">
                  Front View
                </button>
                <button className="w-full p-2 text-sm bg-cyan/20 text-cyan hover:bg-cyan/30 rounded border border-cyan/30 font-semibold transition-all">
                  Rear View
                </button>
                <button className="w-full p-2 text-sm bg-cyan/20 text-cyan hover:bg-cyan/30 rounded border border-cyan/30 font-semibold transition-all">
                  Top View
                </button>
                <button className="w-full p-2 text-sm bg-cyan/20 text-cyan hover:bg-cyan/30 rounded border border-cyan/30 font-semibold transition-all">
                  Side View
                </button>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h2 className="heading-subsection mb-4">ℹ️ Info</h2>
              <p className="text-light-gray text-sm">
                Select components to view detailed information. Use the guided tour for an interactive walkthrough of the ME-C system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
