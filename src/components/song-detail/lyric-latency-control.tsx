import React from 'react';
import { View } from 'react-native';

import { Button, Text } from '@/ui';
import { LyricLatency } from '@/ui/icons';

interface LyricLatencyControlProps {
  lyricsDelay: number;
  onLyricsDelayChange: (delay: number) => void;
}

export function LyricLatencyControl({ 
  lyricsDelay, 
  onLyricsDelayChange 
}: LyricLatencyControlProps) {
  const adjustDelay = (amount: number) => {
    onLyricsDelayChange(lyricsDelay + amount);
  };

  return (
    <View className="mt-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <LyricLatency className="mr-2" />
        <Text>歌词延迟: {lyricsDelay.toFixed(1)}s</Text>
      </View>
      <View className="flex-row">
        <Button label="-0.1s" onPress={() => adjustDelay(-0.1)} />
        <Button label="+0.1s" onPress={() => adjustDelay(0.1)} />
      </View>
    </View>
  );
}