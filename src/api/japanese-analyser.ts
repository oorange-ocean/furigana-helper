import { tokenize } from 'react-native-japanese-text-analyzer';

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
}

export async function analyzeJapaneseText(text: string): Promise<TokenResult[]> {
  try {
    const result = await tokenize(text);
    return result;
  } catch (error) {
    console.error('Error analyzing Japanese text:', error);
    throw error;
  }
}