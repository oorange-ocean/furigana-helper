import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React from 'react';
import { Alert,FlatList, RefreshControl, View } from 'react-native';

import { deleteSong,useSongs } from '@/api/songs';
import { ActivityIndicator, Pressable, Text } from '@/ui';

export default function SongsList() {
  const { data: songList, isLoading, error, refetch } = useSongs();
  const queryClient = useQueryClient();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      await deleteSong(songId);
      await queryClient.invalidateQueries({ queryKey: ['songs'] });
      refetch();
    } catch (error) {
      console.error('删除歌曲时出错:', error);
      Alert.alert('错误', '删除歌曲时出现问题，请稍后再试。');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Link href={`/song/${item.id}`} asChild>
      <Pressable
        className="border-b border-gray-200 p-4"
        onLongPress={() => {
          Alert.alert(
            '删除歌曲',
            `确定要删除 "${item.title}" 吗？`,
            [
              { text: '取消', style: 'cancel' },
              { text: '删除', onPress: () => handleDeleteSong(item.id), style: 'destructive' }
            ]
          );
        }}
      >
        <Text className="text-lg font-bold">{item.title}</Text>
        <Text className="text-sm text-gray-600">{item.artist}</Text>
        <Text className="text-xs text-gray-400">{item.isLocalAudio ? '本地音频' : '在线音频'}</Text>
      </Pressable>
    </Link>
  );

  const renderEmptyComponent = () => (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-center text-gray-500">暂无歌曲，请添加歌曲。</Text>
    </View>
  );

  return (
    <View className="flex-1">
      {isLoading && <ActivityIndicator />}
      {error && <Text className="mb-4 text-center text-red-500">加载歌曲时出错，请稍后再试。</Text>}
      {!isLoading && !error && (
        <FlatList
          data={songList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
}