import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, TextInput } from 'react-native';

import { DEFAULT_COVER_URL } from '@/constants/cover';
import type { Song } from '@/types/lyrics';
import type { Lyric } from '@/types/lyrics';
import { Button, Text, View } from '@/ui';
import { parseLRC } from '@/utils/lrc-parser';

export default function LyricsEditorHome() {
  const [songTitle, setSongTitle] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [lyrics, setLyrics] = React.useState('');
  const router = useRouter();
  const [audioUri, setAudioUri] = useState('');
  const [isLocalAudio, setIsLocalAudio] = useState(false);
  const [parsedLyrics, setParsedLyrics] = useState<Lyric[]>([]);
  const [_coverUri, setCoverUri] = useState('');
  let songData:Song = {
    id: '',
    title: '',
    artist: '',
    lyrics: [],
    audioUri: '',
    isLocalAudio: false,
    coverUri: '',
    lyricsDelay: 0,
  };
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

  const pickLRCFile = async () => {
    try {
      // console.log('开始选择LRC文件');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'application/x-lrc', '*/*'],
        copyToCacheDirectory: true,
      });
  
      if (result.canceled) {
        console.error('用户取消了文件选择');
        return;
      }
  
      if (!result.assets || result.assets.length === 0) {
        console.error('未选择文件或文件选择结果无效');
        Alert.alert('错误', '未能选择文件,请重试。');
        return;
      }
  
      const asset = result.assets[0];
      // console.log(`选择的文件: ${asset.name}, URI: ${asset.uri}`);
  
      if (!asset.name.toLowerCase().endsWith('.lrc')) {
        console.warn('选择的文件不是LRC文件');
        Alert.alert('警告', '选择的文件可能不是LRC文件。是否继续?', [
          {
            text: '取消',
            onPress: () => console.log('用户取消了非LRC文件的导入'),
            style: 'cancel',
          },
          {
            text: '继续',
            onPress: async () => await processLRCFile(asset),
          },
        ]);
      } else {
        await processLRCFile(asset);
      }
    } catch (err) {
      console.error('选择LRC文件时出错:', err);
      let errorMessage = '选择LRC文件时出错';
      if (err instanceof Error) {
        errorMessage += `: ${err.message}`;
      }
      Alert.alert('错误', errorMessage);
    }
  };
  
  const processLRCFile = async (asset: DocumentPicker.DocumentPickerAsset) => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(asset.uri);
      // console.log('成功读取文件内容');
  
      const parsedSong = parseLRC(fileContent,songData);
      // console.log('成功解析LRC文件', { title: parsedSong.title, artist: parsedSong.artist});
  
      // 设置状态
      parsedSong.title && setSongTitle(parsedSong.title);
      parsedSong.artist && setArtist(parsedSong.artist);
      parsedSong.lyrics && setLyrics(parsedSong.lyrics.map(l => l.original).join('\n'));
      setParsedLyrics(parsedSong.lyrics);
      // console.log('状态已更新');
      Alert.alert('成功', '已成功导入LRC文件');
    } catch (err) {
      console.error('解析LRC文件时出错:', err);
      let errorMessage = '解析LRC文件时出错';
      if (err instanceof Error) {
        errorMessage += `: ${err.message}`;
      }
      Alert.alert('错误', errorMessage);
    }
  };

  const handleAnalyze = () => {
    if (!songTitle || !artist || !lyrics || !audioUri) {
      Alert.alert('错误', '请填写所有必要信息');
      return;
    }
    songData = {
      id: '',
      title: songTitle,
      artist,
      lyrics: parsedLyrics || lyrics.split('\n').map(line => ({
        timestamp: '',
        words: [],
        translations: { en: '', zh: '' },
        original: line
      })),
      audioUri,
      isLocalAudio,
      coverUri: _coverUri || DEFAULT_COVER_URL,
      lyricsDelay: 0,
    };
    router.push({
      pathname: '/lyrics-editor/preview',
      params: { songData: JSON.stringify(songData) },
    });
  };

  const pickCover = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newUri = FileSystem.documentDirectory + asset.name;
        await FileSystem.copyAsync({
          from: asset.uri,
          to: newUri,
        });
        setCoverUri(newUri);
      }
    } catch (err) {
      console.error('Error picking cover image:', err);
    }
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
        <Button label="选择LRC文件" onPress={pickLRCFile} />
        <Button label="选择封面图片" onPress={pickCover} />
        <Button label="分析" onPress={handleAnalyze} />
      </View>
    </ScrollView>
  );
}