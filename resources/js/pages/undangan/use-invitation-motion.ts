import { type RefObject, useLayoutEffect } from 'react';

export function useInvitationMotion(
    rootRef: RefObject<HTMLDivElement | null>,
    hasOpened: boolean,
): void {
    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const preference = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        const elements = Array.from(
            root.querySelectorAll<HTMLElement>('[data-reveal]'),
        );
        const decorations = Array.from(
            root.querySelectorAll<HTMLElement>('[data-motion]'),
        );
        let observer: IntersectionObserver | undefined;
        let motionObserver: IntersectionObserver | undefined;
        const loader = document.getElementById('invitation-boot-loader');
        let isReady = !loader || loader.classList.contains('is-hiding');

        elements.forEach((element) => {
            element.style.setProperty(
                '--reveal-delay',
                `${Number(element.dataset.revealDelay) || 0}ms`,
            );
            if (!hasOpened && element.closest('.page, .cover')) {
                element.classList.remove('is-visible', 'motion-focused');
            }
        });

        const belongsToVisibleScene = (element: HTMLElement) =>
            hasOpened ||
            !element.closest('.page, .reference-nav, .music-button');

        const reveal = (element: Element) => {
            element.classList.add('is-visible');
            observer?.unobserve(element);
        };
        const configureMotion = () => {
            observer?.disconnect();
            motionObserver?.disconnect();
            root.classList.remove('js-ready', 'motion-enabled');
            decorations.forEach((element) =>
                element.classList.remove('motion-visible'),
            );

            if (preference.matches || !('IntersectionObserver' in window)) {
                elements.forEach(reveal);
                return;
            }

            root.classList.add('js-ready', 'motion-enabled');
            motionObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle(
                        'motion-visible',
                        entry.isIntersecting,
                    );
                });
            });
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) reveal(entry.target);
                    });
                },
                { threshold: 0 },
            );
            if (!isReady) return;

            decorations
                .filter(belongsToVisibleScene)
                .forEach((element) => motionObserver?.observe(element));
            elements
                .filter(
                    (element) =>
                        belongsToVisibleScene(element) &&
                        !element.classList.contains('is-visible'),
                )
                .forEach((element) => observer?.observe(element));
        };
        const onReady = () => {
            isReady = true;
            configureMotion();
        };
        const onVisibilityChange = () => {
            root.classList.toggle('motion-paused', document.hidden);
        };
        const onFocus = (event: FocusEvent) => {
            const isInteractiveTarget =
                event.target instanceof Element &&
                event.target.matches('a, button, input, select, textarea');
            let element =
                event.target instanceof Element
                    ? event.target.closest('[data-reveal]')
                    : null;
            while (element) {
                if (
                    isInteractiveTarget ||
                    !element.classList.contains('is-visible')
                ) {
                    element.classList.add('motion-focused');
                    reveal(element);
                }
                element =
                    element.parentElement?.closest('[data-reveal]') ?? null;
            }
        };

        configureMotion();
        onVisibilityChange();
        root.addEventListener('focusin', onFocus);
        window.addEventListener('invitation:ready', onReady);
        document.addEventListener('visibilitychange', onVisibilityChange);
        if (typeof preference.addEventListener === 'function') {
            preference.addEventListener('change', configureMotion);
        } else {
            preference.addListener(configureMotion);
        }

        return () => {
            observer?.disconnect();
            motionObserver?.disconnect();
            root.classList.remove(
                'js-ready',
                'motion-enabled',
                'motion-paused',
            );
            decorations.forEach((element) =>
                element.classList.remove('motion-visible'),
            );
            root.removeEventListener('focusin', onFocus);
            window.removeEventListener('invitation:ready', onReady);
            document.removeEventListener(
                'visibilitychange',
                onVisibilityChange,
            );
            if (typeof preference.removeEventListener === 'function') {
                preference.removeEventListener('change', configureMotion);
            } else {
                preference.removeListener(configureMotion);
            }
        };
    }, [hasOpened, rootRef]);
}
