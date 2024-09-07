import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {useState } from 'react';
import { ScrollView, TextInput } from 'react-native';

import type { Lyric, Word } from '@/types/lyrics';
import { Button, Text, View } from '@/ui';

export default function LyricLineEdit() {
  const router = useRouter();
  const { songTitle, artist, lyric: lyricString } = useLocalSearchParams<{ songTitle: string; artist: string; lyric: string }>();
  const [lyric, setLyric] = useState<Lyric>(JSON.parse(lyricString));

  const handleWordEdit = (index: number, field: keyof Word, value: string) => {
    const newWords = [...lyric.words];
    newWords[index] = { ...newWords[index], [field]: value };
    setLyric({ ...lyric, words: newWords });
  };

  const handleTranslationEdit = (lang: 'en' | 'zh', value: string) => {
    setLyric({ ...lyric, translations: { ...lyric.translations, [lang]: value } });
  };

  const handleSave = () => {
    // 这里应该实现保存逻辑
    router.back();
  };

  return (
    <ScrollView>
      <View className="p-4">
        <Text className="mb-4 text-2xl font-bold">编辑歌词行</Text>
        <Text className="mb-2 text-lg">{songTitle} - {artist}</Text>
        {lyric.words.map((word, index) => (
          <View key={index} className="mb-2">
            <TextInput
              value={word.surface}
              onChangeText={(value) => handleWordEdit(index, 'surface', value)}
              placeholder="原文"
              className="mb-1 rounded border p-2"
            />
            <TextInput
              value={word.reading}
              onChangeText={(value) => handleWordEdit(index, 'reading', value)}
              placeholder="假名"
              className="rounded border p-2"
            />
          </View>
        ))}
        <TextInput
          value={lyric.translations.en}
          onChangeText={(value) => handleTranslationEdit('en', value)}
          placeholder="英文翻译"
          className="mb-2 rounded border p-2"
        />
        <TextInput
          value={lyric.translations.zh}
          onChangeText={(value) => handleTranslationEdit('zh', value)}
          placeholder="中文翻译"
          className="mb-4 rounded border p-2"
        />
        <Button label="保存" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}