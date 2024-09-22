import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { useCurrentSong, useUpdateLyricsDelay } from '@/store/use-song-store';
import { Button, Text } from '@/ui';
import { LyricLatency } from '@/ui/icons';

export function LyricLatencyControl() {
  const currentSong = useCurrentSong();
  const updateLyricsDelay = useUpdateLyricsDelay();
  const [localDelay, setLocalDelay] = useState(currentSong?.lyricsDelay || 0);

  useEffect(() => {
    setLocalDelay(currentSong?.lyricsDelay || 0);
  }, [currentSong?.lyricsDelay]);

  const debouncedUpdate = useMemo(
    () => debounce((delay: number) => {
      updateLyricsDelay(delay);
    }, 1000),
    [updateLyricsDelay]
  );

  const adjustDelay = useCallback((amount: number) => {
    setLocalDelay(prevDelay => {
      const newDelay = Number((prevDelay + amount).toFixed(1));
      debouncedUpdate(newDelay);
      return newDelay;
    });
  }, [debouncedUpdate]);

  const delayText = useMemo(() => `歌词延迟: ${localDelay.toFixed(1)}s`, [localDelay]);

  const decreaseDelay = useCallback(() => adjustDelay(-0.1), [adjustDelay]);
  const increaseDelay = useCallback(() => adjustDelay(0.1), [adjustDelay]);

  return (
    <View className="mt-4 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <LyricLatency className="mr-2" />
        <Text>{delayText}</Text>
      </View>
      <View className="flex-row">
        <Button label="-0.1s" onPress={decreaseDelay} />
        <Button label="+0.1s" onPress={increaseDelay} />
      </View>
    </View>
  );
}