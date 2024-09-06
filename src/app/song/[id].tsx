import { type Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect,useState } from 'react';
import { ScrollView } from 'react-native';

import { useSong } from '@/api'; // 我们稍后会创建这个 hook
import { LyricLine } from '@/components/lyric-line'; // 我们稍后会创建这个组件
import { Button,Text, View } from '@/ui';

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

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error || !song) {
    return <Text>Error loading song</Text>;
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold">{song.title}</Text>
      <Text className="mb-4 text-lg text-gray-600">{song.artist}</Text>
      <Button label={isPlaying ? 'Pause' : 'Play'} onPress={playPause} />
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