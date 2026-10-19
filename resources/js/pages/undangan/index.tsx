import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { InvitationMarkup } from './invitation-markup';
import type { Wish } from './invitation-data';
import { dismissInvitationLoader } from './invitation-loader';
import { useInvitation } from './use-invitation';

interface UndanganProps {
    guestName: string;
    invitationAssets: {
        style: string;
        compat: string;
    };
    rsvps: Wish[];
    rsvpTotal: number;
}

export default function UndanganIndex({
    guestName,
    invitationAssets,
    rsvps,
    rsvpTotal,
}: UndanganProps) {
    const model = useInvitation(guestName, rsvps, rsvpTotal);

    useEffect(() => {
        const coverImage = document.getElementById(
            'cover-portrait',
        ) as HTMLImageElement | null;

        if (coverImage?.complete && coverImage.naturalWidth > 0) {
            dismissInvitationLoader();
        }

        const fallbackTimer = window.setTimeout(dismissInvitationLoader, 7000);

        return () => {
            window.clearTimeout(fallbackTimer);
        };
    }, []);

    return (
        <>
            <Head title="Undangan Pernikahan">
                <meta
                    head-key="color-scheme"
                    name="color-scheme"
                    content="light"
                />
                <meta
                    head-key="supported-color-schemes"
                    name="supported-color-schemes"
                    content="light"
                />
                <link
                    head-key="invitation-style"
                    rel="stylesheet"
                    href={invitationAssets.style}
                />
                <link
                    head-key="invitation-compat"
                    rel="stylesheet"
                    href={invitationAssets.compat}
                />
            </Head>
            <div ref={model.rootRef} className="undangan-wrapper">
                <InvitationMarkup guestName={guestName} model={model} />
            </div>
        </>
    );
}
