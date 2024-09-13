import React from 'react';

import { View } from '@/ui';

import { PlayControl } from './play-control';

interface SongHeaderProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function SongBottom({ 
  isPlaying, 
  onPlayPause,
}: SongHeaderProps) {
  return (
    <View>
      <PlayControl 
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
      />
    </View>
  );
}