import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import LyricLine from './lyric-line';

type Props = {
  onMeasure: (height: number) => void;
};

export const LyricLineMeasure: React.FC<Props> = ({ onMeasure }) => {
  const viewRef = useRef<View>(null);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.measure((x, y, width, height) => {
        console.log('single lineheight', height);
        onMeasure(height);
      });
    }
  }, [onMeasure]);

  // 使用一个样本歌词进行测量
  const sampleLyric = {
    timestamp: '00:00:00',
    words: [
      {
        surface: '样本歌词',
        reading: 'サンプルカシ',
        pos: '名詞',
        basic_form: '样本歌词',
        start_time: 0,
        end_time: 0,
        hiragana_reading: 'さんぷるかし',
        rubies: [
          { rb: '样', rt: 'サン' },
          { rb: '本', rt: 'プル' },
          { rb: '歌', rt: 'カ' },
          { rb: '词', rt: 'シ' },
        ],
      },
    ],
    translations: { en: 'Sample lyric', zh: '样本歌词' },
    original: '样本歌词',
  };

  return (
    <View ref={viewRef} style={{ opacity: 0, position: 'absolute' }}>
      <LyricLine
        lyric={sampleLyric}
        isActive={false}
        currentTime={0}
        songId="1"
        lyricIndex={0}
      />
    </View>
  );
};
