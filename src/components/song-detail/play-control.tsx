import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors } from '@/constants/tokens';
import { useIsPlaying, usePlayPause } from '@/store/use-song-store';
import { Pause, Play } from '@/ui/icons';

interface PlayControlProps {
  size?: number;
  color?: string;
}

function PlayControl({ 
  size = 40, 
  color = colors.primary
}: PlayControlProps) {
  const isPlaying = useIsPlaying();
  const playPause = usePlayPause();

  const handlePlayPause = useCallback(() => {
    playPause();
  }, [playPause]);

  const IconComponent = useMemo(() => isPlaying ? Pause : Play, [isPlaying]);

  return (
    <TouchableOpacity onPress={handlePlayPause}>
      <IconComponent color={color} size={size} />
    </TouchableOpacity>
  );
}

export default React.memo(PlayControl);