import { useCallback, useEffect, useState } from 'react';
import TrackPlayer, { State, useProgress } from 'react-native-track-player';

import { useTrackPlayerControls } from '@/hooks/use-track-player';

export function useSongAudio(song: any) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { play, pause, playbackState } = useTrackPlayerControls();
  const progress = useProgress();

  const loadAudio = useCallback(async () => {
    if (!song) {
      console.error('无法加载音频：歌曲数据不存在');
      return;
    }
  
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: song.id,
        url: song.audioUri,
        title: song.title,
        artist: song.artist,
      });

      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 500,
      });
      setErrorMessage(null);
    } catch (error) {
      console.error('加载音频时出错:', error);
      setErrorMessage('无法加载音频，请稍后重试');
    }
  }, [song]);

  useEffect(() => {
    if (song) {
      loadAudio();
    }
    return () => {
      TrackPlayer.reset();
    };
  }, [loadAudio, song]);

  const playPause = async () => {
    if (playbackState === State.Playing) {
      await pause();
      setIsPlaying(false);
    } else {
      await play();
      setIsPlaying(true);
    }
  };

  return { isPlaying, errorMessage, playPause, progress };
}