import {
    Pagination as PaginationContainer,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

export interface PaginatedLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginatedLink[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export function Pagination({ links }: { links: PaginatedLink[] }) {
    if (!links || links.length <= 3) return null;

    return (
        <PaginationContainer className="mt-4 flex justify-center md:justify-end">
            <PaginationContent className="max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-none md:rounded-none md:border-0 md:bg-transparent md:p-0">
                {links.map((link, i) => {
                    // Check if it's "Previous" or "Next"
                    const isPrev =
                        link.label.includes('Previous') ||
                        link.label.includes('pagination.previous');
                    const isNext =
                        link.label.includes('Next') ||
                        link.label.includes('pagination.next');

                    if (isPrev) {
                        return (
                            <PaginationItem key={i}>
                                <PaginationPrevious
                                    href={link.url || '#'}
                                    className={
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                    onFinish={() =>
                                        window.history.replaceState(
                                            {},
                                            '',
                                            window.location.pathname,
                                        )
                                    }
                                />
                            </PaginationItem>
                        );
                    }

                    if (isNext) {
                        return (
                            <PaginationItem key={i}>
                                <PaginationNext
                                    href={link.url || '#'}
                                    className={
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                    onFinish={() =>
                                        window.history.replaceState(
                                            {},
                                            '',
                                            window.location.pathname,
                                        )
                                    }
                                />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={i}>
                            <PaginationLink
                                href={link.url || '#'}
                                isActive={link.active}
                                className={`${!link.url ? 'pointer-events-none opacity-50' : ''} ${!link.active ? 'hidden sm:inline-flex' : ''}`}
                                onFinish={() =>
                                    window.history.replaceState(
                                        {},
                                        '',
                                        window.location.pathname,
                                    )
                                }
                            >
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </PaginationContainer>
    );
}
