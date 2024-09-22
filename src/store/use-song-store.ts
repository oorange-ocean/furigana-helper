import * as FileSystem from 'expo-file-system';
import TrackPlayer from 'react-native-track-player';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow'

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
  updateCurrentSong: (updatedSong: Song) => void;
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
  setIsOptionsModalVisible: (isVisible) => {
    console.log('setIsOptionsModalVisible 开始执行');
    const startTime = performance.now();
    set({ isOptionsModalVisible: isVisible });
    console.log(`setIsOptionsModalVisible 执行完成，耗时: ${performance.now() - startTime} ms`);
  },
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
        progressUpdateEventInterval: 100,
      });
      set({ errorMessage: null });
    } catch (error) {
      console.error('加载音频时出错:', error);
      set({ errorMessage: '无法加载音频，请稍后重试' });
    }
  },
  updateCurrentSong: async (updatedSong: Song) => {
    const updatedSongList = get().songList.map(song => 
      song.id === updatedSong.id ? updatedSong : song
    );
    await saveSongList(updatedSongList);
    set({
      currentSong: updatedSong,
      songList: updatedSongList,
    });
  },
}));

export const useCurrentSong = () => useSongStore(state => state.currentSong);
export const useIsPlaying = () => useSongStore(state => state.isPlaying);
export const useIsLiked = () => useSongStore(state => state.isLiked);
export const useIsOptionsModalVisible = () => useSongStore(state => state.isOptionsModalVisible);
export const useSongList = () => useSongStore(useShallow(state => state.songList));
export const useErrorMessage = () => useSongStore(state => state.errorMessage);

// 单独的动作 hooks
export const useAddSong = () => useSongStore(state => state.addSong);
export const useSetSongList = () => useSongStore(state => state.setSongList);
export const useSetCurrentSong = () => useSongStore(state => state.setCurrentSong);
export const useSetIsPlaying = () => useSongStore(state => state.setIsPlaying);
export const useSetIsLiked = () => useSongStore(state => state.setIsLiked);
export const useUpdateLyricsDelay = () => useSongStore(state => state.updateLyricsDelay);
export const useSetIsOptionsModalVisible = () => useSongStore(state => state.setIsOptionsModalVisible);
export const useLoadSongList = () => useSongStore(state => state.loadSongList);
export const usePlayPause = () => useSongStore(state => state.playPause);
export const useLoadAudio = () => useSongStore(state => state.loadAudio);
export const useUpdateCurrentSong = () => useSongStore(state => state.updateCurrentSong);

export const useSongActions = () => useSongStore(
  useShallow(state => ({
    addSong: state.addSong,
    setSongList: state.setSongList,
    setCurrentSong: state.setCurrentSong,
    setIsPlaying: state.setIsPlaying,
    setIsLiked: state.setIsLiked,
    updateLyricsDelay: state.updateLyricsDelay,
    setIsOptionsModalVisible: state.setIsOptionsModalVisible,
    loadSongList: state.loadSongList,
    playPause: state.playPause,
    loadAudio: state.loadAudio,
    updateCurrentSong: state.updateCurrentSong,
  }))
);

// 如果需要多个动作，可以使用 shallow 比较
export const useSongListActions = () => useSongStore(
  useShallow(
  state => ({
    loadSongList: state.loadSongList,
    setSongList: state.setSongList,
  })
)
);

// 在应用启动时加载歌曲列表
useSongStore.getState().loadSongList();