import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import { useProgress } from 'react-native-track-player';

import LyricLine from '@/components/lyric-line';
import { type Lyric,type Song } from '@/types/lyrics';
import { timeToSeconds } from '@/utils/time-utils';

interface LyricsScrollViewProps {
  isAutoScrollEnabled: boolean;
  song: Song;
}

const ITEM_HEIGHT = 79.63636016845703;

const LyricItem = React.memo(({ item, currentTime, isActive, songId, lyricIndex }: 
  { item: Lyric; currentTime: number; isActive: boolean; songId: string; lyricIndex: number }) => (
  <LyricLine 
    lyric={item} 
    isActive={isActive}
    currentTime={currentTime}
    songId={songId}
    lyricIndex={lyricIndex}
  />
));

export function LyricsScrollView({ isAutoScrollEnabled, song }: LyricsScrollViewProps) {
  const flatListRef = useRef<FlatList<Lyric>>(null);
  const progress = useProgress();

  const scrollToActiveLyric = useCallback((index: number) => {
    if (flatListRef.current && isAutoScrollEnabled) {
      flatListRef.current.scrollToIndex({ index: Math.max(0, index - 1), animated: true });
    }
  }, [isAutoScrollEnabled]);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const renderItem = useCallback(({ item, index }: { item: Lyric; index: number }) => {
    const adjustedPosition = progress.position - (song.lyricsDelay || 0);
    const lyricTimeSeconds = timeToSeconds(item.timestamp);
    const nextLyricTimeSeconds = index < song.lyrics.length - 1 
      ? timeToSeconds(song.lyrics[index + 1].timestamp) 
      : Infinity;
    const isActive = adjustedPosition >= lyricTimeSeconds && adjustedPosition < nextLyricTimeSeconds;

    return (
      <LyricItem 
        item={item}
        currentTime={adjustedPosition}
        isActive={isActive}
        songId={song.id!}
        lyricIndex={index}
      />
    );
  }, [progress.position, song.lyricsDelay, song.lyrics]);

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

  if (!song) return null;

  return (
    <FlatList
      ref={flatListRef}
      data={song.lyrics}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={21}
      removeClippedSubviews={true}
      scrollEnabled={!isAutoScrollEnabled}
      contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 16, paddingBottom: ITEM_HEIGHT * 5 }}
    />
  );
}