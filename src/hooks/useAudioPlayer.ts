/**
 * Audio engine: HTMLAudioElement lifecycle, ayah queue and playback controls.
 */

import { useEffect, useRef, useState } from 'react';
import { SurahDetail } from '../types';
import { buildAudioUrl } from '../services/quranApi';

interface AudioPlayerOptions {
  surahNum: number;
  surah: SurahDetail | null;
  reciterCode: string;
  onGoToSurah: (num: number) => void;
}

export function useAudioPlayer({ surahNum, surah, reciterCode, onGoToSurah }: AudioPlayerOptions) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingSurahNum, setPlayingSurahNum] = useState<number | null>(null);
  const [playingAyahNum, setPlayingAyahNum] = useState<number | null>(null);
  const [volume, setVolume] = useState<number>(0.85);
  const [autoPlayNext, setAutoPlayNext] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Instantiate HTML Audio Element once on mount
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep event handlers in sync with the current playback queue
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!autoPlayNext || !surah || !playingAyahNum) {
        setIsPlaying(false);
        return;
      }

      const hasNextAyah = surah.ayat.some((a) => a.nomorAyat === playingAyahNum + 1);
      if (hasNextAyah) {
        setPlayingAyahNum(playingAyahNum + 1);
      } else if (surahNum + 1 <= 114) {
        // Proceed to the next surah
        onGoToSurah(surahNum + 1);
        setPlayingSurahNum(surahNum + 1);
        setPlayingAyahNum(1);
      } else {
        setIsPlaying(false);
        setPlayingAyahNum(null);
      }
    };

    const handleError = () => {
      console.error('Audio streaming error event');
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playingAyahNum, playingSurahNum, autoPlayNext, surah, surahNum, onGoToSurah]);

  // Apply volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play/pause trigger synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      if (!playingSurahNum || !playingAyahNum) {
        setIsPlaying(false);
        return;
      }
      const srcUrl = buildAudioUrl({
        surahNum: playingSurahNum,
        ayahNum: playingAyahNum,
        reciterCode,
        surahDetail: surah,
      });
      if (audio.src !== srcUrl) {
        audio.src = srcUrl;
      }
      audio.play().catch((err) => {
        console.warn('Audio playback interrupted', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, playingAyahNum, playingSurahNum, reciterCode]);

  // Play a specific ayah of the current surah (toggle when already playing it)
  const playAyah = (ayahNum: number) => {
    if (playingSurahNum === surahNum && playingAyahNum === ayahNum) {
      setIsPlaying((p) => !p);
    } else {
      setPlayingSurahNum(surahNum);
      setPlayingAyahNum(ayahNum);
      setIsPlaying(true);
    }
  };

  // Bottom bar play/pause: starts from the first ayah when nothing is queued
  const togglePlayPause = () => {
    if (!playingSurahNum || !playingAyahNum) {
      setPlayingSurahNum(surahNum);
      setPlayingAyahNum(1);
    }
    setIsPlaying((p) => !p);
  };

  const skipNext = () => {
    const maxAyahNum = surah?.jumlahAyat || 1;
    if (playingAyahNum && playingAyahNum < maxAyahNum) {
      setPlayingAyahNum(playingAyahNum + 1);
    }
  };

  const skipPrev = () => {
    if (playingAyahNum && playingAyahNum > 1) {
      setPlayingAyahNum(playingAyahNum - 1);
    }
  };

  return {
    isPlaying,
    playingSurahNum,
    playingAyahNum,
    volume,
    autoPlayNext,
    setVolume,
    setAutoPlayNext,
    playAyah,
    togglePlayPause,
    skipNext,
    skipPrev,
  };
}
