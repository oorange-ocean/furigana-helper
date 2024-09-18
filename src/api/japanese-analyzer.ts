import { tokenize } from 'react-native-japanese-text-analyzer';
import * as wanakana from 'wanakana';

export interface TokenResult {
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading: string;
  pronunciation: string;
  hiragana_reading: string;
}

export interface Ruby {
  rb: string;
  rt: string;
}

interface SegmentResult extends TokenResult {
  rubies: Ruby[];
}

function createRubies(surface: string, reading: string): Ruby[] {
  const rubies: Ruby[] = [];
  let surfaceIndex = 0;
  let readingIndex = 0;

  while (surfaceIndex < surface.length) {
    if (wanakana.isKana(surface[surfaceIndex])) {
      const kana = surface[surfaceIndex];
      const hiragana = wanakana.toHiragana(kana);
      rubies.push({ rb: kana, rt: hiragana });
      surfaceIndex++;
      readingIndex++;
    } else {
      let rbEnd = surfaceIndex + 1;
      let nextKana = '';
      while (rbEnd < surface.length && !wanakana.isKana(surface[rbEnd])) {
        rbEnd++;
      }
      if (rbEnd < surface.length) {
        nextKana = surface[rbEnd];
      }
      
      const rb = surface.slice(surfaceIndex, rbEnd);
      const katakanaNextKana = wanakana.toKatakana(nextKana);
      
      if (nextKana && reading.indexOf(katakanaNextKana) !== reading.lastIndexOf(katakanaNextKana)) {
        console.warn(`警告：在读音中发现多个匹配的假名。将整个segment作为一个ruby处理。表层形式: ${surface}, 读音: ${reading}
          nextKana: ${nextKana}, katakanaNextKana: ${katakanaNextKana}
          首次出现的位置：${reading.indexOf(katakanaNextKana)}
          最后一次出现的位置：${reading.lastIndexOf(katakanaNextKana)}
          `);
        return [{ rb: surface, rt: wanakana.toHiragana(reading) }];
      }
      
      let rtEnd = nextKana ? reading.indexOf(katakanaNextKana, readingIndex) : reading.length;
      
      if (rtEnd === -1 && nextKana) {
        console.warn(`警告：无法准确匹配读音。表层形式: ${rb}, 读音: ${reading.slice(readingIndex)}`);
        rtEnd = reading.length; // 使用剩余的所有读音
      }
      
      const rt = wanakana.toHiragana(reading.slice(readingIndex, rtEnd));
      rubies.push({ rb, rt });
      
      surfaceIndex = rbEnd;
      readingIndex = rtEnd;
    }
  }

  return rubies;
}

export async function analyzeJapaneseText(text: string): Promise<SegmentResult[]> {
  try {
    const result = await tokenize(text);
    return result.map(token => ({
      ...token,
      hiragana_reading: wanakana.toHiragana(token.reading),
      rubies: createRubies(token.surface_form, token.reading)
    }));
  } catch (error) {
    console.error('Error analyzing Japanese text:', error);
    throw error;
  }
}