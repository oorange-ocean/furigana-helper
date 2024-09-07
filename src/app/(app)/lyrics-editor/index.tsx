import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, TextInput } from 'react-native';

import { Button, Text, View } from '@/ui';

export default function LyricsEditorHome() {
  const [songTitle, setSongTitle] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [lyrics, setLyrics] = React.useState('');
  const router = useRouter();

  const handleAnalyze = () => {
    if (!songTitle || !artist || !lyrics) {
      // 显示错误消息
      return;
    }
    router.push({
      pathname: '/lyrics-editor/preview',
      params: { songTitle, artist, lyrics },
    });
  };

  return (
    <ScrollView>
      <View className="p-4">
        <Text className="mb-4 text-2xl font-bold">歌词编辑器</Text>
        <TextInput
          value={songTitle}
          onChangeText={setSongTitle}
          placeholder="输入歌名..."
          className="mb-4 rounded border p-2"
        />
        <TextInput
          value={artist}
          onChangeText={setArtist}
          placeholder="输入艺术家..."
          className="mb-4 rounded border p-2"
        />
        <TextInput
          multiline
          value={lyrics}
          onChangeText={setLyrics}
          placeholder="输入歌词..."
          className="mb-4 h-40 rounded border p-2"
        />
        <Button label="分析" onPress={handleAnalyze} />
      </View>
    </ScrollView>
  );
}