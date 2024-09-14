import * as FileSystem from 'expo-file-system';
import TrackPlayer from 'react-native-track-player';
import { create } from 'zustand';

import type { Song } from '@/types/lyrics';

interface SongState {
  currentSong: Song | null;
  isPlaying: boolean;
  isLiked: boolean;
  isOptionsModalVisible: boolean;
  songList: Song[];
  errorMessage: string | null;
  addSong: (song: Song) => Promise<void>;
  setSongList: (songs: Song[]) => Promise<void>;
  setCurrentSong: (song: Song) => Promise<void>;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLiked: (isLiked: boolean) => void;
  updateLyricsDelay: (delay: number) => Promise<void>;
  setIsOptionsModalVisible: (isVisible: boolean) => void;
  loadSongList: () => Promise<void>;
  playPause: () => Promise<void>;
  loadAudio: (song: Song) => Promise<void>;
}

const SONG_LIST_FILE = `${FileSystem.documentDirectory}songList.json`;

const saveSongList = async (songList: Song[]) => {
  try {
    await FileSystem.writeAsStringAsync(SONG_LIST_FILE, JSON.stringify(songList));
  } catch (error) {
    console.error('保存歌曲列表时出错:', error);
  }
};

export const useSongStore = create<SongState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  isLiked: false,
  isOptionsModalVisible: false,
  songList: [],
  errorMessage: null,
  addSong: async (song) => {
    const newSongList = [...get().songList, song];
    await saveSongList(newSongList);
    set({ songList: newSongList });
  },
  setSongList: async (songs) => {
    await saveSongList(songs);
    set({ songList: songs });
  },
  setCurrentSong: async (song) => {
    set({ currentSong: song });
    await get().loadAudio(song);
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsLiked: (isLiked) => set({ isLiked }),
  updateLyricsDelay: async (delay) => {
    const { songList, currentSong } = get();
    if (currentSong) {
      const updatedSongList = songList.map(song =>
        song.id === currentSong.id ? { ...song, lyricsDelay: delay } : song
      );
      await saveSongList(updatedSongList);
      set({
        songList: updatedSongList,
        currentSong: { ...currentSong, lyricsDelay: delay },
      });
    }
  },
  setIsOptionsModalVisible: (isVisible) => set({ isOptionsModalVisible: isVisible }),
  loadSongList: async () => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(SONG_LIST_FILE);
      const songList = JSON.parse(fileContent) as Song[];
      set({ songList });
    } catch (error) {
      console.error('加载歌曲列表时出错:', error);
      set({ songList: [] });
    }
  },
  playPause: async () => {
    const { isPlaying } = get();
    if (isPlaying) {
      await TrackPlayer.pause();
      set({ isPlaying: false });
    } else {
      await TrackPlayer.play();
      set({ isPlaying: true });
    }
  },
  loadAudio: async (song) => {
    if (!song) {
      console.error('无法加载音频：歌曲数据不存在');
      set({ errorMessage: '无法加载音频：歌曲数据不存在' });
      return;
    }
  
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: song.id,
        url: song.audioUri,
        title: song.title,
        artist: song.artist,
      });

      await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 500,
      });
      set({ errorMessage: null });
    } catch (error) {
      console.error('加载音频时出错:', error);
      set({ errorMessage: '无法加载音频，请稍后重试' });
    }
  },
}));

// 在应用启动时加载歌曲列表
useSongStore.getState().loadSongList();