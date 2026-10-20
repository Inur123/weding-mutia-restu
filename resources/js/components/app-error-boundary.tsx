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
                <main className="flex min-h-svh items-center justify-center bg-white p-6 text-slate-950">
                    <div className="flex w-full max-w-sm flex-col gap-4">
                        <h1 className="text-xl font-semibold">
                            Halaman tidak dapat ditampilkan
                        </h1>
                        <p className="text-sm leading-6">
                            Coba muat ulang halaman. Jika masih gagal, hubungi
                            pengelola undangan.
                        </p>
                        <button
                            type="button"
                            className="min-h-11 self-start rounded-md bg-slate-900 px-5 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                            onClick={() => window.location.reload()}
                        >
                            Muat ulang
                        </button>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}
