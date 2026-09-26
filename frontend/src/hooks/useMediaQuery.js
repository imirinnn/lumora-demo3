import { useSyncExternalStore } from 'react';

/** Subscribe to a CSS media query. SSR-safe default is `false`. */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True on devices with a precise pointer that can hover (mouse / trackpad), at laptop widths and up. */
export const useIsDesktopPointer = () => useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)');

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
