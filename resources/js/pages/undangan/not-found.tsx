import { Head } from '@inertiajs/react';

export default function InvitationNotFound() {
    return (
        <>
            <Head title="Undangan tidak ditemukan" />
            <main className="flex min-h-screen items-center justify-center bg-[#f8f6f1] px-5 py-12 text-[#353a35]">
                <section className="w-full max-w-md rounded-2xl border border-[#e5dfd3] bg-white px-7 py-10 shadow-[0_18px_50px_rgba(49,45,35,0.07)] sm:px-10">
                    <div className="mb-8 h-1 w-12 rounded-full bg-[#a6805d]" />
                    <p className="text-xs font-semibold tracking-[0.25em] text-[#9b7859] uppercase">
                        Undangan pernikahan
                    </p>
                    <p className="mt-5 font-serif text-6xl leading-none text-[#a6805d]">
                        404
                    </p>
                    <h1 className="mt-5 font-serif text-2xl font-semibold">
                        Undangan tidak ditemukan
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-[#666b65]">
                        Nama pada tautan ini tidak terdaftar. Periksa kembali
                        tautan yang dibagikan pengundang atau minta tautan yang
                        benar.
                    </p>
                </section>
            </main>
        </>
    );
}
