import React from 'react';
import { Text, View } from 'react-native';

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
        {lyric.words.map((word, wordIndex) => (
          <View key={wordIndex} style={{ alignItems: 'center', marginRight: 2 }}>
            {word.rubies.map((ruby, rubyIndex) => (
              <View key={rubyIndex}>
                {ruby.rb !== ruby.rt && (
                  <Text style={{ 
                    fontSize: 10, 
                    color: isActive ? 'gray' : 'lightgray',
                    fontWeight: word.start_time && word.end_time && 
                      currentTime >= word.start_time && currentTime < word.end_time ? 'bold' : 'normal'
                  }}>
                    {ruby.rt}
                  </Text>
                )}
                <Text style={{ 
                  fontSize: 18,
                  color: isActive ? 'black' : 'gray',
                  fontWeight: word.start_time && word.end_time && 
                    currentTime >= word.start_time && currentTime < word.end_time ? 'bold' : 'normal'
                }}>
                  {ruby.rb}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Text style={{ fontSize: 14, color: isActive ? 'gray' : 'lightgray' }}>{lyric.translations.en}</Text>
      <Text style={{ fontSize: 14, color: isActive ? 'gray' : 'lightgray' }}>{lyric.translations.zh}</Text>
    </View>
  );
};