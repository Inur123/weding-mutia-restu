import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Clock,
    MessageSquareHeart,
    UserCheck,
    Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as GuestRoutes from '@/routes/guests';
import * as RsvpRoutes from '@/routes/rsvps';
import { dashboard } from '@/routes';

interface Stats {
    total_guests: number;
    total_rsvps: number;
    hadir: number;
    tidak: number;
    belum: number;
}

export default function Dashboard({ stats }: { stats: Stats }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl md:font-bold">
                        Dashboard Undangan
                    </h1>
                    <p className="mt-1 text-[13px] text-slate-500 md:text-sm">
                        Ringkasan undangan pernikahan Anda.
                    </p>
                </div>

                <section className="rounded-2xl bg-slate-900 p-5 text-white md:hidden">
                    <p className="text-xs font-medium tracking-wide text-slate-300 uppercase">
                        Ringkasan tamu
                    </p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight">
                        {stats.total_guests} tamu
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t border-white/15 pt-4 text-xs text-slate-300">
                        <span>{stats.total_rsvps} ucapan masuk</span>
                        <span className="size-1 rounded-full bg-slate-500" />
                        <span>{stats.hadir} akan hadir</span>
                    </div>
                </section>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
                    <Card className="md:border-border gap-3 rounded-xl border-slate-200 py-4 shadow-none md:gap-6 md:py-6 md:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-0 md:px-6 md:pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Tamu
                            </CardTitle>
                            <div className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 md:contents">
                                <Users className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 md:px-6">
                            <div className="text-2xl font-bold">
                                {stats.total_guests}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                tamu terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:border-border gap-3 rounded-xl border-slate-200 py-4 shadow-none md:gap-6 md:py-6 md:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-0 md:px-6 md:pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total RSVP
                            </CardTitle>
                            <div className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-600 md:contents">
                                <MessageSquareHeart className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 md:px-6">
                            <div className="text-2xl font-bold">
                                {stats.total_rsvps}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                ucapan masuk
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:border-border gap-3 rounded-xl border-slate-200 py-4 shadow-none md:gap-6 md:py-6 md:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-0 md:px-6 md:pb-2">
                            <CardTitle className="text-sm font-medium">
                                Hadir
                            </CardTitle>
                            <div className="grid size-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700 md:contents">
                                <UserCheck className="h-4 w-4 text-green-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 md:px-6">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.hadir}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                konfirmasi hadir
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:border-border gap-3 rounded-xl border-slate-200 py-4 shadow-none md:gap-6 md:py-6 md:shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between px-4 pb-0 md:px-6 md:pb-2">
                            <CardTitle className="text-sm font-medium">
                                Belum Konfirmasi
                            </CardTitle>
                            <div className="grid size-8 place-items-center rounded-lg bg-amber-50 text-amber-700 md:contents">
                                <Clock className="h-4 w-4 text-amber-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 md:px-6">
                            <div className="text-2xl font-bold text-amber-600">
                                {stats.belum + stats.tidak}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                belum / tidak hadir
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                    <Card className="flex flex-col rounded-xl border border-slate-200 shadow-none md:shadow-sm">
                        <CardHeader className="px-5 md:px-6">
                            <div className="mb-2 grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-700 md:hidden">
                                <Users className="size-5" />
                            </div>
                            <CardTitle className="text-base">
                                Kelola Tamu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-3 px-5 md:px-6">
                            <p className="text-muted-foreground flex-1 text-sm">
                                Tambah nama tamu undangan dan bagikan link
                                undangan personal melalui WhatsApp.
                            </p>
                            <Button
                                asChild
                                className="mt-auto h-10 rounded-xl bg-slate-900 hover:bg-slate-800 md:h-9 md:rounded-md"
                            >
                                <Link href={GuestRoutes.index().url}>
                                    Kelola Tamu
                                    <ArrowRight className="ml-auto h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col rounded-xl border border-slate-200 shadow-none md:shadow-sm">
                        <CardHeader className="px-5 md:px-6">
                            <div className="mb-2 grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-700 md:hidden">
                                <MessageSquareHeart className="size-5" />
                            </div>
                            <CardTitle className="text-base">
                                Lihat RSVP & Ucapan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-1 flex-col gap-3 px-5 md:px-6">
                            <p className="text-muted-foreground flex-1 text-sm">
                                Pantau konfirmasi kehadiran dan baca ucapan doa
                                dari tamu undangan.
                            </p>
                            <Button
                                asChild
                                variant="outline"
                                className="mt-auto h-10 rounded-xl md:h-9 md:rounded-md"
                            >
                                <Link href={RsvpRoutes.index().url}>
                                    Lihat RSVP
                                    <ArrowRight className="ml-auto h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
    ],
};
