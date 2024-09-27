import React, { memo, useCallback, useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as wanakana from 'wanakana';

import { updateLyric } from '@/api/songs';
import { EditWordModal } from '@/modals/edit-word-modal';
import type { Lyric } from '@/types/lyrics';

type Props = {
  lyric: Lyric;
  isActive?: boolean;
  currentTime: number;
  songId: string;
  lyricIndex: number;
};

const POS_COLORS = {
  助詞: 'rgba(70, 130, 180, 0.8)',  // 介词
  動詞: 'rgba(50, 205, 50, 0.8)',   // 动词
  名詞: 'rgba(255, 165, 0, 0.8)',   // 名词
  副詞: 'rgba(186, 85, 211, 0.8)',  // 副词
};

const LyricLine: React.FC<Props> = memo(({ lyric, isActive, currentTime, songId, lyricIndex }) => {
  const [localLyric, setLocalLyric] = useState(lyric);
  const [editingWord, setEditingWord] = useState<{ word: { surface: string; reading: string }; index: number } | null>(null);
      const shouldShowReading = (rb: string, rt: string) => {
    if (rt.replace(/\*/g, '') === '') return false; // 忽略只包含 * 的读音
    return wanakana.toHiragana(rb) !== wanakana.toHiragana(rt);
  };

  const getWordStyle = (pos: string) => {
    let color = 'transparent';
    if (pos.includes('助詞')) color = POS_COLORS.助詞;
    else if (pos.includes('動詞')) color = POS_COLORS.動詞;
    else if (pos.includes('名詞')) color = POS_COLORS.名詞;
    else if (pos.includes('副詞')) color = POS_COLORS.副詞;
    
    return { borderBottomWidth: 2, borderBottomColor: color };
  };

  const handleWordPress = (word: string) => {
    const encodedWord = encodeURIComponent(word);
    Linking.openURL(`mojisho://?search=${encodedWord}`);
  };
  const handleWordLongPress = useCallback((word: { surface: string; reading: string }, index: number) => {
    setEditingWord({ word, index });
  }, []);

  const handleSaveWord = useCallback(async (newWord: { surface: string; reading: string }) => {
    if (editingWord) {
      const updatedWords = [...localLyric.words];
      updatedWords[editingWord.index] = {
        ...updatedWords[editingWord.index],
        surface: newWord.surface,
        rubies: [{ rb: newWord.surface, rt: newWord.reading }],
      };

      const updatedLyric: Lyric = {
        ...localLyric,
        words: updatedWords,
        original: updatedWords.map(w => w.surface).join(''),
      };

      // 乐观更新
      setLocalLyric(updatedLyric);

      try {
        await updateLyric(songId, lyricIndex, updatedLyric);
      } catch (error) {
        console.error('更新歌词时出错:', error);
        // 如果更新失败，回滚到原始状态
        setLocalLyric(lyric);
      }
    }
    setEditingWord(null);
  }, [editingWord, localLyric, songId, lyricIndex, lyric]);
  
  return (
    <View style={[styles.lineContainer, isActive && styles.activeLine]}>
      <View style={styles.wordsContainer}>
        {localLyric.words.map((word, wordIndex) => (
          <TouchableOpacity
            key={wordIndex}
            onPress={() => handleWordPress(word.surface)}
            onLongPress={() => handleWordLongPress({ surface: word.surface, reading: word.rubies[0]?.rt || '' }, wordIndex)}            style={styles.wordContainer}
          >
            {word.rubies.map((ruby, rubyIndex) => (
              <View key={rubyIndex} style={styles.rubyContainer}>
                <Text style={styles.reading}>
                  {shouldShowReading(ruby.rb, ruby.rt) ? wanakana.toHiragana(ruby.rt) : ' '}
                </Text>
                <Text
                  style={[
                    styles.surface,
                    getWordStyle(word.pos),
                    word.start_time && word.end_time && 
                    currentTime >= word.start_time && currentTime < word.end_time ? styles.activeWord : null
                  ].filter(Boolean)}
                >
                  {ruby.rb}
                </Text>
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.translation}>{lyric.translations.zh}</Text>
      <EditWordModal
        isVisible={!!editingWord}
        currentWord={editingWord?.word || { surface: '', reading: '' }}
        onClose={() => setEditingWord(null)}
        onSave={handleSaveWord}
      />
    </View>
  );
});
export default LyricLine;
const styles = StyleSheet.create({
  lineContainer: {
    marginBottom: 8,
    padding: 4,
  },
  activeLine: {
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    borderRadius: 15,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wordContainer: {
    flexDirection: 'row',
    marginRight: 4,
  },
  rubyContainer: {
    alignItems: 'center',
  },
  reading: {
    fontSize: 10,
    color: 'gray',
    height: 14,
    lineHeight: 14,
  },
  surface: {
    fontSize: 18,
    color: 'black',
  },
  activeWord: {
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});