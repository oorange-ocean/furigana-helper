import { useQuery } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';

import type { Song } from '@/types/lyrics';

const fetchSongs = async (): Promise<Song[]> => {
  const songsDir = `${FileSystem.documentDirectory}songs/`;
  try {
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
  });
};