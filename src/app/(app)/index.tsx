import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import { useLoadSongList,useSongList } from '@/store/use-song-store';
import { ActivityIndicator, Pressable, Text } from '@/ui';

export default function SongsList() {
  const songList = useSongList();
  const loadSongList = useLoadSongList();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadSongs = async () => {
        try {
          setIsLoading(true);
          setError(null);
          await loadSongList();
        } catch (err) {
          console.error('加载歌曲时出错:', err);
          setError('加载歌曲时出错');
        } finally {
          setIsLoading(false);
        }
      };

      loadSongs();
    }, [loadSongList])
  );

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={songList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/song/${item.id}`} asChild>
            <Pressable className="border-b border-gray-200 p-4">
              <Text className="text-lg font-bold">{item.title}</Text>
              <Text className="text-sm text-gray-600">{item.artist}</Text>
              <Text className="text-xs text-gray-400">{item.isLocalAudio ? '本地音频' : '在线音频'}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}