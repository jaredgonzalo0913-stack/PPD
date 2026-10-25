import { useEffect } from 'react';
import { MEC_COMPONENTS } from '../data/components';
import { ArrowRight } from 'lucide-react';

export default function SystemExplorerPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const systemFlows = [
    {
      title: 'Electronic Control Flow',
      steps: ['Sensor', 'Control Unit', 'Signal Processing', 'Actuator', 'Engine Response'],
      description: 'How electronic signals control engine systems',
    },
    {
      title: 'Fuel Injection Control',
      steps: ['Crank Angle', 'ECU', 'FIVA', 'Fuel Injection', 'Combustion'],
      description: 'Fuel delivery control sequence',
    },
    {
      title: 'Exhaust Valve Control',
      steps: ['Engine Control', 'Hydraulic Actuation', 'Exhaust Valve', 'Exhaust Release'],
      description: 'Exhaust valve operation and timing',
    },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="heading-title text-center mb-12">🔗 System Explorer</h1>

        <div className="space-y-12">
          {systemFlows.map((flow, idx) => (
            <div key={idx} className="glass-panel p-8">
              <h2 className="heading-section mb-2">{flow.title}</h2>
              <p className="text-light-gray mb-6">{flow.description}</p>

              <div className="space-y-6">
                {/* Flow Diagram */}
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-4 justify-center items-center min-w-max px-4">
                    {flow.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-center gap-4">
                        <div className="glass-panel p-4 min-w-max text-center border-2 border-cyan/50 hover:border-cyan transition-all">
                          <div className="text-sm font-bold text-cyan">{step}</div>
                        </div>
                        {stepIdx < flow.steps.length - 1 && (
                          <ArrowRight className="w-6 h-6 text-cyan flex-shrink-0 animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {flow.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="bg-cyan/10 border border-cyan/30 p-4 rounded-lg">
                      <h3 className="font-semibold text-cyan mb-2">Step {stepIdx + 1}: {step}</h3>
                      <p className="text-light-gray text-sm">
                        Detailed explanation of {step.toLowerCase()} in the ME-C control sequence.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ME-C Control System Architecture */}
        <div className="mt-12">
          <h2 className="heading-section mb-6">⚙️ ME-C Control System Architecture</h2>

          <div className="glass-panel p-8">
            <div className="space-y-8">
              {/* Top Level */}
              <div className="space-y-4">
                <h3 className="font-bold text-cyan mb-3">Central System</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-panel p-4 border-2 border-purple-400/50">
                    <div className="font-bold text-purple-400">ECU</div>
                    <div className="text-xs text-light-gray">Electronic Control Unit</div>
                  </div>
                  <div className="glass-panel p-4 border-2 border-purple-400/50">
                    <div className="font-bold text-purple-400">Control System</div>
                    <div className="text-xs text-light-gray">Coordination & Logic</div>
                  </div>
                  <div className="glass-panel p-4 border-2 border-purple-400/50">
                    <div className="font-bold text-purple-400">CU</div>
                    <div className="text-xs text-light-gray">Control Units</div>
                  </div>
                </div>
              </div>

              {/* Sensors */}
              <div className="space-y-4">
                <h3 className="font-bold text-cyan mb-3">Sensor Input</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Crank Angle', 'Pressure', 'Temperature', 'Position'].map((sensor, idx) => (
                    <div key={idx} className="glass-panel p-4 border-2 border-blue-400/50">
                      <div className="font-bold text-blue-400">{sensor}</div>
                      <div className="text-xs text-light-gray">Sensor</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actuators */}
              <div className="space-y-4">
                <h3 className="font-bold text-cyan mb-3">Actuator Output</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['FIVA', 'Exhaust Valve', 'Hydraulic Cylinder'].map((actuator, idx) => (
                    <div key={idx} className="glass-panel p-4 border-2 border-red-400/50">
                      <div className="font-bold text-red-400">{actuator}</div>
                      <div className="text-xs text-light-gray">Actuator</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engine Systems */}
              <div className="space-y-4">
                <h3 className="font-bold text-cyan mb-3">Engine Systems Controlled</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-cyan/10 p-4 border border-cyan/30 rounded-lg">
                    <div className="font-bold text-cyan mb-2">Fuel Injection</div>
                    <p className="text-light-gray text-sm">Precise timing and quantity control for optimal combustion</p>
                  </div>
                  <div className="bg-cyan/10 p-4 border border-cyan/30 rounded-lg">
                    <div className="font-bold text-cyan mb-2">Exhaust Valves</div>
                    <p className="text-light-gray text-sm">Electronic control of valve timing for scavenging optimization</p>
                  </div>
                  <div className="bg-cyan/10 p-4 border border-cyan/30 rounded-lg">
                    <div className="font-bold text-cyan mb-2">Safety Monitoring</div>
                    <p className="text-light-gray text-sm">Continuous monitoring with automatic protective measures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
