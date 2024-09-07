import { Link } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';

import { useSongs } from '@/api';
import { ActivityIndicator, Pressable, Text, View } from '@/ui';

export default function SongsList() {
  const { data: songs, isLoading, error } = useSongs();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>加载歌曲时出错</Text>;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={songs}
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