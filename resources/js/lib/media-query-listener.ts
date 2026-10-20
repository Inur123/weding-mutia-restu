export function listenToMediaQuery(
    mediaQuery: MediaQueryList,
    callback: (event: MediaQueryListEvent) => void,
): () => void {
    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', callback);

        return () => mediaQuery.removeEventListener('change', callback);
    }

    mediaQuery.addListener(callback);

    return () => mediaQuery.removeListener(callback);
}
