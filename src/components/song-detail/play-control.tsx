import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Pause,Play } from '@/ui/icons';

interface PlayControlProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function PlayControl({ 
  isPlaying, 
  onPlayPause, 
  size = 64, 
  color = '#FFFFFF', 
  backgroundColor = '#4F46E5' // 假设这是你的主题主色
}: PlayControlProps) {
  return (
    <View className="mb-4 items-center">
      <TouchableOpacity
        onPress={onPlayPause}
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