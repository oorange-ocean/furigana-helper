import React from 'react';
import { View } from 'react-native';

import { LyricLatencyControl } from '@/components/song-detail/lyric-latency-control';
import { Modal, Text } from '@/ui';

interface SongOptionsModalProps {
  lyricsDelay: number;
  onLyricsDelayChange: (delay: number) => void;
}

export function SongOptionsModal({ lyricsDelay, onLyricsDelayChange }: SongOptionsModalProps) {
  return (
    <Modal snapPoints={['50%']} title="歌曲选项">
      <View className="p-4">
        <Text className="mb-4 text-lg font-bold">歌词延迟调整</Text>
        <LyricLatencyControl 
          lyricsDelay={lyricsDelay} 
          onLyricsDelayChange={onLyricsDelayChange} 
        />
      </View>
    </Modal>
  );
}