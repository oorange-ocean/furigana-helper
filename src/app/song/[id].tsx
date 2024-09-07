import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

import { useSong } from '@/api';
import { LyricLine } from '@/components/lyric-line';
import { ActivityIndicator, Button, Text, View } from '@/ui';

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: song, isLoading, error } = useSong(id);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadAudio = useCallback(async () => {
    if (!song) {
      console.error('无法加载音频：歌曲数据不存在');
      return;
    }

    try {
      let audioSource;
      if (song.isLocalAudio) {
        const fileInfo = await FileSystem.getInfoAsync(song.audioUri);
        if (!fileInfo.exists) {
          throw new Error(`本地音频文件不存在: ${song.audioUri}`);
        }
        audioSource = { uri: song.audioUri };
      } else {
        audioSource = { uri: song.audioUri };
      }

      const { sound: audioSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: false },
        (status) => {
          if (status.isLoaded) {
            setCurrentTime(status.positionMillis / 1000);
          }
        }
      );

      setSound(audioSound);
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
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [loadAudio, song]);

  const playPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !song) {
    return <Text>加载歌曲时出错</Text>;
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold">{song.title}</Text>
      <Text className="mb-4 text-lg text-gray-600">{song.artist}</Text>
      {errorMessage && <Text className="mb-2 text-red-500">{errorMessage}</Text>}
      <Button label={isPlaying ? '暂停' : '播放'} onPress={playPause} />
      <ScrollView className="mt-4">
        {song.lyrics.map((lyric, index) => (
          <LyricLine 
            key={index} 
            lyric={lyric} 
            isActive={currentTime >= parseFloat(lyric.timestamp) && 
                      (index === song.lyrics.length - 1 || currentTime < parseFloat(song.lyrics[index + 1].timestamp))}
            currentTime={currentTime}
          />
        ))}
      </ScrollView>
    </View>
  );
}