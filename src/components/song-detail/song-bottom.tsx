import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AutoScrollControl } from './auto-scroll-control';
import PlayControl from './play-control';
import { SongProgressBar } from './progress-bar';
interface SongBottomProps {
    isAutoScrollEnabled: boolean;
    toggleAutoScroll: () => void;
}

export function SongBottom({ isAutoScrollEnabled, toggleAutoScroll }: SongBottomProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SongProgressBar />
        <View style={styles.controlsRow}>
          {/* <SingleLineRepeat size={20} /> */}
          <AutoScrollControl
            size={24}
            isAutoScrollEnabled={isAutoScrollEnabled}
            toggleAutoScroll={toggleAutoScroll}
          />
          <PlayControl size={32} />

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    left: 14,
    right: 14,
    backgroundColor: 'rgba(255, 255, 255, 1)', // 半透明白色背景
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  
});