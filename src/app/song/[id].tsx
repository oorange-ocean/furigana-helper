import { type Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { tokenize } from 'react-native-japanese-text-analyzer';

import { useSong } from '@/api';
import { LyricLine } from '@/components/lyric-line';
import { Button, Text, View } from '@/ui';

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: song, isLoading, error } = useSong(id);
  const [sound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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

  const testAnalyzer = async () => {
    if (song && song.lyrics.length > 0) {
      const firstLyric = song.lyrics[0].words.map(word => word.surface).join('');
      try {
        const result = await tokenize(firstLyric);
        console.log('分析结果:', result);
      } catch (error) {
        console.error('分析错误:', error);
      }
    }
  };

  if (isLoading) {
    return <Text>加载中...</Text>;
  }

  if (error || !song) {
    return <Text>加载歌曲时出错</Text>;
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold">{song.title}</Text>
      <Text className="mb-4 text-lg text-gray-600">{song.artist}</Text>
      <Button label={isPlaying ? '暂停' : '播放'} onPress={playPause} />
      <Button label="测试分析器" onPress={testAnalyzer} />
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