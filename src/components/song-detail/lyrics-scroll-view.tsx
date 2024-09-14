import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useProgress } from 'react-native-track-player';

import { LyricLine } from '@/components/lyric-line';
import { LyricLineMeasure } from '@/components/lyric-line-measure';
import { useSongStore } from '@/store/use-song-store';
import { timeToSeconds } from '@/utils/time-utils';

interface LyricsScrollViewProps {
  isLyricHeightMeasured: boolean;
  setIsLyricHeightMeasured: (value: boolean) => void;
}

export function LyricsScrollView({ 
  isLyricHeightMeasured, 
  setIsLyricHeightMeasured 
}: LyricsScrollViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [lyricLineHeight, setLyricLineHeight] = useState(0);
  const currentSong = useSongStore(state => state.currentSong);
  const progress = useProgress();

  const handleLyricLineMeasure = (height: number) => {
    setLyricLineHeight(height);
    setIsLyricHeightMeasured(true);
  };

  const scrollToActiveLyric = useCallback((index: number) => {
    if (scrollViewRef.current && lyricLineHeight > 0) {
      const extraSpace = 20;
      const scrollToY = Math.max(0, index * lyricLineHeight - extraSpace);
      scrollViewRef.current.scrollTo({ y: scrollToY, animated: true });
    }
  }, [lyricLineHeight]);

  useEffect(() => {
    if (currentSong) {
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
  }, [progress.position, currentSong, scrollToActiveLyric]);

  if (!isLyricHeightMeasured) {
    return <LyricLineMeasure onMeasure={handleLyricLineMeasure} />;
  }

  if (!currentSong) return null;

  return (
    <ScrollView 
      ref={scrollViewRef} 
      className="mt-4 px-4"
    >
      {currentSong.lyrics.map((lyric, index) => {
        const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
        const nextLyricTimeSeconds = index < currentSong.lyrics.length - 1 
          ? timeToSeconds(currentSong.lyrics[index + 1].timestamp) 
          : Infinity;
        
        const adjustedPosition = progress.position - (currentSong.lyricsDelay || 0);
        const isActive = adjustedPosition >= lyricTimeSeconds && 
                         adjustedPosition < nextLyricTimeSeconds;
        
        return (
          <LyricLine 
            key={index}
            lyric={lyric} 
            isActive={isActive}
            currentTime={adjustedPosition}
          />
        );
      })}
    </ScrollView>
  );
}