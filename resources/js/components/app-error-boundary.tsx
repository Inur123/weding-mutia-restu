import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class AppErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <main className="flex min-h-screen items-center justify-center bg-[#f4eadb] px-5 py-12 text-[#332d29]">
                    <section className="w-full max-w-md rounded-2xl border border-[#e5d2bc] bg-[#fffdf9] px-7 py-10 shadow-[0_18px_50px_rgba(83,43,28,0.07)] sm:px-10">
                        <div
                            className="mb-8 h-1 w-12 rounded-full bg-[#8a4b33]"
                            aria-hidden="true"
                        />
                        <p className="text-xs font-semibold tracking-[0.25em] text-[#8a4b33] uppercase">
                            Undangan pernikahan
                        </p>
                        <h1 className="mt-5 font-serif text-2xl font-semibold">
                            Halaman tidak dapat ditampilkan
                        </h1>
                        <p className="mt-3 text-sm leading-7 text-[#65554d]">
                            Coba muat ulang halaman. Jika masih gagal, hubungi
                            pengelola undangan.
                        </p>
                        <button
                            type="button"
                            className="mt-5 min-h-11 text-sm font-semibold text-[#8a4b33] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8a4b33]"
                            onClick={() => window.location.reload()}
                        >
                            Muat ulang
                        </button>
                    </section>
                </main>
            );
        }

        return this.props.children;
    }
}
