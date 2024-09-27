import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import uuid from 'react-native-uuid';

import { analyzeJapaneseText } from '@/api/japanese-analyzer';
import { saveSong } from '@/api/songs';
import LyricLine from '@/components/lyric-line';
import type { Lyric, Song } from '@/types/lyrics';
import { Button, Text, View } from '@/ui';

export default function LyricsPreview() {
  const router = useRouter();
  const { songData } = useLocalSearchParams<{ songData: string }>();
  const [song, _setSong] = useState<Partial<Song>>(JSON.parse(songData));
  const [analyzedLyrics, setAnalyzedLyrics] = useState<Lyric[]>(song.lyrics || []);

  useEffect(() => {
    const analyze = async () => {
      try {
        const newLyrics = await Promise.all(song.lyrics!.map(async (lyric) => {
          if (lyric.words.length === 0) {
            const analyzedLine = await analyzeJapaneseText(lyric.original);
            return {
              ...lyric,
              words: analyzedLine.map(token => ({
                surface: token.surface_form,
                reading: token.reading,
                pos: token.pos,
                basic_form: token.basic_form,
                start_time: 0,
                end_time: 0,
                hiragana_reading: token.hiragana_reading,
                rubies: token.rubies,
              })),
            };
          }
          return lyric;
        }));
        setAnalyzedLyrics(newLyrics);
      } catch (error) {
        console.error('分析错误:', error);
      }
    };
    analyze();
  }, [song.lyrics]);

  const handleSave = async () => {
    const newSong: Song = {
      id: song.id || uuid.v4().toString(),
      title: song.title!,
      artist: song.artist!,
      audioUri: song.audioUri!,
      isLocalAudio: song.isLocalAudio!,
      lyrics: analyzedLyrics,
      coverUri: song.coverUri!,
      lyricsDelay: song.lyricsDelay!,
      isLiked: song.isLiked!,
    };
  
    try {
      await saveSong(newSong);
      Alert.alert('保存成功', '歌曲已成功保存');
      router.replace('/');
    } catch (error) {
      console.error('保存歌曲时出错:', error);
      Alert.alert('错误', '保存歌曲时出错');
    }
  };



  return (
    <ScrollView>
      <View className="p-4">
        <Text className="mb-4 text-2xl font-bold">歌词预览</Text>
        <Text className="mb-2 text-lg">{song.title} - {song.artist}</Text>
        {analyzedLyrics.map((lyric, index) => (
          <LyricLine
            key={index}
            lyric={lyric}
            isActive={false}
            currentTime={0}
            songId={song.id!}
            lyricIndex={index}
          />
        ))}
        <Button label="保存" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}
