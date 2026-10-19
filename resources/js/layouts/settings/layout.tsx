import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profil',
        href: edit(),
        icon: null,
    },
    {
        title: 'Keamanan',
        href: editSecurity(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-4 py-5 md:py-6">
            <Heading
                title="Pengaturan"
                description="Kelola pengaturan profil dan akun Anda"
            />

            <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-none lg:flex lg:flex-col lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn(
                                    'w-full justify-center rounded-lg lg:justify-start lg:rounded-md',
                                    {
                                        'lg:bg-muted lg:text-foreground lg:hover:bg-muted bg-slate-900 text-white hover:bg-slate-800 hover:text-white':
                                            isCurrentOrParentUrl(item.href),
                                    },
                                )}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <div className="md:border-border flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-none md:max-w-2xl md:rounded-xl md:p-6 md:shadow-sm">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
