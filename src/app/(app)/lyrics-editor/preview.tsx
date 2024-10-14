import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import uuid from 'react-native-uuid';

import { analyzeJapaneseText } from '@/api/japanese-analyzer';
import { saveSong } from '@/api/songs';
import type { Lyric, Song } from '@/types/lyrics';
import { Button, Text, View } from '@/ui';

const POS_COLORS = {
  助詞: 'rgba(70, 130, 180, 0.8)',
  動詞: 'rgba(50, 205, 50, 0.8)',
  名詞: 'rgba(255, 165, 0, 0.8)',
  副詞: 'rgba(186, 85, 211, 0.8)',
};

export default function LyricsPreview() {
  const router = useRouter();
  const { songData } = useLocalSearchParams<{ songData: string }>();
  const [song, _setSong] = useState<Partial<Song>>(JSON.parse(songData));
  const [analyzedLyrics, setAnalyzedLyrics] = useState<Lyric[]>(song.lyrics || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const analyze = async () => {
      try {
        setError(null);
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
      } catch (error: any) {
        console.error('分析错误:', error);
        setError('歌词分析过程中出现错误。');
      }
    };
    analyze();
  }, [song.lyrics]);

  const handleSave = async () => {
    try {
      setError(null);
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
      await saveSong(newSong);
      Alert.alert('保存成功', '歌曲已成功保存');
      router.replace('/(app)/lyrics-editor');
    } catch (error: any) {
      console.error('保存歌曲时出错:', error);
      setError('保存歌曲时出现错误。');
      Alert.alert('错误', '保存歌曲时出错');
    }
  };

  const getWordStyle = (pos: string) => {
    let color = 'transparent';
    if (pos.includes('助詞')) color = POS_COLORS.助詞;
    else if (pos.includes('動詞')) color = POS_COLORS.動詞;
    else if (pos.includes('名詞')) color = POS_COLORS.名詞;
    else if (pos.includes('副詞')) color = POS_COLORS.副詞;

    return { borderBottomWidth: 2, borderBottomColor: color };
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>歌词预览</Text>
        <Text style={styles.subtitle}>{song.title} - {song.artist}</Text>
        {error && <Text style={styles.errorText}>错误: {error}</Text>}
        {analyzedLyrics.map((lyric, lineIndex) => (
          <View key={lineIndex} style={styles.lineContainer}>
            <View style={styles.wordsContainer}>
              {lyric.words.map((word, wordIndex) => (
                <TouchableOpacity
                  key={wordIndex}
                  style={[styles.wordContainer, getWordStyle(word.pos)]}
                >
                  <Text style={styles.wordText}>{word.surface}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.translation}>{lyric.translations.zh}</Text>
          </View>
        ))}
        <Button label="保存" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  lineContainer: {
    marginBottom: 16,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordContainer: {
    marginRight: 4,
    marginBottom: 4,
  },
  wordText: {
    fontSize: 16,
  },
  translation: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});