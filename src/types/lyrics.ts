export interface Word {
  surface: string;  // 表层形
  reading: string;  // 读音
  pos: string;      // 品词
  basic_form: string; // 基本形
  start_time: number; // 开始时间
  end_time: number;   // 结束时间
}

export interface Lyric {
  timestamp: string;
  words: Word[];
  translations: {
    en: string;
    zh: string;
  };
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  lyrics: Lyric[];
}