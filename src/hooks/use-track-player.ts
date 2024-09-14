import { useEffect, useState } from 'react';
import TrackPlayer, { Capability,Event, State } from 'react-native-track-player';

export const useInitializePlayer = () => {
  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
          ],
          progressUpdateEventInterval: 1,
        });
        console.log('Player setup complete');
      } catch (error) {
        console.error('Error setting up the player:', error);
      }
    };
    setupPlayer();
  }, []);
};

export const usePlaybackState = () => {
  const [state, setState] = useState<State>(State.None);

  useEffect(() => {
    const listener = TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
      setState(event.state);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return state;
};

export const useTrackPlayerControls = () => {
  const playbackState = usePlaybackState();

  const play = async () => {
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const stop = async () => {
    await TrackPlayer.stop();
  };

  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  return { play, pause, stop, seekTo, playbackState };
};

