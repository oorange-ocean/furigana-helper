import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { useSongStore } from '@/store/use-song-store';
import { Pause,Play } from '@/ui/icons';
interface PlayControlProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function PlayControl({ 
  size = 64, 
  color = '#FFFFFF', 
  backgroundColor = '#4F46E5' // 假设这是你的主题主色
}: PlayControlProps) {
  const { playPause, isPlaying } = useSongStore();
  return (
    <View className="mb-4 items-center">
      <TouchableOpacity
        onPress={playPause}
        style={{
          width: size,
          height: size,
          backgroundColor,
          borderRadius: size / 2,
        }}
        className="items-center justify-center"
      >
        {isPlaying ? (
          <Pause color={color} width={size * 0.5} height={size * 0.5} />
        ) : (
          <Play color={color} width={size * 0.5} height={size * 0.5} />
        )}
      </TouchableOpacity>
    </View>
  );
}