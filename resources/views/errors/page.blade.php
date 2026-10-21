@php
    $statusCode = $exception->getStatusCode();
    $details = match ($statusCode) {
        401 => ['Akses memerlukan login', 'Silakan masuk terlebih dahulu untuk membuka halaman ini.'],
        403 => ['Akses tidak diizinkan', 'Anda tidak memiliki izin untuk membuka halaman ini.'],
        404 => ['Halaman tidak ditemukan', 'Periksa kembali alamat yang Anda buka atau minta tautan yang benar.'],
        405 => ['Halaman tidak dapat dibuka', 'Cara mengakses halaman ini tidak didukung. Coba buka kembali dari tautan semula.'],
        408 => ['Permintaan terlalu lama', 'Koneksi terputus sebelum halaman selesai dimuat. Silakan coba lagi.'],
        419 => ['Sesi telah berakhir', 'Muat ulang halaman, lalu coba kembali.'],
        422 => ['Permintaan tidak dapat diproses', 'Periksa kembali informasi yang dikirim, lalu coba lagi.'],
        429 => ['Terlalu banyak percobaan', 'Tunggu sebentar sebelum mencoba kembali.'],
        500 => ['Terjadi kendala', 'Halaman belum dapat ditampilkan. Silakan coba lagi beberapa saat lagi.'],
        502, 503, 504 => ['Layanan sementara tidak tersedia', 'Kami sedang mengalami kendala. Silakan coba lagi beberapa saat lagi.'],
        default => $statusCode >= 500
            ? ['Terjadi kendala', 'Halaman belum dapat ditampilkan. Silakan coba lagi beberapa saat lagi.']
            : ['Permintaan tidak dapat diproses', 'Periksa kembali tautan yang dibuka, lalu coba lagi.'],
    };
@endphp

<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex, nofollow">
        <title>{{ $statusCode }} — {{ $details[0] }} | Mutiara &amp; Restu</title>
        <style>
            *, *::before, *::after { box-sizing: border-box; }
            html { background: #f4eadb; }
            body { margin: 0; color: #332d29; font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif; }
            main { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; justify-content: center; padding: 48px 20px; }
            .card { width: 100%; max-width: 448px; padding: 40px 28px; border: 1px solid #e5d2bc; border-radius: 16px; background: #fffdf9; box-shadow: 0 18px 50px rgba(83, 43, 28, .07); }
            .rule { width: 48px; height: 4px; margin-bottom: 32px; border-radius: 99px; background: #8a4b33; }
            .eyebrow { margin: 0; color: #8a4b33; font-size: 12px; font-weight: 600; letter-spacing: .25em; text-transform: uppercase; }
            .code { margin: 20px 0 0; color: #8a4b33; font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif; font-size: 60px; line-height: 1; }
            h1 { margin: 20px 0 0; font-family: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif; font-size: 24px; font-weight: 600; line-height: 1.25; }
            .description { margin: 12px 0 0; color: #65554d; font-size: 14px; line-height: 28px; }
            @media (min-width: 640px) {
                .card { padding-right: 40px; padding-left: 40px; }
            }
        </style>
    </head>
    <body>
        <main>
            <section class="card" aria-labelledby="error-title">
                <div class="rule" aria-hidden="true"></div>
                <p class="eyebrow">Undangan pernikahan</p>
                <p class="code" aria-hidden="true">{{ $statusCode }}</p>
                <h1 id="error-title">{{ $details[0] }}</h1>
                <p class="description">{{ $details[1] }}</p>
            </section>
        </main>
    </body>
</html>
