import React from 'react';
import { ReactFuri } from 'react-furi';
import { View } from 'react-native';

import type { Lyric } from '@/types/lyrics';
import { Text } from '@/ui';

type Props = {
  lyric: Lyric;
  isActive: boolean;
};

export const LyricLine: React.FC<Props> = ({ lyric, isActive }) => {
  return (
    <View className={`mb-2 ${isActive ? 'bg-yellow-100' : ''}`}>
      <ReactFuri
        word={lyric.text}
        reading={lyric.ruby}
        render={({ pairs }) => (
          <Text className="text-lg">
            {pairs.map(([furigana, text], index) => (
              <Text key={index}>
                <Text className="text-xs text-gray-500">{furigana}</Text>
                <Text>{text}</Text>
              </Text>
            ))}
          </Text>
        )}
      />
      <Text className="text-sm text-gray-600">{lyric.translations.en}</Text>
      <Text className="text-sm text-gray-600">{lyric.translations.zh}</Text>
    </View>
  );
};