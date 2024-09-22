import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useProgress } from 'react-native-track-player';

import { LyricLine } from '@/components/lyric-line';
import { LyricLineMeasure } from '@/components/lyric-line-measure';
import { useCurrentSong } from '@/store/use-song-store';
import { timeToSeconds } from '@/utils/time-utils';

interface LyricsScrollViewProps {
  isLyricHeightMeasured: boolean;
  setIsLyricHeightMeasured: (value: boolean) => void;
  isAutoScrollEnabled: boolean;
}

export function LyricsScrollView({ 
  isLyricHeightMeasured, 
  setIsLyricHeightMeasured,
  isAutoScrollEnabled
}: LyricsScrollViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const lyricLineHeightRef = useRef(0);
  const currentSong = useCurrentSong();
  const progress = useProgress();

  const handleLyricLineMeasure = useCallback((height: number) => {
    lyricLineHeightRef.current = height;
    setIsLyricHeightMeasured(true);
  }, [setIsLyricHeightMeasured]);

  const scrollToActiveLyric = useCallback((index: number) => {
    if (scrollViewRef.current && lyricLineHeightRef.current > 0 && isAutoScrollEnabled) {
      const scrollToY = Math.max(0, (index-1) * lyricLineHeightRef.current);
      scrollViewRef.current.scrollTo({ y: scrollToY, animated: true });
    }
  }, [isAutoScrollEnabled]);

  useEffect(() => {
    if (currentSong && isAutoScrollEnabled) {
      const adjustedPosition = progress.position - (currentSong.lyricsDelay || 0);
      const activeLyricIndex = currentSong.lyrics.findIndex((lyric, index) => {
        const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
        const nextLyricTimeSeconds = index < currentSong.lyrics.length - 1 
          ? timeToSeconds(currentSong.lyrics[index + 1].timestamp) 
          : Infinity;
        return adjustedPosition >= lyricTimeSeconds && adjustedPosition < nextLyricTimeSeconds;
      });

      if (activeLyricIndex !== -1) {
        scrollToActiveLyric(activeLyricIndex);
      }
    }
  }, [progress.position, currentSong, scrollToActiveLyric, isAutoScrollEnabled]);

  const lyricLines = useMemo(() => {
    if (!currentSong) return null;

    return currentSong.lyrics.map((lyric, index) => {
      let isActive = false;
      if (isAutoScrollEnabled) {
        const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
        const nextLyricTimeSeconds = index < currentSong.lyrics.length - 1 
          ? timeToSeconds(currentSong.lyrics[index + 1].timestamp) 
          : Infinity;
        
        const adjustedPosition = progress.position - (currentSong.lyricsDelay || 0);
        isActive = adjustedPosition >= lyricTimeSeconds && 
                   adjustedPosition < nextLyricTimeSeconds;
      }
      
      return (
        <LyricLine 
          key={index}
          lyric={lyric} 
          isActive={isActive}
          currentTime={progress.position - (currentSong.lyricsDelay || 0)}
        />
      );
    });
  }, [currentSong, isAutoScrollEnabled, progress.position]);

  if (!isLyricHeightMeasured) {
    return <LyricLineMeasure onMeasure={handleLyricLineMeasure} />;
  }

  if (!currentSong) return null;

  return (
    <ScrollView 
      ref={scrollViewRef} 
      className="mt-4 px-4"
      scrollEnabled={!isAutoScrollEnabled}
    >
      {lyricLines}
      <View style={{ height: lyricLineHeightRef.current * 5 }} />
    </ScrollView>
  );
}