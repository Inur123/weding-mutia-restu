import { Head, useForm } from '@inertiajs/react';
import {
    Copy,
    Plus,
    Search,
    Trash2,
    ExternalLink,
    MessageCircle,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { noTranslateProps, ProtectedText } from '@/components/protected-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginatedData } from '@/components/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { dashboard } from '@/routes';
import * as GuestRoutes from '@/routes/guests';

interface Guest {
    id: number;
    name: string;
    slug: string;
    invitation_url: string;
    whatsapp_url: string;
    share_message: string;
}

function DeleteGuestButton({
    guest,
    processing,
    onDelete,
    className,
    showLabel = false,
}: {
    guest: Guest;
    processing: boolean;
    onDelete: (guest: Guest) => void;
    className?: string;
    showLabel?: boolean;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size={showLabel ? 'sm' : 'icon'}
                    variant="ghost"
                    className={
                        className ??
                        'text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7'
                    }
                    disabled={processing}
                    aria-label={`Hapus ${guest.name}`}
                    title="Hapus"
                >
                    <Trash2 className="h-4 w-4" />
                    {showLabel && <span>Hapus</span>}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Data Tamu?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus{' '}
                        <ProtectedText as="strong">
                            "{guest.name}"
                        </ProtectedText>
                        ? Data yang sudah dihapus tidak bisa dikembalikan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onDelete(guest)}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function GuestsIndex({
    guests,
}: {
    guests: PaginatedData<Guest>;
}) {
    const [addOpen, setAddOpen] = useState(false);
    const [copied, setCopied] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const deleteForm = useForm({});
    const form = useForm({ name: '' });

    const filteredGuests = guests.data.filter((g) =>
        g.name.toLowerCase().includes(search.toLowerCase().trim()),
    );

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(GuestRoutes.store().url, {
            onSuccess: () => {
                form.reset();
                setAddOpen(false);
            },
        });
    }

    async function copyLink(guest: Guest) {
        try {
            await navigator.clipboard.writeText(
                guest.share_message || guest.invitation_url,
            );
            setCopied(guest.id);
            setTimeout(() => setCopied(null), 2000);
        } catch {
            setCopied(null);
        }
    }

    function handleDelete(guest: Guest) {
        deleteForm.delete(GuestRoutes.destroy(guest.id).url);
    }

    return (
        <>
            <Head title="Tamu Undangan" />
            <div className="flex w-full min-w-0 flex-col gap-4 p-4 md:gap-6 md:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl md:font-bold">
                            Tamu Undangan
                        </h1>
                        <p className="mt-1 text-[13px] text-slate-500 md:text-sm">
                            Kelola daftar tamu dan bagikan link undangan.
                        </p>
                    </div>

                    <Dialog open={addOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="h-10 w-full rounded-xl bg-slate-900 text-sm hover:bg-slate-800 sm:h-9 sm:w-auto sm:rounded-md"
                                size="sm"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Tamu
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-lg sm:rounded-lg">
                            <DialogHeader>
                                <DialogTitle>Tambah Tamu Undangan</DialogTitle>
                            </DialogHeader>
                            <form
                                onSubmit={submit}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name">Nama Tamu *</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        placeholder="Contoh: Bapak Ahmad Fauzi"
                                        required
                                    />
                                    {form.errors.name && (
                                        <p className="text-destructive text-sm">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setAddOpen(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        {form.processing
                                            ? 'Menyimpan...'
                                            : 'Simpan'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="md:border-border min-w-0 gap-0 overflow-hidden rounded-2xl border-slate-200 p-0 shadow-none md:rounded-md md:shadow-sm">
                    <CardHeader className="md:bg-muted/20 border-b border-slate-200 bg-white px-4 py-3">
                        {/* Mobile: 2 baris */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700">
                                    Daftar tamu
                                </span>
                                <span className="text-xs text-slate-500 sm:hidden">
                                    {filteredGuests.length} orang
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 sm:flex-none">
                                    <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
                                    <Input
                                        id="guest-search"
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Cari tamu..."
                                        className="h-8 w-full pl-8 text-sm sm:w-52"
                                    />
                                </div>
                                <span className="hidden shrink-0 text-xs text-slate-500 sm:block">
                                    {filteredGuests.length} orang
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredGuests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="text-muted-foreground mb-3 h-10 w-10" />
                                <h3 className="text-sm font-semibold">
                                    {search.trim()
                                        ? 'Tamu tidak ditemukan'
                                        : 'Belum ada tamu'}
                                </h3>
                                <p className="text-muted-foreground mt-1 max-w-sm text-xs">
                                    {search.trim()
                                        ? `Tidak ada tamu dengan nama "${search.trim()}".`
                                        : 'Daftar tamu Anda masih kosong. Klik tombol "Tambah Tamu" di atas untuk mulai membuat daftar.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="divide-y divide-slate-100 bg-white px-4 md:hidden">
                                    {filteredGuests.map((guest, index) => (
                                        <article
                                            key={guest.id}
                                            className="min-w-0 py-4"
                                        >
                                            <div className="flex items-start gap-3">
                                                <ProtectedText
                                                    as="div"
                                                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700"
                                                >
                                                    {Array.from(
                                                        guest.name,
                                                    )[0]?.toUpperCase() ?? 'T'}
                                                </ProtectedText>
                                                <div className="min-w-0 flex-1">
                                                    <ProtectedText
                                                        as="p"
                                                        className="truncate text-[15px] font-semibold text-slate-950"
                                                    >
                                                        {guest.name}
                                                    </ProtectedText>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        Tamu #
                                                        {(guests.from || 1) +
                                                            index}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 min-w-0 truncate rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
                                                {guest.invitation_url}
                                            </div>

                                            <div className="mt-3 grid min-w-0 grid-cols-4 gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 min-w-0 rounded-lg border-emerald-200 bg-emerald-50 px-1 text-[11px] text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                                                    asChild
                                                >
                                                    <a
                                                        href={`https://wa.me/?text=${encodeURIComponent(guest.share_message)}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <MessageCircle className="size-3.5" />
                                                        WA
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 min-w-0 rounded-lg px-1 text-[11px]"
                                                    onClick={() =>
                                                        copyLink(guest)
                                                    }
                                                    aria-label={`Salin undangan ${guest.name}`}
                                                >
                                                    {copied === guest.id ? (
                                                        <span className="text-emerald-700">
                                                            Disalin
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <Copy className="size-3.5" />
                                                            Salin
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 min-w-0 rounded-lg px-1 text-[11px]"
                                                    asChild
                                                >
                                                    <a
                                                        href={
                                                            guest.invitation_url
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        aria-label={`Buka undangan ${guest.name}`}
                                                    >
                                                        <ExternalLink className="size-3.5" />
                                                        Buka
                                                    </a>
                                                </Button>
                                                <DeleteGuestButton
                                                    guest={guest}
                                                    processing={
                                                        deleteForm.processing
                                                    }
                                                    onDelete={handleDelete}
                                                    showLabel
                                                    className="text-destructive hover:text-destructive h-9 w-full min-w-0 rounded-lg border border-red-100 bg-red-50 px-1 text-[11px] hover:bg-red-100"
                                                />
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                <div className="hidden overflow-x-auto md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="h-10 w-[40px] pl-4 text-xs">
                                                    No
                                                </TableHead>
                                                <TableHead className="h-10 w-[280px] text-xs">
                                                    Nama Tamu
                                                </TableHead>
                                                <TableHead className="h-10 text-xs">
                                                    Link URL
                                                </TableHead>
                                                <TableHead className="h-10 pr-4 text-right text-xs">
                                                    Aksi
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredGuests.map(
                                                (guest, index) => (
                                                    <TableRow
                                                        key={guest.id}
                                                        className="h-12"
                                                    >
                                                        <TableCell className="text-muted-foreground py-2 pl-4 text-xs">
                                                            {(guests.from ||
                                                                1) + index}
                                                        </TableCell>
                                                        <TableCell
                                                            {...noTranslateProps(
                                                                'py-2 text-sm font-medium',
                                                            )}
                                                        >
                                                            {guest.name}
                                                        </TableCell>
                                                        <TableCell className="py-2">
                                                            <div className="flex items-center gap-1.5">
                                                                <code className="bg-muted/50 border-border/50 rounded border px-1.5 py-0.5 text-xs">
                                                                    {guest.invitation_url.replace(
                                                                        window
                                                                            .location
                                                                            .origin,
                                                                        '',
                                                                    )}
                                                                </code>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-muted-foreground hover:text-foreground h-6 w-6"
                                                                    onClick={() =>
                                                                        copyLink(
                                                                            guest,
                                                                        )
                                                                    }
                                                                    title="Salin Teks Undangan"
                                                                >
                                                                    {copied ===
                                                                    guest.id ? (
                                                                        <span className="text-xs font-bold text-green-600">
                                                                            ✓
                                                                        </span>
                                                                    ) : (
                                                                        <Copy className="h-3 w-3" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="py-2 pr-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    asChild
                                                                    className="h-7 px-2 text-[11px] font-semibold"
                                                                >
                                                                    <a
                                                                        href={
                                                                            guest.invitation_url
                                                                        }
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <ExternalLink className="mr-1 h-3 w-3" />
                                                                        Buka
                                                                    </a>
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="h-7 bg-green-600 px-2 text-[11px] font-semibold hover:bg-green-700"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={`https://wa.me/?text=${encodeURIComponent(guest.share_message)}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                    >
                                                                        <MessageCircle className="mr-1 h-3 w-3" />
                                                                        Kirim WA
                                                                    </a>
                                                                </Button>

                                                                <DeleteGuestButton
                                                                    guest={
                                                                        guest
                                                                    }
                                                                    processing={
                                                                        deleteForm.processing
                                                                    }
                                                                    onDelete={
                                                                        handleDelete
                                                                    }
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {guests.data.length > 0 && <Pagination links={guests.links} />}
            </div>
        </>
    );
}

GuestsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Tamu Undangan', href: GuestRoutes.index().url },
    ],
};
