import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { clearDeepLink } from '../utils/deepLinks';

type SimulatorMessage =
  | { channel: 'ppd-engine-simulator'; type: 'set-view'; payload: { mode: 'normal' | 'cutaway' | 'exploded' } }
  | { channel: 'ppd-engine-simulator'; type: 'set-auto-rotation'; payload: { enabled: boolean } }
  | { channel: 'ppd-engine-simulator'; type: 'set-guided-lessons'; payload: { active: boolean } }
  | { channel: 'ppd-engine-simulator'; type: 'reset-view' }
  | { channel: 'ppd-engine-simulator'; type: 'camera-preset'; payload: { preset: 'front' | 'rear' | 'top' | 'side' } };

export default function EngineLabPage() {
  const { engineLabMode, auto360Rotation, guidedTourActive } = useAppStore();
  const setCurrentPage = useAppStore((state) => state.setCurrentPage);
  const goToPreviousPage = useAppStore((state) => state.goToPreviousPage);
  const hasPreviousPage = useAppStore((state) => state.navigationHistory.length > 0);
  const [fullscreenExperience, setFullscreenExperience] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const simulatorRef = useRef<HTMLIFrameElement>(null);
  const simulatorContainerRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const [simulatorReady, setSimulatorReady] = useState(false);
  const [simulatorWidth, setSimulatorWidth] = useState(0);

  const sendSimulatorMessage = useCallback((message: SimulatorMessage) => {
    simulatorRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const syncFullscreenState = () => setNativeFullscreen(Boolean(document.fullscreenElement));
    const handleFullscreenEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !document.fullscreenElement) return;
      void document.exitFullscreen().catch(() => {
        setFullscreenError('The browser could not exit native fullscreen. Use the fullscreen button to exit.');
      });
    };
    setFullscreenSupported(
      document.fullscreenEnabled && typeof experienceRef.current?.requestFullscreen === 'function',
    );
    syncFullscreenState();
    document.addEventListener('fullscreenchange', syncFullscreenState);
    document.addEventListener('keydown', handleFullscreenEscape);
    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
      document.removeEventListener('keydown', handleFullscreenEscape);
    };
  }, []);

  useEffect(() => {
    const container = simulatorContainerRef.current;
    if (!container) return;
    const updateWidth = () => setSimulatorWidth(container.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleSimulatorMessage = (event: MessageEvent<unknown>) => {
      if (
        event.origin !== window.location.origin
        || event.source !== simulatorRef.current?.contentWindow
        || !event.data
        || typeof event.data !== 'object'
        || Array.isArray(event.data)
        || !('channel' in event.data)
        || event.data.channel !== 'ppd-engine-simulator'
        || !('type' in event.data)
        || event.data.type !== 'ready'
      ) return;
      setSimulatorReady(true);
    };

    window.addEventListener('message', handleSimulatorMessage);
    return () => window.removeEventListener('message', handleSimulatorMessage);
  }, []);

  useEffect(() => {
    if (!simulatorReady) return;
    const mode = engineLabMode === 'cutaway' || engineLabMode === 'exploded'
      ? engineLabMode
      : 'normal';
    sendSimulatorMessage({
      channel: 'ppd-engine-simulator',
      type: 'set-view',
      payload: { mode },
    });
    sendSimulatorMessage({
      channel: 'ppd-engine-simulator',
      type: 'set-auto-rotation',
      payload: { enabled: auto360Rotation },
    });
    sendSimulatorMessage({
      channel: 'ppd-engine-simulator',
      type: 'set-guided-lessons',
      payload: { active: guidedTourActive },
    });
  }, [auto360Rotation, engineLabMode, guidedTourActive, sendSimulatorMessage, simulatorReady]);

  const enterFullscreenExperience = () => {
    setFullscreenError(null);
    setFullscreenExperience(true);
  };

  const exitFullscreenExperience = async () => {
    setFullscreenExperience(false);
    setFullscreenError(null);
    if (!document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
      setFullscreenError('The browser could not exit native fullscreen. Press Escape to leave it.');
    }
  };

  const toggleNativeFullscreen = async () => {
    setFullscreenError(null);
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (experienceRef.current?.requestFullscreen) {
        await experienceRef.current.requestFullscreen();
      }
    } catch {
      setFullscreenError('The browser could not change native fullscreen mode.');
    }
  };

  return (
    <div
      ref={experienceRef}
      className={fullscreenExperience
        ? 'fixed inset-0 z-[100] flex h-[100dvh] w-screen flex-col overflow-hidden bg-navy'
        : 'min-h-screen py-8'}
    >
      <div className={fullscreenExperience ? 'flex min-h-0 flex-1 flex-col' : 'max-w-7xl mx-auto px-4'}>
        {fullscreenExperience ? (
          <div className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-cyan/30 bg-navy px-3 py-2 sm:px-4">
            <button type="button" onClick={() => void exitFullscreenExperience()} className="button-secondary">
              ← Back to Engine Lab
            </button>
            <div className="flex items-center gap-3">
              {fullscreenSupported ? (
                <button type="button" onClick={() => void toggleNativeFullscreen()} className="button-secondary">
                  {nativeFullscreen ? 'Exit Browser Fullscreen' : 'Enter Browser Fullscreen'}
                </button>
              ) : (
                <span className="text-xs text-light-gray">Browser fullscreen unavailable</span>
              )}
              <span className="hidden text-xs text-light-gray sm:inline">
                Escape exits browser fullscreen; Back to Engine Lab exits this view.
              </span>
            </div>
            {fullscreenError && (
              <p role="alert" className="w-full text-sm text-red-300">{fullscreenError}</p>
            )}
          </div>
        ) : (
          <>
            <header className="glass-panel mb-6 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan/70">
                    Interactive learning · 3D Engine Lab
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-cyan sm:text-3xl">⚙️ Engine Lab</h1>
                  <p className="mt-2 max-w-3xl text-light-gray">
                    Explore the ME-Type main engine simulator and its interactive engine and system controls.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      clearDeepLink();
                      goToPreviousPage();
                    }}
                    disabled={!hasPreviousPage}
                    className="button-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Back to Previous Page
                  </button>
                  <button type="button" onClick={enterFullscreenExperience} className="button-primary">
                    Full Screen Simulator
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 border-t border-cyan/20 pt-5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    clearDeepLink();
                    setCurrentPage('components');
                  }}
                  className="rounded-lg border border-cyan/20 bg-white/5 p-4 text-left transition-colors hover:border-cyan/50 hover:bg-cyan/10"
                >
                  <span className="block font-semibold text-cyan">Browse component library →</span>
                  <span className="mt-1 block text-sm text-light-gray">
                    Filter the ME-C components by category and open each component&apos;s details.
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearDeepLink();
                    setCurrentPage('system-explorer');
                  }}
                  className="rounded-lg border border-cyan/20 bg-white/5 p-4 text-left transition-colors hover:border-cyan/50 hover:bg-cyan/10"
                >
                  <span className="block font-semibold text-cyan">Explore engine systems →</span>
                  <span className="mt-1 block text-sm text-light-gray">
                    Follow the ME-C control flows and the control-system architecture.
                  </span>
                </button>
              </div>
              {fullscreenError && (
                <p role="alert" className="mt-4 text-sm text-red-300">{fullscreenError}</p>
              )}
            </header>
          </>
        )}

        <div className={fullscreenExperience
          ? 'grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)]'
          : 'grid grid-cols-1 gap-6'}
        >
          {/* 3D Viewer Area */}
          <div className={fullscreenExperience ? 'h-full min-h-0 min-w-0' : 'w-full'}>
            <div className={fullscreenExperience ? 'h-full min-h-0' : 'glass-panel p-6'}>
              <div
                id="external-engine-model"
                ref={simulatorContainerRef}
                className={fullscreenExperience
                  ? 'h-full w-full overflow-hidden bg-navy'
                  : 'w-full overflow-hidden rounded-lg border border-cyan/30 bg-navy'}
              >
                <iframe
                  ref={simulatorRef}
                  title="Interactive ME-Type Main Engine Simulator"
                  src="/engine-simulator/index.html"
                  className="block w-full border-0"
                  style={fullscreenExperience
                    ? { height: '100%', minHeight: 0 }
                    : {
                        height: simulatorWidth > 900 ? 'min(85vh, 1000px)' : '1100px',
                        minHeight: '760px',
                      }}
                  onLoad={() => setSimulatorReady(true)}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
