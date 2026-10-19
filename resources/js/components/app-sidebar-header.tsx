import { usePage } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const currentTitle = breadcrumbs.at(-1)?.title ?? 'Dashboard';

    return (
        <>
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl md:hidden">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800">
                        <AppLogoIcon className="size-4 fill-current" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[9px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                            Admin undangan
                        </p>
                        <p className="truncate text-[15px] font-semibold tracking-tight text-slate-950">
                            {currentTitle}
                        </p>
                    </div>
                </div>
                {auth.user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                aria-label="Buka menu akun"
                                className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 active:bg-slate-100"
                            >
                                <UserRound
                                    className="size-[18px]"
                                    aria-hidden="true"
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-64 rounded-xl p-2"
                        >
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </header>

            <header className="border-sidebar-border/50 hidden h-16 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:flex md:px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </header>
        </>
    );
}
