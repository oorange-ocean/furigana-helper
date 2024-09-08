import React from 'react';
import { Text,View } from 'react-native';

import type { Lyric } from '@/types/lyrics';

type Props = {
  lyric: Lyric;
  isActive?: boolean;
  currentTime: number;
};

export const LyricLine: React.FC<Props> = ({ lyric, isActive, currentTime }) => {
  return (
    <View style={{ opacity: isActive ? 1 : 0.6 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {lyric.words.map((word, index) => (
          <View key={index} style={{ alignItems: 'center', marginRight: 2 }}>
            <Text style={{ 
              fontSize: 10, 
              color: isActive ? 'gray' : 'lightgray',
              fontWeight: word.start_time && word.end_time && 
                currentTime >= word.start_time && currentTime < word.end_time ? 'bold' : 'normal'
            }}>
              {word.hiragana_reading}
            </Text>
            <Text style={{ 
              fontSize: 18,
              color: isActive ? 'black' : 'gray',
              fontWeight: word.start_time && word.end_time && 
                currentTime >= word.start_time && currentTime < word.end_time ? 'bold' : 'normal'
            }}>
              {word.surface}
            </Text>
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 14, color: isActive ? 'gray' : 'lightgray' }}>{lyric.translations.en}</Text>
      <Text style={{ fontSize: 14, color: isActive ? 'gray' : 'lightgray' }}>{lyric.translations.zh}</Text>
    </View>
  );
};