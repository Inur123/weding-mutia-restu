import { useHttp } from '@inertiajs/react';
import {
    type FormEvent,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { index as indexRsvp, store as storeRsvp } from '@/routes/api/rsvp';
import {
    type Attendance,
    type Wish,
    featuredPhotos,
    invitation,
    weddingDate,
} from './invitation-data';
import { useInvitationMusic } from './use-invitation-music';
import { useInvitationMotion } from './use-invitation-motion';

type CoverPhase = 'closed' | 'exiting' | 'open';
type WishForm = { name: string; attendance: Attendance | ''; message: string };
type RsvpResponse = { rsvp: Wish };
type WishPageResponse = { data: Wish[]; nextCursor: string | null };

const sectionIds = [
    'beranda',
    'mempelai',
    'acara',
    'hadiah',
    'ucapan',
] as const;

function getCountdown() {
    const seconds = Math.max(
        0,
        Math.floor((weddingDate.getTime() - Date.now()) / 1000),
    );
    return {
        days: String(Math.floor(seconds / 86400)).padStart(2, '0'),
        hours: String(Math.floor(seconds / 3600) % 24).padStart(2, '0'),
        minutes: String(Math.floor(seconds / 60) % 60).padStart(2, '0'),
        seconds: String(seconds % 60).padStart(2, '0'),
        finished: seconds === 0,
    };
}

export function useInvitation(
    guestName: string,
    guestSlug: string,
    initialWishes: Wish[],
    initialNextCursor: string | null,
    initialTotal: number,
) {
    const rootRef = useRef<HTMLDivElement>(null);
    const coverRef = useRef<HTMLElement>(null);
    const mainTitleRef = useRef<HTMLHeadingElement>(null);
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const wishListRef = useRef<HTMLDivElement>(null);
    const loadingWishesRef = useRef(false);
    const coverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [coverPhase, setCoverPhase] = useState<CoverPhase>('closed');
    const [coverSnapshot, setCoverSnapshot] = useState<{
        scrollTop: number;
        height: number;
        portraitSrc: string;
    }>({
        scrollTop: 0,
        height: 0,
        portraitSrc: featuredPhotos.cover,
    });
    const coverOpeningDuration = 2500;
    useInvitationMotion(rootRef, coverPhase !== 'closed');
    const [activeSection, setActiveSection] =
        useState<(typeof sectionIds)[number]>('beranda');
    const [countdown, setCountdown] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        finished: false,
    });
    const [wishes, setWishes] = useState(initialWishes);
    const [wishTotal, setWishTotal] = useState(initialTotal);
    const [nextWishCursor, setNextWishCursor] = useState(initialNextCursor);
    const [wishesLoading, setWishesLoading] = useState(false);
    const [wishesError, setWishesError] = useState('');
    const [wishListMaxHeight, setWishListMaxHeight] = useState<string>();
    const [formStatus, setFormStatus] = useState('');
    const [toast, setToast] = useState('');
    const form = useHttp<WishForm, RsvpResponse>({
        name: guestName,
        attendance: '',
        message: '',
    });
    const wishPages = useHttp<Record<string, string>, WishPageResponse>({});

    const showToast = useCallback((message: string) => {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }
        setToast(message);
        toastTimerRef.current = setTimeout(() => setToast(''), 3500);
    }, []);
    const music = useInvitationMusic(showToast);

    useEffect(() => {
        form.setData('name', guestName);
    }, [guestName]);

    useEffect(() => {
        document.body.classList.toggle('cover-open', coverPhase !== 'open');
        if (coverPhase === 'open') {
            mainTitleRef.current?.focus({ preventScroll: true });
        } else if (coverPhase === 'exiting') {
            coverRef.current
                ?.querySelector<HTMLButtonElement>('.cover-skip')
                ?.focus({ preventScroll: true });
        }
        return () => document.body.classList.remove('cover-open');
    }, [coverPhase]);

    useEffect(() => {
        const updateViewportHeight = () => {
            document.documentElement.style.setProperty(
                '--invitation-vh',
                `${window.innerHeight}px`,
            );
        };
        updateViewportHeight();
        window.addEventListener('resize', updateViewportHeight);

        const flex = document.createElement('div');
        const first = document.createElement('span');
        const second = document.createElement('span');
        flex.style.cssText =
            'display:flex;flex-direction:column;row-gap:1px;position:absolute;visibility:hidden';
        first.style.height = '1px';
        second.style.height = '1px';
        flex.append(first, second);
        document.body.append(flex);
        if (flex.scrollHeight !== 3) {
            document.documentElement.classList.add('no-flex-gap');
        }
        flex.remove();

        return () => {
            window.removeEventListener('resize', updateViewportHeight);
            document.documentElement.style.removeProperty('--invitation-vh');
            document.documentElement.classList.remove('no-flex-gap');
        };
    }, []);

    useEffect(() => {
        setCountdown(getCountdown());
        const interval = setInterval(() => setCountdown(getCountdown()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (coverPhase === 'closed') {
            return;
        }
        let frame = 0;
        const updateNav = () => {
            let active: (typeof sectionIds)[number] = sectionIds[0];
            sectionIds.forEach((id) => {
                const section = rootRef.current?.querySelector(`#${id}`);
                if (
                    section &&
                    section.getBoundingClientRect().top <
                        window.innerHeight * 0.48
                ) {
                    active = id;
                }
            });
            setActiveSection(active);
            frame = 0;
        };
        const onScroll = () => {
            if (!frame) {
                frame = requestAnimationFrame(updateNav);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
        };
    }, [coverPhase]);

    useLayoutEffect(() => {
        const list = wishListRef.current;
        if (!list) {
            return;
        }
        let frame = 0;
        const measure = () => {
            const cards = Array.from(list.querySelectorAll('.wish'));
            const height = cards
                .slice(0, 3)
                .reduce(
                    (total, card) =>
                        total + card.getBoundingClientRect().height,
                    0,
                );
            setWishListMaxHeight(
                cards.length ? `${Math.ceil(height + 1)}px` : undefined,
            );
        };
        const schedule = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(measure);
        };
        schedule();
        const observer =
            'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
        observer?.observe(list);
        window.addEventListener('resize', schedule, { passive: true });
        void document.fonts.ready.then(schedule);
        return () => {
            cancelAnimationFrame(frame);
            observer?.disconnect();
            window.removeEventListener('resize', schedule);
        };
    }, [wishes]);

    useEffect(
        () => () => {
            if (coverTimerRef.current) clearTimeout(coverTimerRef.current);
            if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
            document.body.classList.remove('cover-open');
        },
        [],
    );

    const finishOpening = useCallback(() => {
        if (coverTimerRef.current) {
            clearTimeout(coverTimerRef.current);
            coverTimerRef.current = null;
        }
        setCoverPhase((phase) => (phase === 'exiting' ? 'open' : phase));
    }, []);

    const openInvitation = () => {
        if (coverPhase !== 'closed' || coverTimerRef.current) return;
        const cover = coverRef.current;
        const portrait =
            cover?.querySelector<HTMLImageElement>('#cover-portrait');
        setCoverSnapshot({
            scrollTop: cover?.scrollTop ?? 0,
            height: cover?.clientHeight ?? window.innerHeight,
            portraitSrc: portrait?.currentSrc || featuredPhotos.cover,
        });
        window.scrollTo(0, 0);
        void music.start();
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCoverPhase('open');
            return;
        }
        setCoverPhase('exiting');
        coverTimerRef.current = setTimeout(
            finishOpening,
            coverOpeningDuration + 200,
        );
    };

    const backToCover = () => {
        if (coverTimerRef.current) clearTimeout(coverTimerRef.current);
        coverTimerRef.current = null;
        music.stop();
        setCoverPhase('closed');
        setActiveSection('beranda');
        window.scrollTo(0, 0);
        requestAnimationFrame(() =>
            openButtonRef.current?.focus({ preventScroll: true }),
        );
    };

    const saveDate = () => {
        const date = invitation.date.slice(0, 10);
        const nextDay = new Date(`${date}T00:00:00Z`);
        nextDay.setUTCDate(nextDay.getUTCDate() + 1);

        const parameters = new URLSearchParams({
            action: 'TEMPLATE',
            text: `Pernikahan ${invitation.bride.short} & ${invitation.groom.short}`,
            dates: `${date.replace(/-/g, '')}/${nextDay.toISOString().slice(0, 10).replace(/-/g, '')}`,
            stz: 'Asia/Jakarta',
            etz: 'Asia/Jakarta',
            details: `Akad nikah: ${invitation.akadTime}. Resepsi: ${invitation.receptionTime}. Kami menantikan kehadiran Anda.`,
            location: invitation.address,
        });

        window.open(
            `https://calendar.google.com/calendar/r/eventedit?${parameters.toString()}`,
            '_blank',
        );
    };

    const loadMoreWishes = async () => {
        if (!nextWishCursor || loadingWishesRef.current) return;

        loadingWishesRef.current = true;
        setWishesLoading(true);
        setWishesError('');

        try {
            const page = await wishPages.get(
                indexRsvp.url({
                    query: { to: guestSlug, cursor: nextWishCursor },
                }),
            );

            if (!page) {
                throw new Error('Halaman ucapan tidak tersedia.');
            }

            setWishes((current) => {
                const existingIds = new Set(current.map((wish) => wish.id));
                return [
                    ...current,
                    ...page.data.filter((wish) => !existingIds.has(wish.id)),
                ];
            });
            setNextWishCursor(page.nextCursor);
        } catch {
            setWishesError('Ucapan berikutnya belum berhasil dimuat.');
        } finally {
            loadingWishesRef.current = false;
            setWishesLoading(false);
        }
    };

    const onWishListScroll = () => {
        const list = wishListRef.current;
        if (
            list &&
            list.scrollHeight - list.scrollTop - list.clientHeight <= 80
        ) {
            void loadMoreWishes();
        }
    };

    const submitWish = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (form.processing) return;
        const name = form.data.name.trim();
        const message = form.data.message.trim();
        if (!name || !message || !form.data.attendance) {
            showToast('Lengkapi nama, kehadiran, dan ucapan Anda.');
            return;
        }
        form.transform((data) => ({ ...data, name, message }));
        void form.post(storeRsvp.url(), {
            onSuccess: ({ rsvp }) => {
                setWishes((current) => [rsvp, ...current]);
                setWishTotal((current) => current + 1);
                form.setData('message', '');
                setFormStatus('Terima kasih. Ucapan Anda telah tersimpan.');
                wishListRef.current?.scrollTo({ top: 0 });
                showToast('Ucapan berhasil tersimpan!');
            },
            onError: (errors) => {
                const message = Object.values(errors)[0];
                setFormStatus(
                    typeof message === 'string'
                        ? message
                        : 'Gagal menyimpan ucapan. Coba lagi.',
                );
                showToast('Gagal menyimpan ucapan. Coba lagi.');
            },
            onHttpException: (response) => {
                const message =
                    response.status === 429
                        ? 'Terlalu banyak ucapan. Coba lagi sebentar.'
                        : response.status === 419
                          ? 'Sesi berakhir. Muat ulang halaman lalu coba lagi.'
                          : 'Gagal menyimpan ucapan. Coba lagi.';
                setFormStatus(message);
                showToast(message);
                return false;
            },
            onNetworkError: () => {
                setFormStatus('Tidak dapat terhubung ke server.');
                showToast('Tidak dapat terhubung ke server.');
                return false;
            },
        });
    };

    const copyGift = async (index: number) => {
        const account = invitation.gifts[index];
        const number = account.number.replace(/\D/g, '');
        if (!number) {
            showToast('Nomor rekening belum diisi.');
            return;
        }
        try {
            await navigator.clipboard.writeText(number);
            showToast(`Nomor rekening ${account.bank} berhasil disalin.`);
        } catch {
            const focused = document.activeElement as HTMLElement | null;
            const input = document.createElement('textarea');
            input.value = number;
            input.readOnly = true;
            input.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
            document.body.append(input);
            input.select();
            let copied = false;
            try {
                copied = document.execCommand('copy');
            } catch {
                copied = false;
            } finally {
                input.remove();
                focused?.focus({ preventScroll: true });
            }
            showToast(
                copied
                    ? `Nomor rekening ${account.bank} berhasil disalin.`
                    : 'Belum bisa menyalin. Tekan lama nomor rekening untuk menyalinnya.',
            );
        }
    };

    return {
        rootRef,
        coverRef,
        coverSnapshot,
        coverOpeningDuration,
        finishOpening,
        mainTitleRef,
        openButtonRef,
        wishListRef,
        coverPhase,
        activeSection,
        countdown,
        wishes,
        wishTotal,
        wishesLoading,
        wishesError,
        wishListMaxHeight,
        formStatus,
        toast,
        form,
        music,
        openInvitation,
        backToCover,
        saveDate,
        submitWish,
        loadMoreWishes,
        onWishListScroll,
        copyGift,
    };
}
