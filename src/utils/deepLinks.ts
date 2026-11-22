export const DEEP_LINK_KEYS = ['assessment', 'module', 'lesson', 'announcement', 'new-assessment'] as const;
export type DeepLinkKey = (typeof DEEP_LINK_KEYS)[number];

const DEEP_LINK_EVENT = 'ppd:deep-link';

const writeUrl = (url: URL) => {
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
};

export const readDeepLink = (key: DeepLinkKey) =>
  new URLSearchParams(window.location.search).get(key);

/** Replaces any previous deep link, so only one target is ever pending. */
export const setDeepLink = (values: Partial<Record<DeepLinkKey, string>>) => {
  const url = new URL(window.location.href);
  DEEP_LINK_KEYS.forEach((key) => url.searchParams.delete(key));
  (Object.entries(values) as Array<[DeepLinkKey, string | undefined]>).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  writeUrl(url);
  window.dispatchEvent(new Event(DEEP_LINK_EVENT));
};

export const clearDeepLink = (keys: readonly DeepLinkKey[] = DEEP_LINK_KEYS) => {
  const url = new URL(window.location.href);
  let changed = false;
  keys.forEach((key) => {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  });
  if (changed) writeUrl(url);
};

export const subscribeDeepLink = (listener: () => void) => {
  window.addEventListener(DEEP_LINK_EVENT, listener);
  return () => window.removeEventListener(DEEP_LINK_EVENT, listener);
};
