import Feather from '@expo/vector-icons/Feather';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Image, TouchableOpacity, View } from 'react-native';

import { ImageModal } from '@/modals/image-modal';
import {
  useCurrentSong,
  useIsLiked,
  useSetIsLiked,
  useSetIsOptionsModalVisible,
  useUpdateCurrentSong} from '@/store/use-song-store';
import { Text } from '@/ui';
import { Heart } from '@/ui/icons';

export function SongHeader() {
  const currentSong = useCurrentSong();
  const isLiked = useIsLiked();
  const setIsLiked = useSetIsLiked();
  const updateCurrentSong = useUpdateCurrentSong();
  const setIsOptionsModalVisible = useSetIsOptionsModalVisible();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleOptionsPress = useCallback(() => {
    console.log('Options button pressed');
    const startTime = performance.now();

    // 立即改变图标颜色
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // 使用 requestAnimationFrame 确保在下一帧执行状态更新
    requestAnimationFrame(() => {
      const beforeSetState = performance.now();
      setIsOptionsModalVisible(true);
      const afterSetState = performance.now();
      console.log(`setIsOptionsModalVisible 实际执行耗时: ${afterSetState - beforeSetState} ms`);
      console.log(`setIsOptionsModalVisible 总耗时: ${afterSetState - startTime} ms`);
    
      // 动画结束后恢复图标颜色
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim, setIsOptionsModalVisible]);

  const handleImagePress = useCallback(() => {
    setIsImageModalVisible(true);
  }, []);

  const handleImageUpdate = useCallback(async (newUri: string) => {
    if (currentSong) {
      await updateCurrentSong({ ...currentSong, coverUri: newUri });
    }
  }, [currentSong, updateCurrentSong]);

  const toggleLike = useCallback(() => {
    setIsLiked(!isLiked);
  }, [isLiked, setIsLiked]);

  if (!currentSong) return null;

  return (
    <View className="flex-row items-center p-4">
      <TouchableOpacity onPress={handleImagePress}>
        <Image 
          source={{ uri: currentSong.coverUri }} 
          className="mr-4 h-16 w-16 rounded-lg"
        />
      </TouchableOpacity>
      <View className="flex-1">
        <Text className="text-lg font-bold">{currentSong.title}</Text>
        <Text className="text-sm text-gray-600">{currentSong.artist}</Text>
      </View>
      <TouchableOpacity onPress={toggleLike} className="mr-4">
        <Heart 
          color={isLiked ? '#FF4081' : '#9E9E9E'} 
          fill={isLiked ? '#FF4081' : 'none'}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleOptionsPress}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Feather name="more-vertical" size={24} color="#9E9E9E" />
        </Animated.View>
      </TouchableOpacity>
      <ImageModal
        isVisible={isImageModalVisible}
        imageUri={currentSong.coverUri}
        onClose={() => setIsImageModalVisible(false)}
        onImageUpdate={handleImageUpdate}
      />
    </View>
  );
}