import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet,TouchableOpacity } from 'react-native';
import uuid from 'react-native-uuid';

import { analyzeJapaneseText } from '@/api/japanese-analyzer';
import type { Lyric, Song } from '@/types/lyrics';
import { Button, Text, View } from '@/ui';
const POS_COLORS = {
  介词: 'rgba(70, 130, 180, 0.8)',  // 更深的钢蓝色
  动词: 'rgba(50, 205, 50, 0.8)',   // 更深的酸橙绿
  名词: 'rgba(255, 165, 0, 0.8)',   // 更深的橙色
  副词: 'rgba(186, 85, 211, 0.8)',  // 更深的中等兰花紫
};

export default function LyricsPreview() {
  const router = useRouter();
  const { songTitle, artist, lyrics, audioUri, isLocalAudio } = useLocalSearchParams<{ 
    songTitle: string; 
    artist: string; 
    lyrics: string;
    audioUri: string;
    isLocalAudio: string;
  }>();
  const [analyzedLyrics, setAnalyzedLyrics] = useState<Lyric[]>([]);

  useEffect(() => {
    const analyze = async () => {
      try {
        const lines = lyrics.split('\n').filter(line => line.trim() !== '');
        const analyzedLines = await Promise.all(lines.map(line => analyzeJapaneseText(line)));
        console.log(analyzedLines);
        const newLyrics: Lyric[] = analyzedLines.map((line, index) => ({
          timestamp: `00:00:${index * 5}`, // 临时时间戳
          words: line.map(token => ({
            surface: token.surface_form,
            reading: token.reading,
            pos: token.pos,
            basic_form: token.basic_form,
            start_time: 0, // 临时开始时间
            end_time: 0, // 临时结束时间
          })),
          translations: { en: '', zh: '' }, // 临时翻译
        }));
        setAnalyzedLyrics(newLyrics);
      } catch (error) {
        console.error('分析错误:', error);
      }
    };
    analyze();
  }, [lyrics]);

  const handleSave = async () => {
    const newSong: Song = {
      id: uuid.v4().toString(), // 使用 uuid.v4() 生成唯一 ID
      title: songTitle,
      artist,
      audioUri,
      isLocalAudio: isLocalAudio === 'true',
      lyrics: analyzedLyrics,
    };

    try {
      const songsDir = `${FileSystem.documentDirectory}songs/`;
      const songFile = `${songsDir}${newSong.id}.json`;

      await FileSystem.makeDirectoryAsync(songsDir, { intermediates: true });
      await FileSystem.writeAsStringAsync(songFile, JSON.stringify(newSong));

      console.log('Song saved successfully');
      router.replace('/songs'); 
    } catch (error) {
      console.error('Error saving song:', error);
      // 可以在这里添加错误提示
    }
  };

  const handleLinePress = (index: number) => {
    router.push({
      pathname: `/lyrics-editor/edit/[id]`,
      params: { id: index.toString(), songTitle, artist, lyric: JSON.stringify(analyzedLyrics[index]) },
    });
  };

  const getWordStyle = (pos: string) => {
    let color = 'transparent';
    if (pos.includes('助詞')) color = POS_COLORS.介词;
    else if (pos.includes('動詞')) color = POS_COLORS.动词;
    else if (pos.includes('名詞')) color = POS_COLORS.名词;
    else if (pos.includes('副詞')) color = POS_COLORS.副词;
    
    return { borderBottomWidth: 2, borderBottomColor: color };
  };
  return (
    <ScrollView>
      <View className="p-4">
        <Text className="mb-4 text-2xl font-bold">歌词预览</Text>
        <Text className="mb-2 text-lg">{songTitle} - {artist}</Text>
        {analyzedLyrics.map((lyric, index) => (
          <TouchableOpacity key={index} onPress={() => handleLinePress(index)}>
            <View style={styles.lineContainer}>
              {lyric.words.map((word, wordIndex) => (
                <View key={wordIndex} style={styles.wordContainer}>
                  <Text style={styles.reading}>{word.reading}</Text>
                  <Text style={[styles.surface, getWordStyle(word.pos)]}>{word.surface}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.translation}>{lyric.translations.zh}</Text>
          </TouchableOpacity>
        ))}
        <Button label="保存" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  wordContainer: {
    alignItems: 'center',
    marginRight: 4,
  },
  reading: {
    fontSize: 10,
    color: 'gray',
  },
  surface: {
    fontSize: 18,
    color: 'black',
    paddingBottom: 2, // 添加一些底部内边距，使边框更明显
  },
  translation: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
});