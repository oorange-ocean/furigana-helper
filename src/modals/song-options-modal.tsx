import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { LyricLatencyControl } from '@/components/song-detail/lyric-latency-control';
import { useCurrentSong, useIsOptionsModalVisible, useSetIsOptionsModalVisible } from '@/store/use-song-store';
import { Text } from '@/ui/text';

export function SongOptionsModal() {
  const currentSong = useCurrentSong();
  const isOptionsModalVisible = useIsOptionsModalVisible();
  const setIsOptionsModalVisible = useSetIsOptionsModalVisible();
  const renderStartTime = useRef<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleClose = useCallback(() => {
    setIsOptionsModalVisible(false);
  }, [setIsOptionsModalVisible]);

  const animateModal = useCallback((toValue: number, callback?: () => void) => {
    Animated.timing(fadeAnim, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start(callback);
  }, [fadeAnim]);

  useEffect(() => {
    const start = performance.now();

    if (isOptionsModalVisible) {
      renderStartTime.current = start;
      animateModal(1);
    } else {
      animateModal(0, () => {
        if (renderStartTime.current !== null) {
          renderStartTime.current = null;
        }
      });
    }
  }, [isOptionsModalVisible, animateModal]);

  const modalContent = useMemo(() => (
    <View style={styles.modalContent}>
      <Text style={styles.title}>歌曲选项</Text>
      <Text style={styles.subtitle}>歌词延迟调整</Text>
      <LyricLatencyControl />
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={handleClose}
      >
        <Text style={styles.closeButtonText}>关闭</Text>
      </TouchableOpacity>
    </View>
  ), [handleClose]);

  if (!currentSong) return null;

  return (
    <Modal
      visible={isOptionsModalVisible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        {modalContent}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#4B5563',
    fontSize: 16,
  },
});