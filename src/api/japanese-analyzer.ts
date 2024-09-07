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
  hiragana_reading: string; // 新增字段
}

export async function analyzeJapaneseText(text: string): Promise<TokenResult[]> {
  try {
    const result = await tokenize(text);
    return result.map(token => ({
      ...token,
      hiragana_reading: wanakana.toHiragana(token.reading)
    }));
  } catch (error) {
    console.error('Error analyzing Japanese text:', error);
    throw error;
  }
}