(() => {
  const channel = 'ppd-engine-simulator';
  const viewModes = new Set(['normal', 'cutaway', 'exploded']);
  const cameraPresets = {
    front: 'front',
    rear: 'back',
    top: 'top',
    side: 'left',
  };
  let autoRotationTimer = null;

  const sendToParent = (type) => {
    if (window.parent !== window) {
      window.parent.postMessage({ channel, type }, window.location.origin);
    }
  };

  const clickControl = (selector) => {
    const control = document.querySelector(selector);
    if (!(control instanceof HTMLElement)) return false;
    control.click();
    return true;
  };

  const stopAutoRotation = () => {
    if (autoRotationTimer !== null) {
      window.clearInterval(autoRotationTimer);
      autoRotationTimer = null;
    }
  };

  const handleCommand = (event) => {
    if (
      event.source !== window.parent
      || event.origin !== window.location.origin
      || !event.data
      || typeof event.data !== 'object'
      || Array.isArray(event.data)
      || event.data.channel !== channel
      || typeof event.data.type !== 'string'
    ) return;

    const payload = event.data.payload;
    switch (event.data.type) {
      case 'set-view': {
        if (!payload || typeof payload !== 'object' || !viewModes.has(payload.mode)) return;
        const view = payload.mode === 'normal' ? 'exterior' : payload.mode;
        clickControl(`#viewSeg [data-view="${view}"]`);
        break;
      }
      case 'set-auto-rotation': {
        if (!payload || typeof payload.enabled !== 'boolean') return;
        stopAutoRotation();
        if (payload.enabled) {
          const app = window.__app;
          if (!app || typeof app.cam?.orbit !== 'function') return;
          autoRotationTimer = window.setInterval(() => {
            app.cam.anim = null;
            app.cam.orbit(0.6, 0);
          }, 50);
        }
        break;
      }
      case 'set-guided-lessons': {
        if (!payload || typeof payload.active !== 'boolean') return;
        clickControl(payload.active ? '.tabs [data-tab="lessons"]' : '.tabs [data-tab="prepare"]');
        break;
      }
      case 'reset-view':
        clickControl('#nav [data-nav="reset"]');
        break;
      case 'camera-preset': {
        if (!payload || typeof payload.preset !== 'string') return;
        const preset = cameraPresets[payload.preset];
        if (preset) clickControl(`#nav [data-nav="${preset}"]`);
        break;
      }
      default:
        return;
    }
  };

  window.addEventListener('message', handleCommand);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => sendToParent('ready'), { once: true });
  } else {
    sendToParent('ready');
  }
})();
