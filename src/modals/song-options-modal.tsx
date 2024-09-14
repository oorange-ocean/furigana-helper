import React, { useEffect } from 'react';
import { View } from 'react-native';

import { LyricLatencyControl } from '@/components/song-detail/lyric-latency-control';
import { useSongStore } from '@/store/use-song-store';
import { Modal, useModal } from '@/ui';
import { Text } from '@/ui/text';

export function SongOptionsModal() {
  const { currentSong, isOptionsModalVisible, setIsOptionsModalVisible } = useSongStore();
  const modal = useModal();

  useEffect(() => {
    if (isOptionsModalVisible) {
      modal.present();
    } else {
      modal.dismiss();
    }
  }, [isOptionsModalVisible, modal]);

  if (!currentSong) return null;

  return (
    <Modal 
      ref={modal.ref}
      snapPoints={['50%']} 
      title="歌曲选项"
      onDismiss={() => setIsOptionsModalVisible(false)}
    >
      <View className="p-4">
        <Text className="mb-4 text-lg font-bold">歌词延迟调整</Text>
        <LyricLatencyControl />
      </View>
    </Modal>
  );
}