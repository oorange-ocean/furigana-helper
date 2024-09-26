import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useProgress } from 'react-native-track-player';

import { LyricLine } from '@/components/lyric-line';
// import { useLyricHeight } from '@/hooks/use-lyric-height';
import { type Song } from '@/types/lyrics';
import { timeToSeconds } from '@/utils/time-utils';
interface LyricsScrollViewProps {
  isAutoScrollEnabled: boolean;
  song: Song;
}

export function LyricsScrollView({ isAutoScrollEnabled, song }: LyricsScrollViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const progress = useProgress();
  const lyricLineHeight = 79.63636016845703

  const scrollToActiveLyric = useCallback((index: number) => {
    if (scrollViewRef.current && lyricLineHeight > 0 && isAutoScrollEnabled) {
      const scrollToY = Math.max(0, (index-1) * lyricLineHeight);
      scrollViewRef.current.scrollTo({ y: scrollToY, animated: true });
    }
  }, [isAutoScrollEnabled, lyricLineHeight]);

  useEffect(() => {
    if (song && isAutoScrollEnabled) {
      const adjustedPosition = progress.position - (song.lyricsDelay || 0);
      const activeLyricIndex = song.lyrics.findIndex((lyric, index) => {
        const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
        const nextLyricTimeSeconds = index < song.lyrics.length - 1 
          ? timeToSeconds(song.lyrics[index + 1].timestamp) 
          : Infinity;
        return adjustedPosition >= lyricTimeSeconds && adjustedPosition < nextLyricTimeSeconds;
      });

      if (activeLyricIndex !== -1) {
        scrollToActiveLyric(activeLyricIndex);
      }
    }
  }, [progress.position, song, scrollToActiveLyric, isAutoScrollEnabled]);

  const lyricLines = useMemo(() => {
    if (!song) return null;

    return song.lyrics.map((lyric, index) => {
      let isActive = false;
      if (isAutoScrollEnabled) {
        const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
        const nextLyricTimeSeconds = index < song.lyrics.length - 1 
          ? timeToSeconds(song.lyrics[index + 1].timestamp) 
          : Infinity;
        
        const adjustedPosition = progress.position - (song.lyricsDelay || 0);
        isActive = adjustedPosition >= lyricTimeSeconds && 
                   adjustedPosition < nextLyricTimeSeconds;
      }
      
      return (
        <LyricLine 
          key={index}
          lyric={lyric} 
          isActive={isActive}
          currentTime={progress.position - (song.lyricsDelay || 0)}
        />
      );
    });
  }, [song, isAutoScrollEnabled, progress.position]);

  if (!song) return null;

  return (
    <ScrollView 
      ref={scrollViewRef} 
      className="mt-4 px-4"
      scrollEnabled={!isAutoScrollEnabled}
    >
      {lyricLines}
      <View style={{ height: lyricLineHeight * 5 }} />
    </ScrollView>
  );
}