import { useCallback, useEffect, useRef, useState } from 'react';
import invitationMusicSource from '../../../audio/musik-weding.mp3';

export function useInvitationMusic(onError: (message: string) => void) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [starting, setStarting] = useState(false);
    const [progress, setProgress] = useState(0);
    const startingRef = useRef(false);

    const stop = useCallback(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
        }
        startingRef.current = false;
        setPlaying(false);
        setStarting(false);
    }, []);

    const start = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio || startingRef.current || !audio.paused) {
            return;
        }

        startingRef.current = true;
        setStarting(true);

        try {
            const playResult = audio.play();
            if (playResult !== undefined) {
                await playResult;
            }
            setPlaying(true);
        } catch {
            audio.pause();
            setPlaying(false);
            onError(
                'Musik belum bisa diputar. Ketuk tombol musik untuk mencoba lagi.',
            );
        } finally {
            startingRef.current = false;
            setStarting(false);
        }
    }, [onError]);

    useEffect(() => {
        const audio = new Audio(invitationMusicSource);
        audio.loop = true;
        audio.preload = 'none';
        audio.volume = 0.55;

        const handlePlay = () => setPlaying(true);
        const handlePause = () => setPlaying(false);
        const handleTimeUpdate = () => {
            const duration = audio.duration;
            setProgress(
                Number.isFinite(duration) && duration > 0
                    ? Math.min(audio.currentTime / duration, 1)
                    : 0,
            );
        };
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleTimeUpdate);
        audioRef.current = audio;

        const stopWhenHidden = () => {
            if (document.hidden) {
                stop();
            }
        };

        document.addEventListener('visibilitychange', stopWhenHidden);
        window.addEventListener('pagehide', stop);

        return () => {
            document.removeEventListener('visibilitychange', stopWhenHidden);
            window.removeEventListener('pagehide', stop);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleTimeUpdate);
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
            audioRef.current = null;
        };
    }, [stop]);

    return {
        playing,
        starting,
        progress,
        start,
        stop,
        toggle: playing ? stop : start,
    };
}
