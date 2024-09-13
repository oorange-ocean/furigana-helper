import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import { LyricLine } from '@/components/lyric-line';
import { LyricLineMeasure } from '@/components/lyric-line-measure';
import type { Lyric } from '@/types/lyrics';
import { timeToSeconds } from '@/utils/time-utils';

interface LyricsScrollViewProps {
  lyrics: Lyric[];
  progress: { position: number };
  isLyricHeightMeasured: boolean;
  setIsLyricHeightMeasured: (value: boolean) => void;
}

export function LyricsScrollView({ 
  lyrics, 
  progress, 
  isLyricHeightMeasured, 
  setIsLyricHeightMeasured 
}: LyricsScrollViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [lyricLineHeight, setLyricLineHeight] = useState(0);

  const handleLyricLineMeasure = (height: number) => {
    setLyricLineHeight(height);
    setIsLyricHeightMeasured(true);
  };

  const scrollToActiveLyric = useCallback((index: number) => {
    if (scrollViewRef.current && lyricLineHeight > 0) {
      // 将活跃歌词行滚动到顶部，并留出一些额外空间
      const extraSpace = 20; // 可以根据需要调整这个值
      const scrollToY = Math.max(0, index * lyricLineHeight - extraSpace);
      scrollViewRef.current.scrollTo({ y: scrollToY, animated: true });
    }
  }, [lyricLineHeight]);

  useEffect(() => {
    const activeLyricIndex = lyrics.findIndex((lyric, index) => {
      const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
      const nextLyricTimeSeconds = index < lyrics.length - 1 
        ? timeToSeconds(lyrics[index + 1].timestamp) 
        : Infinity;
      return progress.position >= lyricTimeSeconds && progress.position < nextLyricTimeSeconds;
    });

    if (activeLyricIndex !== -1) {
      scrollToActiveLyric(activeLyricIndex);
    }
  }, [progress.position, lyrics, scrollToActiveLyric]);

  if (!isLyricHeightMeasured) {
    return <LyricLineMeasure onMeasure={handleLyricLineMeasure} />;
  }

  return (
    <ScrollView 
      ref={scrollViewRef} 
      className="mt-4 px-4"
    >
      {lyrics.map((lyric, index) => {
        const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
        const nextLyricTimeSeconds = index < lyrics.length - 1 
          ? timeToSeconds(lyrics[index + 1].timestamp) 
          : Infinity;
        
        const isActive = progress.position >= lyricTimeSeconds && 
                         progress.position < nextLyricTimeSeconds;
        
        return (
          <LyricLine 
            key={index}
            lyric={lyric} 
            isActive={isActive}
            currentTime={progress.position}
          />
        );
      })}
    </ScrollView>
  );
}