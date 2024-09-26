import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { useSong } from '@/api/songs';
import { LyricsScrollView } from '@/components/song-detail/lyrics-scroll-view';
import { SongBottom } from '@/components/song-detail/song-bottom';
import { SongHeader } from '@/components/song-header';
import { SongOptionsModal } from '@/modals/song-options-modal';
import { useSetCurrentSong } from '@/store/use-song-store';
import { type Song } from '@/types/lyrics';
import { ActivityIndicator, Text,View } from '@/ui';

const LoadingIndicator = () => (
  <View className="flex-1 items-center justify-center">
    <ActivityIndicator size="large" />
    <Text className="mt-2">加载中...</Text>
  </View>
);

export default function SongDetail() {
  const setCurrentSong = useSetCurrentSong();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: song } = useSong(id);
  const [isLoading, setIsLoading] = useState(true);

  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);
  const toggleAutoScroll = () => {
    setIsAutoScrollEnabled(!isAutoScrollEnabled);
  };

  useEffect(() => {
    if (song) {
      setCurrentSong(song as Song);
      setIsLoading(false);
    }
  }, [id, setCurrentSong, song]);


  return (
    <>
      {isLoading ? <LoadingIndicator /> : (
            <View className="flex-1">
            <SongHeader />
            <LyricsScrollView isAutoScrollEnabled={isAutoScrollEnabled} song={song as Song} />
            <View className="p-4">
              <SongBottom
                isAutoScrollEnabled={isAutoScrollEnabled}
                toggleAutoScroll={toggleAutoScroll}
              />
            </View>
            <SongOptionsModal />
          </View>
        )}
    </>
  );
}