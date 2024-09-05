import { Link } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';

import { useSongs } from '@/api'; // 我们稍后会创建这个 hook
import { Pressable,Text, View } from '@/ui';

export default function SongsList() {
  const { data: songs, isLoading, error } = useSongs();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading songs</Text>;
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
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}