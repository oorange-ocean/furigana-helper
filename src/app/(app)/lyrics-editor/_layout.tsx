import { Stack } from 'expo-router';
import React from 'react';

export default function LyricsEditorLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="preview" options={{ title: '歌词预览' }} />
      <Stack.Screen name="edit/[id]" options={{ title: '编辑歌词' }} />
    </Stack>
  );
}