import React, { useCallback, useMemo, useRef } from 'react';
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
  const animationFrameRef = useRef<number>();

  const handlePlayPause = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      playPause();
    });
  }, [playPause]);

  const IconComponent = useMemo(() => isPlaying ? Pause : Play, [isPlaying]);

  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <TouchableOpacity onPress={handlePlayPause}>
      <IconComponent color={color} size={size} />
    </TouchableOpacity>
  );
}

export default React.memo(PlayControl);