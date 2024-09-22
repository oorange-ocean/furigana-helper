import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { useSong } from '@/api';
import { LyricsScrollView } from '@/components/song-detail/lyrics-scroll-view';
import { SongBottom } from '@/components/song-detail/song-bottom';
import { SongHeader } from '@/components/song-header';
import { SongOptionsModal } from '@/modals/song-options-modal';
import {
  useCurrentSong,
  useIsPlaying,
  useSetCurrentSong,
  useSetIsPlaying,
  useSongList} from '@/store/use-song-store';
import { ActivityIndicator, View } from '@/ui';
import { Text } from '@/ui/text';

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLyricHeightMeasured, setIsLyricHeightMeasured] = useState(false);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(false);

  const currentSong = useCurrentSong();
  const isPlaying = useIsPlaying();
  const songList = useSongList();
  const setCurrentSong = useSetCurrentSong();
  const setIsPlaying = useSetIsPlaying();

  const { isLoading, error } = useSong(id);

  const toggleAutoScroll = () => {
    setIsAutoScrollEnabled(!isAutoScrollEnabled);
  };

  useEffect(() => {
    if (id) {
      const song = songList.find(s => s.id === id);
      if (song) {
        setCurrentSong(song);
      }
    }
  }, [id, songList, setCurrentSong]);

  useEffect(() => {
    setIsPlaying(isPlaying);
  }, [isPlaying, setIsPlaying]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !currentSong) {
    return <Text>加载歌曲时出错</Text>;
  }

  return (
    <View className="flex-1">
      <SongHeader />
      <LyricsScrollView
        isLyricHeightMeasured={isLyricHeightMeasured}
        setIsLyricHeightMeasured={setIsLyricHeightMeasured}
        isAutoScrollEnabled={isAutoScrollEnabled}
      />
      <View className="p-4">
        <SongBottom
          isAutoScrollEnabled={isAutoScrollEnabled}
          toggleAutoScroll={toggleAutoScroll}
        />
      </View>
      <SongOptionsModal />
    </View>
  );
}