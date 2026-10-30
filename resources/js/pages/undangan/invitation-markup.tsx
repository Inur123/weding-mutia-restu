import {
    type ReactNode,
    type SyntheticEvent,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { noTranslateProps, ProtectedText } from '@/components/protected-text';
import {
    attendanceLabels,
    featuredPhotos,
    formatAccountNumber,
    formatWeddingDate,
    invitation,
    loveStory,
    type Wish,
} from './invitation-data';
import { InvitationCover } from './invitation-cover';
import { InvitationDecor, PortraitFlowers } from './invitation-decor';
import { InvitationSymbols } from './invitation-symbols';
import type { useInvitation } from './use-invitation';

function useJpegFallback(event: SyntheticEvent<HTMLImageElement>): void {
    const image = event.currentTarget;
    const source = image.getAttribute('src');

    if (source?.endsWith('.webp')) {
        image.src = `${source.slice(0, -5)}.jpeg`;
    }
}

function WishCard({ wish }: { wish: Wish }) {
    const messageId = useId();
    const messageRef = useRef<HTMLParagraphElement>(null);
    const [showMore, setShowMore] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useLayoutEffect(() => {
        const message = messageRef.current;
        if (!message) return;

        const measure = () => {
            if (!isExpanded) {
                setShowMore(message.scrollHeight > message.clientHeight + 1);
            }
        };

        measure();
        const observer =
            'ResizeObserver' in window ? new ResizeObserver(measure) : null;
        observer?.observe(message);
        window.addEventListener('resize', measure, { passive: true });

        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [isExpanded, wish.message]);

    return (
        <article className="wish">
            <ProtectedText className="wish-avatar" aria-hidden="true">
                {Array.from(wish.name)[0]?.toUpperCase() || 'T'}
            </ProtectedText>
            <div className="wish-card">
                <ProtectedText as="strong" className="wish-author">
                    {wish.name}
                </ProtectedText>
                <span className="wish-badge">
                    {attendanceLabels[wish.attendance]}
                </span>
                <p
                    className={`wish-message${isExpanded ? ' is-expanded' : ''}`}
                    id={messageId}
                    ref={messageRef}
                >
                    {wish.message}
                </p>
                <button
                    className="wish-more"
                    type="button"
                    hidden={!showMore}
                    aria-expanded={isExpanded}
                    aria-controls={messageId}
                    onClick={() => setIsExpanded((expanded) => !expanded)}
                >
                    {isExpanded ? 'Tutup' : 'Baca lengkap'}
                </button>
            </div>
        </article>
    );
}

function DateHeading() {
    return (
        <div className="reference-date">
            <span>{formatWeddingDate({ weekday: 'long' })}</span>
            <strong>
                {formatWeddingDate({ day: '2-digit' })}
                <small>{formatWeddingDate({ year: 'numeric' })}</small>
            </strong>
            <span>{formatWeddingDate({ month: 'long' })}</span>
        </div>
    );
}

function GiftAccountCard({
    account,
    onCopy,
}: {
    account: { bank: string; number: string; holder: string };
    onCopy: () => void;
}) {
    const headingId = useId();
    const noticeId = useId();
    const accountNumber = formatAccountNumber(account.number);
    const isComplete = Boolean(
        account.bank.trim() && accountNumber && account.holder.trim(),
    );

    return (
        <article
            className="gift-account"
            data-reveal="up"
            aria-labelledby={headingId}
        >
            <header className="gift-account__header">
                <span>Transfer Bank</span>
                <ProtectedText as="h3" id={headingId}>
                    {account.bank || 'Nama bank belum diisi'}
                </ProtectedText>
            </header>
            <dl className="gift-account__details">
                <div>
                    <dt>Nomor rekening</dt>
                    {accountNumber ? (
                        <ProtectedText as="dd" className="gift-account__number">
                            {accountNumber}
                        </ProtectedText>
                    ) : (
                        <dd className="gift-account__placeholder">
                            Rekening belum tersedia
                        </dd>
                    )}
                </div>
                <div>
                    <dt>Atas nama</dt>
                    {account.holder ? (
                        <ProtectedText as="dd">{account.holder}</ProtectedText>
                    ) : (
                        <dd>Nama pemilik belum diisi</dd>
                    )}
                </div>
            </dl>
            <button
                className="reference-button gift-account__copy"
                type="button"
                disabled={!isComplete}
                aria-describedby={!isComplete ? noticeId : undefined}
                aria-label={
                    isComplete
                        ? `Salin nomor rekening ${account.bank}`
                        : 'Salin nomor rekening'
                }
                onClick={onCopy}
            >
                <svg className="icon" aria-hidden="true">
                    <use href="#i-copy" />
                </svg>
                Salin Nomor Rekening
            </button>
            {!isComplete && (
                <p className="gift-account__notice" id={noticeId}>
                    Informasi rekening dapat ditanyakan langsung kepada
                    pengantin.
                </p>
            )}
        </article>
    );
}

function EventCard({
    title,
    time,
    mapUrl,
}: {
    title: string;
    time: string;
    mapUrl: string;
}) {
    return (
        <article className="reference-event-card" data-reveal="up">
            <h3>{title}</h3>
            <DateHeading />
            <p className="event-time">{time}</p>
            <div className="event-location">
                <span>Lokasi Acara</span>
                <ProtectedText as="p">{invitation.address}</ProtectedText>
            </div>
            <a
                className="reference-button reference-button--small"
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
            >
                <svg className="icon" aria-hidden="true">
                    <use href="#i-location" />
                </svg>
                Google Maps
            </a>
        </article>
    );
}

function DesktopStage() {
    return (
        <aside className="desktop-stage" aria-hidden="true">
            <InvitationDecor variant="hero" />
            <div>
                <p data-reveal="down">THE WEDDING OF</p>
                <ProtectedText as="h2" data-reveal="zoom">
                    {invitation.bride.short} <span>&amp;</span>{' '}
                    {invitation.groom.short}
                </ProtectedText>
                <p data-reveal="zoom">
                    {formatWeddingDate({
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>
            </div>
            <span className="desktop-scroll">scroll ↓</span>
        </aside>
    );
}

export function InvitationMarkup({
    guestName,
    model,
}: {
    guestName: string;
    model: ReturnType<typeof useInvitation>;
}): ReactNode {
    const mapUrl = invitation.mapsUrl;

    return (
        <>
            <InvitationSymbols />
            <DesktopStage />
            <InvitationCover
                guestName={guestName}
                model={model}
                onImageError={useJpegFallback}
            />

            <main
                className={`page${model.coverPhase === 'open' ? ' is-open' : ''}`}
                id="invitation"
                hidden={model.coverPhase === 'closed'}
                inert={model.coverPhase !== 'open'}
                aria-hidden={model.coverPhase !== 'open'}
            >
                <section className="reference-hero" id="beranda">
                    <InvitationDecor variant="hero" />
                    <div className="hero-inner">
                        <p
                            className="reference-kicker"
                            data-reveal="down"
                            data-reveal-delay="400"
                        >
                            THE WEDDING OF
                        </p>
                        <div className="hero-portrait">
                            <PortraitFlowers />
                            <div
                                className="hero-arch"
                                data-reveal="zoom"
                                data-reveal-delay="1000"
                            >
                                <img
                                    src={featuredPhotos.heroMain}
                                    alt="Foto Mutiara dan Restu"
                                    {...noTranslateProps()}
                                    width="1243"
                                    height="1266"
                                    onError={useJpegFallback}
                                />
                            </div>
                        </div>
                        <ProtectedText
                            as="h1"
                            ref={model.mainTitleRef}
                            tabIndex={-1}
                            data-reveal="up"
                            data-reveal-delay="800"
                        >
                            {invitation.bride.short} <span>&amp;</span>{' '}
                            {invitation.groom.short}
                        </ProtectedText>
                        <p
                            className="hero-date-line"
                            data-reveal="up"
                            data-reveal-delay="1000"
                        >
                            {formatWeddingDate({
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                        <div
                            className="countdown"
                            data-reveal="up"
                            data-reveal-delay="1200"
                            aria-label="Hitung mundur menuju hari pernikahan"
                        >
                            {[
                                ['Hari', model.countdown.days],
                                ['Jam', model.countdown.hours],
                                ['Menit', model.countdown.minutes],
                                ['Detik', model.countdown.seconds],
                            ].map(([label, value]) => (
                                <span key={label}>
                                    <strong>{value}</strong>
                                    <small>{label}</small>
                                </span>
                            ))}
                        </div>
                        <button
                            className="reference-button"
                            type="button"
                            onClick={model.saveDate}
                            data-reveal="up"
                            data-reveal-delay="1400"
                        >
                            <svg className="icon" aria-hidden="true">
                                <use href="#i-calendar" />
                            </svg>
                            Simpan Tanggal
                        </button>
                        <a
                            className="hero-scroll"
                            href="#mempelai"
                            aria-label="Ke bagian mempelai"
                            data-reveal="down"
                            data-reveal-delay="1600"
                            data-motion
                        >
                            <span>↓</span>
                        </a>
                    </div>
                </section>

                <section className="reference-quote">
                    <blockquote>
                        <p data-reveal="zoom">
                            “Dan di antara tanda-tanda kebesaran-Nya ialah Dia
                            menciptakan pasangan-pasangan untukmu dari jenismu
                            sendiri, agar kamu cenderung dan merasa tenteram
                            kepadanya, dan Dia menjadikan di antaramu rasa kasih
                            dan sayang.”
                        </p>
                        <cite data-reveal="up">Q.S Ar-Rum : 21</cite>
                    </blockquote>
                </section>

                <section
                    className="reference-couple"
                    id="mempelai"
                    aria-labelledby="couple-title"
                >
                    <InvitationDecor />
                    <div className="couple-panel" data-reveal="fade">
                        <div className="couple-greeting" data-reveal="down">
                            <h2 id="couple-title">
                                Assalamu’alaikum Warahmatullahi Wabarakatuh
                            </h2>
                            <p>
                                Maha Suci Allah yang telah menciptakan
                                makhluk-Nya berpasang-pasangan. Ya Allah semoga
                                ridho-Mu tercurah mengiringi pernikahan kami.
                            </p>
                        </div>

                        <article className="person-profile">
                            <div
                                className="person-arch person-arch--bride"
                                data-reveal="zoom"
                            >
                                <img
                                    src={featuredPhotos.bride}
                                    alt="Foto Mutiara"
                                    {...noTranslateProps()}
                                    width="1024"
                                    height="1536"
                                    onError={useJpegFallback}
                                />
                            </div>
                            <ProtectedText as="h3" data-reveal="up">
                                {invitation.bride.full}
                            </ProtectedText>
                            <p data-reveal="up">
                                Putri {invitation.bride.childOrder} dari
                            </p>
                            <ProtectedText as="strong" data-reveal="up">
                                {invitation.bride.parents}
                            </ProtectedText>
                        </article>

                        <div
                            className="couple-ampersand"
                            aria-hidden="true"
                            data-reveal="zoom"
                        >
                            &amp;
                        </div>

                        <article className="person-profile">
                            <div
                                className="person-arch person-arch--groom"
                                data-reveal="zoom"
                            >
                                <img
                                    src={featuredPhotos.groom}
                                    alt="Foto Restu"
                                    {...noTranslateProps()}
                                    width="1024"
                                    height="1536"
                                    onError={useJpegFallback}
                                />
                            </div>
                            <ProtectedText as="h3" data-reveal="up">
                                {invitation.groom.full}
                            </ProtectedText>
                            <p data-reveal="up">
                                Putra {invitation.groom.childOrder} dari
                            </p>
                            <ProtectedText as="strong" data-reveal="up">
                                {invitation.groom.parents}
                            </ProtectedText>
                        </article>
                    </div>
                </section>

                <section
                    className="reference-events"
                    id="acara"
                    aria-label="Rangkaian acara"
                >
                    <InvitationDecor variant="brown" />
                    <div className="event-stack" data-reveal="fade">
                        <EventCard
                            title="Akad Nikah"
                            time={invitation.akadTime}
                            mapUrl={mapUrl}
                        />
                        <EventCard
                            title="Resepsi"
                            time={invitation.receptionTime}
                            mapUrl={mapUrl}
                        />
                    </div>
                </section>

                <section
                    className="reference-story"
                    aria-labelledby="story-title"
                >
                    <InvitationDecor />
                    <div className="story-panel" data-reveal="fade">
                        <h2 id="story-title" data-reveal="down">
                            Love Story
                        </h2>
                        <div className="story-timeline">
                            {loveStory.map((story) => (
                                <article key={story.date}>
                                    <span aria-hidden="true">♥</span>
                                    <div
                                        data-reveal="story"
                                        data-reveal-duration="1000"
                                    >
                                        <h3>
                                            {story.date} · {story.title}
                                        </h3>
                                        <p>{story.story}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    className="reference-gift"
                    id="hadiah"
                    aria-labelledby="gift-title"
                >
                    <InvitationDecor variant="brown" />
                    <div className="gift-intro" data-reveal="fade">
                        <h2 id="gift-title" data-reveal="down">
                            Wedding Gift
                        </h2>
                        <p data-reveal="up">
                            Doa restu Anda merupakan karunia yang sangat berarti
                            bagi kami.
                        </p>
                        <p data-reveal="up">
                            Jika memberi adalah ungkapan tanda kasih, Anda dapat
                            memberikannya melalui informasi di bawah ini.
                        </p>
                    </div>
                    <div className="gift-accounts">
                        {invitation.gifts.map((account, index) => (
                            <GiftAccountCard
                                account={account}
                                key={`${account.bank}-${index}`}
                                onCopy={() => void model.copyGift(index)}
                            />
                        ))}
                    </div>
                    <div className="gift-delivery" data-reveal="up">
                        <h3>Alamat Kirim Hadiah</h3>
                        <ProtectedText as="p">
                            {invitation.giftDeliveryAddress}
                        </ProtectedText>
                    </div>
                </section>

                <section
                    className="reference-rsvp"
                    id="ucapan"
                    aria-labelledby="wishes-title"
                >
                    <InvitationDecor />
                    <div className="rsvp-panel" data-reveal="fade">
                        <header className="reference-heading">
                            <h2 id="wishes-title" data-reveal="down">
                                Ucapan &amp; RSVP
                            </h2>
                            <p data-reveal="up">
                                Berikan doa dan ucapan terbaik untuk kami.
                            </p>
                        </header>

                        <form
                            className="wish-form"
                            data-reveal="up"
                            onSubmit={model.submitWish}
                        >
                            <label className="field" htmlFor="wish-name">
                                <span className="visually-hidden">
                                    Nama Anda
                                </span>
                                <input
                                    id="wish-name"
                                    name="name"
                                    autoComplete="name"
                                    value={model.form.data.name}
                                    onChange={(event) =>
                                        model.form.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Nama"
                                />
                            </label>
                            <label className="field" htmlFor="wish-message">
                                <span className="visually-hidden">
                                    Ucapan dan doa
                                </span>
                                <textarea
                                    id="wish-message"
                                    name="message"
                                    rows={4}
                                    maxLength={500}
                                    value={model.form.data.message}
                                    onChange={(event) =>
                                        model.form.setData(
                                            'message',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Ucapan"
                                />
                            </label>
                            <fieldset className="attendance-field">
                                <legend>Konfirmasi Kehadiran</legend>
                                <label>
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value="hadir"
                                        checked={
                                            model.form.data.attendance ===
                                            'hadir'
                                        }
                                        onChange={() =>
                                            model.form.setData(
                                                'attendance',
                                                'hadir',
                                            )
                                        }
                                    />
                                    <span>● Hadir</span>
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="attendance"
                                        value="tidak"
                                        checked={
                                            model.form.data.attendance ===
                                            'tidak'
                                        }
                                        onChange={() =>
                                            model.form.setData(
                                                'attendance',
                                                'tidak',
                                            )
                                        }
                                    />
                                    <span>● Tidak Hadir</span>
                                </label>
                            </fieldset>
                            <button
                                className="reference-button reference-button--wide"
                                type="submit"
                                disabled={model.form.processing}
                            >
                                {model.form.processing
                                    ? 'Menyimpan Ucapan'
                                    : 'Kirim Ucapan'}
                            </button>
                            <p
                                className="form-status"
                                role="status"
                                aria-live="polite"
                            >
                                {model.formStatus}
                            </p>
                        </form>

                        <div className="wish-book" data-reveal="up">
                            <p className="wish-total">
                                <ProtectedText>{model.wishTotal}</ProtectedText>{' '}
                                ucapan
                            </p>
                            <div
                                className="wish-list"
                                ref={model.wishListRef}
                                role="region"
                                aria-label="Daftar ucapan"
                                tabIndex={0}
                                onScroll={model.onWishListScroll}
                                style={{ maxHeight: model.wishListMaxHeight }}
                            >
                                {model.wishes.length ? (
                                    model.wishes.map((wish) => (
                                        <WishCard key={wish.id} wish={wish} />
                                    ))
                                ) : (
                                    <p className="empty-wishes">
                                        Belum ada ucapan. Jadilah orang pertama
                                        yang mengirimkan doa baik.
                                    </p>
                                )}
                                {model.wishesLoading && (
                                    <p
                                        className="wish-feed-status"
                                        role="status"
                                    >
                                        <span
                                            className="wish-feed-spinner"
                                            aria-hidden="true"
                                        />
                                        Memuat ucapan berikutnya...
                                    </p>
                                )}
                                {model.wishesError && (
                                    <div
                                        className="wish-feed-status"
                                        role="alert"
                                    >
                                        <span>{model.wishesError}</span>
                                        <button
                                            type="button"
                                            onClick={model.loadMoreWishes}
                                        >
                                            Coba lagi
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="reference-closing">
                    <InvitationDecor />
                    <div className="closing-panel" data-reveal="fade">
                        <p data-reveal="up">
                            Merupakan suatu kehormatan dan kebahagiaan bagi kami
                            apabila Bapak/Ibu/Saudara/i berkenan hadir dan
                            memberikan doa restu.
                        </p>
                        <p data-reveal="down">
                            Terima kasih atas doa dan kehadiran Anda.
                        </p>
                        <strong data-reveal="up">
                            Wassalamu’alaikum Warahmatullahi Wabarakatuh
                        </strong>
                        <ProtectedText as="h2" data-reveal="up">
                            {invitation.bride.short} <span>&amp;</span>{' '}
                            {invitation.groom.short}
                        </ProtectedText>
                        <strong data-reveal="up">
                            Beserta kedua keluarga besar
                        </strong>
                        <button type="button" onClick={model.backToCover}>
                            Kembali ke Sampul
                        </button>
                    </div>
                </footer>
            </main>

            <nav
                className="reference-nav"
                aria-label="Navigasi undangan"
                data-reveal="up"
                hidden={model.coverPhase !== 'open'}
            >
                {[
                    ['beranda', '#i-home', 'Beranda'],
                    ['mempelai', '#i-heart', 'Mempelai'],
                    ['acara', '#i-calendar', 'Acara'],
                    ['hadiah', '#i-gift', 'Hadiah'],
                    ['ucapan', '#i-message', 'Ucapan'],
                ].map(([id, icon, label]) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        aria-label={label}
                        aria-current={
                            model.activeSection === id ? 'location' : undefined
                        }
                        className={
                            model.activeSection === id ? 'active' : undefined
                        }
                    >
                        <svg className="icon" aria-hidden="true">
                            <use href={icon} />
                        </svg>
                        <span>{label}</span>
                    </a>
                ))}
            </nav>

            <button
                type="button"
                className="music-button"
                aria-label={
                    model.music.playing
                        ? 'Jeda musik undangan'
                        : 'Putar musik undangan'
                }
                aria-pressed={model.music.playing}
                hidden={model.coverPhase !== 'open'}
                disabled={model.music.starting}
                onClick={() => model.music.toggle()}
            >
                <svg className="icon" aria-hidden="true">
                    <use href={model.music.playing ? '#i-stop' : '#i-music'} />
                </svg>
            </button>

            <div className="toast" role="status" hidden={!model.toast}>
                {model.toast}
            </div>

            <noscript>
                <p className="noscript-note">
                    Aktifkan JavaScript di browser untuk membuka undangan.
                </p>
            </noscript>
        </>
    );
}
