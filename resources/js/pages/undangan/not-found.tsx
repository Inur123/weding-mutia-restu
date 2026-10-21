import { Head } from '@inertiajs/react';

export default function InvitationNotFound() {
    return (
        <>
            <Head title="Undangan tidak ditemukan" />
            <main className="flex min-h-screen items-center justify-center bg-[#f4eadb] px-5 py-12 text-[#332d29]">
                <section className="w-full max-w-md rounded-2xl border border-[#e5d2bc] bg-[#fffdf9] px-7 py-10 shadow-[0_18px_50px_rgba(83,43,28,0.07)] sm:px-10">
                    <div className="mb-8 h-1 w-12 rounded-full bg-[#8a4b33]" />
                    <p className="text-xs font-semibold tracking-[0.25em] text-[#8a4b33] uppercase">
                        Undangan pernikahan
                    </p>
                    <p
                        className="mt-5 font-serif text-6xl leading-none text-[#8a4b33]"
                        aria-hidden="true"
                    >
                        404
                    </p>
                    <h1 className="mt-5 font-serif text-2xl font-semibold">
                        Undangan tidak ditemukan
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-[#65554d]">
                        Nama pada tautan ini tidak terdaftar. Periksa kembali
                        tautan yang dibagikan pengundang atau minta tautan yang
                        benar.
                    </p>
                </section>
            </main>
        </>
    );
}
