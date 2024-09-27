import { useQuery } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system';

import type { Lyric, Song } from '@/types/lyrics';

const SONGS_DIR = `${FileSystem.documentDirectory}songs/`;

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
export const saveSong = async (song: Song): Promise<void> => {
  const songFile = `${SONGS_DIR}${song.id}.json`;
  try {
    await FileSystem.makeDirectoryAsync(SONGS_DIR, { intermediates: true });
    await FileSystem.writeAsStringAsync(songFile, JSON.stringify(song));
  } catch (error) {
    console.error('Error saving song:', error);
    throw error;
  }
};

export const updateLyric = async (songId: string, lyricIndex: number, updatedLyric: Lyric): Promise<Song> => {
  try {
    const songFile = `${SONGS_DIR}${songId}.json`;
    const songContent = await FileSystem.readAsStringAsync(songFile);
    const song: Song = JSON.parse(songContent);

    const updatedLyrics = [...song.lyrics];
    updatedLyrics[lyricIndex] = updatedLyric;

    const updatedSong = { ...song, lyrics: updatedLyrics };
    await saveSong(updatedSong);
    return updatedSong;
  } catch (error) {
    console.error('Error updating lyric:', error);
    throw error;
  }
};