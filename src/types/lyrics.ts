export interface Lyric {
  timestamp: string;
  text: string;
  ruby: string;
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