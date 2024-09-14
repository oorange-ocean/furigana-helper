import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { useSongStore } from '@/store/use-song-store';
import { Text } from '@/ui';
import { Heart, MoreVertical } from '@/ui/icons';

export function SongHeader() {
  const { currentSong, isLiked, setIsLiked, setIsOptionsModalVisible } = useSongStore();

  if (!currentSong) return null;

  return (
    <View className="flex-row items-center p-4">
      <Image 
        source={{ uri: currentSong.coverUri }} 
        className="mr-4 h-16 w-16 rounded-lg"
      />
      <View className="flex-1">
        <Text className="text-lg font-bold">{currentSong.title}</Text>
        <Text className="text-sm text-gray-600">{currentSong.artist}</Text>
      </View>
      <TouchableOpacity onPress={() => setIsLiked(!isLiked)} className="mr-4">
        <Heart 
          color={isLiked ? '#FF4081' : '#9E9E9E'} 
          fill={isLiked ? '#FF4081' : 'none'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsOptionsModalVisible(true)}>
        <MoreVertical color="#9E9E9E" />
      </TouchableOpacity>
    </View>
  );
}