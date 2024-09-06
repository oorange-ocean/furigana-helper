import { useQuery } from '@tanstack/react-query';

import type { Song } from '@/types/lyrics';

// 模拟 API 调用
const fetchSongs = async (): Promise<Song[]> => {
  return [
    {
      id: '1',
      title: 'さくら',
      artist: '森山直太朗',
      audioUrl: 'https://example.com/sakura.mp3',
      lyrics: [
        {
          timestamp: '00:00:10',
          words: [
            { surface: '桜', reading: 'さくら', pos: '名詞', basic_form: '桜', start_time: 10.0, end_time: 10.5 },
            { surface: 'の', reading: 'の', pos: '助詞', basic_form: 'の', start_time: 10.5, end_time: 10.7 },
            { surface: '花びら', reading: 'はなびら', pos: '名詞', basic_form: '花びら', start_time: 10.7, end_time: 11.5 },
          ],
          translations: {
            en: 'Cherry blossom petals',
            zh: '樱花花瓣',
          },
        },
        // ... 更多歌词
      ],
    },
    // ... 更多歌曲
  ];
};

export const useSongs = () => {
  return useQuery({
    queryKey: ['songs'],
    queryFn: fetchSongs,
  });
};

export const useSong = (id: string) => {
  return useQuery({
    queryKey: ['song', id],
    queryFn: async () => {
      const songs = await fetchSongs();
      return songs.find(song => song.id === id);
    },
  });
};