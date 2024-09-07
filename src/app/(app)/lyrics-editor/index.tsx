import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';

import { Button, Text, View } from '@/ui';

export default function LyricsEditorHome() {
  const [songTitle, setSongTitle] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [lyrics, setLyrics] = React.useState('');
  const router = useRouter();
  const [audioUri, setAudioUri] = useState('');
  const [isLocalAudio, setIsLocalAudio] = useState(false);

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newUri = FileSystem.documentDirectory + asset.name;
        await FileSystem.copyAsync({
          from: asset.uri,
          to: newUri,
        });
        setAudioUri(newUri);
        setIsLocalAudio(true);
      }
    } catch (err) {
      console.error('Error picking audio:', err);
    }
  };

  const handleAnalyze = () => {
    if (!songTitle || !artist || !lyrics || !audioUri) {
      // 显示错误消息
      return;
    }
    router.push({
      pathname: '/lyrics-editor/preview',
      params: { songTitle, artist, lyrics, audioUri, isLocalAudio: isLocalAudio.toString() },
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
        <Button label="选择音频文件" onPress={pickAudio} />
        {audioUri && <Text>已选择音频文件</Text>}
        <Button label="分析" onPress={handleAnalyze} />
      </View>
    </ScrollView>
  );
}