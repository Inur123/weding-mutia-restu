import couplePortrait from '../../../images/theme-special03/utama-warm.jpg';
import bridePortrait from '../../../images/theme-special03/mutia-warm.jpg';
import groomPortrait from '../../../images/theme-special03/restu-warm.jpg';

export type Attendance = 'hadir' | 'tidak' | 'belum';

export interface Wish {
    id: number;
    name: string;
    attendance: Attendance;
    message: string;
}

export const invitation = {
    bride: {
        short: 'Mutiara',
        full: 'Mutiara Adinda Eka Putri',
        childOrder: 'pertama',
        parents: 'Bapak Sudarto & Ibu Dwi Kasiyani S. Pd',
    },
    groom: {
        short: 'Restu',
        full: 'Restu Andriyan, S.Pd.',
        childOrder: 'kedua',
        parents: 'Bapak Suparno & Ibu Nur Qosidah',
    },
    date: '2026-11-19T07:00:00+07:00',
    akadTime: '07.00 WIB',
    receptionTime: '09.00 WIB',
    address: 'Ds. Sukowidi, RT 14 RW 03, Kec. Nguntoronadi, Kab. Magetan',
    mapsUrl: 'https://share.google/xR1qBzBpoVnXcFtp2',
    gifts: [
        {
            bank: 'Bank Mandiri',
            number: '1870000441050',
            holder: 'MUTIARA ADINDA EKA P',
        },
        {
            bank: 'Bank BRI',
            number: '644301035344538',
            holder: 'Restu Andriyan',
        },
    ],
    giftDeliveryAddress:
        'Ds. Sukowidi, Dukuh Slumpang RT 14 RW 03, Kec. Nguntoronadi, Kab. Magetan',
} as const;

export const featuredPhotos = {
    cover: couplePortrait,
    heroMain: couplePortrait,
    bride: bridePortrait,
    groom: groomPortrait,
} as const;

export const loveStory = [
    {
        date: '6 September 2024',
        title: 'Pertemuan',
        story: 'Berawal dari pertemuan di pelatihan, kami mengenal satu sama lain dan belum ada benih cinta kala itu, hanya sebatas kader dan anggota.',
    },
    {
        date: '17 Mei 2026',
        title: 'Pertemuan Keluarga',
        story: 'Setelah cukup mengenal satu sama lain, kurang lebih satu setengah tahun kami menjalin hubungan. Akhirnya kami memutuskan untuk melanjutkan ke hubungan yang lebih serius dengan mempertemukan kedua keluarga.',
    },
    {
        date: '19 November 2026',
        title: 'Janji Suci',
        story: 'Sampai tanggal ini kami melaksanakan akad terlebih dahulu dan akhirnya kami mengubah status hingga menjadi pasangan suami istri. Semoga Allah SWT memberikan keberkahan pernikahan ini. Amin.',
    },
] as const;

export const attendanceLabels: Record<Attendance, string> = {
    hadir: 'Berencana hadir',
    tidak: 'Belum bisa hadir',
    belum: 'Menyesuaikan jadwal',
};

export const weddingDate = new Date(invitation.date);

export function formatWeddingDate(options: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        ...options,
    }).format(weddingDate);
}

export function formatAccountNumber(number: string): string {
    return number
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim();
}
