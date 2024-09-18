import React, { useCallback, useEffect,useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import TrackPlayer, { useProgress } from 'react-native-track-player';

import { useSongStore } from '@/store/use-song-store';
import { LineRepeat, NextLine, PreviousLine } from '@/ui/icons';
import { timeToSeconds } from '@/utils/time-utils';

const log = (message: string, ...args: any[]) => {
  console.log(`[SingleLineRepeat] ${message}`, ...args);
};

export function SingleLineRepeat() {
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  const [repeatStartTime, setRepeatStartTime] = useState<number | null>(null);
  const [repeatEndTime, setRepeatEndTime] = useState<number | null>(null);
  const { currentSong } = useSongStore();
  const progress = useProgress();

  const findActiveLyric = useCallback(() => {
    if (!currentSong) return null;

    const adjustedPosition = progress.position - (currentSong.lyricsDelay || 0);
    const activeLyricIndex = currentSong.lyrics.findIndex((lyric, index) => {
      const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
      const nextLyricTimeSeconds = index < currentSong.lyrics.length - 1 
        ? timeToSeconds(currentSong.lyrics[index + 1].timestamp) 
        : Infinity;
      return adjustedPosition >= lyricTimeSeconds && adjustedPosition < nextLyricTimeSeconds;
    });

    if (activeLyricIndex !== -1) {
      const currentLyric = currentSong.lyrics[activeLyricIndex];
      const nextLyric = currentSong.lyrics[activeLyricIndex + 1];
      const startTime = timeToSeconds(currentLyric.timestamp) + (currentSong.lyricsDelay || 0);
      const endTime = nextLyric 
        ? timeToSeconds(nextLyric.timestamp) + (currentSong.lyricsDelay || 0)
        : Infinity;

      return { startTime, endTime };
    }

    return null;
  }, [currentSong, progress.position]);

  const toggleRepeat = useCallback(() => {
    if (!isRepeatActive) {
      const activeLyric = findActiveLyric();
      if (activeLyric) {
        log('Setting repeat times:', activeLyric);
        setRepeatStartTime(activeLyric.startTime);
        setRepeatEndTime(activeLyric.endTime);
      } else {
        log('No active lyric found to repeat');
      }
    } else {
      log('Clearing repeat times');
      setRepeatStartTime(null);
      setRepeatEndTime(null);
    }
    setIsRepeatActive(!isRepeatActive);
  }, [isRepeatActive, findActiveLyric]);

  const updateRepeatTimes = useCallback((startIndex: number) => {
    if (currentSong) {
      const startTime = timeToSeconds(currentSong.lyrics[startIndex].timestamp) + (currentSong.lyricsDelay || 0);
      const endTime = startIndex < currentSong.lyrics.length - 1
        ? timeToSeconds(currentSong.lyrics[startIndex + 1].timestamp) + (currentSong.lyricsDelay || 0)
        : progress.duration;
      
      setRepeatStartTime(startTime);
      setRepeatEndTime(endTime);
      log('Updated repeat times:', startTime, '-', endTime);
    }
  }, [currentSong, progress.duration]);

  const goToPreviousLine = useCallback(() => {
    if (currentSong) {
      const currentTime = progress.position - (currentSong.lyricsDelay || 0);
      const previousLyricIndex = currentSong.lyrics.findIndex((lyric) => {
        const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
        return lyricTimeSeconds > currentTime;
      }) - 1;

      if (previousLyricIndex >= 0) {
        log('Previous lyric index:', previousLyricIndex);
        const previousLyricTime = timeToSeconds(currentSong.lyrics[previousLyricIndex].timestamp);
        TrackPlayer.seekTo(previousLyricTime + (currentSong.lyricsDelay || 0));
        updateRepeatTimes(previousLyricIndex);
      }
    }
  }, [currentSong, progress.position, updateRepeatTimes]);

  const goToNextLine = useCallback(() => {
    if (currentSong) {
      const currentTime = progress.position - (currentSong.lyricsDelay || 0);
      const nextLyricIndex = currentSong.lyrics.findIndex(lyric => {
        const lyricTimeSeconds = timeToSeconds(lyric.timestamp);
        return lyricTimeSeconds > currentTime;
      });

      if (nextLyricIndex !== -1 && nextLyricIndex < currentSong.lyrics.length) {
        log('Next lyric index:', nextLyricIndex);
        const nextLyricTime = timeToSeconds(currentSong.lyrics[nextLyricIndex].timestamp);
        TrackPlayer.seekTo(nextLyricTime + (currentSong.lyricsDelay || 0));
        updateRepeatTimes(nextLyricIndex);
      }
    }
  }, [currentSong, progress.position, updateRepeatTimes]);

  useEffect(() => {
    if (isRepeatActive && repeatStartTime !== null && repeatEndTime !== null) {
      log('Current position:', progress.position, 'Repeat range:', repeatStartTime, '-', repeatEndTime);
      if (progress.position >= repeatEndTime) {
        log('Seeking to start time:', repeatStartTime);
        TrackPlayer.seekTo(repeatStartTime);
      }
    }
  }, [isRepeatActive, repeatStartTime, repeatEndTime, progress.position]);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
      <TouchableOpacity onPress={goToPreviousLine}>
        <PreviousLine color="#000000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleRepeat}>
        <LineRepeat color={isRepeatActive ? '#007AFF' : '#000000'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToNextLine}>
        <NextLine color="#000000" />
      </TouchableOpacity>
    </View>
  );
}