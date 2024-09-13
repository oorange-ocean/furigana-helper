import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import { Text } from '@/ui';
import { Heart, MoreVertical } from '@/ui/icons';

interface SongHeaderProps {
  cover: string;
  title: string;
  artist: string;
  isLiked: boolean;
  onLikePress: () => void;
  onMorePress: () => void;
}

export function SongHeader({ 
  cover, 
  title, 
  artist, 
  isLiked, 
  onLikePress, 
  onMorePress 
}: SongHeaderProps) {
  return (
    <View className="flex-row items-center p-4">
      <Image 
        source={{ uri: cover }} 
        className="mr-4 h-16 w-16 rounded-lg"
      />
      <View className="flex-1">
        <Text className="text-lg font-bold">{title}</Text>
        <Text className="text-sm text-gray-600">{artist}</Text>
      </View>
      <TouchableOpacity onPress={onLikePress} className="mr-4">
        <Heart 
          color={isLiked ? '#FF4081' : '#9E9E9E'} 
          fill={isLiked ? '#FF4081' : 'none'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onMorePress}>
        <MoreVertical color="#9E9E9E" />
      </TouchableOpacity>
    </View>
  );
}