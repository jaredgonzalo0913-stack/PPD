import { useEffect } from 'react';
import { useAppStore } from '../store';

export default function useUnsavedChangesGuard(
  key: string,
  hasUnsavedChanges: boolean,
  message: string,
) {
  const setNavigationGuard = useAppStore((state) => state.setNavigationGuard);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      setNavigationGuard(key, null);
      return;
    }

    const guard = () => window.confirm(message);
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    setNavigationGuard(key, guard);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      setNavigationGuard(key, null);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, key, message, setNavigationGuard]);
}
