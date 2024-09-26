import { useQuery } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';

import type { Song } from '@/types/lyrics';

const fetchSongs = async (): Promise<Song[]> => {
  const songsDir = `${FileSystem.documentDirectory}songs/`;
  try {
    // 检查目录是否存在
    const dirInfo = await FileSystem.getInfoAsync(songsDir);
    if (!dirInfo.exists) {
      // 如果目录不存在，创建它
      await FileSystem.makeDirectoryAsync(songsDir, { intermediates: true });
      return []; // 返回空数组，因为新目录中没有歌曲
    }
    const files = await FileSystem.readDirectoryAsync(songsDir);
    const songs = await Promise.all(
      files.map(async (file) => {
        const content = await FileSystem.readAsStringAsync(`${songsDir}${file}`);
        return JSON.parse(content) as Song;
      })
    );
    return songs;
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
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
    staleTime: 0,
  });
};