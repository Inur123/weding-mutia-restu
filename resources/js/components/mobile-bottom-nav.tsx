import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    MessageSquareHeart,
    UserRound,
    UsersRound,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import * as GuestRoutes from '@/routes/guests';
import { edit as editProfile } from '@/routes/profile';
import * as RsvpRoutes from '@/routes/rsvps';

const mobileNavItems = [
    { title: 'Beranda', href: dashboard().url, icon: LayoutDashboard },
    { title: 'Tamu', href: GuestRoutes.index().url, icon: UsersRound },
    {
        title: 'Ucapan',
        href: RsvpRoutes.index().url,
        icon: MessageSquareHeart,
    },
    { title: 'Profil', href: editProfile().url, icon: UserRound },
];

export function MobileBottomNav() {
    const { currentUrl, isCurrentUrl } = useCurrentUrl();

    return (
        <nav
            aria-label="Navigasi utama"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
        >
            <div className="mx-auto grid max-w-md grid-cols-4">
                {mobileNavItems.map((item) => {
                    const isActive =
                        item.title === 'Profil'
                            ? currentUrl.startsWith('/settings')
                            : isCurrentUrl(item.href);

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                'group flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors',
                                isActive
                                    ? 'text-slate-950'
                                    : 'text-slate-500 active:text-slate-800',
                            )}
                        >
                            <span
                                className={cn(
                                    'grid h-7 w-10 place-items-center rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-500',
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'size-[18px] stroke-[1.8]',
                                        isActive && 'stroke-[2.2]',
                                    )}
                                    aria-hidden="true"
                                />
                            </span>
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
