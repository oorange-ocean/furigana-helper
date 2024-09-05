import { useQuery } from '@tanstack/react-query';

import type { Song } from '@/types/lyrics';

// 模拟 API 调用
const fetchSongs = async (): Promise<Song[]> => {
  // 这里应该是实际的 API 调用
  return [
    {
      id: '1',
      title: 'さくら',
      artist: '森山直太朗',
      audioUrl: 'https://example.com/sakura.mp3',
      lyrics: [
        {
          timestamp: '00:00:10',
          text: '桜の花びら',
          ruby: 'さくらのはなびら',
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