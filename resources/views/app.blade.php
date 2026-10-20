@use('App\Support\InvitationAssets')

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($page['component'] ?? null) !== 'undangan/index' && ($appearance ?? 'system') == 'dark'])>
    <head>
        @php
            $invitationGuestName = data_get($page, 'props.guestName');
            $invitationCoverImage = InvitationAssets::coverImageUrl();
            $invitationShareImage = InvitationAssets::shareImageUrl();
            $invitationStyles = InvitationAssets::styleUrls();
        @endphp

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ ($page['component'] ?? null) === 'undangan/index' ? 'light' : ($appearance ?? 'system') }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        @if (($page['component'] ?? null) !== 'undangan/index')
            <style>
                #app-load-error[hidden] { display: none; }
                #app-load-error { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: #fff; color: #171717; font-family: sans-serif; }
                #app-load-error > div { width: 100%; max-width: 380px; }
                #app-load-error h1 { font-size: 22px; }
                #app-load-error p { line-height: 1.6; }
                #app-load-error a { display: inline-block; min-height: 44px; padding: 12px 20px; border-radius: 6px; background: #171717; color: #fff; text-decoration: none; box-sizing: border-box; }
                #app-load-error a:focus-visible { outline: 2px solid #171717; outline-offset: 3px; }
            </style>
        @endif

        @if (($page['component'] ?? null) === 'undangan/index')
            <meta name="color-scheme" content="light" data-inertia="color-scheme">
            <meta name="supported-color-schemes" content="light" data-inertia="supported-color-schemes">
            <link rel="stylesheet" href="{{ $invitationStyles['style'] }}" data-inertia="invitation-style">
            <link rel="stylesheet" href="{{ $invitationStyles['compat'] }}" data-inertia="invitation-compat">
            <style>
                html, html.dark, body {
                    background-color: #f4eadb;
                    color-scheme: light;
                    color-scheme: only light;
                }

                #invitation-boot-loader {
                    position: fixed;
                    z-index: 10000;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f4eadb;
                    color: #8a4b33;
                    opacity: 1;
                    transition: opacity 250ms ease, visibility 250ms ease;
                }

                #invitation-boot-loader.is-hiding {
                    visibility: hidden;
                    pointer-events: none;
                    opacity: 0;
                }

                .invitation-boot-loader__content {
                    text-align: center;
                    opacity: 1;
                }

                .invitation-boot-loader__spinner {
                    width: 38px;
                    height: 38px;
                    margin: 0 auto 14px;
                    border: 2px solid #d8c2ae;
                    border-top-color: #8a4b33;
                    border-radius: 50%;
                    animation: invitation-loader-spin 800ms linear infinite;
                }

                .invitation-boot-loader__label {
                    margin: 0;
                    font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    font-size: 12px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                }

                @keyframes invitation-loader-spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    #invitation-boot-loader {
                        transition: none;
                    }

                    .invitation-boot-loader__content {
                        opacity: 1;
                        animation: none;
                    }

                    .invitation-boot-loader__spinner {
                        animation: none;
                    }
                }
            </style>

            <script>
                window.setTimeout(function() {
                    var loader = document.getElementById('invitation-boot-loader');

                    if (!loader) {
                        return;
                    }

                    loader.classList.add('is-hiding');

                    window.setTimeout(function() {
                        if (loader.parentNode) {
                            loader.parentNode.removeChild(loader);
                        }
                    }, 300);
                }, 10000);
            </script>
        @endif

        <link rel="icon" type="image/jpeg" href="{{ InvitationAssets::faviconUrl() }}">
        <link rel="apple-touch-icon" href="{{ $invitationCoverImage }}">

        {{-- Open Graph Meta Tags untuk WhatsApp/Facebook --}}
        <meta property="og:title" content="Undangan Pernikahan Mutiara & Restu" />
        <meta property="og:description" content="{{ is_string($invitationGuestName) ? "Kepada Yth. {$invitationGuestName}, kami mengundang Anda untuk menghadiri pernikahan Mutiara & Restu." : 'Tanpa mengurangi rasa hormat, kami mengundang Anda untuk menghadiri pernikahan Mutiara & Restu.' }}" />
        <meta property="og:image" content="{{ $invitationShareImage }}" />
        <meta property="og:image:secure_url" content="{{ $invitationShareImage }}" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1243" />
        <meta property="og:image:height" content="1266" />
        <meta property="og:image:alt" content="Foto cover undangan pernikahan Mutiara dan Restu" />
        <meta property="og:url" content="{{ url()->full() }}" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="{{ $invitationShareImage }}" />

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>Mutiara & Restu</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        @if (($page['component'] ?? null) === 'undangan/index')
            <div id="invitation-boot-loader" role="status" aria-live="polite">
                <div class="invitation-boot-loader__content">
                    <div class="invitation-boot-loader__spinner" aria-hidden="true"></div>
                    <p class="invitation-boot-loader__label">Menyiapkan undangan</p>
                </div>
            </div>
        @endif

        <x-inertia::app />

        @if (($page['component'] ?? null) !== 'undangan/index')
            <div id="app-load-error" hidden role="alert">
                <div>
                    <h1>Halaman tidak dapat dimuat</h1>
                    <p>Coba muat ulang halaman. Jika masih gagal, hubungi pengelola undangan.</p>
                    <a href="">Muat ulang</a>
                </div>
            </div>
            <script>
                document.addEventListener('DOMContentLoaded', function () {
                    var app = document.getElementById('app');
                    var error = document.getElementById('app-load-error');

                    if (!app || !error) {
                        return;
                    }

                    window.setTimeout(function () {
                        if (!app.firstElementChild) {
                            error.hidden = false;
                        }
                    }, 10000);

                    if (typeof MutationObserver === 'function') {
                        var observer = new MutationObserver(function () {
                            if (app.firstElementChild) {
                                error.hidden = true;
                                observer.disconnect();
                            }
                        });

                        observer.observe(app, { childList: true });
                    }
                });
            </script>
        @endif
    </body>
</html>
