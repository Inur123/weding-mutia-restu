import type { SyntheticEvent } from 'react';
import { noTranslateProps, ProtectedText } from '@/components/protected-text';
import { featuredPhotos, invitation } from './invitation-data';
import { InvitationDecor } from './invitation-decor';
import { dismissInvitationLoader } from './invitation-loader';
import type { useInvitation } from './use-invitation';

type CoverProps = {
    guestName: string;
    model: ReturnType<typeof useInvitation>;
    onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
};

export function InvitationCover({
    guestName,
    model,
    onImageError,
}: CoverProps) {
    return (
        <section
            className={`cover${model.coverPhase === 'exiting' ? ' exiting' : ''}`}
            id="cover"
            ref={model.coverRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cover-title"
            aria-busy={model.coverPhase === 'exiting'}
            hidden={model.coverPhase === 'open'}
            onAnimationEnd={(event) => {
                if (
                    event.target === event.currentTarget &&
                    model.coverPhase === 'exiting'
                ) {
                    model.finishOpening();
                }
            }}
        >
            <div className="cover-paper">
                <InvitationDecor variant="cover" />
                <div className="cover-portrait">
                    <img
                        id="cover-portrait"
                        src={featuredPhotos.cover}
                        alt="Foto Mutiara dan Restu"
                        {...noTranslateProps()}
                        width="1243"
                        height="1266"
                        fetchPriority="high"
                        onLoad={dismissInvitationLoader}
                        onError={onImageError}
                    />
                </div>

                <div className="cover-copy">
                    <p className="reference-kicker" data-reveal="down">
                        THE WEDDING OF
                    </p>
                    <ProtectedText
                        as="h1"
                        className="cover-title"
                        id="cover-title"
                        data-reveal="up"
                    >
                        {invitation.bride.short} <span>&amp;</span>{' '}
                        {invitation.groom.short}
                    </ProtectedText>
                    <div className="guest">
                        <div data-reveal="up">
                            <p>Kepada Yth.</p>
                            <p>Bapak/Ibu/Saudara/i</p>
                        </div>
                        <ProtectedText
                            as="strong"
                            id="guest-name"
                            data-reveal="up"
                        >
                            {guestName}
                        </ProtectedText>
                    </div>
                    <p className="cover-note" data-reveal="up">
                        *Mohon maaf jika ada kesalahan dalam penulisan nama /
                        gelar.
                    </p>
                    <button
                        className="reference-button"
                        id="open-invitation"
                        data-reveal="zoom"
                        type="button"
                        ref={model.openButtonRef}
                        disabled={model.coverPhase !== 'closed'}
                        onClick={model.openInvitation}
                    >
                        <svg className="icon" aria-hidden="true">
                            <use href="#i-book" />
                        </svg>
                        Buka Undangan
                    </button>
                </div>
            </div>
        </section>
    );
}
