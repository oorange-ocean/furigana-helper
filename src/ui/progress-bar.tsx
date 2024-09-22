import React, { forwardRef, useCallback,useImperativeHandle } from 'react';
import { type LayoutChangeEvent,View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

type Props = {
  initialProgress?: number;
  className?: string;
  color?: string;
  height?: number;
  thumbSize?: number;
};

export type ProgressBarRef = {
  setProgress: (value: number) => void;
};

export const ProgressBar = forwardRef<ProgressBarRef, Props>(
  ({ initialProgress = 0, className = '', color = '#000', height = 4, thumbSize = 12 }, ref) => {
    const progress = useSharedValue<number>(initialProgress ?? 0);
    const progressBarWidth = useSharedValue<number>(0);

    useImperativeHandle(
      ref,
      () => ({
        setProgress: (value: number) => {
          progress.value = withTiming(value, {
            duration: 250,
            easing: Easing.inOut(Easing.quad),
          });
        },
      }),
      [progress]
    );

    const onLayout = useCallback((event: LayoutChangeEvent) => {
      progressBarWidth.value = event.nativeEvent.layout.width;
    }, []);

    const progressStyle = useAnimatedStyle(() => ({
      width: `${progress.value}%`,
      height,
    }));

    const thumbStyle = useAnimatedStyle(() => {
      const maxTranslation = progressBarWidth.value - thumbSize;
      return {
        transform: [{ translateX: (progress.value / 100) * maxTranslation }],
      };
    });

    return (
      <View className={twMerge(`h-${height} bg-[#EAEAEA]`, className)} onLayout={onLayout}>
        <Animated.View
          style={[progressStyle, { backgroundColor: color }]}
        />
        <Animated.View
          style={[
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: color,
              position: 'absolute',
              top: (height - thumbSize) / 2,
            },
            thumbStyle,
          ]}
        />
      </View>
    );
  }
);