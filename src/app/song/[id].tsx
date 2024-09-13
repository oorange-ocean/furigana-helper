import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

import { useSong } from '@/api';
import { LyricsScrollView } from '@/components/song-detail/lyrics-scroll-view';
import { SongBottom } from '@/components/song-detail/song-bottom';
import { SongHeader } from '@/components/song-header';
import { useSongAudio } from '@/hooks/use-song-audio';
import { ActivityIndicator, View } from '@/ui';
import { Text } from '@/ui/text';

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: song, isLoading, error } = useSong(id);
  const [isLyricHeightMeasured, setIsLyricHeightMeasured] = useState(false);
  const { isPlaying, playPause, progress } = useSongAudio(song);
  const [isLiked, setIsLiked] = useState(false);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !song) {
    return <Text>加载歌曲时出错</Text>;
  }

  return (
    <View className="flex-1">
      <SongHeader 
        cover={song.coverUri}
        title={song.title}
        artist={song.artist}
        isLiked={isLiked}
        onLikePress={() => setIsLiked(!isLiked)}
        onMorePress={() => {/* 实现更多功能 */}}
      />
      <LyricsScrollView
        lyrics={song.lyrics}
        progress={{
          ...progress,
          position: Math.max(0, progress.position - song.lyricsDelay)
        }}
        isLyricHeightMeasured={isLyricHeightMeasured}
        setIsLyricHeightMeasured={setIsLyricHeightMeasured}
      />
      <View className="p-4">
        <SongBottom 
          isPlaying={isPlaying}
          onPlayPause={playPause}
        />
      </View>
    </View>
  );
}