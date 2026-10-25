import { useAppStore } from '../store';
import { useEffect } from 'react';
import { LEARNING_MODULES } from '../data/modules';
import { Zap, BookOpen, Box, Share2, BarChart3, Award } from 'lucide-react';

export default function HomePage() {
  const { setCurrentPage } = useAppStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: Box,
      title: '3D Engine Visualization',
      description: 'Interactive 360° view of the ME-C engine with component highlighting and detachable parts',
    },
    {
      icon: BookOpen,
      title: '8 Interactive Modules',
      description: 'Comprehensive lessons covering fuel injection, control systems, sensors, and more',
    },
    {
      icon: Share2,
      title: 'System Explorer',
      description: 'Animated system flow diagrams showing how ME-C components interact',
    },
    {
      icon: Zap,
      title: 'Live Simulations',
      description: 'Watch animated demonstrations of engine processes and control sequences',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your learning progress, quiz scores, and module completion',
    },
    {
      icon: Award,
      title: 'Achievements & Badges',
      description: 'Earn badges as you master different aspects of ME-C technology',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                  <span className="glow-text">PPD</span>
                </h1>
                <h2 className="text-3xl lg:text-4xl font-bold text-light-gray mb-4">
                  POWER PLANT DIESEL
                </h2>
              </div>

              <p className="text-lg text-light-gray leading-relaxed">
                Welcome to an interactive learning platform designed specifically for maritime engineering students. Learn the MAN B&W ME-C electronically controlled marine engine through immersive 3D visualization, detailed system analysis, and comprehensive interactive lessons.
              </p>

              <div className="space-y-3">
                <p className="text-cyan font-semibold flex items-center gap-2">
                  <span>🚢</span> Emerging Technologies in the Maritime Industry
                </p>
                <p className="text-cyan font-semibold flex items-center gap-2">
                  <span>⚙️</span> Electronic Engine Control Mastery
                </p>
                <p className="text-cyan font-semibold flex items-center gap-2">
                  <span>🔬</span> Virtual Engine Room Laboratory
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setCurrentPage('engine-lab')}
                  className="button-primary text-lg px-6 py-3"
                >
                  Enter 3D Engine Lab
                </button>
                <button
                  onClick={() => setCurrentPage('modules')}
                  className="button-secondary text-lg px-6 py-3"
                >
                  Start Learning
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="glass-panel p-8 text-center space-y-4">
                <div className="text-7xl animate-float">⚙️</div>
                <h3 className="text-2xl font-bold glow-text">Virtual ME-C Engine</h3>
                <p className="text-light-gray">
                  Explore every component, understand the control flow, and master electronically controlled engine technology.
                </p>
                <div className="pt-4">
                  <div className="text-4xl font-bold glow-text mb-2">{LEARNING_MODULES.length}</div>
                  <p className="text-cyan">Interactive Learning Modules</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Concept Section */}
      <section className="py-16 bg-deep-blue/50 border-y border-cyan/20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="heading-title text-center mb-12">The Learning Journey</h2>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center">
            <div className="flex-1">
              <div className="text-3xl mb-2">📖</div>
              <div className="font-bold text-cyan">LEARN</div>
              <p className="text-sm text-light-gray">Understand concepts</p>
            </div>
            <div className="hidden lg:block text-2xl text-cyan/50">→</div>

            <div className="flex-1">
              <div className="text-3xl mb-2">👁️</div>
              <div className="font-bold text-cyan">SEE</div>
              <p className="text-sm text-light-gray">Visualize components</p>
            </div>
            <div className="hidden lg:block text-2xl text-cyan/50">→</div>

            <div className="flex-1">
              <div className="text-3xl mb-2">🔍</div>
              <div className="font-bold text-cyan">EXPLORE</div>
              <p className="text-sm text-light-gray">Interact with 3D</p>
            </div>
            <div className="hidden lg:block text-2xl text-cyan/50">→</div>

            <div className="flex-1">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold text-cyan">UNDERSTAND</div>
              <p className="text-sm text-light-gray">Grasp functionality</p>
            </div>
            <div className="hidden lg:block text-2xl text-cyan/50">→</div>

            <div className="flex-1">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-cyan">ASSESS</div>
              <p className="text-sm text-light-gray">Test knowledge</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="heading-title text-center mb-12">Platform Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="card space-y-4">
                  <Icon className="w-8 h-8 text-cyan" />
                  <h3 className="text-lg font-bold text-cyan">{feature.title}</h3>
                  <p className="text-light-gray text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-deep-blue/50 border-t border-cyan/20">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-8">
          <div>
            <h2 className="heading-title">Ready to Dive In?</h2>
            <p className="text-light-gray text-lg max-w-2xl mx-auto">
              Choose your path: Start with interactive lessons to build foundation, explore the 3D engine for visual learning, or jump to the system explorer to see how everything connects.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <button
              onClick={() => setCurrentPage('modules')}
              className="button-primary text-lg px-8 py-4"
            >
              📚 Learning Modules
            </button>
            <button
              onClick={() => setCurrentPage('engine-lab')}
              className="button-primary text-lg px-8 py-4"
            >
              ⚙️ 3D Engine Lab
            </button>
            <button
              onClick={() => setCurrentPage('components')}
              className="button-secondary text-lg px-8 py-4"
            >
              📋 Component Library
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
