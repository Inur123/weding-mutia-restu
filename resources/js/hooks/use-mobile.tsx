import { useSyncExternalStore } from 'react';
import { listenToMediaQuery } from '@/lib/media-query-listener';

const MOBILE_BREAKPOINT = 768;

const mql =
    typeof window === 'undefined' || typeof window.matchMedia !== 'function'
        ? undefined
        : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

function mediaQueryListener(callback: (event: MediaQueryListEvent) => void) {
    if (!mql) {
        return () => {};
    }

    return listenToMediaQuery(mql, callback);
}

function isSmallerThanBreakpoint(): boolean {
    return mql?.matches ?? false;
}

function getServerSnapshot(): boolean {
    return false;
}

export function useIsMobile(): boolean {
    return useSyncExternalStore(
        mediaQueryListener,
        isSmallerThanBreakpoint,
        getServerSnapshot,
    );
}
