import { type Ruby } from '../api/japanese-analyzer';
export interface Word {
  surface: string;  // 表层形
  reading: string;  // 读音
  pos: string;      // 品词
  basic_form: string; // 基本形
  start_time: number; // 开始时间
  end_time: number;   // 结束时间
  hiragana_reading: string; // 平假名读音
  rubies: Ruby[];
}
export interface Lyric {
  timestamp: string;
  words: Word[];
  translations: {
    en: string;
    zh: string;
  };
  romaji?: string; // 添加罗马音字段
  original: string; // 原始歌词文本
}

export interface Song {
  coverUri: string;
  id: string;
  title: string;
  artist: string;
  album?: string; // 添加专辑字段
  audioUri: string;
  isLocalAudio: boolean;
  lyrics: Lyric[];
  metadata?: { // 添加元数据字段
    [key: string]: string;
  };
  lyricsDelay: number;
  isLiked: boolean;
}