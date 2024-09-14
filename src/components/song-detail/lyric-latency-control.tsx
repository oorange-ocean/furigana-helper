import debounce from 'lodash/debounce';
import React, { useCallback, useEffect,useState } from 'react';
import { View } from 'react-native';

import { useSongStore } from '@/store/use-song-store';
import { Button, Text } from '@/ui';
import { LyricLatency } from '@/ui/icons';

export function LyricLatencyControl() {
  const currentSong = useSongStore((state) => state.currentSong);
  const updateLyricsDelay = useSongStore((state) => state.updateLyricsDelay);
  const [localDelay, setLocalDelay] = useState(currentSong?.lyricsDelay || 0);

  useEffect(() => {
    setLocalDelay(currentSong?.lyricsDelay || 0);
  }, [currentSong?.lyricsDelay]);

  const debouncedUpdate = useCallback(
    debounce((delay: number) => {
      updateLyricsDelay(delay);
    }, 1000),
    [updateLyricsDelay]
  );

  const adjustDelay = (amount: number) => {
    const newDelay = Number((localDelay + amount).toFixed(1));
    setLocalDelay(newDelay);
    debouncedUpdate(newDelay);
  };

  return (
    <View className="mt-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <LyricLatency className="mr-2" />
        <Text>歌词延迟: {localDelay.toFixed(1)}s</Text>
      </View>
      <View className="flex-row">
        <Button label="-0.1s" onPress={() => adjustDelay(-0.1)} />
        <Button label="+0.1s" onPress={() => adjustDelay(0.1)} />
      </View>
    </View>
  );
}