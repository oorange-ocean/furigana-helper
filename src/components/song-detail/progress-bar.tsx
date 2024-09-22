import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useProgress } from 'react-native-track-player';

import { colors } from '@/constants/tokens';
import { ProgressBar, type ProgressBarRef } from '@/ui';
import { Text } from '@/ui/text';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function SongProgressBar() {
  const progress = useProgress();
  const progressBarRef = useRef<ProgressBarRef>(null);

  useEffect(() => {
    if (progressBarRef.current && progress.duration > 0) {
      const percentage = (progress.position / progress.duration) * 100;
      progressBarRef.current.setProgress(percentage);
    }
  }, [progress.position, progress.duration]);

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
      <View style={styles.progressBarContainer}>
        <ProgressBar
          ref={progressBarRef}
          className="w-full"
          color={colors.primary}
          height={5.5}
          thumbSize={18}
        />
      </View>
      <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});